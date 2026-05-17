import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, MapPin, 
  User, FileText, Map, FileJson,
  Lock, UserPlus, AlertTriangle, AlertOctagon, FileOutput, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { formatDistanceToNow } from 'date-fns';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface RawFraudAlert {
  id: number;
  type: string;
  priority: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  description?: string;
  status?: string;
}

interface FraudAlert {
  id: number;
  title: string;
  severity: Severity;
  location: string;
  timestamp: string;
  type: string;
  description: string;
  status: string;
}

const timeline = [
  { title: 'Created', time: '18:42 AM', source: 'System Automated Trigger', status: 'done' },
  { title: 'Assigned to SOC Unit Alpha', time: '18:48 AM', source: 'Manual Assignment', status: 'done' },
  { title: 'Evidence Uploaded', time: '18:52 AM', source: 'Analysis Engine (Auto)', status: 'done' },
  { title: 'Fraud Analyst Notified', time: '18:54 AM', source: 'Administrative Override', status: 'active', color: 'var(--accent-success)' },
  { title: 'Escalated', time: 'Pending Review', source: '', status: 'pending' },
];

const evidence = [
  { name: 'fraud_report.pdf', size: '2.1 MB', type: 'PDF Document', icon: FileText },
  { name: 'location_map.png', size: '1.8 MB', type: 'Analysis Map', icon: Map },
  { name: 'system_logs.json', size: '45 KB', type: 'JSON Array', icon: FileJson },
];

const signals = [
  { title: 'Similar Report in Area', desc: 'Increased suspicious activity in this sector.', correlation: '82%' },
  { title: 'Historical Pattern', desc: "Matches common tailgating behavior.", correlation: '95%' },
  { title: 'Camera Analytics', desc: 'Unrecognized individual detected nearby.', correlation: '44%' },
];

const getSeverityStyles = (severity: Severity) => {
  switch(severity) {
    case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'MEDIUM': return 'bg-blue-300/10 text-blue-300 border-blue-300/20';
    case 'LOW': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    default: return '';
  }
};

const mapPriorityToSeverity = (priority: string): Severity => {
  if (priority === 'critical') return 'CRITICAL';
  if (priority === 'high') return 'HIGH';
  if (priority === 'normal') return 'MEDIUM';
  if (priority === 'low') return 'LOW';
  return 'LOW';
};

const Triage: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Active');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Case Notes State
  const [caseNotes, setCaseNotes] = useState<Record<number, { text: string, timestamp: Date }[]>>({});
  const [draftNote, setDraftNote] = useState('');

  const filters = ['All Active', 'Critical', 'High', 'Medium', 'Low', 'Resolved'];

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/triage/queue');
      const data = response.data.data || [];
      
      const mapped: FraudAlert[] = data.map((item: RawFraudAlert) => ({
        id: item.id,
        title: item.type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        severity: mapPriorityToSeverity(item.priority),
        location: item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : 'Unknown Location',
        timestamp: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
        type: item.type,
        description: item.description,
        status: item.status
      }));
      
      setAlerts(mapped);
      if (mapped.length > 0) {
        setSelectedAlert(mapped[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load fraud alerts. Check that the API is responding.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType: string) => {
    if (!selectedAlert) return;
    try {
      await api.post(`/triage/alerts/${selectedAlert.id}/action`, { action: actionType });
      // Refresh
      fetchQueue();
    } catch (e) {
      console.warn('Action failed', e);
      alert('Action failed');
    }
  };

  const handleAddNote = () => {
    if (!selectedAlert || !draftNote.trim()) return;
    
    setCaseNotes(prev => {
      const existingNotes = prev[selectedAlert.id] || [];
      return {
        ...prev,
        [selectedAlert.id]: [...existingNotes, { text: draftNote.trim(), timestamp: new Date() }]
      };
    });
    setDraftNote('');
  };

  return (
    <div className="animate-fade-in flex flex-col h-full overflow-hidden" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-h2 leading-tight" style={{ width: '120px' }}>Fraud<br/>Triage<br/>Console</h1>
          
          <div className="flex gap-2 bg-black/20 p-1 rounded-full border" style={{ borderColor: 'var(--border-strong)' }}>
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeFilter === f ? 'var(--brand-primary)' : 'transparent',
                  color: activeFilter === f ? 'white' : 'var(--text-secondary)'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Filter by ID, City..." 
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
                padding: '8px 16px 8px 40px',
                borderRadius: '24px',
                outline: 'none',
                fontSize: '0.875rem',
                transition: 'all var(--transition-fast)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-primary-glow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <button className="btn btn-primary" style={{ borderRadius: '24px' }}>
            <Plus size={16} /> Report Fraud Alert
          </button>
        </div>
      </div>

      {/* Main Content Area - 3 Columns */}
      <div className="grid gap-6 flex-1 min-h-0 pb-6" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr minmax(260px, 1fr)' }}>
        
        {/* Col 1: Fraud Alert List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ paddingRight: '8px' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-10 mt-10 text-gray-500">
               <Loader2 className="animate-spin mb-4" size={32} />
               <p className="text-sm">Loading Fraud Alerts...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 mt-10 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
               <AlertOctagon className="mb-2" size={32} />
               <p className="text-sm text-center">{error}</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 mt-10 text-green-500 bg-green-500/10 rounded-xl border border-green-500/20">
               <p className="text-sm text-center">All clear! No active fraud alerts.</p>
            </div>
          ) : (
          <AnimatePresence>
            {alerts.map((inc, i) => {
              const isSelected = selectedAlert?.id === inc.id;
              return (
                <motion.div 
                  key={inc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAlert(inc)}
                  className="glass-card cursor-pointer transition-all hover:bg-white/5"
                  style={{ 
                    padding: '16px',
                    border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                    boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{inc.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getSeverityStyles(inc.severity)}`}>
                    {inc.severity}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-danger)' }}>
                    <AlertOctagon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{inc.title}</h3>
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      <MapPin size={10} /> {inc.location}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{inc.timestamp}</span>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={10} color="var(--brand-primary)" />
                  </div>
                </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          )}
        </div>

        {/* Col 2: Alert Details */}
        <div className="glass-card flex-col flex overflow-y-auto" style={{ padding: '0', position: 'relative' }}>
          {!selectedAlert ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 min-h-[400px]">
              <AlertOctagon size={48} className="opacity-20" />
              <p>Select a fraud alert to view details</p>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAlert.id}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.2 }}
              className="flex-col flex flex-1 w-full"
            >
              {/* Detail Header */}
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--accent-danger), transparent)' }}></div>
                <div className="flex items-start gap-4 mb-6">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-danger)', boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}>
                <AlertOctagon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-h2 mb-1">{selectedAlert.title}</h2>
                    <p className="text-xs" style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Alert ID: {selectedAlert.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded border ${getSeverityStyles(selectedAlert.severity)}`}>
                    {selectedAlert.severity}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedAlert.description || `Fraud alert flagged at origin: ${selectedAlert.location}. Suspicious transaction patterns indicate potential account compromise and unauthorized fund movement.`}
            </p>
          </div>

          <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Timeline */}
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-6 uppercase" style={{ color: 'var(--text-tertiary)' }}>Activity Timeline</h3>
              <div className="flex flex-col gap-6" style={{ paddingLeft: '8px' }}>
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== timeline.length - 1 && (
                      <div style={{ position: 'absolute', top: '24px', bottom: '-24px', left: '7px', width: '2px', background: 'var(--border-strong)' }} />
                    )}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <div style={{ 
                        width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-primary)', 
                        border: '2px solid', borderColor: item.color || (item.status === 'done' ? 'var(--text-tertiary)' : 'var(--border-strong)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {item.status === 'active' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.color }} />}
                      </div>
                    </div>
                    <div style={{ marginTop: '-4px' }}>
                      <h4 className="text-sm font-semibold" style={{ color: item.color || 'var(--text-primary)' }}>{item.title}</h4>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{item.time} {item.source && `• ${item.source}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Gallery */}
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: 'var(--text-tertiary)' }}>Evidence Gallery</h3>
              <div className="flex gap-4">
                {evidence.map((ev, i) => (
                  <div key={i} className="flex-1 border rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'var(--border-subtle)', transition: 'all var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ev.icon size={20} color="var(--text-tertiary)" />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-sm font-medium w-full text-ellipsis overflow-hidden whitespace-nowrap px-2" style={{ color: 'var(--text-secondary)' }}>{ev.name}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{ev.size} • {ev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </motion.div>
          </AnimatePresence>
          )}
        </div>

        {/* Col 3: Right Sidebar */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: 'var(--text-tertiary)' }}>Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAction('freeze_wallet')} disabled={!selectedAlert} className="btn btn-danger w-full justify-center" style={{ padding: '12px', opacity: !selectedAlert ? 0.5 : 1, cursor: !selectedAlert ? 'not-allowed' : 'pointer' }}>
                <Lock size={16} /> Freeze Wallet
              </button>
              <button onClick={() => handleAction('assigned')} disabled={!selectedAlert} className="btn btn-ghost w-full justify-center" style={{ border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)', padding: '12px', opacity: !selectedAlert ? 0.5 : 1, cursor: !selectedAlert ? 'not-allowed' : 'pointer' }}>
                <UserPlus size={16} /> Assign Agent
              </button>
              <button onClick={() => handleAction('escalated')} disabled={!selectedAlert} className="btn btn-ghost w-full justify-center" style={{ border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)', padding: '12px', opacity: !selectedAlert ? 0.5 : 1, cursor: !selectedAlert ? 'not-allowed' : 'pointer' }}>
                <AlertTriangle size={16} /> Escalate
              </button>
              <button onClick={() => handleAction('resolved')} disabled={!selectedAlert} className="btn btn-ghost w-full justify-center" style={{ border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)', padding: '12px', opacity: !selectedAlert ? 0.5 : 1, cursor: !selectedAlert ? 'not-allowed' : 'pointer' }}>
                <FileOutput size={16} /> Mark Resolved
              </button>
            </div>
          </div>

          {/* Related Signals */}
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: 'var(--text-tertiary)' }}>Related Signals</h3>
            <div className="flex flex-col gap-3">
              {signals.map((sig, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                  <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{sig.title}</h4>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{sig.desc}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>Correlation: {sig.correlation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Case Notes */}
          <div className="flex flex-col flex-1" style={{ minHeight: '200px' }}>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: 'var(--text-tertiary)' }}>Case Notes</h3>
            <div className="flex flex-col gap-3 flex-1 p-3 overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
              
              {/* Display existing notes */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2" style={{ maxHeight: '150px' }}>
                {selectedAlert && caseNotes[selectedAlert.id]?.length ? (
                  caseNotes[selectedAlert.id].map((note, idx) => (
                    <div key={idx} className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs text-white break-words">{note.text}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDistanceToNow(note.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>No notes yet.</p>
                )}
              </div>

              <textarea 
                className="w-full bg-transparent border-none text-sm resize-none focus:outline-none"
                placeholder="Type your investigation notes here..."
                rows={3}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                style={{ color: 'var(--text-secondary)' }}
              />
              <button 
                className="btn w-full justify-center" 
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px', opacity: draftNote.trim() ? 1 : 0.5, cursor: draftNote.trim() ? 'pointer' : 'not-allowed' }}
                onClick={handleAddNote}
                disabled={!draftNote.trim()}
              >
                <Plus size={14} /> Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triage;
