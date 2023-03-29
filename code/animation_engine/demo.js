"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const main_1 = require("./main");
const fs_1 = require("fs");
const https_1 = require("https");
const child_process_1 = require("child_process");
// assume that the gentle container is running, and that it's 8765-something port is mapped to 8080
// on the host machine
// this code is messy and shit. It's good for a demo though
//modify this
const inputString = "Hello, this is the demo code.";
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // get audio from kukarella
        console.log(`getting synthesized speech from Kukarella w/ prompt "${inputString}"`);
        getAudio(inputString, (inputString, audioPath) => {
            // get transcript from gentle
            console.log(`getting phoneme mapping w/ text="${inputString}", audio=@${audioPath}`);
            getTranscript(inputString, audioPath, (audioPath, transcriptPath) => __awaiter(this, void 0, void 0, function* () {
                console.log('generating the video now');
                /*
                    Notice how I pass parameters into run(...)
                */
                const config = new Object();
                //config.phoneme_samples_per_second = 22
                //config.key = ...
                const out = yield (0, main_1.run)("./demo_files/inputs.json", config);
                console.log('done! Video is located at ' + out);
                (0, process_1.exit)();
            }));
        });
    });
}
function getAudio(inputString, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const kukarella_api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview";
        const payload = {
            text: inputString,
            voiceKey: 'en-US_AllisonV3Voice',
        };
        const api_response = yield fetch(kukarella_api_url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const audio_url = (yield api_response.json()).data.url;
        (0, https_1.get)(audio_url, (res) => {
            const path = "demo_files/tmp/audio.wav";
            const writeStream = (0, fs_1.createWriteStream)(path);
            res.pipe(writeStream);
            writeStream.on("finish", () => {
                writeStream.close();
                console.log("Download Completed!");
                callback(inputString, path);
            });
        });
    });
}
function getTranscript(text, audioPath, callback) {
    //have to 
    const curlCommand = `curl -F "audio=@${audioPath}" -F "transcript=${text}" "http://localhost:8080/transcriptions?async=false"`;
    const output = (0, child_process_1.execSync)(curlCommand).toString();
    (0, fs_1.writeFileSync)('demo_files/tmp/transcript.json', output);
    callback(audioPath, 'demo_files/tmp/transcript.json');
}
start();
