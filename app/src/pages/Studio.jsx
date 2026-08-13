import { useState } from 'react';
import { useStore } from '../store.jsx';

export default function Studio() {
  const { characters } = useStore();
  const [f, setF] = useState({
    character: characters[0]?.id || '', dialogue: '', environment: 'Bright home kitchen, morning window light',
    camera: 'Handheld medium-close, micro-shake', aspect: '9:16', duration: '8'
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const c = characters.find(x => x.id === f.character);

  const prompt = c ? `${c.look} ${f.environment}. ${f.camera}. ${f.dialogue ? `She/he says: "${f.dialogue}". ` : ''}Visible pores, natural sebum sheen, no beauty filter. ${f.aspect}. ${f.duration}s. Veo 3. Natural room tone. Hard cut.` : '';

  return (
    <div className="wrap" style={{ maxWidth: 900 }}>
      <div className="h-eyebrow">Generate</div>
      <h1 className="title">Studio</h1>
      <p className="sub">Compose a shot and build the Veo 3 prompt. Live generation connects in Phase 2.</p>

      <div className="notice" style={{ marginBottom: 18 }}>
        <span className="i">🔑</span>
        <div style={{ fontSize: 13.5 }}>
          <b>Veo 3 not connected yet.</b> This builds the prompt now; wiring generation needs your Google Gemini API key on a small backend (Phase 2). For now, copy the prompt into Veo directly.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="panel" style={{ padding: 20 }}>
          <label className="fld"><span className="lb">Character</span>
            <select value={f.character} onChange={set('character')}>
              {characters.map(x => <option key={x.id} value={x.id}>{x.name} — {x.brand}</option>)}
            </select></label>
          <label className="fld"><span className="lb">Dialogue</span>
            <textarea rows={3} value={f.dialogue} onChange={set('dialogue')} placeholder="What they say to camera…" /></label>
          <label className="fld"><span className="lb">Environment</span>
            <input value={f.environment} onChange={set('environment')} /></label>
          <label className="fld"><span className="lb">Camera</span>
            <input value={f.camera} onChange={set('camera')} /></label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className="fld" style={{ flex: 1 }}><span className="lb">Aspect</span>
              <select value={f.aspect} onChange={set('aspect')}><option>9:16</option><option>16:9</option></select></label>
            <label className="fld" style={{ width: 120 }}><span className="lb">Duration (s)</span>
              <select value={f.duration} onChange={set('duration')}><option>8</option><option>6</option><option>4</option></select></label>
          </div>
        </div>

        <div className="panel" style={{ padding: 20 }}>
          <div className="h-eyebrow" style={{ marginBottom: 10 }}>Veo 3 prompt</div>
          <pre className="mono" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, lineHeight: 1.6, color: '#b9c2d0', background: '#0e1015', border: '1px solid var(--line)', borderRadius: 10, padding: 14, margin: 0, minHeight: 180 }}>{prompt}</pre>
          <button className="btn primary" style={{ marginTop: 12 }}
            onClick={() => navigator.clipboard && navigator.clipboard.writeText(prompt)}>Copy prompt</button>
        </div>
      </div>
    </div>
  );
}
