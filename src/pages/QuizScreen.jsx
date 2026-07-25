import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import CircularRing from '../components/CircularRing';
import Card from '../components/Card';
import Button from '../components/Button';
import { MOCK_QUESTIONS, getQuestionsForCategory } from '../data/quizData';

const EXAM_SECONDS = 2 * 60 * 60; // 2 hours

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export default function QuizScreen() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const questions = categoryId ? getQuestionsForCategory(categoryId) : MOCK_QUESTIONS;
  const [index,      setIndex]      = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [flashState, setFlashState] = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [timeLeft,   setTimeLeft]   = useState(EXAM_SECONDS);
  const [showNav,    setShowNav]    = useState(false);

  const question = questions[index];
  const isLast   = index === questions.length - 1;

  // Single exam-wide countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/results/quiz-session', { state: { answers, questions } });
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  function doReveal(sel = selected) {
    setRevealed(true);
    const isCorrect = sel === question.answer.correct_option;
    setFlashState(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => setFlashState(null), 350);
    setAnswers(prev => ({ ...prev, [question.id]: { option: sel, isCorrect } }));
  }

  function handleSelect(key) {
    if (!revealed) setSelected(key);
  }

  function handleReveal() {
    if (!revealed) doReveal(selected);
  }

  function handleNext() {
    if (isLast) {
      navigate('/results/quiz-session', { state: { answers, questions } });
    } else {
      jumpTo(index + 1);
    }
  }

  function jumpTo(i) {
    const saved = answers[questions[i].id];
    setIndex(i);
    setSelected(saved?.option ?? null);
    setRevealed(!!saved);
    setFlashState(null);
    setShowNav(false);
  }

  // Keyboard shortcuts
  useEffect(() => {
    const map = { a: 'A', b: 'B', c: 'C', d: 'D', 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
    const handler = (e) => {
      if (showNav) { if (e.key === 'Escape') setShowNav(false); return; }
      const k = map[e.key.toLowerCase()];
      if (k && !revealed) handleSelect(k);
      if (e.key === 'Enter' && !revealed && selected) handleReveal();
      if (e.key === 'Enter' && revealed) handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [revealed, selected, index, showNav]);

  const bgFlash = flashState === 'correct'
    ? 'var(--color-accent-tint)'
    : flashState === 'incorrect'
    ? 'var(--color-error-tint)'
    : 'var(--color-bg)';

  return (
    <div style={{ ...screenWrap, background: bgFlash, transition: 'background var(--duration-flash) ease' }}>

      {/* Top bar */}
      <div style={topBar}>
        <button onClick={() => navigate('/')} aria-label="Exit quiz" style={exitBtn}>✕</button>
        <div style={{ flex: 1, margin: '0 12px' }}>
          <ProgressBar value={Object.keys(answers).length} max={questions.length} />
          <button
            onClick={() => setShowNav(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0', width: '100%', WebkitTapHighlightColor: 'transparent' }}
          >
            <p style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, textAlign: 'center' }}>
              Q {index + 1} / {questions.length} &nbsp;·&nbsp;
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{Object.keys(answers).length} answered</span>
            </p>
          </button>
        </div>
        <CircularRing size={48} strokeWidth={4} value={(timeLeft / EXAM_SECONDS) * 100} color={timeLeft < 300 ? 'var(--color-error)' : 'var(--color-accent)'}>
          <span style={{ font: 'var(--text-stat)', fontSize: 11, letterSpacing: 'var(--ls-number)', color: timeLeft < 300 ? 'var(--color-error)' : 'var(--color-accent)' }}>
            {formatTime(timeLeft)}
          </span>
        </CircularRing>
      </div>

      {/* Question navigator drawer */}
      {showNav && (
        <>
          <div
            onClick={() => setShowNav(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--color-surface)',
            borderRadius: '16px 16px 0 0', padding: '20px var(--screen-pad)',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
            zIndex: 41, boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border)', margin: '0 auto 16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)' }}>Questions</p>
              <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {Object.keys(answers).length} / {questions.length} answered
              </p>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 20 }}>
              {questions.map((q, i) => {
                const attempted = !!answers[q.id];
                const isCurrent = i === index;
                let bg     = 'var(--color-track)';
                let color  = 'var(--color-text-secondary)';
                let border = 'transparent';
                if (isCurrent) { bg = 'var(--color-accent)'; color = '#fff'; }
                else if (attempted) { bg = 'var(--color-accent-tint)'; color = 'var(--color-accent)'; border = 'var(--color-accent)'; }
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpTo(i)}
                    style={{
                      height: 40, borderRadius: 8, border: `1.5px solid ${border}`,
                      background: bg, color,
                      font: 'var(--text-body-med)', fontSize: 14,
                      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { bg: 'var(--color-accent)',      color: '#fff',                        label: 'Current' },
                { bg: 'var(--color-accent-tint)', color: 'var(--color-accent)',          label: 'Answered' },
                { bg: 'var(--color-track)',        color: 'var(--color-text-secondary)', label: 'Unanswered' },
              ].map(({ bg, color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: bg, border: label === 'Answered' ? '1.5px solid var(--color-accent)' : 'none', flexShrink: 0 }} />
                  <span style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Body */}
      <main style={scrollContent}>

        {/* Question card */}
        <Card style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 12 }}>
            Question {index + 1}
          </p>
          <p style={{ fontSize: 19, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.55, fontFamily: 'var(--font-family)' }}>
            {question.text}
          </p>
        </Card>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {Object.entries(question.options).map(([key, val]) => {
            const isSelected = selected === key;
            const isCorrect  = question.answer.correct_option === key;
            let bg = 'var(--color-surface)', border = 'var(--color-border)', color = 'var(--color-text-primary)', icon = null;

            if (revealed) {
              if (isCorrect) {
                bg = 'var(--color-accent-tint)'; border = 'var(--color-accent)'; color = 'var(--color-accent)'; icon = '✓';
              } else if (isSelected) {
                bg = 'var(--color-error-tint)'; border = 'var(--color-error)'; color = 'var(--color-error)'; icon = '✗';
              }
            } else if (isSelected) {
              bg = 'var(--color-accent-tint)'; border = 'var(--color-accent)'; color = 'var(--color-accent)';
            }

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={revealed}
                aria-pressed={isSelected}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 'var(--radius-option)',
                  border: `1.5px solid ${border}`, background: bg, color,
                  fontSize: 15, fontWeight: isSelected || (revealed && isCorrect) ? 600 : 400,
                  fontFamily: 'var(--font-family)', textAlign: 'left',
                  cursor: revealed ? 'default' : 'pointer', width: '100%', minHeight: 52,
                  transition: 'background var(--duration-tap) ease, border-color var(--duration-tap) ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isSelected || (revealed && isCorrect) ? 'currentColor' : 'var(--color-track)',
                  color: isSelected || (revealed && isCorrect) ? bg : 'var(--color-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {icon ?? key}
                </span>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{val}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && question.answer.explanation && (
          <Card style={{ background: 'var(--color-accent-tint)', borderColor: 'var(--color-accent)', marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 'var(--ls-label)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 }}>
              Explanation
            </p>
            <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              {question.answer.explanation}
            </p>
          </Card>
        )}

        <div style={{ height: 16 }} />
      </main>

      {/* Sticky footer */}
      <footer style={footerBar}>
        <Button variant="ghost" onClick={() => index > 0 && jumpTo(index - 1)} disabled={index === 0}>
          Back
        </Button>
        {!revealed
          ? <>
              <Button variant="ghost" onClick={handleNext}>{isLast ? 'See Results' : 'Skip'}</Button>
              <Button size="lg" disabled={!selected} onClick={handleReveal}>Check Answer</Button>
            </>
          : <Button size="lg" onClick={handleNext}>{isLast ? 'See Results' : 'Next →'}</Button>
        }
      </footer>

      <style>{`@keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

const screenWrap = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' };
const topBar = { display: 'flex', alignItems: 'center', padding: '12px var(--screen-pad)', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 };
const exitBtn = { width: 36, height: 36, minHeight: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 16, cursor: 'pointer', flexShrink: 0 };
const scrollContent = { flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)', WebkitOverflowScrolling: 'touch' };
const footerBar = { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px var(--screen-pad)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', flexShrink: 0 };
