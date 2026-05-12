export default function StatCard({ value, label }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e0e2ed',
      borderRadius: '0.75rem', padding: 16,
    }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: '#0058bc', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#717786' }}>{label}</div>
    </div>
  );
}
