
            class Resources {
                public  proto_langdir: string;
                public  nnet_gpu_path: string;
                public  full_hclg_path: string;
                public  vocab: string[];
            
                constructor() {
                    this.proto_langdir = get_resource('exp');
                    this.nnet_gpu_path = get_resource('exp/tdnn_7b_chain_online/');
                    this.full_hclg_path = get_resource('exp/tdnn_7b_chain_online/graph_pp/HCLG.fst');
            
                    const require_dir = (path: string) => {
                        if (!fs.existsSync(path as any)) {
                            throw new Error(`No resource directory ${path}.  Check ${ENV_VAR} environment variable?`);
                        }
                    };

                    require_dir(this.proto_langdir);
                    require_dir(this.nnet_gpu_path);

                    const words = fs.readFileSync (path.join(this.proto_langdir, "langdir", "words.txt"), 'utf8');
                    this.vocab = metasentence.load_vocabulary(words);
                }
            }