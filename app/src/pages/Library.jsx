import { useStore } from '../store.jsx';

export default function Library() {
  const { media } = useStore();
  return (
    <div className="wrap">
      <div className="h-eyebrow">Assets</div>
      <h1 className="title">Library</h1>
      <p className="sub">Every clip and image you generate lands here, per character.</p>

      {media.length === 0 ? (
        <div className="panel empty">
          Nothing generated yet.<br />
          <span className="faint" style={{ fontSize: 13 }}>Once Veo 3 is connected (Phase 2), your clips appear here ready to drop into the Timeline.</span>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {media.map(m => (
            <div key={m.id} className="panel" style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
              <div className="faint" style={{ fontSize: 12 }}>{m.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
