
// class FullTranscriber
class FullTranscriber {
    private available: boolean;
    private mtt: MultiThreadedTranscriber;

    constructor(resources: any, nthreads: number = 2) {
        this.available = false;
        if (nthreads <= 0) return;
        if (!os.path.exists(resources.full_hclg_path)) return;

        let queue = kaldi_queue.build(resources, nthreads = nthreads);
        this.mtt = new MultiThreadedTranscriber(queue, nthreads = nthreads);
        this.available = true;
    }

    public transcribe(wavfile: string, progress_cb: any = null, logging: any = null) {
        let words, duration = this.mtt.transcribe(wavfile, progress_cb = progress_cb);
    }

    public make_transcription
}



