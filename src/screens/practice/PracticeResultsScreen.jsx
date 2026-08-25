'use client';

import { useLocation, useNavigate } from '../../lib/navigation';
import Button from '../../components/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function PracticeResultsScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const result = state?.result;
  const exam = state?.exam;

  if (!result) {
    return (
      <main style={shell}>
        <div style={shellCentered}>
          <p>{t('common.noResult')}</p>
          <Button onClick={() => navigate('/practice')}>{t('common.backToExams')}</Button>
        </div>
      </main>
    );
  }

  return (
    <main style={shell}>
      <div style={content}>
        <p style={subtitle}>{result.answer_key_available ? t('results.correctCount', { correct: result.correct, total: result.total }) : t('results.answerPending')} · {exam?.subject_display ?? t('nav.exam')} {exam?.year_ec ? `${exam.year_ec} E.C.` : ''}</p>

        {!result.answer_key_available && <p style={pendingNotice}>{t('results.pendingNotice')}</p>}

        <section style={section}>
          <h2 style={sectionTitle}>{t('results.topicReport')}</h2>
          {result.topics.map(topic => (
            <div key={topic.topic} style={topicRow}>
              <span style={{ textTransform: 'capitalize' }}>{topic.topic.replaceAll('_', ' ')}</span>
              <strong>{topic.correct}/{topic.total} · {topic.score === null ? '—' : `${topic.score}%`}</strong>
            </div>
          ))}
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>{t('results.reviewQuestions')}</h2>
          {result.items.filter(item => !item.is_correct || item.needs_review).slice(0, 20).map(item => (
            <div key={item.question_id} style={reviewRow}>
              <span>Q{item.q_number}</span>
              <span>{item.topic.replaceAll('_', ' ')}</span>
              <strong>{item.is_correct === null ? t('results.notGraded') : item.is_correct ? t('results.flagged') : t('results.missed')}</strong>
            </div>
          ))}
        </section>

        <Button full size="lg" onClick={() => navigate('/practice')}>{t('common.backToExams')}</Button>
      </div>
    </main>
  );
}

const shell = { minHeight: 'var(--app-viewport-height)', maxWidth: 560, margin: '0 auto', background: 'var(--color-bg)' };
const content = { padding: '12px 16px 96px' };
const shellCentered = { ...content, minHeight: 'calc(var(--app-viewport-height) - var(--app-header-height))', display: 'grid', placeItems: 'center', gap: 12, textAlign: 'center' };
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center', margin: '0 0 24px' };
const pendingNotice = { font: 'var(--text-body)', color: 'var(--color-accent)', background: 'var(--color-accent-tint)', border: '1px solid var(--color-accent)', borderRadius: 12, padding: 12, marginBottom: 16 };
const section = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 16 };
const sectionTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)', marginBottom: 12 };
const topicRow = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)', font: 'var(--text-body-med)' };
const reviewRow = { display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)', font: 'var(--text-body-med)' };
