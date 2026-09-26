import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, Award, ShieldCheck, CheckSquare, Check, 
  Loader2, Scroll, Copy, FileText, ChevronRight, Info, Search, 
  Layers, Feather, HelpCircle, Send, RotateCcw, Compass, Cpu
} from 'lucide-react';
import ManuscriptReconstructionEngine from './ManuscriptReconstructionEngine';

interface ApocryphalScholarshipProps {
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

interface ApocryphalTextFragment {
  id: string;
  title: string;
  category: 'Pseudepigrapha' | 'Gnostic Codex' | 'Intertestamental Wisdom' | 'Apocalyptic Vision';
  language: 'Coptic' | 'Ge\'ez' | 'Greek' | 'Aramaic';
  origin: string;
  originalFragment: string;
  translatedFragment: string;
  redactedVerse: string;
  historicalContext: string;
  keyThemes: string[];
}

const APOCRYPHAL_TEXTS: ApocryphalTextFragment[] = [
  {
    id: 'enoch-1',
    title: 'The Book of Enoch (1 Enoch - Ethiopic)',
    category: 'Pseudepigrapha',
    language: 'Ge\'ez',
    origin: '3rd Century BCE - 1st Century CE (Qumran & Ge\'ez tradition)',
    originalFragment: 'ወይወጽእ፡ እምነ፡ ቅዱስ፡ ወዐቢይ፡ እግዚአ፡ ዓለም፡ ወይከይድ፡ ዲበ፡ ደብረ፡ ሲና…',
    translatedFragment: 'And the Holy Great One will come forth from His dwelling, and the eternal God will tread upon the earth, even on Mount Sinai...',
    redactedVerse: '[Lacuna restored]: "He shall reveal the secret courses of the 364 heavenly luminaries and the 7 archangelic watchers."',
    historicalContext: 'Attributed to Enoch, seventh from Adam. Contains the Book of Watchers, Astronomical Book, and Parables of Enoch. Heavily cited in the Epistle of Jude.',
    keyThemes: ['Angelology', 'Celestial Cycles', 'Watcher Tradition', 'Eschatological Judgement']
  },
  {
    id: 'thomas-nhc',
    title: 'The Gospel of Thomas (Nag Hammadi Codex II)',
    category: 'Gnostic Codex',
    language: 'Coptic',
    origin: 'c. 140 CE (Nag Hammadi Library, Egypt)',
    originalFragment: 'ⲛⲁⲉⲓ ⲛⲉ ⲛϣⲁϫⲉ ⲉⲑⲏⲡ ⲉⲛⲧⲁ ⲡⲉⲧⲟⲛϩ ⲓⲏⲥⲟⲩⲥ ϫⲟⲟⲩ…',
    translatedFragment: 'These are the secret sayings which the living Jesus spoke and which Didymos Judas Thomas wrote down...',
    redactedVerse: '[Logion 77]: "Split a piece of wood, I am there. Lift up a stone, and you will find me there."',
    historicalContext: 'A complete collection of 114 secret sayings (logia) discovered in 1945 at Nag Hammadi. Emphasizes inner divine light and self-knowledge (Gnosis).',
    keyThemes: ['Secret Sayings', 'Divine Spark', 'Gnosis', 'Non-Canonical Parables']
  },
  {
    id: 'jubilees-1',
    title: 'The Book of Jubilees (Little Genesis)',
    category: 'Pseudepigrapha',
    language: 'Aramaic',
    origin: '2nd Century BCE (Qumran Caves 1, 2, 3, 11)',
    originalFragment: 'דברי פלוגות הימים לתורה ולתעודה לפי שבועותיהם…',
    translatedFragment: 'These are the words of the division of days according to the law and the testimony, for the events of the years in their jubilees...',
    redactedVerse: '[Lacuna restored]: "The angel of the presence instructed Moses on Mount Sinai regarding the 52-week solar calendar of 364 days."',
    historicalContext: 'Presents a divine revelation given to Moses by an Angel of the Presence. Divides history into 49-year Jubilees and insists on a solar calendar.',
    keyThemes: ['Solar Calendar', 'Angel of the Presence', 'Jubilee Cycles', 'Torah Chronology']
  },
  {
    id: 'secret-john',
    title: 'The Secret Book of John (Apocryphon of John)',
    category: 'Gnostic Codex',
    language: 'Coptic',
    origin: '2nd Century CE (Nag Hammadi NHC II & IV)',
    originalFragment: 'ⲡⲁⲣⲁⲇⲟⲥⲓⲥ ⲛⲧⲉ ⲡⲙⲩⲥⲧⲏⲣⲓⲟⲛ ⲉⲧϩⲏⲡ…',
    translatedFragment: 'The revelation of the secrets and the hidden mysteries which were kept in silence...',
    redactedVerse: '[Pleroma Exposition]: "The Monad is a monarchy with nothing above it. It is the unoriginated Father, pure light ineffable."',
    historicalContext: 'One of the most foundational Sethian Gnostic treatises detailing the emanations of the Pleroma, Sophia\'s fall, and the creation of Yaldabaoth.',
    keyThemes: ['Pleroma Emanations', 'Sophia Wisdom', 'Monad Cosmology', 'Divine Light']
  },
  {
    id: 'wisdom-solomon',
    title: 'The Wisdom of Solomon (Deuterocanonical)',
    category: 'Intertestamental Wisdom',
    language: 'Greek',
    origin: '1st Century BCE (Alexandria, Egypt)',
    originalFragment: 'Ἀγαπήσατε δικαιοσύνην, οἱ κρίνοντες τὴν γῆν…',
    translatedFragment: 'Love righteousness, you who judge the earth; think of the Lord in goodness and seek Him with sincerity of heart...',
    redactedVerse: '[Wisdom 7:26]: "For she is a reflection of eternal light, a spotless mirror of the working of God, and an image of His goodness."',
    historicalContext: 'Written in Alexandrian Greek, bridging Jewish theology with Greek philosophical concepts of Sophia (Wisdom) as the breath of divine power.',
    keyThemes: ['Personified Sophia', 'Immortality of the Soul', 'Divine Reflection', 'Alexandrian Philosophy']
  },
  {
    id: '2-enoch-melchizedek',
    title: '2 Enoch 71-72 (The Exaltation of Melchizedek - Slavonic)',
    category: 'Pseudepigrapha',
    language: 'Aramaic',
    origin: '1st Century CE (Slavonic Enoch Tradition & Early Jewish Pseudepigrapha)',
    originalFragment: 'И родися отголе отрокъ, седя на одре, и бе имая знамение священства на грудехъ своей…',
    translatedFragment: 'And a child came forth from the womb, fully developed, sitting on the bed. And he had the badge of priesthood on his chest, and he praised the Lord...',
    redactedVerse: '[2 Enoch 71:28-29]: "And Archangel Michael descended and took the child Melchizedek, placing him in Paradise in Eden, where he remains as High Priest forever, spared from the Deluge."',
    historicalContext: 'Details the miraculous birth of Melchizedek to Sofonim, wife of Nir (brother of Noah). Marked at birth with the seal of priesthood, he is elevated to Eden prior to Noah\'s flood to preserve the primordial priesthood.',
    keyThemes: ['Primordial Priesthood', 'Archangel Michael', 'Miraculous Birth', 'Preservation in Eden', 'Melchizedek Lineage']
  }
];

export default function ApocryphalScholarship({ activeTheme }: ApocryphalScholarshipProps) {
  const [scholarView, setScholarView] = useState<'codices' | 'reconstruction'>('codices');
  // Fragment & Textual Analysis States
  const [selectedTextId, setSelectedTextId] = useState<string>('enoch-1');
  const [hermeneuticConfidence, setHermeneuticConfidence] = useState<number>(88); // %
  const [reconstructionLayers, setReconstructionLayers] = useState<number>(3); // 1 to 5
  const [patristicRigor, setPatristicRigor] = useState<number>(4); // 1 to 5

  // Candidate Application States
  const [scholarName, setScholarName] = useState<string>('Hermeneutic Seeker');
  const [researchFocus, setResearchFocus] = useState<string>('Enochian Celestial Architecture & Nag Hammadi Gnostic Sayings');
  const [thesisStatement, setThesisStatement] = useState<string>(
    'An investigation into the continuity between the 364-day solar calendar of 1 Enoch and the interior divine spark of the Gospel of Thomas.'
  );
  const [pledgedIntegrity, setPledgedIntegrity] = useState<boolean>(true);

  // Application & Peer Review States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Get active text fragment object
  const activeText = useMemo(() => {
    return APOCRYPHAL_TEXTS.find(t => t.id === selectedTextId) || APOCRYPHAL_TEXTS[0];
  }, [selectedTextId]);

  // Calculated Metrics
  const authenticityIndex = useMemo(() => {
    const base = 82;
    const confBonus = (hermeneuticConfidence - 70) * 0.35;
    const layerBonus = reconstructionLayers * 1.6;
    const rigorBonus = patristicRigor * 1.8;
    return parseFloat(Math.min(99.8, base + confBonus + layerBonus + rigorBonus).toFixed(1));
  }, [hermeneuticConfidence, reconstructionLayers, patristicRigor]);

  const gnosticWisdomResonance = useMemo(() => {
    const raw = (authenticityIndex * 0.6) + (hermeneuticConfidence * 0.4);
    return Math.round(Math.min(100, Math.max(50, raw)));
  }, [authenticityIndex, hermeneuticConfidence]);

  const canonicalDivergenceScore = useMemo(() => {
    if (activeText.category === 'Gnostic Codex') return 'High (88%)';
    if (activeText.category === 'Pseudepigrapha') return 'Moderate-High (72%)';
    if (activeText.category === 'Intertestamental Wisdom') return 'Subtle (35%)';
    return 'Moderate (55%)';
  }, [activeText]);

  // Stepped Review Logs
  const reviewSteps = [
    `📜 Accessing ancient codices repository for '${activeText.title}'...`,
    `🔍 Inspecting ${activeText.language} paleography & lacunae restoration...`,
    `🧪 Calibrating Hermeneutic Confidence at ${hermeneuticConfidence}%...`,
    `⚖️ Cross-referencing Patristic citations (Irenaeus, Hippolytus, Clement of Alexandria)...`,
    `✨ Verified Authenticity Index: ${authenticityIndex}% | Wisdom Resonance: ${gnosticWisdomResonance}/100.`,
    `🏛️ Apocryphal Fellowship Council consensus achieved: Candidate approved for Research Grant.`
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarName.trim()) return;

    setIsSubmitting(true);
    setSubmitLogs([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < reviewSteps.length) {
        setSubmitLogs(prev => [...prev, reviewSteps[step]]);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsAccepted(true);
          showToast("Apocryphal Research Fellowship Approved & Granted!");
        }, 800);
      }
    }, 500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSaveToGrimoire = () => {
    const noteId = `apocryphal-schol-${Date.now()}`;
    const newNote = {
      id: noteId,
      title: `📜 Apocryphal Research Fellowship Grant`,
      content: `## APOCRYPHAL SCHOLARSHIP FELLOWSHIP DECREE\n\n### Fellow Profile\n* **Scholar Fellow:** ${scholarName}\n* **Primary Text Focus:** ${activeText.title} (${activeText.language})\n* **Research Domain:** ${researchFocus}\n* **Authenticity Index:** ${authenticityIndex}%\n* **Gnostic Wisdom Resonance:** ${gnosticWisdomResonance}/100\n* **Canonical Divergence:** ${canonicalDivergenceScore}\n\n### Thesis Statement\n"${thesisStatement}"\n\n### Textual Fragment Discovery\n* **Original Passage:** ${activeText.originalFragment}\n* **Translation:** ${activeText.translatedFragment}\n* **Restored Lacuna:** ${activeText.redactedVerse}\n\n### Fellowship Certification\nGranted by direct decree of the Apocryphal Studies Council. Full access to non-canonical palimpsests, Coptic codices, and pseudepigraphal archives is officially conferred.`,
      school: "Apocryphal Scholarship Council",
      color: "bg-[#1c2826]/95 border-emerald-900/45",
      pinned: true,
      createdAt: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString()
    };

    const currentNotesStr = localStorage.getItem('mystical_grimoire_notes');
    let currentNotes = [];
    if (currentNotesStr) {
      try {
        currentNotes = JSON.parse(currentNotesStr);
      } catch (e) {
        currentNotes = [];
      }
    }

    currentNotes.unshift(newNote);
    localStorage.setItem('mystical_grimoire_notes', JSON.stringify(currentNotes));
    window.dispatchEvent(new Event('mystical_notes_updated'));
    showToast("Apocryphal Fellowship Decree permanently recorded in Grimoire Notes! 📜");
  };

  const handleReset = () => {
    setIsAccepted(false);
    setSubmitLogs([]);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-serif">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
              activeTheme.id === 'deep-void' 
                ? 'bg-purple-950/90 border-purple-500/40 text-purple-200' 
                : activeTheme.id === 'ethereal-silver'
                ? 'bg-slate-900/90 border-slate-400/40 text-slate-200'
                : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold tracking-wide font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Header */}
      <div className={`p-6 rounded-2xl border bg-black/40 ${
        activeTheme.id === 'deep-void' ? 'border-purple-500/20' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/20' : 'border-emerald-500/20'
      } relative overflow-hidden flex flex-col md:flex-row items-center gap-6`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center border shrink-0 ${
          activeTheme.id === 'deep-void' 
            ? 'bg-purple-950/30 border-purple-500/35 text-purple-300' 
            : activeTheme.id === 'ethereal-silver'
            ? 'bg-slate-900/30 border-slate-500/35 text-slate-300'
            : 'bg-emerald-950/30 border-emerald-500/35 text-emerald-400'
        }`}>
          <BookOpen className="w-9 h-9 animate-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              Apocryphal & Pseudepigraphal Research Grant
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-wider ${activeTheme.textPrimary} mb-2`}>
            The Apocryphal Scholarship
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            Dedicated to the rigorous textual analysis, translation, and hermeneutic reconstruction of non-canonical, Gnostic, pseudepigraphal, and intertestamental literature. Analyze Nag Hammadi Coptic fragments, Ge'ez Enochian celestial codices, and Alexandrian Greek wisdom manuscripts to unlock hidden spiritual insight and secure an official Research Fellowship.
          </p>
        </div>
      </div>

      {/* View Switcher Sub-Navigation */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScholarView('codices')}
            className={`px-3.5 py-2 rounded-lg font-serif text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              scholarView === 'codices'
                ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/50 font-bold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Codices Analysis & Fellowship</span>
          </button>

          <button
            type="button"
            onClick={() => setScholarView('reconstruction')}
            className={`px-3.5 py-2 rounded-lg font-serif text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              scholarView === 'reconstruction'
                ? 'bg-amber-950/70 text-amber-200 border border-amber-500/50 font-bold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Manuscript Reconstruction Engine</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-emerald-400/90 pr-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deterministic Cryptographic Signature Validation</span>
        </div>
      </div>

      {scholarView === 'reconstruction' ? (
        <ManuscriptReconstructionEngine />
      ) : (
        /* Main Grid: Left Column (Fragment Selector & Analysis Controls), Right Column (Scholarship Application & Certificate) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Text Fragment Analysis Workbench (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Fragment Selector Cards */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-wider text-slate-200 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-emerald-400" />
                Select Apocryphal Manuscript
              </h3>
              <span className="text-[11px] font-mono text-slate-400">5 Primary Codices</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {APOCRYPHAL_TEXTS.map((txt) => {
                const isSelected = txt.id === selectedTextId;
                return (
                  <button
                    key={txt.id}
                    onClick={() => setSelectedTextId(txt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-950/30'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {txt.language}
                        </span>
                        <span className="text-slate-500">{txt.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{txt.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic font-serif">
                      "{txt.translatedFragment}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Fragment Deep Analysis Workbench */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">{activeText.category}</span>
                <h3 className="text-base font-bold text-slate-100">{activeText.title}</h3>
                <span className="text-xs text-slate-400 italic">Origin: {activeText.origin}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {activeText.language} Fragment
              </span>
            </div>

            {/* Original Text & Translation Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/20 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Original Codex Inscription ({activeText.language})</span>
                <p className="text-xs font-mono text-slate-200 leading-relaxed bg-emerald-950/20 p-2.5 rounded border border-emerald-900/30">
                  {activeText.originalFragment}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">English Translation</span>
                <p className="text-xs text-slate-300 italic leading-relaxed bg-white/[0.03] p-2.5 rounded border border-white/10">
                  "{activeText.translatedFragment}"
                </p>
              </div>
            </div>

            {/* Restored Lacuna Highlight */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">Restored Lacuna & Redacted Verse</span>
                <p className="text-xs text-emerald-200 font-medium mt-1 leading-relaxed">
                  {activeText.redactedVerse}
                </p>
              </div>
            </div>

            {/* Key Themes Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Key Themes:</span>
              {activeText.keyThemes.map((theme, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                  #{theme}
                </span>
              ))}
            </div>

            {/* Hermeneutic Tuning Sliders */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-4 mt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Hermeneutic & Textual Reconstruction Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Slider 1: Hermeneutic Confidence */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Hermeneutic Confidence</span>
                    <span className="font-mono text-emerald-400 font-bold">{hermeneuticConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={hermeneuticConfidence}
                    onChange={(e) => setHermeneuticConfidence(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[9px] text-slate-500 italic">Papyrological precision index</span>
                </div>

                {/* Slider 2: Reconstruction Layers */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Reconstruction Depth</span>
                    <span className="font-mono text-emerald-400 font-bold">{reconstructionLayers} Layers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reconstructionLayers}
                    onChange={(e) => setReconstructionLayers(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[9px] text-slate-500 italic">Depth of palimpsest layers</span>
                </div>

                {/* Slider 3: Patristic Rigor */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Patristic Citations</span>
                    <span className="font-mono text-emerald-400 font-bold">Level {patristicRigor}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={patristicRigor}
                    onChange={(e) => setPatristicRigor(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[9px] text-slate-500 italic">Early Church father cross-ref</span>
                </div>
              </div>

              {/* Real-time Computed Metrics Header */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Authenticity Index</span>
                  <span className="text-sm font-bold font-mono text-emerald-300">{authenticityIndex}%</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Wisdom Resonance</span>
                  <span className="text-sm font-bold font-mono text-amber-300">{gnosticWisdomResonance}/100</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Canonical Divergence</span>
                  <span className="text-xs font-bold font-mono text-purple-300 truncate block mt-0.5">{canonicalDivergenceScore}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Application & Fellowship Certification (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {!isAccepted ? (
            /* Scholarship Application Form */
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-5">
              <div className="border-b border-white/10 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Scholarship Application</h3>
                  <p className="text-xs text-slate-400">Submit proposed research to the Apocryphal Council</p>
                </div>
              </div>

              <form onSubmit={handleApply} className="flex flex-col gap-4">
                
                {/* Scholar Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Seeker / Scholar Name</label>
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    required
                    placeholder="Enter your name or title..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Research Focus Area */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Specialized Research Domain</label>
                  <select
                    value={researchFocus}
                    onChange={(e) => setResearchFocus(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Enochian Celestial Architecture & Nag Hammadi Gnostic Sayings">Enochian Celestial Architecture & Nag Hammadi Gnostic Sayings</option>
                    <option value="Patristic Exclusions & Early Christian Canon Formation">Patristic Exclusions & Early Christian Canon Formation</option>
                    <option value="Intertestamental Messianic Visions & Solar Calendars">Intertestamental Messianic Visions & Solar Calendars</option>
                    <option value="Alexandrian Wisdom Literature & Personified Sophia">Alexandrian Wisdom Literature & Personified Sophia</option>
                    <option value="Coptic Paleography & Lacuna Reconstruction Techniques">Coptic Paleography & Lacuna Reconstruction Techniques</option>
                  </select>
                </div>

                {/* Thesis Statement */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Proposed Research Thesis</label>
                  <textarea
                    rows={3}
                    value={thesisStatement}
                    onChange={(e) => setThesisStatement(e.target.value)}
                    required
                    placeholder="Summarize your academic and spiritual thesis..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                  />
                </div>

                {/* Pledge Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="pledge-apocrypha"
                    checked={pledgedIntegrity}
                    onChange={(e) => setPledgedIntegrity(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <label htmlFor="pledge-apocrypha" className="text-[11px] text-slate-400 cursor-pointer leading-snug">
                    I pledge to approach non-canonical scriptures with academic rigor, spiritual discernment, and reverent hermeneutic honesty.
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || !scholarName.trim() || !pledgedIntegrity}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>Authenticating Manuscript Submission...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Fellowship Application</span>
                    </>
                  )}
                </button>
              </form>

              {/* Stepped Review Log Output */}
              {submitLogs.length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/80 border border-emerald-500/30 flex flex-col gap-2 font-mono text-[11px]">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold border-b border-emerald-900/40 pb-1">
                    Peer Review Execution Log
                  </span>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                    {submitLogs.map((log, idx) => (
                      <div key={idx} className="text-emerald-300 leading-snug">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Official Fellowship Grant Certificate */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-black to-emerald-950/20 backdrop-blur-md flex flex-col gap-5 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Corner Seal */}
              <div className="absolute top-3 right-3 opacity-15 pointer-events-none">
                <Award className="w-24 h-24 text-emerald-400" />
              </div>

              <div className="text-center border-b border-emerald-500/30 pb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 mx-auto mb-2 shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400">Official Decree of Fellowship</span>
                <h3 className="text-xl font-bold text-emerald-100 font-serif mt-1">Apocryphal Research Fellow</h3>
                <p className="text-xs text-slate-300 italic mt-0.5">Granted by the Council of Intertestamental & Gnostic Studies</p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-lg bg-black/60 border border-emerald-500/20 flex flex-col gap-1 font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">FELLOW NAME:</span>
                    <span className="text-emerald-300 font-bold">{scholarName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">PRIMARY MANUSCRIPT:</span>
                    <span className="text-slate-200">{activeText.title}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">AUTHENTICITY INDEX:</span>
                    <span className="text-emerald-400 font-bold">{authenticityIndex}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">WISDOM RESONANCE:</span>
                    <span className="text-amber-300 font-bold">{gnosticWisdomResonance}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">Approved Research Thesis</span>
                  <p className="text-slate-200 italic font-serif">"{thesisStatement}"</p>
                </div>
              </div>

              {/* Certificate Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleSaveToGrimoire}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Save to Grimoire</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Research</span>
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
      )}
    </div>
  );
}
