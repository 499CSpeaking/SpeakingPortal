import * as fs from 'fs';
import * as path from 'path';
import fetch from "node-fetch";
import * as readline from 'readline';

let workingDict = new Map();

// TODO 
// Audio processing helper
function getStampData(){

}

// TODO
// Audio Processing and Timestamping
// src is the path to the audio file
function getStamps(src){
    // read in audio file
    
    // get each sample value in the file
    
    // for each value, convert to uint8

    // initialize start boolean to false

    // if the new value is > 0, mark the timestamp, set start to true if false

    // if new value is == 0 and start is true, mark the timestamp, set start to false

    // keep looping above until eof

    // return array values that correspond to each word in sequence of appearance as an integer
    return src;
}

module.exports = getStamps;