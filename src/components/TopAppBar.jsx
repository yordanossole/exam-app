'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '../lib/navigation';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getPaidGrade } from '../lib/subscription';

export default function TopAppBar() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const pathname = usePathname();
  const paidGrade = getPaidGrade(state.user);
  const logoSrc = theme === 'dark' ? '/@Logos/logo-white.png' : '/@Logos/logo-blue.png';
  const isHome = pathname === '/';
  const isExam = pathname.startsWith('/practice/exam/');
  const isResults = pathname === '/practice/results';
  const isYearChoosing = pathname.startsWith('/practice/grade/') && pathname.includes('/subject/');
  const isQuestionFlow = isExam && pathname.split('/').length > 4;
  const title = getPageTitle(pathname, t);

  function goBackFromExam() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/practice', { replace: true });
  }

  return (
    <header style={bar}>
      <div style={inner}>
        {isExam || isResults || isYearChoosing ? (
          <>
            <button type="button" onClick={goBackFromExam} aria-label={t('nav.goBack')} style={examBackButton}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isQuestionFlow && <ExamTimer key={pathname} />}
          </>
        ) : (
          <>
            <button type="button" onClick={() => navigate('/')} aria-label={t('nav.goHome')} style={brandButton}>
              <img src={logoSrc} alt="NT Exams" style={logo} />
            </button>
            {!isHome && <span style={pageTitle}>{title}</span>}
            <div style={actions}>
              <span className="grade-badge">{paidGrade ? t('common.grade', { grade: paidGrade }) : '—'}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function ExamTimer() {
  const { t } = useLanguage();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setElapsedSeconds(seconds => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const time = hours > 0
    ? [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
    : [minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');

  return (
    <div role="timer" aria-label={t('nav.elapsedTime', { time })} style={timer}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 9v4l2.5 1.5M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{time}</span>
    </div>
  );
}

function getPageTitle(pathname, t) {
  if (pathname.startsWith('/practice/exam/')) return t('nav.exam');
  if (pathname.startsWith('/practice/grade/')) return pathname.includes('/subject/') ? t('nav.examYears') : t('nav.subjects');
  if (pathname.startsWith('/practice')) return t('nav.exams');
  if (pathname.startsWith('/profile')) return t('nav.profile');
  if (pathname.startsWith('/settings')) return t('nav.settings');
  if (pathname.startsWith('/notifications')) return t('nav.notifications');
  if (pathname.startsWith('/help')) return t('nav.help');
  if (pathname.startsWith('/upgrade')) return t('nav.upgrade');
  if (pathname.startsWith('/payment')) return t('nav.payment');
  if (pathname.startsWith('/admin')) return t('nav.review');
  return 'NT Exams';
}

const bar = {
  position: 'sticky', top: 0, zIndex: 300,
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  boxShadow: '0 2px 8px rgba(11, 16, 32, 0.06)',
};
const inner = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', maxWidth: 480, minHeight: 64, margin: '0 auto', padding: '10px var(--screen-pad)',
};
const brandButton = {
  display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: 0,
};
const examBackButton = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 40, height: 40, padding: 0, border: 'none', borderRadius: '50%',
  background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer',
};
const timer = {
  display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 70,
  justifyContent: 'flex-end', color: 'var(--color-primary)',
  font: 'var(--text-label)', fontVariantNumeric: 'tabular-nums',
};
const pageTitle = { flex: 1, textAlign: 'center', font: 'var(--text-card-title)', color: 'var(--color-text-strong)' };
const logo = { display: 'block', width: 'auto', height: 32 };
const actions = { display: 'flex', alignItems: 'center', gap: 10 };
