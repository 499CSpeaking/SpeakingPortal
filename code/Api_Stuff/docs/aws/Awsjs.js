const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

/**
 * Calls the Speech-to-Text API on a demo audio file.
 */
async function quickstart() {
// The path to the remote LINEAR16 file stored in Google Cloud Storage
  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableWordTimeOffsets: true,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  response.results.forEach((result) => {
    result.alternatives.forEach((alternative) => {
      console.log(`Transcript: ${alternative.transcript}`);
      console.log(`Word details:`);
      console.log(` Word count ${alternative.words.length}`);
      alternative.words.forEach((item) => {
        console.log(`  ${item.word}`);
        const s = parseInt(item.startTime.seconds) +
         item.startTime.nanos/1000000000;
        console.log(`   WordStartTime: ${s}s`);
        const e = parseInt(item.endTime.seconds) +
        item.endTime.nanos/1000000000;
        console.log(`   WordEndTime: ${e}s`);
      });
    });
  });
}

quickstart();
