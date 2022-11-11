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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var workingDict = new Map();
// reads files line by line and returns an array of lines
function readByLine(path) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var out, i, fin, fin_1, fin_1_1, line, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    out = ['empty'];
                    i = 0;
                    fin = readline.createInterface({
                        input: fs.createReadStream(path),
                        crlfDelay: Infinity
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    fin_1 = __asyncValues(fin);
                    _b.label = 2;
                case 2: return [4 /*yield*/, fin_1.next()];
                case 3:
                    if (!(fin_1_1 = _b.sent(), !fin_1_1.done)) return [3 /*break*/, 5];
                    line = fin_1_1.value;
                    out[i] = line;
                    i++;
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(fin_1_1 && !fin_1_1.done && (_a = fin_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(fin_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    console.log('success');
                    return [2 /*return*/, out];
            }
        });
    });
}
// formats dictionary into key value pairs of words to phonemes. Phonetic characters are sent as an array of strings for each phoneme
// data structure example: {'ABBEY', ['AE', 'B', 'IY']}
// rationale: having an array of strings for phonemes may make it easier to assign art assets during video generation
function getDict() {
    return __awaiter(this, void 0, void 0, function () {
        var dict, dictF, i, line, key, values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readByLine('./dict2.txt')];
                case 1:
                    dict = _a.sent();
                    dictF = new Map();
                    for (i = 0; i < dict.length; i++) {
                        line = dict[i].split("\t");
                        key = line[0].toLowerCase();
                        values = line[1].split(" ");
                        dictF.set(key, values);
                    }
                    console.log('success');
                    return [2 /*return*/, dictF];
            }
        });
    });
}
// return ipa associated with word
function getIpa(word) {
    return workingDict.get(word);
}
function getPhoneme(input) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var script, phoScript, script_1, script_1_1, word, e_2_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(" ");
                    return [4 /*yield*/, getDict()];
                case 1:
                    workingDict = _b.sent();
                    phoScript = new Map();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 13]);
                    script_1 = __asyncValues(script);
                    _b.label = 3;
                case 3: return [4 /*yield*/, script_1.next()];
                case 4:
                    if (!(script_1_1 = _b.sent(), !script_1_1.done)) return [3 /*break*/, 6];
                    word = script_1_1.value;
                    if (workingDict.has(word) && !(phoScript.has(word))) {
                        phoScript.set(word, getIpa(word));
                    }
                    console.log(word);
                    console.log(getIpa(word));
                    _b.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(script_1_1 && !script_1_1.done && (_a = script_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(script_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/, phoScript];
            }
        });
    });
}
module.exports = getPhoneme;
