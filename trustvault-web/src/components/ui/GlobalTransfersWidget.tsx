import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const GlobalTransfersWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const accentColor = isDark ? '#00C6AE' : '#3B82F6';
  const bgColor = isDark ? 'rgba(7, 11, 20, 0.4)' : 'rgba(255, 255, 255, 0.6)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div 
      className="w-full h-full min-h-[160px] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px', color: isDark ? '#fff' : '#000' }} />
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Globe Background */}
        <div className="absolute inset-0 rounded-full border border-dashed opacity-20" style={{ borderColor: isDark ? '#fff' : '#000' }} />
        <Globe size={48} color={accentColor} className="opacity-20" strokeWidth={1} />
        
        {/* Animated Arcs */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
          <motion.path
            d="M 20 50 Q 50 10 80 50"
            fill="transparent"
            stroke={accentColor}
            strokeWidth="2"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M 30 70 Q 60 90 85 40"
            fill="transparent"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M 10 30 Q 30 10 70 20"
            fill="transparent"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>

        {/* Currency Nodes */}
        <motion.div className="absolute top-2 left-4 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg" style={{ background: isDark ? '#1E293B' : '#fff', color: isDark ? '#fff' : '#000' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          $
        </motion.div>
        <motion.div className="absolute bottom-4 right-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg" style={{ background: isDark ? '#1E293B' : '#fff', color: isDark ? '#fff' : '#000' }} animate={{ y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>
          €
        </motion.div>
        <motion.div className="absolute top-1/2 -right-4 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg" style={{ background: isDark ? '#1E293B' : '#fff', color: isDark ? '#fff' : '#000' }} animate={{ x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
          £
        </motion.div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
        <span>0ms LATENCY</span>
        <ArrowRight size={12} className="opacity-50" />
        <span style={{ color: accentColor }}>142 COUNTRIES</span>
      </div>
    </div>
  );
};
