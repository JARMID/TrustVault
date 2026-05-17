import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon, CreditCard, Send, ArrowUpRight, ArrowDownRight, Plus,
  TrendingUp, Eye, EyeOff, ChevronRight, Snowflake, MoreVertical, Shield, Lock,
  ArrowRight, Receipt, Zap, Building, QrCode
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../components/ui/Toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

/* ── Quick Action Button ── */
const QuickAction: React.FC<{
  icon: React.ReactNode; label: string; color: string; onClick?: () => void;
}> = ({ icon, label, color, onClick }) => (
  <motion.button
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
      padding: '24px 16px', borderRadius: '20px', cursor: 'pointer',
      background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '100px', flex: 1,
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = `linear-gradient(180deg, ${color}15 0%, rgba(255,255,255,0.02) 100%)`;
      e.currentTarget.style.borderColor = `${color}30`;
      e.currentTarget.style.boxShadow = `0 12px 30px -10px ${color}40`;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
      e.currentTarget.style.boxShadow = '0 8px 24px -8px rgba(0,0,0,0.2)';
    }}
  >
    <div style={{
      width: '52px', height: '52px', borderRadius: '16px',
      background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${color}20)`,
      border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      boxShadow: `inset 0 0 12px ${color}10`,
    }}>
      {icon}
    </div>
    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
  </motion.button>
);

/* ── Card Widget ── */
const VirtualCardWidget: React.FC<{
  card: { id: string; last4: string; brand: string; label: string; color: string; status: string; expiry_month: number; expiry_year: number; spending_limit: number | null; spent_this_month: number };
  onFreeze: (id: string) => void;
  onUnfreeze: (id: string) => void;
}> = ({ card, onFreeze, onUnfreeze }) => {
  const spendPct = card.spending_limit ? Math.min(100, (card.spent_this_month / card.spending_limit) * 100) : 0;
  const isFrozen = card.status === 'frozen';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      style={{
        background: isFrozen
          ? 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)'
          : `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 40%, #050a12 100%)`,
        borderRadius: '20px', padding: '28px',
        border: isFrozen ? '1px solid rgba(100,116,139,0.2)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isFrozen ? 'none' : `0 20px 40px -15px ${card.color}50`,
        position: 'relative', overflow: 'hidden', minWidth: '280px', cursor: 'pointer',
        filter: isFrozen ? 'saturate(0.4)' : 'none',
      }}
    >
      {/* Glass Reflection */}
      <div style={{
        position: 'absolute', top: 0, left: '-50%', width: '200%', height: '100%',
        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)',
        transform: 'rotate(-15deg) translateY(-20%)', pointerEvents: 'none'
      }} />
      {isFrozen && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(100,116,139,0.2)', borderRadius: '8px', padding: '4px 10px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <Snowflake size={10} style={{ color: '#94A3B8' }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em' }}>FROZEN</span>
        </div>
      )}
      <div className="flex justify-between items-start" style={{ marginBottom: '28px' }}>
        <div className="flex items-center gap-2">
          <Lock size={10} style={{ color: '#00C6AE' }} />
          <span style={{ fontSize: '0.55rem', color: '#00C6AE', fontFamily: "var(--font-mono)", letterSpacing: '0.08em' }}>AES-256</span>
        </div>
        <div style={{ width: '34px', height: '24px', borderRadius: '4px', background: 'linear-gradient(135deg, #D4A853, #B8902D)', opacity: 0.85 }} />
      </div>
      <div style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
        <span style={{ opacity: 0.3 }}>••••</span>{' '}<span style={{ opacity: 0.3 }}>••••</span>{' '}<span style={{ opacity: 0.3 }}>••••</span>{' '}
        <span style={{ opacity: 0.9, color: 'white' }}>{card.last4}</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div style={{ fontSize: '0.5rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{card.label}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
            {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
          </div>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00C6AE', fontFamily: 'var(--font-display)' }}>
          {card.brand.toUpperCase()}
        </span>
      </div>
      {card.spending_limit && (
        <div style={{ marginTop: '16px' }}>
          <div className="flex justify-between" style={{ fontSize: '0.6rem', color: '#64748B', marginBottom: '4px' }}>
            <span>{card.spent_this_month.toLocaleString()} DZD spent</span>
            <span>{card.spending_limit.toLocaleString()} DZD limit</span>
          </div>
          <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ width: `${spendPct}%`, height: '100%', borderRadius: '2px', background: spendPct > 80 ? '#EF4444' : '#00C6AE', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}
      <div className="flex gap-2" style={{ marginTop: '14px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); isFrozen ? onUnfreeze(card.id) : onFreeze(card.id); }}
          style={{
            padding: '5px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600,
            background: isFrozen ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
            color: isFrozen ? '#10B981' : '#94A3B8', border: `1px solid ${isFrozen ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          {isFrozen ? <Zap size={9} /> : <Snowflake size={9} />}
          {isFrozen ? 'Unfreeze' : 'Freeze'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '5px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600,
            background: 'rgba(255,255,255,0.03)', color: '#64748B', border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
          }}
        >
          <MoreVertical size={10} />
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Main Wallet Page ── */
const WalletPage: React.FC = () => {
  const { wallets, cards, transactions, totalBalance, freezeCard, unfreezeCard } = useWallet();
  const { addToast } = useToast();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const recentTxns = transactions.slice(0, 8);

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,198,174,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="flex justify-between items-end mb-8 relative z-10">
          <div>
            <h1 className="text-h1 gradient-text" style={{ marginBottom: '4px' }}>My Wallet</h1>
            <p className="text-sm">Manage your balances, cards, and payments</p>
          </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="btn btn-primary"
          style={{ borderRadius: '12px' }}
          onClick={() => addToast({ type: 'info', title: 'Coming soon', message: 'New card creation will be available shortly.' })}
        >
          <Plus size={16} /> New Card
        </motion.button>
      </div>

      {/* Balance Hero */}
      <motion.div variants={itemVariants} className="glass-card" style={{ padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,198,174,0.05), transparent 70%)', pointerEvents: 'none' }} />
        <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Balance</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setBalanceVisible(!balanceVisible)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '2px' }}
              >
                {balanceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={balanceVisible ? 'show' : 'hide'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                {balanceVisible ? `${totalBalance.toLocaleString()} DZD` : '•••••• DZD'}
              </motion.h2>
            </AnimatePresence>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1" style={{ color: '#34D399', fontSize: '0.8rem', fontWeight: 600 }}>
                <TrendingUp size={14} /> +12.4%
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>vs last month</span>
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(0,198,174,0.06)', border: '1px solid rgba(0,198,174,0.12)' }}>
            <Shield size={13} style={{ color: '#00C6AE' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#00E8CC', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>VAULT SECURED</span>
          </div>
        </div>

        {/* Sub-wallets */}
        <div className="flex gap-4" style={{ marginTop: '24px' }}>
          {wallets.map((w) => (
            <motion.div whileHover={{ y: -2 }} key={w.id} style={{
              padding: '16px 20px', borderRadius: '16px', flex: 1,
              background: w.is_primary ? 'rgba(0,198,174,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${w.is_primary ? 'rgba(0,198,174,0.2)' : 'rgba(255,255,255,0.04)'}`,
              boxShadow: w.is_primary ? '0 8px 24px -8px rgba(0,198,174,0.2)' : 'none',
              backdropFilter: 'blur(8px)', cursor: 'pointer',
            }}>
              <div style={{ fontSize: '0.65rem', color: w.is_primary ? '#00E8CC' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontWeight: w.is_primary ? 600 : 500 }}>{w.name}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {balanceVisible ? w.balance.toLocaleString() : '••••••'}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>{w.currency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex gap-4 mb-8">
        <QuickAction icon={<Send size={20} />} label="Send Money" color="#00C6AE" />
        <QuickAction icon={<ArrowDownRight size={20} />} label="Request" color="#818CF8" />
        <QuickAction icon={<Plus size={20} />} label="Top Up" color="#10B981" />
        <QuickAction icon={<Receipt size={20} />} label="Pay Bills" color="#F59E0B" />
        <QuickAction icon={<Building size={20} />} label="Bank Transfer" color="#A78BFA" />
        <QuickAction icon={<QrCode size={20} />} label="QR Pay" color="#EC4899" />
      </motion.div>

      {/* Cards + Transactions Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Cards Column */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3">Virtual Cards</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {cards.map((card) => (
              <VirtualCardWidget
                key={card.id}
                card={card}
                onFreeze={freezeCard}
                onUnfreeze={unfreezeCard}
              />
            ))}
          </div>
        </motion.div>

        {/* Transactions Column */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3">Recent Activity</h3>
            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {recentTxns.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < recentTxns.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: txn.amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(0,198,174,0.06)',
                    color: txn.amount > 0 ? '#10B981' : '#00C6AE',
                    border: `1px solid ${txn.amount > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(0,198,174,0.1)'}`,
                  }}>
                    {txn.amount > 0 ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{txn.description}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                      {txn.counterparty || txn.category} · {new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                    color: txn.amount > 0 ? '#34D399' : 'var(--text-primary)',
                  }}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} {txn.currency}
                  </p>
                  {txn.status === 'pending' && (
                    <span style={{ fontSize: '0.6rem', color: '#F59E0B', fontWeight: 700 }}>PENDING</span>
                  )}
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

export default WalletPage;
