export default function ExplanationBlock({ text }) {
  return (
    <div style={{
      background: '#fffde7', borderRadius: '0.75rem',
      padding: 16, borderLeft: '4px solid #0058bc',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600, color: '#181c23' }}>
          <span>💡</span>
          <span>Explanation</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button aria-label="Bookmark" style={actionBtn}>🔖</button>
          <button aria-label="Share"    style={actionBtn}>↗</button>
        </div>
      </div>
      <p style={{ fontSize: 15, lineHeight: '22px', color: '#181c23' }}>{text}</p>
    </div>
  );
}

const actionBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 16, color: '#414755',
};
