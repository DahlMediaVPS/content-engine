import { createContext, useContext, useEffect, useState } from 'react';

/*
 * DD Empire Studio — local-first store.
 * Phase 1 uses localStorage. Phase 2+ swaps the persistence layer for IndexedDB
 * (video-sized assets exceed localStorage quota) behind this same API.
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

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* quota */ }
  }, [state]);

  const api = {
    ...state,
    addCharacter: (c) => setState(s => ({ ...s, characters: [...s.characters, c] })),
    updateCharacter: (id, patch) => setState(s => ({ ...s, characters: s.characters.map(c => c.id === id ? { ...c, ...patch } : c) })),
    addScript: (sc) => setState(s => ({ ...s, scripts: [...s.scripts, sc] })),
    importScripts: (arr) => setState(s => ({ ...s, scripts: [...s.scripts, ...arr] })),
    addMedia: (m) => setState(s => ({ ...s, media: [...s.media, m] })),
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
