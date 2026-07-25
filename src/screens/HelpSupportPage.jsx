'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import Card from '../components/Card';

const FAQS = [
  {
    q: 'How do I start an exam?',
    a: 'Go to Subjects, pick a subject, then tap any exam card to begin.',
  },
  {
    q: 'Can I resume an exam I left mid-way?',
    a: 'Yes. Your progress is saved automatically. Reopen the same exam to continue where you left off.',
  },
  {
    q: 'How is my accuracy calculated?',
    a: 'Accuracy = (correct answers ÷ total answered) × 100, updated after each submitted exam.',
  },
  {
    q: 'What is a streak?',
    a: 'A streak counts consecutive days you complete at least one exam. Missing a day resets it to zero.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'Tap "Upgrade Plan" on your Profile page to view available subscription tiers.',
  },
  {
    q: 'How do I reset my progress?',
    a: 'Go to Settings → Account Actions → Clear Progress Data. This action cannot be undone.',
  },
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
  { icon: '📧', label: 'Email Support',    value: 'support@examapp.com' },
  { icon: '💬', label: 'Live Chat',        value: 'Available 9am–6pm' },
  { icon: '📖', label: 'Documentation',    value: 'docs.examapp.com' },
  { icon: '🐛', label: 'Report a Bug',     value: null },
];

export default function HelpSupportPage() {
  const navigate = useNavigate();

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={pageTitle}>Help & Support</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>

        {/* Search hint */}
        <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🔍</span>
          <div>
            <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
              Quick Answers
            </p>
            <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Browse FAQs below or contact our support team.
            </p>
          </div>
        </Card>

        {/* FAQ */}
        <SectionLabel>Frequently Asked Questions</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
          {FAQS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} last={i === FAQS.length - 1} />
          ))}
        </Card>

        {/* Contact */}
        <SectionLabel>Contact Us</SectionLabel>
        <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
          {CONTACT_ITEMS.map((item, i) => (
            <button
              key={item.label}
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
                {item.label}
              </span>
              {item.value && (
                <span style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {item.value}
                </span>
              )}
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 16, marginLeft: 4 }}>›</span>
            </button>
          ))}
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
