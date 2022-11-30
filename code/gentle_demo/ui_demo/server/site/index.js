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
function display_err(error) {
    document.getElementById("output").innerHTML = "<i>error: " + error + "</i>";
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
                    return [4 /*yield*/, api_response.json()];
                case 2:
                    audio_url = (_a.sent()).data.url;
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
        var text, file, form_data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    text = (_a = document.getElementById("text_input")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!text || text == "") {
                        display_err("invalid input");
                        return [2 /*return*/];
                    }
                    document.getElementById("output").innerHTML = "<i>processing...</i>";
                    return [4 /*yield*/, get_audio_from_kukarella(text)];
                case 1:
                    file = _b.sent();
                    form_data = new FormData();
                    form_data.append("audio", file);
                    form_data.append("text", text);
                    document.getElementById("output").innerHTML = "<i>processing...</i>";
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
                            document.getElementById("output").innerHTML = response;
                        }
                        else {
                            throw new Error(response);
                        }
                    })
                        .catch(function (err) {
                        display_err("server error: " + err.message);
                    });
                    return [2 /*return*/];
            }
        });
    });
};
