"use strict";
/*
    this class holds all images loaded by the program
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicsPool = void 0;
const canvas_1 = require("canvas");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class GraphicsPool {
    constructor(directoryPath) {
        this.directoryPath = directoryPath;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.images = yield this.loadImages(this.directoryPath);
        });
    }
    loadImages(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = new Map();
            // load each image into the hashmap
            const fileNames = yield fs_1.promises.readdir(directoryPath);
            for (const fileName of fileNames) {
                map.set(fileName, yield (0, canvas_1.loadImage)(path_1.default.join(directoryPath, fileName)));
            }
            return map;
        });
    }
    get(imageName) {
        var _a;
        const image = (_a = this.images) === null || _a === void 0 ? void 0 : _a.get(imageName);
        if (image) {
            return image;
        }
        throw new Error(`image "${imageName}" not found. Perhaps it wasn't loaded in "${this.directoryPath}"?`);
    }
    allNames() {
        let set = new Set();
        for (const name of this.images) {
            set.add(name[0]);
        }
        return set;
    }
}
exports.GraphicsPool = GraphicsPool;
