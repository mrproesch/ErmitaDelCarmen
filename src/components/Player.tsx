import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { checkCollision } from '../utils/collision';
import { inputState, isMobile } from '../utils/input';

const SPEED = 5;

export function Player({ onLock, onUnlock }: { onLock?: () => void, onUnlock?: () => void }) {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'));
  const nearAltarState = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyE') {
        window.dispatchEvent(new CustomEvent('lightCandle'));
      }
      if (isMobile) return;
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
      if (isMobile) return;
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
    if (isMobile) {
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= inputState.lookX * 0.005;
      euler.current.x -= inputState.lookY * 0.005;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
      inputState.lookX = 0;
      inputState.lookY = 0;

      direction.current.z = inputState.moveZ;
      direction.current.x = inputState.moveX;
    } else {
      direction.current.z = Number(moveForward) - Number(moveBackward);
      direction.current.x = Number(moveLeft) - Number(moveRight);
    }
    
    direction.current.normalize();

    const isMoving = isMobile ? (inputState.moveX !== 0 || inputState.moveZ !== 0) : (moveForward || moveBackward || moveLeft || moveRight);

    if (isMoving) {
      velocity.current.z -= direction.current.z * 400.0 * delta;
      velocity.current.x -= direction.current.x * 400.0 * delta;
    }

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
    if (isMoving) {
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

    // Check if near the altar/candles (World position Z = -19.5)
    const distToAltar = camera.position.distanceTo(new Vector3(0, 1, -19.5));
    const isNearAltar = distToAltar < 4.5;
    if (isNearAltar !== nearAltarState.current) {
      nearAltarState.current = isNearAltar;
      window.dispatchEvent(new CustomEvent('nearAltar', { detail: isNearAltar }));
    }
  });

  return !isMobile ? <PointerLockControls onLock={onLock} onUnlock={onUnlock} /> : null;
}
