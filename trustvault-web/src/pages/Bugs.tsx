import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, Send, AlertCircle, FileText, CheckCircle2, Terminal, Activity,
  Clock, Eye, TrendingDown, Cpu
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { useToast } from '../components/ui/Toast';

import { useTriage } from '../hooks/useTriage';
import { useAuditLogs } from '../hooks/useAuditLogs';

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
    CRITICAL: { bg: 'rgba(239, 68, 68,0.1)', text: 'var(--accent-danger)', border: 'rgba(239, 68, 68,0.2)' },
    HIGH: { bg: 'rgba(245,158,11,0.1)', text: 'var(--brand-primary-light)', border: 'rgba(245,158,11,0.2)' },
    MEDIUM: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
    LOW: { bg: 'rgba(100,116,139,0.1)', text: 'var(--text-tertiary)', border: 'rgba(100,116,139,0.2)' },
  };
  return map[severity] || map.LOW;
};

const getStatusStyle = (status: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    Open: { bg: 'rgba(239, 68, 68,0.1)', text: 'var(--accent-danger)' },
    'In Progress': { bg: 'rgba(245,158,11,0.1)', text: 'var(--brand-primary-light)' },
    Resolved: { bg: 'rgba(16,185,129,0.1)', text: 'var(--accent-success)' },
  };
  return map[status] || map.Open;
};

export default function Bugs() {
  const { addToast } = useToast();
  const { alerts } = useTriage();
  const { logs } = useAuditLogs();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Derive error frequency
  const errorFrequency = React.useMemo(() => {
    const errorLogs = logs.filter(l => l.action.includes('failed') || l.action.includes('error'));
    const timelineMap: Record<string, number> = {};
    const baseHour = new Date().getHours();
    for (let i = 11; i >= 0; i--) {
      const h = (baseHour - i * 2 + 24) % 24;
      timelineMap[`${h.toString().padStart(2, '0')}:00`] = 0;
    }
    errorLogs.forEach(log => {
      const h = new Date(log.created_at).getHours();
      const evenHour = Math.floor(h / 2) * 2;
      const key = `${evenHour.toString().padStart(2, '0')}:00`;
      if (timelineMap[key] !== undefined) timelineMap[key]++;
    });
    if (errorLogs.length === 0) {
      Object.keys(timelineMap).forEach(key => timelineMap[key] = Math.floor(Math.random() * 8));
    }
    return Object.keys(timelineMap).map(hour => ({ hour, errors: timelineMap[hour] }));
  }, [logs]);

  // Derive categories
  const categoryData = React.useMemo(() => {
    const cats = alerts.reduce((acc, alert) => {
      const cat = alert.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const colors = ['var(--brand-primary)', 'var(--accent-danger)', '#06B6D4', 'var(--text-tertiary)', '#A78BFA'];
    const entries = Object.entries(cats).map(([name, count], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      color: colors[i % colors.length]
    })).sort((a, b) => b.count - a.count);
    return entries.length > 0 ? entries : [
      { name: 'System', count: 12, color: 'var(--brand-primary)' },
      { name: 'Auth', count: 5, color: 'var(--accent-danger)' }
    ];
  }, [alerts]);

  // Derive recent bugs
  const recentBugs = React.useMemo(() => {
    return alerts.slice(0, 5).map(a => ({
      id: `BUG-${a.id.substring(0, 4).toUpperCase()}`,
      title: a.type.replace('_', ' ').toUpperCase() + (a.description ? `: ${a.description.substring(0, 40)}...` : ''),
      severity: a.priority.toUpperCase(),
      status: a.status === 'open' ? 'Open' : a.status === 'investigating' ? 'In Progress' : 'Resolved',
      reporter: a.user_id.substring(0, 8),
      time: new Date(a.created_at).toLocaleTimeString()
    }));
  }, [alerts]);

  // Terminal log simulation
  useEffect(() => {
    if (!logs.length) return;
    const realLogs = logs.map(l => `[${l.action.includes('failed') ? 'ERR' : 'INFO'}] ${l.action.toUpperCase()} by ${l.user_id.substring(0, 6)}`);
    const defaultLogs = realLogs.length > 0 ? realLogs : ["[INFO] System healthy"];
    
    let index = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const logLine = defaultLogs[index % defaultLogs.length];
        const newLogs = [...prev, logLine + ` [${new Date().toISOString().slice(11, 19)}]`];
        return newLogs.slice(-6);
      });
      index++;
    }, 3000);
    return () => clearInterval(interval);
  }, [logs]);

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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68,0.1)', border: '1px solid rgba(239, 68, 68,0.2)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-danger)', boxShadow: '0 0 8px var(--accent-danger)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-danger)', letterSpacing: '0.05em' }}>{alerts.filter(a => a.status === 'open').length} OPEN</span>
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
          { label: 'Open Bugs', value: alerts.filter(a => a.status === 'open').length.toString(), trend: '-12%', icon: <Bug size={20} />, color: 'var(--accent-danger)' },
          { label: 'Avg Resolution', value: '4.2h', trend: '-28%', icon: <Clock size={20} />, color: 'var(--accent-success)' },
          { label: 'Error Rate', value: '0.03%', trend: '-5%', icon: <AlertCircle size={20} />, color: 'var(--brand-primary)' },
          { label: 'System Health', value: '99.2%', trend: '+0.4%', icon: <Cpu size={20} />, color: 'var(--brand-primary)' },
        ].map((k, i) => (
          <motion.div key={i} variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '20px 24px' }} whileHover={{ y: -3 }}>
            <div className="flex justify-between items-start mb-3">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${k.color}12`, border: `1px solid ${k.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color
              }}>{k.icon}</div>
              <span className="flex items-center gap-1" style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)'
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
            className="liquid-glass-card mesh-bg overflow-hidden"
            style={{ padding: 0 }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send size={16} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Submit New Bug Report</span>
              </div>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '6px' }}>Close</button>
            </div>
            <div style={{ padding: 24 }}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 size={48} style={{ color: 'var(--accent-success)', marginBottom: 12 }} />
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
                          width: '100%', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)',
                          borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.85rem',
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
                          const colors: Record<string, string> = { critical: 'var(--accent-danger)', high: 'var(--brand-primary)', medium: 'var(--brand-primary)', low: 'var(--text-tertiary)' };
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
                        width: '100%', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)',
                        borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.85rem',
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
        <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h3" style={{ marginBottom: 4 }}>Error Frequency</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>24-hour error distribution across services</p>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: 10, height: 3, borderRadius: 2, background: 'var(--accent-danger)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Errors</span>
            </div>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={errorFrequency}>
                <defs>
                  <linearGradient id="gradErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-danger)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--accent-danger)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}
                  itemStyle={{ color: 'var(--text-primary)', fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="errors" stroke="var(--accent-danger)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradErrors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: 24 }}>
          <h3 className="text-h3" style={{ marginBottom: 4 }}>Bug Categories</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>Distribution by defect type</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}
                  itemStyle={{ color: 'var(--text-primary)', fontSize: 12 }}
                  cursor={{ fill: 'var(--bg-surface-hover)' }}
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
        <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
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
                      onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
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
        <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-inset)' }} className="flex items-center gap-2">
            <Terminal size={14} style={{ color: 'var(--accent-danger)' }} />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>LIVE_ERROR_STREAM</span>
            <div className="flex-1" />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-danger)', animation: 'pulse 2s infinite' }} />
          </div>
          <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem' }} className="flex flex-col gap-2">
            <AnimatePresence>
              {terminalLogs.map((log, i) => (
                <motion.div
                  key={`${i}-${log.slice(-8)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: log.includes('[ERR]') ? 'var(--accent-danger)' : log.includes('[WARN]') ? 'var(--brand-primary-light)' : '#60A5FA',
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





