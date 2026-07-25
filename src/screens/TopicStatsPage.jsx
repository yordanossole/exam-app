'use client';

import { useNavigate } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';
import CircularRing from '../components/CircularRing';
import ProgressBar from '../components/ProgressBar';
import { MOCK_STATS } from '../data/quizData';

export default function TopicStatsPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const stats = state.stats ?? MOCK_STATS;

  const overall  = stats?.overall_accuracy ?? stats?.accuracy ?? 0;
  const subjects = stats?.subject_stats ?? [];

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={pageTitle}>Performance</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>

        {/* Overall accuracy ring */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', marginBottom: 20 }}>
          <CircularRing size={140} strokeWidth={12} value={overall}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: 'var(--text-stat)', fontSize: 34, letterSpacing: 'var(--ls-number)', color: 'var(--color-accent)' }}>
                {overall}%
              </div>
              <div style={{ font: 'var(--text-body)', fontSize: 11, color: 'var(--color-text-secondary)' }}>
                overall
              </div>
            </div>
          </CircularRing>
          <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginTop: 16 }}>
            Overall Accuracy
          </p>
        </Card>

        {/* Breakdown */}
        <h3 style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 12 }}>
          Breakdown by Topic
        </h3>

        {subjects.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 36 }}>📈</span>
              <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginTop: 12, marginBottom: 6 }}>
                No data yet
              </p>
              <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
                Complete a quiz to see your topic breakdown.
              </p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
            {subjects.map((stat, i) => {
              const good = stat.accuracy > 70;
              return (
                <Card key={i}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ font: 'var(--text-body)', fontSize: 11, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 3 }}>
                        {stat.subject}
                      </p>
                      <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)' }}>
                        {stat.topic}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ font: 'var(--text-stat)', fontSize: 22, letterSpacing: 'var(--ls-number)', color: good ? 'var(--color-accent)' : 'var(--color-error)' }}>
                        {stat.accuracy}%
                      </div>
                      <div style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {stat.correct_count}/{stat.total_count} correct
                      </div>
                    </div>
                  </div>
                  <ProgressBar value={stat.accuracy} />
                </Card>
              );
            })}
          </div>
        )}

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
const pageTitle = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const backBtn = {
  background: 'none', border: 'none', fontSize: 22,
  color: 'var(--color-accent)', cursor: 'pointer', minHeight: 44, minWidth: 44,
  display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
