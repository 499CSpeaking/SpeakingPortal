import { Canvas, createCanvas } from "canvas";
import fs from "fs"
import path from "path";

// everything to do with drawing frames and creating videos

export class Renderer {
    private readonly config: any
    private readonly canvas: Canvas
    private readonly renderCtx: any

    constructor(config: any) {
        this.config = config

        // set up rendering context
        this.canvas = createCanvas(config.width, config.height)
        this.renderCtx = this.canvas.getContext('2d')
    }

    // called to setup filesystem for generating frames
    public setup(): void {
        const root: string = this.config.frames_path
        const fullPath: string = path.join(root, 'frames')
        
        // ensure there's an *empty* directory to store frames
        if(fs.existsSync(fullPath)) {
            // ensure it's empty
            fs.readdirSync(fullPath).forEach(filename => fs.rmSync(path.join(fullPath, filename)))
        } else {
            fs.mkdirSync(fullPath)
        }
    }

    public drawFrame(frameNum: number): void {
        this.renderCtx.fillStyle = '#555555'
        this.renderCtx.fillRect(0, 0, this.config.width, this.config.height)
        this.renderCtx.font = '10px Arial'
        this.renderCtx.fillStyle = '#111111'
        this.renderCtx.fillText(`currently at frame ${frameNum}.png`, 10, 10)
        fs.writeFileSync(path.join(this.config.frames_path, 'frames', `frame_${frameNum}.png`), this.canvas.toBuffer('image/png'))
    }
}