// done in JS instead of TS because I'm lazy.
// this is merely a proof of concept, it is quite unoptimized (using cURL instead of a normal API call, etc)
// this script prints out the extracted phonemes + metadata as the raw JSON output that the gentle server returns.
// requirement to running this demo is 
// 1) you have two files "audio.mp3" and "words.txt" in the same directory as this script. These files
// correspond to the text words and audio words to be mapped
// 2) you have a server running gentle somewhere. The easiest thing is to just install + run a docker container of gentle.
// this can be done with the command "docker run -P lowerquality/gentle".
var exec = require('child_process').execSync;
// ensure this string contains the proper address to your gentle instance. If running a local docker container, just
// run "docker ps" and find your lowerquality/gentle address mappings. In my case, it is "0.0.0.0:49153"
var gentle_addr = "0.0.0.0:80";
function print_output(input, time) {
    var words = JSON.parse(input).words;
    console.log(time.toFixed(2) + " seconds to compute " + words.length + " words");
    console.log((words.length / time).toFixed(2) + " words per second\n");
    // for every word, print out the info related to that word
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        try {
            // console.log(`${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2)}: ${word.word}`)
            console.log(word.start.toFixed(2).padEnd(5) + " -> " + word.end.toFixed(2).padStart(5) + ": " + word.word);
            // print all the phonemes
            var phonemes = word.phones;
            var offset = Number(word.start);
            for (var _a = 0, phonemes_1 = phonemes; _a < phonemes_1.length; _a++) {
                var phoneme = phonemes_1[_a];
                console.log("   " + offset.toFixed(2).padStart(2) + " " + phoneme.phone.split("_")[0]);
                offset += Number(phoneme.duration);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
}
function string_output(input, time) {
    var words = JSON.parse(input).words;
    var str = ""; //no stringbuilder in javascript? aaarrrgghhhhhhh
    str += time.toFixed(2) + " seconds to compute " + words.length + " words\n";
    str += (words.length / time).toFixed(2) + " words per second\n";
    // for every word, print out the info related to that word
    for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
        var word = words_2[_i];
        try {
            // console.log(`${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2)}: ${word.word}`)
            str += word.start.toFixed(2).padEnd(5) + " -> " + word.end.toFixed(2).padStart(5) + ": " + word.word + "\n";
            // print all the phonemes
            var phonemes = word.phones;
            var offset = Number(word.start);
            for (var _a = 0, phonemes_2 = phonemes; _a < phonemes_2.length; _a++) {
                var phoneme = phonemes_2[_a];
                str += "   " + offset.toFixed(2).padStart(2) + " " + phoneme.phone.split("_")[0] + "\n";
                offset += Number(phoneme.duration);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
    return str;
}
function fetch(audio_filename, text_filename) {
    var api_curl_str = "curl -F \"audio=@" + audio_filename + "\" -F \"transcript=@" + text_filename + "\" \"" + gentle_addr + "/transcriptions?async=false\"";
    var t1 = process.hrtime();
    var output = exec(api_curl_str);
    var t2 = process.hrtime(t1);
    return string_output(output, t2[0] + t2[1] / 1000000000);
}
module.exports = fetch;
// running the demo directly
if (require.main == module) {
    try {
        var t1 = process.hrtime();
        var output = fetch("audio.mp3", "words.txt");
        var t2 = process.hrtime(t1);
        print_output(output, t2[0] + t2[1] / 1000000000);
    }
    catch (e) {
        console.error("oh no. error: " + e.message);
    }
}
