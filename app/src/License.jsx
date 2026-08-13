import { useState } from 'react';

/*
 * License gate for the one-time-license ($49) product.
 *
 * Dev/default: OPEN. It only enforces when built with VITE_REQUIRE_LICENSE=true, so local
 * development and your own use are never blocked.
 *
 * Production: set VITE_REQUIRE_LICENSE=true. On first run the user enters a license key,
 * which is validated and stored locally. Wire real validation to your seller's license API
 * (Gumroad / Lemon Squeezy) by filling in verifyKey() below — see docs/DEPLOY-AND-SELL.md.
 */

const STORAGE = 'ddempire_license';
const REQUIRE = import.meta.env.VITE_REQUIRE_LICENSE === 'true';

const stored = () => { try { return localStorage.getItem(STORAGE) || ''; } catch { return ''; } };

// Replace with a real check against your license provider's verification endpoint.
async function verifyKey(key) {
  const k = (key || '').trim();
  if (k.length < 6) return { ok: false, error: 'That key looks too short.' };
  // Offline format check as a placeholder. In production, call your seller's verify API here.
  return { ok: true };
}

export default function LicenseGate({ children }) {
  const [licensed, setLicensed] = useState(!REQUIRE || !!stored());
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (licensed) return children;

  const activate = async () => {
    setBusy(true); setError('');
    const res = await verifyKey(key);
    setBusy(false);
    if (!res.ok) { setError(res.error || 'Invalid license key.'); return; }
    try { localStorage.setItem(STORAGE, key.trim()); } catch { /* ignore */ }
    setLicensed(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="panel" style={{ padding: 30, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div className="bolt" style={{ width: 46, height: 46, margin: '0 auto 16px', fontSize: 22 }}>⚡</div>
        <h1 style={{ margin: '0 0 6px', fontSize: 22 }}>Activate DD Empire Studio</h1>
        <p className="sub" style={{ margin: '0 0 20px' }}>Enter your one-time license key. No subscription, ever.</p>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="Your license key"
          onKeyDown={e => e.key === 'Enter' && activate()} style={{ textAlign: 'center', marginBottom: 12 }} />
        {error && <div style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 12 }}>{error}</div>}
        <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy} onClick={activate}>
          {busy ? 'Checking…' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
