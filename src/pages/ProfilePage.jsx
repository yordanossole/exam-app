import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import Button from '../components/Button';

const settingsGroups = [
  {
    label: 'Account',
    items: [
      { icon: '👤', label: 'Edit Profile'       },
      { icon: '🔔', label: 'Notifications'      },
      { icon: '🔒', label: 'Privacy & Security' },
    ],
  },
  {
    label: 'Support',
    items: [
      { icon: '❓', label: 'Help Center'           },
      { icon: '📄', label: 'Terms & Privacy Policy' },
    ],
  },
];

export default function ProfilePage() {
  const { state } = useAppContext();
  const { user, subjectProgress } = state;

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <span style={navTitle}>Profile</span>
        <button aria-label="Settings" style={iconBtn}>⚙️</button>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0058bc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#ffffff', fontWeight: 600, marginBottom: 12 }}>
            {user.avatar}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#181c23', marginBottom: 4 }}>{user.name}</div>
          <div style={{ fontSize: 14, color: '#717786' }}>{user.email}</div>
        </div>

        {/* Subject progress */}
        <div style={{ background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: '0.75rem', padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#181c23', marginBottom: 12 }}>Subject Progress</div>
          {subjectProgress.map(({ subject, progress }) => (
            <div key={subject} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: '#414755', flex: 1 }}>{subject}</span>
              <div style={{ flex: 2, height: 6, background: '#e0e2ed', borderRadius: 9999, margin: '0 12px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#006e28', borderRadius: 9999 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#006e28', width: 36, textAlign: 'right' }}>{progress}%</span>
            </div>
          ))}
        </div>

        {/* Settings groups */}
        {settingsGroups.map(group => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#717786', marginBottom: 8, paddingLeft: 4 }}>
              {group.label}
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e0e2ed', borderRadius: '0.75rem', overflow: 'hidden' }}>
              {group.items.map((item, i) => (
                <button
                  key={item.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', width: '100%', background: 'none',
                    border: 'none', borderBottom: i < group.items.length - 1 ? '0.5px solid #e0e2ed' : 'none',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f3fe'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 15, color: '#181c23', textAlign: 'left' }}>{item.label}</span>
                  <span style={{ color: '#c1c6d7', fontSize: 16 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <Button variant="danger" full>Sign Out</Button>
      </main>

      <TabBar />
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const iconBtn  = { background: 'none', border: 'none', fontSize: 18, color: '#0058bc', cursor: 'pointer' };
