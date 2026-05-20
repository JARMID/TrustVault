import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { Spotlight } from '@/components/ui/Spotlight';
import { Shield, Lock } from 'lucide-react';

/**
 * SplineSceneBasic — Premium 3D hero card for TrustVault.
 *
 * Displays an interactive Spline robot scene on the right with a
 * spotlight effect and brand copy on the left.
 *
 * Place in Dashboard hero area or Landing above-the-fold sections.
 */
export function SplineSceneBasic() {
  return (
    <Card
      className="w-full h-[500px] relative overflow-hidden"
      style={{
        background: 'var(--vault-surface, rgba(10,18,40,0.96))',
        border: '1px solid var(--vault-border, rgba(0,198,174,0.12))',
        borderRadius: 20,
      }}
    >
      {/* Interactive spotlight that tracks mouse */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        size={400}
      />

      <div className="flex h-full">
        {/* ── Left: brand copy ── */}
        <div
          className="flex-1 p-8 relative z-10 flex flex-col justify-center"
          style={{ maxWidth: '48%' }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 100,
              background: 'rgba(0,198,174,0.08)',
              border: '1px solid rgba(0,198,174,0.2)',
              marginBottom: 20,
              width: 'fit-content',
            }}
          >
            <Shield size={11} style={{ color: 'var(--vault-primary, #00C6AE)' }} />
            <span
              style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--vault-primary, #00C6AE)',
              }}
            >
              3D Security Suite
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
              background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.45) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Secured by
            <br />
            <span style={{ color: 'var(--vault-primary, #00C6AE)', WebkitTextFillColor: 'var(--vault-primary, #00C6AE)' }}>
              TrustVault
            </span>
          </h1>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--vault-text-secondary, rgba(200,210,230,0.65))',
              lineHeight: 1.7,
              maxWidth: 280,
              marginBottom: 24,
            }}
          >
            Bank-grade AES-256 encryption protecting every transaction in real time.
          </p>

          {/* Trust indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['AES-256-GCM Encryption', 'RSA-2048 Key Pairs', 'Zero-Trust Architecture'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.75rem',
                    color: 'var(--vault-text-secondary, rgba(200,210,230,0.55))',
                  }}
                >
                  <Lock size={10} style={{ color: 'var(--vault-primary, #00C6AE)', flexShrink: 0 }} />
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Right: Spline 3D scene ── */}
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 80,
          background: 'radial-gradient(ellipse, rgba(0,198,174,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
    </Card>
  );
}

export default SplineSceneBasic;



