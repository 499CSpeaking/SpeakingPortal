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
const speech = require('@google-cloud/speech');
const fs_1 = __importDefault(require("fs"));
const gcloudopt = {
    keyFilename: 'C:\\Users\\John\\Downloads\\inlaid-vehicle-205302-744632b17188.json',
    projectId: 'My Project 11240',
};
const client = new speech.SpeechClient(gcloudopt);
// The ID of your GCS bucket
const bucketName = 'kukarellaspeech';
// The path to your file to upload
// file is up a level in a folder called upload and is called two.mp3
const filePath = '../upload/two.mp3';
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage(gcloudopt);
function uploadFile() {
    return __awaiter(this, void 0, void 0, function* () {
        // parse file name from filepath
        const fileName = filePath.split('/').pop();
        const options = { destination: fileName };
        // await storage.bucket(bucketName).upload(filePath, options);
        console.log(`${filePath} uploaded to ${bucketName}`);
        language(fileName, 'en-US');
    });
}
uploadFile().catch(console.error);
function language(name, languageCode) {
    return __awaiter(this, void 0, void 0, function* () {
        // The path to the remote LINEAR16 file stored in Google Cloud Storage
        const gcsUri = 'gs://kukarellaspeech/' + name;
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            uri: gcsUri,
        };
        const config = {
            encoding: 'MP3',
            sampleRateHertz: 16000,
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
            fs_1.default.writeFileSync('output.json', JSON.stringify(outputJson, null, 2));
        }));
        // fs.writeFileSync('output.json', JSON.stringify(outputJson, null, 2));
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
        const filePath = `../ipadict/${languageCode}.txt`;
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
        'ɔ': 'AO',
        'ɑ': 'AA',
        'i': 'IY',
        'u': 'UW',
        'e': 'EH',
        'ɛ': 'EH',
        'ɪ': 'IH',
        'ʊ': 'UH',
        'ʌ': 'AH',
        'ə': 'AX',
        'æ': 'AE',
        'eɪ': 'EY',
        'aɪ': 'AY',
        'oʊ': 'OW',
        'aʊ': 'AW',
        'ɔɪ': 'OY',
        'p': 'P',
        'b': 'B',
        't': 'T',
        'd': 'D',
        'k': 'K',
        'g': 'G',
        'tʃ': 'CH',
        'dʒ': 'JH',
        'f': 'F',
        'v': 'V',
        'θ': 'TH',
        'ð': 'DH',
        's': 'S',
        'z': 'Z',
        'ʃ': 'SH',
        'ʒ': 'ZH',
        'h': 'HH',
        'm': 'M',
        'n': 'N',
        'ŋ': 'NG',
        'l': 'L',
        'r': 'R',
        'ɜr': 'ER',
        'ər': 'AXR',
        'w': 'W',
        'j': 'Y',
        'ɝ': 'UR',
        'ɚ': 'UR',
        'ɹ': 'R',
        'ɫ': 'L',
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
