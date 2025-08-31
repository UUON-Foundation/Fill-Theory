import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import FractionalFillVisualization from "./components/FractionalFillVisualization";
import ControlPanel from "./components/ControlPanel";
import PrecisionReadout from "./components/PrecisionReadout";

function App() {
  const [angularValue, setAngularValue] = useState(0);
  const [microShift, setMicroShift] = useState(0.001);
  const [showHelices, setShowHelices] = useState(true);
  const [showLattice, setShowLattice] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [quantumPrecision, setQuantumPrecision] = useState(12);
  const [piPatchIterations, setPiPatchIterations] = useState(50);
  const [helixTurns, setHelixTurns] = useState(5);
  const [nodeScale, setNodeScale] = useState(1.0);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'white',
      fontFamily: 'Courier New, monospace'
    }}>
      {/* Scene Labels */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '25%',
        transform: 'translateX(-50%)',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333',
        background: 'rgba(255,255,255,0.9)',
        padding: '5px 10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        zIndex: 10
      }}>
        Scene A: Base π Patch
      </div>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '25%',
        transform: 'translateX(50%)',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333',
        background: 'rgba(255,255,255,0.9)',
        padding: '5px 10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        zIndex: 10
      }}>
        Scene B: Micro-Shifted
      </div>
      {/* Dual Scene Canvas Layout */}
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* Scene A: Base π Patch */}
        <div style={{ width: '50%', height: '100%' }}>
          <Canvas
            shadows
            camera={{
              position: [0, 10, 20],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#ffffff"]} />
            
            {/* Lighting for wireframe visibility */}
            <ambientLight intensity={0.6} color="#404040" />
            <directionalLight 
              position={[10, 20, 10]} 
              intensity={1.2}
              color="#333333"
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Camera Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              autoRotate={false}
            />
            
            <Suspense fallback={null}>
              <FractionalFillVisualization 
                angularValue={angularValue}
                microShift={0}
                showHelices={showHelices}
                showLattice={showLattice}
                animationSpeed={animationSpeed}
                quantumPrecision={quantumPrecision}
                piPatchIterations={piPatchIterations}
                helixTurns={helixTurns}
                nodeScale={nodeScale}
                sceneType="base"
              />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Scene B: Micro-Shifted */}
        <div style={{ width: '50%', height: '100%' }}>
          <Canvas
            shadows
            camera={{
              position: [0, 10, 20],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#ffffff"]} />
            
            {/* Lighting for wireframe visibility */}
            <ambientLight intensity={0.6} color="#404040" />
            <directionalLight 
              position={[10, 20, 10]} 
              intensity={1.2}
              color="#333333"
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Camera Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              autoRotate={false}
            />
            
            <Suspense fallback={null}>
              <FractionalFillVisualization 
                angularValue={angularValue}
                microShift={microShift}
                showHelices={showHelices}
                showLattice={showLattice}
                animationSpeed={animationSpeed}
                quantumPrecision={quantumPrecision}
                piPatchIterations={piPatchIterations}
                helixTurns={helixTurns}
                nodeScale={nodeScale}
                sceneType="microshifted"
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Academic UI Overlay */}
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
        quantumPrecision={quantumPrecision}
        setQuantumPrecision={setQuantumPrecision}
        piPatchIterations={piPatchIterations}
        setPiPatchIterations={setPiPatchIterations}
        helixTurns={helixTurns}
        setHelixTurns={setHelixTurns}
        nodeScale={nodeScale}
        setNodeScale={setNodeScale}
      />
      
      <PrecisionReadout 
        angularValue={angularValue}
        microShift={microShift}
        quantumPrecision={quantumPrecision}
        piPatchIterations={piPatchIterations}
        helixTurns={helixTurns}
      />
    </div>
  );
}

export default App;
