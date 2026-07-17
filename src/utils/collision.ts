export type Collider = 
  | { type: 'circle'; x: number; z: number; r: number }
  | { type: 'box'; minX: number; maxX: number; minZ: number; maxZ: number };

export const colliders: Collider[] = [];

export function checkCollision(x: number, z: number, radius: number): boolean {
  for (const c of colliders) {
    if (c.type === 'circle') {
      const dx = x - c.x;
      const dz = z - c.z;
      const minDist = radius + c.r;
      if (dx * dx + dz * dz < minDist * minDist) return true;
    } else if (c.type === 'box') {
      const closestX = Math.max(c.minX, Math.min(x, c.maxX));
      const closestZ = Math.max(c.minZ, Math.min(z, c.maxZ));
      const dx = x - closestX;
      const dz = z - closestZ;
      if (dx * dx + dz * dz < radius * radius) return true;
    }
  }
  return false;
}
