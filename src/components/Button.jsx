const styles = {
  base: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
    fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
    padding: '12px 28px', transition: 'opacity 0.15s',
  },
  primary: { background: '#0058bc', color: '#ffffff' },
  ghost:   { background: 'none', border: '1.5px solid #c1c6d7', color: '#414755', padding: '11px 20px' },
  danger:  { background: 'none', border: '1.5px solid #c1c6d7', color: '#bc000a', width: '100%', justifyContent: 'center' },
  full:    { width: '100%', justifyContent: 'center', borderRadius: '0.75rem', padding: '16px 28px', fontSize: 16 },
};

export default function Button({ children, variant = 'primary', full = false, onClick, disabled, type = 'button', style: extra }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        ...styles[variant],
        ...(full ? styles.full : {}),
        ...(disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
        ...extra,
      }}
    >
      {children}
    </button>
  );
}
