# Reel pipeline

Source reel in, scheduled post out. One orchestrator (`/reel-pipeline`), six stage agents in `.claude/agents/`.

```
trend-scout ─► reel-analyst ─► [you approve script] ─► image-director ─► video-producer ─► reel-editor ─► publisher ─► [you approve post]
```

## Run it

```
/reel-pipeline https://www.instagram.com/reel/XXXX example-character
/reel-pipeline find 5 reels for example-character
```

Each job gets a folder in `pipeline/jobs/` holding the breakdown, storyboard, script, images, video and post copy, so a job can be stopped and resumed without redoing paid steps.

## Set up once

1. Fill in `pipeline/accounts.json` — one entry per character (8 Instagram characters, personal brand, app characters).
2. Auto-DM: in your DM tool, one automation per account — comment contains the `cta_keyword` → send the recipes link + castor oil bonus. Every caption the pipeline writes uses that same keyword, so there is nothing to schedule per post.
3. Scheduler: connect one that has an API/connector for multi-account posting (Publer's API needs its Business plan). Until then the publisher leaves `publish.json` ready to paste.

## Keeping token use down

- Stage agents run on cheaper models (scout and publisher on the smallest, the rest mid-tier); only the orchestrator runs on the session model.
- Agents pass files, not chat. The orchestrator only sees a few lines per stage.
- Finished stages are skipped on resume.
- Do not fan out dozens of agents for this. Six stages per reel is the whole job; batch by running several reels side by side.
