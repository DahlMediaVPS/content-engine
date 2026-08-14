# Consistency Rules — Why Our Scripts Don't Suck

AI defaults produce crap scripts: vague dialogue, hand-wavy actions, hooks bolted onto nothing. These rules are the engine's spine. Every script generation prompt includes them; every QA pass enforces them (`script-qa-checklist.md` is the enforcement checklist).

## Rule 1 — Desired-outcome backward chaining

Every script starts from the outcome and works backward. Never "write a video about cinnamon" — always:

1. **Desired outcome:** what does the viewer want? (fire in wet woods / younger-looking skin without 7 steps / food that isn't coated in mystery wax)
2. **Steps between:** what are the exact, ordered steps from their current state to that outcome, *in their specific situation*? ("I want to create a fire. What do I do — in this situation, with what's on me?")
3. **Funnel:** which of our three funnels does the outcome route to?

Then the script is written to walk those steps. If the steps can't be enumerated, the script can't be written yet — that's a research gap, not a writing problem.

## Rule 2 — Intentional dialogue

Every line does a job: hooks, debunks, teaches a step, states a mechanism, mirrors the viewer, or bridges. A line that does none of those is cut.

- No filler openers ("hey guys", "so today"), no throat-clearing, no summary endings.
- Mechanisms in one sentence, plain words. If the mechanism takes three sentences, we don't understand it well enough to say it.
- Specificity over adjectives: "100ml, three-month supply" beats "long-lasting" every time.
- Character voice per their bible file — voice violations are consistency failures even when the copy is good.

## Rule 3 — Intentional action

Every scene direction specifies **action + object + visible result**, because the render model will otherwise invent mush.

- ❌ "Greg demonstrates the hack"
- ✅ "Greg pours steaming water over the red apple held in his left hand; a white waxy film visibly lifts and streaks down the apple's skin"

The action must *show the script's claim happening*. If the verdict says "the film lifts off," the frame shows film lifting off. Scripts describe what the camera sees, not what the scene means.

## Rule 4 — Amplify honestly

Amplify-then-collapse anchors ($5k DNA test, Korea injection trips) must be *true extremes*, sourced. We keep receipts. The moment we exaggerate an anchor, we're the creators we debunk.

## Rule 5 — The claims gate

Runs on every script, hardest on Becky (reads as a doctor) and anything detox/skin:

- No disease treatment/cure/prevention claims. Tradition and practice framing for remedies ("used for 3,000 years"), experience framing for testimonials (Greg reports what happened to Greg).
- Real numbers only — member counts, supply claims, actives counts, prices. Unverified = `[VERIFY]` flag in script = blocked from render until resolved.
- Survival techniques must actually work as shown, tested before scripting.
- Full FTC guardrails: `davemedia` skill compliance block applies to every wellness/supplement/skincare script.

## Rule 6 — One video, one job

One hook, one debunk (max), one flip, one funnel CTA. A script trying to do two of anything becomes two scripts.
