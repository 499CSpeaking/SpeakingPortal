import { exit } from "process";
import { FileInputParser } from "./input/file_input";
import { Renderer } from "./rendering/renderer";
import { PhonemeMapping } from "./transcript/parse_mappings";
import { PhonemeOccurrences } from "./transcript/phoneme_occurrences";
import getVideoDurationInSeconds from "get-video-duration";
import { GraphicsPool } from "./graphics/graphics_pool";
import { PhonemeImageconverter } from "./graphics/phoneme_to_image";
import { AvatarContext } from "./graphics/avatar_context";


export async function run(inputFilePath: string, config: any): Promise<string> {
    // parse all the inputs
    const inputParser: FileInputParser = new FileInputParser(inputFilePath)

    config.loadParameter = (parameter: string) => {
        if(!config[parameter]) {
            config[parameter] = inputParser.getParameter(parameter)
        }
    }
    config.loadOptionalParameter = (parameter: string, def: any) => {
        const value = inputParser.getParameterOptional(parameter)
        if(!config[parameter]) {
            config[parameter] = value ?? def
        }
    }
    config.loadFile = (name: string, pathLocation: string) => {
        if(!config[name]) {
            config[name] = inputParser.getFile(inputParser.getParameter(pathLocation))
        }
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
        config.loadParameter("graphics_config_path")

        config.loadParameter("audio_path")

        config.loadParameter("avatar_context_path")

        config.loadOptionalParameter("blink_speed", 40)
        config.loadOptionalParameter("blink_period", 2)

        config.video_length = await getVideoDurationInSeconds(config.audio_path)

        console.log(config)
    } catch(e) {
        console.log((e as Error).toString())
        exit();
    }

    // this is the phoneme mapping, it maps phonemes
    const mapping = new PhonemeMapping(config)
    const phonemeOccurrences = new PhonemeOccurrences(config, mapping)

    // graphics pool, which pools graphics
    const graphics = new GraphicsPool(config.graphics_path)
    await graphics.init()

    // this object converts phonemes to images (not directly though)
    const phonemeImageconverter = new PhonemeImageconverter(config)

    const avatarContext = new AvatarContext(config)
    await avatarContext.init()

    // this object renders
    const renderer: Renderer = new Renderer(config, graphics, phonemeOccurrences, phonemeImageconverter, avatarContext)
    renderer.setup()
    for(let i: number = 1; i <= config.video_length * config.frames_per_second; i += 1) {
        const text: string = `${phonemeOccurrences.getDominantPhonemeAt(i / config.frames_per_second) ?? 'idle'}`
        renderer.drawFrame(i, i / config.frames_per_second)
    }
    const video: string = renderer.generateVideo();

    return video
}

if(require.main == module) {
    run('./testing/inputs.json', new Object())
}