function check(){
  $.post('php/jschecksession.php', function(r){
    if(JSON.parse(r)){
        $("<link/>", {rel: "stylesheet", type: "text/css", href: "css/minda.css"}).appendTo("head");
        $("<link/>", {rel: "stylesheet", type: "text/css", href: "https://cdn.quilljs.com/1.3.6/quill.snow.css"}).appendTo("head");
        $("<link/>", {rel: "stylesheet", type: "text/css", href: "css/dropzone.css"}).appendTo("head");

        //Get the scripts synchronously
        $.getScript('https://cdn.quilljs.com/1.3.6/quill.min.js', function(){
          $.getScript('js/dropzone.js', function(){
            $.getScript('js/minda2.js');
          });
        });
    }
  });
}
check();
