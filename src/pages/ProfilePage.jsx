import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import Button from '../components/Button';

export default function ProfilePage() {
  const { state } = useAppContext();
  const { user } = state;
  const navigate = useNavigate();

  const sub = user?.active_subscription;

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <span style={navTitle}>Profile</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={{ flex: 1, padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>

        {/* Avatar + name — centred, scales up on wide screens */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'clamp(20px, 5vw, 32px) 0',
          marginBottom: 24,
        }}>
          <div style={{
            width: 'clamp(64px, 18vw, 96px)',
            height: 'clamp(64px, 18vw, 96px)',
            borderRadius: '50%',
            background: '#0058bc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(26px, 7vw, 38px)',
            color: '#ffffff',
            fontWeight: 600,
            marginBottom: 12,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : user?.display_name?.charAt(0) ?? '?'}
          </div>
          <div style={{ fontSize: 'clamp(17px, 4.5vw, 22px)', fontWeight: 600, color: '#181c23', marginBottom: 4 }}>
            {user?.display_name}
          </div>
          <div style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: '#717786' }}>
            {user?.role} Member
          </div>
        </div>

        {/* Subscription card */}
        <div style={card}>
          <div style={sectionLabel}>Your Subscription</div>
          {sub ? (
            <div>
              <div style={{ fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: 600, color: '#181c23' }}>
                {sub.plan_name}
              </div>
              <div style={{ fontSize: 14, color: '#006e28', fontWeight: 500, marginTop: 4 }}>
                Active until {new Date(sub.expires_at).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 15, color: '#181c23' }}>No active subscription.</div>
              <Button
                onClick={() => navigate('/upgrade')}
                style={{ marginTop: 12, padding: '8px 16px', fontSize: 14 }}
              >
                View Plans
              </Button>
            </div>
          )}
        </div>

        {/* Menu items */}
        <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          {[
            { icon: '🔔', label: 'Notifications' },
            { icon: '⚙️', label: 'Settings' },
            { icon: '❓', label: 'Help & Support' },
          ].map(item => (
            <button key={item.label} style={menuItem}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span style={{ marginLeft: 'auto', color: '#c1c6d7' }}>›</span>
            </button>
          ))}
        </div>
      </main>

      <TabBar activeTab="profile" />
    </Screen>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 clamp(16px, 4vw, 24px)',
  background: '#ffffff',
  borderBottom: '1px solid #e0e2ed',
  flexShrink: 0,
};
const navTitle  = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const card      = { background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: '0.75rem', padding: 20, marginBottom: 16 };
const sectionLabel = { fontSize: 13, fontWeight: 600, color: '#717786', textTransform: 'uppercase', marginBottom: 12 };
const menuItem  = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0 16px',
  width: '100%',
  background: 'none',
  border: 'none',
  borderBottom: '0.5px solid #e0e2ed',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 15,
  color: '#181c23',
  minHeight: 52,
};
