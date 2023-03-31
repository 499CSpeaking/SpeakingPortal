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
const fs = __importStar(require("fs"));
function getPhonetics(sentence, languageCode) {
    return new Promise((resolve, reject) => {
        const filePath = `../ipadict/${languageCode}.txt`;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(`Error reading file: ${err.message}`);
                return;
            }
            // Split the text file into an array of lines
            const lines = data.split(/\r?\n/);
            const words = sentence.split(' ');
            let phonetics = '';
            for (const word of words) {
                const lowerCaseWord = word.toLowerCase();
                const line = lines.find(l => l.startsWith(lowerCaseWord));
                if (line) {
                    const phoneticMatch = line.match(/\/(.+?)\//);
                    if (phoneticMatch) {
                        phonetics += phoneticMatch[1] + ' ';
                    }
                    else {
                        phonetics += `[${word}] `;
                    }
                }
                else {
                    phonetics += `[${word}] `;
                }
            }
            resolve(phonetics.trim());
        });
    });
}
getPhonetics('the big dog is cool', 'en_US')
    .then(phonetics => console.log('Phonetics:', phonetics))
    .catch(err => console.error('Error:', err));
/*
ar 	Arabic (Modern Standard)
de 	German
en_UK 	English (Received Pronunciation)
en_US 	English (General American)
eo 	Esperanto
es_ES 	Spanish (Spain)
es_MX 	Spanish (Mexico)
fa 	Persian
fi 	Finnish
fr_FR 	French (France)
fr_QC 	French (Québec)
is 	Icelandic
ja 	Japanese
jam 	Jamaican Creole
km 	Khmer
ko 	Korean
ma 	Malay (Malaysian and Indonesian)
nb 	Norwegian Bokmål
nl 	Dutch
or 	Odia
ro 	Romanian
sv 	Swedish
sw 	Swahili
tts 	Isan
vi_C 	Vietnamese (Central)
vi_N 	Vietnamese (Northern)
vi_S 	Vietnamese (Southern)
yue 	Cantonese
zh 	Mandarin
*/ 
