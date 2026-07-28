---
name: taste
description: Pull structure, layout, and feel from real high-end websites instead of inventing generic layouts. Use this BEFORE writing any marketing-site or landing-page markup — whenever the task is to design, build, or restyle a website, hero, landing page, or marketing page. It is the difference between "looks like a template" and "looks like a studio made it." Trigger on: build a site, landing page, marketing page, hero section, redesign, "make it look premium", "it looks like AI made it".
---

# Taste

Taste is knowing what a good site actually looks like, then building to that reference instead of to a generic mental average. Generic AI websites happen when you invent a layout from scratch. Studio-quality sites happen when you anchor to real references and copy their *structure and proportions* (never their content or exact pixels).

**Always use this skill together with `impeccable-design` (the execution rules) and, for motion, `emil-kowalski-design`.** Taste picks the target; the others make it precise.

## The core method: reference before you build

Never start from a blank mental canvas. Before writing markup:

1. **Name the archetype.** What *kind* of site is this? Dev tool, agency, SaaS, DTC product, portfolio, editorial, fintech. Each has a visual grammar.
2. **Anchor to 1–3 real references.** Use ones the user named. If they gave none, pull from the reference bank below and *tell the user which you're building toward.*
3. **Extract the skeleton, not the skin.** From each reference, name: hero composition, type scale ratio, section rhythm, how they use whitespace, their one accent color, their proof pattern. Write these down before coding.
4. **Build to the skeleton.** Then swap in the user's brand, copy, and content.

If you cannot name a reference, you are about to build something generic. Stop and pick one.

## Reference bank (structural patterns worth stealing)

Study the *composition*, not the brand. These are the patterns that read as "expensive":

- **Linear / Vercel / Resend** — dev/SaaS. Tight type scale, near-black backgrounds or bright white, one saturated accent, generous vertical rhythm, subtle borders (1px, low-contrast), content in a narrow column (~640–1120px max-width). Restraint is the whole move.
- **Stripe** — fintech/SaaS. Confident hero with a single promise, gradient used *once*, real product UI as proof, sections that breathe. Never more than one idea per viewport.
- **Apple** — product/DTC. Huge type, enormous whitespace, one product shot centered and dominant, short declarative copy. Everything else deleted.
- **Emil Kowalski / small studios** — portfolio/agency. Editorial type, asymmetric but balanced, motion that rewards attention, personality in the details.
- **Superlist / Family / Arc** — playful premium. Rounded, warm, custom illustration or real imagery, motion as delight, still disciplined on spacing.

Match the archetype to the reference. A dentist's marketing site should borrow SaaS-grade *discipline* (spacing, one accent, real proof) — not neon gradients.

## Extraction checklist (run this on every reference)

For each reference, answer before you build:

- **Hero:** How many words in the headline? One CTA or two? Is there a visual, and is it product/photo/abstract? Where does the eye land first?
- **Type scale:** Roughly what ratio between body, subhead, headline? (Premium sites use a *big* jump — body 16–18px, hero headline 48–96px. Timid scale = amateur.)
- **Whitespace:** How much air above/below each section? (Premium = a lot. Section padding 80–160px vertical is normal.)
- **Color discipline:** How many colors total? (Usually: one neutral scale + one accent. That's it.)
- **Proof:** Logos? Testimonials? Numbers? Screenshots? Where does trust get established?
- **Rhythm:** Do sections alternate (text-left/text-right, tint/no-tint) or stack uniformly?

## Rules that separate taste from template

1. **One idea per section.** If a section says two things, split it or cut one.
2. **One accent color.** A single saturated color against a disciplined neutral scale. Two accents already looks cheaper.
3. **Big type contrast.** The hero headline should be dramatically larger than body. Small timid headlines are the #1 tell of AI-generated sites.
4. **Real content shapes.** Write realistic headline/benefit copy, not "Lorem" or "Your headline here." Layout only looks right when the copy is real length.
5. **Restraint over decoration.** When unsure, remove. Borders over shadows, one gradient not five, no drop-shadow on everything.
6. **Whitespace is the budget.** Amateurs fill space; studios protect it. When a section feels off, the fix is usually *more* space, not more stuff.
7. **Proof is not optional.** Every marketing site needs at least one credible proof element (logos, testimonial, metric, real screenshot). Generic sites skip it.

## Anti-patterns (the "looks like AI" tells)

- Three identical feature cards with a generic icon, a bold word, and two lines of gray text — evenly spaced, no hierarchy.
- Purple-to-blue gradient hero with a centered headline and two buttons.
- Every section the same height with the same padding and a centered heading.
- Emoji as feature icons.
- Timid type: 32px "hero" headline, 16px everything else, no scale.
- Rounded cards with drop shadows on a light-gray background, repeated forever.
- Stock-abstract "team collaboration" imagery.

If your draft contains any of these, you skipped the reference step. Go back to the extraction checklist.

## Workflow

1. Identify archetype → pick references → run the extraction checklist and state your findings.
2. Load `impeccable-design` for the spacing/type/color execution system.
3. Build the skeleton to the reference proportions, then fill with the user's real brand and copy.
4. Verify with the `design-review` skill (Playwright screenshots, desktop + mobile) before showing the user.
5. Refine on specifics, not vibes — exact spacing numbers, one concrete fix at a time.
