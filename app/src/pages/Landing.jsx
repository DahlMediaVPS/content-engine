import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="wrap" style={{ paddingTop: 70, textAlign: 'center' }}>
      <span className="pill st-DRAFT" style={{ marginBottom: 18, display: 'inline-block' }}>◆ One-time license · no subscription</span>
      <h1 style={{ fontSize: 44, letterSpacing: '-.03em', margin: '0 0 14px', textWrap: 'balance' }}>
        Your AI characters,<br />consistent and on-brand.
      </h1>
      <p className="sub" style={{ fontSize: 17, maxWidth: 560, margin: '0 auto 28px' }}>
        Build locked characters, script their reels, generate with Google Veo 3, and edit
        clips on a timeline — all in one place. Your data stays on your machine.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link to="/create" className="btn primary">Create a character</Link>
        <Link to="/characters" className="btn ghost">See the roster</Link>
      </div>
    </div>
  );
}
