import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Globe2, Zap, Server, Code2, ArrowRight } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import CinematicFooter from '../components/ui/CinematicFooter';
import SecurityGlobe from '../components/3d/SecurityGlobe';

export const Network: React.FC = () => {
  const navigate = useNavigate();
  const [pings, setPings] = useState({ lon: 12, nyc: 24, sgp: 89, tok: 110 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setPings({
        lon: 10 + Math.floor(Math.random() * 5),
        nyc: 20 + Math.floor(Math.random() * 8),
        sgp: 85 + Math.floor(Math.random() * 10),
        tok: 105 + Math.floor(Math.random() * 12),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--brand-primary)] selection:text-black">
      <div className="relative z-10 bg-[var(--bg-primary)] pb-20">
      <LandingHeader scrollToFeatures={() => navigate('/#features')} scrollToSecurity={() => navigate('/#security')} />
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--brand-primary)] blur-[180px] opacity-[0.05] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="vault-section-tag mb-6"
            >
              ◆ BEYN Core Network
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
            >
              Engineered for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-emerald-400">
                Low-Latency
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[var(--text-secondary)] leading-relaxed mb-10"
            >
              The TrustVault API operates on dedicated dark-fiber routes directly peered with global banking hubs, executing complex state machine transitions in under 50ms.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <button 
                onClick={() => navigate('/enterprise')}
                className="px-6 py-3 rounded-full text-sm font-bold text-[#070B14] bg-[var(--brand-primary)] hover:bg-[#00ebd0] transition-all flex items-center gap-2"
              >
                <Code2 size={16} /> API Reference
              </button>
            </motion.div>
          </div>

          {/* Live Node Status */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="p-8 rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl relative overflow-hidden group">
              {/* Globe Background integration */}
              <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-1000 mix-blend-screen pointer-events-none" style={{ transform: 'scale(1.5) translateX(20%) translateY(-10%)' }}>
                <SecurityGlobe />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Activity className="text-emerald-400" size={18} />
                    <h3 className="font-bold">Live Regional Latency</h3>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    Updated Live
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { region: 'eu-west-2 (London)', ping: pings.lon, status: 'Optimal' },
                    { region: 'us-east-1 (New York)', ping: pings.nyc, status: 'Optimal' },
                    { region: 'ap-southeast-1 (Singapore)', ping: pings.sgp, status: 'Nominal' },
                    { region: 'ap-northeast-1 (Tokyo)', ping: pings.tok, status: 'Nominal' },
                  ].map((node) => (
                    <div key={node.region} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${node.ping < 50 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="font-mono text-xs">{node.region}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[var(--text-secondary)] hidden sm:block">{node.status}</span>
                        <span className={`font-mono text-sm font-bold ${node.ping < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {node.ping}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-b border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[rgba(255,255,255,0.05)]">
            <div className="text-center px-4">
              <h4 className="text-4xl font-bold mb-2 text-[var(--brand-primary)]">99.999%</h4>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold">Uptime SLA</p>
            </div>
            <div className="text-center px-4">
              <h4 className="text-4xl font-bold mb-2">{'<'}50ms</h4>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold">API Latency</p>
            </div>
            <div className="text-center px-4">
              <h4 className="text-4xl font-bold mb-2">2M+</h4>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold">Reqs / Second</p>
            </div>
            <div className="text-center px-4">
              <h4 className="text-4xl font-bold mb-2 text-emerald-400">0</h4>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold">Maintenance Windows</p>
            </div>
          </div>
        </div>
      </section>

      </div>
      <CinematicFooter />
    </div>
  );
};

export default Network;
