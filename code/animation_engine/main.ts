import { FileInputParser } from './io/file_input';

let a: FileInputParser = new FileInputParser('./testing/inputs.json')

try {
    console.log(a.getParameter('abc'))
    console.log(a.getParameter('abcd'))
} catch(e) {
    console.log(`error: ${e}`)
}