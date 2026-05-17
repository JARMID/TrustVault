import React from 'react';

/**
 * Premium Avatar component with gradient backgrounds, initials fallback,
 * status indicators, and animated glow effects.
 */

// eslint-disable-next-line react-refresh/only-export-components
export const AVATAR_GRADIENTS = [
  ['#3B82F6', '#8B5CF6'],  // Blue → Purple
  ['#10B981', '#3B82F6'],  // Teal → Blue
  ['#F59E0B', '#EF4444'],  // Amber → Red
  ['#EC4899', '#8B5CF6'],  // Pink → Purple
  ['#6366F1', '#3B82F6'],  // Indigo → Blue
  ['#14B8A6', '#0EA5E9'],  // Teal → Sky
  ['#F43F5E', '#FB923C'],  // Rose → Orange
  ['#8B5CF6', '#EC4899'],  // Purple → Pink
  ['#0EA5E9', '#6366F1'],  // Sky → Indigo
  ['#22C55E', '#14B8A6'],  // Green → Teal
  ['#EF4444', '#F59E0B'],  // Red → Amber
  ['#A855F7', '#3B82F6'],  // Violet → Blue
] as const;

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type StatusType = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  gradientIndex?: number;
  size?: AvatarSize;
  status?: StatusType;
  showRing?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<AvatarSize, { container: number; font: string; status: number; ring: number }> = {
  xs: { container: 24, font: '0.55rem', status: 6, ring: 1 },
  sm: { container: 32, font: '0.65rem', status: 7, ring: 1.5 },
  md: { container: 40, font: '0.75rem', status: 8, ring: 2 },
  lg: { container: 56, font: '1rem', status: 10, ring: 2 },
  xl: { container: 80, font: '1.4rem', status: 12, ring: 2.5 },
  '2xl': { container: 120, font: '2rem', status: 16, ring: 3 },
};

const STATUS_COLORS: Record<StatusType, string> = {
  online: '#10B981',
  offline: '#64748B',
  away: '#F59E0B',
  busy: '#EF4444',
  none: 'transparent',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

function getGradient(index?: number, name?: string): [string, string] {
  if (index !== undefined && index >= 0 && index < AVATAR_GRADIENTS.length) {
    return [...AVATAR_GRADIENTS[index]];
  }
  // Deterministic gradient based on name hash
  if (name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return [...AVATAR_GRADIENTS[idx]];
  }
  return [...AVATAR_GRADIENTS[0]];
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  gradientIndex,
  size = 'md',
  status = 'none',
  showRing = false,
  onClick,
  className,
  style,
}) => {
  const specs = SIZE_MAP[size];
  const initials = getInitials(name);
  const [c1, c2] = getGradient(gradientIndex, name);

  // Determine if this is a gradient-based avatar (gradient-0 through gradient-11)
  const isGradientAvatar = imageUrl?.startsWith('gradient-');
  const actualGradientIndex = isGradientAvatar ? parseInt(imageUrl!.split('-')[1], 10) : undefined;
  const hasRealImage = imageUrl && !isGradientAvatar;

  const [finalC1, finalC2] = actualGradientIndex !== undefined
    ? getGradient(actualGradientIndex)
    : [c1, c2];

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        width: specs.container,
        height: specs.container,
        borderRadius: specs.container <= 32 ? '10px' : '14px',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Optional animated ring */}
      {showRing && (
        <div style={{
          position: 'absolute',
          inset: -specs.ring - 2,
          borderRadius: specs.container <= 32 ? '12px' : '16px',
          background: `linear-gradient(135deg, ${finalC1}40, ${finalC2}40)`,
          animation: 'avatar-ring-pulse 3s ease-in-out infinite',
          zIndex: -1,
        }} />
      )}

      {/* Avatar Body */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        background: hasRealImage
          ? `url(${imageUrl}) center/cover`
          : `linear-gradient(135deg, ${finalC1}, ${finalC2})`,
        border: `${specs.ring}px solid rgba(255,255,255,0.08)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: specs.font,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.02em',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: showRing
          ? `0 0 20px ${finalC1}30`
          : '0 2px 8px rgba(0,0,0,0.3)',
      }}
        onMouseOver={e => {
          if (onClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 0 24px ${finalC1}40`;
          }
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = showRing
            ? `0 0 20px ${finalC1}30`
            : '0 2px 8px rgba(0,0,0,0.3)';
        }}
      >
        {!hasRealImage && initials}
      </div>

      {/* Status Indicator */}
      {status !== 'none' && (
        <div style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: specs.status,
          height: specs.status,
          borderRadius: '50%',
          background: STATUS_COLORS[status],
          border: '2px solid #0B0E14',
          boxShadow: status === 'online' ? `0 0 8px ${STATUS_COLORS[status]}` : 'none',
          zIndex: 2,
        }} />
      )}

      <style>{`
        @keyframes avatar-ring-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Avatar;
