import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, SphereGeometry, MeshPhongMaterial, Color } from 'three';
import * as THREE from 'three';

interface Props {
  angularValue: number;
  microShift: number;
  animationSpeed: number;
}

export default function AngularSphere({ angularValue, microShift, animationSpeed }: Props) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshPhongMaterial>(null);

  // Create sphere geometry with high detail for smooth wraparound visualization
  const geometry = useMemo(() => new SphereGeometry(2, 64, 32), []);
  
  // Calculate wraparound position and color based on angular value
  const { normalizedAngle, wraparoundIntensity, color } = useMemo(() => {
    const normalized = ((angularValue % 360) + 360) % 360;
    const nearWrap = Math.min(normalized, 360 - normalized);
    const intensity = Math.max(0, 1 - (nearWrap / 10)); // Intensity increases near 0° and 360°
    
    // Color shifts from blue to red as we approach wraparound
    const baseColor = new Color('#4a90e2');
    const wrapColor = new Color('#e24a4a');
    const finalColor = baseColor.clone().lerp(wrapColor, intensity);
    
    return {
      normalizedAngle: normalized,
      wraparoundIntensity: intensity,
      color: finalColor
    };
  }, [angularValue]);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Rotate sphere based on angular value
      meshRef.current.rotation.y = (angularValue * Math.PI) / 180;
      
      // Add micro-shift visualization through subtle material changes
      const time = state.clock.elapsedTime * animationSpeed;
      const microInfluence = Math.sin(time * 10) * microShift * 1000000;
      
      // Update material color to show wraparound and micro-shifts
      materialRef.current.color.copy(color);
      materialRef.current.emissive.setScalar(wraparoundIntensity * 0.3 + microInfluence * 0.1);
      
      // Visual feedback for the critical 359.999...° to 0° transition
      if (wraparoundIntensity > 0.5) {
        materialRef.current.emissive.add(new Color(0.2, 0.1, 0.0));
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhongMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.8}
        wireframe={false}
      />
      
      {/* Wireframe overlay to show angular grid */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Angular degree markers */}
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x = Math.cos(angle) * 2.1;
        const z = Math.sin(angle) * 2.1;
        const isNearCurrent = Math.abs(((i * 10) - angularValue + 180) % 360 - 180) < 30;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial 
              color={isNearCurrent ? "#ffff00" : "#888888"}
              transparent
              opacity={isNearCurrent ? 0.9 : 0.3}
            />
          </mesh>
        );
      })}
    </mesh>
  );
}
