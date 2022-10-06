# Wav2Lip Research Notes
[Link to Google Collab](https://j.mp/wav2lip)

[Link to GitHub Page](https://github.com/Rudrabha/Wav2Lip)
<br>
<br>

## Basic info
<hr>

- Wav2Lip is written using python
- The system uses pretrained models (Using LRS2)
- Our own models can be trained, but that seems unnecessary for our purposes
- Images can be used to lipsync to audio with correct mouth animation
- So far all testing has occurred on the Google Collab linked above
- The Google Collab has predefined audio, but allows users to upload their own image
- We could potentially repurpose this during integration

## Limitations
<hr>

- Performance wasn't particularly fast, with my 1 min clip taking roughly 1.5-2 min to generate
- Counterpoint to above: 1 minute of audio is quite a lot of text, which users of kukarella's system might not do. May need clarification on how many words Kukarella's users' inputs have
- Licensing for commercial purposes may be difficult, and would require contacting the original developers
- According to the Google Collab, the audio can roughly be 1 min long, not sure if we can use longer audio or not
- Since users can upload images, there is a chance that wav2lip will fail to find a face in the image, which we would have to account for during integration

## Demo Info
<hr>

- Should be able to do a live demo using the Google Collab
- No setup really needed, since all you need to do is run the section and then upload the image
- A video will then generate at the bottom (hopefully) with the audio and lips synced
- The results of my test are available on the repo under temp/after.mp4 or below:

