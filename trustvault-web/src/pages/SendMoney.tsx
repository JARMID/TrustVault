import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Send, ArrowLeft, Search, Star, Clock, CheckCircle, Users,
  ChevronRight, Shield, Lock, Fingerprint, Zap,
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useContacts } from '../hooks/useContacts';
import type { DbContact } from '../types/database';

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

/* ── Contact Avatar ── */
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${hue + 30}, 65%, 42%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: 'white', letterSpacing: '0.02em',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      border: '2px solid white',
    }}>
      {initials}
    </div>
  );
};

const SendMoneyPage: React.FC = () => {
  const { wallets, primaryWallet } = useWallet();
  const { contacts: allContacts } = useContacts();
  const location = useLocation();
  
  const [step, setStep] = useState<Step>('recipient');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<DbContact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(primaryWallet?.id ?? '');
  const [isSending, setIsSending] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  // Pre-fill fields if redirected from AI Smart Command Bar / Command Palette
  useEffect(() => {
    if (location.state && allContacts.length > 0) {
      const state = location.state as {
        recipientName?: string;
        amount?: number;
        note?: string;
      };
      
      const timer = setTimeout(() => {
        if (state.recipientName) {
          const matchingContact = allContacts.find(c => 
            c.name.toLowerCase().includes(state.recipientName!.toLowerCase())
          );
          if (matchingContact) {
            setSelectedContact(matchingContact);
            if (state.amount) {
              setAmount(String(state.amount));
              setStep('confirm');
            } else {
              setStep('amount');
            }
          }
        }
        
        if (state.note) {
          setNote(state.note);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [location.state, allContacts]);

  const contacts = allContacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const favorites = contacts.filter((c) => c.is_favorite);
  const recent = contacts.sort((a, b) => new Date(b.last_transfer_at ?? 0).getTime() - new Date(a.last_transfer_at ?? 0).getTime()).slice(0, 5);
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);
  const numAmount = parseFloat(amount) || 0;

  const handleSend = () => {
    setIsSending(true);
    setTxnRef(`TXN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setTimeout(() => {
      setIsSending(false);
      setStep('success');
    }, 2000);
  };

  const reset = () => {
    setStep('recipient');
    setSelectedContact(null);
    setAmount('');
    setNote('');
    setTxnRef('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[640px] mx-auto w-full pt-8">
      {/* Back nav */}
      {step !== 'recipient' && step !== 'success' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setStep(step === 'confirm' ? 'amount' : 'recipient')}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm mb-6 transition-colors bg-[var(--bg-surface)] px-4 py-2 rounded-xl border border-[var(--border-subtle)] shadow-sm w-fit"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {/* â”€â”€ STEP 1: Recipient â”€â”€ */}
        {step === 'recipient' && (
          <motion.div key="recipient" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Send Money</h1>
            <p className="text-[0.95rem] text-[var(--text-secondary)] font-medium mb-8">Choose a recipient to send funds to securely.</p>

            {/* Search */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl flex items-center gap-3 mb-6 px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#00C6AE]/30 focus-within:border-[#00C6AE] transition-all">
              <Search size={18} className="text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-[0.95rem] font-medium outline-none"
              />
            </div>

            {/* Favorites */}
            {favorites.length > 0 && !search && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Favorites</span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {favorites.map((c) => (
                    <motion.button
                      key={c.id}
                      whileHover={{ y: -3, scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedContact(c); setStep('amount'); }}
                      className="flex flex-col items-center gap-2 min-w-[72px]"
                    >
                      <Avatar name={c.name} size={56} />
                      <span className="text-[0.8rem] font-bold text-[var(--text-primary)] whitespace-nowrap">
                        {c.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent / Search Results */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {search ? <Users size={14} className="text-[var(--text-tertiary)]" /> : <Clock size={14} className="text-[var(--text-tertiary)]" />}
                <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                  {search ? `Results (${contacts.length})` : 'Recent'}
                </span>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl overflow-hidden">
                {(search ? contacts : recent).map((c, i, arr) => (
                  <motion.button
                    key={c.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedContact(c); setStep('amount'); }}
                    className={`flex items-center gap-4 w-full p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors text-left ${i < arr.length - 1 ? 'border-b border-[var(--border-white-5)]' : ''}`}
                  >
                    <Avatar name={c.name} />
                    <div className="flex-1">
                      <p className="text-[0.95rem] font-bold text-[var(--text-primary)]">{c.name}</p>
                      <p className="text-[0.8rem] font-medium text-[var(--text-secondary)]">{c.email}</p>
                    </div>
                    <ChevronRight size={18} className="text-[var(--text-tertiary)]" />
                  </motion.button>
                ))}
                {contacts.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm font-bold text-[var(--text-tertiary)]">No contacts found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* â”€â”€ STEP 2: Amount â”€â”€ */}
        {step === 'amount' && selectedContact && (
          <motion.div key="amount" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="text-center mb-8 flex flex-col items-center">
              <Avatar name={selectedContact.name} size={64} />
              <p className="text-xl font-extrabold text-[var(--text-primary)] mt-4">{selectedContact.name}</p>
              <p className="text-sm font-medium text-[var(--text-secondary)]">{selectedContact.email}</p>
            </div>

            {/* Amount Input */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl text-center p-8 mb-6">
              <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Amount</span>
              <div className="flex items-center justify-center gap-3 my-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent border-none text-[var(--text-primary)] outline-none text-6xl font-extrabold text-center w-48 font-mono placeholder-[var(--border-strong)]"
                />
                <span className="text-xl font-bold text-[var(--text-tertiary)] mt-4">DZD</span>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-3 justify-center mt-6">
                {[1000, 5000, 10000, 25000].map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAmount(String(v))}
                    className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors border ${
                      amount === String(v) 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    {v.toLocaleString()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wallet selector */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl mb-4 p-5">
              <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3 display-block">From</span>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full p-3 rounded-xl text-[0.95rem] font-bold bg-[var(--bg-inset)] text-[var(--text-primary)] border border-[var(--border-subtle)] outline-none cursor-pointer focus:ring-2 focus:ring-[#00C6AE]/30 focus:border-[#00C6AE]"
              >
                {wallets.filter((w) => w.status === 'active').map((w) => (
                  <option key={w.id} value={w.id}>{w.name} â€” {w.balance.toLocaleString()} {w.currency}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl mb-8 p-5">
              <span className="text-[0.75rem] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-3 display-block">Note (optional)</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full bg-transparent border-none text-[var(--text-primary)] outline-none text-[0.95rem] font-medium placeholder-[var(--text-tertiary)]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              disabled={numAmount <= 0 || (selectedWallet && numAmount > selectedWallet.balance)}
              onClick={() => setStep('confirm')}
              className={`w-full p-4 rounded-xl text-[0.95rem] font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                numAmount <= 0 || (selectedWallet && numAmount > selectedWallet.balance)
                  ? 'bg-[var(--border-strong)] text-[var(--text-tertiary)] cursor-not-allowed shadow-none'
                  : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 hover:shadow-lg'
              }`}
            >
              Continue <ChevronRight size={18} />
            </motion.button>
            {selectedWallet && numAmount > selectedWallet.balance && (
              <p className="text-sm font-bold text-red-500 text-center mt-3">Insufficient balance</p>
            )}
          </motion.div>
        )}

        {/* â”€â”€ STEP 3: Confirm â”€â”€ */}
        {step === 'confirm' && selectedContact && (
          <motion.div key="confirm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] text-center mb-8">Confirm Transfer</h2>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-3xl mb-8 p-8 flex flex-col items-center text-center">
              <Avatar name={selectedContact.name} size={64} />
              <p className="text-lg font-extrabold text-[var(--text-primary)] mt-3">{selectedContact.name}</p>
              
              <div className="mt-6 text-5xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
                {numAmount.toLocaleString()} <span className="text-xl text-[var(--text-tertiary)]">DZD</span>
              </div>
              
              {note && <p className="text-sm font-medium text-[var(--text-secondary)] mt-4 italic bg-[var(--bg-inset)] px-4 py-2 rounded-lg">"{note}"</p>}

              <div className="w-full h-px bg-[var(--border-strong)] my-8" />

              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">From</span>
                  <span className="text-sm font-extrabold text-[var(--text-primary)]">{selectedWallet?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--text-secondary)]">Fee</span>
                  <span className="text-sm font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Free</span>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex gap-3 justify-center mb-8">
              {[
                { icon: <Shield size={14} />, label: 'Protected' },
                { icon: <Lock size={14} />, label: 'Encrypted' },
                { icon: <Fingerprint size={14} />, label: 'Verified' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                  {b.icon} {b.label}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={isSending}
              className={`w-full p-4 rounded-xl text-[1rem] font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isSending ? 'bg-[var(--border-strong)] text-[var(--text-tertiary)] cursor-wait shadow-none' : 'bg-[#00C6AE] text-white hover:bg-[#00B09A] hover:shadow-[0_8px_20px_rgba(0,198,174,0.3)]'
              }`}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Zap size={18} />
                  </motion.div>
                  Processing...
                </div>
              ) : (
                <span className="flex items-center gap-2"><Send size={18} /> Send {numAmount.toLocaleString()} DZD</span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* â”€â”€ STEP 4: Success â”€â”€ */}
        {step === 'success' && selectedContact && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-sm"
            >
              <CheckCircle size={48} className="text-emerald-500" />
            </motion.div>

            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Transfer Successful!</h2>
            <p className="text-[0.95rem] font-medium text-[var(--text-secondary)] mb-8">
              <span className="font-bold text-[var(--text-primary)]">{numAmount.toLocaleString()} DZD</span> sent to <span className="font-bold text-[var(--text-primary)]">{selectedContact.name}</span>
            </p>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-2xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Reference</span>
                <span className="text-sm font-extrabold text-[var(--text-primary)] font-mono bg-[var(--bg-inset)] px-2 py-1 rounded">{txnRef}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[var(--text-secondary)]">Date</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.97 }} onClick={reset} className="flex-1 bg-[var(--text-primary)] text-[var(--bg-primary)] p-4 rounded-xl font-bold shadow-md hover:opacity-80 transition-opacity">
                Send Another
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] p-4 rounded-xl font-bold shadow-sm hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors">
                View Receipt
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SendMoneyPage;








