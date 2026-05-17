import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/* ── Parallax Section ── */
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ children, speed = 0.3, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
};

/* ── Reveal on scroll ── */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, delay = 0, direction = 'up', style, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  type VariantMap = Record<string, { hidden: { opacity: number; y?: number; x?: number; scale?: number }; show: { opacity: number; y?: number; x?: number; scale?: number } }>;
  const variants: VariantMap = {
    up: { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated counter ── */
export const AnimatedCounter: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericPart = value.replace(/[^0-9.]/g, '');
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  // Strip the prefix, then strip any digits, commas, or periods to isolate the true suffix
  const suffix = value.replace(prefix, '').replace(/[0-9,.]/g, '');
  const num = parseFloat(numericPart) || 0;
  const decimals = numericPart.includes('.') ? numericPart.split('.')[1].length : 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * num);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, num]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace",
        background: 'linear-gradient(135deg, #00C6AE, #00E8CC)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
      }}>
        {prefix}{isInView ? display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '0'}{suffix}
      </div>
      <div style={{
        fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  );
};

/* ── Horizontal scroll section ── */
export const HorizontalScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '0 40px', paddingBottom: '40px', display: 'flex', gap: '32px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      {React.Children.map(children, child => (
        <div style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>{child}</div>
      ))}
    </div>
  );
};

/* ── Scroll progress bar ── */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200,
      background: 'linear-gradient(90deg, #00C6AE, #00E8CC, #D4A853)',
      transformOrigin: '0%', scaleX,
    }} />
  );
};

/* ── Magnetic hover button ── */
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, className, style, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};

/* Particles generated once at module level — stable, no render-phase purity violation */
const PARTICLE_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * 10,
}));

/* ── Floating particle field ── */
export const ParticleField: React.FC = () => {
  const particles = PARTICLE_DATA;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: 'rgba(0, 198, 174, 0.4)',
            boxShadow: `0 0 ${p.size * 3}px rgba(0, 198, 174, 0.2)`,
            willChange: 'transform, opacity',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};
