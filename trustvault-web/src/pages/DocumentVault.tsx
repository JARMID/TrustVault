import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderLock, UploadCloud, Search, FileText, Download, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

import { useVault } from '../hooks/useVault';

const CATEGORIES = ['All', 'Identity', 'Financial', 'Contracts', 'Medical'];

const getIconForType = (type: string) => {
  return <FileText size={24} />;
};

const DocumentVault: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const { documents, loading, deleteDocument, uploadDocument } = useVault();

  const filteredDocs = documents.filter(doc => 
    (activeTab === 'All' || doc.type === activeTab) &&
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadClick = () => {
    // In a real app we'd open a file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) uploadDocument(file);
    };
    input.click();
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,198,174,0.08) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(138,43,226,0.05) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      
      <div className="max-w-[1200px] mx-auto pb-12 relative z-10">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-inset)] border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
            <FolderLock size={24} />
          </div>
          <div>
            <h1 className="text-h2 text-[var(--text-primary)] flex items-center gap-3">
              Document Vault
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-brand-primary-bg border border-brand-primary-glow text-brand-primary tracking-widest font-mono uppercase">
                <Lock size={10} /> Zero-Knowledge Encrypted
              </span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">Securely store and manage your sensitive documents.</p>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="w-full md:w-64 liquid-glass-card p-4 py-3">
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
            <span>Storage Used</span>
            <span className="text-[var(--text-primary)] font-mono">11.2 MB / 1 GB</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-[1%]" style={{ boxShadow: '0 0 10px var(--brand-primary)' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (Upload & Filters) */}
        <div className="flex flex-col gap-6">
          
          {/* Upload Zone */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-48 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-primary-glow bg-[var(--bg-surface-hover)] hover:bg-brand-primary-bg transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}
            onClick={handleUploadClick}
          >
            {/* Animated Laser Scan on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent h-[200%] -translate-y-full group-hover:animate-[slideDown_2s_ease-in-out_infinite]" />
            
            <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} className="text-brand-primary" />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Click to Upload</p>
            <p className="text-xs text-[var(--text-tertiary)]">or drag and drop files here</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-[var(--text-secondary)] bg-black/40 px-2 py-1 rounded">
              <ShieldCheck size={12} className="text-brand-primary" /> Encrypted locally before sync
            </div>
          </motion.div>

          {/* Categories */}
          <div className="liquid-glass-card p-4">
            <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === cat ? 'bg-brand-primary-bg text-brand-primary font-bold border border-brand-primary-glow' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Document Grid) */}
        <div className="lg:col-span-3">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input 
                type="text" 
                placeholder="Search encrypted documents..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-primary transition-colors"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDocs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="liquid-glass-card p-5 group flex flex-col justify-between relative overflow-hidden"
                style={{ border: '1px solid var(--border-white-5)' }}
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, rgba(0,198,174,0.1) 0%, transparent 70%)' }}/>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] group-hover:text-brand-primary group-hover:bg-brand-primary-bg transition-colors">
                      {getIconForType(doc.type)}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--text-tertiary)] uppercase border border-white/10 px-1.5 py-0.5 rounded">
                      <Lock size={8} /> AES-256
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1 truncate" title={doc.name}>{doc.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 btn btn-outline py-1.5 text-xs flex justify-center hover:text-brand-primary hover:border-brand-primary-glow">
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => deleteDocument(doc.name)} className="btn btn-outline py-1.5 px-3 hover:text-accent-danger hover:border-accent-danger hover:bg-accent-danger-bg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {filteredDocs.length === 0 && (
              <div className="col-span-full py-12 text-center text-[var(--text-tertiary)]">
                <FolderLock size={48} className="mx-auto mb-4 opacity-20" />
                <p>No documents found matching your criteria.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* CSS for custom animation */}
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(50%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
    </div>
  );
};

export default DocumentVault;
