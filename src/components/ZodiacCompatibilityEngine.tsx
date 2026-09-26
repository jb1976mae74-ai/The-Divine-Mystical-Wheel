import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Heart, Flame, ShieldAlert, RotateCw, Compass, 
  Info, BookOpen, Copy, Check, ArrowRightLeft, Star, Award, ChevronDown, ChevronUp
} from 'lucide-react';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacSignMeta {
  id: string;
  name: string;
  symbol: string;
  element: ElementType;
  elementLatin: 'Ignis' | 'Materia' | 'Aer' | 'Aqua';
  modality: ModalityType;
  ruler: string;
  icon: string;
  description: string;
  archetype: string;
}

export const ZODIAC_SIGNS_LIST: ZodiacSignMeta[] = [
  { id: 'aries', name: 'Aries', symbol: '♈', element: 'Fire', elementLatin: 'Ignis', modality: 'Cardinal', ruler: 'Mars', icon: '🔥', description: 'Primordial spark of initiation and fierce spiritual courage.', archetype: 'The Divine Initiator' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', element: 'Earth', elementLatin: 'Materia', modality: 'Fixed', ruler: 'Venus', icon: '🪨', description: 'Anchored sanctuary of earth, cultivating physical gnosis and endurance.', archetype: 'The Terrestrial Anchor' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', element: 'Air', elementLatin: 'Aer', modality: 'Mutable', ruler: 'Mercury', icon: '💨', description: 'Dual channels of mind and speech, synthesizing cosmic light.', archetype: 'The Celestial Messenger' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', element: 'Water', elementLatin: 'Aqua', modality: 'Cardinal', ruler: 'Moon', icon: '💧', description: 'Deep reflective waters, nurturing the soul womb and ancestral memory.', archetype: 'The Lunar Guardian' },
  { id: 'leo', name: 'Leo', symbol: '♌', element: 'Fire', elementLatin: 'Ignis', modality: 'Fixed', ruler: 'Sun', icon: '🔥', description: 'Solar majesty of sovereign spirit, illuminating dark voids with generative warmth.', archetype: 'The Solar Sovereign' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', element: 'Earth', elementLatin: 'Materia', modality: 'Mutable', ruler: 'Mercury', icon: '🪨', description: 'Purifying alchemist filtering gold from dregs through sacred craft.', archetype: 'The Sacred Alchemist' },
  { id: 'libra', name: 'Libra', symbol: '♎', element: 'Air', elementLatin: 'Aer', modality: 'Cardinal', ruler: 'Venus', icon: '💨', description: 'Scales of cosmic balance, harmonizing active and receptive forces.', archetype: 'The Cosmic Architect' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', element: 'Water', elementLatin: 'Aqua', modality: 'Fixed', ruler: 'Pluto & Mars', icon: '💧', description: 'Crucible of abyssal transmutation, rising phoenix-like from dissolution.', archetype: 'The Abyssal Phoenix' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', element: 'Fire', elementLatin: 'Ignis', modality: 'Mutable', ruler: 'Jupiter', icon: '🔥', description: 'Arrow of transcendental truth, aiming toward infinite philosophical horizons.', archetype: 'The Celestial Archer' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', element: 'Earth', elementLatin: 'Materia', modality: 'Cardinal', ruler: 'Saturn', icon: '🪨', description: 'Mountain peak of temporal mastery, building enduring cosmic temples.', archetype: 'The Master Builder' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', element: 'Air', elementLatin: 'Aer', modality: 'Fixed', ruler: 'Uranus & Saturn', icon: '💨', description: 'Ethereal urn pouring streams of revolutionary higher consciousness.', archetype: 'The Ethereal Water-Bearer' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', element: 'Water', elementLatin: 'Aqua', modality: 'Mutable', ruler: 'Neptune & Jupiter', icon: '💧', description: 'Infinite ocean of unity, dissolving boundaries in divine empathy.', archetype: 'The Ocean of Unity' }
];

export const ZODIAC_MAP: Record<string, ZodiacSignMeta> = ZODIAC_SIGNS_LIST.reduce((acc, sign) => {
  acc[sign.name] = sign;
  return acc;
}, {} as Record<string, ZodiacSignMeta>);

export interface CompatibilityAnalysis {
  userSign: ZodiacSignMeta;
  partnerSign: ZodiacSignMeta;
  harmonyScore: number;
  reactionName: string;
  aspectType: string;
  elementalPairing: string;
  dynamicSummary: string;
  synergyHighlights: string[];
  shadowFriction: string[];
  esotericGuidance: string;
  alchemicalFormula: string;
  consultationMarkdown: string;
}

export function calculateZodiacCompatibility(userSignName: string, partnerSignName: string): CompatibilityAnalysis | null {
  if (!userSignName || !partnerSignName) return null;

  const signA = ZODIAC_MAP[userSignName] || ZODIAC_SIGNS_LIST.find(s => s.name.toLowerCase() === userSignName.toLowerCase());
  const signB = ZODIAC_MAP[partnerSignName] || ZODIAC_SIGNS_LIST.find(s => s.name.toLowerCase() === partnerSignName.toLowerCase());

  if (!signA || !signB) return null;

  const elemA = signA.element;
  const elemB = signB.element;

  let harmonyScore = 50;
  let reactionName = "Cosmic Interaction";
  let aspectType = "Elemental Interplay";
  let dynamicSummary = "";
  let synergyHighlights: string[] = [];
  let shadowFriction: string[] = [];
  let esotericGuidance = "";
  let alchemicalFormula = "";

  const idxA = ZODIAC_SIGNS_LIST.findIndex(s => s.name === signA.name);
  const idxB = ZODIAC_SIGNS_LIST.findIndex(s => s.name === signB.name);
  const distance = Math.abs(idxA - idxB);
  const wheelDist = Math.min(distance, 12 - distance);

  // Determine Aspect based on wheel distance
  if (wheelDist === 0) {
    aspectType = "Conjunction (0° - Reflective Mirroring)";
  } else if (wheelDist === 1) {
    aspectType = "Semi-Sextile (30° - Growth & Neighboring Friction)";
  } else if (wheelDist === 2) {
    aspectType = "Sextile (60° - Harmonic Synergistic Flow)";
  } else if (wheelDist === 3) {
    aspectType = "Square (90° - Dynamic Catalytic Tension)";
  } else if (wheelDist === 4) {
    aspectType = "Trine (120° - Perfect Elemental Accord)";
  } else if (wheelDist === 5) {
    aspectType = "Quincunx (150° - Esoteric Alchemical Adjustment)";
  } else if (wheelDist === 6) {
    aspectType = "Opposition (180° - Polar Complementarity)";
  }

  // Same Sign
  if (signA.name === signB.name) {
    harmonyScore = 88;
    reactionName = "Reflective Solar Resonance";
    dynamicSummary = `A double iteration of ${signA.name} (${signA.symbol}). You share the exact same elemental frequency and cosmic impulse, acting as an unvarnished mirror to one another.`;
    synergyHighlights = [
      "Instinctive telepathic comprehension",
      "Identical core values and driving force",
      "Immediate mutual validation of purpose"
    ];
    shadowFriction = [
      "Amplification of shared blindspots and shadows",
      "Ego clashes during periods of intense stress",
      "Potential lack of balancing elemental perspectives"
    ];
    esotericGuidance = "Cultivate individual space outside the shared orbit to ensure the mirror remains a source of illumination rather than an echo chamber.";
    alchemicalFormula = `2 × ${signA.elementLatin} → Pure Resonance (${signA.symbol} ≡ ${signB.symbol})`;
  }
  // Fire + Fire
  else if (elemA === 'Fire' && elemB === 'Fire') {
    harmonyScore = 93;
    reactionName = "Supernova Flame (Solar Ignition)";
    dynamicSummary = "Two sparks of raw Ignis combusting together. This union generates boundless creative momentum, immense passion, and heroic courage.";
    synergyHighlights = ["Inexhaustible enthusiasm and shared drive", "Spontaneous adventure and bold creation", "Mutual respect for sovereignty and independence"];
    shadowFriction = ["Potential for explosive competitive friction", "Burnout if fire burns out of control", "Impatience with slow material processes"];
    esotericGuidance = "Direct your combined solar energy outward into joint creative monuments rather than turning heat against each other.";
    alchemicalFormula = `Ignis (${signA.symbol}) + Ignis (${signB.symbol}) → Solar Ignition (100% Combustion)`;
  }
  // Fire + Air
  else if ((elemA === 'Fire' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Fire')) {
    harmonyScore = 91;
    reactionName = "Celestial Gale (Infernal Expansion)";
    dynamicSummary = "Air feeds Fire, causing brilliant ideas to ignite into sweeping action. Fire warms Air, elevating intellect into passionate idealism.";
    synergyHighlights = ["Rapid transmutation of concepts into reality", "Sparkling intellectual and creative conversations", "Inspiring atmosphere of constant discovery"];
    shadowFriction = ["Air may over-think while Fire leaps recklessly", "Scattered energy if physical grounding is neglected", "Restlessness when routine demands attention"];
    esotericGuidance = "Anchor your high-flying mental and passionate surges with deliberate physical routines to sustain long-term creation.";
    alchemicalFormula = `Ignis (${signA.icon}) ↔ Aer (${signB.icon}) → Atmospheric Expansion`;
  }
  // Fire + Earth
  else if ((elemA === 'Fire' && elemB === 'Earth') || (elemA === 'Earth' && elemB === 'Fire')) {
    harmonyScore = 68;
    reactionName = "Volcanic Crucible (Magma Manifestation)";
    dynamicSummary = "Fire provides the heat that transforms raw clay into hardened ceramics, while Earth offers a safe vessel to channel Fire's chaotic fury.";
    synergyHighlights = ["Tangible realization of wild creative visions", "Earth provides stability and practical execution", "Fire injects vitality into solid structures"];
    shadowFriction = ["Earth may feel smothered or rushed by Fire", "Fire may feel restricted by Earth's slow pace", "Stubborn resistance versus impatient demands"];
    esotericGuidance = "Acknowledge that building enduring monuments requires both the spark of vision and the slow patience of stone.";
    alchemicalFormula = `Ignis (${signA.icon}) + Materia (${signB.icon}) → Molten Magma Vessel`;
  }
  // Fire + Water
  else if ((elemA === 'Fire' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Fire')) {
    harmonyScore = 63;
    reactionName = "Thermal Vapor (Alchemical Steam)";
    dynamicSummary = "The intense, steamy crucible where fiery impulse meets ocean depth. This combination creates profound emotional and spiritual catharsis.";
    synergyHighlights = ["Deep transformational magnetism", "Water softens Fire's harsh directness", "Fire stirs Water's emotional depths into action"];
    shadowFriction = ["Water may douse Fire's enthusiasm", "Fire may boil Water's sensitive feelings", "Emotional mood swings disrupting active momentum"];
    esotericGuidance = "Treat your union as an alchemical steam bath: manage heat and moisture carefully so steam drives the engine without scalding the vessel.";
    alchemicalFormula = `Ignis (${signA.icon}) + Aqua (${signB.icon}) → Alchemical Steam`;
  }
  // Earth + Earth
  else if (elemA === 'Earth' && elemB === 'Earth') {
    harmonyScore = 90;
    reactionName = "Tectonic Foundation (Crystalline Solidity)";
    dynamicSummary = "An impenetrable bedrock forged from shared values, practical wisdom, and deep physical loyalty. Highly enduring and dependable.";
    synergyHighlights = ["Unshakable material security and trust", "Harmonious aesthetic and sensory appreciation", "Patience to build wealth and lasting legacy"];
    shadowFriction = ["Risk of comfortable, rigid routine", "Resistance to unexpected spiritual metamorphoses", "Fixation on material concerns over ethereal growth"];
    esotericGuidance = "Incorporate periodic journeys, art, or spontaneous changes of scenery to keep the earth fresh and fertile.";
    alchemicalFormula = `Materia (${signA.symbol}) + Materia (${signB.symbol}) → Crystalline Bedrock`;
  }
  // Earth + Water
  else if ((elemA === 'Earth' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Earth')) {
    harmonyScore = 95;
    reactionName = "Fertile Oasis (Nourishing Matrix)";
    dynamicSummary = "Water hydrates the dry soil, allowing seeds of growth to blossom into a lush oasis. Earth provides a supportive riverbed for water's fluid tides.";
    synergyHighlights = ["Deep emotional and material nourishment", "Natural protective instinct for home and family", "Effortless blend of intuition and practicality"];
    shadowFriction = ["Excessive caution leading to overly safe bubbles", "Heavy emotional tides muddying clear practical judgment", "Over-attachment to historical comfort zones"];
    esotericGuidance = "Celebrate the fertile sanctuary you create together while remaining open to receiving outside inspiration and new horizons.";
    alchemicalFormula = `Materia (${signA.icon}) ↔ Aqua (${signB.icon}) → Living Oasis`;
  }
  // Earth + Air
  else if ((elemA === 'Earth' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Earth')) {
    harmonyScore = 65;
    reactionName = "Dust Tempest (Arid Synthesis)";
    dynamicSummary = "The intellect of Air sweeps across the solid landscapes of Earth. Air brings fresh perspectives, while Earth demands tangible proof.";
    synergyHighlights = ["Pragmatic intellectual analysis", "Air's ideas gain concrete structure through Earth", "Earth learns abstract philosophical perspectives"];
    shadowFriction = ["Air may view Earth as overly literal or dense", "Earth may view Air as ungrounded or impractical", "Communication gaps between theory and application"];
    esotericGuidance = "Bridge the gap by establishing projects where Air formulates blueprints and Earth constructs the physical edifice.";
    alchemicalFormula = `Aer (${signA.icon}) + Materia (${signB.icon}) → Architectural Blueprint`;
  }
  // Air + Air
  else if (elemA === 'Air' && elemB === 'Air') {
    harmonyScore = 89;
    reactionName = "Stratospheric Cyclone (Harmonic Resonance)";
    dynamicSummary = "A sparkling atmospheric confluence of twin minds. Endless dialogue, shared philosophical quests, and intellectual brilliance.";
    synergyHighlights = ["Telepathic mental synergy and quick wit", "Unconditional support for mental freedom", "Vibrant social connection and joint curiosity"];
    shadowFriction = ["Difficulty landing abstract concepts into physical form", "Detachment from raw emotional processing", "Over-analysis leading to decision paralysis"];
    esotericGuidance = "Commit to shared physical practices—such as yoga, craft, or nature walks—to anchor your soaring intellect in body awareness.";
    alchemicalFormula = `Aer (${signA.symbol}) + Aer (${signB.symbol}) → Stratospheric Convergence`;
  }
  // Air + Water
  else if ((elemA === 'Air' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Air')) {
    harmonyScore = 67;
    reactionName = "Atmospheric Mist (Storm Dynamics)";
    dynamicSummary = "Mind meets feeling. Air attempts to rationalize Water's ocean, while Water seeks to invite Air into deep intuitive feeling.";
    synergyHighlights = ["Brilliant poetic and artistic synthesis", "Air articulates Water's deep unspoken feelings", "Water adds emotional soul to Air's logical concepts"];
    shadowFriction = ["Air's clinical detachment hurting Water's feelings", "Water's intense moods overwhelming Air's logic", "Misunderstanding between analytical and intuitive languages"];
    esotericGuidance = "Honor both logic and intuition as valid ways of knowing. Let Air listen without diagnosing, and let Water feel without overwhelming.";
    alchemicalFormula = `Aer (${signA.icon}) ↔ Aqua (${signB.icon}) → Poetic Synthesis`;
  }
  // Water + Water
  else if (elemA === 'Water' && elemB === 'Water') {
    harmonyScore = 92;
    reactionName = "Abyssal Unity (Oceanic Convergence)";
    dynamicSummary = "Two rivers dissolving into a boundless ocean of mutual empathy, psychic awareness, and deep emotional sanctuary.";
    synergyHighlights = ["Uncanny intuitive and psychic connection", "Deep emotional safety and spiritual depth", "Boundless compassion and creative artistic synergy"];
    shadowFriction = ["Boundary dissolution leading to codependency", "Drowning in shared emotional storms", "Avoidance of harsh material realities"];
    esotericGuidance = "Establish clear energetic boundaries so each soul remains a distinct vessel floating on the shared oceanic current.";
    alchemicalFormula = `Aqua (${signA.symbol}) + Aqua (${signB.symbol}) → Oceanic Crucible`;
  }

  // Modality Modifier Adjustment
  if (signA.modality === signB.modality && signA.name !== signB.name) {
    if (signA.modality === 'Fixed') {
      shadowFriction.push("Mutual stubbornness when opinions lock in fixed positions");
    } else if (signA.modality === 'Cardinal') {
      shadowFriction.push("Competing desires to take charge of the helm simultaneously");
    } else if (signA.modality === 'Mutable') {
      synergyHighlights.push("Effortless adaptability and shared flexibility in shifting conditions");
    }
  }

  const elementalPairing = `${signA.name} (${signA.symbol} - ${signA.elementLatin}) & ${signB.name} (${signB.symbol} - ${signB.elementLatin})`;

  const consultationMarkdown = `
---
### 🌌 Energetic Zodiac Compatibility Analysis
**Celestial Pair**: ${signA.name} (${signA.symbol} ${signA.elementLatin}) ⚡ ${signB.name} (${signB.symbol} ${signB.elementLatin})
**Alchemical Reaction**: ${reactionName}
**Energetic Harmony Index**: ${harmonyScore}% Resonance
**Aspect Relationship**: ${aspectType}
**Elemental Dynamics**: ${dynamicSummary}
**Synergy Highlights**:
${synergyHighlights.map(s => `- ✨ ${s}`).join('\n')}
**Shadow & Friction**:
${shadowFriction.map(f => `- ⚠️ ${f}`).join('\n')}
**Esoteric Oracle Guidance**: ${esotericGuidance}
---`;

  return {
    userSign: signA,
    partnerSign: signB,
    harmonyScore,
    reactionName,
    aspectType,
    elementalPairing,
    dynamicSummary,
    synergyHighlights,
    shadowFriction,
    esotericGuidance,
    alchemicalFormula,
    consultationMarkdown
  };
}

interface ZodiacCompatibilityEngineProps {
  userSign: string;
  partnerSign: string;
  onUserSignChange?: (newSign: string) => void;
  onPartnerSignChange?: (newSign: string) => void;
  onAppendToConsultation?: (markdownSnippet: string) => void;
  activeTheme?: {
    id: string;
    textPrimary: string;
    textAccent: string;
    borderAccent: string;
    bgCard: string;
    textAccentHex: string;
  };
}

export default function ZodiacCompatibilityEngine({
  userSign,
  partnerSign,
  onUserSignChange,
  onPartnerSignChange,
  onAppendToConsultation,
  activeTheme = {
    id: 'default',
    textPrimary: 'text-amber-400',
    textAccent: 'text-amber-300',
    borderAccent: 'border-amber-500/30',
    bgCard: 'bg-black/60',
    textAccentHex: '#D4AF37'
  }
}: ZodiacCompatibilityEngineProps) {
  const [internalUserSign, setInternalUserSign] = useState(userSign || 'Aries');
  const [internalPartnerSign, setInternalPartnerSign] = useState(partnerSign || 'Leo');
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    if (userSign) setInternalUserSign(userSign);
  }, [userSign]);

  useEffect(() => {
    if (partnerSign) setInternalPartnerSign(partnerSign);
  }, [partnerSign]);

  const handleUserChange = (val: string) => {
    setInternalUserSign(val);
    if (onUserSignChange) onUserSignChange(val);
  };

  const handlePartnerChange = (val: string) => {
    setInternalPartnerSign(val);
    if (onPartnerSignChange) onPartnerSignChange(val);
  };

  const handleSwap = () => {
    const temp = internalUserSign;
    handleUserChange(internalPartnerSign);
    handlePartnerChange(temp);
  };

  const analysis = useMemo(() => {
    return calculateZodiacCompatibility(internalUserSign, internalPartnerSign);
  }, [internalUserSign, internalPartnerSign]);

  const handleCopyMarkdown = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.consultationMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppend = () => {
    if (!analysis) return;
    if (onAppendToConsultation) {
      onAppendToConsultation(analysis.consultationMarkdown);
    }
  };

  if (!analysis) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl text-center text-slate-400">
        Please select valid zodiac signs to initialize the energetic compatibility matrix.
      </div>
    );
  }

  const userMeta = analysis.userSign;
  const partnerMeta = analysis.partnerSign;

  // Determine Gauge Color
  let gaugeColor = "from-amber-500 to-amber-300";
  let gaugeText = "text-amber-400";
  if (analysis.harmonyScore >= 90) {
    gaugeColor = "from-emerald-500 via-teal-400 to-amber-300";
    gaugeText = "text-emerald-400";
  } else if (analysis.harmonyScore >= 75) {
    gaugeColor = "from-amber-500 via-yellow-400 to-amber-200";
    gaugeText = "text-amber-300";
  } else {
    gaugeColor = "from-rose-500 via-amber-500 to-amber-300";
    gaugeText = "text-rose-400";
  }

  return (
    <div className={`w-full rounded-2xl border ${activeTheme.borderAccent} bg-gradient-to-b from-[#18181c] via-[#121215] to-[#0a0a0c] p-5 md:p-7 shadow-2xl relative overflow-hidden flex flex-col gap-6`}>
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
              Zodiac Compatibility Engine
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                Elemental Matrix
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-serif">
              Calculates energetic resonance, elemental interplay, and alchemical outcomes for spiritual & comparative consultations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer font-serif"
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showDetails ? "Collapse Matrix" : "Expand Matrix"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls & Sign Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-black/40 p-4 rounded-xl border border-white/5">
        {/* User Sign Selector */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-serif font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="text-amber-400">👤</span> Seeker's Celestial Sign
          </label>
          <div className="relative">
            <select
              value={internalUserSign}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full bg-[#141418] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 appearance-none font-serif cursor-pointer"
            >
              {ZODIAC_SIGNS_LIST.map(s => (
                <option key={s.id} value={s.name} className="bg-[#141418] text-white">
                  {s.symbol} {s.name} ({s.elementLatin} - {s.element})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
              ▼
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Ruler: <strong className="text-slate-200">{userMeta.ruler}</strong></span>
            <span>•</span>
            <span>Modality: <strong className="text-slate-200">{userMeta.modality}</strong></span>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex items-center justify-center py-1">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Seeker and Partner Signs"
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Partner Sign Selector */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-serif font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="text-emerald-400">💖</span> Partner's Celestial Sign
          </label>
          <div className="relative">
            <select
              value={internalPartnerSign}
              onChange={(e) => handlePartnerChange(e.target.value)}
              className="w-full bg-[#141418] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 appearance-none font-serif cursor-pointer"
            >
              {ZODIAC_SIGNS_LIST.map(s => (
                <option key={s.id} value={s.name} className="bg-[#141418] text-white">
                  {s.symbol} {s.name} ({s.elementLatin} - {s.element})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
              ▼
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Ruler: <strong className="text-slate-200">{partnerMeta.ruler}</strong></span>
            <span>•</span>
            <span>Modality: <strong className="text-slate-200">{partnerMeta.modality}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Compatibility Meter & Summary Dashboard */}
      <AnimatePresence mode="wait">
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Top Score Gauge Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-gradient-to-r from-black/60 via-[#16161a] to-black/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              
              {/* Gauge Column */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 rounded-xl text-center relative">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Energetic Harmony Index</span>
                
                <div className="relative flex items-center justify-center my-2">
                  <div className={`text-4xl md:text-5xl font-serif font-black ${gaugeText} tracking-tight`}>
                    {analysis.harmonyScore}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden my-2 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.harmonyScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${gaugeColor}`}
                  />
                </div>

                <div className="text-xs font-serif italic text-amber-300 font-semibold mt-1">
                  {analysis.reactionName}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {analysis.aspectType}
                </div>
              </div>

              {/* Elemental Synergy Description */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{userMeta.icon}</span>
                    <span className="text-sm font-serif font-bold text-slate-200">{userMeta.name}</span>
                    <span className="text-xs text-slate-500 font-mono">({userMeta.elementLatin})</span>
                    <span className="text-amber-400 font-bold mx-1">⚡</span>
                    <span className="text-xl">{partnerMeta.icon}</span>
                    <span className="text-sm font-serif font-bold text-slate-200">{partnerMeta.name}</span>
                    <span className="text-xs text-slate-500 font-mono">({partnerMeta.elementLatin})</span>
                  </div>

                  <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {analysis.alchemicalFormula}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-300 font-serif leading-relaxed">
                  {analysis.dynamicSummary}
                </p>

                <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg flex items-start gap-2 text-xs text-amber-200/90 font-serif italic">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Esoteric Guidance:</strong> {analysis.esotericGuidance}</span>
                </div>
              </div>
            </div>

            {/* Synergy Highlights vs Shadow Friction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Synergies */}
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex flex-col gap-3">
                <h4 className="text-xs font-serif font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Harmonic Synergies & Strengths
                </h4>
                <ul className="flex flex-col gap-2">
                  {analysis.synergyHighlights.map((syn, i) => (
                    <li key={i} className="text-xs text-slate-300 font-serif flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{syn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shadow & Friction */}
              <div className="p-5 bg-rose-950/20 border border-rose-500/20 rounded-xl flex flex-col gap-3">
                <h4 className="text-xs font-serif font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Energetic Challenges & Shadows
                </h4>
                <ul className="flex flex-col gap-2">
                  {analysis.shadowFriction.map((fric, i) => (
                    <li key={i} className="text-xs text-slate-300 font-serif flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">!</span>
                      <span>{fric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions Bar for Consultations */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/50 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-serif">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Append this elemental calculation to your live consultation response or copy it for study notes.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-serif text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Snippet" : "Copy Markdown"}</span>
                </button>

                {onAppendToConsultation && (
                  <button
                    type="button"
                    onClick={handleAppend}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-serif font-bold text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Append to Consultation</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
