import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../services/api';
import { useAppContext } from '../context/AppContext';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';
import Button from '../components/Button';

export default function ExamListPage() {
  const { subjectId } = useParams();
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examApi.listExams({ subject: subjectId })
      .then(res => setExams(res.data))
      .catch(err => console.error('Failed to fetch exams', err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  function startExam(exam) {
    dispatch({ type: 'START_EXAM', payload: { examId: exam.id, subjectId } });
    navigate(`/exam/${exam.id}`);
  }

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button aria-label="Go back" onClick={() => navigate(-1)} style={backBtn}>←</button>
        <span style={pageTitle}>Exams</span>
        <span style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>
        {loading ? (
          <div className="loader">Loading exams…</div>
        ) : exams.length === 0 ? (
          <div style={emptyState}>
            <span style={{ fontSize: 40, marginBottom: 12 }}>📋</span>
            <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 6 }}>
              No exams yet
            </p>
            <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
              No exams found for this subject.
            </p>
          </div>
        ) : (
          <Card padding="0" style={{ overflow: 'hidden' }}>
            {exams.map((exam, i) => (
              <div
                key={exam.exam_id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12, padding: '14px 16px',
                  borderBottom: i < exams.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)' }}>
                    {exam.subject_display} {exam.year_ec} (EC)
                  </div>
                  <div style={{
                    font: 'var(--text-body)', fontSize: 12, fontWeight: 600,
                    letterSpacing: 'var(--ls-label)', color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase', marginTop: 2,
                  }}>
                    {exam.question_count} Questions · {exam.region_variant}
                  </div>
                </div>
                <Button onClick={() => startExam(exam)} size="sm" style={{ flexShrink: 0 }}>
                  Start
                </Button>
              </div>
            ))}
          </Card>
        )}
        <div style={{ height: 80 }} />
      </main>

      <BottomTabBar />
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
  height: 56, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const pageTitle = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const backBtn = {
  background: 'none', border: 'none', fontSize: 22,
  color: 'var(--color-accent)', cursor: 'pointer', minHeight: 44, minWidth: 44,
  display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
const emptyState = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
};
