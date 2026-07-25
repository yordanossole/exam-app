import { notFound } from 'next/navigation';
import { getExamById, getQuestionsForExam } from '../../../../../lib/db';
import PracticeQuestionFlow from '../../../../../screens/practice/PracticeQuestionFlow';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ examId: string; mode: string }> }) {
  const { examId, mode } = await params;
  if (mode !== 'practice' && mode !== 'mock') notFound();

  const exam = getExamById(examId);
  if (!exam) notFound();

  const questions = getQuestionsForExam(examId);
  return <PracticeQuestionFlow exam={exam} questions={questions} mode={mode} />;
}
