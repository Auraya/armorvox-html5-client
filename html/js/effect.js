
function drawMessage(type) {
  var msg = '<div class="message-row">';
  if (type == STEP_MAIN) {
    msg += '<p>Please choose from one of the following options:</p>';
  } else if (type == STEP_INPUT) {
    msg += '<p>Please enter your identity:</p>';
  } else if (type == "invalid_name") {
    msg += '<p class="warn">Invalid \"name\": please use alphabet characters and spaces only:</p>';
  } else if (type == "invalid_mobile") {
    msg += '<p class="warn">Invalid \"mobile\" number. Please enter ten digits: e.g. 0412345678</p>';
  } else if (type == "invalid_email") {
    msg += '<p class="warn">Invalid \"email\" address:</p>';
  } else if (type == "not_registered") {
    msg += '<p class="warn">Your mobile hasn\'t been enrolled. Please try a different one.</p>';
  } else if (type == STEP_MOBILE) {
    msg += '<p>Press the microphone button while you say your mobile number:</p>';
  } else if (isRecordingRandomDigit(type)) {
    msg += '<p>Press the microphone button while you say the following digits:</p>';
  } else if (type == STEP_COMPLETE && mode == API_ENROL) {
    msg += '<p>Congratulations! You have been successfully enrolled.</p>';
  } else if (type == STEP_COMPLETE && mode == API_VERIFY && isGood) {
    msg += '<p>Congratulations! You have been successfully verified.</p>';
  } else if (type == STEP_COMPLETE && mode == API_VERIFY && !isGood) {
    msg += '<p class="warn">Sorry, your voice is not verfied.</p>';
  } else if (type == STEP_COMPLETE && mode == API_CROSS_MATCH && isGood) {
    msg += '<p>Welcome back, <span>' + name + '</span>.</p>';
  } else if (type == STEP_COMPLETE && mode == API_CROSS_MATCH && !isGood) {
    msg += '<p class="warn">Sorry, you are not identified.</p>';
  } else if (type == "too_fast") {
    msg += '<p class="warn">You spoke too fast. Please press the microphone button and say again:';
  } else if (type == STEP_RETRY) {
    msg += '<p class="warn">You spoke too fast or not clear enough. Press the microphone button while you say:</p>';
  } else if (type == STEP_API_ERROR) {
    msg += '<p class="warn">Error connecting to server, please contact Auraya support.</p>';
  }
  msg += '</div>';
  div_message.innerHTML = msg;
}

function drawEnergyEffect(dataArray) {
  var canvas = document.getElementById("cvs_energy");
	var canvasCtx = canvas.getContext('2d');
  canvas.height = 45;
 
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'white';
  canvasCtx.beginPath();

  const bufferLength = dataArray.length;
  const sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

function clearEnergyEffect() {
  var canvas = document.getElementById("cvs_energy");
	var drawContext = canvas.getContext('2d');
  drawContext.clearRect(0, 0, canvas.width, canvas.height);
}

function drawButton() {
  var btn = '';
  if (step == STEP_MAIN) {
    for (var i = 0; i < MODES.length; i++) {
      btn += '<div class="button-row"><button class="button-menu" value="' + MODES[i] + '" onclick="btnMenuOnClick(this)">' + MENU[i] + '</button></div>';
    }
  } else if (step == STEP_INPUT) {
    btn += '<div class="button-row"><button id="btn_next">Next</button></div>';
  } else if (step == STEP_MOBILE || isRecordingRandomDigit(step) || step == STEP_RETRY) {
    btn += '<div class="canvas-row"><canvas id="cvs_energy" class="canvas"></canvas></div>';
    btn += '<button id="btn_record"></button>';
  } else if (step == STEP_COMPLETE) {
    btn += '<div class="button-row"><button id="btn_complete" onclick="btnCompleteOnClick()">Finish</button></div>';
  }
  div_button.innerHTML = btn;
}

function bindButton() {
  if (step == STEP_INPUT) {
    $("#div_input input").keypress(function(event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        btnNextOnClick(event);
      }
    });
    $("#btn_next").on("click", btnNextOnClick);
  } else if (step == STEP_MOBILE || isRecordingRandomDigit(step) || step == STEP_RETRY) {
    $("#btn_record").on("mousedown ", btnRecordOnMouseDown);
    $("#btn_record").on("mouseup ", btnRecordOnMouseUp);
    $("#btn_record").on("touchstart ", btnRecordOnMouseDown);
    $("#btn_record").on("touchend ", btnRecordOnMouseUp);
  }
}

function drawPhrase() {
  if (step == STEP_RANDOM) {
    phrase = getRandomNumber();
    div_phrase.innerHTML = '<p class="phrase">' + getNumberDisplay(phrase) + '</p>';
  } else if (step == STEP_DIGIT_ASC) {
    phrase = "123456789";
    div_phrase.innerHTML = '<p class="phrase">' + getNumberDisplay(phrase) + '</p>';
  } else if (step == STEP_DIGIT_DESC) {
    phrase = "987654321";
    div_phrase.innerHTML = '<p class="phrase">' + getNumberDisplay(phrase) + '</p>';
  } else if (step == STEP_MOBILE) {
    phrase = mobile;
    div_phrase.innerHTML = '<p class="phrase">' + getNumberDisplay(phrase) + '</p>';
  } else if (step == STEP_RETRY) {
    div_phrase.innerHTML = '<p class="phrase">' + getNumberDisplay(phrase) + '</p>';
  } else {
    div_phrase.innerHTML = '';
  }
}

function getNumberDisplay(number) {
  if (number.length == 9) {
    return number.substring(0, 3) + '&nbsp;' + number.substring(3, 6) + '&nbsp;' + number.substring(6);
  }
  return number.substring(0, 4) + '&nbsp;' + number.substring(4, 7) + '&nbsp;' + number.substring(7);
}

function drawProgress() {
  if (step != STEP_MAIN && step != STEP_INPUT && step != STEP_COMPLETE && step != STEP_API_ERROR) {
    div_progress.innerHTML = '<div class="canvas-row"><canvas id="cvs_progress" class="canvas"></canvas></div>';
    var canvas = document.getElementById("cvs_progress");
    var canvasCtx = canvas.getContext('2d');
    canvas.height = 45;
    const offset = 90;
    const width = canvas.width - (offset * 2);
    const diff = width / (maxProgress - 1);
    const y = canvas.height / 2;
    const radius = 4;
    var x = offset;

    canvasCtx.fillStyle = 'white';
    canvasCtx.strokeStyle = 'white';
    for (var i = 1; i <= maxProgress; i++) {
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, radius, 0, 2 * Math.PI);
      if (i <= curProgress) {
        canvasCtx.fill();
      } else {
        canvasCtx.stroke();
      }
      x += diff;
    }
  } else {
    div_progress.innerHTML = '';
  }
}

function startLoading() {
  var height = $('#div_phrase').outerHeight(true) + $('#div_button').outerHeight(true);
  console.log(height);
  var divPhrase = document.getElementById('div_phrase');
  var divButton = document.getElementById('div_button');
  divNumberDisplay = divPhrase.style.display;
  divButtonDisplay = divButton.style.display;
  div_loader.innerHTML = '<div class="loader-row"><div id="div_spinner"></div></div>';
  divPhrase.style.display = 'none';
  divButton.style.display = 'none';
  $('#div_loader').height(height);
}

function stopLoading(callback) {
  setTimeout(function() {
    div_loader.innerHTML = '';
    document.getElementById('div_phrase').style.display = divNumberDisplay;
    document.getElementById('div_button').style.display = divButtonDisplay;
    document.getElementById('div_loader').style.height = 'auto';
    callback();
  }, 500);
}

function drawTitle() {
  var title = '';
  switch (mode) {
    case API_ENROL:
      title += '<h2>Enrolment</h2>';
      break;
    case API_VERIFY:
      title += '<h2>Verification</h2>';
      break;
    case API_CROSS_MATCH:
      title += '<h2>Identification</h2>';
      break;
    default:
      title += '<h2>Welcome!</h2>';
      break;
  }
  div_title.innerHTML = title;
}

function drawInput() {
  var input = '';
  if (step == STEP_INPUT) {
    if (mode == API_ENROL) {
      input += '<div class="input-row"><input id="ipt_name" type="text" placeholder="Name"></div>';
      input += '<div class="input-row"><input id="ipt_mobile" type="tel" placeholder="Mobile"></div>';
      input += '<div class="input-row"><input id="ipt_email" type="text" placeholder="Email"></div>';
    } else if (mode == API_VERIFY) {
      input += '<div class="input-row"><input id="ipt_mobile" type="tel" placeholder="Mobile"></div>';
    }
  }
  div_input.innerHTML = input;
}
