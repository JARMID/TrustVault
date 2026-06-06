import * as React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { ArrowUp, Shield, Lock, Globe } from 'lucide-react';

// Register ScrollTrigger safely for React
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────
// INLINE STYLES (theme-adaptive via CSS vars from Landing.css)
// ─────────────────────────────────────────────────────────────
const FOOTER_STYLES = `


.td-footer-wrapper {
  font-family: 'IBM Plex Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Animations ── */
@keyframes td-footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.35; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.6; }
}
@keyframes td-footer-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes td-footer-heartbeat {
  0%,  100% { transform: scale(1);   }
  20%, 60%  { transform: scale(1.25); }
  40%       { transform: scale(1);   }
}
@keyframes td-footer-ping {
  0%   { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

.td-animate-breathe    { animation: td-footer-breathe  8s ease-in-out infinite alternate; }
.td-animate-marquee    { animation: td-footer-marquee  50s linear infinite; }
.td-animate-heartbeat  { animation: td-footer-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; }
.td-animate-ping       { animation: td-footer-ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }

@media (prefers-reduced-motion: reduce) {
  .td-animate-breathe,
  .td-animate-marquee,
  .td-animate-heartbeat,
  .td-animate-ping {
    animation: none !important;
    transform: none !important;
  }
}

/* ── Grid background ── */
.td-footer-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(0, 198, 174,0.06)) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 198, 174,0.06)) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

/* ── Aurora glow ── */
.td-footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    var(--brand-primary-glow)) 0%,
    var(--brand-primary-glow) 40%,
    transparent 70%
  );
}

/* ── Giant ghost text ── */
.td-footer-giant {
  font-size: clamp(80px, 22vw, 340px);
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 198, 174,0.06));
  background: linear-gradient(180deg, var(--brand-primary-glow)) 0%, transparent 55%);
  -webkit-background-clip: text;
  background-clip: text;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}

/* ── Gradient heading ── */
.td-footer-heading {
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px var(--brand-primary-glow)));
}

/* ── Glass pill buttons ── */
.td-glass-pill {
  background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
  box-shadow:
    0 10px 30px -10px rgba(0,0,0,0.5),
    inset 0 1px 1px rgba(255,255,255,0.08),
    inset 0 -1px 2px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  color: rgba(255,255,255,0.7);
}
.td-glass-pill:hover {
  background: linear-gradient(145deg, var(--brand-primary-glow)) 0%, rgba(0, 198, 174,0.06)) 100%);
  border-color: var(--border-brand);
  box-shadow:
    0 20px 40px -10px var(--brand-primary-glow)),
    inset 0 1px 1px var(--brand-primary-glow));
  color: #fff;
}
.td-glass-pill-primary {
  background: linear-gradient(135deg, var(--brand-primary-glow)) 0%, rgba(0, 198, 174,0.06)) 100%);
  border-color: var(--border-brand);
  color: var(--brand-primary);
}
.td-glass-pill-primary:hover {
  background: linear-gradient(135deg, rgba(0,198,174,0.32) 0%, rgba(0,140,124,0.22) 100%);
  border-color: rgba(0,198,174,0.55);
  color: #fff;
  box-shadow: 0 0 40px var(--brand-primary-glow));
}

/* ── Marquee strip ── */
.td-footer-strip {
  border-top: 1px solid var(--brand-primary-glow));
  border-bottom: 1px solid var(--brand-primary-glow));
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ── Divider line ── */
.td-footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brand-primary-glow)) 30%, var(--brand-primary-glow)) 70%, transparent);
}

/* LIGHT MODE OVERRIDES */
[data-theme="light"] .td-footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    var(--brand-primary-glow) 0%,
    rgba(0, 198, 174,0.04) 40%,
    transparent 70%
  );
}
[data-theme="light"] .td-footer-giant {
  -webkit-text-stroke: 1px var(--border-strong);
}
[data-theme="light"] .td-footer-heading {
  background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
}
[data-theme="light"] .td-glass-pill {
  background: var(--bg-surface);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
[data-theme="light"] .td-glass-pill:hover {
  background: var(--bg-elevated);
  border-color: var(--border-active);
  box-shadow: 0 15px 35px -10px var(--brand-primary-glow), inset 0 1px 1px rgba(255,255,255,0.9);
  color: var(--text-primary);
}
[data-theme="light"] .td-glass-pill-primary {
  background: linear-gradient(135deg, var(--brand-primary) 0%, #2563EB 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 15px var(--brand-primary-glow);
}
[data-theme="light"] .td-glass-pill-primary:hover {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 25px var(--brand-primary-glow);
}
[data-theme="light"] .td-footer-strip {
  background: var(--bg-surface-translucent);
}
`;

// ─────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────
type MagBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
    children?: React.ReactNode;
  };

const MagneticBtn = React.forwardRef<HTMLElement, MagBtnProps>(
  ({ className, children, as, ...props }, forwardedRef) => {
    const Tag = (as || 'button') as React.ElementType;
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const el = localRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * 0.38, y: y * 0.38, rotationX: -y * 0.12, rotationY: x * 0.12, scale: 1.05, ease: 'power2.out', duration: 0.4 });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1,0.3)', duration: 1.2 });
        };
        el.addEventListener('mousemove', onMove as EventListener);
        el.addEventListener('mouseleave', onLeave);
        return () => {
          el.removeEventListener('mousemove', onMove as EventListener);
          el.removeEventListener('mouseleave', onLeave);
        };
      }, el);
      return () => ctx.revert();
    }, []);

    const Element = Tag as any;
    return (
      <Element
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn('cursor-pointer', className)}
        {...props}
      >
        {children}
      </Element>
    );
  }
);
MagneticBtn.displayName = 'MagneticBtn';

// ─────────────────────────────────────────────────────────────
// MARQUEE ITEMS
// ─────────────────────────────────────────────────────────────
const MarqueeSlide = () => (
  <div className="flex items-center" style={{ gap: '3rem', padding: '0 1.5rem' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Shield size={12} style={{ color: 'var(--brand-primary)', opacity: 0.6 }} />
      Zero-Trust Architecture
    </span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Lock size={12} style={{ color: 'var(--brand-primary)', opacity: 0.6 }} />
      AES-256-GCM Encryption
    </span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Globe size={12} style={{ color: 'var(--brand-primary)', opacity: 0.6 }} />
      BEYN Banking Network
    </span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
    <span>PCI-DSS Level 1 Compliant</span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
    <span>99.99% Uptime SLA</span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
    <span>RSA-2048 Key Pairs</span>
    <span style={{ color: 'var(--brand-primary)', opacity: 0.4 }}>✦</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Support', href: '#' },
];

export function CinematicFooter() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const linksRef     = useRef<HTMLDivElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Giant background text parallax
        gsap.fromTo(
          giantTextRef.current,
          { y: '8vh', scale: 0.85, opacity: 0 },
          {
            y: '0vh', scale: 1, opacity: 1, ease: 'power1.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 85%', end: 'bottom bottom', scrub: 1.2 },
          }
        );

        // Staggered content reveal
        gsap.fromTo(
          [headingRef.current, linksRef.current, bottomRef.current],
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 50%', end: 'center bottom', scrub: 1 },
          }
        );
      } else {
        // Fallback for reduced motion: just ensure everything is visible
        gsap.set(giantTextRef.current, { y: '0vh', scale: 1, opacity: 1 });
        gsap.set([headingRef.current, linksRef.current, bottomRef.current], { y: 0, opacity: 1 });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }} />

      {/*
        Curtain-reveal wrapper: sits in normal flow, clip-path
        creates the "scroll to reveal" effect for the fixed footer below.
      */}
      <div
        ref={wrapperRef}
        className="td-footer-wrapper"
        style={{ position: 'relative', height: '100vh', width: '100%', clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        {/* Fixed footer — sticks to bottom of viewport, revealed by scroll */}
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            zIndex: 0,
          }}
        >
          {/* ── Ambient Aurora ── */}
          <div
            className="td-footer-aurora td-animate-breathe"
            style={{
              position: 'absolute', left: '50%', top: '50%',
              width: '80vw', height: '60vh',
              borderRadius: '50%',
              filter: 'blur(80px)',
              pointerEvents: 'none', zIndex: 0,
            }}
          />

          {/* ── Grid background ── */}
          <div className="td-footer-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

          {/* ── Giant ghost text ── */}
          <div
            ref={giantTextRef}
            className="td-footer-giant"
            style={{
              position: 'absolute',
              bottom: '-4vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 0,
            }}
          >
            TRUSTVAULT
          </div>

          {/* ── 1. Diagonal Marquee strip (top of footer) ── */}
          <div
            className="td-footer-strip"
            style={{
              position: 'absolute', top: 40, left: 0, width: '100%',
              overflow: 'hidden', padding: '12px 0',
              transform: 'rotate(-1.5deg) scaleX(1.08)',
              zIndex: 10,
            }}
          >
            <div
              className="td-animate-marquee"
              style={{
                display: 'flex', width: 'max-content',
                fontSize: '0.65rem', fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700, letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary))',
              }}
            >
              <MarqueeSlide />
              <MarqueeSlide />
              <MarqueeSlide />
            </div>
          </div>

          {/* ── 2. Main CTA content ── */}
          <div
            style={{
              position: 'relative', zIndex: 10,
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '0 24px', marginTop: '80px',
              maxWidth: '900px', margin: '80px auto 0 auto', width: '100%',
            }}
          >
            <h2
              ref={headingRef}
              className="td-footer-heading"
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                textAlign: 'center',
                marginBottom: '2.5rem',
              }}
            >
              Ready to Secure<br />Your Finances?
            </h2>

            {/* Magnetic CTA pills */}
            <div
              ref={linksRef}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}
            >
              {/* Primary actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                <MagneticBtn
                  as="button"
                  className="td-glass-pill td-glass-pill-primary"
                  style={{
                    padding: '16px 40px', borderRadius: '100px',
                    fontWeight: 700, fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    border: '1px solid var(--border-brand)',
                  }}
                >
                  <Shield size={16} />
                  Open Your Vault
                </MagneticBtn>

                <MagneticBtn
                  as="button"
                  className="td-glass-pill"
                  style={{
                    padding: '16px 40px', borderRadius: '100px',
                    fontWeight: 600, fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  View Documentation
                </MagneticBtn>
              </div>

              {/* Secondary link pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {footerLinks.map((link) => (
                  <MagneticBtn
                    key={link.label}
                    as="a"
                    href={link.href}
                    className="td-glass-pill"
                    style={{
                      padding: '8px 20px', borderRadius: '100px',
                      fontSize: '0.75rem', fontWeight: 500,
                    }}
                  >
                    {link.label}
                  </MagneticBtn>
                ))}
              </div>
            </div>
          </div>

          {/* ── 3. Bottom bar ── */}
          <div ref={bottomRef} style={{ position: 'relative', zIndex: 20, width: '100%' }}>
            <div className="td-footer-divider" />
            <div
              style={{
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 40px', gap: '1rem',
              }}
            >
              {/* Logo + copyright */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, rgba(0, 198, 174,0.2), rgba(0, 198, 174,0.06))',
                    border: '1px solid rgba(0, 198, 174,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Shield size={14} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.65rem',
                    color: 'var(--text-tertiary))',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  © {new Date().getFullYear()} TrustVault · Engineered by JARMID
                </span>
              </div>

              {/* "Made with" badge */}
              <div
                className="td-glass-pill"
                style={{
                  padding: '6px 16px', borderRadius: '100px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-tertiary))' }}>
                  Engineered with
                </span>
                <span
                  className="td-animate-heartbeat"
                  style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', display: 'inline-block' }}
                >
                  ⚡
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-tertiary))' }}>
                  by
                </span>
                <span style={{ fontWeight: 900, fontSize: '0.78rem', color: 'var(--brand-primary)', letterSpacing: '0.05em' }}>
                  JARMID
                </span>
              </div>

              {/* System status + back to top */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--vault-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ position: 'relative', display: 'inline-flex' }}>
                    <span className="td-animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--accent-success)', opacity: 0.5 }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-success)', display: 'inline-block', position: 'relative' }} />
                  </span>
                  Systems Normal
                </div>

                <MagneticBtn
                  as="button"
                  onClick={scrollToTop}
                  className="td-glass-pill"
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: 0,
                  }}
                >
                  <ArrowUp size={14} />
                </MagneticBtn>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;







