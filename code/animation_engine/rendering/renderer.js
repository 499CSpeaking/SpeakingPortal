"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const canvas_1 = require("canvas");
const child_process_1 = require("child_process");
const command_exists_1 = __importDefault(require("command-exists"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// everything to do with drawing frames and creating videos
class Renderer {
    constructor(config, graphics, phonemes, phonemeImageConverter, avatarContext) {
        this.config = config;
        this.graphics = graphics;
        this.phonemes = phonemes;
        this.phonemeImageConverter = phonemeImageConverter;
        this.avatarContext = avatarContext;
        // set up rendering context
        this.canvas = (0, canvas_1.createCanvas)(config.width, config.height);
        this.renderCtx = this.canvas.getContext('2d');
    }
    // called to setup filesystem for generating frames
    setup() {
        const root = this.config.frames_path;
        const fullPath = path_1.default.join(root, 'frames');
        // check if ffmpeg actually exists on this machine
        if (!command_exists_1.default.sync("ffmpeg")) {
            console.log(`warning: ffmpeg doesn't seem to be installed`);
        }
        // ensure there's an *empty* directory to store frames
        if (fs_1.default.existsSync(fullPath)) {
            // ensure it's empty
            fs_1.default.readdirSync(fullPath).forEach(filename => fs_1.default.rmSync(path_1.default.join(fullPath, filename)));
        }
        else {
            fs_1.default.mkdirSync(fullPath);
        }
    }
    drawFrame(frameNum, seconds) {
        var _a;
        this.renderCtx.fillStyle = '#999999';
        this.renderCtx.fillRect(0, 0, this.config.width, this.config.height);
        this.renderCtx.font = '10px Arial';
        this.renderCtx.fillStyle = '#111111';
        this.renderCtx.fillText(`currently at frame ${frameNum}`, 10, 10);
        /*
            Here we attempt to get the mouth texture of the dominantly spoken phoneme at this time.
            Note: There must be an "idle" phoneme that represents no speech.
        */
        const [phoneme, dominance] = (_a = this.phonemes.getDominantPhonemeAt(seconds)) !== null && _a !== void 0 ? _a : ["idle", this.config.phoneme_idle_threshold + 0.01];
        const imageName = this.phonemeImageConverter.getImageName(phoneme);
        if (!imageName) {
            throw new Error(`phoneme "${phoneme}" isn't recognized by the phoneme-image converter`);
        }
        const mouth = this.graphics.get(imageName);
        /*
            Much of this code below is a quick hardcode for the demo. I will improve upon it later
        */
        const body = this.graphics.get("body.png");
        const bodyScale = 0.2;
        this.renderCtx.drawImage(body, this.config.width / 2 - bodyScale * body.width / 2, this.config.height / 2 - bodyScale * body.height / 2, body.width * bodyScale, body.height * bodyScale);
        const mouthScale = 0.3;
        const mouthY = -26;
        this.renderCtx.drawImage(mouth, this.config.width / 2 - mouthScale * mouth.width / 2, this.config.height / 2 + mouthY, mouthScale * mouth.width, mouthScale * mouth.height * (0.90 + dominance * 0.2));
        const leftEye = [this.graphics.get("eye_left_open.svg"), this.graphics.get("eye_left_half.svg"), this.graphics.get("eye_left_closed.svg")];
        const rightEye = [this.graphics.get("eye_right_open.svg"), this.graphics.get("eye_right_half.svg"), this.graphics.get("eye_right_closed.svg")];
        const eyeScale = 0.26;
        const eyeY = -50;
        const eyeOffsetFromCenter = 15;
        this.renderCtx.drawImage(leftEye[0], this.config.width / 2 - eyeScale * leftEye[0].width / 2 + eyeOffsetFromCenter, this.config.height / 2 - eyeScale * leftEye[0].width / 2 + eyeY, eyeScale * leftEye[0].width, eyeScale * leftEye[0].height);
        this.renderCtx.drawImage(rightEye[0], this.config.width / 2 - eyeScale * rightEye[0].width / 2 - eyeOffsetFromCenter, this.config.height / 2 - eyeScale * rightEye[0].width / 2 + eyeY, eyeScale * rightEye[0].width, eyeScale * rightEye[0].height);
        const glasses = this.graphics.get("glasses.svg");
        const glassesScale = 0.2;
        const glassesY = -45;
        this.renderCtx.drawImage(glasses, this.config.width / 2 - glassesScale * glasses.width / 2, this.config.height / 2 - glassesScale * glasses.height / 2 + glassesY, glassesScale * glasses.width, glassesScale * glasses.height);
        fs_1.default.writeFileSync(path_1.default.join(this.config.frames_path, 'frames', `frame_${frameNum.toString().padStart(12, '0')}.png`), this.canvas.toBuffer('image/png'));
    }
    // call to generate the video
    // returns the path to file
    generateVideo() {
        const filename = path_1.default.join(this.config.video_path, 'out.mp4');
        const tmpFilename = path_1.default.join(this.config.frames_path, 'video.mp4');
        try {
            // ffmpeg is used to generate the video
            // append frame images together
            (0, child_process_1.execSync)(`ffmpeg -y -r ${this.config.frames_per_second} -i ${path_1.default.join(this.config.frames_path, 'frames', 'frame_%12d.png')} ${tmpFilename} -hide_banner -loglevel error`);
            // In case we have a .wav file (we likely do) instead of a .mp3, convert it to mp3
            const mp3AudioPath = this.config.audio_path.replace(".wav", ".mp3");
            console.log([this.config.audio_path, mp3AudioPath]);
            (0, child_process_1.execSync)(`ffmpeg -y -i ${this.config.audio_path} -acodec libmp3lame ${mp3AudioPath} -hide_banner -loglevel error`);
            // append audio to video file
            (0, child_process_1.execSync)(`ffmpeg -y -i ${tmpFilename} -i ${mp3AudioPath} -c copy -map 0:v:0 -map 1:a:0 ${filename} -hide_banner -loglevel error`);
        }
        catch (e) {
            throw new Error('error with ffmpeg: ' + e.message);
        }
        return filename;
    }
}
exports.Renderer = Renderer;
