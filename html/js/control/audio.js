var audioStorage = {};
var recording = false;
var startRecordingTime;
var speechElapsedTime;
var drawEnergyEffect;

var firCooefficients = [0.0037816, 0.012727, 0.016969, 0.028023, 0.038608,
  0.051004, 0.062939, 0.073908, 0.082606, 0.088253, 0.090195,
  0.088253, 0.082606, 0.073908, 0.062939, 0.051004, 0.038608,
  0.028023, 0.016969, 0.012727, 0.0037816
];
var firBuffer = Array.apply(null, Array(20)).map(Number.prototype.valueOf, 0);
var firBufferPos = 0;

var AudioContext = window.AudioContext || window.webkitAudioContext;

function configAudio(drawEnergyEffect) {
  if (!audioStorage.audioCtx) {
    audioStorage.audioCtx = new AudioContext();
    console.log('sampleRate=' + audioStorage.audioCtx.sampleRate);
    audioStorage.recorderNode = audioStorage.audioCtx.createScriptProcessor(4096, 1, 1);
    audioStorage.recorderNode.connect(audioStorage.audioCtx.destination);

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(onMicrophoneCaptured)
      .catch(onMicrophoneCaptureError);

    this.drawEnergyEffect = drawEnergyEffect;

    function onMicrophoneCaptured(microphone) {
      mediaStream = microphone;

      audioStorage.audioInput = audioStorage.audioCtx.createMediaStreamSource(microphone);
      audioStorage.audioInput.connect(audioStorage.recorderNode);

      audioStorage.recorderNode.onaudioprocess = onAudioProcess;

      audioStorage.analyser = audioStorage.audioCtx.createAnalyser();
      audioStorage.analyser.fftSize = 2048;
      audioStorage.audioInput.connect(audioStorage.analyser);
      audioStorage.dataArray = new Uint8Array(audioStorage.analyser.frequencyBinCount);
    }

    function onMicrophoneCaptureError() {
      console.log("There was an error accessing the microphone. You may need to allow the browser access");
    }

    function onAudioProcess(e) {    
      if (recording) {
        var leftChannel = e.inputBuffer.getChannelData(0);
        leftChannel = downsampleBuffer(leftChannel, 8000);
        leftChannel = convertFloat32ToInt16(leftChannel);
        audioStorage.audioBuffer.push(leftChannel);
        audioStorage.analyser.getByteTimeDomainData(audioStorage.dataArray);
        drawEnergyEffect(audioStorage.dataArray);
      }
    }
  }
}

function startRecording() {
  recording = true;
  audioStorage.audioBuffer = [];
  startRecordingTime = Date.now();
}

function stopRecording() {
  recording = false;
  speechElapsedTime = Date.now()- startRecordingTime;
}

function getSpeechElapsedTime() {
  return speechElapsedTime;
}

function isRecording() {
  return recording;
}

function makeWav() {
  var numFrames = audioStorage.audioBuffer.length;
  var length = 0;

  for (var i = 0; i < numFrames; i++) {
    length += audioStorage.audioBuffer[i].length;
  }

  var samples = new Int16Array(length);
  var k = 0,
    i, j;

  for (i = 0; i < numFrames; i++) {
    for (j = 0; j < audioStorage.audioBuffer[i].length; j++) {
      samples[k++] = audioStorage.audioBuffer[i][j];
    }
  }

  var wave = makeRIFF(samples); // create the wave file
  var blob = new Blob(wave);
  return blob;
}

function makeRIFF(data) {
  var riff = new Int8Array([0x52, 0x49, 0x46, 0x46]); // RIFF
  var chunkSize = new Uint32Array([36 + data.length * 2]);
  var format = new Int8Array([0x57, 0x41, 0x56, 0x45]); // fmt
  var subChunk1Id = new Int8Array([0x66, 0x6d, 0x74, 0x20]);
  var subChunk1Size = new Uint32Array([16]);
  var audioFormat = new Uint16Array([1]);
  var numChannels = new Uint16Array([1]);
  var sampleRate = new Uint32Array([8000]);
  var byteRate = new Uint32Array([16000]);
  var blockAlign = new Uint16Array([2]);
  var bitsPerSample = new Uint16Array([16]);
  var subChunk2Id = new Int8Array([0x64, 0x61, 0x74, 0x61]); // data
  var subChunk2Size = new Uint32Array([data.length * 2]); // length

  return [].concat(riff).concat(chunkSize).concat(format).concat(
    subChunk1Id).concat(subChunk1Size).concat(audioFormat).concat(
    numChannels).concat(sampleRate).concat(byteRate).concat(
    blockAlign).concat(bitsPerSample).concat(subChunk2Id).concat(
    subChunk2Size).concat(data);
}

function downsampleBuffer(buffer, rate) {
  var sampleRate = audioStorage.audioCtx.sampleRate;
  if (rate == sampleRate) {
    return buffer;
  }
  if (rate > sampleRate) {
    throw "downsampling rate should be smaller than original sample rate";
  }

  // apply FIR
  for (var i = 0; i < buffer.length; i++) {
    firBuffer[firBufferPos] = buffer[i];
    var total = 0;
    var firBufferPosTemp = firBufferPos;
    for (var j = 0; j < firCooefficients.length; j++) {
      total += firBuffer[firBufferPosTemp++] * firCooefficients[j];
      if (firBufferPosTemp == firBuffer.length) {
        firBufferPosTemp = 0;
      }
    }
    buffer[i] = total;
    firBufferPos++;
    if (firBufferPos == firBuffer.length) {
      firBufferPos = 0;
    }
  }

  var sampleRateRatio = sampleRate / rate;
  var newLength = Math.round(buffer.length / sampleRateRatio);
  var result = new Float32Array(newLength);
  var offsetResult = 0;

  while (offsetResult < result.length) {
    var offsetBuffer = Math.round(offsetResult * sampleRateRatio);
    while (offsetBuffer >= buffer.length) {
      offsetBuffer--;
    }
    result[offsetResult] = buffer[offsetBuffer];
    offsetResult++;
  }
  return result;
}

function convertFloat32ToInt16(buffer) {
  var l = buffer.length;
  var ratio = 1; //8 / 44.1;
  var buf = new Int16Array(l * ratio);
  for (var i = 0; i < buf.length; i++) {
    buf[i] = Math.min(1, buffer[i / ratio]) * 0x7FFF;
  }
  return buf;
}
