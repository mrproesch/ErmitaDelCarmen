import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { checkCollision } from '../utils/collision';

const SPEED = 5;

export function Player({ onLock, onUnlock }: { onLock?: () => void, onUnlock?: () => void }) {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMoveForward(true);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMoveLeft(true);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMoveBackward(true);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMoveRight(true);
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          setMoveForward(false);
          break;
        case 'ArrowLeft':
        case 'KeyA':
          setMoveLeft(false);
          break;
        case 'ArrowDown':
        case 'KeyS':
          setMoveBackward(false);
          break;
        case 'ArrowRight':
        case 'KeyD':
          setMoveRight(false);
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    direction.current.z = Number(moveForward) - Number(moveBackward);
    direction.current.x = Number(moveLeft) - Number(moveRight); // Fixed: Left - Right
    direction.current.normalize();

    if (moveForward || moveBackward) velocity.current.z -= direction.current.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.current.x -= direction.current.x * 400.0 * delta;

    const oldPos = camera.position.clone();

    camera.translateX(velocity.current.x * delta);
    if (checkCollision(camera.position.x, camera.position.z, 0.4)) {
      camera.position.copy(oldPos);
      velocity.current.x = 0;
    }

    const posAfterX = camera.position.clone();

    camera.translateZ(velocity.current.z * delta);
    if (checkCollision(camera.position.x, camera.position.z, 0.4)) {
      camera.position.copy(posAfterX);
      velocity.current.z = 0;
    }
    
    // Damping
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    // Head bob
    if (moveForward || moveBackward || moveLeft || moveRight) {
      const time = state.clock.getElapsedTime();
      camera.position.y = 1.6 + Math.sin(time * 10) * 0.1;
    } else {
      // Return to neutral height smoothly
      camera.position.y += (1.6 - camera.position.y) * 10 * delta;
    }

    // Clamp to fence boundaries
    const BOUND = 68;
    if (camera.position.x > BOUND) camera.position.x = BOUND;
    if (camera.position.x < -BOUND) camera.position.x = -BOUND;
    if (camera.position.z > BOUND) camera.position.z = BOUND;
    if (camera.position.z < -BOUND) camera.position.z = -BOUND;
  });

  return <PointerLockControls onLock={onLock} onUnlock={onUnlock} />;
}
