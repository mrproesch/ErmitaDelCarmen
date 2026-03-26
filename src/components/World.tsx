import { useMemo, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { colliders } from '../utils/collision';

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
  const onPath = Math.abs(x) < 2.0 && z > -7 && z < 15;
  const inChapel = Math.abs(x) < 7 && z > -25 && z < -5;
  return onPath || inChapel;
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
      
      dummy.position.set(x, 0.15, z);
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
  const pathWidth = 3;
  const pathLength = 22; // from z=-7 to z=15
  const zOffset = 4; // center of the path
  
  const cols = Math.floor(pathWidth / brickWidth);
  const rows = Math.floor(pathLength / brickDepth);
  const count = cols * rows;

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offset = (r % 2 === 0) ? 0 : brickWidth / 2;
        const x = -pathWidth / 2 + c * brickWidth + offset + (brickWidth / 2);
        const z = -pathLength / 2 + r * brickDepth + zOffset;
        
        dummy.position.set(x, 0.02, z);
        dummy.rotation.y = (Math.random() - 0.5) * 0.05;
        dummy.scale.set(0.95, 1, 0.95);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        color.setHSL(0.02 + Math.random() * 0.05, 0.5 + Math.random() * 0.2, 0.3 + Math.random() * 0.15);
        meshRef.current.setColorAt(i, color);
        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} castShadow receiveShadow>
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

function Chapel() {
  const wallMaterial = <meshStandardMaterial color="#E0E0E0" side={THREE.DoubleSide} />;
  const roofMaterial = <meshStandardMaterial color="#455A64" side={THREE.DoubleSide} />;
  const woodMaterial = <meshStandardMaterial color="#3E2723" />;

  return (
    <group position={[0, 0, -15]}>
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
        flightData.current.arcHeight = 2 + Math.random() * 4;
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

export function World() {
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
    
    // Pews
    [0, 2, 4].forEach(zOffset => {
      const z = -15 + zOffset;
      colliders.push({ type: 'box', minX: -4, maxX: -1, minZ: z - 0.5, maxZ: z + 0.5 });
      colliders.push({ type: 'box', minX: 1, maxX: 4, minZ: z - 0.5, maxZ: z + 0.5 });
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
        data.push({ pos: [x, 0, z] as [number, number, number], scale });
        colliders.push({ type: 'circle', x, z, r: 0.4 * scale });
      }
    }
    return data;
  }, []);

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      <BrickPath />
      <Grass />
      <Fence />
      <Chapel />
      <Birds treePositions={treeData.map(t => t.pos)} />
      
      {treeData.map((tree, i) => (
        <Tree key={i} position={tree.pos} scale={tree.scale} />
      ))}
    </group>
  );
}
