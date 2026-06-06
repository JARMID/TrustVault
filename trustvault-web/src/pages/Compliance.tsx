import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, Server, CheckCircle2 } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import { CinematicFooter } from '../components/ui/CinematicFooter';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const certifications = [
  {
    title: 'SOC 2 Type II',
    description: 'Our security controls and processes are independently audited annually to ensure the highest standards of data protection and privacy.',
    icon: <ShieldCheck size={28} className="text-[var(--brand-primary)]" />
  },
  {
    title: 'ISO 27001',
    description: 'We maintain a comprehensive Information Security Management System (ISMS) covering all aspects of our infrastructure and personnel.',
    icon: <Lock size={28} className="text-amber-400" />
  },
  {
    title: 'PCI-DSS Level 1',
    description: 'Our card processing and storage infrastructure meets the highest Payment Card Industry Data Security Standards.',
    icon: <FileText size={28} className="text-blue-400" />
  },
  {
    title: 'GDPR & CCPA',
    description: 'We provide full data residency options and privacy controls to ensure compliance with global data protection regulations.',
    icon: <Server size={28} className="text-emerald-400" />
  }
];

const ComplianceInner: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--brand-primary)] selection:text-black">
      <div className="relative z-10 bg-[var(--bg-primary)] pb-20">
        <LandingHeader scrollToFeatures={() => navigate('/#features')} scrollToSecurity={() => navigate('/#security')} />
        
        {/* Background gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--brand-primary)] blur-[160px] opacity-[0.05] pointer-events-none" />
        <div className="absolute top-[30%] left-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500 blur-[160px] opacity-[0.05] pointer-events-none" />

        <main className="pt-32 pb-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto min-h-[80vh]">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="vault-section-tag mx-auto mb-6">◆ Trust & Verification</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Bank-grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-blue-500">Compliance</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Security is not just a feature, it's our foundation. We adhere to the strictest global standards to protect your assets and data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <SpotlightCard className="p-8 rounded-3xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] h-full">
                  <div className="flex items-start gap-5">
                    <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                      {cert.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{cert.title}</h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{cert.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl border border-[var(--brand-primary)]/20 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent text-center"
          >
            <ShieldCheck size={48} className="mx-auto text-[var(--brand-primary)] mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Request our SOC 2 Report</h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              Enterprise customers and prospects under NDA can request access to our latest SOC 2 Type II audit report and penetration testing summaries.
            </p>
            <button className="px-8 py-4 rounded-full bg-[var(--brand-primary)] text-black font-bold hover:scale-105 transition-transform shadow-[0_0_20px_var(--brand-primary-glow)]">
              Contact Compliance Team
            </button>
          </motion.div>
          
        </main>
      </div>
      <CinematicFooter />
    </div>
  );
};

const Compliance: React.FC = () => (
  <ComplianceInner />
);

export default Compliance;
