/*
 * DDEmpire Dashboard data.
 * Edit this file to add scripts / update statuses & metrics — the dashboard reads from it.
 * Mirrors your Google Sheet "DDEmpire_Content_Tracker".
 */
window.DDEMPIRE_DATA = {
  updated: "2026-08-04",
  brands: [
    { id: "mdklean", name: "MD Klean", avatar: "Dr. Becky 4.0", accent: "#c9a227" },
    { id: "glassier", name: "Glassier Skin", avatar: "Nicole 4.0", accent: "#b06ab3" }
  ],

  // Reference card — character/product locks, CTA keywords, compliance, timing
  reference: {
    elements: [
      { type: "Character", name: "Becky Thomas 4.0", value: "6c62aea9-6002-4b10-b359-b383e99d47f7", note: "Baked into every prompt (Col J). Use Nano Banana Pro, Seedance 2.0, Kling 3.0. NOT Soul V2." },
      { type: "Product", name: "MD Klean Castor Oil", value: "cb4257af-192e-4983-b55f-a68fb0bafc47", note: "Amber glass bottle. Baked into prompts where the bottle appears." },
      { type: "Deprecated", name: "DR BECKY 3.0 (Soul)", value: "ede904c9-d7a1-4968-9589-18448742ecab", note: "DO NOT USE. Retired Soul ID.", dead: true }
    ],
    ctas: [
      { word: "FIX", use: "Liver, sluggish, backed-up content" },
      { word: "CASTOR", use: "All castor oil remedy videos" },
      { word: "BALANCE", use: "Menstrual, hormonal, PCOS content" }
    ],
    // FTC red list — words the avatar must NEVER say (compliance guardrail)
    neverSay: ["cures", "treats", "prevents", "eliminates", "reverses [named disease]", "FDA approved", "guaranteed results"],
    postTiming: ["Late evening 10PM", "Overnight 12–5AM", "3PM"],
    folders: [
      { name: "Content Engine — Reels Production", id: "1avFXpMgJ76_5joVphSdilft9vzD6wwnn" },
      { name: "RULES.md (compliance GREEN/RED)", id: "1Dg2jS7ctjVRyWtp51sAp9eue6LjGo4XliEg1U_wX6Ks" }
    ]
  },

  // Content pipeline + script vault
  scripts: [
    {
      num: "001", title: "Signs of a Sluggish Liver", brand: "mdklean", avatar: "Dr. Becky 4.0",
      format: "3-Clip 45s", platform: "IG Reels", cta: "FIX", status: "POSTED",
      date: "2026-07-04", asset: "20260704-mdklean-sluggish-liver-v1.mp4",
      metrics: { views: null, likes: null, comments: null, shares: null, saves: null },
      clips: [
        { clip: "C1", scene: "S1", ts: "0:00–0:05", beat: "HOOK", caption: "HOW MANY OF THESE DO YOU HAVE?",
          dialogue: "This is a sign your liver's backed up. So is this. And this — tired for no reason, bloated by noon, breaking out like a teenager again.",
          prompt: "Dr. Becky in a bright home kitchen, morning window light from left, white marble counter, small plant, light wood accents. 0:00-0:05 HOOK: Leans toward lens, eyebrows raised, eyes wide, right hand points at viewer, warm urgent friend energy, lips open wide on HOW MANY. She says: \"This is a sign your liver's backed up. So is this. And this — tired for no reason, bloated by noon, breaking out like a teenager again.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter, no plastic skin, no airbrushing. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: HOW MANY OF THESE DO YOU HAVE?" },
        { clip: "C1", scene: "S2", ts: "0:05–0:09", beat: "FACT-CHECK", caption: "DON'T TAKE MY WORD — GOOGLE IT",
          dialogue: "And don't just believe me. Look it up right now — it's all over Google, every health page. Your body's been telling you and nobody connected the dots.",
          prompt: "Dr. Becky in a bright home kitchen, morning window light from left. 0:05-0:09 FACT-CHECK: Both hands raise open-palm toward camera then lower, head nods slowly, direct eye contact, lips open wide on GOOGLE. She says: \"And don't just believe me. Look it up right now — it's all over Google, every health page. Your body's been telling you and nobody connected the dots.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: DON'T TAKE MY WORD — GOOGLE IT" },
        { clip: "C1", scene: "S3", ts: "0:09–0:13", beat: "REMEDY", caption: "WHAT GRANDMA USED",
          dialogue: "Before there was a pill for everything, people used this — a castor oil pack over your liver, forty-five minutes before bed. Used since the ancient Greeks.",
          prompt: "Dr. Becky in a bright home kitchen. She holds the MD Klean castor oil bottle, label facing camera. 0:09-0:13 REMEDY: Right index finger taps the bottle label once, warm knowing smile builds, lips open wide on CASTOR and PACK. She says: \"Before there was a pill for everything, people used this — a castor oil pack over your liver, forty-five minutes before bed. Used since the ancient Greeks.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: WHAT GRANDMA USED" },
        { clip: "C2", scene: "S1", ts: "0:00–0:08", beat: "CTA", caption: "COMMENT FIX + FOLLOW",
          dialogue: "Castor oil's not just for your liver — it's used for everything. Comment FIX and I'll send you the full protocol, the whole list. Follow me first or it won't send.",
          prompt: "Dr. Becky close-up in a bright home kitchen, MD Klean bottle soft focus on counter beside her. 0:00-0:08 CTA: Right index finger points directly at lens holds 2s then lowers, warm urgent expression, mouth opens wide on FIX and FOLLOW, slow nod on follow me first. She says: \"Castor oil's not just for your liver — it's used for everything. Comment FIX and I'll send you the full protocol, the whole list. Follow me first or it won't send.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: COMMENT FIX + FOLLOW" }
      ]
    },
    {
      num: "002", title: "Castor Oil Belly Button Patch", brand: "mdklean", avatar: "Dr. Becky 4.0",
      format: "4-Clip 60s", platform: "IG Reels", cta: "CASTOR", status: "PENDING",
      date: "2026-07-05", asset: "20260705-mdklean-bellybutton-patch-v1.mp4",
      metrics: { views: null, likes: null, comments: null, shares: null, saves: null },
      clips: [
        { clip: "C1", scene: "S1", ts: "0:00–0:04", beat: "HOOK", caption: "WATCH WHAT HAPPENS",
          dialogue: "Apply a drop of this on one of these — and just watch what happens.",
          prompt: "Dr. Becky in a bright home kitchen, morning window light. She holds a round skin-tone navel belly button adhesive patch horizontally at chest level toward camera, white absorbent center clearly visible. 0:00-0:04 HOOK: Right hand holds patch to lens, patch face-forward, eyebrows raised, slight lean forward, lips parted on WATCH. She says: \"Apply a drop of this on one of these — and just watch what happens.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: WATCH WHAT HAPPENS" },
        { clip: "C2", scene: "S1", ts: "0:00–0:05", beat: "MECHANISM", caption: "TOO SIMPLE",
          dialogue: "Most doctors won't tell you this because it is too simple. The ricinoleic acid absorbs through the skin and supports your nervous system while you sleep.",
          prompt: "Dr. Becky in a bright home kitchen. 0:00-0:05 MECHANISM: Slow zoom in toward face, left hand raises one index finger to camera, warm urgent expression, head nods on while you sleep, lips slow on RICINOLEIC ACID. She says: \"Most doctors won't tell you this because it is too simple. The ricinoleic acid absorbs through the skin and supports your nervous system while you sleep.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: TOO SIMPLE" },
        { clip: "C3", scene: "S1", ts: "0:00–0:08", beat: "CTA", caption: "COMMENT CASTOR",
          dialogue: "Comment CASTOR below and I will send you my complete guide — 108 castor oil remedies. But you have to follow me first or it will not send.",
          prompt: "Dr. Becky close-up in a bright home kitchen, MD Klean bottle soft focus on counter beside her. 0:00-0:08 CTA: Right index finger points directly at lens holds 2s then lowers, warm urgent expression, mouth wide on CASTOR and FOLLOW, slow nod on follow me first. She says: \"Comment CASTOR below and I will send you my complete guide — 108 castor oil remedies. But you have to follow me first or it will not send.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: COMMENT CASTOR" }
      ]
    },
    {
      num: "003", title: "Chicken Skin / Keratosis Pilaris", brand: "mdklean", avatar: "Dr. Becky 4.0",
      format: "3-Clip 45s", platform: "IG Reels", cta: "CASTOR", status: "DRAFT",
      date: null, asset: null,
      metrics: { views: null, likes: null, comments: null, shares: null, saves: null },
      clips: [
        { clip: "C1", scene: "S1", ts: "0:00–0:04", beat: "HOOK", caption: "NOT DRY SKIN",
          dialogue: "You see these little bumps on your arms? Most people think it is just dry skin. It is not.",
          prompt: "Dr. Becky in a bright home kitchen, morning window light from left. 0:00-0:04 HOOK: Right hand grabs left forearm and lifts it toward lens showing the forearm skin, eyebrows raised, eyes wide, chin drops slightly, lips part on THESE. She says: \"You see these little bumps on your arms? Most people think it is just dry skin. It is not.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: NOT DRY SKIN" },
        { clip: "C1", scene: "S3", ts: "0:09–0:13", beat: "RECIPE MIX", caption: "THE MIX",
          dialogue: "Two drops of MD Klean castor oil. One drop of coconut oil. Mix them together.",
          prompt: "Dr. Becky's hands over a ceramic mixing bowl on a bright kitchen counter. Left hand tips the MD Klean bottle dropping oil into the bowl, right hand tips a small coconut oil bottle adding one drop. 0:09-0:13 RECIPE MIX: Two drops MD Klean then one drop coconut oil, right index finger stirs slowly, head tilts watching the mix. She says: \"Two drops of MD Klean castor oil. One drop of coconut oil. Mix them together.\" Handheld micro-shake. Visible pores, fine skin grain, natural sebum sheen, no beauty filter. 9:16. 15s. 480p. Seedance 2.0. Natural room tone only. No music. 2-second freeze hold at end. Hard cut. CAPTION: THE MIX" }
      ]
    },
    {
      num: "004", title: "Eczema + Psoriasis", brand: "mdklean", avatar: "Dr. Becky 4.0",
      format: "3-Clip 45s", platform: "IG Reels", cta: "CASTOR", status: "DRAFT",
      date: null, asset: null, metrics: { views: null, likes: null, comments: null, shares: null, saves: null }, clips: []
    },
    {
      num: "005", title: "Dark Spots", brand: "mdklean", avatar: "Dr. Becky 4.0",
      format: "3-Clip 45s", platform: "IG Reels", cta: "CASTOR", status: "DRAFT",
      date: null, asset: null, metrics: { views: null, likes: null, comments: null, shares: null, saves: null }, clips: []
    }
  ]
};
