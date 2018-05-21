<?php
  header("Content-Type: application/json");
  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("SELECT GROUP_CONCAT(id SEPARATOR ',') AS list FROM user");
  $list = "na";
  if (mysqli_num_rows($result) != 0) {
    $row = $result->fetch_assoc();
    $list = $row['list'];
  }
  $users = new stdClass();
  $users->list = $list;
  $myJSON = json_encode($users);
  echo $myJSON;
?>