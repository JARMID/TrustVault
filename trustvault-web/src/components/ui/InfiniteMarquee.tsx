import React from 'react';
import { motion } from 'framer-motion';

/**
 * InfiniteMarquee — Auto-scrolling content ticker
 * Used for "Trusted By" logo bars and social proof sections.
 * Creates seamless infinite horizontal scrolling.
 */
export const InfiniteMarquee: React.FC<{
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}> = ({ children, speed = 40, direction = 'left', pauseOnHover = true, className }) => {
  const animationDirection = direction === 'left' ? '-50%' : '0%';
  const animationStart = direction === 'left' ? '0%' : '-50%';

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          gap: '48px',
          width: 'max-content',
          willChange: 'transform',
        }}
        animate={{ x: [animationStart, animationDirection] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {/* Duplicate content for seamless loop */}
        {children}
        {children}
      </motion.div>
    </div>
  );
};

/**
 * MarqueeItem — Individual item in the marquee
 */
export const MarqueeItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={className}
    style={{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

export default InfiniteMarquee;



