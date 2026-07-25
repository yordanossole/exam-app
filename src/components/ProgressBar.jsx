/**
 * ProgressBar
 * Thin (7px) fully-rounded bar, accent-green fill, smooth width transition.
 * value: 0–100 (percentage) OR pass value + max to auto-calculate.
 */
export default function ProgressBar({ value = 0, max, height = 7, style: extra }) {
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
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 999,
          background: 'var(--color-accent)',
          transition: 'width 0.3s var(--ease-out)',
        }}
      />
    </div>
  );
}
