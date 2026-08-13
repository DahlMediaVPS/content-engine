import { useState } from 'react';
import { useStore } from '../store.jsx';
import { getVeoKey, setVeoKey } from '../veo.js';

export default function Settings() {
  const { reset, characters, scripts } = useStore();
  const [key, setKey] = useState(getVeoKey());
  const [saved, setSaved] = useState(false);

  const saveKey = () => { setVeoKey(key.trim()); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ characters, scripts }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ddempire-backup.json'; a.click();
  };

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div className="h-eyebrow">Configuration</div>
      <h1 className="title">Settings</h1>
      <p className="sub">Local-first — your data lives in this browser. No account, no subscription.</p>

      <div className="panel" style={{ padding: 20, marginBottom: 14 }}>
        <div className="h-eyebrow" style={{ marginBottom: 10 }}>Google Veo 3</div>
        <label className="fld"><span className="lb">Gemini API key</span>
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="AIza…" autoComplete="off" /></label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn primary" onClick={saveKey}>Save key</button>
          {saved && <span style={{ color: 'var(--green)', fontSize: 12.5 }}>Saved ✓</span>}
          <span className="spacer" style={{ flex: 1 }} />
          {getVeoKey() ? <span className="pill st-ACTIVE">Connected</span> : <span className="pill st-DRAFT">Not set</span>}
        </div>
        <div className="notice" style={{ marginTop: 14 }}>
          <span className="i">🔒</span>
          <div style={{ fontSize: 13 }}>
            Get a key at <b>Google AI Studio → API key</b> (enable billing for Veo). It's stored only in this browser.
            For a public/shared deploy, use the server-side proxy instead (see <span className="mono">app/api/veo.js</span>) so the key never ships to users.
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: 20 }}>
        <div className="h-eyebrow" style={{ marginBottom: 10 }}>Your data</div>
        <div className="muted" style={{ fontSize: 13.5, marginBottom: 12 }}>
          {characters.length} characters · {scripts.length} scripts, saved locally.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={exportData}>↓ Export backup</button>
          <button className="btn ghost" onClick={() => { if (confirm('Reset to seed data? Your local changes will be lost.')) reset(); }}>Reset to seed</button>
        </div>
      </div>
    </div>
  );
}
