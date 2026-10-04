import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Droplets, Wind, Globe, Compass, Zap, Shield, Award } from 'lucide-react';
import { ZODIAC_PROFILES } from '../data/zodiacData';

interface MetricItem {
  subject: string;
  value: number; // 0 to 10
}

interface ElementalAffinityPanelProps {
  zodiacSign: string;
  metrics: MetricItem[];
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
    accentGradient: string;
    [key: string]: any;
  };
}

const ELEMENT_MAP: Record<string, { name: string; symbol: string; icon: any; color: string; bg: string; metricKey: string }> = {
  "Fire": { name: "Ignis (Fire)", symbol: "🔥", icon: Flame, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", metricKey: "Ignis" },
  "Earth": { name: "Materia (Earth)", symbol: "🪨", icon: Globe, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", metricKey: "Materia" },
  "Air": { name: "Aer (Air)", symbol: "💨", icon: Wind, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30", metricKey: "Aer" },
  "Water": { name: "Aqua (Water)", symbol: "💧", icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", metricKey: "Aqua" },
};

const ELEMENT_ALIASES: Record<string, string> = {
  "Ignis": "Fire",
  "Materia": "Earth",
  "Aer": "Air",
  "Aqua": "Water",
  "Spiritus": "Spirit"
};

export const ElementalAffinityPanel: React.FC<ElementalAffinityPanelProps> = ({
  zodiacSign,
  metrics,
  activeTheme
}) => {
  // 1. Find Zodiac Element
  const profile = ZODIAC_PROFILES.find(p => p.name.toLowerCase() === zodiacSign?.toLowerCase()) || ZODIAC_PROFILES[0];
  const zodiacElementKey = profile.element; // "Fire", "Earth", "Air", "Water"
  const zodiacElementInfo = ELEMENT_MAP[zodiacElementKey] || ELEMENT_MAP["Fire"];

  // 2. Find Dominant Consultation Metrics
  const sortedMetrics = [...metrics].sort((a, b) => b.value - a.value);
  const dominantMetric = sortedMetrics[0] || { subject: "Spiritus", value: 8 };
  const secondaryMetric = sortedMetrics[1] || { subject: "Ignis", value: 7 };

  // 3. Calculate Resonance / Synergy Score
  // If dominant metric matches zodiac element or is Spiritus, high resonance
  const isDirectMatch = dominantMetric.subject.toLowerCase() === zodiacElementInfo.metricKey.toLowerCase();
  const baseResonance = isDirectMatch ? 95 : dominantMetric.subject === "Spiritus" ? 88 : 74;
  const resonanceScore = Math.min(99, Math.max(60, Math.round((dominantMetric.value / 10) * baseResonance)));

  // 4. Generate Hermetic Interpretation
  const getInterpretation = () => {
    if (isDirectMatch) {
      return `Your natal sign (${profile.name}) and the consultation's dominant current (${dominantMetric.subject}) are in pure alchemical resonance. This direct elemental amplification empowers your current inquiry with sovereign clarity and unhindered energetic flow.`;
    } else if (dominantMetric.subject === "Spiritus") {
      return `While your natal element is ${zodiacElementKey} (${profile.name}), the consultation reveals a transcendent breakthrough in Spiritus (Quintessence). Your primal elemental nature is currently being alchemized into higher spiritual awareness.`;
    } else {
      return `A dynamic dialectic exists between your natal ${zodiacElementKey} (${profile.name}) and the consultation's dominant focus on ${dominantMetric.subject} (${dominantMetric.value}/10). This creative tension forges esoteric growth, bridging earth and celestial current.`;
    }
  };

  const IconComponent = zodiacElementInfo.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#0e0d14] border border-amber-500/30 rounded-xl p-5 shadow-xl text-left relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${zodiacElementInfo.bg}`}>
            <IconComponent className={`w-4 h-4 ${zodiacElementInfo.color}`} />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-amber-200">
              Elemental Affinity & Astrological Resonance
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Comparing Natal Zodiac Nature with Consultation Forces
            </span>
          </div>
        </div>
        
        {/* Resonance Score Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{resonanceScore}% Synergy</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Natal Zodiac Element Card */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Natal Zodiac Signature</span>
            <span className="text-[10px] font-serif px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-200">
              {profile.rulingPlanet} Ruler
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              {profile.name === "Aries" || profile.name === "Leo" || profile.name === "Sagittarius" ? "♈" :
               profile.name === "Taurus" || profile.name === "Virgo" || profile.name === "Capricorn" ? "♉" :
               profile.name === "Gemini" || profile.name === "Libra" || profile.name === "Aquarius" ? "♊" : "♋"}
            </span>
            <div>
              <div className="text-sm font-serif font-bold text-amber-100 flex items-center gap-1.5">
                <span>{profile.name}</span>
                <span className="text-xs font-normal text-slate-400">({zodiacElementInfo.symbol} {zodiacElementKey})</span>
              </div>
              <div className="text-[10px] font-serif text-slate-300">
                Alchemical Operation: <strong className="text-amber-300 font-normal">{profile.alchemicalTrait}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Dominant Metric Card */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Dominant Consultation Current</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
              {dominantMetric.value} / 10 Power
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-base">
              ⚡
            </div>
            <div>
              <div className="text-sm font-serif font-bold text-amber-100 flex items-center gap-1.5">
                <span>{dominantMetric.subject}</span>
                <span className="text-xs font-normal text-slate-400">(Primary Vector)</span>
              </div>
              <div className="text-[10px] font-serif text-slate-300">
                Secondary Harmonic: <strong className="text-amber-300 font-normal">{secondaryMetric.subject} ({secondaryMetric.value}/10)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Progress Bars */}
      <div className="space-y-2 mb-4 p-3 rounded-xl bg-black/40 border border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 pb-1 border-b border-white/5">
          <span>Active Alchemical Metrics Spectrum</span>
          <span>Resonance Weight</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {metrics.map((m) => {
            const isDominant = m.subject === dominantMetric.subject;
            const isZodiacMatch = m.subject.toLowerCase() === zodiacElementInfo.metricKey.toLowerCase();
            return (
              <div key={m.subject} className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center ${isDominant ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' : 'bg-white/[0.02] border-white/5 text-slate-400'}`}>
                <span className="text-[9px] font-mono uppercase truncate w-full">{m.subject}</span>
                <span className={`text-xs font-bold font-mono my-1 ${isDominant ? 'text-amber-300' : 'text-slate-200'}`}>{m.value}</span>
                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isDominant ? 'bg-amber-400' : isZodiacMatch ? 'bg-emerald-400' : 'bg-slate-500'}`}
                    style={{ width: `${(m.value / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hermetic Exegesis Footer */}
      <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs font-serif text-amber-100/90 leading-relaxed italic flex items-start gap-2.5">
        <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="not-italic text-amber-300 font-sans text-[11px] block uppercase tracking-wide mb-0.5">
            Hermetic Synthesis & Exegesis:
          </strong>
          "{getInterpretation()}"
        </div>
      </div>
    </motion.div>
  );
};

export default ElementalAffinityPanel;
