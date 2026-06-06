import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const ChipMesh: React.FC<{ tilt: { x: number; y: number } }> = ({ tilt }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Gently respond to the card tilt, adding a slight parallax
      // React Three Fiber uses radians. Tilt from the card is in degrees.
      // We dampen it for the chip so it feels embedded but reactive.
      const targetRotationX = (tilt.x * Math.PI) / 180 * 0.5;
      const targetRotationY = (tilt.y * Math.PI) / 180 * 0.5;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[3.6, 2.6, 0.1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial
          color="#ffd700"
          metalness={1}
          roughness={0.2}
          envMapIntensity={2}
        />
      </RoundedBox>
      {/* Decorative inner circuit lines carved out slightly */}
      <RoundedBox args={[3.2, 2.2, 0.11]} radius={0.1} smoothness={4} position={[0, 0, 0.01]}>
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.8}
          roughness={0.4}
        />
      </RoundedBox>
      {/* Central line */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[3.2, 0.1, 0.01]} />
        <meshStandardMaterial color="#8b6508" metalness={0.9} roughness={0.5} />
      </mesh>
      {/* Vertical line */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.1, 2.2, 0.01]} />
        <meshStandardMaterial color="#8b6508" metalness={0.9} roughness={0.5} />
      </mesh>
    </group>
  );
};

export const EMVChip3D: React.FC<{ tilt?: { x: number; y: number } }> = ({ tilt = { x: 0, y: 0 } }) => {
  return (
    <div className="w-[45px] h-[32px] relative z-20 pointer-events-none mb-4">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
        
        <ChipMesh tilt={tilt} />
        
        {/* Environment reflection mapping for the gold material */}
        <Environment preset="studio" />
        
        {/* Soft shadow cast directly under the chip onto the card surface */}
        <ContactShadows position={[0, 0, -0.05]} opacity={0.4} scale={5} blur={1} far={0.5} color="#000000" />
      </Canvas>
    </div>
  );
};
