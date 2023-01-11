

class  Resampler  {
    public  resample(infile: string, outfile: string, offset: number, duration: number) {
        if (!fs.existsSync(infile)) {
            throw new Error(`Not a file: ${infile}`);
        }
        if (shutil.which(FFMPEG)) {
            return this.resample_ffmpeg(infile, outfile, offset, duration);
        } else {
            return this.resample_sox(infile, outfile, offset, duration);
        }
    }

    public  async  resampled(infile: string, offset: number, duration: number) {
        const fp = await tmp.file({ postfix: '.wav' });
        if (this.resample(infile, fp.path, offset, duration) !== 0) {
            throw new Error(`Unable to resample/encode '${infile}'`);
        }
        return fp.path;
    }

    private  resample_ffmpeg(infile: string, outfile: string, offset: number, duration: number) {
        const cmd = [
            FFMPEG,
            '-loglevel', 'panic',
            '-y',
            ...(offset ? ['-ss', String(offset)] : []),
            '-i', infile,
            ...(duration ? ['-t', String(duration)] : []),
            '-ac', '1', '-ar', '8000',
            '-acodec', 'pcm_s16le',
            outfile
        ];
        return spawnSync(cmd[0], cmd.slice(1)).status;
    }

    private  resample_sox(infile: string, outfile: string, offset: number, duration: number) {
        const trim = offset ? ['trim', String(offset)] : [];
        if (duration) {
            trim.push(String(duration));
        }
        const cmd = [
            SOX,
            '--clobber',
            '-q',
            '-V1',
            infile,
            '-b', '16',
            '-c', '1',
            '-e', 'signed-integer',
            '-r', '8000',
            '-L',
            outfile,
            ...trim
        ];
        return spawnSync(cmd[0], cmd.slice(1)).status;
    }

}

