# Reel pipeline

The board is the truth: one video = one row in the Notion **Production Tracker**. Agents never message each other. Each one picks up rows at its Stage, does its job, files to the row's Drive job folder, and moves the Stage on. This repo holds the brief for each lane; the detailed how-to stays in the Notion playbook so there is one copy of it.

## The relay

| Stage on the row | Lane (brief) | Runs | Moves the row to |
|---|---|---|---|
| (none) | `trend-scout` | cloud | adds rows at **In INBOX** |
| In INBOX | `reel-planner` | cloud, when a breakdown PDF exists (desktop otherwise) | **Ready to build** |
| Ready to build | `flow-builder` | desktop browser (Flow) | **Building** → **QC check** |
| QC check | `reel-editor` | desktop or cloud | **Cut sheet sent** / **Needs fixes** |
| Cut sheet sent | Dave watches it | — | **Approved** (other characters are then added at Ready to build) |
| Approved | `publisher` | desktop browser | **Scheduled** → **Posted**, 48h numbers |
| Posted (English) | `spanish-dubber` | cloud | new Spanish row at **Approved** |

Stuck at any point: Stage = Stuck, one line in "Stuck because", tick Needs Dave.

## Where things are

- Production Tracker data source: `collection://74f6b40e-5735-4747-974c-d1f033aeba79`
- Rules every lane reads first: Notion "How We Work — Read This First" and "START HERE — how a video moves"
- Playbook: Notion "AI Video Playbook (Flow)" — page 15 (reverse-engineering), 22 (clone template, approved Nov 2 2026), 14 (format lock), 17 (posting and closes), "Posting Rules"
- Drive: `01 INBOX — To Remake` for sources; `🎬 VIDEO PIPELINE > 04 BUILD FILES` for job folders (copy `_TEMPLATE — copy me`, name `CHARACTER TOPIC MMDD`, five subfolders); `🎭 CHARACTERS > Character > month > week` for finished videos

## The November mission folder

`Drive > CHARACTERS > Greg 1 > 2026-11 November` holds 28 source videos, one per day folder (Nov 8 to 30), each with a Source Breakdown PDF and a Source Pack zip made by ChatGPT, plus the Master Index and the four-avatar cast guide. The planner reads those instead of re-extracting the video. Greg 2, becky and Steve each have a `2026-11 November` folder; day folders are copied into them inside Drive with `copy_file` once the lead video is approved.

## The breakdown tool (fallback)

Only needed when a source has no breakdown PDF yet.

`scripts/reel-breakdown.mjs` does the mechanical part of reverse-engineering with no AI and no credits: shot cuts, a start/middle/end still per shot, a frame every half second, labelled contact sheets, the audio track, and a `shots.json` to fill in. A second command turns the filled-in notes into `breakdown.pdf`. Needs ffmpeg and `npm install` (then `npx playwright install chromium` on a machine that has no Chromium yet).

## Run it

`/reel-pipeline` works the board once: every row sitting at a stage this session can do gets done and moved on. `/reel-pipeline plan` does only the planning stage.

## Hard rules (from Notion, repeated because they matter)

- Nothing posts, sends or spends without Dave's OK. Every finished video is watched before it is approved, and it is scheduled for the next day, never the same hour.
- The lead character's video is approved first; only then is it rebuilt for the other characters.
- Clone shot for shot; swap only the character and the room. Script word for word.
- No captions, social UI or logos carried into generated images.
- One source a day, rebuilt across the characters, one row per character, each in their own room and Flow project.
