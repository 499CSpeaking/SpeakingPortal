import {Image} from 'canvas';
import {InputParser} from './abstract_input'
import fs from 'fs';

export class FileInputParser extends InputParser {
    private readonly parameterValues: any // key-value map to hold parameters
    private readonly filePath: string // path to inputs file

    constructor(filePath: string) {
        super()

        this.filePath = filePath
        this.parameterValues = JSON.parse(fs.readFileSync(this.filePath).toString())
    }

    getParameter(key: string): string {
        let value: string | undefined = this.parameterValues[key]
        if(value) {
            return value
        }

        throw new Error(`there is no parameter associated with key "${key}"`)

    }
    getImage(path: string): Image {
        throw new Error('Method not implemented.');
    }
    
}