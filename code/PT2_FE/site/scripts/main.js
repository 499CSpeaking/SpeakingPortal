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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
        var input, aligner, voiceKey, avatar;
        var _this = this;
        return __generator(this, function (_b) {
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
            aligner = document.getElementById("aligner").value;
            voiceKey = document.getElementById("voiceKey").value;
            avatar = document.getElementById("avatar").value;
            // get audio from kukarella
            log_status("Getting Audio from Kukarella...");
            fetch("http://localhost:4000/kuk", {
                method: "POST",
                body: JSON.stringify({ inputString: input, voiceKey: voiceKey }),
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            })
                .then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); })
                .then(function (data) {
                var audioPath = data.audioPath;
                log_status("Generated audio in server location: " + audioPath);
            });
            // get transcript from aligner
            log_status("Getting Transcript from " + aligner);
            return [2 /*return*/];
        });
    });
};
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
