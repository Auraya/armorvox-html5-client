<?php
  header("Content-Type: application/json");

  $id = $_GET['id'];
  $name = $_GET['name'];
  $mobile = $_GET['mobile'];
  $email = $_GET['email'];

  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("DELETE FROM user WHERE id = '" . $id . "'");
  if ($result) {
    $result = $mysqli->query("INSERT INTO user (id, name, mobile, email) VALUES ('" . $id . "', '" . $name . "', '" . $mobile . "', '" . $email . "')");
  }
  if (!$result) {
    $id = "na";
  }

  $myObj = new stdClass();
  $myObj->id = $id;
  $myJSON = json_encode($myObj);
  echo $myJSON;
?>