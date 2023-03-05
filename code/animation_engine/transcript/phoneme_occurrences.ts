import { ArrayFilter } from "./filtering/filter";
import { GaussianFilter } from "./filtering/gaussian";
import { PhonemeMapping } from "./parse_mappings";

/*
    This class takes all phonemes from the transcript and gives each of them an array of floats.
    Each index corresponds to a contiguous point in time. A zero value at that index means the 
    phoneme is not currently being spoken, a non-zero value means the phoneme is being spoken. The
    exact value is non-binary due to low-pass filtering that smooths out the arrays
*/
export class PhonemeOccurrences {
    private occurrences: Map<string, Array<number>>;
    private arraySize: number;
    private config: any;
    
    constructor(config: any, mappings: PhonemeMapping) {
        this.config = config
        this.arraySize = Math.ceil(config.phoneme_samples_per_second * config.video_length)
        this.occurrences = this.initOccurrences(mappings)
    }

    // populate the occurrences array
    public initOccurrences(mappings: PhonemeMapping): Map<string, Array<number>> {
        const allPhonemes: Set<string> = mappings.presentPhonemes()
        const phonemeOccurrences = new Map<string, Array<number>>

        // initialize the phoneme arrays
        for(let key of allPhonemes) {
            phonemeOccurrences.set(key, new Array<number>(this.arraySize).fill(0))
        }

        // fill arrays with 1s and 0s
        for(let step = 0; step < this.arraySize; step += 1) {
            const spokenPhoneme: string | undefined = mappings.getAtTime(step / this.config.phoneme_samples_per_second)
            if(spokenPhoneme) {
                phonemeOccurrences.get(spokenPhoneme)![step] = 1
            }
        }

        // low pass all the arrays
        let filter: ArrayFilter = new GaussianFilter(this.config.filter_kernel_size, this.config.filter_kernel_variance)
        for(let key of allPhonemes) {
            const filtered = filter.filter(phonemeOccurrences.get(key)!)
            phonemeOccurrences.set(key, filtered)
        }

        return phonemeOccurrences
    }

    // get the phoneme that has the highest "speaking score" at a particular instance in time
    public getDominantPhonemeAt(seconds: number): [string, number] | undefined {
        let sampleAt: number = Math.round(seconds * this.config.phoneme_samples_per_second)
        if(sampleAt >= this.arraySize) {
            // cannot sample outside what's stored
            return undefined
        }

        // get a max value
        let phoneme: string | undefined = undefined
        let maxAmount: number = 0
        for(let currentPhoneme of this.occurrences.keys()) {
            const sample = this.occurrences.get(currentPhoneme)![sampleAt]
            if(sample > maxAmount) {
                maxAmount = sample
                phoneme = currentPhoneme[0]
            }
        }

        if(maxAmount < this.config.phoneme_idle_threshold) {
            // phonemes which are excessively small are considered non-present
            return undefined
        }

        return [phoneme!, maxAmount]
    }
}