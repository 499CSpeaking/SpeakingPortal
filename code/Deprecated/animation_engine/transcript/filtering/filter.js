"use strict";
/*
    base class for function-objects which take a two-value array and smooth it out such that it
    represents more natural lip movement
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayFilter = void 0;
class ArrayFilter {
    constructor(kernelSize) {
        if (kernelSize % 2 == 0) {
            // kernel must be of an odd size
            throw new Error(`kernel size should be odd, but ${kernelSize} is even`);
        }
        this.kernelSize = kernelSize;
    }
}
exports.ArrayFilter = ArrayFilter;
