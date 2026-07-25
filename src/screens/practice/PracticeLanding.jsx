'use client';

import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';
import { getPaidGrade } from '../../lib/subscription';
import Button from '../../components/Button';

export default function PracticeLanding({ catalog }) {
  const { state } = useAppContext();
  const paidGrade = getPaidGrade(state.user);
  const gradeCatalog = catalog.find(item => item.grade === paidGrade);

  return (
    <main style={shell}>
      <p style={eyebrow}>Exams</p>
      <h1 style={title}>Practice your national exams.</h1>

      {!paidGrade ? (
        <section style={notice}>
          <h2 style={cardTitle}>No active grade plan</h2>
          <p style={body}>Your exam subjects become available after a grade plan is activated.</p>
          <Button onClick={() => window.location.assign('/upgrade')}>View Plans</Button>
        </section>
      ) : !gradeCatalog ? (
        <section style={notice}>
          <h2 style={cardTitle}>Grade {paidGrade} exams are coming soon</h2>
          <p style={body}>There are no Grade {paidGrade} exams in nt-exams.db yet.</p>
        </section>
      ) : (
        <>
          <p style={subtitle}>Grade {paidGrade} · Subjects from nt-exams.db</p>
          <section style={grid}>
            {gradeCatalog.subjects.map(subject => (
              <Link
                key={subject.subject}
                href={`/practice/grade/${paidGrade}/subject/${subject.subject}`}
                style={card}
              >
                <span style={cardTitle}>{subject.subject_display}</span>
                <span style={body}>{subject.exam_count} exams available</span>
                <span style={arrow}>›</span>
              </Link>
            ))}
          </section>
        </>
      )}
      <div style={{ height: 88 }} />
    </main>
  );
}

const shell = { minHeight: 'calc(100dvh - 64px)', maxWidth: 520, margin: '0 auto', padding: 16, background: 'var(--color-bg)' };
const eyebrow = { font: 'var(--text-label)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 8 };
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', lineHeight: 1.25, marginBottom: 8 };
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 20 };
const grid = { display: 'grid', gap: 12 };
const card = { position: 'relative', display: 'grid', gap: 6, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', textDecoration: 'none' };
const notice = { display: 'grid', gap: 12, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' };
const cardTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)' };
const body = { font: 'var(--text-body)', fontSize: 14, lineHeight: 1.45, color: 'var(--color-text-secondary)' };
const arrow = { position: 'absolute', right: 18, top: 18, color: 'var(--color-primary)', fontSize: 26 };
