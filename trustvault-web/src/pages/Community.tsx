import React, { useState } from 'react';
import { 
  Activity, MapPin, 
  Globe, Zap, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunitySignals } from '../hooks/useCommunitySignals';
import { TiltCard } from '../components/ui/TiltCard';

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: any = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

/* ── Clean Map Visual ── */
const CSSMapTracker: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden bg-[var(--bg-surface-hover)] flex items-center justify-center">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <Globe size={600} className="text-[var(--border-subtle)] absolute -right-20 top-10 rotate-12" strokeWidth={0.5} />
      
      {/* Simulated Nodes */}
      <div className="relative z-10 w-full h-full">
         <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-red-500 animate-ping absolute opacity-50" />
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md relative z-10" />
         </div>
         <div className="absolute top-[60%] left-[20%] flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md relative z-10" />
         </div>
         <div className="absolute top-[45%] left-[70%] flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-orange-500 animate-ping absolute opacity-40" />
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-md relative z-10" />
         </div>
      </div>
    </div>
  );
};

const Community: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'All Signals' },
    { id: 'panic', label: 'Critical' },
    { id: 'suspicious', label: 'Anomalies' },
    { id: 'safe', label: 'Verified Safe' },
  ];

  const { signals, isLoading } = useCommunitySignals();

  // Helper to map backend types to UI types
  const mapType = (backendType: string) => {
    if (backendType === 'safe') return 'safe';
    if (backendType === 'panic' || backendType === 'theft_spotted' || backendType === 'lost_device') return 'panic';
    return 'suspicious';
  };

  const formattedSignals = signals.map(s => ({
    id: s.id,
    type: mapType(s.type),
    lat: Number(s.latitude),
    lng: Number(s.longitude),
    intensity: s.confidence_score / 100,
    loc: `Node ${s.id}`,
    time: new Date(s.created_at).toLocaleTimeString()
  }));

  const activeSignals = formattedSignals.filter(s => filter === 'all' || s.type === filter);

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1400px] mx-auto w-full pt-6">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8 px-6 xl:px-0">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none w-[160px]">Global<br/>Signal<br/>Network</h1>
          
          <div className="flex gap-2 bg-[var(--bg-surface)] p-1.5 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
            {filters.map(f => (
              <motion.button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                  filter === f.id ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {filter === f.id && (
                  <motion.div
                    layoutId="community-filter-pill"
                    className="absolute inset-0 rounded-xl bg-[var(--text-primary)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
        <TiltCard className="!rounded-2xl flex items-center gap-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm px-6 py-3">
            <div className="flex items-center gap-2 text-[0.95rem] font-bold text-[var(--text-secondary)]">
              <Globe size={18} /> Global View
            </div>
            <div className="w-px h-6 bg-[var(--border-subtle)]" />
            <div className="flex items-center gap-2 text-[0.95rem] font-extrabold text-[var(--accent-success)] bg-[var(--accent-success-bg)] px-3 py-1 rounded-lg">
              <Activity size={18} /> Nodes Online: {isLoading ? '...' : 14204 + signals.length}
            </div>
          </TiltCard>
        </div>
      </div>

      <div className="grid gap-6 flex-1 min-h-0 pb-6 px-6 xl:px-0 grid-cols-[360px_1fr]">
        
        {/* Left Sidebar - Signal Feed */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[28px] shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-inset)] flex justify-between items-center">
            <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">Live Feed</h3>
            <Radio size={18} className="text-[var(--brand-primary)] animate-pulse" />
          </div>
          
          <motion.div 
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide"
          >
            {activeSignals.length === 0 && !isLoading && (
              <div className="text-sm font-bold text-[var(--text-tertiary)] text-center mt-8">No signals found.</div>
            )}
            {isLoading && (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-[var(--bg-inset)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
            <AnimatePresence>
            {activeSignals.map(signal => {
              const isPanic = signal.type === 'panic';
              const isSafe = signal.type === 'safe';
              const colors = isPanic 
                ? { bg: 'bg-[var(--accent-danger-bg)]', border: 'border-[var(--accent-danger-glow)]', text: 'text-[var(--accent-danger)]', hover: 'hover:border-[var(--accent-danger)]' }
                : isSafe 
                ? { bg: 'bg-[var(--accent-success-bg)]', border: 'border-[var(--accent-success-glow)]', text: 'text-[var(--accent-success)]', hover: 'hover:border-[var(--accent-success)]' }
                : { bg: 'bg-[var(--accent-warning-bg)]', border: 'border-[var(--accent-warning-glow)]', text: 'text-[var(--accent-warning)]', hover: 'hover:border-[var(--accent-warning)]' };

              return (
                <motion.div 
                  variants={itemVariants}
                  layout
                  key={signal.id} 
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group bg-[var(--bg-inset)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] hover:shadow-md ${colors.hover}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isPanic ? 'bg-[var(--accent-danger)]' : isSafe ? 'bg-[var(--accent-success)]' : 'bg-[var(--accent-warning)]'}`} />
                      <span className={`text-[0.7rem] font-extrabold uppercase tracking-widest ${colors.text}`}>{signal.type}</span>
                    </div>
                    <span className="text-[0.7rem] font-bold text-[var(--text-tertiary)]">{signal.time}</span>
                  </div>
                  <h4 className="text-[0.95rem] font-bold text-[var(--text-primary)] mb-1">{signal.loc}</h4>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-surface)] px-2 py-1 rounded-md">
                      <MapPin size={12} className="text-[var(--text-tertiary)]" /> {signal.lat.toFixed(4)}, {signal.lng.toFixed(4)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-surface)] px-2 py-1 rounded-md">
                      <Zap size={12} className="text-[var(--text-tertiary)]" /> INT: {signal.intensity.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Area - Map Visualization */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[28px] shadow-sm relative overflow-hidden flex flex-col">
          
          {/* Map Base */}
          <CSSMapTracker />

          {/* Overlays */}
          <div className="absolute top-8 left-8 pointer-events-none z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">Live Topography</h2>
            <div className="flex items-center gap-2 bg-[var(--accent-success-bg)] border border-[var(--accent-success-glow)] px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
              <span className="text-xs font-extrabold text-[var(--accent-success)] uppercase tracking-widest">Threat Engine Active</span>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 pointer-events-none flex gap-4 z-10">
            <TiltCard className="!rounded-2xl bg-[var(--bg-surface-translucent)] backdrop-blur-xl border border-[var(--border-subtle)] shadow-lg px-6 py-5">
              <div className="text-[0.75rem] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-2">Critical Zones</div>
              <div className="text-4xl font-extrabold text-[var(--accent-danger)]">{activeSignals.filter(s => s.type === 'panic').length || 3}</div>
            </TiltCard>
            <TiltCard className="!rounded-2xl bg-[var(--bg-surface-translucent)] backdrop-blur-xl border border-[var(--border-subtle)] shadow-lg px-6 py-5">
              <div className="text-[0.75rem] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-2">Anomalies Detected</div>
              <div className="text-4xl font-extrabold text-[var(--accent-warning)]">{activeSignals.filter(s => s.type === 'suspicious').length || 12}</div>
            </TiltCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;




