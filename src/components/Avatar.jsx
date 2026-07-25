/**
 * NT Exams Avatar
 * Circular with optional Nova Blue ring (active streak / online indicator).
 */
export default function Avatar({ src, name = '?', size = 40, ring = false, onClick, style: extra }) {
  const initial = String(name).charAt(0).toUpperCase();

  return (
    <div
      aria-label={name}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
      style={{
        width: size, height: size,
        borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: src ? 'transparent' : 'var(--color-primary-tint)',
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700, fontSize: size * 0.38,
        outline: ring ? '2.5px solid var(--color-primary)' : 'none',
        outlineOffset: 2,
        userSelect: 'none',
        ...extra,
      }}
    >
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial}
    </div>
  );
}
