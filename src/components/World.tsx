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
  const onMainPath = Math.abs(x) < 2.0 && z > -6 && z < 18;
  const onRingPath = x > -9 && x < 9 && z > -27 && z < -3;
  const inChapel = Math.abs(x) < 7 && z > -25 && z < -5;
  const inPond = Math.sqrt((x - -35)**2 + (z - 15)**2) < 14;
  const onPondPath = x >= -25 && x <= 0 && z > 14 && z < 16;
  return onMainPath || onRingPath || inChapel || inPond || onPondPath;
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
      dummy.position.set(x, cy + 0.08, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      const scale = 0.4 + Math.random() * 0.6;
      dummy.scale.set(scale, scale * 1.2, scale);
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
      <coneGeometry args={[0.04, 0.2, 3]} />
      <meshStandardMaterial roughness={0.8} metalness={0.1} />
    </instancedMesh>
  );
}

function Flowers() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 2000;
  
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    // Red, purple, yellow
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#06b6d4', '#eab308', '#f97316'];
    
    for (let i = 0; i < count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * 138;
        z = (Math.random() - 0.5) * 138;
      } while (isClearArea(x, z));
      
      const cy = getGroundHeight(x, z);
      dummy.position.set(x, cy + 0.05, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      
      const scale = 0.6 + Math.random() * 0.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      color.set(colors[Math.floor(Math.random() * colors.length)]);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial roughness={0.6} metalness={0.1} />
    </instancedMesh>
  );
}

// ... existing components (after Grass, before Pond/BrickPath)

function Duck({ initialOffset }: { initialOffset: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.1 + initialOffset; // Slower swimming
    
    const r = 5 + Math.sin(t * 1.5) * 2;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    
    const y = Math.sin(t * 8) * 0.05 + 0.05;
    
    const nextT = t + 0.05;
    const nextR = 5 + Math.sin(nextT * 1.5) * 2;
    const nextX = Math.cos(nextT) * nextR;
    const nextZ = Math.sin(nextT) * nextR;
    
    groupRef.current.position.set(x, y, z);
    
    const angle = Math.atan2(nextX - x, nextZ - z);
    groupRef.current.rotation.y = angle;
  });
  
  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.25, 0.15]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.25, 0.25]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.1]} />
        <meshStandardMaterial color="#FFAA00" />
      </mesh>
    </group>
  );
}

function Pond() {
  const px = -35;
  const pz = 15;
  const waterLevel = -0.4;
  
  const ducks = useMemo(() => Array.from({ length: 6 }), []);
  
  return (
    <group position={[px, waterLevel, pz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[11, 32]} />
        <meshStandardMaterial color="#3399ff" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {ducks.map((_, i) => (
        <Duck key={i} initialOffset={i * ((Math.PI * 2) / ducks.length)} />
      ))}
    </group>
  );
}

function BrickPath() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const brickWidth = 0.4;
  const brickDepth = 0.2;
  
  const gridMinX = -26, gridMaxX = 10;
  const gridMinZ = -30, gridMaxZ = 18;
  
  const bricks: {x: number, z: number}[] = [];
  for (let x = gridMinX; x <= gridMaxX; x += brickWidth) {
    for (let z = gridMinZ; z <= gridMaxZ; z += brickDepth) {
      const isMainPath = Math.abs(x) < 1.5 && z > -5 && z < 18;
      const isRingPath = x > -8 && x < 8 && z > -26 && z < -4 && !(x > -4.5 && x < 4.5 && z > -24.5 && z < -5.5);
      const isPondPath = x > -25 && x < 0 && z > 14 && z < 16;
      
      if (isMainPath || isRingPath || isPondPath) {
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
      
      // Rich red brick terracotta colors
      color.setHSL(0.01 + Math.random() * 0.03, 0.75 + Math.random() * 0.15, 0.52 + Math.random() * 0.08);
      meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [bricks]);

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, bricks.length]} castShadow receiveShadow>
      <boxGeometry args={[brickWidth, 0.05, brickDepth]} />
      <meshStandardMaterial roughness={0.7} metalness={0.1} />
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

function AltarPainting() {
  // Create procedural 2D canvas for Virgen del Carmen retablo
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');
    if (ctx) {
      // 1. Dark ornate wood background
      ctx.fillStyle = '#1D110D';
      ctx.fillRect(0, 0, 1024, 512);

      // 2. Left Panel: Saint Joseph holding Child Jesus
      // Dark arch/background for left panel
      ctx.fillStyle = '#130A08';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(40, 40, 220, 432, [20, 20, 0, 0]);
      } else {
        ctx.rect(40, 40, 220, 432);
      }
      ctx.fill();

      // Saint Joseph clothing (dark brownish teal)
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.moveTo(150, 220);
      ctx.lineTo(80, 472);
      ctx.lineTo(220, 472);
      ctx.closePath();
      ctx.fill();

      // Saint Joseph brown cloak
      ctx.fillStyle = '#4E342E';
      ctx.beginPath();
      ctx.moveTo(150, 220);
      ctx.lineTo(120, 472);
      ctx.lineTo(220, 472);
      ctx.closePath();
      ctx.fill();

      // Halo for St. Joseph
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(150, 160, 30, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FAD6A5';
      ctx.beginPath();
      ctx.arc(150, 160, 15, 0, Math.PI * 2);
      ctx.fill();

      // Hair & beard
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.arc(150, 150, 16, Math.PI, 0);
      ctx.fill();

      // Baby Jesus held by St. Joseph
      ctx.fillStyle = '#FFF9C4'; // Pale yellow tunic
      ctx.beginPath();
      ctx.moveTo(180, 230);
      ctx.lineTo(160, 300);
      ctx.lineTo(200, 300);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FAD6A5'; // Head
      ctx.beginPath();
      ctx.arc(180, 215, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700'; // Tiny halo
      ctx.beginPath();
      ctx.arc(180, 215, 13, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Right Panel: Carmelite Saint with child/symbol
      ctx.fillStyle = '#130A08';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(764, 40, 220, 432, [20, 20, 0, 0]);
      } else {
        ctx.rect(764, 40, 220, 432);
      }
      ctx.fill();

      // Robe (Dark brown Carmelite habit)
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.moveTo(874, 220);
      ctx.lineTo(804, 472);
      ctx.lineTo(944, 472);
      ctx.closePath();
      ctx.fill();

      // White scapular/cloak
      ctx.fillStyle = '#FFFDD0';
      ctx.beginPath();
      ctx.moveTo(874, 220);
      ctx.lineTo(844, 472);
      ctx.lineTo(904, 472);
      ctx.closePath();
      ctx.fill();

      // Halo
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(874, 160, 30, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FAD6A5';
      ctx.beginPath();
      ctx.arc(874, 160, 15, 0, Math.PI * 2);
      ctx.fill();

      // Child in saint's arms
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.moveTo(844, 240);
      ctx.lineTo(824, 300);
      ctx.lineTo(864, 300);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FAD6A5';
      ctx.beginPath();
      ctx.arc(844, 225, 8, 0, Math.PI * 2);
      ctx.fill();

      // 4. Center Panel: Nuestra Señora del Carmen in radiant golden rays
      ctx.fillStyle = '#100705';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(300, 20, 424, 472, [30, 30, 0, 0]);
      } else {
        ctx.rect(300, 20, 424, 472);
      }
      ctx.fill();

      // Inner radial golden glow (resplandor)
      const grad = ctx.createRadialGradient(512, 230, 10, 512, 230, 190);
      grad.addColorStop(0, '#FFF59D'); // Soft bright yellow center
      grad.addColorStop(0.2, '#FFD54F'); // Rich gold
      grad.addColorStop(0.5, '#FF8F00'); // Deep amber
      grad.addColorStop(0.8, '#D84315'); // Fiery terracotta-orange edge
      grad.addColorStop(1, 'rgba(16, 7, 5, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(512, 230, 190, 0, Math.PI * 2);
      ctx.fill();

      // Ornate sharp radiant gold rays extending in all directions
      ctx.strokeStyle = '#FFD700';
      for (let a = 0; a < Math.PI * 2; a += 0.06) {
        const isLong = Math.round(a * 100) % 3 === 0;
        const r1 = 50;
        const r2 = isLong ? 175 : 125;
        
        ctx.lineWidth = isLong ? 3 : 1.5;
        ctx.beginPath();
        ctx.moveTo(512 + Math.cos(a) * r1, 230 + Math.sin(a) * r1);
        ctx.lineTo(512 + Math.cos(a) * r2, 230 + Math.sin(a) * r2);
        ctx.stroke();
      }

      // Ornate silver pedestal (at the base of the Virgin)
      ctx.fillStyle = '#CFD8DC'; // Light silver
      ctx.beginPath();
      ctx.moveTo(462, 420);
      ctx.lineTo(562, 420);
      ctx.lineTo(542, 450);
      ctx.lineTo(482, 450);
      ctx.closePath();
      ctx.fill();

      // Silver crescent moon pointing upward
      ctx.strokeStyle = '#ECEFF1';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(512, 400, 60, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Virgin Mary's beautiful triangular cream/gold cloak
      ctx.fillStyle = '#FFFDD0'; // Cream cloak
      ctx.beginPath();
      ctx.moveTo(512, 130);
      ctx.lineTo(440, 410);
      ctx.lineTo(584, 410);
      ctx.closePath();
      ctx.fill();

      // Brown scapular and tunic visible in front of the cloak
      ctx.fillStyle = '#3E2723'; // Dark brown
      ctx.beginPath();
      ctx.moveTo(512, 140);
      ctx.lineTo(492, 410);
      ctx.lineTo(532, 410);
      ctx.closePath();
      ctx.fill();

      // Gold-embroidered collar/chest plate
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(502, 160);
      ctx.lineTo(522, 160);
      ctx.lineTo(512, 190);
      ctx.closePath();
      ctx.fill();

      // Crown of the Virgin Mary
      ctx.fillStyle = '#FFD700';
      // Base
      ctx.fillRect(497, 85, 30, 10);
      // Spikes
      ctx.beginPath();
      ctx.moveTo(497, 85);
      ctx.lineTo(492, 65);
      ctx.lineTo(504, 80);
      ctx.lineTo(512, 60); // center spike
      ctx.lineTo(520, 80);
      ctx.lineTo(532, 65);
      ctx.lineTo(527, 85);
      ctx.closePath();
      ctx.fill();

      // Head of the Virgin
      ctx.fillStyle = '#FAD6A5'; // flesh tone
      ctx.beginPath();
      ctx.arc(512, 125, 14, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#4E342E';
      ctx.beginPath();
      ctx.arc(512, 118, 14, Math.PI, 0);
      ctx.fill();

      // Child Jesus held in her left arm
      ctx.fillStyle = '#FFF9C4'; // Light gold dress
      ctx.beginPath();
      ctx.moveTo(475, 210);
      ctx.lineTo(455, 280);
      ctx.lineTo(495, 280);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FAD6A5'; // Head
      ctx.beginPath();
      ctx.arc(475, 195, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700'; // Crown
      ctx.fillRect(471, 182, 8, 6);

      // Kneeling figures at her feet (the souls/friars praying)
      ctx.fillStyle = '#D7CCC8';
      ctx.beginPath();
      ctx.arc(430, 420, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(420, 430, 20, 30);

      ctx.fillStyle = '#D7CCC8';
      ctx.beginPath();
      ctx.arc(594, 420, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(584, 430, 20, 30);

      // Gold/Gilded Frame Borders
      ctx.strokeStyle = '#D4AF37'; // Antique gold
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 1010, 498);

      // Divider lines
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(290, 0);
      ctx.lineTo(290, 512);
      ctx.moveTo(734, 0);
      ctx.lineTo(734, 512);
      ctx.stroke();
    }
    return c;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [canvas]);

  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const tryPaths = ['/altar.jpg', '/altar.png', '/altar.jpeg'];
    
    const tryLoad = (index: number) => {
      if (index >= tryPaths.length) return;
      loader.load(
        tryPaths[index],
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setLoadedTexture(tex);
          console.log(`Successfully loaded actual picture from ${tryPaths[index]}`);
        },
        undefined,
        () => {
          // If this path fails, try the next one
          tryLoad(index + 1);
        }
      );
    };

    tryLoad(0);
  }, []);

  return (
    <group position={[0, 4.3, -7.75]}>
      {/* 1. Large Antique Gold/Wood Outer Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.3, 0.08]} />
        <meshStandardMaterial color="#8B6508" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 2. Inner Frame / Bevel */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[4.24, 2.14, 0.06]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 3. The Canvas with the Painting Texture */}
      <mesh position={[0, 0, 0.04]} castShadow>
        <planeGeometry args={[4.16, 2.06]} />
        <meshStandardMaterial map={loadedTexture || texture} roughness={0.7} metalness={0.15} />
      </mesh>

      {/* 4. Ornate Gold Classical Columns (4 columns on the retablo to match the original!) */}
      {/* Far Left Column */}
      <group position={[-2.0, 0, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.1, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Caps & Bands */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Inner Left Column */}
      <group position={[-1.15, 0, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.1, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Caps & Bands */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Inner Right Column */}
      <group position={[1.15, 0, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.1, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Caps & Bands */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Far Right Column */}
      <group position={[2.0, 0, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.1, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Caps & Bands */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
          <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
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

      <AltarPainting />
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
    { pos: [-24, 0, 12], rot: [0, Math.PI, 0] }, // Near the pond
  ], []);

  const streetLights = useMemo(() => [
    { pos: [-4, 0, -5], rot: [0, 0, 0] },
    { pos: [4, 0, -5], rot: [0, Math.PI, 0] },
    { pos: [-6, 0, -20], rot: [0, 0, 0] },
    { pos: [6, 0, -20], rot: [0, Math.PI, 0] },
    { pos: [-3, 0, 5], rot: [0, 0, 0] },
    { pos: [3, 0, 10], rot: [0, Math.PI, 0] },
    { pos: [-23, 0, 13], rot: [0, Math.PI, 0] }, // Near the pond
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
    
    // Add Pond Collision
    colliders.push({ type: 'circle', x: -35, z: 15, r: 12.0 });
    
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
      <Pond />
      <Stairs />
      
      <BrickPath />
      <Grass />
      <Flowers />
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
