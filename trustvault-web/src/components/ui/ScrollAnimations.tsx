import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'framer-motion';

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

/* ── Reveal on scroll (Powered by GSAP ScrollTrigger) ── */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, delay = 0, direction = 'up', style, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // Initial states based on direction
    let startState = {};
    switch (direction) {
      case 'up': startState = { opacity: 0, y: 60 }; break;
      case 'left': startState = { opacity: 0, x: -60 }; break;
      case 'right': startState = { opacity: 0, x: 60 }; break;
      case 'scale': startState = { opacity: 0, scale: 0.85 }; break;
    }

    gsap.set(ref.current, startState);

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%', // Triggers when top of element hits 90% of viewport
          once: true,
        }
      });
    }, ref);

    return () => ctx.revert(); // Cleanup GSAP animations on unmount
  }, [direction, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
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
        background: 'linear-gradient(135deg, var(--accent-success), var(--brand-primary))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
      }}>
        {prefix}{isInView ? display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '0'}{suffix}
      </div>
      <div style={{
        fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace',
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
      background: 'linear-gradient(90deg, var(--accent-success), var(--brand-primary))',
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
  
  // Use MotionValues for high-performance 60fps animation without React re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const targetX = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const targetY = (e.clientY - rect.top - rect.height / 2) * 0.2;
    x.set(targetX);
    y.set(targetY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
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
            background: 'var(--accent-success)',
            boxShadow: `0 0 ${p.size * 3}px rgba(0,198,174,0.12)`,
            willChange: 'transform, opacity',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};




