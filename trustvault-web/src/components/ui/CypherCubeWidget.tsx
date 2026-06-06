import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const generateHex = (len: number) => {
  const chars = '0123456789ABCDEF';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * 16)]).join('');
};

export const CypherCubeWidget: React.FC = () => {
  const [keys, setKeys] = useState({ pub: `0x${generateHex(8)}...${generateHex(8)}`, priv: '0x****************' });
  const [isProcessing, setIsProcessing] = useState(false);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  
  const cubeRef = useRef<HTMLDivElement>(null);

  // Rotate the cube continuously
  useAnimationFrame((time) => {
    if (cubeRef.current) {
      const rotateX = time * 0.02;
      const rotateY = time * 0.03;
      cubeRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  // Cycle keys
  useEffect(() => {
    const interval = setInterval(() => {
      setIsProcessing(true);
      setTimeout(() => {
        setKeys({ pub: `0x${generateHex(8)}...${generateHex(8)}`, priv: '0x****************' });
        setIsProcessing(false);
      }, 400); // 400ms "processing" time
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const accentColor = isDark ? '#00C6AE' : '#3B82F6';
  const faceBg = isDark ? 'rgba(7, 11, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  const faceBorder = isDark ? `rgba(0, 198, 174, ${isProcessing ? 0.6 : 0.2})` : `rgba(59, 130, 246, ${isProcessing ? 0.5 : 0.15})`;

  const renderFace = (face: string) => (
    <div
      className="absolute inset-0 flex items-center justify-center border-2 backdrop-blur-md"
      style={{
        background: faceBg,
        borderColor: faceBorder,
        boxShadow: isProcessing ? `inset 0 0 20px ${accentColor}40` : (isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'),
        transition: 'all 0.3s ease'
      }}
    >
      {/* Circuit pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          color: accentColor
        }}
      />
      {face === 'front' && <ShieldCheck size={40} color={accentColor} className={isProcessing ? 'animate-pulse' : ''} />}
      {face === 'back' && <Lock size={40} color={accentColor} />}
      {face === 'top' && <KeyRound size={40} color={accentColor} />}
      {face === 'bottom' && <div className="font-mono text-xs font-bold" style={{ color: accentColor }}>AES-256</div>}
      {face === 'left' && <div className="font-mono text-xs font-bold" style={{ color: accentColor }}>RSA</div>}
      {face === 'right' && <div className="font-mono text-xs font-bold" style={{ color: accentColor }}>GCM</div>}
    </div>
  );

  return (
    <div className="w-full relative flex items-center p-6 rounded-2xl overflow-hidden" 
      style={{ 
        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.03)'
      }}
    >
      {/* Left side: The 3D Cube */}
      <div className="w-1/3 flex items-center justify-center perspective-[1000px] h-32 relative z-10">
        <div 
          ref={cubeRef}
          className="relative w-20 h-20 preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Faces */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(40px)' }}>{renderFace('front')}</div>
          <div className="absolute inset-0" style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>{renderFace('back')}</div>
          <div className="absolute inset-0" style={{ transform: 'rotateY(90deg) translateZ(40px)' }}>{renderFace('right')}</div>
          <div className="absolute inset-0" style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}>{renderFace('left')}</div>
          <div className="absolute inset-0" style={{ transform: 'rotateX(90deg) translateZ(40px)' }}>{renderFace('top')}</div>
          <div className="absolute inset-0" style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}>{renderFace('bottom')}</div>
        </div>
      </div>

      {/* Right side: The changing cryptographic keys */}
      <div className="w-2/3 pl-6 border-l flex flex-col justify-center" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : (isDark ? 'bg-emerald-400' : 'bg-emerald-500')}`} />
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: isDark ? '#fff' : '#334155' }}>
            {isProcessing ? 'REKEYING...' : 'ENCLAVE ACTIVE'}
          </span>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1" style={{ color: isDark ? '#fff' : '#000' }}>PUBLIC KEY (RSA-2048)</div>
            <motion.div 
              key={keys.pub} 
              initial={{ opacity: 0, filter: 'blur(4px)' }} 
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="text-xs font-bold"
              style={{ color: isDark ? '#10B981' : '#059669' }}
            >
              {keys.pub}
            </motion.div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1" style={{ color: isDark ? '#fff' : '#000' }}>PRIVATE KEY</div>
            <div className="text-xs flex items-center gap-2" style={{ color: isDark ? '#F43F5E' : '#E11D48' }}>
              {keys.priv} <Lock size={12} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 1) 50%)', 
          backgroundSize: '100% 4px' 
        }} 
      />
    </div>
  );
};
