
function validateRegistration(id, callback) {
  console.log("step=validateRegistration");  
  var users = window.localStorage.getItem('users');
  if (users != null) {
	  users = JSON.parse(users);
	  var user = users[id];
	  if (user != null) {
		callback(user.id);
	  }
  }
}

function saveUser(id, name, mobile, email) {
  console.log("step=saveUser");  
  var user = {
	  id: id,
	  name: name,
	  mobile: mobile,
	  email: email
  };
  var users = window.localStorage.getItem('users');
  if (users == null) {
	  users = {};
  } else {
	  users = JSON.parse(users);
  }
  users[id] = user;
  var usersString =  JSON.stringify(users);
  window.localStorage.setItem('users', usersString);
}

function getList(callback) {
  console.log("step=getList");
  var users = window.localStorage.getItem('users');
  if (users != null) {
	  users = JSON.parse(users);
	  callback(Object.keys(users));
  }
}

function getName(id, callback) {
  console.log("step=getName");
  var users = window.localStorage.getItem('users');
  if (users != null) {
	  users = JSON.parse(users);
	  var user = users[id];
	  if (user != null) {
		callback(user.name);
	  }
  }
}