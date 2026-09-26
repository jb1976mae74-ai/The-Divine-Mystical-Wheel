import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Download,
  Search,
  Layers,
  Flame,
  Shield,
  Compass,
  Cpu,
  Feather,
  Info,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Send,
  Eye,
  Pyramid,
  Hash,
  Share2
} from 'lucide-react';
import {
  FIRST_ENOCHIAN_KEY,
  ENOCHIAN_ALPHABET,
  calculateEnochianGematria,
  ALL_ENOCHIAN_KEYS_SUMMARY
} from '../data/enochianData';
import { EnochianVerse, EnochianWord } from '../types/enochian';
import { audioSystem } from '../utils/audioSystem';

interface EnochianSanctumProps {
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

export default function EnochianSanctum({ activeTheme }: EnochianSanctumProps) {
  const [activeTab, setActiveTab] = useState<'first-key' | 'gematria-cipher' | 'audio-reciter' | 'alphabet' | 'all-keys' | 'ai-exegesis'>('first-key');
  const [viewMode, setViewMode] = useState<'clause-parallel' | 'interlinear' | 'continuous'>('clause-parallel');
  const [selectedWord, setSelectedWord] = useState<EnochianWord | null>(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reciter state
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentRecitingStanza, setCurrentRecitingStanza] = useState<number | null>(null);
  const [reciterSpeed, setReciterSpeed] = useState<number>(0.85);
  const [reciterPitch, setReciterPitch] = useState<number>(0.75);

  // Gematria cipher state
  const [cipherInput, setCipherInput] = useState('Ol Sonf Vorsag Goho Iad Balt');
  const cipherAnalysis = useMemo(() => calculateEnochianGematria(cipherInput), [cipherInput]);

  // AI Exegesis state
  const [aiQuery, setAiQuery] = useState('Explain the mystical significance of the sword of the Sun (Ror i ta nazps) and the fire of the Moon (Graa ta malprg) in the First Enochian Key.');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filtered verses based on search
  const filteredVerses = useMemo(() => {
    if (!searchQuery.trim()) return FIRST_ENOCHIAN_KEY.verses;
    const q = searchQuery.toLowerCase();
    return FIRST_ENOCHIAN_KEY.verses.filter(v =>
      v.fullEnglish.toLowerCase().includes(q) ||
      v.fullEnochian.toLowerCase().includes(q) ||
      v.phoneticRecitation.toLowerCase().includes(q) ||
      v.wordBreakdown.some(w => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Recite single verse
  const reciteVerse = (verse: EnochianVerse) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(verse.phoneticRecitation);
    utterance.pitch = reciterPitch;
    utterance.rate = reciterSpeed;

    utterance.onstart = () => {
      setCurrentRecitingStanza(verse.stanzaNumber);
      audioSystem.startSpeech();
    };
    utterance.onend = () => {
      setCurrentRecitingStanza(null);
      audioSystem.endSpeech();
    };
    utterance.onerror = () => {
      setCurrentRecitingStanza(null);
      audioSystem.endSpeech();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop recitation
  const stopRecitation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAll(false);
    setCurrentRecitingStanza(null);
    audioSystem.endSpeech();
  };

  // Recite whole Key sequentially
  useEffect(() => {
    if (!isPlayingAll) return;

    let index = 0;
    const playNext = () => {
      if (index >= FIRST_ENOCHIAN_KEY.verses.length) {
        setIsPlayingAll(false);
        setCurrentRecitingStanza(null);
        audioSystem.endSpeech();
        return;
      }

      const verse = FIRST_ENOCHIAN_KEY.verses[index];
      setCurrentRecitingStanza(verse.stanzaNumber);

      const utterance = new SpeechSynthesisUtterance(verse.phoneticRecitation);
      utterance.pitch = reciterPitch;
      utterance.rate = reciterSpeed;

      utterance.onstart = () => {
        audioSystem.startSpeech();
      };

      utterance.onend = () => {
        index++;
        setTimeout(playNext, 600);
      };

      utterance.onerror = () => {
        setIsPlayingAll(false);
        setCurrentRecitingStanza(null);
        audioSystem.endSpeech();
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAll, reciterPitch, reciterSpeed]);

  const handleAskEnochianAI = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResponse('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `[Enochian Angelic Magic & The First Call Exegesis] ${aiQuery}`,
          school: 'Enochian Magic'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiResponse(data.answer);
    } catch (err: any) {
      setAiError(err.message || 'Failed to connect to celestial angelic wisdom stream.');
    } finally {
      setAiLoading(false);
    }
  };

  const downloadKeyManuscript = () => {
    let content = `THE GREAT WHEEL OF MYSTERIES - ENOCHIAN CODEX\n`;
    content += `==========================================================\n`;
    content += `THE FIRST CALL OF ENOCH (THE GATES OF CREATION & JUSTICE)\n`;
    content += `Transmitted via Archangel Ave to Dr. John Dee & Sir Edward Kelley (1584)\n`;
    content += `==========================================================\n\n`;

    FIRST_ENOCHIAN_KEY.verses.forEach(v => {
      content += `[Stanza ${v.stanzaNumber}]\n`;
      content += `ENGLISH CLAUSES:\n`;
      v.englishClauses.forEach(c => {
        content += `  [${c.num}] ${c.text}\n`;
      });
      content += `ENOCHIAN CLAUSES:\n`;
      v.enochianClauses.forEach(c => {
        content += `  [${c.num}] ${c.text} (Phonetic: ${c.phonetics || ''})\n`;
      });
      content += `FULL ENOCHIAN: ${v.fullEnochian}\n`;
      content += `FULL ENGLISH:  ${v.fullEnglish}\n`;
      content += `PHONETICS:     ${v.phoneticRecitation}\n`;
      content += `MYSTICAL NOTE: ${v.mysticalExplanation}\n`;
      content += `WORD LEXICON & GEMATRIA:\n`;
      v.wordBreakdown.forEach(w => {
        content += `  - ${w.word} (${w.phonetics}) [Gematria: ${w.gematria}] = ${w.meaning} [${w.grammar}]\n`;
      });
      content += `----------------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `First_Enochian_Key_Manuscript_Deciphered.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-6 text-slate-200">
      {/* Top Banner Header */}
      <div className={`w-full ${activeTheme.bgCard || 'bg-[#121418]'} border ${activeTheme.borderAccent || 'border-amber-500/30'} rounded-2xl p-6 shadow-2xl relative overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Sloane MS 3191 • Angelic Keys
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Spirit • Tablet of Union
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-200 tracking-wide flex items-center gap-2.5">
              <Pyramid className="w-6 h-6 text-amber-400" />
              The First Enochian Call Deciphering Chamber
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-serif max-w-3xl leading-relaxed">
              Complete verse-by-verse clause alignment, phonetics, Gematria matrix, word-level lexicon, and mystical exegesis of the primordial Angelic Key of Creation & Divine Justice (<span className="text-amber-300 italic">Iad Balt</span>).
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={downloadKeyManuscript}
              className="px-3.5 py-2 rounded-xl text-xs font-serif font-semibold bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Download Complete First Key Manuscript Report"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Codex</span>
            </button>

            <button
              onClick={() => {
                if (isPlayingAll) {
                  stopRecitation();
                } else {
                  setIsPlayingAll(true);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isPlayingAll
                  ? 'bg-red-950/70 text-red-200 border border-red-500/60 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border border-amber-300 font-bold'
              }`}
            >
              {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAll ? 'Halt Recitation' : 'Vibrate First Key'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5 overflow-x-auto scrollbar-none">
          {[
            { id: 'first-key', label: 'First Key Decipherer', icon: BookOpen },
            { id: 'gematria-cipher', label: 'Enochian Cipher & Gematria', icon: Hash },
            { id: 'audio-reciter', label: 'Vibrational Reciter Controls', icon: Volume2 },
            { id: 'alphabet', label: 'Sacred Alphabet & Glyphs', icon: Feather },
            { id: 'all-keys', label: 'Catalog of 18 Keys & 30 Aethyrs', icon: Layers },
            { id: 'ai-exegesis', label: 'AI Angelic Oracle & Exegesis', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="w-full">
        {/* TAB 1: FIRST KEY DECIPHERER & PARALLEL CLAUSE CHAMBER */}
        {activeTab === 'first-key' && (
          <div className="space-y-6">
            {/* View Mode and Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-serif">Display Mode:</span>
                <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setViewMode('clause-parallel')}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      viewMode === 'clause-parallel'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Clause Parallel
                  </button>
                  <button
                    onClick={() => setViewMode('interlinear')}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      viewMode === 'interlinear'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Word-by-Word Interlinear
                  </button>
                  <button
                    onClick={() => setViewMode('continuous')}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      viewMode === 'continuous'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Manuscript Flow
                  </button>
                </div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search clause, word, or meaning..."
                  className="w-full bg-[#121418] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Verses List */}
            <div className="space-y-4">
              {filteredVerses.map(verse => {
                const isCurrentlyReciting = currentRecitingStanza === verse.stanzaNumber;
                const isExpanded = activeVerseIndex === verse.stanzaNumber;

                return (
                  <motion.div
                    key={verse.stanzaNumber}
                    layout
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isCurrentlyReciting
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                        : 'bg-[#101318] border-white/10 hover:border-amber-500/30'
                    }`}
                  >
                    {/* Stanza Header */}
                    <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                          isCurrentlyReciting ? 'bg-amber-500 text-black' : 'bg-white/5 text-amber-400 border border-amber-500/30'
                        }`}>
                          {verse.stanzaNumber}
                        </span>
                        <span className="text-xs font-serif font-semibold text-slate-300">
                          Stanza {verse.stanzaNumber} of 15
                        </span>
                        {isCurrentlyReciting && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                            <Volume2 className="w-3 h-3" /> VIBRATING
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reciteVerse(verse)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
                          title="Recite this Stanza"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(`English: ${verse.fullEnglish}\nEnochian: ${verse.fullEnochian}\nPhonetic: ${verse.phoneticRecitation}`, `v-${verse.stanzaNumber}`)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer"
                          title="Copy Verse"
                        >
                          {copiedId === `v-${verse.stanzaNumber}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setActiveVerseIndex(isExpanded ? null : verse.stanzaNumber)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer"
                          title="Toggle Commentary & Word Lexicon"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Stanza Body based on view mode */}
                    <div className="p-5 space-y-4">
                      {/* VIEW 1: CLAUSE PARALLEL */}
                      {viewMode === 'clause-parallel' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* English Column */}
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
                            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                              <BookOpen className="w-3 h-3 text-sky-400" />
                              English Translation & Clauses
                            </div>
                            <div className="space-y-2 pt-1">
                              {verse.englishClauses.map((clause, cIdx) => (
                                <div key={cIdx} className="flex items-start gap-2.5 group">
                                  <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
                                    {clause.num}
                                  </span>
                                  <p className="text-sm font-serif text-slate-200 leading-relaxed group-hover:text-amber-200 transition-colors">
                                    {clause.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Enochian Column */}
                          <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/20 space-y-2">
                            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-500/20 pb-1.5">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              Angelic Language & Clauses
                            </div>
                            <div className="space-y-2 pt-1">
                              {verse.enochianClauses.map((clause, cIdx) => (
                                <div key={cIdx} className="flex items-start gap-2.5 group">
                                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/40">
                                    {clause.num}
                                  </span>
                                  <div>
                                    <p className="text-sm font-serif font-semibold text-amber-200 tracking-wide">
                                      {clause.text}
                                    </p>
                                    {clause.phonetics && (
                                      <p className="text-[11px] font-mono text-amber-400/70 italic mt-0.5">
                                        [{clause.phonetics}]
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: INTERLINEAR */}
                      {viewMode === 'interlinear' && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2.5 pt-1">
                            {verse.wordBreakdown.map((w, wIdx) => (
                              <button
                                key={wIdx}
                                onClick={() => setSelectedWord(w)}
                                className="p-2.5 rounded-xl bg-black/40 hover:bg-amber-950/40 border border-white/10 hover:border-amber-500/40 text-left transition-all cursor-pointer group flex flex-col justify-between"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-serif font-bold text-amber-200 group-hover:text-amber-300">
                                    {w.word}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    G:{w.gematria}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-amber-400/80 italic mt-0.5">
                                  /{w.phonetics}/
                                </span>
                                <span className="text-xs text-slate-300 mt-1 font-serif">
                                  {w.meaning}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* VIEW 3: CONTINUOUS MANUSCRIPT */}
                      {viewMode === 'continuous' && (
                        <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-amber-400/80">Angelic Text:</span>
                            <p className="text-base font-serif font-semibold text-amber-200 leading-relaxed mt-0.5">
                              {verse.fullEnochian}
                            </p>
                          </div>
                          <div className="border-t border-white/5 pt-2">
                            <span className="text-[10px] font-mono uppercase text-sky-400/80">English Meaning:</span>
                            <p className="text-sm font-serif text-slate-300 leading-relaxed mt-0.5">
                              {verse.fullEnglish}
                            </p>
                          </div>
                          <div className="border-t border-white/5 pt-2">
                            <span className="text-[10px] font-mono uppercase text-emerald-400/80">Pronunciation:</span>
                            <p className="text-xs font-mono text-emerald-300/80 italic mt-0.5">
                              {verse.phoneticRecitation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Expanded Section: Mystical Notes & Lexicon */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-white/10 space-y-4"
                        >
                          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300 mb-1">
                              <Info className="w-3.5 h-3.5 text-amber-400" />
                              Hermetic & Angelic Commentary:
                            </div>
                            <p className="text-xs text-slate-300 font-serif leading-relaxed">
                              {verse.mysticalExplanation}
                            </p>
                          </div>

                          <div>
                            <div className="text-xs font-serif font-bold text-slate-300 mb-2 flex items-center justify-between">
                              <span>Word Lexicon & Gematria Values:</span>
                              <span className="text-[10px] font-mono text-slate-400">Click word for deep inspection</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {verse.wordBreakdown.map((w, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setSelectedWord(w)}
                                  className="p-2.5 rounded-lg bg-black/40 hover:bg-amber-950/30 border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-serif font-bold text-amber-200">{w.word}</span>
                                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">G: {w.gematria}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 truncate mt-0.5">{w.meaning}</p>
                                  <span className="text-[9px] font-mono text-slate-500 uppercase">{w.grammar}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ENOCHIAN CIPHER & GEMATRIA CALCULATOR */}
        {activeTab === 'gematria-cipher' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${activeTheme.bgCard || 'bg-[#121418]'} border border-white/10 space-y-4`}>
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  Enochian Gematria & Letter Wavelength Calculator
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Calculates the exact numerical vibration of Angelic names, invocations, and phrases based on the classical Dee-Kelley 21-letter Enochian alphabet and Golden Dawn values.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Input Enochian Words / Inscription:
                </label>
                <input
                  type="text"
                  value={cipherInput}
                  onChange={e => setCipherInput(e.target.value)}
                  placeholder="Enter Enochian phrase (e.g. Ol Sonf Vorsag, Iaida, Zacare...)"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-serif text-amber-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Gematria Result Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Total Gematria Sum</span>
                  <span className="text-3xl font-mono font-black text-amber-200 mt-1">{cipherAnalysis.total}</span>
                  <span className="text-[10px] font-serif text-slate-400 mt-1">Enochian Sacred Number</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 md:col-span-2 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Character Decomposition</span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {cipherAnalysis.breakdown.map((item, idx) => (
                      <div key={idx} className="px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-center flex flex-col items-center">
                        <span className="text-xs font-serif font-bold text-amber-300">{item.char}</span>
                        <span className="text-[9px] font-mono text-slate-400">{item.letterName}</span>
                        <span className="text-[9px] font-mono text-emerald-400">+{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIBRATIONAL RECITER CONTROLS */}
        {activeTab === 'audio-reciter' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${activeTheme.bgCard || 'bg-[#121418]'} border border-white/10 space-y-6`}>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  Vibrational Resonance & Speech Recitation Engine
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Tune the vocal pace, pitch depth, and resonant frequency for vibrating the 15 stanzas of the First Enochian Call. Enochian words should be vibrated with deep resonant timbre.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Recitation Pace (Speed):</span>
                    <span className="text-amber-400 font-bold">{reciterSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={reciterSpeed}
                    onChange={e => setReciterSpeed(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Deliberate / Ritual (0.5x)</span>
                    <span>Standard (0.85x)</span>
                    <span>Fast (1.2x)</span>
                  </div>
                </div>

                <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Vocal Pitch (Oracle Aura):</span>
                    <span className="text-amber-400 font-bold">{reciterPitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={reciterPitch}
                    onChange={e => setReciterPitch(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Deep Resonant (0.5)</span>
                    <span>Standard Temple (0.75)</span>
                    <span>High (1.2)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (isPlayingAll) stopRecitation();
                    else setIsPlayingAll(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAll ? 'Stop Full Key Recitation' : 'Start Full 15-Stanza Recitation'}</span>
                </button>
                <button
                  onClick={stopRecitation}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-serif text-xs border border-white/10 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Voice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SACRED ALPHABET & GLYPHS */}
        {activeTab === 'alphabet' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${activeTheme.bgCard || 'bg-[#121418]'} border border-white/10 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-200">
                    The 21 Sacred Enochian Letters
                  </h3>
                  <p className="text-xs text-slate-400 font-serif">
                    The Angelic alphabet received through Kelley's scrying crystal in 1582–1584, arranged with corresponding gematria, elemental affinity, and tarot keys.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {ENOCHIAN_ALPHABET.map((letter, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-serif font-bold text-amber-300 group-hover:scale-110 transition-transform">
                        {letter.letter}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {letter.latinEquivalent}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-serif">Gematria:</span>
                        <span className="font-mono text-amber-400 font-bold">{letter.gematria}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-serif">Element:</span>
                        <span className="font-serif text-slate-300">{letter.elementalAffinity}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-serif">Tarot Key:</span>
                        <span className="font-serif text-slate-300">{letter.tarotCorrespondence}</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-serif text-slate-400/90 italic pt-1 border-t border-white/5">
                      "{letter.meaning}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATALOG OF 18 KEYS & 30 AETHYRS */}
        {activeTab === 'all-keys' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_ENOCHIAN_KEYS_SUMMARY.map(k => (
                <div
                  key={k.num}
                  className="p-5 rounded-2xl bg-[#101318] border border-white/10 hover:border-amber-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Key #{k.num} • {k.element}
                    </span>
                    <span className="text-xs font-mono text-slate-400 italic">"{k.firstWords}"</span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-amber-200">
                    {k.title} — {k.theme}
                  </h4>

                  <p className="text-xs text-slate-400 font-serif leading-relaxed">
                    {k.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI ANGELIC ORACLE & EXEGESIS */}
        {activeTab === 'ai-exegesis' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${activeTheme.bgCard || 'bg-[#121418]'} border border-white/10 space-y-4`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  AI Angelic Oracle & Dee-Kelley Manuscript Exegesis
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Ask deep theological, linguistic, or geometrical questions regarding the First Enochian Call, the Watchtowers, John Dee's Casaubon manuscripts, and angelic hierarchy.
              </p>

              <div className="space-y-3">
                <textarea
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  rows={3}
                  placeholder="Pose your query regarding the First Key, Angelic vocabulary, or Watchtowers..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500/50"
                />

                <button
                  onClick={handleAskEnochianAI}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? 'Consulting Angelic Records...' : 'Seek Angelic Exegesis'}</span>
                </button>
              </div>

              {aiError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                  {aiError}
                </div>
              )}

              {aiResponse && (
                <div className="p-5 rounded-xl bg-black/50 border border-amber-500/30 space-y-2 mt-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Angelic Revelation & Analysis:
                    </span>
                    <button
                      onClick={() => copyToClipboard(aiResponse, 'ai-res')}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedId === 'ai-res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-xs font-serif text-slate-200 leading-relaxed whitespace-pre-wrap pt-2">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Word Details Modal / Drawer */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedWord(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#14171d] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Enochian Word Inspector</span>
                  <h3 className="text-2xl font-serif font-bold text-amber-200">{selectedWord.word}</h3>
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 font-mono uppercase text-[9px] block">Meaning</span>
                  <span className="font-serif font-semibold text-slate-200">{selectedWord.meaning}</span>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 font-mono uppercase text-[9px] block">Phonetic Vibration</span>
                  <span className="font-mono text-emerald-300">/{selectedWord.phonetics}/</span>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 font-mono uppercase text-[9px] block">Gematria Value</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedWord.gematria}</span>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 font-mono uppercase text-[9px] block">Grammatical Role</span>
                  <span className="font-serif text-slate-300">{selectedWord.grammar}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const utt = new SpeechSynthesisUtterance(selectedWord.phonetics);
                    utt.pitch = 0.7;
                    utt.rate = 0.8;
                    window.speechSynthesis.speak(utt);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-serif flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Vibrate Word</span>
                </button>

                <button
                  onClick={() => setSelectedWord(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-serif cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
