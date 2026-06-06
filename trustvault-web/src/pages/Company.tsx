import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Cpu, Layers, Globe, Users, Clock, Lock, Award, ArrowRight, Server, Compass, CheckCircle } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import { CinematicFooter } from '../components/ui/CinematicFooter';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const pillars = [
  {
    title: 'Zero-Trust Architecture',
    icon: <Lock className="text-[var(--brand-primary)]" size={24} />,
    description: 'We assume all networks are hostile. Every transaction, API call, and key rotation is cryptographically signed and verified out-of-band.',
    detail: 'Using secure enclave micro-architectures to isolate secret keys from memory space.'
  },
  {
    title: 'Visual & Spatial Design',
    icon: <Layers className="text-blue-400" size={24} />,
    description: 'Finance should feel tactile and weightless. Our cards and dashboards use advanced shaders, 3D composition, and micro-interactions.',
    detail: 'Pixel-perfect interfaces that adapt to human behavior, supporting dark and light themes natively.'
  },
  {
    title: 'BEYN Core Integration',
    icon: <Cpu className="text-emerald-400" size={24} />,
    description: 'Direct peering with the BEYN banking network enables instant payment settlement, zero currency conversion fees, and virtual card issue speeds under 100ms.',
    detail: 'Distributed consensus ledgers verifying transactional health in real-time.'
  },
  {
    title: 'Global High-Availability',
    icon: <Globe className="text-purple-400" size={24} />,
    description: 'Active-active hot redundancy across seven geographic zones. Our wallet platform delivers a guaranteed 99.99% uptime SLA.',
    detail: 'Continuous state replication via fault-tolerant Paxos-based consensus mechanisms.'
  }
];

const timelineEvents = [
  {
    year: 'Q1 2024',
    title: 'The Blueprint',
    description: 'JARMID drafts the architecture for a completely isolated virtual card provider utilizing secure enclaves.',
    icon: <Compass size={16} />
  },
  {
    year: 'Q3 2024',
    title: 'BEYN Network Peering',
    description: 'Direct fiber link established with the BEYN banking network, bringing card generation times under 100ms.',
    icon: <Server size={16} />
  },
  {
    year: 'Q1 2025',
    title: 'PCI-DSS Level 1 & SOC 2',
    description: 'Successful external audits, achieving full bank-grade certification for cardholder data environments.',
    icon: <Award size={16} />
  },
  {
    year: 'Q3 2025',
    title: 'TrustVault Launch',
    description: 'Public release of the digital wallet, smart cards, and advanced developer API integration.',
    icon: <Shield size={16} />
  }
];

export const Company: React.FC = () => {
  const navigate = useNavigate();
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(3);
  const [nodesActive, setNodesActive] = useState<boolean[]>([true, true, true, true, true]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate flickering network node statuses
    const interval = setInterval(() => {
      setNodesActive(prev => prev.map(() => Math.random() > 0.1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] font-sans text-[var(--vault-text)] overflow-hidden selection:bg-[var(--vault-primary)] selection:text-black">
      <LandingHeader scrollToFeatures={() => navigate('/')} scrollToSecurity={() => navigate('/')} />
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--vault-primary)] blur-[160px] opacity-[0.07] pointer-events-none" />
      <div className="absolute top-[30%] left-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500 blur-[160px] opacity-[0.06] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="vault-section-tag mx-auto mb-6"
          >
            ◆ About Us
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
          >
            Engineered by <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vault-primary)] via-emerald-400 to-blue-500">
              JARMID
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--vault-text-secondary)] leading-relaxed mb-10"
          >
            We are a collective of security engineers, financial architects, and visual designers dedicated to building the most secure, tactile, and beautifully responsive digital asset environment in existence.
          </motion.p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Principles</h2>
          <p className="text-[var(--vault-text-secondary)] max-w-xl">
            Our commitment to engineering integrity guides every line of code and hardware configuration we ship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard className="p-8 rounded-3xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] h-full flex flex-col justify-between">
                <div>
                  <div className="p-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] inline-block mb-6">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                  <p className="text-sm text-[var(--vault-text-secondary)] leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>
                <div className="text-xs text-[var(--vault-primary)] font-semibold border-t border-[rgba(255,255,255,0.05)] pt-4 mt-auto">
                  {pillar.detail}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Network & Infrastructure Section */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="vault-section-tag mb-6">◆ BEYN Core Network</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Global Fiber Infrastructure</h2>
            <p className="text-[var(--vault-text-secondary)] mb-6 leading-relaxed">
              TrustVault is not just software. It operates on direct peering links to key banking terminals across Europe and North America.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle size={18} className="text-[var(--vault-primary)] mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Direct Core Routing</h4>
                  <p className="text-xs text-[var(--vault-text-secondary)]">Bypassing standard internet relays to guarantee transaction settlement under 100ms.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={18} className="text-[var(--vault-primary)] mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Anycast Shielding</h4>
                  <p className="text-xs text-[var(--vault-text-secondary)]">Distributed edge proxying automatically shielding database structures from DDOS vectors.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            {/* Interactive map visualization */}
            <div className="relative w-full aspect-[4/3] rounded-3xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] backdrop-blur-md p-8 overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--vault-text-secondary)]">Node Cluster Status</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vault-text-secondary)]">7/7 Peered</span>
              </div>

              {/* Map SVG */}
              <div className="relative flex-1 flex items-center justify-center my-6">
                <svg viewBox="0 0 100 60" className="w-full h-full opacity-40">
                  {/* Grid Lines */}
                  <path d="M 10 30 Q 50 10 90 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
                  <path d="M 10 30 Q 50 50 90 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2" />
                  {/* Nodes */}
                  <circle cx="20" cy="25" r="2" fill={nodesActive[0] ? "var(--brand-primary)" : "#ef4444"} />
                  <circle cx="35" cy="40" r="2" fill={nodesActive[1] ? "var(--brand-primary)" : "#ef4444"} />
                  <circle cx="50" cy="20" r="2.5" fill={nodesActive[2] ? "var(--brand-primary)" : "#ef4444"} />
                  <circle cx="65" cy="35" r="2" fill={nodesActive[3] ? "var(--brand-primary)" : "#ef4444"} />
                  <circle cx="80" cy="15" r="2" fill={nodesActive[4] ? "var(--brand-primary)" : "#ef4444"} />
                  {/* Connection Links */}
                  <line x1="20" y1="25" x2="35" y2="40" stroke="var(--brand-primary)" strokeWidth="0.3" opacity="0.5" />
                  <line x1="35" y1="40" x2="50" y2="20" stroke="var(--brand-primary)" strokeWidth="0.3" opacity="0.5" />
                  <line x1="50" y1="20" x2="65" y2="35" stroke="var(--brand-primary)" strokeWidth="0.3" opacity="0.5" />
                  <line x1="65" y1="35" x2="80" y2="15" stroke="var(--brand-primary)" strokeWidth="0.3" opacity="0.5" />
                  {/* Data Packets */}
                  <circle r="0.8" fill="#00ebd0" filter="drop-shadow(0 0 2px #00ebd0)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 20 25 L 35 40" />
                  </circle>
                  <circle r="0.8" fill="#00ebd0" filter="drop-shadow(0 0 2px #00ebd0)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 35 40 L 50 20" />
                  </circle>
                  <circle r="0.8" fill="#00ebd0" filter="drop-shadow(0 0 2px #00ebd0)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 20 L 65 35" />
                  </circle>
                  <circle r="0.8" fill="#00ebd0" filter="drop-shadow(0 0 2px #00ebd0)">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M 65 35 L 80 15" />
                  </circle>
                </svg>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center z-10">
                {['LON-1', 'PAR-2', 'NYC-1', 'FRA-4', 'SGP-2'].map((node, i) => (
                  <div key={node} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[9px] font-mono text-[var(--vault-text-secondary)] mb-1">{node}</div>
                    <div className={`text-[8px] font-bold ${nodesActive[i] ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {nodesActive[i] ? 'ACTIVE' : 'STALL'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Timeline</h2>
          <p className="text-[var(--vault-text-secondary)] max-w-md mx-auto">
            From design boards to verified production status. Select a phase to review details.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Horizontal Line */}
          <div className="absolute top-12 left-0 right-0 h-[2px] bg-[rgba(255,255,255,0.05)] hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {timelineEvents.map((ev, idx) => {
              const isActive = idx === activeTimelineIdx;
              return (
                <div 
                  key={ev.year}
                  onClick={() => setActiveTimelineIdx(idx)}
                  className="cursor-pointer group flex flex-col items-center md:items-start text-center md:text-left"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <motion.div 
                      animate={{ 
                        scale: isActive ? 1.15 : 1,
                        backgroundColor: isActive ? 'var(--brand-primary)' : 'rgba(255,255,255,0.04)',
                        borderColor: isActive ? 'var(--brand-primary)' : 'rgba(255,255,255,0.1)'
                      }}
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-white relative shadow-lg group-hover:border-[var(--brand-primary)] transition-all duration-300"
                    >
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-[var(--brand-primary-glow)] opacity-30" />
                      )}
                      <div className={isActive ? 'text-[#070B14]' : 'text-[var(--vault-text-secondary)]'}>
                        {ev.icon}
                      </div>
                    </motion.div>
                  </div>

                  <span className={`font-mono text-xs font-bold mb-1 tracking-wider ${isActive ? 'text-[var(--vault-primary)]' : 'text-[var(--vault-text-secondary)]'}`}>
                    {ev.year}
                  </span>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">{ev.title}</h4>
                  
                  {/* Mobile details (always visible) or desktop animated details */}
                  <p className="text-xs text-[var(--vault-text-secondary)] leading-relaxed hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {ev.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Display box for active timeline event */}
          <div className="mt-12 p-8 rounded-3xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] backdrop-blur-xl hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimelineIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--vault-primary)]/15 text-[var(--vault-primary)]">
                    {timelineEvents[activeTimelineIdx].year}
                  </span>
                  <h3 className="text-2xl font-bold">{timelineEvents[activeTimelineIdx].title}</h3>
                </div>
                <p className="text-base text-[var(--vault-text-secondary)] leading-relaxed">
                  {timelineEvents[activeTimelineIdx].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto text-center">
        <div className="p-12 md:p-20 rounded-[40px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] backdrop-blur-xl relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500 blur-[150px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Let's build trust together</h2>
            <p className="text-[var(--vault-text-secondary)] max-w-lg mx-auto mb-10 text-sm md:text-base leading-relaxed">
              Explore the developer APIs or review our compliance reports. Our engineering team is here to assist.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/enterprise')}
                className="px-8 py-3 rounded-full text-sm font-bold text-[#070B14] bg-[var(--brand-primary)] hover:bg-[#00ebd0] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_var(--brand-primary-glow)] flex items-center gap-2"
              >
                <span>Explore Solutions</span>
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 rounded-full text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
};

export default Company;
