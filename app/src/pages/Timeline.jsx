import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore, genId } from '../store.jsx';

/*
 * Timeline editor — Phase 3.
 * A functional single-file NLE: import clips from the Library, stitch them on a
 * video track (+ optional overlay/caption track), select / reorder / trim / split /
 * delete, preview the stitched sequence with a real <video>, and best-effort export
 * a stitched .webm via canvas.captureStream + MediaRecorder.
 *
 * Timeline state persists to localStorage['ddempire_timeline_v1'] (its own key —
 * the shared store in store.jsx is used read-only for media import).
 */

const TL_KEY = 'ddempire_timeline_v1';
const GUTTER = 66;             // left track-gutter width (px)
const TEAL = '#166e6e';        // video clip color
const TEAL_HI = '#1f8a8a';     // overlay clip color
const SAMPLE_COLORS = ['#166e6e', '#1a7d84', '#13707a'];

// ---- pure helpers -------------------------------------------------------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function fmtClock(s) {
  s = Math.max(0, s || 0);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const cc = Math.floor((s - Math.floor(s)) * 100);
  const p = n => String(n).padStart(2, '0');
  return `${p(m)}:${p(sec)}.${p(cc)}`;
}
function fmtTick(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const p = n => String(n).padStart(2, '0');
  return `${p(m)}:${p(sec)}`;
}
function fmtDur(s) {
  const sec = Math.round(s || 0);
  return `00:${String(sec).padStart(2, '0')}`;
}
// find the clip (from a laid-out sequence) active at time t
function findActive(arr, t) {
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    if (t >= c.startTime && t < c.startTime + c.dur) return c;
  }
  if (arr.length && t >= arr[arr.length - 1].startTime) return arr[arr.length - 1];
  return null;
}

function loadTL() {
  try {
    const raw = localStorage.getItem(TL_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.tracks) return p;
    }
  } catch (_) { /* ignore */ }
  return null;
}

export default function Timeline() {
  const { media } = useStore();
  const saved = useMemo(loadTL, []);

  const [tracks, setTracks] = useState(saved?.tracks || { video: [], overlay: [] });
  const [trackState, setTrackState] = useState(saved?.trackState || {
    video: { hidden: false, muted: false, solo: false },
    overlay: { hidden: false, muted: false, solo: false }
  });

  const [zoom, setZoom] = useState(34);      // px per second
  const [sel, setSel] = useState(null);      // selected clip id
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [note, setNote] = useState('');

  const videoRef = useRef(null);
  const rulerRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const lastTsRef = useRef(0);

  // ---- layout: lay each track's clips end-to-end, compute start times -----
  const layout = useMemo(() => {
    const build = arr => {
      let t = 0;
      return arr.map(c => {
        const dur = Math.max(0.1, (c.out ?? 0) - (c.in ?? 0));
        const startTime = t;
        t += dur;
        return { ...c, dur, startTime };
      });
    };
    const v = build(tracks.video);
    const o = build(tracks.overlay);
    const totalV = v.reduce((a, c) => a + c.dur, 0);
    const totalO = o.reduce((a, c) => a + c.dur, 0);
    return { v, o, total: Math.max(totalV, totalO, 0) };
  }, [tracks]);

  // keep a ref of the latest layout for animation/export loops (stale-closure safe)
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // ---- persist ------------------------------------------------------------
  useEffect(() => {
    try { localStorage.setItem(TL_KEY, JSON.stringify({ tracks, trackState })); } catch (_) { /* quota */ }
  }, [tracks, trackState]);

  // clamp playhead when total shrinks
  useEffect(() => {
    if (playhead > layout.total) setPlayhead(layout.total);
  }, [layout.total]); // eslint-disable-line

  // ---- playback clock (rAF) — drives playhead during normal preview -------
  useEffect(() => {
    if (!playing || exporting) return;
    lastTsRef.current = performance.now();
    let raf;
    const loop = ts => {
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setPlayhead(p => {
        let np = p + dt;
        if (np >= layoutRef.current.total) { np = layoutRef.current.total; setPlaying(false); }
        return np;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, exporting]);

  // ---- sync the <video> element to the playhead ---------------------------
  const anySolo = trackState.video.solo || trackState.overlay.solo;
  const videoMuted = trackState.video.muted || (anySolo && !trackState.video.solo) || trackState.video.hidden;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const active = findActive(layout.v, playhead);
    if (active && active.src && !trackState.video.hidden) {
      if (v.getAttribute('data-clip') !== active.id) {
        v.setAttribute('data-clip', active.id);
        v.src = active.src;
      }
      const target = active.in + (playhead - active.startTime);
      if (isFinite(target) && Math.abs(v.currentTime - target) > 0.3) {
        try { v.currentTime = Math.max(0, target); } catch (_) { /* not seekable yet */ }
      }
      v.muted = videoMuted;
      if (playing || exporting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
      else if (!v.paused) v.pause();
    } else {
      v.removeAttribute('data-clip');
      if (!v.paused) v.pause();
    }
  }, [playhead, playing, exporting, layout, videoMuted, trackState.video.hidden]);

  // ---- clip location / mutation helpers -----------------------------------
  function locate(id) {
    for (const track of ['video', 'overlay']) {
      const index = tracks[track].findIndex(c => c.id === id);
      if (index >= 0) return { track, index, clip: tracks[track][index] };
    }
    return null;
  }
  function updateClip(track, id, patch) {
    setTracks(t => ({ ...t, [track]: t[track].map(c => c.id === id ? { ...c, ...patch } : c) }));
  }
  function moveClip(dir) {
    const info = locate(sel);
    if (!info) return;
    const { track, index } = info;
    const j = index + dir;
    if (j < 0 || j >= tracks[track].length) return;
    setTracks(t => {
      const arr = [...t[track]];
      const [c] = arr.splice(index, 1);
      arr.splice(j, 0, c);
      return { ...t, [track]: arr };
    });
  }
  function deleteSelected() {
    const info = locate(sel);
    if (!info) return;
    setTracks(t => ({ ...t, [info.track]: t[info.track].filter(c => c.id !== sel) }));
    setSel(null);
  }
  function splitSelected() {
    const info = locate(sel);
    if (!info) return;
    const { track, index, clip } = info;
    const laidArr = track === 'video' ? layout.v : layout.o;
    const laid = laidArr[index];
    if (!laid) return;
    const localT = playhead - laid.startTime;
    if (localT <= 0.05 || localT >= laid.dur - 0.05) {
      setNote('Move the playhead inside the selected clip to split it.');
      return;
    }
    const cut = clip.in + localT; // effective time maps 1:1 to source time
    const a = { ...clip, id: genId(), out: cut };
    const b = { ...clip, id: genId(), in: cut };
    setTracks(t => {
      const arr = [...t[track]];
      arr.splice(index, 1, a, b);
      return { ...t, [track]: arr };
    });
    setSel(a.id);
  }

  // ---- adding clips -------------------------------------------------------
  const videoMedia = (media || []).filter(m => m.type === 'video');

  function importFromLibrary() {
    if (!videoMedia.length) { setNote('No video media in the Library yet. Add sample clips to try the editor.'); return; }
    const added = videoMedia.map((m, i) => ({
      id: genId(), mediaId: m.id, label: m.label || `Clip ${i + 1}`,
      src: m.url, color: TEAL, srcDur: 8, in: 0, out: 8
    }));
    setTracks(t => ({ ...t, video: [...t.video, ...added] }));
    added.forEach(c => loadMeta(c.id, c.src));
    setNote(`Imported ${added.length} clip${added.length > 1 ? 's' : ''} from the Library.`);
  }

  // read real duration of a source video and patch the clip's out/srcDur
  function loadMeta(id, url) {
    try {
      const el = document.createElement('video');
      el.preload = 'metadata';
      el.onloadedmetadata = () => {
        const d = el.duration;
        if (isFinite(d) && d > 0) {
          setTracks(t => ({
            ...t,
            video: t.video.map(c => c.id === id ? { ...c, srcDur: d, out: Math.min(c.out || d, d) } : c)
          }));
        }
      };
      el.onerror = () => {};
      el.src = url;
    } catch (_) { /* ignore */ }
  }

  function addSampleClips() {
    const durs = [6, 8, 5];
    const added = durs.map((d, i) => ({
      id: genId(), mediaId: null, label: `Sample ${i + 1}`,
      color: SAMPLE_COLORS[i % SAMPLE_COLORS.length], src: null,
      srcDur: d, in: 0, out: d
    }));
    setTracks(t => ({ ...t, video: [...t.video, ...added] }));
    setNote('Added 3 sample clips. Placeholder clips have no source video, so preview shows a color card.');
  }

  function addCaption() {
    const cap = { id: genId(), mediaId: null, label: 'Caption text', color: TEAL_HI, src: null, srcDur: 4, in: 0, out: 4, caption: true };
    setTracks(t => ({ ...t, overlay: [...t.overlay, cap] }));
    setSel(cap.id);
  }

  // ---- playhead dragging (ruler + handle) ---------------------------------
  function beginPlayheadDrag(e) {
    e.preventDefault();
    setPlaying(false);
    const move = ev => {
      const rect = rulerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const tt = clamp((ev.clientX - rect.left) / zoom, 0, layoutRef.current.total);
      setPlayhead(tt);
    };
    move(e);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  // ---- trim handle dragging -----------------------------------------------
  function beginTrim(e, track, id, side) {
    e.preventDefault();
    e.stopPropagation();
    const info = locate(id);
    if (!info) return;
    const startX = e.clientX;
    const startIn = info.clip.in ?? 0;
    const startOut = info.clip.out ?? 0;
    const srcDur = info.clip.srcDur ?? startOut;
    const move = ev => {
      const dx = (ev.clientX - startX) / zoom;
      setTracks(t => ({
        ...t,
        [track]: t[track].map(c => {
          if (c.id !== id) return c;
          if (side === 'left') return { ...c, in: clamp(startIn + dx, 0, (c.out ?? startOut) - 0.2) };
          return { ...c, out: clamp(startOut + dx, (c.in ?? startIn) + 0.2, srcDur) };
        })
      }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  // ---- transport ----------------------------------------------------------
  function togglePlay() {
    if (playing) { setPlaying(false); return; }
    if (layout.total < 0.05) return;
    if (playhead >= layout.total - 0.02) setPlayhead(0);
    setPlaying(true);
  }

  // ---- export -------------------------------------------------------------
  function download(blob, name) {
    try {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
    } catch (_) { /* ignore */ }
  }
  function exportJSON(reason) {
    try {
      const blob = new Blob([JSON.stringify({ tracks, trackState }, null, 2)], { type: 'application/json' });
      download(blob, 'timeline-project.json');
    } catch (_) { /* ignore */ }
    setNote((reason ? reason + ' ' : '') + 'Exported the timeline project as JSON instead.');
  }

  function exportVideo() {
    const L = layoutRef.current;
    if (!L || L.total < 0.1) { setNote('Add clips to the timeline before exporting.'); return; }
    let rec = null;
    try {
      const canvas = exportCanvasRef.current;
      const mrOk = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
      const csOk = canvas && typeof canvas.captureStream === 'function';
      if (!mrOk || !csOk) { exportJSON('Recording is not supported in this browser.'); return; }

      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30);
      let mime = '';
      ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].forEach(m => {
        if (!mime && window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) mime = m;
      });
      rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: mime || 'video/webm' });
          download(blob, 'timeline-export.webm');
          setNote('Export complete — downloaded timeline-export.webm (video only, no audio track).');
        } catch (_) { setNote('Export finished but could not save the file.'); }
        setExporting(false);
        setPlaying(false);
      };

      setExporting(true);
      setPlaying(true);
      setPlayhead(0);
      setNote('Recording preview… playing the timeline through to the end.');
      rec.start();

      let t = 0;
      let last = performance.now();
      const v = videoRef.current;
      const draw = () => {
        const now = performance.now();
        t += (now - last) / 1000;
        last = now;
        const cur = layoutRef.current;
        ctx.fillStyle = '#0b0c0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const av = findActive(cur.v, t);
        if (av && av.src && v && v.readyState >= 2) {
          try { ctx.drawImage(v, 0, 0, canvas.width, canvas.height); } catch (_) { /* tainted/not ready */ }
        } else if (av) {
          ctx.fillStyle = av.color || TEAL;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#eafafa';
          ctx.font = 'bold 22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(av.label || '', canvas.width / 2, canvas.height / 2);
        }
        const ao = findActive(cur.o, t);
        if (ao && !trackState.overlay.hidden) {
          ctx.fillStyle = 'rgba(0,0,0,.55)';
          ctx.fillRect(0, canvas.height - 70, canvas.width, 52);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ao.label || '', canvas.width / 2, canvas.height - 38);
        }
        setPlayhead(Math.min(t, cur.total));
        if (t >= cur.total) {
          try { rec.stop(); } catch (_) { setExporting(false); setPlaying(false); }
          return;
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    } catch (e) {
      setExporting(false);
      setPlaying(false);
      try { if (rec && rec.state === 'recording') rec.stop(); } catch (_) { /* ignore */ }
      exportJSON('Recording failed to start.');
    }
  }

  // ---- derived render values ---------------------------------------------
  const activeV = findActive(layout.v, playhead);
  const activeO = findActive(layout.o, playhead);
  const selInfo = sel ? locate(sel) : null;
  const isEmpty = tracks.video.length === 0 && tracks.overlay.length === 0;
  const ticks = [];
  for (let s = 0; s <= Math.max(layout.total, 2); s += 2) ticks.push(s);
  const laneW = Math.max(layout.total * zoom, 200);

  const gutterBtn = (track, key, label) => {
    const on = trackState[track][key];
    return (
      <button
        onClick={() => setTrackState(ts => ({ ...ts, [track]: { ...ts[track], [key]: !ts[track][key] } }))}
        title={key}
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px 3px',
          fontSize: 13, color: on ? 'var(--gold-soft)' : 'var(--faint)',
          fontWeight: key === 'solo' ? 700 : 400, opacity: on ? 1 : 0.7
        }}
      >{label}</button>
    );
  };

  const renderTrack = (trackKey, laid, kind) => {
    const st = trackState[trackKey];
    return (
      <div style={{ display: 'flex', alignItems: 'stretch', marginTop: 8 }}>
        <div style={{ width: GUTTER, flex: 'none', display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', paddingLeft: 4 }}>
          {gutterBtn(trackKey, 'hidden', st.hidden ? '🚫' : '👁')}
          {gutterBtn(trackKey, 'muted', st.muted ? '🔇' : '🔊')}
          {gutterBtn(trackKey, 'solo', 'S')}
        </div>
        <div style={{
          position: 'relative', height: kind === 'overlay' ? 44 : 64, flex: 1,
          background: 'var(--panel-2)', borderRadius: 8, border: '1px solid var(--line)',
          opacity: st.hidden ? 0.4 : 1
        }}>
          {laid.length === 0 && (
            <div className="faint" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11 }}>
              {kind === 'overlay' ? 'overlay / caption track' : 'video track'}
            </div>
          )}
          {laid.map(c => {
            const selected = sel === c.id;
            return (
              <div key={c.id} onClick={() => setSel(c.id)}
                style={{
                  position: 'absolute', left: c.startTime * zoom + 2, width: Math.max(6, c.dur * zoom - 4),
                  top: 3, bottom: 3, borderRadius: 7, background: c.color || (kind === 'overlay' ? TEAL_HI : TEAL),
                  cursor: 'pointer', overflow: 'hidden',
                  boxShadow: selected ? '0 0 0 2px var(--gold-soft)' : 'inset 0 0 0 1px rgba(255,255,255,.12)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px 8px'
                }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#eafafa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', pointerEvents: 'none' }}>
                  {c.label} <span style={{ opacity: .8, fontWeight: 400 }} className="mono">{fmtDur(c.dur)}</span>
                </div>
                {kind === 'video' && (
                  <div style={{ height: 10, background: 'linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.15))', borderRadius: 3, pointerEvents: 'none' }} />
                )}
                {/* trim handles */}
                <div onPointerDown={e => beginTrim(e, trackKey, c.id, 'left')} title="Trim in"
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: selected ? 'rgba(230,200,92,.5)' : 'transparent' }} />
                <div onPointerDown={e => beginTrim(e, trackKey, c.id, 'right')} title="Trim out"
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', background: selected ? 'rgba(230,200,92,.5)' : 'transparent' }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tbtn = { padding: '6px 10px' };

  return (
    <div className="wrap" style={{ maxWidth: 1120 }}>
      <div className="h-eyebrow">Editor · Phase 3</div>
      <h1 className="title">Timeline</h1>
      <p className="sub">Import your generated clips, stitch them on the track, trim, split, and export a stitched preview.</p>

      {/* source controls */}
      <div className="panel" style={{ padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <button className="btn primary" onClick={importFromLibrary} disabled={!videoMedia.length}
          title={videoMedia.length ? '' : 'No video media in the Library yet'}>
          ⬇ Import from Library{videoMedia.length ? ` (${videoMedia.length})` : ''}
        </button>
        <button className="btn" onClick={addSampleClips}>＋ Add sample clips</button>
        <button className="btn ghost" onClick={addCaption}>＋ Caption track</button>
        <span style={{ flex: 1 }} />
        <button className="btn" onClick={exportVideo} disabled={exporting || isEmpty}>
          {exporting ? '● Recording…' : '⧉ Export'}
        </button>
      </div>

      {/* preview */}
      <div className="panel" style={{ padding: 18, marginBottom: 14, display: 'grid', placeItems: 'center', background: '#0e1015' }}>
        <div style={{ position: 'relative', width: 168, height: 298, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: '#000' }}>
          <video ref={videoRef} playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: (activeV && activeV.src && !trackState.video.hidden) ? 1 : 0 }} />
          {(!activeV || !activeV.src || trackState.video.hidden) && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 12,
              background: activeV ? (activeV.color || TEAL) : 'repeating-linear-gradient(135deg,#16181f,#16181f 10px,#191c24 10px,#191c24 20px)' }}>
              <span style={{ fontSize: 12, color: activeV ? '#eafafa' : 'var(--faint)', fontWeight: activeV ? 700 : 400 }}>
                {activeV ? activeV.label : '▶ 9:16 preview'}
              </span>
            </div>
          )}
          {activeO && !trackState.overlay.hidden && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, textAlign: 'center', padding: '0 8px' }}>
              <span style={{ background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 5 }}>
                {activeO.label}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <button className="btn" style={{ padding: '7px 16px' }} onClick={togglePlay} disabled={isEmpty}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
          <span className="faint mono" style={{ fontSize: 12 }}>
            {fmtClock(playhead)} / {fmtClock(layout.total)}
          </span>
        </div>
      </div>

      {/* toolbar */}
      <div className="panel" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <button className="btn ghost" title="Split at playhead" style={tbtn} onClick={splitSelected} disabled={!sel}>]|[</button>
        <button className="btn ghost" title="Move left" style={tbtn} onClick={() => moveClip(-1)} disabled={!sel}>◀</button>
        <button className="btn ghost" title="Move right" style={tbtn} onClick={() => moveClip(1)} disabled={!sel}>▶</button>
        <button className="btn ghost" title="Delete selected" style={tbtn} onClick={deleteSelected} disabled={!sel}>🗑</button>
        <span style={{ flex: 1 }} />
        <span className="faint" style={{ fontSize: 12 }}>zoom</span>
        <button className="btn ghost" style={tbtn} onClick={() => setZoom(z => Math.max(14, z - 6))}>－</button>
        <input type="range" min={14} max={80} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: 120 }} />
        <button className="btn ghost" style={tbtn} onClick={() => setZoom(z => Math.min(80, z + 6))}>＋</button>
      </div>

      {/* ruler + tracks */}
      <div className="panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0, overflowX: 'auto' }}>
        <div style={{ position: 'relative', minWidth: GUTTER + laneW + 40, padding: '10px 0 14px' }}>
          {/* playhead line */}
          <div style={{ position: 'absolute', top: 8, bottom: 8, left: GUTTER + playhead * zoom, width: 2, background: 'var(--gold-soft)', zIndex: 5, pointerEvents: 'none' }}>
            <div onPointerDown={beginPlayheadDrag}
              style={{ position: 'absolute', top: -2, left: -6, width: 14, height: 12, background: 'var(--gold-soft)', borderRadius: 3, cursor: 'ew-resize', pointerEvents: 'auto' }} />
          </div>
          {/* ruler */}
          <div ref={rulerRef} onPointerDown={beginPlayheadDrag}
            style={{ position: 'relative', height: 22, marginLeft: GUTTER, width: laneW, cursor: 'pointer' }}>
            {ticks.map(t => (
              <div key={t} className="mono" style={{ position: 'absolute', left: t * zoom, top: 2, fontSize: 10, color: 'var(--faint)', pointerEvents: 'none' }}>
                <span style={{ display: 'block', width: 1, height: 6, background: 'var(--line-2)', marginBottom: 2 }} />
                {fmtTick(t)}
              </div>
            ))}
          </div>
          {/* tracks */}
          {renderTrack('overlay', layout.o, 'overlay')}
          {renderTrack('video', layout.v, 'video')}
        </div>
      </div>

      {/* inspector */}
      {selInfo && (
        <div className="panel" style={{ padding: 14, marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="tag">{selInfo.track === 'video' ? 'VIDEO CLIP' : 'OVERLAY'}</span>
            <b style={{ fontSize: 14 }}>{selInfo.clip.label}</b>
            <span className="faint mono" style={{ fontSize: 12 }}>{fmtDur(Math.max(0.1, selInfo.clip.out - selInfo.clip.in))} effective</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <label className="fld">
              <span className="lb">{selInfo.track === 'overlay' ? 'Caption / Label' : 'Label'}</span>
              <input value={selInfo.clip.label} onChange={e => updateClip(selInfo.track, sel, { label: e.target.value })} />
            </label>
            <label className="fld">
              <span className="lb">In-point (s)</span>
              <input type="number" step="0.1" min="0" value={Number(selInfo.clip.in.toFixed(2))}
                onChange={e => {
                  const v = clamp(parseFloat(e.target.value) || 0, 0, selInfo.clip.out - 0.2);
                  updateClip(selInfo.track, sel, { in: v });
                }} />
            </label>
            <label className="fld">
              <span className="lb">Out-point (s)</span>
              <input type="number" step="0.1" value={Number(selInfo.clip.out.toFixed(2))}
                onChange={e => {
                  const max = selInfo.clip.srcDur ?? (parseFloat(e.target.value) || selInfo.clip.out);
                  const v = clamp(parseFloat(e.target.value) || 0, selInfo.clip.in + 0.2, max);
                  updateClip(selInfo.track, sel, { out: v });
                }} />
            </label>
            <label className="fld">
              <span className="lb">Source length</span>
              <input value={selInfo.clip.srcDur ? `${selInfo.clip.srcDur.toFixed(2)}s` : '—'} disabled />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn ghost" style={tbtn} onClick={splitSelected}>]|[ Split at playhead</button>
            <button className="btn ghost" style={tbtn} onClick={() => moveClip(-1)}>◀ Move left</button>
            <button className="btn ghost" style={tbtn} onClick={() => moveClip(1)}>Move right ▶</button>
            <button className="btn ghost" style={tbtn} onClick={deleteSelected}>🗑 Delete</button>
          </div>
        </div>
      )}

      {/* empty state */}
      {isEmpty && (
        <div className="notice" style={{ marginTop: 16 }}>
          <span className="i">🎬</span>
          <div style={{ fontSize: 13.5 }}>
            <b>Your timeline is empty.</b> Import generated clips from the Library, or click <b>Add sample clips</b> to
            drop in placeholder blocks and try selecting, trimming, splitting, reordering, and exporting.
          </div>
        </div>
      )}

      {note && (
        <div className="notice" style={{ marginTop: 14 }}>
          <span className="i">ℹ️</span>
          <div style={{ fontSize: 13.5 }}>{note}</div>
        </div>
      )}

      {/* hidden export canvas (9:16) */}
      <canvas ref={exportCanvasRef} width={270} height={480} style={{ display: 'none' }} />
    </div>
  );
}
