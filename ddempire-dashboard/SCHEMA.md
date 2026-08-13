# DDEmpire Studio — JSON Schema

DDEmpire Studio (`studio.html`) is **paste-JSON-in → production-ready-out**. This is the
shape it reads. Your copywriting skills (davemedia, jasons-copywriting) can output straight
into this so a finished script drops into the dashboard with one paste.

## Shape

```json
{
  "brand": "MD Klean",
  "character": "Dr. Becky 4.0",
  "scripts": [
    {
      "id": "001",
      "title": "Signs of a Sluggish Liver",
      "platform": "IG Reels",
      "cta": "FIX",
      "status": "DRAFT",
      "clips": [
        {
          "id": "C1·S1",
          "beat": "HOOK",
          "start": "0:00",
          "end": "0:05",
          "caption": "HOW MANY OF THESE DO YOU HAVE?",
          "dialogue": "This is a sign your liver's backed up...",
          "prompt": "Dr. Becky in a bright home kitchen... 9:16. 15s. Veo 3. ..."
        }
      ]
    }
  ]
}
```

## Fields

| Field | Where | Notes |
|-------|-------|-------|
| `brand` | top | Brand name shown in the header bar. |
| `character` | top | Locked avatar (e.g. `Dr. Becky 4.0`, `Nicole 4.0`). |
| `scripts[]` | top | One entry per script. |
| `id` | script | Script number, e.g. `001`. |
| `title` | script | Script title. |
| `platform` | script | `IG Reels`, `TikTok`, `Shorts`… |
| `cta` | script | Comment keyword — `FIX`, `CASTOR`, `BALANCE`. |
| `status` | script | `DRAFT` · `PENDING` · `POSTED` (drives the status pill). |
| `clips[]` | script | The shots/beats. |
| `id` | clip | Clip·scene label, e.g. `C1·S1`. |
| `beat` | clip | `HOOK`, `FACT-CHECK`, `REMEDY`, `CTA`, `HOLD`… |
| `start` / `end` | clip | `m:ss` — drives the mini-timeline bar widths. |
| `caption` | clip | On-screen power-word caption. |
| `dialogue` | clip | Spoken line (VO). |
| `prompt` | clip | The full Veo 3 / Seedance prompt — the Copy button copies this cell. |

## Rules
- **Everything is optional.** Missing fields just render empty — paste a partial script and it still works.
- The **Copy prompt** button copies the clip's `prompt` verbatim — paste straight into Veo 3.
- Load the built-in example anytime with **Load example**, and **Download** exports the current JSON.

## Handoff from the copywriting skills
Ask the copywriting skill to "output as DDEmpire Studio JSON" and paste the result into the
**Paste JSON** box. That's the whole pipeline: write → paste → copy prompts → generate.
