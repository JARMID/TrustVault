import React, { useState, useEffect, useMemo } from 'react';
import { Globe, MapPin, Crosshair, Navigation, AlertCircle, Shield, Activity, Clock, ChevronRight, Radar, Wifi, Signal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* ── Mock Geo Events ── */
const mockGeoEvents = [
  { id: 'GEO-01', lat: 36.7538, lng: 3.0588, severity: 9, name: 'Algiers Central Hub', type: 'Unauthorized Access', time: '2 min ago', status: 'active' },
  { id: 'GEO-02', lat: 36.7320, lng: 3.0870, severity: 4, name: 'Hydra Branch Node', type: 'Routine Scan', time: '8 min ago', status: 'resolved' },
  { id: 'GEO-03', lat: 36.7650, lng: 3.0420, severity: 2, name: 'Bab Ezzouar Terminal', type: 'Heartbeat', time: '12 min ago', status: 'resolved' },
  { id: 'GEO-04', lat: 35.6969, lng: -0.6331, severity: 8, name: 'Oran Datacenter', type: 'Brute Force Attempt', time: '5 min ago', status: 'active' },
  { id: 'GEO-05', lat: 36.3650, lng: 6.6147, severity: 5, name: 'Constantine Proxy', type: 'Certificate Expiry', time: '15 min ago', status: 'warning' },
  { id: 'GEO-06', lat: 36.4700, lng: 2.8300, severity: 7, name: 'Blida Relay', type: 'DDoS Detection', time: '1 min ago', status: 'active' },
  { id: 'GEO-07', lat: 34.8500, lng: 2.8800, severity: 3, name: 'Djelfa Outpost', type: 'Firmware Update', time: '20 min ago', status: 'resolved' },
  { id: 'GEO-08', lat: 36.9200, lng: 7.7700, severity: 6, name: 'Annaba Edge Node', type: 'Anomaly Detected', time: '3 min ago', status: 'warning' },
];

/* ── Severity Color Mapping ── */
const getSeverityColor = (severity: number): string => {
  if (severity >= 8) return '#EF4444';
  if (severity >= 6) return '#F59E0B';
  if (severity >= 4) return '#3B82F6';
  return '#10B981';
};

const getStatusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', label: 'ACTIVE' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', label: 'WARNING' },
    resolved: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', label: 'RESOLVED' },
  };
  return map[status] || map.resolved;
};

/* ── Animated Map View ── */
const FlyToCenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

/* ── Main Component ── */
export default function GeoLocal() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.5, 3.0]);
  const [mapZoom, setMapZoom] = useState(6);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'warning' | 'resolved'>('all');

  // Pulse animation for active markers
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return mockGeoEvents;
    return mockGeoEvents.filter(e => e.status === filter);
  }, [filter]);

  const activeCount = mockGeoEvents.filter(e => e.status === 'active').length;
  const warningCount = mockGeoEvents.filter(e => e.status === 'warning').length;

  const handleEventClick = (event: typeof mockGeoEvents[0]) => {
    setSelectedEvent(event.id);
    setMapCenter([event.lat, event.lng]);
    setMapZoom(12);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1">Geo-Local Intelligence</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Radar size={12} style={{ color: '#60A5FA' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#60A5FA', letterSpacing: '0.05em' }}>SCANNING</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Automated geospatial asset tracking and localized threat intelligence across all operational zones.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-ghost"
            style={{ border: '1px solid var(--border-strong)', borderRadius: '10px' }}
            onClick={() => { setMapCenter([35.5, 3.0]); setMapZoom(6); setSelectedEvent(null); }}
          >
            <Globe size={16} /> Reset View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ borderRadius: '10px' }}
          >
            <Crosshair size={16} /> Calibrate Sensors
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Nodes', value: mockGeoEvents.length, icon: <Signal size={16} />, color: '#3B82F6' },
          { label: 'Active Threats', value: activeCount, icon: <AlertCircle size={16} />, color: '#EF4444' },
          { label: 'Warnings', value: warningCount, icon: <Activity size={16} />, color: '#F59E0B' },
          { label: 'Coverage', value: '97.3%', icon: <Wifi size={16} />, color: '#10B981' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="glass-card"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: `${stat.color}15`, border: `1px solid ${stat.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: 0, overflow: 'hidden', height: '600px', position: 'relative' }}
        >
          {/* Map Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1000 }}>
            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: '#3B82F6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Live Threat Map</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-tertiary)', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                {filteredEvents.length} nodes
              </span>
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'warning', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    fontSize: '0.68rem', fontWeight: 600, padding: '4px 12px',
                    borderRadius: '6px', border: 'none', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    fontFamily: 'monospace',
                    background: filter === f ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: filter === f ? '#60A5FA' : 'var(--text-tertiary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Leaflet Map */}
          <div style={{ height: 'calc(100% - 52px)', position: 'relative' }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%', background: '#0a1628' }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <FlyToCenter center={mapCenter} zoom={mapZoom} />

              {filteredEvents.map((event) => {
                const color = getSeverityColor(event.severity);
                const isActive = event.status === 'active';
                const isSelected = selectedEvent === event.id;
                const pulseRadius = isActive ? 12 + Math.sin(pulsePhase * 0.1) * 6 : 0;

                return (
                  <React.Fragment key={event.id}>
                    {/* Pulse ring for active threats */}
                    {isActive && (
                      <CircleMarker
                        center={[event.lat, event.lng]}
                        radius={pulseRadius}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: 0.1,
                          weight: 1,
                          opacity: 0.3,
                        }}
                      />
                    )}
                    {/* Main marker */}
                    <CircleMarker
                      center={[event.lat, event.lng]}
                      radius={isSelected ? 10 : 7}
                      pathOptions={{
                        color: isSelected ? '#fff' : color,
                        fillColor: color,
                        fillOpacity: isSelected ? 0.9 : 0.7,
                        weight: isSelected ? 3 : 2,
                      }}
                      eventHandlers={{
                        click: () => handleEventClick(event),
                      }}
                    >
                      <Popup>
                        <div style={{ background: 'transparent', color: '#fff', minWidth: '200px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{event.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '6px' }}>{event.type}</div>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
                            <span style={{ color }}>Severity: {event.severity}/10</span>
                            <span style={{ color: '#64748B' }}>•</span>
                            <span style={{ color: '#64748B' }}>{event.time}</span>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  </React.Fragment>
                );
              })}
            </MapContainer>

            {/* Map Legend */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px', zIndex: 1000,
              background: 'rgba(10, 14, 26, 0.9)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '12px 16px', backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.1em', marginBottom: '8px' }}>THREAT LEVEL</div>
              {[
                { label: 'Critical (8-10)', color: '#EF4444' },
                { label: 'High (6-7)', color: '#F59E0B' },
                { label: 'Medium (4-5)', color: '#3B82F6' },
                { label: 'Low (1-3)', color: '#10B981' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Event List */}
        <div className="flex flex-col gap-4">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
            style={{ padding: '16px 20px' }}
          >
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={14} style={{ color: '#3B82F6' }} />
              Recent Captures
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
              <AnimatePresence>
                {filteredEvents
                  .sort((a, b) => b.severity - a.severity)
                  .map((event, i) => {
                    const color = getSeverityColor(event.severity);
                    const badge = getStatusBadge(event.status);
                    const isSelected = selectedEvent === event.id;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleEventClick(event)}
                        whileHover={{ x: 4 }}
                        style={{
                          padding: '14px',
                          borderRadius: '10px',
                          background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0,0,0,0.2)',
                          border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: event.status === 'active' ? `0 0 8px ${color}` : 'none' }} />
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{event.name}</span>
                          </div>
                          <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', opacity: isSelected ? 1 : 0.4 }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', paddingLeft: '16px' }}>
                          {event.type}
                        </div>
                        <div className="flex items-center justify-between" style={{ paddingLeft: '16px' }}>
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px',
                            borderRadius: '4px', background: badge.bg, color: badge.text,
                            letterSpacing: '0.05em',
                          }}>
                            {badge.label}
                          </span>
                          <div className="flex items-center gap-1" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                            <Clock size={10} /> {event.time}
                          </div>
                        </div>
                        {/* Severity Bar */}
                        <div style={{ marginTop: '8px', paddingLeft: '16px' }}>
                          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${event.severity * 10}%` }}
                              transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                              style={{ height: '100%', background: color, borderRadius: '2px' }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sensor Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '16px 20px' }}
          >
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={14} style={{ color: '#10B981' }} />
              Sensor Health
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'GPS Accuracy', value: '±2.4m', color: '#10B981' },
                { label: 'Signal Strength', value: '-42 dBm', color: '#3B82F6' },
                { label: 'Last Sync', value: '< 1s ago', color: '#10B981' },
              ].map(metric => (
                <div key={metric.label} className="flex items-center justify-between" style={{
                  padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{metric.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: metric.color }}>{metric.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
