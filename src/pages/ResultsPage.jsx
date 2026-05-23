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
  const [syncing, setSyncing] = useState(false);

  const session = state.currentSession;

  // Calculate score locally
  const questions = session?.questions || [];
  const answers = session?.answers || {};

  const correctCount = questions.filter(q => answers[question_id(q)]?.isCorrect).length;
  const totalCount = questions.length;
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = score >= 60;

  function question_id(q) { return q.question_id || q.id; }

  useEffect(() => {
    const syncResults = async () => {
      if (!session || session.submitted_to_server) return;

      setSyncing(true);
      try {
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
            hint_used: ans.hintUsed || false
          }))
        };

        await examApi.syncAttempt(payload);
        // Mark as synced if needed in context
      } catch (err) {
        console.error('Failed to sync results', err);
        // If offline, it stays in localStorage anyway via AppContext (not yet fully implemented offline storage)
      } finally {
        setSyncing(false);
      }
    };

    if (session && !syncing) {
      syncResults();
    }
  }, [session, examId, correctCount, totalCount, answers, syncing]);

  if (!session) return null;

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <span style={navTitle}>Results</span>
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: 24, textAlign: 'center', border: '1px solid #e0e2ed', marginBottom: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: passed ? '#006e28' : '#bc000a', lineHeight: 1 }}>{score}%</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#181c23', marginTop: 8 }}>
            {passed ? '🎉 Great job!' : '📚 Keep practicing!'}
          </div>
          <p>{correctCount} of {totalCount} correct</p>
          {syncing && <p style={{ fontSize: 12, color: '#717786' }}>Syncing results...</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button variant="primary" full onClick={() => navigate(`/exam/${examId}`)}>Retry Exam</Button>
          <Button variant="ghost" full onClick={() => { dispatch({ type: 'END_EXAM' }); navigate('/'); }}>Back to Home</Button>
        </div>
      </main>
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
