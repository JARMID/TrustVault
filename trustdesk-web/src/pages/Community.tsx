import React, { useState } from 'react';
import { 
  Activity, MapPin, 
  Globe, Zap, Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import SecurityGlobe from '../components/3d/SecurityGlobe';

const MOCK_SIGNALS = [
  { id: 1, type: 'suspicious', lat: 45, lng: 20, intensity: 0.8, loc: 'Node Alpha (Paris)', time: 'Just now' },
  { id: 2, type: 'panic', lat: 30, lng: 70, intensity: 1.0, loc: 'Node Gamma (Dubai)', time: '2m ago' },
  { id: 3, type: 'safe', lat: 60, lng: 10, intensity: 0.4, loc: 'Node Beta (London)', time: '5m ago' },
  { id: 4, type: 'suspicious', lat: 25, lng: 40, intensity: 0.6, loc: 'Node Zeta (Riyadh)', time: '12m ago' },
  { id: 5, type: 'panic', lat: 50, lng: 80, intensity: 0.9, loc: 'Node Delta (Mumbai)', time: '18m ago' },
  { id: 6, type: 'safe', lat: 35, lng: 55, intensity: 0.3, loc: 'Node Epsilon (Tehran)', time: '1h ago' },
];

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

const Community: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'All Signals' },
    { id: 'panic', label: 'Critical (Panic)' },
    { id: 'suspicious', label: 'Anomalies' },
    { id: 'safe', label: 'Verified Safe' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-h2 leading-tight" style={{ width: '140px' }}>Global<br/>Signal<br/>Network</h1>
          
          <div className="flex gap-2 bg-inset p-1 rounded-full border" style={{ borderColor: 'var(--border-strong)' }}>
            {filters.map(f => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: filter === f.id ? 'var(--brand-primary)' : 'transparent',
                  color: filter === f.id ? 'white' : 'var(--text-secondary)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="liquid-glass-card mesh-bg flex items-center gap-4 px-6 py-3" style={{ borderRadius: '24px', padding: '8px 24px' }}>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <Globe size={16} /> Global View
            </div>
            <div style={{ width: '1px', height: '16px', background: 'var(--border-strong)' }} />
            <div className="flex items-center gap-2 text-sm font-medium text-green-400">
              <Activity size={16} /> Nodes Online: 14,204
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 flex-1 min-h-0 pb-6" style={{ gridTemplateColumns: '320px 1fr' }}>
        
        {/* Left Sidebar - Signal Feed */}
        <div className="liquid-glass-card mesh-bg flex flex-col overflow-hidden" style={{ padding: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
            <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>Live Feed</h3>
            <Radio size={16} className="text-blue-400 animate-pulse" />
          </div>
          
          <motion.div 
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pr-2"
          >
            {MOCK_SIGNALS.filter(s => filter === 'all' || s.type === filter).map(signal => {
              const isPanic = signal.type === 'panic';
              const isSafe = signal.type === 'safe';
              const color = isPanic ? 'var(--accent-danger)' : isSafe ? 'var(--accent-success)' : 'var(--accent-warning)';

              return (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  key={signal.id} 
                  className="p-4 rounded-xl border transition-all cursor-pointer group hover:bg-surface" 
                  style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'var(--border-subtle)' }} 
                  onMouseOver={e => e.currentTarget.style.borderColor = color} 
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{signal.type}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{signal.time}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{signal.loc}</h4>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                      <MapPin size={10} /> {signal.lat.toFixed(4)}, {signal.lng.toFixed(4)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                      <Zap size={10} /> INT: {signal.intensity.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Area - Map Visualization */}
        <div className="liquid-glass-card mesh-bg relative overflow-hidden flex flex-col" style={{ padding: 0 }}>
          
          {/* Map Base */}
          <div className="absolute inset-0 z-0">
            <SecurityGlobe />
          </div>

          {/* Overlays */}
          <div className="absolute top-6 left-6 pointer-events-none z-10">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Live Topography</h2>
            <p className="text-sm text-tertiary font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Threat Engine Active
            </p>
          </div>

          <div className="absolute bottom-6 right-6 pointer-events-none flex gap-4 z-10">
            <div className="liquid-glass-card mesh-bg" style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}>
              <div className="text-xs tracking-widest uppercase text-tertiary mb-1">Critical Zones</div>
              <div className="text-3xl font-light text-red-500">3</div>
            </div>
            <div className="liquid-glass-card mesh-bg" style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}>
              <div className="text-xs tracking-widest uppercase text-tertiary mb-1">Anomalies Detected</div>
              <div className="text-3xl font-light text-yellow-500">12</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;




