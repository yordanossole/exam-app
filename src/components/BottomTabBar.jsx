import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { path: '/',           label: 'Home',      iconActive: '⊟',  iconInactive: '⊟'  },
  { path: '/subjects',   label: 'Practice',  iconActive: '📋',  iconInactive: '📋'  },
  { path: '/stats',      label: 'Progress',  iconActive: '📈',  iconInactive: '📈'  },
  { path: '/profile',    label: 'Profile',   iconActive: '●',   iconInactive: '○'   },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          maxWidth: 480,
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
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
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 0',
                minHeight: 52,
                background: 'none',
                border: 'none',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: 'var(--ls-label)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color var(--duration-theme) ease',
              }}
            >
              {/* Icon */}
              <span
                style={{
                  fontSize: 22,
                  lineHeight: 1,
                  filter: active ? 'none' : 'grayscale(0.4) opacity(0.7)',
                }}
                aria-hidden="true"
              >
                {active ? tab.iconActive : tab.iconInactive}
              </span>
              {tab.label}
              {/* Active dot indicator */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Theme toggle — lives at the right edge of the tab bar */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '8px 12px',
            minHeight: 52,
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 'var(--ls-label)',
            textTransform: 'uppercase',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
}
