import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';

export default function TopicStatsPage() {
  const { state } = useAppContext();
  const { stats } = state;
  const navigate = useNavigate();

  if (!stats) {
    return <Screen><div className="loader">Loading stats...</div></Screen>;
  }

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={titleStyle}>Detailed Performance</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={{ padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>

        {/* Summary card */}
        <div style={summaryCard}>
          <div style={{ fontSize: 'clamp(36px, 10vw, 52px)', fontWeight: 700, color: '#0058bc', lineHeight: 1 }}>
            {stats.overall_accuracy}%
          </div>
          <div style={{ color: '#717786', fontSize: 'clamp(13px, 3.5vw, 15px)', marginTop: 6 }}>
            Overall Accuracy
          </div>
        </div>

        <h3 style={{ fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: 600, color: '#181c23', marginBottom: 16 }}>
          Breakdown by Topic
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.subject_stats.map((stat, i) => (
            <div key={i} style={statRow}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={subjectLabel}>{stat.subject}</div>
                <div style={topicLabel}>{stat.topic}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ ...accLabel, color: stat.accuracy > 70 ? '#006e28' : '#bc000a' }}>
                  {stat.accuracy}%
                </div>
                <div style={countLabel}>{stat.correct_count}/{stat.total_count} correct</div>
              </div>
            </div>
          ))}
          {stats.subject_stats.length === 0 && (
            <div style={{ textAlign: 'center', color: '#717786', padding: 24, fontSize: 15 }}>
              No data yet. Complete an exam to see your stats.
            </div>
          )}
        </div>
      </main>

      <TabBar />
    </Screen>
  );
}

const navHeader  = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 clamp(16px, 4vw, 24px)',
  background: '#fff',
  borderBottom: '1px solid #e0e2ed',
  flexShrink: 0,
};
const backBtn    = { background: 'none', border: 'none', fontSize: 24, color: '#0058bc', cursor: 'pointer', minHeight: 44 };
const titleStyle = { fontSize: 17, fontWeight: 600, color: '#181c23' };
const summaryCard = {
  background: '#fff',
  borderRadius: '1rem',
  padding: 'clamp(20px, 5vw, 32px)',
  textAlign: 'center',
  border: '1px solid #e0e2ed',
  marginBottom: 24,
};
const statRow    = {
  background: '#fff',
  borderRadius: 12,
  padding: 'clamp(12px, 3vw, 16px)',
  border: '1px solid #e0e2ed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};
const subjectLabel = { fontSize: 12, fontWeight: 600, color: '#0058bc', textTransform: 'uppercase', marginBottom: 2 };
const topicLabel   = { fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 500, color: '#181c23' };
const accLabel     = { fontSize: 'clamp(16px, 4.5vw, 20px)', fontWeight: 700 };
const countLabel   = { fontSize: 12, color: '#717786' };
