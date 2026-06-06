import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const AnalyticsMiniWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const accentColor = isDark ? '#00C6AE' : '#3B82F6';
  const bgColor = isDark ? 'rgba(7, 11, 20, 0.4)' : 'rgba(255, 255, 255, 0.6)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const panelBg = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)';

  return (
    <div 
      className="w-full h-full min-h-[160px] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 gap-3"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <div className="w-full flex gap-3">
        {/* Tile 1: Uptime */}
        <div className="flex-1 p-3 rounded-xl border flex flex-col justify-between relative overflow-hidden" style={{ background: panelBg, borderColor }}>
          <div className="flex justify-between items-start mb-2">
            <Cpu size={14} className="opacity-50" style={{ color: isDark ? '#fff' : '#000' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono opacity-50 mb-0.5" style={{ color: isDark ? '#fff' : '#000' }}>UPTIME</div>
            <div className="text-lg font-bold font-mono" style={{ color: isDark ? '#fff' : '#000' }}>99.9%</div>
          </div>
          
          <motion.div className="absolute bottom-0 left-0 h-0.5 bg-emerald-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
        </div>

        {/* Tile 2: Load */}
        <div className="flex-1 p-3 rounded-xl border flex flex-col justify-between relative overflow-hidden" style={{ background: panelBg, borderColor }}>
          <div className="flex justify-between items-start mb-2">
            <Activity size={14} className="opacity-50" style={{ color: isDark ? '#fff' : '#000' }} />
            <span className="text-[9px] font-mono text-emerald-500">NOMINAL</span>
          </div>
          <div>
            <div className="text-[10px] font-mono opacity-50 mb-0.5" style={{ color: isDark ? '#fff' : '#000' }}>SYS LOAD</div>
            <div className="flex items-end gap-1 h-6">
              {[3, 5, 2, 7, 4].map((h, i) => (
                <motion.div key={i} className="flex-1 rounded-t-[1px]" style={{ background: accentColor }} animate={{ height: [`${h*10}%`, `${Math.max(20, Math.random() * 100)}%`, `${h*10}%`] }} transition={{ duration: 1.5 + i*0.2, repeat: Infinity }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tile 3: AI Threat Triage */}
      <div className="w-full p-3 rounded-xl border flex items-center justify-between" style={{ background: panelBg, borderColor }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <ShieldAlert size={14} className="text-indigo-500" />
          </div>
          <div>
            <div className="text-[10px] font-mono opacity-50" style={{ color: isDark ? '#fff' : '#000' }}>AI THREAT TRIAGE</div>
            <div className="text-xs font-bold font-mono" style={{ color: isDark ? '#fff' : '#000' }}>0 THREATS DETECTED</div>
          </div>
        </div>
        <motion.div className="px-2 py-1 rounded border border-indigo-500/30 text-[9px] font-mono text-indigo-500" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          SCANNING
        </motion.div>
      </div>
    </div>
  );
};
