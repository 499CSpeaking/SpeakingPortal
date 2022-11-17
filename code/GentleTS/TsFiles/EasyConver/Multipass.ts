
        class MetaSentence {
            raw_sentence: string;
            vocab: Set<string>;
            _seq: Array<{start: number, end: number, token: string}>;

            constructor(sentence: string, vocab: Set<string>) {
                this.raw_sentence = sentence;
                this.vocab = vocab;
                this._tokenize();
            }

            _tokenize() {
                this._seq = [];
                let re = /(\w|\’\w|\'\w)+/g;
                let m;
                while ((m = re.exec(this.raw_sentence)) !== null) {
                    let start = m.index;
                    let end = start + m[0].length;
                    let word = m[0];
                    let token = kaldi_normalize(word, this.vocab);
                    this._seq.push({
                        start: start, // as unicode codepoint offset
                        end: end, // as unicode codepoint offset
                        token: token,
                    });
                }
            }

            get_kaldi_sequence(): Array<string> {
                return this._seq.map(x => x.token);
            }

            get_display_sequence(): Array<string> {
                let display_sequence = [];
                for (let x of this._seq) {
                    let start = x.start;
                    let end = x.end;
                    let word = this.raw_sentence.substring(start, end);
                    display_sequence.push(word);
                }
                return display_sequence;
            }

            get_text_offsets(): Array<[number, number]> {
                return this._seq.map(x => [x.start, x.end]);
            }
        }

        function kaldi_normalize(word: string, vocab: Set<string>): string {
            let norm = word.toLowerCase();
            // Turn fancy apostrophes into simpler apostrophes
            norm = norm.replace("’", "'");
            if (!vocab.has(norm)) {
                norm = OOV_TERM;
            }
            return norm;
        }

