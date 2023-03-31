/*
    contains data about the avatar. Static assets, mouth + eye + body positions and scales, etc
*/

import { readFile, readFileSync } from "fs"

export class AvatarContext {
    private config: any

    // note: we store the string file names of assets, not the raw assets. Use a GraphicsPool to
    // access the asset using a name
    
    /*
        eyeLeft and eyeRight store the phases of a blinking eye, where the first item is the fully
        open eye (default eye appearence), the last item is the fully closed eye, and inbetween are
        the transition half-closed eyes. 
    */
    private eyeLeft: string[] | undefined
    private eyeRight: string[] | undefined
    private eyePos: number[] | undefined
    private eyeDistanceBetween: number | undefined
    private eyeScale: number | undefined
    
    private body: string | undefined
    private bodyPos: number[] | undefined
    private bodyScale: number | undefined

    //private mouth: string | undefined // mouth asset is handled elsewhere, see drawFrame of renderer.ts
    private mouthPos: number[] | undefined
    private mouthScale: number | undefined

    private staticAssets: StaticAsset[] | undefined

    constructor(config: any) {
        this.config = config
    }

    // load all the data from the avatar context file
    // call this immediately after initialization
    public async init() {
        const context_path: string = this.config.avatar_context_path

        // load parameters from the json file
        const context_obj = JSON.parse(readFileSync(context_path).toString())

        this.eyeLeft = context_obj.left_eye
        this.eyeRight = context_obj.right_eye
        this.eyePos = context_obj.eye_pos
        this.eyeScale = context_obj.eye_scale
        this.eyeDistanceBetween = context_obj.distance_between_eyes

        this.body = context_obj.body
        this.bodyPos = context_obj.body_pos
        this.bodyScale = context_obj.body_scale

        this.mouthPos = context_obj.mouth_pos
        this.mouthScale = context_obj.mouth_scale

        // load static assets
        this.staticAssets = new Array<StaticAsset>()
        context_obj.static_assets.forEach((item: any) => {
            const staticAsset: StaticAsset = {
                name: item.asset,
                scale: item.scale,
                pos: item.pos
            }

            this.staticAssets?.push(staticAsset);
        })

        console.log(this)

    }
    
    // functions for accessing the data

    // returns [x,y] position and scale of mouth
    public mouthData(): [number[], number] {
        return [this.mouthPos!, this.mouthScale!]
    }

    // returns left + right texture name, position, distance between eyes, and scale
    // parameter "time" represents the current time of the video in seconds
    public eyeData(time: number): [string, string, number[], number, number] {

        // a cyclic function to represent how "closed" the eyes are, or how far into a blink it is.
        // 0 = open eyes, 1 = closed eyes
        const blinkSpeed: number = this.config.blink_speed // similar to "variance" in a gaussian distribution
        const blinkPeriod: number = this.config.blink_period // take the inverse of this to get the blink frequency
        const x: number = time % blinkPeriod - blinkPeriod/2
        const eyeIdx: number = Math.round(Math.exp(-blinkSpeed*blinkSpeed*x*x) * (this.eyeLeft!.length-1));
    
        return [this.eyeLeft![eyeIdx], this.eyeRight![eyeIdx], this.eyePos!, this.eyeDistanceBetween!, this.eyeScale!]
    }

    // returns texture, position and scale of body
    public bodyData(): [string, number[], number] {
        return [this.body!, this.bodyPos!, this.bodyScale!]
    }

    public getStaticAssets(): StaticAsset[] {
        return this.staticAssets!
    } 
}

// internal container for storing static assets
interface StaticAsset {
    name: string
    pos: number[]
    scale: number
}