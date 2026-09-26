/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Moon, Search, BookOpen, Sparkles, Copy, Check, Volume2, VolumeX,
  Bookmark, Landmark, Layers, ChevronRight, HelpCircle, FileText, Compass, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { QURAN_SURAHS_DATABASE, QuranSurah, QuranAyah } from "../data/quranData";

interface HolyQuranPortalProps {
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
}

export default function HolyQuranPortal({ activeTheme }: HolyQuranPortalProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all"); // "all", "Meccan", "Medinan"
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // View toggles
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTafsir, setShowTafsir] = useState<boolean>(true);
  const [arabicFontSize, setArabicFontSize] = useState<"md" | "lg" | "xl">("lg");

  // Audio simulation state
  const [playingAyahNum, setPlayingAyahNum] = useState<number | null>(null);
  
  // Feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedGrimoireId, setSavedGrimoireId] = useState<string | null>(null);

  // Filter Surahs
  const filteredSurahs = useMemo(() => {
    if (selectedTypeFilter === "all") return QURAN_SURAHS_DATABASE;
    return QURAN_SURAHS_DATABASE.filter(s => s.revelationType === selectedTypeFilter);
  }, [selectedTypeFilter]);

  // Active Surah
  const currentSurah = useMemo(() => {
    return QURAN_SURAHS_DATABASE.find(s => s.number === selectedSurahNum) || QURAN_SURAHS_DATABASE[0];
  }, [selectedSurahNum]);

  // Search across all Surahs/Ayahs
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { surah: QuranSurah; ayah: QuranAyah }[] = [];

    QURAN_SURAHS_DATABASE.forEach(surah => {
      surah.ayahs.forEach(a => {
        if (
          a.englishTranslation.toLowerCase().includes(query) ||
          a.arabicText.includes(query) ||
          a.transliteration.toLowerCase().includes(query) ||
          (a.tafsirNotes && a.tafsirNotes.toLowerCase().includes(query)) ||
          (a.keyThemes && a.keyThemes.some(kt => kt.toLowerCase().includes(query))) ||
          surah.nameTransliterated.toLowerCase().includes(query) ||
          surah.nameEnglish.toLowerCase().includes(query)
        ) {
          results.push({ surah, ayah: a });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const handleCopyAyah = (ayah: QuranAyah, surahName: string, surahNum: number) => {
    const textToCopy = `"${ayah.englishTranslation}"\nArabic: ${ayah.arabicText}\nTransliteration: ${ayah.transliteration}\n— Surah ${surahName} (${surahNum}:${ayah.numberInSurah})\nTafsir: ${ayah.tafsirNotes || "Quranic Revelation"}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(`${surahNum}-${ayah.numberInSurah}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToGrimoire = (ayah: QuranAyah, surahName: string, surahNum: number) => {
    try {
      const savedNotesStr = localStorage.getItem("mystical_grimoire_notes");
      let existingNotes: any[] = [];
      if (savedNotesStr) {
        existingNotes = JSON.parse(savedNotesStr);
      }

      const formattedMarkdown = `### Holy Quran Tafsir Note
**Surah ${surahName} (${surahNum}:${ayah.numberInSurah})**

> "${ayah.englishTranslation}"

*Arabic Script:*
\`${ayah.arabicText}\`

*Transliteration:* \`${ayah.transliteration}\`

---

### Tafsir & Scholarly Commentary
${ayah.tafsirNotes || "Sacred Quranic revelation for meditation and alignment."}

${ayah.keyThemes ? `**Core Spiritual Themes:** ${ayah.keyThemes.join(", ")}` : ""}`;

      const newNote = {
        id: crypto.randomUUID(),
        title: `Quran Study: Surah ${surahName} ${surahNum}:${ayah.numberInSurah}`,
        content: formattedMarkdown,
        school: "Holy Quran",
        color: activeTheme.id === "deep-void" 
          ? "bg-[#182a24]/95 border-emerald-900/40" 
          : "bg-[#1d3326]/95 border-emerald-800/45",
        pinned: true,
        createdAt: new Date().toLocaleString()
      };

      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem("mystical_grimoire_notes", JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event("grimoire-updated"));

      setSavedGrimoireId(`${surahNum}-${ayah.numberInSurah}`);
      setTimeout(() => setSavedGrimoireId(null), 2500);
    } catch (e) {
      console.warn("Failed saving Quran Ayah to Grimoire:", e);
    }
  };

  const toggleAudioSim = (ayahNum: number) => {
    if (playingAyahNum === ayahNum) {
      setPlayingAyahNum(null);
    } else {
      setPlayingAyahNum(ayahNum);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-black border border-emerald-500/30 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
              <Landmark className="w-4 h-4" />
              <span>Sacred Revelation & Tafsir Suite</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-emerald-100 flex items-center gap-3">
              القرآن الكريم
              <span className="text-xl font-serif font-normal text-emerald-300 font-arabic">
                The Holy Quran
              </span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Study Surahs with full vocalized Arabic diacritics, English transliteration, Sahih International translation, and classic Tafsir commentary notes.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <span className="font-bold text-emerald-200">114 Surahs</span> Matrix
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              Hafs / Sahih / Tafsir
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & View Options */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Quran Ayahs by text, Arabic (نور, رحمة, الله), transliteration, or theme..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
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

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              showTransliteration 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <span>Transliteration</span>
          </button>

          <button
            onClick={() => setShowTafsir(!showTafsir)}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              showTafsir 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tafsir Commentary</span>
          </button>

          {/* Arabic Font Size Selector */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px]">
            <span className="text-slate-500 px-1">Arabic:</span>
            <button
              onClick={() => setArabicFontSize("md")}
              className={`px-2 py-0.5 rounded ${arabicFontSize === "md" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"}`}
            >
              A
            </button>
            <button
              onClick={() => setArabicFontSize("lg")}
              className={`px-2 py-0.5 rounded ${arabicFontSize === "lg" ? "bg-emerald-500/20 text-emerald-300 font-bold text-sm" : "text-slate-400"}`}
            >
              A
            </button>
            <button
              onClick={() => setArabicFontSize("xl")}
              className={`px-2 py-0.5 rounded ${arabicFontSize === "xl" ? "bg-emerald-500/20 text-emerald-300 font-bold text-base" : "text-slate-400"}`}
            >
              A
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Search Results OR Surah Reader */}
      {searchQuery.trim() ? (
        /* SEARCH RESULTS VIEW */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Found <strong className="text-emerald-300">{searchResults.length}</strong> matching Ayahs for "{searchQuery}"</span>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-emerald-400 hover:underline"
            >
              Return to Surah Reader
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-black/30 border border-white/10 text-slate-400 font-serif">
              No matching Quranic verses found for "{searchQuery}". Try searching for terms like "Light", "Mercy", "Al-Fatiha", "Kursi", "Allah", or "Straight Path".
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map(({ surah, ayah }, idx) => (
                <div 
                  key={`q-search-res-${idx}`}
                  className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-bold text-emerald-300 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-emerald-400" />
                      Surah {surah.nameTransliterated} ({surah.number}:{ayah.numberInSurah})
                    </span>
                    <span className="text-xs font-mono text-slate-400">{surah.revelationType}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/25 flex flex-col gap-2">
                    <div className="text-right text-2xl font-serif text-emerald-100 leading-loose tracking-wide dir-rtl">
                      {ayah.arabicText}
                    </div>
                    <div className="text-xs font-mono text-emerald-300/90 italic">
                      {ayah.transliteration}
                    </div>
                  </div>

                  <p className="text-base font-serif text-slate-100 leading-relaxed">
                    "{ayah.englishTranslation}"
                  </p>

                  {ayah.tafsirNotes && (
                    <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                      <strong className="text-emerald-300 font-mono">Tafsir: </strong>
                      {ayah.tafsirNotes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setSelectedSurahNum(surah.number);
                        setSearchQuery("");
                      }}
                      className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      Read Surah {surah.nameTransliterated} <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyAyah(ayah, surah.nameTransliterated, surah.number)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === `${surah.number}-${ayah.numberInSurah}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={() => handleSaveToGrimoire(ayah, surah.nameTransliterated, surah.number)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {savedGrimoireId === `${surah.number}-${ayah.numberInSurah}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Bookmark className="w-3 h-3" />
                        )}
                        <span>Save Tafsir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD SURAH READER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: Surah List & Filter */}
          <div className="lg:col-span-1 flex flex-col gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
            
            {/* Filter Tabs */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setSelectedTypeFilter("all")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTypeFilter === "all" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTypeFilter("Meccan")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTypeFilter === "Meccan" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Meccan
              </button>
              <button
                onClick={() => setSelectedTypeFilter("Medinan")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  selectedTypeFilter === "Medinan" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Medinan
              </button>
            </div>

            {/* Surah Selection Buttons */}
            <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 pt-1">
                Select Surah
              </span>
              {filteredSurahs.map(surah => {
                const isSelected = surah.number === currentSurah.number;
                return (
                  <button
                    key={`surah-btn-${surah.number}`}
                    onClick={() => setSelectedSurahNum(surah.number)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono flex items-center justify-center text-emerald-400">
                        {surah.number}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-serif">{surah.nameTransliterated}</span>
                        <span className="text-[10px] font-mono text-slate-400">{surah.nameEnglish}</span>
                      </div>
                    </div>
                    <span className="text-base font-serif text-emerald-300/80">{surah.nameArabic}</span>
                  </button>
                );
              })}
            </div>

            {/* Surah Overview Panel */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-emerald-300 font-mono font-bold">
                <span>Surah {currentSurah.nameTransliterated}</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">{currentSurah.revelationType}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {currentSurah.summary}
              </p>
              {currentSurah.spiritualVirtue && (
                <div className="text-[10px] text-emerald-300/90 pt-1 border-t border-emerald-500/20 font-serif italic">
                  <strong>Virtue:</strong> {currentSurah.spiritualVirtue}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT MAIN AREA: Surah Content & Ayahs */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Surah Banner & Basmala */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center gap-3">
              <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Surah {currentSurah.number} • {currentSurah.nameTransliterated} ({currentSurah.nameEnglish})
              </div>
              
              <div className="text-4xl md:text-5xl font-serif text-emerald-200 py-2">
                {currentSurah.nameArabic}
              </div>

              {/* Bismillah Header (Except Surah 9) */}
              {currentSurah.number !== 9 && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-2xl md:text-3xl font-serif text-emerald-100 tracking-wider my-2">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              )}

              <p className="text-xs text-slate-400 max-w-xl">
                {currentSurah.summary}
              </p>
            </div>

            {/* Ayahs Reader List */}
            <div className="flex flex-col gap-4">
              {currentSurah.ayahs.map(ayah => {
                const isPlaying = playingAyahNum === ayah.numberInSurah;
                const arabicSizeClass = 
                  arabicFontSize === "md" ? "text-xl md:text-2xl" :
                  arabicFontSize === "xl" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";

                return (
                  <div
                    key={`ayah-${ayah.numberInSurah}`}
                    className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col gap-4 backdrop-blur-md"
                  >
                    {/* Ayah Header */}
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center">
                        {ayah.numberInSurah}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Audio Simulation Button */}
                        <button
                          onClick={() => toggleAudioSim(ayah.numberInSurah)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPlaying
                              ? "bg-emerald-500 text-black border-emerald-400 font-bold animate-pulse"
                              : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                          }`}
                        >
                          {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{isPlaying ? "Reciting..." : "Listen"}</span>
                        </button>

                        <button
                          onClick={() => handleCopyAyah(ayah, currentSurah.nameTransliterated, currentSurah.number)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer text-xs flex items-center gap-1"
                        >
                          {copiedId === `${currentSurah.number}-${ayah.numberInSurah}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSaveToGrimoire(ayah, currentSurah.nameTransliterated, currentSurah.number)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all cursor-pointer text-xs flex items-center gap-1"
                        >
                          {savedGrimoireId === `${currentSurah.number}-${ayah.numberInSurah}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden sm:inline">Save Tafsir</span>
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-l from-emerald-950/40 via-teal-950/20 to-black/60 border border-emerald-500/30 flex flex-col gap-2">
                      <div className={`text-right font-serif text-emerald-100 leading-relaxed tracking-wider ${arabicSizeClass}`}>
                        {ayah.arabicText}
                      </div>
                      
                      {showTransliteration && (
                        <div className="text-xs font-mono text-emerald-300/90 italic pt-1 border-t border-emerald-500/20">
                          {ayah.transliteration}
                        </div>
                      )}
                    </div>

                    {/* English Translation */}
                    <p className="text-lg font-serif text-slate-100 leading-relaxed pl-3 border-l-2 border-emerald-500/50">
                      "{ayah.englishTranslation}"
                    </p>

                    {/* Tafsir Study Notes */}
                    {showTafsir && ayah.tafsirNotes && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex flex-col gap-1">
                        <span className="font-mono text-emerald-300 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          Tafsir Exegetical Commentary
                        </span>
                        <p className="leading-relaxed font-sans text-slate-200">
                          {ayah.tafsirNotes}
                        </p>
                      </div>
                    )}

                    {/* Thematic Tags */}
                    {ayah.keyThemes && ayah.keyThemes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                        <span className="text-slate-500">Themes:</span>
                        {ayah.keyThemes.map((kt, idx) => (
                          <span 
                            key={`kt-${idx}`}
                            className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          >
                            #{kt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
