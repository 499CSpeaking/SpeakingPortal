// library requirements
// algo to strip smaller stamps from list
function trimStamps(stamps, wordCount) {
    // set max number of values to be deleted
    var maxDel = stamps.size - wordCount;
    var i = 0;
    // find values to be deleted
    for (var _i = 0, _a = stamps.keys(); _i < _a.length; _i++) {
        var key = _a[_i];
        // end condition - if we have deleted enough stamps
        if (i == maxDel) {
            break;
        }
        // get difference between start and end to determine if it is too small
        var start = stamps.get(key).start;
        var end = stamps.get(key).end;
        var diff = end - start;
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
