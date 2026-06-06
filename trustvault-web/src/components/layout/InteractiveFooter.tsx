import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Check, Send, Sparkles, HelpCircle } from 'lucide-react';

const FooterStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .td-interactive-footer {
      position: relative;
      background: var(--bg-primary);
      border-top: 1px solid var(--border-subtle);
      color: var(--text-primary);
      font-family: 'IBM Plex Sans', sans-serif;
      overflow: hidden;
    }

    .footer-grid-bg {
      position: absolute;
      inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(0, 198, 174, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 198, 174, 0.03) 1px, transparent 1px);
      mask-image: radial-gradient(circle at 50% 0%, black 20%, transparent 80%);
      -webkit-mask-image: radial-gradient(circle at 50% 0%, black 20%, transparent 80%);
      pointer-events: none;
      z-index: 1;
    }

    .footer-ambient-orb {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 250px;
      background: radial-gradient(ellipse at center, var(--brand-primary-glow) 0%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 1;
      opacity: 0.7;
    }

    .newsletter-form {
      position: relative;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 99px;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-theme="light"] .newsletter-form {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .newsletter-form:focus-within {
      border-color: var(--brand-primary);
      box-shadow: 0 0 20px rgba(0, 198, 174, 0.15);
    }

    .newsletter-input {
      background: transparent;
      border: none;
      outline: none;
      padding: 10px 18px;
      flex: 1;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .newsletter-input::placeholder {
      color: var(--text-tertiary);
    }

    .footer-link-item {
      position: relative;
      color: var(--text-secondary);
      transition: color 0.2s ease;
      display: inline-block;
    }

    .footer-link-item::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background-color: var(--brand-primary);
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .footer-link-item:hover {
      color: var(--text-primary);
    }

    .footer-link-item:hover::after {
      width: 100%;
    }

    .social-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    [data-theme="light"] .social-btn {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .social-btn:hover {
      background: var(--brand-primary);
      color: #070B14;
      border-color: var(--brand-primary);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px var(--brand-primary-glow);
    }

    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.6875rem;
      font-family: var(--font-mono, monospace);
      color: var(--text-secondary);
    }

    [data-theme="light"] .security-badge {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
  ` }} />
);

export const InteractiveFooter: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    // Simulate API subscription call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  const currentYear = new Date().getFullYear();

  const linksData = {
    product: [
      { label: 'Smart Cards', path: '/#features' },
      { label: 'Cryptographic Vaults', path: '/#features' },
      { label: 'BEYN Network Integration', path: '/enterprise' },
      { label: 'Security Hardware', path: '/#security' },
    ],
    resources: [
      { label: 'Developer Hub', path: '/enterprise' },
      { label: 'System Status', path: '#' },
      { label: 'Security Whitepaper', path: '#' },
      { label: 'API Reference', path: '#' },
    ],
    company: [
      { label: 'About JARMID', path: '/company' },
      { label: 'Our Manifesto', path: '/company' },
      { label: 'Press Kit', path: '#' },
      { label: 'Careers', path: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Cookie Preferences', path: '#' },
      { label: 'Compliance Audit', path: '#' },
    ],
  };

  return (
    <footer className="td-interactive-footer">
      <FooterStyles />
      <div className="footer-grid-bg" />
      <div className="footer-ambient-orb" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        {/* Top Section: Branding + Interactive Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[rgba(255,255,255,0.06)] [data-theme='light']:border-[rgba(0,0,0,0.08)]">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div 
                className="flex items-center gap-3 cursor-pointer group mb-6 inline-flex"
                onClick={() => navigate('/')}
              >
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:border-[var(--brand-primary)] shadow-lg transition-all duration-300">
                  <img src="/vault_logo.png" alt="TrustVault Logo" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-base font-display font-bold tracking-widest text-white">
                  TRUST<span className="text-[var(--brand-primary)] font-medium">VAULT</span>
                </span>
              </div>
              <p className="text-sm text-[var(--vault-text-secondary)] max-w-sm mb-6 leading-relaxed">
                The absolute standard in bank-grade digital asset custody, custom visual identity cards, and cryptographic wallet environments. Powered by the high-speed BEYN network.
              </p>
            </div>
            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <a href="#" className="social-btn" aria-label="Github">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Linkedin">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764 0-.973.784-1.763 1.75-1.763s1.75.79 1.75 1.763c0 .973-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Help"><HelpCircle size={18} /></a>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="p-8 rounded-3xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] [data-theme='light']:border-[rgba(0,0,0,0.05)] [data-theme='light']:bg-[rgba(0,0,0,0.01)] backdrop-blur-xl max-w-xl lg:ml-auto w-full">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[var(--brand-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">Newsletter</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Subscribe to security advisories</h3>
              <p className="text-xs text-[var(--vault-text-secondary)] mb-6">
                Receive instant cryptographic alerts, platform updates, and patch logs. Zero spam.
              </p>

              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your secure email..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  disabled={submitting || success}
                />
                <button
                  type="submit"
                  disabled={submitting || success}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#070B14] bg-[var(--brand-primary)] hover:bg-[#00ebd0] active:scale-95 transition-all shadow-[0_0_15px_var(--brand-primary-glow)] flex items-center gap-1.5 min-w-[100px] justify-center"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <Check size={14} />
                      Joined
                    </>
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Site links mapping */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--vault-text-secondary)] mb-4">Product</h4>
            <ul className="space-y-3">
              {linksData.product.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-sm footer-link-item">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--vault-text-secondary)] mb-4">Platform</h4>
            <ul className="space-y-3">
              {linksData.resources.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-sm footer-link-item">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--vault-text-secondary)] mb-4">Company</h4>
            <ul className="space-y-3">
              {linksData.company.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-sm footer-link-item">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--vault-text-secondary)] mb-4">Security & Legal</h4>
            <ul className="space-y-3">
              {linksData.legal.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-sm footer-link-item">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security Compliance Ribbon */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 py-8 border-t border-b border-[rgba(255,255,255,0.06)] [data-theme='light']:border-[rgba(0,0,0,0.08)] mb-8">
          <span className="text-xs text-[var(--vault-text-secondary)] font-semibold tracking-wider uppercase mr-2">Standards:</span>
          <div className="security-badge">
            <Shield size={12} className="text-[var(--brand-primary)]" />
            <span>PCI-DSS Level 1</span>
          </div>
          <div className="security-badge">
            <Shield size={12} className="text-[var(--brand-primary)]" />
            <span>SOC 2 Type II Certified</span>
          </div>
          <div className="security-badge">
            <Shield size={12} className="text-[var(--brand-primary)]" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="security-badge">
            <Shield size={12} className="text-[var(--brand-primary)]" />
            <span>AES-256-GCM / RSA-2048</span>
          </div>
        </div>

        {/* Bottom Section: Copyright + Uptime Badge + Engine info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-[var(--vault-text-secondary)] font-medium">
            © {currentYear} TrustVault. Engineered by JARMID. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {/* Live Uptime Indicator */}
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Systems Operational (99.99%)
            </div>

            {/* Premium tag */}
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--vault-text-secondary)]">
              Powered by <span className="text-[var(--brand-primary)]">BEYN v4</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InteractiveFooter;
