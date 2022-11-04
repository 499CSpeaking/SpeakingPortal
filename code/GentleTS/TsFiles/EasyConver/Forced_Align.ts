
// class forced_alignment
class ForcedAlignment {
    private nthreads: number;
    private queue: any;
    private ms: any;
    private kwargs: any;
    private resources: any;
    private transcript: any;

    constructor(nthreads: number, queue: any, ms: any, kwargs: any, resources: any, transcript: any) {
        this.nthreads = nthreads;
        this.queue = queue;
        this.ms = ms;
        this.kwargs = kwargs;
        this.resources = resources 
        this.transcript = transcript;
    }

    public align(wavfile: string, duration: number, progress_cb: any, logging: any) {
        let words = this.transcript.words;
        if (logging) {
            logging.info("before alignment: %d unaligned words (of %d)" % (len([X for X in words if X.not_found_in_audio()]), len(words)));
        }

        if (progress_cb) {
            progress_cb({'status': 'ALIGNING'});
        }

        words = multipass.realign(wavfile, words, this.ms, resources=this.resources, nthreads=this.nthreads, progress_cb=progress_cb);

        if (logging) {
            logging.info("after 2nd pass: %d unaligned words (of %d)" % (len([X for X in words if X.not_found_in_audio()]), len(words)));
        }

        words = new AdjacencyOptimizer(words, duration).optimize();

        return new Transcription(words=words, transcript=this.transcript);
    }
}

// class AdjacencyOptimizer
class AdjacencyOptimizer {
    private words: any;
    private duration: number;

    constructor(words: any, duration: number) {
        this.words = words;
        this.duration = duration;
    }

    public out_of_audio_sequence(i: number) {
        let j = i;
        while (0 <= j < len(this.words) && this.words[j].not_found_in_audio()) {
            j += 1;
        }
        return None if j == i else j;
    }

    public tend(i: number) {
        for (let word of reversed(this.words[:i])) {
            if (word.success()) {
                return word.end;
            }
        }
        return 0;
    }

    public tstart(i: number) {
        for (let word of this.words[i:]) {
            if (word.success()) {
                return word.start;
            }
        }
        return this.duration;
    }

    public find_subseq(i: number, j: number, p: number, n: number) {
        for (let k = i; k < j-n+1; k++) {
            for (let m = p; m < p+n; m++) {
                if (this.words[k].word != this.words[m].word) {
                    break;
                }
            }
            else {
                return k;
            }
        } 
        return None;
    }

    public swap_adjacent_if_better(i: number, j: number, n: number, side: string) {
        // Given an out-of-audio sequence at [i,j), looks to see if the adjacent n words
        // can be beneficially swapped with a subsequence.

        // construct adjacent candidate words and their gap relative to their
        // opposite neighbors
        let p, q;
        if (side == "left") {
            p = i-n;
            q = i;
            if (p < 0) {
                return false;
            }
            opp_gap = this.tstart(p) - this.tend(p);
        }
        else {
            p = j;
            q = j+n;
            if (q > len(this.words)) {
                return false;
            }
            opp_gap = this.tstart(q) - this.tend(q);
        }

        // is there a matching subsequence?
        let k = this.find_subseq(i, j, p, n);
        if (k is None) {
            return false;
        }

        // if the opposite gap isn't bigger than the sequence gap, no benefit to
        // potential swap
        let seq_gap = this.tstart(j) - this.tend(i);
        if (opp_gap <= seq_gap) {
            return false;
        }

        // swap subsequences at p and k
        for (let m = 0; m < n; m++) {
            this.words[k+m].swap_alignment(this.words[p+m]);
        }

        return true;
    }

    public optimize_adjacent(i: number, j: number) {
        // Given an out-of-audio sequence at [i,j), looks for an opportunity to
        // swap a sub-sequence with adjacent words at [p, i) or [j, p)

        for (let n of reversed(range(1, (j-i)+1))) { // consider larger moves first
            if (this.swap_adjacent_if_better(i, j, n, "left")) {
                return true;
            }
            if (this.swap_adjacent_if_better(i, j, n, "right")) {
                return true;
            }
        }
    }

    public optimize() {
        let i = 0;
        while (i < len(this.words)) {
            let j = this.out_of_audio_sequence(i); 
            if (j is None) {
                i += 1;
            }
            else if (this.optimize_adjacent(i, j)) {
                // back up to rescan in case we swapped left
                while (i >= 0 && this.words[i].not_found_in_audio()) {
                    i -= 1;
                }
            }
            else {
                i = j; // skip past this sequence
            }
        }
        return this.words;
    }
}

