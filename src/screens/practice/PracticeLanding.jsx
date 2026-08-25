'use client';

import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';
import { getPaidGrade } from '../../lib/subscription';
import Button from '../../components/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function PracticeLanding({ catalog }) {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const paidGrade = getPaidGrade(state.user);
  const gradeCatalog = catalog.find(item => item.grade === paidGrade);

  return (
    <main style={shell}>
      <p style={eyebrow}>{t('nav.exams')}</p>
      <h1 style={title}>{t('practice.title')}</h1>

      {!paidGrade ? (
        <section style={notice}>
          <h2 style={cardTitle}>{t('practice.noPlan')}</h2>
          <p style={body}>{t('practice.noPlanBody')}</p>
          <Button onClick={() => window.location.assign('/upgrade')}>{t('common.viewPlans')}</Button>
        </section>
      ) : !gradeCatalog ? (
        <section style={notice}>
          <h2 style={cardTitle}>{t('practice.comingSoon', { grade: paidGrade })}</h2>
          <p style={body}>{t('practice.noExams', { grade: paidGrade })}</p>
        </section>
      ) : (
        <>
          <p style={subtitle}>{t('practice.gradeSubjects', { grade: paidGrade })}</p>
          <section style={grid}>
            {gradeCatalog.subjects.map(subject => (
              <Link
                key={subject.subject}
                href={`/practice/grade/${paidGrade}/subject/${subject.subject}`}
                style={card}
              >
                <span style={cardTitle}>{subject.subject_display}</span>
                <span style={body}>{t('common.examsAvailable', { count: subject.exam_count })}</span>
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

const shell = { minHeight: 'calc(var(--app-viewport-height) - 64px)', maxWidth: 520, margin: '0 auto', padding: 16, background: 'var(--color-bg)' };
const eyebrow = { font: 'var(--text-label)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 8 };
const title = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', lineHeight: 1.25, marginBottom: 8 };
const subtitle = { font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 20 };
const grid = { display: 'grid', gap: 12 };
const card = { position: 'relative', display: 'grid', gap: 6, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', textDecoration: 'none' };
const notice = { display: 'grid', gap: 12, padding: 18, borderRadius: 12, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' };
const cardTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)' };
const body = { font: 'var(--text-body)', fontSize: 14, lineHeight: 1.45, color: 'var(--color-text-secondary)' };
const arrow = { position: 'absolute', right: 18, top: 18, color: 'var(--color-primary)', fontSize: 26 };
