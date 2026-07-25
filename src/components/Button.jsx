import { useState } from 'react';

/**
 * NT Exams Button
 *
 * variant:
 *   'primary'  — Nova Blue fill  → "Submit Answer", "Start Practice Exam", "Next Question"
 *   'warm'     — Spark Orange fill → "Start Mock Exam", "Retake Full Exam"
 *   'secondary'— Outlined blue  → "Skip Question", "Review Explanation"
 *   'ghost'    — Text only      → "Learn More", "View Full Report"
 *   'danger'   — Outlined red   → destructive actions
 *
 * size: 'sm' | 'md' (default) | 'lg'
 * full: stretch to 100% width
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  onClick,
  disabled = false,
  type = 'button',
  style: extra,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 'var(--radius-btn)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    font: 'var(--text-btn)',
    fontFamily: 'var(--font-display)',
    letterSpacing: 0,
    transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
    opacity: disabled ? 0.4 : 1,
    width: full ? '100%' : undefined,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    minHeight: 44,
    transition: `
      background-color var(--duration-theme) ease,
      border-color     var(--duration-theme) ease,
      color            var(--duration-theme) ease,
      transform        var(--duration-tap)   ease,
      opacity          var(--duration-tap)   ease
    `,
  };

  const sizes = {
    sm: { padding: '8px 16px',  fontSize: 13, borderRadius: 8 },
    md: { padding: '12px 24px', fontSize: 15 },
    lg: { padding: '15px 28px', fontSize: 16, borderRadius: 'var(--radius-btn-lg)' },
  };

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: '#fff',
    },
    warm: {
      background: 'var(--color-accent)',
      color: '#fff',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1.5px solid var(--color-primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--color-error)',
      border: '1.5px solid var(--color-border)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extra }}
      {...rest}
    >
      {children}
    </button>
  );
}
