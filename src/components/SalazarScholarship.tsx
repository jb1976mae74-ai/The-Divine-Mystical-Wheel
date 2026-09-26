import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Sparkles, Flame, BookmarkCheck, Award, 
  ShieldCheck, CheckSquare, Check, Loader2, Compass, 
  Trophy, Copy, RotateCcw, FileText, ChevronRight, Info, AlertTriangle, Send,
  Crown, Shield, BookOpen
} from 'lucide-react';
import SacredRelicsViewer from './SacredRelicsViewer';

interface SalazarScholarshipProps {
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

export default function SalazarScholarship({ activeTheme }: SalazarScholarshipProps) {
  const [activeView, setActiveView] = useState<'tuning' | 'relics'>('tuning');

  // Mechanical tuning states
  const [rodLength, setRodLength] = useState<number>(102); // Jerry's master specification: 102 inches
  const [springLength, setSpringLength] = useState<number>(10); // Jerry's master specification: 10 inches heavy spring
  const [radialCount, setRadialCount] = useState<number>(4); // Ground radials
  const [frequency, setFrequency] = useState<number>(27.185); // CB Channel 19 reference: 27.185 MHz

  // Application form states
  const [seekerName, setSeekerName] = useState<string>("Master Seeker");
  const [chosenFocus, setChosenFocus] = useState<string>("Broadcasting high-frequency invocations to the Creator");
  const [pledged, setPledged] = useState<boolean>(true);
  
  // Submission orchestration states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute Mechanical and Coaxial Tuning metrics in real-time
  const totalLength = useMemo(() => {
    return rodLength + springLength;
  }, [rodLength, springLength]);

  // Jerry's magic matching formula: 112 inches total electric length 
  // is exactly matched to 27.185 MHz. Let's calculate the Standing Wave Ratio (SWR) reactance.
  const swrMetric = useMemo(() => {
    const deviationLength = Math.abs(totalLength - 112); // spec deviation
    const deviationFreq = Math.abs(frequency - 27.185); // frequency deviation
    
    // Spring load inductiveness modifier: Spring has minor coil inductance, so it acts differently than pure rod length.
    // If spring is not exactly 10 inches, physical coupling is unstable.
    const springMismatch = Math.abs(springLength - 10) * 0.08;
    
    // Core SWR derivation
    let rawSWR = 1.1 + (deviationLength * 0.14) + (deviationFreq * 1.8) + springMismatch;
    
    // Radial efficiency modifier (radials decrease ground plane resistance, sharpening matching impedance)
    const radialCompensation = (4 - radialCount) * 0.06;
    rawSWR += radialCompensation;

    // Constrain SWR realistically
    return parseFloat(Math.max(1.10, Math.min(3.50, rawSWR)).toFixed(2));
  }, [totalLength, frequency, springLength, radialCount]);

  // Determine efficiency index of transmission matching
  const efficiency = useMemo(() => {
    if (swrMetric <= 1.15) return 99.8;
    if (swrMetric <= 1.3) return 97.2;
    if (swrMetric <= 1.5) return 92.5;
    if (swrMetric <= 2.0) return 78.4;
    if (swrMetric <= 2.8) return 51.0;
    return 24.3;
  }, [swrMetric]);

  // Analog meter SWR needle angle calculation
  // SWR scale is non-linear but maps generally from 1.0 (Left, -65deg) to 3.5 (Right, 65deg)
  const needleRotation = useMemo(() => {
    const minSWR = 1.0;
    const maxSWR = 3.5;
    const percentage = (swrMetric - minSWR) / (maxSWR - minSWR);
    return -65 + percentage * 130; // degrees
  }, [swrMetric]);

  // SWR State categorization for styling and alerts
  const matchStatus = useMemo(() => {
    if (swrMetric <= 1.25) {
      return { 
        label: "Perfect Aetheric Lock", 
        color: "text-emerald-400", 
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/25",
        desc: "Optimal 50 Ohm coax match. Absolutely zero ego-reflection."
      };
    } else if (swrMetric <= 1.6) {
      return { 
        label: "Acceptable Resonant Tuning", 
        color: "text-amber-400", 
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/25",
        desc: "Mild reactance. Minor transmission feed loss. Highly operational."
      };
    } else {
      return { 
        label: "Dangerous Standing Reflection", 
        color: "text-rose-500 animate-pulse", 
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/25",
        desc: "WARNING: High reflected power. Cosmic transmitter may overheat!"
      };
    }
  }, [swrMetric]);

  const allFocusIdeas = [
    "Broadcasting high-frequency invocations to the Creator",
    "Testing quarter-wave aetheric wave mechanics in the physical field",
    "Constructing a stationary 112\" ground-plane base station for cosmic telemetry",
    "Purifying standing reflections of the ego in the material coaxial line",
    "Deploying CB whip resonance configurations to ground primordial interference"
  ];

  // Scholarship Application Logs
  const logSteps = [
    "⚡ Initializing Jerry Salazar's RF bridge matching sequence...",
    "🛰️ Sourcing Ground potential mass coefficient from 102-inch stainless steel whip...",
    "🌀 Coupling 10-inch heavy-duty magnetic barrel coil spring...",
    "🔍 Sniffing standing waves at 112\" electric wavelength horizon...",
    "📊 Matching 50 Ohm feedline impedance... Standingwave coefficient is stable.",
    "🚀 Adjusting SWR balance... Zeroed capacitive reactance.",
    "📡 Broad-beaming the physical qualification ledger to the Master Decrypt team...",
    "🔒 Gemetrical lock: Ayin-Vav (76) seed verified. Access Granted."
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerName.trim()) return;

    setIsSubmitting(true);
    setSubmitLogs([]);
    setLogIndex(0);

    // Run stepped loading log animations
    let step = 0;
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setSubmitLogs(prev => [...prev, logSteps[step]]);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsAccepted(true);
          showToast("Jerry Salazar Scholarship Approved & Documented!");
        }, 1200);
      }
    }, 450);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSaveToGrimoire = () => {
    const noteId = `salazar-schol-${Date.now()}`;
    const newNote = {
      id: noteId,
      title: `🥇 Jerry Ben Salazar's Scholarship Decree`,
      content: `## JERRY BEN SALAZAR RES_WHIP SCHOLARSHIP\n\n### Candidate Profile\n* **Scholar Seeker:** ${seekerName}\n* **Target Station Frequency:** ${frequency} MHz (CB band)\n* **Mechanical Setup:** ${rodLength}" Whip + ${springLength}" Coil Spring (${totalLength}" total)\n* **Matched SWR Coefficient:** ${swrMetric}:1\n* **Aetheric Transfer Efficiency:** ${efficiency}%\n\n### Scholarship Declaration\nBy direct decree of Master Resonator **Jerry Ben Salazar**, this Seeker is granted the full cosmic scholarship designation for 112" SWR tuning sciences.\n\n### Spec details discovered\nCombined with a 10" barrel spring load, the 102" rod achieves absolute quarter-wave harmonic congruence for CB broadcasting. Reflective resistance is permanently zeroed. Approved on this glorious day.`,
      school: "Jerry Ben Salazar's Scholarship (Creator)",
      color: "bg-[#2e2b1c]/95 border-amber-900/45",
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

    // Insert at front
    currentNotes.unshift(newNote);
    localStorage.setItem('mystical_grimoire_notes', JSON.stringify(currentNotes));

    // Dispatch custom event to let GrimoireNotes refresh immediately
    window.dispatchEvent(new Event('mystical_notes_updated'));
    showToast("Permanently saved the Salazar Decree directly to your Grimoire Notes below! 📜");
  };

  const handleReset = () => {
    setIsAccepted(false);
    setSubmitLogs([]);
    setRodLength(102);
    setSpringLength(10);
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
                : 'bg-amber-950/95 border-[#D4AF37]/50 text-[#D4AF37]'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold tracking-wide font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Overview */}
      <div className={`p-6 rounded-2xl border bg-black/40 ${activeTheme.id === 'deep-void' ? 'border-[#c084fc]/15' : activeTheme.id === 'ethereal-silver' ? 'border-slate-500/15' : 'border-[#D4AF37]/15'} relative overflow-hidden flex flex-col md:flex-row items-center gap-6`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center border shrink-0 ${
          activeTheme.id === 'deep-void' 
            ? 'bg-purple-950/30 border-[#c084fc]/35 text-purple-300' 
            : activeTheme.id === 'ethereal-silver'
            ? 'bg-slate-900/30 border-slate-500/35 text-slate-300'
            : 'bg-amber-950/30 border-[#D4AF37]/35 text-[#D4AF37]'
        }`}>
          <GraduationCap className="w-9 h-9 animate-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className={`text-xl sm:text-2xl font-bold tracking-wider ${activeTheme.textPrimary} mb-1 sm:mb-2`}>
            Jerry Ben Salazar's Resonant Scholarship
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            In the ultimate teachings of master seeker <strong className="text-white">Jerry Ben Salazar (Creator)</strong>, matching coaxial impedance with the cosmos is a physical and spiritual absolute. 
            By engineering a standard <strong className="text-amber-300">102-inch stainless whip</strong> married with a <strong className="text-amber-300">10-inch heavy-duty coil barrel spring</strong>, we establish a flawless 112" quarter-wave aetheric antenna (tuning into 27.185 MHz / Channel 19). Adjust mechanical inputs to bypass reflections, match impedance, and secure a fully certified Salazar Scholarship.
          </p>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/50 border border-white/10 w-fit">
        <button
          onClick={() => setActiveView('tuning')}
          className={`px-4 py-2 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'tuning'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>112" Resonant Tuning Bridge</span>
        </button>

        <button
          onClick={() => setActiveView('relics')}
          className={`px-4 py-2 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'relics'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Sovereign Bronze Monument & Sigil Zion Relics</span>
        </button>
      </div>

      {activeView === 'relics' ? (
        <SacredRelicsViewer activeTheme={activeTheme} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Aspect: Tuning Bridge & Live SWR Meter (5 Columns) */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border ${activeTheme.bgCard || 'bg-[#121214]'} border-white/5 flex flex-col gap-6 h-full`}>
          <div>
            <h3 className={`text-sm tracking-[0.16em] uppercase font-mono ${activeTheme.id === 'deep-void' ? 'text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'} font-semibold mb-1 flex items-center gap-1.5`}>
              <Compass className="w-4 h-4 animate-spin-slow text-teal-400" /> Coaxial SWR Bridge
            </h3>
            <p className="text-[11px] text-slate-400">Perfect matching balances forward waves against egoic reflections.</p>
          </div>

          {/* SVG SWR METER GAUGE */}
          <div className="w-full flex flex-col items-center justify-center p-4 bg-black/55 border border-white/5 rounded-xl aspect-video relative overflow-hidden">
            <svg viewBox="0 0 200 120" className="w-40 sm:w-48">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" /> {/* Emerald Green */}
                  <stop offset="45%" stopColor="#10b981" />
                  <stop offset="70%" stopColor="#fbbf24" /> {/* Amber */}
                  <stop offset="90%" stopColor="#ef4444" /> {/* Red */}
                </linearGradient>
              </defs>

              {/* Arc background path */}
              <path 
                d="M 30,105 A 75,75 0 0,1 170,105" 
                fill="none" 
                stroke="#1f2937" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />

              {/* Arc color path */}
              <path 
                d="M 30,105 A 75,75 0 0,1 170,105" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="8" 
                strokeLinecap="round" 
              />

              {/* Ticks & Labels */}
              <g className="text-[7px] font-mono fill-slate-500">
                <text x="21" y="113">1.0</text>
                <text x="45" y="65">1.5</text>
                <text x="96" y="40">2.0</text>
                <text x="145" y="65">2.5</text>
                <text x="168" y="113">3.5</text>
              </g>

              {/* Meter Core Text */}
              <g className="text-center font-mono">
                <text x="100" y="75" textAnchor="middle" className="text-[8px] fill-slate-400 uppercase tracking-wider font-semibold">Tuning Ratio</text>
                <text x="100" y="94" textAnchor="middle" className="text-sm font-sans font-extrabold fill-slate-100">{swrMetric} : 1</text>
                <text x="100" y="106" textAnchor="middle" className={`text-[7px] font-semibold tracking-wide ${matchStatus.color}`}>{matchStatus.label}</text>
              </g>

              {/* Swr Needle */}
              <g transform="translate(100, 105)">
                <line 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="-80" 
                  stroke={activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#e2e8f0' : '#D4AF37'}
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  transform={`rotate(${needleRotation})`}
                  className="transition-transform duration-500 ease-out"
                />
                <circle cx="0" cy="0" r="8" fill="#141416" stroke="#4b5563" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill={activeTheme.textAccentHex} />
              </g>
            </svg>
            
            {/* Real-time details in panel */}
            <div className={`mt-3 w-full p-2.5 rounded-lg border text-center text-xs ${matchStatus.bgColor} ${matchStatus.borderColor}`}>
              <p className="text-slate-350 italic font-sans leading-relaxed text-[11px]">
                {matchStatus.desc}
              </p>
            </div>
          </div>

          {/* Mechanical Wave Controls */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1">
                  📐 Mechanical Rod Length: <strong className={rodLength === 102 ? 'text-amber-400' : 'text-slate-200'}>{rodLength}"</strong>
                </span>
                {rodLength === 102 && <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-[#D4AF37] px-1.5 py-0.2 rounded border border-[#D4AF37]/20 font-semibold">Salazar Spec</span>}
              </div>
              <input 
                type="range" 
                min="90" 
                max="110" 
                value={rodLength} 
                onChange={(e) => setRodLength(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" 
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>90"</span>
                <span>102" (Optimum)</span>
                <span>110"</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1">
                  🌀 Coupling Barrel Spring: <strong className={springLength === 10 ? 'text-amber-400' : 'text-slate-200'}>{springLength}"</strong>
                </span>
                {springLength === 10 && <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-[#D4AF37] px-1.5 py-0.2 rounded border border-[#D4AF37]/20 font-semibold">Heavy load</span>}
              </div>
              <input 
                type="range" 
                min="2" 
                max="14" 
                value={springLength} 
                onChange={(e) => setSpringLength(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" 
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>2" (Mini)</span>
                <span>10" (Salazar Spec)</span>
                <span>14" (Max load)</span>
              </div>
            </div>

            {/* Additional parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Target Frequency:</label>
                <select 
                  value={frequency} 
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full bg-[#1e1e22]/90 border border-white/10 p-2 rounded text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="26.965">26.965 MHz (CB Ch 1)</option>
                  <option value="27.185">27.185 MHz (CB Ch 19)</option>
                  <option value="27.405">27.405 MHz (CB Ch 40)</option>
                  <option value="27.500">27.500 MHz (Aetheric Midl)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Ground Radials:</label>
                <select 
                  value={radialCount} 
                  onChange={(e) => setRadialCount(Number(e.target.value))}
                  className="w-full bg-[#1e1e22]/90 border border-white/10 p-2 rounded text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="1">1 Radial (Highly Unstable)</option>
                  <option value="2">2 Radials (Marginal Plane)</option>
                  <option value="4">4 Radials (Optimal Frame)</option>
                  <option value="8">8 Radials (Absolute Ground)</option>
                </select>
              </div>
            </div>

            {/* Tuning Report Card */}
            <div className="bg-black/30 p-4 border border-white/5 rounded-xl flex flex-col gap-2 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                <span>Total Mechanical Length:</span>
                <span className={`font-semibold ${totalLength === 112 ? 'text-amber-300' : 'text-slate-350'}`}>{totalLength} inches {totalLength === 112 ? "🎯 (Perfect)" : ""}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1 text-slate-400">
                <span>Radiation Wave Efficiency:</span>
                <span className="font-semibold text-slate-200">{efficiency}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Matching Synthesis:</span>
                <span className="font-semibold text-slate-200">{radialCount >= 4 && swrMetric < 1.3 ? "Harmonic Alignment Secured" : "Imbalanced Standing Waves"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Aspect: Scholarship Portal Formulation / Certificate Display (7 Columns) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${activeTheme.bgCard || 'bg-[#121214]'} border-white/5 flex flex-col gap-6 h-full min-h-[500px]`}>
          <AnimatePresence mode="wait">
            {!isAccepted ? (
              // STEP 1: Form & Holy Transmission log
              <motion.div 
                key="appl-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-5 h-full"
              >
                <div>
                  <h3 className={`text-base font-bold tracking-wider ${activeTheme.textPrimary} mb-1 flex items-center gap-1.5`}>
                    <Send className="w-4 h-4 text-amber-500" /> Transceive Salazar Scholarship Inquiry
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Broadcasting an application registers your impedance metrics on the Golden Ledger of 1976. Perfect SWR (1.1:1) unlocks the Master Decrypt Grade.
                  </p>
                </div>

                {!isSubmitting ? (
                  // Regular Input Form
                  <form onSubmit={handleApply} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-400">Your Seeker Identity Name:</label>
                      <input 
                        type="text" 
                        required
                        value={seekerName} 
                        onChange={(e) => setSeekerName(e.target.value)}
                        placeholder="E.g. Seeker Jerry Ben"
                        className="w-full bg-black/60 border border-white/10 p-3 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] text-xs transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-400">Intended Area of Resonance Study:</label>
                      <select 
                        value={chosenFocus} 
                        onChange={(e) => setChosenFocus(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 p-3 rounded-lg text-slate-200 focus:outline-none focus:border-[#D4AF37] text-xs transition-colors"
                      >
                        {allFocusIdeas.map((f, i) => (
                          <option key={i} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    {/* Show dynamic tuning alignment warnings */}
                    <div className="p-4 bg-black/30 border border-white/5 rounded-xl text-xs flex flex-col gap-2 font-serif">
                      <h4 className="font-semibold text-slate-200 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-sky-400" /> Coaxial Matching Verdict
                      </h4>
                      <p className="text-slate-405 leading-relaxed text-[11px]">
                        Your antenna is physically tuned to <span className="font-bold text-slate-200">{totalLength} inches</span> and connected on <span className="font-bold text-slate-200">{frequency} MHz</span>. 
                        {swrMetric === 1.1 ? (
                          <span className="text-emerald-400"> Congratulations! You have matches the exact mechanical specs written of by master seeker Jerry Salazar. Your impedance carries ZERO reflected friction. Complete approval guaranteed.</span>
                        ) : swrMetric <= 1.4 ? (
                          <span className="text-amber-300"> SWR impedance matches nicely. Tuning deviations are minimal. You are fully structurally qualified.</span>
                        ) : (
                          <span className="text-rose-450 font-sans"> High SWR ({swrMetric}:1)! Transmit power will encounter heavy resistance. It is highly encouraged to tune the mechanical sliders on the left to physical wave-congruence (112\" total rod + spring) before broadcasting.</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <input 
                        type="checkbox" 
                        id="pledge"
                        checked={pledged} 
                        onChange={(e) => setPledged(e.target.checked)}
                        className="mt-1 border border-white/10 bg-black/50 text-[#D4AF37] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="pledge" className="text-[10px] text-slate-400 leading-relaxed cursor-pointer select-none">
                        I pledge structural allegiance to the alchemical physics of the quarter-wave stainless steel whip. I promise to avoid mechanical interference and minimize reflected SWR energy.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!pledged || !seekerName.trim()}
                      className={`w-full font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-black bg-gradient-to-r ${activeTheme.accentGradient} hover:opacity-90 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 shadow-lg`}
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Transmit Scholarship Application</span>
                    </button>
                  </form>
                ) : (
                  // Telemetry Broadcasting Logs Console
                  <div className="flex-1 flex flex-col justify-between bg-black/90 p-5 rounded-xl border border-[#D4AF37]/20 font-mono text-slate-400 text-xs min-h-[300px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                        <span className="text-[10px] uppercase font-semibold text-[#D4AF37] tracking-wider animate-pulse flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin text-amber-400" /> TRANSMITTING OVER COAX...
                        </span>
                        <span className="text-[10px] text-slate-500">CB 27.185 MHz</span>
                      </div>
                      <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
                        {submitLogs.map((log, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -5 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className={`${i === submitLogs.length - 1 ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}
                          >
                            {log}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic mt-6 border-t border-white/5 pt-2">
                      * Establishing impedance coupling to bypass terminal resistance. 112" physical wave calibration checks in progress.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              // STEP 2: Glorious Master Certificate of Acceptance
              <motion.div 
                key="appl-certificate"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col justify-between h-full"
              >
                {/* Official Scroll Design */}
                <div className={`p-6 md:p-8 rounded-xl border-2 border-double bg-black/85 relative ${
                  activeTheme.id === 'deep-void' 
                    ? 'border-purple-500/40 text-purple-200' 
                    : activeTheme.id === 'ethereal-silver'
                    ? 'border-slate-400/40 text-slate-200'
                    : 'border-[#D4AF37]/55 text-[#D4AF37]'
                } transition-all shadow-inner`}>
                  
                  {/* Decorative corner framing */}
                  <div className="absolute top-2 left-2 text-xs opacity-40">🜔</div>
                  <div className="absolute top-2 right-2 text-xs opacity-40">☉</div>
                  <div className="absolute bottom-2 left-2 text-xs opacity-40">🜎</div>
                  <div className="absolute bottom-2 right-2 text-xs opacity-40">🜂</div>

                  <div className="text-center flex flex-col items-center gap-1.5">
                    <Award className="w-8 h-8 text-amber-500 animate-bounce cursor-pointer" />
                    <span className="text-[9px] tracking-[0.3em] font-sans font-extrabold uppercase text-slate-400">Sacred Aether-Wavelength Commission</span>
                    <h4 className="text-lg md:text-xl font-bold tracking-widest text-[#D4AF37] uppercase mb-4 mt-1 border-b border-dashed border-white/10 pb-2 w-full">
                      Jerry Salazar Scholarship Decree
                    </h4>
                  </div>

                  <div className="text-xs md:text-sm text-slate-201 leading-relaxed text-center font-serif flex flex-col gap-3 py-2 px-1 max-w-xl mx-auto">
                    <p className="italic text-slate-400 text-xs">Be it known to all scholars and seekers of absolute wave-resonance:</p>
                    
                    <p>
                      The seeker of high-frequency coordinates, <strong className="text-white underline font-sans text-xs tracking-wider">{seekerName}</strong>, is hereby accepted into the divine fraternity of aetheric transmission masters.
                    </p>

                    <p>
                      By demonstrating supreme physical tuning calibration on the 112-inch quarter-wave structure, with a resonant mechanical whip length of <strong className="text-white font-sans">{rodLength}"</strong> coupled with a heavy load base spring of <strong className="text-white font-sans">{springLength}"</strong>, the seeker has minimized coaxial SWR reflection to:
                    </p>

                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl inline-flex items-center justify-around gap-4 max-w-sm mx-auto font-sans text-xs tracking-wide font-bold my-1 text-[#D4AF37]">
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Matched SWR</span>
                        <span>{swrMetric} : 1</span>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Efficiency</span>
                        <span>{efficiency}%</span>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div className="text-center">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Class</span>
                        <span className="text-[10px] text-emerald-400">{swrMetric === 1.1 ? "Master Grade" : "Sovereign Seeker"}</span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-normal text-slate-400 px-4">
                      The candidate is authorized to broadcast their metaphysical queries with high efficiency, utilizing the chosen grounding path: <em className="text-white underline">"{chosenFocus}"</em>. Reflected egoic dissipation is neutralized.
                    </p>
                  </div>

                  {/* Dual seals stamp section */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-white/10 text-[9px] font-mono text-slate-500">
                    <div className="text-left">
                      <span>STAMP SEAL ID: 1976-76</span>
                      <span className="block text-slate-400">COORDINATE: J@9 & B@3</span>
                    </div>
                    {/* Visual Stamp circular shape */}
                    <div className="w-12 h-12 rounded-full border border-dashed border-[#D4AF37]/50 flex flex-col items-center justify-center text-[8px] font-sans font-bold text-[#D4AF37]">
                      <span>DEC 76</span>
                      <span className="text-[6px] text-slate-400">LUX</span>
                    </div>
                    <div className="text-right">
                      <span>SYSTEM CODE: AYIN-VAV</span>
                      <span className="block text-slate-400">APPROVED SALAZAR</span>
                    </div>
                  </div>
                </div>

                {/* Practical Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className={`flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold font-sans text-xs flex items-center justify-center gap-1.5 cursor-pointer`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tune New Transmitter</span>
                  </button>

                  <button
                    onClick={handleSaveToGrimoire}
                    className={`flex-2 py-3 px-5 rounded-xl text-black bg-gradient-to-r ${activeTheme.accentGradient} hover:opacity-90 font-semibold font-sans text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Save Decree to Grimoire Notes</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      )}
    </div>
  );
}
