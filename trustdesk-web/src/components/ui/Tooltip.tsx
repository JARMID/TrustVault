import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', delay = 300 }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            ...positionStyles[position],
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            color: '#E2E8F0',
            fontSize: '0.72rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            animation: 'tooltipFade 0.15s ease-out',
          }}
        >
          {content}
        </div>
      )}
      <style>{`@keyframes tooltipFade { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
};

export default Tooltip;
