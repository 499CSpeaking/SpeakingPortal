// library requirements
// algo to strip smaller stamps from list
function trimStamps(stamps, wordCount) {
    console.log("Starting Trimmer...");
    // set max number of values to be deleted
    var maxDel = stamps.size - wordCount;
    console.log("Num to Delete: ", maxDel);
    var i = 0;
    // trimmed array to hold values
    var trimmedStamps = new Map();
    // delete extra stamps
    stamps.forEach(function (stamp, word) {
        if (i < maxDel) {
            console.log("Checking Key: ", word);
            var start = stamp.start;
            var end = stamp.end;
            var diff = end - start;
            if (diff <= 100) {
                console.log("Deleting: ", word);
                stamps.delete(word);
                i++;
            }
        }
    });
    // add properly numbered values to new array
    var j = 0;
    stamps.forEach(function (stamp, word) {
        trimmedStamps.set(j, stamp);
        j++;
    });
    // return trimmed stamps
    return trimmedStamps;
}
module.exports = trimStamps;
