import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import CircularRing from '../components/CircularRing';
import Card from '../components/Card';
import Button from '../components/Button';
import { MOCK_QUESTIONS, getQuestionsForCategory } from '../data/quizData';

const TIMER_SECONDS = 30;

export default function QuizScreen() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Pick the right question bank: category-specific or daily mixed
  const questions = categoryId ? getQuestionsForCategory(categoryId) : MOCK_QUESTIONS;
  const [index,       setIndex]       = useState(0);
  const [selected,    setSelected]    = useState(null);
  const [revealed,    setRevealed]    = useState(false);
  const [flashState,  setFlashState]  = useState(null); // 'correct' | 'incorrect'
  const [answers,     setAnswers]     = useState({});
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(true);

  const question = questions[index];
  const isLast   = index === questions.length - 1;

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
  }, [index]);

  // Countdown
  useEffect(() => {
    if (!timerActive || revealed || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, revealed]);

  // Auto-reveal when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !revealed) doReveal();
  }, [timeLeft]);

  function doReveal(sel = selected) {
    setTimerActive(false);
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
      setIndex(i => i + 1);
      setSelected(null);
      setRevealed(false);
      setFlashState(null);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const map = { a: 'A', b: 'B', c: 'C', d: 'D', 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
    const handler = (e) => {
      const k = map[e.key.toLowerCase()];
      if (k && !revealed) handleSelect(k);
      if (e.key === 'Enter' && !revealed && selected) handleReveal();
      if (e.key === 'Enter' && revealed) handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [revealed, selected, index]);

  const timerPct   = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timerPct > 40
    ? 'var(--color-accent)'
    : timerPct > 20 ? 'var(--color-gold)' : 'var(--color-error)';

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
          <ProgressBar value={index} max={questions.length} />
          <p style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, textAlign: 'center' }}>
            {index + 1} / {questions.length}
          </p>
        </div>
        <CircularRing size={48} strokeWidth={4} value={timerPct} color={timerColor}>
          <span style={{ font: 'var(--text-stat)', fontSize: 13, letterSpacing: 'var(--ls-number)', color: timerColor }}>
            {timeLeft}
          </span>
        </CircularRing>
      </div>

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
        {!revealed
          ? <Button full size="lg" disabled={!selected} onClick={handleReveal}>Check Answer</Button>
          : <Button full size="lg" onClick={handleNext}>{isLast ? 'See Results' : 'Next Question →'}</Button>
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
const footerBar = { padding: '12px var(--screen-pad)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', flexShrink: 0 };
