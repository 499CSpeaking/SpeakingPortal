"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var workingDict = new Map();
var audioCtx = new AudioContext();
var source = new AudioBufferSourceNode(audioCtx);
var analyzer = audioCtx.createAnalyser();
var buffSz = analyzer.frequencyBinCount;
var freqData = new Uint8Array(buffSz);
var start = true;
var rAF;
// Audio processing helper
function getStampData() {
    var ts = audioCtx.currentTime;
    analyzer.getByteTimeDomainData(freqData);
    if (freqData[0] < 1) {
        if (start) {
            console.log('Stamp Start: ' + ts);
            start = false;
        }
        else {
            console.log('Stamp End: ' + ts);
            start = true;
        }
    }
    rAF = requestAnimationFrame(getStampData);
}
// Audio Processing and Timestamping
// src is the path to the audio file
function getStamps(src) {
    console.log("Getting audio");
    (0, node_fetch_1.default)(src)
        .then(function (response) { return response.arrayBuffer(); })
        .then(function (downloadedBuffer) { return audioCtx.decodeAudioData(downloadedBuffer); })
        .then(function (decodedBuffer) {
        source.buffer = decodedBuffer;
        source.connect(analyzer);
        //source.connect(audioCtx.destination);
        source.loop = false;
        console.log("Audio ready");
    })
        .catch(function (e) {
        console.error('Error reading audio data: ${e.error}');
    });
    source.start();
    rAF = requestAnimationFrame(getStampData);
}
