import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { World } from './World';
import { DayNightCycle } from './DayNightCycle';
import { Suspense, useState, useEffect } from 'react';
import { isMobile } from '../utils/input';
import { TouchControls } from './TouchControls';

export default function Game() {
  const [isLocked, setIsLocked] = useState(false);
  const [isNearAltar, setIsNearAltar] = useState(false);

  useEffect(() => {
    const handleNearAltar = (e: any) => setIsNearAltar(e.detail);
    window.addEventListener('nearAltar', handleNearAltar);
    return () => window.removeEventListener('nearAltar', handleNearAltar);
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative touch-none">
      <Canvas shadows camera={{ fov: 75, far: 800 }}>
        <fog attach="fog" args={['#aaddff', 150, 500]} />
        <Suspense fallback={null}>
          <DayNightCycle />
          <Player onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />
          <World />
        </Suspense>
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2 h-2 bg-white rounded-full opacity-50" />
      </div>
      
      {isMobile && <TouchControls />}

      {!isLocked && !isMobile && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60 z-10">
          <div className="text-white text-center p-8 bg-gray-900/80 rounded-xl backdrop-blur-sm border border-white/10">
            <h1 className="text-4xl font-bold mb-4">Ermita del Carmen</h1>
            <p className="text-lg mb-2">Click anywhere to start</p>
            <div className="text-sm text-gray-400 space-y-1 mt-4">
              <p>WASD to move</p>
              <p>Mouse to look</p>
              <p>ESC to pause</p>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="absolute top-4 left-4 text-white font-mono bg-black/50 p-4 rounded-lg pointer-events-none z-40">
          <h1 className="text-xl font-bold mb-2">Ermita del Carmen</h1>
          <p className="text-sm">Left side: Move</p>
          <p className="text-sm">Right side: Look</p>
        </div>
      )}

      {isNearAltar && (isLocked || isMobile) && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50">
          {isMobile ? (
            <button 
              className="bg-orange-600/90 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg backdrop-blur-sm border border-orange-400/30 flex items-center gap-2 touch-auto"
              onTouchStart={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('lightCandle')); }}
            >
              <span className="text-xl">🕯️</span> Light Candle
            </button>
          ) : (
            <div className="bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-xl flex items-center gap-2">
              <span className="text-xl">🕯️</span> <span className="font-bold text-orange-400">Press E</span> to light candle
            </div>
          )}
        </div>
      )}
    </div>
  );
}
