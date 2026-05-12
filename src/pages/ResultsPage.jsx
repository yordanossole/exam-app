import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useExam } from '../hooks/useExam';
import Screen from '../components/Screen';
import Button from '../components/Button';

export default function ResultsPage() {
  const { examId }          = useParams();
  const { state, dispatch } = useAppContext();
  const { exam, loading }   = useExam(examId);
  const navigate            = useNavigate();

  if (loading || !exam) return null;

  const answers = state.currentSession?.answers ?? {};
  const correct = exam.questions.filter(q => answers[q.id] === q.correctId).length;
  const total   = exam.questions.length;
  const score   = Math.round((correct / total) * 100);
  const passed  = score >= 60;

  function handleRetry() {
    dispatch({ type: 'START_EXAM', payload: { examId, subjectId: exam.subjectId } });
    navigate(`/exam/${examId}`);
  }

  function handleHome() {
    dispatch({ type: 'END_EXAM' });
    navigate('/');
  }

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <span style={navTitle}>Results</span>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {/* Score card */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: 24, textAlign: 'center', border: '1px solid #e0e2ed', marginBottom: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: passed ? '#006e28' : '#bc000a', lineHeight: 1 }}>{score}%</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#181c23', marginTop: 8 }}>
            {passed ? '🎉 Great job!' : '📚 Keep practicing!'}
          </div>
          <div style={{ fontSize: 14, color: '#717786', marginTop: 4 }}>
            {correct} of {total} correct
          </div>
        </div>

        {/* Per-question breakdown */}
        <div style={{ fontSize: 17, fontWeight: 600, color: '#181c23', marginBottom: 12 }}>Review</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {exam.questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correctId;
            return (
              <div key={q.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: '#ffffff', borderRadius: '0.5rem',
                border: `1px solid ${isCorrect ? '#006e28' : '#bc000a'}`,
                padding: '12px 14px',
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: isCorrect ? '#006e28' : '#bc000a',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>
                  {isCorrect ? '✓' : '✕'}
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#181c23', marginBottom: 2 }}>Q{i + 1}: {q.text}</div>
                  {!isCorrect && (
                    <div style={{ fontSize: 13, color: '#006e28' }}>
                      Correct: {q.options.find(o => o.id === q.correctId)?.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button variant="primary" full onClick={handleRetry}>Retry Exam</Button>
          <Button variant="ghost"   full onClick={handleHome}>Back to Home</Button>
        </div>
      </main>
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
