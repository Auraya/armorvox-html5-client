//var PROXY_SERVER = "https://cloud.armorvox.com/id_manager/";
var PROXY_SERVER = "http://localhost/id_manager/";

function validateRegistration(id, callback) {
  console.log("step=validateRegistration");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var user = JSON.parse(xmlhttp.responseText);
      console.log("id=" + user.id);
      callback(user.id);
    }
  };
  var url = PROXY_SERVER + "get_id.php";
  var params = "id=".concat(escape(id));
  xmlhttp.open("GET", url.concat("?", params), true);
  xmlhttp.send();
}

function saveUser(id, name, mobile, email) {
  console.log("step=saveUser");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var user = JSON.parse(xmlhttp.responseText);
      console.log("id=" + user.id);
    }
  };
  var url = PROXY_SERVER + "save_user.php";
  var p_id = "id=".concat(escape(id));
  var p_name = "name=".concat(escape(name));
  var p_mobile = "mobile=".concat(escape(mobile));
  var p_email = "email=".concat(escape(email));
  var params = p_id.concat("&", p_name).concat("&", p_mobile).concat("&", p_email);
  xmlhttp.open("POST", url.concat("?", params), true);
  xmlhttp.send();
}

function getList(callback) {
  console.log("step=setList");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var users = JSON.parse(xmlhttp.responseText);
      console.log("list=" + users.list);
      callback(users.list);
    }
  };
  var url = PROXY_SERVER + "get_list.php";
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function getName(id, callback) {
  console.log("step=getName");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var user = JSON.parse(xmlhttp.responseText);
      console.log("name=" + user.name);
      callback(user.name);
    }
  };
  var url = PROXY_SERVER + "get_name.php";
  var params = "id=".concat(escape(id));
  xmlhttp.open("GET", url.concat("?", params), true);
  xmlhttp.send();
}