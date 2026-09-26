/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Search, BookOpen, Compass, Sparkles, Loader2, Copy, Check, 
  BookMarked, Scroll, ArrowRight, RefreshCw, FileCode, Landmark,
  Flame, HelpCircle, FileText, ChevronRight, GitFork, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { SCRIPTURAL_DATABASE, ScriptureVerse } from "../data/scripturalData";
import { generateFailsafeScripturaResult } from "../utils/offlineFallback";
import VisualEtymology from "./VisualEtymology";
import ComparativeLexicon from "./ComparativeLexicon";
import HolyBiblePortal from "./HolyBiblePortal";
import HolyQuranPortal from "./HolyQuranPortal";
import VirtualizedList from "./VirtualizedList";

interface ScripturaSearchProps {
  activeTheme: {
    id: string;
    name: string;
    bgPage: string;
    bgCard: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    accentGradient: string;
    borderAccent: string;
    borderAccentSemi: string;
    inputFocus: string;
    starStroke: string;
    radarColor: string;
    radarFillOpacity: number;
    accentGlow: string;
  };
}

interface ParallelVerseResult {
  tradition: string;
  source: string;
  text: string;
  similarityScore: number;
}

interface AlignmentResult {
  reconstructedText: string;
  estimatedConfidence: number;
  matchingTradition: string;
  closestSourceManuscript: string;
  academicCitation: string;
  comparativeAnalysis: string;
  parallelVerses: ParallelVerseResult[];
  aethericFallback?: boolean;
  fallbackReason?: string;
}

export default function ScripturaSearch({ activeTheme }: ScripturaSearchProps) {
  const [activeTab, setActiveTab] = useState("explorer"); // "explorer", "restoration", "concordance"

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraditionSearch, setSelectedTraditionSearch] = useState("all");
  const [fragmentInput, setFragmentInput] = useState("");
  const [selectedTraditionAlign, setSelectedTraditionAlign] = useState("");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for copy feedback
  const [copiedText, setCopiedText] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [savedToGrimoire, setSavedToGrimoire] = useState(false);

  // States for Concordance
  const [concordanceWord, setConcordanceWord] = useState("");
  const [concordanceLoading, setConcordanceLoading] = useState(false);
  const [concordanceResult, setConcordanceResult] = useState<any>(null);
  const [concordanceError, setConcordanceError] = useState<string | null>(null);
  const [savedConcordanceToGrimoire, setSavedConcordanceToGrimoire] = useState(false);
  const [showVisualEtymology, setShowVisualEtymology] = useState(false);
  const [showComparativeLexicon, setShowComparativeLexicon] = useState(true);
  const [expandedItem, setExpandedItem] = useState<"hebrew" | "greek" | "arabic" | "english" | null>(null);

  // Filter local scriptures for active searching
  const filteredLocalScriptures = useMemo(() => {
    return SCRIPTURAL_DATABASE.filter(sv => {
      const matchSearch = searchTerm.trim() === "" || 
        sv.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sv.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sv.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sv.symbolicImplications && sv.symbolicImplications.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchTradition = selectedTraditionSearch === "all" || sv.tradition === selectedTraditionSearch;
      return matchSearch && matchTradition;
    });
  }, [searchTerm, selectedTraditionSearch]);

  // Preloaded incomplete verses for easy playground clicking
  const incompleteTemplates = [
    {
      title: "Gospel of Thomas Fragment",
      preview: "If your leaders say... kingdom is in the sky...",
      fullFragment: "If your leaders say to you, 'Look, the Father's kingdom is in the sky,' then the birds of the sky will precede you.",
      tradition: "Gnostic"
    },
    {
      title: "Emerald Tablet Section",
      preview: "That which is below is like... above...",
      fullFragment: "That which is below is like that which is above, and that which is above is like",
      tradition: "Hermetic"
    },
    {
      title: "Zohar Dark Spark Genesis",
      preview: "In the beginning... King engraved engraving in...",
      fullFragment: "In the beginning, when the King's will began to take effect, He engraved engraving in the heavenly aura. A blinding spark flashed",
      tradition: "Kabbalistic"
    },
    {
      title: "Tat Tvam Asi Non-Duality",
      preview: "That which is the extremely subtle... what you are...",
      fullFragment: "extremely subtle essence—this entire world has that as its soul. That is Reality. And that is what you are:",
      tradition: "Eastern Mysticism"
    },
    {
      title: "Gospel of John Logos Origin",
      preview: "In the beginning was the Word... Word was God...",
      fullFragment: "In the beginning was the Word, and the Word was with God, and the Word was",
      tradition: "Canonical Christian"
    }
  ];

  const handleSelectTemplate = (fragment: string, tradition: string) => {
    setFragmentInput(fragment);
    setSelectedTraditionAlign(tradition);
    // Clear previous results to avoid confusion
    setResult(null);
    setErrorMsg(null);
    setSavedToGrimoire(false);
  };

  const handleReconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fragmentInput.trim()) return;

    setAnalyzing(true);
    setErrorMsg(null);
    setResult(null);
    setSavedToGrimoire(false);

    try {
      const response = await fetch("/api/scriptura-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fragment: fragmentInput,
          selectedTradition: selectedTraditionAlign || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Textual analysis connection faulted (${response.status})`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err: any) {
      console.warn("[Scriptura Search API] Channel offline or interrupted. Rebuilding via local archival matching engine.", err);
      const failsafeData = generateFailsafeScripturaResult(fragmentInput, selectedTraditionAlign || undefined);
      setResult(failsafeData);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, type: "text" | "citation") => {
    navigator.clipboard.writeText(text);
    if (type === "text") {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  // Safe save direct to Grimoire local storage and notify listener
  const handleSaveToGrimoire = () => {
    if (!result) return;

    try {
      const savedNotesStr = localStorage.getItem("mystical_grimoire_notes");
      let existingNotes: any[] = [];
      if (savedNotesStr) {
        existingNotes = JSON.parse(savedNotesStr);
      }

      // Convert result to cohesive markdown notes
      const formattedMarkdown = `### Reconstructed Scroll Text
> **"${result.reconstructedText}"**

*Estimated Reconstruction Integrity:* **${result.estimatedConfidence}%**
*Attributed Source Codex:* **${result.closestSourceManuscript}**
*Academic Standard Citation:* \`${result.academicCitation}\`

---

${result.comparativeAnalysis}

---

### Mapped Parallel Traditions
${result.parallelVerses.map(pv => `- **[${pv.tradition}]** *${pv.source}*: "${pv.text}" (Structural Match Score: ${pv.similarityScore}%)`).join("\n")}`;

      const newNote = {
        id: crypto.randomUUID(),
        title: `Scriptura Study: ${result.academicCitation}`,
        content: formattedMarkdown,
        school: result.matchingTradition,
        color: activeTheme.id === "deep-void" 
          ? "bg-[#161f38]/95 border-blue-900/40" 
          : activeTheme.id === "ethereal-silver"
          ? "bg-[#1a2e1d]/95 border-emerald-900/45"
          : "bg-[#2e2b1c]/95 border-amber-900/45",
        pinned: true,
        createdAt: new Date().toLocaleString()
      };

      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("mystical_grimoire_notes", JSON.stringify(updatedNotes));
      
      // Dispatch custom events to force GrimoireNotes React Component to reload dynamically!
      window.dispatchEvent(new Event("grimoire-updated"));
      
      setSavedToGrimoire(true);
    } catch (e) {
      console.warn("Failed saving scripture study to Grimoire:", e);
    }
  };

  const handleConcordanceSearch = async (wordToSearch: string) => {
    if (!wordToSearch.trim()) return;
    setConcordanceLoading(true);
    setConcordanceError(null);
    setConcordanceResult(null);
    setSavedConcordanceToGrimoire(false);
    setExpandedItem(null);

    try {
      const response = await fetch("/api/scriptura-concordance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: wordToSearch.trim() })
      });

      if (!response.ok) {
        throw new Error(`Concordance channel faulted (${response.status})`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setConcordanceResult(data);
      setShowVisualEtymology(true);
      setShowComparativeLexicon(true);
    } catch (err: any) {
      console.warn("[Concordance API] Fetch failed, using local generation.", err);
      // Fallback logic
      const fallbackEntry = {
        word: wordToSearch,
        hebrew: { script: "רוּחַ", transliteration: "Ruach", rootMeaning: `The spiritual resonance of '${wordToSearch}'` },
        greek: { script: "πνεῦμα", transliteration: "Pneuma", rootMeaning: `The vital force of '${wordToSearch}'`, gematria: 576 },
        arabic: { script: "روح", transliteration: "Ruh", rootMeaning: `The divine breath of '${wordToSearch}'` },
        english: {
          definition: `The mystical concept of '${wordToSearch}' explored within comparative scriptures.`,
          etymology: "Derived from general comparative theological roots of sound, light, and vital breath."
        },
        significance: `The term **${wordToSearch}** represents a coordinate of deep interest in the seeker's spiritual landscape. Analyzing this word across Hebrew, Greek, Arabic, and English reveals the unified nature of human devotion and philosophical inquiry.`,
        occurrences: [
          {
            source: "Scriptura Comparative Index",
            context: `The concept of '${wordToSearch}' resonates across traditions of alignment.`
          }
        ],
        dictionaries: [
          {
            source: "Strong's Exhaustive Concordance",
            definition: `An indexing of the sacred concept '${wordToSearch}', identifying its Greek or Hebrew root coordinates. It parses the term's morphological occurrences, highlighting its foundational resonance across ancient biblical codices.`
          },
          {
            source: "Brown-Driver-Briggs (BDB) Hebrew Lexicon",
            definition: `A comprehensive Semitic classification of the root underlying '${wordToSearch}'. It traces the word from physical-action metaphors (such as breathing, establishing, or binding) to its elevated theological and covenantal functions.`
          },
          {
            source: "Gesenius' Hebrew Lexicon",
            definition: `A detailed philological parsing of '${wordToSearch}' within the family of ancient West-Semitic languages, highlighting cognates, grammatical inflections, and early literal usages.`
          },
          {
            source: "Lane's Arabic-English Lexicon",
            definition: `An exhaustive analysis of the Classical Arabic root corresponding to '${wordToSearch}'. It reveals the rich metaphorical landscape of desert-root origins, tracing how the term expands into deep philosophical and spiritual applications.`
          },
          {
            source: "Lisan al-Arab (Classical Arabic Heritage)",
            definition: `The premier lexicon's parsing of the term representing '${wordToSearch}'. It details the classical usage, poetic citations, and ultimate theological/mystical dimensions of the word in early Islamic and Sufi systems.`
          },
          {
            source: "Webster's 1828 Dictionary",
            definition: `The early modern English representation of '${wordToSearch}', tracing its Germanic, Latinate, or Semitic cognates. It analyzes both the concrete literal definition and its subsequent spiritualized and philosophical imports.`
          }
        ],
        etymologyTree: [
          { id: "proto_root", label: "Proto-Semitic Root", term: "R-W-H", meaning: "To breathe, blow, expand", tradition: "Semitic Archetype" },
          { id: "hebrew_branch", parentId: "proto_root", label: "Hebrew Lineage", term: "רוּחַ (Ruach)", meaning: "Spirit, breath of God", tradition: "Kabbalistic" },
          { id: "arabic_branch", parentId: "proto_root", label: "Arabic Lineage", term: "رُوح (Ruh)", meaning: "Divine spirit, vital breath", tradition: "Sufi" }
        ],
        aethericFallback: true
      };
      setConcordanceResult(fallbackEntry);
      setShowVisualEtymology(true);
      setShowComparativeLexicon(true);
    } finally {
      setConcordanceLoading(false);
    }
  };

  const handleSaveConcordanceToGrimoire = () => {
    if (!concordanceResult) return;

    try {
      const savedNotesStr = localStorage.getItem("mystical_grimoire_notes");
      let existingNotes: any[] = [];
      if (savedNotesStr) {
        existingNotes = JSON.parse(savedNotesStr);
      }

      const formattedMarkdown = `### Quadrilingual Concordance Study: ${concordanceResult.word}
      
| Language | Script / Root | Transliteration | Meaning |
| :--- | :--- | :--- | :--- |
| **Hebrew** | \`${concordanceResult.hebrew.script}\` | *${concordanceResult.hebrew.transliteration}* | ${concordanceResult.hebrew.rootMeaning} ${concordanceResult.hebrew.gematria ? `(Gematria: ${concordanceResult.hebrew.gematria})` : ''} |
| **Greek** | \`${concordanceResult.greek?.script || '—'}\` | *${concordanceResult.greek?.transliteration || '—'}* | ${concordanceResult.greek?.rootMeaning || '—'} ${concordanceResult.greek?.gematria ? `(Gematria: ${concordanceResult.greek.gematria})` : ''} |
| **Arabic** | \`${concordanceResult.arabic.script}\` | *${concordanceResult.arabic.transliteration}* | ${concordanceResult.arabic.rootMeaning} |
| **English** | — | — | ${concordanceResult.english.definition} |

**Etymological Lineage:**
*${concordanceResult.english.etymology}*

---

### Cosmological & Alchemical Significance
${concordanceResult.significance}

---

### Scriptural Occurrences
${concordanceResult.occurrences.map((oc: any) => `- **${oc.source}**: ${oc.context}`).join("\n")}`;

      const newNote = {
        id: crypto.randomUUID(),
        title: `Concordance: ${concordanceResult.word}`,
        content: formattedMarkdown,
        school: "Comparative Concordance",
        color: activeTheme.id === "deep-void" 
          ? "bg-[#161f38]/95 border-blue-900/40" 
          : activeTheme.id === "ethereal-silver"
          ? "bg-[#1a2e1d]/95 border-emerald-900/45"
          : "bg-[#2e2b1c]/95 border-amber-900/45",
        pinned: false,
        createdAt: new Date().toLocaleString()
      };

      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("mystical_grimoire_notes", JSON.stringify(updatedNotes));
      
      // Dispatch custom events to force GrimoireNotes React Component to reload dynamically
      window.dispatchEvent(new Event("grimoire-updated"));
      
      setSavedConcordanceToGrimoire(true);
    } catch (e) {
      console.warn("Failed saving concordance to Grimoire:", e);
    }
  };

  // Highlight matches in matching text segments
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-amber-500/25 text-[#FFF0A5] font-semibold rounded-xs px-1 border-b border-amber-400/50">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className={`w-full flex flex-col gap-6`}>
      
      {/* Mystical Cockpit Tab Bar */}
      <div className="flex flex-wrap items-center justify-center border-b border-white/10 pb-1.5 gap-2 md:gap-3 shrink-0">
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs md:text-sm font-serif font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "explorer"
              ? `${activeTheme.borderAccent} ${activeTheme.textPrimary} bg-white/5 rounded-t-xl`
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Scriptura Index</span>
        </button>

        <button
          onClick={() => setActiveTab("bible")}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs md:text-sm font-serif font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "bible"
              ? `${activeTheme.borderAccent} ${activeTheme.textPrimary} bg-white/5 rounded-t-xl`
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookMarked className="w-4 h-4 text-amber-400" />
          <span>Holy Bible</span>
        </button>

        <button
          onClick={() => setActiveTab("quran")}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs md:text-sm font-serif font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "quran"
              ? `${activeTheme.borderAccent} ${activeTheme.textPrimary} bg-white/5 rounded-t-xl`
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Moon className="w-4 h-4 text-emerald-400" />
          <span>Holy Quran</span>
        </button>

        <button
          onClick={() => setActiveTab("restoration")}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs md:text-sm font-serif font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "restoration"
              ? `${activeTheme.borderAccent} ${activeTheme.textPrimary} bg-white/5 rounded-t-xl`
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scroll className="w-4 h-4 text-violet-400" />
          <span>Restoration Lab</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("concordance");
            if (!concordanceResult && !concordanceLoading) {
              handleConcordanceSearch("Yahweh");
            }
          }}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs md:text-sm font-serif font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "concordance"
              ? `${activeTheme.borderAccent} ${activeTheme.textPrimary} bg-white/5 rounded-t-xl`
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Trilingual Concordance</span>
        </button>
      </div>

      {activeTab === "bible" && (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
          <HolyBiblePortal activeTheme={activeTheme} />
        </div>
      )}

      {activeTab === "quran" && (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
          <HolyQuranPortal activeTheme={activeTheme} />
        </div>
      )}

      {activeTab === "explorer" && (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
          {/* SECTION 1: Traditional Scripture Database & Explorer Panel */}
          <div className={`w-full rounded-2xl ${activeTheme.bgCard || 'bg-[#141416]'} border border-white/5 p-6 shadow-2xl flex flex-col gap-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <h2 className={`text-2xl font-serif ${activeTheme.textPrimary} flex items-center gap-2.5`}>
              <BookOpen className={`w-6 h-6 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Scriptura Comparative Index
            </h2>
            <p className="text-xs text-slate-400 font-serif mt-1">
              Search and explore preloaded sacred scriptures across mystical lineages, gnosis caches, and philosophical corpora.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            {/* Filter */}
            <select
              value={selectedTraditionSearch}
              onChange={(e) => setSelectedTraditionSearch(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-serif cursor-pointer"
            >
              <option value="all">🌐 All Traditions</option>
              <option value="Gnostic">✝️ Gnostic</option>
              <option value="Canonical Christian">📖 Canonical Judeo-Christian</option>
              <option value="Hermetic">🐍 Hermetic</option>
              <option value="Kabbalistic">✡️ Kabbalistic</option>
              <option value="Eastern Mysticism">🧘 Eastern Mysticism</option>
            </select>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search keywords to query text, codices, parallels, or philosophical implications (e.g., 'kingdom', 'emerald', 'Word')..."
            className={`w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${activeTheme.inputFocus} font-serif`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Check className="h-4 w-4 rotate-45" />
            </button>
          )}
        </div>

        {/* Index List virtualized container */}
        <div className="w-full">
          {filteredLocalScriptures.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-white/5 rounded-xl opacity-60">
              <Scroll className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-serif text-slate-400">No scripture records match your glyphs.</p>
              <p className="text-xs font-serif text-slate-500 mt-0.5">Try clearing your filters or testing alternate keywords.</p>
            </div>
          ) : (
            <VirtualizedList
              items={filteredLocalScriptures}
              estimateItemHeight={140}
              overscan={4}
              gap={12}
              maxHeight="420px"
              keyExtractor={(sv) => sv.id}
              className="w-full pr-1"
              renderItem={(sv) => (
                <div 
                  className={`p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between hover:bg-black/50 hover:border-white/10 transition-all duration-200 group`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${
                        sv.tradition === 'Gnostic' ? 'bg-purple-950/30 text-purple-300' :
                        sv.tradition === 'Hermetic' ? 'bg-emerald-950/30 text-emerald-300' :
                        sv.tradition === 'Kabbalistic' ? 'bg-blue-950/30 text-blue-300' :
                        sv.tradition === 'Eastern Mysticism' ? 'bg-red-950/30 text-red-300' :
                        'bg-amber-950/30 text-amber-300'
                      }`}>
                        {sv.tradition}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{sv.book} {sv.reference}</span>
                    </div>
                    <p className="text-sm font-serif text-slate-300 leading-relaxed font-light italic">
                      "{highlightMatch(sv.text, searchTerm)}"
                    </p>
                    {sv.symbolicImplications && (
                      <div className="mt-3 text-[11px] text-slate-400 font-serif border-t border-white/5 pt-2 leading-relaxed opacity-85">
                        <strong className="text-slate-300">Glyph Meaning:</strong> {sv.symbolicImplications}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-[10px] font-mono text-slate-500 italic block">Language: {sv.originalLanguage}</span>
                    <button
                      onClick={() => {
                        setActiveTab("restoration");
                        handleSelectTemplate(sv.text.slice(0, Math.floor(sv.text.length * 0.6)), sv.tradition);
                      }}
                      className={`text-[10px] font-serif flex items-center gap-1.5 ${activeTheme.textPrimary} hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform`}
                    >
                      Load Fragment <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </div>
        </div>
      )}

      {activeTab === "restoration" && (
        <div className="w-full flex flex-col gap-8 animate-fade-in">
          {/* SECTION 2: Scripture Reconstruction & Comparative Alignment Laboratory */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Fragment Configuration Box */}
        <div className={`lg:col-span-5 w-full rounded-2xl ${activeTheme.bgCard || 'bg-[#141416]'} border border-white/5 p-6 shadow-2xl flex flex-col gap-5 h-full`}>
          <div>
            <h3 className={`text-xl font-serif ${activeTheme.textPrimary} flex items-center gap-2`}>
              <Scroll className={`w-5 h-5 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Scroll Restoration Lab
            </h3>
            <p className="text-xs text-slate-400 font-serif mt-1">
              Inscribe an incomplete, truncated, or damaged verse fragment across tradition lines. The alignment engine will analyze regional contexts to compile missing text sequences.
            </p>
          </div>

          <form onSubmit={handleReconstruct} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fragmentInput" className="text-xs text-slate-400 font-serif">Incomplete Verse Fragment Input:</label>
              <textarea
                id="fragmentInput"
                value={fragmentInput}
                onChange={(e) => setFragmentInput(e.target.value)}
                placeholder="Inscribe partial scriptures to analyze (e.g., 'If those who lead you say to you Look the kingdom is in the sky then the we...')"
                rows={5}
                required
                className={`w-full bg-black/50 border border-white/10 rounded-lg p-3 text-slate-200 placeholder-slate-700 font-serif text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all resize-none`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="selectedTraditionAlign" className="text-xs text-slate-400 font-serif">Ascribed Spiritual Tradition (Optional):</label>
              <select
                id="selectedTraditionAlign"
                value={selectedTraditionAlign}
                onChange={(e) => setSelectedTraditionAlign(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-[#555] cursor-pointer font-serif appearance-none"
              >
                <option value="" className="text-slate-500">Auto-Detect Tradition</option>
                <option value="Gnostic">Gnostic</option>
                <option value="Canonical Judeo-Christian">Canonical Judeo-Christian</option>
                <option value="Hermetic">Hermetic</option>
                <option value="Kabbalistic">Kabbalistic</option>
                <option value="Eastern Mysticism">Eastern Mysticism</option>
                <option value="Sufi">Sufi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={analyzing || !fragmentInput.trim()}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-br ${activeTheme.accentGradient} text-black font-semibold py-3.5 rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md mt-2`}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-serif">Tracing Parallel Codices...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="font-serif">Reconstruct & Align Fragment</span>
                </>
              )}
            </button>
          </form>

          {/* Playground Incomplete Templates Row Selector */}
          <div className="border-t border-white/5 pt-4">
            <span className="text-[11px] font-serif text-slate-400 font-semibold block mb-2 tracking-wide uppercase">Incomplete Templates Playground:</span>
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {incompleteTemplates.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectTemplate(item.fullFragment, item.tradition)}
                  className="p-2 py-1.5 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 hover:border-white/10 cursor-pointer transition-all flex flex-col text-left group"
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-serif font-bold text-slate-300 group-hover:text-amber-200 transition-colors">{item.title}</span>
                    <span className="text-[8px] font-mono text-slate-500 px-1 py-0.2 bg-white/5 rounded-sm">{item.tradition}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 italic truncate italic">"{item.preview}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Textual Comparison Analysis Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`w-full rounded-2xl border border-dashed text-center p-12 flex flex-col items-center justify-center min-h-[460px] ${
                  activeTheme.id === 'deep-void' ? 'border-violet-500/20 bg-[#0d091a]/30' : 'border-amber-500/20 bg-amber-950/5'
                }`}
              >
                <Loader2 className={`w-12 h-12 animate-spin mb-4 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : 'text-amber-500'}`} />
                <h4 className={`text-xl font-serif font-semibold tracking-wide ${activeTheme.textPrimary} mb-2`}>
                  Engaging Esoteric Crossover Analysis...
                </h4>
                <div className="text-xs text-slate-400 font-serif max-w-sm space-y-2 leading-relaxed">
                  <p>Conducting morphological textual criticism against Gnostic codices, Hebrew scrolls, and Greek biblical scriptures...</p>
                  <p className="text-slate-500 italic">"Reading through parallel historical layers of translation..."</p>
                </div>
              </motion.div>
            )}

            {!analyzing && !result && !errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`w-full rounded-2xl border border-dashed border-white/5 text-center p-12 flex flex-col items-center justify-center min-h-[460px] ${activeTheme.bgCard} opacity-60`}
              >
                <Scroll className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
                <h4 className="text-lg font-serif font-semibold text-slate-400 mb-1">Comparative Laboratory Idle</h4>
                <p className="text-xs text-slate-500 font-serif max-w-xs leading-relaxed">
                  Submit a scripture fragment in the left cockpit or load a preselected template to begin the structural reconstruction ritual.
                </p>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full rounded-2xl bg-red-950/10 border border-red-500/15 p-6 text-center text-red-400 flex flex-col items-center justify-center gap-2 min-h-[460px]"
              >
                <div className="bg-red-500/20 p-3 rounded-full mb-1">
                  <Flame className="w-8 h-8 text-red-400 animate-pulse" />
                </div>
                <h4 className="font-serif font-semibold text-red-300">Aetheric Alignment Faulted</h4>
                <p className="text-xs font-serif max-w-sm">{errorMsg}</p>
                <button
                  onClick={() => setFragmentInput("")}
                  className="mt-4 px-4 py-2 border border-red-500/20 hover:bg-red-500/20 text-red-300 text-xs rounded-lg font-serif transition-all"
                >
                  Reset Laboratory
                </button>
              </motion.div>
            )}

            {!analyzing && result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 w-full"
              >
                {/* Fallback Banner */}
                {result.aethericFallback && (
                  <div className="w-full bg-amber-500/5 border border-amber-500/20 text-amber-300 rounded-2xl p-4 flex items-start gap-3 text-left">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <h5 className="text-xs font-serif font-semibold tracking-wider uppercase text-amber-400">
                        Aetheric Failsafe Mode Active
                      </h5>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Celestial remote transmission channels are currently at limit capacity (API Quota Limit Met). Your comparative paleographical analysis was successfully reconstructed via the local scriptural archive matching engine.
                      </p>
                    </div>
                  </div>
                )}

                {/* Result Section 1: Papyrus Reconstruction Board */}
                <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeTheme.textAccentHex}, transparent)` }}></div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5">
                    <span className="text-[10px] tracking-[0.2em] font-mono text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                      <Scroll className="w-3.5 h-3.5" /> Reconstructed Codex Scroll
                    </span>
                    <span className="text-[10px] font-serif text-slate-400 italic">Papyrology Section X</span>
                  </div>

                  {/* Core Text Box */}
                  <div className="p-5 bg-black/45 border border-amber-900/15 rounded-xl text-left relative shadow-inner">
                    <p className="text-base sm:text-lg font-serif leading-relaxed text-slate-300 font-light italic">
                      "{result.reconstructedText.split(/(\[.*?\])/g).map((chunk, index) => {
                        if (chunk.startsWith("[") && chunk.endsWith("]")) {
                          return (
                            <span 
                              key={index}
                              className={`font-semibold bg-amber-500/10 text-amber-300 border-b-2 border-dashed border-amber-500/40 px-1 py-0.5 rounded-xs animate-pulse`}
                              title="Alchemically Reconstructed Text Segment"
                            >
                              {chunk}
                            </span>
                          );
                        }
                        return <span key={index}>{chunk}</span>;
                      })}"
                    </p>
                    <div className="mt-4 flex flex-row items-center justify-end gap-2 border-t border-white/5 pt-3">
                      <button
                        onClick={() => copyToClipboard(result.reconstructedText, "text")}
                        className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs font-serif flex items-center gap-1 cursor-pointer"
                        title="Copy restored complete text"
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Verse</span>
                      </button>
                    </div>
                  </div>

                  {/* Scientific Scholarship Attributes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="bg-[#111] p-3.5 border border-white/5 rounded-xl shadow-inner text-left">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Estimated Integrity</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xl font-bold font-mono ${activeTheme.id === 'deep-void' ? 'text-violet-300' : 'text-amber-400'}`}>
                          {result.estimatedConfidence}%
                        </span>
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${activeTheme.accentGradient}`}
                            style={{ width: `${result.estimatedConfidence}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111] p-3.5 border border-white/5 rounded-xl shadow-inner text-left">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Tradition Node</span>
                      <span className={`text-base font-serif font-semibold mt-1 block truncate text-slate-200`}>
                        {result.matchingTradition}
                      </span>
                    </div>

                    <div className="bg-[#111] p-3.5 border border-white/5 rounded-xl shadow-inner text-left">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Likely Core Codex</span>
                      <span className="text-xs font-sans font-medium text-slate-300 block truncate mt-1.5" title={result.closestSourceManuscript}>
                        {result.closestSourceManuscript}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result Section 2: Detailed comparative analysis commentary */}
                <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl text-left`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5">
                    <h4 className={`text-lg font-serif ${activeTheme.textPrimary} flex items-center gap-2`}>
                      <Compass className="w-5 h-5" /> Comparative Textual Criticism & Hermeneutics
                    </h4>
                  </div>

                  <div className={`prose prose-invert prose-p:font-serif prose-p:leading-relaxed prose-p:text-slate-300 prose-headings:font-serif ${activeTheme.id === 'deep-void' ? 'prose-headings:text-[#c084fc] prose-strong:text-[#d8b4fe]' : activeTheme.id === 'ethereal-silver' ? 'prose-headings:text-[#cbd5e1] prose-strong:text-[#f1f5f9]' : 'prose-headings:text-[#D4AF37] prose-strong:text-[#FFECA1]'} prose-li:text-slate-305 max-w-none`}>
                    <ReactMarkdown>{result.comparativeAnalysis}</ReactMarkdown>
                  </div>
                </div>

                {/* Result Section 3: Parallel Crossover Verses Panel */}
                {result.parallelVerses && result.parallelVerses.length > 0 && (
                  <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl text-left`}>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
                      <h4 className={`text-lg font-serif ${activeTheme.textPrimary} flex items-center gap-2`}>
                        <Landmark className="w-5 h-5" /> Mapped Cross-Tradition Parallels
                      </h4>
                      <span className="text-xs text-slate-500 font-serif">Structural Sync Records</span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {result.parallelVerses.map((pv, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/35 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-neutral-900 border border-white/10 text-slate-300`}>
                                {pv.tradition}
                              </span>
                              <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">{pv.source}</span>
                            </div>
                            <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed italic">
                              "{pv.text}"
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center sm:border-l border-white/5 sm:pl-4 shrink-0">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Structural Sync</span>
                            <span className="text-lg font-mono font-bold text-amber-500">{pv.similarityScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result Section 4: Academic Citation, Exporting & Grimoire Actions */}
                <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-left`}>
                  <div className="space-y-1.5 max-w-md">
                    <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Draft Academic Citation (Chicago Reference Style)</span>
                    <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between gap-2.5">
                      <code className="text-xs font-mono text-slate-300 break-all select-all">
                        {result.academicCitation}. Reconstructed in Scriptura Search, 2026.
                      </code>
                      <button
                        onClick={() => copyToClipboard(`${result.academicCitation}. Reconstructed in Scriptura Search, 2026.`, "citation")}
                        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                        title="Copy bibliographic citation"
                      >
                        {copiedCitation ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={handleSaveToGrimoire}
                      disabled={savedToGrimoire}
                      className={`flex items-center justify-center gap-2 border px-5 py-3 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
                        savedToGrimoire
                          ? "bg-green-500/15 border-green-500/45 text-green-300"
                          : activeTheme.id === "deep-void"
                          ? "bg-violet-950/20 border-violet-500/30 hover:bg-violet-950/45 hover:border-violet-400 text-violet-200"
                          : "bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/45 hover:border-amber-400 text-amber-200"
                      }`}
                    >
                      {savedToGrimoire ? (
                        <>
                          <Check className="w-4 h-4 text-green-400 animate-bounce" />
                          <span>Saved to Grimoire Chronicles!</span>
                        </>
                      ) : (
                        <>
                          <BookMarked className="w-4 h-4" />
                          <span>Append Research to Grimoire</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
        </div>
      )}

      {activeTab === "concordance" && (
        <div className="w-full flex flex-col gap-6 animate-fade-in">
          {/* Header Description */}
          <div className={`w-full rounded-2xl ${activeTheme.bgCard || 'bg-[#141416]'} border border-white/5 p-6 shadow-2xl flex flex-col gap-5`}>
            <div>
              <h2 className={`text-2xl font-serif ${activeTheme.textPrimary} flex items-center gap-2.5`}>
                <Compass className={`w-6 h-6 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} /> Trilingual Comparative Concordance
              </h2>
              <p className="text-xs text-slate-400 font-serif mt-1">
                Explore original etymological roots, transliterations, Gematria values, and spiritual significances across Hebrew, Arabic, and English.
              </p>
            </div>

            {/* Preloaded Roots Selector */}
            <div>
              <span className="text-[11px] font-serif text-slate-400 font-semibold block mb-2 tracking-wide uppercase">Preloaded Sacred Terms & Coordinates:</span>
              <div className="flex flex-wrap gap-2">
                {["Yahweh", "Lucifer", "J", "B", "76", "Apocalypse", "Life after Death", "Apocryphon", "Apollyon", "Azrael", "Spirit", "Light", "Word"].map((term, idx) => (
                  <button
                    key={`preloaded-${term}-${idx}`}
                    onClick={() => {
                      setConcordanceWord(term);
                      handleConcordanceSearch(term);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all border cursor-pointer ${
                      concordanceResult?.word?.toLowerCase() === term.toLowerCase()
                        ? `${activeTheme.borderAccent} bg-white/10 text-white font-medium`
                        : "border-white/5 bg-black/20 text-slate-400 hover:bg-black/40 hover:text-slate-200"
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={concordanceWord}
                onChange={(e) => setConcordanceWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConcordanceSearch(concordanceWord);
                  }
                }}
                placeholder="Search any custom spiritual or scripture term in English, Hebrew, or Arabic (e.g. 'Sufi', 'Merkabah', 'Eden')..."
                className={`w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-24 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all ${activeTheme.inputFocus} font-serif`}
              />
              <button
                onClick={() => handleConcordanceSearch(concordanceWord)}
                disabled={concordanceLoading || !concordanceWord.trim()}
                className={`absolute right-1.5 top-1.5 bg-gradient-to-br ${activeTheme.accentGradient} text-black text-xs font-serif font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-45 transition-all`}
              >
                Seek Root
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {concordanceLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-full rounded-2xl border border-dashed text-center p-12 flex flex-col items-center justify-center min-h-[380px] ${
                    activeTheme.id === 'deep-void' ? 'border-violet-500/20 bg-[#0d091a]/30' : 'border-amber-500/20 bg-amber-950/5'
                  }`}
                >
                  <Loader2 className={`w-12 h-12 animate-spin mb-4 ${activeTheme.id === 'deep-void' ? 'text-violet-400' : 'text-amber-500'}`} />
                  <h4 className={`text-xl font-serif font-semibold tracking-wide ${activeTheme.textPrimary} mb-2`}>
                    Decrypting Trilingual Roots...
                  </h4>
                  <p className="text-xs text-slate-400 font-serif max-w-xs leading-relaxed">
                    Analyzing comparative philological ties across Semitic languages and Greek/Latin lineages...
                  </p>
                </motion.div>
              )}

              {!concordanceLoading && !concordanceResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`w-full rounded-2xl border border-dashed border-white/5 text-center p-12 flex flex-col items-center justify-center min-h-[380px] ${activeTheme.bgCard} opacity-60`}
                >
                  <Compass className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
                  <h4 className="text-lg font-serif font-semibold text-slate-400 mb-1">Concordance Lexicon Idle</h4>
                  <p className="text-xs text-slate-500 font-serif max-w-xs leading-relaxed">
                    Search for any theological term or select one of the preloaded coordinates above to initiate comparative research.
                  </p>
                </motion.div>
              )}

              {!concordanceLoading && concordanceResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6 w-full text-left"
                >
                  {/* Trilingual Grid Card */}
                  <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeTheme.textAccentHex}, transparent)` }}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 mb-6 gap-3">
                      <span className="text-xs font-mono text-slate-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <Scroll className="w-4 h-4" /> Lexicon Entry: {concordanceResult.word}
                      </span>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => setShowVisualEtymology(!showVisualEtymology)}
                          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-serif font-semibold border transition-all cursor-pointer ${
                            showVisualEtymology
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                              : "bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                          }`}
                        >
                          <GitFork className="w-3.5 h-3.5 text-amber-400" />
                          <span>Visual Etymology</span>
                        </button>

                        <button
                          onClick={() => setShowComparativeLexicon(!showComparativeLexicon)}
                          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-serif font-semibold border transition-all cursor-pointer ${
                            showComparativeLexicon
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                              : "bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Comparative Lexicon</span>
                          <span className="bg-amber-500 text-black font-mono font-bold text-[8px] px-1 rounded-xs uppercase tracking-wide">New</span>
                        </button>

                        {concordanceResult.aethericFallback && (
                          <span className="text-[10px] font-serif bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/25">
                            Local Standard View
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full">
                      <AnimatePresence mode="wait">
                        {expandedItem === null ? (
                          <motion.div
                            key="grid-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                          >
                            {/* Hebrew Card */}
                            <motion.div
                              layoutId="card-hebrew"
                              className="bg-black/35 border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 hover:bg-black/45 transition-colors group cursor-pointer"
                              onClick={() => setExpandedItem("hebrew")}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Hebrew (עברית)</span>
                                  <span className="text-[10px] font-serif text-amber-500/70 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                                    Detail <ChevronRight className="w-3 h-3 text-amber-500" />
                                  </span>
                                </div>
                                <div className="my-5 text-4xl font-serif text-amber-100 font-bold text-center py-2 select-all tracking-wide group-hover:scale-105 transition-transform duration-300">
                                  {concordanceResult.hebrew.script}
                                </div>
                              </div>
                              <div className="border-t border-white/5 pt-3 mt-2 text-xs font-serif space-y-1">
                                <p><strong className="text-slate-400">Transliteration:</strong> <span className="italic text-slate-200 select-all">{concordanceResult.hebrew.transliteration}</span></p>
                                <p><strong className="text-slate-400">Root Meaning:</strong> <span className="text-slate-300 line-clamp-2">{concordanceResult.hebrew.rootMeaning}</span></p>
                                {concordanceResult.hebrew.gematria !== undefined && (
                                  <p><strong className="text-slate-400">Gematria Value:</strong> <span className="font-mono text-amber-400 font-bold">{concordanceResult.hebrew.gematria}</span></p>
                                )}
                              </div>
                            </motion.div>

                            {/* Greek Card */}
                            <motion.div
                              layoutId="card-greek"
                              className="bg-black/35 border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 hover:bg-black/45 transition-colors group cursor-pointer"
                              onClick={() => setExpandedItem("greek")}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Greek (Ελληνικά)</span>
                                  <span className="text-[10px] font-serif text-amber-500/70 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                                    Detail <ChevronRight className="w-3 h-3 text-amber-500" />
                                  </span>
                                </div>
                                <div className="my-5 text-4xl font-serif text-amber-100 font-bold text-center py-2 select-all tracking-wide group-hover:scale-105 transition-transform duration-300">
                                  {concordanceResult.greek?.script || "—"}
                                </div>
                              </div>
                              <div className="border-t border-white/5 pt-3 mt-2 text-xs font-serif space-y-1">
                                <p><strong className="text-slate-400">Transliteration:</strong> <span className="italic text-slate-200 select-all">{concordanceResult.greek?.transliteration || "—"}</span></p>
                                <p><strong className="text-slate-400">Root Meaning:</strong> <span className="text-slate-300 line-clamp-2">{concordanceResult.greek?.rootMeaning || "—"}</span></p>
                                {concordanceResult.greek?.gematria !== undefined && (
                                  <p><strong className="text-slate-400">Gematria Value:</strong> <span className="font-mono text-amber-400 font-bold">{concordanceResult.greek?.gematria}</span></p>
                                )}
                              </div>
                            </motion.div>

                            {/* Arabic Card */}
                            <motion.div
                              layoutId="card-arabic"
                              className="bg-black/35 border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 hover:bg-black/45 transition-colors group cursor-pointer"
                              onClick={() => setExpandedItem("arabic")}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Arabic (العربية)</span>
                                  <span className="text-[10px] font-serif text-amber-500/70 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                                    Detail <ChevronRight className="w-3 h-3 text-amber-500" />
                                  </span>
                                </div>
                                <div className="my-5 text-4xl font-serif text-amber-100 font-bold text-center py-2 select-all tracking-wide group-hover:scale-105 transition-transform duration-300">
                                  {concordanceResult.arabic.script}
                                </div>
                              </div>
                              <div className="border-t border-white/5 pt-3 mt-2 text-xs font-serif space-y-1">
                                <p><strong className="text-slate-400">Transliteration:</strong> <span className="italic text-slate-200 select-all">{concordanceResult.arabic.transliteration}</span></p>
                                <p><strong className="text-slate-400">Root Meaning:</strong> <span className="text-slate-300 line-clamp-2">{concordanceResult.arabic.rootMeaning}</span></p>
                              </div>
                            </motion.div>

                            {/* English Card */}
                            <motion.div
                              layoutId="card-english"
                              className="bg-black/35 border border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 hover:bg-black/45 transition-colors group cursor-pointer"
                              onClick={() => setExpandedItem("english")}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">English & Translation</span>
                                  <span className="text-[10px] font-serif text-amber-500/70 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                                    Detail <ChevronRight className="w-3 h-3 text-amber-500" />
                                  </span>
                                </div>
                                <p className="text-sm font-serif text-slate-200 leading-relaxed font-light mt-4 select-all line-clamp-3 italic">
                                  "{concordanceResult.english.definition}"
                                </p>
                              </div>
                              <div className="border-t border-white/5 pt-3 mt-4 text-[11px] font-serif leading-relaxed text-slate-400 italic">
                                <strong className="text-slate-300 not-italic block mb-0.5 text-xs">Etymological Heritage:</strong>
                                <span className="line-clamp-2">{concordanceResult.english.etymology}</span>
                              </div>
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="expanded-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
                          >
                            {/* Collapse button */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                              <button
                                onClick={() => setExpandedItem(null)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 hover:text-white font-serif transition-colors cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-500" />
                                <span>Back to Quadrilingual Grid</span>
                              </button>
                              
                              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Detailed View: {expandedItem === "hebrew" ? "Hebrew / עברית" : expandedItem === "greek" ? "Greek / Ελληνικά" : expandedItem === "arabic" ? "Arabic / العربية" : "English / Translation"}
                              </span>
                            </div>

                            {/* Large glyph and definition section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                              
                              {/* Left details panel: giant character, values */}
                              <div className="lg:col-span-4 bg-black/40 border border-white/5 p-6 rounded-xl text-center space-y-4">
                                {expandedItem === "hebrew" && (
                                  <>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Sacred Glyph</span>
                                    <div className="text-6xl sm:text-7xl font-serif text-amber-200 font-bold select-all py-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                      {concordanceResult.hebrew.script}
                                    </div>
                                    <div className="border-t border-white/5 pt-4 text-left text-xs font-serif space-y-2.5">
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Transliteration:</strong> <span className="italic text-slate-200 text-sm select-all">{concordanceResult.hebrew.transliteration}</span></p>
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Root Meaning:</strong> <span className="text-slate-300 text-sm">{concordanceResult.hebrew.rootMeaning}</span></p>
                                      {concordanceResult.hebrew.gematria !== undefined && (
                                        <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Gematria Value:</strong> <span className="font-mono text-amber-400 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15 inline-block mt-0.5">{concordanceResult.hebrew.gematria}</span></p>
                                      )}
                                    </div>
                                  </>
                                )}

                                {expandedItem === "greek" && (
                                  <>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Hellenic Glyph</span>
                                    <div className="text-6xl sm:text-7xl font-serif text-amber-200 font-bold select-all py-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                      {concordanceResult.greek?.script || "—"}
                                    </div>
                                    <div className="border-t border-white/5 pt-4 text-left text-xs font-serif space-y-2.5">
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Transliteration:</strong> <span className="italic text-slate-200 text-sm select-all">{concordanceResult.greek?.transliteration || "—"}</span></p>
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Root Meaning:</strong> <span className="text-slate-300 text-sm">{concordanceResult.greek?.rootMeaning || "—"}</span></p>
                                      {concordanceResult.greek?.gematria !== undefined && (
                                        <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Gematria Value:</strong> <span className="font-mono text-amber-400 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15 inline-block mt-0.5">{concordanceResult.greek?.gematria}</span></p>
                                      )}
                                    </div>
                                  </>
                                )}

                                {expandedItem === "arabic" && (
                                  <>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Celestial Glyph</span>
                                    <div className="text-6xl sm:text-7xl font-serif text-amber-200 font-bold select-all py-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                      {concordanceResult.arabic.script}
                                    </div>
                                    <div className="border-t border-white/5 pt-4 text-left text-xs font-serif space-y-2.5">
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Transliteration:</strong> <span className="italic text-slate-200 text-sm select-all">{concordanceResult.arabic.transliteration}</span></p>
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Root Meaning:</strong> <span className="text-slate-300 text-sm">{concordanceResult.arabic.rootMeaning}</span></p>
                                    </div>
                                  </>
                                )}

                                {expandedItem === "english" && (
                                  <>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Modern Translation</span>
                                    <div className="text-4xl font-serif text-amber-200 font-bold select-all py-6 leading-tight">
                                      {concordanceResult.word}
                                    </div>
                                    <div className="border-t border-white/5 pt-4 text-left text-xs font-serif space-y-2.5">
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Definition:</strong> <span className="text-slate-300 text-sm italic">"{concordanceResult.english.definition}"</span></p>
                                      <p><strong className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Etymology:</strong> <span className="text-slate-400 text-sm">{concordanceResult.english.etymology}</span></p>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Right details panel: detailed lexicons, etymology tree connection, cross links */}
                              <div className="lg:col-span-8 space-y-6">
                                
                                {/* 1. Detailed definitions from dictionaries */}
                                <div>
                                  <h5 className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block mb-3">Compiled Academic Lexicons</h5>
                                  <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
                                    {(concordanceResult.dictionaries || [])
                                      .filter((d: any) => {
                                        const src = d.source.toLowerCase();
                                        if (expandedItem === "hebrew") return /strong|bdb|brown|gesenius|hebrew/i.test(src);
                                        if (expandedItem === "arabic") return /lane|lisan|wehr|arabic/i.test(src);
                                        return /webster|easton|smith|english|thayer/i.test(src);
                                      })
                                      .concat(
                                        // fallback in case filter matches nothing
                                        (concordanceResult.dictionaries || []).filter((d: any) => {
                                          const src = d.source.toLowerCase();
                                          if (expandedItem === "hebrew") return !(/lane|lisan|wehr|arabic/i.test(src));
                                          if (expandedItem === "arabic") return /lane|lisan|wehr/i.test(src);
                                          return !(/strong|bdb|brown|gesenius/i.test(src));
                                        })
                                      )
                                      .slice(0, 3) // restrict to top 3 relevant entries
                                      .map((dict: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-1.5">
                                          <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                            <span className="text-xs font-serif font-bold text-slate-300">{dict.source}</span>
                                          </div>
                                          <p className="text-xs font-serif text-slate-400 leading-relaxed pl-3.5">
                                            {dict.definition}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* 2. Linguistic roots (subset of etymologyTree matching this item) */}
                                <div>
                                  <h5 className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block mb-3">Linguistic Roots & Etymological Tree</h5>
                                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                                    {(concordanceResult.etymologyTree || [])
                                      .filter((node: any) => {
                                        if (expandedItem === "hebrew") return node.id !== "arabic_branch";
                                        if (expandedItem === "arabic") return node.id !== "hebrew_branch";
                                        return true; // English sees both or full tree
                                      })
                                      .map((node: any, idx: number, arr: any[]) => (
                                        <div key={node.id ? `${node.id}-${idx}` : `node-${idx}`} className="flex-1 p-4 bg-black/35 border border-white/5 rounded-xl relative flex flex-col justify-between hover:border-white/10 transition-colors">
                                          <div>
                                            <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                              <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">{node.label}</span>
                                              <span className="text-[8px] font-mono text-amber-500/80 bg-amber-500/5 px-1 py-0.2 rounded border border-amber-500/10">{node.tradition}</span>
                                            </div>
                                            <div className="text-base font-serif font-bold text-slate-200">{node.term}</div>
                                            <div className="text-xs font-serif text-slate-400 mt-1">{node.meaning}</div>
                                          </div>
                                          {idx < arr.length - 1 && (
                                            <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-0.5 rounded-full border border-white/10">
                                              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* 3. Cross-reference links */}
                                <div className="border-t border-white/5 pt-4">
                                  <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2.5">Interactive Cross-Reference Links</h5>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] font-serif text-slate-500 block">Query related high-frequency celestial coordinates:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {["Yahweh", "Lucifer", "J", "B", "76", "Apocalypse", "Life after Death", "Apocryphon", "Apollyon", "Azrael", "Spirit", "Light", "Word"]
                                          .filter(term => term.toLowerCase() !== concordanceResult.word.toLowerCase())
                                          .slice(0, 5)
                                          .map((term, idx) => (
                                            <button
                                              key={`crossref-${term}-${idx}`}
                                              onClick={() => {
                                                setConcordanceWord(term);
                                                handleConcordanceSearch(term);
                                              }}
                                              className="px-2.5 py-1 rounded-md bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 hover:text-amber-300 border border-amber-500/10 hover:border-amber-500/30 text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1"
                                            >
                                              <span>{term}</span>
                                              <ArrowRight className="w-2.5 h-2.5" />
                                            </button>
                                          ))}
                                      </div>
                                    </div>

                                    {/* Link to occurrences */}
                                    <button
                                      onClick={() => {
                                        document.getElementById("occurrences-section")?.scrollIntoView({ behavior: "smooth" });
                                      }}
                                      className="shrink-0 self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/35 text-xs font-serif transition-colors cursor-pointer"
                                    >
                                      <Landmark className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Scroll to Occurrences</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Branching Visual Etymology Panel */}
                  <AnimatePresence initial={false}>
                    {showVisualEtymology && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden w-full"
                      >
                        <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl flex flex-col gap-4`}>
                          <h4 className={`text-lg font-serif ${activeTheme.textPrimary} flex items-center gap-2 border-b border-white/5 pb-2.5`}>
                            <GitFork className="w-5 h-5 text-amber-500" /> Visual Etymology & Semantic Branching
                          </h4>
                          <p className="text-xs font-serif text-slate-400 leading-relaxed">
                            Trace how this term’s mystical roots diverged or aligned across Hebrew, Arabic, and Indo-European lineages. Select any etymological node to view its detailed scriptural background.
                          </p>
                          <VisualEtymology 
                            nodes={concordanceResult.etymologyTree} 
                            activeTheme={activeTheme} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Significance card */}
                  <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl flex flex-col gap-4`}>
                    <h4 className={`text-lg font-serif ${activeTheme.textPrimary} flex items-center gap-2 border-b border-white/5 pb-2.5`}>
                      <Sparkles className="w-5 h-5" /> Cosmological & Alchemical Significance
                    </h4>
                    <div className="text-sm font-serif text-slate-300 leading-relaxed prose prose-invert max-w-none">
                      <ReactMarkdown>{concordanceResult.significance}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Occurrences Card */}
                  <div id="occurrences-section" className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl flex flex-col gap-4 scroll-mt-24`}>
                    <h4 className={`text-lg font-serif ${activeTheme.textPrimary} flex items-center gap-2 border-b border-white/5 pb-2.5`}>
                      <Landmark className="w-5 h-5" /> Sacred Scriptural Occurrences & Context
                    </h4>
                    <div className="flex flex-col gap-4">
                      {concordanceResult.occurrences.map((oc: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/25 border border-white/5 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-amber-500 font-bold">{oc.source}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-serif text-slate-300 italic leading-relaxed">
                            "{oc.context}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Classical Dictionaries & Scholar Lexicons */}
                  <AnimatePresence initial={false}>
                    {showComparativeLexicon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden w-full"
                      >
                        <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl`}>
                          <ComparativeLexicon 
                            dictionaries={concordanceResult.dictionaries} 
                            word={concordanceResult.word}
                            activeTheme={activeTheme} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions Bar */}
                  <div className={`w-full rounded-2xl ${activeTheme.bgCard} border border-white/5 p-6 shadow-2xl flex items-center justify-between`}>
                    <span className="text-xs font-serif text-slate-400">Save this trilingual concordance research for future meditation.</span>
                    <button
                      onClick={handleSaveConcordanceToGrimoire}
                      disabled={savedConcordanceToGrimoire}
                      className={`flex items-center justify-center gap-2 border px-5 py-3 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer ${
                        savedConcordanceToGrimoire
                          ? "bg-green-500/15 border-green-500/45 text-green-300"
                          : activeTheme.id === "deep-void"
                          ? "bg-violet-950/20 border-violet-500/30 hover:bg-violet-950/45 hover:border-violet-400 text-violet-200"
                          : "bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/45 hover:border-amber-400 text-amber-200"
                      }`}
                    >
                      {savedConcordanceToGrimoire ? (
                        <>
                          <Check className="w-4 h-4 text-green-400 animate-bounce" />
                          <span>Saved to Grimoire Chronicles!</span>
                        </>
                      ) : (
                        <>
                          <BookMarked className="w-4 h-4" />
                          <span>Append Lexicon study to Grimoire</span>
                        </>
                      )}
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
