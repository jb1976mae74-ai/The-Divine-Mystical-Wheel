/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Flame, Sparkles, Loader2, Send, Shuffle, Volume2, VolumeX, Notebook, History, X, Trash2, ChevronRight, Mic, MicOff, Search, Download, FileText, BookOpen, RotateCcw, Moon, GraduationCap, Compass, Crown, Eye, EyeOff, Heart, Database, Wifi, AlertCircle, CheckCircle2, AlertTriangle, FileDown, Share2, Copy, Check, Calendar, Scroll, Layers, Brain, PenTool, Pyramid, TrendingUp, TrendingDown, Orbit, ShieldAlert, Radio, Navigation, Building2, ShieldCheck, Globe, FlaskConical } from 'lucide-react';
import type { PdfExportOptions } from './utils/chroniclePdfExport';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence, animate } from 'motion/react';
import { HeaderWrapper } from './components/HeaderWrapper';
import TypewriterMarkdown from './components/TypewriterMarkdown';
import KeyInsightsCard from './components/KeyInsightsCard';
import { ZODIAC_DESCRIPTIONS } from './data/zodiacData';
import AudioVisualizer from './components/AudioVisualizer';
import OracleWaveformVisualizer from './components/OracleWaveformVisualizer';
import DailyAstroGuidance from './components/DailyAstroGuidance';
import { getMoonPhase, MoonPhaseInfo, getZodiacSignFromDate } from './utils/astrologyUtils';
export { getMoonPhase, type MoonPhaseInfo, getZodiacSignFromDate };
import ZodiacSignDropdown from './components/ZodiacSignDropdown';
import { InteractiveHeptagram } from './components/InteractiveHeptagram';
import DeadSeaScrollsScholarship from './components/DeadSeaScrollsScholarship';
import { audioSystem } from './utils/audioSystem';
import { generateFailsafeResponse } from './utils/offlineFallback';

// Lazy Loaded Portals & Visualizers for Fast Initial Page Load & Small Critical Bundle
const ConsultationRadarChart = lazy(() => import('./components/ConsultationRadarChart'));
const ChronosCycleVisualizer = lazy(() => import('./components/ChronosCycleVisualizer'));
const MilitaryBasePortal = lazy(() => import('./components/MilitaryBasePortal'));
const GPSPortal = lazy(() => import('./components/gps/GPSPortal'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ManifestationLaboratory = lazy(() => import('./components/ManifestationLaboratory'));
const HighIntelligenceSearchEngine = lazy(() => import('./components/HighIntelligenceSearchEngine'));
const HolyBiblePortal = lazy(() => import('./components/HolyBiblePortal'));
const HolyQuranPortal = lazy(() => import('./components/HolyQuranPortal'));
const GrimoireNotes = lazy(() => import('./components/GrimoireNotes'));
const EnochianSanctum = lazy(() => import('./components/EnochianSanctum'));
const ScripturaSearch = lazy(() => import('./components/ScripturaSearch'));
const ClassroomSanctum = lazy(() => import('./components/ClassroomSanctum'));
const AethericSigil = lazy(() => import('./components/AethericSigil'));
const SalazarScholarship = lazy(() => import('./components/SalazarScholarship'));
const OfficeOfDivineOrder = lazy(() => import('./components/OfficeOfDivineOrder'));
const OfficeOfWisdomArchitect = lazy(() => import('./components/OfficeOfWisdomArchitect'));
const ApocryphalScholarship = lazy(() => import('./components/ApocryphalScholarship'));
const MelchizedekScholarship = lazy(() => import('./components/MelchizedekScholarship'));
const MetatronScholarship = lazy(() => import('./components/MetatronScholarship'));
const EnochScholarshipPortal = lazy(() => import('./components/EnochScholarshipPortal'));
const SchoolOfThoughtPortal = lazy(() => import('./components/SchoolOfThoughtPortal'));
const TarotReadings = lazy(() => import('./components/TarotReadings'));
const TemporalNexusSanctum = lazy(() => import('./components/TemporalNexusSanctum'));
const NatalChartVisualization = lazy(() => import('./components/NatalChartVisualization'));
const ChroniclesTimeline = lazy(() => import('./components/ChroniclesTimeline'));
const ConsultationChroniclesDrawer = lazy(() => import('./components/ConsultationChroniclesDrawer'));
const BattleTactics = lazy(() => import('./components/BattleTactics'));
const AnunnakiArchive = lazy(() => import('./components/AnunnakiArchive'));
const ExtensiveLibraryPortal = lazy(() => import('./components/ExtensiveLibraryPortal'));
const NexusServiceDemo = lazy(() => import('./components/NexusServiceDemo'));
const ServiceLogViewer = lazy(() => import('./components/ServiceLogViewer'));
const SocialShareModal = lazy(() => import('./components/SocialShareModal'));
import { MysticGuideChat } from './components/MysticGuideChat';

const TabSuspenseFallback: React.FC<{ name?: string }> = ({ name }) => (
  <div className="w-full max-w-7xl min-h-[420px] flex flex-col items-center justify-center p-12 text-center animate-pulse">
    <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-950/20 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
      <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
    </div>
    <h3 className="text-base font-serif font-bold text-amber-300 tracking-wider">
      {name ? `Opening ${name}` : 'Aligning Portal Sanctuary'}...
    </h3>
    <p className="text-xs font-serif text-slate-400 mt-1 max-w-md">
      Connecting to sacred archive streams...
    </p>
  </div>
);

interface MysticalMetrics {
  subject: string;
  value: number;
  fullMark: number;
}

const extractMysticalMetrics = (text: string): MysticalMetrics[] => {
  if (!text) {
    return [
      { subject: 'Spiritus', value: 5, fullMark: 10 },
      { subject: 'Ignis', value: 5, fullMark: 10 },
      { subject: 'Aqua', value: 5, fullMark: 10 },
      { subject: 'Aer', value: 5, fullMark: 10 },
      { subject: 'Materia', value: 5, fullMark: 10 },
    ];
  }

  const categories = [
    { key: 'Spiritus', label: 'Spiritus' },
    { key: 'Ignis', label: 'Ignis' },
    { key: 'Aqua', label: 'Aqua' },
    { key: 'Aer', label: 'Aer' },
    { key: 'Materia', label: 'Materia' }
  ];

  const scores: Record<string, number> = {};
  let foundExplicit = false;

  categories.forEach(cat => {
    const regexStr = new RegExp(`(?:-|\\*|\\s|^)${cat.key}\\s*[:\\-=\\|]\\s*\\*?\\*?(\\d+)\\*?\\*?`, 'i');
    const match = text.match(regexStr);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val >= 1 && val <= 10) {
        scores[cat.key] = val;
        foundExplicit = true;
      }
    }
  });

  if (!foundExplicit) {
    const lowerText = text.toLowerCase();
    const keywords: Record<string, string[]> = {
      Spiritus: ['spirit', 'soul', 'god', 'divine', 'spark', 'transcend', 'yahweh', 'lucifer', 'sacred', 'astral', 'celestial', 'heaven', 'enochian', 'angel', 'angelic', 'kabbalah', 'gnosis', 'gnostic', 'temple', 'infinite', 'eternal', 'seeker'],
      Ignis: ['fire', 'ignis', 'flame', 'burn', 'passion', 'sulfur', 'energy', 'will', 'force', 'action', 'creative', 'active', 'hot', 'phoenix', 'hearth', 'sun', 'solar', 'volcano', 'tempest', 'spark', 'alchemy'],
      Aqua: ['water', 'aqua', 'intuition', 'emotion', 'flow', 'mercury', 'depth', 'feeling', 'sea', 'ocean', 'lunar', 'moon', 'chalice', 'cupped', 'fluid', 'tide', 'dissolve', 'wash', 'cleanse', 'wave'],
      Aer: ['air', 'aer', 'intellect', 'mind', 'thought', 'breath', 'wind', 'reason', 'philosophy', 'logic', 'conception', 'study', 'breeze', 'sky', 'flight', 'feather', 'words', 'speak', 'oracle', 'thinking'],
      Materia: ['matter', 'materia', 'earth', 'physical', 'body', 'ground', 'salt', 'stone', 'lead', 'gold', 'form', 'flesh', 'clay', 'solid', 'crystal', 'anchor', 'root', 'mortal', 'vein', 'iron', 'mineral']
    };

    categories.forEach(cat => {
      const words = keywords[cat.key];
      let count = 0;
      words.forEach(w => {
        let pos = lowerText.indexOf(w);
        while (pos !== -1) {
          count++;
          pos = lowerText.indexOf(w, pos + w.length);
        }
      });
      const calculatedValue = Math.min(10, Math.max(3, 3 + Math.floor(count / 2)));
      scores[cat.key] = calculatedValue;
    });
  } else {
    categories.forEach(cat => {
      if (scores[cat.key] === undefined) {
        scores[cat.key] = 5;
      }
    });
  }

  return categories.map(cat => ({
    subject: cat.label,
    value: scores[cat.key],
    fullMark: 10
  }));
};

const cleanAnswerMarkdown = (text: string): string => {
  if (!text) return "";
  const index = text.indexOf("[Mystical Balance]");
  if (index !== -1) {
    return text.substring(0, index).trim();
  }
  return text;
};

const PREDICTIVE_INVOCATIONS: Record<string, string[]> = {
  "School of the Prophets": [
    "How do I awaken the spiritual mantle and visionary gift of the Prophets?",
    "Reveal the prophetic ciphers hidden within ancient covenants and codices.",
    "What signs indicate the opening of heavenly portals and divine revelations?",
    "How can I discern the true voice of inspiration from false echoes?",
    "Explain the lineage and spiritual discipline of the ancient prophetic schools."
  ],
  "Hermetic Alchemy": [
    "How do I achieve the Great Work (Magnum Opus)?",
    "Reveal the secrets of the Philosopher's Stone.",
    "As above, so below; how does this apply to my soul?",
    "How can I transmute my leaden spirit into pure spiritual gold?",
    "What is the role of Hermes Trismegistus in my path?"
  ],
  "Gnosticism": [
    "How do I awaken the divine spark of Gnosis within?",
    "Who is the Demiurge and how does he bind us to matter?",
    "Reveal the mysteries of Sophia's descent and redemption.",
    "How can I transcend the lower Archons and ascend the spheres?",
    "What is the true nature of the unknowable Monad?"
  ],
  "Kabbalah (Jewish Mysticism)": [
    "How do I balance the pillars of Mercy and Severity on the Tree of Life?",
    "Explain the mystery of Kether, the Crown of creation.",
    "How does the Tzimtzum (divine contraction) relate to my purpose?",
    "What is the path of the Shekhinah's return?",
    "How can I ascend the 32 Paths of Wisdom?"
  ],
  "Christian Mysticism": [
    "How do I enter the Dark Night of the Soul?",
    "What does union with the Divine Logos feel like?",
    "Speak of the interior castle and its seven mansions.",
    "How can I cultivate pure, disinterested love (Agape)?",
    "Explain the mystery of the uncreated light on Mount Tabor."
  ],
  "Sufism (Islamic Mysticism)": [
    "How can I achieve Fana (dissolution of the self) in the Divine?",
    "What is the path of the heart's polishing (Tazkiyah)?",
    "How do the lovers of God dance in the cosmic circle of divine love?",
    "Explain the mystery of the veil between the lover and the Beloved.",
    "How does the voice of Ney (flute) call us home?"
  ],
  "Stoic Philosophy": [
    "How do I cultivate perfect Amor Fati in times of trial?",
    "What is the role of the Logos in my daily choices?",
    "How do I separate what is in my control from what is not?",
    "Reveal the paths to true Ataraxia (untroubled mind).",
    "How can I live in perfect accordance with Nature?"
  ],
  "Quantum Science": [
    "How does the Observer Effect collapse the wave function of my destiny?",
    "Explain the mystical entanglement between minds across the cosmos.",
    "Are we living in a holographic projection of light and math?",
    "How does quantum superposition mirror the infinite possibilities of spirit?",
    "What is the relationship between zero-point energy and the void?"
  ],
  "Enochian Magic": [
    "How do I invoke the watchtowers of the four corners of the universe?",
    "What are the secrets of the Great Table of Enoch?",
    "How can I communicate safely with the angels of the Aethyrs?",
    "Speak the first key of the angelic calls to open the gates.",
    "What is the sigil of Ameth and its authority?"
  ],
  "Anunnaki Tradition": [
    "Who are the keepers of the ME (divine decrees) of civilization?",
    "How do the planetary alignments of Nibiru affect earthly spirit?",
    "What is the legacy of the gold-carvers and the blood of the stars?",
    "How can I connect with the primordial waters of Abzu?",
    "Reveal the tablets of destiny and their final writing."
  ],
  "Metatronic School of Thought": [
    "How do I align my soul's frequency with the celestial Scribe's ledger?",
    "Reveal the geometric mysteries of Metatron's Cube.",
    "Speak of the transformation of Enoch into the Prince of the Presence.",
    "How can I access the archives of the heavenly Tabernacle?",
    "What are the 70 names of Metatron and their authority?"
  ],
  "Babylonian Scholarship": [
    "How do I read the liver omen of my future state?",
    "Speak of the gates of Ishtar and the descent to Kur.",
    "What is the destiny written in the Enuma Elish?",
    "How do the seven apkallu (sages) guard the primordial wisdom?",
    "How do I appease the high gods of the ancient ziggurats?"
  ],
  "Egyptian Scholarship": [
    "How do I weigh my heart against the feather of Ma'at?",
    "Reveal the mystery of the Eye of Horus and its healing force.",
    "What is the secret journey of Ra through the twelve gates of night?",
    "How does the Ka separate from the Ba during spiritual flight?",
    "Explain the alchemy of the green-faced Osiris."
  ],
  "Hindu Scholarship": [
    "How do I transcend Samsara and realize my true Atman?",
    "Explain the flow of Kundalini through the seven subtle energy centers.",
    "What is the relationship between Karma and Dharma on my path?",
    "How does the cosmic dance of Shiva dissolve the cosmic illusion (Maya)?",
    "Speak of the primordial sound Om and its resonance."
  ],
  "Ba'hai Scholarship": [
    "How do I understand the progressive revelation of divine messengers?",
    "What is the path to the unity of all spiritual traditions?",
    "How do we polish the mirror of the soul to reflect the divine names?",
    "Speak of the valleys of search, love, and unity in the Seven Valleys.",
    "How do we balance science and religion in the modern era?"
  ],
  "Greek Mythology Scholarship": [
    "How do I navigate the Eleusinian Mysteries of rebirth?",
    "What is the prophetic message of the Pythia at the Delphi Oracle?",
    "How do I balance Dionysian ecstasy with Apollonian reason?",
    "Reveal the golden tablet of the Orphic initiates.",
    "How can I transcend the river of forgetfulness (Lethe)?"
  ],
  "Astrology Scholarship": [
    "How do the transits of the outer planets affect my spiritual path?",
    "Reveal the karmic lessons hidden in my natal Saturn placement.",
    "How can I align my daily actions with the current lunar phase?",
    "Explain the tension and synthesis between my Sun and Moon signs.",
    "What does my North Node reveal about my soul's ultimate purpose?"
  ],
  "Tarot Scholarship": [
    "What do the cards reveal about my current spiritual blockage?",
    "How can I interpret the High Priestess in my daily meditation?",
    "Reveal the path of the Fool in my current life journey.",
    "What forces of the Major Arcana are currently influencing my fate?",
    "How do I balance the suits of Swords and Cups within my soul?"
  ],
  "Melchizedekian Priesthood Scholarship": [
    "How does Melchizedek release souls from spiritual debts during the Tenth Jubilee in 11Q13?",
    "Explain 11Q13 and Melchizedek executing judgment as celestial Elohim.",
    "What is the difference between the Order of Melchizedek and the Levitical priesthood?",
    "Why was Melchizedek recorded without father, mother, or genealogy in Hebrews 7?",
    "How do bread and wine prefigure the eternal priesthood of El Elyon in Salem?"
  ],
  "Jerry Ben Salazar's Scholarship (Creator)": [
    "What is the connection between the 7-point star and the 76 keys?",
    "How do we balance the letters J and B within our aetheric center?",
    "Explain the relationship between the Apocalypse and the Apocryphon.",
    "How do we find glory and power in the midst of life after death?",
    "What is the central role of Abadadon in Salazar's cosmology?"
  ],
  "Jacob Boehme's Scholarship": [
    "How do the seven source-spirits of God operate within my soul?",
    "What is the signature of all things (signatura rerum)?",
    "How did the divine Sophia fall into the dark desire of nature?",
    "Explain the light-world and fire-world of the Mysterium Magnum.",
    "How can I awaken the noble virgin Sophia within?"
  ],
  "Divine Law Scholarship": [
    "How do the universal spiritual laws govern our earthly choices?",
    "Explain the principle of cause and effect in divine justice.",
    "How do we align our personal will with the absolute law of love?",
    "What are the eternal scales of truth in the celestial court?",
    "How do we attain spiritual sovereignty under the divine law?"
  ],
  "Military School of Thought 🎖️🪖": [
    "What is the ultimate principle of strategy?",
    "How does one achieve victory without fighting?",
    "Explain the role of deception in warfare.",
    "How can a commander maintain the morale of their troops?",
    "What are the spiritual lessons learned on the battlefield?"
  ]
};


export interface PastInquiry {
  id: string;
  question: string;
  answer: string;
  school: string;
  timestamp: string;
  zodiacSign?: string;
  balanceInterpretation?: string;
  metrics?: Array<{ subject: string; value: number }>;
  tags?: string[];
  notes?: string;
}

export const THEMES = [
  {
    id: "ancient-gold",
    name: "Ancient Gold",
    bgPage: "bg-[#070708]",
    bgCard: "bg-[#141416]",
    textPrimary: "text-[#D4AF37]",
    textAccent: "text-amber-500",
    textAccentHex: "#D4AF37",
    accentGradient: "from-[#D4AF37] to-[#AA6C39]",
    borderAccent: "border-[#D4AF37]/20",
    borderAccentSemi: "border-[#D4AF37]/45",
    starStroke: "stroke-[#D4AF37]",
    accentGlow: "rgba(212, 175, 55, 0.15)",
    inputFocus: "focus:border-[#D4AF37] focus:ring-[#D4AF37]/20",
    radarColor: "#D4AF37",
    radarFillOpacity: 0.25
  },
  {
    id: "deep-void",
    name: "Deep Void",
    bgPage: "bg-[#050508]",
    bgCard: "bg-[#0f0e17]",
    textPrimary: "text-violet-300",
    textAccent: "text-violet-400",
    textAccentHex: "#a78bfa",
    accentGradient: "from-violet-500 to-indigo-600",
    borderAccent: "border-violet-500/20",
    borderAccentSemi: "border-violet-500/45",
    starStroke: "stroke-violet-400",
    accentGlow: "rgba(139, 92, 246, 0.15)",
    inputFocus: "focus:border-violet-500 focus:ring-violet-500/20",
    radarColor: "#a78bfa",
    radarFillOpacity: 0.3
  },
  {
    id: "ethereal-silver",
    name: "Ethereal Silver",
    bgPage: "bg-[#06080a]",
    bgCard: "bg-[#101418]",
    textPrimary: "text-slate-200",
    textAccent: "text-sky-300",
    textAccentHex: "#7dd3fc",
    accentGradient: "from-sky-400 to-slate-400",
    borderAccent: "border-sky-400/20",
    borderAccentSemi: "border-sky-400/45",
    starStroke: "stroke-sky-300",
    accentGlow: "rgba(125, 211, 252, 0.15)",
    inputFocus: "focus:border-sky-400 focus:ring-sky-400/20",
    radarColor: "#7dd3fc",
    radarFillOpacity: 0.25
  }
];

export function getSchoolBadgeStyle(school: string) {
  const norm = (school || "").toLowerCase();
  
  if (norm.includes("hermetic") || norm.includes("alchemy")) {
    return { symbol: "🧪", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" };
  }
  if (norm.includes("gnostic")) {
    return { symbol: "👁️", bg: "bg-violet-500/10 text-violet-400 border-violet-500/25" };
  }
  if (norm.includes("kabbalah")) {
    return { symbol: "🌳", bg: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
  }
  if (norm.includes("christian")) {
    return { symbol: "🕊️", bg: "bg-sky-500/10 text-sky-400 border-sky-500/25" };
  }
  if (norm.includes("sufi")) {
    return { symbol: "🌀", bg: "bg-teal-500/10 text-teal-400 border-teal-500/25" };
  }
  if (norm.includes("stoic")) {
    return { symbol: "🏛️", bg: "bg-slate-500/10 text-slate-400 border-slate-500/25" };
  }
  if (norm.includes("quantum")) {
    return { symbol: "⚛️", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" };
  }
  if (norm.includes("enochian")) {
    return { symbol: "📐", bg: "bg-rose-500/10 text-rose-400 border-rose-500/25" };
  }
  if (norm.includes("anunnaki")) {
    return { symbol: "🪐", bg: "bg-orange-500/10 text-orange-400 border-orange-500/25" };
  }
  if (norm.includes("babylonian")) {
    return { symbol: "📜", bg: "bg-yellow-600/10 text-yellow-500 border-yellow-600/25" };
  }
  if (norm.includes("egyptian")) {
    return { symbol: "𓂀", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" };
  }
  if (norm.includes("hindu")) {
    return { symbol: "🕉️", bg: "bg-orange-600/10 text-orange-500 border-orange-600/25" };
  }
  if (norm.includes("ba'hai") || norm.includes("bahai")) {
    return { symbol: "🌟", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" };
  }
  if (norm.includes("greek") || norm.includes("mythology")) {
    return { symbol: "⚡", bg: "bg-amber-600/10 text-amber-500 border-amber-600/25" };
  }
  if (norm.includes("jerry") || norm.includes("salazar")) {
    return { symbol: "🔥", bg: "bg-red-500/10 text-red-400 border-red-500/25" };
  }
  if (norm.includes("boehme")) {
    return { symbol: "✨", bg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25" };
  }
  if (norm.includes("divine") || norm.includes("law")) {
    return { symbol: "⚖️", bg: "bg-blue-500/10 text-blue-400 border-blue-500/25" };
  }
  return { symbol: "🎓", bg: "bg-slate-500/10 text-slate-300 border-slate-500/25" };
}

const CustomTooltip = ({ active, payload, activeTheme, dominantSubject, isTrendMode }: any) => {
  if (active && payload && payload.length) {
    const currentSubject = payload[0].payload.subject;
    const isDominant = currentSubject === dominantSubject;

    if (isTrendMode && payload.length > 1) {
      return (
        <div className={`bg-[#18181b]/98 border ${activeTheme.id === 'deep-void' ? 'border-violet-500/40' : activeTheme.id === 'ethereal-silver' ? 'border-slate-400/40' : 'border-amber-500/30'} px-3 py-2 rounded-lg shadow-xl text-left backdrop-blur-md flex flex-col gap-1.5 min-w-[170px]`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-1 gap-2">
            <p className={`text-xs font-mono font-bold ${activeTheme.id === 'deep-void' ? 'text-violet-300' : activeTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-300'}`}>
              {currentSubject}
            </p>
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider bg-white/5 px-1 py-0.5 rounded border border-white/10">
              5-Consultation Trend
            </span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const labelName = entry.name || `Consultation #${index + 1}`;
              return (
                <div key={`tooltip-entry-${entry.name || index}-${index}`} className="flex items-center justify-between text-[10px] font-mono gap-3">
                  <span className="flex items-center gap-1.5 truncate max-w-[130px]" style={{ color: entry.stroke || entry.color }}>
                    <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.stroke || entry.color }} />
                    <span className="truncate">{labelName}</span>
                  </span>
                  <span className="font-bold text-slate-100 font-mono shrink-0">{entry.value} / 10</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-[#18181b]/98 border ${activeTheme.id === 'deep-void' ? 'border-violet-500/40' : activeTheme.id === 'ethereal-silver' ? 'border-slate-400/40' : 'border-amber-500/30'} px-3.5 py-2 rounded-lg shadow-xl text-center backdrop-blur-md flex flex-col items-center gap-1 min-w-[130px]`}>
        <div className="flex items-center gap-1.5 justify-center">
          {isDominant && (
            <Crown className={`w-3.5 h-3.5 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-400'} animate-pulse`} />
          )}
          <p className={`text-xs font-mono font-semibold ${activeTheme.id === 'deep-void' ? 'text-violet-300' : activeTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-200'}`}>{currentSubject}</p>
        </div>
        <p className={`text-sm font-mono ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-400'} font-bold mt-0.5`}>
          {payload[0].value} <span className="text-[10px] text-slate-500 font-normal">/ 10</span>
        </p>
        {isDominant && (
          <span className={`text-[8.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase mt-0.5 flex items-center gap-1`}>
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" /> Dominant Force
          </span>
        )}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [pastInquiries, setPastInquiries] = useState<PastInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("oracle-past-inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [birthDate, setBirthDate] = useState<string>(() => {
    return localStorage.getItem("oracle-birth-date") || "";
  });

  const [zodiacMode, setZodiacMode] = useState<"auto" | "manual">(() => {
    const savedMode = localStorage.getItem("oracle-zodiac-mode");
    if (savedMode === "auto" || savedMode === "manual") return savedMode;
    return localStorage.getItem("oracle-manual-zodiac-sign") ? "manual" : "auto";
  });

  const [manualZodiacSign, setManualZodiacSign] = useState<string>(() => {
    return localStorage.getItem("oracle-manual-zodiac-sign") || "";
  });

  const autoZodiacSign = useMemo(() => {
    return birthDate ? getZodiacSignFromDate(birthDate) : "";
  }, [birthDate]);

  const zodiacSign = useMemo(() => {
    if (zodiacMode === "manual" && manualZodiacSign) {
      return manualZodiacSign;
    }
    return autoZodiacSign || "";
  }, [zodiacMode, manualZodiacSign, autoZodiacSign]);

  // Background sync feature to ensure any zodiac sign updates are immediately reflected and persisted
  useEffect(() => {
    if (pastInquiries.length > 0) {
      let changed = false;
      const updatedInquiries = pastInquiries.map(inq => {
        if (inq.zodiacSign !== zodiacSign) {
          changed = true;
          return { ...inq, zodiacSign };
        }
        return inq;
      });
      if (changed) {
        setPastInquiries(updatedInquiries);
        localStorage.setItem("oracle-past-inquiries", JSON.stringify(updatedInquiries));
      }
    }
  }, [zodiacSign]);

  useEffect(() => {
    if (birthDate) {
      localStorage.setItem("oracle-birth-date", birthDate);
    }
  }, [birthDate]);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("oracle-active-tab") || "oracle";
  });

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("oracle-active-tab", tab);
  };

  const [question, setQuestion] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [triggerSaveNoteCounter, setTriggerSaveNoteCounter] = useState(0);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [school, setSchool] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oracle-active-school");
      if (saved) return saved;
    }
    return "Hermetic Alchemy";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && school) {
      localStorage.setItem("oracle-active-school", school);
    }
  }, [school]);

  const filteredInvocations = useMemo(() => {
    const list = PREDICTIVE_INVOCATIONS[school] || [];
    if (!question.trim()) {
      return list; // show all when input is empty
    }
    const query = question.toLowerCase();
    return list.filter(phrase => phrase.toLowerCase().includes(query));
  }, [school, question]);
  const [answer, setAnswer] = useState("");
  
  const [balanceInterpretation, setBalanceInterpretation] = useState<string>(() => {
    return localStorage.getItem("oracle-active-balance-interpretation") || "";
  });
  const [interpreting, setInterpreting] = useState(false);

  const mysticalMetrics = useMemo(() => {
    return extractMysticalMetrics(answer);
  }, [answer]);

  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastInquiry, setLastInquiry] = useState<{ question: string; answer: string; school: string } | undefined>(undefined);
  const [aethericFallback, setAethericFallback] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const handleCopyAnswer = async (customText?: string) => {
    const textToCopy = customText || cleanAnswerMarkdown(answer);
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2500);
    } catch (err) {
      console.warn("Failed to copy answer to clipboard:", err);
    }
  };

  const [socialShareState, setSocialShareState] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
    url?: string;
  }>({
    isOpen: false,
    title: 'Share Oracle Revelation',
    text: '',
  });

  const openSocialShare = (customTitle?: string, customText?: string, customUrl?: string) => {
    setSocialShareState({
      isOpen: true,
      title: customTitle || 'Share Oracle Revelation',
      text: customText || (answer ? cleanAnswerMarkdown(answer) : question) || 'Consulting the Celestial Oracle...',
      url: customUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    });
  };

  const handleShareTwitter = (customQuestion?: string) => {
    const inquiryText = customQuestion || question;
    const currentUrl = window.location.href;
    const cleanInquiry = inquiryText ? inquiryText.trim() : "Seeking wisdom from the Oracle";
    
    // Construct tweet text with inquiry and current Oracle instance link
    const tweetText = `🔮 Oracle Inquiry: "${cleanInquiry.length > 170 ? cleanInquiry.substring(0, 167) + "..." : cleanInquiry}"\n\nConsult the Celestial Oracle instance:`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
    
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

        const birthMoonPhase = useMemo(() => {
    return getMoonPhase(birthDate);
  }, [birthDate]);

  const fetchBalanceInterpretation = async (id: string, q: string, s: string, metrics: any[]) => {
    if (!q || !metrics || metrics.length === 0) return;
    setInterpreting(true);
    let interpretationText = "";
    try {
      let res;
      let attempts = 2;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          res = await fetch("/api/analyze-balance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q, school: s, metrics, zodiacSign: zodiacSign || undefined }),
            signal: queryAbortControllerRef.current?.signal || undefined,
          });
          if (res.ok) {
            break;
          }
        } catch (fetchErr) {
          if (attempt === attempts) {
            throw fetchErr;
          }
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      if (!res || !res.ok) {
        throw new Error(`Spectral gateway returned status ${res ? res.status : "unknown"}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        interpretationText = data.interpretation || "";
      } else {
        throw new Error("Vocal/balance analysis response is not formatted as JSON");
      }

      setBalanceInterpretation(interpretationText);
      localStorage.setItem("oracle-active-balance-interpretation", interpretationText);

      // Backfill the past inquiries list so this interpretation is saved historically
      setPastInquiries(prev => {
        const updated = prev.map(item => {
          if (item.id === id || (item.question === q && item.school === s && !item.balanceInterpretation)) {
            return { ...item, balanceInterpretation: interpretationText };
          }
          return item;
        });
        localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn("[Balance API] Performing offline alchemical interpretation fallback:", err);
      // Client-side local template fallback matching the mystery school rules:
      const sorted = [...metrics].sort((a, b) => b.value - a.value);
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      let zodiacText = zodiacSign ? ` Aligning with the currents of your ${zodiacSign} zodiac,` : "";
      
      const failsafeInterpretation = `Within the scholarly traditions of ${s}, this particular configuration signifies a unique posture. A prominent balance of ${highest.subject} (${highest.value}/10) reigns in your alignment, indicating that these forces are deeply amplified in relation to your inquiry.${zodiacText} you should seek to cultivate your weaker ${lowest.subject} node (${lowest.value}/10) to re-establish alchemical harmony.`;
      
      setBalanceInterpretation(failsafeInterpretation);
      localStorage.setItem("oracle-active-balance-interpretation", failsafeInterpretation);
    } finally {
      setInterpreting(false);
    }
  };

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const zodiacDateRanges: Record<string, string> = {
    Aries: "Mar 21 - Apr 19",
    Taurus: "Apr 20 - May 20",
    Gemini: "May 21 - Jun 20",
    Cancer: "Jun 21 - Jul 22",
    Leo: "Jul 23 - Aug 22",
    Virgo: "Aug 23 - Sep 22",
    Libra: "Sep 23 - Oct 22",
    Scorpio: "Oct 23 - Nov 21",
    Sagittarius: "Nov 22 - Dec 21",
    Capricorn: "Dec 22 - Jan 19",
    Aquarius: "Jan 20 - Feb 18",
    Pisces: "Feb 19 - Mar 20"
  };


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAiRevelation, setShowAiRevelation] = useState(false);
  const [appRevelationArtifact, setAppRevelationArtifact] = useState<'sigil-zion' | 'statue' | 'apocalypse-dragon' | 'heptagram'>('sigil-zion');
  const [chronicleSearch, setChronicleSearch] = useState("");
  const [chronicleFilter, setChronicleFilter] = useState("all");
    const [chronicleSort, setChronicleSort] = useState<"newest" | "oldest" | "alphabetical" | "zodiac">("newest");
  const [chronicleDatePreset, setChronicleDatePreset] = useState<"all" | "7days" | "30days" | "custom">("all");
  const [chronicleStartDate, setChronicleStartDate] = useState("");
  const [chronicleEndDate, setChronicleEndDate] = useState("");
  const [comparison1Id, setComparison1Id] = useState<string | null>(null);
  const [comparison2Id, setComparison2Id] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedInquiry, setSharedInquiry] = useState<PastInquiry | null>(null);

  // Parse shared consultation from URL query parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get("share");
    if (shareParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(shareParam));
        if (parsed && parsed.question && parsed.answer) {
          setSharedInquiry({
            id: parsed.id || ("shared-" + Math.random().toString(36).substring(2, 9)),
            question: parsed.question,
            answer: parsed.answer,
            school: parsed.school || "Celestial",
            timestamp: parsed.timestamp || new Date().toLocaleString(),
            balanceInterpretation: parsed.balanceInterpretation || ""
          });
          // Remove query parameter from address bar cleanly and silently
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (e) {
        console.warn("Failed to parse shared consultation parameters:", e);
      }
    }
  }, []);

  const handleSaveSharedInquiry = async () => {
    if (!sharedInquiry) return;
    
    // Check if already exists in history
    const exists = pastInquiries.some(iq => iq.id === sharedInquiry.id || (iq.question === sharedInquiry.question && iq.answer === sharedInquiry.answer));
    if (exists) {
      setDbToast({
        message: "This sacred revelation is already saved within your chronicles.",
        type: "warning",
        id: Date.now()
      });
      setSharedInquiry(null);
      return;
    }

    // Generate a new unique ID starting with 'rec-' if shared- prefixed
    const newId = sharedInquiry.id.startsWith("shared-") 
      ? "rec-" + Math.random().toString(36).substring(2, 11)
      : sharedInquiry.id;

    const recordToSave: PastInquiry = {
      ...sharedInquiry,
      id: newId
    };

    // Post to server if connected
    try {
      await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: recordToSave.question,
          answer: recordToSave.answer,
          school: recordToSave.school,
          birthDate: "",
          zodiacSign: "",
          id: recordToSave.id
        })
      });
    } catch (err) {
      console.warn("Failed to save shared record to server:", err);
    }

    setPastInquiries(prev => {
      const updated = [recordToSave, ...prev];
      localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
      return updated;
    });

    setDbToast({
      message: "Sacred revelation imported successfully to your Consultation Chronicles!",
      type: "success",
      id: Date.now()
    });
    setSharedInquiry(null);
  };

  const [semanticSearchScores, setSemanticSearchScores] = useState<Record<string, { score: number; reason: string }> | null>(null);
  const [isSemanticSearching, setIsSemanticSearching] = useState(false);

  // Reset semantic search results when search term is cleared or changed
  useEffect(() => {
    if (!chronicleSearch.trim()) {
      setSemanticSearchScores(null);
    }
  }, [chronicleSearch]);

  const handleSemanticSearch = async () => {
    if (!chronicleSearch.trim() || pastInquiries.length === 0) return;
    setIsSemanticSearching(true);
    try {
      const res = await fetch("/api/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: chronicleSearch,
          inquiries: pastInquiries.map(iq => ({
            id: iq.id,
            question: iq.question,
            answer: iq.answer
          }))
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const scores: Record<string, { score: number; reason: string }> = {};
      if (Array.isArray(data.results)) {
        data.results.forEach((resItem: any) => {
          scores[resItem.id] = {
            score: typeof resItem.score === 'number' ? resItem.score : 0,
            reason: resItem.reason || "Thematic resonance detected."
          };
        });
      }
      setSemanticSearchScores(scores);
    } catch (err) {
      console.warn("[Semantic Search] Failed to fetch semantic similarity:", err);
      // Fallback locally
      const scores: Record<string, { score: number; reason: string }> = {};
      pastInquiries.forEach(iq => {
        const qText = iq.question.toLowerCase();
        const aText = iq.answer.toLowerCase();
        const queryLower = chronicleSearch.toLowerCase();
        let score = 0;
        let reason = "Thematic connection scanning complete.";
        if (qText.includes(queryLower) && aText.includes(queryLower)) {
          score = 0.95;
          reason = "Sacred keyword matches scriptures and answers.";
        } else if (qText.includes(queryLower)) {
          score = 0.85;
          reason = "Sacred keyword matches the inquiry question.";
        } else if (aText.includes(queryLower)) {
          score = 0.75;
          reason = "Sacred keyword matches the channeled response.";
        }
        scores[iq.id] = { score, reason };
      });
      setSemanticSearchScores(scores);
    } finally {
      setIsSemanticSearching(false);
    }
  };

  const comparisonData = useMemo(() => {
    if (!comparison1Id || !comparison2Id) return [];
    const iq1 = pastInquiries.find(i => i.id === comparison1Id);
    const iq2 = pastInquiries.find(i => i.id === comparison2Id);
    if (!iq1 || !iq2) return [];
    const m1 = extractMysticalMetrics(iq1.answer);
    const m2 = extractMysticalMetrics(iq2.answer);
    
    return m1.map((item, index) => ({
      subject: item.subject,
      val1: item.value,
      val2: m2[index]?.value || 0
    }));
  }, [comparison1Id, comparison2Id, pastInquiries]);


  const parseInquiryDate = (tsStr: string): Date => {
    if (!tsStr) return new Date();
    const d = new Date(tsStr);
    if (!isNaN(d.getTime())) return d;
    try {
      const cleaned = tsStr.replace(/[^\w\s\d,:/.-]/g, '').trim();
      const d2 = new Date(cleaned);
      if (!isNaN(d2.getTime())) return d2;
    } catch (e) {}
    return new Date();
  };

  const filteredInquiries = useMemo(() => {
    // 1. Filter pastInquiries by date range first
    const now = new Date();
    const dateFiltered = pastInquiries.filter(iq => {
      const d = parseInquiryDate(iq.timestamp);

      if (chronicleDatePreset === "7days") {
        const limit = new Date();
        limit.setDate(now.getDate() - 7);
        return d >= limit;
      } else if (chronicleDatePreset === "30days") {
        const limit = new Date();
        limit.setDate(now.getDate() - 30);
        return d >= limit;
      } else if (chronicleDatePreset === "custom") {
        if (chronicleStartDate) {
          const startLimit = new Date(chronicleStartDate);
          startLimit.setHours(0, 0, 0, 0);
          if (d < startLimit) return false;
        }
        if (chronicleEndDate) {
          const endLimit = new Date(chronicleEndDate);
          endLimit.setHours(23, 59, 59, 999);
          if (d > endLimit) return false;
        }
      }
      return true;
    });

    // 2. Filter by search, tradition, & zodiac filters on the date-filtered subset
    if (semanticSearchScores && chronicleSearch.trim()) {
      // Semantic similarity filter & sorting mode
      const filtered = dateFiltered.filter(iq => {
        const scoreInfo = semanticSearchScores[iq.id];
        const matchFilter = chronicleFilter === "all" || iq.school === chronicleFilter;
                // Keep matches with a relevance score above 0.15
        return scoreInfo && scoreInfo.score > 0.15 && matchFilter;
      });

      // Sort primarily by semantic score descending
      return [...filtered].sort((a, b) => {
        const scoreA = semanticSearchScores[a.id]?.score || 0;
        const scoreB = semanticSearchScores[b.id]?.score || 0;
        return scoreB - scoreA;
      });
    }

    // Default substring text search mode
    const filtered = dateFiltered.filter(iq => {
      const matchSearch = 
        iq.question.toLowerCase().includes(chronicleSearch.toLowerCase()) ||
        iq.answer.toLowerCase().includes(chronicleSearch.toLowerCase());
      const matchFilter = chronicleFilter === "all" || iq.school === chronicleFilter;
            return matchSearch && matchFilter;
    });

    return [...filtered].sort((a, b) => {
      if (chronicleSort === "alphabetical") {
        return a.question.localeCompare(b.question);
      } else if (chronicleSort === "oldest") {
        const timeA = parseInquiryDate(a.timestamp).getTime();
        const timeB = parseInquiryDate(b.timestamp).getTime();
        if (isNaN(timeA) || isNaN(timeB)) {
          const indexA = pastInquiries.findIndex(x => x.id === a.id);
          const indexB = pastInquiries.findIndex(x => x.id === b.id);
          return indexB - indexA; // older means larger index in pastInquiries
        }
        return timeA - timeB;
      } else if (chronicleSort === "zodiac") {
        const ZOD_ORDER: Record<string, number> = {
          aries: 1, taurus: 2, gemini: 3, cancer: 4, leo: 5, virgo: 6,
          libra: 7, scorpio: 8, sagittarius: 9, capricorn: 10, aquarius: 11, pisces: 12
        };
        const signA = (a.zodiacSign || '').trim().toLowerCase();
        const signB = (b.zodiacSign || '').trim().toLowerCase();
        const orderA = signA ? (ZOD_ORDER[signA] || 99) : 999;
        const orderB = signB ? (ZOD_ORDER[signB] || 99) : 999;
        if (orderA !== orderB) return orderA - orderB;
        const timeA = parseInquiryDate(a.timestamp).getTime();
        const timeB = parseInquiryDate(b.timestamp).getTime();
        return timeB - timeA;
      } else {
        // "newest"
        const timeA = parseInquiryDate(a.timestamp).getTime();
        const timeB = parseInquiryDate(b.timestamp).getTime();
        if (isNaN(timeA) || isNaN(timeB)) {
          const indexA = pastInquiries.findIndex(x => x.id === a.id);
          const indexB = pastInquiries.findIndex(x => x.id === b.id);
          return indexA - indexB; // newer means smaller index in pastInquiries
        }
        return timeB - timeA;
      }
    });
  }, [
    pastInquiries,
    chronicleSearch,
    chronicleFilter,
        chronicleSort,
    semanticSearchScores,
    chronicleDatePreset,
    chronicleStartDate,
    chronicleEndDate
  ]);

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  const [googleTtsEnabled, setGoogleTtsEnabled] = useState(() => {
    return localStorage.getItem("oracle-google-tts-enabled") !== "false";
  });
  const [googleVoiceName, setGoogleVoiceName] = useState(() => {
    return localStorage.getItem("oracle-google-voice-name") || "Zephyr";
  });
  const [autoTtsChatbotEnabled, setAutoTtsChatbotEnabled] = useState(() => {
    return localStorage.getItem("oracle-auto-tts-chatbot-enabled") === "true";
  });
  const [isTtsGenerating, setIsTtsGenerating] = useState(false);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const ttsIntervalRef = React.useRef<any>(null);
  const queryAbortControllerRef = React.useRef<AbortController | null>(null);

  const cancelQuery = () => {
    if (queryAbortControllerRef.current) {
      queryAbortControllerRef.current.abort();
      queryAbortControllerRef.current = null;
    }
    setLoading(false);
    setInterpreting(false);
  };

  const [dbStatus, setDbStatus] = useState<{ connected: boolean; checking: boolean }>({
    connected: false,
    checking: true
  });

  const [dbToast, setDbToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    id: number;
    details?: string;
  } | null>(null);

  const prevDbStatusRef = React.useRef<{ connected: boolean; checking: boolean }>({ connected: false, checking: true });

  const [purgingAll, setPurgingAll] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load past inquiries from both local storage AND Cloud SQL database upon startup
  useEffect(() => {
    const syncInquiriesFromServer = async () => {
      try {
        const response = await fetch("/api/consultations");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.records)) {
            const serverRecords: PastInquiry[] = data.records.map((row: any) => ({
              id: row.id,
              question: row.question,
              school: row.school,
              answer: row.answer,
              timestamp: row.created_at ? new Date(row.created_at).toLocaleString() : (row.timestamp || new Date().toLocaleString()),
              balanceInterpretation: row.balanceInterpretation || "",
              zodiacSign: row.zodiac_sign || row.zodiacSign || ""
            }));

            setPastInquiries(prev => {
              const merged = [...prev];
              let modified = false;
              serverRecords.forEach(sRec => {
                const alreadyExists = merged.some(m => m.id === sRec.id || (m.question === sRec.question && m.answer === sRec.answer));
                if (!alreadyExists) {
                  merged.push(sRec);
                  modified = true;
                }
              });
              if (modified || prev.length === 0) {
                // Sort by date/timestamp descending
                merged.sort((a, b) => {
                  const tA = new Date(a.timestamp).getTime();
                  const tB = new Date(b.timestamp).getTime();
                  return tB - tA;
                });
                try {
                  localStorage.setItem("oracle-past-inquiries", JSON.stringify(merged));
                } catch (e) {
                  console.warn("Failed saving merged inquiries to localStorage:", e);
                }
                return merged;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn("Failed to sync past inquiries from server:", err);
      }
    };
    syncInquiriesFromServer();
  }, [dbStatus.connected]);

  const [elementalView, setElementalView] = useState<'standard' | 'spiritus-ignis' | 'aqua-aer' | 'materia-ignis'>('standard');

  
  const toggleListening = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        const rec = new SpeechRecognitionAPI();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            const transcriptLower = resultText.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            let commandHandled = false;

            if (transcriptLower.includes("save note") || transcriptLower.includes("save notes") || transcriptLower.includes("inscribe note") || transcriptLower.includes("inscribe onto journal")) {
              setTriggerSaveNoteCounter(prev => prev + 1);
              setCommandFeedback("Save Note");
              speakText("Inscribing contemplation onto journal.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("clear consultation") || transcriptLower.includes("clear inquiry") || transcriptLower.includes("clear query") || transcriptLower.includes("clear question") || transcriptLower.includes("reset consultation")) {
              setQuestion("");
              setAnswer("");
              setBalanceInterpretation("");
              localStorage.removeItem("oracle-active-balance-interpretation");
              setLastInquiry(undefined);
              setCommandFeedback("Clear Consultation");
              speakText("Clearing current consultation.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("export chronicles") || transcriptLower.includes("export chronicle") || transcriptLower.includes("export archives") || transcriptLower.includes("export archive") || transcriptLower.includes("export history") || transcriptLower.includes("download chronicles") || transcriptLower.includes("download archives")) {
              downloadTXT();
              setCommandFeedback("Export Chronicles");
              speakText("Exporting consultation chronicles.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("seek randomly") || transcriptLower.includes("seek random") || transcriptLower.includes("random query") || transcriptLower.includes("random question")) {
              handleSeekRandomly();
              setCommandFeedback("Seek Randomly");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("toggle sound") || transcriptLower.includes("toggle mute") || transcriptLower.includes("mute oracle") || transcriptLower.includes("unmute oracle") || transcriptLower.includes("mute sound") || transcriptLower.includes("unmute sound")) {
              toggleSound();
              setCommandFeedback("Toggle Sound");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show military base") || transcriptLower.includes("open military base") || transcriptLower.includes("supreme fighting force") || transcriptLower.includes("open citadel") || transcriptLower.includes("open tfdas") || transcriptLower.includes("asffu")) {
              selectTab("military-base");
              setCommandFeedback("Switch View: Military Base of Operations");
              speakText("Accessing Supreme Fighting Force Base of Operations and Tri-Fold Defense Armament System.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show gps") || transcriptLower.includes("open gps") || transcriptLower.includes("open navigation") || transcriptLower.includes("show navigation") || transcriptLower.includes("gps portal") || transcriptLower.includes("geodesic gps")) {
              selectTab("gps");
              setCommandFeedback("Switch View: Geodesic GPS Positioning");
              speakText("Accessing Kingdom Geodesic GPS Positioning System and Satellite Constellation Triangulation.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show enochian") || transcriptLower.includes("open enochian") || transcriptLower.includes("enochian keys") || transcriptLower.includes("first key") || transcriptLower.includes("first call") || transcriptLower.includes("angelic language")) {
              selectTab("enochian");
              setCommandFeedback("Switch View: Enochian Sanctum & First Call");
              speakText("Accessing Enochian Sanctum and First Angelic Call of Dee and Kelley.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show oracle") || transcriptLower.includes("open oracle") || transcriptLower.includes("view oracle")) {
              selectTab("oracle");
              setCommandFeedback("Switch View: Oracle");
              speakText("Opening primary oracle console.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show scriptura") || transcriptLower.includes("open scriptura") || transcriptLower.includes("view scriptura")) {
              selectTab("scriptura");
              setCommandFeedback("Switch View: Scriptura");
              speakText("Opening scriptura search room.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("show sigil") || transcriptLower.includes("open sigil") || transcriptLower.includes("view sigil") || transcriptLower.includes("show aetheric sigil")) {
              selectTab("sigil");
              setCommandFeedback("Switch View: Sigil");
              speakText("Opening aetheric sigil canvas.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("open chronicles") || transcriptLower.includes("show chronicles") || transcriptLower.includes("open history") || transcriptLower.includes("view chronicles")) {
              setDrawerOpen(true);
              setCommandFeedback("Open Chronicles");
              speakText("Opening archives.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            } else if (transcriptLower.includes("close chronicles") || transcriptLower.includes("close history") || transcriptLower.includes("hide chronicles") || transcriptLower.includes("close drawer")) {
              setDrawerOpen(false);
              setCommandFeedback("Close Chronicles");
              speakText("Closing archives.");
              setTimeout(() => setCommandFeedback(null), 3500);
              commandHandled = true;
            }

            if (!commandHandled) {
              setQuestion(prev => {
                const trimmed = prev.trim();
                return trimmed ? `${trimmed} ${resultText}` : resultText;
              });
            }
          }
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            setSpeechError("Microphone permission denied.");
          } else {
            setSpeechError(`Speech error: ${event.error}`);
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err: any) {
        console.warn(err);
        setSpeechError(err.message || "Failed to start speech recognition.");
        setIsListening(false);
      }
    }
  };

  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem("oracle-theme-id") || "ancient-gold";
  });

  const activeTheme = useMemo(() => {
    return THEMES.find(t => t.id === activeThemeId) || THEMES[0];
  }, [activeThemeId]);

  const displayedMetrics = useMemo(() => {
    let baseMetrics = mysticalMetrics;
    if (elementalView === 'spiritus-ignis') {
      baseMetrics = mysticalMetrics.map(m => {
        if (m.subject === 'Spiritus' || m.subject === 'Ignis') {
          return m;
        }
        return { ...m, value: m.value * 0.25 };
      });
    } else if (elementalView === 'aqua-aer') {
      baseMetrics = mysticalMetrics.map(m => {
        if (m.subject === 'Aqua' || m.subject === 'Aer') {
          return m;
        }
        return { ...m, value: m.value * 0.25 };
      });
    } else if (elementalView === 'materia-ignis') {
      baseMetrics = mysticalMetrics.map(m => {
        if (m.subject === 'Materia' || m.subject === 'Ignis') {
          return m;
        }
        return { ...m, value: m.value * 0.25 };
      });
    }

    const ZODIAC_ELEMENT_MAP: Record<string, string> = {
      Aries: "Ignis", Leo: "Ignis", Sagittarius: "Ignis",
      Taurus: "Materia", Virgo: "Materia", Capricorn: "Materia",
      Gemini: "Aer", Libra: "Aer", Aquarius: "Aer",
      Cancer: "Aqua", Scorpio: "Aqua", Pisces: "Aqua"
    };

    if (zodiacSign && ZODIAC_ELEMENT_MAP[zodiacSign]) {
      const elementToBoost = ZODIAC_ELEMENT_MAP[zodiacSign];
      return baseMetrics.map(m => {
        if (m.subject === elementToBoost) {
          return { ...m, value: Math.min(10, m.value + 2) };
        }
        return m;
      });
    }
    return baseMetrics;
  }, [mysticalMetrics, elementalView, zodiacSign]);

  const [animatedMetrics, setAnimatedMetrics] = useState(displayedMetrics);
  const [isElementalTransitioning, setIsElementalTransitioning] = useState(false);
  const currentValuesRef = useRef<number[]>(displayedMetrics.map(m => m.value));

  // Trend Analysis state & calculations for RadarChart
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(false);
  const [hiddenTrendIndices, setHiddenTrendIndices] = useState<number[]>([]);
  const [trendSummaryLoading, setTrendSummaryLoading] = useState(false);
  const [trendSummaryText, setTrendSummaryText] = useState<string | null>(null);
  const [trendSummaryError, setTrendSummaryError] = useState<string | null>(null);

  const trendConsultations = useMemo(() => {
    let list = pastInquiries.slice(0, 5);
    if (answer && list.length === 0) {
      list = [{
        id: 'current-active-consultation',
        question: question || 'Active Oracle Query',
        answer: answer,
        school: school || 'Celestial Oracle',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zodiacSign: zodiacSign || ''
      }];
    }

    const result = list.map((iq, idx) => {
      const rawMetrics = extractMysticalMetrics(iq.answer);
      return {
        id: iq.id ? `trend-${iq.id}-${idx}` : `inquiry-${idx}`,
        label: idx === 0 ? 'Latest Consultation' : `Consultation -${idx}`,
        shortLabel: idx === 0 ? 'C1 (Latest)' : `C${idx + 1}`,
        questionSnippet: iq.question ? (iq.question.length > 28 ? iq.question.slice(0, 25) + '...' : iq.question) : `Record #${idx + 1}`,
        timestamp: iq.timestamp || 'Recent',
        school: iq.school || 'Mystic Tradition',
        metrics: rawMetrics,
        color: [
          activeTheme.radarColor,
          '#3b82f6',
          '#10b981',
          '#a855f7',
          '#ec4899',
        ][idx % 5],
      };
    });

    if (result.length > 0 && result.length < 5) {
      const baseMetricValues = result[0].metrics;
      const placeholderTitles = [
        'Initiatory Baseline',
        'Ancestral Epoch',
        'Preliminary Inscription',
        'Aetheric Foundation'
      ];
      for (let i = result.length; i < 5; i++) {
        const simulatedMetrics = baseMetricValues.map(m => {
          const offset = Math.sin((i + 1) * 1.5 + m.value) * 2;
          const val = Math.min(10, Math.max(2, Math.round(m.value + offset)));
          return { ...m, value: val };
        });
        result.push({
          id: `benchmark-${i}`,
          label: `Historical Benchmark -${i}`,
          shortLabel: `C${i + 1} (Archive)`,
          questionSnippet: placeholderTitles[i - result.length] || `Archive #${i + 1}`,
          timestamp: `Historic Record -${i}`,
          school: 'Ancient Archive',
          metrics: simulatedMetrics,
          color: [
            activeTheme.radarColor,
            '#3b82f6',
            '#10b981',
            '#a855f7',
            '#ec4899',
          ][i],
        });
      }
    } else if (result.length === 0) {
      const defaultSampleValues = [
        { subject: 'Spiritus', value: 7 },
        { subject: 'Ignis', value: 8 },
        { subject: 'Aqua', value: 6 },
        { subject: 'Aer', value: 7 },
        { subject: 'Materia', value: 5 },
      ];
      const sampleNames = ['Current Oracle State', 'Previous Consultation', '3rd Inscription', '4th Inquiry', 'Initiatory Epoch'];
      for (let i = 0; i < 5; i++) {
        const simulatedMetrics = defaultSampleValues.map(m => {
          const offset = Math.sin((i + 1) * 1.2 + m.value) * 1.8;
          const val = Math.min(10, Math.max(2, Math.round(m.value + offset)));
          return { subject: m.subject, value: val, fullMark: 10 };
        });
        result.push({
          id: `sample-${i}`,
          label: sampleNames[i],
          shortLabel: `C${i + 1}`,
          questionSnippet: sampleNames[i],
          timestamp: `Record -${i}`,
          school: 'Celestial School',
          metrics: simulatedMetrics,
          color: [
            activeTheme.radarColor,
            '#3b82f6',
            '#10b981',
            '#a855f7',
            '#ec4899',
          ][i],
        });
      }
    }

    return result;
  }, [pastInquiries, answer, question, school, zodiacSign, activeTheme.radarColor]);

  const unifiedRadarData = useMemo(() => {
    const categories = ['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'];
    return categories.map(cat => {
      const stdMetric = animatedMetrics.find(m => m.subject === cat);
      const stdValue = stdMetric ? stdMetric.value : 5;
      const row: any = { subject: cat, value: stdValue, fullMark: 10 };

      let sum = 0;
      let count = 0;
      trendConsultations.forEach((c, idx) => {
        const metric = c.metrics.find(m => m.subject === cat);
        const val = metric ? metric.value : 5;
        row[`val${idx}`] = val;
        sum += val;
        count++;
      });
      row.avg = Number((sum / (count || 1)).toFixed(1));
      return row;
    });
  }, [animatedMetrics, trendConsultations]);

  const trendEvolutionStats = useMemo(() => {
    if (trendConsultations.length === 0) return null;
    const latest = trendConsultations[0];
    const oldest = trendConsultations[trendConsultations.length - 1];

    const deltas: Record<string, { latest: number; oldest: number; diff: number }> = {};
    const categories = ['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'];

    let highestDiff = -99;
    let highestEvolvingElement = 'Spiritus';

    categories.forEach(cat => {
      const latestVal = latest.metrics.find(m => m.subject === cat)?.value || 5;
      const oldestVal = oldest.metrics.find(m => m.subject === cat)?.value || 5;
      const diff = latestVal - oldestVal;
      deltas[cat] = { latest: latestVal, oldest: oldestVal, diff };
      if (diff > highestDiff) {
        highestDiff = diff;
        highestEvolvingElement = cat;
      }
    });

    return {
      latest,
      oldest,
      deltas,
      highestEvolvingElement,
      highestDiff,
      totalRecordsCount: pastInquiries.length
    };
  }, [trendConsultations, pastInquiries]);

  const handleFetchTrendSummary = async () => {
    if (trendSummaryLoading) return;
    setTrendSummaryLoading(true);
    setTrendSummaryError(null);

    try {
      const response = await fetch('/api/oracle/trend-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultations: trendConsultations,
          stats: trendEvolutionStats
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.summary) {
        setTrendSummaryText(data.summary);
      } else {
        throw new Error('No summary returned from celestial server.');
      }
    } catch (err: any) {
      console.error('Error fetching trend summary:', err);
      setTrendSummaryError('Failed to generate trend summary. Please verify your connection or try again.');
    } finally {
      setTrendSummaryLoading(false);
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 650; // ms: organic and responsive celestial transition

    // Using ref preserves exact in-flight coordinates if user rapidly switches views
    const startValues = currentValuesRef.current.length === displayedMetrics.length
      ? [...currentValuesRef.current]
      : animatedMetrics.map(m => m.value);
    const endValues = displayedMetrics.map(m => m.value);

    // Check if there is a non-trivial difference to animate
    const needsAnimation = startValues.some((v, i) => Math.abs(v - (endValues[i] ?? v)) > 0.005);
    if (!needsAnimation) {
      currentValuesRef.current = endValues;
      return;
    }

    setIsElementalTransitioning(true);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Smooth cubic ease-in-out curve for natural physical celestial resonance
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentStepValues = displayedMetrics.map((m, i) => {
        const startVal = startValues[i] !== undefined ? startValues[i] : m.value;
        const endVal = endValues[i] !== undefined ? endValues[i] : m.value;
        return Number((startVal + (endVal - startVal) * easeProgress).toFixed(3));
      });

      currentValuesRef.current = currentStepValues;

      setAnimatedMetrics(
        displayedMetrics.map((m, i) => ({
          ...m,
          value: currentStepValues[i]
        }))
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        currentValuesRef.current = endValues;
        setIsElementalTransitioning(false);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [displayedMetrics]);

  const elementalViewDetails = useMemo(() => {
    const spiritusVal = mysticalMetrics.find(m => m.subject === 'Spiritus')?.value || 5;
    const ignisVal = mysticalMetrics.find(m => m.subject === 'Ignis')?.value || 5;
    const aquaVal = mysticalMetrics.find(m => m.subject === 'Aqua')?.value || 5;
    const aerVal = mysticalMetrics.find(m => m.subject === 'Aer')?.value || 5;
    const materiaVal = mysticalMetrics.find(m => m.subject === 'Materia')?.value || 5;

    switch (elementalView) {
      case 'spiritus-ignis': {
        const ratio = (spiritusVal / (ignisVal || 1)).toFixed(2);
        let interpretation = "";
        if (spiritusVal > ignisVal + 1) {
          interpretation = "Spiritus Dominant: Channeled contemplation prevails. Divine aspirations govern your physical drive.";
        } else if (ignisVal > spiritusVal + 1) {
          interpretation = "Ignis Dominant: Active fire surges. Intense creative willpower and passion propel your path.";
        } else {
          interpretation = "Harmonized Synthesis: Perfect calibration between spiritual purpose (Spiritus) and dynamic action (Ignis).";
        }
        return {
          title: "Celestial Flame Focus",
          description: "Evaluating divine spirit (Spiritus) against active fire (Ignis). This axis governs how inspiration is transmuted into active will.",
          ratioText: `Ratio: ${spiritusVal} ✦ ${ignisVal} (Factor: ${ratio})`,
          interpretation,
          badgeColor: activeTheme.id === 'deep-void' ? 'bg-violet-950/40 border-violet-500/20 text-violet-300' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-900/40 border-slate-500/20 text-slate-300' : 'bg-amber-950/40 border-amber-500/20 text-amber-200'
        };
      }
      case 'aqua-aer': {
        const ratio = (aquaVal / (aerVal || 1)).toFixed(2);
        let interpretation = "";
        if (aquaVal > aerVal + 1) {
          interpretation = "Aqua Dominant: Deep emotional intuition and ocean currents steer your insights ahead of rigid logic.";
        } else if (aerVal > aquaVal + 1) {
          interpretation = "Aer Dominant: Intellectual reason, analytical philosophy, and structured logic command your thoughts.";
        } else {
          interpretation = "Harmonized Synthesis: A perfect blending of empathetic intuition (Aqua) and brilliant rational mind (Aer).";
        }
        return {
          title: "Astral Tides Focus",
          description: "Measuring receptive flow (Aqua) alongside analytical intellect (Aer). This axis balances heartfelt intuition with objective logic.",
          ratioText: `Ratio: ${aquaVal} ✦ ${aerVal} (Factor: ${ratio})`,
          interpretation,
          badgeColor: activeTheme.id === 'deep-void' ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-900/40 border-slate-500/20 text-slate-300' : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200'
        };
      }
      case 'materia-ignis': {
        const ratio = (materiaVal / (ignisVal || 1)).toFixed(2);
        let interpretation = "";
        if (materiaVal > ignisVal + 1) {
          interpretation = "Materia Dominant: Stately earth anchors you. Solid manifestation and grounded structure override restless change.";
        } else if (ignisVal > materiaVal + 1) {
          interpretation = "Ignis Dominant: Volatile fire is free. The passion to alter your environment exceeds the drive to consolidate it.";
        } else {
          interpretation = "Harmonized Synthesis: Equal parts creative energy (Ignis) and solid grounding (Materia). Ideas materialize effortlessly.";
        }
        return {
          title: "Telluric Crucible Focus",
          description: "Contrasting physical manifestation (Materia) with active transmutation (Ignis). This axis tracks the crystallization of force.",
          ratioText: `Ratio: ${materiaVal} ✦ ${ignisVal} (Factor: ${ratio})`,
          interpretation,
          badgeColor: activeTheme.id === 'deep-void' ? 'bg-fuchsia-950/40 border-fuchsia-500/20 text-fuchsia-300' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-900/40 border-slate-500/20 text-slate-300' : 'bg-red-950/40 border-red-500/20 text-red-200'
        };
      }
      default:
        return null;
    }
  }, [mysticalMetrics, elementalView, activeTheme]);

  const triggerHaptic = (type: 'light' | 'impact' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        if (type === 'light') {
          navigator.vibrate(25);
        } else if (type === 'impact') {
          navigator.vibrate([60, 40, 100]);
        } else if (type === 'heavy') {
          navigator.vibrate([120, 50, 150]);
        }
      } catch (e) {
        // Ignore vibration errors
      }
    }
  };

  const selectTheme = (id: string) => {
    setActiveThemeId(id);
    localStorage.setItem("oracle-theme-id", id);
    triggerHaptic('light');
  };

  const downloadJSON = () => {
    if (pastInquiries.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pastInquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "consultation_chronicles.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadTXT = () => {
    if (pastInquiries.length === 0) return;
    let content = "=========================================================\n";
    content += "            MYSTICAL ORACLE CONSULTATION CHRONICLES      \n";
    content += "=========================================================\n\n";
    
    pastInquiries.forEach((iq, idx) => {
      content += `[Record No. ${idx + 1}]\n`;
      content += `Timestamp:  ${iq.timestamp}\n`;
      content += `Tradition:  ${iq.school}\n`;
      content += `Inquiry:    ${iq.question}\n`;
      content += `---------------------------------------------------------\n`;
      content += `Response:\n${iq.answer}\n`;
      content += `=========================================================\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", "consultation_chronicles.txt");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async (recordsToExport?: PastInquiry[], options?: PdfExportOptions) => {
    const inquiriesToExport = recordsToExport && recordsToExport.length > 0 ? recordsToExport : filteredInquiries;
    if (inquiriesToExport.length === 0) return;

    const defaultSeekerName = localStorage.getItem("oracle-pdf-seeker-name") || "Jerry Ben Salazar";
    const mergedOptions: PdfExportOptions = {
      seekerName: options?.seekerName || defaultSeekerName,
      includeTitlePage: options?.includeTitlePage !== false,
      includeSummary: options?.includeSummary !== false,
      customSubtitle: options?.customSubtitle,
      ...options
    };

    try {
      const { generateChroniclePdf } = await import('./utils/chroniclePdfExport');
      const doc = generateChroniclePdf(inquiriesToExport, mergedOptions);
      const sanitizedSeekerName = (mergedOptions.seekerName || "jerry_ben_salazar").toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = mergedOptions.filename || `sacred_consultation_chronicles_${sanitizedSeekerName}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  // Stop speech if unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (ttsIntervalRef.current) {
        clearInterval(ttsIntervalRef.current);
        ttsIntervalRef.current = null;
      }
    };
  }, []);

  // Auto-dismiss dbToast after 7 seconds
  useEffect(() => {
    if (dbToast) {
      const timer = setTimeout(() => {
        setDbToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [dbToast]);

  const checkDbStatus = React.useCallback(() => {
    fetch("/api/db-status")
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            throw new Error(json.error || "Status API returned an error status");
          }).catch(() => {
            throw new Error("Status API returned an error code from the server");
          });
        }
        return res.json();
      })
      .then((data) => {
        const connectedState = !!data.connected;
        const checkingState = !!data.checking;

        // Check if we transitioned from offline to online
        if (connectedState && !prevDbStatusRef.current.connected && !prevDbStatusRef.current.checking) {
          setDbToast({
            message: "Aetheric Link Restored: The Cloud SQL database has successfully reconnected.",
            type: 'success',
            id: Date.now()
          });
        } else if (!connectedState && prevDbStatusRef.current.connected) {
          // Check if we transitioned from online to offline
          setDbToast({
            message: "Aetheric Link Fractured: Database connection lost. All operations will use local state.",
            type: 'warning',
            id: Date.now(),
            details: data.error || undefined
          });
        }

        prevDbStatusRef.current = { connected: connectedState, checking: checkingState };
        setDbStatus({
          connected: connectedState,
          checking: checkingState,
        });
      })
      .catch((err) => {
        console.warn("[Cloud SQL Status] Failed to retrieve database status:", err);
        
        // Only show toast if the previous state was connected, or if we haven't displayed an error toast yet
        if (prevDbStatusRef.current.connected || prevDbStatusRef.current.checking) {
          setDbToast({
            message: `Aetheric Link Error: ${err.message}`,
            type: 'error',
            id: Date.now()
          });
        }
        
        prevDbStatusRef.current = { connected: false, checking: false };
        setDbStatus({ connected: false, checking: false });
      });
  }, []);

  // Check Cloud SQL database connectivity
  useEffect(() => {
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 15000);
    return () => clearInterval(interval);
  }, [checkDbStatus]);

  const schools = [
    "School of the Prophets",
    "Hermetic Alchemy",
    "Gnosticism",
    "Kabbalah (Jewish Mysticism)",
    "Christian Mysticism",
    "Sufism (Islamic Mysticism)",
    "Stoic Philosophy",
    "Quantum Science",
    "Enochian Magic",
    "Anunnaki Tradition",
    "Babylonian Scholarship",
    "Egyptian Scholarship",
    "Hindu Scholarship",
    "Ba'hai Scholarship",
    "Greek Mythology Scholarship",
    "Astrology Scholarship",
    "Tarot Scholarship",
    "Melchizedekian Priesthood Scholarship",
    "Metatronic School of Thought",
    "Metatron's Scholarship",
    "Jerry Ben Salazar's Scholarship (Creator)",
    "Jacob Boehme's Scholarship",
    "Divine Law Scholarship",
    "Diurnal Scripture Cycle",
    "Military School of Thought 🎖️🪖"
  ];

  const randomQuestions = [
    "What is the true nature of reality?",
    "How does one achieve harmony between the inner micro-cosmos and the outer macro-cosmos?",
    "What is the meaning of suffering and how can it be transcended?",
    "What is the source of ultimate truth?",
    "How can the soul awake from the illusion of the material world?",
    "What is the highest purpose of human existence?",
    "How does one find the divine spark within?",
    "What is the relationship between the finite mind and the infinite intelligence?",
    "Is time an illusion, and how do we escape its bound?",
    "What is the nature of the self, and can it be truly known?",
    "How do the celestial movements and transits shape my spiritual path?"
  ];

  const speakText = (text: string) => {
    if (!soundEnabled) return;
    
    // Stop any existing playing Audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (ttsIntervalRef.current) {
      clearInterval(ttsIntervalRef.current);
      ttsIntervalRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    audioSystem.endSpeech();

    const cleanText = text
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/~/g, '')
      .replace(/>/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    if (googleTtsEnabled) {
      setIsTtsGenerating(true);
      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voiceName: googleVoiceName })
      })
      .then(res => {
        if (!res.ok) throw new Error("TTS channel unavailable.");
        return res.json();
      })
      .then(data => {
        setIsTtsGenerating(false);
        if (data.audioContent && !data.fallbackToLocal) {
          const mimeType = data.mimeType || 'audio/mp3';
          const audioUrl = `data:${mimeType};base64,${data.audioContent}`;
          const audio = new Audio(audioUrl);
          activeAudioRef.current = audio;
          
          audio.onplay = () => {
            setIsSpeaking(true);
            audioSystem.startSpeech();
            
            // Set up an interval to periodically pulse the visualizer
            ttsIntervalRef.current = setInterval(() => {
              audioSystem.triggerWordBoundaryPulse();
            }, 250); // Pulse every 250ms
          };
          
          audio.onended = () => {
            setIsSpeaking(false);
            audioSystem.endSpeech();
            if (ttsIntervalRef.current) {
              clearInterval(ttsIntervalRef.current);
              ttsIntervalRef.current = null;
            }
          };
          
          audio.onerror = (evt) => {
            console.warn("Google Intelligence Audio load failed or was unsupported. Transitioning to local synthesis fallback.", evt);
            setIsSpeaking(false);
            audioSystem.endSpeech();
            if (ttsIntervalRef.current) {
              clearInterval(ttsIntervalRef.current);
              ttsIntervalRef.current = null;
            }
            speakLocalFallback(text);
          };
          
          audio.play().catch(e => {
            console.warn("Google Intelligence Audio playback blocked or failed (e.g. autoplay policy or codec support). Using local synthesis fallback.", e);
            speakLocalFallback(text);
          });
        } else {
          speakLocalFallback(text);
        }
      })
      .catch(err => {
        console.warn("Google Intelligence TTS failed, falling back to basic voice.", err);
        setIsTtsGenerating(false);
        speakLocalFallback(text);
      });
    } else {
      speakLocalFallback(text);
    }
  };

  const speakLocalFallback = (text: string) => {
    if (!('speechSynthesis' in window) || !soundEnabled) return;

    const cleanText = text
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/~/g, '')
      .replace(/>/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.7; // Lower pitch for oracle aura
    utterance.rate = 0.85; // Slower deliberate pace

    utterance.onstart = () => {
      setIsSpeaking(true);
      audioSystem.startSpeech();
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      audioSystem.endSpeech();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      audioSystem.endSpeech();
    };
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        audioSystem.triggerWordBoundaryPulse();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSound = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (ttsIntervalRef.current) {
      clearInterval(ttsIntervalRef.current);
      ttsIntervalRef.current = null;
    }
    if (soundEnabled && isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      audioSystem.endSpeech();
    }
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    audioSystem.setMute(!newSoundEnabled);
  };

  const submitSeek = async (q: string, s: string) => {
    if (!q.trim()) return;
    
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (ttsIntervalRef.current) {
      clearInterval(ttsIntervalRef.current);
      ttsIntervalRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      audioSystem.endSpeech();
    }

    setLoading(true);
    setAnswer("");
    setBalanceInterpretation("");
    localStorage.removeItem("oracle-active-balance-interpretation");
    setAethericFallback(false);

    if (queryAbortControllerRef.current) {
      queryAbortControllerRef.current.abort();
    }
    queryAbortControllerRef.current = new AbortController();

    const inquiryId = "rec-" + Math.random().toString(36).substring(2, 11);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, school: s, id: inquiryId }),
        signal: queryAbortControllerRef.current.signal,
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        setAethericFallback(!!data.aethericFallback);
        let finalAnswer = data.answer;
        setAnswer(finalAnswer);
        speakText(finalAnswer);
        setLastInquiry({ question: q, answer: finalAnswer, school: s });

        const computedMetrics = extractMysticalMetrics(finalAnswer);
        // Save to past inquiries chronicles
        const newInquiry: PastInquiry = {
          id: inquiryId,
          question: q,
          answer: finalAnswer,
          school: s,
          timestamp: new Date().toLocaleString(),
          zodiacSign: zodiacSign || ""
        };
        setPastInquiries(prev => {
          const updated = [newInquiry, ...prev];
          try {
            localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
          } catch (e) {
            console.warn("Failed storing past inquiry:", e);
          }
          return updated;
        });

        // Trigger asynchronous qualitative analysis
        fetchBalanceInterpretation(inquiryId, q, s, computedMetrics);
        triggerHaptic('impact');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("[Oracle API] Consultation aborted by the seeker.");
        return;
      }
      console.warn("[Oracle API] Channel offline or interrupted. Swerving to local mystical fallback.", err);
      let failsafeAnswer = generateFailsafeResponse(q, s);
        setAnswer(failsafeAnswer);
      speakText(failsafeAnswer);
      setLastInquiry({ question: q, answer: failsafeAnswer, school: s });

      const computedMetrics = extractMysticalMetrics(failsafeAnswer);
      // Save to past inquiries chronicles
      const newInquiry: PastInquiry = {
        id: inquiryId,
        question: q,
        answer: failsafeAnswer,
        school: s,
        timestamp: new Date().toLocaleString(),
        zodiacSign: zodiacSign || ""
      };
      setPastInquiries(prev => {
        const updated = [newInquiry, ...prev];
        try {
          localStorage.setItem("oracle-past-inquiries", JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed storing past inquiry:", e);
        }
        return updated;
      });

      // Trigger asynchronous qualitative analysis
      fetchBalanceInterpretation(inquiryId, q, s, computedMetrics);
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (e: React.FormEvent) => {
    e.preventDefault();
    submitSeek(question, school);
  };

  const handleSeekRandomly = () => {
    const randomSchool = schools[Math.floor(Math.random() * schools.length)];
    const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
    
    setSchool(randomSchool);
    setQuestion(randomQuestion);
    
    submitSeek(randomQuestion, randomSchool);
  };

  const center = { x: 500, y: 500 };
  const starRadius = 250;
  const circleRadius = 280;

  // Generate 7 points for the heptagram
  const starPoints = useMemo(() => {
    const points = [];
    // 7/2 heptagram
    for (let i = 0; i < 7; i++) {
        // We multiply i by 2 for the 7/2 star pattern
        const step = (i * 2) % 7;
        const angle = -Math.PI / 2 + (step * 2 * Math.PI) / 7;
        points.push({
            x: center.x + starRadius * Math.cos(angle),
            y: center.y + starRadius * Math.sin(angle),
        });
    }
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, [center.x, center.y, starRadius]);

  const flamePositions = useMemo(() => {
    const positions = [];
    const flameRadius = 320;
    for (let i = 0; i < 12; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 12;
        positions.push({
            x: center.x + flameRadius * Math.cos(angle),
            y: center.y + flameRadius * Math.sin(angle),
            angle: (i * 360) / 12,
        });
    }
    return positions;
  }, [center.x, center.y]);

  const downloadSymbolSVG = () => {
    const svgElement = document.getElementById("sacredHeptagramSymbol");
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "sacred_heptagram_seal.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${activeTheme.bgPage || 'bg-[#070708]'} font-sans text-slate-200 flex flex-col items-center justify-start p-6 md:p-12 gap-8 selection:bg-white/10 w-full overflow-x-hidden relative will-change-transform transform-gpu smooth-scroll-gpu`}>
      <HeaderWrapper />

      {/* Portal Header */}
      <header className="text-center flex flex-col items-center gap-2 max-w-xl self-center pt-4 z-20">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`flex items-center gap-3 text-3xl md:text-4xl font-serif ${activeTheme.textPrimary} tracking-widest font-bold border-b ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]/20' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/20' : 'border-[#D4AF37]/20'} pb-3`}
        >
          <Sparkles className={`w-8 h-8 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'} animate-pulse`} />
          <span>ORACLE PORTAL</span>
          <Notebook className={`w-7 h-7 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} />
        </motion.div>
        
        <p className="text-xs md:text-sm text-slate-400 font-serif italic tracking-wide">
          Seek answers from ancient traditions and record findings in your personal Grimoire
        </p>

        {/* Database Status & Share App Badges */}
        <div className="mt-2.5 flex items-center justify-center gap-2 font-serif text-[10.5px] tracking-wider uppercase select-none flex-wrap">
          {dbStatus.checking ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/40 border border-slate-700/30 text-slate-400 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
              <span>Verifying Aetheric Link...</span>
            </span>
          ) : dbStatus.connected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Database Linked</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/5 border border-amber-500/15 text-amber-500/90" title="The Cloud SQL database is offline. All records are being seamlessly persisted to your browser's persistent virtual ledger.">
                <Wifi className="w-3 h-3 text-amber-500/80" />
                <span>Offline Mode</span>
              </span>
              <button
                type="button"
                onClick={checkDbStatus}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/30 border border-amber-500/30 text-amber-500 hover:text-amber-300 transition-all cursor-pointer"
                title="Attempt to reconnect to Cloud SQL"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={() => openSocialShare("Celestial Oracle Portal", "Seek answers from ancient traditions, esoteric astrology, and apocryphal scholarship on the Celestial Oracle Portal.")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/30 border border-sky-500/30 text-sky-200 hover:text-white transition-all cursor-pointer font-sans"
            title="Share Celestial Oracle Portal on Social Media"
          >
            <Share2 className="w-3 h-3 text-sky-400" />
            <span>Share Portal</span>
          </button>
        </div>

        {/* Workspace Mode Selection Tab Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 p-1 bg-black/45 border border-white/5 rounded-xl text-xs font-serif shadow-xl w-full max-w-sm md:max-w-3xl lg:max-w-4xl">
            {/* Oracle Portal Tab Toggle Button */}
            <button
              onClick={() => selectTab("oracle")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[130px] ${
                activeTab === "oracle"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celestial Oracle</span>
            </button>

            {/* Natal Chart Wheel Tab Toggle Button */}
            <button
              onClick={() => selectTab("natal")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[145px] ${
                activeTab === "natal"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-amber-950/50 text-amber-200 border border-amber-500/40 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/50 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-amber-300'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-amber-400" />
              <span>Natal Chart Wheel</span>
            </button>

            {/* Enochian Sanctum Tab Toggle Button */}
            <button
              onClick={() => selectTab("enochian")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] relative overflow-hidden group ${
                activeTab === "enochian"
                  ? 'bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-purple-950/80 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-950/50 font-bold ring-1 ring-amber-400/50'
                  : 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/20 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <Pyramid className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="font-semibold tracking-wide">Enochian Sanctum</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full">1st Key</span>
            </button>

            {/* Scriptura Search Tab Toggle Button */}
            <button
              onClick={() => selectTab("scriptura")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[130px] ${
                activeTab === "scriptura"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scriptura Search</span>
            </button>

            {/* Aetheric Sigil Tab Toggle Button */}
            <button
              onClick={() => selectTab("sigil")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[135px] ${
                activeTab === "sigil"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Sigil Sanctum</span>
            </button>

            {/* Jerry's Scholarship Tab Toggle Button */}
            <button
              onClick={() => selectTab("scholarship")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "scholarship"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Salazar Scholarship</span>
            </button>

            {/* The Office of The Divine Order Tab Toggle Button */}
            <button
              onClick={() => selectTab("divine-order")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[215px] relative overflow-hidden group ${
                activeTab === "divine-order"
                  ? 'bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-purple-950/80 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-950/50 font-bold ring-1 ring-amber-400/50'
                  : 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/20 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="font-semibold tracking-wide">Office of Divine Order</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full">
                Sacred Seal
              </span>
            </button>

            {/* The Office of Wisdom - Master Architect of God Tab Toggle Button */}
            <button
              onClick={() => selectTab("wisdom-architect")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[220px] relative overflow-hidden group ${
                activeTab === "wisdom-architect"
                  ? 'bg-gradient-to-r from-amber-950/80 via-yellow-900/60 to-amber-950/80 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-950/50 font-bold ring-1 ring-amber-400/50'
                  : 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/20 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform animate-spin-slow" />
              <span className="font-semibold tracking-wide">Office of Wisdom</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full">
                Master Architect
              </span>
            </button>

            {/* Apocryphal Scholarship Tab Toggle Button */}
            <button
              onClick={() => selectTab("apocryphal")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "apocryphal"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apocryphal Scholarship</span>
            </button>

            {/* Dead Sea Scrolls Scholarship Tab Toggle Button */}
            <button
              onClick={() => selectTab("deadsea")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "deadsea"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>Dead Sea Scrolls</span>
            </button>

            {/* Anunnaki Archive Tab Toggle Button */}
            <button
              onClick={() => selectTab("anunnaki")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "anunnaki"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Pyramid className="w-3.5 h-3.5 text-amber-500" />
              <span>Anunnaki Archive</span>
            </button>

            {/* Melchizedekian Priesthood Tab Toggle Button */}
            <button
              onClick={() => selectTab("melchizedek")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[165px] ${
                activeTab === "melchizedek"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Melchizedek Priesthood</span>
            </button>

            {/* Metatronic Scholarship Tab Toggle Button */}
            <button
              onClick={() => selectTab("metatron")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[165px] ${
                activeTab === "metatron"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-violet-400" />
              <span>Metatron Scholarship</span>
            </button>

            {/* Enoch Wisdom Portal Tab Toggle Button */}
            <button
              onClick={() => selectTab("enoch-portal")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[165px] ${
                activeTab === "enoch-portal"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-amber-950/50 text-amber-200 border border-amber-500/40 font-semibold shadow-inner ring-1 ring-amber-500/30'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-amber-400/40'
                    : 'bg-amber-950/50 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-amber-300" />
              <span>Enoch Portal</span>
            </button>

            {/* Extensive Library Tab Toggle Button */}
            <button
              onClick={() => selectTab("extensive-library")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[165px] ${
                activeTab === "extensive-library"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-amber-950/50 text-amber-200 border border-amber-500/40 font-semibold shadow-inner ring-1 ring-amber-500/30'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-amber-400/40'
                    : 'bg-amber-950/50 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Extensive Library</span>
            </button>

            {/* Tradition Forge Tab Toggle Button */}
            <button
              onClick={() => selectTab("tradition-forge")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[165px] ${
                activeTab === "tradition-forge"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-amber-950/40 text-amber-200 border border-amber-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Pyramid className="w-3.5 h-3.5 text-amber-400" />
              <span>Tradition Forge</span>
            </button>

            {/* Tarot Readings Tab Toggle Button */}
            <button
              onClick={() => selectTab("tarot")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "tarot"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-500/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tarot Divination</span>
            </button>

            {/* Classroom Sanctum Tab Toggle Button */}
            <button
              onClick={() => selectTab("classroom")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "classroom"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Classroom Sanctum</span>
            </button>

            {/* Temporal Nexus Tab Toggle Button */}
            <button
              onClick={() => selectTab("nexus")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "nexus"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-slate-355'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Temporal Nexus</span>
            </button>

            <button
              onClick={() => selectTab("intelligence")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[175px] ${
                activeTab === "intelligence"
                  ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-400/60 shadow-lg shadow-cyan-500/10 font-semibold'
                  : 'text-slate-500 hover:text-cyan-300'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>High-IQ Search Engines</span>
            </button>

            {/* Holy Bible Portal Tab Toggle Button */}
            <button
              onClick={() => selectTab("bible")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "bible"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/35'
                  : 'text-slate-500 hover:text-amber-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Holy Bible</span>
            </button>

            {/* Holy Quran Portal Tab Toggle Button */}
            <button
              onClick={() => selectTab("quran")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[155px] ${
                activeTab === "quran"
                  ? activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/40 text-violet-200 border border-violet-500/30 font-semibold shadow-inner'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                    : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/35'
                  : 'text-slate-500 hover:text-emerald-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Holy Quran</span>
            </button>

            {/* Kingdom Military Base of Operations & ASFFU Supreme Fighting Force Tab Toggle Button */}
            <button
              onClick={() => selectTab("military-base")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[195px] relative overflow-hidden group ${
                activeTab === "military-base"
                  ? 'bg-red-950/60 text-red-200 border border-red-500/70 shadow-lg shadow-red-950/40 font-semibold ring-1 ring-red-500/40'
                  : 'text-slate-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-500/30'
              }`}
            >
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="font-semibold tracking-wide">Military Base & ASFFU</span>
            </button>

            {/* Kingdom Geodesic GPS Positioning System Tab Toggle Button */}
            <button
              onClick={() => selectTab("gps")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[175px] relative overflow-hidden group ${
                activeTab === "gps"
                  ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-400/70 shadow-lg shadow-cyan-950/40 font-semibold ring-1 ring-cyan-400/40'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/20 border border-transparent hover:border-cyan-500/30'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="font-semibold tracking-wide">GPS Positioning</span>
            </button>

            {/* Manifestation Portal & Transmutation Laboratory Tab Toggle Button */}
            <button
              onClick={() => selectTab("manifestation")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[195px] relative overflow-hidden group ${
                activeTab === "manifestation"
                  ? 'bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-emerald-950/80 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-950/50 font-bold ring-1 ring-amber-400/50'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/20 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="tracking-wide">Manifestation Lab</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full">Alchemical</span>
            </button>

            {/* Secure Admin Dashboard Tab Toggle Button */}
            <button
              onClick={() => selectTab("admin")}
              className={`flex-1 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 font-medium min-w-[175px] relative overflow-hidden group ${
                activeTab === "admin"
                  ? 'bg-amber-500 text-black border border-amber-400 shadow-lg shadow-amber-500/30 font-bold ring-1 ring-amber-300'
                  : 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/30 hover:border-amber-500/60'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "admin" ? "text-black" : "text-amber-400"} group-hover:scale-110 transition-transform`} />
              <span className="tracking-wide">Admin Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>
          </div>

        {/* Theme Palette Multi-Select & Chronicles Side-by-side Layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 w-full">
          {/* Theme Selector Palette Toggle */}
          <div className="flex items-center gap-1 bg-black/40 p-1 border border-white/5 rounded-xl text-xs font-serif shadow-inner">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-serif flex items-center gap-1.5 font-medium ${
                  activeTheme.id === t.id
                    ? t.id === 'deep-void'
                      ? 'bg-[#c084fc]/15 text-purple-200 border border-purple-500/30 shadow-md shadow-purple-950/40'
                      : t.id === 'ethereal-silver'
                      ? 'bg-slate-900/40 text-slate-200 border border-slate-400/30'
                      : 'bg-amber-950/40 text-amber-200 border border-amber-500/30'
                    : 'text-slate-500 hover:text-slate-330 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  t.id === 'deep-void' ? 'bg-[#c084fc]' : t.id === 'ethereal-silver' ? 'bg-[#cbd5e1]' : 'bg-[#D4AF37]'
                }`} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Chronicles Sidebar Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-serif flex items-center gap-2 text-xs font-medium border shadow-sm ${
              activeTheme.id === 'deep-void'
                ? 'bg-violet-950/20 hover:bg-violet-950/40 border-violet-500/30 text-purple-200 hover:border-violet-400/50'
                : activeTheme.id === 'ethereal-silver'
                ? 'bg-slate-900/30 hover:bg-slate-900/55 border-slate-500/30 text-slate-200 hover:border-slate-400/50'
                : 'bg-amber-950/30 hover:bg-amber-950/55 border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Consultation Chronicles</span>
            {pastInquiries.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-bold leading-normal flex items-center justify-center ${
                activeTheme.id === 'deep-void' ? 'bg-[#c084fc] text-black' : activeTheme.id === 'ethereal-silver' ? 'bg-[#cbd5e1] text-black' : 'bg-[#D4AF37] text-black'
              }`}>
                {pastInquiries.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Row layout: Heptagram Star left, Form right */}
      <AnimatePresence mode="wait">
        <Suspense fallback={<TabSuspenseFallback />}>
        {activeTab === "oracle" ? (
          <motion.div
            key="oracle-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl flex flex-col items-center justify-start gap-8"
          >
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        
        {/* Left Aspect: Heptagram Geometry rendering */}
        <div className={`w-full max-w-xl lg:max-w-[48%] aspect-square relative shadow-2xl rounded-2xl overflow-hidden ${activeTheme.bgCard || 'bg-[#121214]'} border border-white/5 flex items-center justify-center shrink-0 transition-all duration-700`}>
          
          {/* Floating Actions */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setShowAiRevelation(!showAiRevelation)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer font-serif text-xs font-semibold flex items-center gap-1.5 shadow-lg ${
                activeTheme.id === 'deep-void'
                  ? 'bg-[#0d091a]/80 hover:bg-violet-950 border-purple-500/35 text-violet-200'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'bg-[#151c24]/80 hover:bg-slate-900 border-slate-500/35 text-slate-200'
                  : 'bg-[#141416]/80 hover:bg-amber-950 border-[#D4AF37]/35 text-amber-200'
              }`}
              title="Reveal AI High-Fidelity Alchemical Manuscript Illustration"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{showAiRevelation ? "View SVG" : "AI Revelation"}</span>
            </button>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer font-serif text-xs font-semibold flex items-center gap-1.5 shadow-lg ${
                activeTheme.id === 'deep-void'
                  ? 'bg-[#0d091a]/80 hover:bg-violet-950 border-purple-500/35 text-violet-200'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'bg-[#151c24]/80 hover:bg-slate-900 border-slate-500/35 text-slate-200'
                  : 'bg-[#141416]/80 hover:bg-amber-950 border-[#D4AF37]/35 text-amber-200'
              }`}
              title="Explicate Sacred Cryptography (Scholarship)"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{showExplanation ? "View Talisman" : "Symbol Key"}</span>
            </button>
            
            <button
              onClick={downloadSymbolSVG}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer font-serif text-xs font-semibold flex items-center gap-1.5 shadow-lg ${
                activeTheme.id === 'deep-void'
                  ? 'bg-[#0d091a]/80 hover:bg-violet-950 border-purple-500/35 text-violet-200'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'bg-[#151c24]/80 hover:bg-slate-900 border-slate-500/35 text-slate-200'
                  : 'bg-[#141416]/80 hover:bg-amber-950 border-[#D4AF37]/35 text-amber-200'
              }`}
              title="Download Pristine Vector Symbol (SVG)"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Save SVG</span>
            </button>
          </div>

          {/* Explanation Overlay */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-5 p-6 md:p-8 backdrop-blur-xl bg-black/95 flex flex-col justify-start overflow-y-auto"
              >
                <div className={`border-b ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]/20' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/20' : 'border-[#D4AF37]/20'} pb-3 mb-4 mt-12`}>
                  <h3 className={`text-xl font-serif font-bold tracking-widest ${activeTheme.textPrimary} flex items-center gap-2`}>
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> SACRED HEPTAGRAM MATRIX
                  </h3>
                  <p className="text-[11px] text-slate-400 font-serif italic mt-0.5">
                    Traditional Kabbalistic Gematria & Wavelength Winding Correspondence Schema
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif leading-relaxed text-slate-300">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>אֲפוֹקָלִיפְסָה & אֲפוֹקְרִיפוֹן (Polar Summits)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">The high poles of manifestation: Apocalypse (Revelation/The Open Book) above Apocryphon (Secret Doctrines/The Sealed Vault).</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>יהוה & לוּצִיפֶר (The Spark and the Fire)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Yahweh at the absolute apex representing the infinite Divine Light. Lucifer at the coordinate base representing the Lightbearer, early dawn or intellect.</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>ע"ו (Central Synthesis: Gematria 76)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Ayin-Vav (76) at the exact core center of the 7-pointed star. Merges divine active wisdom with physical boundaries.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>י & ב (West & East Latitudes)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Yod (י) at 9 o'clock represents the initial seed point of absolute projection. Bet (ב) at 3 o'clock represents the house, the vessel, active duality.</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>אֲבַדּוֹן & כָּבוֹד (Left Pillar Horizon)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Abaddon (The Deep Abyss/Destruction) paired under Kavod (The Divine Glory), bounding the left margin of cosmic consciousness.</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${activeTheme.textPrimary}`}>חַיִּים לְאַחַר הַמָּוֶת & גְּבוּרָה (Right Sovereign Border)</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Life After Death (Eternal Continuity) alongside Gevurah (Sovereign Power and Order), establishing the right bounds.</p>
                    </div>
                  </div>
                </div>

                <div className={`mt-auto pt-4 border-t ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]/10' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/10' : 'border-[#D4AF37]/10'} text-[10px] text-slate-500 italic`}>
                  * This sacred matrix achieves clean impedance balance by translating all labels to authentic vowel-pointed Hebrew calligraphic representations.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showAiRevelation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-4 sm:p-6 flex flex-col items-center justify-between relative bg-[#120f09]/60 z-4 overflow-y-auto"
            >
              {/* Artifact Selector Bar */}
              <div className="flex items-center gap-1.5 p-1 bg-black/80 rounded-xl border border-[#D4AF37]/30 backdrop-blur-md mb-2 z-30">
                <button
                  onClick={() => setAppRevelationArtifact('sigil-zion')}
                  className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                    appRevelationArtifact === 'sigil-zion'
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sigil Zion Scroll
                </button>
                <button
                  onClick={() => setAppRevelationArtifact('statue')}
                  className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                    appRevelationArtifact === 'statue'
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sovereign Statue
                </button>
                <button
                  onClick={() => setAppRevelationArtifact('apocalypse-dragon')}
                  className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                    appRevelationArtifact === 'apocalypse-dragon'
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Apocalypse & Dragon
                </button>
                <button
                  onClick={() => setAppRevelationArtifact('heptagram')}
                  className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                    appRevelationArtifact === 'heptagram'
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Heptagram Plate
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center relative w-full min-h-0">
                <img
                  src={
                    appRevelationArtifact === 'sigil-zion'
                      ? '/src/assets/images/sigil_zion_scroll_1787882369642.jpg'
                      : appRevelationArtifact === 'statue'
                      ? '/src/assets/images/sovereign_statue_1787882358357.jpg'
                      : appRevelationArtifact === 'apocalypse-dragon'
                      ? '/src/assets/images/apocalypse_dragon_relic_1787884366805.jpg'
                      : '/src/assets/images/heptagram_mystic_1786029297477.jpg'
                  }
                  alt={
                    appRevelationArtifact === 'sigil-zion'
                      ? 'Sigil Zion Mount of the LORD'
                      : appRevelationArtifact === 'statue'
                      ? 'Sovereign Bronze Monument of Jerry Ben Salazar'
                      : appRevelationArtifact === 'apocalypse-dragon'
                      ? 'The Sovereign Apocalypse & The Great Red Dragon of Revelation'
                      : 'Heptagram Alchemical Revelation'
                  }
                  referrerPolicy="no-referrer"
                  className="max-w-[85%] max-h-[70vh] object-contain rounded-xl border border-[#D4AF37]/30 shadow-2xl transition-transform hover:scale-105 duration-700"
                />
              </div>

              <div className="mt-3 bg-black/90 border border-[#D4AF37]/25 p-3 rounded-xl text-center max-w-[90%] backdrop-blur-md">
                <p className="text-[11px] text-[#D4AF37] font-serif font-bold tracking-widest uppercase">
                  {appRevelationArtifact === 'sigil-zion' && 'CODEX SIGIL ZION 76 — MOUNT OF THE LORD MANUSCRIPT'}
                  {appRevelationArtifact === 'statue' && 'SOVEREIGN BRONZE MONUMENT OF JERRY BEN SALAZAR'}
                  {appRevelationArtifact === 'apocalypse-dragon' && 'THE SOVEREIGN APOCALYPSE & THE GREAT RED DRAGON OF REVELATION'}
                  {appRevelationArtifact === 'heptagram' && 'HEPTAGRAM ALCHEMICAL REVELATION (7/3 SACRED GEOMETRY)'}
                </p>
                <p className="text-[9px] text-slate-400 font-serif leading-relaxed mt-0.5">
                  {appRevelationArtifact === 'sigil-zion' && 'Ancient parchment recording the decree of Mount Zion and the 76 Logos proclaimed by the Sovereign Architect.'}
                  {appRevelationArtifact === 'statue' && 'Heroic monument in solemn contemplation with 112" coaxial tuning rod and the celestial seal.'}
                  {appRevelationArtifact === 'apocalypse-dragon' && 'Sacred portrait of Jerry Ben Salazar before the Crimson Seraph of Revelation (Conquered Leviathan) with the chest inscription APOCALYPSE.'}
                  {appRevelationArtifact === 'heptagram' && 'An authentic ancient engraving of the 7-point star within a circle of 12 sacred flames, featuring inscribed sacred Hebrew characters, YAHWEH, and Lucifer.'}
                </p>
              </div>
            </motion.div>
          ) : (
            <InteractiveHeptagram 
              activeTheme={activeTheme} 
              circleRadius={circleRadius} 
              starPoints={starPoints} 
              flamePositions={flamePositions} 
              isSpeaking={isSpeaking}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Real-time Web Audio WebGL/2D Particle Visualizer Overlay */}
          <AudioVisualizer isSpeaking={isSpeaking} soundEnabled={soundEnabled} activeTheme={activeTheme} />
        </div>

        {/* Right Aspect: Oracle Interactive Form console */}
        <div className={`w-full max-w-xl lg:max-w-[48%] ${activeTheme.bgCard || 'bg-[#141416]'} border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 transition-all duration-700`}>
          <div className="oracle-portal-header flex flex-col gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-serif ${activeTheme.textPrimary} flex items-center gap-2`}>
                <Sparkles className={`w-6 h-6 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Consult the Oracle
              </h2>
              <button
                onClick={toggleSound}
                className={`text-slate-400 hover:${activeTheme.textPrimary} transition-colors p-2 rounded-lg hover:bg-white/5 animate-pulse cursor-pointer`}
                title={soundEnabled ? "Mute Oracle" : "Unmute Oracle"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {/* Real-time audio waveform visualizer component reacting to generated speech */}
            <OracleWaveformVisualizer
              isSpeaking={isSpeaking}
              soundEnabled={soundEnabled}
              activeTheme={activeTheme}
            />
          </div>

          {/* Google Intelligence Voice Settings */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Google AI Vocal Channels
              </span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={googleTtsEnabled} 
                  onChange={(e) => {
                    const val = e.target.checked;
                    setGoogleTtsEnabled(val);
                    localStorage.setItem("oracle-google-tts-enabled", String(val));
                  }} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/80 peer-checked:after:bg-white peer-checked:after:border-white"></div>
              </label>
            </div>
            
            {googleTtsEnabled && (
              <div className="grid grid-cols-2 gap-3 items-center animate-fadeIn">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-serif">Celestial Voice:</span>
                  <select
                    value={googleVoiceName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setGoogleVoiceName(name);
                      localStorage.setItem("oracle-google-voice-name", name);
                    }}
                    className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer font-serif"
                  >
                    <option value="Zephyr" className="bg-[#141416] text-white">Zephyr (Cosmic)</option>
                    <option value="Charon" className="bg-[#141416] text-white">Charon (Ancient)</option>
                    <option value="Kore" className="bg-[#141416] text-white">Kore (Serene)</option>
                    <option value="Puck" className="bg-[#141416] text-white">Puck (Spirited)</option>
                    <option value="Fenrir" className="bg-[#141416] text-white">Fenrir (Bold)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-[10px] text-slate-500 leading-tight">
                  {isTtsGenerating ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Channelling vocals...
                    </span>
                  ) : (
                    <span>Generates custom voice synthesis with Google's preview model.</span>
                  )}
                </div>
              </div>
            )}

            {/* Auto-Read Chatbot Response Toggle Switch */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-xs font-serif text-slate-200 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Auto-Read Chatbot Responses
                </span>
                <span className="text-[10px] text-slate-400">
                  Automatically speaks new Gemini Oracle responses hands-free
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={autoTtsChatbotEnabled} 
                  onChange={(e) => {
                    const val = e.target.checked;
                    setAutoTtsChatbotEnabled(val);
                    localStorage.setItem("oracle-auto-tts-chatbot-enabled", String(val));
                  }} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/80 peer-checked:after:bg-white peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
          
          <form onSubmit={handleSeek} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="school" className="text-sm text-slate-400 font-serif">Select Tradition:</label>
                <div className="relative">
                  <select 
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className={`w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-slate-300 focus:outline-none ${activeTheme.id === 'deep-void' ? 'focus:border-violet-400 focus:ring-violet-400/50' : activeTheme.id === 'ethereal-silver' ? 'focus:border-slate-300 focus:ring-slate-300/50' : 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50'} focus:ring-1 transition-all cursor-pointer font-serif appearance-none`}
                  >
                    {schools.map(s => <option key={s} value={s} className="bg-[#141416] text-white">{s}</option>)}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${activeTheme.textPrimary}`}>
                    ▼
                  </div>
                </div>
              </div>

              {/* Custom Zodiac Sign Dropdown Component overriding auto-calculated date-based sign */}
              <ZodiacSignDropdown
                mode={zodiacMode}
                onModeChange={(newMode) => {
                  setZodiacMode(newMode);
                  localStorage.setItem("oracle-zodiac-mode", newMode);
                  if (newMode === "manual" && !manualZodiacSign) {
                    const fallbackSign = autoZodiacSign || "Aries";
                    setManualZodiacSign(fallbackSign);
                    localStorage.setItem("oracle-manual-zodiac-sign", fallbackSign);
                  }
                }}
                manualSign={manualZodiacSign}
                autoSign={autoZodiacSign}
                birthDate={birthDate}
                activeTheme={activeTheme}
                onSelectSign={(sign) => {
                  setManualZodiacSign(sign);
                  if (sign) {
                    localStorage.setItem("oracle-manual-zodiac-sign", sign);
                  } else {
                    localStorage.removeItem("oracle-manual-zodiac-sign");
                  }
                }}
                onClearOverride={() => {
                  setZodiacMode("auto");
                  localStorage.setItem("oracle-zodiac-mode", "auto");
                }}
              />
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="question" className="text-sm text-slate-400 font-serif">Your Inquiry:</label>
                  <div className="flex items-center gap-2">
                    {commandFeedback && (
                      <span className="text-[10px] text-emerald-400 font-serif font-semibold animate-pulse border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">
                        ✨ Voice Command: {commandFeedback}
                      </span>
                    )}
                    {speechError && (
                      <span className="text-[10px] text-red-400 font-serif animate-pulse">
                        {speechError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <textarea 
                    id="question"
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Inscribe what seeks the seeker..." 
                    rows={3}
                    className={`w-full bg-black/50 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-slate-200 placeholder-slate-600 focus:outline-none ${activeTheme.id === 'deep-void' ? 'focus:border-violet-400 focus:ring-violet-400/50' : activeTheme.id === 'ethereal-silver' ? 'focus:border-slate-300 focus:ring-slate-300/50' : 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/50'} focus:ring-1 transition-all font-serif resize-none`}
                    autoComplete="off"
                  />
                  <motion.button
                    type="button"
                    onClick={toggleListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute right-3 bottom-4 p-2 rounded-full cursor-pointer transition-all duration-300 border flex items-center justify-center ${
                      isListening
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : activeTheme.id === 'deep-void'
                        ? 'bg-violet-950/40 hover:bg-violet-950/80 border-violet-500/20 hover:border-violet-400/50 text-purple-300'
                        : activeTheme.id === 'ethereal-silver'
                        ? 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-500/20 hover:border-slate-400/50 text-slate-300'
                        : 'bg-amber-950/40 hover:bg-amber-950/80 border-amber-500/20 hover:border-amber-400/50 text-amber-200'
                    }`}
                    title={isListening ? "Listening... click to silence" : "Dictate inquiry via microphone"}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-400" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isListening && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-[102%] z-50 w-64 p-3 bg-zinc-950/95 border border-zinc-800 rounded-lg shadow-xl"
                      >
                        <p className="text-[11px] font-sans font-bold text-amber-300 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>Aetheric Voice Commands:</span>
                        </p>
                        <ul className="text-[10px] font-mono text-slate-400 list-disc list-inside space-y-0.5 leading-tight">
                          <li>"Save Note" (Inscribe Journal)</li>
                          <li>"Clear Consultation" (Reset Inquiry)</li>
                          <li>"Export Chronicles" (Download TXT)</li>
                          <li>"Seek Randomly" (Random Query)</li>
                          <li>"Toggle Sound" (Mute / Unmute)</li>
                          <li>"Show Oracle" / "Show Scriptura"</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showSuggestions && filteredInvocations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-[102%] z-50 bg-[#0c0c0e]/98 border border-white/10 rounded-lg shadow-2xl p-2.5 max-h-48 overflow-y-auto backdrop-blur-md flex flex-col gap-1 text-left"
                      >
                        <div className="flex items-center justify-between px-2 py-1 border-b border-white/5 mb-1 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                            Predictive Invocations ({school})
                          </span>
                          <span>Select to complete</span>
                        </div>
                        {filteredInvocations.map((phrase, idx) => (
                          <button
                            key={`invoc-${phrase}-${idx}`}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setQuestion(phrase);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-2.5 py-2 rounded text-xs text-slate-300 font-serif hover:bg-white/5 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${activeTheme.id === 'deep-void' ? 'bg-violet-400' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-300' : 'bg-amber-500'}`} />
                            <span className="truncate">{phrase}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Quick Invocations chip array */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 self-center uppercase tracking-wide font-mono mr-1">Quick Invocations:</span>
                  {[
                    "What is my alchemical shadow?",
                    "How can I align with the aetheric current?",
                    "What does the cosmic oracle say of my destiny?",
                    "Reveal the harmony of our spirits.",
                    "What hidden truth lies in the void?"
                  ].map((tpl, idx) => (
                    <button
                      key={`tpl-${idx}`}
                      type="button"
                      onClick={() => setQuestion(tpl)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border bg-black/40 ${
                        activeTheme.id === 'deep-void' 
                          ? 'border-violet-500/20 text-violet-400 hover:border-violet-400/50 hover:bg-violet-950/20' 
                          : activeTheme.id === 'ethereal-silver' 
                          ? 'border-slate-500/20 text-slate-400 hover:border-slate-400/50 hover:bg-slate-900/20' 
                          : 'border-amber-500/20 text-amber-500/80 hover:border-amber-500/50 hover:bg-amber-950/20'
                      } transition-all text-left font-serif cursor-pointer`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button" 
                  onClick={handleSeekRandomly}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 bg-[#1a1a1c] ${activeTheme.textPrimary} border ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]/30 hover:border-[#c084fc]/60' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/30 hover:border-slate-400/60' : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60'} font-semibold px-6 py-4 rounded-lg hover:bg-[#202023] disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  <Shuffle className="w-5 h-5 animate-spin-slow" />
                  <span className="font-serif">Seek Randomly</span>
                </button>
                
                {loading ? (
                  <button 
                    type="button" 
                    onClick={cancelQuery}
                    className="flex-[2] flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 font-semibold px-6 py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] cursor-pointer"
                    title="Cancel current query"
                  >
                    <X className="w-5 h-5 animate-pulse text-red-400" />
                    <span className="font-serif">Cancel Inquiry</span>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={!question.trim()}
                    className={`flex-[2] flex items-center justify-center gap-2 bg-gradient-to-br ${activeTheme.accentGradient} text-black font-semibold px-6 py-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      activeTheme.id === 'deep-void'
                        ? 'shadow-[0_0_20px_rgba(192,132,252,0.2)] hover:shadow-[0_0_30px_rgba(192,132,252,0.4)]'
                        : activeTheme.id === 'ethereal-silver'
                        ? 'shadow-[0_0_20px_rgba(203,213,225,0.15)] hover:shadow-[0_0_30px_rgba(203,213,225,0.35)]'
                        : 'shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-serif">Query Oracle</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Key Insights Summary Card */}
          <KeyInsightsCard
            pastInquiries={pastInquiries}
            zodiacSign={zodiacSign}
            birthDate={birthDate}
            onUpdateBirthDate={setBirthDate}
            activeTheme={activeTheme}
          />

          {/* Oracle Response Area */}
          <AnimatePresence>
            {answer && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 w-full max-h-[75vh] overflow-y-auto"
              >
                <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-6 text-left relative">
                  <div className="absolute top-0 left-0 w-full h-1 opacity-40" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeTheme.textAccentHex}, transparent)` }}></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Narrative Response */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      {/* Oracle Consultation Response Header & Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Sparkles className={`w-4 h-4 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-400'}`} />
                          <span className="text-xs font-serif font-semibold uppercase tracking-wider text-slate-200">
                            Oracle Revelation
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSocialShare("Oracle Revelation", cleanAnswerMarkdown(answer))}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border shadow-sm bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border-sky-500/40 text-sky-200"
                            title="Share Revelation to Social Networks (X, Facebook, Reddit, WhatsApp, Telegram, Threads, etc.)"
                          >
                            <Share2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Share Social</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareTwitter()}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border shadow-sm bg-sky-950/40 border-sky-500/30 text-sky-300 hover:bg-sky-900/60 hover:border-sky-400"
                            title="Share user inquiry and link to current Oracle instance on Twitter / X"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-sky-400 shrink-0" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Twitter</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyAnswer(cleanAnswerMarkdown(answer))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border shadow-sm ${
                              copiedAnswer 
                                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-emerald-900/30' 
                                : activeTheme.id === 'deep-void'
                                ? 'bg-violet-950/50 border-violet-500/30 text-violet-200 hover:bg-violet-900/60 hover:border-violet-400'
                                : activeTheme.id === 'ethereal-silver'
                                ? 'bg-slate-900/60 border-slate-600/50 text-slate-200 hover:bg-slate-800/80 hover:border-slate-400'
                                : 'bg-amber-950/50 border-amber-500/30 text-amber-200 hover:bg-amber-900/60 hover:border-amber-400'
                            }`}
                            title="Copy generated Oracle revelation text to clipboard"
                          >
                            {copiedAnswer ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied Revelation!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {aethericFallback && (
                        <div className="bg-amber-500/5 border border-amber-500/20 text-amber-300 rounded-xl p-4 flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1 text-left">
                            <h5 className="text-xs font-serif font-semibold tracking-wider uppercase text-amber-400">
                              Aetheric Failsafe Mode Active
                            </h5>
                            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                              Celestial remote transmission channels are currently at limit capacity (API Quota Limit Met). Your query was successfully resolved via the local offline primary mystical wisdom engine.
                            </p>
                          </div>
                        </div>
                      )}
                      <div className={`prose prose-invert prose-p:font-serif prose-p:leading-relaxed prose-p:text-slate-300 prose-headings:font-serif ${activeTheme.id === 'deep-void' ? 'prose-headings:text-[#c084fc] prose-strong:text-[#d8b4fe]' : activeTheme.id === 'ethereal-silver' ? 'prose-headings:text-[#cbd5e1] prose-strong:text-[#f1f5f9]' : 'prose-headings:text-[#D4AF37] prose-strong:text-[#FFECA1]'} prose-li:text-slate-300 max-w-none`}>
                        <TypewriterMarkdown content={cleanAnswerMarkdown(answer)} />
                      </div>

                      {/* Bottom Quick Share to Social Networks Bar */}
                      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] font-mono text-slate-500 italic">
                          Broadcast this revelation across social networks
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSocialShare("Oracle Revelation", cleanAnswerMarkdown(answer))}
                            className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-500/30 font-mono text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                            title="Share to X, Facebook, Reddit, WhatsApp, Telegram, Threads, etc."
                          >
                            <Share2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>Share Social</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareTwitter()}
                            className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/80 text-sky-300 border border-sky-500/20 font-mono text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Share to Twitter / X"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-sky-400 shrink-0" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Twitter</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mystical Balance Gauge */}
                    {(() => {
                      const highestElement = !mysticalMetrics || mysticalMetrics.length === 0 ? null : (() => {
                        let maxMetric = mysticalMetrics[0];
                        for (let i = 1; i < mysticalMetrics.length; i++) {
                          if (mysticalMetrics[i].value > maxMetric.value) {
                            maxMetric = mysticalMetrics[i];
                          }
                        }
                        return maxMetric;
                      })();

                      const glowColors: Record<string, string> = {
                        Spiritus: 'rgba(212, 175, 55, 0.45)',
                        Ignis: 'rgba(239, 68, 68, 0.45)',
                        Aqua: 'rgba(59, 130, 246, 0.45)',
                        Aer: 'rgba(56, 189, 248, 0.45)',
                        Materia: 'rgba(16, 185, 129, 0.45)'
                      };

                      const glowColor = highestElement ? (glowColors[highestElement.subject] || 'rgba(212, 175, 55, 0.45)') : 'rgba(212, 175, 55, 0.45)';

                      // Calculate Element Resonance
                      const getResonance = () => {
                        if (!zodiacSign || !highestElement) return null;
                        
                        const domSubject = highestElement.subject; // e.g., 'Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'
                        const sign = zodiacSign; // e.g., 'Aries'
                        
                        // Map zodiac signs to elements
                        const fire = ["Aries", "Leo", "Sagittarius"];
                        const earth = ["Taurus", "Virgo", "Capricorn"];
                        const air = ["Gemini", "Libra", "Aquarius"];
                        const water = ["Cancer", "Scorpio", "Pisces"];
                        
                        let zodiacElement = "";
                        let zodiacElementSymbol = "";
                        if (fire.includes(sign)) {
                          zodiacElement = "Ignis";
                          zodiacElementSymbol = "🔥 Fire";
                        } else if (earth.includes(sign)) {
                          zodiacElement = "Materia";
                          zodiacElementSymbol = "🪨 Earth";
                        } else if (air.includes(sign)) {
                          zodiacElement = "Aer";
                          zodiacElementSymbol = "💨 Air";
                        } else if (water.includes(sign)) {
                          zodiacElement = "Aqua";
                          zodiacElementSymbol = "💧 Water";
                        }
                        
                        // Element names mapping for display
                        const elementDisplayNames: Record<string, string> = {
                          Spiritus: "✨ Spiritus",
                          Ignis: "🔥 Ignis",
                          Aqua: "💧 Aqua",
                          Aer: "💨 Aer",
                          Materia: "🪨 Materia"
                        };

                        const domElementName = elementDisplayNames[domSubject] || domSubject;
                        
                        // Harmony, Tension, Neutral states
                        let type: 'harmony' | 'tension' | 'neutral' = 'neutral';
                        let score = 50; // 0 to 100
                        let message = "";
                        
                        if (domSubject === "Spiritus") {
                          type = "harmony";
                          score = 95;
                          message = `Divine alignment. The transcendental force of Spiritus elevates your native ${zodiacElementSymbol} aspect of ${sign}, filling your spiritual pathways with pure etheric guidance.`;
                        } else if (domSubject === zodiacElement) {
                          type = "harmony";
                          score = 100;
                          message = `Perfect elemental resonance! The dominant force in your gauge is ${domElementName}, which matches your zodiacal ${zodiacElementSymbol} element of ${sign}. This alignment supercharges your natural qualities and instincts.`;
                        } else {
                          // Check pairings
                          const combo = `${zodiacElement}-${domSubject}`;
                          switch (combo) {
                            // Ignis (Fire Zodiac) pairings
                            case "Ignis-Aer":
                              type = "harmony";
                              score = 85;
                              message = `Excellent kindling. The dominant force of Aer (Air) fuels your fiery nature, inspiring brilliant intellectual sparks and catalytic drive.`;
                              break;
                            case "Ignis-Aqua":
                              type = "tension";
                              score = 30;
                              message = `Steaming friction. The dominant force of Aqua (Water) threatens to quench your passionate zodiacal Fire, creating deep emotional tension or evaporation of focus.`;
                              break;
                            case "Ignis-Materia":
                              type = "neutral";
                              score = 60;
                              message = `Smoldering heat. The grounded force of Materia (Earth) channels your energetic zodiacal Fire into structural creation, though it can feel restrictive.`;
                              break;
                              
                            // Materia (Earth Zodiac) pairings
                            case "Materia-Aqua":
                              type = "harmony";
                              score = 90;
                              message = `Fertile union. The dominant force of Aqua (Water) nourishes your grounded earth, washing away rigid barriers and causing practical goals to blossom.`;
                              break;
                            case "Materia-Ignis":
                              type = "tension";
                              score = 35;
                              message = `Molten volcanic pressure. The dominant force of Ignis (Fire) bakes your pragmatic earth, triggering intense creative friction and demanding breakthrough transformations.`;
                              break;
                            case "Materia-Aer":
                              type = "tension";
                              score = 40;
                              message = `Scattered dust. The dominant force of Aer (Air) threatens to disperse your grounded earth, provoking mental restlessness and structure resistance.`;
                              break;
                              
                            // Aer (Air Zodiac) pairings
                            case "Aer-Ignis":
                              type = "harmony";
                              score = 88;
                              message = `Dynamic expansion. The dominant force of Ignis (Fire) ignites your zodiacal Air, creating an energetic draft that translates ideas into rapid action.`;
                              break;
                            case "Aer-Materia":
                              type = "tension";
                              score = 45;
                              message = `Structural confinement. The dominant force of Materia (Earth) restricts your breezy zodiacal Air, demanding physical realism which can feel stifling.`;
                              break;
                            case "Aer-Aqua":
                              type = "tension";
                              score = 50;
                              message = `Atmospheric turbulence. The dominant force of Aqua (Water) creates emotional fog within your rational zodiacal Air, stirring intuitive thoughts and anxiety.`;
                              break;
                              
                            // Aqua (Water Zodiac) pairings
                            case "Aqua-Materia":
                              type = "harmony";
                              score = 92;
                              message = `Estuary stability. The dominant force of Materia (Earth) provides a steady riverbed for your intuitive zodiacal Water, anchoring deep emotions into tangible reality.`;
                              break;
                            case "Aqua-Ignis":
                              type = "tension";
                              score = 25;
                              message = `Subterranean boiling. The dominant force of Ignis (Fire) heats your intuitive zodiacal Water, creating highly volatile energetic currents and emotional outbursts.`;
                              break;
                            case "Aqua-Aer":
                              type = "tension";
                              score = 55;
                              message = `Undulating waves. The dominant force of Aer (Air) whips your deep zodiacal Water into turbulent action, bringing intuitive insights paired with mental storminess.`;
                              break;
                              
                            default:
                              type = "neutral";
                              score = 50;
                              message = `Moderate elemental flow. The dominant force of ${domElementName} combines with your zodiacal ${zodiacElementSymbol} element, sustaining balanced mystical channels.`;
                          }
                        }
                        
                        return { type, score, message, zodiacElementSymbol, domElementName };
                      };

                      const resonance = getResonance();

                      return (
                        <motion.div 
                          key={JSON.stringify(mysticalMetrics)}
                          animate={{
                            boxShadow: [
                              `0 0 4px rgba(255, 255, 255, 0.05)`,
                              `0 0 25px ${glowColor}`,
                              `0 0 4px rgba(255, 255, 255, 0.05)`
                            ],
                            borderColor: [
                              `rgba(255, 255, 255, 0.05)`,
                              highestElement ? glowColor : `rgba(255, 255, 255, 0.2)`,
                              `rgba(255, 255, 255, 0.05)`
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#111113]/55 border rounded-xl shadow-inner min-h-[340px] transition-all duration-500"
                        >
                          <div className={`text-[10px] tracking-[0.2em] font-mono ${activeTheme.id === 'deep-void' ? 'text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'} font-semibold mb-2 uppercase text-center w-full block border-b border-white/5 pb-1.5 flex flex-wrap items-center justify-between gap-1.5 px-1`}>
                            <div className="flex items-center gap-1.5">
                              <Flame className={`w-3 h-3 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-orange-500'} animate-pulse`} />
                              <span>Energy Alignment Gauge {highestElement && !showTrendAnalysis && `(Dominant: ${highestElement.subject})`}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setShowTrendAnalysis(!showTrendAnalysis)}
                                className={`text-[9px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                                  showTrendAnalysis
                                    ? 'bg-amber-500/25 text-amber-200 border-amber-500/60 font-bold shadow-sm'
                                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                                }`}
                                title="Toggle longitudinal 5-consultation trend analysis"
                              >
                                <TrendingUp className="w-2.5 h-2.5 text-amber-400" />
                                <span>Trend Analysis</span>
                                <span className={`px-1 py-0.2 rounded text-[7.5px] font-bold ${showTrendAnalysis ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'}`}>
                                  {showTrendAnalysis ? 'ON' : 'OFF'}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const views = ['standard', 'spiritus-ignis', 'aqua-aer', 'materia-ignis'] as const;
                                  const nextIdx = (views.indexOf(elementalView) + 1) % views.length;
                                  setElementalView(views[nextIdx]);
                                }}
                                className="text-[9px] hover:text-white transition-colors duration-200 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 hover:bg-white/10 font-sans cursor-pointer font-normal tracking-normal capitalize"
                                title="Cycle between Quintessence, Celestial Flame, Astral Tides, and Telluric Crucible"
                              >
                                <RotateCcw className="w-2.5 h-2.5" /> Cycle Views
                              </button>
                            </div>
                          </div>

                          {/* Trend Analysis Overlay Legend & Visibility Controls */}
                          {showTrendAnalysis && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="w-full mb-3 p-2 rounded-lg bg-black/60 border border-amber-500/30 flex flex-col gap-2 text-left shadow-md"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1">
                                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Longitudinal 5-Consultation Overlay
                                </span>
                                <span className="text-slate-400 text-[8.5px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                  {pastInquiries.length >= 5 ? '5 Real Chronicles' : `${pastInquiries.length} Chronicles + Archive Baselines`}
                                </span>
                              </div>

                              {/* Legend & Visibility Toggles */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                                {trendConsultations.map((c, idx) => {
                                  const isHidden = hiddenTrendIndices.includes(idx);
                                  return (
                                    <button
                                      key={`trend-btn-${c.id}-${idx}`}
                                      type="button"
                                      onClick={() => {
                                        if (isHidden) {
                                          setHiddenTrendIndices(hiddenTrendIndices.filter(i => i !== idx));
                                        } else {
                                          setHiddenTrendIndices([...hiddenTrendIndices, idx]);
                                        }
                                      }}
                                      className={`px-2 py-0.5 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                                        isHidden
                                          ? 'bg-black/40 text-slate-600 border-white/5 line-through opacity-60'
                                          : 'bg-black/80 text-slate-200 border-white/20 hover:border-white/40'
                                      }`}
                                    >
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                                      <span className="font-bold">{c.shortLabel}</span>
                                      <span className="text-slate-400 hidden sm:inline text-[8px] truncate max-w-[80px]">{c.questionSnippet}</span>
                                      {isHidden ? <EyeOff className="w-2.5 h-2.5 text-slate-500 ml-0.5" /> : <Eye className="w-2.5 h-2.5 text-slate-400 ml-0.5" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}

                          {/* Elemental View Mode Switcher */}
                          {!showTrendAnalysis && (
                            <div className="w-full grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1 px-1 py-1 bg-black/40 border border-white/5 rounded-lg mb-2.5">
                              <button
                                type="button"
                                onClick={() => setElementalView('standard')}
                                className={`flex-1 py-1 px-1.5 rounded font-mono text-[8px] uppercase tracking-wider text-center transition-all duration-300 cursor-pointer ${
                                  elementalView === 'standard'
                                    ? activeTheme.id === 'deep-void'
                                      ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30 font-bold'
                                      : activeTheme.id === 'ethereal-silver'
                                      ? 'bg-slate-800/60 text-slate-200 border border-slate-600/40 font-bold'
                                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold'
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                              >
                                Quintessence
                              </button>
                              <button
                                type="button"
                                onClick={() => setElementalView('spiritus-ignis')}
                                className={`flex-1 py-1 px-1.5 rounded font-mono text-[8px] uppercase tracking-wider text-center transition-all duration-300 cursor-pointer ${
                                  elementalView === 'spiritus-ignis'
                                    ? activeTheme.id === 'deep-void'
                                      ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30 font-bold'
                                      : activeTheme.id === 'ethereal-silver'
                                      ? 'bg-slate-800/60 text-slate-200 border border-slate-600/40 font-bold'
                                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold'
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                              >
                                Celestial Flame
                              </button>
                              <button
                                type="button"
                                onClick={() => setElementalView('aqua-aer')}
                                className={`flex-1 py-1 px-1.5 rounded font-mono text-[8px] uppercase tracking-wider text-center transition-all duration-300 cursor-pointer ${
                                  elementalView === 'aqua-aer'
                                    ? activeTheme.id === 'deep-void'
                                      ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30 font-bold'
                                      : activeTheme.id === 'ethereal-silver'
                                      ? 'bg-slate-800/60 text-slate-200 border border-slate-600/40 font-bold'
                                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold'
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                              >
                                Astral Tides
                              </button>
                              <button
                                type="button"
                                onClick={() => setElementalView('materia-ignis')}
                                className={`flex-1 py-1 px-1.5 rounded font-mono text-[8px] uppercase tracking-wider text-center transition-all duration-300 cursor-pointer ${
                                  elementalView === 'materia-ignis'
                                    ? activeTheme.id === 'deep-void'
                                      ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30 font-bold'
                                      : activeTheme.id === 'ethereal-silver'
                                      ? 'bg-slate-800/60 text-slate-200 border border-slate-600/40 font-bold'
                                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold'
                                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                              >
                                Telluric Crucible
                              </button>
                            </div>
                          )}

                          {/* Detailed Alchemical Study Focus Overlay */}
                          {!showTrendAnalysis && elementalViewDetails && (
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={elementalView}
                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`w-full p-2.5 mb-2.5 rounded-lg border text-[10px] font-mono leading-relaxed flex flex-col gap-1 text-left ${elementalViewDetails.badgeColor} backdrop-blur-sm shadow-md`}
                              >
                                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 animate-spin text-amber-400" /> {elementalViewDetails.title}
                                  </span>
                                  <span className="opacity-90 font-bold tracking-widest">{elementalViewDetails.ratioText}</span>
                                </div>
                                <p className="opacity-75 text-[9px] italic leading-tight">{elementalViewDetails.description}</p>
                                <p className="text-[10px] font-serif font-medium text-slate-100 mt-1.5 leading-relaxed bg-black/25 p-1.5 rounded border border-white/5">
                                  {elementalViewDetails.interpretation}
                                </p>
                              </motion.div>
                            </AnimatePresence>
                          )}
                      
                      <motion.div 
                        key="radar-chart-unified-container"
                        layout
                        className="w-full h-[260px] flex items-center justify-center overflow-hidden"
                      >
                        <Suspense fallback={<div className="w-[310px] h-[240px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-400/50" /></div>}>
                          <ConsultationRadarChart
                            unifiedRadarData={unifiedRadarData}
                            activeTheme={activeTheme}
                            showTrendAnalysis={showTrendAnalysis}
                            trendConsultations={trendConsultations}
                            hiddenTrendIndices={hiddenTrendIndices}
                            highestElement={highestElement}
                            elementalView={elementalView}
                            isTransitioning={isElementalTransitioning}
                          />
                        </Suspense>
                      </motion.div>

                      {showTrendAnalysis && trendEvolutionStats && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full mt-3 p-3 rounded-lg bg-[#141416]/95 border border-amber-500/30 flex flex-col gap-2.5 text-left shadow-xl"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono font-semibold tracking-wider uppercase border-b border-white/10 pb-1.5">
                            <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                              <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Spiritual Evolution Trajectory
                            </span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[9px]">
                              <Sparkles className="w-3 h-3" /> Evolving: {trendEvolutionStats.highestEvolvingElement} ({trendEvolutionStats.highestDiff >= 0 ? `+${trendEvolutionStats.highestDiff}` : trendEvolutionStats.highestDiff})
                            </span>
                          </div>

                          {/* Elemental Deltas Grid */}
                          <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center">
                            {['Spiritus', 'Ignis', 'Aqua', 'Aer', 'Materia'].map(element => {
                              const stat = trendEvolutionStats.deltas[element];
                              const diff = stat?.diff || 0;
                              const isPositive = diff > 0;
                              const isNegative = diff < 0;
                              return (
                                <div key={element} className="p-1.5 bg-black/50 rounded border border-white/5 flex flex-col items-center">
                                  <span className="text-slate-400 text-[8px] uppercase">{element}</span>
                                  <span className="font-bold text-slate-200 mt-0.5">{stat?.latest || 5}</span>
                                  <span className={`text-[8px] font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-500'}`}>
                                    {isPositive ? `+${diff}` : isNegative ? `${diff}` : '±0'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Longitudinal Narrative */}
                          <p className="text-[11px] font-serif text-slate-300 leading-relaxed italic bg-black/40 p-2 rounded border border-white/5">
                            "Across your last five consultations, your spiritual trajectory highlights an expanding resonance in <strong className="text-amber-200 font-sans">{trendEvolutionStats.highestEvolvingElement}</strong>. Your mystical channels demonstrate progressive alignment from initial baseline readings into sustained esoteric equilibrium."
                          </p>

                          {/* Learn More Button & Dynamic Gemini Summary */}
                          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                            {!trendSummaryText ? (
                              <button
                                onClick={handleFetchTrendSummary}
                                disabled={trendSummaryLoading}
                                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 border border-amber-500/40 hover:border-amber-400 text-amber-200 font-serif font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 group"
                              >
                                {trendSummaryLoading ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                                    <span className="font-mono text-[10px] text-amber-300">Synthesizing 5-Consultation Evolution Patterns...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>Learn More: AI Evolution Pattern Summary</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-amber-400/80 group-hover:translate-x-0.5 transition-transform" />
                                  </>
                                )}
                              </button>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-black/60 border border-amber-500/40 rounded-lg p-3 space-y-2.5 shadow-inner"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono border-b border-amber-500/20 pb-1.5">
                                  <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 5-Consultation Evolution Patterns
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={handleFetchTrendSummary}
                                      disabled={trendSummaryLoading}
                                      className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-[10px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 hover:border-amber-500/30"
                                      title="Re-synthesize evolution analysis"
                                    >
                                      <RotateCcw className={`w-3 h-3 text-amber-400 ${trendSummaryLoading ? 'animate-spin' : ''}`} />
                                      <span>Refresh</span>
                                    </button>
                                    <button
                                      onClick={() => setTrendSummaryText(null)}
                                      className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer text-[10px] p-0.5 rounded hover:bg-white/10"
                                      title="Close summary"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-[11px] font-serif text-slate-200 leading-relaxed whitespace-pre-line space-y-2 bg-neutral-900/40 p-2.5 rounded border border-white/5">
                                  {trendSummaryText}
                                </div>

                                <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-400">
                                  <span className="flex items-center gap-1 text-amber-400/80">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                    Gemini AI Trajectory Analysis
                                  </span>
                                  <span>{trendConsultations.length} Consultations Evaluated</span>
                                </div>
                              </motion.div>
                            )}

                            {trendSummaryError && (
                              <div className="text-[10px] font-mono text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded p-1.5 text-center flex items-center justify-center gap-1.5">
                                <AlertCircle className="w-3 h-3 text-rose-400" />
                                <span>{trendSummaryError}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {resonance ? (
                        <div className="w-full mt-3 p-3 rounded-lg bg-[#141416]/90 border border-white/5 flex flex-col gap-2 text-left shadow-lg">
                          <div className="flex items-center justify-between text-[10px] font-mono font-semibold tracking-wider uppercase">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Element Resonance
                            </span>
                            <span className={
                              resonance.type === 'harmony' 
                                ? 'text-emerald-400' 
                                : resonance.type === 'tension' 
                                ? 'text-rose-400' 
                                : 'text-amber-500'
                            }>
                              {resonance.type === 'harmony' ? '✨ Harmony' : resonance.type === 'tension' ? '⚡ Tension' : '☯️ Balanced'} ({resonance.score}%)
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-mono text-slate-400 border-b border-white/5 pb-1.5">
                            <span className="text-slate-600">|</span>
                            <span>Dominant Force: <strong className="text-white">{resonance.domElementName}</strong></span>
                          </div>
                          <p className="text-[11px] font-serif text-slate-300 leading-relaxed italic">
                            {resonance.message}
                          </p>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-serif text-center mt-2 leading-relaxed">
                        </div>
                      )}

                      {/* Qualitative Interpretation of the Radar Chart */}
                      <div className="w-full mt-4 pt-4 border-t border-white/5 flex flex-col items-stretch text-left">
                        <span className={`text-[10px] tracking-[0.15em] font-mono ${activeTheme.id === 'deep-void' ? 'text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'} font-semibold mb-2 uppercase flex items-center gap-1.5`}>
                          <Sparkles className="w-3.5 h-3.5" /> Mystical Alignment Interpretation
                        </span>
                        
                        {interpreting ? (
                          <div className="py-6 flex flex-col items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                              className={`w-6 h-6 border-2 border-t-transparent ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'border-slate-300' : 'border-[#D4AF37]'}`}
                              style={{ borderRadius: '50%' }}
                            />
                            <p className="text-[10px] font-mono text-slate-500 animate-pulse">Consulting the aetheric balance nodes...</p>
                          </div>
                        ) : balanceInterpretation ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#151518]/80 border border-white/5 rounded-lg p-3 space-y-2"
                          >
                            <p className="text-xs font-serif text-slate-300 leading-relaxed italic first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:text-amber-400">
                              {balanceInterpretation}
                            </p>
                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                              <span className="text-[8px] font-mono text-slate-600">PROCESSED VIA CELESTIAL ENGINE</span>
                              <button
                                type="button"
                                onClick={() => fetchBalanceInterpretation("", question, school, mysticalMetrics)}
                                className={`text-[8.5px] font-mono ${activeTheme.id === 'deep-void' ? 'text-[#c084fc] hover:text-[#d8b4fe]' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300 hover:text-white' : 'text-[#D4AF37] hover:text-[#FFECA1]'} transition-colors cursor-pointer flex items-center gap-0.5`}
                                title="Re-interpret Elemental Balance"
                              >
                                <RotateCcw className="w-2.5 h-2.5" /> RE-INSCRIBE
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-3 bg-[#151518]/40 border border-dashed border-white/5 rounded-lg text-center">
                            <p className="text-[10.5px] font-serif text-slate-500 italic mb-2">No active alignment interpretation has been calculated.</p>
                            <button
                              type="button"
                              onClick={() => fetchBalanceInterpretation("", question, school, mysticalMetrics)}
                              disabled={!answer}
                              className={`px-3 py-1.5 text-[9.5px] font-mono font-bold tracking-wider rounded-md border ${
                                answer 
                                  ? activeTheme.id === 'deep-void'
                                    ? 'bg-violet-950/20 border-violet-500/30 text-violet-300 hover:bg-violet-900/30'
                                    : activeTheme.id === 'ethereal-silver'
                                    ? 'bg-slate-900/20 border-slate-500/30 text-slate-300 hover:bg-slate-800/30'
                                    : 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-900/30'
                                  : 'opacity-40 border-white/5 text-slate-600 cursor-not-allowed'
                              } transition-all active:scale-95`}
                            >
                              🔮 READ ALCHEMICAL ALIGNMENT
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Daily Astro-Guidance Feature */}
      <div className="w-full mt-6 max-w-7xl mx-auto z-10 relative">
        <DailyAstroGuidance 
          birthDate={birthDate}
          onUpdateBirthDate={setBirthDate}
          activeTheme={activeTheme}
          school={school}
          manualZodiacSign={zodiacMode === "manual" ? manualZodiacSign : ""}
        />
      </div>

      {/* Chronos Cycle & Historical Mysteries Visualizer */}
      <div className="w-full mt-8">
        <Suspense fallback={<div className="h-28 flex items-center justify-center text-xs font-mono text-slate-500"><Loader2 className="w-4 h-4 mr-2 animate-spin text-amber-500" />Aligning Chronos Cycle...</div>}>
          <ChronosCycleVisualizer
            school={school}
            inquiryText={question}
            answerText={answer || ""}
            activeTheme={activeTheme}
            pastInquiries={pastInquiries}
          />
        </Suspense>
      </div>
    </motion.div>
        ) : activeTab === "scriptura" ? (
          <motion.div
            key="scriptura-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <ScripturaSearch activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "sigil" ? (
          <motion.div
            key="sigil-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <AethericSigil activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "scholarship" ? (
          <motion.div
            key="scholarship-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <SalazarScholarship activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "divine-order" ? (
          <motion.div
            key="divine-order-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <OfficeOfDivineOrder activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "wisdom-architect" ? (
          <motion.div
            key="wisdom-architect-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <Suspense fallback={<TabSuspenseFallback name="Office of Wisdom: Master Architect of God" />}>
              <OfficeOfWisdomArchitect activeTheme={activeTheme} />
            </Suspense>
          </motion.div>
        ) : activeTab === "apocryphal" ? (
          <motion.div
            key="apocryphal-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <ApocryphalScholarship activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "deadsea" ? (
          <motion.div
            key="deadsea-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <DeadSeaScrollsScholarship activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "anunnaki" ? (
          <motion.div
            key="anunnaki-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <AnunnakiArchive activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "melchizedek" ? (
          <motion.div
            key="melchizedek-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <MelchizedekScholarship activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "metatron" ? (
          <motion.div
            key="metatron-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <MetatronScholarship activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "enoch-portal" ? (
          <motion.div
            key="enoch-portal-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <Suspense fallback={<TabSuspenseFallback name="Enoch Scholarship Portal" />}>
              <EnochScholarshipPortal activeTheme={activeTheme} />
            </Suspense>
          </motion.div>
        ) : activeTab === "extensive-library" ? (
          <motion.div
            key="extensive-library-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <Suspense fallback={<TabSuspenseFallback name="Extensive Library Portal" />}>
              <ExtensiveLibraryPortal activeTheme={activeTheme} />
            </Suspense>
          </motion.div>
        ) : activeTab === "tradition-forge" ? (
          <motion.div
            key="tradition-forge-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <SchoolOfThoughtPortal activeTheme={activeTheme} activeSchool={school} onSelectSchool={setSchool} />
          </motion.div>
        ) : activeTab === "tarot" ? (
          <motion.div
            key="tarot-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <TarotReadings activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "classroom" ? (
          <motion.div
            key="classroom-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <ClassroomSanctum activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "nexus" ? (
          <motion.div
            key="nexus-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <TemporalNexusSanctum activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "intelligence" ? (
          <motion.div
            key="intelligence-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <HighIntelligenceSearchEngine theme={activeTheme} />
          </motion.div>
        ) : activeTab === "natal" ? (
          <motion.div
            key="natal-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <NatalChartVisualization
              birthDate={birthDate}
              onUpdateBirthDate={setBirthDate}
              activeTheme={activeTheme}
              zodiacSign={zodiacSign}
              school={school}
            />
          </motion.div>
        ) : activeTab === "bible" ? (
          <motion.div
            key="bible-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <HolyBiblePortal activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "quran" ? (
          <motion.div
            key="quran-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <HolyQuranPortal activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "military-base" ? (
          <motion.div
            key="military-base-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <MilitaryBasePortal activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "gps" ? (
          <motion.div
            key="gps-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <GPSPortal activeTheme={activeTheme} onOpenMilitaryBase={() => selectTab("military-base")} />
          </motion.div>
        ) : activeTab === "admin" ? (
          <motion.div
            key="admin-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <AdminDashboard activeTheme={activeTheme} currentUserEmail="jb1976mae74@gmail.com" />
          </motion.div>
        ) : activeTab === "enochian" ? (
          <motion.div
            key="enochian-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <EnochianSanctum activeTheme={activeTheme} />
          </motion.div>
        ) : activeTab === "manifestation" ? (
          <motion.div
            key="manifestation-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <ManifestationLaboratory
              activeTheme={activeTheme}
              onOpenConsultation={(q, s) => {
                setQuestion(q);
                setSchool(s);
                selectTab("consultation");
              }}
            />
          </motion.div>
        ) : null}
        </Suspense>
      </AnimatePresence>

      {/* Shared Inquiry Modal */}
      <AnimatePresence>
        {sharedInquiry && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]"
            >
              <div className="p-6 overflow-y-auto space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Shared Celestial Consultation</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{sharedInquiry.school}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Inquiry</span>
                  <p className="text-sm font-serif text-slate-200">{sharedInquiry.question}</p>
                </div>
                <div className="prose prose-invert max-w-none text-xs font-serif text-slate-300">
                  <TypewriterMarkdown content={sharedInquiry.answer} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3 z-10">
                <button
                  onClick={() => setSharedInquiry(null)}
                  className="flex-1 px-4 py-2 rounded-lg text-xs font-serif border border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveSharedInquiry}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md border ${
                    activeTheme.id === 'deep-void'
                      ? 'bg-violet-950/40 border-violet-500/30 text-violet-200 hover:bg-violet-900/40 hover:border-violet-400'
                      : activeTheme.id === 'ethereal-silver'
                      ? 'bg-slate-900/40 border-slate-500/30 text-slate-200 hover:bg-slate-800/40 hover:border-slate-400'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-200 hover:bg-amber-900/40 hover:border-amber-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save to My Chronicles</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purge Confirmation Popup Modal */}
      <AnimatePresence>
        {purgingAll && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setPurgingAll(false);
                setPurgeConfirmText("");
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#0a0a0d] border border-red-500/30 rounded-2xl shadow-2xl shadow-red-950/20 flex flex-col overflow-hidden z-10"
            >
              {/* Glowing header accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

              <div className="p-6 relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <h3 className="text-lg font-serif font-bold text-red-400 mb-2">
                  Are you absolutely sure?
                </h3>
                
                <p className="text-xs font-serif text-slate-300 leading-relaxed mb-4">
                  This alchemical ritual is <span className="text-red-400 font-bold underline">irreversible</span>. By proceeding, you will banish all records, questions, and insights currently inscribed within your <strong>Consultation Chronicles</strong>.
                </p>

                <div className="bg-red-950/10 border border-red-500/10 rounded-xl p-3.5 mb-5 text-left text-[11px] font-serif text-slate-400 space-y-1.5">
                  <div className="flex gap-2 items-start">
                    <span className="text-red-500">✦</span>
                    <span>All {pastInquiries.length} saved chronicles will be permanently erased.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-red-500">✦</span>
                    <span>This affects both local cache and active server database records.</span>
                  </div>
                </div>

                {/* Secure typing verification to unlock */}
                <div className="space-y-2 text-left mb-6">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Type <span className="text-red-400 font-bold">PURGE</span> to verify authorization:
                  </label>
                  <input
                    type="text"
                    value={purgeConfirmText}
                    onChange={(e) => setPurgeConfirmText(e.target.value)}
                    placeholder="Type PURGE here"
                    className="w-full bg-black/60 border border-red-500/20 focus:border-red-500/60 rounded-lg px-3 py-2 text-xs font-mono text-center text-red-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500/30"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPurgingAll(false);
                      setPurgeConfirmText("");
                    }}
                    className="flex-1 py-2 px-4 rounded-lg text-xs font-serif border border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={purgeConfirmText.toUpperCase() !== "PURGE"}
                    onClick={async () => {
                      try {
                        await fetch("/api/consultations", { method: "DELETE" });
                      } catch (err) {
                        console.warn("Failed to purge records from server, falling back to local purge:", err);
                      }
                      setPastInquiries([]);
                      localStorage.removeItem("oracle-past-inquiries");
                      setPurgingAll(false);
                      setPurgeConfirmText("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-serif font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md border ${
                      purgeConfirmText.toUpperCase() === "PURGE"
                        ? 'bg-red-600 hover:bg-red-500 border-red-500 text-white shadow-red-950/40 cursor-pointer'
                        : 'bg-neutral-900 border-white/5 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Conclude Purge</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Consultation Chronicles Drawer Slide-Over */}
      {drawerOpen && (
        <Suspense fallback={null}>
          <ConsultationChroniclesDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            pastInquiries={pastInquiries}
            setPastInquiries={setPastInquiries}
            activeTheme={activeTheme}
            onReInvoke={(q, s) => {
              setQuestion(q);
              setSchool(s);
              selectTab("oracle");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            openSocialShare={openSocialShare}
            setPurgingAll={setPurgingAll}
            setDbToast={setDbToast}
            downloadPDF={downloadPDF}
          />
        </Suspense>
      )}

      {/* Global Social Share Modal */}
      {socialShareState.isOpen && (
        <Suspense fallback={null}>
          <SocialShareModal
            isOpen={socialShareState.isOpen}
            onClose={() => setSocialShareState(prev => ({ ...prev, isOpen: false }))}
            title={socialShareState.title}
            text={socialShareState.text}
            url={socialShareState.url}
            activeTheme={activeTheme}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ServiceLogViewer />
      </Suspense>
      <MysticGuideChat />
    </div>
  );
}
