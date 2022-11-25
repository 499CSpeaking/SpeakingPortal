class Word {
    SUCCESS = 'success'
    NOT_FOUND_IN_AUDIO = 'not-found-in-audio'
    NOT_FOUND_IN_TRANSCRIPT = 'not-found-in-transcript'

    constructor(
        public case: string = null,
        public startOffset: number = null,
        public endOffset: number = null,
        public word: string = null,
        public alignedWord: string = null,
        public phones: string = null,
        public start: number = null,
        public end: number = null,
        public duration: number = null
    ) {
        if (start !== null) {
            if (end === null) {
                this.end = start + duration;
            } else if (duration === null) {
                this.duration = end - start;
            }
        }
    }

    success() {
        return this.case === Word.SUCCESS;
    }

    not_found_in_audio() {
        return this.case === Word.NOT_FOUND_IN_AUDIO;
    }

    as_dict(without: string = null): any {
        return { key: val for key, val in this.__dict__.items() if (val !== null) && (key !== without) };
    }

    __eq__(other) {
        return this.__dict__ === other.__dict__;
    }

    __ne__(other) {
        return !this === other;
    }

    __repr__() {
        return (
            'Word(' +
            ' '.join(
                sorted(
                    [key + '=' + str(val) for key, val in this.as_dict(without='phones').items()]
                )
            ) +
            ')'
        );
    }

    shift(time: number = null, offset: number = null) {
        if (this.start !== null && time !== null) {
            this.start += time;
            this.end += time;
        }

        if (this.startOffset !== null && offset !== null) {
            this.startOffset += offset;
            this.endOffset += offset;
        }

        return this; // for easy chaining
    }

    swap_alignment(other) {
        // Swaps the alignment info of two words, but does not swap the offset
        this.case, other.case = other.case, this.case;
        this.alignedWord, other.alignedWord = other.alignedWord, this.alignedWord;
        this.phones, other.phones = other.phones, this.phones;
        this.start, other.start = other.start, this.start;
        this.end, other.end = other.end, this.end;
        this.duration, other.duration = other.duration, this.duration;
    }

    corresponds(other) {
        // Returns true if self and other refer to the same word, at the same position in the audio (within a small tolerance)
        if (this.word !== other.word) {
            return false;
        }
        return Math.abs(this.start - other.start) / (this.duration + other.duration) < 0.1;
    }
}
