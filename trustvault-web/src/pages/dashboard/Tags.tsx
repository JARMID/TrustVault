import React, { useState } from 'react';
import { Tags, Plus, Filter, Tag as TagIcon, X, Zap } from 'lucide-react';

import { useTriage } from '../../hooks/useTriage';

const initialTags = [
  { id: '1', name: 'Critical Alert', color: 'bg-rose-500' },
  { id: '2', name: 'Requires Review', color: 'bg-amber-500' },
  { id: '3', name: 'Network Anomaly', color: 'bg-blue-500' },
  { id: '4', name: 'VIP Target', color: 'bg-purple-500' },
];

export default function TagsManagement() {
  const { alerts } = useTriage();
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rules, setRules] = useState([
    { id: '1', condition: "Severity > 8 AND Location NOT 'HQ'", targetTag: 'Critical Alert', targetTagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30', confidence: '95%', status: 'Active' },
    { id: '2', condition: "Failed_Login_Count > 5 / minute", targetTag: 'Requires Review', targetTagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30', confidence: '80%', status: 'Active' }
  ]);

  const handleAddRule = () => {
    const newRule = {
      id: Date.now().toString(),
      condition: "New Rule Condition...",
      targetTag: 'Select Tag',
      targetTagColor: 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
      confidence: '85%',
      status: 'Draft'
    };
    setRules([...rules, newRule]);
  };

  const handleGenerateRuleAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const aiRule = {
        id: Date.now().toString(),
        condition: "Anomaly_Score > 0.88 AND Time >= '02:00' AND Time <= '04:00'",
        targetTag: 'Network Anomaly',
        targetTagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        confidence: '92%',
        status: 'AI Suggested'
      };
      setRules([aiRule, ...rules]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTag.trim()) return;

    const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTagObj = {
      id: Date.now().toString(),
      name: newTag.trim(),
      color: randomColor,
      count: 0
    };

    setTags([...tags, newTagObj]);
    setNewTag('');
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const getTagCount = (tagName: string) => {
    switch (tagName) {
      case 'Critical Alert':
        return alerts.filter(a => a.priority === 'critical').length;
      case 'Requires Review':
        return alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
      case 'Network Anomaly':
        return alerts.filter(a => a.category === 'p2p' || a.category === 'account').length;
      case 'VIP Target':
        // Mock VIP logic
        return alerts.filter(a => a.amount_involved && a.amount_involved > 50000).length;
      default:
        return 0;
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <Tags className="text-blue-500" size={32} />
            Alert Tag Management
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">Automated classification and indexing for fraud alerts.</p>
        </div>
        <div className="flex gap-4">
          <form onSubmit={handleAddTag} className="relative">
            <input
              type="text"
              placeholder="Create new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="pl-4 pr-10 py-2 bg-[var(--bg-inset)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors w-64"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400">
              <Plus size={20} />
            </button>
          </form>
          <button className="px-4 py-2 bg-[var(--bg-inset)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter Rules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-[var(--bg-inset)] border border-[var(--border-subtle)] rounded-xl p-6 group hover:border-[var(--brand-primary)] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${tag.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                <h3 className="text-lg font-medium text-[var(--text-primary)]">{tag.name}</h3>
              </div>
              <button 
                onClick={() => handleRemoveTag(tag.id)}
                className="text-[var(--text-tertiary)] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <TagIcon size={14} />
              <span>{getTagCount(tag.name)} entities tagged</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex gap-2">
              <button className="text-xs px-3 py-1.5 bg-[var(--bg-inset)] hover:bg-[var(--bg-surface-hover)] rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors">Edit Auto-Rules</button>
              <button className="text-xs px-3 py-1.5 bg-[var(--bg-inset)] hover:bg-[var(--bg-surface-hover)] rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors">View Entities</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[var(--bg-inset)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Neural Tagging Rules</h2>
          <div className="flex gap-3">
            <button 
              onClick={handleGenerateRuleAI} 
              disabled={isGenerating}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isGenerating ? 'bg-indigo-600/50 text-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]'}`}
            >
              <Zap size={16} className={isGenerating ? 'animate-pulse' : ''} /> 
              {isGenerating ? 'Synthesizing...' : 'Auto-Generate AI Rule'}
            </button>
            <button onClick={handleAddRule} className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <Plus size={16} /> Add Rule
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-inset)] text-[var(--text-secondary)] text-sm">
                <th className="p-4 font-medium">Condition</th>
                <th className="p-4 font-medium">Target Tag</th>
                <th className="p-4 font-medium">Confidence Threshold</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} className="border-b border-[var(--border-subtle)] group">
                  <td className="p-4 font-mono text-sm text-[var(--text-secondary)]">{rule.condition}</td>
                  <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full border ${rule.targetTagColor}`}>{rule.targetTag}</span></td>
                  <td className="p-4 text-[var(--text-secondary)]">{rule.confidence}</td>
                  <td className="p-4">
                    <span className={`text-xs border px-2 py-1 rounded ${rule.status === 'Active' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-[var(--text-secondary)] border-[var(--border-subtle)] bg-[var(--bg-surface-hover)]'}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleRemoveRule(rule.id)} className="text-[var(--text-tertiary)] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rules.length === 0 && (
            <div className="p-8 text-center text-[var(--text-tertiary)]">
              No rules configured. Add a rule to automate tagging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


