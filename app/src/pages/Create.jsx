import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, genId } from '../store.jsx';

export default function Create() {
  const { addCharacter } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', brand: '', version: '1.0', look: '', engines: 'Veo 3', elementId: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = () => {
    if (!f.name.trim()) return;
    const c = {
      id: genId(), name: f.name.trim(), brand: f.brand.trim() || 'Unassigned', version: f.version || '1.0',
      status: 'ACTIVE', look: f.look.trim(), engines: f.engines.trim() || 'Veo 3',
      elementId: f.elementId.trim() || genId(), accent: '#c9a227', scripts: []
    };
    addCharacter(c);
    nav('/characters');
  };

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div className="h-eyebrow">New</div>
      <h1 className="title">Create a character</h1>
      <p className="sub">Lock the identity once — it feeds every generation for consistency.</p>

      <div className="panel" style={{ padding: 22 }}>
        <label className="fld"><span className="lb">Name</span>
          <input value={f.name} onChange={set('name')} placeholder="e.g. Greg" /></label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label className="fld" style={{ flex: 1 }}><span className="lb">Brand</span>
            <input value={f.brand} onChange={set('brand')} placeholder="MD Klean" /></label>
          <label className="fld" style={{ width: 120 }}><span className="lb">Version</span>
            <input value={f.version} onChange={set('version')} /></label>
        </div>
        <label className="fld"><span className="lb">Look / visual anchor</span>
          <textarea rows={4} value={f.look} onChange={set('look')}
            placeholder="Age, hair, eyes, skin, wardrobe, setting. Real texture — not polished." /></label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label className="fld" style={{ flex: 1 }}><span className="lb">Engines</span>
            <input value={f.engines} onChange={set('engines')} placeholder="Veo 3 · Nano Banana Pro" /></label>
          <label className="fld" style={{ flex: 1 }}><span className="lb">Element ID (optional)</span>
            <input value={f.elementId} onChange={set('elementId')} placeholder="auto if blank" /></label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn primary" onClick={save}>Save character</button>
          <button className="btn ghost" onClick={() => nav('/characters')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
