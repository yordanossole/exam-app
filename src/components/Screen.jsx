export default function Screen({ children, style }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f9f9ff',
    }}>
      <div style={{
        width: '100%',
        /* mobile: full-width; tablet: up to 768px; desktop: up to 1024px */
        maxWidth: 'min(100%, 1024px)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#ffffff',
        /* subtle side shadow on wide viewports */
        boxShadow: '0 0 0 1px #e0e2ed',
        ...style,
      }}>
        {children}
      </div>
    </div>
  );
}
