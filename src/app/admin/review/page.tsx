import Link from 'next/link';
import { getQuestionsNeedingReview } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default function Page() {
  const questions = getQuestionsNeedingReview();

  return (
    <main style={shell}>
      <Link href="/" style={backLink}>← App</Link>
      <h1 style={title}>Content Review</h1>
      <p style={subtitle}>{questions.length} flagged questions shown. These should be checked before publishing.</p>

      <section style={list}>
        {questions.map(question => (
          <article key={question.question_id} style={card}>
            <div style={meta}>
              <span style={badge}>Needs Review</span>
              <span>Grade {question.grade}</span>
              <span>{question.subject_display}</span>
              <span>{question.year_ec} E.C.</span>
              <span>Q{question.q_number}</span>
            </div>
            <p style={questionText} dir="auto">{question.question_text}</p>
            <p style={small}>{question.question_id} · {question.topic || 'unclassified'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const shell = { minHeight: '100dvh', maxWidth: 760, margin: '0 auto', padding: 16, background: 'var(--color-bg)' } as const;
const backLink = { display: 'inline-flex', minHeight: 44, alignItems: 'center', color: 'var(--color-primary)', textDecoration: 'none', font: 'var(--text-btn)' } as const;
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', marginTop: 8 } as const;
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', margin: '8px 0 20px' } as const;
const list = { display: 'grid', gap: 10 } as const;
const card = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 14 } as const;
const meta = { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10, font: 'var(--text-caption)', color: 'var(--color-text-secondary)' } as const;
const badge = { borderRadius: 999, padding: '2px 8px', background: 'var(--color-accent-tint)', color: 'var(--color-accent)', fontWeight: 700 } as const;
const questionText = { fontFamily: 'var(--font-ethiopic)', fontSize: 15, lineHeight: 1.55, color: 'var(--color-text-primary)' } as const;
const small = { marginTop: 10, font: 'var(--text-caption)', color: 'var(--color-text-muted)' } as const;
