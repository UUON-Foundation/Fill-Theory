import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, CatmullRomCurve3, Vector3, TubeGeometry, MeshBasicMaterial } from 'three';
import * as THREE from 'three';

interface Props {
  angularValue: number;
  microShift: number;
  animationSpeed: number;
}

export default function HelicalOverlay({ angularValue, microShift, animationSpeed }: Props) {
  const groupRef = useRef<Group>(null);

  // Generate helical curves
  const helices = useMemo(() => {
    const helixCount = 3;
    return Array.from({ length: helixCount }, (_, helixIndex) => {
      const points: Vector3[] = [];
      const radius = 2.5 + helixIndex * 0.5;
      const height = 6;
      const turns = 2 + helixIndex;
      const pointCount = 100;
      
      for (let i = 0; i <= pointCount; i++) {
        const t = i / pointCount;
        const angle = t * turns * Math.PI * 2;
        const y = (t - 0.5) * height;
        
        const x = Math.cos(angle + helixIndex * Math.PI / 3) * radius;
        const z = Math.sin(angle + helixIndex * Math.PI / 3) * radius;
        
        points.push(new Vector3(x, y, z));
      }
      
      const curve = new CatmullRomCurve3(points);
      const geometry = new TubeGeometry(curve, 100, 0.02, 8, false);
      
      return {
        geometry,
        curve,
        helixIndex,
        color: new THREE.Color().setHSL((helixIndex * 0.3) % 1, 0.7, 0.6)
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      
      // Rotate helices based on angular value
      groupRef.current.rotation.y = (angularValue * Math.PI) / 180 * 0.1;
      
      // Apply micro-shift influences
      const microInfluence = microShift * 1000000;
      groupRef.current.scale.setScalar(1 + Math.sin(time * 5) * microInfluence * 0.1);
      
      // Individual helix animations
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.z = time * (0.5 + index * 0.2);
          
          // Change opacity based on angular proximity to wraparound
          const nearWrap = Math.min(angularValue % 360, 360 - (angularValue % 360));
          const wrapInfluence = Math.max(0, 1 - (nearWrap / 45));
          
          if (child.material instanceof MeshBasicMaterial) {
            child.material.opacity = 0.4 + wrapInfluence * 0.4;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {helices.map((helix, index) => (
        <mesh key={index} geometry={helix.geometry}>
          <meshStandardMaterial
            color="#000000"
            wireframe={true}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      
      {/* Additional helix connectors */}
      {helices.map((_, index) => {
        if (index < helices.length - 1) {
          const radius1 = 2.5 + index * 0.5;
          const radius2 = 2.5 + (index + 1) * 0.5;
          
          return Array.from({ length: 8 }, (_, connectorIndex) => {
            const angle = (connectorIndex * Math.PI * 2) / 8;
            const x1 = Math.cos(angle) * radius1;
            const z1 = Math.sin(angle) * radius1;
            const x2 = Math.cos(angle) * radius2;
            const z2 = Math.sin(angle) * radius2;
            
            const midX = (x1 + x2) / 2;
            const midZ = (z1 + z2) / 2;
            const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
            
            return (
              <mesh 
                key={`connector-${index}-${connectorIndex}`}
                position={[midX, 0, midZ]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[length, 0.01, 0.01]} />
                <meshStandardMaterial
                  color="#000000"
                  wireframe={true}
                  transparent
                  opacity={0.4}
                />
              </mesh>
            );
          });
        }
        return null;
      })}
    </group>
  );
}
