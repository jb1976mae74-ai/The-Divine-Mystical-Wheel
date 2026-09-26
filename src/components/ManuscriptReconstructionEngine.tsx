import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, ShieldAlert, Sparkles, Scroll, RefreshCw, 
  CheckCircle2, AlertTriangle, Cpu, Terminal, Plus, Trash2, 
  BookOpen, Hash, Copy, Check, Save
} from 'lucide-react';

export interface ManuscriptVariantResult {
  variantText: string;
  sanitizedText: string;
  hashHex: string;
  numericValue: number;
  isIntegral: boolean; // 1 = Thummim (Integral), 0 = Urim (Anomaly)
  label: string;
  color: string;
}

export interface PresetManuscriptSection {
  id: string;
  locationMarker: string;
  description: string;
  sourceCodex: string;
  variants: string[];
}

export const PRESET_MANUSCRIPT_SECTIONS: PresetManuscriptSection[] = [
  {
    id: 'isaiah-58',
    locationMarker: 'Isaiah 58:8 (Hebrew vs Septuagint & Qumran)',
    description: 'Competing textual variants of the restoration promise in Great Isaiah Scroll (1QIsaa) and Massoretic Text.',
    sourceCodex: '1QIsaa & Codex Aleppo',
    variants: [
      'Then shall the light break forth as the morning, and thy health spring forth speedily.',
      'Then shall the light break forth as morning, and thy healing spring forth quickly.',
      'Then shall light break forth like the morning, and your health rise up speedily.'
    ]
  },
  {
    id: 'enoch-watchers',
    locationMarker: 'Book of Enoch 1:9 (Ethiopic Ge\'ez vs Epistle of Jude 14-15)',
    description: 'Prophetic judgment passage cited by Apostle Jude from the Aramaic & Ethiopic Watchers codex.',
    sourceCodex: 'Qumran 4QEn & Ge\'ez MS 48',
    variants: [
      'Behold, he cometh with ten thousands of his holy ones to execute judgment upon all.',
      'Lo, the Lord arrives with tens of thousands of his saints to convict all the ungodly.',
      'Behold, YHWH appears with myriads of holy angels to execute justice upon all flesh.'
    ]
  },
  {
    id: 'thomas-logion77',
    locationMarker: 'Gospel of Thomas Logion 77 (Nag Hammadi Codex II)',
    description: 'Coptic Logion describing omnipresent divine light in wood and stone.',
    sourceCodex: 'Nag Hammadi Codex II, Folio 47',
    variants: [
      'Split a piece of wood, I am there. Lift up a stone, and you will find me there.',
      'Cleave the timber, and I am within it. Raise the rock, and there am I.',
      'Split the wood, and I am present. Lift up the stone, and there you shall find my light.'
    ]
  },
  {
    id: 'qumran-war-scroll',
    locationMarker: 'The War Scroll 1QM Column I, Line 4',
    description: 'Eschatological battle directive between Children of Light and Children of Darkness.',
    sourceCodex: 'Qumran Cave 1 (1QM)',
    variants: [
      'This shall be a time of distress for all the redeemed people of God in their generations.',
      'This shall be the day of tribulations for all the nation of God\'s holy covenant.',
      'This is the hour of severe anguish for all the congregation of YHWH.'
    ]
  }
];

// Cryptographic text signature evaluation engine
async function computeTextSignature(textString: string): Promise<{ hashHex: string; numericValue: number; isIntegral: boolean }> {
  const sanitized = textString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(sanitized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const numericValue = parseInt(hashHex.substring(0, 8), 16);
      const isIntegral = (numericValue % 2) === 1;
      return { hashHex, numericValue, isIntegral };
    } catch (e) {
      // Fallback below
    }
  }

  // Simple deterministic fallback hashing
  let hash = 0;
  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const hashHex = positiveHash.toString(16).padStart(8, '0') + "0000000000000000";
  const numericValue = positiveHash;
  const isIntegral = (numericValue % 2) === 1;
  return { hashHex, numericValue, isIntegral };
}

export default function ManuscriptReconstructionEngine() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('isaiah-58');
  const [locationMarker, setLocationMarker] = useState<string>('Isaiah 58:8 (Hebrew vs Septuagint & Qumran)');
  const [variantsList, setVariantsList] = useState<string[]>(PRESET_MANUSCRIPT_SECTIONS[0].variants);
  const [newVariantInput, setNewVariantInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluationResults, setEvaluationResults] = useState<ManuscriptVariantResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedToGrimoire, setSavedToGrimoire] = useState<boolean>(false);

  // Load preset section
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_MANUSCRIPT_SECTIONS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setLocationMarker(preset.locationMarker);
    setVariantsList([...preset.variants]);
  };

  // Run analysis pipeline
  const runVerificationPipeline = async () => {
    setIsAnalyzing(true);
    setSavedToGrimoire(false);
    
    const results: ManuscriptVariantResult[] = [];
    for (const text of variantsList) {
      const sanitized = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
      const { hashHex, numericValue, isIntegral } = await computeTextSignature(text);
      
      results.push({
        variantText: text,
        sanitizedText: sanitized,
        hashHex,
        numericValue,
        isIntegral,
        label: isIntegral ? "Thummim (Integral)" : "Urim (Anomaly)",
        color: isIntegral ? "text-emerald-400 border-emerald-500/40 bg-emerald-950/30" : "text-rose-400 border-rose-500/40 bg-rose-950/30"
      });
    }

    setEvaluationResults(results);
    setIsAnalyzing(false);
  };

  // Run on initial mount and when variantsList / locationMarker changes
  useEffect(() => {
    runVerificationPipeline();
  }, [variantsList, locationMarker]);

  // Add new variant
  const handleAddVariant = () => {
    if (!newVariantInput.trim()) return;
    setVariantsList(prev => [...prev, newVariantInput.trim()]);
    setNewVariantInput('');
  };

  // Remove variant
  const handleRemoveVariant = (index: number) => {
    if (variantsList.length <= 1) return;
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  // Count valid reconstructions
  const validCount = useMemo(() => {
    return evaluationResults.filter(r => r.isIntegral).length;
  }, [evaluationResults]);

  // Copy text helper
  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Save analysis to Grimoire notes
  const handleSaveToGrimoire = () => {
    const noteId = `manuscript-recon-${Date.now()}`;
    const formattedResults = evaluationResults.map((r, i) => 
      `* **Variant #${i + 1}:** "${r.variantText}"\n  * **Status:** ${r.label}\n  * **SHA-256:** \`${r.hashHex.substring(0, 16)}...\` (Val: ${r.numericValue})`
    ).join('\n\n');

    const newNote = {
      id: noteId,
      title: `📜 Manuscript Reconstruction: ${locationMarker}`,
      content: `## MANUSCRIPT RECONSTRUCTION & VERIFICATION REPORT\n\n### Location Marker\n* **Location:** ${locationMarker}\n* **Integral Count:** ${validCount}/${evaluationResults.length} options pass Thummim cryptographic signature test.\n\n### Evaluated Textual Variants\n${formattedResults}\n\n### Methodology\nText sanitized of punctuation, processed through SHA-256 hash algorithm, and evaluated via deterministic modulo 2 parity checking (Urim/Thummim).`,
      school: "Manuscript Reconstruction Engine",
      color: "bg-[#1c2826]/95 border-amber-900/45",
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
    setSavedToGrimoire(true);
    setTimeout(() => setSavedToGrimoire(false), 3500);
  };

  return (
    <div className="w-full bg-[#0a0a0d]/90 border border-amber-500/30 rounded-2xl p-5 md:p-6 text-slate-200 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-amber-400 animate-pulse" />
            <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-200 tracking-wider">
              MANUSCRIPT RECONSTRUCTION & VERIFICATION ENGINE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-1">
            Iterates through competing textual variants of corrupted ancient text blocks to determine deterministic structural validation scores via cryptographic SHA-256 signatures.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveToGrimoire}
          className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-500/50 hover:bg-amber-900/60 text-amber-200 font-serif text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-lg"
        >
          {savedToGrimoire ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-amber-400" />}
          <span>{savedToGrimoire ? 'Saved to Grimoire!' : 'Save Report'}</span>
        </button>
      </div>

      {/* Preset Manuscript Selector Bar */}
      <div className="mb-6 space-y-2">
        <label className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <BookOpen className="w-3.5 h-3.5" /> Select Preset Manuscript Passage or Enter Custom Section
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_MANUSCRIPT_SECTIONS.map((preset, pIdx) => (
            <button
              key={`${preset.id}-${pIdx}`}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                selectedPresetId === preset.id
                  ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-md'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <span className="text-[10px] font-mono text-amber-400 font-bold truncate">{preset.sourceCodex}</span>
              <h4 className="text-xs font-serif font-bold text-slate-100 line-clamp-1">{preset.locationMarker}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Location Marker Input & Add Variant Controls */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-6 space-y-4">
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            Manuscript Location Identifier / Passage Title
          </label>
          <input
            type="text"
            value={locationMarker}
            onChange={(e) => setLocationMarker(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500"
            placeholder="e.g. Book 1, Section 4, Line 12"
          />
        </div>

        {/* Add Custom Text Variant */}
        <div>
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            Add Competing Textual Variant
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVariantInput}
              onChange={(e) => setNewVariantInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddVariant()}
              placeholder="Enter candidate text variant string..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 font-serif text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Variant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reconciled Analysis Results Header */}
      <div className="flex items-center justify-between bg-neutral-950/80 border border-amber-500/30 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            ANALYSIS RESULTS FOR: {locationMarker}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Valid Structural Options:
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold">
            {validCount} / {variantsList.length} Passed
          </span>
        </div>
      </div>

      {/* Variant Cards Pipeline Output */}
      <div className="space-y-3 mb-6">
        {evaluationResults.map((result, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-black/60 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left: Variant Text & Sanitization details */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30">
                  Option #{idx + 1}
                </span>
                <span className="text-xs font-serif italic text-slate-200">
                  "{result.variantText}"
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                <span>Sanitized: "{result.sanitizedText}"</span>
                <span>•</span>
                <span>SHA-256: <code className="text-slate-400">{result.hashHex.substring(0, 16)}...</code></span>
              </div>
            </div>

            {/* Right: Validation Status Badge & Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${result.color}`}>
                {result.isIntegral ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{result.label}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(result.variantText, idx)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Variant Text"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              {variantsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 transition-colors cursor-pointer"
                  title="Remove Variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Console Log Output Preview */}
      <div className="bg-black/80 border border-neutral-800 rounded-xl p-4 font-mono text-xs space-y-1.5 text-slate-400">
        <div className="text-amber-400/90 text-[10px] uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" /> Deterministic Console Output Log
        </div>
        <div>==================================================</div>
        <div className="text-amber-300">ANALYZING MANUSCRIPT SECTION: {locationMarker}</div>
        <div>==================================================</div>
        {evaluationResults.map((res, i) => (
          <div key={i} className="pl-2 border-l border-neutral-800 my-1">
            <div className="text-slate-300">[Variant Option #{i + 1}]</div>
            <div>Text:   "{res.variantText}"</div>
            <div>
              Status: <span className={res.isIntegral ? 'text-emerald-400' : 'text-rose-400'}>{res.label}</span>
            </div>
          </div>
        ))}
        <div>--------------------------------------------------</div>
        <div>Analysis Complete for {locationMarker}.</div>
        <div>Found ({validCount}/{variantsList.length}) structurally valid options.</div>
        <div>==================================================</div>
      </div>
    </div>
  );
}
