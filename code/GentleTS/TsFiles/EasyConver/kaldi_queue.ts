
    // convert to typescript

    import { Queue } from "queue";
    import { standard_kaldi } from "gentle";

    export function build(resources: any, nthreads: number = 4, hclg_path: any = null) {
        if (hclg_path === null) hclg_path = resources.full_hclg_path;

        let kaldi_queue = new Queue();
        for (let i = 0; i < nthreads; i++) {
            kaldi_queue.put(standard_kaldi.Kaldi(
                resources.nnet_gpu_path,
                hclg_path,
                resources.proto_langdir
            ));
        }
        return kaldi_queue;
    }