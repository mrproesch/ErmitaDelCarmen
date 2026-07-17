import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { checkCollision } from '../utils/collision';
import { inputState, isMobile } from '../utils/input';
import { getGroundHeight } from '../utils/terrain';

const SPEED = 5;

export function Player({ onLock, onUnlock, prayerActive }: { onLock?: () => void, onUnlock?: () => void, prayerActive?: boolean }) {
  const { camera, gl } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'));
  const nearAltarState = useRef(false);
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Spawn inside the chapel, facing the altar (looking in negative Z direction)
    camera.position.set(0, 5.6, -16);
    camera.rotation.set(0, 0, 0);
    euler.current.set(0, 0, 0, 'YXZ');
  }, [camera]);

  useEffect(() => {
    const handleRequest = () => {
      window.dispatchEvent(new CustomEvent('nearAltar', { detail: nearAltarState.current }));
    };
    window.addEventListener('requestNearAltar', handleRequest);
    return () => window.removeEventListener('requestNearAltar', handleRequest);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (prayerActive) return;
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
      if (prayerActive) {
        setMoveForward(false);
        setMoveBackward(false);
        setMoveLeft(false);
        setMoveRight(false);
        return;
      }
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
  }, [prayerActive]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (prayerActive || isMobile) return;
      isDragging.current = true;
      previousPointerPosition.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current || prayerActive || isMobile || document.pointerLockElement) return;
      
      const deltaX = event.clientX - previousPointerPosition.current.x;
      const deltaY = event.clientY - previousPointerPosition.current.y;
      
      previousPointerPosition.current = { x: event.clientX, y: event.clientY };

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= deltaX * 0.0010; // Lowered from 0.0025 for smoother web controls
      euler.current.x -= deltaY * 0.0010; // Lowered from 0.0025 for smoother web controls
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const domElement = gl.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [camera, gl, prayerActive]);

  useFrame((state, delta) => {
    if (prayerActive) {
      // Slow down player to a halt
      velocity.current.set(0, 0, 0);
      return;
    }

    if (isMobile) {
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= inputState.lookX * 0.0065; // Increased sensitivity for fast and responsive mobile look
      euler.current.x -= inputState.lookY * 0.0065; // Increased sensitivity for fast and responsive mobile look
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
      velocity.current.z -= direction.current.z * 120.0 * delta; // Lowered from 400.0 for natural walk speed
      velocity.current.x -= direction.current.x * 120.0 * delta; // Lowered from 400.0 for natural walk speed
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

    // Y positioning and head bob
    const targetY = getGroundHeight(camera.position.x, camera.position.z) + 1.6;
    
    if (isMoving) {
      const time = state.clock.getElapsedTime();
      const idealY = targetY + Math.sin(time * 10) * 0.1;
      camera.position.y += (idealY - camera.position.y) * 15 * delta;
    } else {
      camera.position.y += (targetY - camera.position.y) * 10 * delta;
    }

    // Clamp to fence boundaries
    const BOUND = 68;
    if (camera.position.x > BOUND) camera.position.x = BOUND;
    if (camera.position.x < -BOUND) camera.position.x = -BOUND;
    if (camera.position.z > BOUND) camera.position.z = BOUND;
    if (camera.position.z < -BOUND) camera.position.z = -BOUND;

    // Check if near the altar/candles (World position X=0, Y=4.5, Z=-19.5)
    // The previously Y=1 was before the chapel was lifted by 4 units.
    const distToAltar = camera.position.distanceTo(new Vector3(0, 4.5, -19.5));
    const isNearAltar = distToAltar < 4.5;
    if (isNearAltar !== nearAltarState.current) {
      nearAltarState.current = isNearAltar;
      window.dispatchEvent(new CustomEvent('nearAltar', { detail: isNearAltar }));
    }
  });

  return !isMobile && !prayerActive ? <PointerLockControls onLock={onLock} onUnlock={onUnlock} /> : null;
}
