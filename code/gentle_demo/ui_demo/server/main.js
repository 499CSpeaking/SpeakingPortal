var express = require("express");
var body_parser = require("body-parser");
var multer = require("multer");
var gentle = require("../../demo");
var fs = require("fs");
var app = express();
var upload = multer({ dest: "uploads/" });
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(express.static("site"));
app.post("/", upload.single("audio"), function (req, res) {
    var audio_filename = req.file.filename;
    var text = req.body.text;
    var text_filename = audio_filename + "_text";
    try {
        fs.writeFileSync("uploads/" + text_filename, text);
        var output = gentle("uploads/" + audio_filename, "uploads/" + text_filename);
        res.send(output);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        fs.unlinkSync("uploads/" + audio_filename);
        fs.unlinkSync("uploads/" + text_filename);
    }
});
app.post("/testing", upload.none(), function (req, res) {
    res.send(req.body.text);
});
var port = 1234;
app.listen(port, function () {
    console.log("started server on " + port);
});
