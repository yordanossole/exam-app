import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function HomePage() {
  const { state } = useAppContext();
  const { user, stats, recentActivity } = state;
  const navigate = useNavigate();

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <span style={navTitle}>Home</span>
        <button aria-label="Notifications" style={iconBtn}>🔔</button>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#181c23', marginBottom: 4 }}>
            Welcome back, {user.name.split(' ')[0]}!
          </div>
          <div style={{ fontSize: 15, color: '#414755' }}>Ready to continue learning?</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <StatCard value={stats.examsCompleted} label="Exams Completed" />
          <StatCard value={`${stats.avgScore}%`}  label="Average Score"   />
          <StatCard value={stats.streak}           label="Study Streak"    />
          <StatCard value={stats.studyTime}        label="Study Time"      />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#181c23' }}>Recent Activity</span>
          <button style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#0058bc', cursor: 'pointer' }}>
            View All
          </button>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed', marginBottom: 24 }}>
          {recentActivity.map((item, i) => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: i < recentActivity.length - 1 ? '0.5px solid #e0e2ed' : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#181c23', marginBottom: 2 }}>{item.exam}</div>
                <div style={{ fontSize: 13, color: '#717786' }}>Completed {item.time}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#006e28' }}>{item.score}%</div>
            </div>
          ))}
        </div>

        <Button variant="primary" full onClick={() => navigate('/subjects')}>
          Start New Exam →
        </Button>
      </main>

      <TabBar />
    </Screen>
  );
}

const navStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed',
};
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const iconBtn   = { background: 'none', border: 'none', fontSize: 20, color: '#0058bc', cursor: 'pointer' };
