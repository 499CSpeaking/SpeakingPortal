// library requirements
var express = require("express");
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
server.post("/api/", function (req, res) {
});
// post server start
server.listen(4000, function () {
    console.log("server running...");
});
