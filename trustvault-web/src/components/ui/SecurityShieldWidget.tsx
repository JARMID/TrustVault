import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const SecurityShieldWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const accentColor = isDark ? '#00C6AE' : '#3B82F6';
  const bgColor = isDark ? 'rgba(10, 14, 26, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[80px] pointer-events-none opacity-50"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />
      
      {/* Orbiting particles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 border border-dashed rounded-full"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      >
        <div className="absolute top-0 left-1/2 -mt-1.5 w-3 h-3 rounded-full shadow-[0_0_12px_currentColor]" style={{ background: accentColor, color: accentColor }} />
        <div className="absolute bottom-0 left-1/2 -mb-1.5 w-3 h-3 rounded-full shadow-[0_0_12px_currentColor]" style={{ background: '#8B5CF6', color: '#8B5CF6' }} />
      </motion.div>
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-12 border border-dotted rounded-full"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
      >
        <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full shadow-[0_0_15px_currentColor]" style={{ background: '#10B981', color: '#10B981' }} />
      </motion.div>

      {/* Main floating shield */}
      <motion.div
        animate={{ y: [-12, 12, -12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-64 h-64 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border shadow-2xl"
        style={{ background: bgColor, borderColor }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at center, ${accentColor} 2px, transparent 2px)`, backgroundSize: '16px 16px' }} />
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Shield size={100} style={{ color: accentColor, filter: `drop-shadow(0 0 20px ${accentColor}80)` }} />
          </motion.div>
          <motion.div 
            className="absolute -bottom-3 -right-3 bg-indigo-500 rounded-full p-3 border-4"
            style={{ borderColor: bgColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.6 }}
          >
            <Lock size={24} color="#fff" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating status badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-8 -right-4 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-2xl backdrop-blur-md border"
        style={{ background: isDark ? 'rgba(30,41,59,0.8)' : '#fff', color: isDark ? '#fff' : '#000', borderColor }}
      >
        <span className="text-emerald-500 mr-2">●</span> SECURED
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        className="absolute bottom-12 -left-8 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-2xl backdrop-blur-md border"
        style={{ background: isDark ? 'rgba(30,41,59,0.8)' : '#fff', color: isDark ? '#fff' : '#000', borderColor }}
      >
        <span className="text-indigo-500 mr-2">♦</span> ENCRYPTED
      </motion.div>
    </div>
  );
};
