function explode(str){
  let arr = [];
  for(let i=0; i < str.length; ++i){
    arr.push(str.charAt(i));
  }
  return arr;
}
function collate(str_arr){
  let str = '';
  str_arr.forEach((item)=>{ str += item; });
  return str;
}

window.cQuill = {
  Create: function(id){
    var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      //['blockquote'],
      /*[{ 'list': 'ordered'}, { 'list': 'bullet' }],*/
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      /*[{ 'header': [1, 2, 3, 4, 5, 6, false] }],*/
      [{ 'align': [] }],
      [ /*'link', */'image'/*, 'video' */]
    ];
    let quill = new Quill('#'+id, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      }
    });

    return quill;
  },

  Parse: function(editor){
    let c = editor.getContents().ops;
    let elements = [];
    let style = '';
    let parentStyle = '';
    let _class = '';

    for(let k in c){
      let insert = c[k].insert;
      let attrs = c[k].attributes;

      style = '';
      parentStyle = '';
      _class = '';

      if(typeof insert === 'object'){//Check if is a picture or video or etc.
         if('image' in insert){//Is an image
           insert = '<img src="' + insert['image'] + '"/>';
           _class = 'media_block_cont_quill';
         }
      }else if(insert.match(/^\n/) !== null){//Parse the new line or special content from last line
        for(let g in attrs){
          switch(g){
            case 'indent':
            parentStyle += 'padding-left: ' + 3*attrs[g] + 'em;';
            break;
            case 'align':
            parentStyle += 'text-align: ' + attrs[g] + ';';
            break;
          }
        }
      }else{//Parse the style
        for(let g in attrs){
          switch(g){
            case 'bold':
            style += 'font-weight: bold;';
            break;
            case 'italic':
            style += 'font-style: italic;';
            break;
            case 'underline':
            if(style.match(/text-decoration:/) !== null){//In case strike was already added, only add the underline to text-decoration
              style = style.replace(/text-decoration:/, 'text-decoration: underline');
            }else{
              style += 'text-decoration: underline;';
            }
            break;
            case 'strike':
            if(style.match(/text-decoration:/) !== null){//In case underline was already added, only add the strike to text-decoration
              style = style.replace(/text-decoration:/, 'text-decoration: line-through');
            }else{
              style += 'text-decoration: line-through;';
            }
            break;
            case 'script':
            midtag = (attrs[g] === 'super' ? 'sup' : 'sub');
            insert = '<'+midtag+'>' + insert + '</'+midtag+'>';
            break;
            case 'size':
            let fs;
            switch(attrs[g]){
              case 'small': fs = 0.75;  break;
              case 'normal': fs = 1;  break;
              case 'large': fs = 1.5;  break;
              case 'huge': fs = 2.5;  break;
              default: fs = 1; break;
            }
            style += 'font-size: ' + fs + 'em;';
            break;
          }
        }
      }
      elements.push({style: style, content: insert, parentStyle: parentStyle, _class: _class});
    }
    return elements;
  },
  ConstructHTML: function(parsed){
    let html = '';

    let oP = '<p>';
    let content = '';

    parsed.forEach((item, index, array)=>{
      if(item.content.match(/[A-z]/) !== null){//if contains text
        let cc = '';
        let carr = explode(item.content);
        //replace the content's new lines with break lines except for beginning or end which means a new paragraph
        if(carr[0] === '\n') carr.shift();
        if(carr[carr.length-1] === '\n') carr.pop();

        content += '<span style="' + item.style + '"' + (item._class.trim().length > 0 ? ' class="'+item._class+'"' : '') + '>' + collate(carr).replace(/\n/gm, '<br/>') + '</span>';//Add content to html
      }
      if(item.content.match(/^\n/m) !== null || index===array.length-1){//If MATCHES NEWLINE or is last element
        //Close and open p tags on new lines
        if(item.parentStyle.trim().length > 0){//ParentStyle is always on the new line following the paragraph
          oP = '<p style="' + item.parentStyle + '">';//add parent style if needed
        }

        html += oP + content + '</p>';//Add paragraph to html

        //Add needed new lines when the insert from quill is only new lines (ignore the first one, since it means a new paragraph)
        if(item.content.trim().length === 0){
          const nlc = item.content.split('\n').length - 2;
          for(let i=0; i < nlc; ++i)  html += '<br/>';
        }

        //Reset the next paragraph
        if(index != array.length-1){//Quill deltas always end with a new line, but we don't want it
          oP = '<p>';//Open new p
          content = '';//clear content
        }
      }
    });
    return html;
  },

  /******************************************************\
  ** Has to be called before erasing the quill editor **
  \******************************************************/
  Remember: function(index, editor){
    if(typeof window.quill_content === 'undefined')
    window.quill_content = [];

    window.quill_content[index] = editor.getContents().ops;
  },
  Feed: function(index, editor){
    try{
      if(typeof window.quill_content[index] !== 'undefined')
        editor.setContents(window.quill_content[index]);
    }catch(e){
      //ignore. Undefined index possible in the condition
    }
  },

  getContentArray: function(){
    if(typeof window.quill_content === 'undefined'){

    }
    return window.quill_content;
  },

  fetchDeltasFromServer: function(callback){
    $.post('php/FetchQuillDeltas.php', null, function(result){
      try{
        result = JSON.parse(result);

        if(result !== "false")
          window.quill_content = result;

      }catch(err){
        console.error("Wrong delta format from server; " + err);
      }

      if(typeof callback !== 'undefined')
        callback(result);
    });
  },
  writeDeltasToServer: function(content, callback){
    $.post('php/SaveQuillDeltas.php', {'deltas': JSON.stringify(content)}, (result)=>{
      try{
        if(typeof callback !== 'undefined')
          callback(result)
      }catch(err){
        console.err(err);
      }
    });
  }
}
