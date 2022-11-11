const express = require('express');
const getPhoneme = require('./getPhoneme');
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/', express.static('site'));

server.post('/api/', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    getPhoneme(input)
    .then(output => {
        console.log('output: ', output);
        res.json({output: output});
        console.log('success');  
    })
});

server.listen(4000, () => {
    console.log('server running...');
});