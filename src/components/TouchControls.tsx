import { useEffect, useRef, useState } from 'react';
import { inputState } from '../utils/input';

export function TouchControls() {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [showJoystick, setShowJoystick] = useState(false);
  const joystickOrigin = useRef({ x: 0, y: 0 });
  const activeTouches = useRef<{ move: number | null, look: number | null }>({ move: null, look: null });
  const lastLookPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.clientX < window.innerWidth / 2) {
          // Left side - Movement
          activeTouches.current.move = touch.identifier;
          joystickOrigin.current = { x: touch.clientX, y: touch.clientY };
          setJoystickPos({ x: touch.clientX, y: touch.clientY });
          setShowJoystick(true);
        } else {
          // Right side - Look
          activeTouches.current.look = touch.identifier;
          lastLookPos.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouches.current.move) {
          const dx = touch.clientX - joystickOrigin.current.x;
          const dy = touch.clientY - joystickOrigin.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 50;
          
          let nx = dx;
          let ny = dy;
          if (distance > maxDist) {
            nx = (dx / distance) * maxDist;
            ny = (dy / distance) * maxDist;
          }
          
          setJoystickPos({
            x: joystickOrigin.current.x + nx,
            y: joystickOrigin.current.y + ny
          });

          inputState.moveX = -(nx / maxDist); // Left is positive in our 3D logic
          inputState.moveZ = -(ny / maxDist); // Forward is positive
        } else if (touch.identifier === activeTouches.current.look) {
          const dx = touch.clientX - lastLookPos.current.x;
          const dy = touch.clientY - lastLookPos.current.y;
          inputState.lookX += dx;
          inputState.lookY += dy;
          lastLookPos.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouches.current.move) {
          activeTouches.current.move = null;
          setShowJoystick(false);
          inputState.moveX = 0;
          inputState.moveZ = 0;
        } else if (touch.identifier === activeTouches.current.look) {
          activeTouches.current.look = null;
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none touch-none">
      {showJoystick && (
        <>
          <div 
            className="absolute w-24 h-24 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 bg-black/20"
            style={{ left: joystickOrigin.current.x, top: joystickOrigin.current.y }}
          />
          <div 
            className="absolute w-12 h-12 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ left: joystickPos.x, top: joystickPos.y }}
          />
        </>
      )}
    </div>
  );
}
