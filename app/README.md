# DD Empire Studio

Your own AI-character + video-production app. React + Vite, local-first, built to run on
**Google Veo 3**. Phase 1 = the working shell (this).

## Run it

```bash
cd app
npm install     # first time
npm run dev     # open the URL it prints (e.g. http://localhost:5173)
```

Build for hosting: `npm run build` → static files in `dist/`.

## What's here (Phase 1)

- **Characters** — locked identities (Greg, Dr. Becky, Nicole) with look, engines, element IDs.
- **Create** — add a new character.
- **Studio** — compose a shot and build a Veo 3 prompt (live generation = Phase 2).
- **Scripts** — paste script JSON → clips + copy-ready prompts (your copywriting pipeline).
- **Timeline** — the editor layout (import/stitch/trim/export engine = Phase 3).
- **Library** — generated assets (fills once Veo 3 is wired).
- **Settings** — local data export/reset; Veo 3 key connects in Phase 2.

Data is local-first (`localStorage` now; IndexedDB when we add video assets). Nothing leaves
your machine. See `../docs/DDEMPIRE-STUDIO-BUILD-PLAN.md` for the full roadmap.

## Roadmap
- **Phase 2** — Veo 3 generation (small serverless function + your Gemini key).
- **Phase 3** — real timeline editor (import clips, trim, split, stitch, export MP4).
- **Phase 4** — package as the one-time-license product.
