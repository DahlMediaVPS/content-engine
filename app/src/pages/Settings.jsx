import { useStore } from '../store.jsx';

export default function Settings() {
  const { reset, characters, scripts } = useStore();

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
        <div className="h-eyebrow" style={{ marginBottom: 8 }}>Google Veo 3</div>
        <div className="notice">
          <span className="i">🔑</span>
          <div style={{ fontSize: 13.5 }}>
            <b>Connected in Phase 2.</b> Veo 3 needs your Gemini API key stored on a small secure backend — never in the browser or the repo. We'll add that step when you're ready.
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
