import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useExam } from '../hooks/useExam';
import Screen from '../components/Screen';
import ProgressBar from '../components/ProgressBar';
import OptionItem from '../components/OptionItem';
import ExplanationBlock from '../components/ExplanationBlock';
import Button from '../components/Button';

export default function ExamPage() {
  const { examId } = useParams();
  const { state, dispatch } = useAppContext();
  const { exam, loading, error } = useExam(examId);
  const navigate = useNavigate();

  const session = state.currentSession;
  const [showExplanation, setShowExplanation] = useState(false);

  // Flatten questions from sections
  const questions = useMemo(() => {
    if (!exam || !exam.content || !exam.content.sections) return [];
    return exam.content.sections.flatMap(s =>
      s.questions.map(q => ({ ...q, passage: s.passage, sectionTitle: s.title }))
    );
  }, [exam]);

  useEffect(() => {
    if (!loading && exam && !session) {
      dispatch({
        type: 'START_EXAM',
        payload: { examId, subjectId: exam.subject, questions },
      });
    }
  }, [loading, exam, session, dispatch, examId, questions]);

  useEffect(() => {
    if (error?.response?.status === 403) navigate('/upgrade');
  }, [error, navigate]);

  useEffect(() => { setShowExplanation(false); }, [session?.currentIndex]);

  const handleKeyDown = useCallback(() => {
    // keyboard handling placeholder
  }, [questions, session, showExplanation]);

  if (loading || !exam || !session || questions.length === 0) {
    return <Screen><div className="loader">Loading exam...</div></Screen>;
  }

  const { currentIndex, answers } = session;
  const question = questions[currentIndex];
  const selectedAnswer = answers[question.question_id]?.option;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionId) {
    if (showExplanation) return;
    const isCorrect = optionId === question.answer?.correct_option;
    dispatch({
      type: 'SET_ANSWER',
      payload: { question_id: question.question_id, optionId, isCorrect, timeSpent: 0 },
    });
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
    <Screen>
      <ProgressBar value={currentIndex + (showExplanation ? 1 : 0)} max={questions.length} />

      <header style={navStyle}>
        <button onClick={() => navigate('/')} style={iconBtn} aria-label="Exit exam">✕</button>
        <span style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: '#414755', fontWeight: 500 }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div style={{ width: 44 }} />
      </header>

      <main style={{ flex: 1, padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>
        {question.passage && (
          <div style={passageStyle}>
            <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{question.passage.title}</h4>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{question.passage.text}</p>
          </div>
        )}

        <div>
          <p style={qTextStyle}>{question.text}</p>

          {question.media?.map(m =>
            m.type !== 'table' && (
              <img
                key={m.id}
                src={m.url}
                alt={m.alt}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: 16, borderRadius: 8 }}
              />
            )
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(question.options).map(([key, val]) => (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelect(key)}
                aria-pressed={selectedAnswer === key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 'clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  border: '1.5px solid',
                  borderColor: selectedAnswer === key ? '#0058bc' : '#e0e2ed',
                  background: selectedAnswer === key ? '#eef4ff' : '#fff',
                  cursor: showExplanation ? 'default' : 'pointer',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#181c23',
                  lineHeight: 1.5,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span style={{ fontWeight: 700, color: '#0058bc', flexShrink: 0 }}>
                  {key.toUpperCase()}.
                </span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {showExplanation && question.answer?.explanation && (
          <div style={explanationStyle}>
            <strong style={{ display: 'block', marginBottom: 8, color: '#0058bc' }}>Explanation</strong>
            <p style={{ fontSize: 'clamp(14px, 3.5vw, 15px)', lineHeight: 1.6, color: '#181c23' }}>
              {question.answer.explanation}
            </p>
          </div>
        )}
      </main>

      <footer style={footerStyle}>
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'PREV_QUESTION' })}
          disabled={currentIndex === 0}
        >
          Back
        </Button>
        {!showExplanation
          ? <Button onClick={() => setShowExplanation(true)} disabled={!selectedAnswer}>Check</Button>
          : <Button onClick={handleNext}>{isLast ? 'Finish' : 'Next'}</Button>
        }
      </footer>
    </Screen>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 clamp(14px, 4vw, 20px)',
  height: 52,
  borderBottom: '1px solid #e0e2ed',
  flexShrink: 0,
};
const iconBtn = {
  background: 'none',
  border: 'none',
  fontSize: 20,
  cursor: 'pointer',
  color: '#414755',
  minHeight: 44,
  minWidth: 44,
  display: 'flex',
  alignItems: 'center',
};
const qTextStyle = {
  fontSize: 'clamp(17px, 4.5vw, 21px)',
  fontWeight: 500,
  color: '#181c23',
  marginBottom: 20,
  lineHeight: 1.55,
  fontFamily: 'Newsreader, serif',
};
const passageStyle = {
  background: '#fff',
  border: '1px solid #e0e2ed',
  padding: 'clamp(12px, 3vw, 16px)',
  borderRadius: 8,
  marginBottom: 20,
  maxHeight: 200,
  overflowY: 'auto',
};
const explanationStyle = {
  marginTop: 20,
  padding: 'clamp(12px, 3vw, 16px)',
  background: '#fffde7',
  borderLeft: '4px solid #0058bc',
  borderRadius: 8,
};
const footerStyle = {
  padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
  borderTop: '1px solid #e0e2ed',
  display: 'flex',
  justifyContent: 'space-between',
  background: '#fff',
  gap: 12,
  flexShrink: 0,
};
