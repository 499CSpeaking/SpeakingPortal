"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInputParser = void 0;
const abstract_input_1 = require("./abstract_input");
const fs_1 = __importDefault(require("fs"));
class FileInputParser extends abstract_input_1.InputParser {
    constructor(filePath) {
        super();
        this.filePath = filePath;
        this.parameterValues = JSON.parse(fs_1.default.readFileSync(this.filePath).toString());
    }
    getParameter(key) {
        let value = this.parameterValues[key];
        if (value) {
            return value;
        }
        throw new Error(`there is no parameter associated with key "${key}"`);
    }
    getParameterOptional(key) {
        return this.parameterValues[key];
    }
    getImage(path) {
        throw new Error('Method not implemented.');
    }
    getFile(path) {
        return fs_1.default.readFileSync(path);
    }
}
exports.FileInputParser = FileInputParser;
