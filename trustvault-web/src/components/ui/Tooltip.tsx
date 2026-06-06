import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', delay = 280 }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const positionStyles: Record<string, React.CSSProperties> = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 7 },
    bottom: { top: '100%',   left: '50%', transform: 'translateX(-50%)', marginTop: 7 },
    left:   { right: '100%', top: '50%',  transform: 'translateY(-50%)', marginRight: 7 },
    right:  { left: '100%',  top: '50%',  transform: 'translateY(-50%)', marginLeft: 7 },
  };

  const enterAnim: Record<string, TargetAndTransition> = {
    top:    { opacity: 0, y: 4 },
    bottom: { opacity: 0, y: -4 },
    left:   { opacity: 0, x: 4 },
    right:  { opacity: 0, x: -4 },
  };

  return (
    <div
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={enterAnim[position]}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.13, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              ...positionStyles[position],
              padding: '5px 11px',
              borderRadius: 8,
              background: 'rgba(5,5,5,0.97)',
              border: '1px solid var(--border-white-5)',
              backdropFilter: 'blur(16px)',
              color: 'var(--text-secondary)',
              fontSize: '0.68rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              zIndex: 9999,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;


