# Claude Code Dashboard

A local monitoring dashboard for your Claude Code projects — **health scores, a log
viewer, and a session browser** for the agents you run. It reads your Claude Code
session data from `~/.claude/projects/` (read-only) and serves a web UI.

## Run it

```bash
cd dashboard
npm install      # first time only (installs express)
npm start        # then open http://localhost:3200
```

Change the port with `PORT=3210 npm start`.

## What you'll see
- **Projects** — each Claude Code project it finds, with a health score.
- **Sessions** — browse past sessions and the subagents each one spawned.
- **Logs** — a viewer over the session/debug logs.

There's also a terminal UI: `./pm-tui.sh`.

## Notes
- It only **reads** local Claude Code logs; it doesn't change your projects or send
  anything anywhere.
- It shows whatever machine it runs on. Run it on the computer where you use Claude
  Code to see your real sessions.

_Sourced from the Apache-2.0 `claude-code-helper` toolkit._
