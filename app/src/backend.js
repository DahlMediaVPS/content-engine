/*
 * Optional cloud backend — a thin data adapter over the fixed Supabase schema.
 *
 * Everything here is a safe no-op when the backend isn't ready (Supabase not
 * configured OR no signed-in user). Callers can fire-and-forget: reads return
 * sensible empty defaults, writes resolve to null. Local camelCase fields are
 * mapped to the DB's snake_case columns.
 */
import { getClient, getUser, isConfigured } from './supabase.js';

/** True only when Supabase is configured AND a user is signed in. */
export async function isBackendReady() {
  if (!isConfigured()) return false;
  const user = await getUser();
  return !!user;
}

async function ctx() {
  const sb = getClient();
  if (!sb) return null;
  const user = await getUser();
  if (!user) return null;
  return { sb, uid: user.id };
}

/* ---- Field mappers: local (camelCase) <-> DB (snake_case) ---- */

const charToRow = (c, uid) => ({
  id: c.id,
  user_id: uid,
  name: c.name ?? null,
  version: c.version ?? null,
  brand: c.brand ?? null,
  status: c.status ?? null,
  look: c.look ?? null,
  engines: c.engines ?? null,
  element_id: c.elementId ?? null,
  accent: c.accent ?? null,
  created_at: c.createdAt ? new Date(c.createdAt).toISOString() : undefined
});

const rowToChar = (r) => ({
  id: r.id,
  name: r.name,
  version: r.version,
  brand: r.brand,
  status: r.status,
  look: r.look,
  engines: r.engines,
  elementId: r.element_id,
  accent: r.accent,
  createdAt: r.created_at ? Date.parse(r.created_at) : undefined,
  scripts: []
});

const scriptToRow = (s, uid) => ({
  id: s.id,
  user_id: uid,
  character_id: s.characterId ?? null,
  title: s.title ?? null,
  platform: s.platform ?? null,
  cta: s.cta ?? null,
  status: s.status ?? null,
  clips: s.clips ?? [],
  created_at: s.createdAt ? new Date(s.createdAt).toISOString() : undefined
});

const rowToScript = (r) => ({
  id: r.id,
  characterId: r.character_id,
  title: r.title,
  platform: r.platform,
  cta: r.cta,
  status: r.status,
  clips: r.clips ?? [],
  createdAt: r.created_at ? Date.parse(r.created_at) : undefined
});

const mediaToRow = (m, uid) => ({
  id: m.id,
  user_id: uid,
  character_id: m.characterId ?? null,
  type: m.type ?? null,
  url: m.url ?? null,
  storage_path: m.storagePath ?? null,
  label: m.label ?? null,
  created_at: m.createdAt ? new Date(m.createdAt).toISOString() : undefined
});

const rowToMedia = (r) => ({
  id: r.id,
  characterId: r.character_id,
  type: r.type,
  url: r.url,
  storagePath: r.storage_path,
  label: r.label,
  createdAt: r.created_at ? Date.parse(r.created_at) : undefined
});

/* Drop keys whose value is undefined so column defaults kick in. */
const clean = (row) => {
  const out = {};
  for (const k in row) if (row[k] !== undefined) out[k] = row[k];
  return out;
};

/* ---- Reads ---- */

/** Pull everything for the signed-in user. Empty arrays when not ready. */
export async function fetchAll() {
  const c = await ctx();
  if (!c) return { characters: [], scripts: [], media: [] };
  try {
    const [ch, sc, md] = await Promise.all([
      c.sb.from('characters').select('*'),
      c.sb.from('scripts').select('*'),
      c.sb.from('media').select('*')
    ]);
    return {
      characters: (ch.data || []).map(rowToChar),
      scripts: (sc.data || []).map(rowToScript),
      media: (md.data || []).map(rowToMedia)
    };
  } catch {
    return { characters: [], scripts: [], media: [] };
  }
}

/* ---- Writes (upserts). Return null when not ready or on error. ---- */

export async function upsertCharacter(character) {
  const c = await ctx();
  if (!c) return null;
  try {
    const { data, error } = await c.sb.from('characters')
      .upsert(clean(charToRow(character, c.uid))).select().single();
    if (error) return null;
    return data;
  } catch { return null; }
}

export async function deleteCharacter(id) {
  const c = await ctx();
  if (!c) return null;
  try {
    await c.sb.from('characters').delete().eq('id', id);
    return true;
  } catch { return null; }
}

export async function upsertScript(script) {
  const c = await ctx();
  if (!c) return null;
  try {
    const { data, error } = await c.sb.from('scripts')
      .upsert(clean(scriptToRow(script, c.uid))).select().single();
    if (error) return null;
    return data;
  } catch { return null; }
}

export async function upsertMedia(media) {
  const c = await ctx();
  if (!c) return null;
  try {
    const { data, error } = await c.sb.from('media')
      .upsert(clean(mediaToRow(media, c.uid))).select().single();
    if (error) return null;
    return data;
  } catch { return null; }
}

/* ---- Timeline project (single per user, keyed by name) ---- */

const TIMELINE_NAME = 'default';

export async function saveTimeline(project) {
  const c = await ctx();
  if (!c) return null;
  try {
    const row = clean({
      user_id: c.uid,
      name: project?.name || TIMELINE_NAME,
      tracks: project?.tracks ?? {},
      track_state: project?.trackState ?? {},
      updated_at: new Date().toISOString()
    });
    const { data, error } = await c.sb.from('timeline_projects')
      .upsert(row, { onConflict: 'user_id,name' }).select().single();
    if (error) return null;
    return data;
  } catch { return null; }
}

export async function loadTimeline() {
  const c = await ctx();
  if (!c) return null;
  try {
    const { data } = await c.sb.from('timeline_projects')
      .select('*').eq('name', TIMELINE_NAME).limit(1).maybeSingle();
    if (!data) return null;
    return { name: data.name, tracks: data.tracks ?? {}, trackState: data.track_state ?? {} };
  } catch { return null; }
}

/* ---- Storage: upload a clip blob, return a usable (signed) URL ---- */

export async function uploadClip(blob, name) {
  const c = await ctx();
  if (!c) return null;
  try {
    const path = `${c.uid}/${name}`;
    const { error } = await c.sb.storage.from('clips')
      .upload(path, blob, { upsert: true, contentType: blob?.type || 'video/mp4' });
    if (error) return null;
    const { data } = await c.sb.storage.from('clips')
      .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
    return data?.signedUrl || null;
  } catch { return null; }
}
