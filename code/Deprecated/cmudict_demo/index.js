/*
this approach involves using the https://github.com/vilmibm/node-cmudict library. It queries
a word in a dictionary database, meaning it is extremely fast. However, a slight mispelling
means that the word cannot be found in the dictionary. To add on to this, some informal words
like "meme" are not in the dictionary and cannot be parsed
*/

var CMUDict = require('cmudict').CMUDict;
var cmudict = new CMUDict();

var readlineSync = require('readline-sync');

while(true) {
  var input = readlineSync.question("enter input: ");

  input = input.split(" ");
  console.log(input);

  for(i of input) {
    let parsed = cmudict.get(i);
    if(parsed != undefined){
        console.log(parsed)
    } else {
        //ideally, you would use a slower (but more capable) method here, where the dictionary lookup fails
        console.log("cannot query database, querying other methods...")
    }
  }
}
