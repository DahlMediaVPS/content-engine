# Content Engine

The operating system for the DD Empire short-form content machine: 10–20 videos/day, 30–60 seconds each, built on the **debunk-flip** strategy — debunk bad holistic advice to earn trust, then bridge that credibility into our own remedies, products, and funnels.

## How it works (one paragraph)

Other creators built audiences on "the industry doesn't want you to know this" content. Most of it is garbage advice. We debunk it on camera — which people believe instantly, because people are more likely to believe a negative — and that makes *those creators* the enemy instead of us. Every debunk ends with a flip: "cinnamon on a banana does nothing — but here's what cinnamon actually does." The flip bridges into our world: a free guide, a members community, and three product lines. We steal the audience the grifters built.

## Repo map

| Directory | What lives here |
|---|---|
| `docs/` | Master plan, debunk-flip playbook, daily production cadence |
| `characters/` | Character bible — one file per persona, locked voice + look |
| `formats/` | Video format specs (structure, beat timing, clip counts) |
| `funnels/` | Product funnel maps — what each video sells and how |
| `hooks/` | The hook backlog — debunk targets and flip angles, scored |
| `engine/` | The machinery: scraper spec, consistency rules, script QA gate |

## The production loop

1. **Scrape** — find what's trending in holistic/remedy/survival content (see `engine/scraper-spec.md`)
2. **Score** — pick debunk targets from `hooks/backlog.md`
3. **Script** — generate through the Fladlien 6-beat structure with a locked character voice
4. **QA** — every script passes `engine/script-qa-checklist.md` before render (this is what stops AI slop)
5. **Render** — Seedance/Higgsfield shot plans per the format spec
6. **Funnel** — every video CTAs into exactly one funnel from `funnels/`

## Related Claude skills

Script generation is driven by skills already installed on this account — this repo is the source of truth they draw from:

- `jasons-copywriting` — the 6-beat Fladlien rebuild framework
- `greg-testimonial-format` — Greg 1.0 porch testimonial format
- `davemedia` — Seedance realism blocks + FTC compliance guardrails
- `video-clone-builder`, `topview-ugc-builder`, `video-prompt-builder` — render-side formats
