import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
};

const colors: Record<ToastType, { border: string; icon: string; bar: string }> = {
  success: { border: 'rgba(0,198,174,0.25)',  icon: 'var(--accent-success)', bar: 'var(--accent-success)' },
  error:   { border: 'rgba(239,68,68,0.25)',   icon: 'var(--accent-danger)',  bar: 'var(--accent-danger)'  },
  warning: { border: 'rgba(0, 198, 174,0.3)',   icon: 'var(--brand-primary)',  bar: 'var(--brand-primary)'  },
  info:    { border: 'var(--border-white-5)',  icon: 'var(--text-secondary)', bar: 'var(--brand-primary)'  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 380,
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const c = colors[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 60, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.92 }}
                transition={{ type: 'spring' as const, stiffness: 420, damping: 32 }}
                style={{
                  background: 'rgba(5,5,5,0.95)',
                  backdropFilter: 'blur(28px)',
                  border: `1px solid ${c.border}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
                }}
              >
                {/* Progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
                  style={{ height: 1.5, background: c.bar, opacity: 0.8 }}
                />
                <div style={{ padding: '13px 15px', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <div style={{ color: c.icon, marginTop: 2, flexShrink: 0 }}>
                    {icons[toast.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.82rem', fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      marginBottom: toast.message ? 3 : 0,
                    }}>
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p style={{
                        fontSize: '0.72rem', color: 'var(--text-tertiary)',
                        lineHeight: 1.5, fontFamily: 'var(--font-sans)',
                      }}>
                        {toast.message}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeToast(toast.id)}
                    style={{
                      background: 'var(--bg-inset)', border: '1px solid var(--border-white-5)',
                      borderRadius: 6, color: 'var(--text-tertiary)', cursor: 'pointer',
                      padding: '3px', flexShrink: 0, display: 'flex',
                    }}
                  >
                    <X size={11} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};



