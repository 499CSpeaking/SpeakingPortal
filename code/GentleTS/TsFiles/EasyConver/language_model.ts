
    import { Queue } from "queue";
    import { standard_kaldi } from "gentle";
    import { get_binary } from "gentle";
    import { MetaSentence } from "gentle";
    import { Resources } from "gentle";
    import { OOV_TERM } from "gentle";
    import { make_bigram_lm_fst } from "gentle";
    import { make_bigram_language_model } from "gentle";

    const MKGRAPH_PATH = get_binary("ext/m3");

    // [oov] no longer in words.txt
    const OOV_TERM = '<unk>';

    export function make_bigram_lm_fst(word_sequences: any, kwargs: any) {
        /*
        Use the given token sequence to make a bigram language model
        in OpenFST plain text format.

        When the "conservative" flag is set, an [oov] is interleaved
        between successive words.

        When the "disfluency" flag is set, a small set of disfluencies is
        interleaved between successive words

        `Word sequence` is a list of lists, each valid as a start
        */

        if (word_sequences.length === 0 || typeof word_sequences[0] !== "list") {
            word_sequences = [word_sequences];
        }

        const conservative = kwargs["conservative"] ? kwargs["conservative"] : false;
        const disfluency = kwargs["disfluency"] ? kwargs["disfluency"] : false;
        const disfluencies = kwargs["disfluencies"] ? kwargs["disfluencies"] : [];

        const bigrams = { [OOV_TERM]: new Set([OOV_TERM]) };

        for (const word_sequence of word_sequences) {
            if (word_sequence.length === 0) {
                continue;
            }

            let prev_word = word_sequence[0];
            bigrams[OOV_TERM].add(prev_word); // valid start (?)

            if (disfluency) {
                bigrams[OOV_TERM].update(disfluencies);

                for (const dis of disfluencies) {
                    bigrams[dis] = bigrams[dis] ? bigrams[dis] : new Set();
                    bigrams[dis].add(prev_word);
                    bigrams[dis].add(OOV_TERM);
                }
            }

            for (const word of word_sequence.slice(1)) {
                bigrams[prev_word] = bigrams[prev_word] ? bigrams[prev_word] : new Set();
                bigrams[prev_word].add(word);

                if (conservative) {
                    bigrams[prev_word].add(OOV_TERM);
                }

                if (disfluency) {
                    bigrams[prev_word].update(disfluencies);

                    for (const dis of disfluencies) {
                        bigrams[dis] = bigrams[dis] ? bigrams[dis] : new Set();
                        bigrams[dis].add(word);
                    }
                }

                prev_word = word;
            }

            // ...valid end
            bigrams[prev_word] = bigrams[prev_word] ? bigrams[prev_word] : new Set();
            bigrams[prev_word].add(OOV_TERM);
        }

        const node_ids: any = {};
        function get_node_id(word: any) {
            const node_id = node_ids[word] ? node_ids[word] : Object.keys(node_ids).length + 1;
            node_ids[word] = node_id;
            return node_id;
        }

        let output = "";
        for (const from_word of Object.keys(bigrams).sort()) {
            const from_id = get_node_id(from_word);

            const successors = bigrams[from_word as any];
            let weight = 0;
            if (successors.length > 0) { weight = -Math.log(1.0 / successors.length); } else { weight = 0; }

            for (const to_word of Object.keys(successors).sort()) {
                const to_id = get_node_id(to_word);
                output += `${from_id}    ${to_id}    ${to_word}    ${to_word}    ${weight}`;

                output += "";
            }
        }

        output += `${Object.keys(node_ids).length}    0`;

        return output;
    }

 