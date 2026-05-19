import React, { useState } from 'react';
import { motion, } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  CreditCard, Plus, Snowflake, Zap, Shield, Eye, EyeOff, Settings,
  Copy, AlertTriangle, Globe,
  ShoppingBag, Wifi, Sliders
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../components/ui/Toast';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

/* â”€â”€ Toggle Switch â”€â”€ */
const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <motion.button
    onClick={onChange}
    style={{
      width: '42px', height: '24px', borderRadius: '12px', padding: '2px',
      background: enabled ? 'var(--brand-primary)' : 'var(--bg-inset)',
      border: `1px solid ${enabled ? 'rgba(0, 198, 174,0.3)' : 'var(--border-subtle)'}`,
      cursor: 'pointer', position: 'relative', transition: 'all 0.3s',
    }}
  >
    <motion.div
      animate={{ x: enabled ? 18 : 0 }}
      transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
      style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }}
    />
  </motion.button>
);

/* â”€â”€ Card Visual â”€â”€ */
const CardVisual: React.FC<{
  card: any; selected: boolean; onClick: () => void;
}> = ({ card, selected, onClick }) => {
  const isFrozen = card.status === 'frozen';
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: isFrozen
          ? 'var(--bg-inset)'
          : 'var(--bg-surface)',
        borderRadius: '18px', padding: '24px', cursor: 'pointer',
        boxShadow: selected
          ? '0 0 0 1px var(--brand-primary), 0 0 40px var(--brand-primary-glow)'
          : isFrozen ? 'var(--shadow-md)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
        position: 'relative', overflow: 'hidden',
        filter: isFrozen ? 'saturate(0.6)' : 'none',
        transition: 'box-shadow 0.3s',
        minWidth: '260px',
      }}
    >
      {/* Glass reflection */}
      <div style={{
        position: 'absolute', top: 0, left: '-50%', width: '200%', height: '100%',
        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)',
        transform: 'rotate(-15deg) translateY(-20%)', pointerEvents: 'none'
      }} />
      {isFrozen && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(255,255,255,0.12)', borderRadius: '6px', padding: '3px 8px',
          display: 'flex', alignItems: 'center', gap: '3px', backdropFilter: 'blur(8px)',
        }}>
          <Snowflake size={9} style={{ color: 'white' }} />
          <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'white', letterSpacing: '0.1em' }}>FROZEN</span>
        </div>
      )}
      <div className="flex justify-between items-start" style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{card.label}</span>
        <div style={{ width: '30px', height: '22px', borderRadius: '3px', background: 'linear-gradient(135deg, #00C6AE, #009e8b)', opacity: 0.85 }} />
      </div>
      <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', color: 'white', marginBottom: '18px' }}>
        <span style={{ opacity: 0.35 }}>â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢</span> {card.last4}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1px' }}>EXPIRES</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'white' }}>
            {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-display)' }}>
          {card.brand.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};

/* â”€â”€ Main Cards Page â”€â”€ */
const CardsPage: React.FC = () => {
  const { cards, freezeCard, unfreezeCard } = useWallet();
  const { addToast } = useToast();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [showCardNumber, setShowCardNumber] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedCardId);

  // Card control toggles
  const [controls, setControls] = useState({
    onlinePurchases: true,
    contactless: true,
    internationalTxns: false,
    atmWithdrawals: true,
    subscriptions: true,
  });

  const toggleControl = (key: keyof typeof controls) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
    addToast({
      type: 'success',
      title: 'Card Updated',
      message: `${key.replace(/([A-Z])/g, ' $1').trim()} ${controls[key] ? 'disabled' : 'enabled'}`,
    });
  };

  if (!selectedCard) return null;

  const isFrozen = selectedCard.status === 'frozen';
  const spendPct = selectedCard.spending_limit
    ? Math.min(100, (selectedCard.spent_this_month / selectedCard.spending_limit) * 100)
    : 0;

  return (
    <div style={{ position: 'relative' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-h1 gradient-text" style={{ marginBottom: '4px' }}>Cards</h1>
            <p className="text-sm">Manage your virtual and physical cards</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ borderRadius: '12px' }}
            onClick={() => addToast({ type: 'info', title: 'Coming soon', message: 'New card creation will be available shortly.' })}
          >
            <Plus size={16} /> Add Card
          </motion.button>
        </motion.div>

        {/* Cards Carousel */}
        <motion.div variants={itemVariants} className="flex gap-5 mb-8" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          {cards.map((card) => (
            <CardVisual
              key={card.id}
              card={card}
              selected={card.id === selectedCardId}
              onClick={() => setSelectedCardId(card.id)}
            />
          ))}
          {/* Add new card placeholder */}
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              minWidth: '260px', borderRadius: '18px', padding: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: 'pointer',
              background: 'var(--bg-inset)', border: '2px dashed var(--border-subtle)',
              transition: 'all 0.3s',
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'var(--brand-primary-bg)', border: '1px solid rgba(0, 198, 174,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)',
            }}>
              <Plus size={22} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Add New Card</span>
          </motion.div>
        </motion.div>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Card Details */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '28px' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-h3">Card Details</h3>
              <span style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                background: isFrozen ? 'var(--bg-inset)' : 'rgba(0, 198, 174, 0.1)',
                color: isFrozen ? 'var(--text-tertiary)' : 'var(--accent-success)',
                border: `1px solid ${isFrozen ? '1px solid var(--border-subtle)' : '1px solid rgba(0, 198, 174, 0.2)'}`,
              }}>
                {isFrozen ? 'Frozen' : 'Active'}
              </span>
            </div>

            {/* Card number */}
            <div style={{
              padding: '16px', borderRadius: '12px',
              background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
            }}>
              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Card Number</p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                    {showCardNumber ? `4532 8912 3456 ${selectedCard.last4}` : `â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ ${selectedCard.last4}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    style={{
                      width: '34px', height: '34px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                      cursor: 'pointer', color: 'var(--text-secondary)',
                    }}
                  >
                    {showCardNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(`4532 8912 3456 ${selectedCard.last4}`);
                      addToast({ type: 'success', title: 'Copied!', message: 'Card number copied to clipboard' });
                    }}
                    style={{
                      width: '34px', height: '34px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                      cursor: 'pointer', color: 'var(--text-secondary)',
                    }}
                  >
                    <Copy size={14} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Card info row */}
            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '20px' }}>
              {[
                { label: 'Expiry', value: `${String(selectedCard.expiry_month).padStart(2, '0')}/${String(selectedCard.expiry_year).slice(-2)}` },
                { label: 'CVV', value: showCardNumber ? '842' : 'â€¢â€¢â€¢' },
                { label: 'Brand', value: selectedCard.brand.toUpperCase() },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '12px', borderRadius: '10px',
                  background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
                }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{item.label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Spending limit */}
            {selectedCard.spending_limit && (
              <div style={{ marginBottom: '20px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Spending</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: spendPct > 80 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                    {selectedCard.spent_this_month.toLocaleString()} / {selectedCard.spending_limit.toLocaleString()} DZD
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--bg-inset)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spendPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%', borderRadius: '3px',
                      background: spendPct > 80 ? 'var(--accent-danger)' : spendPct > 50 ? 'var(--brand-primary)' : 'var(--brand-primary)',
                    }}
                  />
                </div>
                {spendPct > 80 && (
                  <div className="flex items-center gap-1 mt-2" style={{ fontSize: '0.65rem', color: 'var(--accent-danger)' }}>
                    <AlertTriangle size={11} /> Approaching spending limit
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (isFrozen) {
                    unfreezeCard(selectedCard.id);
                    addToast({ type: 'success', title: 'Card Activated', message: `Card â€¢â€¢${selectedCard.last4} is now active.` });
                  } else {
                    freezeCard(selectedCard.id);
                    addToast({ type: 'warning', title: 'Card Frozen', message: `Card â€¢â€¢${selectedCard.last4} has been frozen.` });
                  }
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  background: isFrozen ? 'rgba(0, 198, 174,0.08)' : 'rgba(0, 198, 174,0.06)',
                  color: isFrozen ? 'var(--accent-success)' : 'var(--brand-primary)',
                  border: `1px solid ${isFrozen ? 'rgba(0, 198, 174,0.15)' : 'rgba(0, 198, 174,0.12)'}`,
                }}
              >
                {isFrozen ? <><Zap size={14} /> Unfreeze</> : <><Snowflake size={14} /> Freeze</>}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => {}}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  background: 'var(--bg-inset)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Sliders size={14} /> Set Limit
              </motion.button>
            </div>
          </motion.div>

          {/* Card Controls */}
          <motion.div variants={itemVariants} className="liquid-glass-card mesh-bg" style={{ padding: '28px' }}>
            <h3 className="text-h3 mb-6">Card Controls</h3>
            <div className="flex flex-col gap-1">
              {[
                { key: 'onlinePurchases' as const, icon: <ShoppingBag size={16} />, label: 'Online Purchases', desc: 'Allow online and e-commerce transactions', color: 'var(--text-primary)' },
                { key: 'contactless' as const, icon: <Wifi size={16} />, label: 'Contactless Payments', desc: 'NFC and tap-to-pay transactions', color: 'var(--accent-success)' },
                { key: 'internationalTxns' as const, icon: <Globe size={16} />, label: 'International Transactions', desc: 'Cross-border and foreign currency payments', color: 'var(--brand-primary)' },
                { key: 'atmWithdrawals' as const, icon: <CreditCard size={16} />, label: 'ATM Withdrawals', desc: 'Cash withdrawals at ATM machines', color: 'var(--text-secondary)' },
                { key: 'subscriptions' as const, icon: <Settings size={16} />, label: 'Subscriptions', desc: 'Recurring payments and auto-renewals', color: 'var(--text-primary)' },
              ].map((ctrl) => (
                <div
                  key={ctrl.key}
                  className="flex items-center gap-4"
                  style={{
                    padding: '14px 16px', borderRadius: '14px',
                    transition: 'background 0.2s', cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-inset)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: ctrl.color,
                    flexShrink: 0,
                  }}>
                    {ctrl.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{ctrl.label}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{ctrl.desc}</p>
                  </div>
                  <Toggle enabled={controls[ctrl.key]} onChange={() => toggleControl(ctrl.key)} />
                </div>
              ))}
            </div>

            {/* Security info */}
            <div style={{
              marginTop: '20px', padding: '16px', borderRadius: '12px',
              background: 'rgba(0, 198, 174,0.04)', border: '1px solid rgba(0, 198, 174,0.08)',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)' }}>Security Notice</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                All card transactions are protected by 3D Secure authentication and real-time fraud monitoring. 
                Changes to card controls take effect immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardsPage;








