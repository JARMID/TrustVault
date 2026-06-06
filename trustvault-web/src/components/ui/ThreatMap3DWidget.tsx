import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Zap } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export const ThreatMap3DWidget: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [nodes, setNodes] = useState<{ id: number; x: number; y: number; threat: number }[]>([]);

  useEffect(() => {
    // Generate initial random nodes
    const initialNodes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      threat: Math.random()
    }));
    setNodes(initialNodes);

    // Periodically update some nodes
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (Math.random() > 0.7) {
          return { ...node, threat: Math.random() };
        }
        return node;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const primaryColor = isDark ? '#00C6AE' : '#3B82F6';
  const dangerColor = '#EF4444';
  const bgColor = isDark ? 'rgba(7, 11, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.1)';
  const textColor = isDark ? '#F8FAFC' : '#1E293B';

  return (
    <div 
      className="relative w-full aspect-video rounded-2xl overflow-hidden backdrop-blur-xl border flex items-center justify-center shadow-2xl preserve-3d group-hover:scale-[1.02] transition-all duration-700"
      style={{ 
        background: bgColor,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        perspective: '1000px'
      }}
    >
      {/* 3D Base Grid */}
      <div 
        className="absolute w-[200%] h-[200%] preserve-3d"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) translateY(-20%) translateZ(-100px)',
        }}
      >
        {/* Render nodes on the grid */}
        {nodes.map((node) => {
          const isHighThreat = node.threat > 0.8;
          const color = isHighThreat ? dangerColor : primaryColor;
          
          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ height: isHighThreat ? [20, 100, 20] : 20 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Pillar/Data Point */}
              <div 
                className="w-4 rounded-t-sm shadow-[0_0_15px_currentColor]"
                style={{ 
                  height: `${Math.max(20, node.threat * 100)}px`,
                  background: `linear-gradient(to top, transparent, ${color})`,
                  color: color,
                  transform: 'rotateX(-90deg)', // Stand up straight from the tilted grid
                  transformOrigin: 'bottom center'
                }}
              />
              {/* Base ping effect */}
              {isHighThreat && (
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 animate-ping"
                  style={{ borderColor: dangerColor }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating HUD Elements */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md border" style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <Activity size={14} color={primaryColor} />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: textColor }}>LIVE SOC MAP</span>
          </div>
          
          <div className="flex flex-col items-end gap-1 px-3 py-2 rounded-lg backdrop-blur-md border" style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">System Load</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? '#1E293B' : '#E2E8F0' }}>
                <motion.div className="h-full" style={{ background: primaryColor }} animate={{ width: ['30%', '70%', '45%'] }} transition={{ duration: 3, repeat: Infinity }} />
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: textColor }}>45%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: primaryColor }} />
            <span style={{ color: primaryColor }}>1,249 REQ / MIN</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md border border-red-500/30 bg-red-500/10 text-red-500 shadow-sm">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-mono font-bold">1 ACTIVE THREAT</span>
          </div>
        </div>
      </div>

      {/* Grid Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          background: 'linear-gradient(transparent 50%, currentColor 50%)', 
          backgroundSize: '100% 4px',
          color: isDark ? '#FFF' : '#000'
        }} 
      />
    </div>
  );
};
