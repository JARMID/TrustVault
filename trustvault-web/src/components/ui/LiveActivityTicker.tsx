import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { InfiniteMarquee } from './InfiniteMarquee';
import { ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

const liveTransactions = [
  { id: 1, name: 'Spotify Premium', amount: '-$14.99', type: 'out', time: 'Just now' },
  { id: 2, name: 'Inbound Wire Transfer', amount: '+$14,500.00', type: 'in', time: '2s ago' },
  { id: 3, name: 'AWS Cloud Services', amount: '-$420.50', type: 'out', time: '12s ago' },
  { id: 4, name: 'Uber Technologies', amount: '-$24.00', type: 'out', time: '45s ago' },
  { id: 5, name: 'Salary Deposit', amount: '+$8,250.00', type: 'in', time: '1m ago' },
  { id: 6, name: 'Apple Store', amount: '-$1,299.00', type: 'out', time: '2m ago' },
];

export const LiveActivityTicker: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#020617' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="w-full border-y overflow-hidden flex items-center relative" style={{ background: bgColor, borderColor, height: '60px' }}>
      
      {/* Left fixed section: Live Pulse */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-6 border-r backdrop-blur-md" 
           style={{ background: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)', borderColor }}>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-500" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: textColor }}>
            LIVE NETWORK
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
        </div>
      </div>

      {/* Marquee area */}
      <div className="flex-1 ml-[180px] h-full flex items-center">
        <InfiniteMarquee speed={40} direction="left" pauseOnHover={true}>
          <div className="flex items-center gap-8 px-4 h-full">
            {liveTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 whitespace-nowrap">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {tx.type === 'in' ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium" style={{ color: textColor }}>{tx.name}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: tx.type === 'in' ? '#10B981' : textColor }}>{tx.amount}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-mono" style={{ color: textMuted }}>{tx.time}</span>
                </div>
                {/* Separator dot */}
                <div className="w-1 h-1 rounded-full opacity-20 ml-8" style={{ background: textColor }} />
              </div>
            ))}
          </div>
        </InfiniteMarquee>
      </div>

      {/* Right fixed section: Stats */}
      <div className="absolute right-0 top-0 bottom-0 z-10 hidden md:flex items-center px-6 border-l backdrop-blur-md" 
           style={{ background: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(248, 250, 252, 0.8)', borderColor }}>
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase" style={{ color: textMuted }}>
          <div><span style={{ color: textColor, fontWeight: 'bold' }}>248,315</span> TX/HR</div>
          <div><span style={{ color: textColor, fontWeight: 'bold' }}>12</span> MS LATENCY</div>
        </div>
      </div>

    </div>
  );
};
