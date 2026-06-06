import React, { useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', style = {}, variants, ...props }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({ x: ((y / rect.height) - 0.5) * -10, y: ((x / rect.width) - 0.5) * 10 });
  };

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div 
        variants={variants}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: tilt.x ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`liquid-glass-card group relative overflow-hidden preserve-3d ${className}`}
        style={{ transformStyle: 'preserve-3d', ...style }}
        {...props}
      >
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          animate={{ background: `radial-gradient(circle at ${50 + tilt.y * 5}% ${50 - tilt.x * 5}%, rgba(255,255,255,0.03) 0%, transparent 60%)` }}
        />
        <div className="relative z-10 w-full" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
