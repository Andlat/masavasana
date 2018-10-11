$(document).ready(function(){
  let length = ("masavasana").length;
  let c = 0;
  var val = setInterval(function(){
    if(c >= title.length)
      clearInterval(val);
    else
      $('#t' + c++).animate({opacity: 1}, 1000);
  }, 150);
});
