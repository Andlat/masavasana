<?php
try{
  $db = new PDO("mysql:host=localhost;dbname=masavasana;", "root", "taldna14", array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
}catch(PDOexception $ex){
  die("Can't reach db: " . $ex);
}
?>
