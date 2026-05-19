import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2,
  Wallet, Shield, Globe, Zap
} from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/app/dashboard');
  };

  const features = [
    { icon: Shield, title: 'Bank-Grade Security', desc: 'Your funds are protected with AES-256 encryption' },
    { icon: Globe, title: 'Send Worldwide', desc: 'Transfer money to 180+ countries instantly' },
    { icon: Zap, title: 'Instant Transfers', desc: 'Real-time P2P payments with zero fees' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#F8F9FC] via-[#EEF0F8] to-[#F0EDFA] font-sans">
      {/* â”€â”€ Left Panel: Form â”€â”€ */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[#7C3AED] flex items-center justify-center shadow-[0_4px_16px_rgba(0, 198, 174,0.3)] overflow-hidden">
                {!imageError ? (
                  <img
                    src="/trustvault_logo.png"
                    alt="TrustVault"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-white font-extrabold text-lg">TV</span>
                )}
              </div>
              <span className="text-[1.3rem] font-extrabold tracking-[-0.03em] text-[#1A1D2B]">
                Trust<span className="font-semibold text-[var(--brand-primary)]">Vault</span>
              </span>
            </div>

            <h1 className="text-[1.8rem] font-extrabold tracking-[-0.03em] text-[#1A1D2B] mb-2 leading-[1.2]">
              Welcome back ðŸ‘‹
            </h1>
            <p className="text-[0.9rem] text-slate-500 leading-relaxed">
              Sign in to manage your wallets, cards, and payments
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-50 border border-red-200 mb-5 text-[0.82rem] text-red-600"
                >
                  <AlertCircle size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email input */}
            <div className="relative mb-4">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full py-3.5 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-[#1A1D2B] text-[0.88rem] outline-none transition-all duration-200 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 box-border"
              />
            </div>

            {/* Password input */}
            <div className="relative mb-4">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full py-3.5 pl-12 pr-12 rounded-xl border border-slate-200 bg-white text-[#1A1D2B] text-[0.88rem] outline-none transition-all duration-200 focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 box-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-1 z-10"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center mb-7 text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[var(--brand-primary)]" />
                Remember me
              </label>
              <a
                href="#"
                className="text-[var(--brand-primary)] font-medium hover:underline"
                onClick={e => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(91, 95, 237, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-[15px] px-6 rounded-xl border-none bg-gradient-to-br from-[var(--brand-primary)] to-[#7C3AED] text-white text-[0.92rem] font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0, 198, 174,0.25)] ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="opacity-80" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Social divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 my-7"
          >
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[0.72rem] text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </motion.div>

          {/* Social buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex gap-3"
          >
            {['Google', 'Apple'].map(provider => (
              <button
                key={provider}
                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-[0.82rem] font-semibold text-[#1A1D2B] cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
              >
                {provider}
              </button>
            ))}
          </motion.div>

          {/* Sign up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-7 text-[0.82rem] text-slate-500"
          >
            Don't have an account?{' '}
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="text-[var(--brand-primary)] font-semibold hover:underline"
            >
              Create one
            </a>
          </motion.p>
        </div>
      </div>

      {/* â”€â”€ Right Panel: Hero â”€â”€ */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] to-[#7C3AED] rounded-l-[32px]">
        {/* Decorative circles */}
        {[500, 380, 260].map((size, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
            width: `${size}px`, height: `${size}px`, border: `1px solid rgba(255,255,255,${0.06 + i * 0.04})`,
          }} />
        ))}

        {/* Glow */}
        <div className="absolute top-[30%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        }} />

        <div className="relative z-10 text-center max-w-[380px] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="w-[72px] h-[72px] rounded-[20px] mx-auto mb-7 bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wallet size={32} className="text-white" />
            </div>
            <h2 className="text-[1.6rem] font-extrabold text-white mb-3 tracking-[-0.02em] leading-[1.2]">
              Your money,<br />your control
            </h2>
            <p className="text-[0.88rem] text-white/70 leading-relaxed">
              TrustVault gives you the tools to manage your finances, send money globally, and track your spending â€” all in one place.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-9 flex flex-col gap-3"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-left"
              >
                <div className="w-9 h-9 rounded-xl shrink-0 bg-white/10 flex items-center justify-center">
                  <feat.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[0.78rem] font-bold text-white mb-0.5">{feat.title}</p>
                  <p className="text-[0.68rem] text-white/60 leading-snug">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;





