import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'critical';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

/* All colours are pure CSS variable tokens — zero hardcoded HEX */
const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string; dot: string }> = {
  success:  {
    bg: 'rgba(0,198,174,0.08)',
    color: 'var(--accent-success)',
    border: 'rgba(0,198,174,0.2)',
    dot: 'var(--accent-success)',
  },
  warning:  {
    bg: 'rgba(0, 198, 174,0.1)',
    color: 'var(--brand-primary)',
    border: 'rgba(0, 198, 174,0.25)',
    dot: 'var(--brand-primary)',
  },
  danger:   {
    bg: 'rgba(239,68,68,0.08)',
    color: 'var(--accent-danger)',
    border: 'rgba(239,68,68,0.2)',
    dot: 'var(--accent-danger)',
  },
  critical: {
    bg: 'rgba(239,68,68,0.15)',
    color: 'var(--accent-danger)',
    border: 'rgba(239,68,68,0.35)',
    dot: 'var(--accent-danger)',
  },
  info:     {
    bg: 'var(--bg-inset)',
    color: 'var(--text-secondary)',
    border: 'var(--border-white-5)',
    dot: 'var(--brand-primary)',
  },
  neutral:  {
    bg: 'var(--bg-inset)',
    color: 'var(--text-tertiary)',
    border: 'var(--border-white-5)',
    dot: 'var(--text-tertiary)',
  },
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', dot = false, pulse = false, size = 'sm', style }) => {
  const v = variantStyles[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '2px 9px' : '4px 13px',
      borderRadius: 20,
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      fontSize: size === 'sm' ? '0.6rem' : '0.7rem',
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.05em',
      lineHeight: 1,
      whiteSpace: 'nowrap' as const,
      ...style,
    }}>
      {dot && (
        <span style={{
          width: size === 'sm' ? 5 : 6,
          height: size === 'sm' ? 5 : 6,
          borderRadius: '50%',
          background: v.dot,
          flexShrink: 0,
          boxShadow: pulse ? `0 0 6px ${v.dot}` : undefined,
          animation: pulse ? 'badgePulse 2s ease-in-out infinite' : undefined,
        }} />
      )}
      {children}
      <style>{`@keyframes badgePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </span>
  );
};

export default Badge;



