<?php
  require('file_vars.php');
  require('checksession.php');

  if(checkSession()){
    echo file_get_contents($quill_dir.'deltas.json');
  }
?>
