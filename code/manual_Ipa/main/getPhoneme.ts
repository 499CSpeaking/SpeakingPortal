import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";

function getDict() {
    let dict = fs.readFileSync('./dict2.txt', 'utf-8');
    return dict;
}

// return ipa associated with word
function getIpa(word) {
    return word;
}

function getPhoneme(input) {
    // read script and dictionary
    let script = input;
    let dict = getDict();

    // make key=>value map 
    let phoScript = new Map<string, any>;

    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for (let i = 0; i < script.length; i++) {
        if (dict[i].includes(script[i]) && !(phoScript.has(script[i]))) {
            phoScript.set(script[i], getIpa(script[i]));
        }
    }

    return phoScript;
}

module.exports = getPhoneme;