const speech = require('@google-cloud/speech');
import fs from 'fs';

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

export async function uploadFile(filepath:string) {
  // The ID of your GCS bucket
const bucketName = 'kukarellaspeech';
  // parse file name from filepath
  const fileName: string = filepath.split('/').pop() as string;
  const options = { destination: fileName };
  await storage.bucket(bucketName).upload(filepath, options);
  console.log(`${filepath} uploaded to ${bucketName}`);
  language(fileName, 'en-US');
}

async function language(name: string, languageCode: string) {
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
  const [response] = await client.recognize(request);

  response.results.forEach(async (result: { alternatives: any[]; }) => {
    await Promise.all(result.alternatives.map(async (alternative: { transcript: any; words: any[]; }, index: number) => {
      if (index === 0) {
        outputJson.transcript = alternative.transcript;
      }

      const tempWords: Word[] = await Promise.all(alternative.words.map(async (item: { word: any; startTime: { seconds: string; nanos: number; }; endTime: { seconds: string; nanos: number; }; }, wordIndex: number) => {
        const s = parseInt(item.startTime.seconds) + item.startTime.nanos / 1000000000;
        const e = parseInt(item.endTime.seconds) + item.endTime.nanos / 1000000000;
        const phones = await phoneticsSync(item.word, languageCode, s, e);
        const word: Word = {
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
      }));

      outputJson.words = outputJson.words.concat(tempWords);
    }));
    fs.writeFileSync('output.json', JSON.stringify(outputJson, null, 2));
  });


}
async function phoneticsSync(word: string, languageCode: string, wordStartTime: number, wordEndTime: number): Promise<Phone[]> {
  const phonetics = await getPhonetics(word, languageCode);
  const wordDuration = wordEndTime - wordStartTime;
  const totalPhonemes = phonetics.length;
  const averageDuration = wordDuration / totalPhonemes;

  const phones: Phone[] = [];

  phonetics.forEach((phone: string) => {
    const arpabetPhoneArray = ipaToArpabetWithExtraSymbols(phone);

    arpabetPhoneArray.forEach((arpabetPhone: string, index: number) => {
      const duration = averageDuration;
      phones.push({
        duration,
        phone: arpabetPhone,
      });
    });
  });

  return phones;
}

interface Phone {
  duration: number;
  phone: string;
}

interface Word {
  alignedWord: string;
  case: string;
  end: number;
  endOffset: number;
  phones: Phone[];
  start: number;
  startOffset: number;
  word: string;
}

interface OutputJson {
  transcript: string;
  words: Word[];
}

const outputJson: OutputJson = {
  transcript: '',
  words: [],
};


function getPhonetics(sentence: string, languageCode: string): Promise<string[]> {
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

      const phonetics: string[] = [];
      for (const word of words) {
        const lowerCaseWord = word.toLowerCase();
        const line = lines.find(l => l.startsWith(lowerCaseWord));

        if (line) {
          const phoneticMatch = line.match(/\/(.+?)\//);

          if (phoneticMatch) {
            phonetics.push(phoneticMatch[1]);
          } else {
            phonetics.push(`[${word}]`);
          }
        } else {
          phonetics.push(`[${word}]`);
        }
      }

      resolve(phonetics);
    });
  });
}
function ipaToArpabetWithExtraSymbols(ipa: string): string[] {
  const arpabetConversions: { [key: string]: string } = {
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

  const convertedArray: string[] = [];

  ipa.replace(ipaRegex, (match) => {
    convertedArray.push(arpabetConversions[match]);
    return match;
  });

  return convertedArray;


}
