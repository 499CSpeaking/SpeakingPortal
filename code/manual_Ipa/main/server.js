var express = require('express');
var getPhoneme = require('./getPhoneme');
var server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/', express.static('site'));
server.post('/api/', function (req, res) {
    var input = req.body.input;
    console.log('input: ', input);
    var output = getPhoneme(input);
    console.log('output: ', output);
    res.json({ output: output });
});
server.listen(4000, function () {
    console.log('server running...');
});
