import { useState, useEffect, useCallback } from 'react';

export interface FractionalFillState {
  angularValue: number;
  microShift: number;
  herculesPoint: [number, number, number];
  secondaryAnchors: Array<{
    name: string;
    position: [number, number, number];
    influence: number;
  }>;
  latticeNodes: Array<{
    id: string;
    position: [number, number, number];
    connections: string[];
    phase: number;
  }>;
}

export function useFractionalFill(initialAngle: number = 0) {
  const [state, setState] = useState<FractionalFillState>({
    angularValue: initialAngle,
    microShift: 0.000000000001,
    herculesPoint: [0, 0, 0],
    secondaryAnchors: [
      { name: 'Eiffel Tower', position: [2, 1, 1], influence: 0.3 },
      { name: 'Lady Liberty', position: [-2, 1, -1], influence: 0.3 }
    ],
    latticeNodes: []
  });

  // Calculate wraparound metrics
  const getWraparoundMetrics = useCallback((angle: number) => {
    const normalized = ((angle % 360) + 360) % 360;
    const distanceToZero = normalized;
    const distanceTo360 = 360 - normalized;
    const nearestWrap = Math.min(distanceToZero, distanceTo360);
    const wraparoundIntensity = Math.max(0, 1 - (nearestWrap / 10));
    
    return {
      normalized,
      distanceToZero,
      distanceTo360,
      nearestWrap,
      wraparoundIntensity,
      isNearWrap: nearestWrap < 1
    };
  }, []);

  // Calculate lattice propagation
  const calculateLatticeInfluence = useCallback((angle: number, microShift: number) => {
    const metrics = getWraparoundMetrics(angle);
    const baseInfluence = 1 + metrics.wraparoundIntensity * 0.5;
    const microInfluence = microShift * 1000000; // Scale for computation
    
    return {
      propagationRate: baseInfluence * (1 + microInfluence),
      fillingIntensity: metrics.wraparoundIntensity + microInfluence * 0.1,
      selfCorrectionFactor: Math.cos((angle * Math.PI) / 180) * 0.1
    };
  }, [getWraparoundMetrics]);

  // Generate lattice nodes based on current state
  const generateLatticeNodes = useCallback((centerPoint: [number, number, number], influence: number) => {
    const nodes = [];
    const gridSize = 3;
    const spacing = 0.8;
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        for (let z = -gridSize; z <= gridSize; z++) {
          const distance = Math.sqrt(x * x + y * y + z * z);
          if (distance <= gridSize && distance > 0) {
            const nodeId = `node_${x}_${y}_${z}`;
            const position: [number, number, number] = [
              centerPoint[0] + x * spacing,
              centerPoint[1] + y * spacing,
              centerPoint[2] + z * spacing
            ];
            
            // Calculate connections to nearby nodes
            const connections: string[] = [];
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                  if (dx === 0 && dy === 0 && dz === 0) continue;
                  const nx = x + dx;
                  const ny = y + dy;
                  const nz = z + dz;
                  const neighborDistance = Math.sqrt(nx * nx + ny * ny + nz * nz);
                  if (neighborDistance <= gridSize && neighborDistance > 0) {
                    connections.push(`node_${nx}_${ny}_${nz}`);
                  }
                }
              }
            }
            
            nodes.push({
              id: nodeId,
              position,
              connections,
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }
    }
    
    return nodes;
  }, []);

  // Update angular value with wraparound handling
  const setAngularValue = useCallback((angle: number) => {
    setState(prev => ({
      ...prev,
      angularValue: angle
    }));
  }, []);

  // Update micro-shift value
  const setMicroShift = useCallback((shift: number) => {
    setState(prev => ({
      ...prev,
      microShift: Math.max(1e-15, Math.min(1e-9, shift))
    }));
  }, []);

  // Add secondary anchor
  const addSecondaryAnchor = useCallback((name: string, position: [number, number, number], influence: number) => {
    setState(prev => ({
      ...prev,
      secondaryAnchors: [
        ...prev.secondaryAnchors,
        { name, position, influence }
      ]
    }));
  }, []);

  // Remove secondary anchor
  const removeSecondaryAnchor = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      secondaryAnchors: prev.secondaryAnchors.filter(anchor => anchor.name !== name)
    }));
  }, []);

  // Update lattice nodes when state changes
  useEffect(() => {
    const influence = calculateLatticeInfluence(state.angularValue, state.microShift);
    const nodes = generateLatticeNodes(state.herculesPoint, influence.propagationRate);
    
    setState(prev => ({
      ...prev,
      latticeNodes: nodes
    }));
  }, [state.angularValue, state.microShift, state.herculesPoint, calculateLatticeInfluence, generateLatticeNodes]);

  return {
    state,
    metrics: getWraparoundMetrics(state.angularValue),
    latticeInfluence: calculateLatticeInfluence(state.angularValue, state.microShift),
    setAngularValue,
    setMicroShift,
    addSecondaryAnchor,
    removeSecondaryAnchor
  };
}
