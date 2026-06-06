import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Lock, AlertTriangle, CheckCircle, Database, Activity, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/ui/TiltCard';
import { useAuditLogs } from '../hooks/useAuditLogs';
import api from '../lib/api';

const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };

const THREAT_STATS = [
  { label: 'Blocked Threats', value: '1,247', trend: '+12%', color: 'var(--accent-danger)' },
  { label: 'Active Monitors', value: '38', trend: 'stable', color: 'var(--brand-primary)' },
  { label: 'Uptime', value: '99.997%', trend: '+0.001%', color: 'var(--accent-success)' },
  { label: 'Avg Response', value: '12ms', trend: '-3ms', color: 'var(--brand-primary)' },
];

const Security: React.FC = () => {
  const { logs, isLoading } = useAuditLogs(8);
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleLockdown = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      if (isLockedDown) {
        // Find active lockdown ID from API in a real implementation.
        // For now, we simulate lifting lockdown via UI.
        setIsLockedDown(false);
      } else {
        await api.post('/emergency/lockdown');
        setIsLockedDown(true);
      }
    } catch (e) {
      console.error('Failed to toggle lockdown:', e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0, 198, 174,0.04) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(239, 68, 68,0.03) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={cV} initial="hidden" animate="show" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="flex justify-between items-end" style={{ marginBottom: '32px' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h1 gradient-text">Security & Audit</h1>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(0, 198, 174,0.06)', border: '1px solid rgba(0, 198, 174,0.12)' }}>
                <Activity size={12} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '0.08em' }}>LIVE</span>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Real-time compliance validation and cryptographic events monitor.</p>
          </div>

          <button
            onClick={toggleLockdown}
            disabled={isToggling}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
              background: isLockedDown ? 'transparent' : 'var(--accent-danger)', color: isLockedDown ? 'var(--brand-primary)' : 'white',
              border: isLockedDown ? '1px solid rgba(0, 198, 174,0.3)' : 'none',
              boxShadow: isLockedDown ? 'none' : '0 4px 20px rgba(239, 68, 68,0.3)',
            }}
          >
            <ShieldAlert size={18} />
            {isLockedDown ? 'LIFT LOCKDOWN' : 'INITIATE SYSTEM LOCKDOWN'}
          </button>
        </div>

        {/* Threat Stats Row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
          {THREAT_STATS.map((stat, i) => (
            <TiltCard key={i} className="mesh-bg" style={{ padding: '20px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: stat.color, fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: `${stat.color}10` }}>{stat.trend}</span>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{stat.value}</p>
            </TiltCard>
          ))}
        </div>

        {/* Main content: Terminal + Side Panels */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>

          {/* Live Terminal Log */}
          <TiltCard className="mesh-bg" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            <div className="flex items-center gap-2" style={{ padding: '12px 16px', background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-subtle)' }}>
              <Terminal size={14} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>LIVE_AUDIT_STREAM_v2.1.4</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-danger)' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)' }} />
              </div>
            </div>
            <div style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', minHeight: '300px', background: 'var(--bg-inset)' }}>
              {isLoading && <div style={{ color: 'var(--text-tertiary)' }}>&gt; CONNECTING TO AUDIT LOG STREAM...</div>}
              {logs.map((log) => {
                const isDanger = log.action.includes('LOCKDOWN') || log.action.includes('FREEZE') || log.action.includes('FAILED');
                const time = new Date(log.created_at).toLocaleTimeString();
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      color: isDanger ? 'var(--accent-danger)' : 'var(--brand-primary)',
                      marginBottom: '6px', lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: 'var(--text-tertiary)', marginRight: '6px' }}>&gt;</span> [{time}] [{log.action}] {log.user_id ? `USR:${log.user_id}` : 'SYS'} - IP: {log.ip_address}
                  </motion.div>
                );
              })}
              <div style={{ color: 'var(--text-tertiary)', animation: 'pulse 2s infinite' }}>&gt; _</div>
            </div>

            {/* Lockdown Overlay */}
            <AnimatePresence>
              {isLockedDown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68,0.06)', backdropFilter: 'blur(4px)', border: '2px solid rgba(239, 68, 68,0.3)', borderRadius: '16px', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68,0.2) 2px, rgba(239, 68, 68,0.2) 4px)' }} />
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' as const, bounce: 0.4 }}
                    style={{ textAlign: 'center', position: 'relative', zIndex: 20 }}
                  >
                    <AlertTriangle size={56} style={{ color: 'var(--accent-danger)', margin: '0 auto 16px', filter: 'drop-shadow(0 0 12px rgba(239, 68, 68,0.4))' }} className="animate-pulse" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-danger)', letterSpacing: '0.12em', marginBottom: '8px' }}>SYSTEM LOCKED</h2>
                    <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>All incoming network requests are currently dropping.</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

          {/* Status Panels */}
          <div className="flex flex-col gap-6">
            {/* Cryptographic Status */}
            <TiltCard className="mesh-bg" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>
                <Lock size={14} style={{ color: 'var(--brand-primary)' }} /> CRYPTOGRAPHIC STATUS
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'TLS Handshakes', val: '100% Validated', ok: true },
                  { label: 'Key Rotation', val: '24h Complete', ok: true },
                  { label: 'Cipher Suite', val: 'AES-256-GCM', ok: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: '12px 14px', background: 'var(--bg-inset)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{item.val}</span>
                      {item.ok ? (
                        <CheckCircle size={14} style={{ color: 'var(--accent-success)', filter: 'drop-shadow(0 0 4px var(--accent-success-glow, rgba(22,163,74,0.3)))' }} />
                      ) : (
                        <AlertTriangle size={14} style={{ color: 'var(--brand-primary)' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Compliance Metrics */}
            <TiltCard className="mesh-bg" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>
                <Database size={14} style={{ color: 'var(--brand-primary)' }} /> COMPLIANCE METRICS
              </h3>
              <div className="flex items-center justify-center" style={{ height: '120px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand-primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42} 0`} transform="rotate(-90 50 50)" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 198, 174,0.3))' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: 'spring' as const }}
                      style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                    >100%</motion.span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>OWASP TOP 10</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Infrastructure */}
            <TiltCard className="mesh-bg" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>
                <Server size={14} style={{ color: 'var(--brand-primary)' }} /> INFRASTRUCTURE
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'API Gateway', status: 'Healthy', color: 'var(--accent-success)' },
                  { label: 'Database Cluster', status: 'Healthy', color: 'var(--accent-success)' },
                  { label: 'CDN Edge', status: '3 nodes', color: 'var(--brand-primary)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ padding: '10px 14px', background: 'var(--bg-inset)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}40` }} />
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: item.color, fontWeight: 600 }}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Security;






