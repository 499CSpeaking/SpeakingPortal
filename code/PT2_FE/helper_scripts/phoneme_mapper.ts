import { readFileSync } from "fs"
import { GraphicsPool } from "../graphics/graphics_pool"
import { PhonemeMapping } from "../transcript/parse_mappings"
const prompt = require("prompt-sync")({ sigint: true });

async function main() {
    /*
    script to make mapping each phoneme to a mouth texture easier

    don't forget to fill out the inputs!
    note about paths: this program is run using npm run phoneme_mapper so all filepaths are relative
    to the base animation_engine directory
    */

    const transcriptPath: string = './testing/transcript.json'
    const graphicsPath: string = './testing/graphics'



    const config: any = new Object()
    config.transcript = readFileSync(transcriptPath)

    const phonemeMapping: PhonemeMapping = new PhonemeMapping(config)
    const allPhonemes: Set<string> = phonemeMapping.presentPhonemes()

    const images: GraphicsPool = new GraphicsPool(graphicsPath)
    await images.init()

    const allNames:Set<string> =  images.allNames()
    console.log(`all textures:`)
    console.log(Array.from(allNames))
    console.log(`for each phoneme, please enter the texture you wish to associate it with`)

    const out: any = new Object()

    for(let phoneme of allPhonemes) {
        while(true) {
            const input: string = prompt(`${phoneme.padEnd(5)}:`)

            if(!allNames.has(input!)) {
                console.log(`"${input!}" is not a valid texture.`)
                continue
            }

            out[phoneme] = input!
            break
        }
        
    }

    console.log("json output:")
    for(let key in out) {
        console.log(`"${key}": "${out[key]}",`)
    }
}

main()