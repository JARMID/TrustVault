import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextReveal — Staggered character/word reveal animation
 * Premium text entrance with spring physics.
 * Used for hero headlines and section titles.
 */
export const TextReveal: React.FC<{
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  by?: 'word' | 'character';
}> = ({ text, className, style, delay = 0, by = 'word' }) => {
  const units = by === 'word' ? text.split(' ') : text.split('');

  return (
    <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}>
      {units.map((unit, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + i * (by === 'word' ? 0.08 : 0.03),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {unit}
            {by === 'word' ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/**
 * GradientText — Text with animated gradient fill
 */
export const GradientText: React.FC<{
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  className?: string;
}> = ({
  children,
  from = 'var(--accent-success)',
  via = '#00E8CC',
  to = '#00C6AE',
  className,
}) => (
  <span
    className={className}
    style={{
      background: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    {children}
  </span>
);

export default TextReveal;




