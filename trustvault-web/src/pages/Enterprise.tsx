import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Cpu, Code, Terminal, Play, Check, Copy, Server, HardDrive, ShieldAlert, PhoneCall, ArrowRight, HeartPulse } from 'lucide-react';
import { LandingHeader } from '../components/layout/LandingHeader';
import { CinematicFooter } from '../components/ui/CinematicFooter';
import { SpotlightCard } from '../components/ui/SpotlightCard';

const TypingEffect = ({ text, speed = 5 }: { text: string, speed?: number }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayed}</>;
};

const codeSnippets = {
  typescript: {
    title: 'TypeScript SDK',
    code: `import { TrustVault } from '@jarmid/trustvault-sdk';

const vault = new TrustVault({
  apiKey: process.env.TRUSTVAULT_API_KEY,
  environment: 'production'
});

// Provision a virtual Visa card with auto-replenish
const card = await vault.cards.create({
  holderName: 'JARMID ENTERPRISE',
  type: 'visa',
  currency: 'USD',
  limit: {
    amount: 1500000,
    interval: 'monthly'
  },
  restrictions: {
    allowedMerchantCategories: ['cloud-services', 'hardware'],
    singleUse: false
  },
  autoReplenish: {
    enabled: true,
    triggerBalance: 100000,
    replenishAmount: 500000
  }
});

console.log(\`Card active: \${card.id} [\${card.maskedNumber}]\`);`,
    output: `{
  "id": "card_ent_82fa7b2a",
  "holderName": "JARMID ENTERPRISE",
  "type": "visa",
  "maskedNumber": "4111 22XX XXXX 9081",
  "status": "active",
  "currency": "USD",
  "limit": {
    "amount": 1500000,
    "interval": "monthly"
  },
  "restrictions": {
    "allowedMerchantCategories": ["cloud-services", "hardware"],
    "singleUse": false
  },
  "autoReplenish": {
    "enabled": true,
    "triggerBalance": 100000,
    "replenishAmount": 500000
  },
  "createdAt": "2026-06-06T07:28:00Z"
}`
  },
  python: {
    title: 'Python SDK',
    code: `from trustvault import TrustVault

client = TrustVault(
    api_key="tv_prod_key_771b9",
    environment="production"
)

# Provision virtual card
card = client.cards.create(
    holder_name="JARMID ENTERPRISE",
    card_type="visa",
    currency="USD",
    limit={
        "amount": 1500000,
        "interval": "monthly"
    },
    restrictions={
        "allowed_merchant_categories": ["cloud-services", "hardware"],
        "single_use": False
    },
    auto_replenish={
        "enabled": True,
        "trigger_balance": 100000,
        "replenish_amount": 500000
    }
)

print(f"Card active: {card.id} [{card.masked_number}]")`,
    output: `{
  "id": "card_ent_82fa7b2a",
  "holderName": "JARMID ENTERPRISE",
  "type": "visa",
  "maskedNumber": "4111 22XX XXXX 9081",
  "status": "active",
  "currency": "USD",
  "limit": {
    "amount": 1500000,
    "interval": "monthly"
  },
  "restrictions": {
    "allowedMerchantCategories": ["cloud-services", "hardware"],
    "singleUse": false
  },
  "autoReplenish": {
    "enabled": true,
    "triggerBalance": 100000,
    "replenishAmount": 500000
  },
  "createdAt": "2026-06-06T07:28:00Z"
}`
  },
  curl: {
    title: 'cURL API',
    code: `curl -X POST https://api.trustvault.jarmid.com/v1/cards \\
  -H "Authorization: Bearer tv_prod_key_771b9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "holderName": "JARMID ENTERPRISE",
    "type": "visa",
    "currency": "USD",
    "limit": {
      "amount": 1500000,
      "interval": "monthly"
    },
    "restrictions": {
      "allowedMerchantCategories": ["cloud-services", "hardware"],
      "singleUse": false
    },
    "autoReplenish": {
      "enabled": true,
      "triggerBalance": 100000,
      "replenishAmount": 500000
    }
  }'`,
    output: `{
  "id": "card_ent_82fa7b2a",
  "holderName": "JARMID ENTERPRISE",
  "type": "visa",
  "maskedNumber": "4111 22XX XXXX 9081",
  "status": "active",
  "currency": "USD",
  "limit": {
    "amount": 1500000,
    "interval": "monthly"
  },
  "restrictions": {
    "allowedMerchantCategories": ["cloud-services", "hardware"],
    "singleUse": false
  },
  "autoReplenish": {
    "enabled": true,
    "triggerBalance": 100000,
    "replenishAmount": 500000
  },
  "createdAt": "2026-06-06T07:28:00Z"
}`
  }
};

const capabilities = [
  {
    title: 'Dedicated HSM Colocation',
    icon: <HardDrive className="text-[var(--brand-primary)]" size={24} />,
    description: 'Establish absolute sovereign control over your keys. We colocate dedicated Hardware Security Modules (HSMs) in certified tier-4 bunkers.'
  },
  {
    title: 'Real-time Syslog & SOC Ingestion',
    icon: <ShieldAlert className="text-blue-400" size={24} />,
    description: 'Ingest security events directly into your corporate SIEM (Splunk, Datadog, or Azure Sentinel) with latency under 5 seconds.'
  },
  {
    title: 'Custom Multi-Sig Governance',
    icon: <Server className="text-emerald-400" size={24} />,
    description: 'Configure complex organizational approval chains. Require biometric signatures from custom quorum partitions before settling capital.'
  },
  {
    title: '99.999% SLA & Support',
    icon: <HeartPulse className="text-purple-400" size={24} />,
    description: 'We back our operations with legally binding SLA guarantees, 24/7 dedicated telephone support lines, and sub-minute incident response times.'
  }
];

export const Enterprise: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [runFinished, setRunFinished] = useState(false);
  
  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', company: '', size: '10-99', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setRunning(true);
    setRunFinished(false);
    setTimeout(() => {
      setRunning(false);
      setRunFinished(true);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] font-sans text-[var(--vault-text)] overflow-hidden selection:bg-[var(--vault-primary)] selection:text-black">
      <LandingHeader scrollToFeatures={() => navigate('/')} scrollToSecurity={() => navigate('/')} />
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--vault-primary)] blur-[160px] opacity-[0.07] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500 blur-[160px] opacity-[0.06] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="vault-section-tag mx-auto mb-6"
          >
            ◆ Enterprise Solution
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7.5xl font-bold tracking-tight mb-8 leading-tight"
          >
            Scale with absolute <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--vault-primary)] to-blue-500">
              Cryptographic Certainty
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--vault-text-secondary)] leading-relaxed"
          >
            Build your corporate credit programs, escrow vaults, and ledger rules on JARMID's high-speed consensus core. Designed for high-frequency financial platforms.
          </motion.p>
        </div>

        {/* Code Terminal Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#070B14] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)] bg-[#0c1220]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-[var(--vault-text-secondary)] font-mono ml-4 flex items-center gap-1.5">
                <Terminal size={12} /> API Sandbox
              </span>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
              {(Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setRunFinished(false);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    activeTab === tab 
                      ? 'bg-[var(--brand-primary)] text-[#070B14] font-bold' 
                      : 'text-[var(--vault-text-secondary)] hover:text-white'
                  }`}
                >
                  {codeSnippets[tab].title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Code Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x divide-[rgba(255,255,255,0.06)]">
            <div className="md:col-span-7 p-6 overflow-x-auto min-h-[340px] flex flex-col justify-between">
              <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed whitespace-pre font-semibold">
                <code>{codeSnippets[activeTab].code}</code>
              </pre>
              <div className="flex items-center gap-3 pt-6 border-t border-[rgba(255,255,255,0.03)] mt-6">
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#070B14] bg-[var(--brand-primary)] hover:bg-[#00ebd0] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_15px_var(--brand-primary-glow)] disabled:opacity-50"
                >
                  <Play size={12} fill="currentColor" />
                  {running ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Console Output */}
            <div className="md:col-span-5 p-6 bg-[#04070d] flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-4 font-mono">Console Output</div>
                <AnimatePresence mode="wait">
                  {running && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 gap-3"
                    >
                      <div className="w-6 h-6 border-2 border-[var(--brand-primary)]/20 border-t-[var(--brand-primary)] rounded-full animate-spin" />
                      <div className="text-xs font-mono text-[var(--vault-text-secondary)]">Resolving signature...</div>
                    </motion.div>
                  )}
                  {runFinished && !running && (
                    <motion.pre
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-mono text-blue-400 leading-relaxed overflow-x-auto"
                    >
                      <TypingEffect text={codeSnippets[activeTab].output} speed={2} />
                    </motion.pre>
                  )}
                  {!running && !runFinished && (
                    <div className="text-xs font-mono text-[var(--vault-text-secondary)] italic py-12 text-center">
                      Click "Run Code" to execute provisioning script.
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              {runFinished && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg mt-4">
                  <Check size={12} /> Card created in 84ms on BEYN Network.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise Infrastructure</h2>
          <p className="text-[var(--vault-text-secondary)] max-w-xl">
            Custom dedicated platforms deployed specifically to isolate your operations from multi-tenant risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <SpotlightCard className="p-8 rounded-3xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] h-full flex flex-col">
                <div className="p-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] inline-block mb-6">
                  {cap.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                <p className="text-sm text-[var(--vault-text-secondary)] leading-relaxed">
                  {cap.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Contact / Demo Request Form */}
      <section className="py-20 px-6 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="p-8 md:p-16 rounded-[40px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)] backdrop-blur-xl relative overflow-hidden max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="vault-section-tag mx-auto mb-4">◆ Consultation</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Request custom demo</h2>
              <p className="text-[var(--vault-text-secondary)] text-sm">
                Discuss custom HSM requirements, compliance needs, or ledger integrations with a senior engineer.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                    <Check size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Request Submitted</h3>
                  <p className="text-[var(--vault-text-secondary)] text-sm max-w-sm mx-auto mb-8">
                    Thank you. A senior solutions engineer from JARMID will reach out to you within 2 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormSuccess(false);
                      setFormData({ name: '', email: '', company: '', size: '10-99', message: '' });
                    }}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--brand-primary)] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-2">Work Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--brand-primary)] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-2">Company Name</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--brand-primary)] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-2">Company Size</label>
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--brand-primary)] focus:outline-none transition-all"
                      >
                        <option value="1-9" className="bg-[#070B14] text-white">1 - 9 Employees</option>
                        <option value="10-99" className="bg-[#070B14] text-white">10 - 99 Employees</option>
                        <option value="100-499" className="bg-[#070B14] text-white">100 - 499 Employees</option>
                        <option value="500+" className="bg-[#070B14] text-white">500+ Employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--vault-text-secondary)] mb-2">Requirements / Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please tell us about your transaction volumes, target regions, or compliance integrations..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--brand-primary)] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-4 rounded-xl font-bold text-[#070B14] bg-[var(--brand-primary)] hover:bg-[#00ebd0] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_var(--brand-primary-glow)] disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <PhoneCall size={16} />
                        <span>Schedule Call with Engineering</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CinematicFooter />
    </div>
  );
};

export default Enterprise;
