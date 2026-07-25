import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { examId } = await params;
  redirect(`/practice/exam/${examId}`);
}
