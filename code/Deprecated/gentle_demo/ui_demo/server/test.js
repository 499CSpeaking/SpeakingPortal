const exec = require('child_process').execSync;

const output = exec('pwd')

console.log(output.toString())