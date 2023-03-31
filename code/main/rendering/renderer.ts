import { Canvas, createCanvas, Image } from "canvas";
import { exec, execSync } from "child_process";
import commandExists from "command-exists";
import fs from "fs"
import path from "path";
import { PhonemeOccurrences } from "../transcript/phoneme_occurrences";
import { GraphicsPool } from "../graphics/graphics_pool";
import { PhonemeImageconverter } from "../graphics/phoneme_to_image";
import { AvatarContext } from "../graphics/avatar_context";

// everything to do with drawing frames and creating videos

export class Renderer {
    private readonly config: any
    private readonly canvas: Canvas
    private readonly renderCtx: any
    private readonly graphics: GraphicsPool
    private readonly phonemes: PhonemeOccurrences
    private readonly phonemeImageConverter: PhonemeImageconverter
    private readonly avatarContext: AvatarContext

    constructor(config: any, 
        graphics: GraphicsPool, phonemes: PhonemeOccurrences, phonemeImageConverter: PhonemeImageconverter, avatarContext: AvatarContext) {
        this.config = config
        this.graphics = graphics
        this.phonemes = phonemes
        this.phonemeImageConverter = phonemeImageConverter
        this.avatarContext = avatarContext

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
            fs.mkdirSync(fullPath, {recursive: true})
        }
    }

    public drawFrame(frameNum: number, seconds: number): void {
        this.renderCtx.fillStyle = '#999999'
        this.renderCtx.fillRect(0, 0, this.config.width, this.config.height)
        this.renderCtx.font = '10px Arial'
        this.renderCtx.fillStyle = '#111111'
        this.renderCtx.fillText(`currently at frame ${frameNum}`, 10, 10)

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

        // body
        const [bodyDescriptor, bodyPos, bodyScale] = this.avatarContext.bodyData()
        const body: Image = this.graphics.get(bodyDescriptor)
        this.renderCtx.drawImage(
            body, 
            this.config.width/2 - bodyScale*body.width/2 + bodyPos[0],
            this.config.height/2 - bodyScale*body.height/2 + bodyPos[1],
            body.width * bodyScale,
            body.height * bodyScale,
        )

        // mouth
        const [mouthPos, mouthScale] = this.avatarContext.mouthData();
        this.renderCtx.drawImage(
            mouth,
            this.config.width/2 - mouthScale*mouth.width/2 + mouthPos[0],
            this.config.height/2 + mouthPos[1],
            mouthScale*mouth.width,
            mouthScale*mouth.height * (0.90 + dominance*0.2)
        )

        // eyes
        const [leftEyeDescriptor, rightEyeDescriptor, eyePos, eyeDistanceBetween, eyeScale] = this.avatarContext.eyeData(seconds)
        const leftEye: Image = this.graphics.get(leftEyeDescriptor)
        const rightEye: Image = this.graphics.get(rightEyeDescriptor)

        // left eye
        this.renderCtx.drawImage(
            leftEye,
            this.config.width/2 - eyeScale*leftEye.width/2 + eyePos[0] + eyeDistanceBetween/2,
            this.config.height/2 - eyeScale*leftEye.width/2 + eyePos[1],
            eyeScale*leftEye.width,
            eyeScale*leftEye.height
        )
        //right eye
        this.renderCtx.drawImage(
            rightEye,
            this.config.width/2 - eyeScale*rightEye.width/2 + eyePos[0] - eyeDistanceBetween/2,
            this.config.height/2 - eyeScale*rightEye.width/2 + eyePos[1],
            eyeScale*rightEye.width,
            eyeScale*rightEye.height
        )

        // const glasses: Image = this.graphics.get("glasses.svg")
        // const glassesScale = 0.2
        // const glassesY = -45
        // this.renderCtx.drawImage(
        //     glasses,
        //     this.config.width/2 - glassesScale*glasses.width/2,
        //     this.config.height/2 - glassesScale*glasses.height/2 + glassesY,
        //     glassesScale*glasses.width,
        //     glassesScale*glasses.height
        // )

        // draw all the static assets
        this.avatarContext.getStaticAssets().forEach(asset => {
            const texture: Image = this.graphics.get(asset.name)

            this.renderCtx.drawImage(
                texture,
                this.config.width/2 - asset.scale*texture.width/2 + asset.pos[0],
                this.config.height/2 - asset.scale*texture.height/2 + asset.pos[1],
                asset.scale*texture.width,
                asset.scale*texture.height
            )
        });


        fs.writeFileSync(path.join(this.config.frames_path, 'frames', `frame_${frameNum.toString().padStart(12, '0')}.png`), this.canvas.toBuffer('image/png'))
    }

    // call to generate the video
    // returns the path to file
    public generateVideo(): string {
        const filename: string = path.join(this.config.video_path, 'out.mp4')
        const tmpFilename: string = path.join(this.config.frames_path, 'video.mp4')
        try {
            // ffmpeg is used to generate the video
            // append frame images together
            execSync(`ffmpeg -y -r ${this.config.frames_per_second} -i ${path.join(this.config.frames_path, 'frames', 'frame_%12d.png')} ${tmpFilename} -hide_banner -loglevel error`)

            // In case we have a .wav file (we likely do) instead of a .mp3, convert it to mp3
            const mp3AudioPath: string = (this.config.audio_path as string).replace(".wav", ".mp3")
            console.log([this.config.audio_path, mp3AudioPath])
            execSync(`ffmpeg -y -i ${this.config.audio_path} -acodec libmp3lame ${mp3AudioPath} -hide_banner -loglevel error`)

            // append audio to video file
            execSync(`ffmpeg -y -i ${tmpFilename} -i ${mp3AudioPath} -c copy -map 0:v:0 -map 1:a:0 ${filename} -hide_banner -loglevel error`)
        } catch(e) {
            throw new Error('error with ffmpeg: ' + (e as Error).message)
        }
        return filename
    }
}