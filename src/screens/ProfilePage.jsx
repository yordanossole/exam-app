'use client';

import { useNavigate } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';

const SETTINGS_ITEMS = [
  { icon: '🔔', label: 'Notifications',  path: '/notifications' },
  { icon: '⚙️',  label: 'Settings',       path: '/settings' },
  { icon: '❓', label: 'Help & Support', path: '/help' },
  { icon: '📊', label: 'Detailed Stats', path: '/stats' },
  { icon: '⬆️', label: 'Upgrade Plan',  path: '/upgrade' },
];

export default function ProfilePage() {
  const { state } = useAppContext();
  const { user } = state;
  const stats = state.stats;
  const navigate = useNavigate();
  const streak = stats?.streak ?? 0;

  return (
    <div style={screenWrap}>
      <main style={scrollContent}>
        {/* Avatar + name */}
        <div style={avatarSection}>
          <Avatar src={user?.avatar_url} name={user?.display_name ?? 'U'} size={72} ring={streak > 0} />
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)', marginTop: 12 }}>
            {user?.display_name ?? 'Guest'}
          </p>
          <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {user?.role ?? 'Free'} Member
          </p>
        </div>

        {/* Settings menu */}
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 24 }}>
          {SETTINGS_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 16px', width: '100%', minHeight: 52,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < SETTINGS_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                textAlign: 'left', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', flex: 1 }}>
                {item.label}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>›</span>
            </button>
          ))}
        </Card>
        <div style={{ height: 80 }} />
      </main>
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
const avatarSection = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  paddingTop: 24, paddingBottom: 24,
};
