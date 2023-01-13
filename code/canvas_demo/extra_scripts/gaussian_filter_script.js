// this script generates a one-dimensional gaussian filter to be used in inputs.json
// doesn't it actually produce proper gaussian distributions? I don't know

const sigma = 2
const width = 9
const mean = Math.floor(width/2)

let result = new Array(width)

for(let x = 0; x < width; x += 1) {
    result[x] = Math.exp(-((x - mean)*(x - mean)) / (2 * sigma * sigma))
}

const sum = result.reduce((partialSum, val, _) => partialSum + val, 0)
result = result.map((value) => value/sum)

console.log(result.map((value) => value.toFixed(3)))