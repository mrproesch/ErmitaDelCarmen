import { useMemo, useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { colliders } from '../utils/collision';
import { getGroundHeight, getBaseTerrainHeight } from '../utils/terrain';

function Tree({ position, scale }: { position: [number, number, number], scale: number }) {
  const leafColor = useMemo(() => {
    const colors = ["#2E7D32", "#388E3C", "#1B5E20", "#43A047"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 7]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      {/* Branch 1 */}
      <mesh position={[0.5, 2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.15, 1.5, 5]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      {/* Branch 2 */}
      <mesh position={[-0.4, 2.5, 0.4]} rotation={[Math.PI / 4, 0, Math.PI / 4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.12, 1.2, 5]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      {/* Branch 3 */}
      <mesh position={[0, 2.2, -0.5]} rotation={[-Math.PI / 4, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.15, 1.2, 5]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={leafColor} flatShading />
      </mesh>
      <mesh position={[1.2, 2.8, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={leafColor} flatShading />
      </mesh>
      <mesh position={[-1, 3.2, 1]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={leafColor} flatShading />
      </mesh>
      <mesh position={[0, 2.8, -1.2]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color={leafColor} flatShading />
      </mesh>
    </group>
  );
}

const isClearArea = (x: number, z: number) => {
  const onMainPath = Math.abs(x) < 2.0 && z > -6 && z < 16;
  const onRingPath = x > -9 && x < 9 && z > -27 && z < -3;
  const inChapel = Math.abs(x) < 7 && z > -25 && z < -5;
  return onMainPath || onRingPath || inChapel;
};

function Grass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 40000;
  
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 138;
        z = (Math.random() - 0.5) * 138;
      } while (isClearArea(x, z));
      
      const cy = getGroundHeight(x, z);
      dummy.position.set(x, cy + 0.15, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      const scale = 0.3 + Math.random() * 0.7;
      dummy.scale.set(scale, scale * 2, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      color.setHSL(0.25 + Math.random() * 0.1, 0.6 + Math.random() * 0.3, 0.2 + Math.random() * 0.2);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} castShadow receiveShadow>
      <coneGeometry args={[0.05, 0.4, 3]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}

function BrickPath() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const brickWidth = 0.4;
  const brickDepth = 0.2;
  
  const gridMinX = -10, gridMaxX = 10;
  const gridMinZ = -30, gridMaxZ = 16;
  
  const bricks: {x: number, z: number}[] = [];
  for (let x = gridMinX; x <= gridMaxX; x += brickWidth) {
    for (let z = gridMinZ; z <= gridMaxZ; z += brickDepth) {
      const isMainPath = Math.abs(x) < 1.5 && z > -5 && z < 16;
      const isRingPath = x > -8 && x < 8 && z > -26 && z < -4 && !(x > -4.5 && x < 4.5 && z > -24.5 && z < -5.5);
      
      if (isMainPath || isRingPath) {
        bricks.push({ x: x + (Math.random() * 0.05), z: z + (Math.random() * 0.05) });
      }
    }
  }

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    bricks.forEach((brick, i) => {
      const cy = getGroundHeight(brick.x, brick.z);
      dummy.position.set(brick.x, cy + 0.02, brick.z);
      dummy.rotation.y = (Math.random() - 0.5) * 0.1;
      dummy.scale.set(0.95, 1, 0.95);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      color.setHSL(0.02 + Math.random() * 0.05, 0.5 + Math.random() * 0.2, 0.3 + Math.random() * 0.15);
      meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [bricks]);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, bricks.length]} castShadow receiveShadow>
      <boxGeometry args={[brickWidth, 0.05, brickDepth]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}

function Fence() {
  const size = 140;
  const half = size / 2;
  const postSpacing = 5;
  const posts = [];
  const rails = [];
  
  // Posts
  for (let x = -half; x <= half; x += postSpacing) {
    posts.push([x, 0.75, -half], [x, 0.75, half]);
  }
  for (let z = -half + postSpacing; z < half; z += postSpacing) {
    posts.push([-half, 0.75, z], [half, 0.75, z]);
  }

  // Rails (Horizontal)
  rails.push(
    { pos: [0, 1.2, -half], args: [size, 0.1, 0.05] },
    { pos: [0, 1.2, half], args: [size, 0.1, 0.05] },
    { pos: [-half, 1.2, 0], args: [0.05, 0.1, size] },
    { pos: [half, 1.2, 0], args: [0.05, 0.1, size] },
    { pos: [0, 0.6, -half], args: [size, 0.1, 0.05] },
    { pos: [0, 0.6, half], args: [size, 0.1, 0.05] },
    { pos: [-half, 0.6, 0], args: [0.05, 0.1, size] },
    { pos: [half, 0.6, 0], args: [0.05, 0.1, size] }
  );

  return (
    <group>
      {posts.map((pos, i) => (
        <mesh key={`post-${i}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.5, 0.2]} />
          <meshStandardMaterial color="#4E342E" />
        </mesh>
      ))}
      {rails.map((rail, i) => (
        <mesh key={`rail-${i}`} position={rail.pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={rail.args as [number, number, number]} />
          <meshStandardMaterial color="#4E342E" />
        </mesh>
      ))}
    </group>
  );
}

function StatueElCarmen() {
  return (
    <group position={[0, 2, -6.5]}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.5]} />
        <meshStandardMaterial color="#B8860B" />
      </mesh>
      
      {/* Tunic (Brown) */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      
      {/* Mantle/Cloak (Cream) */}
      <mesh position={[0, 0.8, -0.05]} rotation={[-0.05, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 1.25]} />
        <meshStandardMaterial color="#FFFDD0" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#FAD6A5" />
      </mesh>
      
      {/* Crown */}
      <mesh position={[0, 1.63, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.15]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Scapulars */}
      <mesh position={[-0.1, 1.1, 0.18]} rotation={[0.1, 0, 0]} castShadow>
         <boxGeometry args={[0.06, 0.15, 0.02]} />
         <meshStandardMaterial color="#3E2723" />
      </mesh>
      <mesh position={[0.1, 1.1, 0.18]} rotation={[0.1, 0, 0]} castShadow>
         <boxGeometry args={[0.06, 0.15, 0.02]} />
         <meshStandardMaterial color="#3E2723" />
      </mesh>

      {/* Baby Jesus (Held in left arm) */}
      <group position={[0.15, 1.0, 0.18]} rotation={[0, 0, -0.2]}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.25]} />
          <meshStandardMaterial color="#FFFDD0" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.07]} />
          <meshStandardMaterial color="#FAD6A5" />
        </mesh>
        {/* Small Crown */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.08]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>
    </group>
  );
}

function CandleTable() {
  const [candles, setCandles] = useState<number[]>(Array(6).fill(0));
  
  const candlePositions = useMemo(() => {
    return Array(6).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 1.5,
      z: (Math.random() - 0.5) * 0.5
    }));
  }, []);
  
  useEffect(() => {
    const handleLight = () => {
      setCandles(prev => {
        const next = [...prev];
        const unlitIdx = next.findIndex(t => t === 0);
        if (unlitIdx !== -1) {
          next[unlitIdx] = Date.now();
        }
        return next;
      });
    };
    window.addEventListener('lightCandle', handleLight);
    
    const interval = setInterval(() => {
      const now = Date.now();
      setCandles(prev => {
        let changed = false;
        const next = prev.map(t => {
          // 30 minutes = 30 * 60 * 1000
          if (t !== 0 && now - t > 30 * 60 * 1000) {
            changed = true;
            return 0;
          }
          return t;
        });
        return changed ? next : prev;
      });
    }, 10000);
    
    return () => {
      window.removeEventListener('lightCandle', handleLight);
      clearInterval(interval);
    };
  }, []);

  return (
    <group position={[0, 0.5, -4.5]}>
      {/* Table mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 0.8]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      
      {/* Candles */}
      {candles.map((litAt, i) => {
        const pos = candlePositions[i];
        const isLit = litAt > 0;
        return (
          <group key={i} position={[pos.x, 0.6, pos.z]}>
            {/* Wax */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.2]} />
              <meshStandardMaterial color="#FFF8E7" />
            </mesh>
            {/* Flame */}
            {isLit && (
              <mesh position={[0, 0.12, 0]}>
                <coneGeometry args={[0.02, 0.05]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            )}
            {/* Light */}
            {isLit && (
              <pointLight position={[0, 0.2, 0]} color="#FFCC88" intensity={0.6} distance={4} decay={2} castShadow />
            )}
          </group>
        );
      })}
    </group>
  );
}

function Chapel() {
  const wallMaterial = <meshStandardMaterial color="#E0E0E0" side={THREE.DoubleSide} />;
  const roofMaterial = <meshStandardMaterial color="#455A64" side={THREE.DoubleSide} />;
  const woodMaterial = <meshStandardMaterial color="#3E2723" />;

  return (
    <group position={[0, 4, -15]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 4, -8]} castShadow receiveShadow>
        <boxGeometry args={[10, 8, 0.5]} />
        {wallMaterial}
      </mesh>

      {/* Side Walls */}
      <mesh position={[-5, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 8, 16]} />
        {wallMaterial}
      </mesh>
      <mesh position={[5, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 8, 16]} />
        {wallMaterial}
      </mesh>

      {/* Front Wall (Left) */}
      <mesh position={[-3.5, 4, 8]} castShadow receiveShadow>
        <boxGeometry args={[3, 8, 0.5]} />
        {wallMaterial}
      </mesh>
      {/* Front Wall (Right) */}
      <mesh position={[3.5, 4, 8]} castShadow receiveShadow>
        <boxGeometry args={[3, 8, 0.5]} />
        {wallMaterial}
      </mesh>
      {/* Front Wall (Top/Arch) */}
      <mesh position={[0, 6.5, 8]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 0.5]} />
        {wallMaterial}
      </mesh>

      {/* Roof (Left Slope) */}
      <mesh position={[-2.6, 9.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.5, 17]} />
        {roofMaterial}
      </mesh>
      {/* Roof (Right Slope) */}
      <mesh position={[2.6, 9.5, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.5, 17]} />
        {roofMaterial}
      </mesh>

      {/* Cross */}
      <group position={[0, 13, 8.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 2.5, 0.3]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      </group>

      {/* Interior: Altar */}
      <mesh position={[0, 1, -6]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 1.5]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Interior: Pews (Left) */}
      <group position={[-2.5, 0.5, 0]}>
        {[0, 2, 4].map((z) => (
          <mesh key={z} position={[0, 0, z]} castShadow receiveShadow>
            <boxGeometry args={[3, 1, 1]} />
            {woodMaterial}
          </mesh>
        ))}
      </group>
      {/* Interior: Pews (Right) */}
      <group position={[2.5, 0.5, 0]}>
        {[0, 2, 4].map((z) => (
          <mesh key={z} position={[0, 0, z]} castShadow receiveShadow>
            <boxGeometry args={[3, 1, 1]} />
            {woodMaterial}
          </mesh>
        ))}
      </group>

      <StatueElCarmen />
      <CandleTable />
    </group>
  );
}

function Bird({ treePositions }: { treePositions: [number, number, number][] }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  
  const state = useRef({ phase: 'resting', timer: Math.random() * 5 });
  const pos = useRef(new THREE.Vector3());
  const startPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const flightData = useRef({ progress: 0, duration: 1, arcHeight: 0 });
  
  useLayoutEffect(() => {
    const tree = treePositions[Math.floor(Math.random() * treePositions.length)];
    pos.current.set(tree[0], tree[1] + 4 + Math.random() * 2, tree[2]);
    if (groupRef.current) {
      groupRef.current.position.copy(pos.current);
      groupRef.current.rotation.y = Math.random() * Math.PI * 2;
    }
  }, [treePositions]);

  useFrame((rootState, delta) => {
    if (!groupRef.current || !leftWingRef.current || !rightWingRef.current) return;
    
    if (state.current.phase === 'resting') {
      state.current.timer -= delta;
      if (state.current.timer <= 0) {
        state.current.phase = 'flying';
        const nextTree = treePositions[Math.floor(Math.random() * treePositions.length)];
        
        startPos.current.copy(pos.current);
        targetPos.current.set(nextTree[0], nextTree[1] + 4 + Math.random() * 2, nextTree[2]);
        
        const dist = startPos.current.distanceTo(targetPos.current);
        flightData.current.duration = dist / (8 + Math.random() * 4);
        flightData.current.progress = 0;
        
        let arc = 2 + Math.random() * 4;
        const midX = (startPos.current.x + targetPos.current.x) / 2;
        const midZ = (startPos.current.z + targetPos.current.z) / 2;
        // Boost flight arc automatically over chapel (height ~14 from ground, ground is +4)
        if (Math.abs(midX) < 12 && midZ > -30 && midZ < 2) {
          arc = Math.max(arc, 16);
        }
        flightData.current.arcHeight = arc;
      }
    } else if (state.current.phase === 'flying') {
      flightData.current.progress += delta / flightData.current.duration;
      
      if (flightData.current.progress >= 1) {
        state.current.phase = 'resting';
        state.current.timer = Math.random() * 5 + 2;
        pos.current.copy(targetPos.current);
        groupRef.current.position.copy(pos.current);
        
        leftWingRef.current.rotation.z = 0;
        rightWingRef.current.rotation.z = 0;
      } else {
        const p = flightData.current.progress;
        pos.current.lerpVectors(startPos.current, targetPos.current, p);
        
        const arcY = Math.sin(p * Math.PI) * flightData.current.arcHeight;
        const currentPos = pos.current.clone();
        currentPos.y += arcY;
        
        const nextP = Math.min(1, p + 0.05);
        const nextPos = new THREE.Vector3().lerpVectors(startPos.current, targetPos.current, nextP);
        nextPos.y += Math.sin(nextP * Math.PI) * flightData.current.arcHeight;
        
        groupRef.current.position.copy(currentPos);
        groupRef.current.lookAt(nextPos);
        
        const time = rootState.clock.getElapsedTime();
        const flap = Math.sin(time * 40) * 0.6;
        leftWingRef.current.rotation.z = flap;
        rightWingRef.current.rotation.z = -flap;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <group ref={leftWingRef} position={[-0.05, 0, 0]}>
        <mesh position={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.05, 0, 0]}>
        <mesh position={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.15]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  );
}

function Bench({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.9, -0.25]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.8, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.8, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function Squirrel() {
  const groupRef = useRef<THREE.Group>(null);
  const state = useRef({ phase: 'idle', timer: Math.random() * 3 });
  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  
  useLayoutEffect(() => {
    let x, z;
    do {
      x = (Math.random() - 0.5) * 40;
      z = (Math.random() - 0.5) * 40;
    } while (Math.abs(x) < 6 && z > -24 && z < -6);
    pos.current.set(x, getGroundHeight(x, z), z);
  }, []);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    if (state.current.phase === 'idle') {
      state.current.timer -= delta;
      if (state.current.timer <= 0) {
        state.current.phase = 'moving';
        target.current.set(
          pos.current.x + (Math.random() - 0.5) * 10,
          0.1,
          pos.current.z + (Math.random() - 0.5) * 10
        );
      }
    } else if (state.current.phase === 'moving') {
      const dist = pos.current.distanceTo(target.current);
      if (dist < 0.5) {
        state.current.phase = 'idle';
        state.current.timer = Math.random() * 4 + 1;
      } else {
        const dir = target.current.clone().sub(pos.current).normalize();
        const nextPos = pos.current.clone().add(dir.multiplyScalar(4 * delta));
        
        // Prevent walking into the chapel bounding box
        if (Math.abs(nextPos.x) < 5.5 && nextPos.z > -23.5 && nextPos.z < -6.5) {
          state.current.phase = 'idle';
          state.current.timer = 0.5;
        } else {
          pos.current.copy(nextPos);
          
          // Follow terrain
          const cy = getGroundHeight(pos.current.x, pos.current.z);
          pos.current.y = cy;
          
          groupRef.current.position.copy(pos.current);
          groupRef.current.position.y += 0.1 + Math.abs(Math.sin(dist * 5)) * 0.2;
          groupRef.current.lookAt(target.current.clone().setY(groupRef.current.position.y));
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={pos.current}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.3]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0, 0.25, 0.15]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0, 0.2, -0.15]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}

function Birds({ treePositions }: { treePositions: [number, number, number][] }) {
  const birds = useMemo(() => Array.from({ length: 20 }), []);
  if (treePositions.length === 0) return null;
  return (
    <group>
      {birds.map((_, i) => (
        <Bird key={i} treePositions={treePositions} />
      ))}
    </group>
  );
}

function StreetLight({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.4, 3.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.8, 3.75, 0]} castShadow>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.8, 3.65, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffddaa" />
      </mesh>
    </group>
  );
}

function Terrain() {
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  useLayoutEffect(() => {
    if (geometryRef.current) {
      const pos = geometryRef.current.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = -pos.getY(i);
        pos.setZ(i, getBaseTerrainHeight(x, z));
      }
      geometryRef.current.computeVertexNormals();
    }
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry ref={geometryRef} args={[800, 800, 150, 150]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}

function Mountains() {
  const count = 45;
  const radius = 350;
  
  const mountains = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const r = radius + Math.random() * 80;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      
      const height = 40 + Math.random() * 60;
      const baseRadius = 60 + Math.random() * 40;
      
      const color = new THREE.Color().setHSL(0.58 + Math.random() * 0.05, 0.4, 0.6 + Math.random() * 0.1);

      data.push({
        position: [x, height / 2 - 20, z] as [number, number, number],
        args: [baseRadius, height, 4 + Math.floor(Math.random() * 3)] as [number, number, number],
        rotation: [0, Math.random() * Math.PI, 0] as [number, number, number],
        color: color
      });
    }
    return data;
  }, []);

  return (
    <group>
      {mountains.map((m, i) => (
        <mesh key={`mtn-${i}`} position={m.position} rotation={m.rotation} receiveShadow>
          <coneGeometry args={m.args as [number, number, number]} />
          <meshStandardMaterial color={m.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Stairs() {
  const steps = [];
  for (let i = 0; i < 8; i++) {
    const topY = 4 - (i * 0.5) - 0.5;
    if (topY <= 0) continue;
    steps.push(
      <mesh key={i} position={[0, topY / 2, i + 0.5]} castShadow receiveShadow>
        <boxGeometry args={[4.5, topY, 1]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
    );
  }
  return <group>{steps}</group>;
}

export function World() {
  const benches = useMemo(() => [
    { pos: [-9, 0, -15], rot: [0, Math.PI / 2, 0] },
    { pos: [9, 0, -15], rot: [0, -Math.PI / 2, 0] },
    { pos: [0, 0, -28], rot: [0, 0, 0] },
    { pos: [-4, 0, -2], rot: [0, Math.PI, 0] },
    { pos: [4, 0, -2], rot: [0, Math.PI, 0] },
  ], []);

  const streetLights = useMemo(() => [
    { pos: [-4, 0, -5], rot: [0, 0, 0] },
    { pos: [4, 0, -5], rot: [0, Math.PI, 0] },
    { pos: [-6, 0, -20], rot: [0, 0, 0] },
    { pos: [6, 0, -20], rot: [0, Math.PI, 0] },
    { pos: [-3, 0, 5], rot: [0, 0, 0] },
    { pos: [3, 0, 10], rot: [0, Math.PI, 0] },
  ], []);

  const treeData = useMemo(() => {
    const data = [];
    colliders.length = 0;
    
    // Add Chapel Walls
    colliders.push({ type: 'box', minX: -5, maxX: 5, minZ: -23.25, maxZ: -22.75 }); // Back
    colliders.push({ type: 'box', minX: -5.25, maxX: -4.75, minZ: -23, maxZ: -7 }); // Left
    colliders.push({ type: 'box', minX: 4.75, maxX: 5.25, minZ: -23, maxZ: -7 }); // Right
    colliders.push({ type: 'box', minX: -5, maxX: -2, minZ: -7.25, maxZ: -6.75 }); // Front Left
    colliders.push({ type: 'box', minX: 2, maxX: 5, minZ: -7.25, maxZ: -6.75 }); // Front Right
    colliders.push({ type: 'box', minX: -1.5, maxX: 1.5, minZ: -21.75, maxZ: -20.25 }); // Altar
    colliders.push({ type: 'box', minX: -1.0, maxX: 1.0, minZ: -19.9, maxZ: -19.1 }); // Candle table
    
    // Pews
    [0, 2, 4].forEach(zOffset => {
      const z = -15 + zOffset;
      colliders.push({ type: 'box', minX: -4, maxX: -1, minZ: z - 0.5, maxZ: z + 0.5 });
      colliders.push({ type: 'box', minX: 1, maxX: 4, minZ: z - 0.5, maxZ: z + 0.5 });
    });

    // Benches
    benches.forEach(b => {
      colliders.push({ type: 'circle', x: b.pos[0], z: b.pos[2], r: 1.2 });
    });

    // Street Lights
    streetLights.forEach(sl => {
      colliders.push({ type: 'circle', x: sl.pos[0], z: sl.pos[2], r: 0.2 });
    });

    for (let i = 0; i < 120; i++) {
      let x, z;
      let attempts = 0;
      do {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 55;
        x = Math.sin(angle) * radius;
        z = Math.cos(angle) * radius - 10;
        attempts++;
      } while (isClearArea(x, z) && attempts < 100);
      
      if (attempts < 100) {
        const scale = 0.6 + Math.random() * 0.6;
        data.push({ pos: [x, getGroundHeight(x, z), z] as [number, number, number], scale });
        colliders.push({ type: 'circle', x, z, r: 0.4 * scale });
      }
    }
    return data;
  }, []);

  return (
    <group>
      {/* Ground */}
      <Terrain />
      <Mountains />
      <Stairs />
      
      <BrickPath />
      <Grass />
      <Fence />
      <Chapel />
      {streetLights.map((sl, i) => (
        <StreetLight key={`sl-${i}`} position={[sl.pos[0], getGroundHeight(sl.pos[0], sl.pos[2]), sl.pos[2]]} rotation={sl.rot as [number, number, number]} />
      ))}
      {benches.map((b, i) => (
        <Bench key={i} position={[b.pos[0], getGroundHeight(b.pos[0], b.pos[2]), b.pos[2]]} rotation={b.rot as [number, number, number]} />
      ))}
      <Birds treePositions={treeData.map(t => t.pos)} />
      {Array.from({ length: 15 }).map((_, i) => <Squirrel key={`sq-${i}`} />)}
      
      {treeData.map((tree, i) => (
        <Tree key={i} position={tree.pos} scale={tree.scale} />
      ))}
    </group>
  );
}
