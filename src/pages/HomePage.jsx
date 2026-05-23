import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function HomePage() {
  const { state } = useAppContext();
  const { user, stats } = state;
  const navigate = useNavigate();

  if (!user) return <Screen><div className="loader">Authenticating...</div></Screen>;

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <span style={navTitle}>Home</span>
        {user.active_subscription ? (
          <span style={{ fontSize: 12, color: 'gold', fontWeight: 'bold' }}>PRO</span>
        ) : (
          <button onClick={() => navigate('/upgrade')} style={{ fontSize: 13, background: '#0058bc', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4 }}>Upgrade</button>
        )}
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#181c23', marginBottom: 4 }}>
            Welcome back, {user.display_name.split(' ')[0]}!
          </div>
          <div style={{ fontSize: 15, color: '#414755' }}>Ready to continue learning?</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <StatCard value={stats?.overall_accuracy ? `${stats.overall_accuracy}%` : 'N/A'} label="Overall Accuracy" />
          <StatCard value={stats?.subject_stats?.length || 0} label="Subjects Tracked" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#181c23', margin: 0 }}>Your Performance</h3>
            <button
              onClick={() => navigate('/stats')}
              style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#0058bc', cursor: 'pointer' }}
            >
              Details
            </button>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed' }}>
            {stats?.subject_stats?.slice(0, 5).map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: i < stats.subject_stats.length - 1 ? '0.5px solid #e0e2ed' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#181c23' }}>{item.subject} - {item.topic}</div>
                  <div style={{ fontSize: 12, color: '#717786' }}>{item.total_count} questions answered</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: item.accuracy > 70 ? '#006e28' : '#bc000a' }}>{item.accuracy}%</div>
              </div>
            ))}
            {(!stats?.subject_stats || stats.subject_stats.length === 0) && (
              <div style={{ padding: 16, textAlign: 'center', color: '#717786' }}>Complete an exam to see stats!</div>
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
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed',
};
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
