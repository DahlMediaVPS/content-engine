# Content Marketing Agent Team

A subagent team for planning and producing marketing content, coordinated by an
orchestrator. Just describe what you want in plain English — Claude routes to the
right agent automatically, or you can name one directly.

## The team

| Agent | What it does | Say things like |
|-------|--------------|-----------------|
| **content-orchestrator** | Plans a whole campaign and delegates to the specialists below. Keeps one offer + one voice across everything. | "Launch my offer", "build a full content campaign for X", "I need a landing page + ads + social for my course" |
| **offer-strategist** | Designs the offer, pricing, guarantee, bonuses, positioning. Start here. | "Create an irresistible offer", "what should I charge", "package my service" |
| **copywriter** | Headlines, landing/sales copy, emails, VSL scripts, CTAs. | "Write my sales page", "email sequence", "rewrite this to convert" |
| **blog-writer** | SEO blog posts, articles, guides, lead magnets. | "Write a blog post about…", "content that ranks", "how-to guide" |
| **social-media-manager** | Platform-native posts, hooks, scripts, content calendars. | "IG carousel", "TikTok script", "LinkedIn post", "a week of content" |
| **website-designer** | Landing/sales pages that look premium and convert (uses the design skills). | "Design a landing page", "build my sales page", "redesign the hero" |
| **facebook-ads-specialist** | Meta/FB ad angles, copy, creative briefs, campaign & audience structure. | "Write Facebook ads", "ad angles for my offer", "retargeting ads" |

## How to use it

1. **Fill in [`brand-brief.md`](../../brand-brief.md)** at the repo root — the whole team reads it.
2. **Ask for what you want.** For anything multi-part, the orchestrator will plan it and pull in specialists. For a single asset, name the specialist (e.g. "have the copywriter write my opt-in page").
3. Deliverables are saved as files in the repo so you keep them.

## Recommended flow for a launch
`offer-strategist` (lock the offer) → `copywriter` (core message & page copy) →
`website-designer` (build the page) → `blog-writer` + `social-media-manager` +
`facebook-ads-specialist` (drive traffic to it). The **content-orchestrator** runs this for you.
