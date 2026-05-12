export default function SubjectCard({ subject, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: 16, background: '#ffffff', border: 'none',
        borderBottom: '0.5px solid #e0e2ed', cursor: 'pointer',
        width: '100%', textAlign: 'left', transition: 'background 0.1s',
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f3fe'}
      onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '0.5rem',
        background: subject.color, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        {subject.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#181c23' }}>{subject.name}</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: '#717786', textTransform: 'uppercase', marginTop: 2 }}>
          {subject.examCount} Exams
        </div>
      </div>
      <span style={{ color: '#c1c6d7', fontSize: 18 }}>›</span>
    </button>
  );
}
