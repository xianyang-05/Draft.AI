import React, { useState } from 'react';
import { champions } from '../data/champions';

export default function ChampionSelectModal({ isOpen, onClose, onSelect, roleFilter }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter champions based on search and role
  const filteredChampions = champions.filter(champ => {
    const matchesSearch = champ.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? champ.roles.includes(roleFilter.toUpperCase()) : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-3xl h-[80vh] flex flex-col border border-white/20 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="font-headline-md text-pure-white flex items-center gap-2">
              <span className="material-symbols-outlined text-electric-green">group_add</span>
              Select Champion
            </h2>
            <p className="font-label-caps text-[10px] text-electric-green mt-1 tracking-widest">
              FILTER: {roleFilter || 'ALL ROLES'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-pure-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input 
              type="text"
              placeholder="Search database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-pure-white font-body-md py-3 pl-10 pr-4 rounded focus:ring-1 focus:ring-electric-green focus:border-electric-green focus:outline-none placeholder:text-on-surface-variant transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {filteredChampions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="font-label-mono">NO DATA FOUND IN QUERY</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
              {filteredChampions.map(champ => (
                <div 
                  key={champ.id}
                  onClick={() => onSelect(champ)}
                  className="group flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded overflow-hidden border border-white/10 group-hover:border-electric-green transition-all shadow-lg group-hover:glow-green relative">
                    <img 
                      src={champ.image} 
                      alt={champ.name} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-electric-green/0 group-hover:bg-electric-green/10 transition-colors"></div>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant group-hover:text-pure-white text-center truncate w-full px-1">
                    {champ.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
