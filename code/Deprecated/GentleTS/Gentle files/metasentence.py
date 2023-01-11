# coding=utf-8
import re

# [oov] no longer in words.txt
OOV_TERM = '<unk>'

def load_vocabulary(words_file):
    '''Load vocabulary words from an OpenFST SymbolTable formatted text file'''
    return set(x.split(' ')[0] for x in words_file if x != '')

def kaldi_normalize(word, vocab):
    """
    Take a token extracted from a transcript by MetaSentence and
    transform it to use the same format as Kaldi's vocabulary files.
    Removes fancy punctuation and strips out-of-vocabulary words.
    """
    # lowercase
    norm = word.lower()
    # Turn fancy apostrophes into simpler apostrophes
    norm = norm.replace("’", "'")
    if len(norm) > 0 and not norm in vocab:
        norm = OOV_TERM
    return norm

class MetaSentence:
    """Maintain two parallel representations of a sentence: one for
    Kaldi's benefit, and the other in human-legible form.
    """

    def __init__(self, sentence, vocab):
        self.raw_sentence = sentence

        if type(sentence) == bytes:
            self.raw_sentence = sentence.decode('utf-8')
        self.vocab = vocab

        self._tokenize()

    def _tokenize(self):
        self._seq = []
        for m in re.finditer(r'(\w|\’\w|\'\w)+', self.raw_sentence, re.UNICODE):
            start, end = m.span()
            word = m.group()
            token = kaldi_normalize(word, self.vocab)
            self._seq.append({
                "start": start, # as unicode codepoint offset
                "end": end, # as unicode codepoint offset
                "token": token,
            })

    def get_kaldi_sequence(self):
        return [x["token"] for x in self._seq]

    def get_display_sequence(self):
        display_sequence = []
        for x in self._seq:
            start, end = x["start"], x["end"]
            word = self.raw_sentence[start:end]
            display_sequence.append(word)
        return display_sequence

    def get_text_offsets(self):
        return [(x["start"], x["end"]) for x in self._seq]
