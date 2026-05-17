import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Zap, Shield, Globe } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: <Zap size={24} className="text-[#00d4ff]" />,
    price: 'Free',
    period: 'forever',
    description: 'Perfect for individuals and small teams starting with Zero Trust.',
    features: ['Up to 5 devices', 'Basic threat detection', 'Community support', 'Standard encryption'],
    buttonText: 'Get Started',
    buttonClass: 'btn w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white',
    popular: false,
  },
  {
    name: 'Pro',
    icon: <Shield size={24} className="text-[#00d4ff]" />,
    price: '$29',
    period: 'per user/month',
    description: 'Advanced security for growing businesses and professional teams.',
    features: ['Up to 50 devices', 'Advanced threat analytics', 'Priority 24/7 support', 'Custom security policies', 'SSO Integration'],
    buttonText: 'Start Free Trial',
    buttonClass: 'btn btn-primary w-full mt-8 py-3 flex justify-center text-sm',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: <Globe size={24} className="text-[#00d4ff]" />,
    price: 'Custom',
    period: 'tailored pricing',
    description: 'Complete infrastructure protection for large-scale organizations.',
    features: ['Unlimited devices', 'Dedicated account manager', 'On-premise deployment options', 'Advanced compliance reporting', 'Custom SLA'],
    buttonText: 'Contact Sales',
    buttonClass: 'btn w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white',
    popular: false,
  }
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050a12] text-white font-sans relative overflow-hidden noise-overlay">
      
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00d4ff] blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#818CF8] blur-[120px] opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-[1200px] mx-auto flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#8899b4] hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-[#8899b4] text-lg max-w-2xl mx-auto">
            Secure your infrastructure with our enterprise-grade solutions. 
            Choose the plan that best fits your team's needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`glass-card flex flex-col h-full relative ${plan.popular ? 'border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00d4ff] text-[#050a12] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-[#00d4ff]/10">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-[#8899b4] text-sm">{plan.period}</span>
                </div>
                <p className="text-[#8899b4] text-sm mt-4 min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="border-t border-white/10 my-6" />

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#00d4ff] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={plan.buttonClass}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
