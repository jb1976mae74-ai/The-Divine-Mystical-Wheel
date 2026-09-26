import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, Compass, Layers, RefreshCw, Check, ArrowRightLeft, 
  HelpCircle, Sparkles, Orbit, Award, ShieldCheck, Activity
} from 'lucide-react';
import { DIVINE_METROLOGY_SUITE } from '../data/wisdomArchitectData';
import { DivineMetrologyUnit } from '../types/wisdomArchitect';

interface DivineMetrologyWorkbenchProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function DivineMetrologyWorkbench({ activeTheme }: DivineMetrologyWorkbenchProps) {
  const [selectedUnit, setSelectedUnit] = useState<DivineMetrologyUnit>(DIVINE_METROLOGY_SUITE[0]);
  const [inputVal, setInputVal] = useState<number>(1);
  const [inputUnitType, setInputUnitType] = useState<'REED' | 'CUBIT' | 'SPAN' | 'METERS' | 'PLANCK'>('REED');
  
  // Custom Balance weights
  const [leftScaleWeight, setLeftScaleWeight] = useState<number>(76);
  const [rightScaleWeight, setRightScaleWeight] = useState<number>(76);

  // Conversion calculations
  const calculateEquivalents = () => {
    let meters = 0;
    if (inputUnitType === 'REED') meters = inputVal * 3.18;
    else if (inputUnitType === 'CUBIT') meters = inputVal * 0.525;
    else if (inputUnitType === 'SPAN') meters = inputVal * 0.2222;
    else if (inputUnitType === 'METERS') meters = inputVal;
    else if (inputUnitType === 'PLANCK') meters = inputVal * 1.616255e-35;

    const planckLengths = meters / 1.616255e-35;
    const reeds = meters / 3.18;
    const cubits = meters / 0.525;
    const spans = meters / 0.2222;
    const inches = meters * 39.3701;
    const salazarWhips = inches / 112.0;

    return { meters, planckLengths, reeds, cubits, spans, inches, salazarWhips };
  };

  const equiv = calculateEquivalents();

  // Balance scale tilt angle
  const diff = leftScaleWeight - rightScaleWeight;
  const balanceAngle = Math.max(-15, Math.min(15, diff * 0.5));

  return (
    <div id="divine-metrology-workbench" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  Cosmic Scales & Divine Metrology Workbench
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  Isaiah 40:12 • Ezekiel 40:3
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                "Who hath measured the waters in the hollow of his hand, and meted out heaven with the span, and weighed the mountains in scales?"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-950/60 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5" />
              Planck Calibration: 1.616 × 10⁻³⁵ m
            </span>
          </div>
        </div>

        {/* Metrology Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {DIVINE_METROLOGY_SUITE.map((u) => {
            const isSelected = selectedUnit.id === u.id;
            return (
              <button
                key={u.id}
                id={`btn-metrology-${u.id}`}
                onClick={() => setSelectedUnit(u)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md shadow-amber-950/50 scale-[1.02]'
                    : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400 border border-neutral-800">
                    {u.category.replace('_', ' ')}
                  </span>
                  <div className="text-xs font-bold text-neutral-200 mt-2">{u.name}</div>
                </div>
                <div className="text-[11px] font-serif text-amber-400/90 mt-2 truncate">
                  {u.hebrewName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Metrology Inspector + Interactive Balance + Conversion Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Selected Unit Dossier (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono text-amber-400">{selectedUnit.category} STANDARD</span>
            <h4 className="text-base font-bold text-neutral-100 mt-1">{selectedUnit.name}</h4>
            <p className="text-sm font-serif text-amber-300">{selectedUnit.hebrewName}</p>
          </div>

          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Scripture Authority
            </span>
            <p className="text-xs text-neutral-300 italic">
              "{selectedUnit.scriptureReference}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Ancient Value</span>
              <strong className="text-amber-300 font-mono">{selectedUnit.ancientValue}</strong>
            </div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">Modern Standard</span>
              <strong className="text-sky-300 font-mono">{selectedUnit.modernEquivalent}</strong>
            </div>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
              Quantum / Cosmological Equivalence
            </span>
            <p className="text-xs font-mono text-purple-200">
              {selectedUnit.quantumCosmicEquivalence}
            </p>
          </div>

          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Architectural & Temple Significance
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedUnit.architecturalSignificance}
            </p>
          </div>
        </div>

        {/* Right: Quantum Conversion Calculator & Interactive Scale of Isaiah (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Universal Metrology Conversion Calculator */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-neutral-100">
                  Sacred Measure Quantum Converter
                </h4>
              </div>
              <span className="text-xs font-mono text-neutral-400">Live Precision</span>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs text-neutral-400">Magnitude Value</label>
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(Math.max(0.001, Number(e.target.value)))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-neutral-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs text-neutral-400">Sacred Unit Type</label>
                <select
                  value={inputUnitType}
                  onChange={(e: any) => setInputUnitType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value="REED">Golden Reeds (Qaneh - 3.18m)</option>
                  <option value="CUBIT">Sacred Cubits (Ammah - 0.525m)</option>
                  <option value="SPAN">Divine Spans (Zereth - 0.222m)</option>
                  <option value="METERS">Standard Metric (Meters)</option>
                  <option value="PLANCK">Planck Lengths (ℓ_P)</option>
                </select>
              </div>
            </div>

            {/* Conversion Result Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Golden Reeds</span>
                <span className="text-xs font-mono font-bold text-amber-400">{equiv.reeds.toFixed(4)} qaneh</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Sacred Cubits</span>
                <span className="text-xs font-mono font-bold text-amber-300">{equiv.cubits.toFixed(4)} ammah</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Divine Spans</span>
                <span className="text-xs font-mono font-bold text-amber-200">{equiv.spans.toFixed(4)} zereth</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Metric Meters</span>
                <span className="text-xs font-mono font-bold text-sky-400">{equiv.meters.toFixed(4)} m</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Salazar Whips (112")</span>
                <span className="text-xs font-mono font-bold text-pink-400">{equiv.salazarWhips.toFixed(4)} λ</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Planck Voxels</span>
                <span className="text-xs font-mono font-bold text-purple-300 truncate block">
                  {equiv.planckLengths.toExponential(3)} ℓ_P
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Scales of the Mountains (Isaiah 40:12) */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-neutral-100">
                  The Scales of the Mountains & Hills in a Balance
                </h4>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                diff === 0 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {diff === 0 ? 'PERFECT EQUILIBRIUM' : `Tension Δ = ${Math.abs(diff)}`}
              </span>
            </div>

            {/* SVG Visual Balance Scale */}
            <div className="w-full h-32 flex items-center justify-center relative">
              <svg viewBox="0 0 400 120" className="w-full max-w-sm h-full">
                {/* Scale Base and Pillar */}
                <path d="M 180 110 L 220 110 L 205 20 L 195 20 Z" fill="#4B5563" />
                <circle cx="200" cy="20" r="5" fill="#D4AF37" />

                {/* Tilting Beam */}
                <g transform={`rotate(${balanceAngle} 200 20)`}>
                  <rect x="50" y="18" width="300" height="4" rx="2" fill="#D4AF37" />
                  
                  {/* Left Pan */}
                  <line x1="70" y1="20" x2="50" y2="70" stroke="#9CA3AF" strokeWidth="1" />
                  <line x1="70" y1="20" x2="90" y2="70" stroke="#9CA3AF" strokeWidth="1" />
                  <path d="M 40 70 Q 70 85 100 70 Z" fill="#D4AF37" fillOpacity="0.5" stroke="#D4AF37" />

                  {/* Right Pan */}
                  <line x1="330" y1="20" x2="310" y2="70" stroke="#9CA3AF" strokeWidth="1" />
                  <line x1="330" y1="20" x2="350" y2="70" stroke="#9CA3AF" strokeWidth="1" />
                  <path d="M 300 70 Q 330 85 360 70 Z" fill="#D4AF37" fillOpacity="0.5" stroke="#D4AF37" />
                </g>
              </svg>
            </div>

            {/* Weight Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Left Scale (Moriah Foundation)</span>
                  <span className="text-amber-400 font-mono">{leftScaleWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="144"
                  value={leftScaleWeight}
                  onChange={(e) => setLeftScaleWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Right Scale (Sinai / Zion Law)</span>
                  <span className="text-amber-400 font-mono">{rightScaleWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="144"
                  value={rightScaleWeight}
                  onChange={(e) => setRightScaleWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setLeftScaleWeight(76);
                  setRightScaleWeight(76);
                }}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Reset to Sacred 76 Equilibrium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
