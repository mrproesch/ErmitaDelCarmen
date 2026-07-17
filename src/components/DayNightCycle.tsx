import { useTime } from '../utils/time';
import { Sky, Clouds, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function DayNightCycle() {
  const time = useTime();
  const cloudGroupRef = useRef<THREE.Group>(null);
  
  // Map 24 hours to a single daytime arc (so it never gets fully dark)
  // 0:00 -> east, 12:00 -> top, 24:00 -> west
  const theta = Math.PI * 0.1 + (time / 24) * (Math.PI * 0.8);
  const y = Math.sin(theta);
  const x = Math.cos(theta);
  
  const sunPosition = [x * 100, y * 100, 50] as [number, number, number];

  useFrame((state, delta) => {
    if (cloudGroupRef.current) {
      // Very slow rotation to make clouds dynamic
      cloudGroupRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <>
      <Sky sunPosition={sunPosition} />
      
      <group ref={cloudGroupRef}>
        <Clouds>
          <Cloud position={[20, 30, -50]} speed={0.4} opacity={0.5} scale={2} />
          <Cloud position={[-40, 35, -20]} speed={0.4} opacity={0.5} scale={2} />
          <Cloud position={[30, 40, 20]} speed={0.4} opacity={0.4} scale={2} />
          <Cloud position={[-20, 30, 40]} speed={0.4} opacity={0.6} scale={2} />
        </Clouds>
      </group>

      <ambientLight intensity={0.5} color="#ffffff" />
      
      <directionalLight 
        position={sunPosition} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
