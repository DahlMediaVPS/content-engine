# Content Scraper — Spec

The intake side of the engine: find what's trending in holistic/remedy/skincare/survival content, so the hook backlog never runs dry and we debunk claims *while they're peaking*, not after.

## What it feeds

`hooks/backlog.md` intake queue → scored → scripted. The scraper's job is volume and freshness; scoring stays human/Claude-reviewed because SAT/VIS/FLIP judgment is editorial.

## Implementation: Virlo (already connected)

The Virlo MCP server (short-form intelligence across TikTok/Shorts/Reels) is connected to this Claude account and covers what a custom scraper would take months to build. Use it before writing any custom code.

### Standing monitors (recurring — set up once)

Niche monitors with cadence, one per lane:

1. **Holistic remedies / food hacks** — keywords: natural remedy, food hack, apple wax, detox, castor oil, cinnamon benefits
2. **Skincare routines** — keywords: skin routine, glass skin, korean skincare, skin cycling, anti-aging hack
3. **Survival / preparedness** — keywords: survival hack, bushcraft, water purification, fire starting, SHTF

Each monitor run answers: what claims are spiking, which sounds/formats carry them, who's pushing them.

### One-shot research (as needed)

- `search_keywords` for a specific claim before scripting it (is cinnamon-banana still saturated, or dead?)
- `analyze_video` on top performers of a claim — extract their hook phrasing so our debunk mirrors the exact wording the viewer saw
- `get_emerging_trends` weekly for net-new debunk targets before they saturate

### Reading the data

- Rank by Virlo's weighted virality score, never raw views (≥35 exceptional, 25–35 very strong, 18–25 strong).
- **SAT score mapping:** claim appears in many videos across many creators = high SAT = prime debunk target. A single viral outlier is a lower SAT than a medium-viral swarm.
- Track *rising* claims for debunks (catch the peak) and *evergreen* claims for flips (castor oil never stops).

## Scraper → backlog workflow (daily, morning slot)

1. Pull monitor data + any overnight proposals
2. Extract claim candidates: the *claim*, not the video — dedupe by claim
3. Append to `hooks/backlog.md` intake queue with source notes (top video hook wording, virality score, platform)
4. Score SAT/VIS/FLIP, promote 11+ to ready
5. Retire backlog hooks whose claims have gone cold

## Later: custom scraping layer

Only if Virlo gaps appear (e.g., long-form YouTube remedy content, forum/Reddit claim mining). Keep this spec's interface: whatever scrapes, it outputs *deduped claims with saturation evidence* into the intake queue. Nothing downstream changes.
