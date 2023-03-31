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
// max character limit checking
const char_lim = 300;
let button = document.getElementById("send");
// print messages to user on the web
function log_status(message) {
    document.getElementById("out").innerHTML += `${message}<br>`;
}
// clear the message board
function clear_output() {
    document.getElementById("out").innerHTML = "";
}
// main function to get final output to user
button.onclick = function getOut() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        clear_output();
        // input error checking
        let input = (_a = document.getElementById("userInput")) === null || _a === void 0 ? void 0 : _a.value;
        if (!input || input == "") {
            log_status("text input cannot be empty!");
            return;
        }
        if (input.length > char_lim) {
            log_status("text input exceeds the character limit!");
            return;
        }
        // get other input data
        let aligner = document.getElementById("aligner").value;
        let language = document.getElementById("language").value;
        let voiceKey = document.getElementById("voiceKey").value;
        let avatar = document.getElementById("avatar").value;
        let audioPath, transcriptPath, videoPath;
        // get audio from kukarella
        log_status("Getting Audio from Kukarella...");
        fetch("http://localhost:4000/kuk", {
            method: "POST",
            body: JSON.stringify({ inputString: input, voiceKey: voiceKey }),
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        })
            .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }))
            .then((data) => {
            audioPath = data.audioPath;
            log_status("Generated audio in server location: " + audioPath);
        })
            .then(() => {
            // get transcript from aligner
            log_status("Getting Transcript from " + aligner + "...");
            let payload = {
                aligner: aligner,
                inputString: input,
                audioPath: audioPath,
                language: language,
            };
            fetch("http://localhost:4000/align", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            })
                .then((res) => res.json())
                .then((data) => {
                transcriptPath = data.transcriptPath;
                log_status("Generated transcript in server location: " + transcriptPath);
            })
                .then(() => {
                log_status("Generating Animation...");
                fetch("http://localhost:4000/animate", {
                    method: "POST",
                    body: JSON.stringify({ avatar: avatar }),
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                })
                    .then((res) => res.json())
                    .then((data) => {
                    var _a, _b;
                    videoPath = data.videoPath;
                    log_status("Generated video in server location: " + videoPath);
                    const videoElement = document.createElement("video");
                    videoElement.src = "/video";
                    //videoElement.id = "video";
                    videoElement.controls = true;
                    videoElement.muted = false;
                    videoElement.autoplay = true;
                    videoElement.classList.add("embed-responsive-item");
                    if (document.getElementById("video") != null) {
                        (_a = document.getElementById("video")) === null || _a === void 0 ? void 0 : _a.remove();
                    }
                    (_b = document.getElementById("videoPlayer")) === null || _b === void 0 ? void 0 : _b.appendChild(videoElement);
                    log_status("The video should be viewable on the left. Enjoy!");
                });
            });
        });
    });
};
// check and display the number of characters the user has typed
document.getElementById("char_count").innerHTML = `0/${char_lim}`;
document.getElementById("userInput").addEventListener("input", () => {
    var _a;
    const char_count = (_a = document.getElementById("userInput")) === null || _a === void 0 ? void 0 : _a.value.length;
    document.getElementById("char_count").innerHTML =
        char_count <= char_lim
            ? `${char_count}/${char_lim}`
            : `<p style="color:red;"> ${char_count}/${char_lim} </p>`;
});
