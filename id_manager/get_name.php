<?php
  header("Content-Type: application/json");
  $id = $_GET['id'];
  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("SELECT name FROM user WHERE id = '" . $id . "'");
  $name = "na";
  if (mysqli_num_rows($result) != 0) {
    $row = $result->fetch_assoc();
    $name = $row['name'];
  }
  $myObj = new stdClass();
  $myObj->name = $name;
  $myJSON = json_encode($myObj);
  echo $myJSON;
?>