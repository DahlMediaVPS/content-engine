import { useState } from 'react';
import { useStore } from '../store.jsx';

const secs = t => { if (!t) return null; const p = String(t).split(':').map(Number); return p.length === 2 ? p[0] * 60 + p[1] : Number(t); };

export default function Scripts() {
  const { scripts, characters } = useStore();
  const [showPaste, setShowPaste] = useState(false);
  const [raw, setRaw] = useState('');
  const [pasted, setPasted] = useState(null);
  const [err, setErr] = useState('');

  const load = () => {
    try {
      const data = JSON.parse(raw);
      setPasted(Array.isArray(data) ? data : (data.scripts || [data]));
      setErr(''); setShowPaste(false);
    } catch (e) { setErr('Invalid JSON — ' + e.message); }
  };

  const list = pasted || scripts;
  const nameFor = id => characters.find(c => c.id === id)?.name || '';

  return (
    <div className="wrap" style={{ maxWidth: 860 }}>
      <div className="h-eyebrow">Copywriting</div>
      <h1 className="title">Scripts</h1>
      <p className="sub">Paste script JSON from your copywriting skill → production-ready clips + copy-ready Veo 3 prompts.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn primary" onClick={() => setShowPaste(v => !v)}>＋ Paste JSON</button>
        <button className="btn ghost" onClick={() => { setPasted(null); setErr(''); }}>Show saved</button>
        {err && <span style={{ color: 'var(--red)', fontSize: 12.5, alignSelf: 'center' }}>{err}</span>}
      </div>

      {showPaste && (
        <div style={{ marginBottom: 18 }}>
          <textarea rows={8} value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false}
            placeholder='Paste { scripts:[ { id, title, cta, status, clips:[ { beat, start, end, caption, dialogue, prompt } ] } ] }' />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="btn primary" onClick={load}>Load</button>
            <button className="btn ghost" onClick={() => setShowPaste(false)}>Cancel</button>
          </div>
        </div>
      )}

      {list.length === 0 && <div className="empty">No scripts yet — paste some JSON.</div>}

      {list.map((s, i) => (
        <div key={s.id || i} className="panel" style={{ marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', flexWrap: 'wrap' }}>
            <span className="mono" style={{ color: 'var(--gold-soft)', fontWeight: 700, fontSize: 14 }}>{s.id}</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{s.title || 'Untitled'}</span>
            {s.characterId && <span className="faint" style={{ fontSize: 12 }}>{nameFor(s.characterId)}</span>}
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 7 }}>
              {s.cta && <span className="tag">{s.cta}</span>}
              {s.status && <span className={'pill st-' + s.status}>{s.status}</span>}
            </span>
          </div>
          {(s.clips || []).length > 0 && (
            <div style={{ display: 'flex', gap: 3, padding: '0 18px 14px' }}>
              {s.clips.map((c, j) => {
                const d = Math.max(1, (secs(c.end) || 0) - (secs(c.start) || 0) || 1);
                return <div key={j} style={{ height: 6, borderRadius: 3, flexGrow: d, background: 'linear-gradient(90deg,rgba(201,162,39,.5),rgba(201,162,39,.28))' }} />;
              })}
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--line)', padding: '4px 18px 14px' }}>
            {(s.clips || []).map((c, j) => (
              <div key={j} style={{ padding: '13px 0', borderBottom: j < s.clips.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 7 }}>
                  {c.beat && <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,.06)', padding: '3px 8px', borderRadius: 5 }}>{c.beat}</span>}
                  {c.id && <span className="mono faint" style={{ fontSize: 12 }}>{c.id}</span>}
                  {(c.start || c.end) && <span className="mono muted" style={{ fontSize: 12 }}>{c.start}{c.end ? '–' + c.end : ''}</span>}
                  {c.caption && <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: 'var(--gold-soft)' }}>{c.caption}</span>}
                </div>
                {c.dialogue && <div className="muted" style={{ fontSize: 13.5, fontStyle: 'italic', marginBottom: 9 }}>“{c.dialogue}”</div>}
                {c.prompt && (
                  <div style={{ background: '#0e1015', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 13px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <pre className="mono" style={{ margin: 0, flex: 1, fontSize: 11.5, lineHeight: 1.6, color: '#b9c2d0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{c.prompt}</pre>
                    <button className="btn ghost" style={{ fontSize: 11.5, padding: '7px 12px' }}
                      onClick={() => navigator.clipboard && navigator.clipboard.writeText(c.prompt)}>Copy</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
