import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  angularValue: number;
}

export default function HerculesPoint({ position, angularValue }: Props) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);

  // Generate constellation pattern around Hercules Point
  const constellationPoints = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const radius = 0.5 + Math.random() * 0.3;
      return {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 0.4,
        z: Math.sin(angle) * radius,
        intensity: 0.3 + Math.random() * 0.7
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current && coreRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle pulsing animation
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      
      // Rotate constellation slowly
      groupRef.current.rotation.y = time * 0.1;
      
      // React to angular changes - more intense near wraparound
      const nearWrap = Math.min(angularValue % 360, 360 - (angularValue % 360));
      const wrapInfluence = Math.max(0, 1 - (nearWrap / 45));
      coreRef.current.scale.multiplyScalar(1 + wrapInfluence * 0.3);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core Hercules Point */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.15, 2]} />
        <meshStandardMaterial
          color="#000000"
          wireframe={true}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.82, 32]} />
        <meshBasicMaterial
          color="#000000"
          wireframe={true}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Constellation points */}
      {constellationPoints.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#000000"
            wireframe={true}
            transparent
            opacity={point.intensity * 0.7}
          />
        </mesh>
      ))}
      
      {/* Energy connections */}
      {constellationPoints.slice(0, 6).map((point, i) => {
        const nextPoint = constellationPoints[(i + 1) % 6];
        const midX = (point.x + nextPoint.x) / 2;
        const midY = (point.y + nextPoint.y) / 2;
        const midZ = (point.z + nextPoint.z) / 2;
        
        return (
          <mesh key={`connection-${i}`} position={[midX, midY, midZ]}>
            <boxGeometry args={[0.01, 0.01, 0.2]} />
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
