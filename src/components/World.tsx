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
  const [altarTexture, setAltarTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const base = (import.meta as any).env?.BASE_URL || '';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const relativePath = base && base !== '/' ? `${cleanBase}altar.jpg` : 'altar.jpg';

    const urlsToTry = [
      '/altar.jpg',
      relativePath,
      window.location.origin + '/altar.jpg',
      'altar.jpg',
      './altar.jpg'
    ];

    const setupTexture = (tex: THREE.Texture, pathUsed: string) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      setAltarTexture(tex);
      console.log(`Successfully loaded altar texture from: ${pathUsed}`);
    };

    const tryNativeImage = (index: number) => {
      if (index >= urlsToTry.length) {
        console.warn('Native Image loading failed for all paths. Trying TextureLoader with credentials...');
        tryTextureLoader(0, 'use-credentials');
        return;
      }

      const url = urlsToTry[index];
      const img = new Image();
      // Do NOT set crossOrigin to guarantee standard same-origin request with auth cookies and no CORS requirement
      img.onload = () => {
        const tex = new THREE.Texture(img);
        setupTexture(tex, `${url} (Native Image, no-CORS)`);
      };
      img.onerror = (err) => {
        console.warn(`Native Image failed for ${url}, trying next native path...`, err);
        tryNativeImage(index + 1);
      };
      img.src = url;
    };

    const tryTextureLoader = (index: number, crossOrigin: string) => {
      if (index >= urlsToTry.length) {
        if (crossOrigin === 'use-credentials') {
          console.warn('TextureLoader with use-credentials failed. Trying with anonymous...');
          tryTextureLoader(0, 'anonymous');
        } else {
          console.error('All altar.jpg loading strategies failed.');
        }
        return;
      }

      const url = urlsToTry[index];
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin(crossOrigin);
      loader.load(
        url,
        (tex) => setupTexture(tex, `${url} (TextureLoader, ${crossOrigin})`),
        undefined,
        (err) => {
          console.warn(`TextureLoader (${crossOrigin}) failed for ${url}, trying next path...`, err);
          tryTextureLoader(index + 1, crossOrigin);
        }
      );
    };

    // Start loading sequence using the safest, CORS-immune native image approach first
    tryNativeImage(0);
  }, []);

  // Legacy canvas code bypass
  const canvas = useMemo(() => {
    return document.createElement('canvas');
  }, []);

  const unusedCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    return c; // Bypass all legacy canvas rendering code
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');
    if (ctx) {
      // 1. Warm vintage parchment/ivory background
      ctx.fillStyle = '#FAF7F0';
      ctx.fillRect(0, 0, 1024, 512);

      // Soft vignette for aged paper look
      const paperGrad = ctx.createRadialGradient(512, 256, 100, 512, 256, 540);
      paperGrad.addColorStop(0, '#FCFAF5');
      paperGrad.addColorStop(0.7, '#F4EFE2');
      paperGrad.addColorStop(1, '#E6DECE');
      ctx.fillStyle = paperGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // 2. Set common styles for engraving linework (charcoal espresso color)
      const lineCol = '#2A221C';
      const goldCol = '#D4AF37';
      ctx.strokeStyle = lineCol;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Draw elegant decorative borders matching Colonial Spanish altars
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = lineCol;
      ctx.strokeRect(10, 10, 1004, 492);
      ctx.strokeRect(16, 16, 992, 480);

      // Helper to draw a fine-line Romanic or Baroque arch for triptych panels
      const drawArchedBorder = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h);
        ctx.stroke();
      };

      // Draw ornate double-arched panel borders
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(42, 34, 28, 0.4)';
      drawArchedBorder(38, 38, 224, 436, 22);
      drawArchedBorder(298, 18, 428, 476, 32);
      drawArchedBorder(762, 38, 224, 436, 22);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = lineCol;
      drawArchedBorder(40, 40, 220, 432, 20);
      drawArchedBorder(300, 20, 424, 472, 30);
      drawArchedBorder(764, 40, 220, 432, 20);

      // Add thin double lines for historic blueprint styling
      ctx.lineWidth = 0.8;
      drawArchedBorder(43, 43, 214, 426, 17);
      drawArchedBorder(304, 24, 416, 464, 26);
      drawArchedBorder(767, 43, 214, 426, 17);

      // ==========================================
      // LEFT PANEL: Saint Joseph holding Child Jesus
      // ==========================================
      ctx.save();
      // Saint Joseph Halo
      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(150, 140, 26, 0, Math.PI * 2);
      ctx.stroke();
      // Fine halo rays
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      for (let a = 0; a < Math.PI * 2; a += 0.15) {
        ctx.beginPath();
        ctx.moveTo(150 + Math.cos(a) * 26, 140 + Math.sin(a) * 26);
        ctx.lineTo(150 + Math.cos(a) * 35, 140 + Math.sin(a) * 35);
        ctx.stroke();
      }

      // St Joseph head/face
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(150, 140, 11, 0, Math.PI * 2); // face outline
      ctx.stroke();
      // Features (bearded serene father)
      ctx.fillStyle = lineCol;
      ctx.beginPath();
      ctx.arc(146, 139, 1, 0, Math.PI * 2); // eye L
      ctx.arc(154, 139, 1, 0, Math.PI * 2); // eye R
      ctx.fill();
      // Nose and mouth
      ctx.beginPath();
      ctx.moveTo(150, 138);
      ctx.lineTo(150, 144);
      ctx.lineTo(148, 144);
      ctx.stroke();
      // Beard
      ctx.beginPath();
      ctx.moveTo(141, 144);
      ctx.quadraticCurveTo(150, 156, 159, 144);
      ctx.quadraticCurveTo(150, 159, 141, 144);
      ctx.stroke();
      // Hair
      ctx.beginPath();
      ctx.moveTo(140, 136);
      ctx.quadraticCurveTo(150, 126, 160, 136);
      ctx.stroke();

      // Flowing robes
      ctx.beginPath();
      ctx.moveTo(150, 151); // neck
      ctx.lineTo(130, 230); // L shoulder to arm
      ctx.lineTo(110, 440); // L body
      ctx.lineTo(190, 440); // R body
      ctx.lineTo(170, 230); // R arm
      ctx.closePath();
      ctx.stroke();

      // Robe drapery folds with fine-line shading
      for (let i = 120; i <= 180; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 260);
        ctx.quadraticCurveTo(150, 360, i - 5, 440);
        ctx.stroke();
      }

      // Lilies staff (symbol of St Joseph)
      ctx.beginPath();
      ctx.moveTo(115, 410);
      ctx.lineTo(115, 120); // staff
      ctx.stroke();
      // Small flower stars on staff
      for (let ly = 120; ly <= 180; ly += 25) {
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(115, ly, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // small petals
        ctx.strokeRect(111, ly - 1, 8, 2);
        ctx.strokeRect(114, ly - 4, 2, 8);
      }

      // Child Jesus in St Joseph's arm
      ctx.beginPath();
      ctx.arc(175, 200, 7, 0, Math.PI * 2); // Jesus head
      ctx.stroke();
      // Tiny halo
      ctx.strokeStyle = goldCol;
      ctx.beginPath();
      ctx.arc(175, 200, 11, 0, Math.PI * 2);
      ctx.stroke();
      // Tiny body/gown
      ctx.strokeStyle = lineCol;
      ctx.beginPath();
      ctx.moveTo(170, 207);
      ctx.lineTo(160, 250);
      ctx.lineTo(190, 250);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // RIGHT PANEL: Carmelite Saint (St. John/St. Teresa)
      // ==========================================
      ctx.save();
      // Saint Halo
      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(874, 140, 26, 0, Math.PI * 2);
      ctx.stroke();
      // rays
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      for (let a = 0; a < Math.PI * 2; a += 0.15) {
        ctx.beginPath();
        ctx.moveTo(874 + Math.cos(a) * 26, 140 + Math.sin(a) * 26);
        ctx.lineTo(874 + Math.cos(a) * 35, 140 + Math.sin(a) * 35);
        ctx.stroke();
      }

      // Head
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(874, 140, 11, 0, Math.PI * 2);
      ctx.stroke();
      // Face
      ctx.fillStyle = lineCol;
      ctx.beginPath();
      ctx.arc(870, 139, 1, 0, Math.PI * 2);
      ctx.arc(878, 139, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(874, 138);
      ctx.lineTo(874, 144);
      ctx.lineTo(872, 144);
      ctx.stroke();
      // Hood/Cowl
      ctx.beginPath();
      ctx.arc(874, 138, 14, Math.PI, 0);
      ctx.lineTo(888, 160);
      ctx.lineTo(860, 160);
      ctx.closePath();
      ctx.stroke();

      // Robe & Cloak
      ctx.beginPath();
      ctx.moveTo(874, 151);
      ctx.lineTo(844, 230);
      ctx.lineTo(824, 440);
      ctx.lineTo(924, 440);
      ctx.lineTo(904, 230);
      ctx.closePath();
      ctx.stroke();

      // Shading and habit folds
      for (let i = 840; i <= 900; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 250);
        ctx.quadraticCurveTo(874, 355, i + (i > 874 ? 10 : -10), 440);
        ctx.stroke();
      }

      // Book/Bible held in clasped hands
      ctx.strokeRect(862, 220, 24, 16);
      ctx.beginPath();
      ctx.moveTo(874, 220);
      ctx.lineTo(874, 236);
      ctx.stroke();
      // Small cross on book cover
      ctx.strokeStyle = goldCol;
      ctx.beginPath();
      ctx.moveTo(874, 224);
      ctx.lineTo(874, 232);
      ctx.moveTo(870, 227);
      ctx.lineTo(878, 227);
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // CENTER PANEL: Nuestra Señora del Carmen (The Engraving)
      // ==========================================
      ctx.save();
      const cx = 512;
      const cy = 240;

      // 1. Glorious Starburst Halo (Resplandor)
      // Soft Golden Radiance behind Mary
      const radialGold = ctx.createRadialGradient(cx, cy, 30, cx, cy, 210);
      radialGold.addColorStop(0, 'rgba(253, 250, 230, 0.9)');
      radialGold.addColorStop(0.3, 'rgba(255, 235, 140, 0.45)');
      radialGold.addColorStop(0.7, 'rgba(235, 190, 80, 0.15)');
      radialGold.addColorStop(1, 'rgba(250, 247, 240, 0)');
      ctx.fillStyle = radialGold;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.fill();

      // Draw 90 radiating fine gold lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI * 2; a += 0.07) {
        const rStart = 45;
        const rEnd = 145 + Math.sin(a * 24) * 15;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * rStart, cy + Math.sin(a) * rStart);
        ctx.lineTo(cx + Math.cos(a) * rEnd, cy + Math.sin(a) * rEnd);
        ctx.stroke();
      }

      // Draw 60 sharp charcoal engraving rays
      ctx.strokeStyle = 'rgba(42, 34, 28, 0.25)';
      ctx.lineWidth = 0.8;
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const rStart = 50;
        const rEnd = 120 + Math.cos(a * 18) * 20;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * rStart, cy + Math.sin(a) * rStart);
        ctx.lineTo(cx + Math.cos(a) * rEnd, cy + Math.sin(a) * rEnd);
        ctx.stroke();
      }

      // 2. Arch of 14 Majestic Flower Stars (exactly like the engraving!)
      const drawFlowerStar = (fx: number, fy: number) => {
        ctx.save();
        // Inner golden circle
        ctx.fillStyle = goldCol;
        ctx.beginPath();
        ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = lineCol;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 8 fine petals radiating outward
        for (let p = 0; p < 8; p++) {
          const pa = (p * Math.PI) / 4;
          const px1 = fx + Math.cos(pa) * 4.5;
          const py1 = fy + Math.sin(pa) * 4.5;
          const px2 = fx + Math.cos(pa) * 11;
          const py2 = fy + Math.sin(pa) * 11;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();

          // Tiny bead/bud at the petal tip
          ctx.beginPath();
          ctx.arc(px2, py2, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = lineCol;
          ctx.fill();
        }
        ctx.restore();
      };

      // Draw the arch of stars with their stems
      const startAngle = Math.PI * 0.94;
      const endAngle = Math.PI * 2.06;
      const starRadius = 168;
      const totalStars = 14;

      for (let i = 0; i < totalStars; i++) {
        const a = startAngle + (i * (endAngle - startAngle)) / (totalStars - 1);
        const fx = cx + Math.cos(a) * starRadius;
        const fy = cy + Math.sin(a) * starRadius;

        // Draw the long line/stem from the inner halo to the flower star
        ctx.strokeStyle = 'rgba(42, 34, 28, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 105, cy + Math.sin(a) * 105);
        ctx.lineTo(fx - Math.cos(a) * 12, fy - Math.sin(a) * 12);
        ctx.stroke();

        drawFlowerStar(fx, fy);
      }

      // 3. The Christian Cross & Radiant Light at the Peak
      const crossY = cy - 180;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = lineCol;
      // Draw stylized golden-shadowed cross
      ctx.beginPath();
      // Vertical
      ctx.moveTo(cx, crossY - 25);
      ctx.lineTo(cx, crossY + 15);
      // Horizontal
      ctx.moveTo(cx - 15, crossY - 12);
      ctx.lineTo(cx + 15, crossY - 12);
      ctx.stroke();

      // Golden light bursts from the cross
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 1.0;
      for (let a = 0; a < Math.PI * 2; a += 0.25) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 6, crossY - 12 + Math.sin(a) * 6);
        ctx.lineTo(cx + Math.cos(a) * 22, crossY - 12 + Math.sin(a) * 22);
        ctx.stroke();
      }

      // 4. The Imperial Crown (at Mary's Head)
      const crownY = cy - 130;
      // Draw grand crown shape filled with gold and detailed charcoal engravings
      ctx.fillStyle = goldCol;
      ctx.beginPath();
      ctx.moveTo(cx - 24, crownY);
      ctx.quadraticCurveTo(cx, crownY - 30, cx + 24, crownY);
      ctx.lineTo(cx + 18, crownY + 15);
      ctx.lineTo(cx - 18, crownY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crown jewels/arches
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - 18, crownY);
      ctx.quadraticCurveTo(cx - 10, crownY - 24, cx, crownY - 28);
      ctx.quadraticCurveTo(cx + 10, crownY - 24, cx + 18, crownY);
      ctx.stroke();

      // Inner velvet red cap outline
      ctx.fillStyle = '#8B0000'; // Dark crimson
      ctx.beginPath();
      ctx.arc(cx, crownY, 12, Math.PI, 0);
      ctx.fill();

      // 5. Serene Face and Hair
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = lineCol;
      // Face
      ctx.beginPath();
      ctx.arc(cx, cy - 90, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#FCFAF5'; // Skin white parchment
      ctx.fill();
      ctx.stroke();

      // Closed/prayerful serene eyes
      ctx.fillStyle = lineCol;
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 92, 1.2, 0, Math.PI * 2);
      ctx.arc(cx + 4, cy - 92, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Serene soft smile
      ctx.beginPath();
      ctx.arc(cx, cy - 90, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      // Flowing Dark Hair on both sides
      ctx.fillStyle = '#3E2A20';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 96);
      ctx.quadraticCurveTo(cx - 18, cy - 80, cx - 18, cy - 50);
      ctx.quadraticCurveTo(cx - 12, cy - 40, cx - 10, cy - 50);
      ctx.quadraticCurveTo(cx - 10, cy - 80, cx, cy - 98);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 96);
      ctx.quadraticCurveTo(cx + 18, cy - 80, cx + 18, cy - 50);
      ctx.quadraticCurveTo(cx + 12, cy - 40, cx + 10, cy - 50);
      ctx.quadraticCurveTo(cx + 10, cy - 80, cx, cy - 98);
      ctx.fill();
      ctx.stroke();

      // 6. The Grand Triangular Mantle (Robe/Cloak)
      ctx.lineWidth = 2.0;
      // Cream white cloak background
      ctx.fillStyle = '#FAF7F0';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.quadraticCurveTo(cx - 55, cy - 10, cx - 110, cy + 150); // Left outer line
      ctx.lineTo(cx + 110, cy + 150); // Base line
      ctx.quadraticCurveTo(cx + 55, cy - 10, cx, cy - 80); // Right outer line
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fine golden-brocade borders of the mantle (exactly like the detailed embroidery!)
      ctx.save();
      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 70);
      ctx.quadraticCurveTo(cx - 55, cy - 10, cx - 106, cy + 146);
      ctx.moveTo(cx + 8, cy - 70);
      ctx.quadraticCurveTo(cx + 55, cy - 10, cx + 106, cy + 146);
      ctx.stroke();
      ctx.restore();

      // Charcoal etching border details
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = lineCol;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 65);
      ctx.quadraticCurveTo(cx - 45, cy - 10, cx - 100, cy + 144);
      ctx.moveTo(cx, cy - 65);
      ctx.quadraticCurveTo(cx + 45, cy - 10, cx + 100, cy + 144);
      ctx.stroke();

      // Exquisite hand-drawn baroque damask patterns on the mantle
      ctx.save();
      ctx.strokeStyle = 'rgba(42, 34, 28, 0.35)';
      ctx.lineWidth = 0.8;
      // Left side scrolls
      for (let h = cy - 20; h < cy + 130; h += 28) {
        ctx.beginPath();
        ctx.arc(cx - 40 - (h - cy) * 0.3, h, 14, 0, Math.PI * 1.5);
        ctx.stroke();
        // Little flowers inside scroll
        ctx.fillStyle = goldCol;
        ctx.beginPath();
        ctx.arc(cx - 40 - (h - cy) * 0.3, h, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Right side scrolls
      for (let h = cy - 20; h < cy + 130; h += 28) {
        ctx.beginPath();
        ctx.arc(cx + 40 + (h - cy) * 0.3, h, 14, Math.PI, Math.PI * 2.5);
        ctx.stroke();
        ctx.fillStyle = goldCol;
        ctx.beginPath();
        ctx.arc(cx + 40 + (h - cy) * 0.3, h, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Brown Scapular hanging down the center
      ctx.fillStyle = '#3D281E'; // Rich dark Carmelite brown
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 50);
      ctx.lineTo(cx + 15, cy - 50);
      ctx.lineTo(cx + 12, cy + 150);
      ctx.lineTo(cx - 12, cy + 150);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gold embroidery line on Scapular
      ctx.strokeStyle = goldCol;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 45);
      ctx.lineTo(cx, cy + 145);
      ctx.stroke();

      // 7. Baby Jesus held on the Arm
      const jx = cx - 35;
      const jy = cy - 20;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = lineCol;

      // Body/Gown of Baby Jesus
      ctx.fillStyle = '#FCFAF5';
      ctx.beginPath();
      ctx.moveTo(jx - 10, jy);
      ctx.lineTo(jx - 25, jy + 55);
      ctx.lineTo(jx + 10, jy + 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(jx - 8, jy - 12, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Halo & small crown
      ctx.strokeStyle = goldCol;
      ctx.beginPath();
      ctx.arc(jx - 8, jy - 12, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = goldCol;
      ctx.fillRect(jx - 11, jy - 23, 6, 4);

      // 8. Kneeling Figures under the Mantle (praying souls)
      // Left praying figure
      const lx = cx - 75;
      const ly = cy + 105;
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.2;
      ctx.fillStyle = '#FAF7F0';
      // Head
      ctx.beginPath();
      ctx.arc(lx, ly, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Body/Robe
      ctx.beginPath();
      ctx.moveTo(lx - 6, ly + 7);
      ctx.quadraticCurveTo(lx - 25, ly + 20, lx - 20, ly + 42);
      ctx.lineTo(lx + 10, ly + 42);
      ctx.quadraticCurveTo(lx + 8, ly + 15, lx + 5, ly + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Clasped hands in prayer
      ctx.beginPath();
      ctx.moveTo(lx + 4, ly + 14);
      ctx.lineTo(lx + 12, ly + 10);
      ctx.lineTo(lx + 4, ly + 8);
      ctx.stroke();

      // Right praying figure
      const rx = cx + 75;
      const ry = cy + 105;
      // Head
      ctx.beginPath();
      ctx.arc(rx, ry, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Body/Robe
      ctx.beginPath();
      ctx.moveTo(rx + 6, ry + 7);
      ctx.quadraticCurveTo(rx + 25, ry + 20, rx + 20, ry + 42);
      ctx.lineTo(rx - 10, ry + 42);
      ctx.quadraticCurveTo(rx - 8, ry + 15, rx - 5, ry + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Clasped hands in prayer
      ctx.beginPath();
      ctx.moveTo(rx - 4, ry + 14);
      ctx.lineTo(rx - 12, ry + 10);
      ctx.lineTo(rx - 4, ry + 8);
      ctx.stroke();

      // 9. Majestic Silver/Gold Crescent Moon (under Mary's feet)
      const moonY = cy + 142;
      ctx.strokeStyle = '#CFD8DC'; // Silver gray outline
      ctx.lineWidth = 1.0;
      ctx.fillStyle = '#FCFAF5';
      ctx.beginPath();
      // Outward arc pointing straight up
      ctx.arc(cx, moonY - 35, 62, 0.15 * Math.PI, 0.85 * Math.PI);
      // Inward arc to form the crescent tip
      ctx.arc(cx, moonY - 18, 48, 0.8 * Math.PI, 0.2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Engraved shading on the moon
      ctx.strokeStyle = 'rgba(100, 110, 120, 0.2)';
      ctx.lineWidth = 0.8;
      for (let mx = cx - 50; mx <= cx + 50; mx += 8) {
        ctx.beginPath();
        ctx.moveTo(mx, moonY + 12);
        ctx.lineTo(mx - 4, moonY + 22);
        ctx.stroke();
      }

      // 10. Ornate Neoclassical Pedestal (The Throne base)
      const baseTopY = cy + 150;
      ctx.strokeStyle = lineCol;
      ctx.lineWidth = 1.5;
      ctx.fillStyle = '#FAF7F0';

      // Tier 1 (Small top plate)
      ctx.beginPath();
      ctx.rect(cx - 70, baseTopY, 140, 10);
      ctx.fill();
      ctx.stroke();

      // Tier 2 (Slanted decorative middle)
      ctx.beginPath();
      ctx.moveTo(cx - 65, baseTopY + 10);
      ctx.lineTo(cx - 85, baseTopY + 36);
      ctx.lineTo(cx + 85, baseTopY + 36);
      ctx.lineTo(cx + 65, baseTopY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Scroll carvings on slanted pedestal
      ctx.beginPath();
      ctx.arc(cx - 45, baseTopY + 23, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 45, baseTopY + 23, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Tier 3 (Main base block)
      ctx.beginPath();
      ctx.rect(cx - 100, baseTopY + 36, 200, 16);
      ctx.fill();
      ctx.stroke();

      // Classic engraving border detail on base
      ctx.strokeRect(cx - 95, baseTopY + 40, 190, 8);

      // Cherub face and wings at the very center bottom of Mary's throne
      const cherubX = cx;
      const cherubY = baseTopY + 23;
      // Head
      ctx.fillStyle = '#FCFAF5';
      ctx.beginPath();
      ctx.arc(cherubX, cherubY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Little wings flaring left and right
      ctx.beginPath();
      ctx.moveTo(cherubX - 5, cherubY);
      ctx.quadraticCurveTo(cherubX - 18, cherubY - 8, cherubX - 16, cherubY + 3);
      ctx.quadraticCurveTo(cherubX - 10, cherubY + 2, cherubX - 2, cherubY + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cherubX + 5, cherubY);
      ctx.quadraticCurveTo(cherubX + 18, cherubY - 8, cherubX + 16, cherubY + 3);
      ctx.quadraticCurveTo(cherubX + 10, cherubY + 2, cherubX + 2, cherubY + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
    return c;
  }, []);

  return (
    <group position={[0, 4.3, -7.65]}>
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
        <meshStandardMaterial 
          map={altarTexture || undefined} 
          color={altarTexture ? '#ffffff' : '#f2ecd8'}
          roughness={0.6} 
          metalness={0.1} 
          emissive={altarTexture ? '#ffffff' : '#000000'}
          emissiveMap={altarTexture || undefined}
          emissiveIntensity={altarTexture ? 0.35 : 0}
          side={THREE.DoubleSide}
        />
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

      {/* Warm Golden Interior Ambient Light for the Altar and Retablo */}
      <pointLight 
        position={[0, 3.5, -5]} 
        color="#FFE0B2" 
        intensity={2.5} 
        distance={10} 
        decay={1.2} 
        castShadow 
      />

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
        
        let nextTree = treePositions[Math.floor(Math.random() * treePositions.length)];
        let target = new THREE.Vector3(nextTree[0], nextTree[1] + 4 + Math.random() * 2, nextTree[2]);
        let attempts = 0;
        
        // Check if flight path crosses the chapel cylinder (radius 7.5 centered at [0, -15])
        const pathIntersects = (p1: THREE.Vector3, p2: THREE.Vector3) => {
          for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const tx = p1.x + (p2.x - p1.x) * t;
            const tz = p1.z + (p2.z - p1.z) * t;
            const dx = tx - 0;
            const dz = tz - (-15);
            if (dx * dx + dz * dz < 56.25) return true;
          }
          return false;
        };
        
        while (pathIntersects(pos.current, target) && attempts < 15) {
          nextTree = treePositions[Math.floor(Math.random() * treePositions.length)];
          target.set(nextTree[0], nextTree[1] + 4 + Math.random() * 2, nextTree[2]);
          attempts++;
        }
        
        startPos.current.copy(pos.current);
        targetPos.current.copy(target);
        
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
    
    // Add Chapel Walls (Thickened on the exterior to prevent player clipping/tunneling)
    colliders.push({ type: 'box', minX: -6.0, maxX: 6.0, minZ: -27.0, maxZ: -22.75 }); // Back (Thickened outwards to Z=-27.0)
    colliders.push({ type: 'box', minX: -7.5, maxX: -4.75, minZ: -24.0, maxZ: -6.5 }); // Left (Thickened outwards to X=-7.5)
    colliders.push({ type: 'box', minX: 4.75, maxX: 7.5, minZ: -24.0, maxZ: -6.5 }); // Right (Thickened outwards to X=7.5)
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
