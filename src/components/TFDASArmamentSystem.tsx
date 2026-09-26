import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TFDASLayerStatus } from '../types/military';
import { ShieldAlert, Volume2, Brain, Flame, Zap, Rocket, AlertTriangle, CheckCircle, RefreshCw, Crosshair } from 'lucide-react';

interface TFDASArmamentSystemProps {
  layers: TFDASLayerStatus[];
  onFireLayerMunition: (layerId: string) => void;
  onFireTriFoldSalvo: () => void;
  onReloadMunitions: () => void;
  autoFireEnabled: boolean;
  onToggleAutoFire: () => void;
  soundEnabled: boolean;
}

export const TFDASArmamentSystem: React.FC<TFDASArmamentSystemProps> = ({
  layers,
  onFireLayerMunition,
  onFireTriFoldSalvo,
  onReloadMunitions,
  autoFireEnabled,
  onToggleAutoFire,
  soundEnabled
}) => {
  const [firingLayers, setFiringLayers] = useState<string[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[0]?.layerId || 'LAYER_1_VOICE');

  const handleFireLayer = (layerId: string) => {
    setFiringLayers(prev => [...prev, layerId]);
    onFireLayerMunition(layerId);
    setTimeout(() => {
      setFiringLayers(prev => prev.filter(id => id !== layerId));
    }, 1200);
  };

  const handleFireAll = () => {
    setFiringLayers(layers.map(l => l.layerId));
    onFireTriFoldSalvo();
    setTimeout(() => {
      setFiringLayers([]);
    }, 1500);
  };

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'LAYER_1_VOICE':
        return <Volume2 className="w-5 h-5 text-amber-400" />;
      case 'LAYER_2_THOUGHT':
        return <Brain className="w-5 h-5 text-violet-400" />;
      case 'LAYER_3_ESSENCE':
        return <Flame className="w-5 h-5 text-red-400" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-[#070c14]/90 border border-amber-500/25 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400 animate-pulse" />
              TRI-FOLD DEFENSE ARMAMENT SYSTEM (TFDAS)
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              3-LAYER DETECTION & MUNITIONS RELEASE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-0.5">
            A three-layered detection system that listens for malicious chatter (threats & declarations of war), picks up malice in thoughts, and detects corrupt essence to release the appropriate precision munitions.
          </p>
        </div>

        {/* Global Controls: Auto-Fire Toggle & Full Salvo */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleAutoFire}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              autoFireEnabled
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-black/50 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${autoFireEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>AUTO-FIRE PROTOCOL: {autoFireEnabled ? 'ENGAGED' : 'MANUAL'}</span>
          </button>

          <button
            onClick={onReloadMunitions}
            className="p-2 rounded-xl bg-black/60 hover:bg-white/5 border border-white/10 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
            title="Reload Munitions Silos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleFireAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-950/60 cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-white animate-pulse" />
            <span>RELEASE FULL TRI-FOLD SALVO</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Layer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layers.map(layer => {
          const isFiring = firingLayers.includes(layer.layerId);
          const isSelected = selectedLayerId === layer.layerId;
          const stockPercent = (layer.associatedMunition.stock / layer.associatedMunition.maxStock) * 100;

          return (
            <motion.div
              key={layer.layerId}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedLayerId(layer.layerId)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-black/80 border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-black/50 border-white/10 hover:border-amber-500/40'
              }`}
            >
              {/* Firing animation overlay */}
              <AnimatePresence>
                {isFiring && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-amber-500/90 to-yellow-300/90 z-20 flex flex-col items-center justify-center text-black font-mono font-bold text-center p-3 pointer-events-none"
                  >
                    <Rocket className="w-8 h-8 mb-1 animate-bounce text-black" />
                    <span className="text-xs uppercase tracking-widest">MUNITION LAUNCHED!</span>
                    <span className="text-[10px]">{layer.associatedMunition.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                {/* Top status bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-black/60 border border-white/10">
                      {getLayerIcon(layer.layerId)}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {layer.layerId === 'LAYER_1_VOICE' ? 'LAYER 1: VOICE' : layer.layerId === 'LAYER_2_THOUGHT' ? 'LAYER 2: THOUGHT' : 'LAYER 3: ESSENCE'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    SENSITIVITY: {layer.sensitivity}%
                  </span>
                </div>

                <h4 className="text-sm font-serif font-bold text-slate-100 mt-2">
                  {layer.name}
                </h4>
                <p className="text-xs font-serif text-slate-400 mt-1 leading-relaxed">
                  {layer.description}
                </p>
              </div>

              {/* Linked Munition & Silo Stock */}
              <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">LINKED MUNITION:</span>
                  <span className="text-amber-400 font-bold">
                    {layer.associatedMunition.stock} / {layer.associatedMunition.maxStock} READY
                  </span>
                </div>
                <div className="text-xs font-serif text-slate-200 font-semibold">
                  {layer.associatedMunition.name}
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  Payload: {layer.associatedMunition.payload}
                </p>

                {/* Stock Bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stockPercent > 50 ? 'bg-amber-400' : stockPercent > 20 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stockPercent}%` }}
                  />
                </div>
              </div>

              {/* Single Launch Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFireLayer(layer.layerId);
                }}
                disabled={layer.associatedMunition.stock <= 0}
                className="w-full py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
              >
                <Crosshair className="w-3.5 h-3.5 text-red-400" />
                <span>RELEASE LAYER {layer.layerId === 'LAYER_1_VOICE' ? 'I' : layer.layerId === 'LAYER_2_THOUGHT' ? 'II' : 'III'} MUNITIONS</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Silo Telemetry & Effective Range Matrix */}
      <div className="p-4 bg-black/60 border border-white/10 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            I
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">VOICE CHATTER RANGE</span>
            <span className="text-slate-200 font-bold">850 km Planetary / Radio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
            II
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">THOUGHT INTERCEPT RANGE</span>
            <span className="text-slate-200 font-bold">1,200 km Astral Synapse</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
            III
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">CORRUPT ESSENCE RANGE</span>
            <span className="text-slate-200 font-bold">2,500 km Global Spectrograph</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFDASArmamentSystem;
