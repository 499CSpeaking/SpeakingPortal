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
// library requirements
const express = require("express");
const server = express();
const body_parser = require("body-parser");
const https_1 = require("https");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const main_1 = require("./main");
server.use(body_parser.json());
server.use(body_parser.urlencoded({
    extended: true,
}));
// configure and start express
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// default site url
server.use("/", express.static("site"));
// get audio from kukarella
server.post("/kuk/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview";
    const payload = {
        text: req.body.inputString,
        voiceKey: req.body.voiceKey,
    };
    console.log("Payload Ready: ", payload);
    const api_respo = yield fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const audio_url = (yield api_respo.json()).data.url;
    (0, https_1.get)(audio_url, (res) => {
        const path = "demo_files/audio.wav";
        const writeStream = (0, fs_1.createWriteStream)(path);
        res.pipe(writeStream);
        writeStream.on("finish", () => {
            writeStream.close();
            console.log("Download Completed");
            setRes(path);
        });
    });
    function setRes(audioPath) {
        console.log("Audio Path: ", audioPath);
        res.json({ audioPath: audioPath });
    }
}));
// get transcript from aligner
server.post("/align/", (req, res) => {
    const transcriptPath = 'demo_files/transcript.json';
    const aligner = req.body.aligner;
    switch (aligner) {
        case 'gentle':
            console.log(`Using ${aligner} to Align`);
            const text = req.body.inputString;
            const audioPath = req.body.audioPath;
            const curlCommand = `curl -F "audio=@${audioPath}" -F "transcript=${text}" "http://localhost:32768/transcriptions?async=false"`;
            const output = (0, child_process_1.execSync)(curlCommand).toString();
            (0, fs_1.writeFileSync)(transcriptPath, output);
            console.log(`Transcript Location: ${transcriptPath}`);
            res.json({ transcriptPath: transcriptPath });
            break;
        case 'microsoft':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'google':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'amazon':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'ibm':
            console.log(`Using ${aligner} to Align`);
            break;
        default:
            console.log("Aligner error");
            break;
    }
});
// get transcript from aligner
server.post("/alignLT/", (req, res) => {
    const transcriptPath = 'demo_files/transcriptLT.json';
    const aligner = req.body.aligner;
    switch (aligner) {
        case 'gentle':
            console.log(`Using ${aligner} to Align`);
            const text = (0, fs_1.readFileSync)('demo_files/textLT.txt', { encoding: 'utf-8', flag: 'r' });
            ;
            const audioPath = 'demo_files/audioLT.wav';
            const curlCommand = `curl -F "audio=@${audioPath}" -F "transcript=${text}" "http://localhost:32768/transcriptions?async=false"`;
            const output = (0, child_process_1.execSync)(curlCommand).toString();
            (0, fs_1.writeFileSync)(transcriptPath, output);
            console.log(`Transcript Location: ${transcriptPath}`);
            res.json({ transcriptPath: transcriptPath });
            break;
        case 'microsoft':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'google':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'amazon':
            console.log(`Using ${aligner} to Align`);
            break;
        case 'ibm':
            console.log(`Using ${aligner} to Align`);
            break;
        default:
            console.log("Aligner error");
            break;
    }
});
// generate animation
server.post("/animate/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = new Object();
    const avatar = req.body.avatar;
    console.log(`Animating with avatar: ${avatar}`);
    yield (0, main_1.run)(`./demo_files/${avatar}`, config)
        .then((out) => {
        let videoPath = out;
        console.log(`Video stored in server location: ${videoPath}`);
        res.json({ videoPath: videoPath });
    });
}));
// stream video from server
server.get("/video/", (req, res) => {
    const range = req.headers.range;
    // get video info
    const videoPath = "./demo_files/tmp/video.mp4";
    const videoSize = (0, fs_1.statSync)(videoPath).size;
    // parse range in bytes
    const CHUNK_SZ = 1000; // 1KB chunk
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.max(start + CHUNK_SZ, videoSize - 1);
    // create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    // HTTP Status for partial content
    res.writeHead(206, headers);
    // create video readstream for chunk
    const videoStream = (0, fs_1.createReadStream)(videoPath, { start, end });
    // send stream chunk to client
    videoStream.pipe(res);
});
// post server start
server.listen(4000, () => {
    console.log("server running...");
});
