import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { examApi } from '../services/api';
import Screen from '../components/Screen';
import Button from '../components/Button';

export default function ResultsPage() {
  const { examId } = useParams();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [synced, setSynced] = useState(false);

  const session = state.currentSession;
  const questions = session?.questions || [];
  const answers   = session?.answers   || {};

  const correctCount = questions.filter(q => answers[question_id(q)]?.isCorrect).length;
  const totalCount   = questions.length;
  const score  = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = score >= 60;

  function question_id(q) { return q.question_id || q.id; }

  // Fire-and-forget sync — does not block the UI
  useEffect(() => {
    if (!session || synced) return;

    setSynced(true);
    const payload = {
      exam_id: examId,
      started_at: session.startTime,
      completed_at: session.endTime || new Date().toISOString(),
      time_spent_secs: session.timeSpent || 0,
      score: correctCount,
      total_questions: totalCount,
      answers: Object.entries(answers).map(([qid, ans]) => ({
        question_id: qid,
        selected_option: ans.option,
        is_correct: ans.isCorrect,
        time_spent_secs: ans.timeSpent || 0,
        hint_used: ans.hintUsed || false,
      })),
    };

    examApi.syncAttempt(payload).catch(err => {
      console.warn('Failed to sync results (non-blocking):', err);
    });
  }, [session, examId, correctCount, totalCount, answers, synced]);

  if (!session) return null;

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <span style={navTitle}>Results</span>
      </header>

      <main style={{ flex: 1, padding: 'clamp(16px, 4vw, 24px)', overflowY: 'auto' }}>

        {/* Score card — centred, scales on wide screens */}
        <div style={scoreCard}>
          <div style={{
            fontSize: 'clamp(56px, 15vw, 80px)',
            fontWeight: 700,
            color: passed ? '#006e28' : '#bc000a',
            lineHeight: 1,
          }}>
            {score}%
          </div>
          <div style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 600, color: '#181c23', marginTop: 10 }}>
            {passed ? '🎉 Great job!' : '📚 Keep practicing!'}
          </div>
          <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: '#717786', marginTop: 8 }}>
            {correctCount} of {totalCount} correct
          </p>
        </div>

        {/* Per-question breakdown */}
        {questions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 600, color: '#181c23', marginBottom: 12 }}>
              Question Breakdown
            </h3>
            <div style={{ background: '#fff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed' }}>
              {questions.map((q, i) => {
                const ans = answers[question_id(q)];
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 'clamp(10px, 2.5vw, 14px) clamp(14px, 4vw, 18px)',
                      borderBottom: i < questions.length - 1 ? '0.5px solid #e0e2ed' : 'none',
                    }}
                  >
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: ans?.isCorrect ? '#e8f5e9' : '#fde8e8',
                      color: ans?.isCorrect ? '#006e28' : '#bc000a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {ans?.isCorrect ? '✓' : '✗'}
                    </span>
                    <span style={{
                      fontSize: 'clamp(13px, 3.5vw, 14px)',
                      color: '#414755',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {i + 1}. {q.text?.slice(0, 80)}{q.text?.length > 80 ? '…' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button variant="primary" full onClick={() => navigate(`/exam/${examId}`)}>
            Retry Exam
          </Button>
          <Button variant="ghost" full onClick={() => { dispatch({ type: 'END_EXAM' }); navigate('/'); }}>
            Back to Home
          </Button>
        </div>
      </main>
    </Screen>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
  background: '#ffffff',
  borderBottom: '1px solid #e0e2ed',
  flexShrink: 0,
};
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const scoreCard = {
  background: '#ffffff',
  borderRadius: '1rem',
  padding: 'clamp(24px, 6vw, 40px)',
  textAlign: 'center',
  border: '1px solid #e0e2ed',
  marginBottom: 24,
};
