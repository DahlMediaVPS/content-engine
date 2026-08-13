/*
 * Google Veo 3 video generation.
 *
 * Two modes:
 *  - Direct (default for local use): the browser calls the Gemini API with the user's own
 *    key from Settings. Simplest; the key is the user's own, on the user's machine.
 *  - Proxy (for hosted/shared deploys): set VITE_VEO_PROXY=/api/veo and the key lives
 *    server-side in the GEMINI_API_KEY env var (see app/api/veo.js). Nothing changes here
 *    except the endpoint.
 *
 * Veo 3 realities: ~8s clips, one optional reference image (image-to-video), generates its
 * own audio. Async: start a long-running operation, then poll until done.
 */

const MODEL = 'veo-3.0-generate-001';
const API = 'https://generativelanguage.googleapis.com/v1beta';
const PROXY = import.meta.env.VITE_VEO_PROXY || '';

export const VEO_KEY_STORAGE = 'ddempire_veo_key';
export const getVeoKey = () => { try { return localStorage.getItem(VEO_KEY_STORAGE) || ''; } catch { return ''; } };
export const setVeoKey = (k) => { try { localStorage.setItem(VEO_KEY_STORAGE, k || ''); } catch { /* ignore */ } };
export const hasVeoKey = () => !!getVeoKey() || !!PROXY;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** Kick off a Veo 3 generation; returns the long-running operation name. */
async function startOperation({ prompt, aspect = '9:16', duration = 8, imageBase64, key }) {
  const parameters = { aspectRatio: aspect, durationSeconds: Number(duration) || 8, sampleCount: 1 };
  const instance = { prompt };
  if (imageBase64) instance.image = { bytesBase64Encoded: imageBase64, mimeType: 'image/jpeg' };
  const body = { instances: [instance], parameters };

  const url = PROXY
    ? `${PROXY}?action=start`
    : `${API}/models/${MODEL}:predictLongRunning?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Veo start failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  const name = json.name || json.operationName;
  if (!name) throw new Error('Veo did not return an operation name.');
  return name;
}

/** Poll a long-running operation until done; returns the raw operation JSON. */
async function pollOperation(name, { key, onProgress, isCancelled }) {
  const url = PROXY
    ? `${PROXY}?action=poll&op=${encodeURIComponent(name)}`
    : `${API}/${name}?key=${encodeURIComponent(key)}`;
  for (let i = 0; i < 90; i++) { // ~90 * 4s = 6 min max
    if (isCancelled && isCancelled()) throw new Error('Cancelled');
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.done) return json;
      onProgress && onProgress(Math.min(0.95, 0.1 + i * 0.03));
    }
    await sleep(4000);
  }
  throw new Error('Veo generation timed out.');
}

/** Turn the operation response into a playable video URL (data or blob URL). */
async function extractVideoUrl(op, key) {
  const resp = op.response || {};
  const samples = resp.generatedSamples || resp.generateVideoResponse?.generatedSamples || resp.videos || [];
  const first = Array.isArray(samples) ? samples[0] : null;
  const video = first?.video || first;
  if (!video) throw new Error('No video in Veo response.');
  if (video.bytesBase64Encoded) return `data:video/mp4;base64,${video.bytesBase64Encoded}`;
  const uri = video.uri || video.fileUri || video.url;
  if (!uri) throw new Error('No video URI in Veo response.');
  // The file URI needs the key to fetch; download and hand back a blob URL for playback.
  const sep = uri.includes('?') ? '&' : '?';
  const fetchUrl = PROXY ? `${PROXY}?action=file&uri=${encodeURIComponent(uri)}` : (key ? `${uri}${sep}key=${encodeURIComponent(key)}` : uri);
  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error(`Fetching video failed (${res.status}).`);
  return URL.createObjectURL(await res.blob());
}

/**
 * Generate one Veo 3 video.
 * @returns {Promise<{url:string}>}
 */
export async function generateVideo({ prompt, aspect, duration, imageBase64, onProgress, isCancelled } = {}) {
  const key = getVeoKey();
  if (!PROXY && !key) throw new Error('No Gemini API key set. Add one in Settings.');
  onProgress && onProgress(0.05);
  const name = await startOperation({ prompt, aspect, duration, imageBase64, key });
  const op = await pollOperation(name, { key, onProgress, isCancelled });
  const url = await extractVideoUrl(op, key);
  onProgress && onProgress(1);
  return { url };
}
