"use strict";
let pathName = window.location.pathname;
console.log(pathName);
if(pathName.indexOf('photo')!==-1){
  $("#photo").addClass("active");
}else if(pathName.indexOf('story')!==-1){
  $("#story").addClass("active");
}else if(pathName==="/"){
  $("#index").addClass("active");
}else{
  $("#index").addClass("active");
}

/*if(pathName==="/"){
  $("body").addClass("bg-white");
}else{
  $("body").addClass("bg-grey");
}*/

