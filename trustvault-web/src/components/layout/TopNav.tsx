import React from 'react';
import { Search, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationPanel from '../ui/NotificationPanel';
import Avatar from '../ui/Avatar';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

interface TopNavProps {
    onOpenCommandPalette: () => void;
  }

const TopNav: React.FC<TopNavProps> = ({
    onOpenCommandPalette,
  }) => {
  const { profile } = useAuthStore();
  const userName = profile?.full_name || 'Vault Admin';
  const userRole = profile?.role ? profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Administrator';
  const { theme, toggleTheme } = useUIStore();

  return (
    <header style={{
      height: 'var(--header-height)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      background: 'var(--bg-surface-translucent, rgba(5, 5, 5, 0.75))',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border-white-5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 30
    }}>
      {/* Search Bar — opens CommandPalette */}
      <motion.div
        onClick={onOpenCommandPalette}
        whileHover={{ scale: 1.01, boxShadow: '0 0 15px var(--brand-primary-glow)' }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '400px',
          position: 'relative',
          cursor: 'pointer',
          borderRadius: '10px'
        }}
      >
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', transition: 'color 0.2s', zIndex: 2 }} />
        <div
          style={{
            width: '100%',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-tertiary)',
            padding: '9px 60px 9px 40px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            position: 'relative',
            zIndex: 1
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.previousElementSibling!.setAttribute('style', 'position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--brand-primary); transition: color 0.2s; z-index: 2;');
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = 'var(--bg-inset)';
            e.currentTarget.previousElementSibling!.setAttribute('style', 'position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); transition: color 0.2s; z-index: 2;');
          }}
        >
          Search transactions, clients, commands…
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '3px', pointerEvents: 'none', zIndex: 2 }}>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', lineHeight: 1 }}>⌘</kbd>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', lineHeight: 1 }}>K</kbd>
        </div>
      </motion.div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Status indicator */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-success-bg)', border: '1px solid rgba(34,197,94,0.12)',
            cursor: 'default'
          }}
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} 
          />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-success)', letterSpacing: '0.02em' }}>All systems active</span>
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s, background 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-inset)'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Notification Bell */}
        <NotificationPanel />

        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-inset)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
            padding: '4px 8px', borderRadius: '10px', transition: 'background 0.2s',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{userName}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{userRole}</p>
          </div>
          <Avatar
            name={userName}
            imageUrl={profile?.avatar_url || "gradient-4"}
            size="sm"
            status="online"
          />
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
        </motion.div>
      </div>
    </header>
  );
};

export default TopNav;





