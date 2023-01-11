
        class RPCProtocol {
            send_pipe: any;
            recv_pipe: any;
            constructor(send_pipe, recv_pipe) {
                this.send_pipe = send_pipe;
                this.recv_pipe = recv_pipe;
            }
            do(method, ...args) {
                const body = kwargs.get('body', null);
                this._write_request(method, args, body);
                return this._read_reply();
            }
            _write_request(method, args, body) {
                let data = method;
                for (const arg of args) {
                    data += ' ' + arg;
                }
                data += '\n';
                if (body) {
                    data += body;
                }
                try {
                    this.send_pipe.write('%d \ n' % len(data));
                    this.send_pipe.write(data);
                    this.send_pipe.write('\ n');
                }
                catch (_a) {
                    throw new IOError('Lost connection with standard_kaldi subprocess');
                }
            }
            _read_reply() {
                try {
                    const msg_size = parseInt(this.recv_pipe.readline());
                    const data = this.recv_pipe.read(msg_size);
                    this.recv_pipe.read(1); // trailing newline
                    const [status_str, body] = data.split('\ n', 1);
                    const status = parseInt(status_str);
                }
                catch (_b) {
                    throw new IOError('Lost connection with standard_kaldi subprocess');
                }
                if (status < 200 || status >= 300) {
                    throw new RPCError(status, body);
                }
                return [body, status];
            }
        }