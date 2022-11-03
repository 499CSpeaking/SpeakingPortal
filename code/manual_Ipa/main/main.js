"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getDict() {
    var dict = fs.readFileSync('./dict.txt', {encoding: 'utf8'});
    console.log(dict);
    return dict;
}
// return ipa associated with word
function getIpa(word) {
    return word;
}
function genIpa() {
    // read script and dictionary
    var script = fs.readFileSync('./script.txt', 'utf-8');
    var dict = getDict();
    // make key>value map 
    var ipaScript = new Map;
    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for (var i = 0; i < script.length; i++) {
        if (dict[i].includes(script[i])) {
            ipaScript.set('ipa' + i, getIpa(script[i]));
        }
    }
}
getDict();
