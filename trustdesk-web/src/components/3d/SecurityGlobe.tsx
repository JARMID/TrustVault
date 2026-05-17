import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Stars, CameraShake } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';

/* ── Interactive Ripple ── */
const Ripple: React.FC<{ position: [number, number, number], color: string, continuous?: boolean }> = ({ position, color, continuous = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (continuous) {
        // Loops scale from 1 to 4
        const scale = 1 + ((state.clock.elapsedTime * 1.5) % 3);
        meshRef.current.scale.set(scale, scale, scale);
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.6 * (1 - (scale - 1) / 3);
      } else {
        meshRef.current.scale.addScalar(delta * 4);
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, mat.opacity - delta * 1.5);
      }
    }
  });
  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.08, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} wireframe blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

/* ── Hotspot Component ── */
const Hotspot: React.FC<{ position: [number, number, number], color: string, label: string }> = ({ position, color, label }) => {
  const [hovered, setHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState<number>(0);
  const meshRef = useRef<THREE.Mesh>(null);

  const targetVec = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.3 : 1;
      targetVec.set(targetScale, targetScale, targetScale);
      meshRef.current.scale.lerp(targetVec, 0.2);
    }
  });

  return (
    <group>
      {clickEffect > 0 && <Ripple key={clickEffect} position={position} color={color} />}
      {color === '#EF4444' && <Ripple position={position} color={color} continuous={true} />}
      <mesh 
        ref={meshRef}
        position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'crosshair'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'grab'; }}
        onClick={(e) => { 
          e.stopPropagation(); 
          setClickEffect(Date.now());
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        {/* Using toneMapped={false} for Bloom */}
        <meshBasicMaterial color={hovered ? '#ffffff' : color} toneMapped={false} />
        {hovered && (
          <Html distanceFactor={12} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(2, 6, 23, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${color}`,
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap',
              transform: 'translate3d(15px, -15px, 0)',
              boxShadow: `0 0 20px ${color}60`
            }}>
              <div style={{ color: color, marginBottom: '4px', fontSize: '9px', letterSpacing: '0.1em' }}>NODE IDENTIFIED</div>
              <div style={{ fontWeight: 600 }}>{label}</div>
              <div style={{ marginTop: '4px', color: '#94A3B8', fontSize: '9px' }}>Lat: {position[0].toFixed(2)} Lng: {position[1].toFixed(2)}</div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

/* ── Animated Arc ── */
const AnimatedArc: React.FC<{ start: [number, number, number], end: [number, number, number], color: string }> = ({ start, end, color }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const tempPos = useMemo(() => new THREE.Vector3(), []);

  // Stable random speed and phase offset per arc instance
  const [speed] = useState(() => 0.2 + Math.random() * 0.3);
  const [initialOffset] = useState(() => Math.random());
  
  const curve = useMemo(() => {
    const v1 = new THREE.Vector3(...start);
    const v2 = new THREE.Vector3(...end);
    // Control point pushed outwards
    const mid = v1.clone().lerp(v2, 0.5).normalize().multiplyScalar(v1.length() * 1.3);
    return new THREE.QuadraticBezierCurve3(v1, mid, v2);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(30), [curve]);

  useFrame((state, delta) => {
    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.dashOffset -= delta * 2;
    }
    if (packetRef.current) {
      // Packet travels along the curve
      const t = ((state.clock.elapsedTime * speed) + initialOffset) % 1;
      curve.getPointAt(t, tempPos);
      packetRef.current.position.copy(tempPos);
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.6}
        dashed={true}
        dashScale={20}
        dashSize={1}
      />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ── Wireframe Globe ── */
const WireframeGlobe: React.FC<{ onGlobeClick?: () => void }> = ({ onGlobeClick }) => {
  const [userRipples, setUserRipples] = useState<{id: number, pos: [number, number, number]}[]>([]);
  const [userArcs, setUserArcs] = useState<{id: number, start: [number, number, number], end: [number, number, number], color: string}[]>([]);

  const globePoints = useMemo(() => {
    const pts: number[] = [];
    const radius = 2.4;
    for (let lat = -80; lat <= 80; lat += 20) {
      const phi = (90 - lat) * (Math.PI / 180);
      for (let lng = 0; lng <= 360; lng += 4) {
        const theta = lng * (Math.PI / 180);
        pts.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }
    }
    for (let lng = 0; lng < 360; lng += 20) {
      const theta = lng * (Math.PI / 180);
      for (let lat = -90; lat <= 90; lat += 4) {
        const phi = (90 - lat) * (Math.PI / 180);
        pts.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }
    }
    return new Float32Array(pts);
  }, []);

  const [{ hotspots, arcs }] = useState(() => {
    const radius = 2.42;
    const hotspotsData: { pos: [number, number, number], color: string, label: string }[] = [];
    
    // Generate 15 distinct hotspots
    for(let i=0; i<15; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const pos: [number, number, number] = [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ];
      const r = Math.random();
      let color = '#00C6AE';
      let label = `NODE-${Math.floor(Math.random() * 9000) + 1000}`;
      if (r > 0.8) { color = '#EF4444'; label = `THREAT-${Math.floor(Math.random() * 900) + 100}`; }
      else if (r > 0.5) { color = '#10B981'; label = `SECURE-${Math.floor(Math.random() * 90) + 10}`; }
      
      hotspotsData.push({ pos, color, label });
    }

    const arcsData: { start: [number, number, number], end: [number, number, number], color: string }[] = [];
    // Generate some arcs between hotspots
    for(let i=0; i<15; i++) {
      const start = hotspotsData[Math.floor(Math.random() * hotspotsData.length)];
      const end = hotspotsData[Math.floor(Math.random() * hotspotsData.length)];
      if(start !== end) {
        arcsData.push({ start: start.pos, end: end.pos, color: start.color });
      }
    }

    return { hotspots: hotspotsData, arcs: arcsData };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGlobeClick = (e: any) => {
    e.stopPropagation();
    if (e.intersections && e.intersections.length > 0) {
      const pt = e.intersections[0].point;
      const localPt = e.object.worldToLocal(pt.clone());
      const pos: [number, number, number] = [localPt.x, localPt.y, localPt.z];
      
      const newRipple = { id: Date.now() + Math.random(), pos };
      setUserRipples(prev => [...prev, newRipple]);
      
      if (hotspots.length > 0) {
        const randomHotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
        const newArc = { id: Date.now() + Math.random(), start: randomHotspot.pos, end: pos, color: '#f59e0b' };
        setUserArcs(prev => [...prev, newArc]);
        
        setTimeout(() => {
          setUserArcs(prev => prev.filter(a => a.id !== newArc.id));
        }, 3000);
      }

      if (onGlobeClick) onGlobeClick();
      
      setTimeout(() => {
        setUserRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 2000);
    }
  };

  return (
    <group position={[1.2, 0, 0]}>
      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[2.55, 32, 32]} />
        <meshBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Core glow sphere - catches light */}
      <mesh 
        onClick={handleGlobeClick} 
        onPointerOver={() => document.body.style.cursor = 'crosshair'} 
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshPhongMaterial 
          color="#0a1628" 
          emissive="#040b16" 
          specular={new THREE.Color("#00C6AE")} 
          shininess={60} 
          transparent 
          opacity={0.9} 
        />
      </mesh>

      {/* Globe wireframe points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[globePoints, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#1e3a5f" size={0.02} transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Interactive Hotspots */}
      {hotspots.map((h, i) => <Hotspot key={`hs-${i}`} position={h.pos} color={h.color} label={h.label} />)}
      
      {/* User Ripples */}
      {userRipples.map(r => <Ripple key={`ur-${r.id}`} position={r.pos} color="#00f0ff" />)}

      {/* Animated Arcs */}
      {arcs.map((a, i) => <AnimatedArc key={`arc-${i}`} start={a.start} end={a.end} color={a.color} />)}
      {userArcs.map((a) => <AnimatedArc key={`uarc-${a.id}`} start={a.start} end={a.end} color={a.color} />)}

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[3.0, 3.01, 64]} />
        <meshBasicMaterial color="#00C6AE" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0.5, 0.3]}>
        <ringGeometry args={[3.3, 3.31, 64]} />
        <meshBasicMaterial color="#D4A853" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/* ── Scanning Beam ── */
const ScanBeam: React.FC = () => {
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.rotation.z = state.clock.elapsedTime * 0.8;
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={[1.2, 0, 0]}>
      <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, 7]} />
        <meshBasicMaterial color="#00C6AE" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ── Satellites ── */
const SatelliteOrb: React.FC<{ index: number, angle: number }> = ({ index, angle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * (1 + index * 0.2);
      meshRef.current.rotation.y = state.clock.elapsedTime * (1.2 + index * 0.15);
    }
  });
  return (
    <group position={[3.6 * Math.cos(angle), Math.sin(angle * 2) * 0.5, 3.6 * Math.sin(angle)]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial color={index % 2 === 0 ? "#D4A853" : "#00C6AE"} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

const Satellites: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i * Math.PI * 2) / 5;
        return <SatelliteOrb key={i} index={i} angle={angle} />;
      })}
    </group>
  );
};

/* ── Radar Rings ── */
const RadarRings: React.FC = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + (state.clock.elapsedTime * 0.5) % 3;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 * (1 - (scale - 1) / 3);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3.0, 3.05, 64]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

/* ── Floating Particles ── */
const Particles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 50;
  
  const [particlesPosition] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05 + state.pointer.x * 0.5;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.025 - state.pointer.y * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00C6AE" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

/* ── Mouse Tracker Light ── */
const MouseTracker: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (lightRef.current) {
      const x = (state.pointer.x * viewport.width) / 2;
      const y = (state.pointer.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 4);
    }
  });

  return <pointLight ref={lightRef} distance={10} intensity={2.5} color="#00C6AE" />;
};

/* ── Main SecurityGlobe Component ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScrollRotator: React.FC<{ scrollYProgress?: any, children: React.ReactNode }> = ({ scrollYProgress, children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const scrollVal = scrollYProgress ? scrollYProgress.get() : 0;
      
      // Rotation based on scroll and mouse (Enhanced parallax)
      const scrollRotY = scrollVal * Math.PI * 4.0; // spin as scroll
      const scrollRotX = scrollVal * Math.PI * 1.5; // tilt heavily
      
      const mouseX = state.pointer.x * 2.5;
      const mouseY = state.pointer.y * 2.5;
      
      targetRotation.current.y = (state.clock.elapsedTime * 0.1) + scrollRotY + mouseX;
      targetRotation.current.x = (Math.sin(state.clock.elapsedTime * 0.05) * 0.2) - mouseY + scrollRotX;
      targetRotation.current.z = (Math.cos(state.clock.elapsedTime * 0.03) * 0.1) + (mouseX * 0.5);
      
      // Scale based on scroll
      targetScale.current = 1 + (scrollVal * 1.8); // grow heavily
      
      // Smooth interpolation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, delta * 5);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, delta * 5);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation.current.z, delta * 5);
      
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale.current, delta * 6);
      groupRef.current.scale.set(s, s, s);
      
      // Shift position based on mouse for extra depth
      const targetPosX = 1.2 - scrollVal * 3.5 + (state.pointer.x * 0.5);
      const targetPosY = scrollVal * 1.5 + (state.pointer.y * 0.5);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, delta * 5);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, delta * 5);
    }
  });
  return <group ref={groupRef} position={[1.2, 0, 0]}>{children}</group>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SecurityGlobe: React.FC<{ scrollYProgress?: any }> = ({ scrollYProgress }) => {
  const [manualScans, setManualScans] = useState(0);
  const [status, setStatus] = useState('SECURE');
  const [statusColor, setStatusColor] = useState('#10b981');
  const [shake, setShake] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleGlobeClick = () => {
    setManualScans(prev => prev + 1);
    setStatus('SCANNING...');
    setStatusColor('#F59E0B');
    setShake(2);
    setIsGlitching(true);
    
    setTimeout(() => {
        setShake(0);
        setIsGlitching(false);
    }, 400);
    setTimeout(() => {
      setStatus('SECURE');
      setStatusColor('#10b981');
    }, 1500);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '60%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,198,174,0.06) 0%, rgba(0,198,174,0.03) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.2} />
        <MouseTracker />
        
        <CameraShake 
          maxYaw={0.02} maxPitch={0.02} maxRoll={0.02} 
          yawFrequency={20} pitchFrequency={20} rollFrequency={20} 
          intensity={shake} 
        />
        
        <Stars radius={100} depth={50} count={150} factor={4} saturation={0} fade speed={1} />

        <ScrollRotator scrollYProgress={scrollYProgress}>
          <WireframeGlobe onGlobeClick={handleGlobeClick} />
          <ScanBeam />
          <Satellites />
          <Particles />
          <RadarRings />
        </ScrollRotator>

        {/* Post-processing Effects */}
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={1.0} mipmapBlur resolutionScale={0.25} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {isGlitching ? (<Glitch delay={new THREE.Vector2(0, 0)} duration={new THREE.Vector2(0.1, 0.3)} strength={new THREE.Vector2(0.2, 0.4)} mode={GlitchMode.SPORADIC} active={isGlitching} /> as any) : null}
        </EffectComposer>

        <OrbitControls
          enableZoom={true}
          maxDistance={25}
          minDistance={2}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={Math.PI * 0.1}
          rotateSpeed={1.2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* HUD Overlay: Top-right telemetry */}
      <div style={{
        position: 'absolute', top: '15%', right: '5%',
        pointerEvents: 'none', zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(2, 6, 23, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,198,174,0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          minWidth: '200px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C6AE', boxShadow: '0 0 10px #00C6AE', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', color: 'rgba(0,198,174,0.9)' }}>VAULT_ENGINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>NODES</span>
              <span style={{ color: '#00C6AE', fontWeight: 600 }}>14,204</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>MANUAL SCANS</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{manualScans}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', paddingTop: '4px', borderTop: '1px dotted rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>STATUS</span>
              <span style={{ color: statusColor, fontWeight: 700, transition: 'color 0.3s' }}>{status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityGlobe;
