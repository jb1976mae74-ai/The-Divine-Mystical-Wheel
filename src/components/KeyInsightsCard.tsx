import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, TrendingUp, Compass, Star, Zap, Orbit, Moon, Flame, Shield, Calendar, RefreshCw, CheckCircle2, ChevronRight, Layers, Copy, Check } from 'lucide-react';
import { PastInquiry } from '../App';
import { getZodiacMetadata, getZodiacSignFromDate } from './DailyAstroGuidance';

interface KeyInsightsCardProps {
  pastInquiries: PastInquiry[];
  zodiacSign?: string;
  birthDate?: string;
  onUpdateBirthDate?: (dateStr: string) => void;
  activeTheme: {
    id?: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
  };
}

const ALL_ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Ignis' },
  { name: 'Taurus', symbol: '♉', element: 'Materia' },
  { name: 'Gemini', symbol: '♊', element: 'Aer' },
  { name: 'Cancer', symbol: '♋', element: 'Aqua' },
  { name: 'Leo', symbol: '♌', element: 'Ignis' },
  { name: 'Virgo', symbol: '♍', element: 'Materia' },
  { name: 'Libra', symbol: '♎', element: 'Aer' },
  { name: 'Scorpio', symbol: '♏', element: 'Aqua' },
  { name: 'Sagittarius', symbol: '♐', element: 'Ignis' },
  { name: 'Capricorn', symbol: '♑', element: 'Materia' },
  { name: 'Aquarius', symbol: '♒', element: 'Aer' },
  { name: 'Pisces', symbol: '♓', element: 'Aqua' },
];

const STOP_WORDS = new Set([
  'the', 'and', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'I', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'hot', 'word', 'but', 'what', 'some', 'we', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'up', 'use', 'your', 'how', 'said', 'an', 'each', 'she', 'how', 'do', 'if', 'will', 'about', 'many', 'then', 'them', 'write', 'would', 'like', 'so', 'these', 'her', 'long', 'make', 'thing', 'see', 'him', 'two', 'has', 'look', 'more', 'day', 'could', 'go', 'come', 'did', 'number', 'sound', 'no', 'most', 'people', 'my', 'over', 'know', 'water', 'than', 'call', 'first', 'who', 'may', 'down', 'side', 'been', 'now', 'find', 'any', 'new', 'work', 'part', 'take', 'get', 'place', 'made', 'live', 'where', 'after', 'back', 'little', 'only', 'round', 'man', 'year', 'came', 'show', 'every', 'good', 'me', 'give', 'under', 'name', 'very', 'through', 'just', 'form', 'sentence', 'great', 'think', 'say', 'help', 'low', 'line', 'differ', 'turn', 'cause', 'much', 'mean', 'before', 'move', 'right', 'boy', 'old', 'too', 'same', 'tell', 'does', 'set', 'three', 'want', 'air', 'well', 'also', 'play', 'small', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add', 'even', 'land', 'here', 'must', 'big', 'high', 'such', 'follow', 'act', 'why', 'ask', 'men', 'change', 'went', 'light', 'kind', 'off', 'need', 'house', 'picture', 'try', 'us', 'again', 'animal', 'point', 'mother', 'world', 'near', 'build', 'self', 'earth', 'father', 'explain', 'reveal', 'mysteries', 'secrets', 'apply', 'achieve', 'role', 'how', 'what', 'true', 'nature', 'relation', 'between'
]);

export default function KeyInsightsCard({
  pastInquiries,
  zodiacSign: propZodiacSign,
  birthDate,
  onUpdateBirthDate,
  activeTheme
}: KeyInsightsCardProps) {
  const [activeTab, setActiveTab] = useState<'zodiac' | 'themes'>('zodiac');
  const [manualSign, setManualSign] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Effective natal zodiac sign
  const effectiveSign = useMemo(() => {
    if (manualSign) return manualSign;
    if (propZodiacSign) return propZodiacSign;
    if (birthDate) {
      const derived = getZodiacSignFromDate(birthDate);
      if (derived) return derived;
    }
    return 'Scorpio'; // Meaningful default
  }, [manualSign, propZodiacSign, birthDate]);

  const zodiacMeta = useMemo(() => getZodiacMetadata(effectiveSign), [effectiveSign]);

  // Compute Zodiacal Influence Correlations with saved consultation history
  const zodiacCorrelation = useMemo(() => {
    const totalRecords = pastInquiries.length;
    const sign = effectiveSign;
    const meta = zodiacMeta;

    const elementMap: Record<string, string> = {
      Aries: 'Ignis', Leo: 'Ignis', Sagittarius: 'Ignis',
      Taurus: 'Materia', Virgo: 'Materia', Capricorn: 'Materia',
      Gemini: 'Aer', Libra: 'Aer', Aquarius: 'Aer',
      Cancer: 'Aqua', Scorpio: 'Aqua', Pisces: 'Aqua'
    };

    const natalElement = elementMap[sign] || 'Aqua';

    // School frequencies & keyword extraction from saved history
    const schoolCounts: Record<string, number> = {};
    let elementMatches = 0;

    pastInquiries.forEach(iq => {
      if (iq.school) {
        schoolCounts[iq.school] = (schoolCounts[iq.school] || 0) + 1;
      }
      const text = `${iq.question} ${iq.answer}`.toLowerCase();

      // Elemental keyword resonance
      if (natalElement === 'Ignis' && (text.includes('fire') || text.includes('ignis') || text.includes('flame') || text.includes('will') || text.includes('catalyst') || text.includes('battle') || text.includes('light'))) {
        elementMatches++;
      } else if (natalElement === 'Aqua' && (text.includes('water') || text.includes('aqua') || text.includes('tide') || text.includes('gnosis') || text.includes('apocrypha') || text.includes('soul') || text.includes('void') || text.includes('transmutation'))) {
        elementMatches++;
      } else if (natalElement === 'Aer' && (text.includes('air') || text.includes('aer') || text.includes('logos') || text.includes('scripture') || text.includes('lexicon') || text.includes('mind') || text.includes('thought'))) {
        elementMatches++;
      } else if (natalElement === 'Materia' && (text.includes('earth') || text.includes('materia') || text.includes('stone') || text.includes('record') || text.includes('anunnaki') || text.includes('foundation') || text.includes('structure'))) {
        elementMatches++;
      } else {
        elementMatches += 0.55;
      }
    });

    const topSchoolEntry = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])[0];
    const topSchool = topSchoolEntry ? topSchoolEntry[0] : 'Hermetic Alchemy';

    const baseResonance = totalRecords > 0 ? Math.round((elementMatches / totalRecords) * 100) : 85;
    const resonancePercent = Math.min(98, Math.max(58, baseResonance));

    // Sign-specific Mystical House Archetypes & Pattern Descriptions
    const signPatterns: Record<string, { house: string; archetype: string; patternDescription: string; evolutionNote: string }> = {
      Aries: {
        house: '1st House (Sovereign Vanguard)',
        archetype: 'Catalytic Pioneer',
        patternDescription: `Your Aries Fire (Ignis 🔥) infuses your saved consultation history with direct spiritual action, catalyzing queries into ${topSchool}.`,
        evolutionNote: 'Your history demonstrates an accelerating shift from reflective inquiry into sovereign spiritual application.'
      },
      Taurus: {
        house: '2nd House (Sacred Monolith)',
        archetype: 'Telluric Alchemist',
        patternDescription: `Your Taurus Earth (Materia 🪨) anchors your saved chronicles in durable ancient records, cuneiform tablets, and ${topSchool}.`,
        evolutionNote: 'Saved consultations reveal a steady, unshakeable accumulation of foundational esoteric knowledge.'
      },
      Gemini: {
        house: '3rd House (Mercurial Scribe)',
        archetype: 'Cosmic Lexicographer',
        patternDescription: `Your Gemini Air (Aer 💨) bridges disparate scriptural lexicons and ciphers, weaving your queries in ${topSchool} into a unified tapestry.`,
        evolutionNote: 'Chronicles reflect dual intellectual currents connecting ancient sacred texts across multiple epochs.'
      },
      Cancer: {
        house: '4th House (Ancestral Matrix)',
        archetype: 'Lunar Sanctuary Guardian',
        patternDescription: `Your Cancer Water (Aqua 💧) resonates with the Dead Sea Scrolls, ancestral memory, and divine sanctuaries within ${topSchool}.`,
        evolutionNote: 'Your consultation history shows a deepening empathetic alignment with ancient sacred protection rites.'
      },
      Leo: {
        house: '5th House (Solar Sovereign)',
        archetype: 'Divine Radiance',
        patternDescription: `Your Leo Fire (Ignis 🔥) illuminates royal seals, solar geometry, and Metatron’s heptagramic light across your ${topSchool} inquiries.`,
        evolutionNote: 'Saved records demonstrate a majestic progression toward self-sovereignty and celestial leadership.'
      },
      Virgo: {
        house: '6th House (Alchemical Scribe)',
        archetype: 'Hermetic Purifier',
        patternDescription: `Your Virgo Earth (Materia 🪨) applies rigorous discernment and precision to manuscript reconstruction and grimoire analysis in ${topSchool}.`,
        evolutionNote: 'Your history exhibits meticulous analytical refinement of complex apocryphal manuscripts.'
      },
      Libra: {
        house: '7th House (Harmonic Scales)',
        archetype: 'Cosmic Balancer',
        patternDescription: `Your Libra Air (Aer 💨) seeks elemental equilibrium, zodiacal compatibility, and divine justice across your ${topSchool} queries.`,
        evolutionNote: 'Consultations highlight a harmonious balancing of opposing esoteric forces into serene order.'
      },
      Scorpio: {
        house: '8th House (Subterranean Crypts)',
        archetype: 'Apocryphal Phoenix',
        patternDescription: `Your Scorpio Water (Aqua 💧) draws your saved consultations toward subterranean vaults, transmutation, and hidden Gnostic secrets in ${topSchool}.`,
        evolutionNote: 'Saved chronicles reveal profound psychological rebirth and unravelling of cryptic esoteric mysteries.'
      },
      Sagittarius: {
        house: '9th House (Celestial Pilgrim)',
        archetype: 'Transcendental Voyager',
        patternDescription: `Your Sagittarius Fire (Ignis 🔥) propels your search into vast philosophical schools, divine wanderings, and universal truths in ${topSchool}.`,
        evolutionNote: 'Your history charts an expanding cosmic trajectory spanning multiple ancient traditions.'
      },
      Capricorn: {
        house: '10th House (Chronos Architect)',
        archetype: 'Saturnian Master',
        patternDescription: `Your Capricorn Earth (Materia 🪨) aligns with ancient time cycles, Melchizedek lineages, and temporal nexus points in ${topSchool}.`,
        evolutionNote: 'Saved inquiries demonstrate long-term mastery of time cycles and structured spiritual ascension.'
      },
      Aquarius: {
        house: '11th House (Stellar Water-Bearer)',
        archetype: 'Epochal Intuitive',
        patternDescription: `Your Aquarius Air (Aer 💨) streams high-intelligence search matrices, future epochs, and universal gnosis across ${topSchool}.`,
        evolutionNote: 'Chronicles reflect visionary, forward-looking synthesis of ancient wisdom with futuristic discovery.'
      },
      Pisces: {
        house: '12th House (Boundless Aether)',
        archetype: 'Ethereal Mystic',
        patternDescription: `Your Pisces Water (Aqua 💧) dissolves material bounds through aetheric sigils, gnostic void exploration, and divine compassion in ${topSchool}.`,
        evolutionNote: 'Your saved records show increasing transcendence of physical limits into cosmic oneness.'
      }
    };

    const pattern = signPatterns[sign] || signPatterns['Scorpio'];

    return {
      sign,
      meta,
      natalElement,
      topSchool,
      resonancePercent,
      pattern,
      totalRecords
    };
  }, [pastInquiries, effectiveSign, zodiacMeta]);

  const handleCopyZodiacPattern = () => {
    const textToCopy = `✨ ZODIACAL INFLUENCE & MYSTICAL PATTERN CORRELATION ✨
Natal Alignment: ${zodiacCorrelation.sign} (${zodiacCorrelation.natalElement} ${zodiacCorrelation.meta.elementSymbol})
Key Trait: "${zodiacCorrelation.meta.keyTrait}"
Elemental Resonance: ${zodiacCorrelation.resonancePercent}% Harmonic Correlation (${zodiacCorrelation.totalRecords} saved chronicles)

1. ELEMENTAL POLARITY & MYSTICAL PATTERN:
${zodiacCorrelation.pattern.patternDescription}

2. CELESTIAL HOUSE ARCHETYPE:
${zodiacCorrelation.pattern.house} — Role: ${zodiacCorrelation.pattern.archetype}

3. SPIRITUAL VECTOR:
${zodiacCorrelation.pattern.evolutionNote}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Extract recurring thematic lessons from saved inquiries
  const insights = useMemo(() => {
    if (pastInquiries.length === 0) return null;

    const wordCounts: Record<string, number> = {};
    const schools: Record<string, number> = {};

    pastInquiries.forEach(iq => {
      if (iq.school) {
        schools[iq.school] = (schools[iq.school] || 0) + 2;
      }
      const combinedText = `${iq.question} ${iq.answer}`.toLowerCase();
      const words = combinedText.match(/\b(\w+)\b/g);

      if (words) {
        words.forEach(word => {
          if (word.length > 3 && !STOP_WORDS.has(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
      }
    });

    Object.entries(schools).forEach(([school, count]) => {
      const parts = school.toLowerCase().split(' ');
      parts.forEach(p => {
        if (p.length > 3 && !STOP_WORDS.has(p)) {
          wordCounts[p] = (wordCounts[p] || 0) + count;
        }
      });
    });

    const sortedWords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    const thematicLessons: Record<string, string> = {
      alchemy: 'The transmutation of the lower self into divine gold through spiritual heat.',
      gnosis: 'Direct experiential knowledge of the divine transcends all intellectual study.',
      spirit: 'The eternal breath that animates the material vessel and calls us home.',
      kabbalah: 'Ascending the paths of wisdom to restore the shattered vessels of light.',
      logos: 'The primordial word and rational order that structures the unseen cosmos.',
      void: 'The fertile silence from which all creation emerges and eventually returns.',
      light: 'Illumination of the shadow self is the first step toward true sovereignty.',
      soul: 'A traveler between realms, seeking to remember its celestial origins.',
      wisdom: "Knowledge applied with the heart's intuition becomes the key to the gates.",
      divine: 'The source of all being is closer to you than your own jugular vein.',
      fire: 'The catalytic force of will that burns away the dross of mortality.',
      water: 'The intuitive flow that dissolves rigid structures and cleanses the spirit.',
      air: 'The intellectual current that carries the seeds of new thought.',
      earth: 'The grounded anchor that gives form to the most ethereal visions.',
      mysteries: 'Veils placed by the divine to test the seeker’s resolve and purity.',
      ancient: 'The echo of primordial truths that resonate within the modern mind.'
    };

    return sortedWords.map(word => ({
      theme: word.charAt(0).toUpperCase() + word.slice(1),
      lesson: thematicLessons[word] || `The recurring presence of ${word} suggests a deepening focus on this metaphysical concept in your journey.`
    }));
  }, [pastInquiries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-black/70 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Orbit className="w-20 h-20 text-amber-400" />
      </div>

      {/* Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-100">
            Key Insights & Cosmic Correlations
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('zodiac')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'zodiac'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Orbit className="w-3 h-3 text-amber-400" />
            <span>Zodiacal Influence</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('themes')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Brain className="w-3 h-3 text-sky-400" />
            <span>Recurring Themes ({insights ? insights.length : 0})</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'zodiac' ? (
          <motion.div
            key="zodiac-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            {/* Natal Sign Alignment Banner */}
            <div className="p-3.5 rounded-xl bg-[#121215]/90 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl font-serif shadow-inner">
                  {zodiacCorrelation.meta.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-bold text-slate-100">
                      Natal Alignment: {zodiacCorrelation.sign}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {zodiacCorrelation.meta.elementSymbol} {zodiacCorrelation.natalElement}
                    </span>
                  </div>
                  <p className="text-[10.5px] font-serif text-slate-400 mt-0.5 italic">
                    "{zodiacCorrelation.meta.keyTrait}" ({zodiacCorrelation.meta.dates})
                  </p>
                </div>
              </div>

              {/* Action Buttons: Copy Pattern & Select Natal Sign */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyZodiacPattern}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title="Copy mystical pattern explanation to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Pattern Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy Pattern</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-amber-400" />
                  <span>{isPickerOpen ? 'Hide Signs' : 'Select Natal Sign'}</span>
                </button>
              </div>
            </div>

            {/* Quick Zodiac Sign Selector Dropdown / Pill Row */}
            {isPickerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-black/80 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Select Natal Sign to Correlate History:</span>
                  {onUpdateBirthDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <input
                        type="date"
                        value={birthDate || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            onUpdateBirthDate(e.target.value);
                            setManualSign(null);
                          }
                        }}
                        className="bg-black/60 border border-white/20 text-slate-200 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {ALL_ZODIAC_SIGNS.map(s => {
                    const isSelected = effectiveSign === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setManualSign(s.name);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/25 text-amber-200 border-amber-500/60 font-bold shadow-md'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span>{s.symbol}</span>
                        <span className="truncate">{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Elemental Resonance Progress Gauge */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Elemental Resonance Score
                </span>
                <span className="text-amber-400 font-bold font-serif">
                  {zodiacCorrelation.resonancePercent}% Harmonic Correlation
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${zodiacCorrelation.resonancePercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                />
              </div>
              <p className="text-[10px] font-serif text-slate-400 italic">
                Derived from {zodiacCorrelation.totalRecords} saved consultation chronicle{zodiacCorrelation.totalRecords === 1 ? '' : 's'} correlated with your {zodiacCorrelation.sign} ({zodiacCorrelation.natalElement}) natal polarity.
              </p>
            </div>

            {/* 3 Unique Mystical Pattern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pattern 1: Elemental Affinity */}
              <div className="p-3 rounded-xl bg-[#101012] border border-white/10 flex flex-col gap-1.5 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Elemental Polarity</span>
                </div>
                <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
                  {zodiacCorrelation.pattern.patternDescription}
                </p>
              </div>

              {/* Pattern 2: Celestial House Archetype */}
              <div className="p-3 rounded-xl bg-[#101012] border border-white/10 flex flex-col gap-1.5 hover:border-sky-500/40 transition-colors">
                <div className="flex items-center gap-1.5 text-sky-300 font-serif font-bold text-xs">
                  <Shield className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{zodiacCorrelation.pattern.house}</span>
                </div>
                <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
                  Archetypal Role: <strong className="text-sky-200 font-sans">{zodiacCorrelation.pattern.archetype}</strong>. Your inquiries strongly mirror the ruling metaphysical domain of your natal house.
                </p>
              </div>

              {/* Pattern 3: Spiritual Trajectory */}
              <div className="p-3 rounded-xl bg-[#101012] border border-white/10 flex flex-col gap-1.5 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-1.5 text-emerald-300 font-serif font-bold text-xs">
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Spiritual Vector</span>
                </div>
                <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
                  {zodiacCorrelation.pattern.evolutionNote}
                </p>
              </div>
            </div>

            {/* Appended Zodiacal Influence Copy Pattern Button Bar */}
            <div className="p-3.5 rounded-xl bg-[#121215]/90 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-serif">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span>
                  <strong className="text-amber-300 font-sans uppercase tracking-wider text-[11px]">Mystical Pattern Explanation:</strong>{" "}
                  <span className="italic text-slate-300">{zodiacCorrelation.pattern.patternDescription}</span>
                </span>
              </div>

              <button
                type="button"
                id="copy-zodiacal-influence-explanation-btn"
                onClick={handleCopyZodiacPattern}
                className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 shrink-0"
                title="Copy generated mystical pattern explanation using Clipboard API"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span className="text-emerald-300 font-bold">Pattern Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Mystical Pattern</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="themes-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {insights && insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <motion.div
                    key={insight.theme ? `${insight.theme}-${idx}` : `insight-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#101012] border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="mt-0.5">
                      {idx === 0 ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      ) : idx === 1 ? (
                        <Sparkles className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Compass className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {insight.theme}
                      </h4>
                      <p className="text-[11px] font-serif text-slate-300 leading-relaxed italic">
                        {insight.lesson}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-black/40 border border-white/5 text-center space-y-2">
                <Brain className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs font-serif text-slate-400">
                  No consultation chronicles saved yet. Query the oracle to automatically extract recurring metaphysical themes.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9.5px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Astrological & History Pattern Correlation Active
        </span>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
