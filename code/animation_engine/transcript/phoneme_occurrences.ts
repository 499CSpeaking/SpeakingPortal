import { PhonemeMapping } from "./parse_mappings";

/*
    This class takes all phonemes from the transcript and gives each of them an array of floats.
    Each index corresponds to a contiguous point in time. A zero value at that index means the 
    phoneme is not currently being spoken, a non-zero value means the phoneme is being spoken. The
    exact value is non-binary due to low-pass filtering that smooths out the arrays
*/
export class PhonemeOccurrences {
    private occurrences: Map<string, Array<number>>;
    
    constructor(config: any, mappings: PhonemeMapping) {
        this.occurrences = this.initOccurrences(config, mappings)
    }

    // populate the occurrences array
    public initOccurrences(config: any, mappings: PhonemeMapping): Map<string, Array<number>> {
        const allPhonemes: Set<string> = mappings.presentPhonemes()
        const phonemeOccurrences = new Map<string, Array<number>>

        const arraySize = Math.ceil(config.phoneme_samples_per_second * config.placeholder_video_length)
        for(let key of allPhonemes) {
            phonemeOccurrences.set(key, new Array<number>(arraySize).fill(0))
        }

        // fill arrays with 1s and 0s, will low-pass filter them later
        for(let step = 0; step < arraySize; step += 1) {
            const spokenPhoneme: string | undefined = mappings.getAtTime(step / config.phoneme_samples_per_second)
            console.log([step * config.phoneme_samples_per_second, spokenPhoneme])
            if(spokenPhoneme) {
                phonemeOccurrences.get(spokenPhoneme)![step] = 1
            }
        }
        console.log(phonemeOccurrences)

        return phonemeOccurrences
    }
}