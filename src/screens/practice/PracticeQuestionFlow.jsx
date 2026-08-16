'use client';

import { useMemo, useState } from 'react';
import { useNavigate } from '../../lib/navigation';
import { useAppContext } from '../../context/AppContext';
import { getPaidGrade } from '../../lib/subscription';
import Button from '../../components/Button';
import QuestionNavigator from '../../components/QuestionNavigator';
import { useLanguage } from '../../context/LanguageContext';

function parseTableRows(tableContent) {
  return String(tableContent || '')
    .split(/\r?\n/)
    .map(row => row.split('|').map(cell => cell.trim()))
    .filter(row => row.some(Boolean));
}

function MediaBlock({ media }) {
  if (!media) return null;

  if (media.media_type === 'table' && media.table_content) {
    const rows = parseTableRows(media.table_content);
    const [head, ...body] = rows;
    return (
      <figure style={mediaWrap}>
        {media.caption && <figcaption style={caption}>{media.caption}</figcaption>}
        <table style={tableStyle}>
          {head && (
            <thead>
              <tr>{head.map((cell, index) => <th key={index} style={thStyle} dir="auto">{cell}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={tdStyle} dir="auto">{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </figure>
    );
  }

  const src = media.file_name && media.folder ? `/assets/${media.folder}/${media.file_name}` : null;
  return (
    <figure style={mediaWrap}>
      {src ? <img src={src} alt={media.alt_text || media.caption || ''} style={imageStyle} /> : null}
      <figcaption style={caption}>{media.caption || media.alt_text || media.media_id}</figcaption>
    </figure>
  );
}

function PassageBlock({ passage }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const content = passage?.content || '';
  const canCollapse = content.length > 360 || content.split(/\r?\n/).length > 5;

  if (!content) return null;

  return (
    <article style={passageCard} dir="auto">
      {passage.passage_title && <h2 style={passageTitle}>{passage.passage_title}</h2>}
      <p style={{ ...passageText, ...(canCollapse && !expanded ? passagePreview : {}) }}>{content}</p>
      {canCollapse && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(current => !current)}
          style={passageToggle}
        >
          {expanded ? t('question.showLess') : t('question.showMore')}
        </button>
      )}
    </article>
  );
}

function OptionContent({ value, media }) {
  if (value === 'IMAGE' && media) {
    return (
      <span style={{ display: 'grid', gap: 8 }}>
        <MediaBlock media={media} />
      </span>
    );
  }

  return <span dir="auto">{value}</span>;
}

export default function PracticeQuestionFlow({ exam, questions }) {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionStatuses, setQuestionStatuses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const savedSelection = answers[question.question_id] ?? null;
  const selectedLetter = selected ?? savedSelection;
  const shouldShowReview = Boolean(question.needs_review) || !question.content.answer.correct_answer;

  const optionEntries = useMemo(
    () => Object.entries(question.content.options).filter(([, value]) => value !== null && value !== ''),
    [question]
  );

  if (getPaidGrade(state.user) !== exam.grade) {
    return (
      <main style={shell}>
        <section style={unavailableCard}>
          <h1 style={questionText}>{t('question.notIncluded')}</h1>
          <button onClick={() => navigate('/practice')} style={backButton}>{t('common.backToMyExams')}</button>
        </section>
      </main>
    );
  }

  function jumpTo(nextIndex) {
    const boundedIndex = Math.max(0, Math.min(questions.length - 1, nextIndex));
    const nextQuestion = questions[boundedIndex];
    setIndex(boundedIndex);
    setSelected(answers[nextQuestion.question_id] ?? null);
    setFeedback(null);
    setReportOpen(false);
    setReportText('');
    setReportSubmitted(false);
    setReportError('');
  }

  async function submitReport() {
    const message = reportText.trim();
    if (!message) {
      setReportError(t('question.reportRequired'));
      return;
    }

    setReportSubmitting(true);
    setReportError('');
    try {
      const response = await fetch(`/api/exams/${exam.exam_id}/questions/${question.question_id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Report failed');
      setReportSubmitted(true);
      setReportText('');
    } catch {
      setReportError(t('question.reportFailed'));
    } finally {
      setReportSubmitting(false);
    }
  }

  function saveCurrentAnswer(letter = selectedLetter) {
    if (!letter) return answers;
    const nextAnswers = { ...answers, [question.question_id]: letter };
    setAnswers(nextAnswers);
    setQuestionStatuses(currentStatuses => ({
      ...currentStatuses,
      [question.question_id]: currentStatuses[question.question_id] === 'correct' || currentStatuses[question.question_id] === 'wrong'
        ? currentStatuses[question.question_id]
        : 'answered',
    }));
    return nextAnswers;
  }

  async function checkAnswer(revealExplanation = false) {
    if (!selectedLetter) return;
    setChecking(true);
    const nextAnswers = saveCurrentAnswer(selectedLetter);
    try {
      const response = await fetch(`/api/exams/${exam.exam_id}/questions/${question.question_id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: selectedLetter, revealExplanation }),
      });
      const result = await response.json();
      setQuestionStatuses(currentStatuses => ({
        ...currentStatuses,
        [question.question_id]: result.answer_key_available === false ? 'answered' : result.is_correct ? 'correct' : 'wrong',
      }));
      setFeedback({ ...result, answers: nextAnswers });
    } finally {
      setChecking(false);
    }
  }

  async function submit(nextAnswers = answers) {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/exams/${exam.exam_id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const { result } = await response.json();
      navigate('/practice/results', { state: { result, exam } });
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    const nextAnswers = saveCurrentAnswer();
    if (isLast) {
      submit(nextAnswers);
    } else {
      jumpTo(index + 1);
    }
  }

  return (
    <main style={shell}>
      <header style={topBar}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <QuestionNavigator questions={questions} currentIndex={index} answers={answers} statuses={questionStatuses} onSelect={jumpTo} />
        </div>
      </header>

      <section style={content}>
        <PassageBlock key={question.question_id} passage={question.passage} />

        <article style={questionCard}>
          <div style={questionMeta}>
            <span>{t('question.number', { number: question.q_number })}</span>
            {question.topic && <span>{question.topic}</span>}
            {shouldShowReview && <span style={reviewBadge}>{t('question.review')}</span>}
          </div>
          <p style={questionText} dir="auto">{question.question_text}</p>
          {question.media.map(media => <MediaBlock key={media.media_id} media={media} />)}
        </article>

        <section style={optionsWrap}>
          {optionEntries.map(([letter, value]) => {
            const active = selectedLetter === letter;
            const optionMedia = question.option_media?.[letter];
            return (
              <button
                key={letter}
                onClick={() => {
                  setSelected(letter);
                  setAnswers(currentAnswers => ({ ...currentAnswers, [question.question_id]: letter }));
                  setQuestionStatuses(currentStatuses => ({ ...currentStatuses, [question.question_id]: 'answered' }));
                  setFeedback(null);
                }}
                style={{
                  ...optionButton,
                  borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                  background: active ? 'var(--color-primary-tint)' : 'var(--color-surface)',
                }}
              >
                <span style={optionLetter}>{letter}</span>
                <OptionContent value={value} media={optionMedia} />
              </button>
            );
          })}
        </section>

        <div style={{ display: 'grid', gap: 10 }}>
          {feedback?.hint && !feedback?.explanation && (
            <article style={hintCard} dir="auto">
              <strong>{t('question.hint')}</strong>
              <p>{feedback.hint || t('question.noHint')}</p>
              <Button full variant="secondary" onClick={() => checkAnswer(true)}>{t('question.showExplanation')}</Button>
            </article>
          )}
          {feedback?.explanation != null && (
            <article style={feedback.is_correct ? correctCard : hintCard} dir="auto">
              <strong>{feedback.is_correct ? t('question.correct') : t('question.explanation')}</strong>
              <p>{feedback.explanation || t('question.noExplanation')}</p>
            </article>
          )}
          {feedback?.answer_key_available === false && (
            <article style={hintCard} dir="auto">
              <strong>{t('question.answerPending')}</strong>
              <p>{t('question.answerPendingBody')}</p>
            </article>
          )}
        </div>

        <section style={reportWrap}>
          <button type="button" onClick={() => setReportOpen(open => !open)} style={reportButton}>
            <span aria-hidden="true">⚑</span> {t('question.report')}
          </button>
          {reportOpen && !reportSubmitted && (
            <div style={reportPanel}>
              <p style={reportPrompt}>{t('question.reportPrompt')}</p>
              <textarea
                value={reportText}
                onChange={event => setReportText(event.target.value)}
                placeholder={t('question.reportPlaceholder')}
                aria-label={t('question.reportPlaceholder')}
                rows={4}
                style={reportInput}
              />
              {reportError && <p style={reportErrorText}>{reportError}</p>}
              <Button size="sm" disabled={reportSubmitting} onClick={submitReport}>
                {reportSubmitting ? t('question.reportSending') : t('question.reportSend')}
              </Button>
            </div>
          )}
          {reportSubmitted && <p style={reportSuccess}>{t('question.reportSuccess')}</p>}
        </section>

        <div style={{ height: 160 }} />
      </section>

      <footer style={footer}>
        <Button
          variant="ghost"
          style={{ ...footerButton, background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)' }}
          disabled={index === 0}
          onClick={() => jumpTo(index - 1)}
        >
          {t('common.back')}
        </Button>
        <Button
          variant="secondary"
          style={footerButton}
          disabled={!selectedLetter || checking}
          onClick={() => checkAnswer(false)}
        >
          {checking ? t('question.checking') : t('question.check')}
        </Button>
        <Button style={footerButton} disabled={submitting} onClick={next}>{isLast ? t('question.submit') : t('question.next')}</Button>
      </footer>
    </main>
  );
}

const shell = { height: 'calc(100dvh - 64px)', minHeight: 0, maxWidth: 560, margin: '0 auto', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const topBar = { position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' };
const content = { flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', padding: 16 };
const passageCard = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 14, whiteSpace: 'pre-wrap' };
const passageTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)', marginBottom: 8 };
const passageText = { font: 'var(--text-body-med)', color: 'var(--color-text-primary)', lineHeight: 1.7, fontFamily: 'var(--font-ethiopic)' };
const passagePreview = { display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const passageToggle = { marginTop: 10, padding: '6px 0', color: 'var(--color-primary)', font: 'var(--text-btn)', fontSize: 13, cursor: 'pointer' };
const questionCard = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 14 };
const questionMeta = { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, font: 'var(--text-label)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--color-primary)' };
const reviewBadge = { borderRadius: 999, padding: '2px 7px', background: 'var(--color-accent-tint)', color: 'var(--color-accent)' };
const questionText = { fontSize: 18, fontWeight: 650, lineHeight: 1.55, color: 'var(--color-text-strong)', fontFamily: 'var(--font-ethiopic)' };
const optionsWrap = { display: 'grid', gap: 10, marginBottom: 14 };
const optionButton = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 54, padding: '13px 14px', borderRadius: 12, border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)', textAlign: 'left', font: 'var(--text-body-med)', fontFamily: 'var(--font-ethiopic)' };
const optionLetter = { width: 28, height: 28, borderRadius: 8, background: 'var(--color-track)', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 800, flexShrink: 0 };
const mediaWrap = { display: 'grid', gap: 8, marginTop: 12, overflowX: 'auto' };
const caption = { font: 'var(--text-caption)', color: 'var(--color-text-secondary)' };
const imageStyle = { maxWidth: '100%', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ethiopic)', fontSize: 14 };
const thStyle = { border: '1px solid var(--color-border)', padding: 8, background: 'var(--color-surface-alt)', textAlign: 'left' };
const tdStyle = { border: '1px solid var(--color-border)', padding: 8, textAlign: 'left' };
const hintCard = { display: 'grid', gap: 10, background: 'var(--color-accent-tint)', color: 'var(--color-text-primary)', border: '1px solid var(--color-accent)', borderRadius: 12, padding: 14, font: 'var(--text-body-med)' };
const correctCard = { ...hintCard, background: 'var(--color-success-tint)', border: '1px solid var(--color-success)' };
const reportWrap = { margin: '18px 0 0' };
const reportButton = { display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 36, padding: '7px 10px', borderRadius: 9, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', font: 'var(--text-label)', cursor: 'pointer' };
const reportPanel = { display: 'grid', gap: 10, marginTop: 10, padding: 12, borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-surface-alt)' };
const reportPrompt = { font: 'var(--text-caption)', color: 'var(--color-text-secondary)' };
const reportInput = { width: '100%', resize: 'vertical', minHeight: 88, padding: 10, borderRadius: 9, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-primary)', font: 'var(--text-body-med)', fontFamily: 'var(--font-body)' };
const reportErrorText = { font: 'var(--text-caption)', color: 'var(--color-error)' };
const reportSuccess = { marginTop: 10, font: 'var(--text-caption)', color: 'var(--color-success)' };
const footer = { position: 'fixed', left: 0, right: 0, bottom: 56, maxWidth: 560, margin: '0 auto', display: 'flex', gap: 8, padding: '10px 16px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' };
const footerButton = { flex: 1, minWidth: 0, minHeight: 36, height: 38, padding: '8px 6px', borderRadius: 10, font: 'var(--text-label)', fontSize: 12, whiteSpace: 'nowrap' };
const unavailableCard = { display: 'grid', gap: 16, margin: '80px 16px', padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)' };
const backButton = { minHeight: 44, borderRadius: 10, background: 'var(--color-primary)', color: '#fff', font: 'var(--text-btn)' };
