---
name: reel-pipeline
description: Works the Notion Production Tracker - picks up every reel row sitting at a stage this session can do, hands it to the right lane agent, and moves it on. Use when the user says "run the pipeline", "work the board", "plan the inbox", "what's stuck", or gives a reel to reverse-engineer.
---

# Reel pipeline (orchestrator)

You are the conductor. You do no creative work yourself. Read `pipeline/README.md` for the relay table and where everything lives.

## One pass

1. Query the Production Tracker for rows not at Posted, grouped by Stage.
2. For each stage this session can do, hand each row to its lane agent with the Agent tool (rows in parallel, up to 4 at a time):
   - In INBOX with a Source → `reel-planner`
   - QC check → `reel-editor` (only if this session can reach the clips)
   - Spanish status = Needs dub → `spanish-dubber`
   - `trend-scout` only when asked, or when fewer than 5 inbox rows have a Source
3. In a cloud session leave planner, builder and publisher rows alone; they are picked up on the desktop.
4. Other characters: when a lead row reaches Approved, add one row per remaining character for the same video at Ready to build, reusing the job folder's script and storyboard (each character in their own room and Flow project). Never before the lead video is approved.
5. Do not touch a row at a stage owned by Dave (Cut sheet sent, anything with Needs Dave ticked). List it instead.

`/reel-pipeline plan` = step 2's first line only. `/reel-pipeline status` = no work, just the report. A reel URL as the argument = add the row at In INBOX, then plan it.

## Rules

- The board is the truth. Every lane ends by updating its row; if an agent returns without having moved its row, that row is not done.
- A failure stops that row only: Stage = Stuck with the reason, carry on with the rest.
- Never fake a missing step. No source video, no login, no connector → Stuck, not a made-up result.
- Nothing is posted, sent or paid for without Dave's OK on that row. Every finished video is watched by Dave (later a VA) before it moves to Approved.
- `reel-planner`, `flow-builder` and `publisher` run on the desktop: they need Drive as a local folder or a logged-in browser.

## Report

Four short lists: moved (row → new stage), waiting on Dave (to watch or approve), needs a revision (Needs fixes, with the reason), stuck (with the one thing needed).
