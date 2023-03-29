/*
    given a phoneme, we need to get the mouth (image) it emulates
*/

import { readFileSync } from "fs"

export class PhonemeImageconverter {
    private mapping: Map<string, string>

    constructor(config: any) {
        this.mapping = this.createMappings(config)
    }

    private createMappings(config: any): Map<string, string> {
        // get the file contents that specify the mapping
        const graphicsConfigFile: any = JSON.parse(readFileSync(config.graphics_config_path).toString())
        const mouths: any = graphicsConfigFile.mouths
        
        const map = new Map<string, string>()
        for(let phoneme in mouths) {
            map.set(phoneme, mouths[phoneme])
        }

        return map
    }

    /*
        this class doesn't return the image, just the name of the image such that a GraphicsPool
        object can fetch the image
    */

        public getImageName(phoneme: string): string | undefined {
            return this.mapping.get(phoneme)
        }
}