import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanFace, MapPin, BrainCircuit, Camera, RefreshCcw, CheckCircle2, Fingerprint, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

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
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-6 lg:p-10 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.05), transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05), transparent 50%)'
      }} />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3"
          >
            <ScanFace className="w-10 h-10 text-cyan-400" />
            E-KYC Studio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Advanced identity verification powered by Neural Network Processing (NNP), Auto Capture, and Geo Local Auto.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Capture Auto Module */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                Capture Auto
              </h2>
              {captureStatus === 'done' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <div className="h-48 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden mb-6 bg-slate-900/50">
              {captureStatus === 'idle' && (
                <div className="text-slate-500 flex flex-col items-center">
                  <Fingerprint className="w-10 h-10 mb-2 opacity-50" />
                  <p>Awaiting Document & Face</p>
                </div>
              )}
              {captureStatus === 'capturing' && (
                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                  <div className="w-full h-1 bg-blue-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                  <span className="text-blue-400 animate-pulse font-medium tracking-widest text-sm uppercase">Capturing...</span>
                </div>
              )}
              {captureStatus === 'analyzing' && (
                <div className="flex flex-col items-center">
                  <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                  <span className="text-indigo-300 font-medium tracking-widest text-sm uppercase">Analyzing Match</span>
                </div>
              )}
              {captureStatus === 'done' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-emerald-400 font-medium">Biometrics Secured</span>
                </motion.div>
              )}
            </div>
            <button 
              onClick={startAutoCapture}
              disabled={captureStatus !== 'idle'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 relative z-10"
            >
              {captureStatus === 'idle' ? 'Initiate Auto Capture' : 'Processing...'}
            </button>
          </motion.div>

          {/* Geo Local Auto Module */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Geo Local Auto
              </h2>
              {geoStatus === 'verified' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            
            <div className="h-48 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden mb-6 flex items-center justify-center">
              {/* Pseudo-map background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              {geoStatus === 'idle' && (
                <div className="relative z-10 text-slate-500 flex flex-col items-center">
                  <MapPin className="w-10 h-10 mb-2 opacity-50" />
                  <p>Location Unknown</p>
                </div>
              )}
              {geoStatus === 'locating' && (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
                  <span className="text-emerald-400 animate-pulse font-medium tracking-widest text-sm uppercase">Triangulating</span>
                </div>
              )}
              {geoStatus === 'verified' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] mb-2 relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-emerald-400 font-medium">Paris, France (Verified)</span>
                  <span className="text-xs text-slate-400 mt-1">IP & GPS match confirmed</span>
                </motion.div>
              )}
            </div>

            <button 
              onClick={startGeoLocalAuto}
              disabled={geoStatus !== 'idle'}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 relative z-10"
            >
              {geoStatus === 'idle' ? 'Verify Location' : 'Verified'}
            </button>
          </motion.div>

          {/* NNP Analysis Module */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                NNP Analysis
              </h2>
              {nnpScore === 98 && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            
            <div className="h-48 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden mb-6 flex flex-col items-center justify-center p-4">
              <div className="text-4xl font-bold text-white mb-2">
                {nnpScore !== null ? `${nnpScore}%` : '--'}
              </div>
              <p className="text-sm text-slate-400 mb-4 text-center">Neural Network Profile Confidence Score</p>
              
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: nnpScore ? `${nnpScore}%` : '0%' }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>

            <button 
              onClick={runNNP}
              disabled={scanning || nnpScore !== null}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 relative z-10 flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Processing NNP...
                </>
              ) : nnpScore !== null ? 'Analysis Complete' : 'Run NNP Engine'}
            </button>
          </motion.div>
        </div>

      </div>
      
      {/* Add a scanline animation globally for the effect */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(192px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
