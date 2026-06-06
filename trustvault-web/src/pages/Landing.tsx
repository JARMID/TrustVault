import React, { useRef, useCallback, useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Lock, Globe, ChevronRight, ChevronDown,
  CreditCard, Fingerprint, ShieldCheck, BarChart3, Send,
  Eye, Cpu, Scan, KeyRound, BadgeCheck, ArrowRight, Sun, Moon
} from 'lucide-react';
import TrustDesk3DWidget from '../components/ui/TrustDesk3DWidget';
import SplineScene from '@splinetool/react-spline';
import FintechHeroWidget from '../components/ui/FintechHeroWidget';
import { Reveal, ScrollProgress, ParticleField, MagneticButton, ParallaxSection } from '../components/ui/ScrollAnimations';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { ContainerScroll } from '../components/ui/ContainerScroll';
import { InfiniteMarquee, MarqueeItem } from '../components/ui/InfiniteMarquee';
import { CinematicFooter } from '../components/ui/CinematicFooter';
import { TextReveal, GradientText } from '../components/ui/TextReveal';
import { Dashboard3DPreview } from '../components/ui/Dashboard3DPreview';
import { BiometricScannerWidget } from '../components/ui/BiometricScannerWidget';
import { SecurityShieldWidget } from '../components/ui/SecurityShieldWidget';
import { CypherCubeWidget } from '../components/ui/CypherCubeWidget';
import { ThreatMap3DWidget } from '../components/ui/ThreatMap3DWidget';
import SecurityGlobe from '../components/3d/SecurityGlobe';
import { GlobalTransfersWidget } from '../components/ui/GlobalTransfersWidget';
import { WealthChartWidget } from '../components/ui/WealthChartWidget';
import { SavingsRingWidget } from '../components/ui/SavingsRingWidget';
import { AnalyticsMiniWidget } from '../components/ui/AnalyticsMiniWidget';
import { LiveActivityTicker } from '../components/ui/LiveActivityTicker';
import { useUIStore } from '../stores/uiStore';
import './Landing.css';

/* â”€â”€ Feature Data â”€â”€ */
const features = [
  { icon: <CreditCard size={22} />, title: 'Smart Virtual Cards', desc: 'Generate instant Visa/Mastercard for secure online spending. Set auto-replenish, spending limits, and single-use modes.' },
  { icon: <Send size={22} />, title: 'Global Transfers', desc: 'Send and receive money globally with zero fees. Real-time multi-currency settlement backed by BEYN infrastructure.' },
  { icon: <Cpu size={22} />, title: 'AI Wealth Management', desc: 'Automated portfolio balancing, predictive yield generation, and intelligent cash flow optimization.' },
  { icon: <Scan size={22} />, title: 'Seamless Onboarding', desc: 'Open your digital account in under 3 minutes with automated identity verification and instant credit scoring.' },
  { icon: <ShieldCheck size={22} />, title: 'Automated Savings', desc: 'Create custom saving rules, round up spare change, and earn interest daily on your idle cash.' },
  { icon: <BarChart3 size={22} />, title: 'Smart Analytics', desc: 'AI-powered spending insights, category breakdowns, and predictive budgeting tools for every account.' },
];

const stats = [
  { value: '150+', label: 'Currencies' },
  { value: '$0', label: 'Hidden Fees' },
  { value: '$2B+', label: 'Processed' },
  { value: 'Instant', label: 'Settlement' },
];


const trustedBy = ['BEYN Network', 'BNA Bank', 'CPA Finance', 'Algérie Poste', 'Banque ABC', 'SATIM', 'GIE Monétique', 'Djezzy Pay'];

/* â”€â”€ Encryption Visualizer (Moved to CypherCubeWidget) â”€â”€ */

/* â”€â”€ Dashboard Mockup (for ContainerScroll) â”€â”€ */
/* â”€â”€ Dashboard Mockup (Moved to Dashboard3DPreview) â”€â”€ */

/* â”€â”€ Theme System â”€â”€ */
type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} });

const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('td-theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const setThemeStore = useUIStore(s => s.setTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('td-theme', theme);
    setThemeStore(theme);
  }, [theme, setThemeStore]);

  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};

/* â”€â”€ Theme Toggle Button â”€â”€ */
const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <motion.button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        width: 36, height: 36,
        borderRadius: 10,
        border: '1px solid var(--vault-border-strong)',
        background: 'var(--vault-surface-glass)',
        backdropFilter: 'blur(12px)',
        color: 'var(--vault-text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      whileHover={{ scale: 1.08, color: 'var(--vault-primary)' }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 30, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
    </motion.button>
  );
};

/* ── Premium Animated Aurora & Planetoid Background ── */
const AmbientHeroBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Subtle Planetoid Background (Security Globe) */}
      {isDark && (
        <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: '100%', height: '120%', opacity: 0.15, mixBlendMode: 'screen' }}>
          <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
            <SecurityGlobe />
          </div>
        </div>
      )}

      {/* Primary Aurora — Top Right */}
      <motion.div 
        animate={{ 
          x: ['0%', '-15%', '5%', '0%'],
          y: ['0%', '10%', '-15%', '0%'],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 25, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '60vw', height: '60vw', minWidth: 600, minHeight: 600, borderRadius: '50%',
          background: isDark ? 'radial-gradient(circle, rgba(0,198,174,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          filter: 'blur(90px)',
          mixBlendMode: isDark ? 'screen' : 'multiply'
        }} 
      />
      
      {/* Secondary Aurora — Bottom Left */}
      <motion.div 
        animate={{ 
          x: ['0%', '20%', '-5%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 30, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
        style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '70vw', height: '70vw', minWidth: 700, minHeight: 700, borderRadius: '50%',
          background: isDark ? 'radial-gradient(circle, rgba(0,114,255,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          mixBlendMode: isDark ? 'screen' : 'multiply'
        }} 
      />

      {/* Tertiary Aurora — Center (Adds depth) */}
      <motion.div 
        animate={{ 
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, delay: 5 }}
        style={{
          position: 'absolute', top: '20%', left: '20%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: isDark ? 'radial-gradient(circle, rgba(138,43,226,0.08) 0%, transparent 60%)' : 'transparent',
          filter: 'blur(80px)',
          mixBlendMode: 'screen'
        }} 
      />

      {/* Subtle Blueprint Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: isDark 
          ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
          : 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
      }} />
    </div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LANDING PAGE â€” TRUSTVAULT PREMIUM
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const LandingInner: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const isDark = theme === 'dark';
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.8], [1, 0.94]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const scrollToSecurity = useCallback(() => {
    document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <ScrollProgress />
      <div className="vault-noise" style={{ opacity: theme === 'light' ? 0.3 : 1 }} />
      <div className="vault-page" style={{ width: '100%', background: 'var(--vault-bg)', color: 'var(--vault-text)', overflowX: 'hidden' }}>

        {/* The 3D globe was moved to the right column of the hero section for an asymmetric layout */}

        {/* Premium Aurora Background */}
        <AmbientHeroBackground />

        {/* Particle & Vignette Overlay */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {isDark && <ParticleField />}
          <div style={{
            position: 'absolute', inset: 0,
            background: isDark
              ? 'radial-gradient(ellipse at 30% 50%, transparent 10%, rgba(7,11,20,0.92) 80%)'
              : 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0) 10%, rgba(248,250,255,0.85) 90%)',
          }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ── PREMIUM HEADER (THEME AWARE) ── */}
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 inset-x-0 z-[100] h-20 flex items-center justify-between px-6 md:px-12 transition-all"
            style={{ 
              background: theme === 'dark' ? 'rgba(7,11,20,0.85)' : 'rgba(255,255,255,0.85)',
              borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: theme === 'dark' ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div 
                className="relative flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                }}
              >
                <img src="/vault_logo.png" alt="TrustVault Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-lg font-display font-bold tracking-widest" style={{ color: 'var(--vault-text)' }}>
                TRUST<span style={{ color: 'var(--vault-primary)' }} className="font-medium">VAULT</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToFeatures} className="text-sm font-medium transition-colors relative group" style={{ color: 'var(--vault-text-secondary)' }}>
                Capabilities
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ background: 'var(--vault-primary)' }}></span>
              </button>
              <button onClick={scrollToSecurity} className="text-sm font-medium transition-colors relative group" style={{ color: 'var(--vault-text-secondary)' }}>
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ background: 'var(--vault-primary)' }}></span>
              </button>
              <button onClick={() => navigate('/pricing')} className="text-sm font-medium transition-colors relative group" style={{ color: 'var(--vault-text-secondary)' }}>
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ background: 'var(--vault-primary)' }}></span>
              </button>
              <button onClick={() => navigate('/docs')} className="text-sm font-medium transition-colors relative group" style={{ color: 'var(--vault-text-secondary)' }}>
                Developers
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ background: 'var(--vault-primary)' }}></span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={() => navigate('/login')} 
                className="hidden md:flex text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'var(--vault-text)' }}
              >
                Sign In
              </button>
              
              <button 
                onClick={() => navigate('/app/dashboard')}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                style={{ 
                  background: 'var(--vault-primary)',
                  color: theme === 'dark' ? '#070B14' : '#FFFFFF',
                  boxShadow: `0 0 20px ${theme === 'dark' ? 'rgba(0,198,174,0.4)' : 'rgba(59,130,246,0.3)'}`
                }}
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative">Open Vault</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.nav>

          {/* â•â• HERO â•â• */}
          <section ref={heroRef} className="vault-hero">
            <motion.div className="vault-container" style={{ paddingTop: '100px', paddingBottom: '80px', opacity: heroOpacity, scale: heroScale, y: heroY }}>
              <div className="vault-hero-grid">
                <div>
                  <motion.div className="vault-hero-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="dot" /> Powered by BEYN Banking Infrastructure
                  </motion.div>

                  <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                    <TextReveal text="Your Vault." delay={0.4} />
                    <br />
                    <GradientText><TextReveal text="Your Rules." delay={0.7} /></GradientText>
                  </motion.h1>

                  <motion.p className="vault-hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}>
                    Bank-grade digital wallet with AI-powered security, virtual card management, and end-to-end encrypted transactions. Built for the next generation of banking.
                  </motion.p>

                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                      <MagneticButton className="vault-btn vault-btn-large" onClick={() => navigate('/app/dashboard')}>
                        <Fingerprint size={22} style={{ color: 'var(--vault-bg)' }} />
                        <span>Open Your Vault</span>
                        <ChevronRight size={18} style={{ opacity: 0.7 }} />
                      </MagneticButton>
                      <MagneticButton className="vault-btn vault-btn-ghost" onClick={scrollToFeatures}>
                        Explore Features <ChevronDown size={16} />
                      </MagneticButton>
                    </div>
                    <div className="vault-trust-bar">
                      <div className="vault-trust-item">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vault-success)', boxShadow: '0 0 8px var(--vault-success)', animation: 'pulse-glow 2s infinite' }} />
                        Systems Online
                      </div>
                      <div className="vault-trust-divider" />
                      <div className="vault-trust-item"><Lock size={12} /> AES-256-GCM</div>
                      <div className="vault-trust-divider" />
                      <div className="vault-trust-item"><BadgeCheck size={12} /> PCI-DSS</div>
                    </div>
                  </motion.div>
                </div>

                {/* Right — Interactive 3D Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative', minHeight: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="mt-8 lg:mt-0"
                >
                  <TrustDesk3DWidget />
                </motion.div>

              </div>
            </motion.div>

            <motion.div
              style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none' }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </motion.div>
          </section>

          {/* â•â• STATS BAR â•â• */}
          <section className="vault-section-opaque" style={{ position: 'relative', zIndex: 20 }}>
            <ParallaxSection speed={0.1}>
              <div className="vault-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
                <div className="vault-stats">
                  {stats.map((s, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="vault-stat">
                        <div className="vault-stat-value">{s.value}</div>
                        <div className="vault-stat-label">{s.label}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </ParallaxSection>
          </section>

          <div className="vault-glow-divider" />

          {/* â•â• TRUSTED BY â€” Infinite Marquee â•â• */}
          <section style={{ padding: '48px 0', position: 'relative', zIndex: 20, background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid var(--vault-border)', borderBottom: '1px solid var(--vault-border)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--vault-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Trusted by leading institutions
              </span>
            </div>
            <InfiniteMarquee speed={30}>
              {trustedBy.map((name, i) => (
                <MarqueeItem key={i}>
                  <span className="vault-trusted-logo">{name}</span>
                </MarqueeItem>
              ))}
            </InfiniteMarquee>
          </section>

          {/* â• â•  FEATURES â€” SpotlightCards â• â•  */}
          <section ref={featuresRef} className="vault-section-opaque" style={{ padding: '120px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
                <div className="vault-section-tag">◆ Features</div>
                <h2 className="vault-section-title">
                  Everything You Need to <GradientText>Build Wealth</GradientText>
                </h2>
                <p className="vault-section-desc">
                  From intelligent virtual cards to AI-powered cash flow tracking — every feature is designed to give you absolute control over your money.
                </p>
              </Reveal>

              {/* Premium Antigravity Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {features.map((f, i) => {
                  const isLarge = i === 0 || i === 3;
                  const colSpan = isLarge ? "md:col-span-8" : "md:col-span-4";
                  const heightClass = isLarge ? "h-[480px]" : "h-[340px]";
                  
                  return (
                    <Reveal key={i} delay={i * 0.1} direction="up" className={`${colSpan} ${heightClass}`}>
                      <div 
                        className="w-full h-full rounded-[32px] border relative overflow-hidden group transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,198,174,0.15)] flex flex-col"
                        style={{
                          background: 'var(--vault-surface)',
                          borderColor: 'var(--vault-border)',
                        }}
                      >
                        {/* Ambient glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--vault-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        {/* Interactive Widget Background - Placed UNDER text but allows clicks */}
                        {isLarge ? (
                          <div className="absolute top-0 bottom-0 right-0 w-[55%] flex items-center justify-center z-0 overflow-visible">
                            <div className="relative w-full h-full flex items-center justify-center transform group-hover:-translate-x-2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                              {i === 0 ? (
                                <div className="absolute right-[-10%] sm:right-[0%] md:right-[-5%] lg:right-[5%] w-[420px] scale-[0.65] md:scale-[0.75] origin-right md:origin-center">
                                  <FintechHeroWidget hideTransactions={true} />
                                </div>
                              ) : (
                                <div className="absolute right-[-5%] sm:right-[5%] w-[320px] scale-[0.8] md:scale-[0.95] origin-right md:origin-center">
                                  <BiometricScannerWidget />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Small cards mini-widgets */
                          <div className="absolute top-6 right-6 left-6 bottom-[140px] z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                             {i === 1 && <GlobalTransfersWidget />}
                             {i === 2 && <WealthChartWidget />}
                             {i === 4 && <SavingsRingWidget />}
                             {i === 5 && <AnalyticsMiniWidget />}
                          </div>
                        )}

                        {/* Content Overlay — pointer-events-none lets clicks through to the widget! */}
                        <div className={`absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none ${isLarge ? 'md:p-10 justify-center' : ''}`}>
                          {/* Icon Top */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--vault-surface)] border border-[var(--vault-border-strong)] group-hover:border-[var(--vault-primary)]/50 group-hover:text-[var(--vault-primary)] text-[var(--vault-text)] transition-all duration-500 shadow-xl backdrop-blur-md pointer-events-auto ${isLarge ? 'absolute top-10 left-10 w-14 h-14' : 'absolute top-6 left-6 z-20 shadow-md'}`}>
                            {f.icon}
                          </div>

                          {/* Text Bottom/Left */}
                          <div className={isLarge ? "max-w-[48%] mt-auto md:mt-0 pointer-events-auto" : "mt-auto pointer-events-auto bg-[var(--vault-surface)]/60 backdrop-blur-sm -mx-2 -mb-2 p-2 rounded-xl"}>
                            <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-[var(--vault-text)] mb-2 md:mb-4">{f.title}</h3>
                            <p className="text-[13px] md:text-[15px] leading-relaxed" style={{ color: 'var(--vault-text-secondary)' }}>
                              {f.desc}
                            </p>
                          </div>
                        </div>

                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="vault-glow-divider" />

          {/* ── LIVE ACTIVITY TICKER ── */}
          <LiveActivityTicker />
          
          <div className="vault-glow-divider" />

          {/* ── REAL-TIME AI SOC & ANOMALY TRIAGE ── */}
          <section className="vault-section-opaque" style={{ padding: '120px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Administrative / SOC details */}
                <Reveal direction="left">
                  <div className="vault-section-tag">◆ Administrative Command</div>
                  <h2 className="vault-section-title" style={{ marginBottom: 24 }}>
                    Real-time AI SOC & <br />
                    <GradientText>Anomaly Triage</GradientText>
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--vault-text-secondary, rgba(200,210,230,0.65))', lineHeight: 1.8, marginBottom: 32 }}>
                    Beyond the consumer wallet, TrustVault equips administrators with a complete Security Operations Center (SOC). Monitor real-time transaction velocity, coordinate biometric validation, and triage security incidents with deep threat telemetry.
                  </p>
                  
                  <div className="flex flex-col gap-6">
                    {[
                      {
                        title: 'Dynamic Threat Scoring',
                        desc: 'Automated ML engines evaluate system anomalies, scoring risks from 0.00 to 1.00 for immediate, zero-latency defense routing.',
                        metric: 'Risk Index ML',
                        icon: <Cpu size={18} />
                      },
                      {
                        title: 'WebSocket Panic Relay',
                        desc: 'Instant panic triggers from mobile clients broadcast live GPS coordinates to administrative command maps in under 50ms.',
                        metric: 'WSS Payload <50ms',
                        icon: <Send size={18} />
                      },
                      {
                        title: 'Immutable Audit Ledger',
                        desc: 'Every sensitive operation is permanently sealed in an ISO 27001 & PCI-DSS compliant audit log with high-res telemetry.',
                        metric: 'ISO 27001 Compliant',
                        icon: <ShieldCheck size={18} />
                      }
                    ].map((feat, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl border backdrop-blur-md group hover:border-[rgba(0,198,174,0.4)] transition-all duration-300" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <div className="flex-1">
                          <h4 className="font-bold text-base mb-1 flex items-center gap-2" style={{ color: 'var(--vault-text)' }}>
                            <span className="text-[var(--vault-primary,#00C6AE)] flex-shrink-0">{feat.icon}</span>
                            {feat.title}
                          </h4>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--vault-text-secondary, rgba(200,210,230,0.65))' }}>{feat.desc}</p>
                        </div>
                        <div className="flex flex-col justify-center items-end text-right min-w-[120px]">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vault-primary,#00C6AE)] bg-[rgba(0,198,174,0.08)] px-2.5 py-1 rounded-full border border-[rgba(0,198,174,0.15)]">
                            {feat.metric}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Right: SOC Threat Triage Telemetry Image */}
                <Reveal direction="right" className="relative group">
                  <div className="relative group">
                    <ThreatMap3DWidget />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <div className="vault-glow-divider" />

          {/* â•â• DASHBOARD PREVIEW â€” ContainerScroll â•â• */}
          <section className="vault-section-opaque" style={{ position: 'relative', zIndex: 20 }}>
            <ContainerScroll
              titleComponent={
                <div style={{ marginBottom: 24 }}>
                  <div className="vault-section-tag">â—† Interface</div>
                  <h2 className="vault-section-title">
                    Designed for <GradientText>Modern Banking</GradientText>
                  </h2>
                  <p className="vault-section-desc">
                    Every pixel crafted for instant financial clarity and rapid decision-making.
                  </p>
                </div>
              }
            >
              <Dashboard3DPreview />
            </ContainerScroll>
          </section>

          <div className="vault-glow-divider" />

          {/* â•â• SECURITY SECTION â•â• */}
          <section id="security-section" className="vault-section-opaque" style={{ padding: '120px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <div className="vault-security-grid">
                <div style={{ position: 'sticky', top: 120 }}>
                  <Reveal>
                    <div className="vault-section-tag">â—† Security Architecture</div>
                    <h2 className="vault-section-title" style={{ lineHeight: 1.1 }}>
                      Fort Knox.<br />
                      <span style={{ color: 'var(--vault-primary)' }}>In Your Pocket.</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--vault-text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
                      TrustVault implements a zero-trust architecture where every transaction, every key exchange, and every identity verification is cryptographically sealed and independently auditable.
                    </p>
                    <CypherCubeWidget />
                    <div style={{ marginTop: 24 }}>
                      <MagneticButton className="vault-btn vault-btn-primary" onClick={() => navigate('/app/dashboard')}>
                        Explore Platform
                      </MagneticButton>
                    </div>
                  </Reveal>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: <KeyRound size={28} />, title: 'RSA-2048 Key Pairs', text: 'Each user gets a unique public/private key pair. Card data is encrypted client-side before it ever reaches our servers.' },
                    { icon: <Eye size={28} />, title: 'AI Transaction Monitor', text: 'Real-time ML engine analyzes transaction patterns, velocity, and geolocation to flag anomalies with 99.7% accuracy.' },
                    { icon: <Globe size={28} />, title: 'BEYN Banking Network', text: "Integrated with Algeria's leading banking middleware. Instant settlement, interbank transfers, and regulatory compliance." },
                    { icon: <Shield size={28} />, title: 'Audit Trail & Compliance', text: 'Every action logged with tamper-proof audit trails. GDPR, PCI-DSS, and local banking regulation compliance built-in.' },
                  ].map((item, i) => (
                    <Reveal key={i} delay={0.1 * i} direction="up">
                      <SpotlightCard className="vault-security-item" spotlightColor="rgba(0, 198, 174, 0.06)">
                        <div style={{ color: 'var(--vault-primary)', marginBottom: 20, background: 'var(--vault-primary-glow)', display: 'inline-flex', padding: 16, borderRadius: 16 }}>
                          {item.icon}
                        </div>
                        <h3 style={{ color: 'var(--vault-text)', fontSize: '1.4rem', marginBottom: 12, fontWeight: 600 }}>{item.title}</h3>
                        <p style={{ color: 'var(--vault-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>{item.text}</p>
                      </SpotlightCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FINAL CTA UPGRADE ── */}
          <section className="vault-cta-section vault-section-opaque" style={{ padding: '120px 0', position: 'relative', zIndex: 20, overflow: 'hidden' }}>
            {/* Ambient decorative glowing backdrops */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,198,174,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[120px] h-[120px] pointer-events-none opacity-20 border border-[var(--vault-primary)] rounded-xl transform rotate-12" style={{ background: 'var(--vault-primary-glow)' }} />
            
            <div className="vault-container relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left side text and actions */}
                <div className="lg:col-span-7 text-left">
                  <Reveal direction="left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border mb-6 shadow-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                      <Shield size={24} style={{ color: 'var(--vault-primary)' }} />
                    </div>
                    <h2 className="vault-section-title text-left" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.1, marginBottom: 20 }}>
                      Ready to Secure <br />
                      <GradientText>Your Financial Future?</GradientText>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--vault-text-secondary, rgba(200,210,230,0.65))', lineHeight: 1.8, marginBottom: 36, maxWidth: '580px' }}>
                      Step into the future of bank-grade digital wallet management. Open your secure TrustVault today and leverage AI-powered threat triage, dynamic virtual card encryption, and zero-fee global transfers.
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                      <MagneticButton className="vault-btn vault-btn-large" onClick={() => navigate('/app/dashboard')}>
                        <Fingerprint size={22} style={{ color: 'var(--vault-bg)' }} />
                        <span>Open Your Vault</span>
                        <ChevronRight size={18} style={{ opacity: 0.7 }} />
                      </MagneticButton>
                      <button className="vault-btn vault-btn-ghost" onClick={() => navigate('/docs')}>
                        Read Architecture Docs
                      </button>
                    </div>

                    {/* Trust details */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-mono text-[var(--text-tertiary)]">
                      <div className="flex items-center gap-2">
                        <Lock size={12} className="text-[var(--vault-primary,#00C6AE)]" />
                        <span>AES-256-GCM Hardware Sealed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scan size={12} className="text-[var(--vault-primary,#00C6AE)]" />
                        <span>Instant eKYC Biometrics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-[var(--vault-primary,#00C6AE)]" />
                        <span>PCI-DSS Level 1 Compliant</span>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Right side high-fidelity vault cylinder render */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <Reveal direction="right" className="relative group">
                    {/* Glowing aura */}
                    <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(0,198,174,0.15)_0%,transparent_70%)] rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="relative w-full max-w-[450px] lg:max-w-full flex items-center justify-center pt-8 pb-12">
                      <div className="transform scale-110 lg:scale-125 w-full flex items-center justify-center">
                        <SecurityShieldWidget />
                      </div>
                      
                      {/* Interactive overlay tag */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[var(--vault-bg)] border border-[rgba(0,198,174,0.3)] backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-3 z-20">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--vault-primary,#00C6AE)] animate-ping" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--vault-primary,#00C6AE)] absolute" style={{ left: '20px' }} />
                        <span className="text-[10px] font-mono tracking-widest text-[var(--vault-primary,#00C6AE)] uppercase font-bold">CRYPTO-ENGINE: ONLINE</span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* ── CINEMATIC FOOTER ── */}
          <CinematicFooter />
        </div>
      </div>
    </>
  );
};

const Landing: React.FC = () => (
  <ThemeProvider>
    <LandingInner />
  </ThemeProvider>
);

export default Landing;









