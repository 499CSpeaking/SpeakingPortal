import { exit } from 'process';
import { FileInputParser } from './input/file_input';

function main() {
    // parse all the inputs
    const inputParser: FileInputParser = new FileInputParser('./testing/inputs.json')

    const inputs: any = new Object();
    inputs.addParameter = (parameter: string) => {
        inputs[parameter] = inputParser.getParameter(parameter)
    }
    inputs.addOptionalParameter = (parameter: string) => {
        const value = inputParser.getParameterOptional(parameter)
        if(value) {
            inputs[parameter] = value
        }
    }

    try {
        inputs.addParameter("a")
        inputs.addParameter("b")
        inputs.addParameter("c")
        inputs.addOptionalParameter("d")
        console.log(inputs)
    } catch(e) {
        console.log(e.toString())
        exit();
    }
}

main()