"use strict";
/*
    contains data about the avatar. Static assets, mouth + eye + body positions and scales, etc
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarContext = void 0;
const fs_1 = require("fs");
class AvatarContext {
    constructor(config) {
        this.config = config;
    }
    // load all the data from the avatar context file
    // call this immediately after initialization
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const context_path = this.config.avatar_context_path;
            // load parameters from the json file
            const context_obj = JSON.parse((0, fs_1.readFileSync)(context_path).toString());
            this.eyeLeft = context_obj.left_eye;
            this.eyeRight = context_obj.right_eye;
            this.body = context_obj.body;
            this.bodyPos = context_obj.body_pos;
            this.bodyScale = context_obj.body_scale;
            this.mouthPos = context_obj.mouth_pos;
            this.mouthScale = context_obj.mouth_scale;
            // load static assets
            context_obj.static_assets.forEach((item) => {
                var _a;
                const staticAsset = {
                    name: item.asset,
                    scale: item.scale,
                    pos: item.pos
                };
                (_a = this.staticAssets) === null || _a === void 0 ? void 0 : _a.push(staticAsset);
            });
            console.log(this);
        });
    }
}
exports.AvatarContext = AvatarContext;
