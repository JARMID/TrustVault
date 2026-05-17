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

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const cmd of filtered) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filtered]);

  // Flatten for index tracking
  const flatList = useMemo(() => {
    const items: CommandItem[] = [];
    for (const cat of ['navigation', 'actions', 'settings']) {
      if (grouped[cat]) items.push(...grouped[cat]);
    }
    return items;
  }, [grouped]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selected index whenever search query changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Keyboard nav
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

  // Scroll active item into view
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
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)', zIndex: 200,
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: '15%', left: '50%',
              transform: 'translateX(-50%)',
              width: '580px', maxWidth: '90vw',
              background: 'rgba(11,14,20,0.98)',
              backdropFilter: 'blur(24px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.05)',
              overflow: 'hidden',
              zIndex: 201,
            }}
          >
            {/* Search Input */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <Search size={18} style={{ color: '#475569', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif",
                }}
              />
              <div style={{
                padding: '3px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748B', fontSize: '0.65rem', fontFamily: 'monospace',
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
                  padding: '40px', textAlign: 'center', color: '#475569',
                }}>
                  <Search size={30} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.85rem' }}>No results found for "{query}"</p>
                </div>
              ) : (
                Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div style={{
                      padding: '8px 12px 6px',
                      fontSize: '0.65rem', fontWeight: 600, color: '#475569',
                      fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      {CATEGORY_LABELS[cat] || cat}
                    </div>
                    {items.map(cmd => {
                      const globalIdx = flatList.indexOf(cmd);
                      const isActive = globalIdx === selectedIndex;
                      const Icon = cmd.icon;
                      return (
                        <div
                          key={cmd.id}
                          data-active={isActive}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 12px', borderRadius: '10px',
                            background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                            border: isActive ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Icon size={15} style={{ color: isActive ? '#60A5FA' : '#64748B' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 500, color: isActive ? 'white' : '#CBD5E1' }}>
                              {cmd.label}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#475569' }}>
                              {cmd.description}
                            </div>
                          </div>
                          {isActive && <ArrowRight size={14} style={{ color: '#475569' }} />}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '10px 20px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', gap: '16px',
              fontSize: '0.65rem', color: '#475569', fontFamily: 'monospace',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Command size={10} /> <span>K to open</span>
              </span>
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
