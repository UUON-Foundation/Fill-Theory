import { useRef } from 'react';
import { Group } from 'three';
import AngularSphere from './AngularSphere';
import HerculesPoint from './HerculesPoint';
import MicroShiftParticles from './MicroShiftParticles';
import HelicalOverlay from './HelicalOverlay';
import LivingLattice from './LivingLattice';

interface Props {
  angularValue: number;
  microShift: number;
  showHelices: boolean;
  showLattice: boolean;
  animationSpeed: number;
}

export default function FractionalFillVisualization({
  angularValue,
  microShift,
  showHelices,
  showLattice,
  animationSpeed
}: Props) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main Angular Sphere */}
      <AngularSphere 
        angularValue={angularValue}
        microShift={microShift}
        animationSpeed={animationSpeed}
      />
      
      {/* Hercules Point - Primary Anchor */}
      <HerculesPoint 
        position={[0, 0, 0]}
        angularValue={angularValue}
      />
      
      {/* Micro-shift Particle System */}
      <MicroShiftParticles 
        microShift={microShift}
        angularValue={angularValue}
        animationSpeed={animationSpeed}
      />
      
      {/* Helical Overlay Patterns */}
      {showHelices && (
        <HelicalOverlay 
          angularValue={angularValue}
          microShift={microShift}
          animationSpeed={animationSpeed}
        />
      )}
      
      {/* Living Lattice System */}
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
