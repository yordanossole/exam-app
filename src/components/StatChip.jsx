/**
 * NT Exams StatChip
 * Pill-shaped card with icon, bold stat number, and muted caption.
 * variant: 'blue' | 'orange' | 'mint' | 'cyan' | 'neutral'
 */
export function StatChip({ icon, value, label, variant = 'neutral', style: extra }) {
  const palettes = {
    blue:    { bg: 'var(--color-primary-tint)', valueColor: 'var(--color-primary)' },
    orange:  { bg: 'var(--color-accent-tint)',  valueColor: 'var(--color-accent)'  },
    mint:    { bg: 'var(--color-success-tint)', valueColor: 'var(--color-success)' },
    cyan:    { bg: 'var(--color-info-tint)',    valueColor: 'var(--color-info)'    },
    neutral: { bg: 'var(--color-surface)',      valueColor: 'var(--color-text-primary)' },
    // legacy aliases kept for existing pages
    green:   { bg: 'var(--color-success-tint)', valueColor: 'var(--color-success)' },
    gold:    { bg: 'var(--color-accent-tint)',  valueColor: 'var(--color-accent)'  },
  };

  const p = palettes[variant] ?? palettes.neutral;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '10px 12px', borderRadius: 'var(--radius-chip)',
      background: p.bg, border: '1px solid var(--color-border)',
      flex: 1, minWidth: 0, ...extra,
    }}>
      {icon && <span style={{ fontSize: 17, lineHeight: 1 }} aria-hidden="true">{icon}</span>}
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
        letterSpacing: 'var(--ls-tight)', color: p.valueColor, lineHeight: 1.1,
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10,
        color: 'var(--color-text-muted)', letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}

/**
 * Badge — compact pill tag
 * variant: 'blue' | 'orange' | 'mint' | 'cyan' | 'neutral' | 'green' | 'gold'
 */
export function Badge({ icon, text, variant = 'blue' }) {
  const palettes = {
    blue:    { bg: 'var(--color-primary-tint)', color: 'var(--color-primary)'  },
    orange:  { bg: 'var(--color-accent-tint)',  color: 'var(--color-accent)'   },
    mint:    { bg: 'var(--color-success-tint)', color: 'var(--color-success)'  },
    cyan:    { bg: 'var(--color-info-tint)',    color: 'var(--color-info)'     },
    neutral: { bg: 'var(--color-surface-alt)',  color: 'var(--color-text-secondary)' },
    green:   { bg: 'var(--color-success-tint)', color: 'var(--color-success)'  },
    gold:    { bg: 'var(--color-accent-tint)',  color: 'var(--color-accent)'   },
  };
  const p = palettes[variant] ?? palettes.blue;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 999,
      background: p.bg, color: p.color,
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11,
      letterSpacing: 'var(--ls-wide)', lineHeight: 1.5,
    }}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {text}
    </span>
  );
}
