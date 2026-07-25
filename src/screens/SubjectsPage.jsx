'use client';

import { useNavigate } from '../lib/navigation';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', category: 'Math',     icon: '📐', color: '#FFF3E0' },
  { id: 'english',     name: 'English',     category: 'Language', icon: '🌍', color: '#E3F2FD' },
  { id: 'amharic',     name: 'Amharic',     category: 'Language', icon: '🇪🇹', color: '#E8F5E9' },
  { id: 'physics',     name: 'Physics',     category: 'Science',  icon: '⚛️', color: '#F3E5F5' },
  { id: 'biology',     name: 'Biology',     category: 'Science',  icon: '🧬', color: '#E8F5E9' },
  { id: 'chemistry',   name: 'Chemistry',   category: 'Science',  icon: '🧪', color: '#FFF9E0' },
  { id: 'civics',      name: 'Civics',      category: 'Social',   icon: '⚖️', color: '#EDE7F6' },
];

export default function SubjectsPage() {
  const navigate = useNavigate();

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={pageTitle}>Select Subject</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
          {SUBJECTS.map(s => (
            <Card key={s.id} onPress={() => navigate(`/quiz/category/${s.id}`)} padding="0">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)' }}>
                    {s.name}
                  </div>
                  <div style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {s.category}
                  </div>
                </div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 18, flexShrink: 0 }}>›</span>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ height: 80 }} />
      </main>

      <BottomTabBar />
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const pageHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  height: 56, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
};
const pageTitle = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const backBtn = {
  background: 'none', border: 'none', fontSize: 22,
  color: 'var(--color-accent)', cursor: 'pointer', minHeight: 44, minWidth: 44,
  display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
