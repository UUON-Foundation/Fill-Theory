import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import "@fontsource/inter";
import FractionalFillVisualization from "./components/FractionalFillVisualization";
import ControlPanel from "./components/ControlPanel";
import PrecisionReadout from "./components/PrecisionReadout";

function App() {
  const [angularValue, setAngularValue] = useState(0);
  const [microShift, setMicroShift] = useState(0.000000000001);
  const [showHelices, setShowHelices] = useState(true);
  const [showLattice, setShowLattice] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 0, 8],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#000000"]} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#4a90e2" />
        
        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          autoRotate={false}
        />
        
        <Suspense fallback={null}>
          <FractionalFillVisualization 
            angularValue={angularValue}
            microShift={microShift}
            showHelices={showHelices}
            showLattice={showLattice}
            animationSpeed={animationSpeed}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <ControlPanel 
        angularValue={angularValue}
        setAngularValue={setAngularValue}
        microShift={microShift}
        setMicroShift={setMicroShift}
        showHelices={showHelices}
        setShowHelices={setShowHelices}
        showLattice={showLattice}
        setShowLattice={setShowLattice}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
      />
      
      <PrecisionReadout 
        angularValue={angularValue}
        microShift={microShift}
      />
    </div>
  );
}

export default App;
