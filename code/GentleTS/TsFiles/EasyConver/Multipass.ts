
     var Transcription = (function () {
        function Transcription(wavfile, resources, nthreads, progress_cb) {
            this.wavfile = wavfile;
            this.resources = resources;
            this.nthreads = nthreads;
            this.progress_cb = progress_cb;
            this.alignment = [];
            this.k = null;
            this.kaldi = null;
            this.ms = null;
            this.wav_obj = null;
            this.wav_obj = new wave.open(wavfile, 'rb');
            this.wav_obj.setpos(int(start_t * wav_obj.getframerate()));
            this.wav_obj = new wave.open(wavfile, 'rb');
            this.wav_obj.setpos(int(start_t * wav_obj.getframerate()));
        }
        Transcription.prototype._push_chunk = function (buf) {
            this.kaldi.push_chunk(buf);
            var ret = [];
            for (var _i = 0, _a = this.kaldi.get_final(); _i < _a.length; _i++) {
                var wd = _a[_i];
                ret.push(new transcription.Word(wd));
            }
            return ret;
        };
        Transcription.prototype._init_kaldi = function () {
            var _this = this;
            if (this.kaldi !== null) {
                return;
            }
            this.kaldi = new standard_kaldi.Kaldi(this.resources.nnet_gpu_path, this.resources.proto_langdir);
            this.kaldi.push_chunk(this.wav_obj.readframes(this.wav_obj.getnframes()));
            var ret = [];
            for (var _i = 0, _a = this.kaldi.get_final(); _i < _a.length; _i++) {
                var wd = _a[_i];
                ret.push(new transcription.Word(wd));
            }
            this.alignment = ret;
            this.kaldi.stop();
            this.kaldi = null;
            this.wav_obj = null;
            // Create a language model
            this.ms = new metasentence.MetaSentence(this.alignment, this.resources.vocab);
            this.kaldi = new standard_kaldi.Kaldi(this.resources.nnet_gpu_path, this.resources.proto_langdir);
            this.kaldi.push_chunk(this.wav_obj.readframes(this.wav_obj.getnframes()));
            var ret = [];
            for (var _i = 0, _a = this.kaldi.get_final(); _i < _a.length; _i++) {
                var wd = _a[_i];
                ret.push(new transcription.Word(wd + 1));
            }
            this.alignment = ret;
            this.kaldi.stop();
            this.kaldi = null;
            this.wav_obj = null;
        }

