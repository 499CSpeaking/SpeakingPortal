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
import { execSync } from "child_process"
ffmpeg.setFfmpegPath(ffmpegStatic!)

async function main() {

    // user-defined variables
    let WIDTH: number
    let HEIGHT: number
    let TRANSCRIPT_PATH: string
    let PHONEME_MAPPINGS_PATH: string
    let MOUTH_TEXTURES_PATH: string
    let MOUTH_ON_BODY_OFFSET: number[]
    let BODY_TEXTURE_PATH: string
    let BODY_SCALE:number
    let MOUTH_SCALE: number
    let AUDIO_PATH: string
    let FRAME_RATE: number
    let PHONEME_OCCURRENCE_CONVOLUTION: number[]

    let DYNAMIC_EYES: boolean
    let EYES_SPACING: number
    let EYE_SCALE: number
    let EYE_TEXTURES_PATH: string
    let EYE_MAPPINGS_PATH: string
    let EYES_ON_BODY_OFFSET: number[]
    let BLINK_INTERVAL: number // seconds per blink


    // static assets
    // this struct allows us to hold static assets
    interface StaticAsset {
        texture: Image,
        x: number,
        y: number,
        scale: number
    }
    let static_assets: StaticAsset[]

    // variables parsed from input transcript
    let video_length: number // in seconds
    let num_frames: number
    let transcript: any

    // hashmap with key = phoneme (string) and value = image
    let mouths: Map<string, Image> = new Map()

    // left and right eye texture
    let left_eye:Image[] | undefined
    let right_eye:Image[] | undefined

    let body: Image

    // same as mouths variable except value is an array of num_frames length, consisting of 1 or 0 
    // 1 means the phoneme is being spoken during this frame and 0 means otherwise
    let phoneme_occurrences: Map<string, Array<number>> = new Map()

    // similar to phoneme_occurrences, although this is for occurrences of the avatar blinking
    let blink_occurrences: Array<number> | undefined
    let blink_max_amount = 1e-10

    // parsing of input values into program
    try{
        const parameters: any = JSON.parse(fs.readFileSync('./inputs.json').toString())

        WIDTH = parameters.width
        HEIGHT = parameters.height
        TRANSCRIPT_PATH = parameters.input_transcript
        PHONEME_MAPPINGS_PATH = parameters.input_mouth_mappings
        MOUTH_TEXTURES_PATH = parameters.input_mouth_mappings_textures
        MOUTH_ON_BODY_OFFSET = parameters.input_mouth_on_body_offset_from_center
        BODY_TEXTURE_PATH = parameters.input_body_texture
        BODY_SCALE = parameters.input_body_scale
        MOUTH_SCALE = parameters.input_mouth_scale
        AUDIO_PATH = parameters.input_audio
        FRAME_RATE = parameters.output_frame_rate
        PHONEME_OCCURRENCE_CONVOLUTION = parameters.phoneme_occurrence_convolution_filter

        DYNAMIC_EYES = parameters.use_custom_eyes
        EYES_SPACING = parameters.input_eye_spacing
        EYE_SCALE = parameters.input_eye_scale
        EYE_TEXTURES_PATH = parameters.input_eyes_textures
        EYE_MAPPINGS_PATH = parameters.input_eye_mappings
        EYES_ON_BODY_OFFSET = parameters.input_eyes_on_body_offset_from_center
        BLINK_INTERVAL = parameters.input_blink_interval

        if(!(WIDTH && HEIGHT && TRANSCRIPT_PATH && PHONEME_MAPPINGS_PATH && MOUTH_TEXTURES_PATH && MOUTH_ON_BODY_OFFSET && BODY_TEXTURE_PATH && BODY_SCALE && MOUTH_SCALE && AUDIO_PATH && FRAME_RATE && PHONEME_OCCURRENCE_CONVOLUTION)) {
            throw new Error(`missing parameters in inputs.json?`)
        }

        if(typeof DYNAMIC_EYES == 'undefined') {
            DYNAMIC_EYES = false
        }

        // eyes are optional
        if(DYNAMIC_EYES && !(EYES_SPACING && EYE_TEXTURES_PATH && EYES_ON_BODY_OFFSET && BLINK_INTERVAL)) {
            throw new Error(`use_custom_eyes is set to true but some eyes-related parameters are missing in inputs.json, it seems`)
        }

        // verifying this filter is correct
        try {
            if(PHONEME_OCCURRENCE_CONVOLUTION.length % 2 == 0) {
                throw new Error(`phoneme_occurrence_convolution_filter length of ${PHONEME_OCCURRENCE_CONVOLUTION.length} must be an odd number length`)
            }
            const filterSum: number = PHONEME_OCCURRENCE_CONVOLUTION.reduce((a, b) => a + b, 0)
            if(Math.abs(filterSum - 1) > 0.1) {
                //don't need to do this check
                //throw new Error(`phoneme_occurrence_convolution_filter must sum to 1, not ${filterSum}`)
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

        // mouth on body position
        if(MOUTH_ON_BODY_OFFSET.length != 2 || typeof MOUTH_ON_BODY_OFFSET[0] != "number") {
            throw new Error(`input_mouth_on_body_offset_from_center "${MOUTH_ON_BODY_OFFSET}" must be an array of numbers of length 2`)
        }

        try {
            //body texture
            body = await loadImage(BODY_TEXTURE_PATH)
        } catch(e) {
            throw new Error(`could not load the body texture located at ${BODY_TEXTURE_PATH}: ${(e as Error).message}`)
        }

        // body scale
        if(BODY_SCALE <= 0) {
            throw new Error(`invalid body scale ${BODY_SCALE}`)
        }

        // mouth scale
        if(MOUTH_SCALE <= 0) {
            throw new Error(`invalid mouth scale ${MOUTH_SCALE}`)
        }

        // static assets
        try {
            const parsed: any = parameters.static_assets ? parameters.static_assets : []
            static_assets = new Array<StaticAsset>(parsed.length)

            for(let i: number = 0; i < parsed.length; i += 1) {
                try {
                    const parsed_asset = parsed[i]
                    static_assets[i] = {
                        texture: await loadImage(parsed_asset.texture),
                        x: parsed_asset.position_offset_from_center[0],
                        y: parsed_asset.position_offset_from_center[1],
                        scale: parsed_asset.scale
                    }
                } catch(e) {
                    throw new Error(`error processing static asset #${i}: ${(e as Error).message}`)
                }
            }

        } catch(e) {
            throw new Error(`error while parsing static assets: ${(e as Error).message}`)
        }

        // eye stuff
        if(DYNAMIC_EYES) {
            // eyes on body position
            if(EYES_ON_BODY_OFFSET.length != 2 || typeof EYES_ON_BODY_OFFSET[0] != "number") {
                throw new Error(`input_eyes_on_body_offset_from_center "${EYES_ON_BODY_OFFSET}" must be an array of numbers of length 2`)
            }

            // eye textures
            try {
                let eye_mapping: any = JSON.parse(fs.readFileSync(EYE_MAPPINGS_PATH).toString())

                if(!(eye_mapping.left && eye_mapping.right)) {
                    throw new Error(`${EYE_MAPPINGS_PATH} needs both a "left" and "right" item`)
                }
                //left_eye = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.left}`)
                //right_eye = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.right}`)
                if(eye_mapping.left.length != eye_mapping.right.length) {
                    throw new Error(`left and right eye mapping lists must be the same in length`)
                }

                const length: number = eye_mapping.left.length
                left_eye = new Array<Image>(length)
                right_eye = new Array<Image>(length)

                for(let i = 0; i < length; i += 1) {
                    // potential for asnyc concurrency optimization here?
                    left_eye[i] = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.left[i]}`)
                    right_eye[i] = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.right[i]}`)
                }
            } catch(e) {
                throw new Error(`couldn't parse the mouth mappings located at ${EYE_MAPPINGS_PATH}: ${(e as Error).message}`)
            }

            // blinking
            try {
                blink_occurrences = new Array<number>(Math.ceil(num_frames)).fill(0);
                const step_size: number = FRAME_RATE * 1/BLINK_INTERVAL
                
                // blink once every set period of time
                for(let i: number = 0; i < blink_occurrences.length; i += step_size) {
                    blink_occurrences[i] = 1
                }

                // apply filter
                const filterLen: number = PHONEME_OCCURRENCE_CONVOLUTION.length
                const blink_occurrences_copy: Array<number> = new Array<number>(blink_occurrences.length)
                for(let i: number = 0; i < blink_occurrences.length; i += 1) {
                    let localSum: number = 0
                    for(let j: number = -(filterLen - 1)/2; j < filterLen/2; j += 1) {
                        const di: number = i + j
                        localSum += di < 0 || di >= blink_occurrences.length ? 0 : PHONEME_OCCURRENCE_CONVOLUTION[j + Math.floor(filterLen/2)] * blink_occurrences[di]
                    }
                    blink_occurrences_copy[i] = localSum
                }
                blink_occurrences = blink_occurrences_copy

                // get the max blink amount
                for(let i: number = 0; i < blink_occurrences.length; i += 1) {
                    blink_max_amount = Math.max(blink_max_amount, blink_occurrences[i])
                }
            } catch(e) {
                throw new Error(`error creating blink timeline: ${(e as Error).message}`)
            }
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

        // last minute hack: make sure to warn the user if a phoneme is missing
        try {
            if(phoneme_occurrences.get(active_phoneme)! == null) {
                throw Error;
            }
        } catch(_) {
            console.error(`Error: it looks like the phoneme '${active_phoneme}' is found in the transcript but not in the mappings file... Perhaps you forgot to define it in ${PHONEME_MAPPINGS_PATH}?`)
            exit()
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

        // draw the body
        /*
            TODO: this drawImage call is incredibly unoptimized as the body image is always drawn at max
            resolution no matter how shrunken the image is. I can fix this by bitmapping the body texture
            later
        */
        ctx.drawImage(body,
            WIDTH/2 - body.width*BODY_SCALE/2, HEIGHT/2 - body.height*BODY_SCALE/2,
            body.width * BODY_SCALE, body.height * BODY_SCALE
            )

        // draw the mouth
        const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
        const stretchAmount: number = lerp(0.7, 1.2, mouthOpenAmount)
        //ctx.drawImage(mouth, WIDTH/2 - body.width*BODY_SCALE/2 - mouth.width/2 + MOUTH_ON_BODY_POSITION[0]*BODY_SCALE, HEIGHT/2 - body.height*BODY_SCALE/2 - 0 + MOUTH_ON_BODY_POSITION[1]*BODY_SCALE, mouth.width*MOUTH_SCALE, mouth.height * lerp(0.5, 1, mouthOpenAmount) * MOUTH_SCALE)
        ctx.drawImage(mouth,
            WIDTH/2 - mouth.width*MOUTH_SCALE/2 + MOUTH_ON_BODY_OFFSET[0]*BODY_SCALE,
            HEIGHT/2 + MOUTH_ON_BODY_OFFSET[1]*BODY_SCALE,
            mouth.width*MOUTH_SCALE,
            mouth.height * lerp(0.5, 1, mouthOpenAmount) * MOUTH_SCALE
            )

        // draw the eyes
        if(DYNAMIC_EYES) {
            // testing code 
            const blink_phase: number = Math.round((left_eye!.length - 1) * blink_occurrences![frame]/blink_max_amount)
            const left: Image = left_eye![blink_phase]
            const right: Image = right_eye![blink_phase]

            ctx.drawImage(left,
                WIDTH/2 - left.width*EYE_SCALE/2 + EYES_ON_BODY_OFFSET[0] + EYES_SPACING,
                HEIGHT/2 - left.height*EYE_SCALE/2 + EYES_ON_BODY_OFFSET[1],
                left.width*EYE_SCALE,
                left.height*EYE_SCALE
            )
            ctx.drawImage(right,
                WIDTH/2 - right.width*EYE_SCALE/2 + EYES_ON_BODY_OFFSET[0] - EYES_SPACING,
                HEIGHT/2 - right.height*EYE_SCALE/2+ EYES_ON_BODY_OFFSET[1],
                right.width*EYE_SCALE,
                right.height*EYE_SCALE
            )
        }

        // draw any static assets
        static_assets.forEach((a) => {
            ctx.drawImage(a.texture,
                WIDTH/2 - a.texture.width*a.scale/2 + a.x,
                HEIGHT/2 - a.texture.height*a.scale/2 +  a.y,
                a.texture.width * a.scale,
                a.texture.height * a.scale
            )
        })

        fs.writeFileSync(`out_frames/frame_${frame.toString().padStart(9, '0')}.png`, canvas.toBuffer('image/png'))
    }

    // generate the video
    execSync(`ffmpeg -y -i ./out_frames/frame_%9d.png -framerate ${FRAME_RATE} ./out.mp4 -hide_banner -loglevel error`)
    console.log('out.mp4 has been generated!');

    // append audio to the video
    execSync(`ffmpeg -y -i out.mp4 -i ${AUDIO_PATH} -c copy -map 0:v:0 -map 1:a:0 out_with_audio.mp4 -hide_banner -loglevel error`)
    console.log('out_with_audio.mp4 has been generated!');
    
}

main()