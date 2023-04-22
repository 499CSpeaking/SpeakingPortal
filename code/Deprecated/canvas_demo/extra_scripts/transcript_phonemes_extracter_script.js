// small script to figure out which phonemes need to be defined in mouth_mappings.json for the given transcript to work

const fs = require('fs')

const mappings = new Set()

const transcript = JSON.parse(fs.readFileSync('./input_files/transcript.json'))

transcript.words.forEach(word => {
    word.phones.forEach(phone => {
        //console.log(phone)
        mappings.add(phone.phone)
    })
})

console.log(mappings)