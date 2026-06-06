import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, Server, Cpu, Layers, Fingerprint, Eye, ArrowRight, Activity, HardDrive } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import CinematicFooter from '../components/ui/CinematicFooter';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import CrystalVault from '../components/3d/CrystalVault';

const securityPillars = [
  {
    title: 'Zero-Trust Policy',
    icon: <Lock className="text-blue-400" size={24} />,
    description: 'We assume all networks are hostile. Every single transaction, API call, and key rotation is cryptographically signed and verified out-of-band.',
  },
  {
    title: 'HSM Colocation',
    icon: <HardDrive className="text-purple-400" size={24} />,
    description: 'Keys are stored in FIPS 140-2 Level 3 certified Hardware Security Modules, physically isolated in Tier-4 bunkers.',
  },
  {
    title: 'Biometric Quorum',
    icon: <Fingerprint className="text-emerald-400" size={24} />,
    description: 'High-value transfers require cryptographic signatures from multiple pre-authorized biometric devices across your organization.',
  },
  {
    title: 'Continuous Auditing',
    icon: <Eye className="text-amber-400" size={24} />,
    description: 'Every internal system state change is hashed and committed to an append-only ledger for immutable auditing.',
  }
];

export const SecurityArchitecture: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--brand-primary)] selection:text-black">
      <div className="relative z-10 bg-[var(--bg-primary)] pb-20">
      <LandingHeader scrollToFeatures={() => navigate('/#features')} scrollToSecurity={() => navigate('/#security')} />
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-[var(--brand-primary)] blur-[180px] opacity-[0.06] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500 blur-[150px] opacity-[0.04] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="vault-section-tag mx-auto mb-6"
        >
          ◆ Security Architecture
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight max-w-4xl mx-auto"
        >
          Absolute Cryptographic <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-blue-500">
            Certainty
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-16"
        >
          TrustVault replaces implicit trust with explicit cryptographic verification. Explore the infrastructure designed to protect billions in digital assets.
        </motion.p>

        {/* 3D-like Security Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="aspect-[21/9] rounded-[40px] border border-[rgba(255,255,255,0.06)] bg-[#070B14] shadow-[0_30px_80px_-15px_rgba(0,198,174,0.15)] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            
            {/* 3D Crystal Vault Component */}
            <CrystalVault />
            
            {/* Status overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 text-xs font-mono text-[var(--brand-primary)] opacity-80 backdrop-blur-md bg-black/40 px-6 py-3 rounded-full border border-[rgba(0,198,174,0.2)]">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AES-GCM 256</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ED25519 Keys</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> TLS 1.3 Strict</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Security Pillars */}
      <section className="py-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Principles</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Our defensive architecture relies on mathematics, not perimeter firewalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard className="p-8 rounded-3xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] h-full">
                <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] inline-flex mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-24 px-6 md:px-12 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="vault-section-tag mb-6">◆ Certified & Audited</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Independently Verified</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                TrustVault undergoes rigorous third-party penetration testing and compliance audits quarterly. Our infrastructure meets or exceeds the strictest global financial regulations.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'PCI-DSS Level 1 Service Provider',
                  'SOC 2 Type II Certified',
                  'ISO 27001 Information Security Management',
                  'HIPAA Compliant Data Pipelines'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Shield size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {['SOC 2', 'PCI-DSS', 'ISO 27001', 'HIPAA'].map((cert, i) => (
                <div key={cert} className="aspect-square rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-colors cursor-default">
                  <Shield size={40} className="text-[var(--brand-primary)] mb-4 opacity-80" />
                  <h4 className="font-bold text-lg mb-1">{cert}</h4>
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">Certified</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </div>
      <CinematicFooter />
    </div>
  );
};

export default SecurityArchitecture;
