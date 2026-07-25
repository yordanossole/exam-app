'use client';

import { useNavigate } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function HomePage() {
  const { state } = useAppContext();
  const { user, stats } = state;
  const navigate = useNavigate();

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <span style={navTitle}>Home</span>
        {user?.active_subscription ? (
          <span style={{ fontSize: 12, color: 'gold', fontWeight: 'bold' }}>PRO</span>
        ) : (
          <button
            onClick={() => navigate('/upgrade')}
            style={{
              fontSize: 13,
              background: '#0058bc',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 4,
              minHeight: 44,
              cursor: 'pointer',
            }}
          >
            Upgrade
          </button>
        )}
      </header>

      <main style={{ flex: 1, padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 600, color: '#181c23', marginBottom: 4 }}>
            Welcome back, {user?.display_name?.split(' ')[0]}!
          </div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#414755' }}>
            Ready to continue learning?
          </div>
        </div>

        {/* Stat cards — 2 col on all sizes, wider on tablet+ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(8px, 2vw, 16px)',
          marginBottom: 24,
        }}>
          <StatCard
            value={stats?.overall_accuracy ? `${stats.overall_accuracy}%` : 'N/A'}
            label="Overall Accuracy"
          />
          <StatCard
            value={stats?.subject_stats?.length || 0}
            label="Subjects Tracked"
          />
        </div>

        {/* Performance section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 600, color: '#181c23', margin: 0 }}>
              Your Performance
            </h3>
            <button
              onClick={() => navigate('/stats')}
              style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#0058bc', cursor: 'pointer', minHeight: 44 }}
            >
              Details
            </button>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed' }}>
            {stats?.subject_stats?.slice(0, 5).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(12px, 3vw, 16px)',
                  borderBottom: i < stats.subject_stats.length - 1 ? '0.5px solid #e0e2ed' : 'none',
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 500,
                    color: '#181c23',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.subject} - {item.topic}
                  </div>
                  <div style={{ fontSize: 12, color: '#717786' }}>{item.total_count} questions answered</div>
                </div>
                <div style={{
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  fontWeight: 600,
                  color: item.accuracy > 70 ? '#006e28' : '#bc000a',
                  flexShrink: 0,
                }}>
                  {item.accuracy}%
                </div>
              </div>
            ))}
            {(!stats?.subject_stats || stats.subject_stats.length === 0) && (
              <div style={{ padding: 16, textAlign: 'center', color: '#717786', fontSize: 14 }}>
                Complete an exam to see stats!
              </div>
            )}
          </div>
        </div>

        <Button variant="primary" full onClick={() => navigate('/subjects')}>
          Start New Exam →
        </Button>
      </main>

      <TabBar activeTab="home" />
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
const navTitle = {
  fontSize: 17,
  fontWeight: 600,
  color: '#181c23',
  fontFamily: 'Inter, sans-serif',
};
