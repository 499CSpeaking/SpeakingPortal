/*
    this class holds all images loaded by the program
*/

import { Image, loadImage } from "canvas"
import {promises} from "fs"
import path from "path"

export class GraphicsPool {
    private images: Map<string, Image> | undefined
    private directoryPath: string

    constructor(directoryPath: string) {
        this.directoryPath = directoryPath
    }

    public async init() {
        this.images = await this.loadImages(this.directoryPath)
    }

    private async loadImages(directoryPath: string): Promise<Map<string, Image>> {
        const map: Map<string, Image> = new Map<string, Image>()

        // load each image into the hashmap
        const fileNames: string[] = await promises.readdir(directoryPath);
        for(const fileName of fileNames) {
            map.set(fileName, await loadImage(path.join(directoryPath, fileName)))
        }

        return map
    }

    public get(imageName: string): Image {
        const image: Image | undefined = this.images?.get(imageName)
        if(image) {
            return image
        }
        throw new Error(`image "${imageName}" not found. Perhaps it wasn't loaded in "${this.directoryPath}"?`)
    }

    public allNames(): Set<string> {
        let set: Set<string> = new Set<string>()
        for(const name of this.images!) {
            set.add(name[0])
        }

        return set
    }
}