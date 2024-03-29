"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianFilter = void 0;
const filter_1 = require("./filter");
class GaussianFilter extends filter_1.ArrayFilter {
    // variance is best around 2
    // performance suffers if kernelSize is too 
    constructor(kernelSize, variance) {
        super(kernelSize);
        this.variance = variance;
        //create the gaussian kernel
        this.kernel = new Array(this.kernelSize);
        for (let i = 0; i < this.kernel.length; i += 1) {
            const u = i - this.kernel.length / 2 + 1 / 2;
            // note that this gaussian filter doesn't have a normalized area under it's curve
            // this is to make threshold stuff easier later
            this.kernel[i] = Math.exp(-0.5 * Math.pow(u / this.variance, 2)); ///(this.variance*Math.sqrt(2*Math.PI))
        }
    }
    filter(arr) {
        const newArr = new Array(arr.length).fill(0);
        for (let i = 0; i < arr.length; i += 1) {
            let sum = 0;
            for (let d = Math.ceil(-this.kernelSize / 2); d <= this.kernelSize / 2; d += 1) {
                let di = i + d;
                if (di < 0)
                    continue;
                if (di >= arr.length)
                    continue;
                sum += arr[di] * this.kernel[d + Math.floor(this.kernel.length / 2)];
            }
            newArr[i] = sum;
        }
        return newArr;
    }
}
exports.GaussianFilter = GaussianFilter;
