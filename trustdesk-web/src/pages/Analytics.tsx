import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart3,
  ArrowUpRight, ArrowDownRight, Calendar, Wallet, CreditCard,
  ShoppingBag, Car, Coffee, Zap, Heart, Banknote, MoreHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useWallet } from '../hooks/useWallet';

/* â”€â”€ Animation variants â”€â”€ */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

/* â”€â”€ Stat Card â”€â”€ */
const StatCard: React.FC<{
  label: string; value: string; change: string; positive: boolean;
  icon: React.ReactNode; color: string;
}> = ({ label, value, change, positive, icon, color }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3, scale: 1.01 }}
    className="liquid-glass-card mesh-bg"
    style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
  >
    <div style={{
      position: 'absolute', top: '-12px', right: '-12px', width: '80px', height: '80px',
      borderRadius: '50%', background: `${color}08`, filter: 'blur(20px)', pointerEvents: 'none',
    }} />
    <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        {icon}
      </div>
      <div className="flex items-center gap-1" style={{
        padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
        background: positive ? 'var(--bg-inset)' : 'var(--bg-inset)',
        color: positive ? 'var(--accent-success)' : 'var(--accent-danger)',
        border: `1px solid ${positive ? 'rgba(0, 198, 174,0.15)' : 'rgba(239, 68, 68,0.15)'}`,
      }}>
        {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {change}
      </div>
    </div>
    <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
    <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</p>
  </motion.div>
);

/* â”€â”€ Category Icon Map â”€â”€ */
const catIcon: Record<string, React.ReactNode> = {
  shopping: <ShoppingBag size={14} />, transport: <Car size={14} />,
  food: <Coffee size={14} />, utilities: <Zap size={14} />,
  health: <Heart size={14} />, salary: <Banknote size={14} />,
  other: <MoreHorizontal size={14} />,
};
const catColor: Record<string, string> = {
  shopping: 'var(--brand-primary)', transport: 'var(--accent-success)', food: 'var(--brand-primary)',
  utilities: 'var(--accent-danger)', health: 'var(--accent-success)', salary: 'var(--accent-success)', other: 'var(--text-tertiary)',
};

/* â”€â”€ Custom Tooltip â”€â”€ */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: '10px', padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, fontFamily: 'var(--font-mono)' }}>
          {p.value.toLocaleString()} DZD
        </p>
      ))}
    </div>
  );
};

/* â”€â”€ Main Analytics Page â”€â”€ */
const AnalyticsPage: React.FC = () => {
  const { transactions, totalBalance } = useWallet();
  const [period, setPeriod] = useState<'week' | 'month' | '3months'>('month');

  // Compute analytics data
  const totalIncome = useMemo(() =>
    transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0';
  const avgTransaction = transactions.length > 0
    ? Math.round(transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / transactions.length) : 0;

  // Monthly trend data (mock based on transaction dates)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, _i) => ({
      month: m,
      income: Math.round(120000 + Math.random() * 80000),
      expenses: Math.round(60000 + Math.random() * 50000),
    }));
  }, []);

  // Category breakdown
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value, color: catColor[name] || 'var(--text-tertiary)' }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalCatSpend = categoryData.reduce((s, c) => s + c.value, 0);

  // Weekly spend data
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(d => ({
      day: d,
      amount: Math.round(2000 + Math.random() * 15000),
    }));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-h1 gradient-text" style={{ marginBottom: '4px' }}>Analytics</h1>
            <p className="text-sm">Insights into your financial activity</p>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', '3months'] as const).map(p => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.94 }}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '7px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: period === p ? 'var(--brand-primary-bg)' : 'var(--bg-inset)',
                  color: period === p ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${period === p ? 'rgba(0, 198, 174,0.15)' : 'var(--border-subtle)'}`,
                }}
              >
                {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : '3 Months'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid gap-5 mb-7" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <StatCard label="Total Balance" value={`${totalBalance.toLocaleString()}`} change="+12.4%" positive icon={<Wallet size={20} />} color="var(--brand-primary)" />
          <StatCard label="Monthly Income" value={`${totalIncome.toLocaleString()}`} change="+8.2%" positive icon={<TrendingUp size={20} />} color="var(--accent-success)" />
          <StatCard label="Monthly Expenses" value={`${totalExpenses.toLocaleString()}`} change="-3.1%" positive={false} icon={<TrendingDown size={20} />} color="var(--accent-danger)" />
          <StatCard label="Savings Rate" value={`${savingsRate}%`} change="+2.3%" positive icon={<PieIcon size={20} />} color="var(--brand-primary)" />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 mb-7" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Income vs Expense Trend */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '24px' }}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-h3">Income vs Expenses</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>Monthly cash flow trend</p>
              </div>
              <div className="flex gap-4" style={{ fontSize: '0.7rem' }}>
                <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand-primary)', display: 'inline-block' }} /> Income</span>
                <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-danger)', display: 'inline-block' }} /> Expenses</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-danger)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--accent-danger)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <YAxis stroke="var(--text-tertiary)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="var(--brand-primary)" strokeWidth={2.5} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--accent-danger)" strokeWidth={2} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '24px' }}>
            <h3 className="text-h3 mb-4">Spending by Category</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Category list */}
            <div className="flex flex-col gap-2">
              {categoryData.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center gap-3" style={{ padding: '4px 0' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: `${cat.color}12`, border: `1px solid ${cat.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color,
                  }}>
                    {catIcon[cat.name] || catIcon['other']}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{cat.name}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{cat.value.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'var(--bg-inset)', marginTop: '4px' }}>
                      <div style={{
                        width: `${totalCatSpend > 0 ? (cat.value / totalCatSpend * 100) : 0}%`,
                        height: '100%', borderRadius: '2px', background: cat.color,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Weekly Activity */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '24px' }}>
            <h3 className="text-h3 mb-1">Weekly Activity</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>Daily spending pattern</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <YAxis stroke="var(--text-tertiary)" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Insights */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '24px' }}>
            <h3 className="text-h3 mb-4">Quick Insights</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: <DollarSign size={16} />, label: 'Average Transaction', value: `${avgTransaction.toLocaleString()} DZD`, color: 'var(--brand-primary)' },
                { icon: <CreditCard size={16} />, label: 'Total Transactions', value: `${transactions.length}`, color: 'var(--accent-success)' },
                { icon: <BarChart3 size={16} />, label: 'Largest Expense', value: `${Math.max(...transactions.filter(t => t.amount < 0).map(t => Math.abs(t.amount)), 0).toLocaleString()} DZD`, color: 'var(--accent-danger)' },
                { icon: <TrendingUp size={16} />, label: 'Largest Income', value: `${Math.max(...transactions.filter(t => t.amount > 0).map(t => t.amount), 0).toLocaleString()} DZD`, color: 'var(--accent-success)' },
                { icon: <Calendar size={16} />, label: 'Most Active Day', value: 'Wednesday', color: 'var(--brand-primary)' },
              ].map((insight) => (
                <motion.div
                  key={insight.label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3"
                  style={{
                    padding: '12px 14px', borderRadius: '12px',
                    background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: `${insight.color}10`, border: `1px solid ${insight.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: insight.color,
                  }}>
                    {insight.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{insight.label}</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{insight.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;









