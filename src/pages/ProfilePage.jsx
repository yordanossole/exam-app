import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { MOCK_STATS } from '../data/quizData';
import { StatChip } from '../components/StatChip';

const MENU_ITEMS = [
  { icon: '🔔', label: 'Notifications',  path: '/notifications' },
  { icon: '⚙️',  label: 'Settings',       path: '/settings' },
  { icon: '❓', label: 'Help & Support', path: '/help' },
  { icon: '📊', label: 'Detailed Stats', path: '/stats' },
  { icon: '⬆️', label: 'Upgrade Plan',  path: '/upgrade' },
];

export default function ProfilePage() {
  const { state } = useAppContext();
  const { user } = state;
  const stats = state.stats ?? MOCK_STATS;
  const navigate = useNavigate();

  const sub      = user?.active_subscription;
  const streak   = stats?.streak   ?? 0;
  const points   = stats?.points   ?? 0;
  const accuracy = stats?.accuracy ?? stats?.overall_accuracy ?? 0;

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <span style={pageTitle}>Profile</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>

        {/* Avatar section */}
        <div style={avatarSection}>
          <Avatar
            src={user?.avatar_url}
            name={user?.display_name ?? 'U'}
            size={80}
            ring={streak > 0}
          />
          <div style={{ font: 'var(--text-screen-title)', fontSize: 20, color: 'var(--color-text-primary)', marginTop: 14, marginBottom: 4 }}>
            {user?.display_name ?? 'Guest'}
          </div>
          <div style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
            {user?.role ?? 'Free'} Member
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <StatChip icon="🔥" value={streak}                  label="Streak"   variant="gold"    />
          <StatChip icon="⭐" value={points.toLocaleString()} label="Points"   variant="green"   />
          <StatChip icon="🎯" value={`${accuracy}%`}          label="Accuracy" variant="neutral" />
        </div>

        {/* Subscription card */}
        <Card style={{ marginBottom: 16 }}>
          <p style={sectionLabel}>Subscription</p>
          {sub ? (
            <>
              <p style={{ font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' }}>
                {sub.plan_name}
              </p>
              <p style={{ font: 'var(--text-body)', color: 'var(--color-accent)', fontWeight: 600, marginTop: 4 }}>
                Active until {new Date(sub.expires_at).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                No active subscription.
              </p>
              <Button size="sm" onClick={() => navigate('/upgrade')}>View Plans</Button>
            </>
          )}
        </Card>

        {/* Menu items */}
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 24 }}>
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 16px', width: '100%', minHeight: 52,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                textAlign: 'left',
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

      <BottomTabBar />
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const pageHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  height: 56, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const pageTitle    = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
const avatarSection = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  paddingTop: 24, paddingBottom: 24, marginBottom: 20,
};
const sectionLabel = {
  font: 'var(--text-body)', fontSize: 12, fontWeight: 700,
  letterSpacing: 'var(--ls-label)', textTransform: 'uppercase',
  color: 'var(--color-text-secondary)', marginBottom: 10,
};
