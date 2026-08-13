# DD Empire Studio — Build Plan

Your own AI-influencer + video-production app, inspired by the *layout and flow* of the
public `DaanKieft/ai-influencer` project, but **built clean and original**, powered by
**Google Veo 3** and your own prompt skills, sold as a **one-time $49 license (no subscription)**.

---

## ⚖️ Legal footing (why we build our own)

The reference repo (`DaanKieft/ai-influencer`) has **no license** — `package.json` is
`"private": true`, and its docs say *"© Dan Kieft. All rights reserved."* Under copyright
law, no license = **all rights reserved**: we may not copy, fork, or sell his code or his
written prompt guides.

**What's fine:** learning from the *layout, page structure, UX ideas, and feature set* —
those aren't copyrightable. **What's not:** copying his source or docs verbatim.

➡️ So we write **original code** and use **your own prompt IP** (the `davemedia` and
`jasons-copywriting` skills). Legally clean, and it's what you wanted anyway.

---

## 🏗️ Architecture

Same *kind* of app as the reference, rebuilt for your pipeline:

- **React 18 + Vite** single-page web app (fast, local-first).
- **Data: local-first via IndexedDB** (not the reference's fragile `localStorage`, which
  chokes on video-sized assets). This keeps the product **subscription-free** — each buyer's
  data lives on their own machine, nothing to host per user. Optional cloud sync later.
- **One small serverless backend function** (Vercel) that holds the **Veo 3 API key** as a
  secret. This is the only server piece, and it exists because Google requires the key to
  never touch the browser.
- **Generation: Google Veo 3** (Gemini API, model `veo-3.0-generate-001`).

---

## 📄 Pages (mirroring the proven flow, rebranded)

| Page | Purpose |
|------|---------|
| **Landing** | Marketing hero for the product. |
| **Characters** | Your locked avatars — Dr. Becky, Nicole, future characters — with consistency reference (element IDs, look, engines). (His "Influencers".) |
| **Create** | Wizard to add a new character (name, look, references, backstory, generate). |
| **Studio** | Generate video with Veo 3 — dialogue, environment, camera, voice, aspect, duration. |
| **Scripts** | The `studio.html` paste-JSON flow, integrated — write → paste → copy prompt → generate. |
| **Library** | Every generated clip + image, per character. |
| **Timeline** | Import generated clips → stitch on a track → trim/clip → export. *(Pending your screenshot.)* |
| **Settings** | Veo 3 key status, theme, data export/backup. |

---

## 🎬 Veo 3 wiring (from the swap analysis)

- New serverless `api/veo.js`: `start` (calls Veo `predictLongRunning`) + `poll` (checks the
  long-running operation until done). Holds `GEMINI_API_KEY` env var — **never in the repo or chat.**
- Client `veoGenerate.js` with a drop-in `generateVideo(...)` so the Studio UI stays simple.
- **Veo 3 realities to design around:** ~**8-second** clips, **one** reference image
  (image-to-video), Veo **generates its own audio**. Returned video needs to be fetched
  server-side (its URL isn't directly playable) and handed back to the app.

---

## 🗃️ Data model (normalized starting schema)

```
Character { id, name, version, brand, status, look, elementId, engines,
            palette[], referenceImages[], createdAt }
Script    { id, characterId, title, platform, cta, status, clips[] }
Clip      { id, beat, start, end, caption, dialogue, prompt }
Media     { id, characterId, type:'video'|'image', url, sourceScriptId?, createdAt }
TimelineProject { id, name, tracks:[ { clips:[ { mediaId, in, out, order } ] } ] }
```

---

## 🚦 Phased plan — basics first

**Phase 1 — Scaffold + core (the basics).** Vite/React app in the repo, routing, theme,
Characters + Create + Library pages, IndexedDB store, and the Scripts studio integrated.
Seed Dr. Becky & Nicole. *No Veo yet — fully usable shell.*

**Phase 2 — Veo 3 generation.** The `api/veo.js` backend + `veoGenerate.js` + Studio page
wired to generate real clips. *Needs your Gemini API key (kept secure).*

**Phase 3 — Timeline editor.** Import clips → stitch → trim → export. *Needs your screenshot
to match the exact editor you like.*

**Phase 4 — Package the product.** Licensing/gating for the $49 model, polish, docs, deploy.

---

## ✅ What we need from you

1. **Timeline screenshot** — defines Phase 3.
2. **Gemini API key** — for Phase 2 (Google AI Studio → API key → enable billing). Goes in a
   secure env var, never in chat or the repo.
3. **Green light** on Phase 1 to start scaffolding.

---

*Prepared from a 3-agent analysis of the reference repo: frontend/data-model, the
Higgsfield→Veo 3 generation swap, and licensing.*
