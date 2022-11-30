// done in JS instead of TS because I'm lazy.
// this is merely a proof of concept, it is quite unoptimized (using cURL instead of a normal API call, etc)
// this script prints out the extracted phonemes + metadata as the raw JSON output that the gentle server returns.

// requirement to running this demo is 
// 1) you have two files "audio.mp3" and "words.txt" in the same directory as this script. These files
// correspond to the text words and audio words to be mapped
// 2) you have a server running gentle somewhere. The easiest thing is to just install + run a docker container of gentle.
// this can be done with the command "docker run -P lowerquality/gentle".
const exec: any = require('child_process').execSync;

// ensure this string contains the proper address to your gentle instance. If running a local docker container, just
// run "docker ps" and find your lowerquality/gentle address mappings. In my case, it is "0.0.0.0:49153"
const gentle_addr: string = "0.0.0.0:80"





function print_output(input: string, time: number): void {
    const words: any[] = JSON.parse(input).words

    console.log(`${time.toFixed(2)} seconds to compute just the alignment of ${words.length} word(s)`)
    console.log(`${(words.length/time).toFixed(2)} words per second\n`)

    // for every word, print out the info related to that word
    for(const word of words) {
        try {
            // console.log(`${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2)}: ${word.word}`)
            console.log(`${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2).padStart(5)}: ${word.word}`)
            
            // print all the phonemes
            const phonemes: any = word.phones
            let offset: number = Number(word.start)
            for(const phoneme of phonemes) {
                console.log(`   ${offset.toFixed(2).padStart(2)} ${phoneme.phone.split("_")[0]}`)
                offset += Number(phoneme.duration)
            }
        } catch(error) {
            console.error(error.message)
        }
    }
}

function string_output(input: string, time: number): string {
    const words: any[] = JSON.parse(input).words
    let str: string = "" //no stringbuilder in javascript? aaarrrgghhhhhhh

    str += `${time.toFixed(2)} seconds to compute ${words.length} words\n`
    str += `${(words.length/time).toFixed(2)} words per second\n`

    // for every word, print out the info related to that word
    for(const word of words) {
        try {
            // console.log(`${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2)}: ${word.word}`)
            str += `${word.start.toFixed(2).padEnd(5)} -> ${word.end.toFixed(2).padStart(5)}: ${word.word}\n`
            
            // print all the phonemes
            const phonemes: any = word.phones
            let offset: number = Number(word.start)
            for(const phoneme of phonemes) {
                 str += `   ${offset.toFixed(2).padStart(2)} ${phoneme.phone.split("_")[0]}\n`
                offset += Number(phoneme.duration)
            }
        } catch(error) {
            console.error(error.message)
        }
    }

    return str
}

function fetch(audio_filename: string, text_filename: string): string {
    const api_curl_str: string = `curl -F "audio=@${audio_filename}" -F "transcript=@${text_filename}" "${gentle_addr}/transcriptions?async=false"`

    const t1 = process.hrtime()
    const output: any = exec(api_curl_str)
    const t2: number[] = process.hrtime(t1)

    return string_output(output, t2[0] + t2[1]/1000000000)
}

module.exports = fetch

// running the demo directly
if(require.main == module) {
    try {
        const t1 = process.hrtime()
        const output = fetch("audio.mp3", "words.txt")
        const t2: number[] = process.hrtime(t1)

        print_output(output, t2[0] + t2[1]/1000000000)
    } catch(e) {
        console.error("oh no. error: " + e.message)
    }
}