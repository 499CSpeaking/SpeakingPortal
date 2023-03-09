// library requirements
const express = require("express");
const server = express();
const body_parser = require("body-parser");
import { get } from "https";
import { argv, exit } from "process";
import { execSync } from "child_process";
import { createWriteStream, readFileSync, write, writeFileSync } from "fs";
import path = require("path");

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
server.post("/kuk/", async (req, res) => {
  const api_url: string = "https://api.kukarella.com/texttospeech/convertTTSPreview";

  const payload =  {
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
    res.json({audioPath: audioPath});
  }
});


// post server start
server.listen(4000, () => {
  console.log("server running...");
});
