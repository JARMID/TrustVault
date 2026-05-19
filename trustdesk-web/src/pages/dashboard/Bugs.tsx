
import { Bug, Terminal, Activity, FileJson, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const mockErrorTimeline = [
  { time: '10:00', errors: 2 },
  { time: '10:30', errors: 5 },
  { time: '11:00', errors: 12 },
  { time: '11:30', errors: 3 },
  { time: '12:00', errors: 8 },
  { time: '12:30', errors: 24 },
  { time: '13:00', errors: 1 },
];

export default function BugReports() {
  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Bug className="text-blue-500" size={32} />
            Auto Bug Reporting
          </h1>
          <p className="text-slate-400 mt-2">Zero-touch diagnostic telemetry and forensic fraud alert auto-reports.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <FileJson size={18} />
          Export Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
              <Activity size={20} className="text-blue-500" />
              Error Frequency Timeline
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockErrorTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="errors" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-secondary)', stroke: '#F43F5E', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Terminal size={20} className="text-blue-500" />
                Latest Trace Logs
              </h2>
              <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded border border-rose-500/20">LIVE</span>
            </div>
            <div className="p-4 bg-[#0D1117] font-mono text-xs text-slate-300 h-64 overflow-y-auto">
              <div className="mb-2"><span className="text-slate-500">[13:01:22]</span> <span className="text-emerald-400">INFO</span> System health check OK.</div>
              <div className="mb-2"><span className="text-slate-500">[13:02:45]</span> <span className="text-rose-400">ERROR</span> UnhandledPromiseRejection: Database connection timeout in IdentityModule.</div>
              <div className="mb-2 ml-4 text-slate-500">at Module.getConnection (/src/db/core.ts:42:15)<br/>at async verifyIdentity (/src/services/ekyc.ts:128:5)</div>
              <div className="mb-2"><span className="text-slate-500">[13:02:46]</span> <span className="text-amber-400">WARN</span> Fallback mechanism engaged for identity verification.</div>
              <div className="mb-2"><span className="text-slate-500">[13:03:10]</span> <span className="text-blue-400">DEBUG</span> Generated auto-report #RPT-9042 with memory snapshot.</div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 h-full">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
              <Cpu size={20} className="text-blue-500" />
              Auto-Generated Reports
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-slate-600 transition-colors cursor-pointer group">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-sm text-blue-400 group-hover:text-blue-300">RPT-904{i}</span>
                    <span className="text-xs text-slate-500">2h ago</span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-200 mb-2 truncate">Database Connection Timeout</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] rounded border border-rose-500/20">Critical</span>
                    <span className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-[10px] rounded border border-slate-600">DB Layer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


