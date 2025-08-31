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
  setAnimationSpeed
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
    <Card className="absolute top-4 left-4 w-80 bg-black/80 backdrop-blur-sm border-gray-600 text-white">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          Fractional Fill Controls
          <span className="text-sm">{isExpanded ? '−' : '+'}</span>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Angular Value Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Angular Value (degrees)</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => handleAngularInput(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter angle..."
              />
            </div>
            <Slider
              value={[angularValue % 360]}
              onValueChange={(value) => {
                setAngularValue(value[0]);
                setInputValue(value[0].toString());
              }}
              max={360}
              step={0.001}
              className="w-full"
            />
          </div>

          {/* Preset Angles */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preset Angles</Label>
            <div className="grid grid-cols-3 gap-1">
              {presetAngles.map((angle) => (
                <Button
                  key={angle}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
                  onClick={() => {
                    setAngularValue(angle);
                    setInputValue(angle.toString());
                  }}
                >
                  {angle}°
                </Button>
              ))}
            </div>
          </div>

          {/* Micro-shift Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Micro-shift (×10⁻¹²): {microShift.toExponential(3)}
            </Label>
            <Slider
              value={[Math.log10(microShift * 1e12)]}
              onValueChange={(value) => setMicroShift(Math.pow(10, value[0]) / 1e12)}
              min={-3}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Animation Speed */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Animation Speed: {animationSpeed.toFixed(1)}x
            </Label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => setAnimationSpeed(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Visual Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Helical Overlays</Label>
              <Switch
                checked={showHelices}
                onCheckedChange={setShowHelices}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Living Lattice</Label>
              <Switch
                checked={showLattice}
                onCheckedChange={setShowLattice}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                onClick={() => {
                  const target = 359.999999;
                  setAngularValue(target);
                  setInputValue(target.toString());
                }}
              >
                Wraparound
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                onClick={() => {
                  setAngularValue(0);
                  setInputValue('0');
                  setMicroShift(0.000000000001);
                  setAnimationSpeed(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
