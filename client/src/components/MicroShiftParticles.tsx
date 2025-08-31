import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, PointsMaterial, BufferAttribute, Color } from 'three';
import * as THREE from 'three';

interface Props {
  microShift: number;
  angularValue: number;
  animationSpeed: number;
}

export default function MicroShiftParticles({ microShift, angularValue, animationSpeed }: Props) {
  const pointsRef = useRef<Points>(null);
  const particleCount = 1000;

  // Generate particle positions and properties
  const { positions, colors, sizes } = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);
    
    const baseColor = new Color('#4a90e2');
    const shiftColor = new Color('#e24a90');
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles in a sphere around the main visualization
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i3 + 2] = radius * Math.cos(phi);
      
      // Color based on micro-shift influence
      const shiftInfluence = Math.random();
      const finalColor = baseColor.clone().lerp(shiftColor, shiftInfluence);
      
      colorArray[i3] = finalColor.r;
      colorArray[i3 + 1] = finalColor.g;
      colorArray[i3 + 2] = finalColor.b;
      
      // Size based on micro-shift magnitude
      sizeArray[i] = 1 + Math.random() * 3;
    }
    
    return {
      positions: posArray,
      colors: colorArray,
      sizes: sizeArray
    };
  }, []);

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    geom.setAttribute('color', new BufferAttribute(colors, 3));
    geom.setAttribute('size', new BufferAttribute(sizes, 1));
    return geom;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      const positionAttr = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
      const sizeAttr = pointsRef.current.geometry.getAttribute('size') as BufferAttribute;
      
      // Animate particles based on micro-shift and angular value
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Get current position
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Apply micro-shift influence
        const microInfluence = microShift * 1000000; // Scale up for visibility
        const angularInfluence = Math.sin((angularValue * Math.PI) / 180 + time + i * 0.1);
        
        // Create subtle movement based on micro-shifts
        const offsetX = Math.sin(time + i * 0.1) * microInfluence * 0.1;
        const offsetY = Math.cos(time + i * 0.1) * microInfluence * 0.1;
        const offsetZ = Math.sin(time * 0.5 + i * 0.05) * microInfluence * 0.1;
        
        positionAttr.setXYZ(i, x + offsetX, y + offsetY, z + offsetZ);
        
        // Animate size based on angular proximity to wraparound
        const nearWrap = Math.min(angularValue % 360, 360 - (angularValue % 360));
        const wrapInfluence = Math.max(0, 1 - (nearWrap / 90));
        const newSize = sizes[i] * (1 + wrapInfluence * 0.5 + angularInfluence * 0.2);
        
        sizeAttr.setX(i, Math.max(0.1, newSize));
      }
      
      positionAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      
      // Rotate the entire particle system slowly
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.6}
        size={0.05}
        sizeAttenuation={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
