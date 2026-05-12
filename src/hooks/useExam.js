import { useState, useEffect } from 'react';
import { fetchExam } from '../data/mockData';

export function useExam(examId) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    fetchExam(examId).then(data => {
      setExam(data);
      setLoading(false);
    });
  }, [examId]);

  return { exam, loading };
}
