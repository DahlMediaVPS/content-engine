# One video, start to finish

## 1. Break down the source (cloud workspace)
- ffprobe the source. Make a 16 kHz mono wav and run `python3 tools/asr.py a.wav out.json` to get word timings.
- Find the cuts with `ffmpeg -vf "select='gt(scene,0.15)',showinfo"`.
- Pull one still from the middle of each shot (12 to 16 of them). Build a numbered grid with PIL, panels 360x640, a black number box top left. The result is SOURCE_GRID_<DISH>.png.
- Write the clip sheet: the source script word for word, split into 8-second clips of 24 words or fewer. Fix any missing method step (time, temperature) and add the standard close.

## 2. Board (Flow, in the character's project, inside the new collection)
Prompt pattern:
"BOARD <CHAR> <DISH>. Rebuild image 1 as the same grid of N numbered panels, same order, same camera angle and framing in every panel. Replace the person in every panel with the person in image 2: <look>. Use the kitchen from image 3 in every panel (<kitchen>). Keep the food exactly: <list>. Remove all captions, words, signs and on-screen text. Keep the panel numbers only. Two hands only per person."
Then QC it, fix it with a text edit if needed, rename it "BOARD <CHAR> <DISH>" and heart it.

## 3. Clips
Pattern: "<CHAR> <DISH> 0N. shots: 0:00 image 1 panel X, <action>, push in. 0:02 hard cut to image 1 panel Y ... says: \"<line>\" Say every word clearly at a calm pace. camera: tight close ups, one push in per shot. Same kitchen as image 1 ... <look>. No on-screen text. ( use image 3 for <name>'s voice only, ... do not copy anything you see in image 3 ) ( no music )"
- Clip 1: the hook, the payoff held to the lens, then the first steps.
- Method clips: 4 to 5 hard cuts each.
- The payoff stays on screen from the reveal to the end.
- Benefit lines go after the reveal.
- CTA clip: one locked angle.
- Follow-gate clip: one locked angle, then the bite.

## 4. Edit (cloud workspace, ffmpeg)
- Download the clips, then ASR each one, plus `silencedetect=n=-35dB:d=0.3`.
- Build segments: trim the lead-in silence, cut gaps over 0.35s, cut repeated phrases, and end any clip whose last word got clipped on the last whole word.
- Concat, then audio: highpass 80, +2.5 dB at 3.2 kHz, gentle compression, loudnorm -14 LUFS, TP -1.5. x264 crf 23, faststart.
- QC: ASR the final cut and read it as a script. Make a contact sheet (fps 1/2.6, tile 8x2) and check the face, the shirt, signs and hands.
- Name it <CHAR>_<DISH>_<YYYY-MM-DD>_v1_phone.mp4. Send it, and write it into Dave's Downloads.

## Timing that works
A 7-clip video comes out at 44 to 47 seconds after trimming. A 6-clip video comes out at about 41 seconds.
