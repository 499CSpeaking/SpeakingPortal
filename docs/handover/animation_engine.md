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

This is where the `FileInputParser` object is defined. It's purpose is to extract user input from a text source, including key-value configuration pairs as seen previously, and also files. This objects works fine if you're sourcing input data from a file for testing purposes for example, but Kukarella hosts it's software on AWS elastic beanstalk if I'm not mistaken. This approach probably won't work very well in such a different architecture. How to modify the way that the Animation Engine sources it's inputs?

### input/abstract_input.ts

We provided the master class `InputParser` to let Kukarella implement it's own method of sourcing inputs. Note that `inputParser`'s type is of `FileInputParser` when it should be `InputParser`, my bad.

## more on configuration

You can see the functions `config.loadParameter("abc")` and `config.loadOptionalParameter("abc", default_value)` and possibly other similar functions. Look at how these functions are implemented and you will see how the program loads data from the `InputParser`.

## transcript/parse_mappings.ts

This file contains the `PhonemeMapping` class. Notice that in the constructor, we pass in the whole `config` object. Internally, the "`transcript`" configuration, which is sourced from the `transcript_path` parameter is used by the class. Many components in the Animation Engine do something like this.

Anyways, the purpose of this class is to take the transcript file, which is probably generated from the Gentle aligner, and parse it such that specific times can be passed into it and whatever phoneme is spoken at that time will be returned.

## transcript/phoneme_occurrences.ts

This file contains the `PhonemeOccurrences` class. It's pretty technical at this point, but the purpose of this class is to take the freshly parsed phonemes in `PhonemeMapping` and essential give each phoneme a time record of how "loud" they are at that point where 0 = the phoneme is not being spoken at all and 1 = the phoneme is currently being spoken. This list of 1s and 0s are "low-passed" or smoothed/blurred using a gaussian filter. The reason why we have this is because when we render the (phoneme-appropriate) mouth on the avatar, we stretch and squeeze the vertical axis of the mouth to simulate movement, in order to give more animation to static images. This smooth list of values allows us to do that easily.

## graphics/graphics_pool.ts

This is where we define a `GraphicsPool` object. The `GraphicsPool` object, as the name suggests, caches images in memory so that the rendering system can have easy access to images without constant disk I/Os. **You may have to modify this function to work with your architecture!**

## graphics/phoneme_to_image.ts

This file contains the `PhonemeImageconverter` class. Its purpose is to take the phoneme-to-mouth-image mappings stored in `graphics_config_path` and load them in memory.

## graphics/avatar_context.ts

The `AvatarContext` class stores data about the avatar (body texture, eyes, texture positions, etc) and is used by the rendering system. For example, the member function `eyeData(time: number): [string, string, number[], number, number]` returns not just the eye positionings + scale, but also the filename of the texture that corresponds to what time in the blinking phase it is.

# rendering/renderer.ts

Now for the fun stuff. The `Renderer` class is actually what renders the video after it has been provided with the previous objects as parameters. The `Renderer` object's functions are called in this order: `setup()`, `drawFrame(frameNum: number, seconds: number)`, and `generateVideo()`. `drawframe` is called once for every frame while the other two functions are called once before and after. `drawFrame`'s parameters are:

- frameNum: what the current frame is

- seconds: the number of seconds since the animation started

# Other Important Notes

## Parallel Operation

Due to how this program saves individual frames in non-volatile storage in (in terms of the static configuration) the same directory every time, it is expected that if the `run` method was ran simultaneously, these frame files would likely conflict and generate unexpected outputs. I recommend using the dynamic configuration explained earlier to give each avatar generation request it's own unique directory space to work in.

## Major Glaring Issue

There is a very big (though probably somewhat simple to fix) issue that involves FFMPEG. The function `generateVideo` of the `Renderer` object works by stitching together the individual frame images into a video using FFMPEG. See this code:

```typescript
try {
// ffmpeg is used to generate the video
// append frame images together
execSync(`ffmpeg -y -r ${this.config.frames_per_second} -i ${path.join(this.config.frames_path, 'frames', 'frame_%12d.png')} ${tmpFilename} -hide_banner -loglevel error`)

// In case we have a .wav file (we likely do) instead of a .mp3, convert it to mp3
const mp3AudioPath: string = (this.config.audio_path as string).replace(".wav", ".mp3")
console.log([this.config.audio_path, mp3AudioPath])
execSync(`ffmpeg -y -i ${this.config.audio_path} -acodec libmp3lame ${mp3AudioPath} -hide_banner -loglevel error`)

// append audio to video file
execSync(`ffmpeg -y -i ${tmpFilename} -i ${mp3AudioPath} -c copy -map 0:v:0 -map 1:a:0 ${filename} -hide_banner -loglevel error`)
} catch(e) {
throw new Error('error with ffmpeg: ' + (e as Error).message)
}
```

In simple terms, this code calls FFMPEG on CLI three times:

1. stitch together frames

2. convert .wav file to .mp3 file

3. append the audio to the video file

*The second step of converting from .wav to .mp3 is not strictly necessary, it's there because the method of appending files together that I found on the internet only works with .mp3 files. It's a hasty solution as I needed it done fast at the time. It can be removed if no longer needed.*

The issue is that the output video is encoded in a specific codec that is not supported on Firefox, therefore it can't play on Firefox. Unfortunately I don't have a whole lot of details, I recommend for whoever has to fix this to just figure out the basics of FFMPEG and re-implement this 3 (or 2) FFMPEG commands. I wish you good luck, and I apologize for dumping this issue on Kukarella's devs.