export default function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ height: 3, background: '#e0e2ed' }}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: '100%', width: `${pct}%`, background: '#006e28', borderRadius: 9999, transition: 'width 0.3s ease' }}
      />
    </div>
  );
}
