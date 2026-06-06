import React from 'react';
import { motion } from 'framer-motion';
import { Target, Leaf } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const SavingsRingWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const accentColor = isDark ? '#00C6AE' : '#3B82F6';
  const bgColor = isDark ? 'rgba(7, 11, 20, 0.4)' : 'rgba(255, 255, 255, 0.6)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div 
      className="w-full h-full min-h-[160px] rounded-2xl relative overflow-hidden flex items-center justify-center p-6"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: isDark ? '#fff' : '#000' }} />
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="12"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={accentColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="351.85" // 2 * PI * r
            initial={{ strokeDashoffset: 351.85 }}
            animate={{ strokeDashoffset: [351.85, 351.85 * (1 - 0.78), 351.85 * (1 - 0.75), 351.85 * (1 - 0.8), 351.85 * (1 - 0.78)] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.5, 0.8, 1] }}
          />
        </svg>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <Target size={16} color={accentColor} className="mb-1 opacity-80" />
          <motion.span 
            className="text-2xl font-bold font-mono"
            style={{ color: isDark ? '#fff' : '#000' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            78%
          </motion.span>
          <span className="text-[9px] font-mono tracking-widest uppercase opacity-50 mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
            Goal Reached
          </span>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute -top-2 -right-2 bg-emerald-500/10 p-1.5 rounded-full border border-emerald-500/20"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Leaf size={12} className="text-emerald-500" />
        </motion.div>
      </div>
    </div>
  );
};
