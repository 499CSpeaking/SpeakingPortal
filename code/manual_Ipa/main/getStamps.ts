import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import * as readline from "readline";
import { WaveFile } from "wavefile";

let workingDict = new Map();

// TODO
// Audio processing helper
function wordEnd(freqs, j) {
  for (j; j < j + 4; j++) {
    if (freqs[j] > 50) {
      return false;
    }
  }
  return true;
}

// TODO
// Audio Processing and Timestamping
// src is the path to the audio file
function getStamps(src) {
  // read in audio file
  let wav = new WaveFile();
  try {
    wav = new WaveFile(fs.readFileSync(src));
  } catch (e) {
    throw e;
  }
  // get each sample value in the file
  // counter to track sample number
  let i = 0;
  // counter to hold which word is currently being spoken
  // each word should be separated by silence, which is theoretically value of 0
  let word = 0;
  // data structure to hold wordID, start time of word, and end time of word
  let stamps = new Map();
  let start = false;
  let start_t, end_t;
  let thresh = 250;
  let freqs = wav.getSamples(false, Uint8Array);
  let sz = freqs.length;
  let sampleTime = ((sz / wav.fmt.sampleRate) * 1000) / sz;
  // noise filtering
  let filterFreqs = new Uint8Array(sz);
  // 2 values either side of pivot
  let neighSz = 5;
  let neighVals = new Uint8Array(neighSz);
  for (let i = 0; i < sz; i++) {
    let pivot = freqs[i];
    neighVals[2] = pivot;
    let iL2 = i - 2 < sz,
      iL1 = i - 1 < sz,
      iR1 = i + 1 > sz,
      iR2 = i + 2 > sz;
    neighVals[0] = freqs[i - 2];
    neighVals[1] = freqs[i - 1];
    neighVals[3] = freqs[i + 1];
    neighVals[4] = freqs[i + 2];
    // handle out of bounds values
    if (iL2) {
      neighVals[0] = 0;
    }
    if (iL1) {
      neighVals[1] = 0;
    }
    if (iR1) {
      neighVals[3] = 0;
    }
    if (iR2) {
      neighVals[4] = 0;
    }
    // filter out pepper noise (extra low values)
    filterFreqs[i] = Math.max(
      neighVals[0],
      neighVals[1],
      neighVals[2],
      neighVals[3],
      neighVals[4]
    );
    // filter out general noise
    filterFreqs[i] =
      (neighVals[0] / 5) * neighVals[2] +
      (neighVals[1] / 5) * neighVals[2] +
      (neighVals[3] / 5) * neighVals[2] +
      (neighVals[4] / 5) * neighVals[2] +
      neighVals[2] / 5;
  }
  // timestamp generation algo
  while (i < filterFreqs.length) {
    try {
      // get the value of a single sample from the wave file
      // range: -32768 to 32767 for 16 bit audio
      let samVal = filterFreqs[i];
      let trueEnd =
        (filterFreqs[i + 1] < 100 &&
          filterFreqs[i + 2] < 50 &&
          filterFreqs[i + 3] < 10 &&
          filterFreqs[i + 4] < 5 &&
          filterFreqs[i + 5] < 1) ||
        i + 1 > filterFreqs.length;
      if (samVal > thresh && start == false) {
        // start is set to true when a word hasn't been already started
        start = true;
        // 48 is used here since one sample is roughly equivalent to 48ms of audio
        start_t = sampleTime * i;
      } else if (
        samVal < thresh &&
        /*nextVal == samVal &&*/
        trueEnd == true &&
        start == true
      ) {
        // start is set to false when the last audible portion of the word is spoken
        start = false;
        end_t = sampleTime * i;
        stamps.set(word, { start: start_t, end: end_t });
        // word is incremented only if the current word is done being spoken
        word++;
      }
      i++;
    } catch (e) {
      console.log("Out of values, or failed to get sample data at index: " + i);
      break;
    }
  }
  return stamps;
}

module.exports = getStamps;
