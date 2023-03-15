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
exports.run = exports.params = void 0;
// Import the required AWS SDK clients and commands for Node.js
const client_transcribe_1 = require("@aws-sdk/client-transcribe");
const transcribeClient_js_1 = require("./libs/transcribeClient.js");
// Set the parameters
exports.params = {
    TranscriptionJobName: "cooltestjobdemoname1",
    LanguageCode: "en-US",
    MediaFormat: "mp3",
    Media: {
        MediaFileUri: "s3://audiobinkukarella/two.mp3",
        // For example, "https://transcribe-demo.s3-REGION.amazonaws.com/hello_world.wav"
    },
    OutputBucketName: "audiobinkukarella"
};
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield transcribeClient_js_1.transcribeClient.send(new client_transcribe_1.StartTranscriptionJobCommand(exports.params));
        console.log("Success - put", data);
        return data; // For unit tests.
    }
    catch (err) {
        console.log("Error", err);
    }
});
exports.run = run;
(0, exports.run)();
