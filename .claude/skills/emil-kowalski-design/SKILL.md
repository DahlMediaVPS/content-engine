---
name: emil-kowalski-design
description: Craft-level motion, animation, and micro-interaction guidance in the spirit of Emil Kowalski's work — natural easing, purposeful transitions, and interactions that feel physical rather than mechanical. Use whenever adding animation, transitions, hover/press states, page/route transitions, toasts, modals, drawers, or any motion to a UI. Pair with `impeccable-design` (layout/type) and `taste` (reference). Trigger on: animate, transition, motion, hover effect, micro-interaction, "make it feel smooth/alive", framer-motion, CSS animation.
---

# Emil Kowalski Design (Motion & Craft)

Motion is a craft, not decoration. Good animation is felt, not noticed — it makes an interface feel physical, responsive, and alive. Bad animation is slow, linear, bouncy for no reason, or applied everywhere. This skill captures the principles for motion that reads as high-craft.

## First principle: motion must have a reason

Every animation should do one of these — otherwise cut it:
- **Orient** — show where something came from / went to (a drawer slides from the edge it lives on).
- **Give feedback** — confirm a press, a toggle, a success.
- **Direct attention** — draw the eye to what changed.
- **Express personality** — sparingly, in delightful moments.

Motion that decorates without a reason is noise. When unsure, remove it.

## Timing — fast, and matched to distance

- **Micro-interactions** (hover, press, toggle, small state change): 100–200ms.
- **Medium transitions** (dropdown, popover, tooltip, small reveal): 200–300ms.
- **Large transitions** (modal, drawer, page/route, big layout shift): 300–500ms.
- Anything over ~500ms feels sluggish for UI. Reserve longer only for deliberate hero moments.
- **Bigger travel = slightly longer duration.** A full-screen drawer takes longer than a tooltip. Match time to the distance moved so speed feels constant.
- Enter can be a touch slower than exit; exits should feel snappy so the UI never feels like it's holding you up.

## Easing — never linear (except continuous motion)

Linear easing is the clearest tell of amateur motion. Real objects accelerate and decelerate.

- **Default for most UI:** ease-out (fast start, soft settle) — `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.22, 1, 0.36, 1)` feel excellent for entrances.
- **ease-in-out** for elements that move and stop within view.
- **Spring physics** (Framer Motion / React Spring) for anything draggable, gesture-driven, or that should feel physical — tune for a *subtle* settle, not a cartoon bounce. Lower stiffness + higher damping = calm and premium.
- **Linear only** for continuous loops (spinners, marquees) and opacity-only cross-fades.
- Avoid `ease` (the CSS default) for anything meaningful — it's mushy.

## What to animate (and what not to)

- **Cheap, smooth:** `transform` (translate/scale/rotate) and `opacity`. Animate these — they're GPU-accelerated and won't jank.
- **Avoid animating** `width`, `height`, `top/left`, `margin` — they trigger layout and stutter. Use `transform` instead (e.g. scale, or animate a wrapper). For size changes that must animate, consider FLIP or `clip-path`.
- **Combine transform + opacity** for entrances: fade + a small slide (8–16px) or a subtle scale (0.96→1) reads far better than opacity alone.
- Keep movement **small**. A 12px slide feels refined; a 100px fly-in feels gaudy.

## Micro-interaction patterns

- **Buttons:** subtle scale on press (0.97–0.98) with a fast ease-out; color/opacity shift on hover. No bounce.
- **Hover:** quick (120–160ms), gentle — a small lift, background, or underline. Give it a matching exit.
- **Toggles/switches:** spring the knob; snappy and physical.
- **Toasts:** slide + fade in from the edge; auto-dismiss with a slightly faster exit.
- **Modals/dialogs:** overlay fades; panel scales from ~0.96 + fades + tiny upward slide. Exit reverses, faster.
- **Drawers/sheets:** slide from the edge they belong to, spring settle.
- **Lists appearing:** subtle stagger (20–40ms between items) so they cascade — never all at once, never a slow conga line.

## Restraint (the Emil throughline)

- **Not everything moves.** Choose a few key moments. A page where everything animates feels cheap and slow.
- **Consistency:** reuse the same durations and easing curves across the app. Define them as tokens/constants. Inconsistent motion feels buggy.
- **Interruptible:** motion should never block interaction. Users can click through / dismiss mid-animation.
- **Subtlety wins.** If a viewer consciously notices the animation, it's probably too much. The goal is that the UI just feels *good*.

## Accessibility (non-negotiable)

- Respect `prefers-reduced-motion`: reduce or remove non-essential motion, keep essential feedback as a near-instant opacity change.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Reusable tokens (drop-in defaults)

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms;
  --dur-med: 250ms;
  --dur-slow: 400ms;
}
```

Framer Motion spring starting point: `{ type: "spring", stiffness: 260, damping: 30 }` (calm, premium). Increase damping for less bounce.

## Checklist

- [ ] Every animation has one of the four reasons; the rest are cut.
- [ ] Nothing is linear except continuous loops / pure cross-fades.
- [ ] Durations match travel distance; nothing over ~500ms without cause.
- [ ] Only `transform`/`opacity` on the hot path; no animating layout properties.
- [ ] Movement is small and subtle; consistent tokens reused everywhere.
- [ ] `prefers-reduced-motion` handled.
