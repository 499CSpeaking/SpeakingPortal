// done in JS instead of TS because I'm lazy.
// this is merely a proof of concept, it is quite unoptimized (using cURL instead of a normal API call, etc)
// this script prints out the extracted phonemes + metadata as the raw JSON output that the gentle server returns.

// requirement to running this demo is 
// 1) you have two files "audio.mp3" and "words.txt" in the same directory as this script. These files
// correspond to the text words and audio words to be mapped
// 2) you have a server running gentle somewhere. The easiest thing is to just install + run a docker container of gentle.
// this can be done with the command "docker run -P lowerquality/gentle".
const exec = require('child_process').exec;

// ensure this string contains the proper address to your gentle instance. If running a local docker container, just
// run "docker ps" and find your lowerquality/gentle address mappings. In my case, it is "0.0.0.0:49153"
const gentle_addr = "0.0.0.0:49153"

const api_curl_str = `curl -F "audio=@audio.mp3" -F "transcript=@words.txt" "${gentle_addr}/transcriptions?async=false"`

exec(api_curl_str, (err, stdout, stderr) => {
    if(err !== null) {
        console.log(`error: ${err}`)
        console.log(`stderr: ${stdout}`)
    } else {
        console.log(stdout)
    }
});