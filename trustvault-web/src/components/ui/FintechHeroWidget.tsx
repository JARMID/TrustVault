import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, ArrowUpRight, ArrowDownRight, Zap, Lock } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

/* ── Live transaction feed data ── */
const TRANSACTIONS = [
  { id: 1, name: 'Netflix Premium',    amount: -1599,  cat: 'Streaming',   icon: '▶', color: '#E50914' },
  { id: 2, name: 'Salary Deposit',     amount: 185000, cat: 'Income',      icon: '💳', color: '#00C6AE' },
  { id: 3, name: 'Uber Eats',          amount: -3200,  cat: 'Food',        icon: '🍔', color: '#06B6D4' },
  { id: 4, name: 'Apple Pay',          amount: -8500,  cat: 'Shopping',    icon: '🛍', color: '#A78BFA' },
  { id: 5, name: 'Transfer Received',  amount: 25000,  cat: 'Transfer',    icon: '⬆', color: '#00C6AE' },
  { id: 6, name: 'Electricity Bill',   amount: -4200,  cat: 'Utilities',   icon: '⚡', color: '#F59E0B' },
];

/* ── TV Monogram SVG — engrained into card surface ── */
const TVMonogram = ({ color = 'rgba(255,255,255,0.06)', size = 100 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="18" width="70" height="8" rx="1" fill={color} />
    <rect x="43" y="18" width="14" height="62" rx="1" fill={color} />
    <polygon points="20,18 36,18 56,80 44,80" fill={color} />
    <polygon points="80,18 64,18 44,80 56,80" fill={color} />
  </svg>
);

interface FintechHeroWidgetProps {
  hideTransactions?: boolean;
}

const FintechHeroWidget: React.FC<FintechHeroWidgetProps> = ({ hideTransactions = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTxn, setActiveTxn] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (hideTransactions) return;
    const interval = setInterval(() => setActiveTxn(prev => (prev + 1) % TRANSACTIONS.length), 2800);
    return () => clearInterval(interval);
  }, [hideTransactions]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    setMousePos({ x, y });
  };
  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  /* ── Theme-aware card styles ── */
  const frontBg = isDark
    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16162a 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 50%, #dfe3e8 100%)';
  const frontTexture = isDark ? '/card_dark_texture.png' : '/card_light_texture.png';
  const textColor = isDark ? '#ffffff' : '#1e293b';
  const textSecondary = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)';
  const logoWatermark = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const shimmerColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)';
  const contactlessStroke = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.25)';
  const mcBlendMode = isDark ? 'screen' : 'multiply';
  const backBg = isDark
    ? 'linear-gradient(135deg, #0d0d1a 0%, #111122 50%, #0a0a15 100%)'
    : 'linear-gradient(135deg, #e4e8ec 0%, #d8dce0 50%, #cdd2d6 100%)';
  const backStripe = isDark ? '#111' : '#334155';
  const backText = isDark ? 'rgba(255,255,255,0.35)' : '#64748b';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 20, position: 'relative' }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: hideTransactions ? '50%' : '20%', left: '50%', transform: hideTransactions ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,198,174,${isDark ? 0.15 : 0.08}) 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* ── CREDIT CARD ── */}
      <div
        ref={setCardEl}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(f => !f)}
        style={{ perspective: 1000, cursor: 'pointer', position: 'relative', zIndex: 2 }}
      >
        <motion.div
          animate={
            (mousePos.x !== 0 || mousePos.y !== 0) ? {
              rotateY: isFlipped ? 180 : 0,
              rotateX: mousePos.y,
              rotateZ: mousePos.x * 0.3,
              y: 0,
            } : {
              rotateY: isFlipped ? 180 : 0,
              rotateX: [0, 4, 0, -4, 0],
              rotateZ: [0, 2, 0, -2, 0],
              y: [0, -8, 0],
            }
          }
          transition={
            (mousePos.x !== 0 || mousePos.y !== 0) 
              ? { type: 'spring' as const, stiffness: 120, damping: 18 }
              : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            width: 340, height: 210,
            transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d',
            position: 'relative'
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)', WebkitTransform: 'translateZ(1px)',
            borderRadius: 20, padding: 20,
            background: frontBg,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 30px 60px ${shadowColor}, inset 0 1px 0 ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)'}`,
            overflow: 'hidden',
          }}>
            {/* Texture */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${frontTexture})`, backgroundSize: 'cover', opacity: isDark ? 0.35 : 0.25, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

            {/* Logo watermark */}
            <div style={{ position: 'absolute', right: -5, bottom: -10, pointerEvents: 'none' }}>
              <TVMonogram color={logoWatermark} size={130} />
            </div>

            {/* Shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '60%', height: '100%',
                background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                transform: 'skewX(-20deg)', pointerEvents: 'none', mixBlendMode: 'screen',
              }}
            />

            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src="/vault_logo_transparent.png" alt="TV" style={{ width: 22, height: 22, objectFit: 'contain', filter: isDark ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textColor, letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>TRUSTVAULT</span>
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={contactlessStroke} strokeWidth="1.5">
                <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5" strokeLinecap="round" />
                <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1" fill={contactlessStroke} stroke="none" />
              </svg>
            </div>

            {/* Chip */}
            <div style={{ margin: '16px 0 12px', position: 'relative', zIndex: 1, width: 38, boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.1)', borderRadius: 4 }}>
              <svg width="38" height="30" viewBox="0 0 38 30" fill="none">
                <defs>
                  <linearGradient id="chipGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e5c158" />
                    <stop offset="50%" stopColor="#fde08b" />
                    <stop offset="100%" stopColor="#d4af37" />
                  </linearGradient>
                </defs>
                <rect x="0.5" y="0.5" width="37" height="29" rx="4.5" stroke="rgba(0,0,0,0.15)" fill="url(#chipGradHero)" />
                <path d="M 12 0.5 L 12 29.5 M 26 0.5 L 26 29.5 M 0.5 10 L 37.5 10 M 0.5 20 L 37.5 20" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                <circle cx="19" cy="15" r="2.5" fill="none" stroke="rgba(0,0,0,0.1)" />
              </svg>
            </div>

            {/* Card number */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, color: textColor, letterSpacing: '0.22em', marginBottom: 12, position: 'relative', zIndex: 1, textShadow: isDark ? '0 1px 4px rgba(0,0,0,0.5)' : 'none' }}>
              4728 •••• •••• 3291
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: textSecondary, letterSpacing: '0.12em' }}>VALID THRU 12/28</span>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EB001B', opacity: 0.9 }} />
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F79E1B', opacity: 0.9, marginLeft: -8, mixBlendMode: mcBlendMode as any }} />
              </div>
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)', WebkitTransform: 'rotateY(180deg) translateZ(1px)',
            borderRadius: 20,
            background: backBg,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 30px 60px ${shadowColor}`,
            overflow: 'hidden',
          }}>
            {/* Texture on back */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${frontTexture})`, backgroundSize: 'cover', opacity: isDark ? 0.25 : 0.15, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

            {/* Logo watermark back */}
            <div style={{ position: 'absolute', left: 10, bottom: 30, pointerEvents: 'none' }}>
              <TVMonogram color={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)'} size={80} />
            </div>

            {/* Magnetic stripe */}
            <div style={{ width: '100%', height: 40, background: backStripe, marginTop: 24, boxShadow: isDark ? 'inset 0 -1px 3px rgba(255,255,255,0.05)' : 'inset 0 -1px 2px rgba(0,0,0,0.1)' }} />
            {/* Signature + CVV */}
            <div style={{ margin: '14px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 34, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)', color: isDark ? '#fff' : '#000' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#fff' : '#1e293b', background: isDark ? 'rgba(255,255,255,0.08)' : '#fff', padding: '4px 10px', borderRadius: 4, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>392</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.55rem', color: backText, fontFamily: 'var(--font-mono)', padding: '0 18px', letterSpacing: '0.08em' }}>
              AES-256-GCM ENCRYPTED · PCI-DSS COMPLIANT
            </div>
            <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lock size={10} color="#00C6AE" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#00C6AE', fontWeight: 700, letterSpacing: '0.1em' }}>TRUSTVAULT SECURED</span>
            </div>
          </div>
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.55rem', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
          CLICK TO FLIP
        </div>
      </div>

      {/* ── LIVE TRANSACTION FEED ── */}
      {!hideTransactions && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          width: 340,
          background: isDark ? 'rgba(10, 14, 26, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          borderRadius: 16, padding: 16,
          position: 'relative', zIndex: 2,
          boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C6AE' }}
            />
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', letterSpacing: '0.1em' }}>LIVE ACTIVITY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={11} color="rgba(0,198,174,0.7)" />
            <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,198,174,0.7)' }}>REAL-TIME</span>
          </div>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
          <div style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>TOTAL BALANCE</div>
          <motion.div
            key={activeTxn}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isDark ? '#fff' : '#0F172A' }}
          >
            248,315 <span style={{ fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}>DZD</span>
          </motion.div>
          <div style={{ fontSize: '0.7rem', color: '#00C6AE', marginTop: 2 }}>↑ +12.4% this month</div>
        </div>

        {/* Transactions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {TRANSACTIONS.slice(0, 3).map((txn, i) => (
              <motion.div
                key={`${txn.id}-${activeTxn}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.06, type: 'spring' as const, stiffness: 300, damping: 25 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 10,
                  background: i === 0 ? (isDark ? 'rgba(0,198,174,0.06)' : 'rgba(0,198,174,0.05)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                  border: i === 0 ? '1px solid rgba(0,198,174,0.15)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${txn.color}18`,
                  border: `1px solid ${txn.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', flexShrink: 0,
                }}>
                  {txn.amount > 0 ? <ArrowDownRight size={14} color={txn.color} /> : <ArrowUpRight size={14} color={txn.color} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isDark ? '#fff' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txn.name}</div>
                  <div style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>{txn.cat}</div>
                </div>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: txn.amount > 0 ? '#00C6AE' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                  whiteSpace: 'nowrap',
                }}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` }}>
          <Wifi size={11} color={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'} />
          <span style={{ fontSize: '0.58rem', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>END-TO-END ENCRYPTED · AES-256-GCM</span>
          <Lock size={10} color={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'} />
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default FintechHeroWidget;
