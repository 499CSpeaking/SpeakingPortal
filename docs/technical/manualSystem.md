# Manual System
<br>

## Basics
<hr>

### User Input
- takes input via node client page
- input is sent to server after user submits the text
<br>

### Input Reading & Formatting
- input is received by the server and processed in getPhoneme.js
- input is also sent to Kukarella via an API call to retrieve audio
- getPhoneme removes punctuation and delimeters other than space
- input is split into individual word array to be processed by the phoneme generation algo
<br>

### Dictionary
- dictionary is stored as .txt file
- has tab as the delimeter between words and the phonemes
- system reads and formats the dictionary into {key,value} pairs
- key = word, value = array of phonemes
<br>

### Phoneme Generation
- each word in input is processed and a phoneme is assigned to the word
- data structure is same as dictionary
- this system will not rewrite a phoneme for a word if it already exists in the data structure
<br>

### Timestamping
- timestamping is handled in getStamps
- the audio is processed on the server side for increased performance and less client stress
- the system expects wav file audio
- algorithm below
  - get all samples present in the file
  - apply max filter (5 times)
  - apply mean filter (5 times)
  - iterate through filtered samples to generate timestamps
- see comments in getStamps for more details on the algorithm
- currently, the output has some inaccuracy with the final set of stamps produced
  - the current output produces extra stamps due to remnant noise
  - a partial fix for extra timestamps has been introduced, with a slightly increased runtime
  - fix results below
    - max and mean filters are applied multiple times each to reduce noise and increase emphasis on peaks
    - mean filter implementation has been fixed and works better now
    - true_end criteria has been tweaked to follow a more general descending shape to ensure words aren't missed
    - debugging code and load testing code is still present
    - next steps: add a function that uses wordcount to trim the extra values if there are any
<br>

### Performance
- Phoneme Generation: ~1ms/word
- Audio Processing: ~5.4ms/second of audio
- High Load: 4:46 min audio file -> 1200ms, rate of ~4.2ms/second of audio
- Note: Audio processing time has increased due to increased noise filter calls. These filter calls are necessary to help ensure accuracy in timestamping
- Note: these results will vary based on the system being used as the server
  - for example: my laptop was about 2-5x slower than my desktop, which is what I'm basing my results on
<br>

### Algorithm Analysis
- getPhoneme(): O(Unknown)
- getStamps(): O(11n)

## Remaining
<hr>

### Video Generation
- system should take all timestamps and phonemes and generate a video
- phoneme assets should probably be limited to 10 assets max
- for fluid animation, transitional assets should be used
- above isnt a large concern yet, since the system is still under development
- ffmpeg is probably the best option for video processing
- [@Jake](https://github.com/jtyrmn) has a working canvas implementation for the video system
- after processing, video should be sent back to the client for viewing and downloading 
<br>

### Better UI
- this is the lowest priority component
- as our system will be accessed via Kukarella, we don't really have a need to create a fully working webpage UI
- we should still create one to ensure client>server and vice versa stability
- needs:
    - avatar selection section
    - voice selection section
    - video displayed after generation
