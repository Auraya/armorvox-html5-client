

function validateName(name) {
  var re = /^[a-zA-Z ]+$/;
  return re.test(name);
}

function validateMobile(mobile) {
  var re = /^\d{10}$/;
  return re.test(mobile);
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

function getRandomNumber() {
  var pool = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var number = "";
  while (pool.length) {
    var idx = Math.floor(Math.random() * pool.length);   
    number += pool[idx];
    pool.splice(idx, 1);
  }
  return number;
}

function resetArray(arr) {
  while(arr.length) {
    arr.pop();
  }
}

function getFirstId(extra) {
  var parts = extra.split(",");
  if (parts.length > 0) {
    var first = parts[0];
    var pair = first.split(":");
    var impProb = parseFloat(pair[1]);
    if (impProb < THRESH_IMP_PROB) {
      return pair[0];
    }
  }
  return "na";
}

function getSpaced(number) {
  return number.split('').join(" ");
}