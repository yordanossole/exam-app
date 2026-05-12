import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useExam } from '../hooks/useExam';
import Screen from '../components/Screen';
import ProgressBar from '../components/ProgressBar';
import OptionItem from '../components/OptionItem';
import ExplanationBlock from '../components/ExplanationBlock';
import Button from '../components/Button';

export default function ExamPage() {
  const { examId }          = useParams();
  const { state, dispatch } = useAppContext();
  const { exam, loading }   = useExam(examId);
  const navigate            = useNavigate();

  const session = state.currentSession;
  const [showExplanation, setShowExplanation] = useState(false);

  // Restore session if user refreshed mid-exam
  useEffect(() => {
    if (!session && examId) {
      // Session lost — redirect to subjects
      navigate('/subjects', { replace: true });
    }
  }, [session, examId, navigate]);

  // Reset explanation panel when question changes
  useEffect(() => { setShowExplanation(false); }, [session?.currentIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!exam || !session) return;
    const q = exam.questions[session.currentIndex];
    const keys = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (keys[e.key] !== undefined && !showExplanation) {
      const opt = q.options[keys[e.key]];
      if (opt) dispatch({ type: 'SET_ANSWER', payload: { questionId: q.id, optionId: opt.id } });
    }
    if (e.key === 'Enter' && selectedAnswer && !showExplanation) setShowExplanation(true);
    if (e.key === 'ArrowRight' && showExplanation) handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  }, [exam, session, showExplanation]); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading || !exam || !session) return null;

  const { currentIndex, answers } = session;
  const question     = exam.questions[currentIndex];
  const selectedAnswer = answers[question.id];
  const isLast       = currentIndex === exam.questions.length - 1;

  function handleSelect(optionId) {
    if (showExplanation) return;
    dispatch({ type: 'SET_ANSWER', payload: { questionId: question.id, optionId } });
  }

  function handleCheck() { setShowExplanation(true); }

  function handleNext() {
    if (isLast) {
      dispatch({ type: 'SUBMIT_EXAM' });
      navigate(`/results/${examId}`);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handlePrev() {
    if (currentIndex > 0) dispatch({ type: 'PREV_QUESTION' });
  }

  function handleClose() {
    dispatch({ type: 'END_EXAM' });
    navigate('/subjects');
  }

  return (
    <Screen>
      <ProgressBar value={currentIndex + (showExplanation ? 1 : 0)} max={exam.questions.length} />

      <header style={navStyle}>
        <button aria-label="Exit exam" onClick={handleClose} style={{ ...iconBtn, color: showExplanation ? '#bc000a' : '#414755' }}>✕</button>
        <span style={navTitle}>Question {currentIndex + 1} of {exam.questions.length}</span>
        <button style={{ ...iconBtn, color: '#0058bc', fontSize: 15, fontWeight: 500 }}>Help</button>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {!showExplanation && (
          <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: '#414755', textTransform: 'uppercase', marginBottom: 8 }}>
            {exam.subjectId}
          </span>
        )}

        <p style={{
          fontFamily: 'Newsreader, serif',
          fontSize: showExplanation ? 20 : 24,
          fontWeight: 500,
          lineHeight: showExplanation ? '28px' : '32px',
          letterSpacing: '-0.01em',
          color: '#181c23',
          marginBottom: 24,
        }}>
          {question.text}
        </p>

        <div role="radiogroup" aria-label="Answer options" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {question.options.map((opt, i) => (
            <OptionItem
              key={opt.id}
              option={opt}
              index={i}
              mode={showExplanation ? 'result' : 'question'}
              selected={selectedAnswer}
              correct={question.correctId}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {showExplanation && <ExplanationBlock text={question.explanation} />}
      </main>

      <footer style={footerStyle}>
        <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>← Previous</Button>
        {!showExplanation
          ? <Button onClick={handleCheck} disabled={!selectedAnswer}>Check Answer</Button>
          : <Button onClick={handleNext}>{isLast ? 'Finish →' : 'Next →'}</Button>
        }
      </footer>
    </Screen>
  );
}

const navStyle   = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e0e2ed' };
const navTitle   = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const iconBtn    = { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', fontFamily: 'Inter, sans-serif' };
const footerStyle = { padding: '16px 20px', borderTop: '1px solid #e0e2ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' };
