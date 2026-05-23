import { useState, useEffect } from 'react';
import { examApi } from '../services/api';

export function useExam(examId) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!examId) return;
    const fetchExamData = async () => {
      setLoading(true);
      try {
        const res = await examApi.getExamDetail(examId);
        setExam(res.data);
      } catch (err) {
        console.error('Failed to fetch exam', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExamData();
  }, [examId]);

  return { exam, loading, error };
}
