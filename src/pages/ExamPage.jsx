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
        payload: {
          examId,
          subjectId: exam.subject,
          questions // Storing for offline access
        }
      });
    }
  }, [loading, exam, session, dispatch, examId, questions]);

  useEffect(() => {
    if (error?.response?.status === 403) {
      navigate('/upgrade');
    }
  }, [error, navigate]);

  useEffect(() => { setShowExplanation(false); }, [session?.currentIndex]);

  const handleKeyDown = useCallback((e) => {
    // ... (Keyboard handling)
  }, [questions, session, showExplanation]);

  if (loading || !exam || !session || questions.length === 0) {
    return <Screen><div className="loader">Loading exam...</div></Screen>;
  }

  const { currentIndex, answers } = session;
  const question = questions[currentIndex];
  // Note: Backend might send answer in q.answer.correct_option
  const selectedAnswer = answers[question.question_id]?.option;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionId) {
    if (showExplanation) return;
    const isCorrect = optionId === question.answer?.correct_option;
    dispatch({
      type: 'SET_ANSWER',
      payload: {
        question_id: question.question_id,
        optionId,
        isCorrect,
        timeSpent: 0 // TODO: timer
      }
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
        <button onClick={() => navigate('/')} style={iconBtn}>✕</button>
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <div style={{ width: 24 }} />
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {question.passage && (
          <div className="passage-block" style={passageStyle}>
            <h4>{question.passage.title}</h4>
            <p>{question.passage.text}</p>
          </div>
        )}

        <div className="question-content">
          <p className="question-text" style={qTextStyle}>{question.text}</p>

          {question.media?.map(m => (
            m.type !== 'table' && <img key={m.id} src={m.url} alt={m.alt} style={{ maxWidth: '100%', marginBottom: 16 }} />
          ))}

          <div style={optionsGrid}>
            {Object.entries(question.options).map(([key, val]) => (
              <div
                key={key}
                className={`option-btn ${selectedAnswer === key ? 'selected' : ''}`}
                onClick={() => handleSelect(key)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #e0e2ed',
                  marginBottom: 8,
                  background: selectedAnswer === key ? '#0058bc' : '#fff',
                  color: selectedAnswer === key ? '#fff' : '#181c23',
                }}
              >
                <span style={{ fontWeight: 'bold', marginRight: 12 }}>{key.toUpperCase()}.</span>
                {val}
              </div>
            ))}
          </div>
        </div>

        {showExplanation && question.answer?.explanation && (
          <div style={{ marginTop: 20, padding: 16, background: '#f8f9ff', borderRadius: 8 }}>
            <strong>Explanation:</strong>
            <p>{question.answer.explanation}</p>
          </div>
        )}
      </main>

      <footer style={footerStyle}>
        <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_QUESTION' })} disabled={currentIndex === 0}>Back</Button>
        {!showExplanation
          ? <Button onClick={() => setShowExplanation(true)} disabled={!selectedAnswer}>Check</Button>
          : <Button onClick={handleNext}>{isLast ? 'Finish' : 'Next'}</Button>
        }
      </footer>
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e0e2ed' };
const iconBtn = { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' };
const qTextStyle = { fontSize: 20, fontWeight: 500, color: '#181c23', marginBottom: 20 };
const optionsGrid = { display: 'flex', flexDirection: 'column', gap: 8 };
const passageStyle = { background: '#fff', border: '1px solid #e0e2ed', padding: 16, borderRadius: 8, marginBottom: 20, maxHeight: 200, overflowY: 'auto' };
const footerStyle = { padding: '16px 20px', borderTop: '1px solid #e0e2ed', display: 'flex', justifyContent: 'space-between', background: '#fff' };
