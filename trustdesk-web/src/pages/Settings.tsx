import React, { useState } from 'react';
import { Key, Bell, Monitor, Shield, Eye, EyeOff, Save, ToggleLeft, ToggleRight, Globe, Lock, AlertTriangle, Clock, Smartphone, Mail, ChevronRight, Plus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState('api');

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,198,174,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      
      <div className="flex flex-col gap-8 h-full" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <header>
        <h1 className="text-h1 mb-2">System Settings</h1>
        <p className="text-sm" style={{ fontFamily: 'monospace', maxWidth: '600px' }}>Configure cryptographic keychains, workspace environment variables, and platform security policies.</p>
      </header>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Settings Navigation */}
        <div className="flex flex-col gap-2" style={{ width: '240px', flexShrink: 0 }}>
          {[
            { id: 'api', icon: Key, label: 'API & Integration' },
            { id: 'security', icon: Shield, label: 'Security Protocols' },
            { id: 'notifications', icon: Bell, label: 'Alert Routing' },
            { id: 'display', icon: Monitor, label: 'Display & UI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all"
              style={{
                fontFamily: 'monospace',
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                boxShadow: activeTab === tab.id ? 'inset 2px 0 0 var(--brand-primary)' : 'none',
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}

          {/* Version info at bottom */}
          <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', marginBottom: '4px' }}>TrustVault Platform</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>v2.4.1 (build 1892)</p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 liquid-glass-card mesh-bg overflow-y-auto" style={{ padding: '32px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {/* API Tab */}
              {activeTab === 'api' && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Global API Keys</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '24px' }}>These keys allow external systems to stream cryptographic events directly to your dashboard.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { name: 'Production Logging Key', status: 'ACTIVE', key: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
                        { name: 'Staging Environment Key', status: 'ACTIVE', key: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
                      ].map((apiKey, i) => (
                        <div key={i} className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex justify-between items-center mb-3">
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{apiKey.name}</span>
                            <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 10px', borderRadius: '20px' }}>{apiKey.status}</span>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1 relative">
                              <input 
                                type={showApiKey ? "text" : "password"} 
                                value={apiKey.key}
                                readOnly
                                style={{
                                  width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)',
                                  borderRadius: '8px', padding: '9px 40px 9px 14px', fontFamily: 'monospace',
                                  fontSize: '0.8rem', color: 'var(--text-secondary)', outline: 'none',
                                }}
                              />
                              <button 
                                onClick={() => setShowApiKey(!showApiKey)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}
                              >
                                {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                            <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'monospace' }}>Regenerate</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Webhook Destinations</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { name: 'Slack Escalation Alerts', url: 'https://hooks.slack.com/services/T000...', active: true },
                        { name: 'PagerDuty CRITICAL', url: 'https://events.pagerduty.com/v2/enqueue', active: true },
                      ].map((webhook, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg group cursor-pointer" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{webhook.name}</div>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{webhook.url}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
                            <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                          </div>
                        </div>
                      ))}
                      <button style={{ width: '100%', padding: '14px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '10px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={16} /> Add New Webhook Endpoint
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end" style={{ paddingTop: '8px' }}>
                    <button className="btn btn-primary" style={{ borderRadius: '10px' }}>
                      <Save size={16} /> Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Authentication & Access</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '24px' }}>Control who can access TrustVault and how they authenticate.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Two-Factor Authentication (2FA)', desc: 'Require TOTP or hardware key for all logins', enabled: true, icon: Lock },
                        { label: 'IP Allowlist Enforcement', desc: 'Restrict dashboard access to approved IP ranges', enabled: true, icon: Globe },
                        { label: 'Session Timeout', desc: 'Auto-lock after 15 minutes of inactivity', enabled: true, icon: Clock },
                        { label: 'Biometric Login (Mobile)', desc: 'Allow fingerprint/face authentication on mobile app', enabled: false, icon: Smartphone },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center gap-4">
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.enabled ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.enabled ? 'var(--brand-primary)' : 'var(--text-tertiary)' }}>
                              <item.icon size={18} />
                            </div>
                            <div>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{item.label}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc}</p>
                            </div>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={28} style={{ color: 'var(--brand-primary)', cursor: 'pointer' }} /> : 
                            <ToggleLeft size={28} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Encryption Standards</h2>
                    <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {[
                        { label: 'Data at Rest', value: 'AES-256-GCM', ok: true },
                        { label: 'Data in Transit', value: 'TLS 1.3', ok: true },
                        { label: 'Key Derivation', value: 'Argon2id', ok: true },
                        { label: 'Last Key Rotation', value: '2h 14m ago', ok: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: 'white' }}>{item.value}</span>
                            <CheckCircle size={14} style={{ color: 'var(--accent-success)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end" style={{ paddingTop: '8px' }}>
                    <button className="btn btn-primary" style={{ borderRadius: '10px' }}>
                      <Save size={16} /> Save Security Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Alert Channels</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '24px' }}>Configure how and where you receive fraud alert notifications.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Email Notifications', desc: 'triage-agent@trustvault.io', enabled: true, icon: Mail },
                        { label: 'Push Notifications', desc: 'TrustVault Mobile (2 devices)', enabled: true, icon: Smartphone },
                        { label: 'Slack Integration', desc: '#soc-critical-alerts channel', enabled: true, icon: Bell },
                        { label: 'SMS Alerts', desc: 'Critical alerts only (+213 â€¢â€¢â€¢â€¢ 4291)', enabled: false, icon: AlertTriangle },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center gap-4">
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.enabled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.enabled ? 'var(--accent-success)' : 'var(--text-tertiary)' }}>
                              <item.icon size={18} />
                            </div>
                            <div>
                              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{item.label}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc}</p>
                            </div>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={28} style={{ color: 'var(--accent-success)', cursor: 'pointer' }} /> : 
                            <ToggleLeft size={28} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Escalation Rules</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { severity: 'CRITICAL', action: 'Immediate push + SMS + Slack', delay: '0 min', color: 'var(--accent-danger)' },
                        { severity: 'HIGH', action: 'Push + Slack notification', delay: '2 min', color: 'var(--brand-primary)' },
                        { severity: 'MEDIUM', action: 'Email + Slack', delay: '15 min', color: 'var(--brand-primary)' },
                        { severity: 'LOW', action: 'Email digest (hourly)', delay: '60 min', color: 'var(--brand-primary)' },
                      ].map((rule, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
                          <div className="flex items-center gap-3">
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: `${rule.color}15`, color: rule.color, letterSpacing: '0.04em' }}>{rule.severity}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rule.action}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>Delay: {rule.delay}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end" style={{ paddingTop: '8px' }}>
                    <button className="btn btn-primary" style={{ borderRadius: '10px' }}>
                      <Save size={16} /> Save Alert Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Display Tab */}
              {activeTab === 'display' && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Appearance</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '24px' }}>Customize the look and feel of your workspace.</p>
                    
                    <div className="flex flex-col gap-6">
                      {/* Theme Selection */}
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '12px' }}>Color Theme</p>
                        <div className="flex gap-3">
                          {[
                            { name: 'Obsidian', bg: 'var(--bg-primary)', accent: 'var(--brand-primary)', active: true },
                            { name: 'Midnight', bg: 'var(--bg-secondary)', accent: 'var(--brand-primary)', active: false },
                            { name: 'Stealth', bg: '#111111', accent: 'var(--accent-success)', active: false },
                          ].map((theme) => (
                            <div key={theme.name} className="flex flex-col items-center gap-2 cursor-pointer group" style={{ flex: 1 }}>
                              <div style={{
                                width: '100%', height: '80px', borderRadius: '12px',
                                background: theme.bg, border: theme.active ? `2px solid ${theme.accent}` : '2px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'flex-end', padding: '8px',
                                boxShadow: theme.active ? `0 0 20px ${theme.accent}30` : 'none',
                                transition: 'all 0.2s',
                              }}>
                                <div style={{ width: '100%', height: '12px', borderRadius: '4px', background: theme.accent, opacity: 0.6 }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', color: theme.active ? 'white' : 'var(--text-tertiary)', fontWeight: theme.active ? 600 : 400 }}>{theme.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)' }} />

                      {/* Display Options */}
                      {[
                        { label: 'Compact Mode', desc: 'Reduce padding and spacing for denser views', enabled: false },
                        { label: 'Ambient Cursor Glow', desc: 'Show soft glow that follows mouse cursor', enabled: true },
                        { label: 'Page Transition Animations', desc: 'Smooth fade/slide between pages', enabled: true },
                        { label: 'Monospace Data Fields', desc: 'Use monospace font for IDs, hashes, timestamps', enabled: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{item.label}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc}</p>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={28} style={{ color: 'var(--brand-primary)', cursor: 'pointer' }} /> : 
                            <ToggleLeft size={28} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end" style={{ paddingTop: '8px' }}>
                    <button className="btn btn-primary" style={{ borderRadius: '10px' }}>
                      <Save size={16} /> Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Settings;




