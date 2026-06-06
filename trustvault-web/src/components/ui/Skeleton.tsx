import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  variant?: 'rectangular' | 'circular' | 'text';
}> = ({ className = '', style = {}, variant = 'rectangular' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return { borderRadius: '50%' };
      case 'text':
        return { borderRadius: '4px', height: '1.2em' };
      case 'rectangular':
      default:
        return { borderRadius: '8px' };
    }
  };

  return (
    <motion.div
      className={`bg-[var(--border-subtle)] overflow-hidden relative ${className}`}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
    >
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--border-strong), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};
