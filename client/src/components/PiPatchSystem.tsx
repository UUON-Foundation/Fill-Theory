import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';

interface Props {
  piPatchIterations: number;
  microShift: number;
  quantumPrecision: number;
  helixTurns: number;
  nodeScale: number;
  rotationSpeed: number;
  sceneType: 'base' | 'microshifted';
}

interface PatchNode {
  shape: string;
  theta: number;
  value: number;
  iteration: number;
  shapeIndex: number;
}

// Mathematical constants for π patch generation
const CONSTANTS = {
  pi: 3.141592653589793,
  phi: 1.618033988749895,
  sqrt2: 1.4142135623730951,
  sqrt3: 1.7320508075688772,
  e: 2.718281828459045
};

export default function PiPatchSystem({ 
  piPatchIterations, 
  microShift, 
  quantumPrecision,
  helixTurns,
  nodeScale,
  rotationSpeed,
  sceneType 
}: Props) {
  const groupRef = useRef<Group>(null);
  
  // Generate π patch nodes
  const patchNodes = useMemo(() => {
    const shapes = ["triangle", "square", "pentagon", "circle", "spiral"];
    const nodes: PatchNode[] = [];
    
    // Apply micro-shift only for Scene B
    const shift = sceneType === 'microshifted' ? microShift : 0;
    
    for (let i = 0; i < piPatchIterations; i++) {
      shapes.forEach((shape, shapeIndex) => {
        // Apply quantum decimal precision to angle calculation
        let baseTheta = (i * CONSTANTS.pi * (shapeIndex + 1)) % 360;
        let theta = (baseTheta + shift * 360) % 360;
        
        nodes.push({
          shape: shape,
          theta: theta,
          value: theta / 360,
          iteration: i,
          shapeIndex: shapeIndex
        });
      });
    }
    
    return nodes;
  }, [piPatchIterations, microShift, quantumPrecision, sceneType]);
  
  // Create geometry for different shapes
  const createNodeGeometry = (shape: string) => {
    switch (shape) {
      case 'triangle':
        return new THREE.TetrahedronGeometry(0.3);
      case 'square':
        return new THREE.BoxGeometry(0.5, 0.5, 0.5);
      case 'pentagon':
        return new THREE.CylinderGeometry(0.3, 0.3, 0.1, 5);
      case 'circle':
        return new THREE.SphereGeometry(0.25, 16, 16);
      case 'spiral':
        return new THREE.TorusGeometry(0.25, 0.08, 8, 32);
      default:
        return new THREE.SphereGeometry(0.25, 16, 16);
    }
  };
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate all nodes based on rotation speed
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && patchNodes[index]) {
          child.rotation.y += rotationSpeed;
          child.scale.setScalar(nodeScale);
          
          // Add subtle oscillation based on the node's value
          const oscillation = Math.sin(time * 2 + patchNodes[index].value * Math.PI * 2) * 0.1;
          child.position.y = Math.sin(patchNodes[index].value * Math.PI * 2) * 2 + oscillation;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {patchNodes.map((node, index) => {
        const radius = 5;
        const angle = node.theta * Math.PI / 180;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(node.value * Math.PI * 2) * 2;
        
        return (
          <mesh 
            key={`${node.shape}-${index}`}
            position={[x, y, z]}
            geometry={createNodeGeometry(node.shape)}
          >
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Add helix connections between nodes */}
      {patchNodes.slice(0, Math.min(20, patchNodes.length)).map((node, index) => {
        const nextNode = patchNodes[(index + 1) % patchNodes.length];
        if (!nextNode) return null;
        
        // Create helix curve between nodes
        const startRadius = 5;
        const startAngle = node.theta * Math.PI / 180;
        const endAngle = nextNode.theta * Math.PI / 180;
        
        const points: THREE.Vector3[] = [];
        const segments = 20;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const angle = startAngle + (endAngle - startAngle) * t;
          const helixAngle = t * Math.PI * 2 * helixTurns;
          const radius = startRadius + Math.sin(helixAngle) * 0.5;
          
          points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(node.value * Math.PI * 2) * 2 + Math.sin(helixAngle) * 0.3,
            Math.sin(angle) * radius
          ));
        }
        
        if (points.length > 1) {
          const curve = new THREE.CatmullRomCurve3(points);
          const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
          
          return (
            <mesh key={`helix-${index}`} geometry={tubeGeometry}>
              <meshStandardMaterial
                color="#000000"
                wireframe={true}
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}