"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getDict() {
    var dict = fs.readFileSync('./dict2.txt', 'utf-8');
    return dict;
}
// return ipa associated with word
function getIpa(word) {
    return word;
}
function getPhoneme(input) {
    // read script and dictionary
    var script = input;
    var dict = getDict();
    // make key=>value map 
    var phoScript = new Map;
    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for (var i = 0; i < script.length; i++) {
        if (dict[i].includes(script[i]) && !(phoScript.has(script[i]))) {
            phoScript.set(script[i], getIpa(script[i]));
        }
    }
    return phoScript;
}
module.exports = getPhoneme;
