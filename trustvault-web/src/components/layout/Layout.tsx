import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import CommandPalette from '../ui/CommandPalette';
import { AISupportWidget } from '../ui/AISupportWidget';
import { WifiOff, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFCM } from '../../hooks/useFCM';
import { usePrivacyShield } from '../../hooks/usePrivacyShield';

const Layout: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  useFCM();
  const { isShieldActive } = usePrivacyShield();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Global ⌘K / Ctrl+K shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      

      {/* Offline Banner */}
      {isOffline && (
        <div style={{
          background: 'linear-gradient(90deg, var(--accent-danger), var(--accent-danger-glow))',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          boxShadow: '0 2px 12px var(--accent-danger-glow)'
        }}>
          <WifiOff size={18} color="white" />
          <span style={{ color: 'white', fontSize: '14px' }}>
             <strong>OFFLINE</strong> — Connection lost. Cached data shown. Changes will sync when reconnected.
          </span>
        </div>
      )}

      {/* Privacy Shield Overlay */}
      <AnimatePresence>
        {isShieldActive && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface-translucent)'
            }}
          >
            <div className="w-20 h-20 bg-[var(--bg-inset)] rounded-full flex items-center justify-center border border-[var(--border-subtle)] shadow-xl mb-6">
              <Lock size={32} className="text-[var(--brand-primary)]" />
            </div>
            <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Privacy Shield Active</h2>
            <p className="text-[var(--text-secondary)] font-medium max-w-md text-center">
              TrustVault has obscured your session to prevent background capture and shoulder surfing. Interact with the window to resume.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flex: 1, marginTop: isOffline ? '40px' : '0' }}>
        <Sidebar />
        <TopNav
                    onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main style={{ 
          flex: 1, 
          marginLeft: 'var(--sidebar-width)', 
          marginTop: 'var(--header-height)',
          padding: '28px',
          overflowY: 'auto',
          background: 'transparent',
          position: 'relative',
          zIndex: 1,
          minHeight: 'calc(100vh - var(--header-height))',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, scale: 1.05, rotateX: -10, filter: 'blur(10px)' }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.4 },
                filter: { duration: 0.4 }
              }}
              style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', transformOrigin: 'center top' }}
              className="perspective-1000"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Overlays */}
            <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <AISupportWidget />
    </div>
  );
};

export default Layout;





