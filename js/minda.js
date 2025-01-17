//TODO Scroll to added element
//TODO CHECKED Modal to ask if certain to delete element or section
//TODO CHECKED When SAVE is clicked, verify if PHP session is still valid (in case someone finds out this js file's name and loads it to mess with the website)

/*****************************************\
 **  ONLY LOAD THIS SCRIPT IF IS ADMIN  **
\*****************************************/

$(document).ready(function(){
  Dropzone.autoDiscover = false;

  addAdminTools();

  setSelectSection();

  setDeleteSection();
  setAddSection();

  setDeleteElmnt();

  setAddTitle();
  setAddText();
  setMediaUpload();

  setAllEditable();
  setKeycodes();

  setSave();
});

window.nxtID = 0;
window.idPrefix = "ce";
function getNxtID(){  return window.idPrefix + window.nxtID++;  }

window.cssSectionSelected = {'border': '3px solid LightBlue', 'background-color': 'rgba(170, 216, 229, 0.1)'};
window.cssUnselect = {'border': 'none','background-color': 'inherit'};
window.cssSelectedForDelete = {'border': '3px solid red', 'background-color': 'rgba(255, 0, 0, 0.1)'};
window.cssDelButtonForDelete = {'border-color':'LightBlue', 'background-color': 'rgba(173, 216, 230, 0.2)'};
window.cssDelButtonFinished = {'border-color':'red', 'background-color': 'rgba(255, 0, 0, 0.2)'};


/** Set select section **/
function setSelectSection(){
  setOnSelectSection($(".section"));
}
function setOnSelectSection(sections){
  sections.css('cursor', 'pointer');
  sections.on('click', function(){
    if(!window.delete){
      if(typeof window.selected !== 'undefined'){
        $(window.selected).css(window.cssUnselect);
      }

      $(this).css(window.cssSectionSelected);
      window.selected = this;
    }
  });
}
/**********************/

/** Set delete element **/
function setDeleteElmnt(){
  $("#deleteElmntButton").on('click', function(){
    if(typeof window.selected !== "undefined"){
      if(!window.delete){
        $(window.selected).css(window.cssSelectedForDelete);
        $(this).text("Finish").css(window.cssDelButtonForDelete);
        window.delete = true;
      }else{
        $(window.selected).css(window.cssSectionSelected);
        $(this).text("Delete Element").css(window.cssDelButtonFinished);
        window.delete = false;
      }
    }
  });

  setCanDelete($(".section").children());
};

function setCanDelete(elmnt){
  elmnt.on('click', function(){
    if(window.delete){//If the delete element button is clicked
      let elmnt = $(this);
      if(elmnt.parent().get(0) === window.selected){//Only permit deletion of elements inside the selected section
        showModal("Are you sure you want to delete this element ?", function(rsp){
          if(rsp){
            elmnt.remove();
          }
        });
      }
    }
  });
}
/**********************/

/** Set delete section **/
function setDeleteSection(){
  $("#deleteButton").on('click', function(){
    if(typeof window.selected !== "undefined"){
      showModal("Are you sure you want to delete the selected section ?", function(rsp){
        if(rsp){
          $(window.selected).remove();

          if(window.delete) $("#deleteElmntButton").click();//If deleting elements, stop the process before deleting the section
          window.selected = undefined;
        }
      });
    }
  });
};
/**********************/

/** Set to stop editing when element is blurred **/
function setOnBlur(element){
  element.on('blur', function(){
    $(window.editing).prop("contenteditable", false);
    window.editing = undefined;

    $(this).off('blur');

    $('#finish_edit').hide();//Hide the "Finish Edit" button. Used to blur the edited element.
  });
}
/**********************/

/** Edit element when clicked on **/
function setAllEditable(){
  $(".section").children('h3, p').each(function(){
    setupEditing($(this));
  });
}
/**********************/

/** Set finish editing with escape and confirm modal with enter key**/
function setKeycodes(){
  $(document).keyup(function(e) {
    // escape key maps to keycode `27`
    if (e.keyCode == 27) {
      if(typeof window.editing !== 'undefined')
        $(window.editing).blur();

      //Also close the modal with escape if necessary
      if(window.modalOpen)
        $('#modal_cancel').click();
    }else if(e.keyCode == 13){//Enter keycode 13
      if(window.modalOpen)
        $('#modal_confirm').click();
    }
  });
}
/**********************/

/** Set the currently edited element, focus on it and add the onblur listener **/
function setupEditing(elmnt){
  elmnt.on('click', function(){
    if(window.delete != true){
      if($(this).prop('contenteditable') != true){
        window.editing = this;
        $(this).prop('contenteditable', true);
        $(this).focus();
        setOnBlur($(this));

        $('#finish_edit').show();
      }
    }
  });
}
/**********************/

/** Set the add section button **/
function setAddSection(){
  $('#add_section').on('click', function(){
    let main = $('main');
    let sectionsCount = main.children('section').length;
    main.append('<section id="s' + ++sectionsCount + '" class="section">\
    </section>\
    ');

    let newSection = $('#s'+sectionsCount);
    setOnSelectSection(newSection);
    newSection.click();

    //Scroll dpwn the new sections
    $('html, body').animate({
      scrollTop: newSection.offset().top - 50
    }, 500);

  });
}

/**********************/

/** Set add title **/
function setAddTitle(){
  $("#addTitle").on('click', function(){
    if(typeof window.selected !== "undefined" && !window.delete){
      let id = getNxtID();

      $(window.selected).prepend('<h3 id="' + id + '">Title</h3>');

      let newelmnt = $('#'+id);
      setupEditing(newelmnt);
      setCanDelete(newelmnt);

      newelmnt.click();
      newelmnt.select();
    }
  });
};
/**********************/

/** Set add text **/
function setAddText(){
  $("#addText").on('click', function(){
    if(typeof window.selected !== "undefined" && !window.delete){
      let id = getNxtID();

      $(window.selected).append('<p id="' + id + '">Text</p>');

      let newelmnt = $('#'+id);
      setupEditing(newelmnt);
      setCanDelete(newelmnt);

      newelmnt.click();
      newelmnt.select();
    }
  });
}
/**********************/

/** Set upload photo or video **/
type = {
  image: {id:'#image-upload', index:0},
  video: {id:'#video-upload', index:1}
}

function uploadMedia(msg, gtype){
  if(typeof window.selected !== "undefined" && !window.delete){
    $(gtype.id).children('.dz-message').first().text(msg);
    $(gtype.id).show();
    let zone = Dropzone.instances[gtype.index];

    $('#media_input').show();
    showModal('', function(rsp){
      if(zone.files.length > 0){
        let name = zone.files[0].name;//Only 1 file can be uploaded at a time, so the index will always be 0
        let id = getNxtID();

        if(rsp){//Add the newly added file to the section
          let elmnt;

          let width = $('#media_width').val();
          let height = $('#media_height').val();

          //If empty string, set 'auto'
          //If only a number, add 'px' to dimensions for css. If not, it will already have 'px', '%', or 'em'
          if(width.trim()){ if(!isNaN(width)) width += 'px'; }else{ width='auto'; }
          if(height.trim()){ if(!isNaN(height)) height += 'px'; }else{ height='auto'; }

          if(gtype == type.image) elmnt = '<img id="' + id + '" src="media/' + name + '" style="width:' + width + '; height:' + height + ';"/>';
          else if(gtype == type.video) elmnt = '<video id="' + id + '" style="width:' + width + '; height:' + height + ';" controls><source src="media/' + name + '" type="video/mp4"/></video>';

          $(window.selected).append(elmnt);
          setCanDelete($('#'+id));

        }else{//Delete uploaded files from server
          $.post('php/unlink.php', {file: zone.files[0].name});
        }

        zone.removeAllFiles(true);
      }

      $('#media_width').val(null);
      $('#media_height').val(null);
      $('#media_input').hide();

      $(gtype.id).hide();
    });
  }
}

function setMediaUpload(){
  $('#addImg').on('click', function(){
    uploadMedia('Drop picture here or click to upload', type.image);
  });
  $('#addVid').on('click', function(){
    uploadMedia('Drop video here or click to upload', type.video);
  });
}
/* Has to be called in the html file after the dropzones are instantiated */
function setDropZoneOptions(){
  //Create the dropzones
  new Dropzone('#image-upload');
  new Dropzone('#video-upload');

  //Add the attributes
  let common = {uploadMultiple:false, maxFiles: 1};
  Dropzone.options.imageUpload = {acceptedFiles:"image/*"};
  Object.assign(Dropzone.options.imageUpload, common);

  Dropzone.options.videoUpload = {acceptedFiles:"video/mp4"};
  Object.assign(Dropzone.options.videoUpload, common);
}
/**********************/

/** Show the modal and execute the given callback **/
function showModal(msg, callback){
  $('#modal_msg').text(msg);

  $('.modal_button').off('click');//Remove the old callback
  $('.modal_button').on('click', function(){
    let rsp = $(this).attr('meta-rsp') === '1' ? true : false;
    callback(rsp);

    HideModal();
  });

  $('#confirmation_modal').show();
  window.modalOpen = true;
}
/** Hide the confirmation modal **/
function HideModal(){
  $('#confirmation_modal').hide();
  $('.modal_button').off('click');

  window.modalOpen = false;
}
/**********************/

/** Save the document **/
function setSave(){
  $('#save').on('click', function(){
    $.post('php/save.php', {html:getHtml()}, function(success){
      if(!JSON.parse(success))
        alert('Failed to save. Please try again.');
      else
        document.location.reload();
    });
  });
  function getHtml(){
    let doc = $('html');
    doc.find('#add_section').remove();
    doc.find('#finish_edit').remove();
    doc.find('#adminPanel').remove();
    doc.find('#confirmation_modal').remove();
    doc.find('#dropzone_script').remove();
    doc.find('input').remove();//Remove the dropzone inputs

    let html = doc.html();

    html = html.replace(/"logo (spin[0-9]( |"))*?>/, '"logo spin1">');//Check and set the correct class for the spinning logo
    html = html.replace(/style="(?!width|height).*?"/g, '');//remove the inline style tags except for the width/height of pictures
    html = html.replace(/id="ce[0-9]"/g, '');//strip the ids used for the editor
    html = html.replace(/contenteditable="(true|false)"/g, '');//replace all the contenteditable props
    html = html.replace(/(\n| )*<\/body>/, '\n  <\/body>');//strip spaces and newlines before closing body tag. Caused by deleting the admin tools
    html = html.replace(/<style><\/style>/g, '');//delete empty style tags (added when saving. known bug) #PATCH
    html = html.replace(/<link.*dropzone\.css">/, '');//delete the dynamically added style

    return html;
  }
}
/**********************/

function addAdminTools(){
  $('body').append('<button id="add_section" class="adminButton">Add Section</button>\
                    <button id="finish_edit" class="adminButton blueButton">OK</button>\
                    <section id="adminPanel">\
                      <button id="addTitle" class="adminButton panelButton" meta-txt="Title">Title</button>\
                      <button id="addText" class="adminButton panelButton" meta-txt="Text">Text</button>\
                      <button id="addImg" class="adminButton panelButton" meta-txt="Image">Image</button>\
                      <button id="addVid" class="adminButton panelButton" meta-txt="TitVideole">Video</button>\
                      <button id="deleteElmntButton" class="adminButton panelButton deleteButton" meta-txt="Delete Element">Delete Element</button>\
                      <button id="deleteButton" class="adminButton panelButton deleteButton" meta-txt="Delete">Delete</button>\
                      <button id="save" class="adminButton blueButton panelButton">Save</button>\
                    </section>\
                    <div id="confirmation_modal">\
                      <p id="modal_msg">\
                        Placeholder \
                      </p>\
                      <form id="image-upload" enctype="multipart/form-data" action="php/upload.php" class="dropzone media_upload"></form>\
                      <form id="video-upload" enctype="multipart/form-data" action="php/upload.php" class="dropzone media_upload"></form>\
                      <div id="media_input">\
                        <input type="text" id="media_width" class="media_input" placeholder="width"/>\
                        <span>x</span>\
                        <input type="text" id="media_height" class="media_input" placeholder="height"/>\
                      </div>\
                      <div id="modal_confirmation_buttons">\
                        <button id="modal_confirm" class="modal_button adminButton blueButton" meta-rsp="1">Confirm</button>\
                        <button id="modal_cancel" class="modal_button adminButton deleteButton" meta-rsp="0">Cancel</button>\
                      </div>\
                    </div>');


  setDropZoneOptions();
}
