import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, ShieldAlert, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FORECAST_DATA = [
  { day: '01', balance: 145000, projected: 145000, min: 145000, max: 145000 },
  { day: '05', balance: 132000, projected: 132000, min: 130000, max: 135000 },
  { day: '10', balance: 115000, projected: 115000, min: 110000, max: 120000 },
  { day: '15', balance: null, projected: 145000, min: 135000, max: 155000 }, // Salary hits
  { day: '20', balance: null, projected: 128000, min: 115000, max: 140000 },
  { day: '25', balance: null, projected: 110000, min: 95000, max: 125000 },
  { day: '30', balance: null, projected: 95000, min: 75000, max: 115000 },
];



const SUBSCRIPTIONS = [
  { id: 1, name: 'Netflix Premium', amount: 1500, cycle: 'Monthly', lastCharged: '2 days ago', status: 'active', unused: false },
  { id: 2, name: 'Adobe Creative Cloud', amount: 4800, cycle: 'Monthly', lastCharged: '15 days ago', status: 'active', unused: true },
  { id: 3, name: 'Spotify Duo', amount: 850, cycle: 'Monthly', lastCharged: '22 days ago', status: 'active', unused: false },
];

const PredictiveAI: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto pb-12 relative z-10">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(138,43,226,0.1)] border border-[rgba(138,43,226,0.3)] flex items-center justify-center" style={{ color: '#8A2BE2' }}>
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-h2 gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #00C6AE, #8A2BE2)' }}>Predictive Intelligence</h1>
            <p className="text-sm text-[var(--text-secondary)]">AI-driven cash flow forecasting and spending anomaly detection.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Main Chart & Health */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Health Score & Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="liquid-glass-card p-6 flex items-center gap-6"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="var(--brand-primary)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: "213.5 251.2" }} // 85% of circumference
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">85</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Financial Health</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Your cash flow is stable. AI predicts you will end the month with a surplus.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="liquid-glass-card p-6 border-[rgba(138,43,226,0.3)]"
            >
              <div className="flex items-center gap-2 text-[rgba(138,43,226,1)] mb-4 font-bold text-sm uppercase tracking-widest">
                <Zap size={16} /> 30-Day Forecast
              </div>
              <div className="text-3xl font-mono text-[var(--text-primary)] mb-2">+12,400 <span className="text-lg text-[var(--text-tertiary)]">DZD</span></div>
              <p className="text-sm text-[var(--text-secondary)]">Projected savings by end of month based on current spending velocity.</p>
            </motion.div>
          </div>

          {/* Cash Flow Forecast Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="liquid-glass-card p-6 h-[400px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Cash Flow Prediction</h3>
                <p className="text-sm text-[var(--text-secondary)]">AI-modeled trajectory with confidence intervals</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-[var(--text-primary)]" /> <span className="text-xs text-[var(--text-tertiary)]">Actual</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-[rgba(138,43,226,1)]" /> <span className="text-xs text-[var(--text-tertiary)]">Projected</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[rgba(138,43,226,0.1)] border border-[rgba(138,43,226,0.3)]" /> <span className="text-xs text-[var(--text-tertiary)]">Confidence Band</span></div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '12px' }} 
                    itemStyle={{ color: 'white', fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px' }}
                  />
                  
                  {/* Confidence Band (Min to Max) */}
                  <Area type="monotone" dataKey="max" stroke="none" fill="url(#colorBand)" />
                  <Area type="monotone" dataKey="min" stroke="none" fill="var(--bg-surface)" />
                  
                  <Area type="monotone" dataKey="projected" stroke="#8A2BE2" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="balance" stroke="var(--text-primary)" strokeWidth={3} fill="none" activeDot={{ r: 6, fill: 'var(--text-primary)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* Right Col: Subscriptions & Insights */}
        <div className="flex flex-col gap-6">
          
          {/* AI Insights Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="liquid-glass-card p-0 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-inset)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Brain size={18} className="text-[var(--brand-primary)]" /> Intelligence Feed
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-accent-warning-bg border border-accent-warning-glow flex gap-3 items-start">
                <TrendingUp size={18} className="text-accent-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-medium mb-1">Weekend Spending Spike</p>
                  <p className="text-xs text-[var(--text-secondary)]">You're spending 40% more on weekends compared to last month. Major category: Dining.</p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors flex gap-3 items-start cursor-pointer">
                <AlertCircle size={18} className="text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-medium mb-1">Utility Bill Prediction</p>
                  <p className="text-xs text-[var(--text-secondary)]">Sonelgaz bill expected in 3 days. Estimated amount: ~6,500 DZD based on history.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Detector */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="liquid-glass-card p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Active Subscriptions</h3>
              <span className="text-xs px-2 py-1 bg-[var(--bg-inset)] rounded text-[var(--text-tertiary)]">Auto-Detected</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {SUBSCRIPTIONS.map(sub => (
                <div key={sub.id} className={`p-4 rounded-xl border flex flex-col gap-3 ${sub.unused ? 'bg-accent-danger-bg border-accent-danger-glow' : 'bg-[var(--bg-inset)] border-[var(--border-subtle)]'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-primary)] font-bold">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{sub.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Last: {sub.lastCharged}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-[var(--text-primary)]">{sub.amount} DZD</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] uppercase">{sub.cycle}</p>
                    </div>
                  </div>
                  
                  {sub.unused && (
                    <div className="mt-2 pt-3 border-t border-accent-danger/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-accent-danger font-medium">
                        <ShieldAlert size={14} /> Low usage detected
                      </div>
                      <button className="btn btn-danger py-1.5 px-3 text-xs">
                        Freeze Card
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default PredictiveAI;
