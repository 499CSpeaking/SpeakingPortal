var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// max character limit checking
var char_lim = 300;
var button = document.getElementById("send");
// print messages to user on the web
function log_status(message) {
    document.getElementById("out").innerHTML += "".concat(message, "<br>");
}
// clear the message board
function clear_output() {
    document.getElementById("out").innerHTML = "";
}
// main function to get final output to user
button.onclick = function getOut() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var input, phonemes, file, e_1, stamps;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clear_output();
                    input = (_a = document.getElementById("userInput")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!input || input == "") {
                        log_status("text input cannot be empty!");
                        return [2 /*return*/];
                    }
                    if (input.length > char_lim) {
                        log_status("text input exceeds the character limit!");
                        return [2 /*return*/];
                    }
                    // generate phonemes
                    log_status("Starting...");
                    log_status("Getting Phonemes...");
                    phonemes = new Map();
                    phonemes = getPhones(input);
                    log_status("Phoneme Detection Complete!");
                    // get audio from kukarella
                    log_status("Getting Audio from Kukarella...");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, get_kuk_aud(input)];
                case 2:
                    file = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    log_status("An error occurred while getting the audio from Kukarella! Error Message: ".concat(e_1.message));
                    return [2 /*return*/];
                case 4:
                    // send audio to server for processing
                    log_status("Sending audio to the server for further processing...");
                    stamps = new Map();
                    try {
                        // send audio file to server and get result of timestamps
                        getTime(file);
                    }
                    catch (e) {
                        log_status("An error occurred while sending the audio to server or while processing! Error Message: ".concat(e.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
// function to send user input to the server for phoneme generation, and to retrieve the phoneme data
function getPhones(input) {
    var userInput = input.toLowerCase();
    // send input to server and get response
    fetch("http://localhost:4000/api", {
        method: "POST",
        body: JSON.stringify({ input: userInput }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var respo = data.output;
        var html$ = "";
        for (var key in respo) {
            html$ += "<p>" + key + ", " + respo.get(key) + "</p>";
        }
        log_status(html$);
        return respo;
    });
}
// function to retrieve audio from kukarella's api based on user inputted text
function get_kuk_aud(text) {
    return __awaiter(this, void 0, void 0, function () {
        var api_url, payload, api_respo, audio_url, url_message, audio_resp, audio_resp_blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview";
                    payload = {
                        text: text,
                        voiceKey: "en-US_AllisonV3Voice",
                    };
                    return [4 /*yield*/, fetch(api_url, {
                            method: "POST",
                            body: JSON.stringify(payload),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })];
                case 1:
                    api_respo = _a.sent();
                    return [4 /*yield*/, api_respo.json()];
                case 2:
                    audio_url = (_a.sent()).data.url;
                    url_message = "Audio has been retrieved. You can download it <a href=" +
                        audio_url +
                        ">HERE</a>";
                    log_status(url_message);
                    return [4 /*yield*/, fetch(audio_url)];
                case 3:
                    audio_resp = _a.sent();
                    return [4 /*yield*/, audio_resp.blob()];
                case 4:
                    audio_resp_blob = _a.sent();
                    return [2 /*return*/, new File([audio_resp_blob], "arbitrary_filename")];
            }
        });
    });
}
// function to send audio to server and get timestamps for each word
function getTime(audio) {
    var form_data = new FormData();
    form_data.append("file", audio);
    var err = false;
    fetch("http://localhost:4000/api/time", {
        method: "POST",
        body: form_data,
        headers: { enctype: "multipart/form-data" },
    })
        .then(function (res) {
        if (res.status != 200) {
            err = true;
        }
        return res.text();
    })
        .then(function (res) {
        if (!err) {
            log_status("Processing Complete!<br>");
        }
        else {
            throw new Error(res);
        }
    })
        .catch(function (err) {
        log_status("An error occurred while processing! Error Message: ".concat(err.message));
    });
}
// check and display the number of characters the user has typed
document.getElementById("char_count").innerHTML = "0/".concat(char_lim);
document.getElementById("userInput").addEventListener("input", function () {
    var _a;
    var char_count = (_a = document.getElementById("userInput")) === null || _a === void 0 ? void 0 : _a.value.length;
    document.getElementById("char_count").innerHTML =
        char_count <= char_lim
            ? "".concat(char_count, "/").concat(char_lim)
            : "<p style=\"color:red;\"> ".concat(char_count, "/").concat(char_lim, " </p>");
});
