import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, Repeat, Coffee, Zap, Wifi, Play, Music,
  ShoppingBag, Car, Heart, Trash2, TrendingDown, TrendingUp,
  AlertTriangle, CheckCircle, Edit2, ChevronRight, Sparkles,
  DollarSign, Calendar, PiggyBank, X,
} from 'lucide-react';

// ── Animation ─────────────────────────────────────────────────────────────────
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } } };

import { useWallet } from '../hooks/useWallet';

// ── Types ─────────────────────────────────────────────────────────────────────
interface BudgetGoal {
  id: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  limit: number;
  spent: number;
  currency: string;
}

interface Subscription {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  amount: number;
  currency: string;
  cycle: 'monthly' | 'yearly' | 'weekly';
  next_billing: string;
  category: string;
  active: boolean;
}

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode, color: string }> = {
  shopping: { icon: <ShoppingBag size={15} />, color: '#818CF8' },
  food: { icon: <Coffee size={15} />, color: '#F59E0B' },
  transport: { icon: <Car size={15} />, color: '#00C6AE' },
  utilities: { icon: <Zap size={15} />, color: '#EF4444' },
  health: { icon: <Heart size={15} />, color: '#10B981' },
  entertainment: { icon: <Play size={15} />, color: '#E50914' },
};

const INITIAL_GOAL_LIMITS: Record<string, number> = {
  shopping: 40_000,
  food: 25_000,
  transport: 15_000,
  utilities: 15_000,
  health: 10_000,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000));
}

function cycleLabel(c: Subscription['cycle']) {
  return c === 'monthly' ? '/mo' : c === 'yearly' ? '/yr' : '/wk';
}

// ── Donut component ───────────────────────────────────────────────────────────
const Donut: React.FC<{ pct: number; color: string; size?: number; stroke?: number }> = ({
  pct, color, size = 56, stroke = 6,
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  const isOver = pct > 1;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-inset)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={isOver ? 'var(--accent-danger)' : color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const BudgetPage: React.FC = () => {
  const { transactions } = useWallet();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddSub, setShowAddSub] = useState(false);
  const [customSubs, setCustomSubs] = useState<Subscription[]>([]);

  const goals = useMemo(() => {
    const expenses = transactions.filter(t => t.amount < 0);
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    });

    return Object.entries(INITIAL_GOAL_LIMITS).map(([cat, limit], i) => ({
      id: `g${i}`,
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: CATEGORY_ICONS[cat]?.icon || <ShoppingBag size={15} />,
      color: CATEGORY_ICONS[cat]?.color || '#818CF8',
      limit,
      spent: categoryTotals[cat] || 0,
      currency: 'DZD'
    }));
  }, [transactions]);

  const subs = useMemo(() => {
    const derivedSubs: Subscription[] = transactions
      .filter(t => t.amount < 0 && (t.category === 'utilities' || t.category === 'entertainment'))
      .slice(0, 5) // Limit to a few recent ones
      .map(t => ({
        id: `s_${t.id}`,
        name: t.counterparty || t.description,
        icon: CATEGORY_ICONS[t.category]?.icon || <Play size={14} />,
        color: CATEGORY_ICONS[t.category]?.color || '#E50914',
        amount: Math.abs(t.amount),
        currency: t.currency,
        cycle: 'monthly',
        next_billing: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], // Fake next billing 15 days from now
        category: t.category,
        active: true
      }));
    return [...derivedSubs, ...customSubs];
  }, [transactions, customSubs]);

  // Aggregate stats
  const totalBudget = goals.reduce((s, g) => s + g.limit, 0);
  const totalSpent = goals.reduce((s, g) => s + g.spent, 0);
  const totalSubMonthly = useMemo(() =>
    subs.filter(s => s.active).reduce((sum, s) => {
      if (s.cycle === 'monthly') return sum + s.amount;
      if (s.cycle === 'yearly') return sum + s.amount / 12;
      return sum + s.amount * 4.33;
    }, 0), [subs]);

  const overBudgetCount = goals.filter(g => g.spent > g.limit).length;
  const budgetHealthPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // AI insights
  const insights = useMemo(() => {
    const list: { type: 'warning' | 'success' | 'info'; text: string }[] = [];
    goals.forEach(g => {
      if (g.spent > g.limit) list.push({ type: 'warning', text: `You've exceeded your ${g.category} budget by ${(g.spent - g.limit).toLocaleString()} DZD.` });
      else if (g.spent / g.limit > 0.85) list.push({ type: 'warning', text: `${g.category} is at ${((g.spent / g.limit) * 100).toFixed(0)}% — watch your spending.` });
    });
    if (budgetHealthPct < 60) list.push({ type: 'success', text: `Great job — you've only used ${budgetHealthPct.toFixed(0)}% of your total budget this month.` });
    list.push({ type: 'info', text: `Subscriptions cost ${totalSubMonthly.toLocaleString('fr-DZ', { maximumFractionDigits: 0 })} DZD/month. That's ${((totalSubMonthly / (totalBudget || 1)) * 100).toFixed(1)}% of your budget.` });
    if (subs.some(s => daysUntil(s.next_billing) <= 3 && s.active)) {
      list.push({ type: 'info', text: `You have a subscription billing within the next 3 days.` });
    }
    return list.slice(0, 4);
  }, [goals, subs, budgetHealthPct, totalSubMonthly, totalBudget]);

  function saveGoalEdit(id: string) {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      // In a real app, save to Supabase here
    }
    setEditingGoal(null);
  }

  function toggleSub(id: string) {
    setCustomSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }
  function deleteSub(id: string) {
    setCustomSubs(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '-5%', right: '-8%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(0,198,174,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-8%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div variants={item} className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-h1 gradient-text" style={{ marginBottom: '4px' }}>Budget & Subscriptions</h1>
            <p className="text-sm">Track spending limits, recurring bills, and financial health</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddSub(true)}
            className="btn btn-primary"
            style={{ borderRadius: '12px' }}
          >
            <Plus size={16} /> Add Subscription
          </motion.button>
        </motion.div>

        {/* ── Summary cards ──────────────────────────────────────── */}
        <div className="grid gap-5 mb-7" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            {
              label: 'Total Budget', value: `${totalBudget.toLocaleString()} DZD`,
              sub: 'This month', color: 'var(--brand-primary)', icon: <Target size={20} />,
            },
            {
              label: 'Total Spent', value: `${totalSpent.toLocaleString()} DZD`,
              sub: `${budgetHealthPct.toFixed(0)}% of budget`, color: budgetHealthPct > 90 ? 'var(--accent-danger)' : 'var(--accent-success)', icon: <DollarSign size={20} />,
            },
            {
              label: 'Monthly Subscriptions', value: `${totalSubMonthly.toLocaleString('fr-DZ', { maximumFractionDigits: 0 })} DZD`,
              sub: `${subs.filter(s => s.active).length} active`, color: '#A78BFA', icon: <Repeat size={20} />,
            },
            {
              label: 'Budget Status', value: overBudgetCount > 0 ? `${overBudgetCount} Over` : 'On Track',
              sub: overBudgetCount > 0 ? 'Categories exceeded' : 'All categories healthy', color: overBudgetCount > 0 ? 'var(--accent-danger)' : 'var(--accent-success)', icon: overBudgetCount > 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />,
            },
          ].map(card => (
            <motion.div
              key={card.label}
              variants={item}
              whileHover={{ y: -3 }}
              className="liquid-glass-card mesh-bg"
              style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden', cursor: 'default' }}
            >
              <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '80px', height: '80px', borderRadius: '50%', background: `${card.color}08`, filter: 'blur(24px)' }} />
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: `${card.color}10`, border: `1px solid ${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{card.label}</span>
              </div>
              <p style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '2px' }}>{card.value}</p>
              <p style={{ fontSize: '0.68rem', color: card.color, fontWeight: 600 }}>{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

          {/* ── Budget Goals ─────────────────────────────────────── */}
          <motion.div variants={item}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h3">Spending Limits</h3>
              <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                <Plus size={13} /> Add Category
              </button>
            </div>
            <div className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
              {goals.map((g, i) => {
                const pct = g.spent / g.limit;
                const isOver = pct > 1;
                const isEditing = editingGoal === g.id;
                return (
                  <motion.div
                    key={g.id}
                    layout
                    style={{
                      padding: '18px 22px',
                      borderBottom: i < goals.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Donut */}
                      <div style={{ position: 'relative' }}>
                        <Donut pct={pct} color={g.color} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOver ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                            {Math.min(Math.round(pct * 100), 999)}%
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: `${g.color}12`, border: `1px solid ${g.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: g.color }}>
                            {g.icon}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{g.category}</span>
                          {isOver && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent-danger)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', padding: '2px 7px' }}>
                              <AlertTriangle size={9} /> OVER
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div style={{ width: '100%', height: '4px', borderRadius: '3px', background: 'var(--bg-inset)', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct * 100, 100)}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: '3px', background: isOver ? 'var(--accent-danger)' : pct > 0.8 ? '#F59E0B' : g.color }}
                          />
                        </div>
                        <div className="flex justify-between" style={{ marginTop: '4px', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                          <span>{g.spent.toLocaleString()} DZD spent</span>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                type="number"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') saveGoalEdit(g.id); if (e.key === 'Escape') setEditingGoal(null); }}
                                style={{ width: '90px', background: 'var(--bg-inset)', border: '1px solid var(--brand-primary)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.68rem', padding: '2px 6px', outline: 'none', fontFamily: 'var(--font-mono)' }}
                              />
                              <button onClick={() => saveGoalEdit(g.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-success)' }}><CheckCircle size={13} /></button>
                              <button onClick={() => setEditingGoal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={13} /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingGoal(g.id); setEditValue(String(g.limit)); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem' }}
                            >
                              <Edit2 size={10} /> {g.limit.toLocaleString()} DZD limit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right column: Subscriptions + Insights ─────────── */}
          <div className="flex flex-col gap-6">

            {/* AI Insights */}
            <motion.div variants={item} className="liquid-glass-card mesh-bg" style={{ padding: '22px' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} style={{ color: 'var(--brand-primary)' }} />
                <h3 className="text-h3">AI Insights</h3>
              </div>
              <div className="flex flex-col gap-3">
                {insights.map((ins, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      background: ins.type === 'warning' ? 'rgba(239,68,68,0.05)' : ins.type === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(0,198,174,0.05)',
                      border: `1px solid ${ins.type === 'warning' ? 'rgba(239,68,68,0.12)' : ins.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(0,198,174,0.12)'}`,
                    }}
                  >
                    <div style={{ marginTop: '1px', color: ins.type === 'warning' ? 'var(--accent-danger)' : ins.type === 'success' ? 'var(--accent-success)' : 'var(--brand-primary)', flexShrink: 0 }}>
                      {ins.type === 'warning' ? <AlertTriangle size={13} /> : ins.type === 'success' ? <CheckCircle size={13} /> : <Sparkles size={13} />}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Subscriptions */}
            <motion.div variants={item}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Repeat size={15} style={{ color: 'var(--text-tertiary)' }} />
                  <h3 className="text-h3">Recurring Bills</h3>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {totalSubMonthly.toLocaleString('fr-DZ', { maximumFractionDigits: 0 })} DZD/mo
                </span>
              </div>
              <div className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
                {subs.map((s, i) => {
                  const days = daysUntil(s.next_billing);
                  const urgent = days <= 3;
                  return (
                    <motion.div
                      key={s.id}
                      layout
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '13px 18px',
                        borderBottom: i < subs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        opacity: s.active ? 1 : 0.45,
                        transition: 'opacity 0.3s',
                      }}
                    >
                      {/* Icon */}
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${s.color}12`, border: `1px solid ${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                        {s.icon}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                        <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                          <span style={{ fontSize: '0.65rem', color: urgent ? 'var(--accent-danger)' : 'var(--text-tertiary)' }}>
                            <Calendar size={9} style={{ display: 'inline', marginRight: '3px' }} />
                            {days === 0 ? 'Today' : `in ${days}d`}
                          </span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{s.category}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          {s.amount.toLocaleString()}
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginLeft: '2px' }}>{s.currency}{cycleLabel(s.cycle)}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleSub(s.id)}
                          style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.active ? 'rgba(0,198,174,0.06)' : 'var(--bg-inset)', border: `1px solid ${s.active ? 'rgba(0,198,174,0.15)' : 'var(--border-subtle)'}`, color: s.active ? 'var(--accent-success)' : 'var(--text-tertiary)', cursor: 'pointer' }}
                        >
                          <CheckCircle size={12} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => deleteSub(s.id)}
                          style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'transparent'; }}
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Savings goal teaser */}
            <motion.div
              variants={item}
              whileHover={{ y: -2 }}
              className="liquid-glass-card mesh-bg"
              style={{ padding: '20px 22px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(0,198,174,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }} />
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(0,198,174,0.08)', border: '1px solid rgba(0,198,174,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <PiggyBank size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Set a Savings Goal</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Track progress toward your next milestone</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
              </div>
              <div style={{ width: '100%', height: '4px', borderRadius: '3px', background: 'var(--bg-inset)', overflow: 'hidden' }}>
                <div style={{ width: '34%', height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))' }} />
              </div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>34% toward Emergency Fund — 150,000 DZD</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Add Subscription drawer (simple modal) ─────────────── */}
      <AnimatePresence>
        {showAddSub && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowAddSub(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="liquid-glass-card"
              style={{ width: '420px', padding: '32px', borderRadius: '20px' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Subscription</h3>
                <button onClick={() => setShowAddSub(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {(['Name', 'Amount (DZD)', 'Next billing date'] as const).map(label => (
                  <div key={label}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input
                      type={label === 'Next billing date' ? 'date' : label === 'Amount (DZD)' ? 'number' : 'text'}
                      placeholder={label}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddSub(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', marginTop: '4px' }}
                >
                  Save Subscription
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetPage;
