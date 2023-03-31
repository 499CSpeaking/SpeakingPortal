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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const speech = require('@google-cloud/speech');
const fs_1 = __importDefault(require("fs"));
const gcloudopt = {
    keyFilename: 'C:\\Users\\John\\Downloads\\inlaid-vehicle-205302-744632b17188.json',
    projectId: 'My Project 11240',
};
// this is a simple path, use the system path to your key file for production
const client = new speech.SpeechClient(gcloudopt);
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage(gcloudopt);
function uploadFile(filepath, languagetype) {
    return __awaiter(this, void 0, void 0, function* () {
        // The ID of your GCS bucket
        const bucketName = 'kukarellaspeech';
        // parse file name from filepath
        const fileName = filepath.split('/').pop();
        const options = { destination: fileName };
        yield storage.bucket(bucketName).upload(filepath, options);
        console.log(`${filepath} uploaded to ${bucketName}`);
        yield language(fileName, languagetype);
    });
}
exports.uploadFile = uploadFile;
function language(name, languageCode) {
    return __awaiter(this, void 0, void 0, function* () {
        // The path to the remote LINEAR16 file stored in Google Cloud Storage
        const gcsUri = 'gs://kukarellaspeech/' + name;
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            uri: gcsUri,
        };
        // get encoding from file
        var enc = name.split('.').pop();
        const config = {
            encoding: enc,
            languageCode: languageCode,
            enableWordTimeOffsets: true, // this is what we care about as we need offsets
        };
        const request = {
            audio: audio,
            config: config,
        };
        // Detects speech in the audio file
        const [response] = yield client.recognize(request);
        response.results.forEach((result) => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(result.alternatives.map((alternative, index) => __awaiter(this, void 0, void 0, function* () {
                if (index === 0) {
                    outputJson.transcript = alternative.transcript;
                }
                const tempWords = yield Promise.all(alternative.words.map((item, wordIndex) => __awaiter(this, void 0, void 0, function* () {
                    const s = parseInt(item.startTime.seconds) + item.startTime.nanos / 1000000000;
                    const e = parseInt(item.endTime.seconds) + item.endTime.nanos / 1000000000;
                    console.log(item.word);
                    const phones = yield phoneticsSync(item.word, languageCode, s, e);
                    const word = {
                        alignedWord: item.word,
                        case: 'success',
                        end: e,
                        endOffset: outputJson.transcript.indexOf(item.word) + item.word.length,
                        phones,
                        start: s,
                        startOffset: outputJson.transcript.indexOf(item.word),
                        word: item.word,
                    };
                    return word;
                })));
                outputJson.words = outputJson.words.concat(tempWords);
            })));
            fs_1.default.writeFileSync('./demo_files/transcript.json', JSON.stringify(outputJson, null, 2));
        }));
    });
}
function phoneticsSync(word, languageCode, wordStartTime, wordEndTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const phonetics = yield getPhonetics(word, languageCode);
        const wordDuration = wordEndTime - wordStartTime;
        const totalPhonemes = phonetics.length;
        const averageDuration = wordDuration / totalPhonemes;
        const phones = [];
        phonetics.forEach((phone) => {
            const arpabetPhoneArray = ipaToArpabetWithExtraSymbols(phone);
            arpabetPhoneArray.forEach((arpabetPhone, index) => {
                const duration = averageDuration;
                // upper case the phone
                arpabetPhone = arpabetPhone.toUpperCase();
                phones.push({
                    duration,
                    phone: arpabetPhone,
                });
            });
        });
        return phones;
    });
}
const outputJson = {
    transcript: '',
    words: [],
};
function getPhonetics(sentence, languageCode) {
    return new Promise((resolve, reject) => {
        const filePath = `./ipadict/${languageCode}.txt`;
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file: ${err.message}`);
                return;
            }
            // Split the text file into an array of lines
            const lines = data.split(/\r?\n/);
            const words = sentence.split(' ');
            const phonetics = [];
            for (const word of words) {
                const lowerCaseWord = word.toLowerCase();
                const line = lines.find(l => l.startsWith(lowerCaseWord));
                if (line) {
                    const phoneticMatch = line.match(/\/(.+?)\//);
                    if (phoneticMatch) {
                        phonetics.push(phoneticMatch[1]);
                    }
                    else {
                        phonetics.push(`[${word}]`);
                    }
                }
                else {
                    phonetics.push(`[${word}]`);
                }
            }
            resolve(phonetics);
        });
    });
}
function ipaToArpabetWithExtraSymbols(ipa) {
    const arpabetConversions = {
        //amoɾ
        "ɔ": "o",
        "ɑ": "aa",
        "i": "i",
        "u": "u",
        "e": "e",
        "ɛ": "eh",
        "ɪ": "ih",
        "ʊ": "uh",
        "ʌ": "v",
        "ə": "er",
        "æ": "ae",
        "eɪ": "ey",
        "aɪ": "ay",
        "oʊ": "ow",
        "aʊ": "aw",
        "ɔɪ": "oy",
        "p": "p",
        "b": "b",
        "t": "t",
        "d": "d",
        "k": "k",
        "g": "g",
        "tʃ": "ch",
        "dʒ": "jh",
        "f": "f",
        "v": "v",
        "θ": "th",
        "ð": "dh",
        "s": "s",
        "z": "z",
        "ʃ": "sh",
        "ʒ": "zh",
        "h": "h",
        "m": "m",
        "n": "n",
        "ŋ": "ng",
        "l": "l",
        "r": "r",
        "ɜr": "er",
        "ər": "er",
        "w": "w",
        "j": "y",
        "ɝ": "er",
        "ɚ": "er",
        "ɹ": "r",
        "ɫ": "l",
        "a": "a",
        "o": "o",
        "ɾ": "r",
    };
    const ipaSymbols = Object.keys(arpabetConversions);
    const ipaRegex = new RegExp(ipaSymbols.join('|'), 'g');
    const convertedArray = [];
    ipa.replace(ipaRegex, (match) => {
        convertedArray.push(arpabetConversions[match]);
        return match;
    });
    return convertedArray;
}
