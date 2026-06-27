import { useRef } from 'react';
import { Group } from 'three';
import AngularSphere from './AngularSphere';
import HerculesPoint from './HerculesPoint';
import MicroShiftParticles from './MicroShiftParticles';
import HelicalOverlay from './HelicalOverlay';
import LivingLattice from './LivingLattice';
import PiPatchSystem from './PiPatchSystem';

interface Props {
  angularValue: number;
  microShift: number;
  showHelices: boolean;
  showLattice: boolean;
  animationSpeed: number;
  quantumPrecision: number;
  piPatchIterations: number;
  helixTurns: number;
  nodeScale: number;
  sceneType: 'base' | 'microshifted';
}

export default function FractionalFillVisualization({
  angularValue,
  microShift,
  showHelices,
  showLattice,
  animationSpeed,
  quantumPrecision,
  piPatchIterations,
  helixTurns,
  nodeScale,
  sceneType
}: Props) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* π Patch Node System */}
      <PiPatchSystem 
        piPatchIterations={piPatchIterations}
        microShift={microShift}
        quantumPrecision={quantumPrecision}
        helixTurns={helixTurns}
        nodeScale={nodeScale}
        rotationSpeed={animationSpeed}
        sceneType={sceneType}
      />
      
      {/* Hercules Point - Primary Anchor */}
      <HerculesPoint 
        position={[0, 0, 0]}
        angularValue={angularValue}
      />
      
      {/* Quantum Fill Particles */}
      <MicroShiftParticles 
        microShift={microShift}
        angularValue={angularValue}
        animationSpeed={animationSpeed}
      />
      
      {/* Helix Web Patterns */}
      {showHelices && (
        <HelicalOverlay 
          angularValue={angularValue}
          microShift={microShift}
          animationSpeed={animationSpeed}
        />
      )}
      
      {/* Parallel Fill Grid */}
      {showLattice && (
        <LivingLattice 
          angularValue={angularValue}
          microShift={microShift}
          animationSpeed={animationSpeed}
        />
      )}
    </group>
  );
}
