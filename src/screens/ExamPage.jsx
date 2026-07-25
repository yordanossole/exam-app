'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { useExam } from '../hooks/useExam';
import ProgressBar from '../components/ProgressBar';
import Card from '../components/Card';
import Button from '../components/Button';

export default function ExamPage() {
  const { examId } = useParams();
  const { state, dispatch } = useAppContext();
  const { exam, loading, error } = useExam(examId);
  const navigate = useNavigate();

  const session = state.currentSession;
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = useMemo(() => {
    if (!exam?.content?.sections) return [];
    return exam.content.sections.flatMap(s =>
      s.questions.map(q => ({ ...q, passage: s.passage, sectionTitle: s.title }))
    );
  }, [exam]);

  useEffect(() => {
    if (!loading && exam && !session) {
      dispatch({ type: 'START_EXAM', payload: { examId, subjectId: exam.subject, questions } });
    }
  }, [loading, exam, session, dispatch, examId, questions]);

  useEffect(() => {
    if (error?.response?.status === 403) navigate('/upgrade');
  }, [error, navigate]);

  useEffect(() => { setShowExplanation(false); }, [session?.currentIndex]);

  if (loading || !exam || !session || questions.length === 0) {
    return (
      <div style={{ ...screenWrap, alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader">Loading exam…</div>
      </div>
    );
  }

  const { currentIndex, answers } = session;
  const question       = questions[currentIndex];
  const selectedAnswer = answers[question.question_id]?.option;
  const isLast         = currentIndex === questions.length - 1;

  function handleSelect(key) {
    if (showExplanation) return;
    const isCorrect = key === question.answer?.correct_option;
    dispatch({ type: 'SET_ANSWER', payload: { question_id: question.question_id, optionId: key, isCorrect, timeSpent: 0 } });
  }

  function handleNext() {
    if (isLast) {
      dispatch({ type: 'SUBMIT_EXAM' });
      navigate(`/results/${examId}`);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  return (
    <div style={screenWrap}>
      {/* Top progress bar */}
      <ProgressBar value={currentIndex + (showExplanation ? 1 : 0)} max={questions.length} style={{ borderRadius: 0 }} />

      {/* Header */}
      <header style={pageHeader}>
        <button onClick={() => navigate('/')} style={exitBtn} aria-label="Exit exam">✕</button>
        <span style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div style={{ width: 44 }} />
      </header>

      {/* Body */}
      <main style={scrollContent}>

        {/* Passage */}
        {question.passage && (
          <Card style={{ marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
            <p style={{ font: 'var(--text-body)', fontSize: 12, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 6 }}>
              Passage
            </p>
            <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              {question.passage.text}
            </p>
          </Card>
        )}

        {/* Question */}
        <Card style={{ marginBottom: 20 }}>
          <p style={{ font: 'var(--text-body)', fontSize: 11, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 12 }}>
            Question {currentIndex + 1}
          </p>
          <p style={{ fontSize: 19, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.55, fontFamily: 'var(--font-family)' }}>
            {question.text}
          </p>
        </Card>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {Object.entries(question.options).map(([key, val]) => {
            const isSelected = selectedAnswer === key;
            let bg = 'var(--color-surface)', border = 'var(--color-border)', color = 'var(--color-text-primary)';
            if (isSelected) { bg = 'var(--color-accent-tint)'; border = 'var(--color-accent)'; color = 'var(--color-accent)'; }
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={showExplanation}
                aria-pressed={isSelected}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 'var(--radius-option)',
                  border: `1.5px solid ${border}`, background: bg, color,
                  fontSize: 15, fontWeight: isSelected ? 600 : 400,
                  fontFamily: 'var(--font-family)', textAlign: 'left',
                  cursor: showExplanation ? 'default' : 'pointer',
                  width: '100%', minHeight: 52,
                  transition: 'background var(--duration-tap) ease, border-color var(--duration-tap) ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isSelected ? 'currentColor' : 'var(--color-track)',
                  color: isSelected ? bg : 'var(--color-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {key}
                </span>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{val}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.answer?.explanation && (
          <Card style={{ background: 'var(--color-accent-tint)', borderColor: 'var(--color-accent)', marginBottom: 20 }}>
            <p style={{ font: 'var(--text-body)', fontSize: 11, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 }}>
              Explanation
            </p>
            <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              {question.answer.explanation}
            </p>
          </Card>
        )}

        <div style={{ height: 16 }} />
      </main>

      {/* Footer */}
      <footer style={footerBar}>
        <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_QUESTION' })} disabled={currentIndex === 0}>
          Back
        </Button>
        {!showExplanation
          ? <Button disabled={!selectedAnswer} onClick={() => setShowExplanation(true)}>Check</Button>
          : <Button onClick={handleNext}>{isLast ? 'Finish' : 'Next'}</Button>
        }
      </footer>
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
  height: 52, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const exitBtn = {
  background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
  color: 'var(--color-text-secondary)', minHeight: 44, minWidth: 44,
  display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
const footerBar = {
  display: 'flex', justifyContent: 'space-between', gap: 12,
  padding: '12px var(--screen-pad)',
  paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
  background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', flexShrink: 0,
};
