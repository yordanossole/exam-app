import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamById } from '../../../../lib/db';
import PaidGradeGate from '../../../../screens/practice/PaidGradeGate';
import BackButton from '../../../../components/BackButton';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) notFound();

  return (
    <PaidGradeGate grade={exam.grade}>
      <BackButton fallback="/practice" label="Back to Exams" />
      <main style={shell}>
        <h1 style={title}>{exam.subject_display}</h1>
        <p style={subtitle}>Grade {exam.grade} · {exam.year_ec} E.C. · {exam.total_questions} questions</p>

        <section style={grid}>
          <Link href={`/practice/exam/${exam.exam_id}/practice`} style={card}>
            <span style={cardTitle}>Practice Mode</span>
            <span style={meta}>Check answers, request hints, and reveal explanations question by question.</span>
            <span style={arrow}>›</span>
          </Link>
          <Link href={`/practice/exam/${exam.exam_id}/mock`} style={card}>
            <span style={cardTitle}>Mock Exam</span>
            <span style={meta}>Move through the paper without explanations, then submit for a topic report.</span>
            <span style={arrow}>›</span>
          </Link>
        </section>
        <div style={{ height: 80 }} />
      </main>
    </PaidGradeGate>
  );
}

const shell = { minHeight: '100dvh', maxWidth: 520, margin: '0 auto', padding: 16, background: 'var(--color-bg)' } as const;
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', marginTop: 8 } as const;
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', margin: '8px 0 20px' } as const;
const grid = { display: 'grid', gap: 12 } as const;
const card = { position: 'relative', display: 'grid', gap: 8, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', textDecoration: 'none' } as const;
const cardTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)' } as const;
const meta = { font: 'var(--text-body)', fontSize: 14, lineHeight: 1.45, color: 'var(--color-text-secondary)', paddingRight: 24 } as const;
const arrow = { position: 'absolute', right: 18, top: 18, color: 'var(--color-primary)', fontSize: 26 } as const;
