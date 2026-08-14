import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, genId } from '../store.jsx';

export default function Characters() {
  const { characters, scripts, updateCharacter } = useStore();
  const [sel, setSel] = useState(characters[0]?.id || null);
  const [imgName, setImgName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const active = characters.find(c => c.id === sel);
  const activeScripts = scripts.filter(s => s.characterId === sel);

  const addRefImage = () => {
    if (!active || !imgName.trim()) return;
    const next = [...(active.refImages || []), { id: genId(), name: imgName.trim(), url: imgUrl.trim() }];
    updateCharacter(active.id, { refImages: next });
    setImgName(''); setImgUrl('');
  };
  const removeRefImage = (id) => {
    if (!active) return;
    updateCharacter(active.id, { refImages: (active.refImages || []).filter(r => r.id !== id) });
  };

  return (
    <div className="wrap">
      <div className="h-eyebrow">Roster</div>
      <h1 className="title">Characters</h1>
      <p className="sub">Locked identities baked into every prompt for consistency.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>
        <div className="grid" style={{ gap: 10 }}>
          {characters.map(c => (
            <button key={c.id} onClick={() => setSel(c.id)}
              className="panel" style={{
                textAlign: 'left', cursor: 'pointer', padding: '14px 16px', border: '1px solid var(--line)',
                borderColor: c.id === sel ? 'var(--gold)' : 'var(--line)', background: c.id === sel ? 'var(--panel-2)' : 'var(--panel)'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', flex: 'none',
                  background: 'rgba(255,255,255,.05)', boxShadow: `inset 0 0 0 1px ${c.accent}55`, fontSize: 15
                }}>{c.brand === 'Glassier Skin' ? '🌿' : '🩺'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name} <span className="faint" style={{ fontWeight: 400 }}>v{c.version}</span></div>
                  <div className="faint" style={{ fontSize: 12 }}>{c.brand}</div>
                </div>
                <span className={'pill st-' + c.status}>{c.status}</span>
              </div>
            </button>
          ))}
          <Link to="/create" className="btn ghost" style={{ justifyContent: 'center' }}>＋ New character</Link>
        </div>

        {active && (
          <div className="panel" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{active.name} <span className="faint" style={{ fontSize: 14 }}>v{active.version}</span></h2>
              <span className={'pill st-' + active.status}>{active.status}</span>
              <span className="tag" style={{ marginLeft: 'auto' }}>{active.brand}</span>
            </div>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{active.look}</p>
            <div className="faint" style={{ fontSize: 12.5, margin: '10px 0 18px' }}>⚙ {active.engines}</div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="panel" style={{ padding: '12px 14px', background: 'var(--panel-2)' }}>
                <div className="faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Element ID</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--dim)', marginTop: 4 }}>{active.elementId}</div>
              </div>
              <div className="panel" style={{ padding: '12px 14px', background: 'var(--panel-2)' }}>
                <div className="faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>Scripts</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{activeScripts.length}</div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Reference images <span className="faint" style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— named, baked into every prompt</span></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                {(active.refImages || []).map(r => (
                  <div key={r.id} style={{ width: 88 }}>
                    <div style={{ width: 88, height: 110, borderRadius: 8, overflow: 'hidden', background: 'var(--panel-2)', boxShadow: 'inset 0 0 0 1px var(--line)', display: 'grid', placeItems: 'center' }}>
                      {r.url ? <img src={r.url} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="faint" style={{ fontSize: 11 }}>no image</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--gold-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                      <button className="btn ghost" style={{ padding: '1px 6px', fontSize: 11, marginLeft: 'auto' }} onClick={() => removeRefImage(r.id)}>✕</button>
                    </div>
                  </div>
                ))}
                {(active.refImages || []).length === 0 && <div className="faint" style={{ fontSize: 13 }}>No reference images yet — add named shots (e.g. “{active.name} img1”).</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input value={imgName} onChange={e => setImgName(e.target.value)} placeholder={`${active.name} img${(active.refImages?.length || 0) + 1}`} style={{ flex: '1 1 130px' }} />
                <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="image URL (optional)" style={{ flex: '2 1 200px' }} />
                <button className="btn" onClick={addRefImage}>＋ Add</button>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Scripts</div>
              {activeScripts.length === 0 && <div className="faint" style={{ fontSize: 13 }}>No scripts yet. Write one in <Link to="/scripts" style={{ color: 'var(--gold-soft)' }}>Scripts</Link>.</div>}
              {activeScripts.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="mono faint" style={{ fontSize: 12 }}>{s.id}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</span>
                  <span className="tag" style={{ marginLeft: 'auto' }}>{s.cta}</span>
                  <span className={'pill st-' + s.status}>{s.status}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
              <Link to="/studio" className="btn primary">Generate video →</Link>
              <Link to="/scripts" className="btn ghost">Write a script</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
