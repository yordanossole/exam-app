'use client';

import { useNavigate, useLocation } from '../lib/navigation';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
  { path: '/',         labelKey: 'nav.home',    icon: '⊞' },
  { path: '/practice', labelKey: 'nav.exams',   icon: '📝' },
  { path: '/profile',  labelKey: 'nav.profile', icon: '👤' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t('nav.main')}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', maxWidth: 480, margin: '0 auto' }}>
        {TABS.map(tab => {
          const label = t(tab.labelKey);
          const active =
            tab.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 3,
                padding: '8px 0', minHeight: 56,
                background: 'none', border: 'none', cursor: 'pointer',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: 10, fontWeight: active ? 700 : 600,
                letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color var(--duration-theme) ease',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
                {tab.icon}
              </span>
              {label}
              {active && (
                <span style={{
                  position: 'absolute', bottom: 4,
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--color-primary)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
