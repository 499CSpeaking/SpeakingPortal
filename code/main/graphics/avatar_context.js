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
            this.eyePos = context_obj.eye_pos;
            this.eyeScale = context_obj.eye_scale;
            this.eyeDistanceBetween = context_obj.distance_between_eyes;
            this.body = context_obj.body;
            this.bodyPos = context_obj.body_pos;
            this.bodyScale = context_obj.body_scale;
            this.mouthPos = context_obj.mouth_pos;
            this.mouthScale = context_obj.mouth_scale;
            // load static assets
            this.staticAssets = new Array();
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
    // functions for accessing the data
    // returns [x,y] position and scale of mouth
    mouthData() {
        return [this.mouthPos, this.mouthScale];
    }
    // returns left + right texture name, position, distance between eyes, and scale
    // parameter "time" represents the current time of the video in seconds
    eyeData(time) {
        // a cyclic function to represent how "closed" the eyes are, or how far into a blink it is.
        // 0 = open eyes, 1 = closed eyes
        const blinkSpeed = this.config.blink_speed; // similar to "variance" in a gaussian distribution
        const blinkPeriod = this.config.blink_period; // take the inverse of this to get the blink frequency
        const x = time % blinkPeriod - blinkPeriod / 2;
        const eyeIdx = Math.round(Math.exp(-blinkSpeed * blinkSpeed * x * x) * (this.eyeLeft.length - 1));
        return [this.eyeLeft[eyeIdx], this.eyeRight[eyeIdx], this.eyePos, this.eyeDistanceBetween, this.eyeScale];
    }
    // returns texture, position and scale of body
    bodyData() {
        return [this.body, this.bodyPos, this.bodyScale];
    }
    getStaticAssets() {
        return this.staticAssets;
    }
}
exports.AvatarContext = AvatarContext;
