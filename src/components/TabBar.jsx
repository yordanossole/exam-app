import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Home',    icon: '🏠', path: '/'        },
  { label: 'Exams',   icon: '📋', path: '/subjects' },
  { label: 'Profile', icon: '👤', path: '/profile'  },
];

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        display: 'flex', background: '#ffffff',
        borderTop: '1px solid #e0e2ed', padding: '8px 0 4px',
      }}
    >
      {tabs.map(tab => {
        const active = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, background: 'none', border: 'none',
              fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              color: active ? '#0058bc' : '#717786', cursor: 'pointer', padding: '4px 0',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
