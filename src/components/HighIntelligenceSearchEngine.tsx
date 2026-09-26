import React, { useState, useEffect } from "react";
import { Search, Brain, Sparkles, Globe, Cpu, ShieldCheck, ExternalLink, Bookmark, Check, RefreshCw, ThumbsUp, Star, Trash2, Download, Copy, ChevronRight, Layers, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

interface GroundingSource {
  title: string;
  url: string;
  snippet: string;
}

interface EngineProfile {
  name: string;
  badge: string;
  focus: string;
  summary: string;
}

interface SearchEnginesData {
  google: EngineProfile;
  bing: EngineProfile;
  duckduckgo: EngineProfile;
  yahoo: EngineProfile;
  ecosia: EngineProfile;
}

interface MemoryNode {
  id: string;
  topic: string;
  query: string;
  learnedInsight: string;
  confidenceScore: number;
  userRating?: number;
  timestamp: string;
}

interface HighIntelligenceSearchEngineProps {
  theme?: any;
}

const SAMPLE_QUERIES = [
  "Top 5 search engines comparison & architecture 2026",
  "High intelligence learning algorithms & autonomous AI models",
  "Sacred geometry & 76 keys in Salazar cosmology",
  "Quantum computing breakthroughs & error correction",
  "Apocrypha and Dead Sea Scrolls manuscript restoration"
];

export const HighIntelligenceSearchEngine: React.FC<HighIntelligenceSearchEngineProps> = ({ theme }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeEngineTab, setActiveEngineTab] = useState<"all" | "google" | "bing" | "duckduckgo" | "yahoo" | "ecosia">("all");
  
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [engines, setEngines] = useState<SearchEnginesData | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [currentMemory, setCurrentMemory] = useState<MemoryNode | null>(null);
  const [allMemories, setAllMemories] = useState<MemoryNode[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [ratedMemoryId, setRatedMemoryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/learning-memory");
      if (res.ok) {
        const data = await res.json();
        setAllMemories(data.memories || []);
      }
    } catch (e) {
      console.warn("Could not fetch learning memories:", e);
    }
  };

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSynthesis(null);
    setThinkingSteps([]);
    setEngines(null);

    try {
      const res = await fetch("/api/high-intelligence-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, mode: activeEngineTab, depth: "deep" })
      });

      if (!res.ok) {
        throw new Error(`Search failed with status ${res.status}`);
      }

      const data = await res.json();
      setSynthesis(data.synthesis);
      setThinkingSteps(data.highIntelligenceThinking || []);
      setEngines(data.engines || null);
      setGroundingSources(data.groundingSources || []);
      setCurrentMemory(data.learnedMemory || null);
      
      // Refresh memory log
      fetchMemories();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "High Intelligence Search Engine failed to process query.");
    } finally {
      setLoading(false);
    }
  };

  const rateMemory = async (memoryId: string, rating: number) => {
    try {
      const res = await fetch("/api/learning-memory/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryId, rating })
      });
      if (res.ok) {
        setRatedMemoryId(memoryId);
        fetchMemories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearMemories = async () => {
    if (!confirm("Are you sure you want to clear the Autonomous Learning Memory Store?")) return;
    try {
      await fetch("/api/learning-memory", { method: "DELETE" });
      setAllMemories([]);
      setCurrentMemory(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyMarkdown = () => {
    if (!synthesis) return;
    navigator.clipboard.writeText(synthesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!synthesis) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("High Intelligence Search Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Query: ${query}`, 14, 28);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, 34);

    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    const cleanText = synthesis.replace(/[#*`_]/g, "");
    const splitLines = doc.splitTextToSize(cleanText, 180);
    doc.text(splitLines, 14, 46);

    doc.save(`High_IQ_Search_${query.slice(0, 20).replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Autonomous Learning Intelligence Core
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              High Intelligence & Top 5 Search Engines
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Synthesize live knowledge across the world's <strong className="text-cyan-300 font-semibold">Top 5 Search Engines</strong> (Google, Bing, DuckDuckGo, Yahoo!, Ecosia/Perplexity) with real-time web grounding and autonomous continuous learning.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Learning Memory Store</div>
              <div className="text-lg font-bold text-cyan-300 font-mono">{allMemories.length} Vector Nodes</div>
            </div>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="mt-6 sm:mt-8 space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask anything or search across top 5 engines (e.g. quantum physics, cosmology, tech architecture)..."
              className="w-full pl-12 pr-32 py-4 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-base transition-all shadow-xl"
            />
            <Search className="absolute left-4 w-5 h-5 text-cyan-400" />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span className="hidden sm:inline">Thinking...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Search All</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Query Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-cyan-400" /> Suggested Queries:
            </span>
            {SAMPLE_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className="text-xs px-3 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-slate-300 transition-all cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Engine Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: "all", name: "Top 5 Engines Synthesis", icon: Layers, badge: "Composite" },
          { id: "google", name: "Google Search", icon: Globe, badge: "Live Grounding" },
          { id: "bing", name: "Bing Search", icon: Cpu, badge: "Enterprise Index" },
          { id: "duckduckgo", name: "DuckDuckGo", icon: ShieldCheck, badge: "Unbiased Privacy" },
          { id: "yahoo", name: "Yahoo! Search", icon: Sparkles, badge: "Media News" },
          { id: "ecosia", name: "Ecosia / Perplexity", icon: Brain, badge: "Eco Research" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeEngineTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveEngineTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{tab.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-slate-800 text-slate-400"
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-xs underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Thinking Chain indicator when loading */}
      {loading && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 animate-pulse">
          <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>High Intelligence Core is thinking & querying Top 5 Search Engines...</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-cyan-500/20 rounded-full w-3/4 animate-pulse" />
            <div className="h-2 bg-indigo-500/20 rounded-full w-1/2 animate-pulse" />
            <div className="h-2 bg-sky-500/20 rounded-full w-5/6 animate-pulse" />
          </div>
        </div>
      )}

      {/* Main Results Section */}
      {synthesis && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Research Output (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reasoning / High Intelligence Thinking Steps */}
            {thinkingSteps.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/70 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-indigo-300">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  High Intelligence Reasoning Chain ({thinkingSteps.length} Steps)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {thinkingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Synthesis Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-slate-100">Multi-Engine Intelligence Synthesis</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
                    title="Export PDF Report"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Render Markdown Synthesis */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                <ReactMarkdown>{synthesis}</ReactMarkdown>
              </div>
            </div>

            {/* Top 5 Search Engines Individual Cards */}
            {engines && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Top 5 Search Engine Perspectives Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "google", profile: engines.google, color: "border-blue-500/30 bg-blue-950/20 text-blue-300" },
                    { key: "bing", profile: engines.bing, color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300" },
                    { key: "duckduckgo", profile: engines.duckduckgo, color: "border-amber-500/30 bg-amber-950/20 text-amber-300" },
                    { key: "yahoo", profile: engines.yahoo, color: "border-purple-500/30 bg-purple-950/20 text-purple-300" },
                    { key: "ecosia", profile: engines.ecosia, color: "border-teal-500/30 bg-teal-950/20 text-teal-300" },
                  ].map(({ key, profile, color }) => (
                    <div key={key} className={`p-4 rounded-xl border ${color} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-100">{profile.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                          {profile.badge}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400">{profile.focus}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{profile.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Web Citations & Autonomous Memory Log */}
          <div className="space-y-6">
            {/* Autonomous Learned Memory Card */}
            {currentMemory && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 font-bold">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    New Learned Vector Insight
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Conf: {Math.round(currentMemory.confidenceScore * 100)}%
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200">
                  Topic: {currentMemory.topic}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                  "{currentMemory.learnedInsight}"
                </p>

                {/* Rating / Feedback buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">Rate insight accuracy:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => rateMemory(currentMemory.id, star)}
                        className={`p-1 hover:text-amber-300 transition-colors cursor-pointer ${
                          (currentMemory.userRating || 0) >= star ? "text-amber-400" : "text-slate-600"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Live Web Grounding Sources */}
            {groundingSources.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  Verified Web Citations ({groundingSources.length})
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {groundingSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                        <span className="truncate max-w-[200px]">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{src.snippet}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Past Learning Memory Log */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  Memory History ({allMemories.length})
                </div>
                {allMemories.length > 0 && (
                  <button
                    onClick={clearMemories}
                    className="p-1.5 rounded bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 text-xs transition-colors cursor-pointer"
                    title="Clear Memories"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {allMemories.length === 0 ? (
                <div className="text-xs text-slate-500 italic text-center py-4">
                  No learned memory nodes stored yet. Submit queries above to train the AI!
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {allMemories.map((mem, idx) => (
                    <div key={`${mem.id}-${idx}`} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span className="truncate max-w-[180px]">"{mem.query}"</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(mem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{mem.learnedInsight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighIntelligenceSearchEngine;
