import React, { useState } from 'react';
import { Key, Bell, Monitor, Shield, Eye, EyeOff, Save, ToggleLeft, ToggleRight, Globe, Lock, AlertTriangle, Clock, Smartphone, Mail, ChevronRight, Plus, CheckCircle } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/ui/TiltCard';

const Settings: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState('api');
  const { theme, setTheme } = useUIStore();

  return (
    <div className="flex flex-col h-full max-w-[1200px] mx-auto w-full pt-8 px-6 xl:px-0">
      
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">System Settings</h1>
        <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium max-w-[600px]">Configure cryptographic keychains, workspace environment variables, and platform security policies.</p>
      </header>

      <div className="flex gap-8 flex-1 min-h-0 pb-8">
        {/* Settings Navigation */}
        <div className="flex flex-col gap-2 w-[240px] shrink-0">
          {[
            { id: 'api', icon: Key, label: 'API & Integration' },
            { id: 'security', icon: Shield, label: 'Security Protocols' },
            { id: 'notifications', icon: Bell, label: 'Alert Routing' },
            { id: 'display', icon: Monitor, label: 'Display & UI' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[0.9rem] font-bold transition-all relative overflow-hidden group ${
                activeTab === tab.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="settings-active-tab"
                  className="absolute inset-0 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon size={18} className={`relative z-10 ${activeTab === tab.id ? 'text-[var(--brand-primary)]' : ''}`} />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}

          {/* Version info at bottom */}
          <div className="mt-auto pt-4 border-t border-[var(--border-subtle)] px-4">
            <p className="text-[0.7rem] font-extrabold text-[var(--text-tertiary)] uppercase tracking-widest mb-1">TrustVault Platform</p>
            <p className="text-[0.8rem] font-bold text-[var(--text-secondary)] font-mono">v2.4.1 (build 1892)</p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[28px] shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {/* API Tab */}
              {activeTab === 'api' && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Global API Keys</h2>
                    <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium mb-6">These keys allow external systems to stream cryptographic events directly to your dashboard.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { name: 'Production Logging Key', status: 'ACTIVE', key: '••••••••••••••••••••••••••••' },
                        { name: 'Staging Environment Key', status: 'ACTIVE', key: '••••••••••••••••••••••••••••' },
                      ].map((apiKey, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] shadow-sm transition-all hover:shadow-md">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[0.95rem] font-bold text-[var(--text-primary)]">{apiKey.name}</span>
                            <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">{apiKey.status}</span>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1 relative">
                              <input 
                                type={showApiKey ? "text" : "password"} 
                                value={apiKey.key}
                                readOnly
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-3 pl-4 pr-12 font-mono text-[0.85rem] font-bold text-[var(--text-secondary)] outline-none shadow-inner"
                              />
                              <button 
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                              >
                                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            <button className="px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl font-bold text-[var(--text-secondary)] text-[0.85rem] shadow-sm hover:bg-[var(--bg-surface-hover)] transition-colors">Regenerate</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-[var(--border-subtle)]" />

                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">Webhook Destinations</h2>
                    <div className="flex flex-col gap-4">
                      {[
                        { name: 'Slack Escalation Alerts', url: 'https://hooks.slack.com/services/T000...', active: true },
                        { name: 'PagerDuty CRITICAL', url: 'https://events.pagerduty.com/v2/enqueue', active: true },
                      ].map((webhook, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:shadow-md transition-all cursor-pointer group">
                          <div>
                            <div className="text-[0.95rem] font-bold text-[var(--text-primary)] mb-1">{webhook.name}</div>
                            <div className="text-[0.8rem] font-mono text-[var(--text-secondary)]">{webhook.url}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <ChevronRight size={20} className="text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors" />
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-4 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl text-[var(--text-secondary)] font-bold text-[0.9rem] hover:border-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all flex items-center justify-center gap-2">
                        <Plus size={18} /> Add New Webhook Endpoint
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all">
                      <Save size={18} /> Save Configuration
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Authentication & Access</h2>
                    <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium mb-6">Control who can access TrustVault and how they authenticate.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Two-Factor Authentication (2FA)', desc: 'Require TOTP or hardware key for all logins', enabled: true, icon: Lock },
                        { label: 'IP Allowlist Enforcement', desc: 'Restrict dashboard access to approved IP ranges', enabled: true, icon: Globe },
                        { label: 'Session Timeout', desc: 'Auto-lock after 15 minutes of inactivity', enabled: true, icon: Clock },
                        { label: 'Biometric Login (Mobile)', desc: 'Allow fingerprint/face authentication on mobile app', enabled: false, icon: Smartphone },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.enabled ? 'bg-[var(--brand-primary-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary-glow)]' : 'bg-[var(--bg-inset)] text-[var(--text-tertiary)]'}`}>
                              <item.icon size={22} />
                            </div>
                            <div>
                              <p className="text-[1rem] font-bold text-[var(--text-primary)] mb-1">{item.label}</p>
                              <p className="text-[0.85rem] font-medium text-[var(--text-secondary)]">{item.desc}</p>
                            </div>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={36} className="text-[#00C6AE] cursor-pointer" /> : 
                            <ToggleLeft size={36} className="text-[var(--text-tertiary)] opacity-50 cursor-pointer" />
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-[var(--border-subtle)]" />

                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">Encryption Standards</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Data at Rest', value: 'AES-256-GCM', ok: true },
                        { label: 'Data in Transit', value: 'TLS 1.3', ok: true },
                        { label: 'Key Derivation', value: 'Argon2id', ok: true },
                        { label: 'Last Key Rotation', value: '2h 14m ago', ok: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
                          <span className="text-[0.85rem] font-bold text-[var(--text-secondary)]">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[0.85rem] font-mono font-extrabold text-[var(--text-primary)]">{item.value}</span>
                            <CheckCircle size={16} className="text-emerald-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all">
                      <Save size={18} /> Save Security Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Alert Channels</h2>
                    <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium mb-6">Configure how and where you receive fraud alert notifications.</p>
                    
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Email Notifications', desc: 'triage-agent@trustvault.io', enabled: true, icon: Mail },
                        { label: 'Push Notifications', desc: 'TrustVault Mobile (2 devices)', enabled: true, icon: Smartphone },
                        { label: 'Slack Integration', desc: '#soc-critical-alerts channel', enabled: true, icon: Bell },
                        { label: 'SMS Alerts', desc: 'Critical alerts only (+213 •••• 4291)', enabled: false, icon: AlertTriangle },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.enabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-[var(--bg-inset)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]'}`}>
                              <item.icon size={22} />
                            </div>
                            <div>
                              <p className="text-[1rem] font-bold text-[var(--text-primary)] mb-1">{item.label}</p>
                              <p className="text-[0.85rem] font-medium text-[var(--text-secondary)]">{item.desc}</p>
                            </div>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={36} className="text-emerald-500 cursor-pointer" /> : 
                            <ToggleLeft size={36} className="text-[var(--text-tertiary)] opacity-50 cursor-pointer" />
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-[var(--border-subtle)]" />

                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">Escalation Rules</h2>
                    <div className="flex flex-col gap-3">
                      {[
                        { severity: 'CRITICAL', action: 'Immediate push + SMS + Slack', delay: '0 min', color: 'red' },
                        { severity: 'HIGH', action: 'Push + Slack notification', delay: '2 min', color: 'orange' },
                        { severity: 'MEDIUM', action: 'Email + Slack', delay: '15 min', color: 'blue' },
                        { severity: 'LOW', action: 'Email digest (hourly)', delay: '60 min', color: 'slate' },
                      ].map((rule, i) => {
                        const colorMap: any = {
                          red: 'bg-red-500/10 text-red-500 border-red-500/20',
                          orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
                          blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                          slate: 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                        };
                        return (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)]">
                          <div className="flex items-center gap-4">
                            <span className={`text-[0.7rem] font-extrabold px-2.5 py-1 rounded-md border tracking-widest ${colorMap[rule.color]}`}>{rule.severity}</span>
                            <span className="text-[0.9rem] font-bold text-[var(--text-primary)]">{rule.action}</span>
                          </div>
                          <span className="text-[0.85rem] font-mono font-bold text-[var(--text-tertiary)]">Delay: {rule.delay}</span>
                        </div>
                      )})}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all">
                      <Save size={18} /> Save Alert Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Display Tab */}
              {activeTab === 'display' && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Appearance</h2>
                    <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium mb-6">Customize the look and feel of your workspace.</p>
                    
                    <div className="flex flex-col gap-8">
                      {/* Theme Selection */}
                      <div>
                        <p className="text-[0.95rem] font-bold text-[var(--text-primary)] mb-4">Color Theme</p>
                        <div className="flex gap-4">
                          {[
                            { name: 'Light (Ultra-Premium)', bg: 'white', accent: '#00C6AE', value: 'light' as const },
                            { name: 'Dark (Legacy)', bg: '#0F172A', accent: '#3B82F6', value: 'dark' as const },
                          ].map((t) => (
                            <div key={t.name} onClick={() => setTheme(t.value)} className="flex flex-col items-center gap-3 cursor-pointer group flex-1">
                              <div className={`w-full h-[100px] rounded-2xl flex items-end p-2 transition-all ${
                                theme === t.value ? 'border-2 border-[var(--brand-primary)] shadow-[0_0_20px_var(--brand-primary-glow)]' : 'border-2 border-[var(--border-subtle)]'
                              }`} style={{ backgroundColor: t.bg }}>
                                <div className="w-full h-3 rounded bg-current opacity-60" style={{ color: t.accent }} />
                              </div>
                              <span className={`text-[0.85rem] font-bold ${theme === t.value ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>{t.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full h-px bg-[var(--border-subtle)]" />

                      {/* Display Options */}
                      <div className="flex flex-col gap-2">
                      {[
                        { label: 'Compact Mode', desc: 'Reduce padding and spacing for denser views', enabled: false },
                        { label: 'Page Transition Animations', desc: 'Smooth fade/slide between pages', enabled: true },
                        { label: 'Monospace Data Fields', desc: 'Use monospace font for IDs, hashes, timestamps', enabled: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors">
                          <div>
                            <p className="text-[0.95rem] font-bold text-[var(--text-primary)] mb-1">{item.label}</p>
                            <p className="text-[0.85rem] font-medium text-[var(--text-secondary)]">{item.desc}</p>
                          </div>
                          {item.enabled ? 
                            <ToggleRight size={36} className="text-[#00C6AE] cursor-pointer" /> : 
                            <ToggleLeft size={36} className="text-[var(--text-tertiary)] opacity-50 cursor-pointer" />
                          }
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all">
                      <Save size={18} /> Save Preferences
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




