import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Lock, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_LOGS = [
  "[SYS] Kernel memory integrity verified. Hash: 0x4A2B9C",
  "[NET] Incoming traffic spiked from IP 192.168.1.44 (Blocked - Rate Limit Exceeded)",
  "[AUTH] Cryptographic key rotation triggered for User_ID: 88219",
  "[OWASP] Scanner completed. 0 critical vulnerabilities found.",
  "[SYS] Database backup encrypted and synced to cold storage."
];

const Security: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLockedDown, setIsLockedDown] = useState(false);

  useEffect(() => {
    let index = 0;
    const logInterval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, MOCK_LOGS[index % MOCK_LOGS.length] + ` [TS: ${new Date().toISOString()}]`];
        return newLogs.slice(-8); // Keep last 8 logs
      });
      index++;
    }, 2500);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-h1 mb-2">Security & Audit</h1>
          <p className="text-secondary font-mono text-sm">Real-time compliance validation and cryptographic events monitor.</p>
        </div>
        
        <button 
          onClick={() => setIsLockedDown(!isLockedDown)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold font-mono transition-all duration-300 ${
            isLockedDown 
              ? 'bg-transparent border border-brand-primary text-brand-primary' 
              : 'bg-error text-white hover:bg-error/80 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
          }`}
        >
          <ShieldAlert size={20} />
          {isLockedDown ? 'LIFT LOCKDOWN' : 'INITIATE SYSTEM LOCKDOWN'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Live Terminal Log */}
        <div className="lg:col-span-2 glass-card p-0 flex flex-col overflow-hidden relative">
          <div className="bg-black/50 p-3 border-b border-white/5 flex items-center gap-2">
            <Terminal size={16} className="text-brand-primary" />
            <span className="text-xs font-mono text-secondary">LIVE_AUDIT_STREAM_v2.1.4</span>
          </div>
          <div className="p-6 flex-1 overflow-y-auto font-mono text-sm space-y-2">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${log.includes('Blocked') || log.includes('Exception') ? 'text-error' : 'text-[#38bdf8]'}`}
              >
                &gt; {log}
              </motion.div>
            ))}
            <div className="animate-pulse text-secondary">&gt; _</div>
          </div>
          
          {/* Lockdown Overlay */}
          <AnimatePresence>
            {isLockedDown && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                className="absolute inset-0 bg-error/10 z-10 flex items-center justify-center border-2 border-error rounded-xl overflow-hidden"
              >
                {/* CRT scanline glitch layer */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}></div>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="text-center relative z-20"
                >
                  <AlertTriangle size={64} className="text-error mx-auto mb-4 animate-[pulse_1s_infinite]" />
                  <h2 className="text-2xl font-bold text-white tracking-widest" style={{ textShadow: '0 0 10px #EF4444' }}>SYSTEM LOCKED DECREE 44</h2>
                  <p className="text-error font-mono mt-2">All incoming network requests are currently dropping.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Panels */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 flex-1">
            <h3 className="text-sm font-mono text-secondary mb-4 flex items-center gap-2">
              <Lock size={16} /> CRYPTOGRAPHIC STATUS
            </h3>
            <div className="space-y-4">
              {/* Staggered list for status checks */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                {[
                  { label: 'TLS Handshakes', val: '100% Validated', ok: true },
                  { label: 'Key Rotation', val: '24h Complete', ok: true },
                  { label: 'Cipher Suite', val: 'AES-256-GCM', ok: true },
                ].map((item, i) => (
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    key={i} 
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-secondary">{item.val}</span>
                      {item.ok ? <CheckCircle size={14} className="text-success shadow-[0_0_10px_#10B981]" /> : <AlertTriangle size={14} className="text-warning shadow-[0_0_10px_#F59E0B]" />}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="glass-card p-6 flex-1">
             <h3 className="text-sm font-mono text-secondary mb-4 flex items-center gap-2">
              <Database size={16} /> COMPLIANCE METRICS
            </h3>
            <div className="flex items-center justify-center h-32">
               {/* Decorative radial circles replacing a complex chart for simplicity */}
               <div className="relative flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full border-4 border-white/5 inset-0 absolute animate-[spin_10s_linear_infinite]" />
                 <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-brand-primary border-l-brand-primary absolute shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-[spin_4s_ease-in-out_infinite]" />
                 
                 {/* Inner pulsing orb */}
                 <div className="absolute w-16 h-16 bg-brand-primary/10 rounded-full blur-md animate-[pulse_2s_infinite]" />
                 
                 <div className="text-center z-10">
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.4, type: "spring" }}
                     className="text-xl font-bold text-white shadow-glow"
                   >
                     100%
                   </motion.div>
                   <div className="text-[10px] font-mono text-brand-primary">OWASP TOP 10</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Security;
