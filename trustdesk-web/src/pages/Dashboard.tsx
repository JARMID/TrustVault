import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Clock, Shield, TrendingUp, Zap, Send, BarChart3, Activity, Lock, Eye, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ui/Toast';

import { useWallet } from '../hooks/useWallet';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

/* ── Stat Card ── */
const StatCard: React.FC<{
  title: string; value: string | number; trend: string; trendUp: boolean;
  icon: React.ReactNode; variant?: 'danger' | 'warning' | 'primary' | 'success'; subtitle?: string;
}> = ({ title, value, trend, trendUp, icon, variant = 'primary', subtitle }) => {
  const colors = {
    danger:  { bg: 'rgba(239,68,68,0.08)',  color: '#EF4444', glow: 'rgba(239,68,68,0.2)' },
    warning: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', glow: 'rgba(245,158,11,0.2)' },
    success: { bg: 'rgba(16,185,129,0.08)', color: '#10B981', glow: 'rgba(16,185,129,0.2)' },
    primary: { bg: 'rgba(0,198,174,0.08)',  color: '#00C6AE', glow: 'rgba(0,198,174,0.2)' },
  }[variant];

  return (
    <motion.div variants={itemVariants} className="glass-card relative overflow-hidden group cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ padding: '24px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, transparent 100%)`, transitionDuration: '500ms' }}/>
      <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" style={{ background: `radial-gradient(circle, ${colors.color}, transparent 70%)`, transitionDuration: '500ms', transform: 'translate(20%, -20%)' }}/>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: colors.bg, border: `1px solid ${colors.glow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.color, boxShadow: `0 4px 20px ${colors.glow}` }}>{icon}</div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shadow-sm"
          style={{ background: trendUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: trendUp ? '#34D399' : '#F87171', border: `1px solid ${trendUp ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{trend}
        </div>
      </div>
      <h3 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }} className="relative z-10">{value}</h3>
      <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }} className="relative z-10">{title}</p>
      {subtitle && <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px', fontFamily: 'var(--font-mono)' }} className="relative z-10">{subtitle}</p>}
    </motion.div>
  );
};

/* ── Virtual Card Widget ── */
const VaultCard: React.FC = () => (
  <motion.div variants={itemVariants} style={{
    background: 'linear-gradient(135deg, #0B1121 0%, #162444 50%, #0F172A 100%)',
    borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    position: 'relative', overflow: 'hidden', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
  }}>
    <div style={{
      position: 'absolute', top: 0, left: '-50%', width: '200%', height: '100%',
      background: 'linear-gradient(to bottom right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)',
      transform: 'rotate(-15deg) translateY(-20%)', pointerEvents: 'none'
    }} />
    <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(0,198,174,0.05) 50%, transparent 100%)', animation: 'spin 15s linear infinite', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(212,168,83,0.08), transparent 70%)', pointerEvents: 'none' }} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
        <Lock size={12} style={{ color: '#00C6AE' }} />
        <span style={{ fontSize: '0.65rem', color: '#00C6AE', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', fontWeight: 600 }}>AES-256 SECURED</span>
      </div>
      <div style={{ width: '42px', height: '30px', borderRadius: '6px', background: 'linear-gradient(135deg, #FCD34D, #B45309, #F59E0B)', opacity: 0.9, boxShadow: '0 2px 10px rgba(245,158,11,0.3)' }} />
    </div>
    
    <div className="relative z-10 mt-6">
      <div style={{ fontSize: '1.25rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        <span style={{ opacity: 0.4 }}>••••</span> <span style={{ opacity: 0.4 }}>••••</span> <span style={{ opacity: 0.4 }}>••••</span> <span style={{ opacity: 1, color: 'white' }}>4829</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Card Holder</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', letterSpacing: '0.05em' }}>VAULT ADMIN</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Expires</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>09/28</div>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, fontStyle: 'italic', color: '#F8FAFC', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(255,255,255,0.2)' }}>VISA</div>
      </div>
    </div>
  </motion.div>
);

/* ── Main Dashboard ── */
const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { wallets, transactions, totalBalance, isLoading } = useWallet();
  const [pendingTxn, setPendingTxn] = useState(7);
  
  const computedPortfolioData = React.useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return [
        { name: 'Savings', value: 45200, color: '#00C6AE' },
        { name: 'Checking', value: 28100, color: '#818CF8' },
        { name: 'Investments', value: 18700, color: '#F59E0B' },
        { name: 'Crypto', value: 8000, color: '#EF4444' },
      ];
    }
    return [
      { name: 'Savings', value: wallets.filter(w => w.type === 'savings').reduce((acc, w) => acc + w.balance, 0), color: '#00C6AE' },
      { name: 'Checking', value: wallets.filter(w => w.type === 'checking').reduce((acc, w) => acc + w.balance, 0), color: '#818CF8' },
      { name: 'Investments', value: wallets.filter(w => w.type === 'investment').reduce((acc, w) => acc + w.balance, 0), color: '#F59E0B' },
      { name: 'Crypto', value: wallets.filter(w => w.type === 'crypto').reduce((acc, w) => acc + w.balance, 0), color: '#EF4444' },
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
        type: t.description.split('—')[0] || t.type,
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,198,174,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '40px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-h1 gradient-text">Wallet Overview</h1>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(0,198,174,0.1)', border: '1px solid rgba(0,198,174,0.2)', boxShadow: '0 0 15px rgba(0,198,174,0.1)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C6AE', boxShadow: '0 0 10px #00C6AE', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00E8CC', letterSpacing: '0.1em' }}>LIVE</span>
            </div>
          </div>
          <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '550px', lineHeight: 1.6 }}>Real-time financial command center. Monitor balances, track transactions, and analyze account health across all linked portfolios.</p>
        </div>
        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 20px', fontWeight: 600 }}>
            <Clock size={18} /> Last 24h
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ borderRadius: '12px', padding: '12px 24px', fontSize: '0.9rem' }}
            onClick={() => addToast({ type: 'success', title: 'Statement Generating', message: 'Your comprehensive account statement is being compiled securely.' })}>
            <BarChart3 size={18} /> Export Statement
          </motion.button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Vault Balance" value={isLoading ? '...' : `${totalBalance.toLocaleString()} DZD`} trend="+12.4%" trendUp icon={<Wallet size={24} />} variant="primary" subtitle="Across all linked accounts" />
        <StatCard title="Today's Transactions" value={isLoading ? '...' : '14'} trend="+8.1%" trendUp icon={<Send size={24} />} variant="success" subtitle={`${pendingTxn} pending approval`} />
        <StatCard title="Processing Speed" value="1.2s" trend="-15%" trendUp icon={<Zap size={24} />} variant="warning" subtitle="Optimal latency achieved ✓" />
        <StatCard title="Flagged Activity" value="3" trend="-40%" trendUp icon={<Shield size={24} />} variant="danger" subtitle="Auto-blocked by AI" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        {/* Transaction Volume */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-h2" style={{ marginBottom: '6px', fontSize: '1.5rem' }}>Transaction Volume</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>24-hour transaction flow across all secure channels</p>
            </div>
            <div className="flex gap-5 items-center bg-black/20 px-4 py-2 rounded-xl border border-white/5">
              {[{ label: 'Approved', color: '#00C6AE' }, { label: 'Volume', color: '#818CF8' }, { label: 'Flagged', color: '#EF4444' }].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 500 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C6AE" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00C6AE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }} itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 600 }} labelStyle={{ color: '#94A3B8', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }} />
                <Area type="monotone" dataKey="approved" stroke="#00C6AE" strokeWidth={3} fillOpacity={1} fill="url(#gradApproved)" activeDot={{ r: 6, fill: '#00C6AE', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="volume" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#gradVol)" activeDot={{ r: 6, fill: '#818CF8', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="flagged" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Portfolio Breakdown */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 className="text-h2" style={{ marginBottom: '6px', fontSize: '1.5rem' }}>Portfolio Distribution</h3>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '24px' }}>Asset allocation across connected accounts</p>
          <div style={{ height: '200px', width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pointerEvents: 'none' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Value</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-mono)' }}>100k+</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={computedPortfolioData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={6}>
                  {computedPortfolioData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 8px ${entry.color}40)` }} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 600 }} formatter={(value: number) => `${value.toLocaleString()} DZD`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3" style={{ marginTop: '20px' }}>
            {computedPortfolioData.map(item => (
              <div key={item.name} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>{item.name}</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'white' }}>{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }} className="flex justify-between items-center">
            <div>
              <h3 className="text-h2" style={{ marginBottom: '4px', fontSize: '1.4rem' }}>Recent Transactions</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Latest account activity and transfers</p>
            </div>
            <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px', fontWeight: 600 }}>
              <Eye size={16} /> View All
            </button>
          </div>
          <div style={{ padding: '12px 20px' }}>
            <AnimatePresence>
              {computedRecentTransactions.map(txn => (
                <motion.div key={txn.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div className="flex items-center gap-4">
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: txn.amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(0,198,174,0.08)',
                      color: txn.amount > 0 ? '#10B981' : '#00C6AE', border: `1px solid ${txn.amount > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(0,198,174,0.15)'}`,
                      boxShadow: txn.amount > 0 ? '0 4px 12px rgba(16,185,129,0.1)' : '0 4px 12px rgba(0,198,174,0.1)' }}>
                      {txn.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', lineHeight: 1.3, marginBottom: '2px' }}>{txn.type}</p>
                      <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{txn.recipient}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: txn.amount > 0 ? '#34D399' : 'white', marginBottom: '4px' }}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{txn.currency}</span>
                    </p>
                    <div className="flex items-center gap-1 justify-end" style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                      <Clock size={11} /> {txn.time}
                      {txn.status === 'pending' && <span style={{ marginLeft: '8px', color: '#F59E0B', fontWeight: 700, background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px' }}>PENDING</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Virtual Card */}
          <VaultCard />

          {/* Weekly Spending */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: 'white' }}>Weekly Spending</h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Daily expenditure (DZD)</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <BarChart3 size={16} color="#00C6AE" />
              </div>
            </div>
            <div style={{ height: '140px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="amount" radius={[6, 6, 2, 2]}>
                    {weeklySpending.map((_, i) => <Cell key={`cell-${i}`} fill={i === 4 ? '#00C6AE' : 'rgba(0,198,174,0.2)'} style={{ filter: i === 4 ? 'drop-shadow(0 0 8px rgba(0,198,174,0.4))' : 'none' }} />)}
                  </Bar>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }} dy={8} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} itemStyle={{ color: '#00C6AE', fontWeight: 600 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Account Health */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', color: 'white' }}>System Health</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Vault Uptime', value: '99.99%', icon: <Shield size={16} />, color: '#00C6AE', bg: 'rgba(0,198,174,0.1)' },
                { label: 'Encryption Status', value: 'Active', icon: <Lock size={16} />, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                { label: 'Pending Queue', value: `${pendingTxn} txns`, icon: <Activity size={16} className="animate-pulse" />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'rgba(0,0,0,0.25)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-4">
                    <div style={{ color: m.color, background: m.bg, padding: '8px', borderRadius: '8px' }}>{m.icon}</div>
                    <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
