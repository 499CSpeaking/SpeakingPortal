/*
    base class for function-objects which take a two-value array and smooth it out such that it
    represents more natural lip movement
*/

export abstract class ArrayFilter {
    protected kernelSize: number

    constructor(kernelSize: number) {
        if(kernelSize % 2 == 0) {
            // kernel must be of an odd size
            throw new Error(`kernel size should be odd, but ${kernelSize} is even`)
        }
        this.kernelSize = kernelSize
    }

    //function that performs filtering
    abstract filter(arr: Array<number>): Array<number>
}