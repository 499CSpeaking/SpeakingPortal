"use strict";
/*
    given a phoneme, we need to get the mouth (image) it emulates
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonemeImageconverter = void 0;
const fs_1 = require("fs");
class PhonemeImageconverter {
    constructor(config) {
        this.mapping = this.createMappings(config);
    }
    createMappings(config) {
        // get the file contents that specify the mapping
        const graphicsConfigFile = JSON.parse((0, fs_1.readFileSync)(config.graphics_config_path).toString());
        const mouths = graphicsConfigFile.mouths;
        const map = new Map();
        for (let phoneme in mouths) {
            map.set(phoneme, mouths[phoneme]);
        }
        return map;
    }
    /*
        this class doesn't return the image, just the name of the image such that a GraphicsPool
        object can fetch the image
    */
    getImageName(phoneme) {
        return this.mapping.get(phoneme);
    }
}
exports.PhonemeImageconverter = PhonemeImageconverter;
