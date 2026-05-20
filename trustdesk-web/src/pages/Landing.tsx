import React, { useRef, useCallback, useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Lock, Globe, ChevronRight, ChevronDown,
  CreditCard, Fingerprint, ShieldCheck, BarChart3, Send,
  Eye, Cpu, Scan, KeyRound, BadgeCheck, ArrowRight, Sun, Moon
} from 'lucide-react';
import FintechHeroWidget from '../components/ui/FintechHeroWidget';
import { Reveal, ScrollProgress, ParticleField, MagneticButton, ParallaxSection } from '../components/ui/ScrollAnimations';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { ContainerScroll } from '../components/ui/ContainerScroll';
import { InfiniteMarquee, MarqueeItem } from '../components/ui/InfiniteMarquee';
import { CinematicFooter } from '../components/ui/CinematicFooter';
import { TextReveal, GradientText } from '../components/ui/TextReveal';
import './Landing.css';

/* â”€â”€ Feature Data â”€â”€ */
const features = [
  { icon: <CreditCard size={22} />, title: 'Virtual Cards', desc: 'Generate unlimited virtual Visa/Mastercard with PK/SK encryption. Freeze, unfreeze, and set spending limits instantly.' },
  { icon: <Send size={22} />, title: 'P2P Transfers', desc: 'Send and receive money globally with zero fees between Vault users. Real-time settlement backed by BEYN infrastructure.' },
  { icon: <Cpu size={22} />, title: 'AI Fraud Detection', desc: 'Machine learning triage engine monitors every transaction for anomalies, blocking threats before they execute.' },
  { icon: <Scan size={22} />, title: 'eKYC Verification', desc: 'Onboard in minutes with deep neural biometric verification. NFC passport scanning and liveness detection.' },
  { icon: <ShieldCheck size={22} />, title: 'Zero-Trust Security', desc: 'AES-256-GCM encryption at rest. RSA-2048 key pairs per user. Every request authenticated and audited.' },
  { icon: <BarChart3 size={22} />, title: 'Smart Analytics', desc: 'AI-powered spending insights, category breakdowns, and predictive budgeting tools for every account.' },
];

const stats = [
  { value: 'AES-256', label: 'Encryption' },
  { value: 'PCI-DSS', label: 'Compliant' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '<200ms', label: 'Latency' },
];


const trustedBy = ['BEYN Network', 'BNA Bank', 'CPA Finance', 'Algérie Poste', 'Banque ABC', 'SATIM', 'GIE Monétique', 'Djezzy Pay'];

/* â”€â”€ Encryption Visualizer â”€â”€ */
const EncryptionVisualizer: React.FC = () => {
  const [keys, setKeys] = useState({ pub: '0x7a9f...3e21', priv: '0x****...****' });
  useEffect(() => {
    const chars = '0123456789abcdef';
    const interval = setInterval(() => {
      const randHex = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * 16)]).join('');
      setKeys({ pub: `0x${randHex(4)}...${randHex(4)}`, priv: '0x****...****' });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--vault-border)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--vault-primary)' }}>
        <KeyRound size={14} /> <span style={{ letterSpacing: '0.1em', fontSize: '0.65rem' }}>RSA-2048 KEY PAIR</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <span style={{ color: 'var(--vault-text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Public Key</span>
          <motion.div key={keys.pub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--vault-success)', marginTop: 4 }}>{keys.pub}</motion.div>
        </div>
        <div>
          <span style={{ color: 'var(--vault-text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Private Key</span>
          <div style={{ color: 'var(--vault-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>{keys.priv} <Lock size={10} /></div>
        </div>
      </div>
    </div>
  );
};

/* â”€â”€ Dashboard Mockup (for ContainerScroll) â”€â”€ */
const DashboardMockup: React.FC = () => (
  <div className="vault-dashboard-mockup">
    {[
      { label: 'TOTAL BALANCE', value: '248,315 DZD', sub: '+12.4% this month', color: 'var(--vault-primary)' },
      { label: 'ACTIVE CARDS', value: '7', sub: '3 virtual Â· 4 physical', color: 'var(--vault-gold)' },
      { label: 'THREAT SCORE', value: '0.02', sub: 'All systems nominal', color: 'var(--vault-success)' },
    ].map((c, i) => (
      <div key={i} className="vault-mockup-card">
        <div className="label">{c.label}</div>
        <div className="value" style={{ color: c.color }}>{c.value}</div>
        <div className="sub">{c.sub}</div>
      </div>
    ))}
  </div>
);

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('td-theme', theme);
  }, [theme]);

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

/* â”€â”€ Ambient Hero Background (light mode replacement for globe) â”€â”€ */
const AmbientHeroBackground: React.FC = () => {
  const { theme } = useTheme();
  if (theme === 'dark') return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Primary orb â€” top right */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'orb-drift-a 18s ease-in-out infinite alternate',
      }} />
      {/* Secondary orb â€” bottom left */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'orb-drift-b 22s ease-in-out infinite alternate',
      }} />
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
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

        {/* Light mode ambient background */}
        <AmbientHeroBackground />

        {/* Particle & Overlay â€” theme-aware */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {theme === 'dark' && <ParticleField />}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: theme === 'dark'
              ? 'linear-gradient(rgba(0, 198, 174, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 198, 174, 0.03) 1px, transparent 1px)'
              : 'none',
            backgroundSize: '60px 60px', opacity: 0.5,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: theme === 'dark'
              ? 'radial-gradient(ellipse at 30% 50%, transparent 10%, rgba(7,11,20,0.92) 80%)'
              : 'none',
          }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* â•â• NAV â•â• */}
          <motion.nav
            className="vault-nav"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="vault-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/vault_logo.png" alt="Vault Logo" />
              <span>TRUST<span className="accent">VAULT</span></span>
            </div>
            <div className="vault-nav-links">
              <button className="vault-nav-link" onClick={scrollToFeatures}>Features</button>
              <button className="vault-nav-link" onClick={scrollToSecurity}>Security</button>
              <button className="vault-nav-link" onClick={() => navigate('/pricing')}>Pricing</button>
              <button className="vault-nav-link" onClick={() => navigate('/docs')}>Docs</button>
            </div>
            <div className="vault-nav-cta">
              <ThemeToggle />
              <button className="vault-btn vault-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="vault-btn vault-btn-primary" onClick={() => navigate('/app/dashboard')}>
                Open Vault <ArrowRight size={16} />
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

                {/* Right — Fintech Hero Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative', minHeight: '500px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="mt-8 lg:mt-0"
                >
                  <FintechHeroWidget />
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

          {/* â•â• FEATURES â€” SpotlightCards â•â• */}
          <section ref={featuresRef} className="vault-section-opaque" style={{ padding: '120px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
                <div className="vault-section-tag">â—† Capabilities</div>
                <h2 className="vault-section-title">
                  Everything You Need to <GradientText>Bank Securely</GradientText>
                </h2>
                <p className="vault-section-desc">
                  From virtual cards to AI-powered fraud detection â€” every feature built with bank-grade security standards and designed for seamless user experience.
                </p>
              </Reveal>

              {/* Bento 2.0 Asymmetrical Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
                {features.map((f, i) => {
                  const isLarge = i === 0 || i === 3;
                  return (
                  <Reveal key={i} delay={i * 0.08} direction="up" className={isLarge ? "md:col-span-2" : "md:col-span-1"}>
                    {isLarge ? (
                      <div className="liquid-glass-card h-full flex md:flex-row flex-col justify-between group overflow-hidden relative p-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="flex flex-col justify-between h-full relative z-10 md:max-w-[55%]">
                          <div className="vault-feature-icon bg-white/5 border border-white/10 group-hover:border-[var(--brand-primary)] group-hover:text-[var(--brand-primary)] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] mb-4">
                            {f.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold font-display tracking-tight text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                          </div>
                        </div>
                        
                        <div className="relative md:w-[40%] h-full flex items-center justify-center overflow-hidden">
                          <img 
                            src={i === 0 ? "/cyber_virtual_cards.png" : "/ekyc_biometric_preview.png"} 
                            alt={f.title} 
                            className="w-full h-auto object-contain transform group-hover:scale-110 transition-transform duration-500 select-none pointer-events-none drop-shadow-[0_10px_30px_rgba(0,198,174,0.2)]" 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="liquid-glass-card h-full flex flex-col justify-between group overflow-hidden relative p-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="vault-feature-icon relative z-10 bg-white/5 border border-white/10 group-hover:border-[var(--brand-primary)] group-hover:text-[var(--brand-primary)] transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                          {f.icon}
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold font-display tracking-tight text-white mb-2">{f.title}</h3>
                          <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    )}
                  </Reveal>
                )})}
              </div>
            </div>
          </section>

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
                    Beyond the consumer wallet, TrustDesk equips administrators with a complete Security Operations Center (SOC). Monitor real-time transaction velocity, coordinate biometric validation, and triage security incidents with deep threat telemetry.
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
                      <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md group hover:border-[rgba(0,198,174,0.3)] transition-all duration-300">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
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
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[var(--vault-primary,#00C6AE)] to-[#0072FF] rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-700" />
                  <div className="relative liquid-glass-card overflow-hidden rounded-2xl border border-white/10 p-2 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <img 
                      src="/ai_threat_triage.png" 
                      alt="Real-time AI Threat Triage Map" 
                      className="w-full h-auto object-cover rounded-xl select-none pointer-events-none transform group-hover:scale-[1.02] transition-transform duration-700" 
                    />
                    
                    {/* Glowing HUD elements on top of the image to make it ultra-premium */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute" style={{ top: '9px', left: '15px' }} />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: '#F87171' }}>LIVE SOC MAP</span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/80 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md font-mono text-[9px]" style={{ color: 'rgba(200,210,230,0.7)' }}>
                      <div className="flex gap-2 justify-between"><span className="text-slate-500">SERVER STATUS:</span> <span className="text-[var(--vault-primary,#00C6AE)]">ACTIVE</span></div>
                      <div className="flex gap-2 justify-between"><span className="text-slate-500">ACTIVE LOGS:</span> <span>1,249 / MIN</span></div>
                    </div>
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
              <DashboardMockup />
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
                    <EncryptionVisualizer />
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
            
            <div className="vault-container relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left side text and actions */}
                <div className="lg:col-span-7 text-left">
                  <Reveal direction="left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6 shadow-lg">
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
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-mono text-slate-500">
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
                    
                    <div className="relative max-w-[360px] lg:max-w-full">
                      <img 
                        src="/trustvault_hero_3d.png" 
                        alt="TrustVault Cyber Cylinder Vault Render" 
                        className="w-full h-auto object-contain select-none pointer-events-none transform group-hover:translate-y-[-10px] group-hover:rotate-1 transition-all duration-700 ease-out drop-shadow-[0_20px_40px_rgba(0,198,174,0.25)]"
                      />
                      
                      {/* Interactive overlay tag */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/85 border border-[rgba(0,198,174,0.3)] backdrop-blur-md px-4 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--vault-primary,#00C6AE)] animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-[var(--vault-primary,#00C6AE)] absolute" style={{ left: '16px' }} />
                        <span className="text-[9px] font-mono tracking-widest text-[var(--vault-primary,#00C6AE)] uppercase font-bold">CRYPTO-ENGINE: ONLINE</span>
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









