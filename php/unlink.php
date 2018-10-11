<?php
require_once('checksession.php');
if(checkSession()){
  if(!empty($_POST['file'])){
    require_once('file_vars.php');
    if(!unlink($media_dir.$_POST['file']))
    echo "Failed unlinking " . $_POST['file'];
  }
}
?>
