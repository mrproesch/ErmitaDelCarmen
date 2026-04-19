import { useTime } from '../utils/time';
import { Sky, Clouds, Cloud } from '@react-three/drei';

export function DayNightCycle() {
  const time = useTime();
  
  // Map 24 hours to a single daytime arc (so it never gets fully dark)
  // 0:00 -> east, 12:00 -> top, 24:00 -> west
  const theta = Math.PI * 0.1 + (time / 24) * (Math.PI * 0.8);
  const y = Math.sin(theta);
  const x = Math.cos(theta);
  
  const sunPosition = [x * 100, y * 100, 50] as [number, number, number];

  return (
    <>
      <Sky sunPosition={sunPosition} />
      
      <Clouds>
        <Cloud position={[20, 30, -50]} speed={0.2} opacity={0.5} scale={2} />
        <Cloud position={[-40, 35, -20]} speed={0.2} opacity={0.5} scale={2} />
        <Cloud position={[30, 40, 20]} speed={0.2} opacity={0.4} scale={2} />
        <Cloud position={[-20, 30, 40]} speed={0.2} opacity={0.6} scale={2} />
      </Clouds>

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
