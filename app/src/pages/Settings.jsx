import { useEffect, useState } from 'react';
import { useStore } from '../store.jsx';
import { getVeoKey, setVeoKey } from '../veo.js';
import {
  getConfig, setConfig, isConfigured,
  signInWithEmail, signOut, getUser, onAuth
} from '../supabase.js';

export default function Settings() {
  const store = useStore();
  const { reset, characters, scripts, syncNow, syncing, cloud } = store;
  const [key, setKey] = useState(getVeoKey());
  const [saved, setSaved] = useState(false);

  // Supabase config
  const cfg = getConfig();
  const [sbUrl, setSbUrl] = useState(cfg.url);
  const [sbKey, setSbKey] = useState(cfg.key);
  const [cfgSaved, setCfgSaved] = useState(false);
  const [configured, setConfigured] = useState(isConfigured());

  // Auth
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  useEffect(() => {
    let alive = true;
    getUser().then(u => { if (alive) setUser(u); });
    const off = onAuth(u => { setUser(u); });
    return () => { alive = false; off && off(); };
  }, [configured]);

  const saveKey = () => { setVeoKey(key.trim()); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  const saveSbConfig = () => {
    setConfig(sbUrl.trim(), sbKey.trim());
    setConfigured(isConfigured());
    setCfgSaved(true);
    setTimeout(() => setCfgSaved(false), 1500);
  };

  const sendLink = async () => {
    setAuthMsg('');
    if (!email.trim()) { setAuthMsg('Enter an email first.'); return; }
    const { error } = await signInWithEmail(email.trim());
    setAuthMsg(error ? ('Error: ' + error.message) : 'Magic link sent — check your email.');
  };

  const doSignOut = async () => { await signOut(); setUser(null); setAuthMsg(''); };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ characters, scripts }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ddempire-backup.json'; a.click();
  };

  // Status pill: Not configured / Configured / Signed in
  let pill = <span className="pill st-DRAFT">Not configured</span>;
  if (configured && user) pill = <span className="pill st-ACTIVE">Signed in</span>;
  else if (configured) pill = <span className="pill st-DRAFT">Configured</span>;

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

      <div className="panel" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="h-eyebrow">Supabase cloud sync <span style={{ opacity: 0.6 }}>(optional)</span></div>
          <span className="spacer" style={{ flex: 1 }} />
          {pill}
        </div>

        <label className="fld"><span className="lb">Project URL</span>
          <input type="text" value={sbUrl} onChange={e => setSbUrl(e.target.value)} placeholder="https://xxxx.supabase.co" autoComplete="off" /></label>
        <label className="fld"><span className="lb">Anon public key</span>
          <input type="password" value={sbKey} onChange={e => setSbKey(e.target.value)} placeholder="eyJhbGci…" autoComplete="off" /></label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn primary" onClick={saveSbConfig}>Save connection</button>
          {cfgSaved && <span style={{ color: 'var(--green)', fontSize: 12.5 }}>Saved ✓</span>}
        </div>

        {configured && (
          <div style={{ marginTop: 16, borderTop: '1px solid var(--line, #ffffff14)', paddingTop: 14 }}>
            {user ? (
              <div>
                <div className="muted" style={{ fontSize: 13.5, marginBottom: 10 }}>
                  Signed in as <b>{user.email}</b>. Your data syncs to the cloud.
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button className="btn" onClick={syncNow} disabled={syncing}>{syncing ? 'Syncing…' : '↕ Sync now'}</button>
                  <button className="btn ghost" onClick={doSignOut}>Sign out</button>
                  {cloud && <span className="pill st-ACTIVE">Cloud on</span>}
                </div>
              </div>
            ) : (
              <div>
                <label className="fld"><span className="lb">Email (magic link sign-in)</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
                <button className="btn primary" onClick={sendLink}>Send magic link</button>
              </div>
            )}
            {authMsg && <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>{authMsg}</div>}
          </div>
        )}

        <div className="notice" style={{ marginTop: 14 }}>
          <span className="i">☁️</span>
          <div style={{ fontSize: 13 }}>
            Optional. Leave blank to stay 100% local. When configured and signed in, characters, scripts and media
            sync across devices. Paste your <b>Project URL</b> and <b>anon public key</b> from
            <span className="mono"> Supabase → Project Settings → API</span>. Both are stored only in this browser.
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
