'use client';

import { useLocation, useNavigate } from '../../lib/navigation';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';

export default function PracticeResultsScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;
  const exam = state?.exam;

  if (!result) {
    return (
      <main style={shellCentered}>
        <BackButton fallback="/practice" label="Back to Exams" />
        <p>No result found.</p>
        <Button onClick={() => navigate('/practice')}>Back to Exams</Button>
      </main>
    );
  }

  return (
    <main style={shell}>
      <BackButton fallback="/practice" label="Back to Exams" />
      <h1 style={title}>{result.score === null ? '—' : `${result.score}%`}</h1>
      <p style={subtitle}>{result.answer_key_available ? `${result.correct} of ${result.total} correct` : 'Answer key review is still pending'} · {exam?.subject_display ?? 'Exam'} {exam?.year_ec ? `${exam.year_ec} E.C.` : ''}</p>

      {!result.answer_key_available && <p style={pendingNotice}>This database exam has not received its answer key yet, so this attempt is not scored.</p>}

      <section style={section}>
        <h2 style={sectionTitle}>Topic Report</h2>
        {result.topics.map(topic => (
          <div key={topic.topic} style={topicRow}>
            <span style={{ textTransform: 'capitalize' }}>{topic.topic.replaceAll('_', ' ')}</span>
            <strong>{topic.correct}/{topic.total} · {topic.score === null ? '—' : `${topic.score}%`}</strong>
          </div>
        ))}
      </section>

      <section style={section}>
        <h2 style={sectionTitle}>Questions for Review</h2>
        {result.items.filter(item => !item.is_correct || item.needs_review).slice(0, 20).map(item => (
          <div key={item.question_id} style={reviewRow}>
            <span>Q{item.q_number}</span>
            <span>{item.topic.replaceAll('_', ' ')}</span>
            <strong>{item.is_correct === null ? 'Not graded' : item.is_correct ? 'Flagged' : 'Missed'}</strong>
          </div>
        ))}
      </section>

      <Button full size="lg" onClick={() => navigate('/practice')}>Back to Exams</Button>
    </main>
  );
}

const shell = { minHeight: '100dvh', maxWidth: 560, margin: '0 auto', padding: '16px 16px 96px', background: 'var(--color-bg)' };
const shellCentered = { ...shell, display: 'grid', placeItems: 'center', gap: 12, textAlign: 'center' };
const title = { font: 'var(--text-stat)', fontSize: 56, color: 'var(--color-primary)', marginTop: 20, textAlign: 'center' };
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 24 };
const pendingNotice = { font: 'var(--text-body)', color: 'var(--color-accent)', background: 'var(--color-accent-tint)', border: '1px solid var(--color-accent)', borderRadius: 12, padding: 12, marginBottom: 16 };
const section = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 16 };
const sectionTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)', marginBottom: 12 };
const topicRow = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)', font: 'var(--text-body-med)' };
const reviewRow = { display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)', font: 'var(--text-body-med)' };
