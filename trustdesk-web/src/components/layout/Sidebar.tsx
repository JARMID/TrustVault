import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wallet, Activity, Users, Settings, Home, LogOut, User, FileText,
  Bug, Fingerprint, Globe, MapPin, Tags, Shield, Network, Brain,
  Send, CreditCard, ArrowLeftRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import { useToast } from '../ui/Toast';

const navItems = [
  { icon: Home, label: 'Wallet Home', path: '/app/dashboard' },
  { icon: Wallet, label: 'My Wallet', path: '/app/wallet' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/app/transactions' },
  { icon: Send, label: 'Send Money', path: '/app/send' },
  { icon: Brain, label: 'Fraud Triage', path: '/app/incidents', badge: 12 },
  { icon: Shield, label: 'Security & Audit', path: '/app/security' },
  { icon: Globe, label: 'Global Map', path: '/app/map' },
  { icon: Fingerprint, label: 'eKYC & Identity', path: '/app/ekyc' },
  { icon: MapPin, label: 'Geo-Local', path: '/app/geo' },
  { icon: Users, label: 'Client Management', path: '/app/community' },
  { icon: Network, label: 'Tokens & Org', path: '/app/tags' },
  { icon: Bug, label: 'Bug Reports', path: '/app/bugs' },
  { icon: FileText, label: 'Reports', path: '/app/reports' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    addToast({ type: 'info', title: 'Session ended', message: 'You have been securely signed out.' });
    setTimeout(() => navigate('/login'), 300);
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(8, 10, 16, 0.9)',
      backdropFilter: 'blur(24px)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40
    }}>
      {/* Brand logo area */}
      <div style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 198, 174, 0.25)',
          overflow: 'hidden',
          border: '1px solid rgba(0, 198, 174, 0.25)',
        }}>
          <img
            src="/trustvault_logo.png"
            alt="TrustVault"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', display: 'block', lineHeight: 1.2 }}>
            Trust<span style={{ fontWeight: 300, color: '#00C6AE' }}>Vault</span>
          </span>
          <span style={{ fontSize: '0.6rem', color: '#64748B', fontFamily: 'monospace', letterSpacing: '0.05em' }}>SECURE WALLET</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', paddingLeft: '14px', marginBottom: '8px' }}>Navigation</p>

        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                color: isActive ? 'var(--text-primary)' : '#64748B',
                textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                zIndex: 1,
              }}
              onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = isActive ? 'var(--text-primary)' : '#94A3B8'; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? 'var(--text-primary)' : '#64748B'; }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 198, 174, 0.06)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 198, 174, 0.12)',
                    boxShadow: 'inset 3px 0 0 var(--brand-primary)',
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={19} style={{ color: isActive ? 'var(--brand-primary)' : 'inherit' }} />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700,
                  padding: '2px 7px', borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.12)', color: '#F87171',
                  fontFamily: 'monospace'
                }}>{item.badge}</span>
              )}
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', paddingLeft: '14px', marginBottom: '8px', marginTop: '16px' }}>System</p>
          
          {/* Profile Link */}
          <Link
            to="/app/profile"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              color: location.pathname.startsWith('/app/profile') ? 'var(--text-primary)' : '#64748B',
              textDecoration: 'none',
              transition: 'color 0.2s, background 0.2s',
              fontWeight: location.pathname.startsWith('/app/profile') ? 600 : 500,
              fontSize: '0.875rem',
              zIndex: 1,
            }}
          >
            {location.pathname.startsWith('/app/profile') && (
              <motion.div
                layoutId="sidebarActiveIndicator"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0, 198, 174, 0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 198, 174, 0.12)',
                  boxShadow: 'inset 3px 0 0 var(--brand-primary)',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <User size={19} style={{ color: location.pathname.startsWith('/app/profile') ? 'var(--brand-primary)' : 'inherit' }} />
            Profile
          </Link>

          {/* Settings Link */}
          <Link
            to="/app/settings"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '10px',
              color: location.pathname.startsWith('/app/settings') ? 'var(--text-primary)' : '#64748B',
              textDecoration: 'none',
              transition: 'color 0.2s, background 0.2s',
              fontWeight: location.pathname.startsWith('/app/settings') ? 600 : 500,
              fontSize: '0.875rem',
              zIndex: 1
            }}
          >
            {location.pathname.startsWith('/app/settings') && (
              <motion.div
                layoutId="sidebarActiveIndicator"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0, 198, 174, 0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 198, 174, 0.12)',
                  boxShadow: 'inset 3px 0 0 var(--brand-primary)',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Settings size={19} style={{ color: location.pathname.startsWith('/app/settings') ? 'var(--brand-primary)' : 'inherit' }} />
            Settings
          </Link>
        </div>
      </nav>

      {/* Bottom user area */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div
          onClick={() => navigate('/app/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 10px', borderRadius: '10px', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar
            name="Vault Admin"
            imageUrl="gradient-4"
            size="sm"
            status="online"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>Vault Admin</p>
            <p style={{ fontSize: '0.65rem', color: '#64748B' }}>Administrator</p>
          </div>
          <LogOut
            size={15}
            style={{ color: '#475569', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
