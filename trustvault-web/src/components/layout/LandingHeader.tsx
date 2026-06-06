import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { BeynLogo } from '../ui/BeynLogo';

export const LandingHeader: React.FC<{
  scrollToFeatures: () => void;
  scrollToSecurity: () => void;
}> = ({ scrollToFeatures, scrollToSecurity }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-[100] h-16 md:h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
        scrolled 
          ? "bg-[rgba(7,11,20,0.7)] backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
          : "bg-transparent border-b border-transparent"
      }`}
    >

      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:shadow-[var(--brand-primary-glow)] transition-all duration-300 overflow-hidden">
          <BeynLogo size={24} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-lg font-display font-bold tracking-widest text-white leading-none">
            TRUST<span className="text-[var(--brand-primary)] font-medium">VAULT</span>
          </span>
          <span className="text-[0.6rem] text-[var(--vault-text-secondary)] tracking-widest uppercase mt-0.5 ml-0.5 flex items-center gap-1 font-mono">
            by <span className="text-[var(--brand-primary)] font-bold">Beyn</span>
          </span>
        </div>
      </div>

      {/* Nav Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={scrollToFeatures} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button onClick={() => navigate('/enterprise')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group">
          Solutions
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button onClick={scrollToSecurity} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group">
          Security
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group">
          Pricing
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button onClick={() => navigate('/company')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group">
          Company
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        <button 
          onClick={() => navigate('/login')} 
          className="hidden md:flex text-sm font-medium text-white hover:text-[var(--brand-primary)] px-4 py-2 transition-colors"
        >
          Sign In
        </button>
        
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-[#070B14] bg-[var(--brand-primary)] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--brand-primary-glow)]"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <span className="relative">Open Vault</span>
          <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
