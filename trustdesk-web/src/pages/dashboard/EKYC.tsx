import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Search, UserCheck, AlertTriangle, FileText, CheckCircle2, UserX } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const mockVerifications = [
  { id: 'KYC-8891', user: 'Aminata Diallo', type: 'Biometric + ID', status: 'verified', confidence: 99.8, time: '2 mins ago' },
  { id: 'KYC-8892', user: 'Karim Bouzid', type: 'Passport', status: 'pending', confidence: 85.2, time: '15 mins ago' },
  { id: 'KYC-8893', user: 'Sarah Connor', type: 'Face Match', status: 'rejected', confidence: 42.1, time: '1 hour ago', reason: 'Spoofing detected' },
  { id: 'KYC-8894', user: 'Omar Hassan', type: 'National ID', status: 'verified', confidence: 98.5, time: '2 hours ago' },
];

const mockTraffic = [
  { time: '00:00', verifications: 120 },
  { time: '04:00', verifications: 80 },
  { time: '08:00', verifications: 450 },
  { time: '12:00', verifications: 620 },
  { time: '16:00', verifications: 550 },
  { time: '20:00', verifications: 210 },
];

export default function EKYC() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Fingerprint className="text-blue-500" size={32} />
            eKYC & Bio-Identity
          </h1>
          <p className="text-slate-400 mt-2">Neural biometric analysis and automated identity verification.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 transition-colors w-64"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <FileText size={18} />
            Export Audit Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <UserCheck size={20} className="text-emerald-500" />
            <h3 className="font-medium">Verification Success Rate</h3>
          </div>
          <div className="text-4xl font-bold text-slate-100 mb-2">98.4%</div>
          <div className="text-sm text-emerald-400 flex items-center gap-1">
            <span>+1.2%</span> <span className="text-slate-500">vs last week</span>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <AlertTriangle size={20} className="text-amber-500" />
            <h3 className="font-medium">Pending Manual Review</h3>
          </div>
          <div className="text-4xl font-bold text-slate-100 mb-2">24</div>
          <div className="text-sm text-amber-400 flex items-center gap-1">
            <span>Requires compliance team</span>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <UserX size={20} className="text-rose-500" />
            <h3 className="font-medium">Detected Fraud Attempts</h3>
          </div>
          <div className="text-4xl font-bold text-slate-100 mb-2">12</div>
          <div className="text-sm text-rose-400 flex items-center gap-1">
            <span>Deepfake & spoofing</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Shield size={20} className="text-blue-500" />
                Live Verification Feed
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-400 text-sm">
                    <th className="p-4 font-medium">Session ID</th>
                    <th className="p-4 font-medium">Identity</th>
                    <th className="p-4 font-medium">Method</th>
                    <th className="p-4 font-medium">Confidence</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVerifications.map((v, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={v.id} 
                      className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-4 text-sm font-mono text-slate-400">{v.id}</td>
                      <td className="p-4 font-medium text-slate-200">{v.user}</td>
                      <td className="p-4 text-slate-400">{v.type}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${v.confidence > 90 ? 'bg-emerald-500' : v.confidence > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${v.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono text-slate-300">{v.confidence}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          v.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          v.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {v.status === 'verified' && <CheckCircle2 size={12} />}
                          {v.status === 'pending' && <div className="w-3 h-3 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />}
                          {v.status === 'rejected' && <UserX size={12} />}
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                        {v.reason && <div className="text-xs text-rose-400 mt-1">{v.reason}</div>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 h-full">
            <h2 className="text-lg font-bold text-slate-100 mb-6">Verification Volume</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTraffic} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Area type="monotone" dataKey="verifications" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorVerif)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h3 className="font-medium text-slate-200 mb-4">Liveness Detection Engines</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">3D Face Depth Map</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Micro-expression Analysis</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">ID Document Hologram Scan</span>
                    <span className="text-amber-400">Degraded</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


