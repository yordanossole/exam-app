import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../services/api';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';
import Button from '../components/Button';

export default function ExamListPage() {
  const { subjectId } = useParams();
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await examApi.listExams({ subject: subjectId });
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [subjectId]);

  function startExam(exam) {
    dispatch({ type: 'START_EXAM', payload: { examId: exam.id, subjectId } });
    navigate(`/exam/${exam.id}`);
  }

  return (
    <Screen style={{ background: '#f1f3fe' }}>
      <header style={navStyle}>
        <button aria-label="Go back" onClick={() => navigate(-1)} style={iconBtn}>←</button>
        <span style={navTitle}>{subject?.name ?? 'Exams'}</span>
        <span style={{ width: 32 }} />
      </header>

      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: '#717786' }}>Loading exams...</div>
        ) : exams.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: '#717786' }}>No exams found for this subject.</div>
        ) : (
          <div style={{ background: '#ffffff', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e0e2ed' }}>
            {exams.map((exam, i) => (
              <div key={exam.exam_id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px', borderBottom: i < exams.length - 1 ? '0.5px solid #e0e2ed' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#181c23' }}>
                    {exam.subject_display} {exam.year_ec} (EC)
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: '#717786', textTransform: 'uppercase', marginTop: 2 }}>
                    {exam.question_count} Questions • {exam.region_variant}
                  </div>
                </div>
                <Button onClick={() => startExam(exam)} style={{ padding: '8px 18px', fontSize: 14 }}>Start</Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <TabBar />
    </Screen>
  );
}

const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', borderBottom: '1px solid #e0e2ed' };
const navTitle = { fontSize: 17, fontWeight: 600, color: '#181c23', fontFamily: 'Inter, sans-serif' };
const iconBtn = { background: 'none', border: 'none', fontSize: 20, color: '#0058bc', cursor: 'pointer' };
