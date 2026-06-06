import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { type LucideIcon, Wallet, Users, Settings, Home, LogOut, User, FileText, Bug, Fingerprint, Globe, MapPin, Shield, Network, Brain, Send, CreditCard, ArrowLeftRight, BarChart3, MonitorSmartphone, TrendingUp, FolderLock, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import { useToast } from '../ui/Toast';
import { useAuthStore } from '../../stores/authStore';

const MotionLink = motion(Link);

const clientNavItems: { icon: LucideIcon; label: string; path: string; badge?: number }[] = [
  { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Wallet, label: 'My Wallet', path: '/app/wallet' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/app/transactions' },
  { icon: Send, label: 'Send Money', path: '/app/send' },
  { icon: CreditCard, label: 'Cards', path: '/app/cards' },
  { icon: MonitorSmartphone, label: 'Device Trust', path: '/app/device-trust' },
  { icon: TrendingUp, label: 'AI Cash Flow', path: '/app/ai-insights' },
  { icon: FolderLock, label: 'Secure Vault', path: '/app/vault' },
  { icon: PiggyBank, label: 'Budget', path: '/app/budget' },
  { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
];

const adminNavItems: { icon: LucideIcon; label: string; path: string; badge?: number }[] = [
  { icon: Shield, label: 'SOC Command', path: '/app/soc' },
  { icon: Brain, label: 'Fraud Triage', path: '/app/incidents', badge: 12 },
  { icon: Globe, label: 'Global Map', path: '/app/map' },
  { icon: Shield, label: 'Security & Audit', path: '/app/security' },
  { icon: Fingerprint, label: 'eKYC & Identity', path: '/app/ekyc' },
  { icon: MapPin, label: 'Geo-Local', path: '/app/geo' },
  { icon: Users, label: 'Clients', path: '/app/community' },
  { icon: Network, label: 'Tokens & Org', path: '/app/tags' },
  { icon: Bug, label: 'Bug Reports', path: '/app/bugs' },
  { icon: FileText, label: 'Reports', path: '/app/reports' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const { addToast } = useToast();

  const handleLogout = async () => {
    addToast({ type: 'info', title: 'Signing out', message: 'Securely signing you out...' });
    await signOut();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid var(--border-white-5)',
      background: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40
    }}>
      {/* Brand logo area */}
      <div style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-white-5)',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(200,200,200,0.1), rgba(100,100,100,0.15))',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <img
            src="/trustvault_logo.png"
            alt="TrustVault"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback to text if logo doesn't load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'block', lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>
            Trust<span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>Vault</span>
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.06em' }}>DIGITAL WALLET</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', paddingLeft: '12px', marginBottom: '8px' }}>Client Portal</p>

        {clientNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <MotionLink
              key={item.path}
              to={item.path}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                zIndex: 1,
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicatorClient"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--brand-primary-bg)',
                    borderRadius: '10px',
                    border: '1px solid rgba(91, 95, 237, 0.1)',
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={18} style={{ color: isActive ? 'var(--brand-primary)' : 'inherit', flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700,
                  padding: '2px 7px', borderRadius: '6px',
                  background: 'var(--accent-danger-bg)', color: 'var(--accent-danger)',
                  fontFamily: 'var(--font-mono)'
                }}>{item.badge}</span>
              )}
            </MotionLink>
          );
        })}

        <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-danger)', paddingLeft: '12px', marginBottom: '8px', marginTop: '16px' }}>Administration</p>

        {adminNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <MotionLink
              key={item.path}
              to={item.path}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                color: isActive ? 'var(--accent-danger)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                zIndex: 1,
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicatorAdmin"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--accent-danger-bg)',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={18} style={{ color: isActive ? 'var(--accent-danger)' : 'inherit', flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700,
                  padding: '2px 7px', borderRadius: '6px',
                  background: 'var(--accent-danger-bg)', color: 'var(--accent-danger)',
                  fontFamily: 'var(--font-mono)'
                }}>{item.badge}</span>
              )}
            </MotionLink>
          );
        })}

        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', paddingLeft: '12px', marginBottom: '8px', marginTop: '16px' }}>Account</p>
          
          {/* Profile Link */}
          <MotionLink
            to="/app/profile"
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              color: location.pathname.startsWith('/app/profile') ? 'var(--brand-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s, background 0.2s',
              fontWeight: location.pathname.startsWith('/app/profile') ? 600 : 500,
              fontSize: '0.85rem',
              zIndex: 1,
            }}
          >
            {location.pathname.startsWith('/app/profile') && (
              <motion.div
                layoutId="sidebarActiveIndicator"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'var(--brand-primary-bg)',
                  borderRadius: '10px',
                  border: '1px solid rgba(91, 95, 237, 0.1)',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <User size={18} style={{ color: location.pathname.startsWith('/app/profile') ? 'var(--brand-primary)' : 'inherit' }} />
            Profile
          </MotionLink>

          {/* User Security Link */}
          <MotionLink
            to="/app/user-security"
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              color: location.pathname.startsWith('/app/user-security') ? 'var(--brand-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s, background 0.2s',
              fontWeight: location.pathname.startsWith('/app/user-security') ? 600 : 500,
              fontSize: '0.85rem',
              zIndex: 1
            }}
          >
            {location.pathname.startsWith('/app/user-security') && (
              <motion.div
                layoutId="sidebarActiveIndicator"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'var(--brand-primary-bg)',
                  borderRadius: '10px',
                  border: '1px solid rgba(91, 95, 237, 0.1)',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Shield size={18} style={{ color: location.pathname.startsWith('/app/user-security') ? 'var(--brand-primary)' : 'inherit' }} />
            User Security
          </MotionLink>

          {/* Settings Link */}
          <MotionLink
            to="/app/settings"
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              color: location.pathname.startsWith('/app/settings') ? 'var(--brand-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s, background 0.2s',
              fontWeight: location.pathname.startsWith('/app/settings') ? 600 : 500,
              fontSize: '0.85rem',
              zIndex: 1
            }}
          >
            {location.pathname.startsWith('/app/settings') && (
              <motion.div
                layoutId="sidebarActiveIndicator"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'var(--brand-primary-bg)',
                  borderRadius: '10px',
                  border: '1px solid rgba(91, 95, 237, 0.1)',
                  zIndex: -1
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Settings size={18} style={{ color: location.pathname.startsWith('/app/settings') ? 'var(--brand-primary)' : 'inherit' }} />
            Settings
          </MotionLink>
        </div>
      </nav>

      {/* Bottom user area */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-white-5)' }}>
        <div
          onClick={() => navigate('/app/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px', borderRadius: '10px', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-inset)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar
            name="Vault Admin"
            imageUrl="gradient-4"
            size="sm"
            status="online"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Vault Admin</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Administrator</p>
          </div>
          <LogOut
            size={15}
            style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;




