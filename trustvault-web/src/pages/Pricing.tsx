import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, Zap, Crown, Building2, Globe2, Briefcase } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import { InteractiveFooter } from '../components/layout/InteractiveFooter';

import { SpotlightCard } from '../components/ui/SpotlightCard';

const personalPlans = [
  {
    name: 'Standard',
    icon: <Shield size={24} className="text-[var(--vault-text-secondary)]" />,
    price: 'Free',
    period: 'forever',
    description: 'Essential digital banking for everyday secure spending.',
    features: ['1 Virtual Card', 'Basic Spending Analytics', 'Standard Encryption', 'Email Support'],
    buttonText: 'Get Started',
    popular: false,
    color: 'var(--vault-text-secondary)',
  },
  {
    name: 'Plus',
    icon: <Zap size={24} className="text-blue-400" />,
    price: '$9.99',
    period: 'per month',
    description: 'Upgraded limits and global flexibility for travelers.',
    features: ['5 Virtual Cards', 'Interbank FX Rates', 'Advanced Threat Analytics', '24/7 Priority Support', 'Single-use Burner Cards'],
    buttonText: 'Upgrade to Plus',
    popular: true,
    color: '#60A5FA', // blue-400
  },
  {
    name: 'Metal',
    icon: <Crown size={24} className="text-amber-400" />,
    price: '$19.99',
    period: 'per month',
    description: 'The ultimate premium experience with a physical metal card.',
    features: ['Unlimited Virtual Cards', 'Zero-Fee Global Transfers', 'Concierge Service', 'Physical Stainless Steel Card', 'Biometric Hardware Auth'],
    buttonText: 'Get Metal',
    popular: false,
    color: '#FBBF24', // amber-400
  }
];

const businessPlans = [
  {
    name: 'Startup',
    icon: <Briefcase size={24} className="text-emerald-400" />,
    price: '$49',
    period: 'per month',
    description: 'Expense management and secure cards for growing teams.',
    features: ['Up to 50 Employee Cards', 'Automated Expense Tracking', 'Accounting Integrations', 'Role-based Access'],
    buttonText: 'Start Free Trial',
    popular: false,
    color: '#34D399', // emerald-400
  },
  {
    name: 'Scale',
    icon: <Building2 size={24} className="text-[var(--vault-primary)]" />,
    price: '$199',
    period: 'per month',
    description: 'Advanced controls and workflows for mid-market companies.',
    features: ['Up to 500 Employee Cards', 'Multi-signature Approvals', 'Custom Spending Limits', 'Dedicated Account Manager', 'API Access'],
    buttonText: 'Upgrade to Scale',
    popular: true,
    color: 'var(--vault-primary)',
  },
  {
    name: 'Enterprise',
    icon: <Globe2 size={24} className="text-purple-400" />,
    price: 'Custom',
    period: 'annual billing',
    description: 'Bespoke deployments with dedicated SOC integration.',
    features: ['Unlimited Employee Cards', 'Dedicated SOC Infrastructure', 'On-premise Deployment Options', 'SLA Guarantees', 'Custom Development'],
    buttonText: 'Contact Sales',
    popular: false,
    color: '#C084FC', // purple-400
  }
];

const PricingInner: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'personal' | 'business'>('personal');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activePlans = billingCycle === 'personal' ? personalPlans : businessPlans;

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] font-sans text-[var(--vault-text)] overflow-hidden selection:bg-[var(--vault-primary)] selection:text-black">
      <LandingHeader scrollToFeatures={() => navigate('/')} scrollToSecurity={() => navigate('/')} />
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--vault-primary)] blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[150px] opacity-10 pointer-events-none" />

      <main className="pt-32 pb-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto min-h-[80vh]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="vault-section-tag mx-auto mb-6">◆ Transparent Pricing</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Plans that scale with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vault-primary)] to-blue-500">your needs</span>
          </h1>
          <p className="text-[var(--vault-text-secondary)] text-lg max-w-2xl mx-auto mb-10">
            From everyday personal security to enterprise-grade SOC infrastructure. No hidden fees.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center p-1 bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.05)] backdrop-blur-md relative">
            <div 
              className="absolute inset-y-1 rounded-full bg-[var(--vault-primary)] transition-all duration-300 ease-in-out"
              style={{
                left: billingCycle === 'personal' ? '4px' : '50%',
                width: 'calc(50% - 4px)'
              }}
            />
            <button
              onClick={() => setBillingCycle('personal')}
              className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${
                billingCycle === 'personal' ? 'text-black' : 'text-[var(--vault-text-secondary)] hover:text-[var(--vault-text)]'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setBillingCycle('business')}
              className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors ${
                billingCycle === 'business' ? 'text-black' : 'text-[var(--vault-text-secondary)] hover:text-[var(--vault-text)]'
              }`}
            >
              Business
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <AnimatePresence mode="wait">
            {activePlans.map((plan, idx) => (
              <motion.div
                key={`${billingCycle}-${plan.name}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full"
              >
                <SpotlightCard className={`h-full flex flex-col p-8 rounded-3xl border ${
                  plan.popular 
                    ? 'border-[var(--vault-primary)]/40 bg-[rgba(255,255,255,0.03)]' 
                    : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]'
                }`}>
                  {plan.popular && (
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                      style={{ backgroundColor: plan.color }}
                    >
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-[var(--vault-text-secondary)] text-sm">{plan.period}</span>
                    </div>
                    <p className="text-[var(--vault-text-secondary)] text-sm mt-4 min-h-[40px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent my-6" />

                  <ul className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 group">
                        <CheckCircle2 size={20} style={{ color: plan.color }} className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-[var(--vault-text)] group-hover:text-[var(--vault-primary)] transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: plan.popular ? plan.color : 'rgba(255,255,255,0.05)',
                      color: plan.popular ? 'black' : 'var(--vault-text)',
                      border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {plan.buttonText}
                  </button>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <InteractiveFooter />
    </div>
  );
};

const Pricing: React.FC = () => (
  <PricingInner />
);

export default Pricing;
