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

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string; dot: string }> = {
  success:  { bg: 'rgba(16, 185, 129, 0.12)', color: '#34D399', border: 'rgba(16, 185, 129, 0.2)', dot: '#10B981' },
  warning:  { bg: 'rgba(245, 158, 11, 0.12)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.2)', dot: '#F59E0B' },
  danger:   { bg: 'rgba(239, 68, 68, 0.12)',  color: '#F87171', border: 'rgba(239, 68, 68, 0.2)',  dot: '#EF4444' },
  critical: { bg: 'rgba(239, 68, 68, 0.18)',  color: '#FCA5A5', border: 'rgba(239, 68, 68, 0.35)', dot: '#EF4444' },
  info:     { bg: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.2)', dot: '#3B82F6' },
  neutral:  { bg: 'rgba(148, 163, 184, 0.08)',color: '#94A3B8', border: 'rgba(148, 163, 184, 0.15)',dot: '#64748B' },
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', dot = false, pulse = false, size = 'sm', style }) => {
  const v = variantStyles[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: 20,
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.04em',
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
          boxShadow: pulse ? `0 0 8px ${v.dot}` : undefined,
          animation: pulse ? 'badgePulse 2s ease-in-out infinite' : undefined,
        }} />
      )}
      {children}
      <style>{`@keyframes badgePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </span>
  );
};

export default Badge;
