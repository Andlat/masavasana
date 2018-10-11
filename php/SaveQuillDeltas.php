<?php
  require('file_vars.php');
  require('checksession.php');

  if(checkSession()){
    if(!empty($_POST['deltas'])){

      json_decode($_POST['deltas']);//Check if json format is OK.
      if(json_last_error() === JSON_ERROR_NONE){
        echo json_encode(file_put_contents($quill_dir.'deltas.json', $_POST['deltas']) !== FALSE);//Write to file
      }
    }
  }
  echo false;
?>
