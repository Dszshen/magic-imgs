"use strict";
let pathName = window.location.pathname;
console.log(pathName);
if(pathName.indexOf('detail')!==-1){
  $("#detail").addClass("active");
}else if(pathName.indexOf('list')!==-1){
  $("#list").addClass("active");
}else if(pathName.indexOf('about')!==-1){
  $("#about").addClass("active");
}else{
  $("#index").addClass("active");
}

if(pathName==="/"){
  $("body").addClass("bg-white");
}else{
  $("body").addClass("bg-grey");
}

