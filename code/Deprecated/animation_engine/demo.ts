import { argv, exit } from "process";
import { run } from "./main";
import { createWriteStream, readFileSync, writeFileSync } from "fs";
import { get } from "https";
import { execSync } from "child_process";

// assume that the gentle container is running, and that it's 8765-something port is mapped to 8080
// on the host machine

// this code is messy and shit. It's good for a demo though

//modify this
const inputString: string = "Hello, I am currently testing the avatar context feature."

async function start() {
    // get audio from kukarella
    console.log(`getting synthesized speech from Kukarella w/ prompt "${inputString}"`)
    getAudio(inputString, (inputString, audioPath) => {
        // get transcript from gentle
        console.log(`getting phoneme mapping w/ text="${inputString}", audio=@${audioPath}`)
        getTranscript(inputString, audioPath, async (audioPath, transcriptPath) => {
            console.log('generating the video now')
            /*
                Notice how I pass parameters into run(...)
            */
            const config: any = new Object()
            //config.phoneme_samples_per_second = 22
            //config.key = ...
            const out: string = await run("./demo_files/inputs.json", config)
            console.log('done! Video is located at ' + out)
            exit()
        })
    })
}

async function getAudio(inputString: string, callback: (text: string, audioPath: string) => any) {
    const kukarella_api_url: string = "https://api.kukarella.com/texttospeech/convertTTSPreview"

    const payload = {
        text: inputString,
        voiceKey: 'en-US_AllisonV3Voice',
    }

    const api_response: any = await fetch(kukarella_api_url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const audio_url: string = (await api_response.json()).data.url

    get(audio_url, (res) => {
        const path = "demo_files/tmp/audio.wav"
        const writeStream = createWriteStream(path)
     
        res.pipe(writeStream)
     
        writeStream.on("finish", () => {
           writeStream.close()
           console.log("Download Completed!")
           callback(inputString, path)
        })
     })
}

function getTranscript(text: string, audioPath: string, callback: (audioPath: string, transcriptPath: string) => any) {
    //have to 
    const curlCommand: string = `curl -F "audio=@${audioPath}" -F "transcript=${text}" "http://localhost:8080/transcriptions?async=false"`
    const output: string = execSync(curlCommand).toString()
    writeFileSync('demo_files/tmp/transcript.json', output)
    
    callback(audioPath, 'demo_files/tmp/transcript.json')
}

start()