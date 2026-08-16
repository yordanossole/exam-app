'use client';

import { useState } from 'react';
import Card from '../components/Card';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({
    dailyReminder:   true,
    newExams:        true,
    correctAnswer:   false,
    subscriptionExp: true,
    promotions:      false,
  });

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div style={screenWrap}>
      <main style={scrollContent}>

        {/* Master switch */}
        <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <p style={{ font: 'var(--text-card-title)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
              {t('notifications.all')}
            </p>
            <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {t('notifications.allDescription')}
            </p>
          </div>
          <Toggle
            on={Object.values(prefs).some(Boolean)}
            onChange={v => setPrefs(Object.fromEntries(Object.keys(prefs).map(k => [k, v])))}
          />
        </Card>

        {/* Reminders */}
        <SectionLabel>{t('notifications.reminders')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="🌅" label={t('notifications.daily')}
            description={t('notifications.dailyDescription')}
            checked={prefs.dailyReminder} onChange={() => toggle('dailyReminder')} last
          />
        </Card>

        {/* Content */}
        <SectionLabel>{t('notifications.content')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="📋" label={t('notifications.newExams')}
            description={t('notifications.newExamsDescription')}
            checked={prefs.newExams} onChange={() => toggle('newExams')} last
          />
        </Card>

        {/* Learning */}
        <SectionLabel>{t('notifications.learning')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          <NotifRow
            icon="✅" label={t('notifications.insights')}
            description={t('notifications.insightsDescription')}
            checked={prefs.correctAnswer} onChange={() => toggle('correctAnswer')} last
          />
        </Card>

        {/* Account */}
        <SectionLabel>{t('notifications.account')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
          <NotifRow
            icon="⏰" label={t('notifications.expiring')}
            description={t('notifications.expiringDescription')}
            checked={prefs.subscriptionExp} onChange={() => toggle('subscriptionExp')}
          />
          <NotifRow
            icon="🎁" label={t('notifications.promotions')}
            description={t('notifications.promotionsDescription')}
            checked={prefs.promotions} onChange={() => toggle('promotions')} last
          />
        </Card>

        <div style={{ height: 80 }} />
      </main>
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
