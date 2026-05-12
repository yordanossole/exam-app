import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjects } from '../data/mockData';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import SubjectCard from '../components/SubjectCard';

const CATEGORIES = ['All', 'Science', 'Math', 'History'];

export default function SubjectsPage() {
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(() =>
    subjects.filter(s => {
      const matchCat  = category === 'All' || s.category === category;
      const matchName = s.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchName;
    }),
  [query, category]);

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <button aria-label="Go back" onClick={() => navigate(-1)} style={iconBtn}>←</button>
        <span style={navTitle}>Select Subject</span>
        <button aria-label="Search" style={iconBtn}>🔍</button>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <p style={{ fontSize: 15, color: '#414755', marginBottom: 16 }}>
          Choose a topic to start your practice exam
        </p>

        <div style={searchBar}>
          <span style={{ color: '#717786' }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search subjects..."
            aria-label="Search subjects"
            style={{ border: 'none', outline: 'none', fontSize: 15, color: '#181c23', background: 'transparent', width: '100%', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        <div role="group" aria-label="Filter by category" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              style={{
                padding: '6px 16px', borderRadius: 9999, fontSize: 14, fontWeight: 500,
                border: `1px solid ${category === cat ? '#0058bc' : '#c1c6d7'}`,
                background: category === cat ? '#0058bc' : '#ffffff',
                color: category === cat ? '#ffffff' : '#414755',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed' }}
             role="list" aria-label="Subject list">
          {filtered.length === 0
            ? <p style={{ padding: 20, color: '#717786', fontSize: 15, textAlign: 'center' }}>No subjects found.</p>
            : filtered.map(s => (
                <div key={s.id} role="listitem">
                  <SubjectCard subject={s} onClick={() => navigate(`/subjects/${s.id}`)} />
                </div>
              ))
          }
        </div>
      </main>

      <TabBar />
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const iconBtn  = { background: 'none', border: 'none', fontSize: 20, color: '#0058bc', cursor: 'pointer', fontFamily: 'Inter, sans-serif' };
const searchBar = { display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #c1c6d7', borderRadius: '0.5rem', padding: '10px 14px', marginBottom: 16 };
