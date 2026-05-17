import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tags, Plus, Edit2, Save, Trash2, Shield, Activity, Eye, X, Hash, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../components/ui/Toast';

interface Label {
  id: string;
  name: string;
  color: string;
  description: string;
  count: number;
}

const INITIAL_LABELS: Label[] = [
  { id: '1', name: 'High Risk', color: '#EF4444', description: 'Requires immediate attention and escalation', count: 42 },
  { id: '2', name: 'Verified', color: '#10B981', description: 'User identity has been fully verified', count: 128 },
  { id: '3', name: 'Suspicious', color: '#F59E0B', description: 'Flagged for manual review by SOC team', count: 31 },
  { id: '4', name: 'Bot Activity', color: '#8B5CF6', description: 'Automated script patterns detected', count: 17 },
  { id: '5', name: 'VIP', color: '#3B82F6', description: 'Priority client requiring white-glove handling', count: 56 },
  { id: '6', name: 'Archived', color: '#64748B', description: 'Resolved alerts moved to cold storage', count: 203 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function Labels() {
  const { addToast } = useToast();
  const [labels, setLabels] = useState<Label[]>(INITIAL_LABELS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Label>>({});
  const [isAdding, setIsAdding] = useState(false);

  const totalTagged = labels.reduce((s, l) => s + l.count, 0);
  const pieData = labels.map(l => ({ name: l.name, value: l.count, color: l.color }));

  const handleDelete = (id: string) => {
    setLabels(labels.filter(l => l.id !== id));
    addToast({ title: 'Label Deleted', message: 'The label has been removed.', type: 'info' });
  };

  const handleSave = () => {
    if (editingId) {
      setLabels(labels.map(l => l.id === editingId ? { ...l, ...editForm } as Label : l));
      setEditingId(null);
      addToast({ title: 'Label Updated', message: 'Changes saved successfully.', type: 'success' });
    } else if (isAdding) {
      const newLabel: Label = {
        id: Math.random().toString(36).substr(2, 9),
        name: editForm.name || 'New Label',
        color: editForm.color || '#3b82f6',
        description: editForm.description || '',
        count: 0,
      };
      setLabels([...labels, newLabel]);
      setIsAdding(false);
      addToast({ title: 'Label Created', message: 'New label added to the system.', type: 'success' });
    }
    setEditForm({});
  };

  const startEdit = (label: Label) => { setEditingId(label.id); setIsAdding(false); setEditForm(label); };
  const startAdd = () => { setIsAdding(true); setEditingId(null); setEditForm({ name: '', color: '#3b82f6', description: '' }); };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
    borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1">Label Management</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#818CF8', letterSpacing: '0.05em' }}>{labels.length} ACTIVE</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 500 }}>
            Create, edit, and organize classification tags for the fraud alert triage pipeline.
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn btn-primary" style={{ borderRadius: 10 }} onClick={startAdd} disabled={isAdding}>
          <Plus size={16} /> New Label
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Labels', value: labels.length.toString(), icon: <Tags size={20} />, color: '#6366F1' },
          { label: 'Tagged Entities', value: totalTagged.toLocaleString(), icon: <Hash size={20} />, color: '#3B82F6' },
          { label: 'Coverage Rate', value: '94.7%', icon: <Shield size={20} />, color: '#10B981' },
          { label: 'Auto-Tagged', value: '67%', icon: <Activity size={20} />, color: '#F59E0B' },
        ].map((k, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: '20px 24px' }} whileHover={{ y: -3 }}>
            <div className="flex justify-between items-start mb-3">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${k.color}12`, border: `1px solid ${k.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color
              }}>{k.icon}</div>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{k.value}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="glass-card overflow-hidden" style={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Plus size={16} style={{ color: '#6366F1' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Create New Label</span>
              </div>
              <button onClick={() => setIsAdding(false)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 6 }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24 }} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1 w-full">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</label>
                <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} placeholder="Label Name" />
              </div>
              <div className="w-full md:w-36">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Color</label>
                <div className="flex items-center gap-2" style={{ ...inputStyle, padding: '8px 14px' }}>
                  <input type="color" value={editForm.color || '#3b82f6'} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{editForm.color || '#3b82f6'}</span>
                </div>
              </div>
              <div className="flex-1 w-full">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Description</label>
                <input type="text" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={inputStyle} placeholder="Optional description" />
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="btn btn-primary" style={{ borderRadius: 10, whiteSpace: 'nowrap' }}>
                <Save size={16} /> Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: '1fr 360px' }}>
        {/* Label Table */}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }} className="flex justify-between items-center">
            <div>
              <h3 className="text-h3" style={{ marginBottom: 2 }}>Active Labels</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Classification tags applied across all modules</p>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px', border: '1px solid var(--border-strong)', borderRadius: 8 }}>
              <Eye size={14} /> Filter
            </button>
          </div>
          <div className="flex flex-col">
            <AnimatePresence>
              {labels.map((label, i) => (
                <motion.div
                  key={label.id} layout
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.05 * i }}
                  style={{ borderBottom: '1px solid var(--border-subtle)', padding: '16px 24px', cursor: 'pointer' }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {editingId === label.id ? (
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                      <div className="flex-1 w-full">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.8rem' }} />
                      </div>
                      <div className="w-full md:w-28">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</label>
                        <div className="flex items-center gap-2" style={{ ...inputStyle, padding: '6px 12px' }}>
                          <input type="color" value={editForm.color || '#3b82f6'} onChange={e => setEditForm({ ...editForm, color: e.target.value })} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                        <input type="text" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.8rem' }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '6px 12px', borderRadius: 8 }}>Cancel</button>
                        <button onClick={handleSave} className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '6px 12px', borderRadius: 8 }}><Save size={12} /> Save</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div style={{ width: 4, height: 40, borderRadius: 4, backgroundColor: label.color, boxShadow: `0 0 12px ${label.color}40` }} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 6, letterSpacing: '0.04em', textTransform: 'uppercase', background: `${label.color}15`, color: label.color, border: `1px solid ${label.color}30` }}>
                              {label.name}
                            </span>
                            <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>
                              {label.count} tagged
                            </span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label.description || 'No description provided.'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(label)} style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }} className="hover:bg-white/10 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(label.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.08)', borderRadius: 8, color: '#F87171', border: '1px solid rgba(239,68,68,0.15)' }} className="hover:bg-red-500/15 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {labels.length === 0 && !isAdding && (
              <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
                <Tags size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '0.85rem' }}>No labels found. Create one to get started.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Pie Chart Distribution */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
            <h3 className="text-h3" style={{ marginBottom: 4 }}>Tag Distribution</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>Entities per classification</p>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(11,14,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} itemStyle={{ color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2" style={{ marginTop: 8 }}>
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between" style={{ padding: '5px 0' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>Label Policies</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Auto-assign on scan', value: 'Enabled', icon: <Activity size={14} />, color: '#10B981' },
                { label: 'Max labels per entity', value: '5', icon: <Layers size={14} />, color: '#3B82F6' },
                { label: 'Retention policy', value: '90 days', icon: <Shield size={14} />, color: '#F59E0B' },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between" style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ color: m.color }}>{m.icon}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
