import { exit } from "process";
import { FileInputParser } from "./input/file_input";
import { Renderer } from "./rendering/renderer";
import { PhonemeMapping } from "./transcript/parse_mappings";

function main() {
    // parse all the inputs
    const inputParser: FileInputParser = new FileInputParser('./testing/inputs.json')

    const config: any = new Object();
    config.loadParameter = (parameter: string) => {
        config[parameter] = inputParser.getParameter(parameter)
    }
    config.loadOptionalParameter = (parameter: string, def: any) => {
        const value = inputParser.getParameterOptional(parameter)
        config[parameter] = value ?? def
    }
    config.loadFile = (name: string, pathLocation: string) => {
        config[name] = inputParser.getFile(inputParser.getParameter(pathLocation))
    }

    try {
        config.loadParameter("height")
        config.loadParameter("width")

        config.loadFile("transcript", "transcript_path")
        
        config.loadOptionalParameter("frames_path", './tmp')
        config.loadOptionalParameter("video_path", './tmp')

        console.log(config)
    } catch(e) {
        console.log((e as Error).toString())
        exit();
    }

    const mapping = new PhonemeMapping(config);

    const renderer: Renderer = new Renderer(config)
    renderer.setup()
    for(let i: number = 1; i <= 250; i += 1) {
        renderer.drawFrame(mapping, i, i/25)
    }
    const video: string = renderer.generateVideo();
    console.log(`created video ${video}`)
    }

main()