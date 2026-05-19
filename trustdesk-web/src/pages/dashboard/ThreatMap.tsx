import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Shield, Radar, Maximize2, Radio, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/* â”€â”€ Global Threat Data â”€â”€ */
const globalThreats = [
  // Algeria
  { id: 'T-001', lat: 36.7538, lng: 3.0588, severity: 9, name: 'Algiers HQ', type: 'APT Attack Vector', region: 'North Africa' },
  { id: 'T-002', lat: 35.6969, lng: -0.6331, severity: 7, name: 'Oran Branch', type: 'Credential Stuffing', region: 'North Africa' },
  { id: 'T-003', lat: 36.3650, lng: 6.6147, severity: 5, name: 'Constantine DC', type: 'Port Scan Detected', region: 'North Africa' },
  // Europe
  { id: 'T-004', lat: 48.8566, lng: 2.3522, severity: 6, name: 'Paris Gateway', type: 'SSL Cert Mismatch', region: 'Europe' },
  { id: 'T-005', lat: 51.5074, lng: -0.1278, severity: 8, name: 'London Proxy', type: 'Ransomware Attempt', region: 'Europe' },
  { id: 'T-006', lat: 52.5200, lng: 13.4050, severity: 4, name: 'Berlin Edge', type: 'DNS Anomaly', region: 'Europe' },
  // Middle East
  { id: 'T-007', lat: 25.2048, lng: 55.2708, severity: 7, name: 'Dubai FinTech Hub', type: 'API Rate Abuse', region: 'Middle East' },
  { id: 'T-008', lat: 24.7136, lng: 46.6753, severity: 5, name: 'Riyadh Relay', type: 'Geo-fence Breach', region: 'Middle East' },
  // Americas
  { id: 'T-009', lat: 40.7128, lng: -74.0060, severity: 8, name: 'NYC Financial', type: 'Zero-Day Exploit', region: 'Americas' },
  { id: 'T-010', lat: 37.7749, lng: -122.4194, severity: 3, name: 'SF Cloud', type: 'Routine Audit', region: 'Americas' },
  // Asia
  { id: 'T-011', lat: 35.6762, lng: 139.6503, severity: 6, name: 'Tokyo Node', type: 'Phishing Campaign', region: 'Asia' },
  { id: 'T-012', lat: 1.3521, lng: 103.8198, severity: 4, name: 'Singapore Hub', type: 'Traffic Anomaly', region: 'Asia' },
];

const getSeverityColor = (severity: number): string => {
  if (severity >= 8) return 'var(--accent-danger)';
  if (severity >= 6) return 'var(--brand-primary)';
  if (severity >= 4) return 'var(--brand-primary)';
  return 'var(--accent-success)';
};

/* â”€â”€ Map Controller â”€â”€ */
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export default function ThreatMap() {
  const [center, setCenter] = useState<[number, number]>([30, 10]);
  const [zoom, setZoom] = useState(3);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [pulsePhase, setPulsePhase] = useState(0);
  const [liveCount, setLiveCount] = useState(globalThreats.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Simulate live count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + (Math.random() > 0.5 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const regions = [
    { key: 'all', label: 'Global', center: [30, 10] as [number, number], zoom: 3 },
    { key: 'North Africa', label: 'North Africa', center: [35.5, 3.0] as [number, number], zoom: 6 },
    { key: 'Europe', label: 'Europe', center: [50, 10] as [number, number], zoom: 4 },
    { key: 'Middle East', label: 'Middle East', center: [25, 50] as [number, number], zoom: 5 },
    { key: 'Americas', label: 'Americas', center: [38, -90] as [number, number], zoom: 4 },
    { key: 'Asia', label: 'Asia', center: [30, 120] as [number, number], zoom: 4 },
  ];

  const filteredThreats = activeRegion === 'all' ? globalThreats : globalThreats.filter(t => t.region === activeRegion);
  const criticalCount = filteredThreats.filter(t => t.severity >= 8).length;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-h1">Global Threat Map</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Radio size={12} style={{ color: 'var(--accent-danger)', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-danger)', letterSpacing: '0.05em' }}>{criticalCount} CRITICAL</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Real-time global threat intelligence feed. {liveCount} active nodes monitored across {regions.length - 1} regions.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-ghost"
            style={{ border: '1px solid var(--border-strong)', borderRadius: '10px' }}
          >
            <Clock size={16} /> Last 24h <ChevronDown size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{ borderRadius: '10px' }}
          >
            <Maximize2 size={16} /> Full Screen
          </motion.button>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 mb-6" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {regions.map(r => (
          <button
            key={r.key}
            onClick={() => {
              setActiveRegion(r.key);
              setCenter(r.center);
              setZoom(r.zoom);
            }}
            style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '8px 16px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeRegion === r.key ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
              color: activeRegion === r.key ? '#60A5FA' : 'var(--text-secondary)',
              borderBottom: activeRegion === r.key ? '2px solid #3B82F6' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: 0, overflow: 'hidden', height: '640px', position: 'relative' }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%', background: 'var(--bg-primary)' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapController center={center} zoom={zoom} />

          {filteredThreats.map((threat) => {
            const color = getSeverityColor(threat.severity);
            const isCritical = threat.severity >= 8;
            const pulseR = isCritical ? 14 + Math.sin(pulsePhase * 0.08) * 8 : 0;

            return (
              <React.Fragment key={threat.id}>
                {isCritical && (
                  <CircleMarker
                    center={[threat.lat, threat.lng]}
                    radius={pulseR}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.08, weight: 1, opacity: 0.25 }}
                  />
                )}
                <CircleMarker
                  center={[threat.lat, threat.lng]}
                  radius={6 + threat.severity * 0.4}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.65, weight: 2 }}
                >
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{threat.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{threat.type}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                        <span style={{ color }}>Severity: {threat.severity}/10</span>
                        <span style={{ color: 'var(--text-tertiary)' }}>{threat.region}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Overlay Stats */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px', zIndex: 1000,
          display: 'flex', gap: '8px',
        }}>
          {[
            { icon: <Shield size={12} />, label: `${filteredThreats.length} Nodes`, color: 'var(--brand-primary)' },
            { icon: <AlertTriangle size={12} />, label: `${criticalCount} Critical`, color: 'var(--accent-danger)' },
            { icon: <Radar size={12} />, label: 'Scanning', color: 'var(--accent-success)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(10, 14, 26, 0.9)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '8px 14px', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.7rem', fontWeight: 600, color: stat.color,
            }}>
              {stat.icon} {stat.label}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px', zIndex: 1000,
          background: 'rgba(10, 14, 26, 0.92)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px', padding: '14px 18px', backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.12em', marginBottom: '8px' }}>SEVERITY</div>
          {[
            { label: 'Critical', color: 'var(--accent-danger)' },
            { label: 'High', color: 'var(--brand-primary)' },
            { label: 'Medium', color: 'var(--brand-primary)' },
            { label: 'Low', color: 'var(--accent-success)' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2" style={{ marginBottom: '3px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, boxShadow: `0 0 5px ${item.color}50` }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Map Pin Watermark */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '16px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)',
        }}>
          <MapPin size={12} />
          TrustVault Threat Intelligence v2.1
        </div>
      </motion.div>
    </div>
  );
}


