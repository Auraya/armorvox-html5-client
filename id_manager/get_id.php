<?php
  header("Content-Type: application/json");
  $id = $_GET['id'];
  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("SELECT id FROM user WHERE id = '" . $id . "'");
  if (mysqli_num_rows($result) != 0) {
    $row = $result->fetch_assoc();
    $id = $row['id'];
  } else {
    $id = "na";
  }
  $user = new stdClass();
  $user->id = $id;
  $myJSON = json_encode($user);
  echo $myJSON;
?>