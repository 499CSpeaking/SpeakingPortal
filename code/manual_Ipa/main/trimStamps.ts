// library requirements

// algo to strip smaller stamps from list
function trimStamps(stamps: Map<any, any>, wordCount: number): Map<any, any> {
    console.log("Starting Trimmer...");
    // set max number of values to be deleted
    let maxDel = stamps.size - wordCount;
    console.log("Num to Delete: ", maxDel);
    let i = 0;

    // trimmed array to hold values
    let trimmedStamps: Map<any, any> = new Map();

    // delete extra stamps
    stamps.forEach(function (stamp, word) {
        if (i < maxDel) {
            console.log("Checking Key: ", word);
            let start = stamp.start;
            let end = stamp.end;
            let diff = end - start;

            if (diff <= 100) {
                console.log("Deleting: ", word);
                stamps.delete(word);
                i++;
            }
        }
    });

    // add properly numbered values to new array
    let j = 0
    stamps.forEach(function (stamp, word) {
        trimmedStamps.set(j, stamp);
        j++;
    });

    // return trimmed stamps
    return trimmedStamps;
}

module.exports = trimStamps;