import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import Button from '../components/Button';

export default function ProfilePage() {
  const { state } = useAppContext();
  const { user } = state;
  const navigate = useNavigate();

  if (!user) return <Screen><div className="loader">Loading...</div></Screen>;

  const sub = user.active_subscription;

  return (
    <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
      <header style={navStyle}>
        <span style={navTitle}>Profile</span>
        <div style={{ width: 32 }} />
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0058bc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#ffffff', fontWeight: 600, marginBottom: 12 }}>
            {user.avatar_url ? <img src={user.avatar_url} alt="AV" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : user.display_name.charAt(0)}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#181c23', marginBottom: 4 }}>{user.display_name}</div>
          <div style={{ fontSize: 14, color: '#717786' }}>{user.role} Member</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: '0.75rem', padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#717786', textTransform: 'uppercase', marginBottom: 12 }}>Your Subscription</div>
          {sub ? (
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#181c23' }}>{sub.plan_name}</div>
              <div style={{ fontSize: 14, color: '#006e28', fontWeight: 500, marginTop: 4 }}>Active until {new Date(sub.expires_at).toLocaleDateString()}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 15, color: '#181c23' }}>No active subscription.</div>
              <Button onClick={() => navigate('/upgrade')} style={{ marginTop: 12, padding: '8px 16px', fontSize: 14 }}>View Plans</Button>
            </div>
          )}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: 24 }}>
          <button style={menuItemStyle}>
            <span>🔔</span> <span>Notifications</span> <span style={{ marginLeft: 'auto' }}>›</span>
          </button>
          <button style={menuItemStyle}>
            <span>⚙️</span> <span>Settings</span> <span style={{ marginLeft: 'auto' }}>›</span>
          </button>
          <button style={menuItemStyle}>
            <span>❓</span> <span>Help & Support</span> <span style={{ marginLeft: 'auto' }}>›</span>
          </button>
        </div>

        <Button variant="danger" full onClick={() => { localStorage.removeItem('auth_token'); window.location.reload(); }}>Sign Out</Button>
      </main>

      <TabBar activeTab="profile" />
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', width: '100%', background: 'none', border: 'none', borderBottom: '0.5px solid #e0e2ed', cursor: 'pointer', textAlign: 'left', fontSize: 15 };
