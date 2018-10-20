$(document).ready(()=>{
  const SECTION_MAX_HEIGHT = 400;//Has to be the same max-height as in the css file
  const READ_MORE_HTML = '<div class="read_more">Read More...</div>';

  $('.section').each(function(){
    const jq_section = $(this);

    if(jq_section.height() === SECTION_MAX_HEIGHT){

      //Create the read_more element and set the click event listener to expand the section when clicked
      let read_more_elmnt = $(READ_MORE_HTML);
      read_more_elmnt.on('click', function(){
          $(this).parent('section').css('max-height', 'none');
          $(this).remove();
      });

      //Append the read more element to the overflowing section
      jq_section.append(read_more_elmnt);
    }
  });
});
