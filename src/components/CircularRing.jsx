/**
 * NT Exams CircularRing
 * SVG arc for score ring and countdown timer.
 * Defaults to Nova Blue fill on a neutral track.
 */
export default function CircularRing({
  size = 120,
  strokeWidth = 10,
  value = 0,
  color,
  children,
  style: extra,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...extra }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--color-track)" strokeWidth={strokeWidth}
        />
        {/* Fill arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color ?? 'var(--color-primary)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s var(--ease-out)' }}
        />
      </svg>
      {/* Center */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}
