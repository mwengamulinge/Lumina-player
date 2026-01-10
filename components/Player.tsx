
import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Repeat, Shuffle, Volume2, Mic2, ListMusic, 
  Maximize2, Heart 
} from 'lucide-react';
import { Track } from '../types';

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
    onSeek(percentage * duration);
  };

  return (
    <div className="h-20 lg:h-24 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-4 lg:px-6 fixed lg:sticky bottom-16 lg:bottom-0 left-0 right-0 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-1/3">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover shadow-lg border border-white/10" 
        />
        <div className="flex flex-col min-w-0 flex-1 lg:flex-none">
          <span className="font-semibold text-xs lg:text-sm truncate max-w-[120px] lg:max-w-[200px]">{track.title}</span>
          <span className="text-[10px] lg:text-xs text-slate-400 truncate max-w-[120px] lg:max-w-[200px]">{track.artist}</span>
        </div>
        <button className="hidden sm:block ml-2 text-slate-500 hover:text-pink-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="fixed lg:relative bottom-1.5 lg:bottom-auto left-0 right-0 px-4 lg:px-0 flex flex-col items-center gap-1.5 lg:gap-2 w-full lg:w-1/3">
        <div className="flex items-center gap-4 lg:gap-6">
          <button className="hidden lg:block text-slate-400 hover:text-white transition-colors">
            <Shuffle size={18} />
          </button>
          <button onClick={onPrev} className="text-slate-200 hover:text-white transition-colors">
            <SkipBack size={20} lg:size={22} fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={18} lg:size={20} fill="currentColor" /> : <Play size={18} lg:size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-slate-200 hover:text-white transition-colors">
            <SkipForward size={20} lg:size={22} fill="currentColor" />
          </button>
          <button className="hidden lg:block text-slate-400 hover:text-white transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="w-full max-w-md flex items-center gap-2 lg:gap-3">
          <span className="text-[9px] lg:text-[10px] text-slate-500 font-mono w-8">{formatTime(currentTime)}</span>
          <div 
            onClick={handleSeekClick}
            className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden group cursor-pointer relative"
          >
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 group-hover:bg-blue-400 transition-colors"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="text-[9px] lg:text-[10px] text-slate-500 font-mono w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Utilities */}
      <div className="hidden lg:flex items-center justify-end gap-4 w-1/3">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Mic2 size={18} />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-2 group">
          <Volume2 size={18} className="text-slate-400 group-hover:text-white" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Player;
