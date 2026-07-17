export function getBaseTerrainHeight(x: number, z: number): number {
  const cx = 0;
  const cz = -15;
  const flatRadius = 14;
  const slopeWidth = 10;
  const maxH = 4;
  
  let baseH = 0;

  // Pond depression
  const px = -35;
  const pz = 15;
  const pRadius = 14;
  const pDepth = 1.2;
  const pDist = Math.sqrt((x - px) ** 2 + (z - pz) ** 2);
  if (pDist < pRadius) {
    const t = pDist / pRadius;
    const smoothT = t * t * (3 - 2 * t);
    baseH -= pDepth * (1 - smoothT);
  }
  
  const dx = x - cx;
  const dz = z - cz;
  const dist = Math.sqrt(dx * dx + dz * dz);
  
  if (dist <= flatRadius) return maxH + baseH;
  if (dist < flatRadius + slopeWidth) {
    const t = (dist - flatRadius) / slopeWidth;
    // Smoothstep function for graceful curve
    const smoothT = t * t * (3 - 2 * t); 
    return Math.max(maxH * (1 - smoothT), baseH);
  }
  return baseH;
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
