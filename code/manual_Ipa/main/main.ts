import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";

function  genIpa(){
    // read script and dictionary
    let script = fs.readFileSync('../script.txt');
    let dict = fs.readFileSync('../dict.txt');

    // make key>value map 
    let ipaScript = new Map<string, string>;
    
    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for (let i = 0; i < script.size; i++) {
        if (dict[i].includes(script[i])){
            ipaScript.set('ipa'+i, dict.getIPA(script[i]));
        }
    }
}