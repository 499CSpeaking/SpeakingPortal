
## Documenting progress from the Lazykh repo

Link : https://github.com/carykh/lazykh


Steps:
### Step 1 - Remove the annotations from the script to make it "gentle-friendly" (Runtime: instant)
Open a command prompt, go to the lazykh folder, and run this command. This will create ev_g.txt
```
python3 code/gentleScriptWriter.py --input_file exampleVideo/ev
```

### Step 2 - Calculate phoneme timestamps with 'gentle'. (Runtime: 2 minutes for a 5-min video)
Run this command, which will create ev.json.
```
python3 gentle-final/align.py exampleVideo/ev.wav exampleVideo/ev_g.txt -o exampleVideo/ev.json
```

### Step 3 - Create a simplified timetable (Runtime: 2 seconds for a 5-min video)
Run this command, which will create ev_schedule.json. (This is not my code, it's solely Gentle.)
```
python3 code/scheduler.py --input_file exampleVideo/ev
```

### Step 4 - Render the frames (Runtime: 12 minutes for a 5-min video)
Run this command, which will create thousands of image files. (30 images per second of final video)
```
python3 code/videoDrawer.py --input_file exampleVideo/ev --use_billboards F --jiggly_transitions F
```

### Step 5 - Convert the image sequence to a video and add audio (Runtime: 8 minutes for a 5-min video)
Run this command, which will create the video file and delete all the image files.
```
python3 code/videoFinisher.py --input_file exampleVideo/ev --keep_frames F
```