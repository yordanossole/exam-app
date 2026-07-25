/**
 * StatChip
 * Pill-shaped card with an icon, a bold stat number, and a muted label.
 * Used in the home screen streak strip and results screen.
 *
 * variant: 'neutral' | 'green' | 'gold' | 'red'
 */
export function StatChip({ icon, value, label, variant = 'neutral', style: extra }) {
  const tints = {
    neutral: 'var(--color-bg)',
    green:   'var(--color-accent-tint)',
    gold:    'transparent',  /* gold uses text color only */
    red:     'var(--color-error-tint)',
  };
  const valueColors = {
    neutral: 'var(--color-text-primary)',
    green:   'var(--color-accent)',
    gold:    'var(--color-gold)',
    red:     'var(--color-error)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '10px 14px',
        borderRadius: 'var(--radius-chip)',
        background: tints[variant],
        border: '1px solid var(--color-border)',
        flex: 1,
        minWidth: 0,
        ...extra,
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden="true">{icon}</span>
      <span style={{
        font: 'var(--text-stat)',
        fontSize: 20,
        letterSpacing: 'var(--ls-number)',
        color: valueColors[variant],
        lineHeight: 1.1,
      }}>
        {value}
      </span>
      <span style={{
        font: 'var(--text-body)',
        fontSize: 11,
        color: 'var(--color-text-secondary)',
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}

/**
 * Badge / Chip
 * Compact pill with icon + text. Used for tags, status labels.
 * variant: 'green' | 'gold' | 'red' | 'neutral'
 */
export function Badge({ icon, text, variant = 'neutral' }) {
  const styles = {
    green:   { bg: 'var(--color-accent-tint)', color: 'var(--color-accent)' },
    gold:    { bg: 'rgba(232,163,61,0.15)',    color: 'var(--color-gold)'   },
    red:     { bg: 'var(--color-error-tint)',  color: 'var(--color-error)'  },
    neutral: { bg: 'var(--color-bg)',          color: 'var(--color-text-secondary)' },
  };
  const s = styles[variant];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      borderRadius: 999,
      background: s.bg,
      color: s.color,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 'var(--ls-label)',
    }}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {text}
    </span>
  );
}
