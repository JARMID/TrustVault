import React, { useState, useEffect, useRef } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Shield, Zap, Send, BarChart3, Activity, Lock, Eye, Brain, ShieldCheck, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useToast } from '../components/ui/Toast';
import { ContainerScroll } from '../components/ui/ContainerScroll';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '../hooks/useWallet';

const StatCard: React.FC<{
  title: string; value: string | number | React.ReactNode; trend: string; trendUp: boolean;
  icon: React.ReactNode; variant?: 'danger' | 'warning' | 'primary' | 'success'; subtitle?: string;
  className?: string;
}> = ({ title, value, trend, trendUp, icon, variant = 'primary', subtitle, className }) => {
  const colors = {
    danger:  { bg: 'bg-[var(--accent-danger-bg)]',  color: 'text-[var(--accent-danger)]', border: 'border-[var(--accent-danger-glow)]', glow: 'rgba(239,68,68,0.2)' },
    warning: { bg: 'bg-[var(--accent-warning-bg)]', color: 'text-[var(--accent-warning)]', border: 'border-[var(--accent-warning-glow)]', glow: 'rgba(249,115,22,0.2)' },
    success: { bg: 'bg-[var(--accent-success-bg)]', color: 'text-[var(--accent-success)]', border: 'border-[var(--accent-success-glow)]', glow: 'rgba(16,185,129,0.2)' },
    primary: { bg: 'bg-[var(--brand-primary-bg)]',  color: 'text-[var(--brand-primary)]', border: 'border-[var(--brand-primary-glow)]', glow: 'rgba(59,130,246,0.2)' },
  }[variant];

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({ x: ((y / rect.height) - 0.5) * -10, y: ((x / rect.width) - 0.5) * 10 });
  };

  return (
    <div 
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div 
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: tilt.x ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-[24px] p-6 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-shadow duration-300 group cursor-pointer ${className} dashboard-stat-card relative overflow-hidden preserve-3d`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex justify-between items-start mb-4 relative z-10" style={{ transform: 'translateZ(10px)' }}>
          <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.color} transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-[var(--accent-success-bg)] text-[var(--accent-success)] border border-[var(--accent-success-glow)]' : 'bg-[var(--accent-danger-bg)] text-[var(--accent-danger)] border border-[var(--accent-danger-glow)]'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trend}
          </div>
        </div>
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          <h3 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-1">{value}</h3>
          <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
          {subtitle && <p className="text-xs text-[var(--text-tertiary)] mt-2 font-medium">{subtitle}</p>}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Custom CSS Vault Card (Replaces Spline) ── */
const VaultCard: React.FC = () => {
  return (
    <div className="w-full h-[220px] rounded-[24px] overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(0,198,174,0.3)] group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C6AE] to-[#0072FF] transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 shadow-sm">
            <Lock size={12} className="text-white" />
            <span className="text-[0.65rem] text-white font-mono tracking-[0.15em] font-bold">AES-256 SECURED</span>
          </div>
          <ShieldCheck size={24} className="text-white opacity-80" />
        </div>
        
        <div>
          <h4 className="text-white/80 text-sm font-semibold mb-1 uppercase tracking-widest">Main Vault</h4>
          <p className="text-white text-2xl font-mono font-bold tracking-widest">•••• •••• •••• 4092</p>
        </div>
      </div>
    </div>
  );
};

/* ── Clean Map Visual (Replaces R3F Globe) ── */
const CSSMapTracker: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(var(--border-subtle)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <Globe size={400} className="text-[var(--border-subtle)] absolute -right-20 top-0 rotate-12" strokeWidth={0.5} />
      <div className="relative z-10 flex flex-col items-center justify-center">
         <div className="w-4 h-4 rounded-full bg-[#00C6AE] animate-ping absolute" />
         <div className="w-4 h-4 rounded-full bg-[#00C6AE] border-2 border-white shadow-md relative z-10" />
         <div className="mt-4 px-4 py-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[var(--text-secondary)]">Algiers Node Active</span>
         </div>
      </div>
    </div>
  );
};

/* ── Main Dashboard ── */
const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { wallets, transactions, totalBalance, isLoading } = useWallet();
  const [pendingTxn, setPendingTxn] = useState(7);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const computedPortfolioData = React.useMemo(() => {
    if (!wallets || wallets.length === 0) return [];
    return [
      { name: 'Savings', value: wallets.filter(w => w.type === 'savings').reduce((acc, w) => acc + w.balance, 0), color: '#00C6AE' },
      { name: 'Checking', value: wallets.filter(w => w.type === 'checking').reduce((acc, w) => acc + w.balance, 0), color: '#0072FF' },
      { name: 'Investments', value: wallets.filter(w => w.type === 'investment').reduce((acc, w) => acc + w.balance, 0), color: '#10B981' },
      { name: 'Crypto', value: wallets.filter(w => w.type === 'crypto').reduce((acc, w) => acc + w.balance, 0), color: '#F59E0B' },
    ].filter(x => x.value > 0);
  }, [wallets]);

  const computedRecentTransactions = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.slice(0, 6).map(t => {
      let timeStr = 'Recently';
      try {
        const diff = Date.now() - new Date(t.created_at).getTime();
        if (diff < 3600000) timeStr = `${Math.floor(diff / 60000)} min ago`;
        else if (diff < 86400000) timeStr = `${Math.floor(diff / 3600000)}h ago`;
        else timeStr = `${Math.floor(diff / 86400000)}d ago`;
      } catch { }
      return {
        id: t.id, type: (t.description && t.description.split('—')[0]) || t.type, recipient: t.counterparty || 'Unknown',
        amount: t.amount, currency: t.currency, time: timeStr, status: t.status
      };
    });
  }, [transactions]);
  
  const computedTimeline = React.useMemo(() => {
    const timeline: Record<string, { volume: number, flagged: number, approved: number }> = {};
    const todayStr = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 24; i += 2) timeline[`${i.toString().padStart(2, '0')}:00`] = { volume: 0, flagged: 0, approved: 0 };
    transactions.filter(t => t.created_at.startsWith(todayStr)).forEach(t => {
      const d = new Date(t.created_at);
      const hour = Math.floor(d.getHours() / 2) * 2;
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      if (timeline[hourStr]) {
        const amt = Math.abs(t.amount);
        timeline[hourStr].volume += amt;
        if (t.status === 'failed' || t.status === 'cancelled') timeline[hourStr].flagged += 1;
        else timeline[hourStr].approved += amt;
      }
    });
    return Object.keys(timeline).map(time => ({ time, ...timeline[time] }));
  }, [transactions]);

  const computedForecastData = React.useMemo(() => {
    let currentBalance = totalBalance;
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      currentBalance += Math.random() * 5000 - 1500;
      forecast.push({ day: i.toString(), balance: currentBalance });
    }
    return forecast;
  }, [totalBalance]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.7) setPendingTxn(p => Math.max(0, p + (Math.random() > 0.5 ? 1 : -1)));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div ref={dashboardRef} className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">
      <div className="max-w-[1440px] mx-auto pb-10 relative z-10 px-6 xl:px-0">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">Wallet Overview</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-success-bg)] border border-[var(--accent-success-glow)]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
                <span className="text-xs font-bold text-[var(--accent-success)] tracking-widest uppercase">LIVE</span>
              </div>
            </div>
            <p className="text-[0.95rem] text-[var(--text-secondary)] max-w-lg leading-relaxed font-medium">Monitor balances, track transactions, and analyze account health across all linked portfolios.</p>
          </div>
          
          <div className="flex gap-4 items-center w-full lg:w-auto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/app/device-trust')}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer hover:border-[#00C6AE]/50 hover:shadow-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-subtle)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="25.12" strokeLinecap="round" />
                </svg>
                <ShieldCheck size={14} className="absolute text-[var(--accent-success)]" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">Account Health</div>
                <div className="text-xs font-bold text-[var(--accent-success)]">90/100 • Optimal</div>
              </div>
            </motion.div>

            <button className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] border border-transparent transition-all active:scale-95" onClick={() => addToast({ type: 'success', title: 'Statement Generating', message: 'Your comprehensive account statement is being compiled securely.' })}>
              <BarChart3 size={18} /> Export
            </button>
          </div>
        </div>

        {/* Bento Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Vault Balance" value={isLoading ? <Skeleton className="w-24 h-8" /> : `${totalBalance.toLocaleString()} DZD`} trend="+12.4%" trendUp icon={<Wallet size={24} />} variant="primary" subtitle="Across all linked accounts" />
          <StatCard title="Today's Transactions" value={isLoading ? <Skeleton className="w-12 h-8" /> : transactions.length.toString()} trend="+8.1%" trendUp icon={<Send size={24} />} variant="success" subtitle={`${pendingTxn} pending approval`} />
          <StatCard title="Processing Speed" value="1.2s" trend="-15%" trendUp icon={<Zap size={24} />} variant="warning" subtitle="Optimal latency achieved ✓" />
          <StatCard title="Active Investments" value="3" trend="+5.2%" trendUp icon={<Shield size={24} />} variant="primary" subtitle="Yielding portfolios" />
        </div>

        {/* Threat Intelligence Card */}
        <div className="dashboard-section mb-12 rounded-[28px] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm relative h-[450px]">
          <div className="absolute top-8 left-8 z-20 pointer-events-none">
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Global Transaction Network</h3>
            <p className="text-sm font-medium text-[var(--text-secondary)] max-w-sm">Live monitoring of cross-border transfers and payment routing. AI automatically optimizes settlement speeds.</p>
          </div>
          <CSSMapTracker />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6 mb-12">
          
          <div className="dashboard-section bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold mb-1 text-[var(--text-primary)]">Transaction Volume</h3>
                <p className="text-sm font-medium text-[var(--text-secondary)]">24-hour transaction flow across all channels</p>
              </div>
              <div className="flex gap-5 items-center px-4 py-2 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
                {[{ label: 'Approved', color: '#00C6AE' }, { label: 'Volume', color: '#0072FF' }, { label: 'Flagged', color: '#EF4444' }].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                    <div style={{ background: l.color }} className="w-3 h-1.5 rounded-sm" />
                    <span className="text-xs text-[var(--text-secondary)] font-bold">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={computedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0072FF" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0072FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C6AE" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#00C6AE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }} labelStyle={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }} />
                  <Area type="monotone" dataKey="approved" stroke="#00C6AE" strokeWidth={3} fillOpacity={1} fill="url(#gradApproved)" activeDot={{ r: 6, fill: '#00C6AE', stroke: 'var(--bg-surface)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="volume" stroke="#0072FF" strokeWidth={3} fillOpacity={1} fill="url(#gradVol)" activeDot={{ r: 6, fill: '#0072FF', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="flagged" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="dashboard-section bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] p-6 shadow-sm flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Portfolio Distribution</h3>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-6">Asset allocation across connected accounts</p>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="h-[200px] w-full relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Total Value</span>
                    <span className="text-xl font-extrabold text-[var(--text-primary)]">{totalBalance > 0 ? `${totalBalance.toLocaleString()}` : '0.00'}</span>
                  </div>
                  {computedPortfolioData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={computedPortfolioData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={8}>
                          {computedPortfolioData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }} formatter={(value: unknown) => `${Number(value).toLocaleString()} DZD`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-4 border-[var(--border-subtle)] rounded-full" style={{ width: '160px', height: '160px', margin: 'auto' }}>
                      <p className="text-xs font-bold text-[var(--text-tertiary)]">No Data</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              className="dashboard-section bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] p-5 cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden flex justify-between items-center"
              onClick={() => navigate('/app/ai-insights')}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Cash Flow</h3>
                  <p className="text-xs text-purple-500 font-extrabold mt-1">→ Next 30 days: +12,400 DZD</p>
                </div>
              </div>
              <div className="w-24 h-12 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={computedForecastData}>
                    <Line type="monotone" dataKey="balance" stroke="#9333ea" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          
          <div className="dashboard-section bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
            <div className="px-8 py-6 border-b border-[var(--border-subtle)] bg-[var(--bg-inset)] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-1 text-[var(--text-primary)]">Recent Transactions</h3>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Latest account activity and transfers</p>
              </div>
              <button className="bg-transparent border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs py-2 px-4 rounded-xl font-bold hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors shadow-sm flex items-center gap-2">
                <Eye size={16} /> View All
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <AnimatePresence>
                {computedRecentTransactions.length > 0 ? computedRecentTransactions.map(txn => (
                  <motion.div key={txn.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] cursor-pointer rounded-xl transition-all duration-200 hover:bg-[var(--bg-surface-hover)] hover:translate-x-1 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${txn.amount > 0 ? 'bg-[var(--accent-success-bg)] text-[var(--accent-success)] border-[var(--accent-success-glow)]' : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-subtle)]'}`}>
                        {txn.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-[0.95rem] font-bold text-[var(--text-primary)] leading-tight mb-1">{txn.type}</p>
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{txn.recipient}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[1.05rem] font-bold font-mono mb-1 ${txn.amount > 0 ? 'text-[var(--accent-success)]' : 'text-[var(--text-primary)]'}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} <span className="text-xs text-[var(--text-secondary)] font-medium">{txn.currency}</span>
                      </p>
                      <div className="flex items-center gap-1 justify-end text-xs text-[var(--text-secondary)] font-bold">
                        <Zap size={14} className="text-[var(--brand-primary)]" /> 12ms Response
                        {txn.status === 'pending' && <span className="ml-2 text-[var(--accent-warning)] font-extrabold bg-[var(--accent-warning-bg)] border border-[var(--accent-warning-glow)] px-2 py-0.5 rounded-md">PENDING</span>}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-inset)] flex items-center justify-center mb-4 border border-[var(--border-subtle)]">
                      <Send size={24} className="text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">No transactions yet</p>
                    <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">Your recent activity will appear here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="dashboard-section">
              <VaultCard />
            </div>

            <div className="dashboard-section bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-[24px] p-6 flex-1">
              <h3 className="text-lg font-bold mb-5 text-[var(--text-primary)]">System Status</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Service Uptime', value: '99.99%', icon: <Shield size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                  { label: 'Smart Contracts', value: 'Active', icon: <Lock size={16} />, color: 'text-[var(--accent-success)]', bg: 'bg-[var(--accent-success-bg)]', border: 'border-[var(--accent-success-glow)]' },
                  { label: 'Pending Queue', value: `${pendingTxn} txns`, icon: <Activity size={16} className="animate-pulse" />, color: 'text-[var(--accent-warning)]', bg: 'bg-[var(--accent-warning-bg)]', border: 'border-[var(--accent-warning-glow)]' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between px-4 py-3.5 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${m.color} ${m.bg} ${m.border} border`}>{m.icon}</div>
                      <span className="text-sm text-[var(--text-primary)] font-bold">{m.label}</span>
                    </div>
                    <span className={`text-sm font-extrabold font-mono ${m.color}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section w-full mt-12 mb-20">
          <ContainerScroll
            titleComponent={
              <div className="mb-6">
                <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-2">Deep Dive Analytics</h2>
                <p className="text-[0.95rem] font-medium text-[var(--text-secondary)]">Scroll to reveal full portfolio intelligence and threat landscape</p>
              </div>
            }
          >
            <div className="p-8 h-full w-full flex flex-col justify-between bg-[var(--bg-surface)]">
               <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-6 mb-6">
                 <div>
                   <h3 className="text-2xl text-[var(--text-primary)] font-extrabold tracking-tight">Compliance & Verification</h3>
                   <p className="text-sm font-bold text-[var(--brand-primary)] mt-1">Real-time regulatory compliance</p>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-[var(--accent-success-bg)] flex items-center justify-center border border-[var(--accent-success-glow)] shadow-sm">
                   <ShieldCheck className="text-[var(--accent-success)]" size={28} />
                 </div>
               </div>
               
               <div className="flex-1 grid grid-cols-2 gap-8 items-center justify-center p-6">
                  <div className="space-y-6">
                    {['Automated AML Screening', 'KYC Checks Verified', 'Smart Contract Audited'].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 bg-[var(--bg-inset)] p-4 rounded-xl border border-[var(--border-subtle)]">
                        <Lock className="text-[#00C6AE]" size={20} />
                        <span className="text-sm text-[var(--text-primary)] font-bold font-mono">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-3xl flex items-center justify-center p-8 shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                     <p className="text-center text-sm font-mono text-emerald-400 max-w-xs font-bold leading-relaxed relative z-10">AI Compliance Matrix Active. All operations pass regulatory checkpoints.</p>
                  </div>
               </div>
            </div>
          </ContainerScroll>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
