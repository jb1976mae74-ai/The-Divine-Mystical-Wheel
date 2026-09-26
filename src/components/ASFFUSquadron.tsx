import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASFFUOperative } from '../types/military';
import { Crown, Flame, Volume2, ShieldAlert, Brain, Crosshair, Sparkles, Zap, Shield, Target, Award, Play } from 'lucide-react';

interface ASFFUSquadronProps {
  operatives: ASFFUOperative[];
  onManifestOperative: (operativeId: string) => void;
  onManifestAll: () => void;
  soundEnabled: boolean;
}

export const ASFFUSquadron: React.FC<ASFFUSquadronProps> = ({
  operatives,
  onManifestOperative,
  onManifestAll,
  soundEnabled
}) => {
  const [selectedOperativeId, setSelectedOperativeId] = useState<string>(operatives[0]?.id || 'asffu-01-lead');
  const [squadFormation, setSquadFormation] = useState<'SERAPHIC_ARROWHEAD' | 'AEGIS_HEXAGON' | 'OMNI_INTERDICTION'>('SERAPHIC_ARROWHEAD');
  const [manifestingIds, setManifestingIds] = useState<string[]>([]);

  const selectedOperative = operatives.find(o => o.id === selectedOperativeId) || operatives[0];

  const handleTriggerManifest = (id: string) => {
    setManifestingIds(prev => [...prev, id]);
    onManifestOperative(id);
    setTimeout(() => {
      setManifestingIds(prev => prev.filter(item => item !== id));
    }, 1200);
  };

  const handleTriggerAll = () => {
    setManifestingIds(operatives.map(o => o.id));
    onManifestAll();
    setTimeout(() => {
      setManifestingIds([]);
    }, 1500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-amber-300" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-emerald-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-violet-400" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-[#070c14]/90 border border-amber-500/25 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      {/* Squadron Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
              ACE SPECIAL FORCE FIGHTING UNIT (ASFFU)
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              6 SUPREME HYBRID ANGELIC OPERATIVES
            </span>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-0.5">
            The best highly trained military fighting force ever: perfectly tuned for any kind of combat, ready to manifest at a blink of an eye's notice.
          </p>
        </div>

        {/* Global Manifest Button & Formations */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Formation Picker */}
          <div className="flex bg-black/60 border border-amber-500/30 rounded-lg p-0.5 text-xs font-mono">
            {[
              { id: 'SERAPHIC_ARROWHEAD', label: 'Arrowhead Strike' },
              { id: 'AEGIS_HEXAGON', label: 'Aegis Bastion' },
              { id: 'OMNI_INTERDICTION', label: 'Omni Dispersion' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSquadFormation(f.id as any)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  squadFormation === f.id
                    ? 'bg-amber-500/30 text-amber-200 font-bold shadow'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleTriggerAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-950/60 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-black animate-bounce" />
            <span>MANIFEST ENTIRE SQUADRON (0.001s)</span>
          </button>
        </div>
      </div>

      {/* Operative Selection Grid (6 Units) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {operatives.map(op => {
          const isSelected = op.id === selectedOperativeId;
          const isManifesting = manifestingIds.includes(op.id);

          return (
            <motion.div
              key={op.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedOperativeId(op.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400/80 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'bg-black/50 border-white/10 hover:border-amber-500/40'
              }`}
            >
              {/* Manifesting Energy Flash Overlay */}
              <AnimatePresence>
                {isManifesting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-yellow-200 to-white z-30 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-black font-mono text-[10px] font-black tracking-widest uppercase animate-pulse">
                      MANIFESTED!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-black/60 border border-white/10">
                    {getIcon(op.avatarIcon)}
                  </div>
                  {op.isLead ? (
                    <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-amber-500 text-black">
                      LEAD OFFICER
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-500 font-semibold">
                      SPECIALIST
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-serif font-bold text-slate-100 leading-tight">
                  {op.isLead
                    ? 'Commander Lucifer'
                    : op.name.includes('Life after Death')
                    ? 'Life (After Death)'
                    : op.name.split(' ')[1] || op.name}
                </h4>
                <p className="text-[10px] font-mono text-amber-400/80 mt-0.5 truncate">
                  {op.callsign}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                <span className="text-emerald-400 font-bold">100% PURITY</span>
                <span className="text-slate-400">{op.manifestationSpeedMs}ms Phase</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Operative Deep Combat Profile & Tactical Console */}
      {selectedOperative && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/60 border border-amber-500/30 rounded-xl p-5 shadow-inner">
          {/* Left Column: Lineage, Role, Combat Tuning List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-serif font-bold text-amber-300">
                    {selectedOperative.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedOperative.rank}
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-300 mt-0.5">
                  CALLSIGN: {selectedOperative.callsign} • ROLE: {selectedOperative.role}
                </p>
              </div>

              {/* Manifest Single Button */}
              <button
                onClick={() => handleTriggerManifest(selectedOperative.id)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/60 text-amber-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Manifest ({selectedOperative.manifestationSpeedMs}ms)</span>
              </button>
            </div>

            {/* Angelic Lineage Lore */}
            <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                ANGELIC HYBRID LINEAGE & ORIGIN:
              </span>
              <p className="text-xs font-serif text-slate-200 leading-relaxed">
                {selectedOperative.angelicLineage}
              </p>
              <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed italic border-l-2 border-amber-500/40 pl-2">
                {selectedOperative.quote}
              </p>
            </div>

            {/* Combat Tuning Specifications */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold block mb-2">
                PERFECT COMBAT TUNING & WEAPON LOADOUT:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedOperative.combatTuning.map((tune, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 text-xs font-serif text-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{tune}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Combat Attributes Radar / Stat Bars */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-[#09101b] p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-3 border-b border-white/10 pb-1">
                SUPREME COMBAT ATTRIBUTES:
              </span>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Hyper-Kinetic Speed</span>
                    <span className="text-cyan-400 font-bold">{selectedOperative.stats.kineticSpeed} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${selectedOperative.stats.kineticSpeed}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Psychic Resonance (Thought Lock)</span>
                    <span className="text-violet-400 font-bold">{selectedOperative.stats.psychicResonance} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-violet-400 h-full rounded-full"
                      style={{ width: `${selectedOperative.stats.psychicResonance}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Angelic Radiance (Essence Purity)</span>
                    <span className="text-amber-400 font-bold">{selectedOperative.stats.angelicRadiance} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${selectedOperative.stats.angelicRadiance}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Tactical Strategy Mastery</span>
                    <span className="text-emerald-400 font-bold">{selectedOperative.stats.tacticalMastery} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${selectedOperative.stats.tacticalMastery}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Aegis Essence Defense</span>
                    <span className="text-blue-400 font-bold">{selectedOperative.stats.essenceDefense} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${selectedOperative.stats.essenceDefense}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Munition Badge */}
            <div className="p-2.5 bg-black/50 border border-amber-500/30 rounded-lg text-xs font-mono">
              <span className="text-[10px] text-amber-400 block font-bold">SIGNATURE ARMAMENT:</span>
              <span className="text-slate-200 font-serif">{selectedOperative.signatureMunition}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ASFFUSquadron;
