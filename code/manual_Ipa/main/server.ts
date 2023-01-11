const express = require("express");
const getPhoneme = require("./getPhoneme");
const getStamps = require("./getStamps");
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

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/", express.static("site"));

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

server.post("/api/time", upload.single("file"), (req, res) => {
  let audio_filename = req.file.filename;
  const start = performance.now();
  let output = getStamps("uploads/" + audio_filename);
  const end = performance.now();
  console.log("Execution Time: " + (end - start) + " ms");
  console.log("timestamps: ", output);
  res.json({ timestamps: output });
  console.log("success");
});

server.listen(4000, () => {
  console.log("server running...");
});
