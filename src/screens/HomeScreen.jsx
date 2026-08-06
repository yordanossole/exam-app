'use client';

import { useNavigate } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { getPaidGrade } from '../lib/subscription';
import Card from '../components/Card';
import { Badge, StatChip } from '../components/StatChip';
import Button from '../components/Button';

const SUBJECT_ICONS = {
  mathematics: '📐',
  english: '🌍',
  amharic: '🇪🇹',
  environmental_science: '🌱',
  general_science: '🔬',
  citizenship: '⚖️',
  citizenship_and_moral_education: '⚖️',
  afaan_oromo: '🗣️',
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function subjectIcon(subject) {
  return SUBJECT_ICONS[subject] ?? '📘';
}

export default function HomeScreen({ library = [] }) {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const user = state.user;
  const paidGrade = getPaidGrade(user);
  const gradeLibrary = library.find(item => item.grade === paidGrade);
  const firstName = user?.display_name?.split(' ')[0] ?? 'there';

  return (
    <div style={screenWrap}>
      <main style={scrollContent}>
        <section style={intro}>
          <p style={greeting}>{getGreeting()}, {firstName}.</p>
          <h1 style={headline}>Build confidence for exam day.</h1>
          <p style={introCopy}>Practice official national examination papers, one subject at a time.</p>
        </section>

        <section style={heroCard}>
          <div style={heroTop}>
            <div style={heroIcon}>📝</div>
            <Badge
              text={paidGrade ? `Grade ${paidGrade} plan` : 'Plan required'}
              variant={paidGrade ? 'orange' : 'neutral'}
            />
          </div>
          <h2 style={heroTitle}>{paidGrade ? `Grade ${paidGrade} exam library` : 'Unlock your exam library'}</h2>
          <p style={heroCopy}>
            {gradeLibrary
              ? 'Your paid-grade papers are ready. Choose a subject or jump into the full library.'
              : 'Activate a grade plan to access the papers assigned to your preparation path.'}
          </p>

          {gradeLibrary && (
            <div style={statGrid}>
              <StatChip icon="📚" value={gradeLibrary.exam_count} label="Papers" variant="orange" />
              <StatChip icon="📖" value={gradeLibrary.subject_count} label="Subjects" variant="blue" />
              <StatChip icon="❓" value={gradeLibrary.question_count} label="Questions" variant="mint" />
            </div>
          )}

          <Button variant="warm" full size="lg" onClick={() => navigate(paidGrade ? '/practice' : '/upgrade')}>
            {paidGrade ? 'Open Exam Library' : 'View Plans'}
          </Button>
        </section>

        {gradeLibrary && (
          <>
            <section style={section}>
              <div style={sectionHeader}>
                <div>
                  <p style={sectionEyebrow}>Your plan</p>
                  <h2 style={sectionTitle}>Subjects to practice</h2>
                </div>
                <button type="button" onClick={() => navigate('/practice')} style={textButton}>See all</button>
              </div>
              <div style={subjectGrid}>
                {gradeLibrary.subjects.slice(0, 6).map(subject => (
                  <Card
                    key={subject.subject}
                    onPress={() => navigate(`/practice/grade/${paidGrade}/subject/${subject.subject}`)}
                    padding="14px"
                    style={subjectCard}
                  >
                    <span style={subjectIconStyle}>{subjectIcon(subject.subject)}</span>
                    <span style={subjectName}>{subject.subject_display}</span>
                    <span style={subjectMeta}>{subject.exam_count} {subject.exam_count === 1 ? 'paper' : 'papers'}</span>
                  </Card>
                ))}
              </div>
            </section>

            <section style={section}>
              <div style={sectionHeader}>
                <div>
                  <p style={sectionEyebrow}>Recently added</p>
                  <h2 style={sectionTitle}>Latest exam papers</h2>
                </div>
                <span style={sectionHint}>E.C. years</span>
              </div>
              <div style={paperList}>
                {gradeLibrary.latest_exams.map((exam, index) => (
                  <button
                    key={exam.exam_id}
                    type="button"
                    onClick={() => navigate(`/practice/exam/${exam.exam_id}`)}
                    style={{ ...paperRow, borderBottom: index === gradeLibrary.latest_exams.length - 1 ? 'none' : paperRow.borderBottom }}
                  >
                    <span style={yearBadge}>{exam.year_ec}</span>
                    <span style={paperInfo}>
                      <strong style={paperTitle}>{exam.subject_display}</strong>
                      <span style={paperMeta}>{exam.total_questions} questions · {exam.total_sections} sections</span>
                    </span>
                    <span style={paperArrow}>›</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        <section style={tipCard}>
          <span style={tipIcon}>💡</span>
          <div>
            <p style={sectionEyebrow}>Study tip</p>
            <p style={tipText}>Use Practice mode when learning. Check the hint first, then reveal the explanation only when you need it.</p>
          </div>
        </section>

        <div style={{ height: 88 }} />
      </main>
    </div>
  );
}

const screenWrap = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 480, margin: '0 auto', background: 'var(--color-bg)' };
const scrollContent = { flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)', WebkitOverflowScrolling: 'touch' };
const intro = { marginBottom: 20 };
const greeting = { font: 'var(--text-body)', fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 };
const headline = { font: 'var(--text-screen-title)', color: 'var(--color-text-strong)', lineHeight: 1.2, marginBottom: 8 };
const introCopy = { font: 'var(--text-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--color-text-secondary)' };
const heroCard = { marginBottom: 24, padding: 20, background: 'var(--color-bg)', border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' };
const heroTop = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 };
const heroIcon = { width: 46, height: 46, borderRadius: 12, background: 'var(--color-accent-tint)', display: 'grid', placeItems: 'center', fontSize: 23 };
const heroTitle = { font: 'var(--text-card-title)', fontSize: 19, color: 'var(--color-text-strong)', marginBottom: 6 };
const heroCopy = { font: 'var(--text-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--color-text-secondary)', marginBottom: 16 };
const statGrid = { display: 'flex', gap: 8, marginBottom: 18 };
const section = { marginBottom: 24 };
const sectionHeader = { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 12 };
const sectionEyebrow = { font: 'var(--text-label)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 };
const sectionTitle = { font: 'var(--text-card-title)', color: 'var(--color-text-strong)' };
const textButton = { minHeight: 32, padding: '0 4px', color: 'var(--color-primary)', font: 'var(--text-btn)' };
const sectionHint = { font: 'var(--text-caption)', color: 'var(--color-text-muted)' };
const subjectGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 };
const subjectCard = { display: 'grid', gap: 5, minHeight: 118 };
const subjectIconStyle = { fontSize: 23, lineHeight: 1, marginBottom: 4 };
const subjectName = { font: 'var(--text-card-title)', fontSize: 14, color: 'var(--color-text-strong)', lineHeight: 1.25 };
const subjectMeta = { font: 'var(--text-caption)', fontSize: 12, color: 'var(--color-text-secondary)' };
const paperList = { overflow: 'hidden', borderRadius: 'var(--radius-card)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' };
const paperRow = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 68, padding: '10px 14px', background: 'var(--color-surface)', border: 'none', borderBottom: '1px solid var(--color-border)', textAlign: 'left' };
const yearBadge = { display: 'grid', placeItems: 'center', width: 46, height: 38, flexShrink: 0, borderRadius: 9, background: 'var(--color-primary-tint)', color: 'var(--color-primary)', font: 'var(--text-label)' };
const paperInfo = { display: 'grid', gap: 3, flex: 1, minWidth: 0 };
const paperTitle = { font: 'var(--text-body-med)', color: 'var(--color-text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const paperMeta = { font: 'var(--text-caption)', fontSize: 12, color: 'var(--color-text-secondary)' };
const paperArrow = { color: 'var(--color-text-muted)', fontSize: 24 };
const tipCard = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 'var(--radius-card)', background: 'var(--color-success-tint)', border: '1px solid var(--color-border)' };
const tipIcon = { fontSize: 22, lineHeight: 1 };
const tipText = { font: 'var(--text-body)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' };
