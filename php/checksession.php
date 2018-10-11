<?php
function checkSession(){
  session_start();

  if(isset($_SESSION['ID']) && isset($_SESSION['ADMIN'])){
    if(session_id() === $_SESSION['ID'] && $_SESSION['ADMIN']){
      //If session id is ok and is admin var is true, user session is valid.
      return true;
    }
  }
  //By default, destroy session (invalid)
  require_once('destroy_ses.php');
  return false;
}
?>
