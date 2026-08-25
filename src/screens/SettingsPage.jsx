'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/Card';

/* ── Reusable sub-components ──────────────────────────────────── */

function PageShell({ children }) {
  return (
    <div style={screenWrap}>
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
  const { t } = useLanguage();
  const options = [
    { id: 'light',  label: t('settings.light'),  icon: '☀️' },
    { id: 'dark',   label: t('settings.dark'),   icon: '🌙' },
    { id: 'system', label: t('settings.system'), icon: '⚙️' },
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

function LanguageSelector({ current, onChange }) {
  const { languages, t } = useLanguage();

  return (
    <div style={languageSelector}>
      <p style={languageHelp}>{t('language.description')}</p>
      <div style={languageOptions}>
        {languages.map(option => {
          const active = option.code === current;
          return (
            <button
              key={option.code}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.code)}
              style={{
                ...languageOption,
                borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                background: active ? 'var(--color-primary-tint)' : 'var(--color-bg)',
                color: active ? 'var(--color-primary)' : 'var(--color-text-primary)',
              }}
            >
              <span>{option.nativeName}</span>
              {active && <span aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);

  // Local theme selection — 'light' | 'dark' | 'system'
  const [themeChoice, setThemeChoice] = useState(() => {
    if (typeof window === 'undefined') return 'system';

    const stored = localStorage.getItem('chessquiz-theme');
    return stored ?? 'system';
  });

  const languageName = languages.find(item => item.code === language)?.nativeName ?? language;

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
      <SectionLabel>{t('settings.appearance')}</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 16px 4px', borderBottom: '1px solid var(--color-border)' }}>
          <p style={{ font: 'var(--text-body-med)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
            {t('settings.theme')}
          </p>
          <p style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {t('settings.themeDescription')}
          </p>
        </div>
        <ThemeSelector current={themeChoice} onChange={handleThemeChange} />

        <SettingsRow icon="🌐" label={t('language.title')} value={languageName} onPress={() => setLanguageOpen(open => !open)} last />
        {languageOpen && <LanguageSelector current={language} onChange={setLanguage} />}
      </Card>

      {/* Account */}
      <SectionLabel>{t('settings.account')}</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <SettingsRow icon="✏️" label={t('settings.editProfile')} onPress={() => {}} />
        <SettingsRow icon="🔑" label={t('settings.changePassword')} onPress={() => {}} />
        <SettingsRow icon="📧" label={t('settings.emailAddress')} value="—" onPress={() => {}} last />
      </Card>

      {/* Content */}
      <SectionLabel>{t('settings.content')}</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <SettingsRow icon="📚" label={t('settings.defaultSubject')} value={t('settings.all')} onPress={() => {}} />
        <SettingsRow icon="🎯" label={t('settings.difficulty')} value={t('settings.auto')} onPress={() => {}} />
        <SettingsRow icon="⏱" label={t('settings.examTimer')} value={t('settings.twoHours')} onPress={() => {}} last />
      </Card>

      {/* Danger zone */}
      <SectionLabel>{t('settings.accountActions')}</SectionLabel>
      <Card padding="0" style={{ overflow: 'hidden', marginBottom: 32 }}>
        <SettingsRow icon="🚪" label={t('settings.signOut')} onPress={() => {}} danger last />
      </Card>

      <div style={{ height: 80 }} />
    </PageShell>
  );
}

/* ── Shared styles ────────────────────────────────────────────── */
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
const languageSelector = { padding: '0 16px 14px', borderTop: '1px solid var(--color-border)' };
const languageHelp = { padding: '12px 0 8px', font: 'var(--text-caption)', color: 'var(--color-text-secondary)' };
const languageOptions = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 };
const languageOption = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 44, padding: '9px 12px', border: '1.5px solid', borderRadius: 10, font: 'var(--text-body-med)', cursor: 'pointer' };
