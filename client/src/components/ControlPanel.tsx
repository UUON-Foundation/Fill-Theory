import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  angularValue: number;
  setAngularValue: (value: number) => void;
  microShift: number;
  setMicroShift: (value: number) => void;
  showHelices: boolean;
  setShowHelices: (value: boolean) => void;
  showLattice: boolean;
  setShowLattice: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  quantumPrecision: number;
  setQuantumPrecision: (value: number) => void;
  piPatchIterations: number;
  setPiPatchIterations: (value: number) => void;
  helixTurns: number;
  setHelixTurns: (value: number) => void;
  nodeScale: number;
  setNodeScale: (value: number) => void;
}

export default function ControlPanel({
  angularValue,
  setAngularValue,
  microShift,
  setMicroShift,
  showHelices,
  setShowHelices,
  showLattice,
  setShowLattice,
  animationSpeed,
  setAnimationSpeed,
  quantumPrecision,
  setQuantumPrecision,
  piPatchIterations,
  setPiPatchIterations,
  helixTurns,
  setHelixTurns,
  nodeScale,
  setNodeScale
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState(angularValue.toString());

  const handleAngularInput = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAngularValue(numValue);
    }
  };

  const presetAngles = [0, 45, 90, 135, 180, 225, 270, 315, 359.999, 359.9999, 359.99999];

  return (
    <Card className="absolute top-4 left-4 w-80" style={{
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid black',
      borderRadius: '8px',
      fontFamily: 'Courier New, monospace',
      fontSize: '12px',
      color: '#333',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center justify-between" style={{ color: '#222', fontFamily: 'Courier New, monospace' }}>
          Fill Theory Controls
          <span className="text-sm">{isExpanded ? '−' : '+'}</span>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4" style={{ fontFamily: 'Courier New, monospace' }}>
          {/* Angular Value Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Micro-Shift (δ):</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {microShift.toFixed(6)}
              </span>
            </div>
            <Slider
              value={[microShift * 1000]}
              onValueChange={(value) => setMicroShift(value[0] / 1000)}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Quantum Precision Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Quantum Precision:</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {quantumPrecision}
              </span>
            </div>
            <Slider
              value={[quantumPrecision]}
              onValueChange={(value) => setQuantumPrecision(value[0])}
              min={6}
              max={15}
              step={1}
              className="w-full"
            />
          </div>

          {/* π Patch Iterations */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>π Patch Iterations:</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {piPatchIterations}
              </span>
            </div>
            <Slider
              value={[piPatchIterations]}
              onValueChange={(value) => setPiPatchIterations(value[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Helix Turns Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Helix Turns:</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {helixTurns}
              </span>
            </div>
            <Slider
              value={[helixTurns]}
              onValueChange={(value) => setHelixTurns(value[0])}
              min={1}
              max={12}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rotation Speed */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Rotation Speed:</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {animationSpeed.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => setAnimationSpeed(value[0])}
              min={0}
              max={0.1}
              step={0.001}
              className="w-full"
            />
          </div>

          {/* Node Scale Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Node Scale:</Label>
            <div className="flex space-x-2">
              <span className="text-xs" style={{
                fontFamily: 'monospace',
                background: '#f5f5f5',
                padding: '3px 6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '11px'
              }}>
                {nodeScale.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[nodeScale]}
              onValueChange={(value) => setNodeScale(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Component Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Helix Web</Label>
              <Switch
                checked={showHelices}
                onCheckedChange={setShowHelices}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>Parallel Fill</Label>
              <Switch
                checked={showLattice}
                onCheckedChange={setShowLattice}
              />
            </div>
          </div>

          {/* System Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: '#333', fontWeight: 'bold' }}>System Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #ccc',
                  color: '#333',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '11px'
                }}
                onClick={() => {
                  setMicroShift(0.001);
                  setQuantumPrecision(12);
                  setAnimationSpeed(0.01);
                }}
              >
                Initialize
              </Button>
              <Button
                variant="outline"
                size="sm"
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #ccc',
                  color: '#333',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '11px'
                }}
                onClick={() => {
                  setMicroShift(0.0001);
                  setQuantumPrecision(15);
                  setHelixTurns(8);
                  setNodeScale(1.5);
                }}
              >
                Enhance
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
