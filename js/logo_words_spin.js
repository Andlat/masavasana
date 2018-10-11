$(document).ready(function(){
  let phase = 0;
  $('#logo_words').on("animationend webkitAnimationEnd oAnimationEnd otransitionend MSAnimationEnd mozAnimationEnd",function(){
    phase =	++phase % 4;
    switch(phase){
    case 0:
      $('#logo_words').removeClass('spin4');
      $('#logo_words').addClass('spin1');
      break;
    case 1:
      $('#logo_words').removeClass('spin1');
      $('#logo_words').addClass('spin2');
      break;
    case 2:
      $('#logo_words').removeClass('spin2');
      $('#logo_words').addClass('spin3');
      break;
    case 3:
      $('#logo_words').removeClass('spin3');
      $('#logo_words').addClass('spin4');
      break;
    }
  });
});
