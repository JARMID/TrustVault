import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, Send, AlertCircle, FileText, CheckCircle2, Terminal, Activity,
  Clock, Shield, ChevronDown, Eye, TrendingDown, Cpu
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { useToast } from '../components/ui/Toast';

/* ── Mock Data ── */
const errorFrequency = [
  { hour: '00:00', errors: 3 }, { hour: '02:00', errors: 1 }, { hour: '04:00', errors: 0 },
  { hour: '06:00', errors: 2 }, { hour: '08:00', errors: 7 }, { hour: '10:00', errors: 12 },
  { hour: '12:00', errors: 8 }, { hour: '14:00', errors: 15 }, { hour: '16:00', errors: 9 },
  { hour: '18:00', errors: 6 }, { hour: '20:00', errors: 4 }, { hour: '22:00', errors: 2 },
];

const categoryData = [
  { name: 'UI Rendering', count: 23, color: '#8B5CF6' },
  { name: 'API Timeout', count: 18, color: '#EF4444' },
  { name: 'Auth Failure', count: 14, color: '#F59E0B' },
  { name: 'Data Sync', count: 9, color: '#3B82F6' },
  { name: 'Network', count: 7, color: '#06B6D4' },
  { name: 'Other', count: 4, color: '#64748B' },
];

const recentBugs = [
  { id: 'BUG-0042', title: 'Map markers not rendering on mobile Safari', severity: 'CRITICAL', status: 'Open', reporter: 'SOC-Alpha', time: '12 min ago' },
  { id: 'BUG-0041', title: 'eKYC camera permission denied on Android 14', severity: 'HIGH', status: 'In Progress', reporter: 'QA-Team', time: '45 min ago' },
  { id: 'BUG-0040', title: 'Dashboard chart tooltip overlaps sidebar', severity: 'MEDIUM', status: 'Open', reporter: 'UX-Review', time: '2h ago' },
  { id: 'BUG-0039', title: 'Rate limiter false positive on batch exports', severity: 'HIGH', status: 'Resolved', reporter: 'Backend-Ops', time: '4h ago' },
  { id: 'BUG-0038', title: 'Notification badge count not resetting', severity: 'LOW', status: 'Resolved', reporter: 'User-Feedback', time: '6h ago' },
];

const TERMINAL_LOGS = [
  "[ERR] TypeError: Cannot read property 'coordinates' of undefined at MapView.tsx:142",
  "[WARN] API response latency exceeded threshold: 2400ms (limit: 2000ms)",
  "[ERR] CORS policy blocked request to api.trustvault.io/v2/fraud-alerts",
  "[INFO] Auto-retry initiated for failed batch operation #4821",
  "[ERR] WebSocket connection dropped — reconnecting in 3s...",
  "[WARN] Memory usage at 87% — garbage collection triggered",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

const getSeverityStyle = (severity: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    CRITICAL: { bg: 'rgba(239,68,68,0.1)', text: '#F87171', border: 'rgba(239,68,68,0.2)' },
    HIGH: { bg: 'rgba(245,158,11,0.1)', text: '#FBBF24', border: 'rgba(245,158,11,0.2)' },
    MEDIUM: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
    LOW: { bg: 'rgba(100,116,139,0.1)', text: '#94A3B8', border: 'rgba(100,116,139,0.2)' },
  };
  return map[severity] || map.LOW;
};

const getStatusStyle = (status: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    Open: { bg: 'rgba(239,68,68,0.1)', text: '#F87171' },
    'In Progress': { bg: 'rgba(245,158,11,0.1)', text: '#FBBF24' },
    Resolved: { bg: 'rgba(16,185,129,0.1)', text: '#34D399' },
  };
  return map[status] || map.Open;
};

export default function Bugs() {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Terminal log simulation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const newLogs = [...prev, TERMINAL_LOGS[index % TERMINAL_LOGS.length] + ` [${new Date().toISOString().slice(11, 19)}]`];
        return newLogs.slice(-6);
      });
      index++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setTimeout(() => {
      setSubmitted(true);
      addToast({ title: 'Bug Reported', message: 'Your report has been submitted to the engineering team.', type: 'success' });
      setTitle('');
      setDescription('');
      setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
    }, 800);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1">Bug Tracker</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#F87171', letterSpacing: '0.05em' }}>3 OPEN</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Centralized defect tracking, error frequency analysis, and system health diagnostics.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-ghost"
            style={{ border: '1px solid var(--border-strong)', borderRadius: '10px' }}
          >
            <Activity size={16} /> Diagnostics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ borderRadius: '10px' }}
            onClick={() => setShowForm(!showForm)}
          >
            <Bug size={16} /> Report Bug
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Open Bugs', value: '23', trend: '-12%', icon: <Bug size={20} />, color: '#EF4444' },
          { label: 'Avg Resolution', value: '4.2h', trend: '-28%', icon: <Clock size={20} />, color: '#10B981' },
          { label: 'Error Rate', value: '0.03%', trend: '-5%', icon: <AlertCircle size={20} />, color: '#F59E0B' },
          { label: 'System Health', value: '99.2%', trend: '+0.4%', icon: <Cpu size={20} />, color: '#3B82F6' },
        ].map((k, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: '20px 24px' }} whileHover={{ y: -3 }}>
            <div className="flex justify-between items-start mb-3">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${k.color}12`, border: `1px solid ${k.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color
              }}>{k.icon}</div>
              <span className="flex items-center gap-1" style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: 'rgba(16,185,129,0.1)', color: '#34D399'
              }}>
                <TrendingDown size={12} /> {k.trend}
              </span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{k.value}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Report Form (Collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="glass-card overflow-hidden"
            style={{ padding: 0 }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send size={16} style={{ color: '#3B82F6' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Submit New Bug Report</span>
              </div>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '6px' }}>Close</button>
            </div>
            <div style={{ padding: 24 }}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 size={48} style={{ color: '#34D399', marginBottom: 12 }} />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>Report Submitted</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Engineering team has been notified.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 200px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <FileText size={12} style={{ display: 'inline', marginRight: 6 }} />Bug Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Map visualization failing on mobile"
                        required
                        style={{
                          width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
                          borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: '0.85rem',
                          outline: 'none', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Priority</label>
                      <div className="flex gap-2">
                        {['low', 'medium', 'high', 'critical'].map(level => {
                          const colors: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#64748B' };
                          const c = colors[level];
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setPriority(level)}
                              style={{
                                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s',
                                border: priority === level ? `1px solid ${c}50` : '1px solid var(--border-subtle)',
                                background: priority === level ? `${c}15` : 'transparent',
                                color: priority === level ? c : 'var(--text-tertiary)',
                              }}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Steps to reproduce, expected vs actual behavior..."
                      rows={4}
                      required
                      style={{
                        width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
                        borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: '0.85rem',
                        outline: 'none', resize: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="btn btn-primary"
                      style={{ borderRadius: 10 }}
                    >
                      <Send size={16} /> Submit Report
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Row */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Error Frequency */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h3" style={{ marginBottom: 4 }}>Error Frequency</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>24-hour error distribution across services</p>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: 10, height: 3, borderRadius: 2, background: '#EF4444' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Errors</span>
            </div>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={errorFrequency}>
                <defs>
                  <linearGradient id="gradErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}
                  itemStyle={{ color: '#fff', fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8', fontSize: 11, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#gradErrors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 className="text-h3" style={{ marginBottom: 4 }}>Bug Categories</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>Distribution by defect type</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  itemStyle={{ color: '#fff', fontSize: 12 }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 400px' }}>
        {/* Recent Bugs Table */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
            <div>
              <h3 className="text-h3" style={{ marginBottom: 2 }}>Recent Bug Reports</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Latest defects across all modules</p>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px', border: '1px solid var(--border-strong)', borderRadius: '8px' }}>
              <Eye size={14} /> View All
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['ID', 'Title', 'Severity', 'Status', 'Reporter', 'Time'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBugs.map((bug, i) => {
                  const sevStyle = getSeverityStyle(bug.severity);
                  const statStyle = getStatusStyle(bug.status);
                  return (
                    <motion.tr
                      key={bug.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--brand-primary)', fontWeight: 600 }}>{bug.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 280 }}>{bug.title}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                          background: sevStyle.bg, color: sevStyle.text, border: `1px solid ${sevStyle.border}`,
                          letterSpacing: '0.04em',
                        }}>{bug.severity}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                          background: statStyle.bg, color: statStyle.text,
                        }}>{bug.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{bug.reporter}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{bug.time}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Live Error Terminal */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.3)' }} className="flex items-center gap-2">
            <Terminal size={14} style={{ color: '#EF4444' }} />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>LIVE_ERROR_STREAM</span>
            <div className="flex-1" />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 2s infinite' }} />
          </div>
          <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem' }} className="flex flex-col gap-2">
            <AnimatePresence>
              {terminalLogs.map((log, i) => (
                <motion.div
                  key={`${i}-${log.slice(-8)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: log.includes('[ERR]') ? '#F87171' : log.includes('[WARN]') ? '#FBBF24' : '#60A5FA',
                    lineHeight: 1.6,
                  }}
                >
                  &gt; {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="animate-pulse" style={{ color: 'var(--text-tertiary)' }}>&gt; _</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
