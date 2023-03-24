"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const process_1 = require("process");
const file_input_1 = require("./input/file_input");
const renderer_1 = require("./rendering/renderer");
const parse_mappings_1 = require("./transcript/parse_mappings");
const phoneme_occurrences_1 = require("./transcript/phoneme_occurrences");
const get_video_duration_1 = __importDefault(require("get-video-duration"));
const graphics_pool_1 = require("./graphics/graphics_pool");
const phoneme_to_image_1 = require("./graphics/phoneme_to_image");
function run(inputFilePath, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // parse all the inputs
        const inputParser = new file_input_1.FileInputParser(inputFilePath);
        config.loadParameter = (parameter) => {
            if (!config[parameter]) {
                config[parameter] = inputParser.getParameter(parameter);
            }
        };
        config.loadOptionalParameter = (parameter, def) => {
            const value = inputParser.getParameterOptional(parameter);
            if (!config[parameter]) {
                config[parameter] = value !== null && value !== void 0 ? value : def;
            }
        };
        config.loadFile = (name, pathLocation) => {
            if (!config[name]) {
                config[name] = inputParser.getFile(inputParser.getParameter(pathLocation));
            }
        };
        try {
            config.loadParameter("height");
            config.loadParameter("width");
            config.loadFile("transcript", "transcript_path");
            config.loadFile("audio", "audio_path");
            config.loadOptionalParameter("frames_path", './tmp');
            config.loadOptionalParameter("video_path", './tmp');
            config.loadOptionalParameter("filter_kernel_size", 7);
            config.loadOptionalParameter("filter_kernel_variance", 2);
            config.loadOptionalParameter("phoneme_idle_threshold", 0.1);
            config.loadOptionalParameter("phoneme_samples_per_second", 10);
            config.loadOptionalParameter("frames_per_second", 27);
            config.loadParameter("graphics_path");
            config.loadParameter("graphics_config_path");
            config.loadParameter("audio_path");
            config.video_length = yield (0, get_video_duration_1.default)(config.audio_path);
            console.log(config);
        }
        catch (e) {
            console.log(e.toString());
            (0, process_1.exit)();
        }
        // this is the phoneme mapping, it maps phonemes
        const mapping = new parse_mappings_1.PhonemeMapping(config);
        const phonemeOccurrences = new phoneme_occurrences_1.PhonemeOccurrences(config, mapping);
        // graphics pool, which pools graphics
        const graphics = new graphics_pool_1.GraphicsPool(config.graphics_path);
        yield graphics.init();
        // this object converts phonemes to images (not directly though)
        const phonemeImageconverter = new phoneme_to_image_1.PhonemeImageconverter(config);
        // this object renders
        const renderer = new renderer_1.Renderer(config, graphics, phonemeOccurrences, phonemeImageconverter);
        renderer.setup();
        for (let i = 1; i <= config.video_length * config.frames_per_second; i += 1) {
            const text = `${(_a = phonemeOccurrences.getDominantPhonemeAt(i / config.frames_per_second)) !== null && _a !== void 0 ? _a : 'idle'}`;
            renderer.drawFrame(i, i / config.frames_per_second);
        }
        const video = renderer.generateVideo();
        return video;
    });
}
exports.run = run;
if (require.main == module) {
    run('./testing/inputs.json', new Object());
}
