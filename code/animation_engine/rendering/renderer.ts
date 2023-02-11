import { Canvas, createCanvas } from "canvas";
import fs from 'fs'
import path from "path";

// everything to do with drawing frames and creating videos

class Renderer {
    private readonly config: any
    private readonly renderCtx: any

    constructor(config: any) {
        this.config = config

        // set up rendering context
        const canvas: Canvas = createCanvas(config.width, config.height)
        this.renderCtx = canvas.getContext('2d')
    }

    // called to setup filesystem for generating frames
    public setup(): void {
        const root: string = this.config.frames_path
        const fullPath: string = path.join(root, 'frames')
        
        // ensure there's an *empty* directory to store frames
        if(fs.existsSync(fullPath)) {
            // ensure it's empty
            fs.readdirSync(fullPath).forEach(filename => fs.rmSync(path.join(filename)))
        } else {
            fs.mkdirSync(fullPath)
        }
    }
}