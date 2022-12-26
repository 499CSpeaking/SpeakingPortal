var express = require("express");
var getPhoneme = require("./getPhoneme");
var getStamps = require("./getStamps");
var server = express();
var body_parser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
server.use(body_parser.json());
server.use(body_parser.urlencoded({
    extended: true,
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/", express.static("site"));
server.post("/api/", function (req, res) {
    var input = req.body.input;
    console.log("input: ", input);
    getPhoneme(input).then(function (output) {
        console.log("output: ", output);
        res.json({ output: output });
        console.log("success");
    });
});
server.post("/api/time", upload.single("file"), function (req, res) {
    var audio_filename = req.file.filename;
    var output = getStamps("uploads/" + audio_filename);
    console.log("timestamps: ", output);
    res.json({ timestamps: output });
    console.log("success");
});
server.listen(4000, function () {
    console.log("server running...");
});
