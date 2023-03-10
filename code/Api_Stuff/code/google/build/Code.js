"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const https = __importStar(require("https")); // or 'https' for https:// URLs
const fs = __importStar(require("fs"));
function mainf() {
    // ask user if they want to use google or amazon in the console
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Do you want to use google or amazon? ', (answer) => {
        // if google
        if (answer === 'google') {
            google();
        }
        if (answer === 'amazon') {
            amazon();
        }
    });
}
mainf();
function google() {
    // upload file to google bucket
    // file is in C:\Users\John\Downloads\audio.mp3
    (0, child_process_1.exec)('gcloud storage cp C:\\Users\\John\\Downloads\\audio.mp3 gs://kukarellaspeech', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log('file uploaded');
        googlespeech();
    });
}
function googlespeech() {
    (0, child_process_1.exec)('gcloud ml speech recognize gs://kukarellaspeech/audio.mp3 --language-code=en-US --include-word-time-offsets', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        saveFile(stdout);
        console.log('speech recognized');
    });
}
function amazon() {
    // upload file to amazon bucket
    // file is in C:\Users\John\Downloads\audio.mp3
    (0, child_process_1.exec)('aws s3 cp C:\\Users\\John\\Downloads\\audio.mp3 s3://audiobinkukarella', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log('file uploaded');
        amazonspeech();
    });
}
function amazonspeech() {
    //generate random name for job
    let r = (Math.random() + 1).toString(36).substring(7);
    let audio = 'aws transcribe start-transcription-job --region us-west-2 --transcription-job-name testaudio' + r + ' --media MediaFileUri=s3://audiobinkukarella/audio.mp3 --language-code en-US';
    (0, child_process_1.exec)(audio, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log('speech recognized');
        // wait 2 seconds
        setTimeout(function () {
            tryAmazondownload(r);
        }, 2000);
    });
}
function tryAmazondownload(name) {
    // if "TranscriptionJobStatus" = "IN_PROGRESS" then try again in 2 seconds
    let audio = 'aws transcribe get-transcription-job --region us-west-2 --transcription-job-name testaudio' + name;
    (0, child_process_1.exec)(audio, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.log('speech recognized');
        if (stdout.includes('IN_PROGRESS')) {
            setTimeout(function () {
                tryAmazondownload(name);
                // console.log('try again');
                console.log('processing');
            }, 2000);
        }
        else if (stdout.includes('COMPLETED')) {
            parseAmazon(stdout);
        }
    });
}
function parseAmazon(stdout) {
    // find the https:// link in the response
    // download the file to Downloads
    // find the https:// link in the response
    // console.log(stdout);
    console.log(stdout);
    let link = stdout.split('https://')[1];
    link = link.split('\"')[0];
    console.log(link);
    // download the file to Downloads
    // with out using curl
    //
    https.get('https://' + link, (res) => {
        // Image will be stored at this path
        const path = "C:\\Users\\John\\Downloads\\Output.json";
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish', () => {
            filePath.close();
            console.log('Download Completed');
        });
    });
    console.log('file saved');
}
function saveFile(stdout) {
    // save the result to a file
    const fs = require('fs');
    fs.writeFile('C:\\Users\\John\\Downloads\\Output.json', stdout, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('file saved');
    });
}
// google
// my bucket is kukarellaspeech
// to move to bucket
// gcloud storage cp OBJECT_LOCATION gs://kukarellaspeech
// we first install google cloud sdk
// then set GOOGLE_APPLICATION_CREDENTIALS to the path of the json file
// then we run gcloud auth application-default login
// if short use recognize
// if long (>60 sec) use recognize-long-running and  --async
// if long use we retrun { "name": OPERATION_ID }
// then get result using gcloud ml speech operations wait OPERATION_ID
// we want to use the --include-word-time-offsets for the word time offset
// if file is in bucket
// gcloud ml speech recognize 'gs://kukarellaspeech/day.mp3'
// --language-code='en-US' --include-word-time-offsets
// google
// if file is not in bucket
// gcloud ml speech recognize PATH-TO-LOCAL-FILE --language-code='en-US' --include-word-time-offsets
// Amazon
// my bucket is audiobinkukarella
// install see https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html
// move file to bucket
// aws s3 mv filename.txt s3://audiobinkukarella
// if file is in bucket
// aws transcribe start-transcription-job
// --region us-west-2
// --transcription-job-name testaudio
// --media MediaFileUri=s3://audiobinkukarella/day.mp3
// --language-code en-US
// then run
//aws transcribe get-transcription-job
//--region us-west-2
// --transcription-job-name testaudio
// if response is in progress
