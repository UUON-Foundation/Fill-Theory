import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  angularValue: number;
  microShift: number;
}

export default function PrecisionReadout({ angularValue, microShift }: Props) {
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
    <Card className="absolute top-4 right-4 w-72 bg-black/80 backdrop-blur-sm border-gray-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Precision Readout</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 text-sm">
        {/* Primary Angular Data */}
        <div className="space-y-1">
          <div className="text-yellow-400 font-medium">Angular System</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Raw Angle:</div>
            <div className="font-mono">{angularValue.toFixed(6)}°</div>
            <div>Normalized:</div>
            <div className="font-mono">{calculations.normalizedAngle.toFixed(6)}°</div>
            <div>To 0°:</div>
            <div className="font-mono">{calculations.distanceToZero.toFixed(6)}°</div>
            <div>To 360°:</div>
            <div className="font-mono">{calculations.distanceTo360.toFixed(6)}°</div>
          </div>
        </div>

        {/* Wraparound Metrics */}
        <div className="space-y-1">
          <div className="text-blue-400 font-medium">Wraparound Analysis</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Nearest Wrap:</div>
            <div className="font-mono">{calculations.nearestWrap.toFixed(9)}°</div>
            <div>Intensity:</div>
            <div className="font-mono">{(calculations.wraparoundIntensity * 100).toFixed(2)}%</div>
            <div>Status:</div>
            <div className={`font-mono ${calculations.nearestWrap < 1 ? 'text-red-400' : 'text-green-400'}`}>
              {calculations.nearestWrap < 1 ? 'CRITICAL' : 'STABLE'}
            </div>
          </div>
        </div>

        {/* Fractional Fill Theory */}
        <div className="space-y-1">
          <div className="text-purple-400 font-medium">Fractional Fill</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Micro-shift:</div>
            <div className="font-mono">{microShift.toExponential(3)}</div>
            <div>Micro-gap:</div>
            <div className="font-mono">{calculations.microGap.toFixed(3)}</div>
            <div>Fill Ratio:</div>
            <div className="font-mono">{(calculations.fillRatio * 100).toFixed(3)}%</div>
            <div>Lattice Align:</div>
            <div className="font-mono">{calculations.latticeAlignment.toFixed(6)}</div>
          </div>
        </div>

        {/* Hercules Point Reference */}
        <div className="space-y-1">
          <div className="text-orange-400 font-medium">Hercules Point</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Anchor Status:</div>
            <div className="text-green-400 font-mono">ACTIVE</div>
            <div>Reference:</div>
            <div className="font-mono">0°, 0°, 0°</div>
            <div>Propagation:</div>
            <div className={`font-mono ${calculations.wraparoundIntensity > 0.5 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {calculations.wraparoundIntensity > 0.5 ? 'ENHANCED' : 'NORMAL'}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-1">
          <div className="text-green-400 font-medium">System Health</div>
          <div className="text-xs">
            <div className="flex justify-between">
              <span>Rhythm Coherence:</span>
              <span className="font-mono text-green-400">
                {((1 - calculations.nearestWrap / 360) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Self-Correction:</span>
              <span className="font-mono text-blue-400">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Lattice Stability:</span>
              <span className={`font-mono ${Math.abs(calculations.latticeAlignment) > 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
                {Math.abs(calculations.latticeAlignment) > 0.7 ? 'HIGH' : 'MEDIUM'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
