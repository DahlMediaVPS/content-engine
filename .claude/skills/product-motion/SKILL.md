---
name: product-motion
description: Build short-form product promo motion (9:16 or 1:1) as deterministic HTML compositions rendered to MP4. Use for product promos, kinetic typography, card/deck reveals, spotlight sweeps, flash cuts, and UI-as-code demos instead of screen recordings. Trigger on: product video, promo, reel, short, motion graphics, kinetic text, animated product shot, "make it move", screen demo.
---

# Product motion (HTML → MP4)

Build motion as a self-contained HTML file that exposes `window.seek(t)`. Every frame is a **pure function of t**: no real-time CSS animations, no `setTimeout`, no random values. The renderer (`scripts/render-promo.mjs`) steps `t` frame by frame and pipes screenshots into ffmpeg.

## Workflow

1. **Beat sheet first.** Write the timeline as named constants before any CSS, e.g. `HOOK_IN = 0.3`, `PRODUCT_RISE = 2.9`, `CTA_IN = 9.6`. Every entrance, color change, and camera move anchors to one of them. Budget length per scene (hook 2–3 s, proof 3–4 s, CTA 2–3 s; ~12 s total for a short).
2. **Copy the sample** at `demo/castor-oil-promo/index.html` as the starting point. Keep the `seek(t)` structure and the `prog / eo3 / backOut / vis` helpers.
3. **Replace placeholders** only with copy and facts the brand can substantiate. No growth, medical, or "clinically proven" claims in cosmetic ads without substantiation.
4. **Render**: `npm run render-promo -- --html <file> --out <file>.mp4 --duration <s>`. Needs `npm install` once and ffmpeg on PATH.
5. **Verify** before showing anyone: extract frames at each beat (`ffmpeg -ss <t> -i out.mp4 -frames:v 1`) and tile them into a contact sheet. Check text clipping at the frame edges, overlaps, and that each beat is readable for at least ~1 s.

## Motion rules (what makes it feel current, not generic)

- **Ramp, don't toggle.** Color and opacity changes ease over 0.3–0.8 s. Hard flips only for deliberate flash cuts.
- **Enter near full scale, small travel.** Use 40–160 px travel with ease-out cubic or back-out (overshoot ~10%). Avoid long slides.
- **Text-as-mask.** Put a moving gradient behind `background-clip: text` on headlines. One sweep per headline.
- **Count up** numbers with `Math.round(eo3(...) * target)`. Only count real numbers.
- **Stagger groups** 0.2–0.25 s apart, card decks deal in with overshoot, stacked with small rotations (±5°).
- **Spotlight sweep**: a radial gradient moving across a dark stage reveals the product. Good for skincare: slow, warm, dewy.
- **Paparazzi flash cuts**: at most 2–3 white flashes of ~60 ms, and only at a deliberate beat.
- **Hero per beat.** One main animation per scene; the rest supports it.
- **Never transform the whole frame** (`scale` or `rotate` on the root container) after layout. It resamples every glyph. Animate children.
- **Fonts**: load explicitly and wait with `document.fonts.ready` (the renderer does). Unloaded fonts fall back silently.
- **Safe zones** for 9:16: keep text out of the top ~250 px and bottom ~340 px (platform UI).

## Screen-demo variant (UI as code)

Instead of recording the store, rebuild the relevant UI in the composition with real copy and real fonts. Drive cursor and state from the beat sheet: cursor targets hold after the press, and each state change is a timed beat. Use this for "how to apply" or routine walkthroughs, not for claims about results.

## Output checklist
- [ ] `seek(t)` is deterministic (run it twice at the same t, same DOM)
- [ ] No clipped text at 1080 px width; headlines fit with 40 px side margins
- [ ] Each beat readable ≥ 1 s; CTA visible ≥ 2 s at the end
- [ ] Copy is placeholder-or-substantiated; no unsupported claims
- [ ] Contact sheet reviewed; MP4 is 1080×1920 (or 1080×1080), 30 fps, H.264
