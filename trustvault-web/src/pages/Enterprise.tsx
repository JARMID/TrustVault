import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '../components/layout/LandingHeader';
import { CinematicFooter } from '../components/ui/CinematicFooter';


const EnterpriseInner: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] font-sans text-[var(--vault-text)] overflow-hidden selection:bg-[var(--vault-primary)] selection:text-black">
      <LandingHeader scrollToFeatures={() => navigate('/')} scrollToSecurity={() => navigate('/')} />
      
      <main className="pt-32 pb-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="vault-section-tag mx-auto mb-6">◆ Enterprise Grade</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Scale with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vault-primary)] to-blue-500">Absolute Certainty</span>
          </h1>
          <p className="text-xl text-[var(--vault-text-secondary)] max-w-2xl mx-auto mb-12">
            Build for global scale with TrustVault Enterprise. Custom deployments, dedicated SOC integration, and unlimited virtual corporate cards.
          </p>
          <div className="p-12 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] rounded-3xl backdrop-blur-md inline-block">
            <h2 className="text-2xl font-bold mb-4 text-[var(--vault-text)]">Coming Soon</h2>
            <p className="text-[var(--vault-text-secondary)]">We are finalizing the Enterprise solutions showcase.</p>
          </div>
        </motion.div>
      </main>

      <CinematicFooter />
    </div>
  );
};

const Enterprise: React.FC = () => (
  <EnterpriseInner />
);

export default Enterprise;
