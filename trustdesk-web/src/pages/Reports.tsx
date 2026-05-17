import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Download, Calendar, Filter, TrendingUp, TrendingDown,
  FileText, Clock, Shield, AlertTriangle, ChevronDown, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

/* ---- Data ---- */
const monthlyTrend = [
  { month: 'Jan', alerts: 245, resolved: 231, sla: 94 },
  { month: 'Feb', alerts: 312, resolved: 298, sla: 95 },
  { month: 'Mar', alerts: 287, resolved: 271, sla: 94 },
  { month: 'Apr', alerts: 356, resolved: 341, sla: 96 },
  { month: 'May', alerts: 398, resolved: 389, sla: 98 },
  { month: 'Jun', alerts: 421, resolved: 412, sla: 98 },
  { month: 'Jul', alerts: 367, resolved: 358, sla: 98 },
  { month: 'Aug', alerts: 445, resolved: 436, sla: 98 },
  { month: 'Sep', alerts: 389, resolved: 381, sla: 98 },
  { month: 'Oct', alerts: 412, resolved: 405, sla: 98 },
  { month: 'Nov', alerts: 378, resolved: 372, sla: 98 },
  { month: 'Dec', alerts: 342, resolved: 338, sla: 99 },
];

const categoryBreakdown = [
  { category: 'Card Fraud', count: 487, color: '#EF4444' },
  { category: 'Wire Fraud', count: 312, color: '#F59E0B' },
  { category: 'ATO Attack', count: 256, color: '#8B5CF6' },
  { category: 'Identity Theft', count: 198, color: '#3B82F6' },
  { category: 'Phishing', count: 167, color: '#06B6D4' },
  { category: 'Chargeback Abuse', count: 445, color: '#64748B' },
  { category: 'Suspicious Transfer', count: 289, color: '#EC4899' },
];

const radarMetrics = [
  { metric: 'Detection', value: 92 },
  { metric: 'Response', value: 88 },
  { metric: 'Resolution', value: 95 },
  { metric: 'Prevention', value: 78 },
  { metric: 'Communication', value: 85 },
  { metric: 'Compliance', value: 97 },
];

const hourlyPattern = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  alerts: Math.floor(Math.random() * 15) + (i >= 8 && i <= 20 ? 10 : 2),
}));

const auditLog = [
  { id: 'RPT-001', title: 'Monthly Security Digest — November 2025', generated: '2025-12-01', pages: 24, status: 'Ready' },
  { id: 'RPT-002', title: 'Quarterly Fraud Analysis Q3 2025', generated: '2025-10-05', pages: 42, status: 'Ready' },
  { id: 'RPT-003', title: 'Annual Compliance Audit 2024', generated: '2025-01-15', pages: 68, status: 'Ready' },
  { id: 'RPT-004', title: 'Fire Safety Drill Assessment', generated: '2025-11-18', pages: 12, status: 'Draft' },
  { id: 'RPT-005', title: 'Wallet Fraud Risk Assessment', generated: '2025-11-22', pages: 36, status: 'Ready' },
];

const kpis = [
  { label: 'Total Fraud Alerts (YTD)', value: '4,352', trend: '+8.4%', up: true, icon: <AlertTriangle size={20} />, color: '#F59E0B' },
  { label: 'Avg Resolution Time', value: '12.3m', trend: '-18%', up: false, icon: <Clock size={20} />, color: '#10B981' },
  { label: 'SLA Compliance', value: '98.2%', trend: '+2.1%', up: false, icon: <Shield size={20} />, color: '#3B82F6' },
  { label: 'Reports Generated', value: '47', trend: '+12', up: true, icon: <FileText size={20} />, color: '#8B5CF6' },
];

const Reports: React.FC = () => {
  const [timeRange] = useState('12 Months');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-h1" style={{ marginBottom: 4 }}>Reports & Analytics</h1>
          <p className="text-sm">Comprehensive security intelligence and operational metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border-strong)', borderRadius: 10 }}>
            <Calendar size={16} /> {timeRange} <ChevronDown size={14} />
          </button>
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border-strong)', borderRadius: 10 }}>
            <Filter size={16} /> Filters
          </button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ borderRadius: 10 }}>
            <Download size={16} /> Export PDF
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: '20px 24px' }} whileHover={{ y: -3 }}>
            <div className="flex justify-between items-start mb-3">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${k.color}12`, border: `1px solid ${k.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color
              }}>{k.icon}</div>
              <span
                className="flex items-center gap-1"
                style={{
                  fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                  background: k.up ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                  color: k.up ? '#FBBF24' : '#34D399'
                }}
              >
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.trend}
              </span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{k.value}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Alert trend */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h3" style={{ marginBottom: 4 }}>Fraud Alert Volume Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Monthly fraud alerts vs. resolved, past 12 months</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 3, borderRadius: 2, background: '#3B82F6' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 3, borderRadius: 2, background: '#10B981' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Resolved</span>
              </div>
            </div>
          </div>
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="gradAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}
                  itemStyle={{ color: '#fff', fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8', fontSize: 11, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#gradResolved2)" />
                <Area type="monotone" dataKey="alerts" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#gradAlerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radar */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 className="text-h3" style={{ marginBottom: 4 }}>Operational Readiness</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>Performance across key dimensions</p>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarMetrics}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Category Breakdown */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 className="text-h3" style={{ marginBottom: 4 }}>Fraud Categories</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>Distribution by fraud type (YTD)</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  itemStyle={{ color: '#fff', fontSize: 12 }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hourly Pattern */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 className="text-h3" style={{ marginBottom: 4 }}>Hourly Activity Pattern</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>Average fraud alerts by hour of day</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyPattern}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} interval={3} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  itemStyle={{ color: '#fff', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="alerts" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Generated Reports Table */}
      <motion.div variants={itemVariants} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
          <div>
            <h3 className="text-h3" style={{ marginBottom: 2 }}>Generated Reports</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Previously generated security reports and analyses</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ borderRadius: 8, fontSize: '0.8rem', padding: '8px 16px' }}>
            <BarChart3 size={14} /> Generate New
          </motion.button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Report ID', 'Title', 'Generated', 'Pages', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLog.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--brand-primary)', fontWeight: 600 }}>{r.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 340 }}>{r.title}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.generated}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{r.pages}p</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                      background: r.status === 'Ready' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: r.status === 'Ready' ? '#34D399' : '#FBBF24',
                      border: `1px solid ${r.status === 'Ready' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div className="flex gap-2">
                      <button style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#64748B',
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem'
                      }}>
                        <Eye size={12} /> View
                      </button>
                      <button style={{
                        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
                        borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#60A5FA',
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem'
                      }}>
                        <Download size={12} /> PDF
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;
