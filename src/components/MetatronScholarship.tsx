import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BookOpen, Scroll, ShieldCheck, Award, 
  Check, Copy, FileText, Info, Scale,
  Layers, Compass, Flame, PenTool, Eraser, Binary,
  Hexagon, Workflow, Cpu
} from 'lucide-react';

interface MetatronScholarshipProps {
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    starStroke: string;
    accentGlow: string;
    bgCard: string;
  };
}

interface PrimarySource {
  id: string;
  title: string;
  origin: string;
  era: string;
  hebrewOrGreek: string;
  translatedText: string;
  keyVerse: string;
  analysis: string;
  significance: string;
  keywords: string[];
}

const PRIMARY_SOURCES: PrimarySource[] = [
  {
    id: '3-enoch',
    title: '3 Enoch (The Hebrew Book of Enoch)',
    origin: 'Hekhalot Literature / Merkabah Mysticism',
    era: 'c. 5th - 6th Century CE',
    hebrewOrGreek: 'והפך בשרי ללפידי אש וגידי לאור יוקד... ומראה פני כמראה ברק ועיני כקדיחי אש',
    translatedText: 'And He transformed my flesh into torches of fire, and my tendons into burning light... and the appearance of my face was like the appearance of lightning, and my eyes like coals of fire...',
    keyVerse: '3 Enoch 15:1–2',
    analysis: 'Describes the dramatic transformation of the human Enoch into the archangel Metatron. His body expands to fill the world and he is clothed in 70 names and a crown of glory.',
    significance: 'Establishes the possibility of human divinization (theosis) through extreme righteousness and divine selection.',
    keywords: ['3 Enoch', 'Transformation', 'Fiery Flesh', 'Lesser YHWH', 'Enoch']
  },
  {
    id: 'chagigah-15a',
    title: 'Babylonian Talmud, Chagigah 15a',
    origin: 'Talmudic Record of the "Four who Entered Pardes"',
    era: 'c. 200 - 500 CE',
    hebrewOrGreek: 'חזא מיטטרון דאתיהבא ליה רשותא למיתב למכתב זכוותא דישראל',
    translatedText: 'He saw Metatron, to whom permission was given to sit and write the merits of Israel.',
    keyVerse: 'Chagigah 15a',
    analysis: 'Metatron is unique among angels because he is permitted to sit—a posture normally reserved for God alone—due to his role as the Celestial Scribe.',
    significance: 'Defines Metatron\'s authority and his role in the cosmic administration of justice and records.',
    keywords: ['Talmud', 'Celestial Scribe', 'Sitting Angel', 'Merits of Israel', 'Authority']
  },
  {
    id: 'zohar-balak',
    title: 'Zohar, Parashat Balak (The Youth)',
    origin: 'The Zohar (Book of Radiance)',
    era: 'c. 13th Century (published)',
    hebrewOrGreek: 'איקרי חנוך, ואיקרי מיטטרון, ואיקרי נער...',
    translatedText: 'He is called Enoch, and he is called Metatron, and he is called the Youth (Na\'ar)...',
    keyVerse: 'Zohar III, 189a',
    analysis: 'In the Zohar, Metatron is the "Youth" who serves in the heavenly Tabernacle. He is the intermediary between the upper and lower worlds.',
    significance: 'Connects the earthly service of the Tabernacle with the celestial liturgy governed by Metatron.',
    keywords: ['Zohar', 'The Youth', 'Na\'ar', 'Heavenly Tabernacle', 'Intermediary']
  },
  {
    id: 'targum-pj',
    title: 'Targum Pseudo-Jonathan on Genesis 5:24',
    origin: 'Aramaic Translation & Commentary',
    era: 'c. 7th - 8th Century CE',
    hebrewOrGreek: 'ופלח חנוך בקושטא קדם יי והא ליתוהי עם דיירי ארעא ארום אתנגיד וסליק לרקיעא במימר קדם יי וקרא שמיה מיטטרון ספרא רבא',
    translatedText: 'And Enoch walked in truth before the Lord; and behold he was not with the inhabitants of the earth, for he was withdrawn and ascended to the firmament by the Word... and his name was called Metatron the Great Scribe.',
    keyVerse: 'Targum Pseudo-Jonathan, Gen 5:24',
    analysis: 'A direct Aramaic confirmation of Enoch\'s removal from earth and his appointment as the "Great Scribe" (Safra Rabba).',
    significance: 'Provides an ancient interpretive bridge explaining the "taken" status of Enoch in Genesis.',
    keywords: ['Targum', 'Great Scribe', 'Ascension', 'Genesis 5:24', 'Aramaic']
  }
];

export default function MetatronScholarship({ activeTheme }: MetatronScholarshipProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('3-enoch');
  const [activeTab, setActiveTab] = useState<'manuscripts' | 'geometry' | 'ledger' | 'application'>('manuscripts');
  
  // Scribe's Ledger State
  const [meritCount, setMeritCount] = useState<number>(72);
  const [recordedInsights, setRecordedInsights] = useState<string[]>([]);
  const [newInsight, setNewInsight] = useState<string>('');

  // Application state
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentSource = useMemo(() => {
    return PRIMARY_SOURCES.find(s => s.id === selectedSourceId) || PRIMARY_SOURCES[0];
  }, [selectedSourceId]);

  const addInsight = () => {
    if (newInsight.trim()) {
      setRecordedInsights([newInsight, ...recordedInsights].slice(0, 5));
      setNewInsight('');
      setMeritCount(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 border border-violet-500/30 text-violet-300">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>PRINCE OF THE PRESENCE • CELESTIAL SCRIBE SCHOLARSHIP</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-violet-200 tracking-wide flex items-center gap-3">
              Metatronic Scholarship & The School of Thought
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              Investigating the mysteries of <span className="text-violet-300 font-semibold font-serif">Metatron</span>: The transformed Enoch, the Great Scribe of Heaven, and the architect of celestial geometry.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-violet-500/20 pb-2">
        <button
          onClick={() => setActiveTab('manuscripts')}
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'manuscripts'
              ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4 text-violet-400" />
          <span>Primary Manuscripts</span>
        </button>

        <button
          onClick={() => setActiveTab('geometry')}
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'geometry'
              ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Hexagon className="w-4 h-4 text-emerald-400" />
          <span>Celestial Geometry</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-400" />
          <span>Scribe's Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('application')}
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'application'
              ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Metatronic Consecration</span>
        </button>
      </div>

      {/* Manuscripts Section */}
      {activeTab === 'manuscripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-violet-500/20 space-y-3">
              <div className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
                Sacred Records
              </div>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {PRIMARY_SOURCES.map((source, srcIdx) => (
                  <button
                    key={`${source.id}-${srcIdx}`}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                      selectedSourceId === source.id
                        ? 'bg-violet-500/15 border-violet-500/50 text-violet-100 shadow-md'
                        : 'bg-black/30 border-white/5 text-slate-300 hover:border-violet-500/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold font-serif">
                      <span className="text-violet-200">{source.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{source.era}</span>
                    </div>
                    <div className="text-[11px] font-sans text-slate-400 line-clamp-1">
                      {source.origin}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/90 border border-violet-500/30 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-violet-200">
                    {currentSource.title}
                  </h2>
                  <div className="text-xs font-mono text-violet-400/80 mt-0.5">
                    {currentSource.origin} • {currentSource.era}
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300 self-start sm:self-auto">
                  {currentSource.keyVerse}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/60 border border-violet-500/20 text-center space-y-2">
                <div className="text-xs font-mono text-slate-400">Original Manuscript Text</div>
                <div className="text-base font-serif text-violet-300 leading-relaxed font-bold tracking-wide">
                  {currentSource.hebrewOrGreek}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-violet-400 font-semibold uppercase tracking-wider">
                  English Translation
                </div>
                <div className="p-4 rounded-lg bg-violet-950/20 border border-violet-500/20 text-xs md:text-sm font-serif text-violet-100 leading-relaxed italic">
                  "{currentSource.translatedText}"
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-violet-300 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-violet-400" />
                    <span>Esoteric Commentary</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSource.analysis}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>School Significance</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSource.significance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Celestial Geometry Section */}
      {activeTab === 'geometry' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-violet-500/30 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-violet-200">Metatron's Cube</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                The Metatron's Cube is a sacred geometric symbol that contains all five Platonic solids. It represents the structural blueprints of the universe and the flow of energy from the Divine.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">1</div>
                  <span className="text-xs text-slate-300 font-mono">Integration of all Platonic Solids</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">2</div>
                  <span className="text-xs text-slate-300 font-mono">Archetypal blueprint of existence</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">3</div>
                  <span className="text-xs text-slate-300 font-mono">Geometric map of divine emanation</span>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-square max-w-sm mx-auto flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-2 border-violet-500/20 rounded-full flex items-center justify-center p-4"
              >
                <div className="w-full h-full relative">
                  {/* Simplistic representation of Metatron's Cube lines */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <div 
                      key={i} 
                      className="absolute top-1/2 left-1/2 w-full h-[1px] bg-violet-500/40"
                      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
                    />
                  ))}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-violet-400/60 rounded-full bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                  <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-violet-400/80" strokeWidth={1} />
                </div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-violet-300 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scribe's Ledger Section */}
      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-400" />
                <span>The Scribe's Ledger</span>
              </h3>
              <p className="text-xs text-slate-300">
                Inscribe your insights into the celestial records. Metatron, the Prince of the Presence, records the merits and discoveries of those who seek the light.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/20 text-amber-400">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">Current Merit Count</div>
                    <div className="text-lg font-serif font-bold text-amber-200">{meritCount}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-violet-500/20 text-violet-400">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">Celestial Synchronization</div>
                    <div className="text-lg font-serif font-bold text-violet-200">72.0%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-amber-400">Inscribe New Insight</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInsight}
                    onChange={(e) => setNewInsight(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInsight()}
                    placeholder="Capture a spark of gnosis..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-black/60 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-500/50"
                  />
                  <button 
                    onClick={addInsight}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-serif transition-all"
                  >
                    Inscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/90 border border-violet-500/30 space-y-4">
            <h4 className="text-xs font-mono text-violet-400 uppercase tracking-widest border-b border-violet-500/20 pb-2">Recent Celestial Inscriptions</h4>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {recordedInsights.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs italic">The ledger awaits your first inscription...</div>
                ) : (
                  recordedInsights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-serif relative group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                      {insight}
                      <div className="text-[9px] text-violet-400/60 mt-1 font-mono text-right">METATRON_SCRIBE_V{72 + idx}</div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Application Section */}
      {activeTab === 'application' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-violet-500/30 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-violet-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span>Consecration to Metatronic Scholarship</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Formalize your alignment with the Metatronic School of Thought. By consecrating this application, you pledge to uphold the clarity of sacred records and the precision of celestial order.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-violet-500/10 rounded-2xl border border-violet-500/30">
              <Check className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-serif text-violet-200">Seal of Metatron Applied</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your alignment with the Great Scribe has been recorded in the celestial ledger. May your path be illuminated by the geometry of truth.
              </p>
            </div>
          ) : (
            <div className="max-w-xl space-y-6">
              <div className="p-4 rounded-xl bg-black/40 border border-violet-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-violet-500/20 text-violet-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-300 font-serif italic">
                    "I acknowledge the transformation of human consciousness into angelic clarity through the study of divine geometry and sacred records."
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-serif font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Seal the Consecration
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
