var gulp = require('gulp');
var eslint = require('gulp-eslint');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('gulp-watchify');
var browserSync = require('browser-sync').create();
var cached = require('gulp-cached');
var less = require('gulp-less');
var jade = require('gulp-jade');
var csso = require('gulp-csso');
var plumber = require('gulp-plumber');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var babelify = require('babelify');
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var fe = require('gulp-foreach');
var path = require('path');
var replace = require('gulp-replace'); //inject string into file
var collapse = require('bundle-collapser/plugin'); //reduce module path string;
var del = require('del');
var seq = require('gulp-sequence');
var proxyMiddleware = require('http-proxy-middleware');
var rename = require('gulp-rename');
var chinese2unicode = require('fd-gulp-chinese2unicode');

var SERVER_PROXY = 'http://183.230.40.87:8001/';

var TMP_FOLDER = './tmp/';

var SERVER_PORT = 8555;

var APP = '';

var FOLDER = TMP_FOLDER;
var TYPE = 'DEV';
var JS = ['./src/js/**/*.js'];
var CSSDIR = ['./src/style/**/*.less'];
var VIEWS = ['./src/views/**/*.jade'];
var IMAGES = ['./src/images/**/*'];
var MUSIC = ['./src/music/**/*'];
var PLUGINS = ['./src/plugins/**/*'];


var proxy = proxyMiddleware('/portal', {
  target: SERVER_PROXY,
  changeOrigin: true
});

var config = {
  watch: true,
  cache: {},
  packageCache: {},
  setup: function (bundle) {
    bundle.transform('bulkify');
    bundle.transform(babelify, {presets: ['es2015']});
    bundle.transform(babelify);
  }
};

//代码检查
gulp.task('lint', function () {
  return gulp.src(JS).pipe(eslint()).pipe(eslint.format());
});

gulp.task('clear', function () {
  del.sync([FOLDER]);
});

gulp.task('bundle', watchify(function (wf) {
  if (TYPE === 'DEV') LOGSERVER = '';
  return gulp.src(JS)
      .pipe(plumber())
      .pipe(wf(config))
      .on('success', function (ddd) {
        console.log("server---success" + ddd);
      })
      .on('error', function (error) {
        console.dir(error);
        this.emit('close');
        this.emit('end');
      })
      .pipe(buffer()) //fixed browserify update too early.
      .pipe(plumber())
      .pipe(gulpif(TYPE === 'DEPLOY', sourcemaps.init()))
      .pipe(gulpif(TYPE === 'DEPLOY', uglify()))
      //.pipe(gulpif(TYPE == 'DEPLOY', uglify()))
      .pipe(gulpif(TYPE === 'DEPLOY', sourcemaps.write('./')))
      .pipe(gulp.dest(FOLDER + 'assets/js'));
}));

gulp.task('compile-lib', function () {
  var libs = require('./package.json').dependencies;
  libs = Object.keys(libs).map(function (module, i) {
    return gulp.src(['./node_modules/' + module + '/**/*']).pipe(gulp.dest(FOLDER + 'libs/' + module + '/'));
  });
});

gulp.task('compile-libs', function () {
  return gulp.src(['libs/**/*'])
      .pipe(gulp.dest(FOLDER + 'libs'));
});

gulp.task('compile-views', function () {
  var config = (TYPE === 'DEV') ? {time: ''} : {time: '?v=' + new Date().getTime()};
  config.type = TYPE;
  return gulp.src(VIEWS)
      .pipe(cached('debug', {optimizeMemory: true}))
      .pipe(jade({locals: config}))
      .on('error', function (error) {
        console.dir(error);
        this.emit('end');
      })
      .pipe(gulp.dest(FOLDER));
});

gulp.task('compile-style', function () {
  gulp.src(CSSDIR, {base: 'src/style'})
      .pipe(less())
      .on('error', function (error) {
        console.dir(error);
        this.emit('end');
      })
      .pipe(prefixer())
      .pipe(gulp.dest(FOLDER + 'assets/style'));

});

gulp.task('compile-image', function () {
  return gulp.src(IMAGES, {base: 'src/images'})
      .pipe(cached('debug', {optimizeMemory: true}))
      .pipe(gulp.dest(FOLDER+'assets/images'));
});

gulp.task('compile-music', function () {
  return gulp.src(MUSIC, {base: 'src/music'})
      .pipe(cached('debug', {optimizeMemory: true}))
      .pipe(gulp.dest(FOLDER+'assets/music'));
});

gulp.task('compile-plugins', function () {
  return gulp.src(PLUGINS, {base: 'src/plugins'})
      .pipe(cached('debug', {optimizeMemory: true}))
      .pipe(gulp.dest(FOLDER+'assets/libs'));
});

gulp.task('watch', function () {
  gulp.watch(VIEWS, ['compile-views']);
  gulp.watch(JS, ['bundle']);
  gulp.watch(CSSDIR, ['compile-style']);
  gulp.watch(IMAGES, ['compile-image']);
  gulp.watch(PLUGINS, ['compile-plugins']);
  gulp.watch(MUSIC, ['compile-music']);
  //----------------------------------
  gulp.watch(FOLDER + '/**/*', {read: false}).on('change', function (event) {
    browserSync.reload();
  });
});

//mock----------'mock-compile-api'任务----
gulp.task('default', ['bundle', 'compile-views', 'compile-lib', 'compile-libs', 'compile-style', 'compile-image','compile-music', 'compile-plugins']);

gulp.task('dev', ['default'], function () {
  console.log('##Starting Server.......');
  browserSync.init({
    port: SERVER_PORT,
    ghostMode: false,
    notify: false,
    server: FOLDER,
    open: true
    //middleware: [proxy]
  }, function () {
    //gulp.run('watch');
    gulp.watch(VIEWS, ['compile-views']);
    gulp.watch(JS, ['bundle']);
    gulp.watch(CSSDIR, ['compile-style']);
    gulp.watch(IMAGES, ['compile-image']);
    gulp.watch(MUSIC, ['compile-music']);
    gulp.watch(PLUGINS, ['compile-plugins']);
    gulp.watch(FOLDER + '/**/*', {read: false}).on('change', function (event) {
      browserSync.reload();
    });
  });
});

gulp.task('server', seq('clear', 'dev'));


gulp.task('deploy', ['clear'], function () {
  FOLDER = DEPLOY_FOLDER;
  TYPE = 'DEPLOY';
  SERVER = '';
  config = {
    watch: false,
    cache: {},
    packageCache: {},
    setup: function (bundle) {
      bundle.transform('bulkify');
      bundle.transform(babelify, {presets: ['es2015']});
      bundle.plugin(collapse);
    }
  };
  gulp.start('default');
});

gulp.task('deve', ['default'], function () {
  console.log('##Starting Server.......');
  browserSync.init({
    port: SERVER_PORT,
    ghostMode: false,
    notify: false,
    server: FOLDER,
    open: true,
    middleware: [proxy]
  }, function () {

  });
});

gulp.task('start', seq('clear', 'deve'));
