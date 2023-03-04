import { exit } from "process";
import { FileInputParser } from "./input/file_input";
import { Renderer } from "./rendering/renderer";
import { PhonemeMapping } from "./transcript/parse_mappings";
import { PhonemeOccurrences } from "./transcript/phoneme_occurrences";
import { GaussianFilter } from "./transcript/filtering/gaussian";
import { ArrayFilter } from "./transcript/filtering/filter";

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

        config.loadOptionalParameter("phoneme_samples_per_second", 10)
        config.loadOptionalParameter("frames_per_second", 27)

        config.placeholder_video_length = 4

        console.log(config)
    } catch(e) {
        console.log((e as Error).toString())
        exit();
    }

    const mapping = new PhonemeMapping(config);
    const a = mapping.presentPhonemes()
    console.log(a)

    const phonemeOccurrences = new PhonemeOccurrences(config, mapping)

    const renderer: Renderer = new Renderer(config)
    renderer.setup()
    for(let i: number = 1; i <= config.placeholder_video_length * config.frames_per_second; i += 1) {
        renderer.drawFrame(mapping, i, i / config.frames_per_second)
    }
    //const video: string = renderer.generateVideo();
    //console.log(`created video ${video}`)

    const filter: ArrayFilter = new GaussianFilter(7, 2)
    const filtered = filter.filter([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0])
    console.log(filtered.map(val => val.toFixed(2)))
    }

main()