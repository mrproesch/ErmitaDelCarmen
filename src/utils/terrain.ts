export function getBaseTerrainHeight(x: number, z: number): number {
  const cx = 0;
  const cz = -15;
  const flatRadius = 14;
  const slopeWidth = 10;
  const maxH = 4;
  
  const dx = x - cx;
  const dz = z - cz;
  const dist = Math.sqrt(dx * dx + dz * dz);
  
  if (dist <= flatRadius) return maxH;
  if (dist < flatRadius + slopeWidth) {
    const t = (dist - flatRadius) / slopeWidth;
    // Smoothstep function for graceful curve
    const smoothT = t * t * (3 - 2 * t); 
    return maxH * (1 - smoothT);
  }
  return 0;
}

export function getGroundHeight(x: number, z: number): number {
  const terrainH = getBaseTerrainHeight(x, z);
  
  // Check if we are on the stairs: Path from X=-2.5 to 2.5, Z=0 to 8
  if (Math.abs(x) <= 2.5 && z > -1 && z <= 8) {
    if (z < 0) return Math.max(terrainH, 4);
    
    // We step down 0.5 units for every 1 unit of Z
    const step = Math.floor(z); // 0 to 7
    const stairH = 4 - (step * 0.5) - 0.5;
    
    // The top of the stairs shouldn't dip below the natural terrain curve
    if (stairH > terrainH) return stairH;
  }
  
  return terrainH;
}
