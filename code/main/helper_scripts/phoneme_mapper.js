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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const graphics_pool_1 = require("../graphics/graphics_pool");
const parse_mappings_1 = require("../transcript/parse_mappings");
const prompt = require("prompt-sync")({ sigint: true });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        /*
        script to make mapping each phoneme to a mouth texture easier
    
        don't forget to fill out the inputs!
        note about paths: this program is run using npm run phoneme_mapper so all filepaths are relative
        to the base animation_engine directory
        */
        const transcriptPath = './testing/transcript.json';
        const graphicsPath = './testing/graphics';
        const config = new Object();
        config.transcript = (0, fs_1.readFileSync)(transcriptPath);
        const phonemeMapping = new parse_mappings_1.PhonemeMapping(config);
        const allPhonemes = phonemeMapping.presentPhonemes();
        const images = new graphics_pool_1.GraphicsPool(graphicsPath);
        yield images.init();
        const allNames = images.allNames();
        console.log(`all textures:`);
        console.log(Array.from(allNames));
        console.log(`for each phoneme, please enter the texture you wish to associate it with`);
        const out = new Object();
        for (let phoneme of allPhonemes) {
            while (true) {
                const input = prompt(`${phoneme.padEnd(5)}:`);
                if (!allNames.has(input)) {
                    console.log(`"${input}" is not a valid texture.`);
                    continue;
                }
                out[phoneme] = input;
                break;
            }
        }
        console.log("json output:");
        for (let key in out) {
            console.log(`"${key}": "${out[key]}",`);
        }
    });
}
main();
