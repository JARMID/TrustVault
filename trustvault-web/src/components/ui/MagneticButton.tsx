import React, { useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, 'children' | 'ref'> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  strength = 40, 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (strength / 100), y: middleY * (strength / 100) });
  };

  const reset = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-gradient-to-br from-[var(--brand-primary)] to-[#7C3AED] text-white shadow-[0_4px_20px_rgba(0,198,174,0.25)] border-none';
      case 'accent': return 'bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20';
      case 'outline': return 'border border-white/20 text-white hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]';
      case 'ghost': return 'text-slate-400 hover:text-white bg-transparent';
      default: return 'bg-[var(--bg-surface)] text-white border border-[var(--border-subtle)]';
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative px-6 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${getVariantClasses()} ${className}`}
      {...props}
    >
      {/* Glow effect on hover */}
      {isHovered && variant === 'primary' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[#7C3AED] blur-lg -z-10"
        />
      )}
      <motion.div
        animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};
