/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Scroll, Columns, Sparkles, Layers, ArrowLeftRight, 
  HelpCircle, Info, Landmark, Check, Star, BadgeAlert, Scale,
  Pin, Loader2, AlertCircle
} from "lucide-react";

export interface DictionaryEntry {
  source: string;
  definition: string;
}

interface ComparativeLexiconProps {
  dictionaries?: DictionaryEntry[];
  word: string;
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    bgCard: string;
    starStroke: string;
    accentGlow: string;
  };
}

export default function ComparativeLexicon({ dictionaries = [], word, activeTheme }: ComparativeLexiconProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareLeft, setCompareLeft] = useState<number>(0);
  const [compareRight, setCompareRight] = useState<number>(1);

  // API Integration States
  const [fetchedDictionaries, setFetchedDictionaries] = useState<DictionaryEntry[] | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pinnedSources, setPinnedSources] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!word) return;
    let isMounted = true;
    const fetchLexiconData = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const response = await fetch("/api/comparative-lexicon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word })
        });
        if (!response.ok) {
          throw new Error("Failed to consult the celestial records.");
        }
        const data = await response.json();
        if (isMounted) {
          if (data && data.dictionaries) {
            setFetchedDictionaries(data.dictionaries);
          } else {
            setFetchedDictionaries([]);
          }
        }
      } catch (err: any) {
        console.warn("Error fetching comparative lexicon:", err);
        if (isMounted) {
          setApiError(err.message || "Celestial connection interrupted");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Helper state handler since setLoading isn't declared, we use setApiLoading
    const setLoading = (val: boolean) => {
      setApiLoading(val);
    };

    fetchLexiconData();

    return () => {
      isMounted = false;
    };
  }, [word]);

  // Default lexicons merged with fetched ones
  const validDictionaries = useMemo(() => {
    if (fetchedDictionaries && fetchedDictionaries.length > 0) return fetchedDictionaries;
    if (dictionaries && dictionaries.length > 0) return dictionaries;
    return [
      {
        source: "Strong's Exhaustive Concordance",
        definition: `A mechanical indexing of '${word}', focusing on the primary Greek/Hebrew root, literal translation keys, and occurrences across scriptures.`
      },
      {
        source: "Gesenius' Hebrew Lexicon",
        definition: `A deep philological analysis of '${word}', tracing Semitic cognates in Phoenician, Aramaic, and Arabic, highlighting grammatical inflections.`
      },
      {
        source: "Thayer's Greek Lexicon",
        definition: `Grammatical and theological parsing of '${word}', analyzing Hellenistic context, classical Greek heritage, and shifts in meaning.`
      }
    ];
  }, [fetchedDictionaries, dictionaries, word]);

  // Auto-align left and right selection bounds when validDictionaries changes
  useEffect(() => {
    setCompareLeft(0);
    setCompareRight(Math.min(1, validDictionaries.length - 1));
    setActiveTab(0);
  }, [validDictionaries]);

  // Pin a specific lexicon result to the user's Grimoire Notes
  const handlePinSource = (source: string, definition: string) => {
    try {
      const savedNotesStr = localStorage.getItem("mystical_grimoire_notes");
      let existingNotes: any[] = [];
      if (savedNotesStr) {
        existingNotes = JSON.parse(savedNotesStr);
      }

      const formattedMarkdown = `### Lexicon Study: ${word} (${source})

${definition}

---
*Pin extracted from the Comparative Lexicon study of **${word}** on ${new Date().toLocaleString()}*`;

      const newNote = {
        id: crypto.randomUUID(),
        title: `Lexicon Study: ${word} (${source.replace("'s", "")})`,
        content: formattedMarkdown,
        school: "Comparative Lexicon",
        color: activeTheme.id === "deep-void" 
          ? "bg-[#161f38]/95 border-blue-900/40" 
          : activeTheme.id === "ethereal-silver"
          ? "bg-[#1a2e1d]/95 border-emerald-900/45"
          : "bg-[#2e2b1c]/95 border-amber-900/45",
        pinned: true, // Specifically pinned
        createdAt: new Date().toLocaleString()
      };

      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("mystical_grimoire_notes", JSON.stringify(updatedNotes));

      // Dispatch events to notify GrimoireNotes to reload
      window.dispatchEvent(new Event("grimoire-updated"));
      window.dispatchEvent(new Event("mystical_notes_updated"));

      setPinnedSources(prev => ({ ...prev, [source]: true }));
      setTimeout(() => {
        setPinnedSources(prev => ({ ...prev, [source]: false }));
      }, 2000);
    } catch (e) {
      console.warn("Failed pinning lexicon result:", e);
    }
  };

  // Dynamically assign metrics based on the dictionary source name to add high-fidelity visual context
  const getLexiconMetrics = (source: string) => {
    const src = source.toLowerCase();
    if (src.includes("strong")) {
      return {
        rigor: 85,
        depth: 60,
        literalness: 95,
        type: "Mechanical & Indexical",
        era: "19th Century (James Strong)",
        focus: "Root indexing, Concordance references, Literal concordance"
      };
    }
    if (src.includes("gesenius")) {
      return {
        rigor: 95,
        depth: 85,
        literalness: 80,
        type: "Philological & Historical Semitics",
        era: "19th Century (Wilhelm Gesenius)",
        focus: "Grammar, Semitic cognates, Morphological lineage"
      };
    }
    if (src.includes("thayer")) {
      return {
        rigor: 92,
        depth: 80,
        literalness: 75,
        type: "Koine Philology & Hermeneutics",
        era: "Late 19th Century (Joseph Thayer)",
        focus: "New Testament theology, Classical Greek transitions"
      };
    }
    if (src.includes("brown") || src.includes("bdb")) {
      return {
        rigor: 94,
        depth: 90,
        literalness: 85,
        type: "Lexicographical & Biblical Theology",
        era: "Early 20th Century (BDB)",
        focus: "Root classification, Textual occurrences, Theology"
      };
    }
    if (src.includes("lane") || src.includes("wehr") || src.includes("lisan")) {
      return {
        rigor: 98,
        depth: 95,
        literalness: 70,
        type: "Classical Lexicography & Etymology",
        era: "Classic Islamic / Scholar Heritage",
        focus: "Desert root metaphors, Quranic context, Esoteric nuances"
      };
    }
    return {
      rigor: 80,
      depth: 75,
      literalness: 80,
      type: "Theological Lexicon",
      era: "Classical Scholar Era",
      focus: "Scriptural definition and comparative meaning"
    };
  };

  // Generate dynamic, intelligent comparative variances based on the word and dictionaries available
  const semanticVariances = useMemo(() => {
    const lower = word.toLowerCase();
    
    if (lower.includes("overcome") || lower.includes("victory")) {
      return [
        {
          title: "The Philological Shift: Action vs. State",
          description: "Strong’s treats 'Netzach' H5329 mechanically as a task-oriented verb ('to excel, oversee'), whereas BDB/Gesenius highlight its evolution into a permanent cosmological state ('victory, perpetuity, everlastingness')."
        },
        {
          title: "Mystical Coexistence",
          description: "In classical theology, BDB notes that the word bridges active labor (overcoming obstacles) and static rest (the eternal glory of victory). In Kabbalistic texts, Gesenius notes the word becomes the title of the seventh Sephirah—the victory of active endurance."
        }
      ];
    }
    if (lower.includes("flame") || lower.includes("fire")) {
      return [
        {
          title: "Physical Combustion vs. Supernatural Presence",
          description: "Strong’s (H784) indexes 'Esh' as physical flame and heat. In contrast, BDB and Gesenius map the root's dualistic application: the literal metallurgical solvent used in purifying silver versus the supernatural 'consuming fire' of Sinai."
        },
        {
          title: "Sufi vs. Western Semitic Cognates",
          description: "Lane's and Arabic lexicons treat 'Lahab' as an active blazing column that ascends and disintegrates form, contrasting with the Hebrew 'Esh', which acts as an abiding localized presence (the burning bush)."
        }
      ];
    }
    if (lower.includes("seven") || lower.includes("star")) {
      return [
        {
          title: "Number vs. Covenantal Binding",
          description: "Strong's indexes 'Sheva' H7651 purely as a cardinal count. Gesenius and BDB trace the root 'Shāba' directly to oath-taking—revealing that 'Seven' in Semitic thought is not merely a numerical digit but a solemn binding of the soul to cosmic order."
        },
        {
          title: "Celestial Correspondence",
          description: "Thayer’s details the shift in Koine Greek ('Hepta'), where the seven stars of Revelation are interpreted both as localized church leaders and as universal cosmic planetary governors guiding human history."
        }
      ];
    }
    if (lower.includes("circle")) {
      return [
        {
          title: "Geometric Space vs. Celestial Vault",
          description: "Strong’s H2329 ('Chug') lists the concrete definition as 'circle, circuit'. Gesenius highlights its spatial meaning: the vaulted sky or protective dome drawn by the Creator over the formless abyss."
        },
        {
          title: "Orbital Cycles in Sufi Thought",
          description: "Arabic lexicons for 'Da'irah' emphasize the complete cyclic return and orbit, framing the universe as an encompassing ring where the seeker’s travel starts and terminates at the same point."
        }
      ];
    }

    return [
      {
        title: "Literal Translation vs. Contextual Heritage",
        description: `Strong’s provides direct English translation keys for '${word}', offering a direct mapping of the underlying text. Gesenius/Thayer, conversely, expose the ancient cultural background, tracing how the root's core meaning adapted across decades of social and philosophical transitions.`
      },
      {
        title: "Root Evolution and Semantic Expansion",
        description: `Comparing these records shows that while indexers focus on the immediate grammatical function of '${word}', classical scholars trace the term’s lineage back to raw bodily actions (like breathing, walking, or binding) before expanding into modern theological concepts.`
      }
    ];
  }, [word]);

  const activeMetrics = getLexiconMetrics(validDictionaries[activeTab]?.source || "");

  return (
    <div className="w-full flex flex-col gap-6" id="comparative_lexicon_container">
      
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">Lexicon Analyzer</span>
          <h3 className={`text-lg font-serif ${activeTheme.textPrimary} font-semibold flex items-center gap-2`}>
            <Scale className="w-5 h-5 text-amber-500/80" /> Comparative Lexicon Pane
          </h3>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 self-stretch sm:self-auto justify-between gap-1">
          <button
            onClick={() => setCompareMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all cursor-pointer ${
              !compareMode 
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]" 
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exhaustive View</span>
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all cursor-pointer ${
              compareMode 
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]" 
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main Comparative Stage with Loading Overlays */}
      <div className="relative min-h-[220px] w-full">
        <AnimatePresence mode="wait">
          {apiLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 rounded-2xl border border-dashed border-white/10 p-12 text-center z-20 min-h-[220px]"
            >
              <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
              <p className="text-sm font-serif text-slate-300">Consulting Strong's, Gesenius, and Thayer registries...</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Fetching dynamic comparative lexicon definitions</p>
            </motion.div>
          ) : apiError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center bg-black/30 border border-red-500/10 p-8 rounded-xl text-center gap-3"
            >
              <AlertCircle className="w-10 h-10 text-red-500/80" />
              <div>
                <p className="text-sm font-serif text-slate-300">Celestial Lexicon interrupted: {apiError}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Utilizing high-fidelity offline fallbacks</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!compareMode ? (
            /* STANDARD TABBED VIEW */
            <motion.div
              key="tabbed-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Sidebar Tab List */}
              <div className="lg:col-span-1 flex flex-col gap-2 bg-black/25 rounded-xl p-3 border border-white/5 h-fit">
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-2 mb-1">Available Records</span>
                {validDictionaries.map((dict, idx) => {
                  const isSelected = activeTab === idx;
                  const m = getLexiconMetrics(dict.source);
                  return (
                    <button
                      key={`tab-${idx}`}
                      onClick={() => setActiveTab(idx)}
                      className={`text-left p-3 rounded-lg border transition-all flex flex-col gap-1.5 cursor-pointer group ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md"
                          : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scroll className={`w-4 h-4 ${isSelected ? 'text-amber-400 animate-pulse' : 'text-slate-500 group-hover:text-slate-400'}`} />
                          <span className="text-xs font-serif font-semibold truncate max-w-[150px]">
                            {dict.source}
                          </span>
                        </div>
                        {pinnedSources[dict.source] && (
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">Pinned</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-white/5 pt-1.5 w-full">
                        <span>{m.type}</span>
                        <span className={isSelected ? "text-amber-400" : "text-slate-600"}>Rigor: {m.rigor}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Content Display and Metrics */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Detailed Definition Card */}
                <div className="bg-black/40 rounded-xl border border-white/5 p-5 relative overflow-hidden flex flex-col gap-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,#ffffff03,transparent)] pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-500/70" />
                      <span className="text-sm font-serif font-bold text-amber-100">{validDictionaries[activeTab]?.source}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-slate-500">{activeMetrics.era}</span>
                      
                      {/* PIN BUTTON */}
                      <button
                        onClick={() => handlePinSource(validDictionaries[activeTab].source, validDictionaries[activeTab].definition)}
                        className={`p-1.5 rounded bg-white/5 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-serif ${
                          pinnedSources[validDictionaries[activeTab]?.source]
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-200"
                        }`}
                        title="Pin result to Grimoire Journal"
                      >
                        <Pin className={`w-3.5 h-3.5 ${pinnedSources[validDictionaries[activeTab]?.source] ? "text-emerald-400" : "text-amber-500"}`} />
                        <span>{pinnedSources[validDictionaries[activeTab]?.source] ? "Pinned" : "Pin Result"}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-serif text-slate-200 leading-relaxed select-all font-light whitespace-pre-wrap bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                    {validDictionaries[activeTab]?.definition}
                  </p>

                  {/* Scope of Analysis */}
                  <div className="flex items-center gap-2 text-[10px] font-serif text-slate-400 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <Info className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                    <span>
                      <strong className="text-slate-300">Lexical focus:</strong> {activeMetrics.focus}
                    </span>
                  </div>
                </div>

                {/* Scholar Metric Dashboard */}
                <div className="bg-black/45 rounded-xl border border-white/5 p-5">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-4 flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Layers className="w-4 h-4 text-amber-500/80" /> Lexicon Classification Metrics
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Metric 1 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Philological Rigor</span>
                        <span className="text-amber-400 font-bold">{activeMetrics.rigor}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeMetrics.rigor}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-amber-500 h-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        />
                      </div>
                      <span className="text-[8px] font-serif text-slate-500 mt-1">Grammar parsing accuracy & ancient root comparative depth.</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Mystical/Semantic Depth</span>
                        <span className="text-emerald-400 font-bold">{activeMetrics.depth}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeMetrics.depth}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                      <span className="text-[8px] font-serif text-slate-500 mt-1">Exploration of spiritual, theological, or esoteric layers of meaning.</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Literalness Factor</span>
                        <span className="text-blue-400 font-bold">{activeMetrics.literalness}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeMetrics.literalness}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-blue-500 h-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                      <span className="text-[8px] font-serif text-slate-500 mt-1">Focus on direct translations and raw historical/mechanical index keys.</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            /* COMPARATIVE SIDE-BY-SIDE VIEW */
            <motion.div
              key="comparative-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Split Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/25 rounded-xl p-4 border border-white/5">
                
                {/* Left Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Lexicon A:</span>
                  <select
                    value={compareLeft}
                    onChange={(e) => setCompareLeft(Number(e.target.value))}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-serif text-amber-200 focus:outline-none focus:border-amber-500/50 cursor-pointer flex-1"
                  >
                    {validDictionaries.map((dict, idx) => (
                      <option key={`left-opt-${idx}`} value={idx} disabled={idx === compareRight}>
                        {dict.source}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Right Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Lexicon B:</span>
                  <select
                    value={compareRight}
                    onChange={(e) => setCompareRight(Number(e.target.value))}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-serif text-amber-200 focus:outline-none focus:border-amber-500/50 cursor-pointer flex-1"
                  >
                    {validDictionaries.map((dict, idx) => (
                      <option key={`right-opt-${idx}`} value={idx} disabled={idx === compareLeft}>
                        {dict.source}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Split Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lexicon A Card */}
                <div className="bg-black/35 rounded-xl border border-white/5 p-5 relative flex flex-col gap-3 min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-serif font-bold text-amber-200 select-all max-w-[150px] truncate">
                      {validDictionaries[compareLeft]?.source}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* PIN BUTTON LEFT */}
                      <button
                        onClick={() => handlePinSource(validDictionaries[compareLeft].source, validDictionaries[compareLeft].definition)}
                        className={`p-1.5 rounded bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-200 transition-all cursor-pointer`}
                        title="Pin to Grimoire"
                      >
                        <Pin className="w-3 h-3 text-amber-500" />
                      </button>
                      <span className="text-[9px] font-mono text-amber-500/65 uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/5 border border-amber-500/10">Lexicon A</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed select-all font-light flex-1">
                    {validDictionaries[compareLeft]?.definition}
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 border-t border-white/5 pt-2 mt-2 flex justify-between items-center">
                    <span>Focus: {getLexiconMetrics(validDictionaries[compareLeft]?.source || "").type}</span>
                    <span>Rigor: {getLexiconMetrics(validDictionaries[compareLeft]?.source || "").rigor}%</span>
                  </div>
                </div>

                {/* Lexicon B Card */}
                <div className="bg-black/35 rounded-xl border border-white/5 p-5 relative flex flex-col gap-3 min-h-[220px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-serif font-bold text-amber-200 select-all max-w-[150px] truncate">
                      {validDictionaries[compareRight]?.source}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* PIN BUTTON RIGHT */}
                      <button
                        onClick={() => handlePinSource(validDictionaries[compareRight].source, validDictionaries[compareRight].definition)}
                        className={`p-1.5 rounded bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-200 transition-all cursor-pointer`}
                        title="Pin to Grimoire"
                      >
                        <Pin className="w-3 h-3 text-amber-500" />
                      </button>
                      <span className="text-[9px] font-mono text-emerald-500/65 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">Lexicon B</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed select-all font-light flex-1">
                    {validDictionaries[compareRight]?.definition}
                  </p>
                  <div className="text-[9px] font-mono text-slate-500 border-t border-white/5 pt-2 mt-2 flex justify-between items-center">
                    <span>Focus: {getLexiconMetrics(validDictionaries[compareRight]?.source || "").type}</span>
                    <span>Rigor: {getLexiconMetrics(validDictionaries[compareRight]?.source || "").rigor}%</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Semantic Variance Analysis Subsection */}
      <div className="bg-black/30 rounded-xl border border-white/5 p-5 flex flex-col gap-4">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
          <ArrowLeftRight className="w-4 h-4 text-amber-500" /> Semantic Variance & Scholar Hermeneutics
        </h4>
        <p className="text-xs font-serif text-slate-400 leading-relaxed">
          Comparing these sources reveals semantic divergences. Scholars interpret these words based on historical contexts, which leads to theological variances:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {semanticVariances.map((variance, idx) => (
            <div key={`variance-${idx}`} className="p-4 rounded-xl bg-black/25 border border-white/5 hover:border-amber-500/15 transition-all flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="bg-amber-500/10 rounded p-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <h5 className="text-xs font-serif font-semibold text-slate-200">{variance.title}</h5>
              </div>
              <p className="text-xs font-serif text-slate-400 leading-relaxed pl-7 select-all">
                {variance.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
