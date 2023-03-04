import { ArrayFilter } from "./filter";

export class GaussianFilter extends ArrayFilter {
    private variance: number
    private kernel: Array<number>

    constructor(kernelSize: number, variance: number) {
        super(kernelSize)
        this.variance = variance

        //create the gaussian kernel
        this.kernel = new Array<number>(this.kernelSize);
        for(let i = 0; i < this.kernel.length; i += 1) {
            const u = i - this.kernel.length/2 + 1/2

            this.kernel[i] = Math.exp(-0.5*Math.pow(u/this.variance,2))/(this.variance*Math.sqrt(2*Math.PI))
        }
    }

    filter(arr: number[]): number[] {
        const newArr: number[] = new Array<number>(arr.length)

        for(let i = 0; i < arr.length; i += 1) {
            let sum = 0
            for(let d = Math.ceil(-this.kernelSize/2); d <= this.kernelSize/2; d += 1) {
                let di = i + d
                if(di < 0) continue
                if(di > arr.length - 1) continue

                sum += arr[di] * this.kernel[d + Math.floor(this.kernel.length/2)]
            }
            newArr[i] = sum
        }

        return newArr
    }

}