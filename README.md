# Content Engine — Web Design Killer Setup

A Claude Code skill stack for building marketing sites that look like a studio made them — not like generic AI output. Open this repo in Claude Code (CLI, desktop, or web) and the skills below load automatically.

## What's installed

```
.claude/skills/
  taste/                 # Reference-driven layout — the difference-maker
  impeccable-design/     # Spacing, type, color, responsive execution system
  emil-kowalski-design/  # Motion & micro-interaction craft
  design-review/         # Playwright screenshot → inspect → fix loop
scripts/
  screenshot.mjs         # Desktop + mobile screenshot harness
```

The skills are Markdown instruction files with YAML frontmatter. Claude picks the right one based on the task — e.g. building a landing page triggers `taste` + `impeccable-design`; adding animation triggers `emil-kowalski-design`; and anything visual gets verified through `design-review` before you see it.

> These skills were authored to embody the design philosophies from the "Web Design Killer" guide (reference-first layout, disciplined execution, crafted motion, self-verification). If you have the official/community versions of Emil Kowalski Design, Impeccable Design, or Taste, you can drop them into the matching folders to override — the folder names line up.

## The stack, in order

1. **Design skills** — `emil-kowalski-design`, `impeccable-design`, `taste` teach modern layout, type, spacing, and animation so output stops looking flat.
2. **Taste** — the line between "template" and "studio." It pulls structure and feel from real high-end sites instead of inventing bland layouts.
3. **Build-and-test tools** — Playwright so Claude opens the site in a real browser, screenshots it, and fixes what's broken before you review it. (Figma MCP optional, for the design side.)
4. **The brief** — direct Claude like a creative director (below).
5. **Refine on specifics**, not vibes.

## Connect the build-and-test tools

### Playwright (screenshot self-testing) — works out of the box

```bash
npm install                                   # installs the Playwright npm package
npm run screenshot -- --url http://localhost:3000 --routes /,/services,/about,/contact
```

Screenshots land in `.design-screenshots/` (desktop 1440×900 + mobile 390×844, full page). The script also auto-flags horizontal overflow. Then Claude reads the PNGs and runs the `design-review` checklist.

*In this hosted environment Chromium is pre-provisioned — do not run `playwright install`.*

**Optional — Playwright MCP** (interactive browser control instead of the script). Add to your Claude Code MCP config:

```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
  }
}
```

### Figma MCP (optional, design side)

```json
{
  "mcpServers": {
    "figma": { "command": "npx", "args": ["-y", "figma-developer-mcp", "--stdio"], "env": { "FIGMA_API_KEY": "your-key" } }
  }
}
```

## The brief that gets a premium result

Don't say "build me a website." Direct it:

```
Build a marketing site for [business]. Use the design and taste skills.
Audience: [who]. Feeling: [e.g. clean, premium, trustworthy].
Reference the feel of sites like [1 or 2 you admire].
Pages: home, services, about, contact.
Home sections: hero with one clear promise, 3 benefits, proof, FAQ, one CTA.
Brand: colors [hex], fonts [names].
Build it, then use Playwright to screenshot desktop and mobile and fix any
spacing, overflow, or alignment issues before showing me.
```

## Refine like a designer

First pass is ~80%. Push on specifics:

```
Tighten the hero: more whitespace, larger headline, one button not two.
Make section spacing consistent at 96px. Fix the mobile nav overflow.
Show me before and after screenshots.
```

## When it looks generic (the fixes)

| Symptom | Fix |
| --- | --- |
| Still looks like AI | You gave no reference — name 1–2 sites so `taste` has an anchor. |
| Cramped / misaligned | Give exact spacing numbers + "make it fully responsive," then let `design-review` verify on mobile. |
| Images look fake | Use real custom images, not stock-AI heroes; rebuild the layout around them. |
| Fonts render wrong live | "Wire the web fonts properly for production" (preload + `font-display: swap`), not just in preview. |

**Rule of thumb:** taste comes from the skills you install and the references you give — not from asking nicely.
