// library requirements
const express = require("express");
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

server.post("/api/", (req, res) => {
  
});


// post server start
server.listen(4000, () => {
  console.log("server running...");
});
