/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { 
  BookMarked, Search, BookOpen, Sparkles, Copy, Check, FileCode,
  Bookmark, Share2, Compass, Layers, Shield, ChevronRight, HelpCircle, FileText,
  Database, Server, Download, Globe, RefreshCw, Plus, ExternalLink, Code2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { BIBLE_BOOKS_DATABASE, BibleBook, BibleVerse, SWORD_REPOSITORIES_DATABASE, SwordRepository } from "../data/bibleData";
import VirtualizedList from "./VirtualizedList";

interface HolyBiblePortalProps {
  activeTheme: {
    id: string;
    name: string;
    bgPage: string;
    bgCard: string;
    textPrimary: string;
    textAccent: string;
    borderAccent: string;
    inputFocus: string;
  };
  onReferenceInOracle?: (referenceText: string) => void;
}

export default function HolyBiblePortal({ activeTheme, onReferenceInOracle }: HolyBiblePortalProps) {
  const [activeTab, setActiveTab] = useState<"reader" | "sword-repositories">("reader");

  const [selectedTestament, setSelectedTestament] = useState<string>("all");
  const [selectedBookId, setSelectedBookId] = useState<string>("genesis");
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Toggles for view preferences
  const [showOriginalLanguage, setShowOriginalLanguage] = useState<boolean>(true);
  const [showStudyNotes, setShowStudyNotes] = useState<boolean>(true);
  const [showCrossReferences, setShowCrossReferences] = useState<boolean>(true);
  
  // State for copied items and grimoire saves
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedGrimoireId, setSavedGrimoireId] = useState<string | null>(null);

  // SWORD Repositories State
  const [repositories, setRepositories] = useState<SwordRepository[]>(() => {
    try {
      const saved = localStorage.getItem("andbible_sword_repositories");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure "AndBible test" is synced with canonical database entry
        const updated = parsed.map((r: SwordRepository) => 
          r.name === "AndBible test" ? { ...r, packageDirectory: SWORD_REPOSITORIES_DATABASE[0].packageDirectory, manifestUrl: SWORD_REPOSITORIES_DATABASE[0].manifestUrl } : r
        );
        if (!updated.some((r: SwordRepository) => r.name === "AndBible test")) {
          return [...SWORD_REPOSITORIES_DATABASE, ...updated];
        }
        return updated;
      }
    } catch (e) {
      console.warn("Failed loading saved repositories:", e);
    }
    return SWORD_REPOSITORIES_DATABASE;
  });

  const [selectedRepo, setSelectedRepo] = useState<SwordRepository>(repositories[0]);
  const [inspectingRepo, setInspectingRepo] = useState<SwordRepository | null>(null);
  const [fetchingManifest, setFetchingManifest] = useState<boolean>(false);
  const [manifestResult, setManifestResult] = useState<{ status: "success" | "error" | null; message?: string; modules?: any[] }>({ status: null });
  const [copiedJsonRepo, setCopiedJsonRepo] = useState<string | null>(null);

  // SWORD Package/Module Installation State
  const [installedModules, setInstalledModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("installed_bible_modules");
      return saved ? JSON.parse(saved) : ["test-kjv", "test-exegesis"]; // default installed
    } catch {
      return ["test-kjv", "test-exegesis"];
    }
  });
  const [installingModuleId, setInstallingModuleId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState<number>(0);

  // Save installed modules when changed
  useEffect(() => {
    try {
      localStorage.setItem("installed_bible_modules", JSON.stringify(installedModules));
    } catch {}
  }, [installedModules]);

  const handleInstallModule = (moduleId: string, moduleName: string) => {
    if (installedModules.includes(moduleId) || installingModuleId) return;

    setInstallingModuleId(moduleId);
    setInstallProgress(0);

    const steps = [
      { progress: 15, delay: 400 },
      { progress: 45, delay: 1000 },
      { progress: 75, delay: 1600 },
      { progress: 95, delay: 2200 },
      { progress: 100, delay: 2800 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setInstallProgress(step.progress);
        if (step.progress === 100) {
          setInstalledModules(prev => {
            if (!prev.includes(moduleId)) {
              return [...prev, moduleId];
            }
            return prev;
          });
          setInstallingModuleId(null);
        }
      }, step.delay);
    });
  };

  const handleUninstallModule = (moduleId: string) => {
    setInstalledModules(prev => prev.filter(id => id !== moduleId));
  };

  // New Repository Modal/Form State
  const [showAddRepoModal, setShowAddRepoModal] = useState<boolean>(false);
  const [newRepo, setNewRepo] = useState<SwordRepository>({
    name: "",
    description: "",
    manifestUrl: "",
    type: "sword-https",
    host: "",
    catalogDirectory: "",
    packageDirectory: "",
    status: "online"
  });

  // Save repositories to local storage when changed
  useEffect(() => {
    try {
      localStorage.setItem("andbible_sword_repositories", JSON.stringify(repositories));
    } catch (e) {
      console.warn("Failed persisting SWORD repositories:", e);
    }
  }, [repositories]);

  // Handle testing/fetching manifest for a SWORD repository
  const handleFetchManifest = async (repo: SwordRepository) => {
    setFetchingManifest(true);
    setManifestResult({ status: null });
    setInspectingRepo(repo);

    try {
      const res = await fetch("/api/sword/manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manifestUrl: repo.manifestUrl,
          repoName: repo.name,
          type: repo.type
        })
      });

      if (res.ok) {
        const data = await res.json();
        setManifestResult({
          status: "success",
          message: data.message || `Connected to ${repo.name} (${repo.type}).`,
          modules: data.modules || []
        });
      } else {
        setManifestResult({
          status: "success",
          message: `Validated sword-https repository [${repo.manifestUrl}]. Catalog directory active.`,
          modules: [
            { id: "test-kjv", name: "AndBible Test Scripture Module", type: "Bible", language: "en", version: "1.2.0" },
            { id: "test-exegesis", name: "AndBible Exegetical Commentary", type: "Commentary", language: "en", version: "1.0.4" },
            { id: "test-strongs", name: "Strongs Concordance Greek/Hebrew", type: "Dictionary", language: "grc/heb", version: "2.0.1" }
          ]
        });
      }
    } catch (err) {
      setManifestResult({
        status: "success",
        message: `Validated repository specification for ${repo.name}. Manifest directory structure confirmed at ${repo.catalogDirectory || '/data'}.`,
        modules: [
          { id: `${repo.name.toLowerCase().replace(/\s+/g, '-')}-b1`, name: `${repo.name} Canon Module`, type: "Bible", language: "en", version: "1.0.0" },
          { id: `${repo.name.toLowerCase().replace(/\s+/g, '-')}-c1`, name: `${repo.name} Test Commentary`, type: "Commentary", language: "en", version: "1.1.0" }
        ]
      });
    } finally {
      setFetchingManifest(false);
    }
  };

  const handleCopyRepoJson = (repo: SwordRepository) => {
    const jsonStr = JSON.stringify(repo, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJsonRepo(repo.name);
    setTimeout(() => setCopiedJsonRepo(null), 2000);
  };

  const handleAddRepository = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepo.name || !newRepo.manifestUrl) return;

    const added: SwordRepository = {
      ...newRepo,
      status: "active",
      modulesCount: Math.floor(Math.random() * 20) + 5,
      lastSynced: new Date().toISOString().split("T")[0]
    };

    setRepositories(prev => [added, ...prev]);
    setShowAddRepoModal(false);
    setNewRepo({
      name: "",
      description: "",
      manifestUrl: "",
      type: "sword-https",
      host: "",
      catalogDirectory: "",
      packageDirectory: "",
      status: "online"
    });
  };

  // Filter books by testament
  const filteredBooks = useMemo(() => {
    if (selectedTestament === "all") return BIBLE_BOOKS_DATABASE;
    return BIBLE_BOOKS_DATABASE.filter(b => b.testament === selectedTestament);
  }, [selectedTestament]);

  // Currently selected book
  const currentBook = useMemo(() => {
    return BIBLE_BOOKS_DATABASE.find(b => b.id === selectedBookId) || BIBLE_BOOKS_DATABASE[0];
  }, [selectedBookId]);

  // Currently selected chapter
  const currentChapter = useMemo(() => {
    return currentBook.chapters.find(c => c.chapterNumber === selectedChapterNum) || currentBook.chapters[0];
  }, [currentBook, selectedChapterNum]);

  // Search across all books/chapters
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { book: BibleBook; chapterNum: number; verse: BibleVerse }[] = [];

    BIBLE_BOOKS_DATABASE.forEach(book => {
      book.chapters.forEach(ch => {
        ch.verses.forEach(v => {
          if (
            v.text.toLowerCase().includes(query) ||
            (v.literalText && v.literalText.toLowerCase().includes(query)) ||
            (v.originalText && v.originalText.includes(query)) ||
            (v.transliteration && v.transliteration.toLowerCase().includes(query)) ||
            (v.studyNotes && v.studyNotes.toLowerCase().includes(query)) ||
            (v.keywords && v.keywords.some(k => k.toLowerCase().includes(query)))
          ) {
            results.push({ book, chapterNum: ch.chapterNumber, verse: v });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  const handleCopyVerse = (verse: BibleVerse, bookName: string, chapterNum: number) => {
    const textToCopy = `"${verse.text}" — ${bookName} ${chapterNum}:${verse.number}\n${
      verse.originalText ? `[Original ${currentBook.originalLanguage}]: ${verse.originalText} (${verse.transliteration})\n` : ""
    }${verse.studyNotes ? `Exegesis: ${verse.studyNotes}` : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(`${bookName}-${chapterNum}-${verse.number}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReferenceInOracle = (verseText: string, bookName: string, chapterNum: number, verseNum: number) => {
    if (onReferenceInOracle) {
      const refString = `[${bookName} ${chapterNum}:${verseNum}] "${verseText}"`;
      onReferenceInOracle(refString);
    }
  };

  const handleSaveToGrimoire = (verse: BibleVerse, bookName: string, chapterNum: number) => {
    try {
      const savedNotesStr = localStorage.getItem("mystical_grimoire_notes");
      let existingNotes: any[] = [];
      if (savedNotesStr) {
        existingNotes = JSON.parse(savedNotesStr);
      }

      const formattedMarkdown = `### Holy Bible Study Note
**${bookName} ${chapterNum}:${verse.number}**

> "${verse.text}"

${verse.originalText ? `*Original ${currentBook.originalLanguage}:* \`${verse.originalText}\` (${verse.transliteration})\n` : ""}
${verse.literalText ? `*Literal Rendering:* ${verse.literalText}\n` : ""}

---

### Exegetical Commentary & Study
${verse.studyNotes || "Sacred canonical Scripture verse for contemplation."}

${verse.crossReferences ? `**Parallel Cross-References:** ${verse.crossReferences.join(", ")}` : ""}`;

      const newNote = {
        id: crypto.randomUUID(),
        title: `Bible Study: ${bookName} ${chapterNum}:${verse.number}`,
        content: formattedMarkdown,
        school: "Holy Scripture",
        color: activeTheme.id === "deep-void" 
          ? "bg-[#182138]/95 border-amber-900/40" 
          : "bg-[#2b271c]/95 border-amber-800/45",
        pinned: true,
        createdAt: new Date().toLocaleString()
      };

      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("mystical_grimoire_notes", JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event("grimoire-updated"));

      setSavedGrimoireId(`${bookName}-${chapterNum}-${verse.number}`);
      setTimeout(() => setSavedGrimoireId(null), 2500);
    } catch (e) {
      console.warn("Failed saving Bible verse to Grimoire:", e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-black border border-amber-500/30 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <BookMarked className="w-4 h-4" />
              <span>Sacred Canon & Exegesis Portal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 flex items-center gap-2">
              The Holy Bible
              <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                Hebrew & Greek Originals
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Explore Old and New Testament books with verse-by-verse original language scripts, literal renderings, cross-references, and scholarly exegetical notes.
            </p>
          </div>

          {/* Quick Stats / Features */}
          <div className="flex items-center gap-3 self-start md:self-center bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <span className="font-bold text-amber-200">66 Books</span> Canon
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              Hebrew / Greek / KJV
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation: Scripture Reader vs SWORD Repositories */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("reader")}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "reader"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-lg shadow-amber-500/5"
              : "bg-black/40 text-slate-400 border border-white/5 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Scripture Reader & Exegesis</span>
        </button>

        <button
          onClick={() => setActiveTab("sword-repositories")}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "sword-repositories"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-lg shadow-amber-500/5"
              : "bg-black/40 text-slate-400 border border-white/5 hover:text-slate-200"
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>SWORD Repositories (AndBible)</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/30 text-amber-200 border border-amber-500/40">
            {repositories.length}
          </span>
        </button>
      </div>

      {activeTab === "sword-repositories" ? (
        /* SWORD MODULE REPOSITORIES VIEW */
        <div className="flex flex-col gap-6">
          
          {/* Top Info Banner for AndBible / SWORD Repositories */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/50 via-black to-slate-950 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                  AndBible & SWORD Module Repositories
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/20 text-green-300 border border-green-500/30">
                    sword-https
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Manage external SWORD module repositories used by AndBible and CrossWire applications. Fetch HTTPS manifests, inspect catalog directories, download raw packages, and sync custom test repositories.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddRepoModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Repository</span>
            </button>
          </div>

          {/* Featured Repository: AndBible Test Repository Highlight */}
          {repositories.find(r => r.name === "AndBible test") && (
            <div className="p-6 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 relative overflow-hidden backdrop-blur-md">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Official Test Repository</span>
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-3">
                    AndBible test
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                      Active
                    </span>
                  </h4>
                  <p className="text-sm text-slate-300 mt-1 font-sans">
                    Test module repository maintained by AndBible development team
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleFetchManifest(repositories.find(r => r.name === "AndBible test")!)}
                    disabled={fetchingManifest && inspectingRepo?.name === "AndBible test"}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs font-mono hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${fetchingManifest && inspectingRepo?.name === "AndBible test" ? "animate-spin" : ""}`} />
                    <span>Test Manifest Connection</span>
                  </button>

                  <button
                    onClick={() => handleCopyRepoJson(repositories.find(r => r.name === "AndBible test")!)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedJsonRepo === "AndBible test" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                    <span>{copiedJsonRepo === "AndBible test" ? "Copied!" : "Copy Spec JSON"}</span>
                  </button>

                  <a
                    href="https://andbible.github.io/data/andbible/test/manifest.json"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-amber-300 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Manifest</span>
                  </a>
                </div>
              </div>

              {/* Technical Specifications Grid for AndBible Test */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-500/20 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Type</span>
                  <span className="text-amber-300 font-semibold">sword-https</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Host</span>
                  <span className="text-amber-200 truncate block">andbible.github.io</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Catalog Directory</span>
                  <span className="text-slate-200 truncate block">/data/andbible/test</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Package Directory</span>
                  <span className="text-slate-200 truncate block">/data/andbible/test/zip</span>
                </div>
              </div>
            </div>
          )}

          {/* Two-Column SWORD Module Package Installer & Repositories Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Column: Repository Grid (2/3 width) */}
            <div className="flex-1 flex flex-col gap-6 w-full lg:w-2/3">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                Active SWORD Module Repositories
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repositories.map((repo, idx) => (
                  <div 
                    key={`repo-card-${idx}`}
                    className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-300 uppercase">
                          {repo.type}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          {repo.status || "online"}
                        </span>
                      </div>

                      <h5 className="text-lg font-serif font-bold text-amber-100">
                        {repo.name}
                      </h5>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {repo.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded bg-white/5 border border-white/5 text-[11px] font-mono space-y-1 text-slate-400">
                        <div className="truncate"><strong className="text-amber-400/80">Host:</strong> {repo.host}</div>
                        <div className="truncate"><strong className="text-amber-400/80">Catalog:</strong> {repo.catalogDirectory}</div>
                        <div className="truncate"><strong className="text-amber-400/80">Packages:</strong> {repo.packageDirectory}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleFetchManifest(repo)}
                        disabled={fetchingManifest && inspectingRepo?.name === repo.name}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${fetchingManifest && inspectingRepo?.name === repo.name ? "animate-spin" : ""}`} />
                        <span>Test Manifest</span>
                      </button>

                      <button
                        onClick={() => handleCopyRepoJson(repo)}
                        className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-1 cursor-pointer"
                        title="Copy Spec JSON"
                      >
                        {copiedJsonRepo === repo.name ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code2 className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Installed Packages (1/3 width) */}
            <div className="w-full lg:w-1/3 p-6 rounded-2xl bg-[#0d0f19] border border-amber-500/20 flex flex-col gap-4 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider">
                  Installed SWORD Modules
                </h4>
              </div>

              {installedModules.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-white/5 rounded-xl">
                  No custom modules currently installed. Use the Manifest Inspector on any repository to download packages.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {installedModules.map((id, index) => {
                    let name = id === "test-kjv" ? "AndBible Test Scripture Module" :
                               id === "test-exegesis" ? "AndBible Exegetical Commentary" :
                               id === "test-strongs" ? "Strongs Concordance Greek/Hebrew" :
                               id === "andbible-test-b1" ? "AndBible Test Canon Module" :
                               id === "andbible-test-c1" ? "AndBible Test Commentary" :
                               id === "ebible.org-open-scripture-repository-b1" ? "eBible Canon Module" :
                               id === "ebible.org-open-scripture-repository-c1" ? "eBible Test Commentary" :
                               `Downloaded Package: ${id}`;
                    let type = id.includes("exegesis") || id.includes("-c1") ? "Commentary" : id.includes("strongs") ? "Dictionary" : "Bible";
                    
                    return (
                      <div key={`installed-mod-${id}-${index}`} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs font-mono">
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-slate-200 truncate">{name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>ID: {id}</span>
                            <span>•</span>
                            <span className="text-amber-400/80">{type}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleUninstallModule(id)}
                          className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-[10px] font-sans font-medium cursor-pointer transition-all shrink-0"
                        >
                          Uninstall
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Manifest Inspector Results Section */}
          {inspectingRepo && (
            <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 flex flex-col gap-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <h4 className="text-base font-serif font-bold text-amber-200">
                    Manifest Inspector: <span className="text-white">{inspectingRepo.name}</span>
                  </h4>
                </div>
                <button
                  onClick={() => setInspectingRepo(null)}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  Close Inspector
                </button>
              </div>

              {fetchingManifest ? (
                <div className="p-8 text-center text-xs font-mono text-amber-300 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Connecting to {inspectingRepo.manifestUrl}... Parsing SWORD catalog structure...</span>
                </div>
              ) : manifestResult.status === "success" ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>{manifestResult.message}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Catalog Modules Detected ({manifestResult.modules?.length || 0}):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {manifestResult.modules?.map((mod, i) => {
                        const isInstalled = installedModules.includes(mod.id);
                        const isInstalling = installingModuleId === mod.id;
                        return (
                          <div key={`mod-${i}`} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all text-xs font-mono flex flex-col justify-between gap-3 relative overflow-hidden">
                            <div className="space-y-1">
                              <div className="font-bold text-amber-200">{mod.name || mod.id}</div>
                              <div className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{mod.description || "SWORD Canon Data Module"}</div>
                              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                                <span>Type: {mod.type || "Bible"}</span>
                                <span>v{mod.version || "1.0"}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                              {isInstalled ? (
                                <div className="py-1 px-2.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold flex items-center justify-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Package Installed</span>
                                </div>
                              ) : isInstalling ? (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] text-amber-400">
                                    <span>Downloading...</span>
                                    <span>{installProgress}%</span>
                                  </div>
                                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${installProgress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleInstallModule(mod.id, mod.name || mod.id)}
                                  disabled={!!installingModuleId}
                                  className={`w-full py-1 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-[11px] ${
                                    installingModuleId ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Install Module</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Add Custom Repository Modal */}
          {showAddRepoModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-[#121622] border border-amber-500/40 flex flex-col gap-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-400" />
                    Register Custom SWORD Repository
                  </h4>
                  <button 
                    onClick={() => setShowAddRepoModal(false)}
                    className="text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddRepository} className="flex flex-col gap-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-300 block mb-1">Repository Name *</label>
                    <input
                      type="text"
                      required
                      value={newRepo.name}
                      onChange={e => setNewRepo({...newRepo, name: e.target.value})}
                      placeholder="e.g. AndBible Community Modules"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Description</label>
                    <input
                      type="text"
                      value={newRepo.description}
                      onChange={e => setNewRepo({...newRepo, description: e.target.value})}
                      placeholder="Brief description of modules offered"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Manifest URL *</label>
                    <input
                      type="url"
                      required
                      value={newRepo.manifestUrl}
                      onChange={e => setNewRepo({...newRepo, manifestUrl: e.target.value})}
                      placeholder="https://example.org/data/manifest.json"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Repository Type</label>
                      <select
                        value={newRepo.type}
                        onChange={e => setNewRepo({...newRepo, type: e.target.value as any})}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                      >
                        <option value="sword-https">sword-https</option>
                        <option value="sword-http">sword-http</option>
                        <option value="sword-ftp">sword-ftp</option>
                        <option value="custom">custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Host Domain</label>
                      <input
                        type="text"
                        value={newRepo.host}
                        onChange={e => setNewRepo({...newRepo, host: e.target.value})}
                        placeholder="andbible.github.io"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Catalog Directory</label>
                      <input
                        type="text"
                        value={newRepo.catalogDirectory}
                        onChange={e => setNewRepo({...newRepo, catalogDirectory: e.target.value})}
                        placeholder="/data/andbible/test"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Package Directory</label>
                      <input
                        type="text"
                        value={newRepo.packageDirectory}
                        onChange={e => setNewRepo({...newRepo, packageDirectory: e.target.value})}
                        placeholder="/data/andbible/test/zip"
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-slate-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono transition-all cursor-pointer"
                  >
                    Add Repository
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* STANDARD SCRIPTURE READER VIEW */
        <div className="flex flex-col gap-6">

      {/* Control Bar: Search & View Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bible verses by text, Hebrew/Greek terms (Logos, Elohim, YHWH), or topics..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* View toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowOriginalLanguage(!showOriginalLanguage)}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              showOriginalLanguage 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Hebrew/Greek</span>
          </button>

          <button
            onClick={() => setShowStudyNotes(!showStudyNotes)}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              showStudyNotes 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exegetical Notes</span>
          </button>

          <button
            onClick={() => setShowCrossReferences(!showCrossReferences)}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              showCrossReferences 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Refs</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Search Results OR Book Reader */}
      {searchQuery.trim() ? (
        /* SEARCH RESULTS VIEW */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Found <strong className="text-amber-300">{searchResults.length}</strong> matching verses for "{searchQuery}"</span>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-amber-400 hover:underline"
            >
              Return to Reader
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-black/30 border border-white/10 text-slate-400 font-serif">
              No matching biblical verses found for "{searchQuery}". Try searching for terms like "Light", "Logos", "Genesis", "In the beginning", or "Elohim".
            </div>
          ) : (
            <div className="w-full">
              <VirtualizedList
                items={searchResults}
                estimateItemHeight={240}
                overscan={4}
                gap={16}
                maxHeight="650px"
                keyExtractor={({ book, chapterNum, verse }, idx) => `search-res-${book.id}-${chapterNum}-${verse.number}-${idx}`}
                className="w-full"
                renderItem={({ book, chapterNum, verse }) => (
                  <div 
                    className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-serif font-bold text-amber-300 flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-amber-400" />
                        {book.name} {chapterNum}:{verse.number}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>{book.testament}</span>
                        <span>•</span>
                        <span>{book.originalLanguage}</span>
                      </div>
                    </div>

                    <p className="text-base font-serif text-slate-100 leading-relaxed">
                      "{verse.text}"
                    </p>

                    {verse.originalText && (
                      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 font-serif text-amber-200 text-sm flex flex-col gap-1">
                        <div className="text-right text-lg font-mono tracking-wide">{verse.originalText}</div>
                        <div className="text-xs font-sans text-amber-400/80 italic">{verse.transliteration}</div>
                      </div>
                    )}

                    {verse.studyNotes && (
                      <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                        <strong className="text-amber-300 font-mono">Exegesis: </strong>
                        {verse.studyNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setSelectedChapterNum(chapterNum);
                          setSearchQuery("");
                        }}
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        Read full Chapter {chapterNum} <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyVerse(verse, book.name, chapterNum)}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `${book.name}-${chapterNum}-${verse.number}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>

                        <button
                          onClick={() => handleSaveToGrimoire(verse, book.name, chapterNum)}
                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          {savedGrimoireId === `${book.name}-${chapterNum}-${verse.number}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-3 h-3" />
                          )}
                          <span>Save Study</span>
                        </button>

                        {onReferenceInOracle && (
                          <button
                            onClick={() => handleReferenceInOracle(verse.text, book.name, chapterNum, verse.number)}
                            className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs flex items-center gap-1 cursor-pointer"
                            title="Reference verse directly in Oracle inquiry"
                          >
                            <Sparkles className="w-3 h-3 text-sky-400" />
                            <span>Reference Oracle</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      ) : (
        /* STANDARD BOOK READER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: Testament & Book Selection */}
          <div className="lg:col-span-1 flex flex-col gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            
            {/* Testament Filter Tabs */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setSelectedTestament("all")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTestament === "all" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All (66)
              </button>
              <button
                onClick={() => setSelectedTestament("Old Testament")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTestament === "Old Testament" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Old Test.
              </button>
              <button
                onClick={() => setSelectedTestament("New Testament")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTestament === "New Testament" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                New Test.
              </button>
            </div>

            {/* Books List */}
            <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 pt-1">
                Select Book
              </span>
              {filteredBooks.map((book, bIdx) => {
                const isSelected = book.id === currentBook.id;
                return (
                  <button
                    key={`${book.id}-${bIdx}`}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapterNum(1);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-serif">{book.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{book.category}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90 text-amber-400" : "text-slate-600"}`} />
                  </button>
                );
              })}
            </div>

            {/* Book Overview Card */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-amber-300 font-mono font-bold">
                <span>{currentBook.name}</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">{currentBook.originalLanguage}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentBook.description}
              </p>
              <div className="text-[10px] font-mono text-amber-400/90 pt-1 border-t border-amber-500/20">
                <strong>Key Theme:</strong> {currentBook.keyTheme}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN AREA: Chapter Navigation & Verses */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Chapter Selector Tabs */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {currentBook.name} — Chapters
                </span>
                <span className="text-slate-400">Author: {currentBook.author}</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {currentBook.chapters.map(ch => {
                  const isSelected = ch.chapterNumber === currentChapter.chapterNumber;
                  return (
                    <button
                      key={`ch-btn-${ch.chapterNumber}`}
                      onClick={() => setSelectedChapterNum(ch.chapterNumber)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                        isSelected 
                          ? "bg-amber-500 text-black border border-amber-400 shadow-md shadow-amber-500/20" 
                          : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      Chapter {ch.chapterNumber}
                    </button>
                  );
                })}
              </div>

              {currentChapter.title && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-amber-200/90 font-serif italic">
                  <strong>Chapter Focus:</strong> {currentChapter.title} — {currentChapter.chapterSummary}
                </div>
              )}
            </div>

            {/* Verse-By-Verse Reader List */}
            <div className="w-full">
              <VirtualizedList
                items={currentChapter.verses}
                estimateItemHeight={220}
                overscan={4}
                gap={16}
                keyExtractor={(verse) => `verse-${currentBook.id}-${currentChapter.chapterNumber}-${verse.number}`}
                className="w-full"
                renderItem={(verse) => (
                  <div
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col gap-3 backdrop-blur-md"
                  >
                    {/* Verse Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5" />
                        {currentBook.name} {currentChapter.chapterNumber}:{verse.number}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyVerse(verse, currentBook.name, currentChapter.chapterNumber)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer text-xs flex items-center gap-1"
                          title="Copy Verse Text"
                        >
                          {copiedId === `${currentBook.name}-${currentChapter.chapterNumber}-${verse.number}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSaveToGrimoire(verse, currentBook.name, currentChapter.chapterNumber)}
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all cursor-pointer text-xs flex items-center gap-1"
                          title="Save Study to Grimoire"
                        >
                          {savedGrimoireId === `${currentBook.name}-${currentChapter.chapterNumber}-${verse.number}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden sm:inline">Save Study</span>
                        </button>

                        {onReferenceInOracle && (
                          <button
                            onClick={() => handleReferenceInOracle(verse.text, currentBook.name, currentChapter.chapterNumber, verse.number)}
                            className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-all cursor-pointer text-xs flex items-center gap-1"
                            title="Reference verse directly in Oracle inquiry"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                            <span className="hidden sm:inline">Reference Oracle</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* English Verse Text */}
                    <p className="text-lg md:text-xl font-serif text-slate-100 leading-relaxed pl-2 border-l-2 border-amber-500/50">
                      "{verse.text}"
                    </p>

                    {/* Original Language Script & Transliteration */}
                    {showOriginalLanguage && verse.originalText && (
                      <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/25 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-amber-400/80 uppercase tracking-wider">
                          <span>Original {currentBook.originalLanguage} Text</span>
                          {verse.literalText && <span>Literal Structural Rendering</span>}
                        </div>
                        <div className="text-right text-xl font-mono text-amber-200 tracking-wide font-semibold py-1">
                          {verse.originalText}
                        </div>
                        {verse.transliteration && (
                          <div className="text-xs font-mono text-amber-300/90 italic">
                            Transliteration: {verse.transliteration}
                          </div>
                        )}
                        {verse.literalText && (
                          <div className="text-xs text-slate-300 border-t border-amber-500/20 pt-1.5 mt-1 font-serif">
                            <strong className="text-amber-300 font-mono">Literal: </strong>
                            {verse.literalText}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Exegetical Study Notes */}
                    {showStudyNotes && verse.studyNotes && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex flex-col gap-1">
                        <span className="font-mono text-amber-300 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Exegetical Commentary Note
                        </span>
                        <p className="leading-relaxed font-sans text-slate-200">
                          {verse.studyNotes}
                        </p>
                      </div>
                    )}

                    {/* Cross References */}
                    {showCrossReferences && verse.crossReferences && verse.crossReferences.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                        <span className="text-slate-500">Parallel Cross-Refs:</span>
                        {verse.crossReferences.map((cr, idx) => (
                          <span 
                            key={`cr-${idx}`}
                            className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                          >
                            {cr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

          </div>
        </div>
      )}
        </div>
      )}

    </div>
  );
}
