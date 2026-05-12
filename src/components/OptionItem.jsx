const LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function OptionItem({ option, index, mode = 'question', selected, correct, onSelect }) {
  // mode: 'question' | 'result'
  const isCorrect  = mode === 'result' && option.id === correct;
  const isWrong    = mode === 'result' && selected === option.id && option.id !== correct;
  const isSelected = mode === 'question' && selected === option.id;

  const borderColor = isCorrect ? '#006e28' : isWrong ? '#bc000a' : isSelected ? '#0058bc' : '#c1c6d7';
  const borderWidth = isCorrect || isWrong || isSelected ? 2 : 1;
  const bg          = isCorrect ? '#f0fff4' : isWrong ? '#fff5f5' : '#ffffff';
  const textColor   = isCorrect ? '#006e28' : isWrong ? '#bc000a' : isSelected ? '#0058bc' : '#181c23';

  function IconBadge() {
    if (mode === 'result') {
      if (isCorrect) return <span style={iconStyle('#006e28')}>✓</span>;
      if (isWrong)   return <span style={iconStyle('#bc000a')}>✕</span>;
      return <span style={neutralIcon}>{LABELS[index]}</span>;
    }
    return (
      <span style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${isSelected ? '#0058bc' : '#c1c6d7'}`,
        background: isSelected ? '#0058bc' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 13,
      }}>
        {isSelected ? '✓' : ''}
      </span>
    );
  }

  return (
    <button
      role="radio"
      aria-checked={isSelected || isCorrect}
      onClick={() => mode === 'question' && onSelect?.(option.id)}
      disabled={mode === 'result'}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: '0.5rem', background: bg, cursor: mode === 'question' ? 'pointer' : 'default',
        fontSize: 15, fontWeight: isSelected || isCorrect || isWrong ? 500 : 400,
        color: textColor, textAlign: 'left', width: '100%',
        fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s',
      }}
    >
      <IconBadge />
      <span style={{ flex: 1 }}>{option.text}</span>
      {mode === 'result' && isCorrect && <span style={{ fontSize: 12, fontWeight: 600, color: '#006e28', marginLeft: 'auto' }}>Correct Answer</span>}
      {mode === 'result' && isWrong   && <span style={{ fontSize: 12, fontWeight: 600, color: '#bc000a', marginLeft: 'auto' }}>Your Choice</span>}
    </button>
  );
}

function iconStyle(bg) {
  return {
    width: 26, height: 26, borderRadius: '50%', background: bg,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  };
}

const neutralIcon = {
  width: 26, height: 26, borderRadius: '50%',
  border: '1.5px solid #c1c6d7', color: '#717786',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 12, fontWeight: 600, flexShrink: 0,
};
