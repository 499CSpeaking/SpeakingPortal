const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: '{apikey}',
  }),
  serviceUrl: '{url}',
});

const recognizeParams = {
  audio: fs.createReadStream('audio-file2.flac'),
  contentType: 'audio/flac',
  wordAlternativesThreshold: 0.9,
  keywords: ['colorado', 'tornado', 'tornadoes'],
  keywordsThreshold: 0.5,
};

speechToText.recognize(recognizeParams)
  .then(speechRecognitionResults => {
    console.log(JSON.stringify(speechRecognitionResults, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });