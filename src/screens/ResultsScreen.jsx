'use client';

import { useLocation, useNavigate } from '../lib/navigation';
import CircularRing from '../components/CircularRing';
import Card from '../components/Card';
import { StatChip } from '../components/StatChip';
import Button from '../components/Button';
import BottomTabBar from '../components/BottomTabBar';

export default function ResultsScreen() {
  const { state: navState } = useLocation();
  const navigate = useNavigate();

  const questions = navState?.questions ?? [];
  const answers   = navState?.answers   ?? {};

  const correct   = questions.filter(q => answers[q.id]?.isCorrect).length;
  const total     = questions.length;
  const score     = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed    = score >= 60;

  const ringColor = passed ? 'var(--color-accent)' : 'var(--color-error)';
  const scoreLabel = score >= 90 ? '🏆 Excellent!'
    : score >= 70 ? '🎉 Well done!'
    : score >= 50 ? '📚 Keep going!'
    : '💪 Try again!';

  // Rough time estimate (not tracked precisely in this version)
  const avgSecs = questions.length * 18;
  const mins    = Math.floor(avgSecs / 60);
  const secs    = avgSecs % 60;
  const timeStr = `${mins}m ${secs}s`;

  return (
    <div style={screenWrap}>

      {/* Header */}
      <header style={header}>
        <span style={{ font: 'var(--text-screen-title)', color: 'var(--color-text-primary)' }}>
          Results
        </span>
      </header>

      <main style={scrollContent}>

        {/* Score ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, paddingBottom: 28 }}>
          <CircularRing size={160} strokeWidth={14} value={score} color={ringColor}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: 'var(--text-stat)', fontSize: 40, letterSpacing: 'var(--ls-number)', color: ringColor }}>
                {score}%
              </div>
              <div style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                score
              </div>
            </div>
          </CircularRing>
          <p style={{ font: 'var(--text-card-title)', fontSize: 18, color: 'var(--color-text-primary)', marginTop: 20 }}>
            {scoreLabel}
          </p>
        </div>

        {/* Stat chips row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <StatChip icon="✓" value={`${correct}/${total}`} label="Correct"    variant={passed ? 'green' : 'neutral'} />
          <StatChip icon="⏱" value={timeStr}               label="Time"       variant="neutral" />
          <StatChip icon="📈" value={`+${Math.round(score * 0.1)}`} label="XP earned" variant="gold" />
        </div>

        {/* Per-question breakdown */}
        {questions.length > 0 && (
          <>
            <h3 style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 12 }}>
              Question Breakdown
            </h3>
            <Card padding="0" style={{ marginBottom: 24, overflow: 'hidden' }}>
              {questions.map((q, i) => {
                const ans = answers[q.id];
                const correct = ans?.isCorrect;
                return (
                  <div
                    key={q.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      borderBottom: i < questions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: correct ? 'var(--color-accent-tint)' : 'var(--color-error-tint)',
                      color: correct ? 'var(--color-accent)' : 'var(--color-error)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                    }}>
                      {correct ? '✓' : '✗'}
                    </span>
                    <span style={{
                      font: 'var(--text-body)', color: 'var(--color-text-primary)',
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {i + 1}. {q.text.slice(0, 70)}{q.text.length > 70 ? '…' : ''}
                    </span>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 80 }}>
          <Button full size="lg" onClick={() => navigate('/quiz/daily')}>
            Continue Practicing
          </Button>
          <Button full size="lg" variant="secondary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
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
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: 56, background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: '0 var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
