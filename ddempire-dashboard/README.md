# DDEmpire Command Center

A web dashboard for your DDEmpire content operation — the working version of your
`DDEmpire_Content_Tracker` sheet, as a real UI.

## What it shows
- **KPIs** — scripts, posted / pending / draft, clips ready (per brand).
- **Content Pipeline** — every script with format, platform, CTA keyword, and status.
- **Script Vault** — each script's clips with beat, timing, caption, dialogue, and the
  **full Seedance prompt with a one-click Copy button** (paste straight into Seedance).
- **Reference & Compliance** — character/product element IDs (click to copy), CTA
  keywords, post-timing windows, Drive folder IDs, and the **FTC "never say" red list**.

## Run it
It's a static page — no build, no server needed:

```bash
# just open it
open ddempire-dashboard/index.html          # macOS
# or serve it (any static server)
cd ddempire-dashboard && python3 -m http.server 8000   # then http://localhost:8000
```

## Update the data
Everything lives in **`data.js`** (`window.DDEMPIRE_DATA`). Add a script to the
`scripts` array, update a `status` or `metrics`, or edit the `reference` block — the
dashboard re-reads it on refresh. It mirrors the columns of your Content Tracker sheet,
so keeping the two in sync is copy/paste.

## Brands
Filter by brand with the tabs (All / MD Klean / Glassier Skin). Add brands in the
`brands` array in `data.js`.

## Note
This dashboard is a **tracker** — it organizes what you produce. It surfaces your
existing FTC red list so compliance stays visible while you write; it doesn't loosen it.
