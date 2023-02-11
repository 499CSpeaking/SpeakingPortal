import { exit } from 'process';
import { FileInputParser } from './input/file_input';

function main() {
    // parse all the inputs
    const inputParser: FileInputParser = new FileInputParser('./testing/inputs.json')

    const config: any = new Object();
    config.loadParameter = (parameter: string) => {
        config[parameter] = inputParser.getParameter(parameter)
    }
    config.loadOptionalParameter = (parameter: string) => {
        const value = inputParser.getParameterOptional(parameter)
        if(value) {
            config[parameter] = value
        }
    }

    try {
        config.loadParameter("a")
        config.loadParameter("b")
        config.loadParameter("c")
        config.loadOptionalParameter("d")
        console.log(config)
    } catch(e) {
        console.log((e as Error).toString())
        exit();
    }
}

main()