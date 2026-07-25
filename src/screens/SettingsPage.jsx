'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import BackButton from '../components/BackButton';

/* ── Reusable sub-components ──────────────────────────────────── */

function PageShell({ children }) {
  return (
    <div style={screenWrap}>
      <BackButton fallback="/profile" label="Back to Profile" />
      <main style={scrollContent}>{children}</main>
    </div>
  );
}

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

function SettingsRow({ icon, label, value, onPress, last = false, danger = false }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 16px', width: '100%', minHeight: 52,
        background: pressed ? 'var(--color-bg)' : 'none',
        border: 'none',
        borderBottom: last ? 'none' : '1px solid var(--color-border)',
        cursor: onPress ? 'pointer' : 'default', textAlign: 'left',
        transition: 'background var(--duration-tap) ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {icon && (
        <span style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: danger ? 'var(--color-error-tint)' : 'var(--color-accent-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>
          {icon}
        </span>
      )}
      <span style={{
        font: 'var(--text-body-med)', flex: 1,
        color: danger ? 'var(--color-error)' : 'var(--color-text-primary)',
      }}>
        {label}
      </span>
      {value && (
        <span style={{ font: 'var(--text-body)', fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {value}
        </span>
      )}
      {onPress && (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 16, marginLeft: 4 }}>›</span>
      )}
    </button>
  );
}

/* ── Theme option pill group ──────────────────────────────────── */
function ThemeSelector({ current, onChange }) {
  const options = [
    { id: 'light',  label: 'Light',  icon: '☀️' },
    { id: 'dark',   label: 'Dark',   icon: '🌙' },
    { id: 'system', label: 'System', icon: '⚙️' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, padding: '12px 16px' }}>
      {options.map(opt => {
        const active = current === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, padding: '10px 8px',
              borderRadius: 12, border: '1.5px solid',
              borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
              background: active ? 'var(--color-accent-tint)' : 'var(--color-bg)',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              transition: 'all var(--duration-tap) ease',
            }}
          >
            <span style={{ fontSize: 22 }}>{opt.icon}</span>
            <span style={{
              font: 'var(--text-body)', fontSize: 12, fontWeight: active ? 700 : 500,
              color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  // Local theme selection — 'light' | 'dark' | 'system'
  const [themeChoice, setThemeChoice] = useState(() => {
    if (typeof window === 'undefined') return 'system';

    const stored = localStorage.getItem('chessquiz-theme');
    return stored ?? 'system';
  });

  const [language] = useState('English');

  function handleThemeChange(choice) {
    setThemeChoice(choice);
    if (choice === 'dark')   { if (theme !== 'dark')  toggleTheme(); }
    if (choice === 'light')  { if (theme !== 'light') toggleTheme(); }
    if (choice === 'system') {
      localStorage.removeItem('chessquiz-theme');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      if (prefersDark && theme !== 'dark')  toggleTheme();
      if (!prefersDark && theme !== 'light') toggleTheme();
    }
  }

  return (
    <PageShell>

      {/* Appearance */}
      <SectionLabel>Appearance</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 16px 4px', borderBottom: '1px solid var(--color-border)' }}>
          <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
            Theme
          </p>
          <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Choose how the app looks
          </p>
        </div>
        <ThemeSelector current={themeChoice} onChange={handleThemeChange} />

        <SettingsRow icon="🌐" label="Language" value={language} onPress={() => {}} last />
      </Card>

      {/* Account */}
      <SectionLabel>Account</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <SettingsRow icon="✏️" label="Edit Profile"      onPress={() => {}} />
        <SettingsRow icon="🔑" label="Change Password"   onPress={() => {}} />
        <SettingsRow icon="📧" label="Email Address"     value="—"          onPress={() => {}} last />
      </Card>

      {/* Content */}
      <SectionLabel>Content</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <SettingsRow icon="📚" label="Default Subject"   value="All"  onPress={() => {}} />
        <SettingsRow icon="🎯" label="Difficulty"        value="Auto" onPress={() => {}} />
        <SettingsRow icon="⏱"  label="Exam Timer" value="2 hrs" onPress={() => {}} last />
      </Card>

      {/* Danger zone */}
      <SectionLabel>Account Actions</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
        <SettingsRow icon="🗑️" label="Clear Progress Data" onPress={() => {}} danger />
        <SettingsRow icon="🚪" label="Sign Out"            onPress={() => {}} danger last />
      </Card>

      <div style={{ height: 80 }} />
    </PageShell>
  );
}

/* ── Shared styles ────────────────────────────────────────────── */
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
