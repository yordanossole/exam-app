import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/',        label: 'Home',     icon: '🏠' },
  { path: '/subjects', label: 'Practice', icon: '📋' },
  { path: '/stats',   label: 'Progress', icon: '📈' },
  { path: '/profile', label: 'Profile',  icon: '👤' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', maxWidth: 480, margin: '0 auto' }}>
        {TABS.map(tab => {
          const active =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 3,
                padding: '8px 0', minHeight: 56,
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 10, fontWeight: active ? 700 : 500,
                letterSpacing: 'var(--ls-label)', textTransform: 'uppercase',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color var(--duration-theme) ease',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
              {active && (
                <span style={{
                  position: 'absolute', bottom: 5,
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--color-accent)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
