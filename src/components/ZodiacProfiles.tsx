import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZODIAC_PROFILES } from '../data/zodiacData';

export default function ZodiacProfiles() {
  const [filter, setFilter] = useState('');

  const filteredProfiles = ZODIAC_PROFILES.filter(
    (profile) =>
      profile.rulingPlanet.toLowerCase().includes(filter.toLowerCase()) ||
      profile.spiritualStrength.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Filter by planet or strength..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-4 rounded-xl bg-[#0f0e0c] border border-amber-500/20 text-amber-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all font-serif"
      />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProfiles.map((profile) => (
          <div key={profile.name} className="p-6 rounded-2xl bg-[#0f0e0c] border border-amber-500/20 shadow-xl space-y-4 hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-amber-100">{profile.name}</h3>
              <span className="text-[10px] font-mono uppercase bg-amber-950/40 px-2 py-1 rounded text-amber-400">{profile.element}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-serif text-slate-300">
              <div><span className="text-slate-500">Planet:</span> {profile.rulingPlanet}</div>
              <div><span className="text-slate-500">Trait:</span> {profile.alchemicalTrait}</div>
              <div className="col-span-2"><span className="text-slate-500">Strength:</span> {profile.spiritualStrength}</div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-serif line-clamp-4">{profile.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
