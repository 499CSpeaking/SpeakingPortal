"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonemeOccurrences = void 0;
const gaussian_1 = require("./filtering/gaussian");
/*
    This class takes all phonemes from the transcript and gives each of them an array of floats.
    Each index corresponds to a contiguous point in time. A zero value at that index means the
    phoneme is not currently being spoken, a non-zero value means the phoneme is being spoken. The
    exact value is non-binary due to low-pass filtering that smooths out the arrays
*/
class PhonemeOccurrences {
    constructor(config, mappings) {
        this.config = config;
        this.arraySize = Math.ceil(config.phoneme_samples_per_second * config.video_length);
        this.occurrences = this.initOccurrences(mappings);
    }
    // populate the occurrences array
    initOccurrences(mappings) {
        const allPhonemes = mappings.presentPhonemes();
        const phonemeOccurrences = new Map;
        // initialize the phoneme arrays
        for (let key of allPhonemes) {
            phonemeOccurrences.set(key, new Array(this.arraySize).fill(0));
        }
        // fill arrays with 1s and 0s
        for (let step = 0; step < this.arraySize; step += 1) {
            const spokenPhoneme = mappings.getAtTime(step / this.config.phoneme_samples_per_second);
            if (spokenPhoneme) {
                phonemeOccurrences.get(spokenPhoneme)[step] = 1;
            }
        }
        // low pass all the arrays
        let filter = new gaussian_1.GaussianFilter(this.config.filter_kernel_size, this.config.filter_kernel_variance);
        for (let key of allPhonemes) {
            const filtered = filter.filter(phonemeOccurrences.get(key));
            phonemeOccurrences.set(key, filtered);
        }
        return phonemeOccurrences;
    }
    // get the phoneme that has the highest "speaking score" at a particular instance in time
    getDominantPhonemeAt(seconds) {
        let sampleAt = Math.round(seconds * this.config.phoneme_samples_per_second);
        if (sampleAt >= this.arraySize) {
            // cannot sample outside what's stored
            return undefined;
        }
        // get a max value
        let phoneme = undefined;
        let maxAmount = 0;
        for (let currentPhoneme of this.occurrences.keys()) {
            const sample = this.occurrences.get(currentPhoneme)[sampleAt];
            if (sample > maxAmount) {
                maxAmount = sample;
                phoneme = currentPhoneme[0];
            }
        }
        if (maxAmount < this.config.phoneme_idle_threshold) {
            // phonemes which are excessively small are considered non-present
            return undefined;
        }
        return [phoneme, maxAmount];
    }
}
exports.PhonemeOccurrences = PhonemeOccurrences;
