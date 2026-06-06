import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2,
  ShieldCheck, ArrowUpRight, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, profile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && profile) {
      if (profile.role === 'admin' || profile.role === 'fraud_analyst') {
        navigate('/app/soc');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [isAuthenticated, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    if (!supabase) {
      setError('Supabase is not configured');
      setLoading(false);
      return;
    }
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'New User',
            role: 'client'
          }
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft, glowing orb top right */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(0,198,174,0.12)_0%,transparent_60%)] blur-3xl"
        />
        {/* Soft, glowing orb bottom left */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="w-full max-w-lg p-6 relative z-10">
        
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[var(--bg-surface)] rounded-[32px] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-[var(--border-subtle)] relative"
        >
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-inset)] shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-6 flex items-center justify-center border border-[var(--border-subtle)]"
            >
              <img src="/vault_logo.png" alt="TrustVault" className="w-8 h-8 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold text-[var(--text-primary)]">TV</span>'; }} />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-display mb-3">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-[var(--text-secondary)] text-base">
              {isSignUp ? 'Join TrustVault to secure your digital assets.' : 'Enter your credentials to access your secure vault.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-sm text-red-600 border border-red-100"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-[#00C6AE] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-14 bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:bg-[var(--bg-surface)] focus:border-[#00C6AE] focus:ring-4 focus:ring-[#00C6AE]/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 pr-1">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <a href="#" className="text-xs font-bold text-[#00C6AE] hover:text-[#009A88] transition-colors">Forgot?</a>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-tertiary)] group-focus-within:text-[#00C6AE] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl pl-12 pr-12 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:bg-[var(--bg-surface)] focus:border-[#00C6AE] focus:ring-4 focus:ring-[#00C6AE]/10 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full h-14 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-2xl font-bold text-base hover:opacity-80 hover:shadow-[0_8px_25px_rgba(15,23,42,0.2)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:shadow-none flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <Loader2 size={22} className="animate-spin text-[var(--bg-primary)]/70" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In to Vault'}
                  <ArrowRight size={20} className="text-[var(--bg-primary)]/70 group-hover:translate-x-1 group-hover:text-[var(--bg-primary)] transition-all" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 px-2">
            <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
            <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Or</span>
            <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
          </div>

          {/* Dev bypass */}
          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full h-14 bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl font-bold text-sm hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)] hover:shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Skip to Dashboard (Dev)</span>
            <ArrowUpRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[#00C6AE] transition-colors" />
          </button>

          <p className="mt-8 text-center text-sm font-medium text-[var(--text-secondary)]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-bold text-[#00C6AE] hover:text-[#009A88] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#00C6AE] hover:after:w-full after:transition-all"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
        
        {/* Footer badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center gap-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            <ShieldCheck size={16} className="text-[#00C6AE]" />
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            <Zap size={16} className="text-[#00C6AE]" />
            <span>Lightning Fast</span>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default Login;
