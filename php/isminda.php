<?php
/*****************************************\
**              IS ADMIN ?              **
\*****************************************/
if(!empty($_POST['usr']) && !empty($_POST['pwd'])){
  require_once("dbconnect.php");

  $st = $db->prepare('SELECT salt FROM admin WHERE user=:usr;');
  $st->bindParam(':usr', $_POST['usr'], PDO::PARAM_STR);
  $st->execute();

  $salt = $st->fetch(PDO::FETCH_NUM)[0];

  $hash = hash('sha512', $salt.$_POST['pwd']);
  $st = $db->prepare('SELECT COUNT(ID) FROM admin WHERE user=:usr && passwordHash=:hash;');
  $st->bindParam(':usr', $_POST['usr'], PDO::PARAM_STR);
  $st->bindParam(':hash', $hash, PDO::PARAM_STR);
  $st->execute();

  $count = $st->fetch(PDO::FETCH_NUM)[0];

  if($count == 1){
    $result = true;

    require_once('destroy_ses.php');
    session_start();
    $_SESSION['ID'] = session_id();
    $_SESSION['ADMIN'] = true;
  }else{
    $result = false;
  }

  unset($db);
  $db = null;

  echo json_encode($result);
}
?>
