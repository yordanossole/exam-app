import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import SubjectCard from '../components/SubjectCard';

// Real subjects expected in the backend
const REAL_SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', category: 'Math', icon: '📐', color: '#fff3e0' },
  { id: 'english', name: 'English', category: 'Language', icon: '🌍', color: '#e3f2fd' },
  { id: 'amharic', name: 'Amharic', category: 'Language', icon: '🇪🇹', color: '#e8f5e9' },
  { id: 'physics', name: 'Physics', category: 'Science', icon: '⚛️', color: '#f3e5f5' },
  { id: 'biology', name: 'Biology', category: 'Science', icon: '🧬', color: '#e8f5e9' },
  { id: 'chemistry', name: 'Chemistry', category: 'Science', icon: '🧪', color: '#fff3e0' },
  { id: 'civics', name: 'Civics', category: 'Social', icon: '⚖️', color: '#e3f2fd' },
];

const CATEGORIES = ['All', 'Science', 'Math', 'Language', 'Social'];

export default function SubjectsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    REAL_SUBJECTS.filter(s => {
      const matchCat = category === 'All' || s.category === category;
      const matchName = s.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchName;
    }),
    [query, category]);

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <button onClick={() => navigate(-1)} style={iconBtn}>←</button>
        <span style={navTitle}>Select Subject</span>
        <div style={{ width: 32 }} />
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={searchBar}>
          <span style={{ color: '#717786' }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search subjects..."
            style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #e0e2ed',
                background: category === cat ? '#0058bc' : '#fff',
                color: category === cat ? '#fff' : '#414755',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {filtered.map(s => (
            <SubjectCard key={s.id} subject={s} onClick={() => navigate(`/subjects/${s.id}`)} />
          ))}
        </div>
      </main>

      <TabBar activeTab="exams" />
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23' };
const iconBtn = { background: 'none', border: 'none', fontSize: 24, color: '#0058bc' };
const searchBar = { display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: 8, padding: '10px 14px', marginBottom: 20 };
