'use client';

import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';
import { getPaidGrade } from '../../lib/subscription';
import BackButton from '../../components/BackButton';

export default function PaidGradeGate({ grade, children }) {
  const { state } = useAppContext();
  const paidGrade = getPaidGrade(state.user);

  if (!paidGrade) {
    return (
      <main style={shell}>
        <BackButton fallback="/practice" label="Back to Exams" />
        <section style={card}>
          <h1 style={title}>No active grade plan</h1>
          <p style={body}>Activate a grade plan to access its exams.</p>
          <Link href="/upgrade" style={button}>View Plans</Link>
        </section>
      </main>
    );
  }

  if (paidGrade !== grade) {
    return (
      <main style={shell}>
        <BackButton fallback="/practice" label="Back to Exams" />
        <section style={card}>
          <h1 style={title}>Grade {grade} is not in your plan</h1>
          <p style={body}>Your active plan is for Grade {paidGrade}.</p>
          <Link href="/practice" style={button}>Back to My Exams</Link>
        </section>
      </main>
    );
  }

  return children;
}

const shell = { minHeight: 'calc(100dvh - 64px)', maxWidth: 520, margin: '0 auto', padding: 16, background: 'var(--color-bg)' };
const card = { display: 'grid', gap: 12, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' };
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)' };
const body = { font: 'var(--text-body)', lineHeight: 1.45, color: 'var(--color-text-secondary)' };
const button = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '0 16px', borderRadius: 10, background: 'var(--color-primary)', color: '#fff', font: 'var(--text-btn)', textDecoration: 'none' };
