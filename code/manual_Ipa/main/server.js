// library requirements
var express = require("express");
var getPhoneme = require("./getPhoneme");
var getStamps = require("./getStamps");
var trimStamps = require("./trimStamps");
var server = express();
var body_parser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
server.use(body_parser.json());
server.use(body_parser.urlencoded({
    extended: true,
}));
// configure and start express
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// default site url
server.use("/", express.static("site"));
// main phoneme and audio file generation system
server.post("/api/", function (req, res) {
    var input = req.body.input;
    console.log("input: ", input);
    var start = performance.now();
    getPhoneme(input).then(function (output) {
        var end = performance.now();
        console.log("Execution Time: " + (end - start) + " ms");
        console.log("output: ", output);
        res.json({ output: output });
        console.log("success");
    });
});
// audio analysis system
server.post("/api/time", upload.single("file"), function (req, res) {
    // load testing filename - uncomment below
    // let audio_filename = "longobama.wav"
    var audio_filename = req.file.filename;
    var wordCount = req.body.wordCount;
    var start = performance.now();
    var output = getStamps("uploads/" + audio_filename);
    var end = performance.now();
    console.log("Execution Time: " + (end - start) + " ms");
    console.log("timestamps: ", output);
    if (output.size > wordCount) {
        console.log("Calling Trimmer, we have " + output.size + " stamps, and need " + wordCount);
        start = performance.now();
        // call works, not sure why typescript is throwing errors
        output = trimStamps(output, wordCount);
        end = performance.now();
        console.log("Extra Execution Time: " + (end - start) + " ms");
        console.log("Trimmed Size: ", output.size);
        console.log("Trimmed Stamps: ", output);
    }
    res.json({ timestamps: output });
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
server.listen(4000, function () {
    console.log("server running...");
});
