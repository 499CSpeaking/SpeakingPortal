"use strict";
/*
    Here is the first demo for generating a video using canvas, given a simple transcript generated by gentle.
    See input_mappings folder to see what the transcripts look like
    
    The parameters to configure the output are located in inputs.json
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("canvas");
var fs_1 = __importDefault(require("fs"));
var process_1 = require("process");
var get_video_duration_1 = require("get-video-duration");
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
var child_process_1 = require("child_process");
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var WIDTH, HEIGHT, TRANSCRIPT_PATH, PHONEME_MAPPINGS_PATH, MOUTH_TEXTURES_PATH, MOUTH_ON_BODY_OFFSET, BODY_TEXTURE_PATH, BODY_SCALE, MOUTH_SCALE, AUDIO_PATH, FRAME_RATE, PHONEME_OCCURRENCE_CONVOLUTION, DYNAMIC_EYES, EYES_SPACING, EYE_SCALE, EYE_TEXTURES_PATH, EYE_MAPPINGS_PATH, EYES_ON_BODY_OFFSET, BLINK_INTERVAL // seconds per blink
        , static_assets, video_length // in seconds
        , num_frames, transcript, mouths, left_eye, right_eye, body, phoneme_occurrences, blink_occurrences, blink_max_amount, parameters, filterSum, e_1, mouth_mappings_file, _a, _b, _c, _i, phoneme, _d, _e, _f, e_2, e_3, parsed, i, parsed_asset, _g, _h, e_4, e_5, eye_mapping, length_1, i, _j, _k, _l, _m, e_6, step_size, i, filterLen, blink_occurrences_copy, i, localSum, j, di, i, e_7, canvas, ctx, current_word_idx, current_phoneme_idx, current_phoneme_offset, num_words, frame, active_word, active_phoneme, current_time, num_phonemes, _loop_1, frame;
        var _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    mouths = new Map();
                    phoneme_occurrences = new Map();
                    blink_max_amount = 1e-10;
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, 35, , 36]);
                    parameters = JSON.parse(fs_1.default.readFileSync('./inputs_barb.json').toString());
                    WIDTH = parameters.width;
                    HEIGHT = parameters.height;
                    TRANSCRIPT_PATH = parameters.input_transcript;
                    PHONEME_MAPPINGS_PATH = parameters.input_mouth_mappings;
                    MOUTH_TEXTURES_PATH = parameters.input_mouth_mappings_textures;
                    MOUTH_ON_BODY_OFFSET = parameters.input_mouth_on_body_offset_from_center;
                    BODY_TEXTURE_PATH = parameters.input_body_texture;
                    BODY_SCALE = parameters.input_body_scale;
                    MOUTH_SCALE = parameters.input_mouth_scale;
                    AUDIO_PATH = parameters.input_audio;
                    FRAME_RATE = parameters.output_frame_rate;
                    PHONEME_OCCURRENCE_CONVOLUTION = parameters.phoneme_occurrence_convolution_filter;
                    DYNAMIC_EYES = parameters.use_custom_eyes;
                    EYES_SPACING = parameters.input_eye_spacing;
                    EYE_SCALE = parameters.input_eye_scale;
                    EYE_TEXTURES_PATH = parameters.input_eyes_textures;
                    EYE_MAPPINGS_PATH = parameters.input_eye_mappings;
                    EYES_ON_BODY_OFFSET = parameters.input_eyes_on_body_offset_from_center;
                    BLINK_INTERVAL = parameters.input_blink_interval;
                    if (!(WIDTH && HEIGHT && TRANSCRIPT_PATH && PHONEME_MAPPINGS_PATH && MOUTH_TEXTURES_PATH && MOUTH_ON_BODY_OFFSET && BODY_TEXTURE_PATH && BODY_SCALE && MOUTH_SCALE && AUDIO_PATH && FRAME_RATE && PHONEME_OCCURRENCE_CONVOLUTION)) {
                        throw new Error("missing parameters in inputs.json?");
                    }
                    if (typeof DYNAMIC_EYES == 'undefined') {
                        DYNAMIC_EYES = false;
                    }
                    // eyes are optional
                    if (DYNAMIC_EYES && !(EYES_SPACING && EYE_TEXTURES_PATH && EYES_ON_BODY_OFFSET && BLINK_INTERVAL)) {
                        throw new Error("use_custom_eyes is set to true but some eyes-related parameters are missing in inputs.json, it seems");
                    }
                    // verifying this filter is correct
                    try {
                        if (PHONEME_OCCURRENCE_CONVOLUTION.length % 2 == 0) {
                            throw new Error("phoneme_occurrence_convolution_filter length of ".concat(PHONEME_OCCURRENCE_CONVOLUTION.length, " must be an odd number length"));
                        }
                        filterSum = PHONEME_OCCURRENCE_CONVOLUTION.reduce(function (a, b) { return a + b; }, 0);
                        if (Math.abs(filterSum - 1) > 0.1) {
                            //don't need to do this check
                            //throw new Error(`phoneme_occurrence_convolution_filter must sum to 1, not ${filterSum}`)
                        }
                    }
                    catch (e) {
                        throw new Error("invalid phoneme_occurrence_convolution_filter: ".concat(e.message));
                    }
                    _p.label = 2;
                case 2:
                    _p.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, get_video_duration_1.getVideoDurationInSeconds)(AUDIO_PATH)];
                case 3:
                    video_length = _p.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _p.sent();
                    throw new Error("couldn't extract video length from ".concat(AUDIO_PATH, ": ").concat(e_1.message));
                case 5:
                    num_frames = FRAME_RATE * video_length;
                    try {
                        transcript = JSON.parse(fs_1.default.readFileSync(TRANSCRIPT_PATH).toString());
                    }
                    catch (e) {
                        throw new Error("couldn't parse the transcript located at ".concat(TRANSCRIPT_PATH, ": ").concat(e.message));
                    }
                    _p.label = 6;
                case 6:
                    _p.trys.push([6, 11, , 12]);
                    mouth_mappings_file = JSON.parse(fs_1.default.readFileSync(PHONEME_MAPPINGS_PATH).toString());
                    _a = mouth_mappings_file;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _p.label = 7;
                case 7:
                    if (!(_i < _b.length)) return [3 /*break*/, 10];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 9];
                    phoneme = _c;
                    _e = (_d = mouths).set;
                    _f = [phoneme];
                    return [4 /*yield*/, (0, canvas_1.loadImage)("".concat(MOUTH_TEXTURES_PATH, "/").concat(mouth_mappings_file[phoneme]))];
                case 8:
                    _e.apply(_d, _f.concat([_p.sent()]));
                    phoneme_occurrences.set(phoneme, new Array(Math.floor(num_frames)).fill(0));
                    _p.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10:
                    if (!mouths.get('idle')) {
                        throw new Error("you are missing an \"idle\" entry in ".concat(PHONEME_MAPPINGS_PATH, " that represents the mouth's non-speaking texture"));
                    }
                    return [3 /*break*/, 12];
                case 11:
                    e_2 = _p.sent();
                    throw new Error("couldn't parse the phoneme-to-mouth mappings located at ".concat(PHONEME_MAPPINGS_PATH, ": ").concat(e_2.message));
                case 12:
                    // mouth on body position
                    if (MOUTH_ON_BODY_OFFSET.length != 2 || typeof MOUTH_ON_BODY_OFFSET[0] != "number") {
                        throw new Error("input_mouth_on_body_offset_from_center \"".concat(MOUTH_ON_BODY_OFFSET, "\" must be an array of numbers of length 2"));
                    }
                    _p.label = 13;
                case 13:
                    _p.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, (0, canvas_1.loadImage)(BODY_TEXTURE_PATH)];
                case 14:
                    //body texture
                    body = _p.sent();
                    return [3 /*break*/, 16];
                case 15:
                    e_3 = _p.sent();
                    throw new Error("couldn't load the body texture located at ".concat(BODY_TEXTURE_PATH, ": ").concat(e_3.message));
                case 16:
                    // body scale
                    if (BODY_SCALE <= 0) {
                        throw new Error("invalid body scale ".concat(BODY_SCALE));
                    }
                    // mouth scale
                    if (MOUTH_SCALE <= 0) {
                        throw new Error("invalid mouth scale ".concat(MOUTH_SCALE));
                    }
                    _p.label = 17;
                case 17:
                    _p.trys.push([17, 24, , 25]);
                    parsed = parameters.static_assets ? parameters.static_assets : [];
                    static_assets = new Array(parsed.length);
                    i = 0;
                    _p.label = 18;
                case 18:
                    if (!(i < parsed.length)) return [3 /*break*/, 23];
                    _p.label = 19;
                case 19:
                    _p.trys.push([19, 21, , 22]);
                    parsed_asset = parsed[i];
                    _g = static_assets;
                    _h = i;
                    _o = {};
                    return [4 /*yield*/, (0, canvas_1.loadImage)(parsed_asset.texture)];
                case 20:
                    _g[_h] = (_o.texture = _p.sent(),
                        _o.x = parsed_asset.position_offset_from_center[0],
                        _o.y = parsed_asset.position_offset_from_center[1],
                        _o.scale = parsed_asset.scale,
                        _o);
                    return [3 /*break*/, 22];
                case 21:
                    e_4 = _p.sent();
                    throw new Error("error processing static asset #".concat(i, ": ").concat(e_4.message));
                case 22:
                    i += 1;
                    return [3 /*break*/, 18];
                case 23: return [3 /*break*/, 25];
                case 24:
                    e_5 = _p.sent();
                    throw new Error("error while parsing static assets: ".concat(e_5.message));
                case 25:
                    if (!DYNAMIC_EYES) return [3 /*break*/, 34];
                    // eyes on body position
                    if (EYES_ON_BODY_OFFSET.length != 2 || typeof EYES_ON_BODY_OFFSET[0] != "number") {
                        throw new Error("input_eyes_on_body_offset_from_center \"".concat(EYES_ON_BODY_OFFSET, "\" must be an array of numbers of length 2"));
                    }
                    _p.label = 26;
                case 26:
                    _p.trys.push([26, 32, , 33]);
                    eye_mapping = JSON.parse(fs_1.default.readFileSync(EYE_MAPPINGS_PATH).toString());
                    if (!(eye_mapping.left && eye_mapping.right)) {
                        throw new Error("".concat(EYE_MAPPINGS_PATH, " needs both a \"left\" and \"right\" item"));
                    }
                    //left_eye = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.left}`)
                    //right_eye = await loadImage(`${EYE_TEXTURES_PATH}/${eye_mapping.right}`)
                    if (eye_mapping.left.length != eye_mapping.right.length) {
                        throw new Error("left and right eye mapping lists must be the same in length");
                    }
                    length_1 = eye_mapping.left.length;
                    left_eye = new Array(length_1);
                    right_eye = new Array(length_1);
                    i = 0;
                    _p.label = 27;
                case 27:
                    if (!(i < length_1)) return [3 /*break*/, 31];
                    // potential for asnyc concurrency optimization here?
                    _j = left_eye;
                    _k = i;
                    return [4 /*yield*/, (0, canvas_1.loadImage)("".concat(EYE_TEXTURES_PATH, "/").concat(eye_mapping.left[i]))];
                case 28:
                    // potential for asnyc concurrency optimization here?
                    _j[_k] = _p.sent();
                    _l = right_eye;
                    _m = i;
                    return [4 /*yield*/, (0, canvas_1.loadImage)("".concat(EYE_TEXTURES_PATH, "/").concat(eye_mapping.right[i]))];
                case 29:
                    _l[_m] = _p.sent();
                    _p.label = 30;
                case 30:
                    i += 1;
                    return [3 /*break*/, 27];
                case 31: return [3 /*break*/, 33];
                case 32:
                    e_6 = _p.sent();
                    throw new Error("couldn't parse the mouth mappings located at ".concat(EYE_MAPPINGS_PATH, ": ").concat(e_6.message));
                case 33:
                    // blinking
                    try {
                        blink_occurrences = new Array(Math.ceil(num_frames)).fill(0);
                        step_size = FRAME_RATE * 1 / BLINK_INTERVAL;
                        // blink once every set period of time
                        for (i = 0; i < blink_occurrences.length; i += step_size) {
                            blink_occurrences[i] = 1;
                        }
                        filterLen = PHONEME_OCCURRENCE_CONVOLUTION.length;
                        blink_occurrences_copy = new Array(blink_occurrences.length);
                        for (i = 0; i < blink_occurrences.length; i += 1) {
                            localSum = 0;
                            for (j = -(filterLen - 1) / 2; j < filterLen / 2; j += 1) {
                                di = i + j;
                                localSum += di < 0 || di >= blink_occurrences.length ? 0 : PHONEME_OCCURRENCE_CONVOLUTION[j + Math.floor(filterLen / 2)] * blink_occurrences[di];
                            }
                            blink_occurrences_copy[i] = localSum;
                        }
                        blink_occurrences = blink_occurrences_copy;
                        // get the max blink amount
                        for (i = 0; i < blink_occurrences.length; i += 1) {
                            blink_max_amount = Math.max(blink_max_amount, blink_occurrences[i]);
                        }
                    }
                    catch (e) {
                        throw new Error("error creating blink timeline: ".concat(e.message));
                    }
                    _p.label = 34;
                case 34: return [3 /*break*/, 36];
                case 35:
                    e_7 = _p.sent();
                    console.error('error obtaining input parameters: ' + e_7.message);
                    (0, process_1.exit)();
                    return [3 /*break*/, 36];
                case 36:
                    canvas = (0, canvas_1.createCanvas)(WIDTH, HEIGHT);
                    ctx = canvas.getContext('2d');
                    // delete the old frames (if they exist) from the last run of this program
                    fs_1.default.readdirSync('out_frames/').forEach(function (f) { return fs_1.default.rmSync("out_frames/".concat(f)); }); //node version 14 and above required for this line
                    current_word_idx = 0;
                    current_phoneme_idx = 0;
                    current_phoneme_offset = 0;
                    num_words = transcript.words.length;
                    for (frame = 0; frame < num_frames; frame += 1) {
                        active_word = '';
                        active_phoneme = 'idle';
                        current_time = frame / FRAME_RATE;
                        if (current_word_idx < num_words && current_time > transcript.words[current_word_idx].end) {
                            current_word_idx += 1;
                            current_phoneme_idx = 0;
                            current_phoneme_offset = 0;
                        }
                        if (current_word_idx < num_words
                            && current_time >= transcript.words[current_word_idx].start
                            && current_time < transcript.words[current_word_idx].end) {
                            active_word = transcript.words[current_word_idx].word;
                            num_phonemes = transcript.words[current_word_idx].phones.length;
                            if (current_phoneme_idx < num_phonemes && current_time >= transcript.words[current_word_idx].phones[current_phoneme_idx].duration + current_phoneme_offset) {
                                current_phoneme_offset += transcript.words[current_word_idx].phones[current_phoneme_idx].duration;
                                current_phoneme_idx += 1;
                            }
                            if (current_phoneme_idx < num_phonemes) {
                                active_phoneme = transcript.words[current_word_idx].phones[current_phoneme_idx].phone;
                                // remove the unnecessary underscore and postfix at the end of the phoneme
                                active_phoneme = active_phoneme.split('_')[0];
                            }
                        }
                        (phoneme_occurrences.get(active_phoneme))[frame] = 1;
                    }
                    // perform a low-pass filter operation on each occurrence array to smooth it out
                    phoneme_occurrences.forEach(function (arr, phoneme, _) {
                        var filterLen = PHONEME_OCCURRENCE_CONVOLUTION.length;
                        var copyArr = new Array(arr.length);
                        for (var i = 0; i < arr.length; i += 1) {
                            var localSum = 0;
                            for (var j = -(filterLen - 1) / 2; j < filterLen / 2; j += 1) {
                                var di = i + j;
                                localSum += di < 0 || di >= arr.length ? 0 : PHONEME_OCCURRENCE_CONVOLUTION[j + Math.floor(filterLen / 2)] * arr[di];
                            }
                            copyArr[i] = localSum;
                        }
                        for (var i = 0; i < arr.length; i += 1) {
                            arr[i] = copyArr[i];
                        }
                    });
                    _loop_1 = function (frame) {
                        // get the current phoneme (the one with the maximum value in it's occurrence array at index frame)
                        var active_phoneme = '';
                        var globalMax = -1e10;
                        phoneme_occurrences.forEach(function (arr, phoneme, _) {
                            if (phoneme == 'idle') {
                                return;
                            }
                            if (arr[frame] > globalMax) {
                                active_phoneme = phoneme;
                                globalMax = arr[frame];
                            }
                        });
                        if (globalMax < 0.1) {
                            active_phoneme = 'idle';
                        }
                        // fill background
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, WIDTH, HEIGHT);
                        // ctx.font = '40px Arial'
                        // ctx.fillStyle = '#000000'
                        // ctx.fillText(active_word, 5, 30)
                        ctx.font = '30px Arial';
                        ctx.fillStyle = '#555555';
                        ctx.fillText(active_phoneme, 20, 40);
                        // display phoneme occurrence levels
                        var count = 0;
                        phoneme_occurrences.forEach(function (arr, phoneme) {
                            if (count > 30) {
                                return;
                            }
                            ctx.font = '12px Arial';
                            ctx.fillStyle = '#555555';
                            ctx.fillText(phoneme, 10, 90 + count * 13);
                            ctx.fillRect(40, 94 + (count - 1) * 13, arr[frame] * 30, 8);
                            count += 1;
                        });
                        ctx.font = '15px Arial';
                        ctx.fillStyle = '#555555';
                        ctx.fillText("frame ".concat(frame, "/").concat(num_frames, " @ ").concat(FRAME_RATE, "fps"), 5, HEIGHT - 15);
                        // if there's a phoneme, embed it into the image
                        var mouth = active_phoneme != '' ? mouths.get(active_phoneme) : mouths.get('idle');
                        var mouthOpenAmount = active_phoneme != '' ? phoneme_occurrences.get(active_phoneme)[frame] : 1;
                        // draw the body
                        /*
                            TODO: this drawImage call is incredibly unoptimized as the body image is always drawn at max
                            resolution no matter how shrunken the image is. I can fix this by bitmapping the body texture
                            later
                        */
                        ctx.drawImage(body, WIDTH / 2 - body.width * BODY_SCALE / 2, HEIGHT / 2 - body.height * BODY_SCALE / 2, body.width * BODY_SCALE, body.height * BODY_SCALE);
                        // draw the mouth
                        var lerp = function (x, y, a) { return x * (1 - a) + y * a; };
                        var stretchAmount = lerp(0.7, 1.2, mouthOpenAmount);
                        //ctx.drawImage(mouth, WIDTH/2 - body.width*BODY_SCALE/2 - mouth.width/2 + MOUTH_ON_BODY_POSITION[0]*BODY_SCALE, HEIGHT/2 - body.height*BODY_SCALE/2 - 0 + MOUTH_ON_BODY_POSITION[1]*BODY_SCALE, mouth.width*MOUTH_SCALE, mouth.height * lerp(0.5, 1, mouthOpenAmount) * MOUTH_SCALE)
                        ctx.drawImage(mouth, WIDTH / 2 - mouth.width * MOUTH_SCALE / 2 + MOUTH_ON_BODY_OFFSET[0] * BODY_SCALE, HEIGHT / 2 + MOUTH_ON_BODY_OFFSET[1] * BODY_SCALE, mouth.width * MOUTH_SCALE, mouth.height * lerp(0.5, 1, mouthOpenAmount) * MOUTH_SCALE);
                        // draw the eyes
                        if (DYNAMIC_EYES) {
                            // testing code 
                            var blink_phase = Math.round((left_eye.length - 1) * blink_occurrences[frame] / blink_max_amount);
                            var left = left_eye[blink_phase];
                            var right = right_eye[blink_phase];
                            ctx.drawImage(left, WIDTH / 2 - left.width * EYE_SCALE / 2 + EYES_ON_BODY_OFFSET[0] + EYES_SPACING, HEIGHT / 2 - left.height * EYE_SCALE / 2 + EYES_ON_BODY_OFFSET[1], left.width * EYE_SCALE, left.height * EYE_SCALE);
                            ctx.drawImage(right, WIDTH / 2 - right.width * EYE_SCALE / 2 + EYES_ON_BODY_OFFSET[0] - EYES_SPACING, HEIGHT / 2 - right.height * EYE_SCALE / 2 + EYES_ON_BODY_OFFSET[1], right.width * EYE_SCALE, right.height * EYE_SCALE);
                        }
                        // draw any static assets
                        static_assets.forEach(function (a) {
                            ctx.drawImage(a.texture, WIDTH / 2 - a.texture.width * a.scale / 2 + a.x, HEIGHT / 2 - a.texture.height * a.scale / 2 + a.y, a.texture.width * a.scale, a.texture.height * a.scale);
                        });
                        fs_1.default.writeFileSync("out_frames/frame_".concat(frame.toString().padStart(9, '0'), ".png"), canvas.toBuffer('image/png'));
                    };
                    // draw the frames
                    for (frame = 0; frame < num_frames; frame += 1) {
                        _loop_1(frame);
                    }
                    // generate the video
                    (0, fluent_ffmpeg_1.default)()
                        .input('./out_frames/frame_%9d.png')
                        .input(AUDIO_PATH)
                        .inputOptions([
                        // required to append audio to video
                        '-c copy',
                        '-map 0:v',
                        '-map 1:a',
                        // Set input frame rate
                        "-framerate ".concat(FRAME_RATE),
                    ])
                        .output('./out.mp4')
                        .run();
                    // append audio to the video
                    (0, child_process_1.execSync)("ffmpeg -i out.mp4 -i ".concat(AUDIO_PATH, " -c copy -map 0:v:0 -map 1:a:0 out_with_audio.mp4"));
                    return [2 /*return*/];
            }
        });
    });
}
main();
