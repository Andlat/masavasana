<?php
if(!empty($_POST)){
  require_once('file_vars.php');

  $img = $_POST['img'];

  //Get the file type
  preg_match('/(png|jpg|jpeg)/', $img, $type);
  $type = $type[0];

  //isolate data
  $img = preg_replace('/data:image\/(png|jpg|jpeg);base64,/', '', $img);
  $img = str_replace(' ', '+', $img);

  //decode data
  $data = base64_decode($img);

  //Create a unique name for the file
  $name = SHA1($data).'.'.$type;

  //Copy the file. TODO protect against data:url injection
  if(!file_put_contents($media_dir.$name, $data)){
    return json_encode(false);//failure to upload
  }else{
    echo json_encode($media_dir_name.$name);//On success, send the file name
  }
}
?>
