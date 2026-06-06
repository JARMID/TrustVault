import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Plus, Snowflake, Zap, Shield,
  Wifi, AlertTriangle, Monitor, RotateCcw, MapPin, Gamepad2, Film
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useWallet } from '../hooks/useWallet';
import type { DbVirtualCard } from '../types/database';

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => (
  <button
    onClick={disabled ? undefined : onChange}
    className={`w-10 h-6 rounded-full p-1 transition-colors relative ${enabled ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-strong)]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <motion.div
      animate={{ x: enabled ? 16 : 0 }}
      className="w-4 h-4 rounded-full bg-white shadow-sm"
    />
  </button>
);

const CardVisual: React.FC<{ card: DbVirtualCard; isFlipped: boolean; onClick: () => void }> = ({ card, isFlipped, onClick }) => {
  const isFrozen = card.status === 'frozen';
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const rotateY = ((x / rect.width) - 0.5) * 30;
    const rotateX = ((y / rect.height) - 0.5) * -30;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };
  
  return (
    <div 
      className="perspective-1000 w-full max-w-[380px] h-[240px] mx-auto cursor-pointer group" 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ 
          rotateY: isFlipped ? 180 + tilt.y : tilt.y,
          rotateX: tilt.x
        }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300 border border-[var(--border-subtle)] ${isFrozen ? 'bg-[var(--bg-inset)] grayscale' : 'group-hover:border-[#00C6AE]/60'}`}
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'translateZ(1px)',
            backgroundImage: !isFrozen ? 'url(/carbon_fiber.png)' : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: isFrozen ? '' : '#0a0a0a'
          }}
        >
          {/* Metallic Texture & Grain */}
          {!isFrozen && (
            <>
              {/* Holographic foil overlay that moves with tilt */}
              <motion.div 
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60"
                style={{ 
                  backgroundImage: 'url(/holographic_foil.png)',
                  backgroundSize: '150% 150%',
                }}
                animate={{
                  backgroundPosition: `${50 + tilt.y * 2}% ${50 - tilt.x * 2}%`
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
              />
              {/* Micro-mesh pattern */}
              <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
              {/* Dynamic Glare mapping to mouse tilt */}
              <motion.div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-70"
                animate={{
                  background: `radial-gradient(circle 350px at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)`
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
              />
              {/* Accent corner glow */}
              <div className="absolute -top-[50%] -right-[20%] w-[300px] h-[300px] bg-[#00C6AE] opacity-20 blur-[60px] rounded-full pointer-events-none" />
            </>
          )}
          
          <div className="relative z-10 flex justify-between items-start" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex flex-col">
              <span className="text-[1.1rem] font-black text-white tracking-widest flex items-center gap-2">
                <img src="/vault_logo_transparent.png" alt="TV" className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" onError={(e) => e.currentTarget.style.display = 'none'} />
                TRUSTVAULT
              </span>
              <span className="text-[0.6rem] font-bold text-[#00C6AE] uppercase tracking-[0.2em] mt-1 opacity-90">{card.label || 'Virtual Card'}</span>
            </div>
            
            <div className="flex gap-2 items-center">
              {isFrozen && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] backdrop-blur-md shadow-inner">
                  <Snowflake size={12} /> FROZEN
                </div>
              )}
              <Wifi size={24} className="text-white/90 transform rotate-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
          
          <div className="relative z-10 mt-4 flex flex-col justify-end flex-1" style={{ transform: 'translateZ(30px)' }}>
            {/* Highly Realistic Metallic EMV Chip */}
            <div className="w-[44px] h-[34px] rounded-md bg-gradient-to-br from-[#E6C27A] via-[#FFE4A0] to-[#B38D40] shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-[#FFE4A0]/60 relative overflow-hidden mb-4 ml-1">
               {/* Chip Lines */}
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#8A6A27]/50 shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
               <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-[#8A6A27]/50 shadow-[1px_0_0_rgba(255,255,255,0.4)]" />
               <div className="absolute right-1/3 top-0 bottom-0 w-[1px] bg-[#8A6A27]/50 shadow-[1px_0_0_rgba(255,255,255,0.4)]" />
               <div className="absolute inset-[6px] border border-[#8A6A27]/40 rounded-sm" />
               <div className="absolute inset-[10px] border border-[#8A6A27]/30 rounded-[2px]" />
               {/* Shimmer sweep */}
               <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_4s_infinite_linear]" />
            </div>
            
            <div className="text-[1.4rem] font-mono tracking-[0.18em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium flex gap-4">
              <span className="opacity-50 tracking-[0.25em]">••••</span> 
              <span className="opacity-50 tracking-[0.25em]">••••</span> 
              <span className="opacity-50 tracking-[0.25em]">••••</span> 
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">{card.last4}</span>
            </div>
          </div>
          
          <div className="relative z-10 flex justify-between items-end mt-4" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex gap-6">
              <div>
                <div className="text-[0.55rem] text-white/60 uppercase tracking-[0.15em] mb-0.5">Valid Thru</div>
                <div className="text-[0.95rem] font-bold text-white font-mono drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-wider">
                  {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[0.55rem] text-white/60 uppercase tracking-[0.15em] mb-0.5">Cardholder</div>
                <div className="text-[0.85rem] font-bold text-white uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-wider">
                  TRUSTVAULT CLIENT
                </div>
              </div>
            </div>
            
            {/* Faux Holographic Brand Logo */}
            <div className="text-[1.6rem] font-black italic text-white tracking-tighter relative group-hover:scale-105 transition-transform duration-300">
              <span className="absolute inset-0 blur-[4px] opacity-80 bg-gradient-to-r from-[#00C6AE] to-[#0072FF] text-transparent bg-clip-text mix-blend-screen">{card.brand?.toUpperCase()}</span>
              <span className="relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">{card.brand?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg) translateZ(1px)',
            backgroundImage: 'url(/carbon_fiber.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0a0a0a'
          }}
        >
          {/* Magstripe */}
          <div className="w-full h-12 bg-black/90 mt-6 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.6)]" />
          
          <div className="px-6 py-5 flex-1 flex flex-col justify-center relative z-10">
            {/* Signature & CVV strip */}
            <div className="bg-[#E2E8F0] rounded-sm p-2 flex justify-between items-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
              <span className="font-mono text-xs tracking-widest text-black/60 relative z-10 italic">Authorized Signature</span>
              <div className="bg-[var(--bg-surface)] px-3 py-1 rounded shadow-sm border border-[var(--border-subtle)] relative z-10 flex items-center justify-center min-w-[40px]">
                <span className="font-mono text-sm font-bold text-[#0F172A]">{(card as any).cvv || 'CVV'}</span>
              </div>
            </div>
            
            <p className="text-[8px] text-[var(--text-tertiary)] leading-relaxed text-justify opacity-80 uppercase tracking-wide">
              This card is property of TrustVault Bank. By using this card, you agree to the Cardholder Agreement. If found, please return to TrustVault Security Operations Center. Do not share your CVV or PIN with anyone. 
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CardsPage: React.FC = () => {
  const { addToast } = useToast();
  const { cards, freezeCard, unfreezeCard, isLoading } = useWallet();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [spendLimit, setSpendLimit] = useState(500000); // Default local UI state since DbVirtualCard may not have spending_limit locally yet

  // Ensure index bounds
  const validIdx = selectedIdx < cards.length ? selectedIdx : 0;
  const selectedCard = cards[validIdx];
  const isFrozen = selectedCard?.status === 'frozen';

  const [controls, setControls] = useState({
    online: true,
    atm: true,
    gambling: false,
    entertainment: true,
    algeriaOnly: true
  });

  // Reset states when switching cards
  const handleCardSwitch = (idx: number) => {
    setSelectedIdx(idx);
    setIsFlipped(false);
    setSpendLimit(500000); // Default local limit
  };

  const toggleControl = (key: keyof typeof controls) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
    addToast({
      type: 'success',
      title: 'Security Updated',
      message: 'Card controls updated securely.'
    });
  };

  const toggleFreeze = async () => {
    if (!selectedCard) return;
    if (isFrozen) {
      await unfreezeCard(selectedCard.id);
    } else {
      await freezeCard(selectedCard.id);
    }
    setIsFlipped(false);
    addToast({
      type: isFrozen ? 'success' : 'warning',
      title: isFrozen ? 'Card Unfrozen' : 'Card Frozen',
      message: isFrozen ? 'Your card is now active.' : 'Your card has been temporarily locked.'
    });
  };

  if (isLoading) {
    return <div className="text-[var(--text-primary)]">Loading cards...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto pb-12 relative z-10 text-center">
        <h2 className="text-[var(--text-primary)] text-2xl mb-4">No Cards Found</h2>
        <button className="btn btn-primary" onClick={() => addToast({ type: 'info', title: 'Card Creation', message: 'Generating virtual card...' })}>Generate Virtual Card</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12 relative z-10 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-h2 text-[var(--text-primary)]">Cards & Access</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage 3D secure virtual and physical cards.</p>
        </div>
        <button className="btn px-4 py-2 rounded-xl font-bold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 flex items-center gap-2 transition-all shadow-md" onClick={() => addToast({ type: 'info', title: 'Card Creation', message: 'Generating virtual card...' })}>
          <Plus size={16} /> New Card
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[var(--bg-inset)] p-1.5 rounded-xl border border-[var(--border-subtle)] overflow-x-auto w-fit">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardSwitch(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${idx === selectedIdx ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'}`}
          >
            <CreditCard size={16} />
            {card.label}
            {card.status === 'frozen' && <Snowflake size={12} className="text-[var(--text-tertiary)]" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Card Visual & Quick Actions */}
        <div className="flex flex-col gap-8 items-center lg:items-start">
          
          <div className="w-full relative">
            <CardVisual 
              card={selectedCard} 
              isFlipped={isFlipped} 
              onClick={() => setIsFlipped(!isFlipped)} 
            />
            <div className="text-center mt-4 text-xs text-[var(--text-tertiary)] flex items-center justify-center gap-2">
              <RotateCcw size={14} /> Click card to reveal {isFlipped ? 'front' : 'CVV'}
            </div>
          </div>

          <div className="w-full liquid-glass-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Shield size={18} className="text-[var(--brand-primary)]" /> Quick Controls
            </h3>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={toggleFreeze}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all border ${isFrozen ? 'bg-[var(--brand-primary-bg)] border-[var(--brand-primary-glow)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white' : 'bg-[var(--bg-inset)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'}`}
              >
                {isFrozen ? <Zap size={16} /> : <Snowflake size={16} />}
                {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </button>
            </div>

            <div className="mb-2 flex justify-between items-end">
              <label className="text-sm font-bold text-[var(--text-primary)]">Monthly Spending Limit</label>
              <span className="text-sm font-mono text-[var(--brand-primary)] font-bold">{spendLimit.toLocaleString()} DZD</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">You have spent 0 DZD this month.</p>
            
            <input 
              type="range" 
              min="10000" 
              max="1000000" 
              step="10000"
              value={spendLimit}
              onChange={(e) => setSpendLimit(Number(e.target.value))}
              disabled={isFrozen}
              className="w-full h-2 bg-[var(--bg-inset)] rounded-lg appearance-none cursor-pointer accent-[var(--brand-primary)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2 font-mono">
              <span>0</span>
              <span>1M</span>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Security Controls */}
        <div className="flex flex-col gap-6">
          <div className={`liquid-glass-card p-6 transition-all ${isFrozen ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Security & Usage Rules</h3>
            
            <div className="space-y-6">
              {/* Geolocation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-inset)] flex items-center justify-center text-[var(--text-secondary)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Country Restriction</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Block transactions originating outside Algeria.</p>
                  </div>
                </div>
                <Toggle enabled={controls.algeriaOnly} onChange={() => toggleControl('algeriaOnly')} />
              </div>

              {/* Online */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-inset)] flex items-center justify-center text-[var(--text-secondary)]">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Online Purchases</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Allow e-commerce and internet transactions.</p>
                  </div>
                </div>
                <Toggle enabled={controls.online} onChange={() => toggleControl('online')} />
              </div>

              {/* ATM */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-inset)] flex items-center justify-center text-[var(--text-secondary)]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">ATM Withdrawals</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Allow cash withdrawals at physical ATMs.</p>
                  </div>
                </div>
                <Toggle enabled={controls.atm} onChange={() => toggleControl('atm')} />
              </div>

              <div className="w-full h-px bg-[var(--border-subtle)] my-2" />

              {/* Categories */}
              <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-4 mb-4">Merchant Categories</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Gamepad2 size={16} className="text-[var(--text-tertiary)]" />
                  <span className="text-sm text-[var(--text-primary)]">Gambling & Betting</span>
                </div>
                <Toggle enabled={controls.gambling} onChange={() => toggleControl('gambling')} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Film size={16} className="text-[var(--text-tertiary)]" />
                  <span className="text-sm text-[var(--text-primary)]">Entertainment & Subscriptions</span>
                </div>
                <Toggle enabled={controls.entertainment} onChange={() => toggleControl('entertainment')} />
              </div>

            </div>
          </div>

          {/* AI Notice */}
          <div className="bg-[var(--brand-primary-bg)] border border-[var(--brand-primary-glow)] rounded-2xl p-5 flex gap-4 items-start">
            <AlertTriangle size={20} className="text-[var(--brand-primary)] flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[var(--brand-primary)] mb-1">AI Oversight Active</h4>
              <p className="text-xs text-[var(--text-secondary)]">TrustVault AI is actively monitoring this card. Suspicious velocity or impossible travel will automatically trigger a freeze and send an alert to your SOC feed.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CardsPage;
