import { useState } from 'react';

/**
 * Card
 * Rounded rectangle with surface background, border, and soft shadow.
 * Pass `onPress` to make it tappable (gets scale-down press animation).
 * Pass `hero` to apply an accent-green border highlight (Daily Quiz card).
 */
export default function Card({
  children,
  onPress,
  hero = false,
  style: extra,
  padding,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const isClickable = !!onPress;

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
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: hero
          ? '2px solid var(--color-accent)'
          : '1px solid var(--color-border)',
        boxShadow: hero ? 'none' : 'var(--shadow-card)',
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
        ...extra,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
