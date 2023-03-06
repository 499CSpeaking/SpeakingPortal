import { Canvas, createCanvas, Image } from "canvas";
import { execSync } from "child_process";
import commandExists from "command-exists";
import fs from "fs"
import path from "path";
import { PhonemeOccurrences } from "../transcript/phoneme_occurrences";
import { GraphicsPool } from "../graphics/graphics_pool";
import { PhonemeImageconverter } from "../graphics/phoneme_to_image";

// everything to do with drawing frames and creating videos

export class Renderer {
    private readonly config: any
    private readonly canvas: Canvas
    private readonly renderCtx: any
    private readonly graphics: GraphicsPool
    private readonly phonemes: PhonemeOccurrences
    private readonly phonemeImageConverter: PhonemeImageconverter

    constructor(config: any, graphics: GraphicsPool, phonemes: PhonemeOccurrences, phonemeImageConverter: PhonemeImageconverter) {
        this.config = config
        this.graphics = graphics
        this.phonemes = phonemes
        this.phonemeImageConverter = phonemeImageConverter

        // set up rendering context
        this.canvas = createCanvas(config.width, config.height)
        this.renderCtx = this.canvas.getContext('2d')
    }

    // called to setup filesystem for generating frames
    public setup(): void {
        const root: string = this.config.frames_path
        const fullPath: string = path.join(root, 'frames')

        // check if ffmpeg actually exists on this machine
        if(!commandExists.sync("ffmpeg")) {
            console.log(`warning: ffmpeg doesn't seem to be installed`)
        }
        
        // ensure there's an *empty* directory to store frames
        if(fs.existsSync(fullPath)) {
            // ensure it's empty
            fs.readdirSync(fullPath).forEach(filename => fs.rmSync(path.join(fullPath, filename)))
        } else {
            fs.mkdirSync(fullPath)
        }
    }

    public drawFrame(frameNum: number, seconds: number): void {
        this.renderCtx.fillStyle = '#999999'
        this.renderCtx.fillRect(0, 0, this.config.width, this.config.height)
        this.renderCtx.font = '10px Arial'
        this.renderCtx.fillStyle = '#111111'
        this.renderCtx.fillText(`currently at frame ${frameNum}.png`, 10, 10)

        /*
            Here we attempt to get the mouth texture of the dominantly spoken phoneme at this time.
            Note: There must be an "idle" phoneme that represents no speech.
        */
        const [phoneme, dominance]: [string, number] = this.phonemes.getDominantPhonemeAt(seconds)
            ?? ["idle", this.config.phoneme_idle_threshold + 0.01]
        const imageName: string | undefined = this.phonemeImageConverter.getImageName(phoneme)
        if(!imageName) {
            throw new Error(`phoneme "${phoneme}" isn't recognized by the phoneme-image converter`)
        }

        const mouth: Image = this.graphics.get(imageName)

        this.renderCtx.drawImage(
            mouth,
            this.config.width/2,
            this.config.height/2
        )

        fs.writeFileSync(path.join(this.config.frames_path, 'frames', `frame_${frameNum.toString().padStart(12, '0')}.png`), this.canvas.toBuffer('image/png'))
    }

    // call to generate the video
    // returns the path to file
    public generateVideo(): string {
        const filename: string = path.join(this.config.video_path, 'video.mp4')
        const tmpFilename: string = path.join(this.config.frames_path, 'temp_video.mp4')
        try {
            // ffmpeg is used to generate the video
            // append frame images together
            execSync(`ffmpeg -y -r ${this.config.frames_per_second} -i ${path.join(this.config.frames_path, 'frames', 'frame_%12d.png')} ${tmpFilename} -hide_banner -loglevel error`)

            // append audio to video file
            execSync(`ffmpeg -y -i ${tmpFilename} -i ${this.config.audio_path} -c copy -map 0:v:0 -map 1:a:0 ${filename} -hide_banner -loglevel error`)
        } catch(e) {
            throw new Error('error with ffmpeg: ' + (e as Error).message)
        }
        return filename
    }
}