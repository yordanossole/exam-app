/**
 * NT Exams ProgressBar
 * Thin (6px default), fully-rounded, Nova Blue fill.
 * Pass value + max to auto-calculate percent, or value as 0-100.
 * color prop overrides the fill (e.g. use --color-accent for mock exam)
 */
export default function ProgressBar({ value = 0, max, height = 6, color, style: extra }) {
  const pct = max != null ? Math.min(100, (value / max) * 100) : Math.min(100, value);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: '100%',
        height,
        borderRadius: 999,
        background: 'var(--color-track)',
        overflow: 'hidden',
        flexShrink: 0,
        ...extra,
      }}
    >
      <div style={{
        height: '100%',
        width: `${pct}%`,
        borderRadius: 999,
        background: color ?? 'var(--color-primary)',
        transition: 'width 0.35s var(--ease-out)',
      }} />
    </div>
  );
}
