import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Building2, FileText, Shield,
  Camera, Check, Save, Pencil, MapPin, Calendar,
  Globe, Activity, Monitor, Smartphone, Clock,
} from 'lucide-react';
import Avatar, { AVATAR_GRADIENTS } from '../components/ui/Avatar';
import { useToast } from '../components/ui/Toast';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  bio: string;
  location: string;
  joined: string;
  avatarUrl: string;
  timezone: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Security Admin',
  email: 'admin@trustvault.io',
  phone: '+213 555 0120',
  department: 'Fraud Operations',
  role: 'administrator',
  bio: 'Lead fraud operations administrator overseeing platform-wide threat detection, transaction monitoring, and financial security operations.',
  location: 'Algiers, Algeria',
  joined: 'January 2026',
  avatarUrl: 'gradient-4',
  timezone: 'Africa/Algiers (UTC+1)',
};

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  administrator: { bg: 'rgba(239, 68, 68,0.1)', text: 'var(--accent-danger)', border: 'rgba(239, 68, 68,0.2)' },
  analyst: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
  operator: { bg: 'rgba(16,185,129,0.1)', text: 'var(--accent-success)', border: 'rgba(16,185,129,0.2)' },
  viewer: { bg: 'rgba(148,163,184,0.1)', text: 'var(--text-tertiary)', border: 'rgba(148,163,184,0.2)' },
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const { addToast } = useToast();

  const startEdit = () => { setEditData({ ...profile }); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => {
    setProfile({ ...editData });
    setEditing(false);
    addToast({ type: 'success', title: 'Profile updated', message: 'Your changes have been saved successfully.' });
  };

  const roleStyle = ROLE_COLORS[profile.role] || ROLE_COLORS.viewer;

  const infoFields: { icon: React.FC<{ size?: number; style?: React.CSSProperties }>; label: string; key: keyof ProfileData; editable: boolean }[] = [
    { icon: Mail, label: 'Email', key: 'email', editable: false },
    { icon: Phone, label: 'Phone', key: 'phone', editable: true },
    { icon: Building2, label: 'Department', key: 'department', editable: true },
    { icon: MapPin, label: 'Location', key: 'location', editable: true },
    { icon: Globe, label: 'Timezone', key: 'timezone', editable: false },
    { icon: Calendar, label: 'Joined', key: 'joined', editable: false },
  ];

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'white',
    fontSize: '0.82rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={20} style={{ color: '#60A5FA' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>Profile</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                Manage your identity & preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {/* Banner */}
          <div style={{
            height: '120px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(11,14,20,1) 100%)',
            }} />
          </div>

          <div style={{ padding: '0 32px 32px', marginTop: '-48px', position: 'relative' }}>
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  name={profile.name}
                  imageUrl={profile.avatarUrl}
                  size="2xl"
                  status="online"
                  showRing
                />
                {editing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      position: 'absolute', bottom: '4px', right: '4px',
                      width: '32px', height: '32px', borderRadius: '10px',
                      background: 'rgba(59,130,246,0.9)', border: 'none',
                      color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Camera size={14} />
                  </motion.button>
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: '4px' }}>
                {editing ? (
                  <input
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    style={{ ...inputStyle, fontSize: '1.3rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '2px solid rgba(59,130,246,0.3)', borderRadius: 0, padding: '4px 0' }}
                  />
                ) : (
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>{profile.name}</h2>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    background: roleStyle.bg,
                    color: roleStyle.text,
                    border: `1px solid ${roleStyle.border}`,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}>
                    <Shield size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {profile.role}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>â€¢</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{profile.department}</span>
                </div>
              </div>
              <div>
                {editing ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={cancelEdit}
                      style={{
                        padding: '8px 16px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--text-tertiary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveEdit}
                      style={{
                        padding: '8px 16px', borderRadius: '10px',
                        background: 'rgba(59,130,246,0.9)', border: 'none',
                        color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <Save size={14} /> Save
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startEdit}
                    style={{
                      padding: '8px 16px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-tertiary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <Pencil size={14} /> Edit Profile
                  </motion.button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-tertiary)',
                fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em',
                display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
              }}>
                <FileText size={12} /> Bio
              </label>
              {editing ? (
                <textarea
                  value={editData.bio}
                  onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    lineHeight: 1.6,
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}>
              {infoFields.map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.key} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <label style={{
                      fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)',
                      fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em',
                      display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
                    }}>
                      <Icon size={11} /> {field.label}
                    </label>
                    {editing && field.editable ? (
                      <input
                        value={editData[field.key]}
                        onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                        style={inputStyle}
                      />
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {profile[field.key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Avatar Selector (visible in edit mode) */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{
              fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Camera size={16} style={{ color: '#60A5FA' }} />
              Choose Avatar Style
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {AVATAR_GRADIENTS.map((_, idx) => {
                const isSelected = editData.avatarUrl === `gradient-${idx}`;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditData({ ...editData, avatarUrl: `gradient-${idx}` })}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      name={editData.name}
                      imageUrl={`gradient-${idx}`}
                      size="lg"
                      showRing={isSelected}
                    />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.4)',
                      }}>
                        <Check size={20} style={{ color: 'white' }} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Activity Log & Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Recent Activity */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
          }}>
            <h3 style={{
              fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Activity size={16} style={{ color: '#60A5FA' }} />
              Recent Activity
            </h3>
            {[
              { action: 'Updated security policy', time: '2 minutes ago', icon: Shield, color: 'var(--brand-primary)' },
              { action: 'Resolved fraud alert FA-4201', time: '15 minutes ago', icon: Check, color: 'var(--accent-success)' },
              { action: 'Generated monthly report', time: '1 hour ago', icon: FileText, color: 'var(--brand-primary)' },
              { action: 'Modified zone access rules', time: '3 hours ago', icon: MapPin, color: 'var(--brand-primary)' },
              { action: 'Reviewed community signal', time: '5 hours ago', icon: User, color: '#06B6D4' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${item.color}12`,
                    border: `1px solid ${item.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.action}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Sessions */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
          }}>
            <h3 style={{
              fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Monitor size={16} style={{ color: 'var(--accent-success)' }} />
              Active Sessions
            </h3>
            {[
              { device: 'Windows Desktop', browser: 'Chrome 121', ip: '192.168.1.45', current: true, icon: Monitor, lastActive: 'Now' },
              { device: 'iPhone 15 Pro', browser: 'Safari Mobile', ip: '10.0.0.12', current: false, icon: Smartphone, lastActive: '2 hours ago' },
              { device: 'MacBook Pro', browser: 'Firefox 122', ip: '172.16.0.88', current: false, icon: Monitor, lastActive: '1 day ago' },
            ].map((session, i) => {
              const Icon = session.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: session.current ? 'rgba(16,185,129,0.04)' : 'transparent',
                  border: session.current ? '1px solid rgba(16,185,129,0.1)' : '1px solid transparent',
                  marginBottom: i < 2 ? '8px' : 0,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color: session.current ? 'var(--accent-success)' : 'var(--text-tertiary)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{session.device}</p>
                      {session.current && (
                        <span style={{
                          fontSize: '0.6rem', padding: '1px 6px', borderRadius: 4,
                          background: 'rgba(16,185,129,0.15)', color: 'var(--accent-success)',
                          fontWeight: 700, fontFamily: 'monospace',
                        }}>CURRENT</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                      {session.browser} Â· <span style={{ fontFamily: 'monospace' }}>{session.ip}</span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> {session.lastActive}
                    </p>
                  </div>
                </div>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToast({ type: 'warning', title: 'Sessions revoked', message: 'All other sessions have been signed out.' })}
              style={{
                width: '100%', marginTop: '12px', padding: '10px', borderRadius: '10px',
                background: 'rgba(239, 68, 68,0.06)', border: '1px solid rgba(239, 68, 68,0.15)',
                color: 'var(--accent-danger)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Revoke All Other Sessions
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;



