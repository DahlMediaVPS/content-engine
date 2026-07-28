---
name: impeccable-design
description: Execution system for modern web layout, typography, spacing, and color. Use whenever building or restyling any UI, website, landing page, component, or marketing page — it provides the concrete spacing scale, type scale, color rules, and responsive rules that make output look professionally designed instead of flat. Pair with `taste` (picks the reference) and `emil-kowalski-design` (motion). Trigger on: build UI, style a page, CSS, Tailwind, layout, spacing, typography, "make it look polished/professional".
---

# Impeccable Design

The execution layer. `taste` decides *what* to build toward; this skill makes every spacing, type, and color decision precise so the result reads as crafted. Follow these as defaults; deviate only with a reason.

## 1. Spacing — one scale, used religiously

Use a single spacing scale. Every margin, padding, and gap comes from it. Off-scale values are the #1 cause of "misaligned / cramped" feedback.

```
4  8  12  16  24  32  48  64  96  128  160
```

Rules:
- **Section vertical padding:** 80–160px on desktop (96px or 128px are safe defaults), scaling down to 48–64px on mobile. Be consistent — pick one value and reuse it for every section.
- **Related elements** (label→value, icon→text): 4–12px. **Distinct elements** (heading→body): 16–24px. **Section→section:** 96px+.
- **Content max-width:** text columns 640–720px; full layouts 1120–1280px, centered with symmetric gutters. Never let paragraphs run edge-to-edge.
- **Gap over margin** for flex/grid children. One `gap` value beats a dozen ad-hoc margins.
- Proximity communicates grouping. If two things relate, tighten them; if they don't, add real space (not 6px — a full step).

## 2. Typography — big contrast, tight control

- **Type scale (desktop):** body 16–18px · lead 20–22px · h3 24–30px · h2 32–40px · h1/hero 48–96px. Use a clear ratio (~1.25–1.333). Timid scale is the top "AI site" tell — make the hero *big*.
- **Line-height:** 1.1–1.25 for large headings, 1.5–1.65 for body.
- **Line length:** 45–75 characters. Cap body columns at ~70ch.
- **Weight for hierarchy**, not size alone: headings 600–700, body 400–450. Avoid more than 2–3 weights.
- **Letter-spacing:** slightly negative on large headings (-0.01 to -0.03em); default or slightly positive on all-caps labels.
- **Two font families max** — one for display, one for text (or one great family across both). Wire real web fonts with `font-display: swap` and preload the critical ones; don't rely on system fallback in production.
- Left-align body text. Center only short hero copy and isolated CTAs, never paragraphs.

## 3. Color — disciplined neutral scale + one accent

- Build a **neutral ramp** (background, surface, border, muted text, text) and **one accent** used for primary CTAs and key emphasis. That's the whole palette. A second accent almost always cheapens it.
- **Contrast:** body text ≥ 4.5:1, large text ≥ 3:1 (WCAG AA). Verify — low-contrast gray-on-white is a common amateur tell.
- **Borders over shadows** for structure. If using shadows, keep them soft, low-opacity, and consistent (one or two elevation levels max).
- **Gradients:** at most one, used intentionally (usually the hero). Not on every card.
- Support **light and dark** where practical: define tokens once (CSS custom properties) and derive both themes from them.

## 4. Layout & composition

- Establish a visual hierarchy: one clear focal point per section, then supporting elements. The eye should always know where to go first.
- Use a **grid** (12-col or CSS grid) and align to it. Optical alignment beats mechanical when they disagree.
- Alternate section rhythm (tint/no-tint, text-left/text-right) so a long page doesn't read as a uniform stack.
- **Whitespace is structural**, not leftover. Protect it. When a design feels cramped, add space before adding anything else.
- Buttons: one clear primary style, one secondary (ghost/outline). Consistent height, padding, and radius everywhere. Prefer **one** CTA per section.

## 5. Responsive — mobile is not an afterthought

- Design the mobile layout deliberately; don't just let desktop reflow. Reduce section padding, stack columns, shrink the type scale (hero maybe 32–44px).
- Test at 375px (mobile), 768px (tablet), 1440px (desktop) minimum.
- Prevent horizontal overflow: `max-width: 100%` on media, `overflow-x` guarded, no fixed widths wider than the viewport.
- Tap targets ≥ 44px. Mobile nav must not overflow or clip — verify the hamburger/menu at 375px.
- Fluid type with `clamp()` where it helps, but keep the min/max within the scale.

## 6. Detail polish (the last 20%)

- Consistent border-radius across the whole UI (pick one or a small set).
- Consistent icon size and stroke weight; no emoji as UI icons.
- Real focus states (visible focus ring), hover states, and disabled states.
- Optical fixes: nudge icons to align with text baselines; balance uneven visual weight.
- No orphaned single words in headings on desktop; check for awkward wraps.

## Quality checklist (run before showing the user)

- [ ] Every spacing value is on the scale; section padding is consistent.
- [ ] Hero headline is dramatically larger than body; type scale has real contrast.
- [ ] Exactly one accent color; contrast passes AA.
- [ ] One clear focal point and (ideally) one CTA per section.
- [ ] Whitespace is generous; nothing feels cramped.
- [ ] Mobile checked at 375px: no overflow, nav works, type/padding reduced.
- [ ] Fonts wired for production with swap/preload.
- [ ] Verified with `design-review` (Playwright screenshots, desktop + mobile).

When feedback comes in, respond to **specific numbers** ("section spacing 96px", "hero 72px", "fix nav overflow at 375px"), not vibes.
