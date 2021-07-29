<?php 
 $inUsername = $_POST["uname"]; 
 $inPassword = $_POST["psw"];
 
 if(strlen($inUsername) > 20)
 {
     echo("NO");
 } else if(strlen($inPassword) > 20) {

 }
?>