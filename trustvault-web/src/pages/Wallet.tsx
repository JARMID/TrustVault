import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Send, ArrowUpRight, ArrowDownRight, Plus,
  TrendingUp, Eye, EyeOff, ChevronRight, Snowflake, MoreVertical, Lock,
  Receipt, Zap, Building, QrCode, Copy, CheckCircle
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { EMVChip3D } from '../components/ui/EMVChip3D';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

/* â”€â”€ Quick Action Button â”€â”€ */
const QuickAction: React.FC<{
  icon: React.ReactNode; label: string; color: string; onClick?: () => void;
}> = ({ icon, label, color, onClick }) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      padding: '20px 14px', borderRadius: '16px', cursor: 'pointer',
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '90px', flex: 1,
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.borderColor = `${color}40`;
      e.currentTarget.style.boxShadow = `0 8px 24px -8px ${color}25`;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '14px',
      background: `${color}10`, border: `1px solid ${color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    }}>
      {icon}
    </div>
    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
  </motion.button>
);

/* â”€â”€ Card Widget â”€â”€ */
const VirtualCardWidget: React.FC<{
  card: { id: string; last4: string; brand: string; label: string; color: string; status: string; expiry_month: number; expiry_year: number; spending_limit: number | null; spent_this_month: number };
  onFreeze: (id: string) => void;
  onUnfreeze: (id: string) => void;
}> = ({ card, onFreeze, onUnfreeze }) => {
  const spendPct = card.spending_limit ? Math.min(100, (card.spent_this_month / card.spending_limit) * 100) : 0;
  const isFrozen = card.status === 'frozen';
  
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({ x: ((y / rect.height) - 0.5) * -15, y: ((x / rect.width) - 0.5) * 15 });
  };

  return (
    <div className="perspective-1000" onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <motion.div
        variants={itemVariants}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, y: tilt.x ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          background: isFrozen
            ? 'linear-gradient(135deg, var(--text-tertiary) 0%, var(--text-tertiary) 100%)'
            : `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 60%, #2D2F85 100%)`,
          borderRadius: '20px', padding: '28px',
          border: 'none',
          boxShadow: isFrozen ? 'var(--shadow-md)' : '0 16px 40px -12px rgba(0, 198, 174,0.35)',
          position: 'relative', overflow: 'hidden', minWidth: '280px', cursor: 'pointer',
          filter: isFrozen ? 'saturate(0.6)' : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glass Reflection */}
        {!isFrozen && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-20 opacity-50 mix-blend-overlay"
            animate={{ background: `radial-gradient(ellipse 80% 80% at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%)` }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          />
        )}
        
        {isFrozen && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)',
          }}>
            <Snowflake size={10} style={{ color: 'white' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', letterSpacing: '0.1em' }}>FROZEN</span>
          </div>
        )}
        <div className="flex justify-between items-start relative z-10" style={{ marginBottom: '20px', transform: 'translateZ(30px)' }}>
          <div className="flex items-center gap-2">
            <Lock size={10} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.9)', fontFamily: "var(--font-mono)", letterSpacing: '0.08em', fontWeight: 600 }}>AES-256 SECURED</span>
          </div>
        </div>
        
        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
          {/* Metallic EMV Chip */}
          <EMVChip3D tilt={tilt} />
          
          <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            <span style={{ opacity: 0.3 }}>â€¢â€¢â€¢â€¢</span>{' '}<span style={{ opacity: 0.3 }}>â€¢â€¢â€¢â€¢</span>{' '}<span style={{ opacity: 0.3 }}>â€¢â€¢â€¢â€¢</span>{' '}
            <span style={{ opacity: 1, color: 'white', fontWeight: 'bold' }}>{card.last4}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-end relative z-10" style={{ transform: 'translateZ(30px)' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{card.label}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
              {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
            </div>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', fontStyle: 'italic', opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {card.brand.toUpperCase()}
          </span>
        </div>
      {card.spending_limit && (
        <div style={{ marginTop: '16px' }}>
          <div className="flex justify-between" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            <span>{card.spent_this_month.toLocaleString()} DZD spent</span>
            <span>{card.spending_limit.toLocaleString()} DZD limit</span>
          </div>
          <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ width: `${spendPct}%`, height: '100%', borderRadius: '2px', background: spendPct > 80 ? 'var(--accent-danger)' : 'var(--accent-success)', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}
      <div className="flex gap-2" style={{ marginTop: '14px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); if (isFrozen) { onUnfreeze(card.id); } else { onFreeze(card.id); } }}
          style={{
            padding: '5px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600,
            background: isFrozen ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.1)',
            color: isFrozen ? 'var(--accent-success)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isFrozen ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.15)'}`,
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
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
          }}
        >
          <MoreVertical size={10} />
        </motion.button>
      </div>
    </motion.div>
  </div>
  );
};

/* â”€â”€ Main Wallet Page â”€â”€ */
const WalletPage: React.FC = () => {
  const { wallets, cards, transactions, totalBalance, freezeCard, unfreezeCard } = useWallet();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copiedIban, setCopiedIban] = useState(false);

  const recentTxns = transactions.slice(0, 8);

  const handleCopyIban = () => {
    navigator.clipboard.writeText('DZ58 0001 0000 0000 1234 5678 90');
    setCopiedIban(true);
    addToast({ type: 'success', title: 'Copied!', message: 'IBAN copied to clipboard' });
    setTimeout(() => setCopiedIban(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
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
      <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
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
                style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)' }}
              >
                {balanceVisible ? `${totalBalance.toLocaleString()} DZD` : 'â€¢â€¢â€¢â€¢â€¢â€¢ DZD'}
              </motion.h2>
            </AnimatePresence>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1" style={{ color: 'var(--accent-success)', fontSize: '0.8rem', fontWeight: 600 }}>
                <TrendingUp size={14} /> +12.4%
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>vs last month</span>
            </div>
          </div>

          {/* IBAN badge */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyIban}
            className="flex items-center gap-2"
            style={{
              padding: '8px 14px', borderRadius: '12px',
              background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copiedIban ? <CheckCircle size={13} style={{ color: 'var(--accent-success)' }} /> : <Copy size={13} style={{ color: 'var(--text-tertiary)' }} />}
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              DZ58 â€¢â€¢â€¢â€¢ 5678 90
            </span>
          </motion.button>
        </div>

        {/* Sub-wallets */}
        <div className="flex gap-4" style={{ marginTop: '24px' }}>
          {wallets.map((w) => (
            <motion.div whileHover={{ y: -2 }} key={w.id} style={{
              padding: '16px 20px', borderRadius: '14px', flex: 1,
              background: w.is_primary ? 'var(--brand-primary-bg)' : 'var(--bg-inset)',
              border: `1px solid ${w.is_primary ? 'rgba(0, 198, 174,0.15)' : 'var(--border-subtle)'}`,
              boxShadow: w.is_primary ? '0 4px 16px rgba(0, 198, 174,0.08)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '0.65rem', color: w.is_primary ? 'var(--brand-primary)' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontWeight: w.is_primary ? 600 : 500 }}>{w.name}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {balanceVisible ? w.balance.toLocaleString() : 'â€¢â€¢â€¢â€¢â€¢â€¢'}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>{w.currency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex gap-4 mb-8">
        <QuickAction icon={<Send size={20} />} label="Send Money" color="var(--brand-primary)" onClick={() => navigate('/app/send')} />
        <QuickAction icon={<ArrowDownRight size={20} />} label="Request" color="#00B8A9" />
        <QuickAction icon={<Plus size={20} />} label="Top Up" color="var(--accent-success)" />
        <QuickAction icon={<Receipt size={20} />} label="Pay Bills" color="var(--brand-primary)" />
        <QuickAction icon={<Building size={20} />} label="Bank Transfer" color="var(--brand-primary)" />
        <QuickAction icon={<QrCode size={20} />} label="QR Pay" color="var(--accent-danger)" />
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
                onFreeze={(id) => {
                  freezeCard(id);
                  addToast({ type: 'warning', title: 'Card Frozen', message: `Card â€¢â€¢${card.last4} has been frozen.` });
                }}
                onUnfreeze={(id) => {
                  unfreezeCard(id);
                  addToast({ type: 'success', title: 'Card Activated', message: `Card â€¢â€¢${card.last4} is now active.` });
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Transactions Column */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3">Recent Activity</h3>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => navigate('/app/transactions')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="liquid-glass-card mesh-bg" style={{ padding: 0, overflow: 'hidden' }}>
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
                onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-inset)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: txn.amount > 0 ? 'var(--accent-success-bg)' : 'var(--brand-primary-bg)',
                    color: txn.amount > 0 ? 'var(--accent-success)' : 'var(--brand-primary)',
                    border: `1px solid ${txn.amount > 0 ? 'var(--accent-success-glow)' : 'rgba(0, 198, 174,0.12)'}`,
                  }}>
                    {txn.amount > 0 ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{txn.description}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                      {txn.counterparty || txn.category} Â· {new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                    color: txn.amount > 0 ? '#16A34A' : 'var(--text-primary)',
                  }}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} {txn.currency}
                  </p>
                  {txn.status === 'pending' && (
                    <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>PENDING</span>
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






