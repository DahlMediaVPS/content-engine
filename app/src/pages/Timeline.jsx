import { useState } from 'react';

/*
 * Timeline editor — Phase 3 prototype (layout matches the target NLE:
 * preview + ruler w/ zoom + multi-track clips with per-track visibility/mute/solo).
 * Real import / trim / stitch / export is the Phase 3 build. This establishes the UI.
 */

const SEED_TRACKS = [
  { id: 't1', kind: 'overlay', clips: [{ id: 'o1', label: 'bit of apple cider', start: 0, dur: 5, color: '#1f8a8a' }] },
  { id: 't2', kind: 'video', clips: [
      { id: 'v19', label: 'Video 19', start: 0, dur: 8, color: '#166e6e' },
      { id: 'v12', label: 'Video 12', start: 8, dur: 7, color: '#166e6e' },
      { id: 'v13', label: 'Video 13', start: 15, dur: 6, color: '#166e6e' },
      { id: 'v14', label: 'Video 14', start: 21, dur: 5, color: '#166e6e' }
    ] }
];

export default function Timeline() {
  const [zoom, setZoom] = useState(34); // px per second
  const [sel, setSel] = useState('v19');
  const total = 27;
  const ticks = Array.from({ length: Math.ceil(total / 2) + 1 }, (_, i) => i * 2);
  const fmt = s => `00:${String(s).padStart(2, '0')}`;

  return (
    <div className="wrap" style={{ maxWidth: 1120 }}>
      <div className="h-eyebrow">Editor · Phase 3 preview</div>
      <h1 className="title">Timeline</h1>
      <p className="sub">Import your generated clips, stitch them on a track, trim, and export. This is the layout — editing engine lands in Phase 3.</p>

      {/* preview */}
      <div className="panel" style={{ padding: 18, marginBottom: 14, display: 'grid', placeItems: 'center', background: '#0e1015' }}>
        <div style={{ width: 150, height: 266, borderRadius: 10, background: 'repeating-linear-gradient(135deg,#16181f,#16181f 10px,#191c24 10px,#191c24 20px)', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}>
          <span className="faint" style={{ fontSize: 12 }}>▶ 9:16 preview</span>
        </div>
        <div className="faint mono" style={{ marginTop: 10, fontSize: 12 }}>00:00.00 / 00:{String(total).padStart(2, '0')}.00</div>
      </div>

      {/* toolbar */}
      <div className="panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <button className="btn ghost" title="Split" style={{ padding: '6px 10px' }}>]|[</button>
        <button className="btn ghost" title="Volume" style={{ padding: '6px 10px' }}>🔊</button>
        <button className="btn ghost" title="Download" style={{ padding: '6px 10px' }}>↓</button>
        <button className="btn ghost" title="Delete" style={{ padding: '6px 10px' }}>🗑</button>
        <span className="spacer" style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 12 }}>zoom</span>
        <button className="btn ghost" style={{ padding: '6px 10px' }} onClick={() => setZoom(z => Math.max(14, z - 6))}>－</button>
        <input type="range" min={14} max={70} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: 120 }} />
        <button className="btn ghost" style={{ padding: '6px 10px' }} onClick={() => setZoom(z => Math.min(70, z + 6))}>＋</button>
      </div>

      {/* ruler + tracks */}
      <div className="panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0, overflowX: 'auto' }}>
        <div style={{ minWidth: total * zoom + 60, padding: '10px 0 14px' }}>
          {/* ruler */}
          <div style={{ position: 'relative', height: 20, marginLeft: 60 }}>
            {ticks.map(t => (
              <div key={t} style={{ position: 'absolute', left: t * zoom, top: 0, fontSize: 10, color: 'var(--faint)' }} className="mono">
                {fmt(t)}
              </div>
            ))}
          </div>
          {/* tracks */}
          {SEED_TRACKS.map(track => (
            <div key={track.id} style={{ display: 'flex', alignItems: 'stretch', marginTop: 8 }}>
              <div style={{ width: 60, flex: 'none', display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 6, color: 'var(--faint)', fontSize: 12 }}>
                👁 🔊 <span style={{ fontWeight: 700 }}>S</span>
              </div>
              <div style={{ position: 'relative', height: track.kind === 'overlay' ? 44 : 64, flex: 1, background: 'var(--panel-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                {track.clips.map(c => (
                  <div key={c.id} onClick={() => setSel(c.id)}
                    style={{
                      position: 'absolute', left: c.start * zoom + 2, width: c.dur * zoom - 4, top: 3, bottom: 3,
                      borderRadius: 7, background: c.color, cursor: 'pointer', overflow: 'hidden',
                      boxShadow: sel === c.id ? '0 0 0 2px var(--gold-soft)' : 'inset 0 0 0 1px rgba(255,255,255,.12)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px 8px'
                    }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#eafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.label} <span style={{ opacity: .8, fontWeight: 400 }} className="mono">00:{String(c.dur).padStart(2, '0')}</span>
                    </div>
                    {track.kind === 'video' && <div style={{ height: 10, background: 'linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.15))', borderRadius: 3 }} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="notice" style={{ marginTop: 16 }}>
        <span className="i">🎬</span>
        <div style={{ fontSize: 13.5 }}>
          <b>This is the layout preview.</b> Phase 3 makes the clips real: import from Library, drag to reorder, trim with handles, split, add captions, and export a stitched MP4 — matching the editor you shared.
        </div>
      </div>
    </div>
  );
}
