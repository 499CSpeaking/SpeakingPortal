import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";

function getDict() {
    let dict = fs.readFileSync('./dict.txt', 'utf-8');
    console.log(dict);
    return dict;
}

// return ipa associated with word
function getIpa(word) {
    return word;
}

function genIpa() {
    // read script and dictionary
    let script = fs.readFileSync('./script.txt', 'utf-8');
    let dict = getDict();

    // make key>value map 
    let ipaScript = new Map<string, any>;

    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for (let i = 0; i < script.length; i++) {
        if (dict[i].includes(script[i])) {
            ipaScript.set('ipa' + i, getIpa(script[i]));
        }
    }
}

getDict();