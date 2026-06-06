import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, Search, Filter, Download, ChevronDown,
  ShoppingBag, Car, Coffee, Zap, Heart, ArrowLeftRight, Banknote, MoreHorizontal,
  Calendar, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useWallet, type TransactionFilters } from '../hooks/useWallet';

/* â”€â”€ category helpers â”€â”€ */
const categoryIcon: Record<string, React.ReactNode> = {
  shopping: <ShoppingBag size={15} />,
  transport: <Car size={15} />,
  food: <Coffee size={15} />,
  utilities: <Zap size={15} />,
  health: <Heart size={15} />,
  transfer: <ArrowLeftRight size={15} />,
  salary: <Banknote size={15} />,
  other: <MoreHorizontal size={15} />,
};
const categoryColor: Record<string, string> = {
  shopping: 'var(--brand-primary)',
  transport: 'var(--accent-success)',
  food: 'var(--brand-primary)',
  utilities: 'var(--accent-danger)',
  health: 'var(--accent-success)',
  transfer: '#A78BFA',
  salary: 'var(--accent-success)',
  other: 'var(--text-tertiary)',
};

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'credit', label: 'Income' },
  { value: 'debit', label: 'Expense' },
  { value: 'refund', label: 'Refund' },
  { value: 'withdrawal', label: 'Withdrawal' },
];
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const ITEMS_PER_PAGE = 10;

const TransactionsPage: React.FC = () => {
  const { filterTransactions, transactions } = useWallet();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filters: TransactionFilters = useMemo(() => ({
    search: search || undefined,
    type: (typeFilter || undefined) as TransactionFilters['type'],
    status: (statusFilter || undefined) as TransactionFilters['status'],
  }), [search, typeFilter, statusFilter]);

  const filtered = useMemo(() => filterTransactions(filters), [filterTransactions, filters]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,198,174,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-h1" style={{ marginBottom: '4px' }}>Transactions</h1>
          <p className="text-sm">Complete history of your financial activity</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="btn btn-ghost"
          style={{ borderRadius: '12px' }}
        >
          <Download size={16} /> Export CSV
        </motion.button>
      </div>

      {/* Summary Row */}
      <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Total Income', value: `+${totalIncome.toLocaleString()} DZD`, color: 'var(--accent-success)', icon: <ArrowDownRight size={16} /> },
          { label: 'Total Expenses', value: `-${totalExpenses.toLocaleString()} DZD`, color: 'var(--accent-danger)', icon: <ArrowUpRight size={16} /> },
          { label: 'Net Flow', value: `${(totalIncome - totalExpenses).toLocaleString()} DZD`, color: 'var(--accent-success)', icon: <ArrowLeftRight size={16} /> },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass-card mesh-bg"
            style={{ padding: '20px 24px' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: `${stat.color}12`, border: `1px solid ${stat.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color,
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="liquid-glass-card mesh-bg flex items-center gap-3 mb-5" style={{ padding: '12px 20px' }}>
        <div className="flex items-center gap-2 flex-1" style={{ background: 'var(--bg-inset)', borderRadius: '10px', padding: '8px 14px', border: '1px solid var(--border-subtle)' }}>
          <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search transactions..."
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none' }}
          />
          {search && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { setSearch(''); setPage(1); }} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
              <X size={14} />
            </motion.button>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
            background: showFilters ? 'rgba(0, 198, 174,0.06)' : 'var(--bg-inset)',
            color: showFilters ? 'var(--brand-primary)' : 'var(--text-secondary)',
            border: `1px solid ${showFilters ? 'rgba(0, 198, 174,0.15)' : 'var(--border-subtle)'}`,
          }}
        >
          <Filter size={14} /> Filters <ChevronDown size={12} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '20px' }}
          >
            <div className="flex gap-3" style={{ padding: '4px 0' }}>
              {[{ options: typeOptions, value: typeFilter, setter: setTypeFilter }, { options: statusOptions, value: statusFilter, setter: setStatusFilter }].map(({ options, value, setter }, idx) => (
                <select
                  key={idx}
                  value={value}
                  onChange={(e) => { setter(e.target.value); setPage(1); }}
                  style={{
                    padding: '8px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 500,
                    background: 'var(--bg-inset)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)', cursor: 'pointer', outline: 'none',
                    appearance: 'none', WebkitAppearance: 'none', paddingRight: '32px',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Header */}
        <div className="flex items-center" style={{
          padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <div style={{ flex: 2 }}>Transaction</div>
          <div style={{ flex: 1 }}>Category</div>
          <div style={{ flex: 1 }}>Date</div>
          <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
          <div style={{ width: '80px', textAlign: 'center' }}>Status</div>
        </div>

        <AnimatePresence mode="wait">
          {paginated.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '48px 20px', textAlign: 'center' }}
            >
              <Search size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No transactions match your filters</p>
            </motion.div>
          ) : (
            paginated.map((txn, i) => {
              const catColor = categoryColor[txn.category] || 'var(--text-tertiary)';
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center"
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < paginated.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-inset)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Transaction */}
                  <div className="flex items-center gap-3" style={{ flex: 2 }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${catColor}12`, border: `1px solid ${catColor}20`, color: catColor,
                    }}>
                      {categoryIcon[txn.category] || categoryIcon['other']}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25 }}>{txn.description}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{txn.counterparty || 'â€”'}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600,
                      background: `${catColor}12`, color: catColor, border: `1px solid ${catColor}15`,
                      textTransform: 'capitalize',
                    }}>
                      {txn.category}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-1" style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                      <Calendar size={11} />
                      {new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: txn.amount > 0 ? 'var(--accent-success)' : 'var(--text-primary)',
                    }}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} {txn.currency}
                    </span>
                  </div>

                  {/* Status */}
                  <div style={{ width: '80px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                      fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                      background: txn.status === 'completed' ? 'rgba(16,185,129,0.08)' : txn.status === 'pending' ? 'rgba(245,158,11,0.08)' : 'rgba(239, 68, 68,0.08)',
                      color: txn.status === 'completed' ? 'var(--accent-success)' : txn.status === 'pending' ? 'var(--brand-primary)' : 'var(--accent-danger)',
                      border: `1px solid ${txn.status === 'completed' ? 'rgba(16,185,129,0.15)' : txn.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239, 68, 68,0.15)'}`,
                    }}>
                      {txn.status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center" style={{
            padding: '12px 20px', borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}â€“{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', cursor: page <= 1 ? 'default' : 'pointer',
                  color: page <= 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)', opacity: page <= 1 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={14} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', cursor: page >= totalPages ? 'default' : 'pointer',
                  color: page >= totalPages ? 'var(--text-tertiary)' : 'var(--text-secondary)', opacity: page >= totalPages ? 0.4 : 1,
                }}
              >
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>
        )}
      </div>
      </motion.div>
    </div>
  );
};

export default TransactionsPage;





