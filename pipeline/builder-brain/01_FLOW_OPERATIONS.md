# Google Flow: how to drive it (tested Nov 2026)

## Settings
- Boards: Image, Nano Banana 2.1, 9:16 (the grid is 9:16), x1. Costs 0 credits.
- Clips: Video, Ingredients, Omni Flash, 720p, 8s, 9:16, x1, Agent OFF. About 12 to 24 credits each.
- The settings button sits in the composer (bottom right pill). Escape closes it.
- If "Agent" is lit (white), click it off.

## Collections
- Library + creates "Untitled collection" with the name field already selected. Type the name, press Enter.
- Generating while you're inside a collection puts the output in that collection.
- Uploads land at the project root, not in the collection. That's fine: the picker still finds them by name.

## Uploading a local file (the only method that works)
1. Run this JS in the page: patch HTMLInputElement.prototype.click so a file input gets id cap_file, display block, and is appended to the body instead of opening the dialog.
2. Composer + (opens the picker), then "Upload media".
3. Use find to locate the "file-input" ref, then file_upload with paths under the working directory (not /mnt/user-data). You can send several files in one call.
4. Wait about 10 seconds, then navigate to the same URL to reload and clear the patch. Generating with the patch still active trips "unusual activity".

## Attaching ingredients
- Composer + opens the picker. Search matches asset names only. Click the row, then "Add to prompt".
- Characters: use the Characters filter in the picker. Searching a character name can match a board named after the character first, which happened with Greg21.
- Order matters: image 1 = board, image 2 = character, image 3 = voice clip.
- To check what's attached, zoom on the thumbnails above the prompt.

## Writing the prompt
- Insert text with JS (execCommand selectAll, delete, insertText) on the visible contenteditable. Typing is too slow.
- Keep a window.P = {1: ..., 2: ...} dictionary and a setP(n) helper, so each clip is one call.

## The batch loop (one clip about every 90 seconds)
1. Submit (the arrow at the bottom right of the composer).
2. Wait 85 to 90 seconds. Faster submits trip "unusual activity".
3. In list view, the top item's Reuse prompt icon restores all ingredients and the prompt. Click it, then setP(next).

## Failures
- A tile with a warning triangle means the generation failed. Its retry icon reruns it.
- The clip with "takes a bite" plus the follow-gate line has failed twice. Fix: say "She/He finishes the whole line before the bite", or drop the bite.
- Multi-shot clips often drop the last few words or repeat a phrase. Always run the transcript check.

## Downloads (to Dave's Downloads, through the desktop app)
- List-view Download buttons (aria-label "Download") download the original directly. Click them in sequence with a 2.5-second gap.
- Favorite buttons (aria-label "Favorite") on tiles: click them all to heart every clip.
- Clip filenames are Flow's auto-names (for example "Man_eating_mochi_bites_xxxx.mp4"). Map them by timestamp, newest first.
- The board download button sits on the right-side info panel (top item) in list view.

## Editing a board without regenerating it
Open the board and type a text-only change in "What do you want to change?", for example "Change panels 3, 4, 5 and 6 only: ...". Don't attach images to an edit.

## Stitching inside Flow (optional; the Claude cut is the real deliverable)
Open clip 01, + then Add clip, which creates a scene. Rename it "NAME FULL CUT". Click the last clip twice before pressing its +.
