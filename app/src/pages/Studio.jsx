import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, genId } from '../store.jsx';
import { generateVideo, hasVeoKey } from '../veo.js';

export default function Studio() {
  const { characters, addMedia } = useStore();
  const [f, setF] = useState({
    character: characters[0]?.id || '', dialogue: '', environment: 'Bright home kitchen, morning window light',
    camera: 'Handheld medium-close, micro-shake', aspect: '9:16', duration: '8'
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const c = characters.find(x => x.id === f.character);

  const [gen, setGen] = useState({ busy: false, progress: 0, url: '', error: '' });
  const connected = hasVeoKey();

  const prompt = c ? `${c.look} ${f.environment}. ${f.camera}. ${f.dialogue ? `They say: "${f.dialogue}". ` : ''}Visible pores, natural sebum sheen, no beauty filter. ${f.aspect}. ${f.duration}s. Veo 3. Natural room tone. Hard cut.` : '';

  const run = async () => {
    setGen({ busy: true, progress: 0.02, url: '', error: '' });
    try {
      const { url } = await generateVideo({
        prompt, aspect: f.aspect, duration: f.duration,
        onProgress: (p) => setGen(g => ({ ...g, progress: p }))
      });
      addMedia({ id: genId(), type: 'video', url, label: (c?.name || 'Clip') + ' — ' + (f.dialogue || 'shot').slice(0, 40), characterId: f.character, createdAt: Date.now() });
      setGen({ busy: false, progress: 1, url, error: '' });
    } catch (e) {
      setGen({ busy: false, progress: 0, url: '', error: String(e.message || e) });
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: 940 }}>
      <div className="h-eyebrow">Generate</div>
      <h1 className="title">Studio</h1>
      <p className="sub">Compose a shot, build the Veo 3 prompt, and generate — clips land in your Library.</p>

      {!connected && (
        <div className="notice" style={{ marginBottom: 18 }}>
          <span className="i">🔑</span>
          <div style={{ fontSize: 13.5 }}>
            <b>Veo 3 not connected.</b> Add your Google Gemini API key in <Link to="/settings" style={{ color: '#7fb6e6' }}>Settings</Link> to generate. Until then you can still copy the prompt into Veo directly.
          </div>
        </div>
      )}

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
            <label className="fld" style={{ width: 130 }}><span className="lb">Duration (s)</span>
              <select value={f.duration} onChange={set('duration')}><option>8</option><option>6</option><option>4</option></select></label>
          </div>
        </div>

        <div className="panel" style={{ padding: 20 }}>
          <div className="h-eyebrow" style={{ marginBottom: 10 }}>Veo 3 prompt</div>
          <pre className="mono" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, lineHeight: 1.6, color: '#b9c2d0', background: '#0e1015', border: '1px solid var(--line)', borderRadius: 10, padding: 14, margin: 0, minHeight: 150 }}>{prompt}</pre>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn primary" disabled={!connected || gen.busy || !prompt} onClick={run}>
              {gen.busy ? `Generating… ${Math.round(gen.progress * 100)}%` : '● Generate with Veo 3'}
            </button>
            <button className="btn ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(prompt)}>Copy prompt</button>
          </div>

          {gen.busy && (
            <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'var(--panel-2)', overflow: 'hidden' }}>
              <div style={{ width: `${gen.progress * 100}%`, height: '100%', background: 'linear-gradient(90deg,var(--gold-soft),var(--gold))', transition: 'width .3s' }} />
            </div>
          )}
          {gen.error && <div style={{ marginTop: 12, color: 'var(--red)', fontSize: 12.5 }}>{gen.error}</div>}
          {gen.url && !gen.busy && (
            <div style={{ marginTop: 14 }}>
              <video src={gen.url} controls style={{ width: '100%', maxHeight: 320, borderRadius: 10, background: '#000' }} />
              <div className="faint" style={{ fontSize: 12, marginTop: 6 }}>Saved to <Link to="/library" style={{ color: 'var(--gold-soft)' }}>Library</Link> — ready for the Timeline.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
