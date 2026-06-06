import React, { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, Crosshair, Users, Activity, Radar, ArrowUpRight, Lock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTriage } from '../../hooks/useTriage';

const Sparkline: React.FC<{ color: string, data: number[] }> = ({ color, data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`).join(' ');

  return (
    <div style={{ height: '30px', width: '100%', marginTop: '12px' }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`${points}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} />
      </svg>
    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, trend?: string, isDanger?: boolean, sparklineData: number[] }> = ({ title, value, icon, color, trend, isDanger, sparklineData }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.01 }}
    className="liquid-glass-card group cursor-pointer" 
    style={{ 
      padding: '20px', position: 'relative', overflow: 'hidden',
      border: `1px solid ${isDanger ? color : 'var(--border-white-5)'}`
    }}
  >
    {/* Dynamic Hover Glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)` }}/>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `linear-gradient(135deg, transparent 0%, ${color}10 100%)` }}/>

    {isDanger && (
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }} 
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color, boxShadow: `0 0 15px ${color}` }} 
      />
    )}
    
    <div style={{ 
      position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: 0.1, filter: 'blur(30px)'
    }} />

    <div className="flex justify-between items-start mb-4">
      <div style={{ 
        width: '44px', height: '44px', borderRadius: '12px', 
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`
      }}>
        {icon}
      </div>
      {trend && (
        <span style={{ 
          fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-success)', 
          background: 'var(--accent-success-bg)', padding: '4px 10px', borderRadius: '20px',
          boxShadow: '0 0 10px var(--accent-success-bg)'
        }}>
          {trend}
        </span>
      )}
    </div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <motion.div 
        key={value}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.1, textShadow: `0 0 20px ${color}40` }}
      >
        {value}
      </motion.div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500, letterSpacing: '0.02em' }}>{title}</div>
    </div>
    
    <Sparkline color={color} data={sparklineData} />
  </motion.div>
);

const SOCDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, loading } = useTriage();
  const [liveNodes, setLiveNodes] = useState(1240);
  const activeThreats = useMemo(() => alerts.filter(a => a.priority === 'critical' || a.priority === 'high').length, [alerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNodes(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', textShadow: '0 0 30px rgba(0, 198, 174, 0.3)' }}>SOC Command Center</h1>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}>
              <Activity size={14} style={{ color: 'var(--accent-danger)', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-danger)', letterSpacing: '0.1em' }}>LIVE TELEMETRY</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            Real-time multi-vector threat aggregation. Monitoring global nodes, AI fraud heuristics, and Identity Verification requests in real-time.
          </p>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard title="Active Nodes" value={liveNodes.toLocaleString()} icon={<Radar />} color="var(--brand-primary)" trend="+2.4%" sparklineData={[40, 50, 45, 60, 55, 70, 65, 80]} />
        <KPICard title="Critical Threats" value={activeThreats.toString()} icon={<AlertTriangle />} color="var(--accent-danger)" isDanger sparklineData={[10, 15, 12, 8, 20, 25, 18, activeThreats * 2]} />
        <KPICard title="Pending eKYC" value="84" icon={<Users />} color="var(--accent-warning)" sparklineData={[80, 82, 81, 85, 84, 86, 83, 84]} />
        <KPICard title="Fraud Prevented" value="$2.4M" icon={<Shield />} color="var(--accent-success)" trend="+12%" sparklineData={[1.8, 1.9, 1.9, 2.1, 2.2, 2.2, 2.3, 2.4]} />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Triage Feed */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 flex flex-col gap-6">
          <div className="liquid-glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.03)_0%,transparent_50%)] pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crosshair size={20} color="var(--accent-danger)" /> Live Triage Feed
              </h3>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }} onClick={() => navigate('/app/incidents')}>
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-hidden" style={{ maxHeight: '460px', paddingRight: '4px' }}>
              <AnimatePresence>
                {loading && <div style={{ color: 'var(--text-tertiary)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Loading live telemetry...</div>}
                {alerts.slice(0, 10).map((incident) => {
                  const isHighRisk = incident.priority === 'critical' || incident.priority === 'high';
                  const color = isHighRisk ? 'var(--accent-danger)' : 'var(--accent-warning)';
                  
                  return (
                    <motion.div 
                      key={incident.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      layout
                      style={{ 
                        padding: '16px', borderRadius: '12px', background: 'var(--bg-inset)',
                        border: `1px solid ${color}30`,
                        borderLeft: `4px solid ${color}`,
                        boxShadow: `0 4px 20px ${color}10`,
                        position: 'relative', overflow: 'hidden'
                      }}
                    >
                      {isHighRisk && (
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: `linear-gradient(90deg, transparent, ${color}10)`, pointerEvents: 'none' }} />
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>TRG-{incident.id}</span>
                        <span style={{ fontSize: '0.7rem', color: color, fontWeight: 600 }}>{new Date(incident.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>{incident.type.replace('_', ' ').toUpperCase()}</div>
                      <div className="flex justify-between items-end">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{incident.user_id}</span>
                        </div>
                        <span style={{ 
                          fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
                          background: `color-mix(in srgb, ${color} 15%, transparent)`,
                          color: color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`
                        }}>
                          {incident.status.toUpperCase()} <span style={{ opacity: 0.7, marginLeft: '4px', fontWeight: 500 }}>({incident.risk_score.toFixed(2)})</span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Center & Right Column: Threat Map Preview & eKYC */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Threat Map Mini */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,198,174,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radar size={20} color="var(--brand-primary)" /> Global Threat Topology
              </h3>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }} onClick={() => navigate('/app/map')}>
                Expand Map <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div style={{ 
              height: '280px', width: '100%', borderRadius: '16px', background: '#080c14',
              position: 'relative', overflow: 'hidden', border: '1px solid var(--border-white-5)',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
            }}>
              {/* Fake Map Grid */}
              <div style={{ 
                position: 'absolute', inset: 0, opacity: 0.15,
                backgroundImage: 'linear-gradient(rgba(0, 198, 174, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 198, 174, 0.3) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-50px) scale(2)',
                transformOrigin: 'top center'
              }} />
              
              {/* Radar Sweep */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px',
                transform: 'translate(-50%, -50%)',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(0, 198, 174, 0.05) 70%, rgba(0, 198, 174, 0.4) 100%)',
                borderRadius: '50%',
                animation: 'spin 3s linear infinite'
              }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '1px', background: 'rgba(0,198,174,0.2)', transform: 'translate(-50%, -50%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '1px', height: '100%', background: 'rgba(0,198,174,0.2)', transform: 'translate(-50%, -50%)' }} />

              
              {/* Animated Threat Nodes */}
              <motion.div style={{ position: 'absolute', top: '35%', left: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 20px var(--accent-danger)' }} animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <span style={{ fontSize: '0.6rem', color: 'var(--accent-danger)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>NYC_CRIT</span>
              </motion.div>

              <motion.div style={{ position: 'absolute', top: '65%', left: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)', boxShadow: '0 0 15px var(--brand-primary)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                <span style={{ fontSize: '0.6rem', color: 'var(--brand-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>LDN_WARN</span>
              </motion.div>

              <motion.div style={{ position: 'absolute', top: '25%', left: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-warning)', boxShadow: '0 0 20px var(--accent-warning)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity, delay: 1 }} />
              </motion.div>
              
              <div className="glass-card" style={{ 
                position: 'absolute', bottom: 16, right: 16, padding: '8px 12px', borderRadius: '8px',
                fontSize: '0.7rem', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)',
                background: 'rgba(10, 14, 26, 0.8)', border: '1px solid rgba(0, 198, 174, 0.2)'
              }}>
                <Zap size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                GLOBAL SECURE NET SYNCED
              </div>
            </div>
          </motion.div>

          {/* eKYC Pending Reviews */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="liquid-glass-card" style={{ padding: '24px', flex: 1, border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.03)_0%,transparent_50%)] pointer-events-none" />
             <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="var(--accent-warning)" /> Pending eKYC Escalations
              </h3>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }} onClick={() => navigate('/app/ekyc')}>
                Go to Identity <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-white-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'left', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>USER ID</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>DOCUMENT</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>ML CONFIDENCE</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'USR-291', doc: 'Passport (DZ)', conf: '94%', color: 'var(--accent-success)' },
                    { id: 'USR-290', doc: 'National ID', conf: '88%', color: 'var(--accent-warning)' },
                    { id: 'USR-289', doc: 'Driver License', conf: '42%', color: 'var(--accent-danger)' },
                  ].map((row, i) => (
                    <motion.tr 
                      key={row.id} 
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      style={{ borderBottom: '1px solid var(--border-white-5)', fontSize: '0.9rem', transition: 'background 0.2s' }}
                    >
                      <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)' }}>
                        <Lock size={12} style={{ display: 'inline', marginRight: '6px', color: 'var(--text-tertiary)' }} />
                        {row.id}
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.doc}</td>
                      <td style={{ padding: '16px' }}>
                        <div className="flex items-center gap-2">
                          <div style={{ flex: 1, height: '4px', background: 'var(--bg-inset)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: row.conf }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                              style={{ height: '100%', background: row.color, borderRadius: '2px', boxShadow: `0 0 10px ${row.color}` }} 
                            />
                          </div>
                          <span style={{ color: row.color, fontWeight: 700, fontSize: '0.8rem', minWidth: '32px' }}>{row.conf}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.75rem', height: 'auto', minHeight: '32px', borderRadius: '8px' }}>
                          Review
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Global CSS for animations */}
      <style>{`
        @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SOCDashboard;
