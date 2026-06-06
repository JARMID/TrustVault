import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Lock } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

/* ── Realistic Card chip SVG ── */
const Chip = ({ dark = true }: { dark?: boolean }) => (
  <svg width="46" height="34" viewBox="0 0 38 30" fill="none">
    <defs>
      <linearGradient id={dark ? 'chipGradDark' : 'chipGradLight'} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e5c158" />
        <stop offset="50%" stopColor="#fde08b" />
        <stop offset="100%" stopColor="#d4af37" />
      </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" width="37" height="29" rx="6" fill={`url(#${dark ? 'chipGradDark' : 'chipGradLight'})`} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    <path d="M 12 0.5 L 12 29.5 M 26 0.5 L 26 29.5 M 0.5 10 L 37.5 10 M 0.5 20 L 37.5 20" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
    <circle cx="19" cy="15" r="3" fill="none" stroke="rgba(0,0,0,0.1)" />
  </svg>
);

/* ── TV Monogram SVG — engrained into card surface ── */
const TVMonogram = ({ color = 'rgba(255,255,255,0.08)', size = 180 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* T horizontal bar */}
    <rect x="15" y="18" width="70" height="8" rx="1" fill={color} />
    {/* T vertical stem */}
    <rect x="43" y="18" width="14" height="62" rx="1" fill={color} />
    {/* V left stroke */}
    <polygon points="20,18 36,18 56,80 44,80" fill={color} />
    {/* V right stroke */}
    <polygon points="80,18 64,18 44,80 56,80" fill={color} />
  </svg>
);

export const TrustDesk3DWidget: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipLayerRef = useRef<HTMLDivElement>(null);
  const cardShadowRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  // Flip animation
  useEffect(() => {
    if (flipLayerRef.current) {
      gsap.to(flipLayerRef.current, {
        rotateY: isFlipped ? 180 : 0,
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }
  }, [isFlipped]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(cardRef.current,
        { rotateX: 30, rotateY: -30, y: 150, scale: 0.8, opacity: 0 },
        { rotateX: 10, rotateY: -15, y: 0, scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
      gsap.fromTo(cardShadowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power4.out', delay: 0.2 }
      );

      // Floating
      gsap.to(cardRef.current, {
        y: '-=15', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // Shimmer
      gsap.to(shimmerRef.current, {
        x: '300%', duration: 3, repeat: -1, ease: 'linear', repeatDelay: 1.5
      });
    }, containerRef);

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = (clientX / innerWidth - 0.5) * 30;
      const yPos = (clientY / innerHeight - 0.5) * -30;
      gsap.to(cardRef.current, { rotateX: 10 + yPos, rotateY: -15 + xPos, duration: 1, ease: 'power2.out' });
      gsap.to(cardShadowRef.current, { x: xPos * -2, y: yPos * -2, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => { ctx.revert(); window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  /* ── Theme-aware card styles ── */
  const frontBg = isDark
    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16162a 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf0 50%, #dfe3e8 100%)';
  const frontTexture = isDark ? '/card_dark_texture.png' : '/card_light_texture.png';
  const textColor = isDark ? '#ffffff' : '#1e293b';
  const textSecondary = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)';
  const chipShadow = isDark ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.15)';
  const logoWatermark = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const shimmerColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)';
  const contactlessStroke = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.3)';
  const contactlessFill = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.3)';
  const mcBlendMode = isDark ? 'screen' : 'multiply';
  const backBg = isDark
    ? 'linear-gradient(135deg, #0d0d1a 0%, #111122 50%, #0a0a15 100%)'
    : 'linear-gradient(135deg, #e4e8ec 0%, #d8dce0 50%, #cdd2d6 100%)';
  const backStripe = isDark ? '#111' : '#334155';
  const backText = isDark ? 'rgba(255,255,255,0.4)' : '#64748b';
  const accentColor = '#00C6AE';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', perspective: '1500px' }}>

      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,198,174,${isDark ? 0.15 : 0.08}) 0%, transparent 70%)`, filter: 'blur(48px)' }} />
      </div>

      {/* Shadow */}
      <div
        ref={cardShadowRef}
        style={{ position: 'absolute', width: 400, height: 250, background: `rgba(0,0,0,${isDark ? 0.4 : 0.12})`, filter: 'blur(32px)', borderRadius: 30, transform: 'translateY(80px) rotateX(60deg)' }}
      />

      {/* Main 3D Card */}
      <div
        ref={cardRef}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ position: 'relative', width: 440, height: 280, transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d', willChange: 'transform', zIndex: 10, cursor: 'pointer' }}
      >
        <div ref={flipLayerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}>

          {/* ══ FRONT FACE ══ */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden',
            background: frontBg,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 30px 60px ${shadowColor}, inset 0 1px 0 ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)'}`,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)', WebkitTransform: 'translateZ(1px)',
          }}>
            {/* Texture overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${frontTexture})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: isDark ? 0.4 : 0.3, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

            {/* Engrained TV Logo Watermark — large, centered */}
            <div style={{ position: 'absolute', right: -10, bottom: -20, opacity: 1, pointerEvents: 'none', transform: 'rotate(-5deg)' }}>
              <TVMonogram color={logoWatermark} size={200} />
            </div>

            {/* Moving shimmer */}
            <div
              ref={shimmerRef}
              style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', left: '-50%', background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`, transform: 'skewX(-25deg)', pointerEvents: 'none', mixBlendMode: 'screen' }}
            />

            {/* Content */}
            <div style={{ position: 'absolute', inset: 0, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: 'translateZ(2px)' }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src="/vault_logo_transparent.png"
                    alt="TV"
                    style={{ width: 32, height: 32, objectFit: 'contain', filter: isDark ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
                  />
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)', textShadow: isDark ? '0 2px 4px rgba(0,0,0,0.6)' : 'none' }}>TRUSTVAULT</span>
                </div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={contactlessStroke} strokeWidth="1.5">
                  <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5" strokeLinecap="round" />
                  <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill={contactlessFill} stroke="none" />
                </svg>
              </div>

              {/* Middle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ width: 48, boxShadow: chipShadow, borderRadius: 6 }}>
                  <Chip dark={isDark} />
                </div>
                <div style={{ fontSize: '1.45rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: textColor, letterSpacing: '0.25em', textShadow: isDark ? '0 2px 6px rgba(0,0,0,0.6)' : 'none' }}>
                  4728 •••• •••• 3291
                </div>
              </div>

              {/* Bottom row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: textSecondary, letterSpacing: '0.15em' }}>
                  VALID THRU 12/28
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EB001B', opacity: 0.9, boxShadow: `0 2px 10px ${shadowColor}` }} />
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F79E1B', opacity: 0.9, marginLeft: -14, mixBlendMode: mcBlendMode as any, boxShadow: `0 2px 10px ${shadowColor}` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ══ BACK FACE ══ */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden',
            background: backBg,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 30px 60px ${shadowColor}`,
            transform: 'rotateY(180deg) translateZ(1px)', WebkitTransform: 'rotateY(180deg) translateZ(1px)',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          }}>
            {/* Texture overlay on back too */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${frontTexture})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: isDark ? 0.3 : 0.2, mixBlendMode: 'overlay', pointerEvents: 'none' }} />

            {/* Engrained logo watermark — back side, subtle */}
            <div style={{ position: 'absolute', left: 20, bottom: 50, opacity: 1, pointerEvents: 'none', transform: 'rotate(5deg)' }}>
              <TVMonogram color={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} size={120} />
            </div>

            {/* Magnetic stripe */}
            <div style={{ width: '100%', height: 50, background: backStripe, marginTop: 32, boxShadow: isDark ? 'inset 0 -2px 4px rgba(255,255,255,0.05)' : 'inset 0 -1px 2px rgba(0,0,0,0.1)' }} />

            {/* Signature strip & CVV */}
            <div style={{ margin: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 40, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)', color: isDark ? '#fff' : '#000' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#fff' : '#1e293b', background: isDark ? 'rgba(255,255,255,0.1)' : '#fff', padding: '6px 14px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>392</div>
            </div>

            {/* Fine print */}
            <div style={{ textAlign: 'center', fontSize: '0.6rem', color: backText, fontFamily: 'var(--font-mono)', padding: '0 24px', marginTop: 8, letterSpacing: '0.1em', lineHeight: 1.8 }}>
              AES-256-GCM ENCRYPTED · PCI-DSS COMPLIANT<br />ZERO-TRUST ARCHITECTURE
            </div>

            {/* Bottom corner secure tag */}
            <div style={{ position: 'absolute', bottom: 16, right: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} color={accentColor} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', color: accentColor }}>TRUSTVAULT SECURED</span>
            </div>
          </div>

        </div>
      </div>

      {/* Flip text */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ position: 'absolute', bottom: 24, fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)', textAlign: 'center', cursor: 'pointer', animation: 'pulse 2s ease-in-out infinite' }}
      >
        CLICK TO FLIP CARD
      </div>
    </div>
  );
};

export default TrustDesk3DWidget;
