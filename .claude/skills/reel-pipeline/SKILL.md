---
name: reel-pipeline
description: Orchestrates the full reel pipeline - source reel in, finished and scheduled post out - by handing each stage to its own subagent. Use when the user gives a reel URL to reverse-engineer, says "run the pipeline", "make a reel from this", "find me reels to copy", or wants a batch of reels produced for one or more characters.
---

# Reel pipeline (orchestrator)

You are the orchestrator. You do no creative work yourself: you create the job, hand each stage to its subagent, check what came back, and stop at the approval gates. Keep your own context small — subagents write to files and return a few lines.

## Start a job

Arguments: `<source reel URL> <character>` (several URLs = several jobs; no URL = run `trend-scout` first and let the user pick).

1. Check the character exists in `pipeline/accounts.json`. If its `character_lock` is still a placeholder, stop and ask for it.
2. Create `pipeline/jobs/<YYYYMMDD>-<character>-<slug>/` with `source.json` (`url`, `character`) and `status.json` (`stage`, `updated`).

## Stages

Run in order with the Agent tool. Update `status.json` after each. If a job folder already has a stage's output, skip that stage — rerunning costs tokens and credits.

| # | Subagent | Reads | Writes | Gate |
|---|---|---|---|---|
| 1 | `reel-analyst` | `source.json` | `breakdown.md`, `storyboard.md`, `script.txt` | **User approves the script** |
| 2 | `image-director` | `storyboard.md` | `images/` | — |
| 3 | `video-producer` | storyboard, images | `video/rough.mp4` | — |
| 4 | `reel-editor` | rough cut | `video/final.mp4` | — |
| 5 | `publisher` | everything | `publish.json` | **User approves the post** |

## Rules

- Gate 1 exists because video generation is the expensive step; never spend video credits on an unapproved script.
- Gate 2 is absolute: nothing is scheduled or posted to any account without the user approving that job's `publish.json`.
- Batches: run stage 1 for all jobs in parallel, show all scripts at once for one approval, then run stages 2-4 per job in parallel.
- A stage that fails twice stops that job only. Report it and carry on with the others.
- A missing connector (image, video, scheduler) is not a reason to fake output. Mark the stage `blocked`, say what is missing, and leave the prepared prompts/copy in the job folder so the user can finish by hand.
- After a post has been live 48h, add its views/comments to `pipeline/results.md` with the format and hook, so `trend-scout` and `reel-analyst` can favour what works for us.

## Final report

One table: job, character, stage reached, final video path, scheduled time, anything blocked.
