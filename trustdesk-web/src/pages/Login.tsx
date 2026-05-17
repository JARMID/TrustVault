import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const loginStyles = `
  .login-container {
    min-height: 100vh;
    display: flex;
    background: #000;
    position: relative;
    overflow: hidden;
  }
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px;
    position: relative;
    z-index: 10;
  }
  .login-right {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .login-form-card {
    width: 100%;
    max-width: 420px;
    position: relative;
  }
  .login-input-wrap {
    position: relative;
    margin-bottom: 20px;
  }
  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #fff;
    padding: 14px 16px 14px 48px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-family: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
  }
  .login-input:focus {
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.05);
    background: rgba(0,0,0,0.4);
  }
  .login-input::placeholder {
    color: #475569;
  }
  .login-btn {
    width: 100%;
    padding: 15px 24px;
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    letter-spacing: 0.1em;
  }
  .login-btn:hover {
    border-color: rgba(59, 130, 246, 0.7);
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
  }
  .login-btn:active {
    transform: translateY(0);
  }
  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 900px) {
    .login-right { display: none; }
    .login-left { padding: 32px 24px; }
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/app/dashboard');
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-container">
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px', opacity: 0.5,
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Left: Form */}
        <div className="login-left">
          <div className="login-form-card">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 40 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
                  overflow: 'hidden',
                }}>
                  <video autoPlay loop muted playsInline style={{ width: '130%', height: '130%', objectFit: 'cover' }} src="/logo-animated.mp4" />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  TRUST<span style={{ fontWeight: 300, color: '#60A5FA' }}>DESK</span>
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Welcome back
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
                Authenticate to access the Security Operations Console
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={handleSubmit}
            >
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
                      borderRadius: 10, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                      marginBottom: 20, fontSize: '0.85rem', color: '#F87171',
                    }}
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="login-input-wrap">
                <Fingerprint size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 2 }} />
                <input
                  className="login-input"
                  type="email"
                  placeholder="admin@trustvault.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="login-input-wrap">
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569', zIndex: 2 }} />
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 48 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, zIndex: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember / Forgot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#3B82F6' }} />
                  Remember session
                </label>
                <a href="#" style={{ color: '#60A5FA', textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    AUTHENTICATE
                    <ArrowRight size={18} style={{ opacity: 0.6 }} />
                  </>
                )}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#334155', fontFamily: 'monospace' }}
            >
              <Lock size={10} />
              AES-256-GCM encrypted · Zero-Trust architecture
            </motion.div>
          </div>
        </div>

        {/* Right: Visual panel */}
        <div className="login-right">
          {/* Decorative elements */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(0,0,0,0.95) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 400, height: 400, borderRadius: '50%',
            border: '1px solid rgba(59, 130, 246, 0.08)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 300, height: 300, borderRadius: '50%',
            border: '1px solid rgba(59, 130, 246, 0.12)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            border: '1px solid rgba(59, 130, 246, 0.18)',
          }} />

          {/* Hero-side text */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 360 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(59, 130, 246, 0.1)',
              }}>
                <Shield size={36} style={{ color: '#60A5FA' }} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>
                Sovereign Security
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.7 }}>
                Monitor, detect, and respond to threats across your entire operation from a single, unified command center.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40 }}
            >
              {[
                { value: '99.97%', label: 'Uptime' },
                { value: '<15m', label: 'Response' },
                { value: '14K+', label: 'Nodes' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#60A5FA' }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Spin animation for loader */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Login;
