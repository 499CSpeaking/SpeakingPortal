// library requirements
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import * as readline from "readline";
import { WaveFile } from "wavefile";

// Max Filter
function maxFilter(freqs, filterFreqs, sz) {
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
  }
  return filterFreqs;
}

// Mean Filter
function meanFilter(freqs, filterFreqs, sz) {
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
    // filter out general noise
    filterFreqs[i] =
      (neighVals[0] / 5) * neighVals[2] +
      (neighVals[1] / 5) * neighVals[2] +
      (neighVals[3] / 5) * neighVals[2] +
      (neighVals[4] / 5) * neighVals[2] +
      neighVals[2] / 5;
  }
  return filterFreqs;
}

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
  // each word should be separated by some level of silence
  let word = 0;
  // data structure to hold wordID, start time of word, and end time of word
  let stamps = new Map();
  let start = false;
  let start_t, end_t;
  // bug fixing values
  let stampDiff = new Map();
  // threshold to determine if there is substantial enough sound to count as a word
  let thresh = 250;
  // get the samples present in audio
  let freqs = wav.getSamples(false, Uint8Array);
  let sz = freqs.length;
  // number of samples/sampleRate = audio length * 1000 for audio length in ms / number of samples
  // estimates number of ms each sample holds
  let sampleTime = ((sz / wav.fmt.sampleRate) * 1000) / sz;
  // noise filtering
  let filterFreqs = new Uint8Array(sz);
  // apply filters
  filterFreqs = maxFilter(freqs, filterFreqs, sz);
  filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
  // timestamp generation algo
  while (i < filterFreqs.length) {
    // get the value of a single sample from the wave file
    // range: -32768 to 32767 for 16 bit audio, but I'm mapping to 0-255 range
    let samVal = filterFreqs[i];
    let trueEnd =
      (filterFreqs[i + 1] < 100 &&
        filterFreqs[i + 2] < 50 &&
        filterFreqs[i + 3] < 10 &&
        filterFreqs[i + 4] < 5 &&
        filterFreqs[i + 5] < 1) ||
      i + 1 > filterFreqs.length;
    if (samVal > thresh && start == false) {
      // start is set to true when a word hasn't been found yet
      start = true;
      // see sampleTime declaration for math
      start_t = sampleTime * i;
    } else if (
      samVal < thresh &&
      trueEnd == true &&
      start == true
    ) {
      // start is set to false when the last audible portion of the word is spoken
      start = false;
      end_t = sampleTime * i;
      stamps.set(word, { start: start_t, end: end_t });
      // bug investigation
      if (end_t-start_t > 178){
        stampDiff.set(word, {diff: end_t-start_t});
      }
      // word is incremented only if the current word is done being spoken
      word++;
    }
    i++;
  }
  // bug investigation
  let diffAvg = 0;
  stampDiff.forEach(word => {
    diffAvg += word.diff;
  });
  diffAvg = diffAvg/stampDiff.size;
  console.log('Timestamp Differences: '+stampDiff.size);
  console.log('Timestamp Diff Average: '+diffAvg);
  return stamps;
}

module.exports = getStamps;
