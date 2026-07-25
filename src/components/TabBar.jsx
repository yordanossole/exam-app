import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Home',    icon: '🏠', path: '/' },
  { label: 'Exams',   icon: '📋', path: '/subjects' },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

export default function TabBar({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={navWrap}>
      {/* inner div mirrors Screen's max-width so tabs align with content */}
      <div style={navInner}>
        {tabs.map(tab => {
          const active =
            location.pathname === tab.path ||
            (tab.path !== '/' && location.pathname.startsWith(tab.path));
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                color: active ? '#0058bc' : '#717786',
                cursor: 'pointer',
                /* 44px minimum touch target height */
                minHeight: 44,
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 22 }} aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const navWrap = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  background: '#ffffff',
  borderTop: '1px solid #e0e2ed',
  /* respect iPhone home indicator */
  paddingBottom: 'env(safe-area-inset-bottom)',
};

const navInner = {
  display: 'flex',
  width: '100%',
  maxWidth: 1024,
  margin: '0 auto',
};
