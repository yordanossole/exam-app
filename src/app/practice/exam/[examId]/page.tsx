import { notFound, redirect } from 'next/navigation';
import { getExamById } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) notFound();

  redirect(`/practice/exam/${exam.exam_id}/exam`);
}
