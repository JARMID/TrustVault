import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanFace, Fingerprint, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const BiometricScannerWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'verified'>('idle');

  useEffect(() => {
    const cycle = () => {
      setPhase('scanning');
      setTimeout(() => setPhase('verified'), 2500);
      setTimeout(() => setPhase('idle'), 4000);
    };
    
    const interval = setInterval(cycle, 5000);
    cycle(); // Initial run
    
    return () => clearInterval(interval);
  }, []);

  const primaryColor = isDark ? '#00C6AE' : '#3B82F6';
  const secondaryColor = isDark ? '#1E293B' : '#E2E8F0';
  const bgColor = isDark ? 'rgba(7, 11, 20, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.1)';

  return (
    <div 
      className="relative w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden backdrop-blur-xl border flex items-center justify-center shadow-2xl preserve-3d group-hover:rotate-x-12 group-hover:rotate-y-[-10deg] transition-all duration-700"
      style={{ 
        background: bgColor,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 3D Background Grid */}
      <div 
        className="absolute inset-[-50%] preserve-3d"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          transform: 'rotateX(60deg) translateY(-50px) translateZ(-100px)',
        }}
      />

      {/* Main Scanner Area */}
      <div 
        className="relative z-10 w-40 h-40 rounded-3xl border-2 flex items-center justify-center transition-colors duration-500 preserve-3d"
        style={{
          borderColor: phase === 'verified' ? primaryColor : secondaryColor,
          background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
          boxShadow: phase === 'verified' ? `0 0 40px ${primaryColor}40, inset 0 0 20px ${primaryColor}20` : (isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.05)'),
          transform: 'translateZ(40px)'
        }}
      >
        {/* Animated Scanner Line */}
        {phase === 'scanning' && (
          <motion.div 
            className="absolute left-0 right-0 h-1 z-20"
            style={{ 
              background: primaryColor,
              boxShadow: `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}` 
            }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />
        )}

        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {phase === 'idle' && <ScanFace size={64} className="text-slate-400 opacity-50" />}
          {phase === 'scanning' && <Fingerprint size={64} color={primaryColor} className="animate-pulse" />}
          {phase === 'verified' && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <ShieldCheck size={64} color={primaryColor} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating UI Elements */}
      <motion.div 
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest backdrop-blur-md border"
        style={{
          background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
          borderColor: phase === 'verified' ? primaryColor : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
          color: phase === 'verified' ? primaryColor : (isDark ? '#94A3B8' : '#64748B'),
          transform: 'translateZ(60px)'
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {phase === 'idle' ? 'AWAITING' : phase === 'scanning' ? 'ANALYZING...' : 'MATCH FOUND'}
      </motion.div>

      {/* Corner Brackets */}
      <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 opacity-50" style={{ borderColor: primaryColor }} />
      <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 opacity-50" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 opacity-50" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 opacity-50" style={{ borderColor: primaryColor }} />
    </div>
  );
};
