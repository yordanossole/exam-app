import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
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

// Subject tag colors rotate through the secondary palette
const TAG_COLORS = {
  mathematics: { bg: 'var(--tag-math)',    color: 'var(--nt-navy)'   },
  physics:     { bg: 'var(--tag-phys)',    color: 'var(--nt-violet)' },
  chemistry:   { bg: 'var(--tag-chem)',    color: '#7A6000'          },
  english:     { bg: 'var(--tag-english)', color: 'var(--nt-violet)' },
  biology:     { bg: 'var(--tag-bio)',     color: '#1A6040'          },
  civics:      { bg: 'var(--tag-civics)',  color: 'var(--nt-indigo)' },
};

export default function HomeScreen() {
  const { state } = useAppContext();
  const { theme } = useTheme();
  const user  = state.user;
  const stats = state.stats ?? MOCK_STATS;
  const navigate = useNavigate();
  const firstName = user?.display_name?.split(' ')[0] ?? 'there';

  const streak   = stats?.streak   ?? 0;
  const points   = stats?.points   ?? 0;
  const accuracy = stats?.accuracy ?? stats?.overall_accuracy ?? 0;

  const logoSrc = theme === 'dark'
    ? '/@Logos/nt-exams-dark.svg'
    : '/@Logos/nt-exams-light.svg';

  return (
    <div style={screenWrap}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={header}>
        <img src={logoSrc} alt="NT Exams" style={{ height: 28 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Grade badge */}
          <span className="grade-badge">Grade 12</span>
          <Avatar
            src={user?.avatar_url}
            name={user?.display_name ?? 'NT'}
            size={36}
            ring={streak > 0}
          />
        </div>
      </header>

      <main style={scrollContent}>

        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {getGreeting()}, {firstName}.
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--color-text-strong)', lineHeight: 1.2 }}>
            Ready to prepare for your national exam?
          </h1>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <StatChip value={streak}                  label="Day streak"  variant="orange" />
          <StatChip value={points.toLocaleString()} label="Points"      variant="blue"   />
          <StatChip value={`${accuracy}%`}          label="Accuracy"    variant="mint"   />
        </div>

        {/* ── Mock Exam hero (Warm CTA — Spark Orange) ──── */}
        <Card variant="default" style={{ marginBottom: 16, background: 'var(--color-bg)', border: '1.5px solid var(--color-accent)', overflow: 'hidden' }}>
          {/* Orange top bar */}
          <div style={{ height: 4, background: 'var(--gradient-ember)', borderRadius: '12px 12px 0 0', margin: '-20px -20px 16px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: 'var(--color-accent-tint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              📝
            </div>
            <Badge text="Timed · Full Exam" variant="orange" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-text-strong)', marginBottom: 4 }}>
            Grade 12 Mock Exam
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Mirrors the official national exam format. {DAILY_QUIZ.totalQuestions} questions, timed. Walk into exam day knowing you've already seen this.
          </p>
          <Button variant="warm" full size="lg" onClick={() => navigate('/quiz/daily')}>
            Start Mock Exam
          </Button>
        </Card>

        {/* ── Practice by Subject (Nova Blue CTAs) ───────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text-strong)' }}>
            Practice by Subject
          </h3>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Aligned to the Grade 12 syllabus
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
          {CATEGORIES.map(cat => {
            const tag = TAG_COLORS[cat.id] ?? { bg: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)' };
            return (
              <Card key={cat.id} onPress={() => navigate(`/quiz/category/${cat.id}`)} padding="0">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                  {/* Subject icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-icon)', flexShrink: 0,
                    background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>
                    {cat.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text-strong)' }}>
                        {cat.name}
                      </span>
                      {/* Subject tag chip */}
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-tag)',
                        background: tag.bg, color: tag.color,
                        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10,
                        letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                      }}>
                        {cat.category ?? 'Grade 12'}
                      </span>
                    </div>
                    <ProgressBar value={cat.progress} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      {cat.progress}% complete
                    </p>
                  </div>

                  <span style={{ color: 'var(--color-text-muted)', fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Evidence-based motivation */}
        <Card variant="tinted" style={{ marginTop: 20, marginBottom: 8 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            📈 Students who complete 6 or more practice exams improve their average national score by <strong style={{ color: 'var(--color-primary)' }}>18%</strong>. You've completed {stats?.subject_stats?.length ?? 0} so far.
          </p>
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
const header = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '12px var(--screen-pad)',
  height: 60,
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
