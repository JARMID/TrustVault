import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, CheckCheck, Shield, CreditCard, Send, AlertTriangle,
  TrendingUp, Clock, ChevronRight
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

/* ── Notification Icon Map ── */
const typeIcon: Record<string, { icon: React.ReactNode; color: string }> = {
  security: { icon: <Shield size={14} />, color: 'var(--accent-danger)' },
  system: { icon: <Shield size={14} />, color: 'var(--brand-primary)' },
  transaction: { icon: <Send size={14} />, color: 'var(--brand-primary)' },
  card: { icon: <CreditCard size={14} />, color: 'var(--accent-success)' },
  alert: { icon: <AlertTriangle size={14} />, color: 'var(--brand-primary)' },
  promotion: { icon: <TrendingUp size={14} />, color: 'var(--accent-success)' },
};

const NotificationPanel: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell trigger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative', width: '38px', height: '38px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isOpen ? 'var(--brand-primary-bg)' : 'var(--bg-inset)',
          border: `1px solid ${isOpen ? 'rgba(91,95,237,0.15)' : 'var(--border-subtle)'}`,
          cursor: 'pointer', color: isOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s',
        }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: 'var(--accent-danger)', color: 'white', fontSize: '0.55rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-surface)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Panel dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: '380px', maxHeight: '480px',
              background: 'var(--bg-surface)', borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 60px -16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
              overflow: 'hidden', zIndex: 100,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{unreadCount} unread</p>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={markAllAsRead}
                    style={{
                      padding: '5px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 600,
                      background: 'var(--brand-primary-bg)', color: 'var(--brand-primary)',
                      border: '1px solid rgba(91,95,237,0.12)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}
                  >
                    <CheckCheck size={11} /> Mark all read
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)',
                    cursor: 'pointer', color: 'var(--text-tertiary)',
                  }}
                >
                  <X size={12} />
                </motion.button>
              </div>
            </div>

            {/* Notification list */}
            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <Bell size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif, i) => {
                  const { icon, color } = typeIcon[notif.type] || typeIcon['alert'];
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => markAsRead(notif.id)}
                      className="flex gap-3"
                      style={{
                        padding: '14px 20px', cursor: 'pointer',
                        borderBottom: i < notifications.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        background: notif.is_read ? 'transparent' : 'rgba(91,95,237,0.02)',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-inset)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = notif.is_read ? 'transparent' : 'rgba(91,95,237,0.02)')}
                    >
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                        background: `${color}10`, border: `1px solid ${color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                      }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex justify-between items-start gap-2">
                          <p style={{
                            fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.3,
                            fontWeight: notif.is_read ? 500 : 600,
                          }}>
                            {notif.title}
                          </p>
                          {!notif.is_read && (
                            <div style={{
                              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                              background: 'var(--brand-primary)', marginTop: '6px',
                            }} />
                          )}
                        </div>
                        {notif.message && (
                          <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px', lineHeight: 1.4 }}>
                            {notif.message}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>
                          <Clock size={9} /> {formatTime(notif.created_at)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <button
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 600, color: 'var(--brand-primary)',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  View All Notifications <ChevronRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;




