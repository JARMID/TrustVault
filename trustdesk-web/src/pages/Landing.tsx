import React, { Suspense, useRef, useCallback, Component, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Lock, Activity, Zap, Globe, ChevronRight, ChevronDown,
  CreditCard, Wallet, Fingerprint, ShieldCheck, BarChart3, Send,
  Eye, Cpu, Scan, KeyRound, BadgeCheck, ArrowRight
} from 'lucide-react';
import SecurityGlobe from '../components/3d/SecurityGlobe';
import { Reveal, ScrollProgress, ParticleField, MagneticButton, AnimatedCounter, ParallaxSection } from '../components/ui/ScrollAnimations';
import './Landing.css';

/* ── Canvas Error Boundary ── */
class CanvasErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error("Canvas error:", error); }
  render() {
    if (this.state.hasError) return (
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #0a1628 0%, #000 100%)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(0,198,174,0.2)', animation: 'spin 10s linear infinite' }} />
      </div>
    );
    return this.props.children;
  }
}

/* ── Feature Data ── */
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

/* ── Animated Card Component ── */
const VirtualCardPreview: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="vault-card-preview" style={{ animation: 'float 6s ease-in-out infinite' }}>
      <div
        className="vault-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={isHovered ? { transform: 'rotateY(0deg) rotateX(0deg) scale(1.03)' } : undefined}
      >
        {/* Card Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="vault-card-chip" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={12} style={{ color: 'var(--vault-primary)', opacity: 0.7 }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--vault-primary)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
              ENCRYPTED
            </span>
          </div>
        </div>

        {/* Card Number */}
        <div className="vault-card-number">
          <span style={{ opacity: 0.4 }}>••••</span>
          <span style={{ opacity: 0.4 }}> ••••</span>
          <span style={{ opacity: 0.4 }}> ••••</span>
          <span> 4829</span>
        </div>

        {/* Footer */}
        <div className="vault-card-footer">
          <div>
            <div className="vault-card-label">Card Holder</div>
            <div className="vault-card-value">VAULT USER</div>
          </div>
          <div>
            <div className="vault-card-label">Expires</div>
            <div className="vault-card-value">12/29</div>
          </div>
          <div style={{ opacity: 0.7 }}>
            <Wallet size={28} style={{ color: 'var(--vault-gold)' }} />
          </div>
        </div>
      </div>

      {/* Glow effect behind card */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '10%', right: '10%',
        height: '60%', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0, 198, 174, 0.12), transparent 70%)',
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />
    </div>
  );
};

/* ── Encryption Visualizer ── */
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
    <div style={{
      padding: '24px', borderRadius: '16px',
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid var(--vault-border)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--vault-primary)' }}>
        <KeyRound size={14} /> <span style={{ letterSpacing: '0.1em', fontSize: '0.65rem' }}>RSA-2048 KEY PAIR</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <span style={{ color: 'var(--vault-text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Public Key</span>
          <motion.div key={keys.pub} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--vault-success)', marginTop: 4 }}>
            {keys.pub}
          </motion.div>
        </div>
        <div>
          <span style={{ color: 'var(--vault-text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Private Key</span>
          <div style={{ color: 'var(--vault-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            {keys.priv} <Lock size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   LANDING PAGE — VAULT SECURE WALLET
   ══════════════════════════════════════════ */
const Landing: React.FC = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: globalProgress } = useScroll();
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
      <div className="vault-noise" />
      <div style={{ width: '100%', background: 'var(--vault-bg)', color: 'var(--vault-text)', overflowX: 'hidden' }}>

        {/* Fixed 3D Background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <SecurityGlobe scrollYProgress={globalProgress} />
            </Suspense>
          </CanvasErrorBoundary>
        </div>

        {/* Particle & Overlay */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <ParticleField />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0, 198, 174, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 198, 174, 0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px', opacity: 0.5,
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, transparent 10%, rgba(7,11,20,0.92) 80%)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ══ NAV ══ */}
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
              <button className="vault-btn vault-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="vault-btn vault-btn-primary" onClick={() => navigate('/app/dashboard')}>
                Open Vault <ArrowRight size={16} />
              </button>
            </div>
          </motion.nav>

          {/* ══ HERO ══ */}
          <section ref={heroRef} className="vault-hero">
            <motion.div className="vault-container" style={{ paddingTop: '100px', paddingBottom: '80px', opacity: heroOpacity, scale: heroScale, y: heroY }}>
              <div className="vault-hero-grid">
                {/* Left */}
                <div>
                  <motion.div
                    className="vault-hero-badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="dot" /> Powered by BEYN Banking Infrastructure
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Your Vault.<br />
                    <span className="gradient">Your Rules.</span>
                  </motion.h1>

                  <motion.p
                    className="vault-hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  >
                    Bank-grade digital wallet with AI-powered security, virtual card management, and end-to-end encrypted transactions. Built for the next generation of banking.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
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
                      <div className="vault-trust-item">
                        <Lock size={12} /> AES-256-GCM
                      </div>
                      <div className="vault-trust-divider" />
                      <div className="vault-trust-item">
                        <BadgeCheck size={12} /> PCI-DSS
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right — Card Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 60, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 1.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ perspective: '1200px' }}
                >
                  <VirtualCardPreview />
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

          {/* ══ STATS BAR ══ */}
          <section style={{ position: 'relative', zIndex: 20 }}>
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

          {/* ══ FEATURES ══ */}
          <section ref={featuresRef} style={{ padding: '96px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="vault-section-tag">◆ Capabilities</div>
                <h2 className="vault-section-title">
                  Everything You Need to <span className="gradient">Bank Securely</span>
                </h2>
                <p className="vault-section-desc">
                  From virtual cards to AI-powered fraud detection — every feature built with bank-grade security standards and designed for seamless user experience.
                </p>
              </Reveal>

              <div className="vault-features-grid">
                {features.map((f, i) => (
                  <Reveal key={i} delay={i * 0.08} direction="up">
                    <div className="vault-feature-card">
                      <div className="vault-feature-icon">{f.icon}</div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <div className="vault-glow-divider" />

          {/* ══ SECURITY SECTION ══ */}
          <section id="security-section" style={{ padding: '120px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <div className="vault-security-grid">
                {/* Left — Sticky */}
                <div style={{ position: 'sticky', top: 120 }}>
                  <Reveal>
                    <div className="vault-section-tag">◆ Security Architecture</div>
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

                {/* Right — Scrollable items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: <KeyRound size={28} />, title: 'RSA-2048 Key Pairs', text: 'Each user gets a unique public/private key pair. Card data is encrypted client-side before it ever reaches our servers.' },
                    { icon: <Eye size={28} />, title: 'AI Transaction Monitor', text: 'Real-time ML engine analyzes transaction patterns, velocity, and geolocation to flag anomalies with 99.7% accuracy.' },
                    { icon: <Globe size={28} />, title: 'BEYN Banking Network', text: 'Integrated with Algeria\'s leading banking middleware. Instant settlement, interbank transfers, and regulatory compliance.' },
                    { icon: <Shield size={28} />, title: 'Audit Trail & Compliance', text: 'Every action logged with tamper-proof audit trails. GDPR, PCI-DSS, and local banking regulation compliance built-in.' },
                  ].map((item, i) => (
                    <Reveal key={i} delay={0.1 * i} direction="up">
                      <div className="vault-security-item">
                        <div style={{ color: 'var(--vault-primary)', marginBottom: 20, background: 'var(--vault-primary-glow)', display: 'inline-flex', padding: 16, borderRadius: 16 }}>
                          {item.icon}
                        </div>
                        <h3 style={{ color: 'var(--vault-text)', fontSize: '1.4rem', marginBottom: 12, fontWeight: 600 }}>{item.title}</h3>
                        <p style={{ color: 'var(--vault-text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>{item.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ TRUSTED BY ══ */}
          <section style={{ padding: '64px 0', background: 'rgba(0, 0, 0, 0.5)', borderTop: '1px solid var(--vault-border)', borderBottom: '1px solid var(--vault-border)', position: 'relative', zIndex: 20 }}>
            <ParallaxSection speed={-0.05}>
              <div className="vault-container">
                <Reveal>
                  <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--vault-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      Trusted by leading institutions
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 48 }}>
                    {['BEYN Network', 'BNA Bank', 'CPA Finance', 'Algérie Poste', 'Banque ABC', 'SATIM'].map((name, i) => (
                      <div key={i} className="vault-trusted-logo">{name}</div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </ParallaxSection>
          </section>

          {/* ══ DASHBOARD PREVIEW ══ */}
          <section style={{ padding: '96px 0', position: 'relative', zIndex: 20 }}>
            <div className="vault-container">
              <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="vault-section-tag">◆ Interface</div>
                <h2 className="vault-section-title">
                  Designed for <span className="gradient">Modern Banking</span>
                </h2>
                <p className="vault-section-desc">
                  Every pixel crafted for instant financial clarity and rapid decision-making.
                </p>
              </Reveal>

              <div className="vault-preview-grid">
                {[
                  { label: 'WALLET', value: 'Live Balance', detail: 'Real-time balance with multi-currency support', color: 'var(--vault-primary)' },
                  { label: 'CARDS', value: 'Virtual', detail: 'Generate, freeze, and manage unlimited virtual cards', color: 'var(--vault-gold)' },
                  { label: 'AI TRIAGE', value: 'Active', detail: 'ML-powered transaction monitoring and fraud alerts', color: 'var(--vault-danger)' },
                ].map((card, i) => (
                  <Reveal key={i} delay={i * 0.12} direction="scale">
                    <div
                      className="vault-preview-card"
                      onMouseOver={e => { e.currentTarget.style.borderColor = `${card.color}40`; e.currentTarget.style.boxShadow = `0 20px 60px ${card.color}15`; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--vault-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${card.color}10, transparent 70%)` }} />
                      <div style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: card.color, letterSpacing: '0.15em', marginBottom: 12 }}>{card.label}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>{card.value}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--vault-text-secondary)', lineHeight: 1.6 }}>{card.detail}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ══ FINAL CTA ══ */}
          <section style={{ padding: '112px 0', position: 'relative', zIndex: 20, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)' }}>
            <div className="vault-container" style={{ textAlign: 'center' }}>
              <Reveal>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'var(--vault-primary-glow)', border: '1px solid rgba(0,198,174,0.2)', marginBottom: 24 }}>
                  <Shield size={32} style={{ color: 'var(--vault-primary)' }} />
                </div>
                <h2 className="vault-section-title">Ready to Secure Your Finances?</h2>
                <p style={{ fontSize: '1rem', color: 'var(--vault-text-secondary)', marginBottom: 40, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 40px auto' }}>
                  Open your TrustVault and take command of your financial security with bank-grade encryption and AI-powered protection.
                </p>
                <MagneticButton className="vault-btn vault-btn-large" onClick={() => navigate('/app/dashboard')}>
                  <Fingerprint size={24} style={{ color: 'var(--vault-bg)' }} />
                  <span>Open Your Vault</span>
                  <ChevronRight size={20} style={{ opacity: 0.7 }} />
                </MagneticButton>
              </Reveal>
            </div>
          </section>

          {/* ══ FOOTER ══ */}
          <footer className="vault-footer">
            <div className="vault-container" style={{ paddingTop: 40, paddingBottom: 40 }}>
              <div className="vault-footer-inner">
                <div className="vault-nav-logo">
                  <img src="/vault_logo.png" alt="Vault" style={{ width: 28, height: 28 }} />
                  <span style={{ fontSize: '0.9rem' }}>TRUST<span className="accent">VAULT</span></span>
                </div>
                <div className="vault-footer-links">
                  {['Privacy', 'Terms', 'Documentation', 'API'].map(link => (
                    <button key={link} className="vault-footer-link">{link}</button>
                  ))}
                  <div className="vault-system-badge">
                    <div className="dot" /> SYSTEM NORMAL
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--vault-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  © {new Date().getFullYear()} TrustVault · Powered by BEYN
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Landing;
