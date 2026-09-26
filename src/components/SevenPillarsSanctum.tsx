import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Sparkles, Volume2, VolumeX, Check, Copy, 
  ShieldCheck, ArrowUpRight, Scale, Orbit, Compass, Award, Activity
} from 'lucide-react';
import { SEVEN_PILLARS_OF_WISDOM } from '../data/wisdomArchitectData';
import { WisdomPillar } from '../types/wisdomArchitect';

interface SevenPillarsSanctumProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function SevenPillarsSanctum({ activeTheme }: SevenPillarsSanctumProps) {
  const [selectedPillar, setSelectedPillar] = useState<WisdomPillar>(SEVEN_PILLARS_OF_WISDOM[0]);
  const [playingToneHz, setPlayingToneHz] = useState<number | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const [copiedPillar, setCopiedPillar] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Web Audio Tone Resonator
  const togglePlayTone = (hz: number) => {
    if (playingToneHz === hz) {
      // Stop
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        setTimeout(() => {
          oscillator?.stop();
          setPlayingToneHz(null);
        }, 300);
      } else {
        setPlayingToneHz(null);
      }
      return;
    }

    // Stop current if any
    if (oscillator) {
      try {
        oscillator.stop();
      } catch (e) {}
    }

    try {
      const ctx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) setAudioCtx(ctx);

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      setOscillator(osc);
      setGainNode(gain);
      setPlayingToneHz(hz);
    } catch (err) {
      console.warn('Audio tone synthesis error:', err);
    }
  };

  const copyPillarText = (p: WisdomPillar) => {
    const text = `[THE SEVEN PILLARS OF WISDOM - PILLAR ${p.pillarNumber}: ${p.title}]\nHebrew: ${p.hebrewName} (${p.transliteration})\nCanonical Verse: ${p.canonicalVerse}\nScripture: ${p.scripturalFoundations.join(' | ')}\nArchitectural Function: ${p.architecturalFunction}\nGeometric Proof: ${p.geometricProof}\nHarmonic Frequency: ${p.frequencyHz} Hz\nLiturgical Formula: ${p.liturgicalFormula}`;
    navigator.clipboard.writeText(text);
    setCopiedPillar(p.id);
    setTimeout(() => setCopiedPillar(null), 2500);
  };

  const speakPillar = (p: WisdomPillar) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Pillar ${p.pillarNumber}: ${p.title}. ${p.epithet}. ${p.description} Liturgical formula: ${p.liturgicalFormula}`
    );
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="seven-pillars-sanctum-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  The Seven Hewn Pillars of Wisdom
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  Proverbs 9:1
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                "Wisdom hath builded her house, she hath hewn out her seven pillars." (חָכְמוֹת בָּנְתָה בֵיתָהּ חָצְבָה עַמּוּדֶיהָ שִׁבְעָה)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Cosmic Colonnade Status:</span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Structural Integrity
            </span>
          </div>
        </div>

        {/* 7 Pillars Visual Colonnade Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          {SEVEN_PILLARS_OF_WISDOM.map((p) => {
            const isSelected = selectedPillar.id === p.id;
            return (
              <button
                key={p.id}
                id={`btn-pillar-${p.pillarNumber}`}
                onClick={() => setSelectedPillar(p)}
                className={`relative group rounded-xl p-3 text-left transition-all border flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-lg shadow-amber-950/60 scale-[1.02]'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Visual Pillar Pillar Top Cap */}
                <div 
                  className="h-1.5 w-full rounded-full mb-2 transition-opacity"
                  style={{ backgroundColor: p.colorHex, opacity: isSelected ? 1 : 0.4 }}
                />

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="font-bold text-amber-400">Pillar 0{p.pillarNumber}</span>
                    <span className="text-[10px] text-neutral-400">{p.frequencyHz}Hz</span>
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-2 text-neutral-200 group-hover:text-white">
                    {p.title.replace('The ', '')}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400/80 truncate">
                    {p.transliteration.split(' ')[0]}
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.colorHex }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pillar Detailed Architectural Dossier */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPillar.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Inspection Chamber (8 Cols) */}
          <div className="lg:col-span-8 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-6">
            {/* Header with Title & Audio Tools */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
                    PILLAR 0{selectedPillar.pillarNumber} OF 07
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {selectedPillar.frequencyHz} Hz Resonator
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-100 mt-1">
                  {selectedPillar.title}
                </h2>
                <div className="text-sm font-serif text-amber-400/90 mt-0.5">
                  {selectedPillar.hebrewName} • <span className="italic font-sans text-neutral-300">{selectedPillar.transliteration}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-play-pillar-tone"
                  onClick={() => togglePlayTone(selectedPillar.frequencyHz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                    playingToneHz === selectedPillar.frequencyHz
                      ? 'bg-amber-500 text-black border-amber-400 font-bold animate-pulse'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-amber-200 border-amber-500/30'
                  }`}
                  title="Resonate Pillar Acoustic Tone"
                >
                  {playingToneHz === selectedPillar.frequencyHz ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {playingToneHz === selectedPillar.frequencyHz ? 'Sounding Tone' : `Sound ${selectedPillar.frequencyHz}Hz`}
                </button>

                <button
                  onClick={() => speakPillar(selectedPillar)}
                  className={`p-2 rounded-lg text-xs border transition-colors ${
                    isSpeaking 
                      ? 'bg-purple-600 text-white border-purple-400' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                  }`}
                  title="Spoken Exegesis"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => copyPillarText(selectedPillar)}
                  className="p-2 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                  title="Copy Dossier to Clipboard"
                >
                  {copiedPillar === selectedPillar.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Hebrew Canonical Inscription Card */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-amber-500/20 space-y-2">
              <span className="text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider block">
                Canonical Biblical Inscription
              </span>
              <p className="text-base font-serif text-amber-200 text-right leading-relaxed" dir="rtl">
                {selectedPillar.canonicalVerse}
              </p>
              <div className="text-xs text-neutral-400 italic pt-1 border-t border-neutral-900">
                {selectedPillar.epithet}
              </div>
            </div>

            {/* Architectural & Theological Exegesis */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                Architectural Role in the Cosmic Temple
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                {selectedPillar.description}
              </p>
            </div>

            {/* Scriptural Foundations */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Scriptural Foundations
              </h4>
              <div className="space-y-2">
                {selectedPillar.scripturalFoundations.map((verse, i) => (
                  <div key={i} className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">§</span>
                    <span>{verse}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Liturgical Formula */}
            <div className="bg-gradient-to-r from-amber-950/40 to-neutral-950 p-4 rounded-xl border border-amber-500/30 space-y-1.5">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Liturgical Activation Formula
              </span>
              <p className="text-xs font-serif italic text-amber-100">
                "{selectedPillar.liturgicalFormula}"
              </p>
            </div>
          </div>

          {/* Right Metrics & Quantum Specs (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Structural Integrity Card */}
            <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Structural Integrity
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedPillar.structuralIntegrityScore.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${selectedPillar.structuralIntegrityScore}%` }}
                />
              </div>

              {/* Geometric Proof Box */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">
                  Geometric Axiom & Proof
                </span>
                <p className="text-xs font-mono text-sky-200 break-words">
                  {selectedPillar.geometricProof}
                </p>
              </div>

              {/* Sacred Ratio */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                  Sacred Ratio / Constant
                </span>
                <p className="text-xs font-mono text-amber-200">
                  {selectedPillar.sacredRatio}
                </p>
              </div>

              {/* Cymatic Pattern */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
                  Cymatic Wave Geometry
                </span>
                <p className="text-xs text-neutral-300">
                  {selectedPillar.cymaticPattern}
                </p>
              </div>

              {/* Cosmic Domain */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-pink-400 uppercase tracking-wider block">
                  Governed Cosmic Domain
                </span>
                <p className="text-xs text-neutral-300">
                  {selectedPillar.cosmicDomain}
                </p>
              </div>
            </div>

            {/* Solomon's Temple Architecture Reference */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 space-y-2">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                The Two Pillars of the Porch
              </div>
              <p className="text-[11px] leading-relaxed">
                Jachin (יָכִין - "He will establish") and Boaz (בֹּעַז - "In it is strength") stood 18 cubits high with 5-cubit chapiters adorned with pomegranates and lily-work (1 Kings 7:21), reflecting Pillars 1 and 2 in the terrestrial sanctuary.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
