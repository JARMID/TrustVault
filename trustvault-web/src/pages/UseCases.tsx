import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Globe2, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import CinematicFooter from '../components/ui/CinematicFooter';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const cases = [
  {
    title: 'Global Supply Chain',
    icon: <Globe2 className="text-blue-400" size={24} />,
    metric: '$1.2B',
    metricLabel: 'FX Fees Saved Annually',
    description: 'Logistics companies use TrustVault to issue thousands of single-use virtual cards to drivers globally, settling in local currencies with zero markup.'
  },
  {
    title: 'Enterprise Payroll',
    icon: <Users className="text-emerald-400" size={24} />,
    metric: '100k+',
    metricLabel: 'Employees Paid Instantly',
    description: 'HR platforms integrate our API to provision salary accounts and issue metal cards to employees worldwide in milliseconds.'
  },
  {
    title: 'Corporate Expense',
    icon: <Building2 className="text-purple-400" size={24} />,
    metric: '40hrs',
    metricLabel: 'Saved per month on recon',
    description: 'Finance teams automate reconciliation by attaching smart contracts to cards, rejecting out-of-policy spending at the point of sale.'
  }
];

export const UseCases: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--brand-primary)] selection:text-black">
      <div className="relative z-10 bg-[var(--bg-primary)] pb-20">
      <LandingHeader scrollToFeatures={() => navigate('/#features')} scrollToSecurity={() => navigate('/#security')} />
      
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--brand-primary)] blur-[180px] opacity-[0.04] pointer-events-none" />

      <section className="pt-40 pb-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="vault-section-tag mx-auto mb-6"
        >
          ◆ Industry Solutions
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
        >
          Powering the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-blue-500">
            Next Economy
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-16"
        >
          From Fortune 500 logistics firms to explosive tech startups, industry leaders rely on TrustVault to handle their most complex capital flows.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {cases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
            >
              <SpotlightCard className="p-8 rounded-3xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)] h-full flex flex-col">
                <div className="p-3 rounded-2xl bg-white/5 inline-flex mb-6 border border-white/10">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 flex-1">
                  {useCase.description}
                </p>
                <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="text-3xl font-bold text-[var(--brand-primary)] mb-1">{useCase.metric}</div>
                  <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">{useCase.metricLabel}</div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      </div>
      <CinematicFooter />
    </div>
  );
};

export default UseCases;
