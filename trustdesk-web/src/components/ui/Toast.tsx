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
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const colors: Record<ToastType, { bg: string; border: string; icon: string; bar: string }> = {
  success: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', icon: '#34D399', bar: '#10B981' },
  error:   { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', icon: '#F87171', bar: '#EF4444' },
  warning: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', icon: '#FBBF24', bar: '#F59E0B' },
  info:    { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', icon: '#60A5FA', bar: '#3B82F6' },
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
      {/* Toast Container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400,
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const c = colors[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  background: 'rgba(8, 10, 16, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${c.border}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* Top progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
                  style={{ height: 2, background: c.bar }}
                />
                <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ color: c.icon, marginTop: 1, flexShrink: 0 }}>
                    {icons[toast.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: toast.message ? 3 : 0 }}>
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.5 }}>
                        {toast.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    style={{
                      background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
                      padding: 2, flexShrink: 0, marginTop: 1,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
