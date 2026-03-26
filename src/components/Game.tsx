import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { Player } from './Player';
import { World } from './World';
import { Suspense, useState } from 'react';

export default function Game() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.3} />
          <pointLight position={[100, 100, 100]} intensity={1} castShadow />
          <directionalLight 
            position={[50, 50, 25]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          
          <Player onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />
          <World />
        </Suspense>
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2 h-2 bg-white rounded-full opacity-50" />
      </div>
      {!isLocked && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60 z-10">
          <div className="text-white text-center p-8 bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/10">
            <h1 className="text-4xl font-bold mb-4">3D Chapel</h1>
            <p className="text-lg mb-2">Click anywhere to start</p>
            <div className="text-sm text-gray-400 space-y-1 mt-4">
              <p>WASD to move</p>
              <p>Mouse to look</p>
              <p>ESC to pause</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
