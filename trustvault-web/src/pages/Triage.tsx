import React, { useState } from 'react';
import { 
  Plus, MapPin, 
  User, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { TiltCard } from '../components/ui/TiltCard';
import { useTriage } from '../hooks/useTriage';

// Map database severity/priority
const getSeverityStyles = (severity: string) => {
  switch(severity.toUpperCase()) {
    case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'MEDIUM': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'LOW': return 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-subtle)]';
    default: return 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-subtle)]';
  }
};

const MiniWorldMap: React.FC<{ activeThreats: { id: string, x: number, y: number, severity: string }[] }> = ({ activeThreats }) => (
  <div className="relative w-full h-[180px] bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden flex items-center justify-center mb-8">
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at center, var(--brand-primary-glow) 0%, transparent 70%)' }} />
    {/* Simplified SVG World Map Base */}
    <svg viewBox="0 0 100 60" className="w-full h-full opacity-60">
      <path d="M10,20 Q15,15 20,20 T30,15 T40,25 T50,20 T60,30 T70,20 T80,25 T90,15" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1 1" />
      <path d="M5,40 Q15,35 25,45 T35,35 T45,40 T55,50 T65,40 T75,45 T85,35 T95,45" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1 1" />
      <path d="M20,10 L25,15 L22,25 L30,30 L35,20 L40,15 L45,25 L50,30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
      <path d="M60,15 L65,25 L70,20 L75,30 L80,25" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
      <path d="M40,35 L45,45 L50,40 L55,50 L60,45" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
      {/* Grid */}
      {Array.from({length: 10}).map((_, i) => (
        <React.Fragment key={i}>
          <line x1={i*10} y1="0" x2={i*10} y2="60" stroke="#f1f5f9" strokeWidth="0.2" />
          <line x1="0" y1={i*10} x2="100" y2={i*10} stroke="#f1f5f9" strokeWidth="0.2" />
        </React.Fragment>
      ))}
    </svg>
    
    {/* Threat Nodes */}
    {activeThreats.map(threat => (
      <div key={threat.id} className="absolute w-3 h-3 -ml-1.5 -mt-1.5 flex items-center justify-center" style={{ left: `${threat.x}%`, top: `${threat.y}%` }}>
        <div className={`absolute w-full h-full rounded-full animate-ping opacity-60 ${threat.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
        <div className={`w-1.5 h-1.5 rounded-full shadow-md border-[1.5px] border-white ${threat.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
      </div>
    ))}
    
    <div className="absolute top-4 left-4 flex items-center gap-2 bg-[var(--bg-surface-translucent)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
      <Globe size={14} className="text-[#00C6AE]" />
      <span className="text-[0.65rem] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Global Threat Vectors</span>
    </div>
  </div>
);

const Triage: React.FC = () => {
  const { alerts: dbAlerts, takeAction } = useTriage();
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Map DbFraudAlert to UI format
  const alerts = dbAlerts.map(a => ({
    id: a.id.toString(),
    title: a.type.replace(/_/g, ' ').toUpperCase(),
    severity: a.priority.toUpperCase(),
    riskScore: a.risk_score || 0.5,
    location: (a.latitude && a.longitude) ? `${a.latitude.toFixed(2)}, ${a.longitude.toFixed(2)}` : 'Unknown Location',
    coordinates: { 
      x: a.longitude ? ((a.longitude + 180) / 360) * 100 : 50, 
      y: a.latitude ? ((90 - a.latitude) / 180) * 100 : 30 
    },
    timestamp: new Date(a.created_at),
    type: a.type,
    description: a.description || `Fraud alert involving ${a.amount_involved ? a.amount_involved + ' ' + a.currency : 'an unknown amount'}.`,
    status: a.status === 'open' ? 'active' : a.status === 'investigating' ? 'claimed' : a.status,
    claimedBy: a.assigned_to ? 'Agent ' + a.assigned_to : undefined
  }));

  const handleAction = (id: string, action: 'claim' | 'resolve' | 'escalate') => {
    takeAction(id, action);
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return '#EF4444'; // red-500
    if (score >= 0.5) return '#F97316'; // orange-500
    return '#10B981'; // emerald-500
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Resolved') return a.status === 'resolved';
    if (activeFilter === 'Critical (>0.8)') return a.riskScore > 0.8;
    if (activeFilter === 'High (>0.5)') return a.riskScore > 0.5 && a.riskScore <= 0.8;
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto pb-12 w-full pt-8 px-6 xl:px-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[18px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">AI Triage Engine</h1>
            <p className="text-[0.95rem] font-bold text-emerald-500 flex items-center gap-2 mt-1 bg-emerald-500/10 px-3 py-1 rounded-lg w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Live WebSocket Connection Active
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 bg-[var(--bg-surface)] p-1.5 rounded-xl border border-[var(--border-subtle)] shadow-sm overflow-x-auto max-w-full">
          {['All', 'Critical (>0.8)', 'High (>0.5)', 'Resolved'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-[0.85rem] font-bold transition-all whitespace-nowrap ${
                activeFilter === f 
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <MiniWorldMap activeThreats={alerts.filter(a => a.status === 'active' || a.status === 'claimed').map(a => ({ id: a.id, x: a.coordinates.x, y: a.coordinates.y, severity: a.severity }))} />

      {/* Alert Feed */}
      <div className="flex flex-col gap-5">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <TiltCard 
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className={`p-6 relative overflow-hidden transition-all bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] shadow-sm hover:shadow-md ${alert.status === 'resolved' ? 'opacity-60 grayscale bg-[var(--bg-surface-hover)]' : ''}`}
            >
              {/* Risk Score Background Bar */}
              <div 
                className="absolute top-0 left-0 bottom-0 opacity-[0.03] pointer-events-none transition-all duration-1000"
                style={{ width: `${alert.riskScore * 100}%`, backgroundColor: getRiskColor(alert.riskScore) }} 
              />
              {/* Status Indicator line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 pointer-events-none"
                style={{ backgroundColor: getRiskColor(alert.riskScore) }}
              />

              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center pl-3">
                
                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">{alert.id}</span>
                    <span className={`text-[0.65rem] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border ${getSeverityStyles(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {alert.status === 'resolved' && (
                      <span className="flex items-center gap-1.5 text-[0.65rem] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                        <CheckCircle2 size={12} /> RESOLVED
                      </span>
                    )}
                    {alert.status === 'escalated' && (
                      <span className="flex items-center gap-1.5 text-[0.65rem] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest">
                        <AlertTriangle size={12} /> ESCALATED
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-1.5">{alert.title}</h3>
                  <p className="text-[0.95rem] font-medium text-[var(--text-secondary)] mb-4">{alert.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-[0.8rem] font-bold text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {alert.location}</span>
                    <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Score & Actions Section */}
                <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto pl-0 lg:pl-8 lg:border-l border-[var(--border-subtle)]">
                  
                  {/* Risk Score */}
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className="text-3xl font-mono font-extrabold tracking-tight" style={{ color: getRiskColor(alert.riskScore) }}>
                      {alert.riskScore.toFixed(2)}
                    </div>
                    <div className="text-[0.65rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Risk Score</div>
                    <div className="w-24 h-2 bg-[var(--bg-inset)] rounded-full mt-3 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${alert.riskScore * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getRiskColor(alert.riskScore) }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.status !== 'resolved' && (
                    <div className="flex gap-3 w-full sm:w-auto">
                      {alert.status === 'claimed' ? (
                        <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[0.85rem] font-bold w-full sm:w-auto">
                          <User size={18} /> Claimed by {alert.claimedBy}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAction(alert.id, 'claim')}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--text-primary)] hover:opacity-80 text-[var(--bg-primary)] font-bold text-[0.9rem] w-full sm:w-auto shadow-md transition-all"
                        >
                          <Plus size={18} /> Claim
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleAction(alert.id, 'resolve')}
                        className="flex items-center justify-center p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all shadow-sm w-full sm:w-auto"
                        title="Resolve"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      
                      <button 
                        onClick={() => handleAction(alert.id, 'escalate')}
                        className="flex items-center justify-center p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all shadow-sm w-full sm:w-auto"
                        title="Escalate"
                      >
                        <AlertTriangle size={20} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </TiltCard>
          ))}
        </AnimatePresence>
        
        {filteredAlerts.length === 0 && (
          <div className="py-16 text-center text-[var(--text-tertiary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-[28px]">
            <ShieldCheck size={56} className="mx-auto mb-4 text-[#00C6AE] opacity-50" />
            <p className="font-bold">No alerts match your current filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Triage;
