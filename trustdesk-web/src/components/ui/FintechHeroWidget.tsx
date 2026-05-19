import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Shield, ArrowUpRight, ArrowDownRight, Zap, Lock } from 'lucide-react';

/* ── Live transaction feed data ── */
const TRANSACTIONS = [
  { id: 1, name: 'Netflix Premium',    amount: -1599,  cat: 'Streaming',   icon: '▶', color: '#E50914' },
  { id: 2, name: 'Salary Deposit',     amount: 185000, cat: 'Income',      icon: '💳', color: '#00C6AE' },
  { id: 3, name: 'Uber Eats',          amount: -3200,  cat: 'Food',        icon: '🍔', color: '#06B6D4' },
  { id: 4, name: 'Apple Pay',          amount: -8500,  cat: 'Shopping',    icon: '🛍', color: '#A78BFA' },
  { id: 5, name: 'Transfer Received',  amount: 25000,  cat: 'Transfer',    icon: '⬆', color: '#00C6AE' },
  { id: 6, name: 'Electricity Bill',   amount: -4200,  cat: 'Utilities',   icon: '⚡', color: '#F59E0B' },
];

/* ── Card chip SVG ── */
const Chip = () => (
  <svg width="38" height="30" viewBox="0 0 38 30" fill="none">
    <rect x="0.5" y="0.5" width="37" height="29" rx="4.5" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.12)" />
    <line x1="13" y1="0.5" x2="13" y2="29.5" stroke="rgba(255,255,255,0.2)" />
    <line x1="25" y1="0.5" x2="25" y2="29.5" stroke="rgba(255,255,255,0.2)" />
    <line x1="0.5" y1="10" x2="37.5" y2="10" stroke="rgba(255,255,255,0.2)" />
    <line x1="0.5" y1="20" x2="37.5" y2="20" stroke="rgba(255,255,255,0.2)" />
  </svg>
);

/* ── Contactless icon ── */
const Contactless = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
    <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5" strokeLinecap="round"/>
    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.6)" stroke="none"/>
  </svg>
);

const FintechHeroWidget: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTxn, setActiveTxn] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  /* Rotate card through transactions */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTxn(prev => (prev + 1) % TRANSACTIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  /* Mouse parallax on card */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef) return;
    const rect = cardRef.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    setMousePos({ x, y });
  };
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '20px', position: 'relative' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,198,174,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* ── CREDIT CARD ── */}
      <div
        ref={setCardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(f => !f)}
        style={{ perspective: '1000px', cursor: 'pointer', position: 'relative', zIndex: 2 }}
      >
        <motion.div
          animate={{
            rotateY: isFlipped ? 180 : 0,
            rotateX: mousePos.y,
            rotateZ: mousePos.x * 0.3,
          }}
          transition={{ type: 'spring' as const, stiffness: 120, damping: 18 }}
          style={{ 
            width: '340px', 
            height: '210px', 
            transformStyle: 'preserve-3d', 
            WebkitTransformStyle: 'preserve-3d',
            position: 'relative' 
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute', 
            inset: 0, 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            WebkitTransform: 'translateZ(1px)',
            borderRadius: '20px', 
            padding: '24px',
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}>
            {/* Holographic shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '60%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                transform: 'skewX(-20deg)', pointerEvents: 'none',
              }}
            />
            {/* Card pattern */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '20px',
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(0,198,174,0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,102,241,0.12) 0%, transparent 50%)',
            }} />

            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,198,174,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color="#000" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>TRUSTVAULT</span>
              </div>
              <Contactless />
            </div>

            {/* Chip */}
            <div style={{ margin: '20px 0 16px', position: 'relative', zIndex: 1 }}>
              <Chip />
            </div>

            {/* Card number */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.22em', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
              4728 •••• •••• 3291
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>CARDHOLDER</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em' }}>KARIM BENALI</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>EXPIRES</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-mono)' }}>12/27</div>
              </div>
              {/* Mastercard circles */}
              <div style={{ display: 'flex', marginLeft: '12px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EB001B', opacity: 0.9 }} />
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F79E1B', opacity: 0.9, marginLeft: '-10px' }} />
              </div>
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', 
            inset: 0, 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            WebkitTransform: 'rotateY(180deg) translateZ(1px)',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>
            {/* Magnetic stripe */}
            <div style={{ width: '100%', height: '44px', background: '#111', marginTop: '28px' }} />
            {/* Signature strip */}
            <div style={{ margin: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '36px', background: 'repeating-linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 2px, #f0f0f0 4px)', borderRadius: '4px' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '4px' }}>392</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', padding: '0 20px' }}>
              AES-256-GCM ENCRYPTED · PCI-DSS COMPLIANT · ZERO-TRUST ARCHITECTURE
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={12} color="rgba(0,198,174,0.6)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(0,198,174,0.6)' }}>TRUSTVAULT SECURED</span>
            </div>
          </div>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
          CLICK TO FLIP
        </div>
      </div>

      {/* ── LIVE TRANSACTION FEED ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          width: '340px',
          background: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '16px',
          position: 'relative', zIndex: 2,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C6AE' }}
            />
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>LIVE ACTIVITY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={11} color="rgba(0,198,174,0.7)" />
            <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,198,174,0.7)' }}>REAL-TIME</span>
          </div>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>TOTAL BALANCE</div>
          <motion.div
            key={activeTxn}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}
          >
            248,315 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>DZD</span>
          </motion.div>
          <div style={{ fontSize: '0.7rem', color: '#00C6AE', marginTop: '2px' }}>↑ +12.4% this month</div>
        </div>

        {/* Transactions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <AnimatePresence mode="popLayout">
            {TRANSACTIONS.slice(0, 3).map((txn, i) => (
              <motion.div
                key={`${txn.id}-${activeTxn}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.06, type: 'spring' as const, stiffness: 300, damping: 25 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '10px',
                  background: i === 0 ? 'rgba(0,198,174,0.06)' : 'rgba(255,255,255,0.03)',
                  border: i === 0 ? '1px solid rgba(0,198,174,0.15)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: `${txn.color}18`,
                  border: `1px solid ${txn.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', flexShrink: 0,
                }}>
                  {txn.amount > 0 ? <ArrowDownRight size={14} color={txn.color} /> : <ArrowUpRight size={14} color={txn.color} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txn.name}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>{txn.cat}</div>
                </div>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: txn.amount > 0 ? '#00C6AE' : 'rgba(255,255,255,0.7)',
                  whiteSpace: 'nowrap',
                }}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Security badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Wifi size={11} color="rgba(255,255,255,0.25)" />
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>END-TO-END ENCRYPTED · AES-256-GCM</span>
          <Lock size={10} color="rgba(255,255,255,0.25)" />
        </div>
      </motion.div>
    </div>
  );
};

export default FintechHeroWidget;
