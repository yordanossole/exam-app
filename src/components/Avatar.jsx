/**
 * Avatar
 * Perfect circle. Shows image if src provided, else initials from name.
 * ring: show an accent-green ring (used when user has active streak).
 * size: number in px (default 40)
 */
export default function Avatar({ src, name = '?', size = 40, ring = false, style: extra }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: src ? 'transparent' : 'var(--color-accent-tint)',
        color: 'var(--color-accent)',
        fontWeight: 700,
        fontSize: size * 0.38,
        outline: ring ? `2.5px solid var(--color-accent)` : 'none',
        outlineOffset: 2,
        userSelect: 'none',
        ...extra,
      }}
      aria-label={name}
    >
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial}
    </div>
  );
}
