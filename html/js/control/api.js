const SERVER = "https://cloud.armorvox.com/vixverify/v6/";

var condition;
var extra;
var dataList = [];

function apiSetDataEnrol(group, id, printName, utterances) {
  var dataObj = {};
  dataObj.api = 'enrol';
  dataObj.data = new FormData();
  dataObj.data.append('group', group);
  dataObj.data.append('id', id);
  dataObj.data.append('print_name', printName);
  for (var i = 0; i < utterances.length; i++) {
    dataObj.data.append('utterance' + (i + 1), utterances[i]);
  }
  dataList.push(dataObj);
}

function apiSetDataVerify(group, id, printName, utterance, phrase, vocab) {
  var dataObj = {};
  dataObj.api = 'verify';
  dataObj.data = new FormData();
  dataObj.data.append('group', group);
  dataObj.data.append('id', id);
  dataObj.data.append('print_name', printName);
  dataObj.data.append('utterance', utterance);
  if (phrase && vocab) {
    dataObj.data.append('phrase', phrase);
    dataObj.data.append('vocab', vocab);
  }
  dataList.push(dataObj);
}

function apiSetDataDelete(group, id, printName) {
  var dataObj = {};
  dataObj.api = 'delete';
  dataObj.data = new FormData();
  dataObj.data.append('group', group);
  dataObj.data.append('print_name', printName);
  dataObj.data.append('id', id);
  dataList.push(dataObj);
}

function apiSetDataCrossMatch(group, printName, utterance, list) {
  var dataObj = {};
  dataObj.api = 'cross_match';
  dataObj.data = new FormData();
  dataObj.data.append('group', group);
  dataObj.data.append('print_name', printName);
  dataObj.data.append('utterance', utterance);
  dataObj.data.append('list', list);
  dataList.push(dataObj);
}

function apiSetDataCheckQuality(group, printName, utterance, mode) {
  var dataObj = {};
  dataObj.api = 'check_quality';
  dataObj.data = new FormData();
  dataObj.data.append('group', group);
  dataObj.data.append('print_name', printName);
  dataObj.data.append('utterance', utterance);
  dataObj.data.append('mode', mode);
  dataList.push(dataObj);
}

function apiGetCondition() {
  return condition;
}

function apiGetExtra() {
  return extra;
}

function apiSendRequest(onRespond, onError) {
  if (dataList.length) {
    var dataObj = dataList.shift();
    console.log("api=" + dataObj.api);
    jQuery.ajax({
      url: SERVER + dataObj.api,
      data: dataObj.data,
      cache: false,
      contentType: false,
      processData: false,
      dataType: 'xml',
      type: 'POST',
      error: function(data) {
        console.log(dataObj.api + "=error");
        onError();
      },
      success: function(xmlDoc) {
        console.log(dataObj.api + "=success");
        setRespond(xmlDoc);
        onRespond();
      }
    });
  }
}

// private
function getValue(xml, name) {
  var val = xml.find('var[name="' + name + '"]').attr('expr');
  val = val.substr(1).slice(0, -1);
  console.log(name + "=" + val);
  return val;
}

function setRespond(xmlDoc) {
  var xml = jQuery(xmlDoc);
  condition = getValue(xml, "condition");
  extra = getValue(xml, "extra");
}