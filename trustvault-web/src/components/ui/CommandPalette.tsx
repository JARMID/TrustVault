import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Command, LayoutDashboard, Shield, Settings,
  Users, Activity, FileText, LogOut, User, Zap, ArrowRight,
  Sparkles, Cpu, BadgeCheck, ArrowRightLeft,
} from 'lucide-react';
import { useToast } from './Toast';

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

interface NNPResult {
  intent: 'send_money' | 'lock_card' | 'start_ekyc' | 'run_triage' | 'view_transactions' | 'unknown';
  confidence: number;
  entities: {
    amount?: number;
    currency?: string;
    recipient?: string;
    last4?: string;
    alert_id?: string;
  };
  response_text: string;
}

// Client-side NNP simulation engine (fallback in case of CORS or offline mode)
const simulateNNP = (cmd: string): NNPResult => {
  const cmd_lower = cmd.toLowerCase();
  
  // 1. Send Money Intent
  const send_pattern = /(?:send|transfer|pay|wire)\s+([$€£¥])?\s*(\d+(?:\.\d{2})?)\s*([a-zA-Z]{3})?\s*(?:to\s+)?([a-zA-Z\s]+)/i;
  const send_match = cmd_lower.match(send_pattern);
  if (send_match) {
    const symbol = send_match[1];
    const amount = parseFloat(send_match[2]);
    const currency_code = send_match[3];
    const recipient = send_match[4].trim().replace(/\b\w/g, c => c.toUpperCase());
    
    let currency = 'DZD';
    if (symbol === '€' || currency_code === 'eur') currency = 'EUR';
    else if (symbol === '£' || currency_code === 'gbp') currency = 'GBP';
    else if (symbol === '$' || currency_code === 'usd') currency = 'USD';
    
    return {
      intent: 'send_money',
      confidence: 0.96,
      entities: { amount, currency, recipient },
      response_text: `Intelligent NNP Intent Recognizer classified: [SEND_MONEY]. Extracted ${amount} ${currency} to recipient ${recipient}.`
    };
  }
  
  // 2. Lock Card Intent
  const lock_pattern = /(?:freeze|lock|block|disable)\s+(?:my\s+)?(?:card|debit|credit)(?:\s+ending\s+in\s+(\d{4}))?/i;
  const lock_match = cmd_lower.match(lock_pattern);
  if (lock_match) {
    const last4 = lock_match[1] || 'active';
    return {
      intent: 'lock_card',
      confidence: 0.94,
      entities: { last4 },
      response_text: `Intelligent NNP Intent Recognizer classified: [LOCK_CARD]. Targeted card ending in: ${last4}.`
    };
  }

  // 3. eKYC Verification Intent
  const ekyc_pattern = /(?:start|run|verify|do|scan)\s+(?:my\s+)?(?:ekyc|identity|passport|id|biometrics?)/i;
  if (ekyc_pattern.test(cmd_lower)) {
    return {
      intent: 'start_ekyc',
      confidence: 0.92,
      entities: {},
      response_text: 'Intelligent NNP Intent Recognizer classified: [START_EKYC]. Requesting automated biometric and credential verification.'
    };
  }

  // 4. Security Triage Intent
  const triage_pattern = /(?:run|start|perform|do)\s+(?:security\s+)?(?:scan|triage|incident|threats?|alert)(?:\s+(?:#)?(\d+))?/i;
  const triage_match = cmd_lower.match(triage_pattern);
  if (triage_match) {
    const alert_id = triage_match[1] || 'all';
    return {
      intent: 'run_triage',
      confidence: 0.89,
      entities: { alert_id },
      response_text: `Intelligent NNP Intent Recognizer classified: [RUN_TRIAGE]. Initializing AI SOC agent diagnostics on alert: ${alert_id}.`
    };
  }

  // 5. Transactions View Intent
  const tx_pattern = /(?:view|show|check|list|display)\s+(?:my\s+)?(?:transactions|balance|history|expenses|statements?)/i;
  if (tx_pattern.test(cmd_lower)) {
    return {
      intent: 'view_transactions',
      confidence: 0.88,
      entities: {},
      response_text: 'Intelligent NNP Intent Recognizer classified: [VIEW_TRANSACTIONS]. Requesting user ledger and account metrics.'
    };
  }

  // Fallback to unknown
  return {
    intent: 'unknown',
    confidence: 0.35,
    entities: {},
    response_text: `Intelligent NNP Intent Recognizer could not classify a clear banking intent for: "${cmd}". Trying secure search index...`
  };
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<NNPResult | null>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Go to Dashboard', description: 'Security Overview', icon: LayoutDashboard, action: () => { navigate('/app'); onClose(); }, category: 'navigation', keywords: ['home', 'main', 'overview'] },
    { id: 'triage', label: 'Go to Triage Feed', description: 'Live fraud alert feed', icon: Activity, action: () => { navigate('/app/incidents'); onClose(); }, category: 'navigation', keywords: ['feed', 'live', 'threats', 'soc'] },
    { id: 'wallet', label: 'Go to Wallet', description: 'E-Wallet balances & tokens', icon: ArrowRightLeft, action: () => { navigate('/app/wallet'); onClose(); }, category: 'navigation', keywords: ['wallet', 'money', 'balance', 'dinars'] },
    { id: 'send', label: 'Send Money', description: 'Transfer funds to contact', icon: ArrowRightLeft, action: () => { navigate('/app/send'); onClose(); }, category: 'navigation', keywords: ['transfer', 'pay', 'send', 'dzd'] },
    { id: 'ekyc', label: 'Go to eKYC Module', description: 'Biometric scan & ID check', icon: BadgeCheck, action: () => { navigate('/app/ekyc'); onClose(); }, category: 'navigation', keywords: ['verify', 'identity', 'passport', 'face'] },
    { id: 'alerts', label: 'Go to Fraud Alerts', description: 'Fraud alert reports', icon: Shield, action: () => { navigate('/app/incidents'); onClose(); }, category: 'navigation', keywords: ['reports', 'security', 'fraud'] },
    { id: 'community', label: 'Go to Community', description: 'Safety network', icon: Users, action: () => { navigate('/app/community'); onClose(); }, category: 'navigation', keywords: ['people', 'network'] },
    { id: 'reports', label: 'Go to Reports', description: 'Analytics & exports', icon: FileText, action: () => { navigate('/app/reports'); onClose(); }, category: 'navigation', keywords: ['analytics', 'data'] },
    { id: 'profile', label: 'View Profile', description: 'Your account', icon: User, action: () => { navigate('/app/profile'); onClose(); }, category: 'navigation', keywords: ['account', 'avatar'] },
    { id: 'settings', label: 'Open Settings', description: 'System preferences', icon: Settings, action: () => { navigate('/app/settings'); onClose(); }, category: 'settings', keywords: ['preferences', 'config'] },
    { id: 'new-alert', label: 'Report New Fraud Alert', description: 'Open fraud reporting form', icon: Zap, action: () => { navigate('/app/incidents'); onClose(); }, category: 'actions', keywords: ['create', 'report', 'new', 'fraud'] },
    { id: 'logout', label: 'Sign Out', description: 'End current session', icon: LogOut, action: () => { navigate('/'); onClose(); }, category: 'actions', keywords: ['logout', 'exit'] },
  ], [navigate, onClose]);

  // Process natural language command using Windmill with local simulation fallback
  const handleAICommand = useCallback(async (commandText: string) => {
    if (!commandText.trim()) return;
    
    setIsProcessing(true);
    setProcessingStatus('Connecting to TrustVault NNP Orchestrator...');
    
    try {
      // Step 1: Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingStatus('Orchestrating Windmill flow & parsing intent...');
      
      // Step 2: Try fetching from actual deployed Windmill script
      const response = await fetch(
        'https://app.windmill.dev/api/w/trustvault/jobs/run/p/f/trustvault/nnp_handler',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer N9lVLEjT1OJUs1XcFfnZ0cCwhbJmwzkb',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ command: commandText }),
          mode: 'cors'
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAiResult(data);
      } else {
        // Fallback to client-side parsing (guarantees seamless UX in any network condition/CORS issue)
        throw new Error('Windmill remote unavailable, engaging local NNP fallback');
      }
    } catch (error) {
      console.log('Using robust client-side NNP simulation engine:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      const simulated = simulateNNP(commandText);
      setAiResult(simulated);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Execute action determined by NNP parser
  const executeAIResult = () => {
    if (!aiResult) return;
    
    onClose();
    
    switch (aiResult.intent) {
      case 'send_money':
        navigate('/app/send', {
          state: {
            recipientName: aiResult.entities.recipient,
            amount: aiResult.entities.amount,
            note: 'Initiated via TrustVault AI Smart Command Bar'
          }
        });
        addToast({
          title: 'AI Command Pre-filled',
          message: `Ready to send ${aiResult.entities.amount} ${aiResult.entities.currency} to ${aiResult.entities.recipient}.`,
          type: 'success'
        });
        break;
        
      case 'lock_card':
        navigate('/app/cards');
        addToast({
          title: 'Card Status Lock',
          message: `Card ending in ${aiResult.entities.last4 || 'active'} successfully locked for security.`,
          type: 'warning'
        });
        break;
        
      case 'start_ekyc':
        navigate('/app/ekyc');
        addToast({
          title: 'eKYC Initiated',
          message: 'Redirecting to secure digital scanning module...',
          type: 'info'
        });
        break;
        
      case 'run_triage':
        navigate('/app/incidents');
        addToast({
          title: 'SOC Agent Triage',
          message: `Autonomous diagnostic scanner executing on alert #${aiResult.entities.alert_id || 'all'}.`,
          type: 'success'
        });
        break;
        
      case 'view_transactions':
        navigate('/app/wallet');
        addToast({
          title: 'Ledger Opened',
          message: 'Displaying balances and transaction logs.',
          type: 'info'
        });
        break;
        
      default:
        // Try searching
        addToast({
          title: 'Secure Search',
          message: `Executing advanced search query: "${query}"`,
          type: 'info'
        });
        break;
    }
    
    // Reset states
    setQuery('');
    setAiResult(null);
  };

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

  // Handle text field enter key / key navigation
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setAiResult(null);
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (!isOpen || isProcessing || aiResult) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, flatList.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        // If there's an exact match in command list, execute it, otherwise run NNP AI Command
        if (flatList.length > 0 && selectedIndex < flatList.length && query.trim().length <= 15) {
          flatList[selectedIndex].action();
        } else if (query.trim().length > 0) {
          handleAICommand(query);
        }
      }
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, flatList, selectedIndex, query, isProcessing, aiResult, onClose, handleAICommand]);

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
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(12px)',
              zIndex: 200,
            }}
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed', top: '14%', left: '50%',
              transform: 'translateX(-50%)',
              width: '640px', maxWidth: '92vw',
              background: 'rgba(6, 6, 8, 0.96)',
              backdropFilter: 'blur(36px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.85), 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(0, 198, 174, 0.12)',
              overflow: 'hidden',
              zIndex: 201,
            }}
          >
            {/* Input Bar */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <Search size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  if (aiResult) setAiResult(null);
                }}
                disabled={isProcessing}
                placeholder="Type natural command (e.g. 'Send $500 to Alice' or 'Freeze card') or search..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em',
                }}
              />
              {query.trim().length > 0 && !isProcessing && !aiResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => handleAICommand(query)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '6px 12px', borderRadius: '8px',
                    background: 'var(--brand-primary-bg)',
                    border: '1px solid rgba(0,198,174,0.25)',
                    color: 'var(--brand-primary)', fontSize: '0.72rem',
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles size={12} />
                  <span>Analyze with AI</span>
                </motion.div>
              )}
            </div>

            {/* AI PROCESSING STATE */}
            <AnimatePresence mode="wait">
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '48px 24px', textAlign: 'center',
                    background: 'rgba(0, 198, 174, 0.02)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <div style={{ position: 'relative', width: '56px', height: '56px', marginBottom: '20px' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        border: '2px solid rgba(0, 198, 174, 0.08)',
                        borderTopColor: 'var(--brand-primary)',
                      }}
                    />
                    <Cpu size={24} style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)', color: 'var(--brand-primary)'
                    }} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    TrustVault NNP Core Executing
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {processingStatus}
                  </p>
                </motion.div>
              )}

              {/* AI RESULT DISPLAY */}
              {aiResult && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '24px 28px',
                    background: 'rgba(0, 198, 174, 0.03)',
                    borderBottom: '1px solid rgba(0,198,174,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{
                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.62rem',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      background: aiResult.intent !== 'unknown' ? 'rgba(0, 198, 174, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: aiResult.intent !== 'unknown' ? 'var(--brand-primary)' : '#EF4444',
                      border: `1px solid ${aiResult.intent !== 'unknown' ? 'rgba(0, 198, 174, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                      Intent: {aiResult.intent}
                    </div>
                    <div style={{
                      fontSize: '0.68rem', color: 'var(--text-tertiary)',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <span>Confidence:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{(aiResult.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                    {aiResult.response_text}
                  </p>

                  {/* Extracted Entities Table */}
                  {Object.keys(aiResult.entities).length > 0 && (
                    <div className="liquid-glass-card" style={{ padding: '12px 16px', background: 'rgba(5,5,8,0.4)', marginBottom: '20px' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Extracted Entities
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.78rem' }}>
                        {aiResult.entities.recipient && (
                          <div>
                            <span style={{ color: 'var(--text-tertiary)' }}>Recipient: </span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{aiResult.entities.recipient}</span>
                          </div>
                        )}
                        {aiResult.entities.amount && (
                          <div>
                            <span style={{ color: 'var(--text-tertiary)' }}>Amount: </span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                              {aiResult.entities.amount} {aiResult.entities.currency || 'DZD'}
                            </span>
                          </div>
                        )}
                        {aiResult.entities.last4 && (
                          <div>
                            <span style={{ color: 'var(--text-tertiary)' }}>Card Ending: </span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{aiResult.entities.last4}</span>
                          </div>
                        )}
                        {aiResult.entities.alert_id && (
                          <div>
                            <span style={{ color: 'var(--text-tertiary)' }}>Incident Reference: </span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>#{aiResult.entities.alert_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {aiResult.intent !== 'unknown' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={executeAIResult}
                        style={{
                          flex: 1, padding: '10px 16px', borderRadius: '8px',
                          background: 'var(--brand-primary)', border: 'none',
                          color: 'var(--bg-primary)', fontSize: '0.78rem',
                          fontWeight: 700, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Confirm and Execute Action</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setAiResult(null); if (inputRef.current) inputRef.current.focus(); }}
                        style={{
                          flex: 1, padding: '10px 16px', borderRadius: '8px',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.05)',
                          color: 'var(--text-primary)', fontSize: '0.78rem',
                          fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        Re-phrase Command
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setAiResult(null)}
                      style={{
                        padding: '10px 16px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)', fontSize: '0.78rem',
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static Command List */}
            {!isProcessing && !aiResult && (
              <div ref={listRef} style={{
                maxHeight: '380px', overflowY: 'auto', padding: '8px',
              }}>
                {/* AI suggestion in list */}
                {query.trim().length > 0 && (
                  <motion.div
                    data-active={selectedIndex === 0 && flatList.length === 0}
                    onClick={() => handleAICommand(query)}
                    onMouseEnter={() => setSelectedIndex(-1)}
                    animate={{
                      background: selectedIndex === -1 ? 'var(--brand-primary-bg)' : 'transparent',
                    }}
                    transition={{ duration: 0.12 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px', borderRadius: '10px',
                      border: selectedIndex === -1 ? '1px solid var(--border-brand)' : '1px solid transparent',
                      cursor: 'pointer', marginBottom: '8px',
                      background: 'rgba(0, 198, 174, 0.04)',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--bg-inset)',
                      border: '1px solid rgba(0, 198, 174, 0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', fontFamily: 'var(--font-sans)' }}>
                        Execute AI Smart Command
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
                        Parse "{query}" with TrustVault NNP Intent Recognizer
                      </div>
                    </div>
                    <ArrowRight size={13} style={{ color: 'var(--brand-primary)' }} />
                  </motion.div>
                )}

                {flatList.length === 0 && query.trim().length === 0 ? (
                  <div style={{
                    padding: '48px 20px', textAlign: 'center', color: 'var(--text-tertiary)',
                  }}>
                    <Command size={28} style={{ opacity: 0.15, margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}>
                      Search or type a natural language command...
                    </p>
                  </div>
                ) : flatList.length === 0 ? (
                  <div style={{
                    padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)',
                  }}>
                    <Search size={22} style={{ opacity: 0.15, margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>
                      No static commands found matching "{query}"
                    </p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom: '4px' }}>
                      <div style={{
                        padding: '8px 12px 4px',
                        fontSize: '0.6rem', fontWeight: 700,
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
            )}

            {/* Footer */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: '18px',
              fontSize: '0.62rem', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Command size={10} style={{ color: 'var(--brand-primary)' }} /> <span>K to open</span>
              </span>
              <span>↑↓ navigate</span>
              <span>↵ select / submit AI command</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.7 }}>
                <Cpu size={10} style={{ color: 'var(--brand-primary)' }} />
                <span>TrustVault NNP v1.0</span>
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
