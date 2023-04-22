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
var char_limit = 200;
function log_output(message, error) {
    if (error === void 0) { error = false; }
    document.getElementById("output").innerHTML += !error ? message + "<br>" : "<p style=\"color:red;\"> " + message + "<br></p>";
}
function clear_output() {
    document.getElementById("output").innerHTML = '';
}
function get_audio_from_kukarella(text) {
    return __awaiter(this, void 0, void 0, function () {
        var kukarella_api_url, payload, api_response, audio_url, audio_response, audio_response_blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kukarella_api_url = "https://api.kukarella.com/texttospeech/convertTTSPreview";
                    payload = {
                        text: text,
                        voiceKey: 'en-US_AllisonV3Voice',
                    };
                    return [4 /*yield*/, fetch(kukarella_api_url, {
                            method: 'POST',
                            body: JSON.stringify(payload),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                case 1:
                    api_response = _a.sent();
                    log_output("requesting text-to-speech transcription of the text from Kukarella...");
                    return [4 /*yield*/, api_response.json()];
                case 2:
                    audio_url = (_a.sent()).data.url;
                    log_output("The audio from Kukarella has been processed, you can download it <a href=" + audio_url + ">HERE</a>");
                    return [4 /*yield*/, fetch(audio_url)];
                case 3:
                    audio_response = _a.sent();
                    return [4 /*yield*/, audio_response.blob()];
                case 4:
                    audio_response_blob = _a.sent();
                    return [2 /*return*/, new File([audio_response_blob], "arbitrary_filename")];
            }
        });
    });
}
document.getElementById("button").onclick = function buttonClick() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var text, file, e_1, form_data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clear_output();
                    text = (_a = document.getElementById("text_input")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!text || text == "") {
                        log_output("text input must be filled", true);
                        return [2 /*return*/];
                    }
                    if (text.length > char_limit) {
                        log_output("text input exceeds the character limit", true);
                        return [2 /*return*/];
                    }
                    log_output("starting");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, get_audio_from_kukarella(text)];
                case 2:
                    file = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    log_output("an error occurred while requesting the text-to-speech transcription from Kukarella: " + e_1.message, true);
                    return [2 /*return*/];
                case 4:
                    form_data = new FormData();
                    form_data.append("audio", file);
                    form_data.append("text", text);
                    log_output("sending both the text and audio to the server for alignment...");
                    error = false;
                    fetch("http://localhost:1234", { method: "POST", body: form_data })
                        .then(function (response) {
                        if (response.status != 200) {
                            error = true;
                        }
                        return response.text();
                    })
                        .then(function (response) {
                        if (!error) {
                            log_output("process completed<br>");
                            log_output(response);
                        }
                        else {
                            throw new Error(response);
                        }
                    })
                        .catch(function (err) {
                        log_output("an error occured while requesting the text alignment from the server: " + err.message, true);
                    });
                    return [2 /*return*/];
            }
        });
    });
};
document.getElementById("char_count").innerHTML = "0/" + char_limit;
document.getElementById("text_input").addEventListener("input", function () {
    var _a;
    var char_count = (_a = document.getElementById("text_input")) === null || _a === void 0 ? void 0 : _a.value.length;
    document.getElementById("char_count").innerHTML = (char_count <= char_limit ? char_count + "/" + char_limit : "<p style=\"color:red;\"> " + char_count + "/" + char_limit + " </p>");
});
