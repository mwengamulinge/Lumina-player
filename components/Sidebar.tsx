
import React from 'react';
import { Home, Search, Library, Music, Radio, PlusSquare, Upload } from 'lucide-react';

interface SidebarProps {
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onImport }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-slate-900/50 border-r border-white/5 p-6 flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Music className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Lumina
          </h1>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem icon={<Home size={20} />} label="Home" active />
          <NavItem icon={<Search size={20} />} label="Discover" />
          <NavItem icon={<Library size={20} />} label="Library" />
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Local Files</h2>
          <nav className="flex flex-col gap-1">
            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer text-slate-400 hover:bg-white/5 hover:text-white">
              <Upload size={20} />
              <span className="font-medium text-sm">Import Tracks</span>
              <input 
                type="file" 
                accept="audio/*,video/*" 
                multiple 
                className="hidden" 
                onChange={onImport} 
              />
            </label>
            <NavItem icon={<Music size={20} />} label="Liked Tracks" />
            <NavItem icon={<PlusSquare size={20} />} label="Create Playlist" />
          </nav>
        </div>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-Powered Soundscapes
          </p>
          <button className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Lumina Pro Active
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 z-[60] flex items-center justify-around px-4">
        <MobileNavItem icon={<Home size={22} />} label="Home" active />
        <MobileNavItem icon={<Search size={22} />} label="Search" />
        <label className="p-2 text-slate-400">
           <Upload size={22} />
           <input 
             type="file" 
             accept="audio/*,video/*" 
             multiple 
             className="hidden" 
             onChange={onImport} 
           />
        </label>
        <MobileNavItem icon={<Library size={22} />} label="Library" />
      </nav>
    </>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </a>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, active }) => (
  <button className={`p-2 transition-colors ${active ? 'text-blue-400' : 'text-slate-500'}`}>
    {icon}
  </button>
);

export default Sidebar;
