import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/ui/TiltCard';
import { Shield, Smartphone, Laptop, Tablet, ShieldCheck, MapPin, Clock, XCircle, Activity, ShieldAlert, Fingerprint, Eye } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useDeviceFingerprint } from '../hooks/useDeviceFingerprint';
import { useBehavioralBiometrics } from '../hooks/useBehavioralBiometrics';

const DUMMY_SESSIONS = [
  {
    id: 's_1',
    deviceType: 'smartphone',
    deviceName: 'iPhone 14 Pro',
    os: 'iOS 17.1',
    browser: 'TrustVault App',
    ip: '197.112.54.12',
    location: 'Algiers, Algeria',
    lastActive: 'Just now',
    isCurrent: true,
    riskScore: 0.05,
  },
  {
    id: 's_2',
    deviceType: 'laptop',
    deviceName: 'MacBook Pro 16"',
    os: 'macOS 14.2',
    browser: 'Safari 17.1',
    ip: '105.234.88.90',
    location: 'Oran, Algeria',
    lastActive: '2 hours ago',
    isCurrent: false,
    riskScore: 0.12,
  },
  {
    id: 's_3',
    deviceType: 'tablet',
    deviceName: 'iPad Pro',
    os: 'iPadOS 17',
    browser: 'TrustVault App',
    ip: '197.112.54.12',
    location: 'Algiers, Algeria',
    lastActive: 'Yesterday',
    isCurrent: false,
    riskScore: 0.08,
  },
  {
    id: 's_4',
    deviceType: 'laptop',
    deviceName: 'Unknown Windows PC',
    os: 'Windows 10',
    browser: 'Chrome 120.0',
    ip: '82.145.210.15',
    location: 'Paris, France',
    lastActive: '3 days ago',
    isCurrent: false,
    riskScore: 0.85,
  }
];

const DeviceTrust: React.FC = () => {
  const { addToast } = useToast();
  const [sessions, setSessions] = useState(DUMMY_SESSIONS);
  const { fingerprint, fingerprintDetails } = useDeviceFingerprint();
  const { humanScore, status: biometricStatus } = useBehavioralBiometrics();

  const handleRevoke = (id: string, deviceName: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    addToast({
      type: 'success',
      title: 'Session Revoked',
      message: `Access for ${deviceName} has been permanently revoked.`
    });
  };

  const getDeviceIcon = (type: string) => {
    switch(type) {
      case 'smartphone': return <Smartphone size={24} />;
      case 'laptop': return <Laptop size={24} />;
      case 'tablet': return <Tablet size={24} />;
      default: return <Laptop size={24} />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.7) return 'var(--accent-danger)';
    if (score >= 0.4) return 'var(--accent-warning)';
    return 'var(--accent-success)';
  };



  return (
    <div className="max-w-[1200px] mx-auto pb-12 relative z-10">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary-bg border border-brand-primary-glow flex items-center justify-center text-brand-primary">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-h2 gradient-text">Device Trust</h1>
            <p className="text-sm text-[var(--text-secondary)]">Manage active sessions and authorized devices.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Actions */}
        <div className="flex flex-col gap-6">
          
          <TiltCard 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-brand-primary-glow relative overflow-hidden"
          >
            {/* Mesh gradient background for high-tech feel */}
            <div className="absolute inset-0 opacity-20 mesh-bg" />

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Zero-Trust Fingerprint</h3>
                <p className="text-xs text-brand-primary font-mono uppercase">Immutable Signature</p>
              </div>
              <div className="relative">
                <Fingerprint size={32} className="text-brand-primary" />
                <div className="absolute inset-0 bg-brand-primary blur-md opacity-40 animate-pulse-glow" />
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-subtle)] rounded-lg">
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Activity size={12} /> Local Machine Hash
                </div>
                <div className="font-mono text-xs text-[var(--brand-primary-light)] truncate">
                  {fingerprint || 'Computing...'}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">Hardware Cores</span>
                <span className="font-mono text-[var(--text-primary)]">{fingerprintDetails?.cores || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">WebGL Vendor</span>
                <span className="font-mono text-[var(--text-primary)] text-xs truncate max-w-[120px] text-right">{fingerprintDetails?.webGLData?.split('~')[0] || '-'}</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 relative overflow-hidden"
          >
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">
              <Eye size={16} className={biometricStatus === 'suspicious' ? 'text-accent-danger' : 'text-brand-primary'} /> Behavioral Biometrics
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 relative z-10">
              Continuously analyzing micro-interactions (mouse velocity, typing cadence) to differentiate humans from automated bots.
            </p>
            <div className={`h-[100px] rounded-lg border flex items-center justify-center relative overflow-hidden ${biometricStatus === 'suspicious' ? 'bg-accent-danger-bg border-accent-danger-glow' : 'bg-[var(--bg-inset)] border-[var(--border-subtle)]'}`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,198,174,0.2) 1px, transparent 1px)', backgroundSize: '100% 20px' }} />
              <div className="text-center z-10">
                <div className={`text-3xl font-mono mb-1 ${biometricStatus === 'suspicious' ? 'text-accent-danger' : 'text-brand-primary'}`}>
                  {humanScore}%
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">Human Confidence</div>
              </div>
              {/* Animated scanline */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary shadow-[0_0_10px_var(--brand-primary)] animate-[slideInUp_2s_ease-in-out_infinite_alternate]" style={{ opacity: 0.5 }} />
            </div>
          </TiltCard>
          
        </div>

        {/* Right Column: Sessions */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Active Sessions</h2>
            <button className="btn btn-outline text-xs py-1.5 px-3">
              Revoke All Other Sessions
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {sessions.map((session, i) => (
                <TiltCard 
                  key={session.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 group flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden"
                >
                  {session.riskScore >= 0.7 && (
                    <div className="absolute inset-0 bg-accent-danger-bg opacity-10 pointer-events-none" />
                  )}
                  
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors group-hover:border-[var(--border-strong)]">
                    {getDeviceIcon(session.deviceType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-[var(--text-primary)] truncate">{session.deviceName}</h4>
                      {session.isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary-bg text-brand-primary border border-brand-primary-glow font-bold uppercase tracking-wider">
                          Current Session
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mb-3">
                      <span className="flex items-center gap-1"><Shield size={12}/> {session.os} &bull; {session.browser}</span>
                      <span className="flex items-center gap-1"><MapPin size={12}/> {session.location} ({session.ip})</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {session.lastActive}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-2 py-1 rounded bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskColor(session.riskScore) }} />
                        <span className="text-[10px] font-mono" style={{ color: getRiskColor(session.riskScore) }}>
                          RISK SCORE: {session.riskScore.toFixed(2)}
                        </span>
                      </div>
                      
                      {session.riskScore >= 0.7 && (
                        <div className="flex items-center gap-1 text-[10px] text-accent-danger uppercase font-bold animate-pulse">
                          <ShieldAlert size={12} /> High Risk Detected
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                      <button 
                        onClick={() => handleRevoke(session.id, session.deviceName)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold text-accent-danger bg-accent-danger-bg border border-accent-danger-glow hover:bg-accent-danger hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={14} /> Revoke Access
                      </button>
                    </div>
                  )}
                </TiltCard>
              ))}
            </AnimatePresence>
            
            {sessions.length === 0 && (
              <div className="text-center py-12 text-[var(--text-tertiary)]">
                No active sessions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTrust;
