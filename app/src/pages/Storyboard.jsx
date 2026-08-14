import { useState } from 'react';
import { useStore, genId, buildFramePrompt } from '../store.jsx';

const copy = (text) => { if (navigator.clipboard && text) navigator.clipboard.writeText(text); };

const blankFrame = () => ({ id: genId(), action: '', dialogue: '', caption: '', imageUrl: '', prompt: '' });

/* Fixed 9:16 thumbnail — renders a pasted image or a labeled placeholder. */
function FrameThumb({ url }) {
  return (
    <div style={{
      width: 108, flex: 'none', aspectRatio: '9 / 16', borderRadius: 10, overflow: 'hidden',
      border: '1px solid var(--line)', background: '#0e1015', display: 'grid', placeItems: 'center'
    }}>
      {url
        ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div className="faint" style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.4 }}>9:16<br />frame</div>}
    </div>
  );
}

export default function Storyboard() {
  const {
    characters, environments, storyboards,
    addStoryboard, updateStoryboard, deleteStoryboard
  } = useStore();

  const [selId, setSelId] = useState(storyboards[0]?.id || null);

  const sb = storyboards.find(s => s.id === selId) || null;
  const character = sb ? characters.find(c => c.id === sb.characterId) : null;
  const environment = sb ? environments.find(e => e.id === sb.environmentId) : null;

  const noAssets = characters.length === 0 || environments.length === 0;

  const createBoard = () => {
    const nb = {
      id: genId(), name: 'Untitled',
      characterId: characters[0]?.id, environmentId: environments[0]?.id, frames: []
    };
    addStoryboard(nb);
    setSelId(nb.id);
  };

  const removeBoard = (id) => {
    deleteStoryboard(id);
    if (id === selId) {
      const rest = storyboards.filter(s => s.id !== id);
      setSelId(rest[0]?.id || null);
    }
  };

  /* Frame mutation helpers — always persist the full next array through the store. */
  const setFrames = (next) => updateStoryboard(sb.id, { frames: next });

  const patchFrame = (fid, patch) =>
    setFrames((sb.frames || []).map(f => f.id === fid ? { ...f, ...patch } : f));

  const addFrame = () => setFrames([...(sb.frames || []), blankFrame()]);

  const deleteFrame = (fid) => setFrames((sb.frames || []).filter(f => f.id !== fid));

  const moveFrame = (idx, dir) => {
    const frames = [...(sb.frames || [])];
    const j = idx + dir;
    if (j < 0 || j >= frames.length) return;
    [frames[idx], frames[j]] = [frames[j], frames[idx]];
    setFrames(frames);
  };

  const copyAll = () => {
    const all = (sb.frames || [])
      .map((f, i) => `# Frame ${i + 1}\n${buildFramePrompt(character, environment, f)}`)
      .join('\n\n');
    copy(all);
  };

  const selectStyle = { maxWidth: 320 };

  return (
    <div className="wrap" style={{ maxWidth: 960 }}>
      <div className="h-eyebrow">Pre-production</div>
      <h1 className="title">Storyboard builder</h1>
      <p className="sub">Lock a consistent character + environment, then write frames. Each frame gets a copy-ready 9:16 prompt — the team just fills in dialogue.</p>

      <div className="notice" style={{ marginBottom: 18 }}>
        <span className="i">🎬</span>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          Image generation wires to <b>Veo</b> in a later step. For now, paste an image URL per frame or copy the prompt into your generator.
        </div>
      </div>

      {noAssets && (
        <div className="notice" style={{ marginBottom: 18, background: 'linear-gradient(100deg, rgba(224,169,46,.1), rgba(224,169,46,.03))', borderColor: 'rgba(224,169,46,.3)' }}>
          <span className="i">⚠️</span>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            {characters.length === 0 && <>Add a <b>character</b> first so prompts stay consistent. </>}
            {environments.length === 0 && <>Add an <b>environment</b> to lock the background.</>}
          </div>
        </div>
      )}

      {/* Board selector row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
        {storyboards.map(s => (
          <button key={s.id} onClick={() => setSelId(s.id)}
            className="btn ghost"
            style={{
              borderColor: s.id === selId ? 'var(--gold)' : 'var(--line-2)',
              background: s.id === selId ? 'var(--panel-2)' : 'transparent'
            }}>
            {s.name || 'Untitled'} <span className="faint" style={{ marginLeft: 6 }}>{(s.frames || []).length}</span>
          </button>
        ))}
        <button className="btn primary" onClick={createBoard}>＋ New storyboard</button>
      </div>

      {storyboards.length === 0 && (
        <div className="empty">No storyboards yet — create one to start blocking out frames.</div>
      )}

      {sb && (
        <div className="panel" style={{ padding: 22 }}>
          {/* Board header: rename + delete */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <input
              value={sb.name || ''}
              onChange={e => updateStoryboard(sb.id, { name: e.target.value })}
              placeholder="Storyboard name"
              style={{ maxWidth: 340, fontWeight: 600, fontSize: 15 }} />
            <button className="btn ghost" style={{ marginLeft: 'auto' }} onClick={copyAll}
              disabled={(sb.frames || []).length === 0}>Copy all prompts</button>
            <button className="btn ghost" style={{ color: 'var(--red)', borderColor: 'rgba(229,83,60,.4)' }}
              onClick={() => removeBoard(sb.id)}>Delete</button>
          </div>

          {/* Locked context: character + environment selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
            <label className="fld" style={{ margin: 0 }}>
              <span className="lb">Character</span>
              <select value={sb.characterId || ''} style={selectStyle}
                onChange={e => updateStoryboard(sb.id, { characterId: e.target.value })}>
                {characters.length === 0 && <option value="">No characters</option>}
                {characters.map(c => <option key={c.id} value={c.id}>{c.name}{c.brand ? ` · ${c.brand}` : ''}</option>)}
              </select>
              <div className="faint" style={{ fontSize: 12, marginTop: 6 }}>
                {character
                  ? <>🔒 {(character.refImages || []).length} reference image{(character.refImages || []).length === 1 ? '' : 's'} locked</>
                  : 'No character selected'}
              </div>
            </label>

            <label className="fld" style={{ margin: 0 }}>
              <span className="lb">Environment</span>
              <select value={sb.environmentId || ''} style={selectStyle}
                onChange={e => updateStoryboard(sb.id, { environmentId: e.target.value })}>
                {environments.length === 0 && <option value="">No environments</option>}
                {environments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <div className="faint" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
                {environment ? environment.description : 'No environment selected'}
              </div>
            </label>
          </div>

          {/* Frames */}
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 18, paddingTop: 4 }}>
            {(sb.frames || []).length === 0 && (
              <div className="empty">No frames yet — add your first frame below.</div>
            )}

            {(sb.frames || []).map((f, i) => {
              const prompt = buildFramePrompt(character, environment, f);
              const frames = sb.frames || [];
              return (
                <div key={f.id} className="panel" style={{ padding: 16, marginTop: 14, background: 'var(--panel-2)' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                      <span className="mono" style={{ color: 'var(--gold-soft)', fontWeight: 700, fontSize: 13 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <FrameThumb url={f.imageUrl} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label className="fld">
                        <span className="lb">Action</span>
                        <textarea rows={2} value={f.action} spellCheck={false}
                          placeholder="What happens on screen"
                          onChange={e => patchFrame(f.id, { action: e.target.value })} />
                      </label>
                      <label className="fld">
                        <span className="lb">Dialogue</span>
                        <textarea rows={2} value={f.dialogue} spellCheck={false}
                          placeholder="What the character says"
                          onChange={e => patchFrame(f.id, { dialogue: e.target.value })} />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="fld" style={{ margin: 0 }}>
                          <span className="lb">Caption</span>
                          <input value={f.caption}
                            placeholder="On-screen caption"
                            onChange={e => patchFrame(f.id, { caption: e.target.value })} />
                        </label>
                        <label className="fld" style={{ margin: 0 }}>
                          <span className="lb">Image URL</span>
                          <input value={f.imageUrl} spellCheck={false}
                            placeholder="Paste a 9:16 image URL"
                            onChange={e => patchFrame(f.id, { imageUrl: e.target.value })} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Generated prompt */}
                  <div style={{ marginTop: 12 }}>
                    <div className="lb" style={{ fontSize: 12, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Prompt</div>
                    <div style={{ background: '#0e1015', border: '1px solid var(--line)', borderRadius: 10, padding: '11px 13px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <pre className="mono" style={{ margin: 0, flex: 1, fontSize: 11.5, lineHeight: 1.6, color: '#b9c2d0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{prompt}</pre>
                      <button className="btn ghost" style={{ fontSize: 11.5, padding: '7px 12px', flex: 'none' }}
                        onClick={() => copy(prompt)}>Copy prompt</button>
                    </div>
                  </div>

                  {/* Frame controls */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn ghost" style={{ fontSize: 12, padding: '6px 11px' }}
                      onClick={() => moveFrame(i, -1)} disabled={i === 0}>↑ Up</button>
                    <button className="btn ghost" style={{ fontSize: 12, padding: '6px 11px' }}
                      onClick={() => moveFrame(i, 1)} disabled={i === frames.length - 1}>↓ Down</button>
                    <button className="btn ghost" style={{ fontSize: 12, padding: '6px 11px', marginLeft: 'auto', color: 'var(--red)', borderColor: 'rgba(229,83,60,.4)' }}
                      onClick={() => deleteFrame(f.id)}>Delete frame</button>
                  </div>
                </div>
              );
            })}

            <button className="btn ghost" style={{ marginTop: 14, justifyContent: 'center', width: '100%' }}
              onClick={addFrame}>＋ Add frame</button>
          </div>
        </div>
      )}
    </div>
  );
}
