
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Visualizer from './components/Visualizer';
import { MOCK_TRACKS } from './constants';
import { Track, AIAnalysis } from './types';
import { analyzeTrack } from './services/geminiService';
import { Sparkles, BrainCircuit, Activity, Clock, Play, Pause, List } from 'lucide-react';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const fetchAIAnalysis = useCallback(async (track: Track) => {
    setIsAnalyzing(true);
    const analysis = await analyzeTrack(track);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  }, []);

  useEffect(() => {
    fetchAIAnalysis(currentTrack);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [currentTrack, fetchAIAnalysis]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleLocalFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local User",
      album: "Imported Files",
      coverUrl: `https://picsum.photos/seed/${file.name}/400/400`,
      duration: 0, // Will be updated on load
      genre: "Unknown",
      audioUrl: url,
      isLocal: true
    };

    setTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden select-none">
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      <Sidebar onImport={handleLocalFileImport} />

      <main className="flex-1 flex flex-col relative overflow-hidden pb-32 lg:pb-0">
        {/* Top Header */}
        <header className="h-14 lg:h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 z-10 backdrop-blur-md bg-slate-950/30">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
               <Sparkles size={14} className="text-yellow-400" />
               <span className="text-[10px] lg:text-xs font-medium text-slate-300">Smart Engine Active</span>
             </div>
          </div>
          <div className="flex lg:hidden font-bold text-sm tracking-tight">Lumina</div>
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Clock size={18} className="text-slate-400" />
            </button>
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Visualizer & Hero Section */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <div className="relative group aspect-[16/10] lg:aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <Visualizer isPlaying={isPlaying} colors={aiAnalysis?.colorPalette || ['#3b82f6', '#8b5cf6']} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 right-4 lg:right-8 flex items-end justify-between">
                  <div className="space-y-1 lg:space-y-2 max-w-[70%]">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest rounded border border-blue-500/30">
                      Now Playing
                    </span>
                    <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-md truncate">
                      {currentTrack.title}
                    </h1>
                    <p className="text-sm lg:text-lg text-slate-300 truncate">
                      {currentTrack.artist} &bull; {currentTrack.album}
                    </p>
                  </div>
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    {isPlaying ? <Pause size={24} lg:size={32} fill="currentColor" /> : <Play size={24} lg:size={32} fill="currentColor" className="ml-0.5 lg:ml-1" />}
                  </button>
                </div>
              </div>

              {/* Browse Section */}
              <section>
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-bold">Featured Library</h2>
                  <button className="text-xs lg:text-sm text-slate-400 hover:text-white flex items-center gap-1">
                    <List size={14} /> View All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
                  {tracks.map(track => (
                    <div 
                      key={track.id}
                      onClick={() => setCurrentTrack(track)}
                      className={`group relative p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-300 cursor-pointer border ${
                        currentTrack.id === track.id 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="aspect-square rounded-lg lg:rounded-xl overflow-hidden mb-2 lg:mb-3 relative">
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${currentTrack.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {currentTrack.id === track.id && isPlaying ? <Activity size={24} className="text-white animate-pulse" /> : <Play size={20} lg:size={24} className="text-white" fill="white" />}
                        </div>
                      </div>
                      <h3 className="font-semibold text-xs lg:text-sm truncate">{track.title}</h3>
                      <p className="text-[10px] lg:text-xs text-slate-500 truncate">{track.artist}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* AI Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-6 flex flex-col gap-4 lg:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <BrainCircuit size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-md lg:text-lg leading-tight">AI Mood Engine</h2>
                    <p className="text-[10px] lg:text-xs text-slate-400">Powered by Gemini</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="space-y-4 py-8 flex flex-col items-center">
                    <Activity size={32} className="text-blue-500 animate-pulse" />
                    <p className="text-xs lg:text-sm text-slate-400 animate-pulse">Analyzing audio signature...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-4 lg:space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-1.5 lg:space-y-2">
                      <label className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 tracking-widest">Atmosphere</label>
                      <div className="flex flex-wrap gap-1.5 lg:gap-2">
                        {aiAnalysis.mood.split(',').map((m, i) => (
                          <span key={i} className="px-2 py-0.5 lg:px-2.5 lg:py-1 bg-white/5 rounded-full text-[10px] lg:text-xs border border-white/10">
                            {m.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 lg:space-y-2">
                      <label className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 tracking-widest">Poetic Insight</label>
                      <p className="text-xs lg:text-sm text-slate-300 leading-relaxed italic">
                        "{aiAnalysis.description}"
                      </p>
                    </div>

                    <div className="hidden lg:block space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Visual Prompt</label>
                      <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-400 line-clamp-3">
                          {aiAnalysis.visualPrompt}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 lg:space-y-2">
                      <label className="text-[9px] lg:text-[10px] font-bold uppercase text-slate-500 tracking-widest">Color Signature</label>
                      <div className="flex gap-2 lg:gap-3">
                        {aiAnalysis.colorPalette.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg shadow-lg border border-white/10" 
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs lg:text-sm">
                    Select a track to begin AI analysis
                  </div>
                )}

                <button 
                  onClick={() => fetchAIAnalysis(currentTrack)}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-xs lg:text-sm shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Recalibrate
                </button>
              </div>

              {/* Up Next - Hidden on small mobile screens to save space */}
              <div className="hidden sm:block bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-6">
                <h3 className="font-bold text-sm lg:text-md mb-4">Up Next</h3>
                <div className="space-y-4">
                  {tracks.filter(t => t.id !== currentTrack.id).slice(0, 3).map(track => (
                    <div key={track.id} onClick={() => setCurrentTrack(track)} className="flex items-center gap-3 group cursor-pointer">
                      <img src={track.coverUrl} className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium truncate group-hover:text-blue-400 transition-colors">{track.title}</p>
                        <p className="text-[10px] lg:text-xs text-slate-500 truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Player Controls */}
        <Player 
          track={currentTrack} 
          isPlaying={isPlaying} 
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={setVolume}
        />
      </main>
    </div>
  );
};

export default App;
