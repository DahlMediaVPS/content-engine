# Deploy & Sell — DD Empire Studio

How to put the app online and sell it as a **one-time $49 license** (no subscription).

---

## 1. Two ways to run Veo 3

**A. Local / personal (simplest).** Each user runs the app and pastes their **own** Gemini
API key in Settings. The key stays in their browser. No backend needed. Best for your own use
and for a "bring your own key" product.

**B. Hosted / shared (secure).** You host the app and hold **one** key server-side so buyers
don't need their own. The included `app/api/veo.js` serverless function keeps the key in the
`GEMINI_API_KEY` env var. Build the app with `VITE_VEO_PROXY=/api/veo` so the browser calls
your function instead of Google directly.

> Get a key: **Google AI Studio → API key**, then enable billing (Veo is paid).

---

## 2. Deploy to Vercel

```bash
cd app
npm install
npm run build          # outputs dist/
```

- Push the repo and import it in Vercel (root = `app/`), **or** run `vercel` from `app/`.
- `vercel.json` already sets the build, output dir, and SPA rewrites (while leaving `/api/*` alone).
- For hosted Veo (option B): in Vercel → Project → Settings → Environment Variables, add
  `GEMINI_API_KEY`, and add a build-time `VITE_VEO_PROXY=/api/veo`.

Any static host works too (Netlify, Cloudflare Pages) — but the `api/veo.js` proxy needs a
serverless platform. On a static-only host, use option A (per-user key).

---

## 3. Turn on licensing

The app ships with a license gate (`src/License.jsx`) that is **off by default** so your own
use is never blocked. To enforce it for buyers, build with:

```
VITE_REQUIRE_LICENSE=true
```

On first run, buyers enter their license key, which is validated and stored locally.

### Wire real validation
Edit `verifyKey()` in `src/License.jsx` to call your seller's license API:

- **Gumroad** — `POST https://api.gumroad.com/v2/licenses/verify` with `product_id` + `license_key`.
- **Lemon Squeezy** — `POST https://api.lemonsqueezy.com/v1/licenses/validate` with the key.

Both return whether the key is valid and how many times it's been activated — good enough to
gate a one-time-license app. Do the call from a tiny serverless function (like `api/veo.js`) so
your product ID/secret isn't exposed, and have `verifyKey()` hit that function.

---

## 4. Sell it

1. Create the product on **Gumroad** or **Lemon Squeezy** as a **one-time purchase** ($49),
   with **license keys enabled**.
2. Deploy the licensed build (steps 2–3).
3. Buyer pays → gets a license key → enters it once → app unlocks on their machine.

No subscriptions, no per-user servers (option A), your margins stay clean.

---

## 5. Checklist before launch
- [ ] Veo generation works end to end (a real key, a test clip).
- [ ] Timeline import → trim → export produces a file.
- [ ] `VITE_REQUIRE_LICENSE=true` build blocks without a key and unlocks with one.
- [ ] `verifyKey()` points at your real license API.
- [ ] Compliance: keep the FTC "never say" guardrails in your scripts (see the dashboard).
