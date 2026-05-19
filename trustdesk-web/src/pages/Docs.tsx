import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Book, Code, Shield, Terminal, ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of TrustVault and set up your first workspace.',
    icon: <Book className="text-[var(--brand-primary)]" size={24} />,
    link: '#',
  },
  {
    title: 'API Reference',
    description: 'Detailed documentation for the TrustVault REST API.',
    icon: <Code className="text-[var(--brand-primary)]" size={24} />,
    link: '#',
  },
  {
    title: 'Security Concepts',
    description: 'Deep dive into Zero Trust architecture and encryption.',
    icon: <Shield className="text-[var(--accent-success)]" size={24} />,
    link: '#',
  },
  {
    title: 'CLI Tools',
    description: 'Manage your infrastructure from the command line.',
    icon: <Terminal className="text-[var(--brand-primary)]" size={24} />,
    link: '#',
  }
];

const Docs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white font-sans relative overflow-hidden noise-overlay">
      
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-gradient-to-b from-[var(--brand-primary)]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10 border-b border-subtle bg-[var(--bg-primary)]/50 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-white transition-colors duration-300 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="text-xl font-bold tracking-tight">
            TrustVault <span className="text-[var(--brand-primary)]">Docs</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 pt-40 pb-24 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
            How can we help you?
          </h1>
          
          <div className="max-w-2xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={20} />
            <input 
              type="text" 
              placeholder="Search documentation, API, and tutorials..." 
              className="w-full bg-surface border border-subtle rounded-xl py-4 pl-12 pr-4 text-white placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-primary)]/50 focus:bg-surface-hover transition-all duration-300"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <motion.a
              href={cat.link}
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="liquid-glass-card mesh-bg group flex items-start gap-6 hover:bg-surface transition-colors duration-300 cursor-pointer no-underline"
            >
              <div className="p-4 rounded-xl bg-surface group-hover:bg-surface-hover transition-colors duration-300">
                {cat.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--brand-primary)] transition-colors duration-300 flex items-center justify-between">
                  {cat.title}
                  <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent border border-[var(--brand-primary)]/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">Need direct assistance?</h3>
            <p className="text-[var(--text-tertiary)]">Our support team is available 24/7 for Enterprise customers.</p>
          </div>
          <button className="btn btn-primary px-6 py-3 whitespace-nowrap">
            Contact Support
          </button>
        </motion.div>

      </main>
    </div>
  );
};

export default Docs;




