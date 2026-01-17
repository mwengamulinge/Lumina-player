
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Player from './components/Player.tsx';
import Visualizer from './components/Visualizer.tsx';
import { MOCK_TRACKS } from './constants.ts';
import { Track, AIAnalysis } from './types.ts';
import { analyzeTrack } from './services/geminiService.ts';
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
      audioRef.current.play().catch(e => {
        console.warn("Autoplay prevented or failed", e);
        setIsPlaying(false);
      });
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
      audioRef.current.play().catch(console.error);
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
      artist: "Local Device",
      album: "Imported Files",
      coverUrl: `https://picsum.photos/seed/${file.name}/400/400`,
      duration: 0,
      genre: "Local",
      audioUrl: url,
      isLocal: true
    };

    setTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden select-none">
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      <Sidebar onImport={handleLocalFileImport} />

      <main className="flex-1 flex flex-col relative overflow-hidden pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-0">
        <header className="h-14 lg:h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 z-20 backdrop-blur-xl bg-slate-950/50 sticky top-0">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
               <Sparkles size={12} className="text-yellow-400" />
               <span className="text-[10px] lg:text-xs font-semibold text-slate-300 uppercase tracking-wider">Smart Engine</span>
             </div>
          </div>
          <div className="lg:hidden font-black text-sm tracking-tighter uppercase italic">Lumina</div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors hidden sm:block">
              <Clock size={18} className="text-slate-400" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 shadow-lg shadow-indigo-500/20"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <div className="relative group aspect-[16/10] lg:aspect-video rounded-3xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <Visualizer isPlaying={isPlaying} colors={aiAnalysis?.colorPalette || ['#3b82f6', '#8b5cf6']} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 right-4 lg:right-8 flex items-end justify-between">
                  <div className="space-y-1 lg:space-y-2 max-w-[65%]">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] lg:text-[10px] font-extrabold uppercase tracking-[0.2em] rounded border border-blue-500/30">
                      On Air
                    </span>
                    <h1 className="text-2xl lg:text-5xl font-black tracking-tight text-white drop-shadow-2xl truncate leading-tight">
                      {currentTrack.title}
                    </h1>
                    <p className="text-xs lg:text-xl font-medium text-slate-300 truncate opacity-80">
                      {currentTrack.artist} &bull; {currentTrack.album}
                    </p>
                  </div>
                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] z-10"
                  >
                    {/* Fixed: Removed invalid lg:size and used className for responsive sizing */}
                    {isPlaying ? <Pause className="w-7 h-7 lg:w-10 lg:h-10" fill="currentColor" /> : <Play className="w-7 h-7 lg:w-10 lg:h-10 ml-1" fill="currentColor" />}
                  </button>
                </div>
              </div>

              <section>
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-2xl font-black tracking-tight">Your Galaxy</h2>
                  <button className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-2">
                    <List size={14} /> Full Access
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tracks.map(track => (
                    <div 
                      key={track.id}
                      onClick={() => setCurrentTrack(track)}
                      className={`group relative p-3 rounded-2xl transition-all duration-500 cursor-pointer border ${
                        currentTrack.id === track.id 
                          ? 'bg-white/10 border-white/20 ring-1 ring-white/10 shadow-xl' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${currentTrack.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {currentTrack.id === track.id && isPlaying ? <Activity size={24} className="text-white animate-pulse" /> : <Play size={24} className="text-white" fill="white" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-xs lg:text-sm truncate leading-tight">{track.title}</h3>
                      <p className="text-[10px] lg:text-xs text-slate-500 truncate mt-0.5">{track.artist}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <BrainCircuit size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight">AI Analysis</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Insight</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="space-y-6 py-12 flex flex-col items-center justify-center text-center">
                    <div className="relative">
                       <Activity size={48} className="text-blue-500 animate-pulse" />
                       <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 animate-pulse tracking-widest uppercase">Deciphering sonic textures...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Atmospheric Tagging</label>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.mood.split(',').map((m, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold border border-white/10 shadow-sm">
                            {m.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Poetic Logic</label>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium italic opacity-90">
                        "{aiAnalysis.description}"
                      </p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Chroma Signature</label>
                      <div className="flex gap-4">
                        {aiAnalysis.colorPalette.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-10 h-10 rounded-xl shadow-lg border border-white/10 ring-2 ring-white/5" 
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Awaiting Audio Input
                  </div>
                )}
                <button 
                  onClick={() => fetchAIAnalysis(currentTrack)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Neural Refresh
                </button>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h3 className="font-black text-sm uppercase tracking-widest mb-6 opacity-60">Neural Queue</h3>
                <div className="space-y-5">
                  {tracks.filter(t => t.id !== currentTrack.id).slice(0, 3).map(track => (
                    <div key={track.id} onClick={() => setCurrentTrack(track)} className="flex items-center gap-4 group cursor-pointer transition-transform hover:translate-x-1">
                      <img src={track.coverUrl} className="w-12 h-12 rounded-xl object-cover shadow-md" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-bold truncate group-hover:text-blue-400 transition-colors leading-tight">{track.title}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

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
