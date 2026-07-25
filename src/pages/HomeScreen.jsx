import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';
import { StatChip, Badge } from '../components/StatChip';
import Avatar from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { MOCK_STATS, CATEGORIES, DAILY_QUIZ } from '../data/quizData';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function IconBadge({ bg, icon, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.46 }}>{icon}</span>
    </div>
  );
}

export default function HomeScreen() {
  const { state } = useAppContext();
  const user  = state.user;
  const stats = state.stats ?? MOCK_STATS;
  const navigate = useNavigate();
  const firstName = user?.display_name?.split(' ')[0] ?? 'there';

  // Safe fallbacks so we never crash on missing / null fields
  const streak   = stats?.streak   ?? 0;
  const points   = stats?.points   ?? 0;
  const accuracy = stats?.accuracy ?? stats?.overall_accuracy ?? 0;

  return (
    <div style={screenWrap}>
      {/* Header */}
      <header style={header}>
        <div>
          <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>
            {getGreeting()},
          </p>
          <h1 style={{ font: 'var(--text-screen-title)', color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
            {firstName} 👋
          </h1>
        </div>
        <Avatar src={user?.avatar_url} name={user?.display_name ?? 'U'} size={44} ring={streak > 0} />
      </header>

      <main style={scrollContent}>
        {/* Streak strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <StatChip icon="🔥" value={streak}                    label="Day streak" variant="gold"    />
          <StatChip icon="⭐" value={points.toLocaleString()}   label="Points"     variant="green"   />
          <StatChip icon="🎯" value={`${accuracy}%`}            label="Accuracy"   variant="neutral" />
        </div>

        {/* Hero — Daily Quiz */}
        <Card hero onPress={() => navigate('/quiz/daily')} style={{ marginBottom: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <IconBadge bg="var(--color-accent-tint)" icon="⭐" />
            <Badge text="New today" variant="green" />
          </div>
          <h2 style={{ font: 'var(--text-card-title)', fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            Daily Challenge
          </h2>
          <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Mixed subjects — {DAILY_QUIZ.totalQuestions} questions
          </p>
          <Button full size="lg" onClick={() => navigate('/quiz/daily')}>
            Start Daily Quiz
          </Button>
        </Card>

        {/* Category cards */}
        <h3 style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 12 }}>
          Practice by Subject
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
          {CATEGORIES.map(cat => (
            <Card key={cat.id} onPress={() => navigate(`/quiz/category/${cat.id}`)} padding="0">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                <IconBadge bg={cat.color} icon={cat.icon} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)' }}>
                      {cat.name}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: cat.progress >= 70 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      letterSpacing: 'var(--ls-number)',
                    }}>
                      {cat.progress}%
                    </span>
                  </div>
                  <ProgressBar value={cat.progress} />
                </div>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 18, flexShrink: 0 }}>›</span>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ height: 80 }} />
      </main>

      <BottomTabBar />
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)', position: 'relative',
};
const header = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '20px var(--screen-pad) 14px',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
