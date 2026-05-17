import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, ArrowLeft, Search, Star, Clock, CheckCircle, AlertCircle, Users,
  ChevronRight, Shield, Lock, Fingerprint, Zap,
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../components/ui/Toast';
import type { DbContact } from '../types/database';

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

const SendMoneyPage: React.FC = () => {
  const { wallets, primaryWallet } = useWallet();
  const { contacts: allContacts } = useContacts();
  const { addToast } = useToast();

  const [step, setStep] = useState<Step>('recipient');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<DbContact | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(primaryWallet?.id ?? '');
  const [isSending, setIsSending] = useState(false);

  const contacts = allContacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );
  const favorites = contacts.filter((c) => c.is_favorite);
  const recent = contacts.sort((a, b) => new Date(b.last_transfer_at ?? 0).getTime() - new Date(a.last_transfer_at ?? 0).getTime()).slice(0, 5);
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);
  const numAmount = parseFloat(amount) || 0;

  const handleSend = () => {
    setIsSending(true);
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
  };

  /* ── Contact Avatar ── */
  const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
    const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, hsl(${hue}, 65%, 40%), hsl(${hue + 30}, 65%, 25%))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 700, color: 'white', letterSpacing: '0.02em',
        border: '2px solid rgba(255,255,255,0.08)',
      }}>
        {initials}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Back nav */}
      {step !== 'recipient' && step !== 'success' && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setStep(step === 'confirm' ? 'amount' : 'recipient')}
          className="btn btn-ghost mb-4"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <ArrowLeft size={15} /> Back
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Recipient ── */}
        {step === 'recipient' && (
          <motion.div key="recipient" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h1 className="text-h1 mb-2">Send Money</h1>
            <p className="text-sm mb-6">Choose a recipient to send funds to</p>

            {/* Search */}
            <div className="glass-card flex items-center gap-3 mb-5" style={{ padding: '12px 18px' }}>
              <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            {/* Favorites */}
            {favorites.length > 0 && !search && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={13} style={{ color: '#F59E0B' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Favorites</span>
                </div>
                <div className="flex gap-4">
                  {favorites.map((c) => (
                    <motion.button
                      key={c.id}
                      whileHover={{ y: -3, scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedContact(c); setStep('amount'); }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
                      }}
                    >
                      <Avatar name={c.name} size={48} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {c.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent / Search Results */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {search ? <Users size={13} style={{ color: 'var(--text-tertiary)' }} /> : <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />}
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {search ? `Results (${contacts.length})` : 'Recent'}
                </span>
              </div>
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {(search ? contacts : recent).map((c, i, arr) => (
                  <motion.button
                    key={c.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedContact(c); setStep('amount'); }}
                    className="flex items-center gap-3"
                    style={{
                      width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      textAlign: 'left', transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Avatar name={c.name} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{c.email}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </motion.button>
                ))}
                {contacts.length === 0 && (
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>No contacts found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Amount ── */}
        {step === 'amount' && selectedContact && (
          <motion.div key="amount" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="text-center mb-8">
              <Avatar name={selectedContact.name} size={56} />
              <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '10px' }}>{selectedContact.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{selectedContact.email}</p>
            </div>

            {/* Amount Input */}
            <div className="glass-card text-center" style={{ padding: '32px 24px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount</span>
              <div className="flex items-center justify-center gap-2" style={{ margin: '12px 0' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none',
                    fontSize: '3rem', fontWeight: 800, textAlign: 'center', width: '200px', fontFamily: 'var(--font-mono)',
                  }}
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>DZD</span>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 justify-center mt-4">
                {[1000, 5000, 10000, 25000].map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAmount(String(v))}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                      background: amount === String(v) ? 'rgba(0,198,174,0.1)' : 'rgba(255,255,255,0.03)',
                      color: amount === String(v) ? '#00C6AE' : 'var(--text-secondary)',
                      border: `1px solid ${amount === String(v) ? 'rgba(0,198,174,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {v.toLocaleString()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wallet selector */}
            <div className="glass-card mb-4" style={{ padding: '16px 18px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>From</span>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)', outline: 'none', cursor: 'pointer',
                }}
              >
                {wallets.filter((w) => w.status === 'active').map((w) => (
                  <option key={w.id} value={w.id}>{w.name} — {w.balance.toLocaleString()} {w.currency}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="glass-card mb-6" style={{ padding: '16px 18px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>Note (optional)</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.82rem' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              disabled={numAmount <= 0 || (selectedWallet && numAmount > selectedWallet.balance)}
              onClick={() => setStep('confirm')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, opacity: numAmount <= 0 ? 0.4 : 1 }}
            >
              Continue <ChevronRight size={16} />
            </motion.button>
            {selectedWallet && numAmount > selectedWallet.balance && (
              <p style={{ fontSize: '0.72rem', color: '#EF4444', textAlign: 'center', marginTop: '8px' }}>Insufficient balance</p>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 'confirm' && selectedContact && (
          <motion.div key="confirm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <h2 className="text-h2 text-center mb-6">Confirm Transfer</h2>

            <div className="glass-card mb-6" style={{ padding: '24px', textAlign: 'center' }}>
              <Avatar name={selectedContact.name} size={56} />
              <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}>{selectedContact.name}</p>
              <div style={{ marginTop: '16px', fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {numAmount.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>DZD</span>
              </div>
              {note && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>"{note}"</p>}

              <div style={{ margin: '20px auto', width: '80%', height: '1px', background: 'var(--border-subtle)' }} />

              <div className="flex justify-between" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>From</span>
                <span style={{ fontWeight: 600 }}>{selectedWallet?.name}</span>
              </div>
              <div className="flex justify-between mt-2" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Fee</span>
                <span style={{ fontWeight: 600, color: '#34D399' }}>Free</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex gap-3 justify-center mb-6">
              {[
                { icon: <Shield size={12} />, label: 'Protected' },
                { icon: <Lock size={12} />, label: 'Encrypted' },
                { icon: <Fingerprint size={12} />, label: 'Verified' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1" style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600,
                  background: 'rgba(0,198,174,0.06)', color: '#00C6AE', border: '1px solid rgba(0,198,174,0.12)',
                }}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={isSending}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Zap size={16} />
                  </motion.div>
                  Processing...
                </div>
              ) : (
                <span className="flex items-center gap-2"><Send size={16} /> Send {numAmount.toLocaleString()} DZD</span>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 'success' && selectedContact && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              style={{
                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
                background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckCircle size={40} style={{ color: '#34D399' }} />
            </motion.div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Transfer Successful!</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {numAmount.toLocaleString()} DZD sent to {selectedContact.name}
            </p>

            <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div className="flex justify-between mb-2" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Reference</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>TXN-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Date</span>
                <span style={{ fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={reset} className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '12px' }}>
                Send Another
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} className="btn btn-ghost" style={{ flex: 1, padding: '12px', borderRadius: '12px' }}>
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
