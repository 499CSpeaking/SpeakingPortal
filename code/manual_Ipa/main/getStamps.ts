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
  let silence = [0];
  let thresh = 128;
  let freqs = wav.getSamples(false, Uint8Array);
  while (i < freqs.length) {
    try {
      // get the value of a single sample from the wave file
      // range: -32768 to 32767 for 16 bit audio
      //   let samVal = wav.getSample(i);
      //   let nextVal = wav.getSample(i + 1);
      let samVal = freqs[i];
      let trueEnd =
        freqs[i + 1] == thresh &&
        freqs[i + 2] == thresh &&
        freqs[i + 3] == thresh &&
        freqs[i + 4] == thresh &&
        freqs[i + 5] == thresh;
      if (samVal >= 250 && start == false) {
        // start is set to true when a word hasn't been already started
        start = true;
        // 48 is used here since one sample is roughly equivalent to 48ms of audio
        start_t = 48 * i;
      } else if (
        samVal == 0 &&
        /*nextVal == samVal &&*/
        trueEnd == true &&
        start == true
      ) {
        // start i set to false when the last audible portion of the word is spoken
        start = false;
        end_t = 48 * i;
        stamps.set(word, { start: start_t, end: end_t });
        // word is incremented only if the current word is done being spoken
        word++;
      }
      i++;
    } catch (e) {
      console.log(
        "Out of values, or failed to get stample data at index: " + i
      );
      break;
    }
  }
  return stamps;
}

module.exports = getStamps;
