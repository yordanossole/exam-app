import { useState } from 'react';

/**
 * NT Exams Card
 * Three archetypes via `variant`:
 *   'default' — standard surface card (exam/subject cards)
 *   'tinted'  — surface-alt background (hint / info panels)
 *   'primary' — Nova Blue border highlight (active/hero card)
 */
export default function Card({
  children,
  onPress,
  variant = 'default',
  style: extra,
  padding,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const isClickable = !!onPress;

  const variantStyles = {
    default: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card)',
    },
    tinted: {
      background: 'var(--color-surface-alt)',
      border: '1px solid var(--color-border)',
      boxShadow: 'none',
    },
    primary: {
      background: 'var(--color-surface)',
      border: '2px solid var(--color-primary)',
      boxShadow: 'var(--shadow-raised)',
    },
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onPress}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onPress() : undefined}
      onPointerDown={isClickable ? () => setPressed(true) : undefined}
      onPointerUp={isClickable ? () => setPressed(false) : undefined}
      onPointerLeave={isClickable ? () => setPressed(false) : undefined}
      style={{
        borderRadius: 'var(--radius-card)',
        padding: padding ?? 'var(--card-padding)',
        cursor: isClickable ? 'pointer' : 'default',
        transform: pressed && isClickable ? 'scale(0.98)' : 'scale(1)',
        transition: `
          background-color var(--duration-theme) ease,
          border-color     var(--duration-theme) ease,
          transform        var(--duration-tap)   ease
        `,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...variantStyles[variant],
        ...extra,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
