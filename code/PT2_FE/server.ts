// library requirements
const express = require("express");
const server = express();
const body_parser = require("body-parser");
import { get } from "https";
import { execSync } from "child_process";
import { createWriteStream, readFileSync, write, writeFileSync, statSync, createReadStream } from "fs";
import { run } from "./main";
import { uploadFile } from "./api";

server.use(body_parser.json());
server.use(
  body_parser.urlencoded({
    extended: true,
  })
);

// configure and start express
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// default site url
server.use("/", express.static("site"));

// get audio from kukarella
server.post("/kuk/", async (req: { body: { inputString: any; voiceKey: any; }; }, res: { json: (arg0: { audioPath: string; }) => void; }) => {
  const api_url: string = "https://api.kukarella.com/texttospeech/convertTTSPreview";

  const payload = {
    text: req.body.inputString,
    voiceKey: req.body.voiceKey,
  }
  console.log("Payload Ready: ", payload);

  const api_respo: any = await fetch(api_url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const audio_url: string = (await api_respo.json()).data.url;

  get(audio_url, (res) => {
    const path = "demo_files/audio.wav";
    const writeStream = createWriteStream(path);

    res.pipe(writeStream);

    writeStream.on("finish", () => {
      writeStream.close();
      console.log("Download Completed");
      setRes(path);
    })
  })

  function setRes(audioPath: string) {
    console.log("Audio Path: ", audioPath);
    res.json({ audioPath: audioPath });
  }
});

// get transcript from aligner
server.post("/align/", async (req: { body: { aligner: string; inputString: string; audioPath: string; language: string; }; }, res: { json: (arg0: { transcriptPath: string; }) => void; }) => {
  const transcriptPath = 'demo_files/transcript.json';
  const aligner: string = req.body.aligner;
  var language: string = req.body.language;
  switch (aligner) {
    case 'gentle':
      console.log(`Using ${aligner} to Align`);
      var text: string = req.body.inputString;
      var audioPath: string = req.body.audioPath;

      var curlCommand: string = `curl -F "audio=@${audioPath}" -F "transcript=${text}" "http://localhost:32768/transcriptions?async=false"`;
      var output: string = execSync(curlCommand).toString();
      writeFileSync(transcriptPath, output);
      console.log(`Transcript Location: ${transcriptPath}`);
      res.json({ transcriptPath: transcriptPath });
      break;

    case 'microsoft':
      console.log(`Using ${aligner} to Align`);
      break;

    case 'google':
      console.log(`Using ${aligner} to Align`);
      var audioPath: string = req.body.audioPath;

      console.log(`Language: ${language}`);
      switch (language) {
        case 'English':
          language = 'en-US';
          break;
        case 'Spanish':
          language = 'es-ES';
          break;
        case 'French':
          language = 'fr-FR';
          break;
      }
      console.log(`Language: ${language}`);
  
      await uploadFile(audioPath, language);
      var gpath = "demo_files/transcript.json";
      // wait 2 seconds for google to process
      res.json({ transcriptPath: gpath });
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
server.post("/animate/", async (req: { body: { avatar: string; }; }, res: { json: (arg0: { videoPath: string; }) => void; }) => {
  const config: any = new Object();
  const avatar: string = req.body.avatar;
  console.log(`Animating with avatar: ${avatar}`);
  await run(`./testing/${avatar}`, config)
    .then((out) => {
      let videoPath = out;
      console.log(`Video stored in server location: ${videoPath}`);
      res.json({ videoPath: videoPath });
    })
});

// stream video from server
server.get("/video/", (req: { headers: { range: string; }; }, res: { writeHead: (arg0: number, arg1: { "Content-Range": string; "Accept-Ranges": string; "Content-Length": number; "Content-Type": string; }) => void; }) => {
  const range: string = req.headers.range;

  // get video info
  const videoPath = "./demo_files/tmp/video.mp4";
  const videoSize = statSync(videoPath).size;

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
  const videoStream = createReadStream(videoPath, { start, end });

  // send stream chunk to client
  videoStream.pipe(res);
});

// post server start
server.listen(4000, () => {
  console.log("server running...");
});
