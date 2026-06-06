import React, { Component, type ReactNode } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/Spotlight';
import { Shield, Lock } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode, fallback: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Spline Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{color: 'red', zIndex: 9999, position: 'relative'}}>
          {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * SplineSceneBasic — Premium 3D hero card for TrustVault.
 *
 * Displays an interactive Spline robot scene on the right with a
 * spotlight effect and brand copy on the left.
 *
 * Place in Dashboard hero area or Landing above-the-fold sections.
 */
export function SplineSceneBasic() {
  return (
    <TiltCard
      className="w-full h-[500px] relative overflow-hidden group"
      style={{
        background: 'var(--vault-surface, rgba(10,18,40,0.96))',
        border: '1px solid var(--vault-border, rgba(0,198,174,0.12))',
        borderRadius: 20,
      }}
    >
      {/* Interactive spotlight that tracks mouse */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"
        size={400}
      />

      <div className="flex h-full relative z-10">
        {/* ── Left: brand copy ── */}
        <div
          className="flex-1 p-8 relative z-10 flex flex-col justify-center"
          style={{ maxWidth: '48%', transform: 'translateZ(30px)' }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 100,
              background: 'rgba(0,198,174,0.08)',
              border: '1px solid rgba(0,198,174,0.2)',
              marginBottom: 20,
              width: 'fit-content',
              boxShadow: '0 0 20px rgba(0,198,174,0.1)',
            }}
          >
            <Shield size={11} style={{ color: 'var(--vault-primary, #00C6AE)' }} />
            <span
              style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--vault-primary, #00C6AE)',
              }}
            >
              3D Security Suite
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
              background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.45) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            Secured by
            <br />
            <span style={{ color: 'var(--vault-primary, #00C6AE)', WebkitTextFillColor: 'var(--vault-primary, #00C6AE)' }}>
              TrustVault
            </span>
          </h1>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--vault-text-secondary, rgba(200,210,230,0.65))',
              lineHeight: 1.7,
              maxWidth: 280,
              marginBottom: 24,
            }}
          >
            Bank-grade AES-256 encryption protecting every transaction in real time.
          </p>

          {/* Trust indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['AES-256-GCM Encryption', 'RSA-2048 Key Pairs', 'Zero-Trust Architecture'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.75rem',
                    color: 'var(--vault-text-secondary, rgba(200,210,230,0.55))',
                  }}
                >
                  <Lock size={10} style={{ color: 'var(--vault-primary, #00C6AE)', flexShrink: 0 }} />
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Right: Custom 3D CSS Interactive Graphic ── */}
        <div className="flex-1 relative perspective-1000" style={{ transform: 'translateZ(50px)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,198,174,0.1)_0%,transparent_50%)] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
          
          {/* 3D Antigravity Container */}
          <div className="w-full h-full flex items-center justify-center relative transform-style-3d group-hover:rotate-y-12 transition-transform duration-1000 ease-out">
            
            {/* Center Core */}
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
                y: [-10, 10, -10]
              }}
              transition={{
                rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute w-32 h-32 rounded-full border border-[#00C6AE]/30 bg-[#00C6AE]/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(0,198,174,0.3)] z-20"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Shield size={48} className="text-[#00C6AE]" />
              {/* Inner orbiting ring */}
              <motion.div 
                animate={{ rotateX: [0, 360], rotateZ: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-20px] rounded-full border-t border-b border-[#00C6AE]/40"
              />
            </motion.div>

            {/* Orbiting Panels */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: i * -5 }}
                className="absolute w-full h-full flex items-center justify-center pointer-events-none z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div 
                  className="w-48 h-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col justify-between shadow-2xl"
                  style={{ transform: `translateZ(140px) rotateY(${i * 120}deg)` }}
                >
                  <div className="flex justify-between items-center">
                    <Lock size={16} className="text-[#00C6AE]" />
                    <span className="text-[10px] font-mono text-white/50 border border-white/10 rounded px-2 py-0.5 bg-black/20">NODE_{i+1}</span>
                  </div>
                  
                  {/* Holographic lines */}
                  <div className="space-y-2 mt-4">
                    <div className="h-1 w-full bg-gradient-to-r from-[#00C6AE] to-transparent rounded-full opacity-50" />
                    <div className="h-1 w-3/4 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-30" />
                    <div className="h-1 w-1/2 bg-gradient-to-r from-purple-500 to-transparent rounded-full opacity-30" />
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="text-[9px] font-mono text-[#00C6AE] font-bold tracking-widest uppercase">
                      Active Shield
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Background Grid Sphere */}
            <motion.div
              animate={{ rotateZ: [0, -360] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[120%] h-[120%] border border-white/5 rounded-full opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)',
                backgroundSize: '40px 40px',
                transform: 'translateZ(-100px)'
              }}
            />

          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 80,
          background: 'radial-gradient(ellipse, rgba(0,198,174,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
        className="group-hover:h-[120px] transition-all duration-700"
      />
    </TiltCard>
  );
}

export default SplineSceneBasic;



