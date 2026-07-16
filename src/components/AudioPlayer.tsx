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
      className="absolute bottom-4 left-4 z-40 bg-stone-900/90 border border-amber-500/20 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xl max-w-[280px] md:max-w-[340px] text-stone-200 select-none transition-all duration-300 hover:border-amber-500/40"
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

      {/* Audio icon/button */}
      <div 
        onClick={handleTogglePlay}
        className={`w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isPlaying 
            ? 'bg-amber-950/50 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse' 
            : 'bg-stone-950/80 text-stone-500 border border-stone-800'
        }`}
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 w-4">
            <span className="w-[3px] bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.8s' }} />
            <span className="w-[3px] bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.2s' }} />
            <span className="w-[3px] bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.9s' }} />
            <span className="w-[3px] bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.1s' }} />
          </div>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </div>

      {/* Info & controls block */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
        {/* Title or File Info */}
        <div className="text-xs font-serif font-medium text-stone-100 truncate pr-2 max-w-[150px] md:max-w-[190px]">
          {fileName}
        </div>

        {/* Volume & Controls Row */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button 
            onClick={handleTogglePlay}
            disabled={!hasFileLoaded}
            className={`text-amber-400 hover:text-amber-300 hover:scale-115 active:scale-90 transition-all cursor-pointer pointer-events-auto ${!hasFileLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-amber-400/10" /> : <Play className="w-4 h-4 fill-amber-400" />}
          </button>

          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={!hasFileLoaded}
            className={`text-stone-400 hover:text-stone-200 transition-all cursor-pointer pointer-events-auto ${!hasFileLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400/80" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            disabled={!hasFileLoaded}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className={`w-16 md:w-20 h-1 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500 pointer-events-auto ${!hasFileLoaded ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label="Volumen"
          />
        </div>
      </div>

    </div>
  );
}
