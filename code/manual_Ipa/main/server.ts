// library requirements
const express = require("express");
const getPhoneme = require("./getPhoneme");
const getStamps = require("./getStamps");
const trimStamps = require("./trimStamps");
const server = express();
const body_parser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

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

// main phoneme and audio file generation system
server.post("/api/", (req, res) => {
  const input = req.body.input;
  console.log("input: ", input);
  const start = performance.now();
  getPhoneme(input).then((output) => {
    const end = performance.now();
    console.log("Execution Time: " + (end - start) + " ms");
    console.log("output: ", output);
    res.json({ output: output });
    console.log("success");
  });
});

// audio analysis system
server.post("/api/time", upload.single("file"), (req, res) => {
  // load testing filename - uncomment below
  // let audio_filename = "longobama.wav"
  let audio_filename = req.file.filename;
  let wordCount = req.body.wordCount;
  let start = performance.now();
  let output = getStamps("uploads/" + audio_filename);
  let end = performance.now();
  console.log("Execution Time: " + (end - start) + " ms");
  console.log("timestamps: ", output);
  if (output.size > wordCount) {
    console.log("Calling Trimmer, we have "+output.size+" stamps, and need "+wordCount);
    start = performance.now();
    // call works, not sure why typescript is throwing errors
    output = trimStamps(output, wordCount);
    end = performance.now();
    console.log("Extra Execution Time: " + (end - start) + " ms");
    console.log("Trimmed Size: ", output.size);
    console.log("Trimmed Stamps: ", output);
  }
  res.json({timestamps: output});
  console.log("success");
});

// timestamp crunching system
// server.post("/api/timeCrunch", (req, res) => {
//   const wordCount = req.body.wordCount;
//   console.log("Word Count: "+wordCount);
//   let stamps = req.body.stamps;
//   const start = performance.now();
//   let trimmedStamps = trimStamps(stamps, wordCount);
//   const end = performance.now();
//   console.log("Execution Time: " + (end - start) + " ms");
//   console.log("Trimmed Timestamps: ", trimmedStamps);
//   res.json({ timestamps: trimmedStamps });
//   console.log("success");
// });

// post server start
server.listen(4000, () => {
  console.log("server running...");
});
