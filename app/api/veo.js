/*
 * Veo 3 serverless proxy (Vercel Node function) — the SECURE option for hosted deploys.
 *
 * With this deployed and VITE_VEO_PROXY=/api/veo set at build time, the browser never sees
 * the API key: it lives in the GEMINI_API_KEY environment variable on the server.
 *
 * Actions (query param `action`):
 *   start → begin a Veo generation, returns { name }
 *   poll  → check an operation (?op=<name>), returns the operation JSON
 *   file  → stream a generated video back to the client (?uri=<fileUri>)
 *
 * Set GEMINI_API_KEY in your Vercel project settings. Never commit it.
 */

const API = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'veo-3.0-generate-001';

export default async function handler(req, res) {
  const KEY = process.env.GEMINI_API_KEY;
  const action = (req.query && req.query.action) || 'start';

  // Basic CORS for same-origin app; adjust if you host the app elsewhere.
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!KEY) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });

  try {
    if (action === 'start') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const r = await fetch(`${API}/models/${MODEL}:predictLongRunning?key=${KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      return res.status(r.status).send(await r.text());
    }
    if (action === 'poll') {
      const op = req.query.op;
      if (!op) return res.status(400).json({ error: 'missing op' });
      const r = await fetch(`${API}/${op}?key=${KEY}`);
      return res.status(r.status).send(await r.text());
    }
    if (action === 'file') {
      const uri = req.query.uri;
      if (!uri) return res.status(400).json({ error: 'missing uri' });
      const sep = uri.includes('?') ? '&' : '?';
      const r = await fetch(`${uri}${sep}key=${KEY}`);
      if (!r.ok) return res.status(r.status).send(await r.text());
      res.setHeader('Content-Type', r.headers.get('content-type') || 'video/mp4');
      const buf = Buffer.from(await r.arrayBuffer());
      return res.status(200).send(buf);
    }
    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}
