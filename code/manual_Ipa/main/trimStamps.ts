// library requirements

// algo to strip smaller stamps from list
function trimStamps(stamps, wordCount) {
    // set max number of values to be deleted
    let maxDel = stamps.size-wordCount;
    let i = 0;
    // find values to be deleted
    for (let key of stamps.keys()) {
        // end condition - if we have deleted enough stamps
        if (i == maxDel){
            break;
        }
        // get difference between start and end to determine if it is too small
        let start = stamps.get(key).start;
        let end = stamps.get(key).end;
        let diff = end-start;
        // delete the stamp from the list 
        if (diff <= 100) {
            stamps.delete(key);
            i++;
        }
    }

    // return trimmed stamps
    return stamps;
}

module.exports = trimStamps;