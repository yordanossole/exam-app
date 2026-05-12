export default function Screen({ children, style }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      minHeight: '100vh', background: '#f9f9ff',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', background: '#ffffff',
        ...style,
      }}>
        {children}
      </div>
    </div>
  );
}
