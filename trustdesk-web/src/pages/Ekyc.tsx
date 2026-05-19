import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanFace, MapPin, BrainCircuit, Camera, RefreshCcw, CheckCircle2, Fingerprint, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const iV = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } } };

export default function Ekyc() {
  const { addToast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'verified'>('idle');
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'capturing' | 'analyzing' | 'done'>('idle');
  const [nnpScore, setNnpScore] = useState<number | null>(null);

  const startAutoCapture = () => {
    setCaptureStatus('capturing');
    setTimeout(() => {
      setCaptureStatus('analyzing');
      setTimeout(() => {
        setCaptureStatus('done');
        addToast({ title: 'Auto Capture Successful', message: 'Document and biometrics captured.', type: 'success' });
      }, 1500);
    }, 1500);
  };

  const startGeoLocalAuto = () => {
    setGeoStatus('locating');
    setTimeout(() => {
      setGeoStatus('verified');
      addToast({ title: 'Geo Local Auto Verified', message: 'Location matched with trusted zones.', type: 'success' });
    }, 2000);
  };

  const runNNP = () => {
    setScanning(true);
    let currentScore = 0;
    const interval = setInterval(() => {
      currentScore += Math.floor(Math.random() * 15) + 5;
      if (currentScore >= 98) {
        clearInterval(interval);
        setNnpScore(98);
        setScanning(false);
        addToast({ title: 'NNP Analysis Complete', message: 'Neural Network Profile validated successfully.', type: 'success' });
      } else {
        setNnpScore(currentScore);
      }
    }, 300);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={cV} initial="hidden" animate="show" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <motion.div variants={iV} className="flex items-center gap-3 mb-2">
            <h1 className="text-h1 gradient-text">E-KYC Studio</h1>
            <ScanFace size={28} style={{ color: 'var(--brand-primary)' }} />
          </motion.div>
          <motion.p variants={iV} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Advanced identity verification powered by Neural Network Processing (NNP), Auto Capture, and Geo Local Auto.
          </motion.p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

          {/* Capture Auto Module */}
          <motion.div variants={iV} className="liquid-glass-card mesh-bg" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} style={{ color: 'var(--brand-primary)' }} /> Capture Auto
              </h2>
              {captureStatus === 'done' && <CheckCircle2 size={18} style={{ color: '#16A34A' }} />}
            </div>

            <div style={{ height: '180px', border: '2px dashed var(--border-subtle)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '20px', background: 'var(--bg-inset)' }}>
              {captureStatus === 'idle' && (
                <div style={{ color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Fingerprint size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.82rem' }}>Awaiting Document & Face</p>
                </div>
              )}
              {captureStatus === 'capturing' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,130,246,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', height: '2px', background: 'var(--brand-primary)', position: 'absolute', top: 0, animation: 'scan 2s ease-in-out infinite' }} />
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.78rem', textTransform: 'uppercase' }} className="animate-pulse">Capturing...</span>
                </div>
              )}
              {captureStatus === 'analyzing' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <RefreshCcw size={28} style={{ color: 'var(--brand-primary)' }} className="animate-spin" />
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.78rem', textTransform: 'uppercase', marginTop: '8px' }}>Analyzing Match</span>
                </div>
              )}
              {captureStatus === 'done' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(22,163,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <ShieldCheck size={28} style={{ color: '#16A34A' }} />
                  </div>
                  <span style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.85rem' }}>Biometrics Secured</span>
                </motion.div>
              )}
            </div>

            <button
              onClick={startAutoCapture}
              disabled={captureStatus !== 'idle'}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', cursor: captureStatus !== 'idle' ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                background: captureStatus !== 'idle' ? 'var(--bg-inset)' : 'var(--brand-primary)', color: captureStatus !== 'idle' ? 'var(--text-tertiary)' : 'white',
                border: captureStatus !== 'idle' ? '1px solid var(--border-subtle)' : 'none',
                boxShadow: captureStatus === 'idle' ? '0 4px 16px rgba(59,130,246,0.25)' : 'none',
              }}
            >
              {captureStatus === 'idle' ? 'Initiate Auto Capture' : 'Processing...'}
            </button>
          </motion.div>

          {/* Geo Local Auto Module */}
          <motion.div variants={iV} className="liquid-glass-card mesh-bg" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: '#16A34A' }} /> Geo Local Auto
              </h2>
              {geoStatus === 'verified' && <CheckCircle2 size={18} style={{ color: '#16A34A' }} />}
            </div>

            <div style={{ height: '180px', borderRadius: '14px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Grid pattern */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(circle at center, var(--text-tertiary) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              {geoStatus === 'idle' && (
                <div style={{ position: 'relative', zIndex: 10, color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MapPin size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.82rem' }}>Location Unknown</p>
                </div>
              )}
              {geoStatus === 'locating' && (
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #16A34A', borderTopColor: 'transparent', marginBottom: '12px' }} className="animate-spin" />
                  <span style={{ color: '#16A34A', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.78rem', textTransform: 'uppercase' }} className="animate-pulse">Triangulating</span>
                </div>
              )}
              {geoStatus === 'verified' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '14px', height: '14px', background: '#16A34A', borderRadius: '50%', boxShadow: '0 0 20px rgba(22,163,74,0.6)', marginBottom: '8px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#16A34A', borderRadius: '50%', opacity: 0.5 }} className="animate-ping" />
                  </div>
                  <span style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.85rem' }}>Algiers, Algeria (Verified)</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>IP & GPS match confirmed</span>
                </motion.div>
              )}
            </div>

            <button
              onClick={startGeoLocalAuto}
              disabled={geoStatus !== 'idle'}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', cursor: geoStatus !== 'idle' ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                background: geoStatus !== 'idle' ? 'var(--bg-inset)' : '#16A34A', color: geoStatus !== 'idle' ? 'var(--text-tertiary)' : 'white',
                border: geoStatus !== 'idle' ? '1px solid var(--border-subtle)' : 'none',
                boxShadow: geoStatus === 'idle' ? '0 4px 16px rgba(22,163,74,0.25)' : 'none',
              }}
            >
              {geoStatus === 'idle' ? 'Verify Location' : 'Verified'}
            </button>
          </motion.div>

          {/* NNP Analysis Module */}
          <motion.div variants={iV} className="liquid-glass-card mesh-bg" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit size={18} style={{ color: 'var(--brand-primary)' }} /> NNP Analysis
              </h2>
              {nnpScore === 98 && <CheckCircle2 size={18} style={{ color: '#16A34A' }} />}
            </div>

            <div style={{ height: '180px', borderRadius: '14px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                {nnpScore !== null ? `${nnpScore}%` : '--'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '16px', textAlign: 'center' }}>Neural Network Profile Confidence Score</p>

              <div style={{ width: '100%', height: '10px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: nnpScore ? `${nnpScore}%` : '0%' }}
                  transition={{ ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-primary))', borderRadius: '999px', boxShadow: '0 0 12px rgba(139,92,246,0.3)' }}
                />
              </div>
            </div>

            <button
              onClick={runNNP}
              disabled={scanning || nnpScore !== null}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', cursor: scanning || nnpScore !== null ? 'not-allowed' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: scanning || nnpScore !== null ? 'var(--bg-inset)' : 'var(--brand-primary)', color: scanning || nnpScore !== null ? 'var(--text-tertiary)' : 'white',
                border: scanning || nnpScore !== null ? '1px solid var(--border-subtle)' : 'none',
                boxShadow: !scanning && nnpScore === null ? '0 4px 16px rgba(139,92,246,0.25)' : 'none',
              }}
            >
              {scanning ? (
                <>
                  <RefreshCcw size={16} className="animate-spin" />
                  Processing NNP...
                </>
              ) : nnpScore !== null ? 'Analysis Complete' : 'Run NNP Engine'}
            </button>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(180px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}




