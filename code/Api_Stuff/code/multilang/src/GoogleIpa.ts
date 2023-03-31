import * as fs from 'fs';

function getPhonetics(sentence: string, languageCode: string): Promise<string> {
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
          } else {
            phonetics += `[${word}] `;
          }
        } else {
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


const ipaToCmu: { [key: string]: string } = {
  "ʌ": "AH",
  "ɑ": "AA",
  "æ": "AE",
  "eɪ": "EY",
  "ə": "AH",
  "ɛ": "EH",
  "i": "IH",
  "aɪ": "AY",
  "oʊ": "OW",
  "ɔ": "AO",
  "aʊ": "AW",
  "ʊ": "UH",
  "u": "UW",
  "ɚ": "ER",
  "b": "B",
  "d": "D",
  "f": "F",
  "g": "G",
  "h": "H",
  "j": "Y",
  "k": "K",
  "l": "L",
  "m": "M",
  "n": "N",
  "ŋ": "NG",
  "p": "P",
  "r": "R",
  "s": "S",
  "ʃ": "SH",
  "t": "T",
  "tʃ": "CH",
  "θ": "TH",
  "ð": "DH",
  "v": "V",
  "w": "W",
  "z": "Z",
  "ʒ": "ZH"
};

const cmuToMouthShape: { [key: string]: string } = {
  "AA": "mouth_open_wide.svg",
  "AE": "mouth_slightly_open.svg",
  "AH": "mouth_open_wide.svg",
  //... Add the rest of the mappings
};

function ipaToMouthShape(ipaTranscription: string): string {
  const cmuTranscription = ipaToCmu[ipaTranscription];
  if (!cmuTranscription) {
    throw new Error(`IPA symbol not found: ${ipaTranscription}`);
  }
  const mouthShape = cmuToMouthShape[cmuTranscription];
  if (!mouthShape) {
    throw new Error(`CMU phoneme not found: ${cmuTranscription}`);
  }
  return mouthShape;
}

const ipaTranscription = "tʃ"; // Replace with the desired IPA symbol
console.log(ipaToMouthShape(ipaTranscription));


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