# Daily run (unattended)

You are a scheduled run with nobody watching. Be cautious and boring.

## Never
- Post, send a message or email, spend credits, or change anything on a platform.
- Touch tracker rows you did not create, except to read them. Do not touch the old rows from the earlier plan (D1/D2/D3, PICKLE, STORY and similar).
- Commit or push to the repo.
- Invent anything. If Notion or Drive tools are not available, say so as the first line of your report and stop.

## Dry run
If the message that started you says TEST RUN, do steps 1, 2 and the selection part of step 4, write nothing anywhere, and report what you would have done.

## Steps
1. Read `pipeline/README.md`, `pipeline/november-queue.md` and `.claude/agents/reel-planner.md`. Follow the planner brief yourself; do not wait for subagents.
2. Query the Production Tracker for every row that is not Posted: Video, Character, Stage, Owner, Post on, Needs Dave, Stuck because, Notes, Last update.
3. Capacity: count Greg 1 rows at Ready to build or Building. If there are 3 or more, plan nothing today and go to step 5.
4. Plan at most ONE source per run: the first item in the build order that has no tracker row yet. Read its breakdown PDF from the day folder (or the month folder for V24), write the build plan Google Doc in the same folder, and add the tracker row exactly as the planner brief says (Stage = Ready to build, Owner = Flow agent). If the PDF is missing or unreadable, create nothing and report it. Items marked "tick Needs Dave" get that box ticked.
5. Report. This is your final message, plain text, under 150 words, in four lists:
   - Planned today (name, plan link, credit estimate), or why nothing was planned
   - Waiting on Dave (rows with Needs Dave ticked, one line each with the reason)
   - Needs a revision (rows at Needs fixes, with the reason)
   - Stuck or stale (Stuck rows with the one thing needed, for example which login; any row with no stage change for 24 hours)
   Also include one line for anything new in the Notes of a row from the last 24 hours that looks like a snag.
