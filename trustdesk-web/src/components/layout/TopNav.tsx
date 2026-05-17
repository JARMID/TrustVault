import React from 'react';
import { Search, Bell, ChevronDown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

interface TopNavProps {
  onOpenNotifications: () => void;
  onOpenCommandPalette: () => void;
  notificationCount?: number;
}

const TopNav: React.FC<TopNavProps> = ({
  onOpenNotifications,
  onOpenCommandPalette,
  notificationCount = 3,
}) => {
  return (
    <header style={{
      height: 'var(--header-height)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      background: 'rgba(8, 10, 16, 0.7)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 30
    }}>
      {/* Search Bar — opens CommandPalette */}
      <div
        onClick={onOpenCommandPalette}
        style={{
          width: '420px',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569', transition: 'color 0.2s' }} />
        <div
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#475569',
            padding: '9px 60px 9px 42px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'rgba(0,198,174,0.3)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
        >
          Search transactions, clients, commands…
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '3px', pointerEvents: 'none' }}>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'monospace', padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', lineHeight: 1 }}>⌘</kbd>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'monospace', padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569', lineHeight: 1 }}>K</kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Vault Secure indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px', borderRadius: '20px',
          background: 'rgba(0, 198, 174, 0.06)', border: '1px solid rgba(0, 198, 174, 0.12)',
        }}>
          <Shield size={11} style={{ color: '#00C6AE' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00C6AE', boxShadow: '0 0 6px #00C6AE' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#00E8CC', fontFamily: 'monospace', letterSpacing: '0.04em' }}>VAULT SECURE</span>
        </div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenNotifications}
          style={{
            position: 'relative', width: '38px', height: '38px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer', color: '#64748B', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748B'; }}
        >
          <Bell size={17} />
          {notificationCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              style={{
                position: 'absolute', top: '7px', right: '8px', width: '7px', height: '7px',
                background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)',
                border: '1.5px solid rgba(8, 10, 16, 0.9)'
              }}
            />
          )}
        </motion.button>

        {/* User Profile */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            padding: '4px 8px', borderRadius: '10px', transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>Vault Admin</p>
            <p style={{ fontSize: '0.65rem', color: '#64748B' }}>Administrator</p>
          </div>
          <Avatar
            name="Vault Admin"
            imageUrl="gradient-4"
            size="sm"
            status="online"
          />
          <ChevronDown size={14} style={{ color: '#475569' }} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
