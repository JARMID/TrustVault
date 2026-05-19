import React from 'react';

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 16, borderRadius = 8, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
      backgroundSize: '400px 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style,
    }}
  />
);

/* Preset skeleton layouts */

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="liquid-glass-card mesh-bg" style={{ padding: 24 }}>
    <div className="flex items-center gap-3 mb-4">
      <Skeleton width={44} height={44} borderRadius={12} />
      <div style={{ flex: 1 }}>
        <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="30%" height={10} />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={`${85 - i * 15}%`} height={12} style={{ marginBottom: i < lines - 1 ? 10 : 0 }} />
    ))}
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="liquid-glass-card mesh-bg" style={{ padding: 24 }}>
    <div className="flex justify-between items-center mb-6">
      <div>
        <Skeleton width={180} height={16} style={{ marginBottom: 8 }} />
        <Skeleton width={240} height={10} />
      </div>
      <Skeleton width={80} height={30} borderRadius={8} />
    </div>
    <Skeleton width="100%" height={200} borderRadius={12} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
      <Skeleton width={200} height={16} style={{ marginBottom: 6 }} />
      <Skeleton width={300} height={10} />
    </div>
    <div style={{ padding: '0 24px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <Skeleton width={64} height={12} />
          <Skeleton width="30%" height={12} />
          <Skeleton width="20%" height={12} />
          <Skeleton width={60} height={22} borderRadius={6} />
          <Skeleton width={80} height={12} style={{ marginLeft: 'auto' }} />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <>
    <style>{shimmerKeyframes}</style>
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <Skeleton width={280} height={28} style={{ marginBottom: 8 }} />
          <Skeleton width={400} height={14} />
        </div>
        <div className="flex gap-3">
          <Skeleton width={100} height={38} borderRadius={10} />
          <Skeleton width={140} height={38} borderRadius={10} />
        </div>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
      </div>
      {/* Charts */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 320px' }}>
        <SkeletonChart />
        <SkeletonCard lines={5} />
      </div>
      <SkeletonTable rows={4} />
    </div>
  </>
);

export default Skeleton;



