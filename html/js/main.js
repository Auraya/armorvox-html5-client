
$(document).ready(function() {
  setStep(getNextStep());
});

function init() {
  mode = "";
  phrase = "";
  
  name = "";
  mobile = "";
  email = "";

  printName = "";
  list = "";
  utterances = [];
  curProgress = 1;

  routes.set(API_ENROL, [STEP_INPUT, STEP_MOBILE, STEP_CHECK_QUALITY, STEP_MOBILE, STEP_CHECK_QUALITY, STEP_MOBILE, STEP_ENROL, STEP_DIGIT_ASC, STEP_CHECK_QUALITY, STEP_DIGIT_DESC, STEP_CHECK_QUALITY, STEP_RANDOM, STEP_CHECK_QUALITY, STEP_RANDOM, STEP_ENROL, STEP_COMPLETE]);  
  routes.set(API_VERIFY, [STEP_INPUT, STEP_RANDOM, STEP_VERIFY, STEP_MOBILE, STEP_VERIFY, STEP_COMPLETE]);
  routes.set(API_CROSS_MATCH, [STEP_RANDOM, STEP_CROSS_MATCH, STEP_MOBILE, STEP_CROSS_MATCH, STEP_COMPLETE]);
}

function btnMenuOnClick(btn) {
  mode = btn.value;
  
  // count total progress number
  if (mode == API_ENROL) {
    var route = routes.get(mode);
    maxProgress = 0;
    for (var i = 0; i < route.length; i++) {
      if (route[i] == STEP_MOBILE || isRecordingRandomDigit(route[i])) {
        maxProgress++;
      }
    }
  }

  configAudio(drawEnergyEffect);
  setStep(getNextStep());
}

function getNextStep() {
  if (step == STEP_RETRY) {
    return STEP_CHECK_QUALITY;
  }
  var route = routes.get(mode);
  if (route) {
    if (route.length) {
      return route.shift();
    }
  }
  return STEP_MAIN;
}

function setStep(step) {
  this.step = step;
  if (step == STEP_MAIN) {
    init();
  }

  drawTitle();
  drawMessage(step);
  drawPhrase();
  drawInput();
  drawButton();
  bindButton();
  drawProgress();

  setPrintName();
  processApi();
}

function setPrintName() {
  if (step == STEP_MOBILE) {
    printName = PN_MOBILE;
  } else if(isRecordingRandomDigit(step)) {
    printName = PN_RANDOM;
  }
}

function processApi() {
  switch (step) {
    case STEP_ENROL:
      apiSetDataDelete(GROUP, mobile, printName);
      apiSendRequest(function() {
        if (printName == "digit-random") {
          utterances.shift(); // only takes last two mobile utterances
        }
        apiSetDataEnrol(GROUP, mobile, printName, utterances);
        apiSendRequest(apiEnrolOnRespond, apiOnError);
      }, apiOnError);
      break;
    case STEP_VERIFY:
      apiSetDataVerify(GROUP, mobile, printName, utterances[utterances.length - 1], getSpaced(phrase), VOCAB);
      apiSendRequest(apiVerifyOnRespond, apiOnError);
      break;
    case STEP_CROSS_MATCH:
      getList(function(list) {
        this.list = list == "na" ? "" : list
        apiSetDataCrossMatch(GROUP, printName, utterances[utterances.length - 1], list);
        apiSendRequest(apiCrossMatchOnRespond, apiOnError);
      });
      break;
    case STEP_CHECK_QUALITY:
      apiSetDataCheckQuality(GROUP, printName, utterances[utterances.length - 1], QA_MODE);
      apiSendRequest(apiCheckQualityOnRespond, apiOnError);
      break;
  }
}

function btnRecordOnMouseDown(event) {
  document.getElementById("btn_record").style.backgroundColor = "#FFA62F";
  startRecording();
}

function btnRecordOnMouseUp(event) {
  document.getElementById("btn_record").style.backgroundColor = "#2B3856";
  if (isRecording()) {
    clearEnergyEffect();
    stopRecording();
    speechElapsedTime = getSpeechElapsedTime();
    if (speechElapsedTime > 2000) {
      startLoading();
      console.log("endOfSpeechTime=" + speechElapsedTime);
      utterances.push(makeWav());
      setStep(getNextStep());
    } else {
      drawMessage("too_fast");
    }
  }
}

function apiOnError() {
  setStep(STEP_API_ERROR);
}

function apiCheckQualityOnRespond() {
  stopLoading(function() {
    var condition = apiGetCondition();
    if (condition == "GOOD") {
      curProgress++;
      setStep(getNextStep());
    } else if(condition == "QAFAILED") {
      utterances.pop();
      setStep(STEP_RETRY);
    } else {
      apiOnError();
    }
  });
}

function apiEnrolOnRespond() {
  stopLoading(function() {
    var condition = apiGetCondition();
    if (condition == "GOOD")  {
      curProgress++;
      saveUser(mobile, name, mobile, email);
      setStep(getNextStep());
    } else {
      apiOnError();
    }
  });
}

function apiVerifyOnRespond() {
  stopLoading(function() {
    isGood = false;
    var condition = apiGetCondition();
    if (condition == "GOOD") {
      isGood = true;
      setStep(STEP_COMPLETE);
    } else if (condition == "ERROR" || condition == "NOT_ENROLLED") {
      apiOnError();
    } else {
      setStep(getNextStep());
    }
  });
}

function apiCrossMatchOnRespond() {
  stopLoading(function() {
    isGood = false;
    var condition = apiGetCondition();
    var extra = apiGetExtra();
    var id = getFirstId(extra);
    if (condition == "GOOD" && id != "na")  {
      getName(id, function(name) {
        isGood = true;
        this.name = name;
        setStep(STEP_COMPLETE);
      });
    } else if (condition == "ERROR") {
      apiOnError();
    } else {
      setStep(getNextStep());
    }
  });
}

function btnNextOnClick(event) {
  validateInputs();
}

function btnCompleteOnClick(event) {
  setStep(STEP_MAIN);
}

function validateInputs() {
  if (mode == API_ENROL) {
    name = document.getElementById("ipt_name").value;
    mobile = document.getElementById("ipt_mobile").value;
    email = document.getElementById("ipt_email").value;
    if (!validateName(name)) {
      drawMessage("invalid_name");
      document.getElementById("ipt_name").focus();
    } else if (!validateMobile(mobile)) {
      drawMessage("invalid_mobile");
      document.getElementById("ipt_mobile").focus();
    } else if (!validateEmail(email)) {
      drawMessage("invalid_email");
      document.getElementById("ipt_email").focus();
    } else {
      setStep(getNextStep());
    }
  } else if (mode == API_VERIFY) {
    mobile = document.getElementById("ipt_mobile").value;
    if (!validateMobile(mobile)) {
      drawMessage("invalid_mobile");
      document.getElementById("ipt_mobile").focus();
    } else {
      validateRegistration(mobile, function(id) {
        if (id != "na") {
          setStep(getNextStep());
        } else {
          drawMessage("not_registered");
          document.getElementById("ipt_mobile").focus();
        }
      });
    }
  }
}

function isRecordingRandomDigit(step) {
  return (step == STEP_RANDOM || step == STEP_DIGIT_ASC || step == STEP_DIGIT_DESC);
}