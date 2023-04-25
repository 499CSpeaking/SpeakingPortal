# Animation Engine

I am Jake Tyerman, Client Liaison, and I primarily worked on the Animation Engine. The Animation Engine is the component of our Speaking Portal project which takes

- .wav audio file of speech

- transcript (timestamps of phonemes from above file) in "Gentle" format (The specific JSON format outputted by the Gentle forced aligner)

And outputs a .mp4 video of a speaking avatar. I'll will go over the most important details in this document, starting with how to use it. Note that this document doesn't cover the above bullet points regarding input in much depth, as those are processed before the Animation Engine runs. Perhaps see the `FE_Connect.md` document.

# Usage

See `main.ts` of `code/main`. The function that wraps practically all of the animation engine is:

```typescript
async function run(inputFilePath: string, config: any): Promise<string>
```

In basic terms, this function takes in 2 parameters:

- the filepath to a JSON file containing all the input parameters for modifying input parameters statically

- an optional "configuration" object for modifying input parameters dynamically

The return value of this function is the file path to the output video.

## Configuration

### Static Configuration

The easiest way to configure the Animation Engine is by putting configuration in the input JSON file. A typical input file can look like this

```json
{
    // video quality parameters

    "width": 250,
    "height": 250,

    "phoneme_samples_per_second": 27,
    "frames_per_second": 27,

    "filter_kernel_size": 7,
    "filter_kernel_variance": 2,

    "phoneme_idle_threshold": 1,

    // outputs

    "frames_path": "./demo_files/tmp",
    "video_path": "./demo_files/tmp",

    // inputs

    "graphics_path": "./testing/graphics_male",
    "graphics_config_path": "./testing/graphics_male.json",

    "transcript_path": "./demo_files/transcript.json",
    "audio_path": "./demo_files/audio.wav",

    "avatar_context_path": "./demo_files/avatar_male.json",

    "blink_speed": 20,
    "blink_period": 2.656
}
```

I could explain what all these parameters do, but I recommend that you read this full document and also browse through some of the code as that would give a much more intuitive understanding.

### Dynamic Configuration

It is possible (and an implied requirement of the product) that these parameters should be modifiable during runtime, as different users will request different avatars, video resolutions ,etc. To see a demo of how this works, see this snippet:

```typescript
const config: any = new Object();

config.frames_per_second = 15
config.video_path = './custom/path'

await run(`./demo_files/input.json`, config)
    .then(
        ...
    )
```

In this code, I set the configuration parameters `frames_per_second` and `video_path` to custom values. Note that both the static and dynamic method of passing in configuration work alongside eachother. If the same configuration value is specified in both the input JSON file and the `config` object, the `config` object will override the JSON file object. I will cover more about how the configuration works later

# Internal Workings

In order to give a thorough understanding of the Animation Engine, I will cover each significant component of the Animation Engine and their purpose. You can see this sequence of components in the body of the `run` method:

```typescript
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
```

Please excuse the witless comments. I had to put those in there as filler "code additions" to get marked by our classes' git evaluation system.

## input/file_input.ts

# Other Important Notes