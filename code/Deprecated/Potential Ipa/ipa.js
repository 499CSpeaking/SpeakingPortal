function Sentence(a, c) {
  this.text = a;
  this.syllables = [];
  this.letters = [];
  this.words = [];
  this.separator = c;
  var d = a.match(/[a-zA-Z\u00e0\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00f3\u00f4\u00f5\u00fa\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00d3\u00d4\u00d5\u00da\u00c7]+[-\s\n]*/g);
  if (d) for (var b = 0; b < d.length; b++) {
    var e = d[b].match(/([a-zA-Z\u00e0\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00f3\u00f4\u00f5\u00fa\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00d3\u00d4\u00d5\u00da\u00c7]+)([^]*)/);
    this.addWord(new Word(this, e[1], document.getElementById("showPunctuation").checked ? e[2] : e[2].replace(/[^\n]/, "") || " "));
  }
  for (b = 0; b < this.words.length; b++) {
    e = this.words[b];
    for (d = 0; d < e.syllables.length; d++) {
      var f = e.syllables[d];
      a = f.text;
      if (/[\u00e1\u00e2\u00e9\u00ea\u00ed\u00f3\u00f4\u00fa]/.test(a) || d == e.syllables.length - 1 && /[\u00e3\u00f5]/.test(a)) {
        f.stressed = true;
        e.stressedSyllable = f;
        break;
      }
    }
    e.stressedSyllable || (/[iu](s|m|ns)?$/.test(e.text) || !/[aeo](s|m|ns)?$/.test(e.text) ? "por" != e.text && (e.stressedSyllable = e.getLastSyllable(), e.stressedSyllable && (e.stressedSyllable.stressed = true)) : 1 < e.syllables.length && !/para|porque/.test(e.text) && (e.stressedSyllable = e.getLastSyllable(1), e.stressedSyllable && (e.stressedSyllable.stressed = true)));
  }
  for (b = 0; b < this.letters.length; b++) this.letters[b].IPA = this.letters[b].computeIPA();
  if (document.getElementById("iDissimilation").checked) for (b = 0; b < this.letters.length; b++) this.letters[b].IPA = this.letters[b].processDissimilationI();
  if (document.getElementById("eDissimilation").checked) for (b = 0; b < this.letters.length; b++) this.letters[b].IPA = this.letters[b].processDissimilationE();
  if (!document.getElementById("showMuteE").checked) for (b = 0; b < this.letters.length; b++) this.letters[b].IPA = this.letters[b].IPA.replace("ɨ", "");
}
Sentence.prototype.addWord = function (a) {
  a.sentenceIndex = this.words.length;
  this.words.push(a);
};
Sentence.prototype.addSyllable = function (a) {
  a.sentenceIndex = this.syllables.length;
  this.syllables.push(a);
};
Sentence.prototype.addLetter = function (a) {
  a.sentenceIndex = this.letters.length;
  this.letters.push(a);
};
Sentence.prototype.printStressedSyllables = function () {
  for (var a = "", c = 0; c < this.words.length; c++) {
    for (var d = this.words[c], b = [], e = 0; e < d.syllables.length; e++) {
      var f = d.syllables[e];
      b.push(f.stressed ? "<b>" + f.text + "</b>" : f.text);
    }
    a += b.join(document.getElementById("showSyllableSeparator").checked ? document.getElementById("syllableSeparator").value : "") + d.separator;
  }
  return a;
};
Sentence.prototype.printIPA = function () {
  for (var a = "", c = 0; c < this.words.length; c++) {
    for (var d = this.words[c], b = [], e = 0; e < d.syllables.length; e++) {
      for (var f = d.syllables[e], h = [], g = 0; g < f.letters.length; g++) h.push(f.letters[g].IPA);
      b.push((f.stressed && document.getElementById("showStressMarker").checked ? document.getElementById("stressMarker").value : "") + h.join(""));
    }
    a += b.join(document.getElementById("showSyllableSeparator").checked ? document.getElementById("syllableSeparator").value : "") + d.separator;
  }
  return a;
};
function Word(a, c, d) {
  this.text = c;
  this.sentence = a;
  this.sentenceIndex = 0;
  this.stressedSyllable = null;
  this.letters = [];
  this.syllables = [];
  this.separator = d;
  if (a = c.match(/^re(?=u)|^(pr|c)o(?=ib)|(([bc\u00e7dfghjklmnpqrstvxz]*[gq]u)?|[bc\u00e7dfghjklmnpqrstvxz]*)(([a\u00e1\u00e2\u00e0e\u00e9\u00eao\u00f3\u00f4y]u|iu$|[a\u00e1\u00e2\u00e0e\u00e9\u00eao\u00f3\u00f4u\u00fa\u00fbw]i(?!u$))(?!([mrz]|nh?)(?![a\u00e1\u00e2\u00e0\u00e3e\u00e9\u00eai\u00ed\u00eeo\u00f3\u00f4\u00f5u\u00fa\u00fbwy]))|\u00e3[eiouwy]|\u00f5[eiuwy]|[a\u00e1\u00e2\u00e0\u00e3e\u00e9\u00eai\u00ed\u00eeo\u00f3\u00f4\u00f5u\u00fa\u00fbwy])([bc\u00e7dfghjklpqstvxz](?![rlh]?[a\u00e1\u00e2\u00e0\u00e3e\u00e9\u00eai\u00ed\u00eeo\u00f3\u00f4\u00f5u\u00fa\u00fbwy])|[mnr](?![a\u00e1\u00e2\u00e0\u00e3e\u00e9\u00eai\u00ed\u00eeo\u00f3\u00f4\u00f5u\u00fa\u00fbwyh]))*/gi)) for (c = 0; c < a.length; c++) this.addSyllable(new Syllable(this, a[c]));
}
Word.prototype.addSyllable = function (a) {
  this.sentence.addSyllable(a);
  a.wordIndex = this.syllables.length;
  this.syllables.push(a);
};
Word.prototype.addLetter = function (a) {
  this.sentence.addLetter(a);
  a.wordIndex = this.letters.length;
  this.letters.push(a);
};
Word.prototype.getLastSyllable = function (a) {
  a || (a = 0);
  return this.syllables[this.syllables.length - (1 + a)];
};
function Syllable(a, c) {
  this.text = c;
  this.word = a;
  this.sentence = a.sentence;
  this.letters = [];
  this.wordIndex = this.sentenceIndex = 0;
  this.stressed = false;
  for (var d = 0; d < c.length; d++) this.addLetter(new Letter(this, c[d]));
}
Syllable.prototype.addLetter = function (a) {
  this.word.addLetter(a);
  a.syllableIndex = this.letters.length;
  this.letters.push(a);
};
function Letter(a, c) {
  this.text = c;
  this.syllable = a;
  this.word = a.word;
  this.sentence = a.sentence;
  this.sentenceIndex = 0;
  this.IPA = "";
}
Letter.prototype.isVowel = function () {
  return /[a\u00e1\u00e2\u00e0\u00e3e\u00e9\u00eai\u00ed\u00eeo\u00f3\u00f4\u00f5u\u00fa\u00fb]/.test(this.text);
};
Letter.prototype.isNasal = function () {
  return this.getLetterSyllable(1) && ("m" == this.getLetterSyllable(1).text && "n" !== this.getTextWord(2, 2) || "n" == this.getLetterSyllable(1).text && this.getLetterWord(2)) ? true : false;
};
Letter.prototype.computeIPA = function () {
  switch (this.text) {
    case "a":
      return this.isNasal() ? !this.getSyllableWord(1) || this.getLetterSyllable(-1) && "b" == this.getLetterSyllable(-1).text && !this.syllable.stressed ? "ɐ̃w" : "ɐ̃" : this.getLetterSyllable(1) && /[lriu]/.test(this.getLetterSyllable(1).text) ? "a" : this.getLetter(1) && /[mn]/.test(this.getLetter(1).text) ? "ɐ" : this.syllable.stressed ? "a" : "ɐ";
    case "à":
      return "a";
    case "ã":
      return "ɐ̃";
    case "â":
      return this.isNasal() ? "ɐ̃" : "ɐ";
    case "á":
      return "a";
    case "ç":
      return "s";
    case "c":
      this.getLetterSyllable(1) && this.getLetterSyllable(1);
      if (this.getLetterSyllable(1)) {
        if ("h" == this.getLetterSyllable(1).text) return "ʃ";
        if (/[e\u00ea\u00e9i\u00ed]/.test(this.getLetterSyllable(1).text)) return "s";
      }
      return "k";
    case "e":
      if (this.isNasal()) return !this.getSyllableWord(1) || this.getLetterSyllable(-1) && "b" == this.getLetterSyllable(-1).text && !this.syllable.stressed ? "ɐ̃j" : "ẽ";
      if (this.getLetterSyllable(-1) && /[\u00e3\u00f5]/.test(this.getLetterSyllable(-1).text)) return "j";
      if (this.getLetterSyllable(1) && "i" == this.getLetterSyllable(1).text || this.getLetterWord(1) && "n" == this.getLetterWord(1).text && this.getLetterWord(2) && "h" == this.getLetterWord(2).text) return "ɐ";
      if (this.getLetterSyllable(1) && "l" == this.getLetterSyllable(1).text) return "ɛ";
      if (!this.syllable.stressed) return 0 == this.syllable.wordIndex && /^h?e/.test(this.syllable.text) || this.getLetterWord(1) && /[a\u00e2\u00e1\u00e3e\u00ea\u00e9i\u00edo\u00f4\u00f3\u00f5u\u00fa]/.test(this.getLetterWord(1).text) || 1 == this.syllable.letters.length ? "i" : "ɨ";
      break;
    case "é":
      return this.isNasal() ? this.getSyllableWord(1) ? "ẽ" : "ɐ̃j" : "ɛ";
    case "ê":
      return this.isNasal() ? this.getSyllableWord(1) ? "ẽ" : "ɐ̃jɐ̃j" : this.getLetterSyllable(1) && "i" == this.getLetterSyllable(1).text ? "ɐ" : "e";
    case "g":
      if (this.getLetterSyllable(1) && /[ei]/.test(this.getLetterSyllable(1).text)) return "ʒ";
      break;
    case "h":
      return "";
    case "y":
    case "i":
      return this.isNasal() ? "ĩ" : !this.getLetterSyllable(-1) || !/[a\u00e1\u00e2e\u00e9\u00eao\u00f3\u00f4]/.test(this.getLetterSyllable(-1).text) && (!/[u\u00fa]/.test(this.getLetterSyllable(-1).text) || this.getLetterSyllable(-2) && /[qg]/.test(this.getLetterSyllable(-2).text)) ? "i" : "j";
    case "í":
      return this.isNasal() ? "ĩ" : "i";
    case "j":
      return "ʒ";
    case "l":
      return this.getLetterSyllable(1) && "h" == this.getLetterSyllable(1).text ? "ʎ" : "ɫ";
    case "m":
      if (this.getLetterSyllable(-1) && this.getLetterSyllable(-1).isNasal()) return "";
      break;
    case "n":
      if (this.getLetterSyllable(-1) && this.getLetterSyllable(-1).isVowel() && this.getLetterSyllable(-1).isNasal()) return "";
      if (this.getLetterSyllable(1) && "h" == this.getLetterSyllable(1).text) return "ɲ";
      break;
    case "o":
      if (this.isNasal()) return "õ";
      if (this.getLetterSyllable(1) && "l" == this.getLetterSyllable(1).text) return "ɔ";
      if (this.getLetterSyllable(1) && /[iu]/.test(this.getLetterSyllable(1).text)) return "o";
      if (this.getLetterSyllable(-1) && /[\u00e3\u00f5]/.test(this.getLetterSyllable(-1).text)) return "w";
      if (!this.syllable.stressed) return 0 == this.syllable.wordIndex && /^h?o/.test(this.syllable.text) && 1 < this.syllable.word.syllables.length ? "o" : "u";
      break;
    case "ó":
      return "ɔ";
    case "ô":
      return "o";
    case "q":
      return "k";
    case "r":
      return this.getLetterWord(-1) && "r" != this.getLetterWord(-1).text ? this.getLetterWord(1) && "r" == this.getLetterWord(1).text ? "" : "ɾ" : "ʁ";
    case "s":
      if (this.getLetterWord(1) && "h" == this.getLetterWord(1).text) return "ʃ";
      if (!this.getLetterWord(-1) || "s" == this.getLetterWord(-1).text) return "s";
      if (this.getLetterWord(1) && "s" == this.getLetterWord(1).text) return "";
      if (!this.getLetter(1)) return "ʃ";
      if (this.getLetterSyllable(1) && /[a\u00e1\u00e2\u00e3e\u00e9\u00eai\u00edo\u00f3\u00f4\u00f5u\u00fa]/.test(this.getLetterSyllable(1).text)) return this.getLetterWord(-1) && /[a\u00e1\u00e2\u00e3e\u00e9\u00eai\u00edo\u00f3\u00f4\u00f5u\u00fa]/.test(this.getLetterWord(-1).text) || this.getSyllableWord(-1) && /tr[a\u00e2]n/.test(this.getSyllableWord(-1).text) ? "z" : "s";
      if (/^h?[a\u00e1\u00e2\u00e3e\u00e9\u00eai\u00edo\u00f3\u00f4\u00f5u\u00fa]/.test(this.getText(1, 2))) return "z";
      console.log(2);
      return /[bdgjlmnrvz]/.test(this.getLetter(1).text) ? "ʒ" : "ʃ";
    case "w":
    case "u":
      if (/^muit[oa]s?$/.test(this.getTextWord()) || this.isNasal()) return "ũ";
      if (this.getLetterSyllable(-1) && /[gq]/.test(this.getLetterSyllable(-1).text) && this.getLetterSyllable(1)) {
        if (/[e\u00e9\u00eai\u00ed]/.test(this.getLetterSyllable(1).text)) return "";
        if (this.getLetterSyllable(1).isVowel()) return "w";
      }
      return this.getLetterSyllable(-1) && /[o\u00f3\u00f4]/.test(this.getLetterSyllable(-1).text) ? "" : this.getLetterSyllable(-1) && /[a\u00e1\u00e2e\u00e9\u00eai\u00edo\u00f3\u00f4]/.test(this.getLetterSyllable(-1).text) ? "w" : "u";
    case "ú":
      return this.isNasal() ? "ũ" : "u";
    case "x":
      if (!this.getLetterWord(-1) || this.getSyllableWord(-1) && /me|en/.test(this.getSyllableWord(-1).text) || this.getSyllableWord(-1) && /[a\u00e1\u00e2e\u00e9\u00eao\u00f3\u00f4u\u00fa]i|[a\u00e1\u00e2e\u00e9\u00eai\u00edo\u00f3\u00f4]u/.test(this.getSyllableWord(-1).text)) return "ʃ";
      if (this.getSyllableWord(-1) && "he" == this.getSyllableWord(-1).text) return this.syllable.stressed ? "z" : "gz";
      if (!this.getLetterSyllable(1)) {
        if (!this.getLetter(1)) return "ʃ";
        if (/[a\u00e1\u00e2\u00e3e\u00e9\u00eai\u00edo\u00f3\u00f4\u00f5u\u00fa]/.test(this.getLetter(1).text)) return "z";
        if (/[bdgjlmnrvz]/.test(this.getLetter(1).text)) return "ʒ";
      }
      return "ʃ";
    case "z":
      return this.getLetterWord(1) && "h" == this.getLetterWord(1).text ? "ʒ" : this.getLetterSyllable(-1) ? this.getLetter(1) ? /[a\u00e1\u00e2\u00e3e\u00e9\u00eai\u00edo\u00f3\u00f4\u00f5u\u00fa]/.test(this.getLetter(1).text) ? "z" : /[bdgjlmnrvz]/.test(this.getLetter(1).text) ? "ʒ" : "ʃ" : "ʃ" : "z";
  }
  return this.text;
};
Letter.prototype.processDissimilationI = function () {
  var a = function (a) {
    for (var b = 0; b < a.letters.length; b++) if (/i|i\u0303/.test(a.letters[b].IPA)) return true;
    return false;
  }, c = function (a) {
    if (0 == a.wordIndex) for (var b = 0; b < a.letters.length; b++) {
      if (/i|i\u0303/.test(a.letters[b].IPA)) return true;
      if ("" != a.letters[b].IPA) break;
    }
    return false;
  };
  if (!this.syllable.stressed && "i" === this.IPA) {
    if (this.getLetterWord(1) && /[\u0283\u0292]/.test(this.getLetterWord(1).IPA)) return c(this.syllable) ? "" : "ɨ";
    if (!this.getLetterWord(-1) || !this.getLetterWord(-1).isVowel()) if (this.getSyllableWord(-1) && this.getSyllableWord(-1).stressed && a(this.getSyllableWord(-1)) || !c(this.syllable) && (this.getSyllableWord(1) && a(this.getSyllableWord(1)) || this.getSyllableWord(-1) && a(this.getSyllableWord(-1)))) return "ɨ";
  }
  return this.IPA;
};
Letter.prototype.processDissimilationE = function () {
  if ("e" == this.IPA) {
    if (this.getLetterWord(1) && "ʎ" == this.getLetterWord(1).IPA) return "ɐ";
    if (this.getLetterSyllable(1) && "x" == this.getLetterSyllable(1).text || this.syllable.stressed && this.getSyllableWord(1) && /^(ch|j)/.test(this.getSyllableWord(1).text)) return "ɐj";
  }
  return this.IPA;
};
Letter.prototype.getLetter = function (a) {
  return this.syllable.word.sentence.letters[this.sentenceIndex + a];
};
Letter.prototype.getLetterSyllable = function (a) {
  return this.syllable.letters[this.syllableIndex + a];
};
Letter.prototype.getLetterWord = function (a) {
  return this.syllable.word.letters[this.wordIndex + a];
};
Letter.prototype.getSyllableWord = function (a) {
  return this.syllable.word.syllables[this.syllable.wordIndex + a];
};
Letter.prototype.getText = function (a, c) {
  return new LetterRange(this.syllable.word.sentence.letters).slice(this.sentenceIndex, a, c).getText();
};
Letter.prototype.getTextWord = function (a, c) {
  return new LetterRange(this.syllable.word.letters).slice(this.wordIndex, a, c).getText();
};
Letter.prototype.getTextSyllable = function (a, c) {
  return new LetterRange(this.syllable.letters).slice(this.syllableIndex, a, c).getText();
};
function LetterRange(a) {
  this.letters = a;
}
LetterRange.prototype.getText = function () {
  return this.letters.map(function (a) {
    return a.text;
  }).join("");
};
LetterRange.prototype.slice = function (a, c, d) {
  return void 0 === c ? new LetterRange(this.letters) : void 0 === d ? new LetterRange(0 > c ? this.letters.slice(0, a + c + 1) : this.letters.slice(a + c)) : new LetterRange(this.letters.slice(a + c, a + d + 1));
};
window.process = function () {
  var a = document.getElementById("input").value;
  location.hash = a;
  for (var a = a.toLowerCase(), c = [], d = a.match(/([a-zA-Z\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00ee\u00f3\u00f4\u00f5\u00fa\u00fb\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00ce\u00d3\u00d4\u00d5\u00da\u00db\u00c7\- ]*)([^a-zA-Z\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00ee\u00f3\u00f4\u00f5\u00fa\u00fb\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00ce\u00d3\u00d4\u00d5\u00da\u00db\u00c7]*)/g), a = 0; a < d.length; a++) {
    var b = d[a].match(/([a-zA-Z\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00ee\u00f3\u00f4\u00f5\u00fa\u00fb\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00ce\u00d3\u00d4\u00d5\u00da\u00db\u00c7\- ]*)([^a-zA-Z\u00e1\u00e2\u00e3\u00e9\u00ea\u00ed\u00ee\u00f3\u00f4\u00f5\u00fa\u00fb\u00e7\u00c1\u00c2\u00c3\u00c9\u00ca\u00cd\u00ce\u00d3\u00d4\u00d5\u00da\u00db\u00c7]*)/);
    c.push(new Sentence(b[1], document.getElementById("showPunctuation").checked ? b[2] : b[2].replace(/[^\n]/, "") || " "));
  }
  d = "<b>Stressed syllables:</b>\n";
  for (a = 0; a < c.length; a++) d += c[a].printStressedSyllables() + c[a].separator;
  d += "\n\n<b>IPA:</b>\n";
  for (a = 0; a < c.length; a++) d += c[a].printIPA() + c[a].separator;
  document.getElementById("output").innerHTML = d;
};
window.init = function () {
  document.getElementById("input").value = decodeURIComponent(location.hash.replace(/^#/, ""));
  process();
};
addEventListener("hashchange", window.init);
document.addEventListener("DOMContentLoaded", function () {
  location.hash && "#" != location.hash || (location.hash = "Olá mundo!");
  window.init();
});
