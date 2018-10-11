$(document).ready(function(){
  $('.video_background_sound').on('click', function(){
    if($(this).attr('meta-sound') === 'off'){
      //Turn on
      $(this).prev('video').prop('muted', false);
      $(this).attr('meta-sound', 'on');
      $(this).attr('src', 'assets/sound_on.png');
    }else{
      //Turn off
      $(this).prev('video').prop('muted', true);
      $(this).attr('meta-sound', 'off');
      $(this).attr('src', 'assets/sound_off.png');
    }
  });
});
