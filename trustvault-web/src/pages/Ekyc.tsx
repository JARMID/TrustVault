import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, MapPin, BrainCircuit, CheckCircle2, ShieldCheck, ChevronRight, Fingerprint, Camera, Activity, Lock, Search } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

const Ekyc: React.FC = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [nnpScore, setNnpScore] = useState<number>(0);
  const [geoVerified, setGeoVerified] = useState(false);

  // Step 1: Document Capture Logic
  const handleCapture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast({ title: 'Biometric Capture Success', message: 'Liveness confirmed and encrypted.', type: 'success' });
      setStep(2);
    }, 2500);
  };

  // Step 2: NNP Logic
  const handleNNP = () => {
    setIsScanning(true);
    let score = 0;
    const interval = setInterval(() => {
      score += Math.floor(Math.random() * 15) + 5;
      if (score >= 98) {
        clearInterval(interval);
        setNnpScore(98);
        setIsScanning(false);
        addToast({ title: 'NNP Profile Validated', message: 'Neural behavioral profile matches historical data.', type: 'success' });
        setTimeout(() => setStep(3), 1000);
      } else {
        setNnpScore(score);
      }
    }, 200);
  };

  // Step 3: Geo Logic
  const handleGeo = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setGeoVerified(true);
      addToast({ title: 'Geo-Local Verification', message: 'IP & GPS telemetry match confirmed.', type: 'success' });
      setTimeout(() => setStep(4), 1000);
    }, 2000);
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,198,174,0.06) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(138,43,226,0.04) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--text-tertiary) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.05, mixBlendMode: 'screen' }} />
      </div>

      <div className="max-w-[800px] w-full mx-auto relative z-10 flex-1 flex flex-col pt-12 pb-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-[0_0_30px_rgba(0,198,174,0.15)]">
              <ShieldCheck size={32} />
            </div>
          </motion.div>
          <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Identity Provisioning
          </motion.h1>
          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Bank-grade military encryption and decentralized biometric authorization sequence.
          </motion.p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative px-4">
          <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[var(--bg-inset)] -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-8 h-[2px] bg-[var(--brand-primary)] -translate-y-1/2 z-0 transition-all duration-700 ease-in-out shadow-[0_0_10px_var(--brand-primary)]"
            style={{ width: `calc(${((step - 1) / 3) * 100}% - 3rem)` }}
          />

          {[
            { id: 1, icon: ScanFace, label: 'Liveness' },
            { id: 2, icon: BrainCircuit, label: 'NNP Check' },
            { id: 3, icon: MapPin, label: 'Geo-Local' },
            { id: 4, icon: CheckCircle2, label: 'Issuance' }
          ].map((s) => {
            const isActive = step === s.id;
            const isPast = step > s.id;
            const Icon = s.icon;
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-[var(--brand-primary)] text-white shadow-[0_0_20px_rgba(0,198,174,0.4)] scale-110' :
                    isPast ? 'bg-accent-success text-white' :
                    'bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="liquid-glass-card p-1 relative overflow-hidden shadow-2xl flex-1 max-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Biometric */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8 h-full flex flex-col"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Biometric Liveness Scan</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Position your face in the frame to capture decentralized biometric identifiers.</p>
                </div>

                <div className="flex-1 flex items-center justify-center relative mb-8">
                  <div className={`w-64 h-64 rounded-full border-4 border-dashed transition-colors duration-500 relative flex items-center justify-center overflow-hidden ${isScanning ? 'border-[var(--brand-primary)]' : 'border-[var(--border-subtle)]'}`}>
                    
                    {isScanning && (
                      <div className="absolute inset-0 bg-[rgba(0,198,174,0.1)] z-10">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--brand-primary)] shadow-[0_0_20px_var(--brand-primary)] animate-[scan_2s_ease-in-out_infinite]" />
                      </div>
                    )}
                    
                    <Camera size={48} className={isScanning ? 'text-[var(--brand-primary)] animate-pulse' : 'text-[var(--text-tertiary)]'} />
                    
                    {/* Corner Reticles */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[var(--text-tertiary)] opacity-50" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[var(--text-tertiary)] opacity-50" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[var(--text-tertiary)] opacity-50" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[var(--text-tertiary)] opacity-50" />
                  </div>
                </div>

                <button 
                  onClick={handleCapture}
                  disabled={isScanning}
                  className="btn btn-primary w-full py-4 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                >
                  {isScanning ? (
                    <><Activity className="animate-spin" size={18} /> Processing Biometrics...</>
                  ) : (
                    <>Initiate Scan <ChevronRight size={18} /></>
                  )}
                </button>
              </motion.div>
            )}

            {/* STEP 2: NNP */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8 h-full flex flex-col"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Neural Network Profiling</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Analyzing behavioral metadata and device entropy against trusted records.</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
                  <BrainCircuit size={80} className={`mb-8 ${isScanning ? 'text-[#8A2BE2] animate-pulse' : 'text-[var(--text-tertiary)]'}`} />
                  
                  <div className="w-full max-w-sm relative">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] font-mono mb-2">
                      <span>NNP Confidence Level</span>
                      <span className={nnpScore >= 98 ? 'text-accent-success' : 'text-[var(--text-primary)]'}>{nnpScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-[var(--bg-inset)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${nnpScore}%` }}
                        className={`h-full transition-colors ${nnpScore >= 98 ? 'bg-accent-success shadow-[0_0_15px_var(--accent-success)]' : 'bg-[#8A2BE2] shadow-[0_0_15px_rgba(138,43,226,0.6)]'}`}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNNP}
                  disabled={isScanning || nnpScore >= 98}
                  className="btn w-full py-4 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                  style={{ background: isScanning ? 'var(--bg-inset)' : 'linear-gradient(135deg, #8A2BE2, #6B21A8)', color: 'white', border: 'none' }}
                >
                  {isScanning ? (
                    <><Activity className="animate-spin" size={18} /> Profiling Engine Active...</>
                  ) : nnpScore >= 98 ? (
                    <><CheckCircle2 size={18} /> Verified</>
                  ) : (
                    <>Run NNP Analysis <ChevronRight size={18} /></>
                  )}
                </button>
              </motion.div>
            )}

            {/* STEP 3: Geo */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8 h-full flex flex-col"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Geo-Local Triangulation</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Validating physical presence and ISP routing tables.</p>
                </div>

                <div className="flex-1 flex items-center justify-center relative mb-8">
                  <div className="relative w-64 h-64 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-inset)] overflow-hidden flex items-center justify-center">
                    
                    {/* Map Grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <MapPin size={48} className={`relative z-10 ${geoVerified ? 'text-accent-success' : isScanning ? 'text-accent-warning animate-bounce' : 'text-[var(--text-tertiary)]'}`} />
                    
                    {geoVerified && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute bottom-4 bg-accent-success-bg border border-accent-success-glow px-3 py-1.5 rounded-lg backdrop-blur-md text-accent-success text-xs font-mono shadow-[0_0_20px_rgba(22,163,74,0.2)]"
                      >
                        MATCH: Algiers, DZ
                      </motion.div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleGeo}
                  disabled={isScanning || geoVerified}
                  className="btn w-full py-4 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                  style={{ background: isScanning || geoVerified ? 'var(--bg-inset)' : '#F59E0B', color: isScanning || geoVerified ? 'var(--text-secondary)' : 'white', border: 'none' }}
                >
                  {isScanning ? (
                    <><Search className="animate-spin" size={18} /> Triangulating...</>
                  ) : geoVerified ? (
                    <><CheckCircle2 size={18} className="text-accent-success" /> Location Secured</>
                  ) : (
                    <>Verify Location <ChevronRight size={18} /></>
                  )}
                </button>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-8 h-full flex flex-col items-center justify-center text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-24 h-24 bg-accent-success-bg border-2 border-accent-success rounded-full flex items-center justify-center text-accent-success mb-6 shadow-[0_0_40px_rgba(22,163,74,0.4)]"
                >
                  <Lock size={40} />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Identity Provisioned</h2>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">
                  Your identity has been successfully cryptographically verified and bound to your device hardware.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                  <div className="bg-[var(--bg-inset)] border border-[var(--border-subtle)] p-3 rounded-lg text-left">
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Clearance</p>
                    <p className="text-sm font-mono text-accent-success">LEVEL_9</p>
                  </div>
                  <div className="bg-[var(--bg-inset)] border border-[var(--border-subtle)] p-3 rounded-lg text-left">
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1">Key Pair</p>
                    <p className="text-sm font-mono text-[var(--text-primary)]">RSA-4096</p>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/wallet'}
                  className="btn btn-primary w-full max-w-sm py-4 text-sm uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(0,198,174,0.4)]"
                >
                  Enter TrustVault
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(256px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Ekyc;
