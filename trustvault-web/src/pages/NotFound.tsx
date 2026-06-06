import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Home } from 'lucide-react';
/* Stable audit ID â€” generated once at module load, never during render */
const AUDIT_ID = Math.floor(Math.random() * 90000 + 10000);

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const auditId = AUDIT_ID;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.3,
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-danger-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Animated scanner sweep */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, var(--accent-danger-glow) 50%, transparent 100%)',
          boxShadow: '0 0 30px 10px var(--accent-danger-glow)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 10, maxWidth: 520, padding: '32px' }}
      >
        {/* Shield icon with pulse ring */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 32px',
            background: 'var(--accent-danger-bg)', border: '1px solid var(--accent-danger-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px var(--accent-danger-glow)',
            position: 'relative',
          }}
        >
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.6, 1.8], opacity: [0.4, 0.1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '1px solid var(--accent-danger-glow)',
            }}
          />
          <Shield size={36} style={{ color: 'var(--accent-danger)' }} />
        </motion.div>

        {/* 404 number */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1,
            background: 'linear-gradient(135deg, var(--accent-danger) 0%, #991B1B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}
        >
          404
        </motion.h1>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Sector Not Found
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', lineHeight: 1.7, marginBottom: 40 }}>
          The resource you're trying to access doesn't exist or has been moved to a restricted zone. 
          Verify the URL or return to the command center.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
              borderRadius: 10, border: '1px solid var(--border-subtle)',
              background: 'var(--bg-inset)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-inset)'; }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
              borderRadius: 10, border: '1px solid var(--brand-primary-glow)',
              background: 'var(--brand-primary-bg)', color: 'var(--brand-primary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.3s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface-hover)'; e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--brand-primary-bg)'; e.currentTarget.style.borderColor = 'var(--brand-primary-glow)'; }}
          >
            <Home size={16} /> Command Center
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 48, fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}
        >
          ERR::SECTOR_NOT_FOUND &mdash; Audit log #TD-{auditId}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;



