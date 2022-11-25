import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";
import * as readline from 'readline';

let workingDict = new Map();
let audioCtx = new AudioContext();
let source = new AudioBufferSourceNode(audioCtx);
let analyzer = audioCtx.createAnalyser();
let buffSz = analyzer.frequencyBinCount;
let freqData = new Uint8Array(buffSz);
let start = true;
let rAF;

// Audio processing helper
function getStampData(){
    const ts = audioCtx.currentTime;
    analyzer.getByteTimeDomainData(freqData);
    if (freqData[0] < 1){
        if (start){
            console.log('Stamp Start: '+ts);
            start = false;
        }
        else{
            console.log('Stamp End: '+ts);
            start = true;
        }
    }
    rAF = requestAnimationFrame(getStampData);
}

// Audio Processing and Timestamping
// src is the path to the audio file
function getStamps(src){
    console.log("Getting audio");
    fetch(src)
    .then((response) => response.arrayBuffer())
    .then((downloadedBuffer) => audioCtx.decodeAudioData(downloadedBuffer))
    .then((decodedBuffer) => {
        source.buffer = decodedBuffer;
        source.connect(analyzer);
        //source.connect(audioCtx.destination);
        source.loop = false;
        console.log("Audio ready");
    })
    .catch((e) => {
        console.error('Error reading audio data: ${e.error}');
    });
    source.start();
    rAF = requestAnimationFrame(getStampData);
}