# Builder brain pack

Exported from the video specialist chat on Nov 11 2026. This is how the builder actually works; where any other file in this repo disagrees with it about building, this pack wins.

To make a copy of the builder: create a Claude Project, paste `00_PROJECT_INSTRUCTIONS.md` into its Instructions box, and add files 01 to 05, `tools/` and `examples/` as project files. One chat per video.

## Not in the pack (a copy will be missing these until they are added)
- The three memory files it tells the agent to read: `/areas/character-system.md`, `/areas/video-production-pipeline.md`, `/areas/greg-recipe-pillar.md`.
- The account skills it names (flow-video-build, video-clone-builder, jab-jab-right-hook, susan, greg-recipe-script, reel-video-editing). They work for chats on Dave's account; a student copy needs them exported.
- The speech-to-text model `tools/asr.py` loads from `/home/claude/models/` (sherpa-onnx streaming zipformer, 2023-06-26). A fresh workspace has to download it first.
- The exact JavaScript for the upload patch and the `window.P` / `setP` prompt helper. They are described in 01 but not written out.
- The two source grid images (kept out of the repo; they are stills from other creators' reels).

## Open conflicts with other documents (Dave to settle)
- Words per 8-second clip: 24 here, 20 on the Notion clone template.
- The close: here "Comment RECIPE ... free 135-page recipe e-book". Notion page 17 says never say "free"; Dave's fixed keywords are GET GUIDE, GET RECIPE and YES; the publisher SOP sends an email-gated library, not an e-book.
- Greg 2.1's shirt: "light blue denim" here, dark blue denim over a grey t-shirt on his reference sheet.
