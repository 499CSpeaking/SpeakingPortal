# FE-BE Connection Document
<br>
<br>

## Basics
<hr>

- Our example full system (code/main) is setup to allow a user to configure the Voice, Avatar and Aligner, as well as input text to send
- Our client side script (code/main/site/scripts/main.ts) uses this information to then retrieve audio from Kukarella, then sends the text, and audio to the Aligner chosen by the user
    - In most cases, we expect the system to be using Gentle for English
    - Our implementation of the Google Aligner does work, but is not integrated in our main system
        - This system implementation can be found in code/PT2_FE
- After aligning is complete, the system will send the path to the avatar config file (dependent on the users choice in the FE), the path of the audio file to our animation system
- The animation system will then return a path to the video once it is generated, which will be used to stream the video to the user via the FE

## HTML Elements
<hr>

- textarea is used for the input text
- selects with options are used to allow the user to select the Aligner, Voice and Avatar
    - aligner option expected values
        - lower case equivalent of the aligner name ex) Gentle value = gentle
    - voice option expected values
        - we use the same voiceKey options as Kukarella, so any voice from Kukarella can be used in our system, as long as the voiceKey is inserted correctly
    - Avatar option expected values
        - we have two master config file paths, one for each avatar which get passed as the values when the user submits their request
        - currently, our system points to the inputs_male.json/inputs_female.json, found in code/main/demo_files
        - these config files can be moved anywhere, as long as the BE code (code/main/server.ts) is updated to match, as it expects the file to be in code/main/demo_files
- a button is used to submit all the data to the client side script, which handles the rest

## Client Side Script
<hr>

- location: code/main/site/scripts/main.ts
- getOut()
    - this is the main function that is triggered after a user hits the button
    - our character limit was set to 300 because we call on the Kukarella free demo API
    - input from the textarea is accessed via the value property of the element
    - the aligner, voiceKey and avatar values are also accessed similarly to the input
    - fetch request 1: /kuk endpoint
        - this endpoint sends the input text and voiceKey to our BE server code, which sends a request to Kukarella's API
        - returns the path to the audio file saved on our server
    - fetch request 2: /algin endpoint
        - this endpoint sends the audio path and the input text to our BE server code, which sends a request to our aligner
            - We send a request to Gentle via a curl call
        - returns the path to the alignment transcript saved on our server
    - fetch request 3: /animate endpoint
        - this endpoint sends the avatar config path to our BE server code, which starts our video generation system
        - the avatar config file contains the paths of where the video, audio and transcript would/should be located, and as such those paths are not required to be passed
        - returns the path to the video saved on our server
    - after the video is generated, we create a video element and configure it to be able to stream the video to the FE
- getLT()
    - this is the function that is used to test the performance of the system
    - it works similarly to getOut(), but does not take any user input into consideration
    - the text input and audio file used are in code/main/demo_files/textLT.txt and /audioLT.wav
    - the config file path is hardcoded to use code/main/demo_files/inputs_LT.json
    - the time to align, time to generate the video and the total time taken will be displayed procedurally as each process finishes
    - the video created for the performance test will also be viewable after the process is complete

## Server Side Script
<hr>

- location: code/main/server.ts
- our server processes are handled via the express module from node
- /kuk endpoint
    - sends text and voiceKey to Kukarella's API
    - saves audio from Kukarella on the server
    - returns path to the audio file on the server
- /align endpoint
    - sends text and path to audio to the aligner
    - aligner returns the transcript as a string, which is then written to a json file in a set location
    - returns path to transcript file on the server
- /alignLT endpoint
    - similar functionality to /align
- /animate endpoint
    - sends the video path and a config object to our animation system via its run() function
    - animation system will generate a video based on the previously generated files
    - returns path to video file on the server
- /video endpoint
    - streams the video located at code/main/demo_files/tmp/out.mp4 to the FE in 1KB chunks
