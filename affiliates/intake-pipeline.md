# Intake Pipeline — Video Library → Template Library

How a raw video (ours, a competitor's, a reference) becomes an affiliate template. This is a batch process: hand over a pile of videos, get back a pile of QA'd templates.

## Hand-off format

Any of these work, roughly in order of usefulness:

1. **Video file or link** + a note on how it performed (views, sales if known)
2. **Transcript** + screenshots of key frames
3. **Transcript alone** (structure and dialogue DNA still extractable; visual anchors get rebuilt from the format spec instead)

Batch them — 10 at a time beats 1 at a time. Tag each with the funnel it should sell for, if it's not obvious.

## The reverse-engineering pass (per video)

Extract the structural DNA (the `video-clone-builder` method):

1. **Format** — length, clip count, speaker count, set register
2. **Beat pattern** — what happens at 0s, 3s, 10s… and *why the viewer keeps watching* at each cut
3. **Dialogue rhythm** — sentence length, where the punch lands, verbatim hook wording (the exact words matter; near-synonyms kill hooks)
4. **Visual anchors** — the shots doing persuasion work (the reveal, the demo result, the product-in-hand)
5. **CTA logic** — what's asked for, when, and what earns the ask

Then classify: which existing format spec is this (`formats/`)? If none fits, it's a candidate **new format** — write the format spec first, then the template. That's how the format library grows from evidence instead of theory.

## The rebuild pass

1. Rewrite the script onto the extracted spine with **our funnel and our claims** — compliant copy from the funnel's copy bank, real numbers only
2. Mark the slots per `template-spec.md` — identity, voice, value-add, CTA, setting
3. Write scene directions for every clip (action + object + visible result) with `{{YOU}}`/`{{SETTING}}` slotted
4. Write usage notes: what made the source work, where affiliates will break it
5. Run template QA (`template-spec.md` checklist, which includes the full script QA gate)
6. File in `templates/` as `<funnel>-<hook>-<format>.md` with META filled in

## Prioritization within a batch

Process in this order — it's a sales tool, not an archive:

1. Videos with **known sales attribution** (anything the top affiliate or the converting 4 ran)
2. Our own top performers by retention/CTA clicks
3. Competitor winners in claims we can flip to our funnels
4. Everything else

## What does NOT become a template

- Videos whose entire performance was a trend sound / stitch context we can't replicate
- Anything whose spine depends on a claim we can't make compliantly — flag it back instead of laundering it
- Formats requiring production an affiliate can't do in Veo 3 + a phone (multi-location, real product macro shoots) — those stay owned-channel formats

## Throughput target

Reverse-engineering is cheap; QA is the bottleneck. Target **5–10 templates per batch session**, every one through full QA. Ten broken templates distributed to 80 affiliates is 800 bad videos with our product attached — the QA gate matters more here than anywhere else in the engine.
