<?php
  header("Content-Type: application/json");
  $mysqli = new mysqli("localhost", "username", "password", "id_manager");
  $result = $mysqli->query("SELECT * FROM user ORDER BY name");
  $users = array();
  while ($row = mysqli_fetch_array($result)) {
    $user = new stdClass();
    $user->id = $row['id'];
    $user->name = $row['name'];
    $user->mobile = $row['mobile'];
    $user->email = $row['email'];
    array_push($users,$user);
  }
  $myJSON = json_encode($users);
  echo $myJSON;
?>