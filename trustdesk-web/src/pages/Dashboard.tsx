import React, { useState, useEffect, useRef } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Shield, Zap, Send, BarChart3, Activity, Lock, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useToast } from '../components/ui/Toast';
import { SplineSceneBasic } from '../components/ui/SplineSceneBasic';

import { useWallet } from '../hooks/useWallet';

/* â”€â”€ Stat Card (Bento Design) â”€â”€ */
const StatCard: React.FC<{
  title: string; value: string | number; trend: string; trendUp: boolean;
  icon: React.ReactNode; variant?: 'danger' | 'warning' | 'primary' | 'success'; subtitle?: string;
  className?: string;
}> = ({ title, value, trend, trendUp, icon, variant = 'primary', subtitle, className }) => {
  const colors = {
    danger:  { bg: 'var(--accent-danger-bg)',  color: 'var(--accent-danger)', glow: 'var(--accent-danger-glow)' },
    warning: { bg: 'var(--accent-warning-bg)', color: 'var(--accent-warning)', glow: 'var(--accent-warning-glow)' },
    success: { bg: 'var(--accent-success-bg)', color: 'var(--accent-success)', glow: 'var(--accent-success-glow)' },
    primary: { bg: 'var(--brand-primary-bg)',  color: 'var(--brand-primary)', glow: 'var(--brand-primary-glow)' },
  }[variant];

  return (
    <div className={`liquid-glass-card group cursor-pointer ${className} dashboard-stat-card`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, transparent 100%)`, transitionDuration: '500ms' }}/>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: colors.bg, border: `1px solid ${colors.glow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.color, boxShadow: `0 4px 20px ${colors.glow}` }}>{icon}</div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
          style={{ background: trendUp ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)', color: trendUp ? 'var(--accent-success)' : 'var(--accent-danger)', border: `1px solid ${trendUp ? 'var(--accent-success-glow)' : 'var(--accent-danger-glow)'}` }}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{trend}
        </div>
      </div>
      <h3 className="text-h2 relative z-10 font-display font-semibold text-white tracking-tight leading-tight mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-400 relative z-10">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-2 font-mono relative z-10">{subtitle}</p>}
    </div>
  );
};

/* â”€â”€ Virtual Card Widget â”€â”€ */
const VaultCard: React.FC = () => (
  <div className="liquid-glass-card p-0 overflow-hidden relative min-h-[220px] flex flex-col justify-between" style={{ padding: '28px' }}>
    <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary to-brand-primary opacity-20 pointer-events-none" />
    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgba(0, 198, 174,0.15)_50%,transparent_100%)] animate-[spin_15s_linear_infinite] pointer-events-none" />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
        <Lock size={12} className="text-brand-primary" />
        <span className="text-[0.65rem] text-brand-primary font-mono tracking-[0.15em] font-bold">AES-256 SECURED</span>
      </div>
      <div className="w-[42px] h-[30px] rounded-md bg-gradient-to-br from-teal-300 via-teal-500 to-teal-700 opacity-90 shadow-[0_2px_10px_rgba(0,198,174,0.3)]" />
    </div>
    
    <div className="relative z-10 mt-6">
      <div className="text-[1.25rem] font-mono tracking-[0.2em] text-white/70 mb-6 drop-shadow-md">
        <span className="opacity-40">â€¢â€¢â€¢â€¢</span> <span className="opacity-40">â€¢â€¢â€¢â€¢</span> <span className="opacity-40">â€¢â€¢â€¢â€¢</span> <span className="opacity-100 text-white">4829</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-[0.6rem] text-slate-400 uppercase tracking-[0.15em] mb-1">Card Holder</div>
          <div className="text-[0.9rem] font-semibold text-white tracking-wider">VAULT ADMIN</div>
        </div>
        <div className="text-center">
          <div className="text-[0.6rem] text-slate-400 uppercase tracking-[0.15em] mb-1">Expires</div>
          <div className="text-[0.9rem] font-semibold text-white">09/28</div>
        </div>
        <div className="text-[1.2rem] font-extrabold italic text-white tracking-tighter drop-shadow-lg">VISA</div>
      </div>
    </div>
  </div>
);

/* â”€â”€ Main Dashboard â”€â”€ */
const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { wallets, transactions, totalBalance, isLoading } = useWallet();
  const [pendingTxn, setPendingTxn] = useState(7);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const computedPortfolioData = React.useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return [
        { name: 'Savings', value: 45200, color: 'var(--brand-secondary-light)' },
        { name: 'Checking', value: 28100, color: 'var(--brand-primary-light)' },
        { name: 'Investments', value: 18700, color: 'var(--accent-success)' },
        { name: 'Crypto', value: 8000, color: 'var(--accent-warning)' },
      ];
    }
    return [
      { name: 'Savings', value: wallets.filter(w => w.type === 'savings').reduce((acc, w) => acc + w.balance, 0), color: 'var(--brand-secondary-light)' },
      { name: 'Checking', value: wallets.filter(w => w.type === 'checking').reduce((acc, w) => acc + w.balance, 0), color: 'var(--brand-primary-light)' },
      { name: 'Investments', value: wallets.filter(w => w.type === 'investment').reduce((acc, w) => acc + w.balance, 0), color: 'var(--accent-success)' },
      { name: 'Crypto', value: wallets.filter(w => w.type === 'crypto').reduce((acc, w) => acc + w.balance, 0), color: 'var(--accent-warning)' },
    ].filter(x => x.value > 0);
  }, [wallets]);

  const computedRecentTransactions = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [
        { id: 'TXN-8401', type: 'P2P Transfer', recipient: 'Ahmed B.', amount: -2500, currency: 'DZD', time: '3 min ago', status: 'completed' },
        { id: 'TXN-8400', type: 'Card Payment', recipient: 'Carrefour Alger', amount: -8750, currency: 'DZD', time: '18 min ago', status: 'completed' },
        { id: 'TXN-8399', type: 'Deposit', recipient: 'Salary Transfer', amount: 145000, currency: 'DZD', time: '2 hrs ago', status: 'completed' },
        { id: 'TXN-8398', type: 'Wire Transfer', recipient: 'International', amount: -42000, currency: 'DZD', time: '5 hrs ago', status: 'pending' },
      ];
    }
    return transactions.slice(0, 6).map(t => {
      let timeStr = 'Recently';
      try {
        const diff = Date.now() - new Date(t.created_at).getTime();
        if (diff < 3600000) timeStr = `${Math.floor(diff / 60000)} min ago`;
        else if (diff < 86400000) timeStr = `${Math.floor(diff / 3600000)}h ago`;
        else timeStr = `${Math.floor(diff / 86400000)}d ago`;
      } catch (e) {}
      
      return {
        id: t.id,
        type: t.description.split('â€”')[0] || t.type,
        recipient: t.counterparty || 'Unknown',
        amount: t.amount,
        currency: t.currency,
        time: timeStr,
        status: t.status
      };
    });
  }, [transactions]);
  
  const transactionTimeline = [
    { time: '00:00', volume: 12400, flagged: 1, approved: 11800 },
    { time: '04:00', volume: 5200, flagged: 0, approved: 5100 },
    { time: '08:00', volume: 28600, flagged: 3, approved: 27200 },
    { time: '10:00', volume: 45100, flagged: 5, approved: 43500 },
    { time: '12:00', volume: 38700, flagged: 2, approved: 37800 },
    { time: '14:00', volume: 52300, flagged: 4, approved: 50100 },
    { time: '16:00', volume: 41200, flagged: 3, approved: 39800 },
    { time: '18:00', volume: 61500, flagged: 7, approved: 58200 },
    { time: '20:00', volume: 33400, flagged: 2, approved: 32100 },
    { time: '22:00', volume: 18900, flagged: 1, approved: 18200 },
  ];

  const weeklySpending = [
    { day: 'Mon', amount: 4200 },
    { day: 'Tue', amount: 3800 },
    { day: 'Wed', amount: 8500 },
    { day: 'Thu', amount: 2700 },
    { day: 'Fri', amount: 12600 },
    { day: 'Sat', amount: 6100 },
    { day: 'Sun', amount: 1900 },
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.7) setPendingTxn(p => Math.max(0, p + (Math.random() > 0.5 ? 1 : -1)));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // GSAP Stagger Animation for Data Metrics Load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-stat-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
      gsap.from('.dashboard-section', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.4
      });
    }, dashboardRef);
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div ref={dashboardRef} className="relative mesh-bg min-h-screen">
      <div className="max-w-[1440px] mx-auto pb-10 relative z-10 px-8 pt-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-h1 gradient-text">Wallet Overview</h1>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-success-bg border border-accent-success-glow">
                <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                <span className="text-xs font-bold text-accent-success tracking-widest uppercase">LIVE</span>
              </div>
            </div>
            <p className="text-base text-slate-400 max-w-lg leading-relaxed">Monitor balances, track transactions, and analyze account health across all linked portfolios.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline rounded-xl font-semibold">
              <Clock size={18} /> Last 24h
            </button>
            <button className="btn btn-accent rounded-xl"
              onClick={() => addToast({ type: 'success', title: 'Statement Generating', message: 'Your comprehensive account statement is being compiled securely.' })}>
              <BarChart3 size={18} /> Export Statement
            </button>
          </div>
        </div>

        {/* Bento Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Vault Balance" value={isLoading ? '...' : `${totalBalance.toLocaleString()} DZD`} trend="+12.4%" trendUp icon={<Wallet size={24} />} variant="primary" subtitle="Across all linked accounts" />
          <StatCard title="Today's Transactions" value={isLoading ? '...' : '14'} trend="+8.1%" trendUp icon={<Send size={24} />} variant="success" subtitle={`${pendingTxn} pending approval`} />
          <StatCard title="Processing Speed" value="1.2s" trend="-15%" trendUp icon={<Zap size={24} />} variant="warning" subtitle="Optimal latency achieved âœ“" />
          <StatCard title="Flagged Activity" value="3" trend="-40%" trendUp icon={<Shield size={24} />} variant="danger" subtitle="Auto-blocked by AI" />
        </div>

        {/* 3D Security Card (Full width bento span) */}
        <div className="dashboard-section mb-12 rounded-3xl overflow-hidden border border-white/5 shadow-diffusion liquid-glass">
          <SplineSceneBasic />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-12">
          
          {/* Transaction Volume */}
          <div className="dashboard-section liquid-glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-h2 mb-2 text-white">Transaction Volume</h3>
                <p className="text-sm text-slate-400">24-hour transaction flow across all channels</p>
              </div>
              <div className="flex gap-5 items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                {[{ label: 'Approved', color: 'var(--brand-primary-light)' }, { label: 'Volume', color: 'var(--brand-secondary-light)' }, { label: 'Flagged', color: 'var(--accent-danger)' }].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                    <div style={{ background: l.color }} className="w-3 h-1 rounded-sm" />
                    <span className="text-xs text-slate-400 font-medium">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={transactionTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-secondary-light)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--brand-secondary-light)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary-light)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--brand-primary-light)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '12px', boxShadow: 'var(--shadow-diffusion)' }} itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }} labelStyle={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }} />
                  <Area type="monotone" dataKey="approved" stroke="var(--brand-primary-light)" strokeWidth={3} fillOpacity={1} fill="url(#gradApproved)" activeDot={{ r: 6, fill: 'var(--brand-primary-light)', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="volume" stroke="var(--brand-secondary-light)" strokeWidth={3} fillOpacity={1} fill="url(#gradVol)" activeDot={{ r: 6, fill: 'var(--brand-secondary-light)', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="flagged" stroke="var(--accent-danger)" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Breakdown */}
          <div className="dashboard-section liquid-glass-card p-8">
            <h3 className="text-h2 mb-2 text-white">Portfolio Distribution</h3>
            <p className="text-sm text-slate-400 mb-8">Asset allocation across connected accounts</p>
            <div className="h-[200px] w-full relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Total Value</span>
                <span className="text-2xl font-bold text-white font-mono">100k+</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={computedPortfolioData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={6}>
                    {computedPortfolioData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}40)` }} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', boxShadow: 'var(--shadow-lg)' }} itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }} formatter={(value: any) => `${Number(value).toLocaleString()} DZD`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              {computedPortfolioData.map(item => (
                <div key={item.name} className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                    <span className="text-sm text-white font-medium">{item.name}</span>
                  </div>
                  <span className="text-base font-bold font-mono text-white">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          
          {/* Recent Transactions */}
          <div className="dashboard-section liquid-glass-card p-0 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-h2 mb-1 text-white">Recent Transactions</h3>
                <p className="text-sm text-slate-400">Latest account activity and transfers</p>
              </div>
              <button className="btn btn-outline text-xs py-2 px-4 rounded-xl font-semibold">
                <Eye size={16} /> View All
              </button>
            </div>
            <div className="p-4">
              <AnimatePresence>
                {computedRecentTransactions.map(txn => (
                  <motion.div key={txn.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer rounded-xl transition-all duration-200 hover:bg-white/5 hover:translate-x-1 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${txn.amount > 0 ? 'bg-accent-success-bg text-accent-success border-accent-success-glow' : 'bg-brand-primary-bg text-brand-primary border-brand-primary-glow'}`}>
                        {txn.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white leading-tight mb-1">{txn.type}</p>
                        <p className="text-xs text-slate-400">{txn.recipient}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold font-mono mb-1 ${txn.amount > 0 ? 'text-accent-success' : 'text-white'}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{txn.currency}</span>
                      </p>
                      <div className="flex items-center gap-1 justify-end text-xs text-slate-500 font-medium">
                        <Clock size={11} /> {txn.time}
                        {txn.status === 'pending' && <span className="ml-2 text-accent-warning font-bold bg-accent-warning-bg px-1.5 py-0.5 rounded">PENDING</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Virtual Card */}
            <div className="dashboard-section">
              <VaultCard />
            </div>

            {/* Weekly Spending */}
            <div className="dashboard-section liquid-glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white">Weekly Spending</h3>
                  <p className="text-xs text-slate-400">Daily expenditure (DZD)</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <BarChart3 size={16} className="text-brand-primary" />
                </div>
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySpending} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Bar dataKey="amount" radius={[6, 6, 2, 2]}>
                      {weeklySpending.map((_, i) => <Cell key={`cell-${i}`} fill={i === 4 ? 'var(--brand-primary-light)' : 'rgba(255,255,255,0.05)'} />)}
                    </Bar>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }} dy={8} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '10px' }} itemStyle={{ color: 'var(--brand-primary-light)', fontWeight: 600 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Account Health */}
            <div className="dashboard-section liquid-glass-card p-6">
              <h3 className="text-lg font-semibold mb-5 text-white">Account Health</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Service Uptime', value: '99.99%', icon: <Shield size={16} />, color: 'var(--brand-primary-light)', bg: 'var(--brand-primary-bg)' },
                  { label: 'Security Status', value: 'Active', icon: <Lock size={16} />, color: 'var(--accent-success)', bg: 'var(--accent-success-bg)' },
                  { label: 'Pending Queue', value: `${pendingTxn} txns`, icon: <Activity size={16} className="animate-pulse" />, color: 'var(--accent-warning)', bg: 'var(--accent-warning-bg)' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between px-4 py-3.5 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg" style={{ color: m.color, background: m.bg }}>{m.icon}</div>
                      <span className="text-sm text-white font-medium">{m.label}</span>
                    </div>
                    <span className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;





