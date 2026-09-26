import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, Sparkles, Award, ShieldCheck, CheckSquare, Check, 
  Loader2, Microscope, Eye, Layers, Search, FileText, 
  RotateCcw, Info, Send, Feather, Compass
} from 'lucide-react';

interface DeadSeaScrollsScholarshipProps {
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

interface QumranScroll {
  id: string;
  code: string;
  title: string;
  cave: string;
  dateRange: string;
  language: 'Hebrew' | 'Aramaic' | 'Greek';
  scriptType: 'Herodian Square' | 'Hasmonaean' | 'Paleo-Hebrew';
  hebrewFragment: string;
  translatedFragment: string;
  redactedVerse?: string;
  textualVariantNote: string;
  historicalContext: string;
  keyThemes: string[];
}

const QUMRAN_SCROLLS: QumranScroll[] = [
  {
    id: '1qisa-a',
    code: '1QIsa-a',
    title: 'The Great Isaiah Scroll',
    cave: 'Cave 1 (Discovered 1947)',
    dateRange: 'c. 125 BCE - 100 BCE',
    language: 'Hebrew',
    scriptType: 'Hasmonaean',
    hebrewFragment: 'קול קורא במדבר פנו דרך יהוה ישרו בערבה מסלה לאלהינו…',
    translatedFragment: 'A voice cries in the wilderness: "Prepare the way of YHWH; make straight in the desert a highway for our God..." (Isaiah 40:3)',
    textualVariantNote: 'Shows 1,000+ minor orthographic and spelling variants compared to the 10th-century Masoretic Text, confirming extraordinary 1,000-year preservation fidelity.',
    historicalContext: 'One of the original seven Dead Sea Scrolls found in Cave 1. Features 54 columns of Hebrew text preserved on 17 sheets of leather.',
    keyThemes: ['Messianic Prophecy', 'Consolation of Israel', 'Textual Fidelity', 'Proto-Masoretic']
  },
  {
    id: '1qs',
    code: '1QS',
    title: 'Community Rule (Serekh ha-Yahad)',
    cave: 'Cave 1 (Discovered 1947)',
    dateRange: 'c. 100 BCE - 75 BCE',
    language: 'Hebrew',
    scriptType: 'Hasmonaean',
    hebrewFragment: 'לדרוש אל בכול לבוב ובכול נפש לעשות הטוב והישר לפניו…',
    translatedFragment: 'To seek God with all heart and soul; to do what is good and right before Him as commanded through Moses and His servants the prophets...',
    redactedVerse: 'Details communal initiation rituals, shared possessions, strict ritual purity, solar calendar observance, and council governance.',
    textualVariantNote: 'Provides the primary internal handbook for the Essene Yahad community at Qumran under the leadership of the Teacher of Righteousness.',
    historicalContext: 'Found almost intact in Cave 1. Details the core covenantal theology and strict discipline of the Qumran wilderness community.',
    keyThemes: ['Essene Covenant', 'Community Discipline', 'Solar Calendar', 'Teacher of Righteousness']
  },
  {
    id: '1qm',
    code: '1QM',
    title: 'The War Scroll (War of the Sons of Light)',
    cave: 'Cave 1 (Discovered 1947)',
    dateRange: 'c. 50 BCE - 30 BCE',
    language: 'Hebrew',
    scriptType: 'Herodian Square',
    hebrewFragment: 'למלחמה ראשית משלוח יד בני אור להחל בגורל בני חושך…',
    translatedFragment: 'For the war, the first attack of the Sons of Light shall be launched against the lot of the Sons of Darkness, against the army of Belial...',
    textualVariantNote: 'Outlines a 40-year eschatological warfare strategy, trumpet signals, angelic mobilization (Michael, Gabriel, Sariel, Raphael), and divine victory.',
    historicalContext: 'Describes a cosmic battle between the Sons of Light (Essenes/Levites) and the Sons of Darkness (Kittim/Romans and unfaithful Israelites).',
    keyThemes: ['Eschatological Battle', 'Dualism', 'Angelic Warfare', 'Sons of Light']
  },
  {
    id: '4q246',
    code: '4Q246',
    title: 'Aramaic Apocalypse ("Son of God" Text)',
    cave: 'Cave 4 (Discovered 1952)',
    dateRange: 'c. 100 BCE - 1 BCE',
    language: 'Aramaic',
    scriptType: 'Herodian Square',
    hebrewFragment: 'ברה די אל יתאמר ובר עליון יקרונה…',
    translatedFragment: '"He shall be called Son of God, and they shall call him Son of the Most High..."',
    textualVariantNote: 'Direct Aramaic linguistic parallel to Luke 1:32,35 written decades prior to the New Testament, proving pre-Christian Jewish usage of the messianic title.',
    historicalContext: 'A fragmentary Aramaic scroll from Cave 4 describing an apocalyptic king whose reign brings everlasting peace and justice.',
    keyThemes: ['Son of God Title', 'Aramaic Messianism', 'Lukan Parallels', 'Kingdom of Peace']
  },
  {
    id: '11q19',
    code: '11Q19',
    title: 'The Temple Scroll (11QT-a)',
    cave: 'Cave 11 (Discovered 1956)',
    dateRange: 'c. 150 BCE - 70 CE',
    language: 'Hebrew',
    scriptType: 'Herodian Square',
    hebrewFragment: 'והיה הבית אשר תבנה לשמי נכון לעולם…',
    translatedFragment: 'And the House which you shall build for My Name shall be established forever...',
    textualVariantNote: 'Presents divine commands in the first person ("I, God") as if spoken directly to Moses on Sinai, prescribing an ideal 3-concentric square Temple.',
    historicalContext: 'The longest Dead Sea Scroll (over 28 feet / 8.6 meters). Preserved in thin leather with salt-gelatin surface treatment.',
    keyThemes: ['Ideal Temple Design', 'Ritual Purity', 'Torah Expansion', 'Direct Divine Voice']
  },
  {
    id: '11q13',
    code: '11Q13',
    title: '11QMelchizedek (The Heavenly High Priest Melchizedek)',
    cave: 'Cave 11 (Discovered 1956)',
    dateRange: 'c. 100 BCE - 50 CE',
    language: 'Hebrew',
    scriptType: 'Herodian Square',
    hebrewFragment: 'אלהים יתייצב בעדת אל בקרב אלהים ישפוט... ומלכי צדק ישיב להמה את דרורם... וקרא להמה דרור לשלחם ולכפר על עונותיהם',
    translatedFragment: 'Elohim stands in the assembly of God; in the midst of gods He executes judgment... and Melchizedek shall release them from their debts, proclaiming liberty to the captives and atoning for their sins during the tenth Jubilee year...',
    redactedVerse: 'Identifies Melchizedek as the celestial "Elohim" of Psalm 82:1 who defeats Belial and his demonic spirits, executing divine vengeance and establishing eternal Jubilee redemption.',
    textualVariantNote: 'Combines Leviticus 25 (Jubilee Year), Isaiah 61 (Proclaiming liberty to captives), and Psalm 82 (Celestial judgment), casting Melchizedek as the Heavenly Redeemer.',
    historicalContext: 'Discovered in Cave 11. Preserves 13 fragmentary lines of vital first-century BCE eschatological theology regarding Melchizedek as the Divine Judge and High Priest of Heaven.',
    keyThemes: ['Heavenly High Priest', 'Tenth Jubilee', 'Cosmic Deliverer', 'Elohim Title', 'Atonement']
  }
];

export default function DeadSeaScrollsScholarship({ activeTheme }: DeadSeaScrollsScholarshipProps) {
  // Fragment & Infrared Examination States
  const [selectedScrollId, setSelectedScrollId] = useState<string>('1qisa-a');
  const [irWavelength, setIrWavelength] = useState<number>(850); // nm (Infrared spectrum)
  const [carbonYear, setCarbonYear] = useState<number>(-125); // Negative for BCE
  const [paleoFilter, setPaleoFilter] = useState<'Standard' | 'Contrast Enhanced' | 'Binarized IR'>('Contrast Enhanced');

  // Candidate Application States
  const [scholarName, setScholarName] = useState<string>('Qumranic Fellow');
  const [specialization, setSpecialization] = useState<string>('Proto-Masoretic Textual Criticism & Qumranic Variant Collation');
  const [thesisStatement, setThesisStatement] = useState<string>(
    'A comparative paleographic and multispectral analysis of orthographic variants in 1QIsa-a versus the Codex Leningradensis.'
  );
  const [pledgedIntegrity, setPledgedIntegrity] = useState<boolean>(true);

  // Application & Peer Review States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Scroll object
  const activeScroll = useMemo(() => {
    return QUMRAN_SCROLLS.find(s => s.id === selectedScrollId) || QUMRAN_SCROLLS[0];
  }, [selectedScrollId]);

  // Computed Metrics
  const irInksUnmasked = useMemo(() => {
    // 850nm is optimal for carbon-ink on ancient leather
    const diff = Math.abs(irWavelength - 850);
    const score = 100 - (diff * 0.4);
    return Math.max(65, Math.min(99.9, score)).toFixed(1);
  }, [irWavelength]);

  const carbonCalibrationConfidence = useMemo(() => {
    // Hasmonaean & Herodian ranges
    return "98.4% (2-Sigma Calibration)";
  }, [carbonYear]);

  const textualFidelityIndex = useMemo(() => {
    if (activeScroll.code === '1QIsa-a') return '99.2% Alignment with Masoretic';
    if (activeScroll.code === '1QS') return '100% Sectarian Autograph';
    if (activeScroll.code === '4Q246') return 'Distinct Aramaic Messianic Source';
    return 'High Textual Integrity';
  }, [activeScroll]);

  // Stepped Review Logs
  const reviewSteps = [
    `🏺 Accessing Qumran Cave Archives for Scroll '${activeScroll.code}: ${activeScroll.title}'...`,
    `🔬 Applying ${irWavelength}nm Multispectral Infrared Imaging to unmask faded carbon ink...`,
    `🧪 Calibrating Carbon-14 radiocarbon dating window (${activeScroll.dateRange})...`,
    `✍️ Verifying ${activeScroll.scriptType} paleographic script characteristics...`,
    `📊 Multi-spectral legibility achieved: ${irInksUnmasked}% contrast unmasked.`,
    `📜 Dead Sea Scrolls Fellowship Council approved grant for Scholar Fellow.`
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
          showToast("Dead Sea Scrolls Fellowship Approved & Certified!");
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
    const noteId = `dss-schol-${Date.now()}`;
    const newNote = {
      id: noteId,
      title: `🏺 Dead Sea Scrolls Fellowship Decree (${activeScroll.code})`,
      content: `## DEAD SEA SCROLLS FELLOWSHIP DECREE\n\n### Fellow Profile\n* **Scholar Fellow:** ${scholarName}\n* **Primary Scroll:** ${activeScroll.code} - ${activeScroll.title} (${activeScroll.cave})\n* **Specialization:** ${specialization}\n* **Multispectral IR Legibility:** ${irInksUnmasked}%\n* **Script Classification:** ${activeScroll.scriptType}\n* **Textual Fidelity:** ${textualFidelityIndex}\n\n### Thesis Proposal\n"${thesisStatement}"\n\n### Scroll Inscription Examination\n* **Hebrew/Aramaic Text:** ${activeScroll.hebrewFragment}\n* **Translation:** ${activeScroll.translatedFragment}\n* **Variant Analysis:** ${activeScroll.textualVariantNote}\n\n### Fellowship Certification\nConferred by the Qumranic Paleography & Textual Criticism Board. Granted full research access to the Judean Desert scroll fragments and high-resolution multispectral imagery.`,
      school: "Dead Sea Scrolls Research Fellowship",
      color: "bg-[#292219]/95 border-amber-800/45",
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
    showToast("Dead Sea Scrolls Fellowship Decree saved to Grimoire Notes! 📜");
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
                : 'bg-amber-950/95 border-amber-500/50 text-amber-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold tracking-wide font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border bg-black/40 ${
        activeTheme.id === 'deep-void' ? 'border-purple-500/20' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/20' : 'border-amber-500/20'
      } relative overflow-hidden flex flex-col md:flex-row items-center gap-6`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center border shrink-0 ${
          activeTheme.id === 'deep-void' 
            ? 'bg-purple-950/30 border-purple-500/35 text-purple-300' 
            : activeTheme.id === 'ethereal-silver'
            ? 'bg-slate-900/30 border-slate-500/35 text-slate-300'
            : 'bg-amber-950/30 border-amber-500/35 text-amber-400'
        }`}>
          <Scroll className="w-9 h-9 animate-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
              Qumranic Paleography & Textual Criticism Fellowship
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-wider ${activeTheme.textPrimary} mb-2`}>
            Dead Sea Scrolls Scholarship
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            Explore the monumental discoveries of the Qumran Caves (1947–1956). Utilize multispectral infrared imaging to unmask ancient carbon ink on blackened parchment, analyze Hasmonaean and Herodian Hebrew paleography, and collate textual variants between Qumran, the Masoretic Text, and the Septuagint.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Scroll Workbench & Multispectral Imaging (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Scroll Selector */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-wider text-slate-200 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                Select Qumran Scroll Corpus
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Caves 1, 4, 11</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUMRAN_SCROLLS.map((sc, sIdx) => {
                const isSelected = sc.id === selectedScrollId;
                return (
                  <button
                    key={`${sc.id}-${sIdx}`}
                    onClick={() => setSelectedScrollId(sc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-950/30'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                          {sc.code}
                        </span>
                        <span className="text-slate-500">{sc.language}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{sc.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                      "{sc.translatedFragment}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multispectral Examination Workbench */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">{activeScroll.cave}</span>
                <h3 className="text-base font-bold text-slate-100">{activeScroll.code} — {activeScroll.title}</h3>
                <span className="text-xs text-slate-400 italic">Estimated Date: {activeScroll.dateRange}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                {activeScroll.scriptType}
              </span>
            </div>

            {/* Inscription Display with Multispectral Effect */}
            <div className="p-4 rounded-xl bg-black/80 border border-amber-500/30 flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono border-b border-amber-900/40 pb-1.5">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Multispectral Infrared Inspection ({irWavelength}nm)
                </span>
                <span className="text-slate-400">{paleoFilter} Filter</span>
              </div>

              {/* Hebrew Fragment Inscription Box */}
              <div className={`p-4 rounded-lg border text-right font-mono transition-all duration-300 ${
                paleoFilter === 'Binarized IR'
                  ? 'bg-black text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] text-base font-bold'
                  : 'bg-amber-950/20 text-slate-100 border-amber-900/40 text-sm'
              }`}>
                {activeScroll.hebrewFragment}
              </div>

              {/* English Translation */}
              <p className="text-xs text-slate-300 italic pt-1 leading-relaxed">
                "{activeScroll.translatedFragment}"
              </p>
            </div>

            {/* Textual Variant Note */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/25 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">Textual Variant Analysis</span>
                <p className="text-xs text-amber-200 font-medium mt-1 leading-relaxed">
                  {activeScroll.textualVariantNote}
                </p>
              </div>
            </div>

            {/* Multispectral Tuning Controls */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-4 mt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Microscope className="w-3.5 h-3.5 text-amber-400" />
                Multispectral Imaging & Radiocarbon Calibration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* IR Wavelength Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Infrared Spectrum</span>
                    <span className="font-mono text-amber-400 font-bold">{irWavelength} nm</span>
                  </div>
                  <input
                    type="range"
                    min="700"
                    max="950"
                    step="10"
                    value={irWavelength}
                    onChange={(e) => setIrWavelength(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <span className="text-[9px] text-slate-500 italic">Unmasks faded carbon ink on dark leather</span>
                </div>

                {/* Paleo Filter Toggle */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400 text-[11px]">Infrared Processing Mode</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Standard', 'Contrast Enhanced', 'Binarized IR'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaleoFilter(mode)}
                        className={`py-1 px-1.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                          paleoFilter === mode
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {mode.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Computed Metrics Header */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">IR Ink Legibility</span>
                  <span className="text-sm font-bold font-mono text-amber-300">{irInksUnmasked}%</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">C-14 Confidence</span>
                  <span className="text-[10px] font-bold font-mono text-emerald-300 truncate block mt-0.5">{carbonCalibrationConfidence}</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Textual Fidelity</span>
                  <span className="text-[10px] font-bold font-mono text-cyan-300 truncate block mt-0.5">{textualFidelityIndex}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Application & Fellowship Certificate (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {!isAccepted ? (
            /* Fellowship Application Form */
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col gap-5">
              <div className="border-b border-white/10 pb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Fellowship Application</h3>
                  <p className="text-xs text-slate-400">Submit proposed research to the Qumran Fellowship Board</p>
                </div>
              </div>

              <form onSubmit={handleApply} className="flex flex-col gap-4">
                
                {/* Fellow Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Scholar Fellow Name</label>
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    required
                    placeholder="Enter your name or academic title..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Research Specialization */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Qumranic Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Proto-Masoretic Textual Criticism & Qumranic Variant Collation">Proto-Masoretic Textual Criticism & Qumranic Variant Collation</option>
                    <option value="Essene Covenant Rule, Solar Calendar & Ritual Purification">Essene Covenant Rule, Solar Calendar & Ritual Purification</option>
                    <option value="Aramaic Apocalyptic Fragments & Messianic Titles (4Q246)">Aramaic Apocalyptic Fragments & Messianic Titles (4Q246)</option>
                    <option value="Hasmonaean & Herodian Hebrew Paleography Studies">Hasmonaean & Herodian Hebrew Paleography Studies</option>
                    <option value="Multispectral Infrared Imaging & Parchment Preservation">Multispectral Infrared Imaging & Parchment Preservation</option>
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
                    placeholder="Describe your textual or paleographic hypothesis..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
                  />
                </div>

                {/* Integrity Pledge */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="pledge-dss"
                    checked={pledgedIntegrity}
                    onChange={(e) => setPledgedIntegrity(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/20"
                  />
                  <label htmlFor="pledge-dss" className="text-[11px] text-slate-400 cursor-pointer leading-snug">
                    I pledge to uphold academic integrity, paleographic precision, and respectful stewardship of the Qumran scroll legacy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !scholarName.trim() || !pledgedIntegrity}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-500 hover:to-yellow-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Authenticating Scroll Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Qumran Fellowship Application</span>
                    </>
                  )}
                </button>
              </form>

              {/* Stepped Review Logs */}
              {submitLogs.length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/30 flex flex-col gap-2 font-mono text-[11px]">
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold border-b border-amber-900/40 pb-1">
                    Qumranic Review Protocol Log
                  </span>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                    {submitLogs.map((log, idx) => (
                      <div key={idx} className="text-amber-300 leading-snug">
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
              className="p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/40 via-black to-amber-950/20 backdrop-blur-md flex flex-col gap-5 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Corner Seal */}
              <div className="absolute top-3 right-3 opacity-15 pointer-events-none">
                <Award className="w-24 h-24 text-amber-400" />
              </div>

              <div className="text-center border-b border-amber-500/30 pb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-2 shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">Official Decree of Fellowship</span>
                <h3 className="text-xl font-bold text-amber-100 font-serif mt-1">Dead Sea Scrolls Research Fellow</h3>
                <p className="text-xs text-slate-300 italic mt-0.5">Conferred by the Qumranic Paleography Board</p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-lg bg-black/60 border border-amber-500/20 flex flex-col gap-1 font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">FELLOW NAME:</span>
                    <span className="text-amber-300 font-bold">{scholarName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">PRIMARY SCROLL:</span>
                    <span className="text-slate-200">{activeScroll.code} ({activeScroll.title})</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">IR UNMASKED LEGIBILITY:</span>
                    <span className="text-amber-400 font-bold">{irInksUnmasked}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">SCRIPT STYLE:</span>
                    <span className="text-slate-300 font-bold">{activeScroll.scriptType}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20">
                  <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">Approved Thesis Hypothesis</span>
                  <p className="text-slate-200 italic font-serif">"{thesisStatement}"</p>
                </div>
              </div>

              {/* Certificate Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleSaveToGrimoire}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/40"
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
    </div>
  );
}
