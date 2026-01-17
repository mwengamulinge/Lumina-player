
import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Repeat, Shuffle, Volume2, Heart 
} from 'lucide-react';
import { Track } from '../types.ts';

interface PlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  track, isPlaying, onTogglePlay, onNext, onPrev, 
  currentTime, duration, onSeek, volume, onVolumeChange 
}) => {
  if (!track) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * (duration || 0));
  };

  return (
    <div className="h-20 lg:h-24 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-4 lg:px-8 fixed lg:sticky bottom-[calc(64px+env(safe-area-inset-bottom))] lg:bottom-0 left-0 right-0 z-50 shadow-2xl">
      {/* Track Info */}
      <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-1/3 min-w-0">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl object-cover shadow-lg border border-white/10" 
        />
        <div className="flex flex-col min-w-0 flex-1 lg:flex-none">
          <span className="font-bold text-xs lg:text-sm truncate tracking-tight">{track.title}</span>
          <span className="text-[10px] lg:text-xs text-slate-500 truncate font-semibold">{track.artist}</span>
        </div>
        <button className="hidden sm:block p-2 text-slate-600 hover:text-pink-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="fixed lg:relative bottom-1.5 lg:bottom-auto left-0 right-0 px-4 lg:px-0 flex flex-col items-center gap-1 lg:gap-2 w-full lg:w-1/3">
        <div className="flex items-center gap-5 lg:gap-8">
          <button className="hidden lg:block text-slate-500 hover:text-white transition-colors">
            <Shuffle size={18} />
          </button>
          <button onClick={onPrev} className="p-1 text-slate-300 hover:text-white transition-all active:scale-90">
            {/* Fixed: Removed invalid lg:size and used className for responsive sizing */}
            <SkipBack className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            {/* Fixed: Removed invalid lg:size and used className for responsive sizing */}
            {isPlaying ? <Pause className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6 ml-1" fill="currentColor" />}
          </button>
          <button onClick={onNext} className="p-1 text-slate-300 hover:text-white transition-all active:scale-90">
            {/* Fixed: Removed invalid lg:size and used className for responsive sizing */}
            <SkipForward className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" />
          </button>
          <button className="hidden lg:block text-slate-500 hover:text-white transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="w-full max-w-lg flex items-center gap-2 lg:gap-4 px-2">
          <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
          <div 
            onClick={handleSeekClick}
            className="flex-1 h-1 lg:h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer relative"
          >
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-150"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold tabular-nums w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume/Utilities */}
      <div className="hidden lg:flex items-center justify-end gap-6 w-1/3">
        <div className="flex items-center gap-3 group">
          <Volume2 size={18} className="text-slate-500 group-hover:text-white transition-colors" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
