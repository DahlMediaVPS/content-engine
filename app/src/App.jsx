import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Landing from './pages/Landing.jsx';
import Characters from './pages/Characters.jsx';
import Create from './pages/Create.jsx';
import Studio from './pages/Studio.jsx';
import Scripts from './pages/Scripts.jsx';
import Timeline from './pages/Timeline.jsx';
import Library from './pages/Library.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/create" element={<Create />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/library" element={<Library />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
