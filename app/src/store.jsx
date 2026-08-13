import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as backend from './backend.js';
import { onAuth } from './supabase.js';

/*
 * DD Empire Studio — local-first store.
 * Phase 1 uses localStorage. Phase 2+ swaps the persistence layer for IndexedDB
 * (video-sized assets exceed localStorage quota) behind this same API.
 *
 * Optional cloud sync: when Supabase is configured AND a user is signed in
 * (backend.isBackendReady()), state is hydrated from the cloud on mount and on
 * auth changes, and writes are mirrored to the backend fire-and-forget. With no
 * Supabase config every backend call is a no-op and behavior is unchanged.
 */

const KEY = 'ddempire_state_v1';

const SEED = {
  characters: [
    {
      id: 'greg', name: 'Greg', version: '1.0', brand: 'MD Klean', status: 'ACTIVE',
      engines: 'Veo 3 · Nano Banana Pro',
      look: 'Late 50s man, grey wavy hair, weathered denim shirt over grey tee, thin cross necklace, warm kitchen. Real skin texture, natural — not polished.',
      elementId: 'greg-1.0', accent: '#5b9dd9', scripts: []
    },
    {
      id: 'becky', name: 'Dr. Becky', version: '4.0', brand: 'MD Klean', status: 'ACTIVE',
      engines: 'Veo 3 · Nano Banana Pro · Kling 3.0',
      look: 'Mid-50s, warm hazel eyes, silver-grey wavy hair, real skin texture, white linen shirt, thin gold chain — natural-medicine practitioner, NOT clinical.',
      elementId: '6c62aea9-6002-4b10-b359-b383e99d47f7', accent: '#c9a227', scripts: ['001']
    },
    {
      id: 'nicole', name: 'Nicole', version: '4.0', brand: 'Glassier Skin', status: 'ACTIVE',
      engines: 'Veo 3 · Nano Banana Pro',
      look: 'Late 30s, dark wavy shoulder-length hair, distinctly green eyes, olive-warm skin, strong brows, natural bare face, lavender-pink gel nails.',
      elementId: 'nicole-4.0', accent: '#b06ab3', scripts: []
    }
  ],
  scripts: [
    {
      id: '001', characterId: 'becky', title: 'Signs of a Sluggish Liver',
      platform: 'IG Reels', cta: 'FIX', status: 'DRAFT',
      clips: [
        { id: 'C1·S1', beat: 'HOOK', start: '0:00', end: '0:05', caption: 'HOW MANY OF THESE DO YOU HAVE?',
          dialogue: "This is a sign your liver's backed up. So is this. And this — tired for no reason, bloated by noon.",
          prompt: 'Dr. Becky in a bright home kitchen, morning window light. 0:00-0:05 HOOK: leans toward lens, right hand points at viewer. Visible pores, no beauty filter. 9:16. 8s. Veo 3. CAPTION: HOW MANY OF THESE DO YOU HAVE?' }
      ]
    }
  ],
  media: []
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return SEED;
}

const StoreCtx = createContext(null);

/* Merge cloud rows into a local array by id — cloud wins for matching ids. */
function mergeById(local, cloud) {
  if (!cloud || !cloud.length) return local;
  const map = new Map();
  for (const item of local) if (item && item.id != null) map.set(item.id, item);
  for (const item of cloud) if (item && item.id != null) map.set(item.id, { ...map.get(item.id), ...item });
  return Array.from(map.values());
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [syncing, setSyncing] = useState(false);
  const [cloud, setCloud] = useState(false); // true when backend is ready (configured + signed in)
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* quota */ }
  }, [state]);

  // Pull cloud data and merge into local state (cloud wins on id collisions).
  const hydrate = async () => {
    const ready = await backend.isBackendReady();
    setCloud(ready);
    if (!ready) return;
    setSyncing(true);
    try {
      const remote = await backend.fetchAll();
      setState(s => ({
        ...s,
        characters: mergeById(s.characters, remote.characters),
        scripts: mergeById(s.scripts, remote.scripts),
        media: mergeById(s.media, remote.media)
      }));
    } catch (_) { /* stay local */ } finally { setSyncing(false); }
  };

  // Push all local data up, then pull cloud down and merge.
  const syncNow = async () => {
    const ready = await backend.isBackendReady();
    setCloud(ready);
    if (!ready) return;
    setSyncing(true);
    try {
      const s = stateRef.current;
      await Promise.allSettled([
        ...s.characters.map(c => backend.upsertCharacter(c)),
        ...s.scripts.map(sc => backend.upsertScript(sc)),
        ...s.media.map(m => backend.upsertMedia(m))
      ]);
      const remote = await backend.fetchAll();
      setState(cur => ({
        ...cur,
        characters: mergeById(cur.characters, remote.characters),
        scripts: mergeById(cur.scripts, remote.scripts),
        media: mergeById(cur.media, remote.media)
      }));
    } catch (_) { /* swallow */ } finally { setSyncing(false); }
  };

  // Hydrate on mount, and re-hydrate whenever auth state changes.
  useEffect(() => {
    hydrate();
    const off = onAuth(() => { hydrate(); });
    return off;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire-and-forget backend write; never throws, never blocks the UI.
  const push = (fn, arg) => { try { Promise.resolve(fn(arg)).catch(() => {}); } catch (_) { /* ignore */ } };

  const api = {
    ...state,
    syncing,
    cloud,
    syncNow,
    addCharacter: (c) => { setState(s => ({ ...s, characters: [...s.characters, c] })); push(backend.upsertCharacter, c); },
    updateCharacter: (id, patch) => setState(s => {
      const next = s.characters.map(c => c.id === id ? { ...c, ...patch } : c);
      const updated = next.find(c => c.id === id);
      if (updated) push(backend.upsertCharacter, updated);
      return { ...s, characters: next };
    }),
    addScript: (sc) => { setState(s => ({ ...s, scripts: [...s.scripts, sc] })); push(backend.upsertScript, sc); },
    importScripts: (arr) => { setState(s => ({ ...s, scripts: [...s.scripts, ...arr] })); arr.forEach(sc => push(backend.upsertScript, sc)); },
    addMedia: (m) => { setState(s => ({ ...s, media: [...s.media, m] })); push(backend.upsertMedia, m); },
    reset: () => setState(SEED),
    replaceAll: (next) => setState(next)
  };
  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
