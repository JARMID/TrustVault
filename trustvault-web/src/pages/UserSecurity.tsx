import React, { useState } from 'react';
import { Shield, Smartphone, AlertTriangle, Fingerprint, Laptop, XCircle, Lock, Clock, MapPin, CheckCircle, Key, Globe, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/ui/TiltCard';

const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const iV = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } };

const SESSIONS = [
  { device: 'MacBook Pro 16"', os: 'macOS Sequoia', browser: 'Chrome 126', location: 'Algiers, DZ', ip: '105.101.42.19', current: true, lastActive: 'Now' },
  { device: 'iPhone 15 Pro', os: 'iOS 18', browser: 'TrustVault App', location: 'Oran, DZ', ip: '41.200.12.99', current: false, lastActive: '2h ago' },
];

const LOGIN_HISTORY = [
  { time: 'Today, 09:14', device: 'Chrome Â· macOS', location: 'Algiers', status: 'success' },
  { time: 'Today, 08:02', device: 'TrustVault App Â· iOS', location: 'Oran', status: 'success' },
  { time: 'Yesterday, 22:31', device: 'Firefox Â· Windows', location: 'Unknown (VPN)', status: 'blocked' },
  { time: 'Yesterday, 14:15', device: 'Chrome Â· macOS', location: 'Algiers', status: 'success' },
  { time: 'May 16, 11:08', device: 'Safari Â· macOS', location: 'Constantine', status: 'success' },
];

const CONNECTED_APPS = [
  { name: 'Mobilis Pay', scope: 'Read balance, Send money', connected: 'Mar 12, 2026', icon: 'ðŸ“±' },
  { name: 'Baridimob', scope: 'Read transactions', connected: 'Jan 5, 2026', icon: 'ðŸ ¦' },
];

const UserSecurity: React.FC = () => {
  const [isWalletFrozen, setIsWalletFrozen] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const securityScore = 92;

  const toggleFreeze = () => { if (!isWalletFrozen) setShowFreezeModal(true); else setIsWalletFrozen(false); };
  const confirmFreeze = () => { setIsWalletFrozen(true); setShowFreezeModal(false); };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(0, 198, 174,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(239, 68, 68,0.03) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={cV} initial="hidden" animate="show" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="flex justify-between items-end" style={{ marginBottom: '32px' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h1 gradient-text">Account Security</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'var(--accent-success-bg)', border: '1px solid rgba(0, 198, 174,0.15)' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-success)', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', letterSpacing: '0.08em' }}>PROTECTED</span>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Manage authentication, sessions, and emergency wallet controls.</p>
          </div>
        </div>

        {/* Top row: Score + 2FA + Emergency */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '200px 1fr 320px', marginBottom: '24px' }}>

          {/* Security Score */}
          <TiltCard variants={iV} className="mesh-bg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '12px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(0,198,174,0.6)]">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand-primary)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42 * securityScore / 100} ${2 * Math.PI * 42}`} transform="rotate(-90 50 50)" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 198, 174,0.8))' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{securityScore}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.08em' }}>/ 100</span>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Security Score</span>
            <span style={{ fontSize: '0.65rem', color: '#16A34A', fontWeight: 600, marginTop: '4px' }}>Excellent</span>
          </TiltCard>

          {/* 2FA Card */}
          <TiltCard variants={iV} className="mesh-bg">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--brand-primary)' }} /> Two-Factor Authentication
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { icon: <Smartphone size={18} />, name: 'Authenticator App', desc: 'Google Authenticator / Authy', enabled: true },
                { icon: <Fingerprint size={18} />, name: 'Biometric Login', desc: 'FaceID / TouchID', enabled: false },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--bg-inset)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.enabled ? 'rgba(0, 198, 174,0.06)' : 'var(--bg-inset)', border: `1px solid ${m.enabled ? 'rgba(0, 198, 174,0.12)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.enabled ? 'var(--brand-primary)' : 'var(--text-tertiary)' }}>{m.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{m.desc}</p>
                    </div>
                  </div>
                  {m.enabled ? (
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(0, 198, 174,0.08)', color: '#16A34A', border: '1px solid rgba(0, 198, 174,0.15)' }}>ENABLED</span>
                  ) : (
                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px' }}>Setup</button>
                  )}
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Emergency Lockdown */}
          <TiltCard variants={iV} style={{
            background: isWalletFrozen ? 'rgba(239, 68, 68,0.04)' : 'var(--bg-surface)',
            border: `2px solid ${isWalletFrozen ? 'rgba(239, 68, 68,0.3)' : 'rgba(255,255,255,0.03)'}`,
            boxShadow: isWalletFrozen ? '0 0 30px rgba(239, 68, 68,0.08)' : 'var(--shadow-card)',
            transition: 'all 0.3s',
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: isWalletFrozen ? 'radial-gradient(circle at top right, rgba(239, 68, 68,0.15) 0%, transparent 70%)' : 'radial-gradient(circle at top right, rgba(239, 68, 68,0.05) 0%, transparent 70%)' }}/>
            {isWalletFrozen && <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68,0.3) 10px, rgba(239, 68, 68,0.3) 20px)' }} />}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', background: isWalletFrozen ? 'rgba(239, 68, 68,0.1)' : 'var(--bg-inset)', color: isWalletFrozen ? 'var(--accent-danger)' : 'var(--text-tertiary)', border: `1px solid ${isWalletFrozen ? 'rgba(239, 68, 68,0.2)' : 'var(--border-subtle)'}` }}>
                <AlertTriangle size={22} className={isWalletFrozen ? 'animate-pulse' : ''} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: isWalletFrozen ? 'var(--accent-danger)' : 'var(--text-primary)', marginBottom: '8px' }}>
                {isWalletFrozen ? 'WALLET FROZEN' : 'Emergency Lockdown'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {isWalletFrozen ? 'All outgoing transactions, API keys, and integrations are suspended.' : 'Instantly block all outgoing transfers if your account is compromised.'}
              </p>
              <button onClick={toggleFreeze} style={{
                width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s', letterSpacing: '0.04em',
                background: isWalletFrozen ? 'transparent' : 'var(--accent-danger)', color: isWalletFrozen ? 'var(--accent-danger)' : 'white',
                border: isWalletFrozen ? '1px solid rgba(239, 68, 68,0.4)' : 'none',
                boxShadow: isWalletFrozen ? 'none' : '0 4px 16px rgba(239, 68, 68,0.25)',
              }}>
                {isWalletFrozen ? 'LIFT LOCKDOWN' : 'FREEZE WALLET'}
              </button>
            </div>
          </TiltCard>
        </div>

        {/* Bottom row: Sessions + Login Activity + Connected Apps */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>

          {/* Active Sessions */}
          <TiltCard variants={iV} className="mesh-bg">
            <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Laptop size={18} style={{ color: 'var(--brand-primary)' }} /> Active Sessions
              </h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{SESSIONS.length} devices</span>
            </div>
            <div className="flex flex-col gap-3">
              {SESSIONS.map((s, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--bg-inset)', borderRadius: '12px', border: `1px solid ${s.current ? 'rgba(0, 198, 174,0.12)' : 'var(--border-subtle)'}` }}>
                  <div className="flex items-center gap-3">
                    <Laptop size={20} style={{ color: s.current ? 'var(--brand-primary)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {s.device}
                        {s.current && <span style={{ fontSize: '0.55rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 198, 174,0.08)', color: 'var(--brand-primary)', fontWeight: 700, letterSpacing: '0.06em' }}>THIS DEVICE</span>}
                      </p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{s.location} Â· {s.ip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{s.lastActive}</span>
                    {!s.current && (
                      <button style={{ color: 'var(--accent-danger)', background: 'rgba(239, 68, 68,0.06)', border: '1px solid rgba(239, 68, 68,0.12)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }} title="Revoke">
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Sign out all other devices
            </button>
          </TiltCard>

          {/* Login Activity */}
          <TiltCard variants={iV} className="mesh-bg">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--brand-primary)' }} /> Login Activity
            </h2>
            <div className="flex flex-col gap-2">
              {LOGIN_HISTORY.map((l, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '10px 14px', borderRadius: '10px', transition: 'background 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.status === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)', boxShadow: `0 0 6px ${l.status === 'success' ? 'rgba(0, 198, 174,0.3)' : 'rgba(239, 68, 68,0.3)'}`, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{l.device}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                        <MapPin size={9} /> {l.location}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{l.time}</p>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: l.status === 'success' ? '#16A34A' : 'var(--accent-danger)', textTransform: 'uppercase' }}>{l.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        {/* Third row: Password + Connected Apps */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '24px' }}>
          {/* Password & Recovery */}
          <TiltCard variants={iV} className="mesh-bg">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: 'var(--brand-primary)' }} /> Password & Recovery
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Password', value: 'Last changed 14 days ago', icon: <Key size={16} />, action: 'Change' },
                { label: 'Recovery Email', value: 'a****@gmail.com', icon: <CheckCircle size={16} />, action: 'Update' },
                { label: 'Backup Codes', value: '6 of 10 remaining', icon: <Shield size={16} />, action: 'Regenerate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--bg-inset)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ color: 'var(--brand-primary)', background: 'rgba(0, 198, 174,0.06)', padding: '8px', borderRadius: '8px', display: 'flex' }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{item.value}</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '6px 12px', borderRadius: '8px' }}>{item.action}</button>
                </div>
              ))}
            </div>
          </TiltCard>

          {/* Connected Apps */}
          <TiltCard variants={iV} className="mesh-bg">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} style={{ color: 'var(--brand-primary)' }} /> Connected Applications
            </h2>
            <div className="flex flex-col gap-3">
              {CONNECTED_APPS.map((app, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--bg-inset)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{app.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{app.scope} Â· Since {app.connected}</p>
                    </div>
                  </div>
                  <button style={{ color: 'var(--accent-danger)', background: 'rgba(239, 68, 68,0.06)', border: '1px solid rgba(239, 68, 68,0.12)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    <Trash2 size={12} /> Revoke
                  </button>
                </div>
              ))}
              {CONNECTED_APPS.length === 0 && (
                <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>No connected applications</p>
              )}
            </div>
          </TiltCard>
        </div>
      </motion.div>

      {/* Freeze Confirmation Modal */}
      <AnimatePresence>
        {showFreezeModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFreezeModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }} />
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
              style={{ position: 'relative', zIndex: 10, background: 'var(--bg-surface)', border: '1px solid rgba(239, 68, 68,0.2)', padding: '36px', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', maxWidth: '420px', width: '100%' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68,0.08)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-danger)' }}>
                <AlertTriangle size={28} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)', marginBottom: '8px' }}>Confirm Emergency Lockdown</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.6 }}>
                This will instantly block all outgoing transactions and revoke all active API tokens. Are you sure?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowFreezeModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-inset)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                <button onClick={confirmFreeze} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--accent-danger)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 16px rgba(239, 68, 68,0.3)' }}>YES, FREEZE IT</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSecurity;





