# Affiliate Template Spec

A template is a finished, QA-passed script where the **persuasion spine is locked** and the **identity is a slot**. An affiliate should be able to go from "opened the template" to "posted the video" in under an hour without writing a single persuasive line.

## Anatomy: locked vs. slotted

### Locked (affiliates cannot change)
- **Structure** — clip order, beat timing, hook mechanics. This is the reverse-engineered DNA; changing it is why the original worked and the copy won't.
- **Claims copy** — every line that states what a product/remedy does, every number, every mechanism sentence. Pre-compliant, verbatim. (See `compliance.md` — this is the liability firewall.)
- **CTA logic** — what's offered and how it's framed. Only the link/code inside it is theirs.
- **Scene directions** — action + object + visible result, per `engine/consistency-rules.md` Rule 3. Affiliates render these as written.

### Slots (affiliate fills in)
| Slot | What goes in it | Rules |
|---|---|---|
| `{{YOU}}` | Their face + look, via Veo 3 self-insertion | Appearance block generated from their selfie, then reused verbatim across all their videos |
| `{{VOICE}}` | Their natural phrasing on *non-claim* lines | May reword connective lines to sound like themselves; claim lines stay verbatim |
| `{{VALUE-ADD}}` | One beat (5–10s max) of their own angle — their story, their audience's situation | The ONLY place for original content. Must not introduce new claims |
| `{{CTA-LINK}}` | Their affiliate link / discount code / comment-gate word | Pasted into the pre-built CTA line |
| `{{SETTING}}` | Their kitchen/porch/bathroom instead of ours | Must stay in the format's set register (practical, not studio) |

**The rule of thumb affiliates learn:** *you can change how it sounds; you can't change what it says.*

## Template file format

Every file in `templates/` follows this layout:

```
# Template: <name>
META: funnel · format · length · source (what it was reverse-engineered from)
       proof (source performance / which affiliates it converted for) · difficulty (1–3)
SPINE: the clip-by-clip script — locked lines in plain text, slots in {{brackets}}
SCENES: per-clip Veo 3 scene directions with {{YOU}} and {{SETTING}} slots
USAGE NOTES: what makes this one work, common ways affiliates break it, top-affiliate tips
```

See `templates/_example-detox-cinnamon-debunk-30.md` for a complete worked example.

## The Veo 3 self-insertion workflow (affiliate-facing steps)

1. **One good selfie** — face forward, even light, no filter, shoulders up. This is their character sheet.
2. **Generate their appearance block** — one paragraph describing them (age range, hair, build, default wardrobe) written once, saved, reused verbatim in every prompt afterward. Consistency across videos = a recognizable creator, same rule as our character bibles.
3. **Per clip:** take the template's scene direction, swap `{{YOU}}` for their appearance block and `{{SETTING}}` for their room, generate the clip in Veo 3 (image-to-video from a keyframe of them in the scene where supported).
4. **Voice:** record the dialogue themselves over the clips, or generate with their cloned voice — their real voice converts better with their own audience.
5. **Assemble, caption, post** with `{{CTA-LINK}}` filled and the disclosure line from `compliance.md` in place.

Steps 1–2 happen once. Steps 3–5 are the repeatable loop, and templates arrive with scenes pre-written so step 3 is copy-paste-swap.

## QA before a template ships to affiliates

Templates pass the full `engine/script-qa-checklist.md` **plus**:

- [ ] Every claim line is inside the locked spine, none reachable from a slot
- [ ] `{{VALUE-ADD}}` beat is positioned where it can't break a beat transition (usually post-hook or pre-CTA, never inside the flip steps)
- [ ] Scene directions render correctly with a generic test face before release — if it breaks with a test face, it breaks for 80 people at once
- [ ] Usage notes written: why it works + the top 2 ways to ruin it
