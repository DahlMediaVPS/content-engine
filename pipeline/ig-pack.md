# Instagram skill pack (third party, MIT) - how we use it

Source: github.com/Jakeschincariol/instagram-agent-skill v1.0.0 (13 skills, one maintainer).
Copied into `.claude/skills/ig-*`. Licence: `pipeline/vendor/instagram-agent-LICENSE`.
Reviewed on install: the .py tools use only the Python standard library, no network, no shell. They read a file and print or write a markdown file.

## Where each skill fits
| Lane | Skill | Use |
|---|---|---|
| trend-scout | `/ig-viral` | Ranks reels by outlier multiple (views / that account's median) and names the hook formula. Feed it the Virlo results (views, creator median, spoken hook via raw_transcript). Output is a ranked list; top picks become In INBOX rows. |
| planner | `/ig-reel` | Hook options and scored hook for our script. Check against the character's script rules first (<=24 words, changes marked). |
| planner / publisher | `/ig-caption` | Lints the first 125 characters of the caption. The full recipe still goes in the description body. |
| publisher | `/ig-dm`, `/ig-comment`, `/ig-reply` | Drafts only. Dave sends. Fixed keywords stay GET GUIDE, GET RECIPE, YES. |
| stories lane (later) | `/ig-story` | Story sequences that lead into the DM funnel. |
| any | `/ig-human` | Strips AI-sounding phrasing from captions and scripts. |
| Sunday | `/ig-plan`, `/ig-audit`, `/ig-profile` | Weekly plan and account checks. |
| optional | `/ig-carousel`, `/ig-repurpose` | Later. |

## Hard rules (override anything in the pack)
- The pack does not scrape or log in. Scraping stays with Virlo and Dave's own browser. Never loop browsing in the background.
- Copy the formula, never the video, script, voice or graphics. Credit the source account in the row.
- Nothing posts, comments, follows or messages without Dave. Drafts only.
- No invented statistics or proof. Leave the gap marked for Dave.
- Cosmetic claims only. AI Dave scripts never name tools ("my system").
- Voice: `pipeline/voice-dave.md` is the voice file. In a local session copy it to `~/.claude/instagram/voice.md`. In the cloud that folder is wiped, so read it from the repo instead.

## Known limits
Hook scoring does not predict winners well. English-only word lists (Spanish dub needs a human check). Treat scores as a tiebreaker.
