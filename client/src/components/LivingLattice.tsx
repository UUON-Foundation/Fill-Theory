import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, Color } from 'three';
import * as THREE from 'three';

interface Props {
  angularValue: number;
  microShift: number;
  animationSpeed: number;
}

interface LatticeNode {
  position: Vector3;
  connections: number[];
  phase: number;
  amplitude: number;
}

export default function LivingLattice({ angularValue, microShift, animationSpeed }: Props) {
  const groupRef = useRef<Group>(null);

  // Generate lattice nodes and connections
  const latticeSystem = useMemo(() => {
    const nodes: LatticeNode[] = [];
    const gridSize = 5;
    const spacing = 1.2;
    const offset = -(gridSize - 1) * spacing / 2;

    // Create grid nodes
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          nodes.push({
            position: new Vector3(
              offset + x * spacing,
              offset + y * spacing,
              offset + z * spacing
            ),
            connections: [],
            phase: Math.random() * Math.PI * 2,
            amplitude: 0.5 + Math.random() * 0.5
          });
        }
      }
    }

    // Create connections between nearby nodes
    nodes.forEach((node, index) => {
      nodes.forEach((otherNode, otherIndex) => {
        if (index !== otherIndex) {
          const distance = node.position.distanceTo(otherNode.position);
          if (distance <= spacing * 1.5) {
            node.connections.push(otherIndex);
          }
        }
      });
    });

    return nodes;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      
      // Global lattice transformations
      groupRef.current.rotation.y = (angularValue * Math.PI) / 180 * 0.05;
      
      // Apply micro-shift to overall scale
      const microInfluence = microShift * 1000000;
      const microScale = 1 + Math.sin(time * 3) * microInfluence * 0.05;
      groupRef.current.scale.setScalar(microScale);

      // Animate individual nodes
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Group && latticeSystem[index]) {
          const node = latticeSystem[index];
          const nodeTime = time + node.phase;
          
          // Self-correcting oscillation
          const oscillation = Math.sin(nodeTime) * node.amplitude * 0.1;
          const correction = Math.cos(nodeTime * 0.5) * 0.05;
          
          // Apply wraparound influence
          const nearWrap = Math.min(angularValue % 360, 360 - (angularValue % 360));
          const wrapInfluence = Math.max(0, 1 - (nearWrap / 90));
          const wrapOscillation = Math.sin(nodeTime * 2) * wrapInfluence * 0.1;
          
          child.position.copy(node.position);
          child.position.y += oscillation + correction + wrapOscillation;
          
          // Scale based on activity
          const activity = 1 + (oscillation + wrapOscillation) * 2;
          child.scale.setScalar(Math.max(0.1, activity));
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {latticeSystem.map((node, index) => (
        <group key={`node-${index}`} position={node.position}>
          {/* Node core */}
          <mesh>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Node connections */}
          {node.connections.map((connectionIndex) => {
            const connectedNode = latticeSystem[connectionIndex];
            if (connectedNode && connectionIndex > index) { // Avoid duplicate connections
              const direction = connectedNode.position.clone().sub(node.position);
              const length = direction.length();
              const midpoint = node.position.clone().add(direction.clone().multiplyScalar(0.5));
              
              return (
                <mesh
                  key={`connection-${index}-${connectionIndex}`}
                  position={midpoint.clone().sub(node.position)}
                  rotation={[
                    0,
                    Math.atan2(direction.x, direction.z),
                    Math.asin(direction.y / length)
                  ]}
                >
                  <cylinderGeometry args={[0.005, 0.005, length]} />
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
          
          {/* Energy pulse indicators */}
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              transparent
              opacity={0.1 + node.amplitude * 0.2}
            />
          </mesh>
        </group>
      ))}
      
      {/* Lattice boundary visualization */}
      <mesh>
        <boxGeometry args={[6, 6, 6]} />
        <meshStandardMaterial
          color="#000000"
          wireframe={true}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
