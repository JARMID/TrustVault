import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import NotificationPanel from '../ui/NotificationPanel';
import CommandPalette from '../ui/CommandPalette';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

const Layout: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  const cursorX = useSpring(-100, { stiffness: 500, damping: 40 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // @ts-expect-error – electronAPI is injected by the Electron preload script
      if (window.electronAPI) window.electronAPI.sendNetworkStatus('online');
    };
    const handleOffline = () => {
      setIsOffline(true);
      // @ts-expect-error – electronAPI is injected by the Electron preload script
      if (window.electronAPI) window.electronAPI.sendNetworkStatus('offline');
    };

    // Global ⌘K / Ctrl+K shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cursorX, cursorY]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Magical Ambient Cursor */}
      <motion.div 
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--brand-primary)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          filter: 'blur(12px)',
          opacity: 0.6,
          x: cursorX,
          y: cursorY
        }}
      />

      {/* Premium Offline Banner */}
      {isOffline && (
        <div style={{
          background: 'linear-gradient(90deg, #b91c1c, #991b1b)',
          borderBottom: '1px solid #7f1d1d',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          boxShadow: '0 4px 20px rgba(185, 28, 28, 0.4)'
        }}>
          <WifiOff size={18} color="white" />
          <span style={{ color: 'white', fontSize: '14px' }}>
             <strong style={{ letterSpacing: '1px' }}>OFFLINE WORKSPACE</strong> — Connection lost. You are currently viewing cached tickets. Operations will sync upon reconnection.
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, marginTop: isOffline ? '40px' : '0' }}>
        <Sidebar />
        <TopNav
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main style={{ 
          flex: 1, 
          marginLeft: 'var(--sidebar-width)', 
          marginTop: 'var(--header-height)',
          padding: '32px',
          overflowY: 'auto',
          background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 40%)',
          position: 'relative'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Overlays */}
      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default Layout;
