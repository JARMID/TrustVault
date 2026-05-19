import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import CommandPalette from '../ui/CommandPalette';
import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%' }}
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
    </div>
  );
};

export default Layout;





