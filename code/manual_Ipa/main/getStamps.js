"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// library requirements
var fs = require("fs");
var wavefile_1 = require("wavefile");
// median filter
function medianFilter(freqs, filterFreqs, sz) {
    // define neighborhood
    var neighSz = 5;
    // create temp array for neighborhood values
    var neighVals = new Uint8Array(neighSz);
    for (var i = 0; i < sz; i++) {
        // set pivot to be value at freqs[i]
        var pivot = freqs[i];
        // set neighborhood center element [2] to pivot
        neighVals[2] = pivot;
        // check for OOB values
        var iL2 = i - 2 < sz, iL1 = i - 1 < sz, iR1 = i + 1 > sz, iR2 = i + 2 > sz;
        // set rest of neighborhood values
        neighVals[0] = freqs[i - 2];
        neighVals[1] = freqs[i - 1];
        neighVals[3] = freqs[i + 1];
        neighVals[4] = freqs[i + 2];
        // handle OOB values
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
        // sort neighborhood values from smallest to largest
        neighVals.sort(function (a, b) { return a - b; });
        // set output[i] to new center element of neighborhood
        filterFreqs[i] = neighVals[2];
    }
    // return output array
    return filterFreqs;
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
        // new mean filtering algo
        // currently produces better results than old algo
        filterFreqs[i] = Math.round((neighVals[0] + neighVals[1] + neighVals[2] + neighVals[3] + neighVals[4]) / neighSz);
    }
    return filterFreqs;
}
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
    // each word should be separated by some level of silence
    var word = 0;
    // data structure to hold wordID, start time of word, and end time of word
    var stamps = new Map();
    var start = false;
    var start_t, end_t;
    // bug fixing values
    var stampDiff = new Map();
    // threshold to determine if there is substantial enough sound to count as a word
    var thresh = 12;
    // get the samples present in audio
    var freqs = wav.getSamples(false, Uint8Array);
    var sz = freqs.length;
    // number of samples/sampleRate = audio length * 1000 for audio length in ms / number of samples
    // estimates number of ms each sample holds
    var sampleTime = ((sz / wav.fmt.sampleRate) * 1000) / sz;
    // noise filtering
    var filterFreqs = new Uint8Array(sz);
    // apply filters
    // multiple calls to each filter is needed to decrease noise and smooth the values
    // multiple max filter calls decreases variance
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    filterFreqs = maxFilter(freqs, filterFreqs, sz);
    // mean filter calls serve to smooth random large jumps
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    filterFreqs = meanFilter(filterFreqs, filterFreqs, sz);
    // timestamp generation algo
    while (i < filterFreqs.length) {
        // get the value of a single sample from the wave file
        // range: -32768 to 32767 for 16 bit audio, but I'm mapping to 0-255 range
        var samVal = filterFreqs[i];
        var trueEnd = (filterFreqs[i + 1] < 10 &&
            filterFreqs[i + 2] < 5 &&
            filterFreqs[i + 3] < 1) ||
            i + 1 > filterFreqs.length;
        // let trueStart =
        //   (filterFreqs[i + 1] > 8 &&
        //     filterFreqs[i + 2] > 10 &&
        //     filterFreqs[i + 3] > 12);
        // trueStart was introduced to help reduce false positives, but 
        // current implementation seems the be ineffective so it will remain scrapped for now
        if (samVal > thresh /*&& trueStart*/ && start == false) {
            // start is set to true when a word hasn't been found yet
            start = true;
            // see sampleTime declaration for math
            start_t = sampleTime * i;
        }
        else if (samVal < thresh &&
            trueEnd == true &&
            start == true) {
            // start is set to false when the last audible portion of the word is spoken
            start = false;
            end_t = sampleTime * i;
            stamps.set(word, { start: start_t, end: end_t });
            // bug investigation
            if (end_t - start_t > 35) {
                stampDiff.set(word, { diff: end_t - start_t });
            }
            // word is incremented only if the current word is done being spoken
            word++;
        }
        i++;
    }
    // bug investigation
    var diffAvg = 0;
    stampDiff.forEach(function (word) {
        diffAvg += word.diff;
    });
    diffAvg = diffAvg / stampDiff.size;
    console.log('Timestamp Differences: ' + stampDiff.size);
    console.log('Timestamp Diff Average: ' + diffAvg);
    // so far it seems like after fixing the mean filter implementation, stamp accuracy is better
    // currently, using the difference between start and end seems too extreme, as it limits the
    // amount of stamps by a very large amount
    // currently, number of stamps has been reduced to 41-58, on a 42 word input
    // i am unsure of how to increase accuracy from here on
    return stamps;
}
module.exports = getStamps;
