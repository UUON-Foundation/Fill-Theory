import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  angularValue: number;
  microShift: number;
  quantumPrecision: number;
  piPatchIterations: number;
  helixTurns: number;
}

export default function PrecisionReadout({ angularValue, microShift, quantumPrecision, piPatchIterations, helixTurns }: Props) {
  const calculations = useMemo(() => {
    const normalizedAngle = ((angularValue % 360) + 360) % 360;
    const distanceToZero = normalizedAngle;
    const distanceTo360 = 360 - normalizedAngle;
    const nearestWrap = Math.min(distanceToZero, distanceTo360);
    const wraparoundIntensity = Math.max(0, 1 - (nearestWrap / 10));
    
    // Calculate fractional fill metrics
    const microGap = microShift * 1e12; // Scale for display
    const fillRatio = 1 - (nearestWrap / 360);
    const latticeAlignment = Math.cos((normalizedAngle * Math.PI) / 180);
    
    return {
      normalizedAngle,
      distanceToZero,
      distanceTo360,
      nearestWrap,
      wraparoundIntensity,
      microGap,
      fillRatio,
      latticeAlignment
    };
  }, [angularValue, microShift]);

  return (
    <Card className="absolute bottom-4 right-4 w-72" style={{
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid black',
      borderRadius: '8px',
      fontFamily: 'Courier New, monospace',
      fontSize: '11px',
      color: '#333',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm" style={{ color: '#222', fontFamily: 'Courier New, monospace', margin: '0 0 10px 0' }}>Fill Theory: Closing the Gap</CardTitle>
        <p style={{ fontSize: '11px', margin: '0', color: '#333' }}>
          <strong>Author:</strong> Phillip A. Ruiz III<br/>
          <strong>Foundation:</strong> UUON Foundation Inc.
        </p>
      </CardHeader>
      
      <CardContent style={{ fontFamily: 'Courier New, monospace' }}>
        <div style={{
          fontSize: '10px',
          marginTop: '10px',
          padding: '8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          borderLeft: '4px solid #333'
        }}>
          <strong>Current Gap:</strong> <span style={{
            fontFamily: 'monospace',
            background: '#f5f5f5',
            padding: '3px 6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '11px'
          }}>{(359.999 + microShift).toFixed(quantumPrecision)}°</span><br/>
          <strong>Quantum Nodes:</strong> <span style={{
            fontFamily: 'monospace',
            background: '#f5f5f5',
            padding: '3px 6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '11px'
          }}>{piPatchIterations * 5}</span><br/>
          <strong>Parallel Fill State:</strong> <span style={{
            fontFamily: 'monospace',
            background: '#f5f5f5',
            padding: '3px 6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '11px'
          }}>{calculations.wraparoundIntensity > 0.3 ? 'Dense' : 'Active'}</span><br/>
          <strong>Helix Density:</strong> <span style={{
            fontFamily: 'monospace',
            background: '#f5f5f5',
            padding: '3px 6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '11px'
          }}>{helixTurns}x</span>
        </div>
        
        <p style={{ marginTop: '10px', fontSize: '10px', color: '#333' }}>
          <strong>Core Principle:</strong> {quantumPrecision}-decimal quantum shifts enable predictive rollover and nested loop stabilization through micro-fraction bridging.
        </p>
      </CardContent>
    </Card>
  );
}
