'use client';

import { useState } from 'react';
import Card from '../components/Card';
import { useLanguage } from '../context/LanguageContext';

const FAQS = [
  { qKey: 'help.startQ', aKey: 'help.startA' },
  { qKey: 'help.resumeQ', aKey: 'help.resumeA' },
  { qKey: 'help.accuracyQ', aKey: 'help.accuracyA' },
  { qKey: 'help.upgradeQ', aKey: 'help.upgradeA' },
];

function FaqItem({ q, a, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ flex: 1, font: 'var(--text-body-med)', color: 'var(--color-text-primary)' }}>
          {q}
        </span>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 18, transition: 'transform 200ms', transform: open ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </button>
      {open && (
        <p style={{
          font: 'var(--text-body)', fontSize: 14, color: 'var(--color-text-secondary)',
          padding: '0 16px 14px', lineHeight: 1.6,
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      font: 'var(--text-body)', fontSize: 11, fontWeight: 700,
      letterSpacing: 'var(--ls-label)', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)', padding: '0 4px', marginBottom: 8, marginTop: 4,
    }}>
      {children}
    </p>
  );
}

const CONTACT_ITEMS = [
  { icon: '📧', labelKey: 'help.email', value: 'support@examapp.com' },
  { icon: '💬', labelKey: 'help.chat', valueKey: 'help.chatHours' },
  { icon: '📖', labelKey: 'help.documentation', value: 'docs.examapp.com' },
  { icon: '🐛', labelKey: 'help.reportBug' },
];

export default function HelpSupportPage() {
  const { t } = useLanguage();

  return (
    <div style={screenWrap}>
      <main style={scrollContent}>

        {/* Search hint */}
        <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🔍</span>
          <div>
            <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
              {t('help.quickAnswers')}
            </p>
            <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {t('help.quickDescription')}
            </p>
          </div>
        </Card>

        {/* FAQ */}
        <SectionLabel>{t('help.faq')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          {FAQS.map((item, i) => (
            <FaqItem key={item.qKey} q={t(item.qKey)} a={t(item.aKey)} last={i === FAQS.length - 1} />
          ))}
        </Card>

        {/* Contact */}
        <SectionLabel>{t('help.contact')}</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
          {CONTACT_ITEMS.map((item, i) => (
            <button
              key={item.labelKey}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 16px', width: '100%', minHeight: 52,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: i < CONTACT_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                textAlign: 'left', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'var(--color-accent-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {item.icon}
              </span>
              <span style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', flex: 1 }}>
                {t(item.labelKey)}
              </span>
              {(item.value || item.valueKey) && (
                <span style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {item.value ?? t(item.valueKey)}
                </span>
              )}
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 16, marginLeft: 4 }}>›</span>
            </button>
          ))}
        </Card>

        <div style={{ height: 80 }} />
      </main>
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: 'var(--app-viewport-height)', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const scrollContent = {
  flex: 1, overflowY: 'auto',
  padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
