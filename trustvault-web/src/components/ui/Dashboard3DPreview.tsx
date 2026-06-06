import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ShieldCheck, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Fingerprint, Scan, Eye } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { gsap } from 'gsap';

const transactions = [
  { id: 1, name: 'Spotify Premium', amount: '-$14.99', status: 'Approved', type: 'out', time: '10:24 AM' },
  { id: 2, name: 'Inbound Wire Transfer', amount: '+$14,500.00', status: 'Cleared', type: 'in', time: '09:15 AM' },
  { id: 3, name: 'AWS Cloud Services', amount: '-$420.50', status: 'Approved', type: 'out', time: 'Yesterday' },
  { id: 4, name: 'Uber Technologies', amount: '-$24.00', status: 'Approved', type: 'out', time: 'Yesterday' },
];

export const Dashboard3DPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setMousePos({ x: 0, y: 0 }));
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setMousePos({ x: 0, y: 0 }));
      }
    };
  }, []);

  const bgGradient = isDark 
    ? 'linear-gradient(to bottom right, #0F172A, #020617)' 
    : 'linear-gradient(to bottom right, #F8FAFC, #E2E8F0)';
  
  const panelBg = isDark 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)';
    
  const panelBorder = isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)';
    
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accentColor = '#00C6AE';

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex items-center justify-center perspective-[2000px]"
      style={{ background: bgGradient }}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00C6AE]/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <motion.div
        animate={{
          rotateX: mousePos.y,
          rotateY: mousePos.x,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        className="w-full max-w-[1000px] h-[600px] relative preserve-3d"
      >
        {/* ── LAYER 1: BASE DASHBOARD ── */}
        <div 
          className="absolute inset-0 rounded-2xl p-6 grid grid-cols-12 grid-rows-6 gap-4 backdrop-blur-xl shadow-2xl preserve-3d"
          style={{ 
            background: panelBg, 
            border: `1px solid ${panelBorder}`,
            transform: 'translateZ(0px)',
            boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
          }}
        >
          
          {/* Header */}
          <div className="col-span-12 row-span-1 flex items-center justify-between border-b" style={{ borderColor: panelBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00C6AE]/20 flex items-center justify-center border border-[#00C6AE]/30">
                <ShieldCheck size={18} color={accentColor} />
              </div>
              <div>
                <h3 className="font-bold font-display" style={{ color: textColor }}>Dashboard</h3>
                <p className="text-xs" style={{ color: textMuted }}>Welcome back, TrustVault Client</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-500">System Nominal</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#00C6AE]/50 overflow-hidden">
                <img src="/avatar-placeholder.png" alt="User" className="w-full h-full object-cover bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Left Column: Balance & Cards */}
          <div className="col-span-4 row-span-5 flex flex-col gap-4 pt-2">
            <div className="p-5 rounded-xl border flex flex-col justify-between" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', borderColor: panelBorder }}>
              <p className="text-sm font-medium mb-1" style={{ color: textMuted }}>Total Balance</p>
              <h2 className="text-3xl font-bold font-mono tracking-tight mb-2" style={{ color: textColor }}>$1,248,315.00</h2>
              <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                <TrendingUp size={16} />
                <span>+12.4% this month</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border flex-1" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', borderColor: panelBorder }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium" style={{ color: textMuted }}>Active Cards</p>
                <CreditCard size={16} color={textMuted} />
              </div>
              {/* Mini card visual */}
              <div className="w-full h-32 rounded-xl border p-4 relative overflow-hidden flex flex-col justify-between"
                style={{ 
                  background: isDark ? 'linear-gradient(to bottom right, #1E293B, #0F172A)' : 'linear-gradient(to bottom right, #F8FAFC, #E2E8F0)',
                  borderColor: panelBorder
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C6AE]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                <div className="flex justify-between items-start">
                  <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 to-amber-500" />
                  <span className="font-mono text-xs" style={{ color: textColor }}>•••• 3291</span>
                </div>
                <div className="font-mono text-[10px]" style={{ color: textMuted }}>TRUSTVAULT VIRTUAL</div>
              </div>
            </div>
          </div>

          {/* Center Column: Chart */}
          <div className="col-span-8 row-span-3 pt-2">
            <div className="w-full h-full p-5 rounded-xl border flex flex-col" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', borderColor: panelBorder }}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium" style={{ color: textMuted }}>Cash Flow Analytics</p>
                <BarChart3 size={16} color={textMuted} />
              </div>
              <div className="flex-1 flex items-end gap-2 justify-between px-2 pb-2">
                {[40, 70, 45, 90, 65, 85, 120, 95, 60, 110, 80, 100].map((h, i) => (
                  <motion.div 
                    key={i} 
                    className="w-full rounded-t-md relative group"
                    style={{ background: i === 6 ? accentColor : (isDark ? '#334155' : '#CBD5E1'), height: `${(h/120)*100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(h/120)*100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.8, type: "spring" }}
                  >
                    {i === 6 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#00C6AE] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Peak
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Right: Recent Transactions */}
          <div className="col-span-8 row-span-2">
            <div className="w-full h-full p-5 rounded-xl border overflow-hidden flex flex-col" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', borderColor: panelBorder }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium" style={{ color: textMuted }}>Recent Transactions</p>
                <Activity size={16} color={textMuted} />
              </div>
              <div className="flex flex-col gap-3">
                {transactions.slice(0, 2).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {tx.type === 'in' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: textColor }}>{tx.name}</p>
                        <p className="text-xs" style={{ color: textMuted }}>{tx.status} • {tx.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold" style={{ color: tx.type === 'in' ? '#10B981' : textColor }}>{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── LAYER 2: FLOATING SECURITY WIDGET ── */}
        <motion.div 
          className="absolute right-[-40px] top-[100px] w-64 p-4 rounded-xl backdrop-blur-md border border-[#00C6AE]/30 shadow-[0_20px_40px_rgba(0,198,174,0.15)] flex flex-col gap-3"
          style={{ 
            background: isDark ? 'rgba(7, 11, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            transform: 'translateZ(60px)',
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: panelBorder }}>
            <Fingerprint size={16} color={accentColor} />
            <span className="text-xs font-bold tracking-wider" style={{ color: textColor }}>BIOMETRIC AUTH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground uppercase" style={{ color: textMuted }}>Status</span>
            <span className="text-[10px] text-[#00C6AE] font-mono px-2 py-0.5 bg-[#00C6AE]/10 rounded border border-[#00C6AE]/20">VERIFIED</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: isDark ? '#1E293B' : '#E2E8F0' }}>
            <motion.div 
              className="h-full bg-[#00C6AE]" 
              animate={{ width: ['0%', '100%'] }} 
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* ── LAYER 3: FLOATING ML ANALYTICS WIDGET ── */}
        <motion.div 
          className="absolute left-[-20px] bottom-[80px] w-56 p-4 rounded-xl backdrop-blur-md border border-indigo-500/30 shadow-[0_20px_40px_rgba(99,102,241,0.15)] flex flex-col gap-2"
          style={{ 
            background: isDark ? 'rgba(7, 11, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            transform: 'translateZ(90px)',
          }}
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold tracking-wider text-indigo-400">THREAT TRIAGE</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold" style={{ color: textColor }}>0.012</div>
          <div className="text-[9px] uppercase" style={{ color: textMuted }}>Anomaly Score (Low Risk)</div>
          
          {/* Animated graph line */}
          <div className="mt-2 h-8 w-full relative flex items-end">
            <svg viewBox="0 0 100 20" className="w-full h-full stroke-indigo-500 stroke-2 fill-none overflow-visible">
              <motion.path 
                d="M 0 15 Q 10 5, 20 15 T 40 10 T 60 18 T 80 8 T 100 12" 
                strokeDasharray="100"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};
