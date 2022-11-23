
    class MultiThreadedTranscriber {
        chunk_len: number;
        overlap_t: number;
        nthreads: number;
        kaldi_queue: any;
        constructor(kaldi_queue: any, chunk_len: number = 20, overlap_t: number = 2, nthreads: number = 4) {
            this.chunk_len = chunk_len;
            this.overlap_t = overlap_t;
            this.nthreads = nthreads;
            this.kaldi_queue = kaldi_queue; 
                    }


                    transcribe(wavfile: any, progress_cb: any = null) {
                        let wav_obj = wave.open(wavfile, 'rb');
                        let duration = wav_obj.getnframes() / parseFloat(wav_obj.getframerate());
                        let n_chunks = parseInt(math.ceil(duration / parseFloat(this.chunk_len - this.overlap_t)));
                        let chunks = [];
                        function transcribe_chunk(idx: any) {
                            let wav_obj = wave.open(wavfile, 'rb');
                            let start_t = idx * (this.chunk_len - this.overlap_t);
                            // Seek
                            wav_obj.setpos(parseInt(start_t * wav_obj.getframerate()));
                            // Read frames
                            let buf = wav_obj.readframes(parseInt(this.chunk_len * wav_obj.getframerate()));
                            if (len(buf) < 4000) {
                                logging.info('Short segment - ignored %d' % (idx));
                                let ret = [];
                            } else {
                                let k = this.kaldi_queue.get();
                                k.push_chunk(buf);
                                let ret = k.get_final();
                                // k.reset() (no longer needed)
                                this.kaldi_queue.put(k);
                            }
                            chunks.push({"start": start_t, "words": ret});
                            logging.info('%d/%d' % (len(chunks), n_chunks));
                            if (progress_cb !== null) {
                                progress_cb({"message": ' '.join([X['word'] for X in ret]),
                                             "percent": len(chunks) / parseFloat(n_chunks)});
                            }
                        }
                        let pool = Pool(min(n_chunks, this.nthreads));
                        pool.map(transcribe_chunk, range(n_chunks));
                        pool.close();
                        chunks.sort(key=lambda x: x['start']);
                        // Combine chunks
                        let words = [];
                        for (let c of chunks) {
                            let chunk_start = c['start'];
                            let chunk_end = chunk_start + this.chunk_len;
                            let chunk_words = [transcription.Word(**wd).shift(time=chunk_start) for wd in c['words']];
                            // At chunk boundary cut points the audio often contains part of a
                            // word, which can get erroneously identified as one or more different
                            // in-vocabulary words.  So discard one or more words near the cut points
                            // (they'll be covered by the ovlerap anyway).
                            //
                            let trim = min(0.25 * this.overlap_t, 0.5);
                            if (c !== chunks[0]) {
                                while (len(chunk_words) > 1) {
                                    chunk_words.pop(0);
                                    if (chunk_words[0].end > chunk_start + trim) {
                                        break;
                                    }
                                }
                            }
                            if (c !== chunks[-1]) {
                                while (len(chunk_words) > 1) {
                                    chunk_words.pop();
                                    if (chunk_words[-1].start < chunk_end - trim) {
                                        break;
                                    }
                                }
                            }
                            words.extend(chunk_words);
                                                    }
                        // Remove overlap:  Sort by time, then filter out any Word entries in
                        // the list that are adjacent to another entry corresponding to the same
                        // word in the audio.
                        words.sort(key=lambda word: word.start);
                        words.append(transcription.Word(word="__dummy__"));
                        words = [words[i] for i in range(len(words)-1) if not words[i].corresponds(words[i+1])];
                        return words, duration;
                    }
    }
