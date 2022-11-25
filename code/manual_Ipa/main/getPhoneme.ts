import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";
import * as readline from 'readline';

let workingDict = new Map();

// reads files line by line and returns an array of lines
async function readByLine(path){
    let out = ['empty'];
    let i = 0;
    let fin = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: Infinity
    });

    for await (const line of fin) {
        out[i] = line;
        i++;
    }
    console.log('success');
    return out;
}

// formats dictionary into key value pairs of words to phonemes. Phonetic characters are sent as an array of strings for each phoneme
// data structure example: {'ABBEY', ['AE', 'B', 'IY']}
// rationale: having an array of strings for phonemes may make it easier to assign art assets during video generation
async function getDict() {
    let dict = await readByLine('./dict2.txt');
    let dictF = new Map();
    for (let i = 0; i < dict.length; i++){
        let line = dict[i].split("\t");
        let key = line[0].toLowerCase();
        let values = line[1].split(" ");
        dictF.set(key,values);
    }
    console.log('success');
    return dictF;
}

// return ipa associated with word
function getIpa(word) {
    return workingDict.get(word);
}

async function getPhoneme(input) {
    // read script and dictionary and audio path{temp}
    let script = input.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g,"").split(" ");
    workingDict = await getDict();
   
   // to be done client side
    //let audio = './audio/Benjamin.mp3';
    
    // process audio to get timestamps
    //getStamps(audio);
    
    // make key=>value map 
    let phoScript = new Map();

    // for each word in the script, generate a key>value pair that has a
    // word from the script with a phoneme related to that word
    for await (const word of script) {
        if (workingDict.has(word) && !(phoScript.has(word))) {
            phoScript.set(word, getIpa(word));
        }
        console.log(word);
        console.log(getIpa(word));
    }

    return phoScript;
}

module.exports = getPhoneme;