import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Command, LayoutDashboard, Shield, Settings,
  Users, Activity, FileText, LogOut, User, Zap, ArrowRight,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings';
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Go to Dashboard', description: 'Security Overview', icon: LayoutDashboard, action: () => { navigate('/app'); onClose(); }, category: 'navigation', keywords: ['home', 'main', 'overview'] },
    { id: 'triage', label: 'Go to Triage Feed', description: 'Live fraud alert feed', icon: Activity, action: () => { navigate('/app/triage'); onClose(); }, category: 'navigation', keywords: ['feed', 'live', 'threats'] },
    { id: 'alerts', label: 'Go to Fraud Alerts', description: 'Fraud alert reports', icon: Shield, action: () => { navigate('/app/incidents'); onClose(); }, category: 'navigation', keywords: ['reports', 'security', 'fraud'] },
    { id: 'community', label: 'Go to Community', description: 'Safety network', icon: Users, action: () => { navigate('/app/community'); onClose(); }, category: 'navigation', keywords: ['people', 'network'] },
    { id: 'reports', label: 'Go to Reports', description: 'Analytics & exports', icon: FileText, action: () => { navigate('/app/reports'); onClose(); }, category: 'navigation', keywords: ['analytics', 'data'] },
    { id: 'profile', label: 'View Profile', description: 'Your account', icon: User, action: () => { navigate('/app/profile'); onClose(); }, category: 'navigation', keywords: ['account', 'avatar'] },
    { id: 'settings', label: 'Open Settings', description: 'System preferences', icon: Settings, action: () => { navigate('/app/settings'); onClose(); }, category: 'settings', keywords: ['preferences', 'config'] },
    { id: 'new-alert', label: 'Report New Fraud Alert', description: 'Open fraud reporting form', icon: Zap, action: () => { navigate('/app/incidents'); onClose(); }, category: 'actions', keywords: ['create', 'report', 'new', 'fraud'] },
    { id: 'logout', label: 'Sign Out', description: 'End current session', icon: LogOut, action: () => { navigate('/'); onClose(); }, category: 'actions', keywords: ['logout', 'exit'] },
  ], [navigate, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.keywords.some(k => k.includes(q))
    );
  }, [query, commands]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const cmd of filtered) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => {
    const items: CommandItem[] = [];
    for (const cat of ['navigation', 'actions', 'settings']) {
      if (grouped[cat]) items.push(...grouped[cat]);
    }
    return items;
  }, [grouped]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, flatList.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && flatList[selectedIndex]) { e.preventDefault(); flatList[selectedIndex].action(); }
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, flatList, selectedIndex, onClose]);

  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const CATEGORY_LABELS: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 200,
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed', top: '14%', left: '50%',
              transform: 'translateX(-50%)',
              width: '600px', maxWidth: '92vw',
              background: 'rgba(5,5,5,0.96)',
              backdropFilter: 'blur(32px)',
              borderRadius: '18px',
              border: '1px solid var(--border-white-5)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px var(--brand-primary-glow)',
              overflow: 'hidden',
              zIndex: 201,
            }}
          >
            {/* Search Input */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid var(--border-white-5)',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <Search size={17} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em',
                }}
              />
              <div style={{
                padding: '3px 8px', borderRadius: '6px',
                background: 'var(--bg-inset)',
                border: '1px solid var(--border-white-5)',
                color: 'var(--text-tertiary)', fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              }}>
                ESC
              </div>
            </div>

            {/* Results */}
            <div ref={listRef} style={{
              maxHeight: '380px', overflowY: 'auto', padding: '8px',
            }}>
              {flatList.length === 0 ? (
                <div style={{
                  padding: '48px 20px', textAlign: 'center', color: 'var(--text-tertiary)',
                }}>
                  <Search size={28} style={{ opacity: 0.15, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}>
                    No results for "<span style={{ color: 'var(--text-secondary)' }}>{query}</span>"
                  </p>
                </div>
              ) : (
                Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: '4px' }}>
                    <div style={{
                      padding: '8px 12px 4px',
                      fontSize: '0.6rem', fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      {CATEGORY_LABELS[cat] || cat}
                    </div>
                    {items.map(cmd => {
                      const globalIdx = flatList.indexOf(cmd);
                      const isActive = globalIdx === selectedIndex;
                      const Icon = cmd.icon;
                      return (
                        <motion.div
                          key={cmd.id}
                          data-active={isActive}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          animate={{
                            background: isActive ? 'var(--brand-primary-bg)' : 'transparent',
                          }}
                          transition={{ duration: 0.12 }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '9px 12px', borderRadius: '10px',
                            border: isActive
                              ? '1px solid var(--border-brand)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: isActive ? 'var(--bg-inset)' : 'var(--bg-inset)',
                            border: `1px solid ${isActive ? 'var(--border-brand)' : 'var(--border-white-5)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'border-color 0.15s',
                          }}>
                            <Icon size={14} style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-tertiary)' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '0.82rem', fontWeight: 500,
                              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontFamily: 'var(--font-sans)',
                            }}>
                              {cmd.label}
                            </div>
                            <div style={{
                              fontSize: '0.68rem', color: 'var(--text-tertiary)',
                              fontFamily: 'var(--font-sans)',
                            }}>
                              {cmd.description}
                            </div>
                          </div>
                          {isActive && (
                            <ArrowRight size={13} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '10px 22px',
              borderTop: '1px solid var(--border-white-5)',
              display: 'flex', alignItems: 'center', gap: '18px',
              fontSize: '0.6rem', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Command size={9} /> <span>K to open</span>
              </span>
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span style={{ marginLeft: 'auto', opacity: 0.5 }}>TrustVault OS</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;


