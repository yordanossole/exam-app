'use client';

import { useNavigate } from '../lib/navigation';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getPaidGrade } from '../lib/subscription';

export default function TopAppBar() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { theme } = useTheme();
  const pathname = usePathname();
  const paidGrade = getPaidGrade(state.user);
  const logoSrc = theme === 'dark' ? '/@Logos/logo-white.png' : '/@Logos/logo-blue.png';
  const isHome = pathname === '/';
  const title = getPageTitle(pathname);

  return (
    <header style={bar}>
      <div style={inner}>
        <button type="button" onClick={() => navigate('/')} aria-label="Go to home" style={brandButton}>
          <img src={logoSrc} alt="NT Exams" style={logo} />
        </button>
        {!isHome && <span style={pageTitle}>{title}</span>}
        <div style={actions}>
          <span className="grade-badge">{paidGrade ? `Grade ${paidGrade}` : '—'}</span>
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/practice/exam/')) return 'Exam';
  if (pathname.startsWith('/practice/grade/')) return pathname.includes('/subject/') ? 'Exam Years' : 'Subjects';
  if (pathname.startsWith('/practice')) return 'Exams';
  if (pathname.startsWith('/profile')) return 'Profile';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/notifications')) return 'Notifications';
  if (pathname.startsWith('/help')) return 'Help & Support';
  if (pathname.startsWith('/upgrade')) return 'Upgrade Plan';
  if (pathname.startsWith('/payment')) return 'Complete Payment';
  if (pathname.startsWith('/admin')) return 'Content Review';
  return 'NT Exams';
}

const bar = {
  position: 'sticky', top: 0, zIndex: 300,
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
};
const inner = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', maxWidth: 480, minHeight: 64, margin: '0 auto', padding: '10px var(--screen-pad)',
};
const brandButton = {
  display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: 0,
};
const pageTitle = { flex: 1, textAlign: 'center', font: 'var(--text-card-title)', color: 'var(--color-text-strong)' };
const logo = { display: 'block', width: 'auto', height: 32 };
const actions = { display: 'flex', alignItems: 'center', gap: 10 };
