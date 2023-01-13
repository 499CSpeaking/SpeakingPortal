/*
    Here is the first demo for generating a video using canvas, given a simple transcript generated by gentle.
    See input_mappings folder to see what the transcripts look like
    
    The parameters to configure the output are located in inputs.json
*/

import { Canvas, CanvasRenderingContext2D, Image, createCanvas, loadImage } from "canvas"
import fs from "fs"
import { exit } from "process"
import {getVideoDurationInSeconds} from "get-video-duration"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { readFileSync } from "fs"
ffmpeg.setFfmpegPath(ffmpegStatic!)

async function main() {

    // user-defined variables
    let WIDTH: number
    let HEIGHT: number
    let TRANSCRIPT_PATH: string
    let PHONEME_MAPPINGS_PATH: string
    let MOUTH_TEXTURES_PATH: string
    let AUDIO_PATH: string
    let FRAME_RATE: number
    let PHONEME_OCCURRENCE_CONVOLUTION: number[]

    // variables parsed from input transcript
    let video_length: number // in seconds
    let num_frames: number
    let transcript: any

    // hashmap with key = phoneme (string) and value = image
    let mouths: Map<string, Image> = new Map()

    // same as mouths variable except value is an array of num_frames length, consisting of 1 or 0 
    // 1 means the phoneme is being spoken during this frame and 0 means otherwise
    let phoneme_occurrences: Map<string, Array<number>> = new Map()

    // parsing of input values into program
    try{
        const parameters: any = JSON.parse(fs.readFileSync('./inputs.json').toString())

        WIDTH = parameters.width
        HEIGHT = parameters.height
        TRANSCRIPT_PATH = parameters.input_transcript
        PHONEME_MAPPINGS_PATH = parameters.input_mouth_mappings
        MOUTH_TEXTURES_PATH = parameters.input_mouth_mappings_textures
        AUDIO_PATH = parameters.input_audio
        FRAME_RATE = parameters.output_frame_rate
        PHONEME_OCCURRENCE_CONVOLUTION = parameters.phoneme_occurrence_convolution_filter

        if(!(WIDTH && HEIGHT && TRANSCRIPT_PATH && PHONEME_MAPPINGS_PATH && MOUTH_TEXTURES_PATH && AUDIO_PATH && FRAME_RATE && PHONEME_OCCURRENCE_CONVOLUTION)) {
            throw new Error(`missing parameters in inputs.json?`)
        }

        // verifying this filter is correct
        try {
            if(PHONEME_OCCURRENCE_CONVOLUTION.length % 2 == 0) {
                throw new Error(`phoneme_occurrence_convolution_filter length of ${PHONEME_OCCURRENCE_CONVOLUTION.length} must be an odd number`)
            }
            const filterSum: number = PHONEME_OCCURRENCE_CONVOLUTION.reduce((a, b) => a + b, 0)
            if(Math.abs(filterSum - 1) > 0.1) {
                throw new Error(`phoneme_occurrence_convolution_filter must sum to 1, not ${filterSum}`)
            }   
        } catch(e) {
            throw new Error(`invalid phoneme_occurrence_convolution_filter: ${(e as Error).message}`)
        }

        try {
            video_length = await getVideoDurationInSeconds(AUDIO_PATH)
        } catch(e) {
            throw new Error(`couldn't extract video length from ${AUDIO_PATH}: ${(e as Error).message}`)
        }

        num_frames = FRAME_RATE * video_length

        try {
            transcript = JSON.parse(fs.readFileSync(TRANSCRIPT_PATH).toString())
        } catch(e) {
            throw new Error(`couldn't parse the transcript located at ${TRANSCRIPT_PATH}: ${(e as Error).message}`)
        }

        try {

            // loop over the pairs in this json file and store them in the mouths map
            const mouth_mappings_file = JSON.parse(fs.readFileSync(PHONEME_MAPPINGS_PATH).toString())
            for(let phoneme in mouth_mappings_file) {
                mouths.set(phoneme, await loadImage(`${MOUTH_TEXTURES_PATH}/${mouth_mappings_file[phoneme]}`))

                phoneme_occurrences.set(phoneme, new Array<number>(Math.floor(num_frames)).fill(0))
            }

            if(!mouths.get('idle')) {
                throw new Error(`you are missing an "idle" entry in ${PHONEME_MAPPINGS_PATH} that represents the mouth's non-speaking texture`)
            }

        } catch(e) {
            throw new Error(`couldn't parse the phoneme-to-mouth mappings located at ${PHONEME_MAPPINGS_PATH}: ${(e as Error).message}`)
        }

    } catch(e) {
        console.error('error obtaining input parameters: ' + (e as Error).message)
        exit()
    }

    const canvas: Canvas = createCanvas(WIDTH, HEIGHT)
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

    // delete the old frames (if they exist) from the last run of this program
    fs.readdirSync('out_frames/').forEach(f => fs.rmSync(`out_frames/${f}`)); //node version 14 and above required for this line


    /*
        The following code does this for every frame:
        determine what word in the transcript is currently being spoken at this frame if a word is being spoken
        determine what phoneme is being pronounced in the current word at the current frame
    */
    let current_word_idx: number = 0
    let current_phoneme_idx: number = 0
    let current_phoneme_offset: number = 0
    const num_words: number = transcript.words.length

    for(let frame: number = 0; frame < num_frames; frame += 1) {
        let active_word: string = ''
        let active_phoneme: string = 'idle'

        const current_time = frame / FRAME_RATE
        if(current_word_idx < num_words && current_time > transcript.words[current_word_idx].end) {
            current_word_idx += 1
            current_phoneme_idx = 0
            current_phoneme_offset = 0
        }

        if(current_word_idx < num_words 
            && current_time >= transcript.words[current_word_idx].start
            && current_time < transcript.words[current_word_idx].end){

            active_word = transcript.words[current_word_idx].word

            // from here we get the current phoneme
            const num_phonemes: number = transcript.words[current_word_idx].phones.length
            if(current_phoneme_idx < num_phonemes && current_time >= transcript.words[current_word_idx].phones[current_phoneme_idx].duration + current_phoneme_offset) {
                current_phoneme_offset += transcript.words[current_word_idx].phones[current_phoneme_idx].duration
                current_phoneme_idx += 1
            }

            if(current_phoneme_idx < num_phonemes) {
                active_phoneme = transcript.words[current_word_idx].phones[current_phoneme_idx].phone

                // remove the unnecessary underscore and postfix at the end of the phoneme
                active_phoneme = active_phoneme.split('_')[0]
            }
        }

        (phoneme_occurrences.get(active_phoneme)!)[frame] = 1;
    }

    // perform a low-pass filter operation on each occurrence array to smooth it out
    phoneme_occurrences.forEach((arr, phoneme, _) => {
        const filterLen = PHONEME_OCCURRENCE_CONVOLUTION.length
        const copyArr: number[] = new Array<number>(arr.length)

        for(let i: number = 0; i < arr.length; i += 1) {
            let localSum: number = 0
            for(let j: number = -(filterLen - 1)/2; j < filterLen/2; j += 1) {
                const di: number = i + j
                localSum += di < 0 || di >= arr.length ? 0 : PHONEME_OCCURRENCE_CONVOLUTION[j + Math.floor(filterLen/2)] * arr[di]
            }
            copyArr[i] = localSum
        }

        for(let i: number = 0; i < arr.length; i += 1) {
            arr[i] = copyArr[i]
        }
    })

    // draw the frames
    for(let frame: number = 0; frame < num_frames; frame += 1) {
        // get the current phoneme (the one with the maximum value in it's occurrence array at index frame)
        let active_phoneme: string = ''
        let globalMax: number = -1e10
        phoneme_occurrences.forEach((arr, phoneme, _) => {
            if(phoneme == 'idle') {
                return
            }

            if(arr[frame] > globalMax) {
                active_phoneme = phoneme
                globalMax = arr[frame]
            }
        })

        if(globalMax < 0.1) {
            active_phoneme = 'idle'
        }

        // fill background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        // ctx.font = '40px Arial'
        // ctx.fillStyle = '#000000'
        // ctx.fillText(active_word, 5, 30)

        ctx.font = '30px Arial'
        ctx.fillStyle = '#555555'
        ctx.fillText(active_phoneme, 20, 40)

        // display phoneme occurrence levels
        let count: number = 0;
        phoneme_occurrences.forEach((arr, phoneme) => {
            if(count > 30) {
                return
            }
            ctx.font = '12px Arial'
            ctx.fillStyle = '#555555'
            ctx.fillText(phoneme, 10, 90 + count*13)
            ctx.fillRect(40, 94 + (count - 1)*13, arr[frame]*30, 8)
            count += 1
        })

        ctx.font = '15px Arial'
        ctx.fillStyle = '#555555'
        ctx.fillText(`frame ${frame}/${num_frames} @ ${FRAME_RATE}fps`, 5, HEIGHT-15)

        // if there's a phoneme, embed it into the image
        const mouth: Image = active_phoneme != '' ? mouths.get(active_phoneme)! : mouths.get('idle')!
        const mouthOpenAmount: number = active_phoneme != '' ? phoneme_occurrences.get(active_phoneme)![frame] : 1

        const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
        const stretchAmount: number = lerp(0.7, 1.2, mouthOpenAmount)
        ctx.drawImage(mouth, WIDTH/2, HEIGHT/2, mouth.width, mouth.height * lerp(0.5, 1, mouthOpenAmount))

        fs.writeFileSync(`out_frames/frame_${frame.toString().padStart(9, '0')}.png`, canvas.toBuffer('image/png'))
    }

    ffmpeg()
    .input('./out_frames/frame_%9d.png')
    .inputOptions([
        // Set input frame rate
        `-framerate ${FRAME_RATE}`,
    ])
    .output('./out.mp4')
    .run()
}

main()