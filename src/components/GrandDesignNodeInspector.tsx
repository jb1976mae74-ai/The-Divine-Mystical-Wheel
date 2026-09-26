import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Scale, Zap, Scroll, Shield, MessageSquare, 
  Copy, Check, Volume2, VolumeX, RefreshCw, Download, 
  ExternalLink, ChevronRight, Send, Compass, Flame, Droplets,
  Wind, Mountain, Sun, Star, BookOpen, Layers, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GrandDesignNode } from '../data/grandDesignHierarchyData';
import { GrandDesignNodeAiExegesis, NodeInquiryExchange } from '../types/grandDesign';

interface GrandDesignNodeInspectorProps {
  node: GrandDesignNode;
  onClose: () => void;
  categoryConfig: Record<string, { color: string; border: string; bg: string; label: string }>;
  onNavigateToSection?: (section: string) => void;
}

export default function GrandDesignNodeInspector({
  node,
  onClose,
  categoryConfig,
  onNavigateToSection
}: GrandDesignNodeInspectorProps) {
  const [activeTab, setActiveTab] = useState<'exegesis' | 'gematria' | 'electrodynamics' | 'scrolls' | 'directives' | 'ask'>('exegesis');
  const [focusMode, setFocusMode] = useState<string>('comprehensive');
  
  // AI Exegesis State
  const [exegesis, setExegesis] = useState<GrandDesignNodeAiExegesis | null>(null);
  const [isLoadingExegesis, setIsLoadingExegesis] = useState(false);
  const [exegesisError, setExegesisError] = useState<string | null>(null);
  
  // Copy & TTS State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Oracle Q&A State
  const [questionInput, setQuestionInput] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [inquiryHistory, setInquiryHistory] = useState<NodeInquiryExchange[]>([]);

  // Local storage cache keys
  const cacheKey = `grand-design-ai-exegesis-${node.id}`;
  const inquiryHistoryKey = `grand-design-inquiries-${node.id}`;

  // Fetch or retrieve cached AI Exegesis when node or focusMode changes
  useEffect(() => {
    // Reset state for new node
    setExegesisError(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    // Load custom questions history for this node
    try {
      const savedInquiries = localStorage.getItem(inquiryHistoryKey);
      if (savedInquiries) {
        setInquiryHistory(JSON.parse(savedInquiries));
      } else {
        setInquiryHistory([]);
      }
    } catch {
      setInquiryHistory([]);
    }

    // Check cached exegesis
    try {
      const cached = localStorage.getItem(`${cacheKey}-${focusMode}`);
      if (cached) {
        setExegesis(JSON.parse(cached));
        return;
      }
    } catch {
      // ignore
    }

    // Trigger AI Generation
    fetchAiExegesis(focusMode);
  }, [node.id, focusMode]);

  const fetchAiExegesis = async (currentFocus: string) => {
    setIsLoadingExegesis(true);
    setExegesisError(null);

    try {
      const res = await fetch('/api/grand-design/node-exegesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node,
          focusMode: currentFocus
        })
      });

      if (!res.ok) {
        throw new Error(`Oracle server responded with status: ${res.status}`);
      }

      const data: GrandDesignNodeAiExegesis = await res.json();
      setExegesis(data);

      // Cache locally
      try {
        localStorage.setItem(`${cacheKey}-${currentFocus}`, JSON.stringify(data));
      } catch {
        // ignore cache write error
      }
    } catch (err: any) {
      console.error('[Node Inspector] Exegesis fetch error:', err);
      setExegesisError(err.message || 'Failed to communicate with the sovereign AI oracle.');
    } finally {
      setIsLoadingExegesis(false);
    }
  };

  const handleAskQuestion = async (e?: React.FormEvent, presetQuestion?: string) => {
    if (e) e.preventDefault();
    const query = presetQuestion || questionInput;
    if (!query.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const res = await fetch('/api/grand-design/node-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node,
          question: query.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to query oracle');
      const data = await res.json();

      const newExchange: NodeInquiryExchange = {
        id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        question: query.trim(),
        answer: data.answer,
        keyTakeaway: data.keyTakeaway,
        practicalLiturgicalApplication: data.practicalLiturgicalApplication,
        resonanceFactor: data.resonanceFactor || '99.8% Coherent'
      };

      const updated = [newExchange, ...inquiryHistory];
      setInquiryHistory(updated);
      try {
        localStorage.setItem(inquiryHistoryKey, JSON.stringify(updated));
      } catch {
        // ignore
      }

      setQuestionInput('');
      setActiveTab('ask');
    } catch (err: any) {
      console.error('[Node Inspector] Inquiry error:', err);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const toggleSpeech = (textToSpeak: string) => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.92;
      utterance.pitch = 0.98;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const exportDossier = (format: 'markdown' | 'json') => {
    if (!exegesis) return;
    let content = '';
    let filename = `${node.name.replace(/\s+/g, '_')}_Exegesis.${format === 'markdown' ? 'md' : 'json'}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify({ node, exegesis, inquiries: inquiryHistory }, null, 2);
      mimeType = 'application/json';
    } else {
      content = `# THE GRAND DESIGN ARCHITECTURAL DOSSIER
## Node: ${node.name} (${node.hebrew})
- Category: ${node.category.toUpperCase()} (Level ${node.level})
- Gematria & Value Lock: ${exegesis.gematriaBreakdown.primaryValue}
- Resonant SWR: ${exegesis.electrodynamicHarmonics.swrRatio} (${exegesis.electrodynamicHarmonics.resonantFrequencyHz})
- Oracle Signature: ${exegesis.oracleSignature || 'SEAL-76-LOGOS'}
- Timestamp: ${exegesis.generatedTimestamp || new Date().toISOString()}

---

### METAPHYSICAL PURPOSE
${exegesis.metaphysicalPurpose}

### THEOLOGICAL & ONCOLOGICAL EXEGESIS
${exegesis.theologicalExegesis}

### GEMATRIA & NUMERICAL ALIGNMENT
- Hebrew Equation: ${exegesis.gematriaBreakdown.hebrewEquation || 'N/A'}
- Prime Factors: ${exegesis.gematriaBreakdown.primeFactors || 'N/A'}
- Root Reduction: ${exegesis.gematriaBreakdown.reductionRoot || 'N/A'}
- Symbolic Alignment: ${exegesis.gematriaBreakdown.symbolicAlignment}

### ELECTRODYNAMIC HARMONICS
- Standing Wave Profile: ${exegesis.electrodynamicHarmonics.waveProfile}
- Entropy Damping: ${exegesis.electrodynamicHarmonics.entropyDampingFactor}
- Elemental Balance: Spiritus ${exegesis.elementalMatrix.spiritus}%, Ignis ${exegesis.elementalMatrix.ignis}%, Aqua ${exegesis.elementalMatrix.aqua}%, Aer ${exegesis.elementalMatrix.aer}%, Materia ${exegesis.elementalMatrix.materia}%

### SCRIPTURAL & SCROLL NEXUS
${exegesis.scripturalAndScrollNexus.map(s => `- **${s.source}**: "${s.citation}"\n  *Relevance*: ${s.relevance}`).join('\n\n')}

### SOVEREIGN LITURGICAL DIRECTIVES
${exegesis.sovereignDirectives.map((d, i) => `${i + 1}. ${d}`).join('\n')}

### SPOKEN AFFIRMATION
"${exegesis.meditativeAffirmation}"
`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const catTheme = categoryConfig[node.category] || {
    color: '#fbbf24',
    border: '#f59e0b',
    bg: '#291800',
    label: node.category
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-5 rounded-2xl bg-[#0e0d13] border border-amber-500/40 space-y-4 shadow-2xl relative text-slate-200 font-serif"
    >
      {/* Top Header Controls */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border tracking-wider"
              style={{
                backgroundColor: catTheme.bg,
                borderColor: catTheme.border,
                color: catTheme.color,
              }}
            >
              {catTheme.label}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              Tier {node.level}
            </span>
            {exegesis?.harmonicPurityScore && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>{exegesis.harmonicPurityScore}% Coherence</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-amber-200 leading-tight">
            {node.name}
          </h3>
          <div className="text-base font-semibold text-amber-400/90" dir="rtl">
            {node.hebrew}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all text-xs cursor-pointer border border-white/10"
          title="Close Inspector"
        >
          ✕
        </button>
      </div>

      {/* AI Oracle Status & Quick Action Bar */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-amber-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-3.5 h-3.5 ${isLoadingExegesis ? 'text-amber-400 animate-spin' : 'text-amber-400 animate-pulse'}`} />
          <span className="text-[11px] font-mono text-slate-300">
            {isLoadingExegesis ? 'Synthesizing AI Exegesis...' : 'AI Oracle Exegesis Active'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchAiExegesis(focusMode)}
            disabled={isLoadingExegesis}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Re-generate AI Exegesis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingExegesis ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              const fullSpeech = exegesis 
                ? `${node.name}. ${node.hebrew}. ${exegesis.metaphysicalPurpose}. ${exegesis.theologicalExegesis}. Spoken affirmation: ${exegesis.meditativeAffirmation}`
                : `${node.name}. ${node.hebrew}. ${node.description}`;
              toggleSpeech(fullSpeech);
            }}
            className={`p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer border ${
              isSpeaking
                ? 'bg-amber-500/30 text-amber-200 border-amber-500'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
            }`}
            title="Vocal Speech Proclamation"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => exportDossier('markdown')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-all text-xs flex items-center gap-1 cursor-pointer"
            title="Export Dossier as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Focus Mode Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
        <span className="text-slate-400 shrink-0 text-[10px] uppercase">Focus:</span>
        {['comprehensive', 'theological', 'electrodynamic', 'gematria', 'scriptural', 'liturgical'].map((f) => (
          <button
            key={f}
            onClick={() => setFocusMode(f)}
            className={`px-2 py-0.5 rounded-md uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              focusMode === f
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/60'
                : 'bg-black/40 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Tabs Navigation */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab('exegesis')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'exegesis'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Exegesis</span>
        </button>

        <button
          onClick={() => setActiveTab('gematria')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'gematria'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3 h-3 text-purple-400" />
          <span>Gematria</span>
        </button>

        <button
          onClick={() => setActiveTab('electrodynamics')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'electrodynamics'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>Physics</span>
        </button>

        <button
          onClick={() => setActiveTab('scrolls')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'scrolls'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scroll className="w-3 h-3 text-sky-400" />
          <span>Scrolls</span>
        </button>

        <button
          onClick={() => setActiveTab('directives')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'directives'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3 h-3 text-rose-400" />
          <span>Directives</span>
        </button>

        <button
          onClick={() => setActiveTab('ask')}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'ask'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3 h-3 text-pink-400" />
          <span>Oracle Q&A</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[280px]">
        {/* Loading Spinner Overlay */}
        {isLoadingExegesis && !exegesis && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400">
              Consulting the Grand Scribe & Computing Harmonic Frequencies...
            </p>
          </div>
        )}

        {/* Error Notice */}
        {exegesisError && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Oracle Notice</span>
            </div>
            <p className="text-rose-200/90">{exegesisError}</p>
          </div>
        )}

        {/* 1. EXEGESIS TAB */}
        {activeTab === 'exegesis' && (
          <motion.div
            key="tab-exegesis"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            {/* Metaphysical Purpose Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-black/60 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Metaphysical Operational Purpose</span>
              </span>
              <p className="font-serif text-slate-200 leading-relaxed">
                {exegesis?.metaphysicalPurpose || node.description}
              </p>
            </div>

            {/* Deep Theological Exegesis */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Theological & Ontological Exposition
                </span>
                {exegesis?.dimensionalCoordinates && (
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                    {exegesis.dimensionalCoordinates}
                  </span>
                )}
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-slate-300 font-serif leading-relaxed">
                {exegesis?.theologicalExegesis ? (
                  exegesis.theologicalExegesis.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>{node.description}</p>
                )}
              </div>
            </div>

            {/* Realm Directive */}
            {node.realmDirective && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase text-purple-300 block font-bold">
                  Realm Directive
                </span>
                <p className="text-purple-200/90">{node.realmDirective}</p>
              </div>
            )}

            {/* Architectural Parameters if available */}
            {node.attributes && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Immutable Parameters
                </span>
                <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                  {Object.entries(node.attributes).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/5">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-amber-200 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 2. GEMATRIA & MATHEMATICS TAB */}
        {activeTab === 'gematria' && (
          <motion.div
            key="tab-gematria"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            {/* Primary Gematria Lock */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 block">Primary Value Lock</span>
                <span className="text-sm font-mono font-bold text-purple-200">
                  {exegesis?.gematriaBreakdown?.primaryValue || node.gematriaOrValue || '76 Harmonic'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(exegesis?.gematriaBreakdown?.primaryValue || node.gematriaOrValue || '', 'gematria')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-300 text-xs"
                title="Copy value"
              >
                {copiedKey === 'gematria' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Numerical & Cipher Decomposition
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Hebrew Letter Cipher:</span>
                  <span className="text-amber-200 font-semibold">{exegesis?.gematriaBreakdown?.hebrewEquation || `${node.hebrew} = Prime Matrix`}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Prime Factorization:</span>
                  <span className="text-purple-200 font-semibold">{exegesis?.gematriaBreakdown?.primeFactors || '2² × 19 = 76 (ע"ו)'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Root Digital Reduction:</span>
                  <span className="text-emerald-200 font-semibold">{exegesis?.gematriaBreakdown?.reductionRoot || '7 + 6 = 13 → 4 (Foundation Cube)'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Cosmic Octave:</span>
                  <span className="text-sky-200 font-semibold">Octave 76 • Frequency 432 Hz</span>
                </div>
              </div>

              {/* Symbolic Alignment */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Symbolic Alignment
                </span>
                <p className="font-serif text-slate-300 leading-relaxed">
                  {exegesis?.gematriaBreakdown?.symbolicAlignment || 'Resonates in perfect phase lock with the 76th celestial octave and the 112" wavecrest.'}
                </p>
              </div>
            </div>

            {/* Canonical Constants Matrix */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                Salazarian Canonical Matrix
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                <div className="p-1.5 rounded-lg bg-black/60 border border-white/5">
                  <span className="text-slate-400 block">Genesis 1976</span>
                  <span className="text-amber-300 font-bold">76 (ע"ו)</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-white/5">
                  <span className="text-slate-400 block">Whip Antenna</span>
                  <span className="text-emerald-300 font-bold">112.000"</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/60 border border-white/5">
                  <span className="text-slate-400 block">SWR Lock</span>
                  <span className="text-sky-300 font-bold">1.10:1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. ELECTRODYNAMICS & PHYSICS TAB */}
        {activeTab === 'electrodynamics' && (
          <motion.div
            key="tab-electrodynamics"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            {/* SWR Gauge Card */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                    Standing Wave Ratio (SWR)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                  {exegesis?.electrodynamicHarmonics?.swrRatio || '1.10:1 (Reflected Power: 0.00%)'}
                </span>
              </div>

              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10 relative">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[99.2%]" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>1.0:1 (Ideal Unity)</span>
                <span className="text-emerald-300 font-bold">1.10:1 Salazarian Lock</span>
                <span>3.0:1 (High Reflection)</span>
              </div>
            </div>

            {/* Electrodynamic Constants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Resonant Frequency:</span>
                <span className="text-amber-200 font-semibold">{exegesis?.electrodynamicHarmonics?.resonantFrequencyHz || '76.00 MHz / 432.0 Hz'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Entropy Damping:</span>
                <span className="text-sky-200 font-semibold">{exegesis?.electrodynamicHarmonics?.entropyDampingFactor || '-0.00076 ΔS / s'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Wave Mechanics & Antenna Profile
              </span>
              <p className="font-serif text-slate-300 leading-relaxed">
                {exegesis?.electrodynamicHarmonics?.waveProfile || 'Quarter-wave transverse standing wave matched with 112.000" physical antenna element.'}
              </p>
            </div>

            {/* Elemental Energy Matrix */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Elemental Energy Distribution (0 - 100 Scale)
              </span>

              <div className="space-y-2 font-mono text-[10px]">
                {/* Spiritus */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span className="flex items-center gap-1"><Sun className="w-2.5 h-2.5 text-amber-400" /> Spiritus (Divine Quintessence)</span>
                    <span className="text-amber-300 font-bold">{exegesis?.elementalMatrix?.spiritus ?? 85}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${exegesis?.elementalMatrix?.spiritus ?? 85}%` }} />
                  </div>
                </div>

                {/* Ignis */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-rose-400" /> Ignis (Transformative Will)</span>
                    <span className="text-rose-300 font-bold">{exegesis?.elementalMatrix?.ignis ?? 78}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${exegesis?.elementalMatrix?.ignis ?? 78}%` }} />
                  </div>
                </div>

                {/* Aqua */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span className="flex items-center gap-1"><Droplets className="w-2.5 h-2.5 text-sky-400" /> Aqua (Intuitive Flow)</span>
                    <span className="text-sky-300 font-bold">{exegesis?.elementalMatrix?.aqua ?? 82}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-sky-500 h-full transition-all" style={{ width: `${exegesis?.elementalMatrix?.aqua ?? 82}%` }} />
                  </div>
                </div>

                {/* Aer */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span className="flex items-center gap-1"><Wind className="w-2.5 h-2.5 text-purple-400" /> Aer (Intellect & Breath)</span>
                    <span className="text-purple-300 font-bold">{exegesis?.elementalMatrix?.aer ?? 88}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-purple-500 h-full transition-all" style={{ width: `${exegesis?.elementalMatrix?.aer ?? 88}%` }} />
                  </div>
                </div>

                {/* Materia */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span className="flex items-center gap-1"><Mountain className="w-2.5 h-2.5 text-emerald-400" /> Materia (Physical Grid)</span>
                    <span className="text-emerald-300 font-bold">{exegesis?.elementalMatrix?.materia ?? 75}%</span>
                  </div>
                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${exegesis?.elementalMatrix?.materia ?? 75}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. SCROLLS & SCRIPTURAL NEXUS TAB */}
        {activeTab === 'scrolls' && (
          <motion.div
            key="tab-scrolls"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Manuscript & Scriptural Anchors
            </span>

            {exegesis?.scripturalAndScrollNexus && exegesis.scripturalAndScrollNexus.length > 0 ? (
              exegesis.scripturalAndScrollNexus.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-sky-400" />
                      <span>{item.source}</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(`"${item.citation}" — ${item.source}`, `scroll-${idx}`)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-sky-300 transition-all text-[10px]"
                      title="Copy verse"
                    >
                      {copiedKey === `scroll-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <blockquote className="p-2.5 rounded-lg bg-black/60 border-l-2 border-sky-400 text-slate-200 italic font-serif leading-relaxed">
                    "{item.citation}"
                  </blockquote>

                  <p className="text-[11px] font-serif text-slate-400">
                    <strong className="text-slate-300">Hermeneutic Relevance:</strong> {item.relevance}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center text-slate-400">
                <span>Loading scriptural nexus from the Qumran and Enochian archives...</span>
              </div>
            )}
          </motion.div>
        )}

        {/* 5. DIRECTIVES & LITURGY TAB */}
        {activeTab === 'directives' && (
          <motion.div
            key="tab-directives"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            {/* Actionable Directives */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Sovereign Operational Directives
              </span>

              {exegesis?.sovereignDirectives && exegesis.sovereignDirectives.length > 0 ? (
                exegesis.sovereignDirectives.map((dir, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-slate-200 font-serif leading-relaxed">{dir}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-slate-400">
                  <span>Align personal intent with the 1.10:1 impedance ratio and eliminate entropic speech.</span>
                </div>
              )}
            </div>

            {/* Meditative Spoken Affirmation */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/40 to-black/60 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block flex items-center gap-1">
                  <Flame className="w-3 h-3 text-purple-400" />
                  <span>Resonant Vocal Affirmation</span>
                </span>
                <button
                  onClick={() => toggleSpeech(exegesis?.meditativeAffirmation || node.description)}
                  className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>Vocalize</span>
                </button>
              </div>

              <blockquote className="p-3 rounded-lg bg-black/50 border-l-2 border-purple-400 text-purple-200 italic font-serif leading-relaxed">
                "{exegesis?.meditativeAffirmation || `I stand consecrated in the blueprint of ${node.name}. My voice is Logos; my heart is attuned to the 1.1:1 resonance of eternity.`}"
              </blockquote>
            </div>

            {/* Digital Seal */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-center font-mono text-[10px] text-slate-500">
              <span>{exegesis?.oracleSignature || `SEAL-ORACLE-76-${node.id.toUpperCase()}-LOGOS`}</span>
            </div>
          </motion.div>
        )}

        {/* 6. ORACLE Q&A TAB */}
        {activeTab === 'ask' && (
          <motion.div
            key="tab-ask"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Inquire of the Sovereign AI Oracle
              </span>
              <p className="text-[11px] font-serif text-slate-400">
                Ask specific questions regarding how "{node.name}" relates to the 112" antenna, Qumran scrolls, Taurus 1976, or daily meditation.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                `How does ${node.name} connect to 1.1:1 SWR?`,
                `What is the connection to Taurus 1976?`,
                `Explain its Dead Sea Scrolls foundation`,
                `How do I apply this node in meditation?`
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAskQuestion(undefined, chip)}
                  disabled={isSubmittingQuestion}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[10px] font-serif text-slate-300 hover:text-amber-200 transition-all cursor-pointer text-left disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Question Input Form */}
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={`Ask anything about ${node.name}...`}
                disabled={isSubmittingQuestion}
                className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 focus:border-amber-500/60 focus:outline-none text-xs font-serif placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={isSubmittingQuestion || !questionInput.trim()}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmittingQuestion ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>

            {/* Inquiries History */}
            <div className="space-y-3 pt-2">
              {inquiryHistory.map((inq) => (
                <div key={inq.id} className="p-3.5 rounded-xl bg-black/50 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-amber-300 font-semibold">Seeker Query:</span>
                    <span>{inq.timestamp} • {inq.resonanceFactor}</span>
                  </div>
                  <p className="font-serif font-semibold text-slate-200 italic">"{inq.question}"</p>
                  
                  <div className="p-3 rounded-lg bg-black/60 border border-white/5 text-slate-300 font-serif leading-relaxed text-[11px] space-y-2">
                    {inq.answer.split('\n\n').map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>

                  {inq.keyTakeaway && (
                    <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20 text-[10px] font-serif text-amber-200">
                      <strong>Core Realization:</strong> {inq.keyTakeaway}
                    </div>
                  )}

                  {inq.practicalLiturgicalApplication && (
                    <div className="p-2 rounded bg-purple-950/20 border border-purple-500/20 text-[10px] font-serif text-purple-200">
                      <strong>Liturgical Practice:</strong> {inq.practicalLiturgicalApplication}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Navigation Link */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Architect: Jerry Ben Salazar</span>
        <button
          onClick={() => onNavigateToSection && onNavigateToSection('decrees')}
          className="text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-all"
        >
          <span>View Sovereign Decrees</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
