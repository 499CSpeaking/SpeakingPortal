var express = require('express');
var getPhoneme = require('./getPhoneme');
var server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/', express.static('site'));
server.post('/api/', function (req, res) {
    var input = req.body.input;
    console.log('input: ', input);
    getPhoneme(input)
        .then(function (output) {
        console.log('output: ', output);
        res.json({ output: output });
        console.log('success');
    });
});
server.listen(4000, function () {
    console.log('server running...');
});
