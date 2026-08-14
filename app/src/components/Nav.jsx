import { NavLink } from 'react-router-dom';

const links = [
  { to: '/characters', label: 'Characters' },
  { to: '/studio', label: 'Studio' },
  { to: '/scripts', label: 'Scripts' },
  { to: '/storyboard', label: 'Storyboard' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/library', label: 'Library' }
];

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-in">
        <NavLink to="/" className="brand">
          <span className="bolt">⚡</span>
          <b>DD Empire Studio</b>
        </NavLink>
        {links.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => 'link' + (isActive ? ' active' : '')}>
            {l.label}
          </NavLink>
        ))}
        <span className="spacer" />
        <NavLink to="/create" className="link cta">＋ Create</NavLink>
        <NavLink to="/settings" className="link" title="Settings">⚙</NavLink>
      </div>
    </nav>
  );
}
