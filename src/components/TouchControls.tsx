import { useEffect, useRef, useState } from 'react';
import { Move, Eye } from 'lucide-react';
import { inputState } from '../utils/input';

export function TouchControls() {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [showJoystick, setShowJoystick] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isLooking, setIsLooking] = useState(false);
  
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
          setIsMoving(true);
        } else {
          // Right side - Look
          activeTouches.current.look = touch.identifier;
          lastLookPos.current = { x: touch.clientX, y: touch.clientY };
          setIsLooking(true);
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
          setIsMoving(false);
          inputState.moveX = 0;
          inputState.moveZ = 0;
        } else if (touch.identifier === activeTouches.current.look) {
          activeTouches.current.look = null;
          setIsLooking(false);
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
      {/* Left side guide - Movement */}
      <div 
        className={`absolute left-[20%] bottom-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
          isMoving ? 'opacity-0 scale-90' : 'opacity-40 scale-100'
        }`}
      >
        <div className="w-20 h-20 border border-dashed border-white/40 rounded-full flex items-center justify-center bg-black/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(255,255,255,0.05)] animate-pulse">
          <Move className="w-7 h-7 text-white/70" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] tracking-widest text-white/80 font-bold uppercase font-sans">Moverse</span>
          <span className="text-[9px] tracking-wider text-white/50 font-medium font-sans">Arrastra aquí</span>
        </div>
      </div>

      {/* Right side guide - Looking around */}
      <div 
        className={`absolute right-[20%] bottom-[25%] translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ${
          isLooking ? 'opacity-0 scale-90' : 'opacity-40 scale-100'
        }`}
      >
        <div className="w-20 h-20 border border-dashed border-white/40 rounded-full flex items-center justify-center bg-black/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <Eye className="w-7 h-7 text-white/70" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] tracking-widest text-white/80 font-bold uppercase font-sans">Mirar</span>
          <span className="text-[9px] tracking-wider text-white/50 font-medium font-sans">Desliza aquí</span>
        </div>
      </div>

      {/* Dynamic Joystick (shown on touch drag) */}
      {showJoystick && (
        <>
          <div 
            className="absolute w-24 h-24 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 bg-black/25 backdrop-blur-[1px] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            style={{ left: joystickOrigin.current.x, top: joystickOrigin.current.y }}
          />
          <div 
            className="absolute w-12 h-12 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg border border-white/30"
            style={{ left: joystickPos.x, top: joystickPos.y }}
          />
        </>
      )}
    </div>
  );
}
