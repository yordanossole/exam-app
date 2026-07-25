import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import SubjectCard from '../components/SubjectCard';

// Real subjects expected in the backend
const REAL_SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', category: 'Math',     icon: '📐', color: '#fff3e0' },
  { id: 'english',     name: 'English',     category: 'Language', icon: '🌍', color: '#e3f2fd' },
  { id: 'amharic',     name: 'Amharic',     category: 'Language', icon: '🇪🇹', color: '#e8f5e9' },
  { id: 'physics',     name: 'Physics',     category: 'Science',  icon: '⚛️', color: '#f3e5f5' },
  { id: 'biology',     name: 'Biology',     category: 'Science',  icon: '🧬', color: '#e8f5e9' },
  { id: 'chemistry',   name: 'Chemistry',   category: 'Science',  icon: '🧪', color: '#fff3e0' },
  { id: 'civics',      name: 'Civics',      category: 'Social',   icon: '⚖️', color: '#e3f2fd' },
];

export default function SubjectsPage() {
  const navigate = useNavigate();

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <button onClick={() => navigate(-1)} style={iconBtn} aria-label="Go back">←</button>
        <span style={navTitle}>Select Subject</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={{ flex: 1, padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>
        {/*
          Mobile:  1 column (grid-2-col class handles the breakpoint upgrade)
          Tablet+: 2 columns  (via .grid-2-col in index.css)
          Desktop: 3 columns
        */}
        <div
          className="grid-2-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(8px, 2vw, 12px)',
          }}
        >
          {REAL_SUBJECTS.map(s => (
            <SubjectCard key={s.id} subject={s} onClick={() => navigate(`/subjects/${s.id}`)} />
          ))}
        </div>
      </main>

      <TabBar activeTab="exams" />
    </Screen>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 clamp(16px, 4vw, 24px)',
  height: 56,
  background: '#ffffff',
  borderBottom: '1px solid #e0e2ed',
  flexShrink: 0,
};
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23' };
const iconBtn  = { background: 'none', border: 'none', fontSize: 24, color: '#0058bc', cursor: 'pointer', minHeight: 44 };
