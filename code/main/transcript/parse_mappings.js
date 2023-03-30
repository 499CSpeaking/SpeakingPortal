"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonemeMapping = void 0;
const interval_tree_1 = __importDefault(require("@flatten-js/interval-tree"));
/*
    this file's purpose is to take a transcript file (which represents a text-to-speech mapping) and
    parse it into an object that organizes phonemes
*/
class PhonemeMapping {
    constructor(config) {
        this.intervalTree = this.parseFile(config);
    }
    // get phoneme spoken at specific time
    getAtTime(seconds) {
        const phoneme = this.intervalTree.search([seconds, seconds]);
        return phoneme.length > 0 ? phoneme[0] : undefined;
    }
    parseFile(config) {
        const tree = new interval_tree_1.default();
        // the transcript is a JSON file
        const transcript = JSON.parse(config.transcript.toString());
        /*
            note: the exact format of the transcript folder is flexible, as this is a relatively
            easy thing to modify.

            parse the phonemes into a more usable data structure
        */
        for (let wordIdx = 0; wordIdx < transcript.words.length; wordIdx += 1) {
            const word = transcript.words[wordIdx];
            if (word.case == "success") {
                let cumulativeOffset = word.start;
                for (let phonemeIdx = 0; phonemeIdx < word.phones.length; phonemeIdx += 1) {
                    const phoneme = word.phones[phonemeIdx];
                    tree.insert([cumulativeOffset, cumulativeOffset + phoneme.duration], phoneme.phone.split('_')[0]);
                    cumulativeOffset += phoneme.duration;
                }
            }
        }
        return tree;
    }
    // gets the set of all phonemes spoken in this transcript
    presentPhonemes() {
        const set = new Set();
        this.intervalTree.forEach((key, val) => {
            set.add(val);
        });
        return set;
    }
}
exports.PhonemeMapping = PhonemeMapping;
