import IntervalTree from "@flatten-js/interval-tree"
import { readFileSync } from "fs"
import { workerData } from "worker_threads";

/*
    this file's purpose is to take a transcript file (which represents a text-to-speech mapping) and
    parse it into an object that organizes phonemes
*/

export class PhonemeMapping {
    private intervalTree: IntervalTree<string>; // data structure that stores mappings
    
    constructor(config: any) {
        this.intervalTree = this.parseFile(config)
    }

    // get phoneme spoken at specific time
    public getAtTime(seconds: number): string {
        const phoneme = this.intervalTree.search([seconds, seconds])
        return phoneme.length > 0 ? phoneme[0] : 'idle'
    }

    private parseFile(config: any): IntervalTree<string> {
        const tree = new IntervalTree<string>()
        
        // the transcript is a JSON file
        const transcript = JSON.parse(config.transcript.toString())
        
        /*
            note: the exact format of the transcript folder is flexible, as this is a relatively
            easy thing to modify.

            parse the phonemes into a more usable data structure
        */
        for(let wordIdx = 0; wordIdx < transcript.words.length; wordIdx += 1) {
            const word: any = transcript.words[wordIdx]
            
            let cumulativeOffset = word.start
            for(let phonemeIdx = 0; phonemeIdx < word.phones.length; phonemeIdx += 1) {
                const phoneme: any = word.phones[phonemeIdx]

                tree.insert([cumulativeOffset, cumulativeOffset + phoneme.duration], word.word + " " + phoneme.phone)
                cumulativeOffset += phoneme.duration

                console.log([[cumulativeOffset, cumulativeOffset + phoneme.duration], word.word, phoneme.phone])
            }
        }

        return tree;
    }
}