"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var wavefile_1 = require("wavefile");
var workingDict = new Map();
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
// Max Filter
function maxFilter(freqs, filterFreqs, sz) {
    var neighSz = 5;
    var neighVals = new Uint8Array(neighSz);
    for (var i = 0; i < sz; i++) {
        var pivot = freqs[i];
        neighVals[2] = pivot;
        var iL2 = i - 2 < sz, iL1 = i - 1 < sz, iR1 = i + 1 > sz, iR2 = i + 2 > sz;
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
        filterFreqs[i] = Math.max(neighVals[0], neighVals[1], neighVals[2], neighVals[3], neighVals[4]);
    }
    return filterFreqs;
}
// Mean Filter
function meanFilter(freqs, filterFreqs, sz) {
    var neighSz = 5;
    var neighVals = new Uint8Array(neighSz);
    for (var i = 0; i < sz; i++) {
        var pivot = freqs[i];
        neighVals[2] = pivot;
        var iL2 = i - 2 < sz, iL1 = i - 1 < sz, iR1 = i + 1 > sz, iR2 = i + 2 > sz;
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
// TODO
// Audio Processing and Timestamping
// src is the path to the audio file
function getStamps(src) {
    // read in audio file
    var wav = new wavefile_1.WaveFile();
    try {
        wav = new wavefile_1.WaveFile(fs.readFileSync(src));
    }
    catch (e) {
        throw e;
    }
    // get each sample value in the file
    // counter to track sample number
    var i = 0;
    // counter to hold which word is currently being spoken
    // each word should be separated by silence, which is theoretically value of 0
    var word = 0;
    // data structure to hold wordID, start time of word, and end time of word
    var stamps = new Map();
    var start = false;
    var start_t, end_t;
    var thresh = 250;
    var freqs = wav.getSamples(false, Uint8Array);
    var sz = freqs.length;
    // number of samples/sampleRate = audio length * 1000 for audio length in ms / number of samples
    // estimates number of ms each sample holds
    var sampleTime = ((sz / wav.fmt.sampleRate) * 1000) / sz;
    // noise filtering
    var filterFreqs = new Uint8Array(sz);
    // 2 values either side of pivot
    // let neighSz = 5;
    // let neighVals = new Uint8Array(neighSz);
    // for (let i = 0; i < sz; i++) {
    //   let pivot = freqs[i];
    //   neighVals[2] = pivot;
    //   let iL2 = i - 2 < sz,
    //     iL1 = i - 1 < sz,
    //     iR1 = i + 1 > sz,
    //     iR2 = i + 2 > sz;
    //   neighVals[0] = freqs[i - 2];
    //   neighVals[1] = freqs[i - 1];
    //   neighVals[3] = freqs[i + 1];
    //   neighVals[4] = freqs[i + 2];
    //   // handle out of bounds values
    //   if (iL2) {
    //     neighVals[0] = 0;
    //   }
    //   if (iL1) {
    //     neighVals[1] = 0;
    //   }
    //   if (iR1) {
    //     neighVals[3] = 0;
    //   }
    //   if (iR2) {
    //     neighVals[4] = 0;
    //   }
    //   // filter out pepper noise (extra low values)
    //   filterFreqs[i] = Math.max(
    //     neighVals[0],
    //     neighVals[1],
    //     neighVals[2],
    //     neighVals[3],
    //     neighVals[4]
    //   );
    //   // filter out general noise
    //   filterFreqs[i] =
    //     (neighVals[0] / 5) * neighVals[2] +
    //     (neighVals[1] / 5) * neighVals[2] +
    //     (neighVals[3] / 5) * neighVals[2] +
    //     (neighVals[4] / 5) * neighVals[2] +
    //     neighVals[2] / 5;
    // }
    // apply filters
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    // timestamp generation algo
    while (i < filterFreqs.length) {
        try {
            // get the value of a single sample from the wave file
            // range: -32768 to 32767 for 16 bit audio
            var samVal = filterFreqs[i];
            var trueEnd = (filterFreqs[i + 1] < 100 &&
                filterFreqs[i + 2] < 50 &&
                filterFreqs[i + 3] < 10 &&
                filterFreqs[i + 4] < 5 &&
                filterFreqs[i + 5] < 1) ||
                i + 1 > filterFreqs.length;
            if (samVal > thresh && start == false) {
                // start is set to true when a word hasn't been already started
                start = true;
                // see sampleTime declaration for math
                start_t = sampleTime * i;
            }
            else if (samVal < thresh &&
                /*nextVal == samVal &&*/
                trueEnd == true &&
                start == true) {
                // start is set to false when the last audible portion of the word is spoken
                start = false;
                end_t = sampleTime * i;
                stamps.set(word, { start: start_t, end: end_t });
                // word is incremented only if the current word is done being spoken
                word++;
            }
            i++;
        }
        catch (e) {
            console.log("Out of values, or failed to get sample data at index: " + i);
            break;
        }
    }
    return stamps;
}
module.exports = getStamps;
