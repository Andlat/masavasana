<?php
require_once('checksession.php');
$success = false;

if(checkSession()){
  if(!empty($_POST['html'])){
    require_once('file_vars.php');

    $html = '<!DOCTYPE html>' . PHP_EOL . '<html>' . PHP_EOL . $_POST['html'] . PHP_EOL . '</html>';
    if(file_put_contents($root_dir.'index.html', $html))
      $success = true;
  }
}
echo json_encode($success);
?>
