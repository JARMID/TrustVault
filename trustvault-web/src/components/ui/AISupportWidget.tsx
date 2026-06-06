import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const AISupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your TrustVault AI assistant. How can I help you with your wallet or transactions today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // For the prototype, we assume Windmill is running locally on port 3216 
      // and we use a placeholder token. In production, this would be routed through our backend.
      const response = await fetch('http://localhost:3216/api/w/workspace/jobs/run_wait_result/f/trustvault/support_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_WINDMILL_TOKEN`
        },
        body: JSON.stringify({
          args: { messages: newMessages }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Agent');
      }

      const result = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.content || result.result?.content || "I'm having trouble connecting right now." 
      }]);
    } catch (error) {
      console.error("AI Agent error:", error);
      // Fallback for demonstration if Windmill isn't available
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm currently running in offline mode. The Windmill backend isn't reachable, but your frontend interface is looking fantastic!" 
        }]);
        setIsLoading(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        ref={constraintsRef} 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ top: '100px', bottom: '24px', left: '100px', right: '24px' }} 
      />

      <motion.div
        layout
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
      >
        {/* Floating Action Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              style={{ pointerEvents: 'auto', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', border: '1px solid rgba(255,255,255,0.2)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer liquid-glass-card shadow-2xl relative"
            >
              <MessageSquare size={24} className="text-white" />
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent-success rounded-full border-2 border-bg-base"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              style={{ pointerEvents: 'auto', background: 'var(--bg-primary)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border-light)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              initial={{ opacity: 0, y: 50, scale: 0.9, transformPerspective: 1000, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[380px] h-[600px] max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl origin-bottom-right"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-light)', background: 'linear-gradient(to right, rgba(0, 198, 174, 0.05), transparent)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-primary/20 border border-brand-primary/30">
                  <Bot size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-2">
                    TrustVault Agent <Sparkles size={12} className="text-accent-warning" />
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">Powered by DeepSeek V4 Flash</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-brand-secondary/20 border border-brand-secondary/30' 
                      : 'bg-brand-primary/20 border border-brand-primary/30'
                  }`}>
                    {msg.role === 'user' ? <User size={14} className="text-brand-secondary" /> : <Bot size={14} className="text-brand-primary" />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm border ${
                    msg.role === 'user'
                      ? 'bg-brand-secondary border-brand-secondary text-white rounded-tr-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)] rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center bg-brand-primary/20 border border-brand-primary/30">
                    <Bot size={14} className="text-brand-primary" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-tl-sm flex items-center gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-brand-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-[var(--bg-primary)]" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border rounded-xl p-2 focus-within:border-brand-primary/50 transition-colors" style={{ borderColor: 'var(--border-light)' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your balance..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] px-2 placeholder-[var(--text-tertiary)]"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 flex items-center justify-center bg-brand-primary rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};
