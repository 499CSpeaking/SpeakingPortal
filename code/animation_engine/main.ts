import { exit } from "process";
import { FileInputParser } from "./input/file_input";
import { Renderer } from "./rendering/renderer";
import { PhonemeMapping } from "./transcript/parse_mappings";
import { PhonemeOccurrences } from "./transcript/phoneme_occurrences";
import getVideoDurationInSeconds from "get-video-duration";
import { GraphicsPool } from "./graphics/graphics_pool";


async function main() {
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
        config.loadFile("audio", "audio_path")
        
        config.loadOptionalParameter("frames_path", './tmp')
        config.loadOptionalParameter("video_path", './tmp')

        config.loadOptionalParameter("filter_kernel_size", 7)
        config.loadOptionalParameter("filter_kernel_variance", 2)

        config.loadOptionalParameter("phoneme_idle_threshold", 0.1)

        config.loadOptionalParameter("phoneme_samples_per_second", 10)
        config.loadOptionalParameter("frames_per_second", 27)

        config.loadParameter("graphics_path")

        config.loadParameter("audio_path")
        config.video_length = await getVideoDurationInSeconds(config.audio_path)

        console.log(config)
    } catch(e) {
        console.log((e as Error).toString())
        exit();
    }

    // const mapping = new PhonemeMapping(config);
    // const phonemeOccurrences = new PhonemeOccurrences(config, mapping)

    // const renderer: Renderer = new Renderer(config)
    // renderer.setup()
    // for(let i: number = 1; i <= config.video_length * config.frames_per_second; i += 1) {
    //     const text: string = `${phonemeOccurrences.getDominantPhonemeAt(i / config.frames_per_second) ?? 'idle'}`
    //     renderer.drawFrame(text, i, i / config.frames_per_second)
    // }
    // const video: string = renderer.generateVideo();

    // console.log(`created video ${video}`)

    const graphics = new GraphicsPool(config.graphics_path)
    await graphics.init()
    graphics.get('qwerty')
    }

main()