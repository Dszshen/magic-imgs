"use strict";
var pathName = window.location.pathname;
console.log(pathName);
if(pathName.indexOf('photo')!==-1){
  $(".nav-photo").addClass("active");
}else if(pathName.indexOf('story')!==-1){
  $(".nav-story").addClass("active");
}else if(pathName.indexOf('invitation')!==-1){
  $(".nav-invitation").addClass("active");
}else if(pathName==="/"){
  $(".nav-index").addClass("active");
}else{
  $(".nav-index").addClass("active");
}

/*if(pathName==="/"){
  $("body").addClass("bg-white");
}else{
  $("body").addClass("bg-grey");
}*/

document.documentElement.scrollTop = 0;

window.onload = function(){
  var obtn = document.getElementById('topBtn');  //获取回到顶部按钮的ID
  var clientHeight = document.documentElement.clientHeight;   //获取可视区域的高度
  var timer = null; //定义一个定时器
  var isTop = true; //定义一个布尔值，用于判断是否到达顶部

  window.onscroll = function(){         //滚动条滚动事件

    //获取滚动条的滚动高度
    var osTop = document.documentElement.scrollTop || document.body.scrollTop;

    if(osTop >= clientHeight){  //如果滚动高度大于可视区域高度，则显示回到顶部按钮
      obtn.style.display = 'block';
    }else{         //否则隐藏
      obtn.style.display = 'none';
    }

    //主要用于判断当 点击回到顶部按钮后 滚动条在回滚过程中，若手动滚动滚动条，则清除定时器
    if(!isTop){

      clearInterval(timer);
    }
    isTop = false;

  };

  obtn.onclick = function(){    //回到顶部按钮点击事件
    //设置一个定时器
    timer = setInterval(function(){
      //获取滚动条的滚动高度
      var osTop = document.documentElement.scrollTop || document.body.scrollTop;
      //用于设置速度差，产生缓动的效果
      var speed = Math.floor(-osTop / 6);
      document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
      isTop =true;  //用于阻止滚动事件清除定时器
      if(osTop == 0){
        clearInterval(timer);
      }
    },30);
  }
};

//图片懒加载设置
$("img.img-lazy-load").lazyload({
  placeholder : "/assets/images/loading.gif", //用图片提前占位
  // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
  effect: "fadeIn", // 载入使用何种效果
  // effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
  threshold: 200, // 提前开始加载
  // threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉
  //event: 'click',  // 事件触发时才加载
  // event,值有click(点击),mouseover(鼠标划过),sporty(运动的),foobar(…).可以实现鼠标莫过或点击图片才开始加载,后两个值未测试…
  //container: $("#container"),  // 对某容器中的图片实现效果
  // container,值为某容器.lazyload默认在拉动浏览器滚动条时生效,这个参数可以让你在拉动某DIV的滚动条时依次加载其中的图片
  failurelimit : 10 // 图片排序混乱时
  // failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.
});


