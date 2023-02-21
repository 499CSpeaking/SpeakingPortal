import IntervalTree from "@flatten-js/interval-tree"
import { readFileSync } from "fs"

/*
    this file's purpose is to take a transcript file (which represents a text-to-speech mapping) and
    parse it into an object that organizes phonemes
*/

export class PhonemeMapping {
    private intervalTree: IntervalTree<string>; // data structure that stores mappings
    
    constructor(config: any) {
        this.intervalTree = this.parseFile(config.transcript_path)
    }

    // get phoneme spoken at specific time
    public getAtTime(seconds: number): string {
        const phoneme = this.intervalTree.search([seconds, seconds])
        return phoneme.length > 0 ? phoneme[0] : 'idle'
    }

    private parseFile(path: string): IntervalTree<string> {
        const tree = new IntervalTree<string>()
        
        // the transcript is a JSON file
        const transcript = JSON.parse(readFileSync(path).toString())
        
        /*
            note: the exact format of the transcript folder is flexible, as this is a relatively
            easy thing to modify.
        */
        for(let wordIdx = 0; wordIdx < transcript.words.length; wordIdx += 1) {
            const word: any = transcript.words[wordIdx]
            console.log([word.word, word.start, word.end])
            tree.insert([word.start, word.end], word.word)
        }

        return tree;
    }
}