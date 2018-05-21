<?php
  header("Content-Type: application/json");
  $id = $_GET['id'];
  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("DELETE FROM user WHERE id = '" . $id . "'");
  if (!$result) {
    $id = "na";
  }
  $user = new stdClass();
  $user->id = $id;
  $myJSON = json_encode($user);
  echo $myJSON;
?>