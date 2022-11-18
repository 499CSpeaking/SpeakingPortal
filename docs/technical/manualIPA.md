# Manual IPA System
<br>

## Basics
<hr>

### User Input
- takes input via node client page
- input is sent to server after user submits the text
<br>
### Input Reading & Formatting
- input is received by the server and processed in getPhoneme.js
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
## Remaining
<hr>

### Timestamping
- system should at least have timestamps for when a word starts and ends
- best case would be to timestamp each phoneme
- if above can't be done, averaging out the space between phonenmes is necessary
<br>
### Video Generation
- system should take all timestamps and phonemes and generate a video
- phoneme assets should probably be limited to 10 assets max
- for fluid animation, transitional assets should be used
- above isnt a large concern yet, since the system is still under development
- ffmpeg is probably the best option for video processing
- after processing, video should be sent back to the client for viewing and downloading 
<br>
### Better UI
- this is the lowest priority component
- as our system will be accessed via Kukarella, we don't really have a need to create a fully working webpage UI
- we should still create one to ensure client>server and vice versa stability
- needs:
 - text box
 - avatar selection section
 - voice selection section
 - submit button
 - video displayed after generation
