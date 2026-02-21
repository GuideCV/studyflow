import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Exams from './pages/Exams';
import Generator from './pages/Generator';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#fef6f8' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '260px', padding: '2.5rem 3rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes/:subjectId" element={<Notes />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/generate" element={<Generator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
