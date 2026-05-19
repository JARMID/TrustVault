import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import NotificationPanel from '../ui/NotificationPanel';
import Avatar from '../ui/Avatar';

interface TopNavProps {
    onOpenCommandPalette: () => void;
  }

const TopNav: React.FC<TopNavProps> = ({
    onOpenCommandPalette,
  }) => {
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
      <div
        onClick={onOpenCommandPalette}
        style={{
          width: '400px',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', transition: 'color 0.2s' }} />
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
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--brand-primary-glow)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = 'var(--bg-inset)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Search transactions, clients, commands…
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '3px', pointerEvents: 'none' }}>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', lineHeight: 1 }}>⌘</kbd>
          <kbd style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 5px', borderRadius: '4px', background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', lineHeight: 1 }}>K</kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: 'var(--radius-full)',
          background: 'var(--accent-success-bg)', border: '1px solid rgba(34,197,94,0.12)',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-success)', letterSpacing: '0.02em' }}>All systems active</span>
        </div>

        {/* Notification Bell */}
        <NotificationPanel />

        {/* User Profile */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
            padding: '4px 8px', borderRadius: '10px', transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-inset)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Vault Admin</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Administrator</p>
          </div>
          <Avatar
            name="Vault Admin"
            imageUrl="gradient-4"
            size="sm"
            status="online"
          />
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;





