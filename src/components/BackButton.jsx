'use client';

import { useNavigate } from '../lib/navigation';
import { useTelegram } from '../context/TelegramContext';

export default function BackButton({ fallback = '/', label = 'Back', iconOnly = false }) {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();

  // Telegram supplies its native Back Button through TelegramProvider.
  if (isTelegram) return null;

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }

  return (
    <div style={wrap}>
      <button type="button" onClick={goBack} aria-label={label} style={button}>
        <span aria-hidden="true">←</span>
        {!iconOnly && label}
      </button>
    </div>
  );
}

const wrap = {
  width: '100%',
  maxWidth: 760,
  margin: '0 auto',
  padding: '8px var(--screen-pad) 0',
  background: 'var(--color-bg)',
};

const button = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '0 4px',
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  font: 'var(--text-btn)',
  cursor: 'pointer',
};
