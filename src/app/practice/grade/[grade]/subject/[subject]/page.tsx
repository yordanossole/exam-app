import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamsByGradeAndSubject } from '../../../../../../lib/db';
import PaidGradeGate from '../../../../../../screens/practice/PaidGradeGate';
import BackButton from '../../../../../../components/BackButton';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ grade: string; subject: string }> }) {
  const { grade, subject } = await params;
  const gradeNumber = Number(grade);
  if (!Number.isFinite(gradeNumber)) notFound();

  const exams = getExamsByGradeAndSubject(gradeNumber, decodeURIComponent(subject));
  const subjectName = exams[0]?.subject_display ?? decodeURIComponent(subject).replaceAll('_', ' ');

  return (
    <PaidGradeGate grade={gradeNumber}>
      <BackButton fallback="/practice" label="Back to Exams" />
      <main style={shell}>
        <h1 style={title}>{subjectName}</h1>
        <p style={subtitle}>Choose an exam year to begin.</p>

        <section style={grid}>
          {exams.map(exam => (
            <Link key={exam.exam_id} href={`/practice/exam/${exam.exam_id}/exam`} style={card}>
              <span style={cardTitle}>{exam.year_ec} E.C.</span>
              <span style={meta}>{exam.total_questions} questions · {exam.total_sections} sections</span>
              {!exam.verified && <span style={reviewBadge}>Unverified</span>}
              <span style={arrow}>›</span>
            </Link>
          ))}
        </section>
        <div style={{ height: 80 }} />
      </main>
    </PaidGradeGate>
  );
}

const shell = { minHeight: '100dvh', maxWidth: 520, margin: '0 auto', padding: 16, background: 'var(--color-bg)' } as const;
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', marginTop: 8, textTransform: 'capitalize' } as const;
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', margin: '8px 0 20px' } as const;
const grid = { display: 'grid', gap: 12 } as const;
const card = { position: 'relative', display: 'grid', gap: 6, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', textDecoration: 'none' } as const;
const cardTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)' } as const;
const meta = { font: 'var(--text-body)', fontSize: 14, color: 'var(--color-text-secondary)' } as const;
const reviewBadge = { width: 'fit-content', borderRadius: 999, padding: '4px 8px', background: 'var(--color-accent-tint)', color: 'var(--color-accent)', font: 'var(--text-label)' } as const;
const arrow = { position: 'absolute', right: 18, top: 18, color: 'var(--color-primary)', fontSize: 26 } as const;
