import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const WealthChartWidget: React.FC = () => {
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
      <div className="w-full max-w-[200px] flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={12} className="text-emerald-500" />
            </div>
            <div>
              <div className="text-[10px] font-mono opacity-50" style={{ color: isDark ? '#fff' : '#000' }}>PORTFOLIO</div>
              <div className="text-sm font-bold font-mono" style={{ color: isDark ? '#fff' : '#000' }}>+12.4%</div>
            </div>
          </div>
          <PieChart size={16} style={{ color: accentColor }} className="opacity-50" />
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-1 h-16 w-full mt-2">
          {[30, 45, 25, 60, 40, 75, 55, 90].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm relative group overflow-hidden"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              initial={{ height: `${h}%` }}
              animate={{ height: [`${h}%`, `${Math.min(100, Math.max(10, h + (i % 2 === 0 ? 15 : -15)))}%`, `${h}%`] }}
              transition={{ duration: 3 + (i * 0.2), repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div 
                className="absolute bottom-0 w-full"
                style={{ background: i === 7 ? accentColor : (isDark ? '#334155' : '#CBD5E1') }}
                initial={{ height: '0%' }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, delay: i * 0.1 + 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Sparkline overlay */}
        <div className="absolute bottom-10 left-6 right-6 h-16 pointer-events-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <motion.path
              d="M 0 25 L 15 20 L 30 22 L 45 15 L 60 18 L 75 8 L 85 12 L 100 5"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
