import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [fileName, setFileName] = useState<string>('Buscando música de fondo...');
  const [hasFileLoaded, setHasFileLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scan for background music on mount
  useEffect(() => {
    // List of common file names to probe in the public folder
    const defaultPaths = [
      '/music.mp3', '/background.mp3', '/ambient.mp3', '/audio.mp3', 
      '/music.wav', '/background.wav', '/audio.wav',
      '/music.ogg', '/background.ogg', '/audio.ogg'
    ];

    const tryLoadDefault = (index: number) => {
      if (index >= defaultPaths.length) {
        setFileName('Música no encontrada (agrega music.mp3 en public/)');
        return;
      }
      
      const testPath = defaultPaths[index];
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = testPath;
      
      audio.oncanplaythrough = () => {
        setHasFileLoaded(true);
        setCurrentSrc(testPath);
        // Clean up the name for display (e.g. "music.mp3")
        setFileName(testPath.substring(1)); 
        console.log(`Background music auto-detected at ${testPath}`);
        
        if (audioElementRef.current) {
          audioElementRef.current.src = testPath;
        }
      };

      audio.onerror = () => {
        tryLoadDefault(index + 1);
      };
    };

    tryLoadDefault(0);
  }, []);

  // Sync volume & mute settings
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    if (!hasFileLoaded) {
      return;
    }

    if (!audioElementRef.current) return;

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log('Playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  return (
    <div 
      className="absolute bottom-4 left-4 z-40 bg-stone-900/90 border border-amber-500/20 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center shadow-2xl text-stone-200 select-none transition-all duration-300 hover:border-amber-500/50 hover:scale-105"
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      
      {/* Invisible HTML Audio Element */}
      <audio 
        ref={audioElementRef} 
        loop 
        preload="auto"
      />

      {/* Circle Play/Pause Button */}
      <button 
        onClick={handleTogglePlay}
        disabled={!hasFileLoaded}
        className={`w-full h-full rounded-full flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all cursor-pointer pointer-events-auto ${!hasFileLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        title={hasFileLoaded ? (isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo') : 'Buscando música...'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-amber-400/20" />
        ) : (
          <Play className="w-5 h-5 fill-amber-400 ml-0.5" />
        )}
      </button>

    </div>
  );
}
