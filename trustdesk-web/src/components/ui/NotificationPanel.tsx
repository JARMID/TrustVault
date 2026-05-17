import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, Shield, CheckCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'critical', title: 'Suspicious Transaction Blocked', message: 'Unauthorized $2,450 withdrawal attempt detected. Wallet auto-frozen pending review.', time: '2 min ago', read: false },
  { id: '2', type: 'warning', title: 'Anomalous Transaction Pattern', message: 'Unusual spending velocity detected on virtual card ending in 4821.', time: '15 min ago', read: false },
  { id: '3', type: 'success', title: 'Fraud Alert #1847 Resolved', message: 'Disputed charge confirmed legitimate by cardholder verification.', time: '1 hour ago', read: false },
  { id: '4', type: 'info', title: 'System Update Available', message: 'TrustVault v2.4.1 is ready for deployment. Review changelog.', time: '3 hours ago', read: true },
  { id: '5', type: 'warning', title: 'Card Network Latency', message: 'Visa processing gateway showing elevated response times (>800ms).', time: '5 hours ago', read: true },
  { id: '6', type: 'success', title: 'Daily Backup Complete', message: 'All system databases and audit logs backed up successfully.', time: '8 hours ago', read: true },
];

const TYPE_CONFIG = {
  critical: { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  warning: { icon: Shield, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  success: { icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  info: { icon: Info, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const dismissOne = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 90,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '420px',
              maxWidth: '100vw',
              background: 'rgba(11,14,20,0.97)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bell size={18} style={{ color: '#60A5FA' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Notifications</h2>
                  <p style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace' }}>
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94A3B8', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 24px',
                display: 'flex',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <button
                  onClick={markAllRead}
                  style={{
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                    color: '#60A5FA', fontSize: '0.7rem', fontWeight: 600,
                    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    color: '#64748B', fontSize: '0.7rem', fontWeight: 600,
                    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Notification List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              <AnimatePresence>
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '60px 24px', color: '#475569', textAlign: 'center',
                    }}
                  >
                    <Bell size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No notifications</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>You're all caught up!</p>
                  </motion.div>
                ) : (
                  notifications.map((notif, i) => {
                    const config = TYPE_CONFIG[notif.type];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          marginBottom: '8px',
                          background: notif.read ? 'rgba(255,255,255,0.01)' : config.bg,
                          border: `1px solid ${notif.read ? 'rgba(255,255,255,0.04)' : config.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = config.bg;
                          e.currentTarget.style.borderColor = config.border;
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = notif.read ? 'rgba(255,255,255,0.01)' : config.bg;
                          e.currentTarget.style.borderColor = notif.read ? 'rgba(255,255,255,0.04)' : config.border;
                        }}
                      >
                        {/* Unread dot */}
                        {!notif.read && (
                          <div style={{
                            position: 'absolute', top: '16px', right: '16px',
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: config.color, boxShadow: `0 0 6px ${config.color}`,
                          }} />
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: config.bg, border: `1px solid ${config.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Icon size={16} style={{ color: config.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{
                              fontSize: '0.8rem', fontWeight: notif.read ? 500 : 600,
                              color: notif.read ? '#94A3B8' : 'white',
                              marginBottom: '4px',
                            }}>
                              {notif.title}
                            </h4>
                            <p style={{
                              fontSize: '0.72rem', color: '#64748B',
                              lineHeight: 1.5, marginBottom: '8px',
                            }}>
                              {notif.message}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={10} style={{ color: '#475569' }} />
                              <span style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'monospace' }}>
                                {notif.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Dismiss button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); dismissOne(notif.id); }}
                          style={{
                            position: 'absolute', top: '8px', right: '8px',
                            width: '20px', height: '20px', borderRadius: '6px',
                            background: 'transparent', border: 'none',
                            color: '#475569', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.opacity = '1'}
                          onMouseOut={e => e.currentTarget.style.opacity = '0'}
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
