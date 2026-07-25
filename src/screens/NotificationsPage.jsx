'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import Card from '../components/Card';

/* ── Toggle Switch ────────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 26, borderRadius: 13, border: 'none', padding: 0,
        background: on ? 'var(--color-accent)' : 'var(--color-track)',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background var(--duration-tap) ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 150ms ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ── Notification row ─────────────────────────────────────────── */
function NotifRow({ icon, label, description, checked, onChange, last = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--color-border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'var(--color-accent-tint)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
          {label}
        </p>
        {description && (
          <p style={{ font: 'var(--text-body)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
      <Toggle on={checked} onChange={onChange} />
    </div>
  );
}

/* ── Section label ────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{
      font: 'var(--text-body)', fontSize: 11, fontWeight: 700,
      letterSpacing: 'var(--ls-label)', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)',
      padding: '0 4px', marginBottom: 8, marginTop: 4,
    }}>
      {children}
    </p>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function NotificationsPage() {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    dailyReminder:   true,
    streakAlert:     true,
    newExams:        true,
    weeklyReport:    false,
    achievements:    true,
    correctAnswer:   false,
    subscriptionExp: true,
    promotions:      false,
  });

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={pageTitle}>Notifications</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>

        {/* Master switch */}
        <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
              All Notifications
            </p>
            <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Enable or disable all notifications at once
            </p>
          </div>
          <Toggle
            on={Object.values(prefs).some(Boolean)}
            onChange={v => setPrefs(Object.fromEntries(Object.keys(prefs).map(k => [k, v])))}
          />
        </Card>

        {/* Reminders */}
        <SectionLabel>Reminders</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="🌅" label="Daily Reminder"
            description="Get reminded to complete your daily quiz"
            checked={prefs.dailyReminder} onChange={() => toggle('dailyReminder')}
          />
          <NotifRow
            icon="🔥" label="Streak Alert"
            description="Don't let your streak break!"
            checked={prefs.streakAlert} onChange={() => toggle('streakAlert')} last
          />
        </Card>

        {/* Content */}
        <SectionLabel>Content</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="📋" label="New Exams Added"
            description="When new exams are available for your subjects"
            checked={prefs.newExams} onChange={() => toggle('newExams')}
          />
          <NotifRow
            icon="📊" label="Weekly Report"
            description="A summary of your weekly performance"
            checked={prefs.weeklyReport} onChange={() => toggle('weeklyReport')} last
          />
        </Card>

        {/* Achievements */}
        <SectionLabel>Achievements</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="🏆" label="Achievements"
            description="When you unlock a new badge or milestone"
            checked={prefs.achievements} onChange={() => toggle('achievements')}
          />
          <NotifRow
            icon="✅" label="Answer Insights"
            description="Tips when you get a question wrong"
            checked={prefs.correctAnswer} onChange={() => toggle('correctAnswer')} last
          />
        </Card>

        {/* Account */}
        <SectionLabel>Account</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
          <NotifRow
            icon="⏰" label="Subscription Expiring"
            description="Reminder before your plan expires"
            checked={prefs.subscriptionExp} onChange={() => toggle('subscriptionExp')}
          />
          <NotifRow
            icon="🎁" label="Promotions & Offers"
            description="Special deals and discounts"
            checked={prefs.promotions} onChange={() => toggle('promotions')} last
          />
        </Card>

        <div style={{ height: 32 }} />
      </main>
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const pageHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  height: 56, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const pageTitle = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const backBtn = {
  background: 'none', border: 'none', fontSize: 22, color: 'var(--color-accent)',
  cursor: 'pointer', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
