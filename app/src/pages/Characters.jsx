import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store.jsx';

export default function Characters() {
  const { characters, scripts } = useStore();
  const [sel, setSel] = useState(characters[0]?.id || null);
  const active = characters.find(c => c.id === sel);
  const activeScripts = scripts.filter(s => s.characterId === sel);

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
