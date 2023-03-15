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
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
function quickstart() {
    return __awaiter(this, void 0, void 0, function* () {
        // The path to the remote LINEAR16 file stored in Google Cloud Storage
        const gcsUri = 'gs://kukarellaspeech/two.mp3';
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            uri: gcsUri,
        };
        const config = {
            encoding: 'MP3',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            enableWordTimeOffsets: true, // this is what we care about as we need offsets
        };
        const request = {
            audio: audio,
            config: config,
        };
        // Detects speech in the audio file
        const [response] = yield client.recognize(request);
        response.results.forEach((result) => {
            result.alternatives.forEach((alternative) => {
                console.log(`Transcript: ${alternative.transcript}`);
                console.log(`Word details:`);
                console.log(` Word count ${alternative.words.length}`);
                alternative.words.forEach((item) => {
                    console.log(`  ${item.word}`);
                    const s = parseInt(item.startTime.seconds) +
                        item.startTime.nanos / 1000000000;
                    console.log(`   WordStartTime: ${s}s`);
                    const e = parseInt(item.endTime.seconds) +
                        item.endTime.nanos / 1000000000;
                    console.log(`   WordEndTime: ${e}s`);
                });
            });
        });
    });
}
quickstart();
