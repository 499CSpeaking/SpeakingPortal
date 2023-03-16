const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

async function main() {
    // The path to the remote LINEAR16 file stored in Google Cloud Storage
    const gcsUri = 'gs://kukarellaspeech/two.mp3';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        uri: gcsUri,
    };
    const config = {
        encoding: 'MP3',
        sampleRateHertz: 16000,
        languageCode: 'en-US', // if we want to do french replace this with fr-FR
        enableWordTimeOffsets: true, // this is what we care about as we need offsets
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);

    response.results.forEach((result: { alternatives: any[]; }) => {
      result.alternatives.forEach((alternative: { transcript: any; words: any[]; }) => {
        console.log(`Transcript: ${alternative.transcript}`);
        console.log(`Word details:`);
        console.log(` Word count ${alternative.words.length}`);
        alternative.words.forEach((item: { word: any; startTime: { seconds: string; nanos: number; }; endTime: { seconds: string; nanos: number; }; }) => {
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

main();
