import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Exams', icon: '📋', path: '/subjects' },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

export default function TabBar({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      style={{
        display: 'flex', background: '#ffffff',
        borderTop: '1px solid #e0e2ed', padding: '8px 0 env(safe-area-inset-bottom)',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100
      }}
    >
      {tabs.map(tab => {
        const active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, background: 'none', border: 'none',
              fontSize: 11, fontWeight: active ? 600 : 500,
              color: active ? '#0058bc' : '#717786', cursor: 'pointer', padding: '4px 0',
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
