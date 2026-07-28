---
name: design-review
description: Build → screenshot → fix loop. Use after building or changing any web page or UI to verify it visually before showing the user — captures desktop and mobile screenshots with Playwright, then checks for spacing, overflow, alignment, and responsive issues and fixes them. Trigger on: "screenshot the site", "check it on mobile", "verify the design", "does it look right", or automatically after building any marketing page / landing page / UI with the taste + impeccable-design skills.
---

# Design Review (Playwright verification loop)

Never show the user a page you haven't looked at. This skill runs the closed loop: **build → screenshot desktop + mobile → inspect → fix → re-screenshot** until it's clean.

## When to run

- After building any page or major UI section.
- Before every "here's what I built" hand-off.
- After each refinement pass (so you can show before/after).

## How to run

A ready-made script lives at `scripts/screenshot.mjs`. It captures desktop (1440×900) and mobile (390×844) full-page screenshots.

```bash
# one-time, if deps aren't installed:
npm install

# capture (defaults to http://localhost:3000, writes to .design-screenshots/):
npm run screenshot -- --url http://localhost:5173

# or point at specific routes:
npm run screenshot -- --url http://localhost:3000 --routes /,/services,/about,/contact
```

Do **not** run `playwright install` — this environment ships Chromium at `/opt/pw-browsers` and the config already points there.

Then **Read the generated PNGs** (they land in `.design-screenshots/`) with the Read tool and actually inspect them. Screenshots you don't look at are worthless.

## Alternative: Playwright MCP

If the Playwright MCP server is connected, you can drive the browser interactively instead — navigate, resize the viewport, and screenshot without the script. Use whichever is available; the script is the zero-setup fallback. To add the MCP server, see `README.md` → "Connect the build-and-test tools".

## Inspection checklist (look at every screenshot for these)

**Desktop:**
- [ ] Hero: one clear promise, headline dramatically larger than body, ideally one CTA.
- [ ] Section spacing consistent and generous (not cramped, not uneven).
- [ ] One accent color; text contrast passes AA (no washed-out gray).
- [ ] Content aligned to a grid; symmetric gutters; text column not full-bleed.
- [ ] Clear focal point per section; no wall of same-sized elements.
- [ ] No awkward heading wraps or orphan words.

**Mobile (this is where most defects hide):**
- [ ] **No horizontal overflow** — nothing bleeds off the right edge, no sideways scroll.
- [ ] Nav collapses cleanly (hamburger/menu doesn't clip or overlap).
- [ ] Type scale reduced sensibly; hero still readable, not gigantic.
- [ ] Section padding reduced from desktop; still breathing room.
- [ ] Columns stacked, not squished side-by-side.
- [ ] Tap targets ≥ 44px; buttons full-width or comfortably sized.
- [ ] Images scale within the viewport (`max-width: 100%`).

## Fix loop

1. For each issue, apply a **specific** fix (exact spacing number, `overflow-x` guard, `max-width`, font-size, nav breakpoint).
2. Re-run the screenshot script.
3. Re-inspect. Repeat until the checklist passes on both viewports.
4. When showing the user, present **before/after** screenshots for the fixes you made, and state what changed.

## Common fixes

- **Horizontal overflow on mobile:** find the offending element (fixed width, unwrapped flex row, oversized image, negative margin). Add `max-width: 100%`, allow wrapping, or constrain the container. A quick diagnostic: temporarily outline `* { outline: 1px solid red }` and re-screenshot.
- **Cramped sections:** raise vertical padding to a consistent scale value (96px desktop / 48–64px mobile).
- **Misalignment:** align to the shared grid/max-width container; check symmetric padding.
- **Nav overflow:** introduce the mobile breakpoint, collapse to a menu, verify at 375–390px.
- **Timid hero:** increase headline size (48–96px desktop), cut to one CTA, add whitespace.

Report results honestly: if something still looks off and you couldn't fix it, say so with the screenshot rather than claiming it's done.
