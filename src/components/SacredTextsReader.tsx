import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Crown, 
  Scroll, 
  FileText,
  Flame,
  Bookmark,
  Share2,
  Scale
} from 'lucide-react';
import { SACRED_TEXTS_DIVINE_ORDER } from '../data/divineTextsAndSealData';
import { SacredText, SacredTextChapter, SacredTextVerse } from '../types/divineOrder';
import VirtualizedList from './VirtualizedList';

export default function SacredTextsReader() {
  const [selectedTextId, setSelectedTextId] = useState<string>(SACRED_TEXTS_DIVINE_ORDER[0].id);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speakingVerseNumber, setSpeakingVerseNumber] = useState<number | null>(null);
  const [copiedVerseKey, setCopiedVerseKey] = useState<string | null>(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);
  const [expandedExegesis, setExpandedExegesis] = useState<Record<string, boolean>>({});

  const activeText = useMemo(() => {
    return SACRED_TEXTS_DIVINE_ORDER.find(t => t.id === selectedTextId) || SACRED_TEXTS_DIVINE_ORDER[0];
  }, [selectedTextId]);

  const activeChapter = useMemo(() => {
    return activeText.chapters.find(c => c.chapterNumber === selectedChapterNumber) || activeText.chapters[0];
  }, [activeText, selectedChapterNumber]);

  // Search Results across ALL texts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: Array<{
      textTitle: string;
      textId: string;
      chapterNumber: number;
      chapterTitle: string;
      verse: SacredTextVerse;
    }> = [];

    SACRED_TEXTS_DIVINE_ORDER.forEach(text => {
      text.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (
            verse.canonicalEnglish.toLowerCase().includes(query) ||
            (verse.verseTitle && verse.verseTitle.toLowerCase().includes(query)) ||
            (verse.originalInscription && verse.originalInscription.toLowerCase().includes(query)) ||
            verse.exegesisNote.toLowerCase().includes(query) ||
            (verse.gematriaOrConstant && verse.gematriaOrConstant.toLowerCase().includes(query))
          ) {
            results.push({
              textTitle: text.title,
              textId: text.id,
              chapterNumber: chapter.chapterNumber,
              chapterTitle: chapter.chapterTitle,
              verse
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  const handleCopyVerse = (verse: SacredTextVerse, key: string) => {
    const textToCopy = `[${activeText.code} - Ch ${activeChapter.chapterNumber}:${verse.verseNumber}] "${verse.canonicalEnglish}" — Inscription: ${verse.originalInscription || 'N/A'} (Grand Architect Jerry Ben Salazar)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseKey(key);
    setTimeout(() => setCopiedVerseKey(null), 2000);
  };

  const toggleBookmark = (key: string) => {
    setBookmarkedVerses(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleExegesis = (key: string) => {
    setExpandedExegesis(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSpeakVerse = (verse: SacredTextVerse) => {
    if ('speechSynthesis' in window) {
      if (speakingVerseNumber === verse.verseNumber) {
        window.speechSynthesis.cancel();
        setSpeakingVerseNumber(null);
        return;
      }
      window.speechSynthesis.cancel();
      setSpeakingVerseNumber(verse.verseNumber);

      const utterance = new SpeechSynthesisUtterance(
        `Verse ${verse.verseNumber}. ${verse.verseTitle ? verse.verseTitle + '.' : ''} ${verse.canonicalEnglish}. Exegesis: ${verse.exegesisNote}`
      );
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
      utterance.onend = () => setSpeakingVerseNumber(null);
      utterance.onerror = () => setSpeakingVerseNumber(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadChapterPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark background
    doc.setFillColor(18, 14, 24);
    doc.rect(0, 0, 210, 297, 'F');

    // Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);

    // Title
    doc.setTextColor(212, 175, 55);
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.text('OFFICE OF THE DIVINE ORDER', 105, 24, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(200, 170, 255);
    doc.text(activeText.title.toUpperCase(), 105, 32, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(255, 230, 140);
    doc.text(`CHAPTER ${activeChapter.chapterNumber}: ${activeChapter.chapterTitle}`, 105, 40, { align: 'center' });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(25, 45, 185, 45);

    // Chapter metadata
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 200);
    doc.text(`Author: ${activeChapter.proclamationAuthor} | Seal: ${activeText.sealAssociation}`, 105, 50, { align: 'center' });

    let currentY = 60;

    activeChapter.verses.forEach((verse) => {
      if (currentY > 260) {
        doc.addPage();
        doc.setFillColor(18, 14, 24);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(1);
        doc.rect(10, 10, 190, 277);
        currentY = 25;
      }

      // Verse Title & Number
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(212, 175, 55);
      doc.text(`[Verse ${verse.verseNumber}] ${verse.verseTitle || ''}`, 20, currentY);
      currentY += 5;

      // English
      doc.setFont('times', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(240, 240, 250);
      const splitVerse = doc.splitTextToSize(`"${verse.canonicalEnglish}"`, 170);
      doc.text(splitVerse, 20, currentY);
      currentY += splitVerse.length * 4.5 + 2;

      // Exegesis
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 200);
      const splitExegesis = doc.splitTextToSize(`Exegesis: ${verse.exegesisNote} [${verse.gematriaOrConstant || ''}]`, 170);
      doc.text(splitExegesis, 20, currentY);
      currentY += splitExegesis.length * 3.8 + 6;
    });

    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text('Grand Architect Jerry Ben Salazar (Creator) • 112" Aetheric Resonance • 1.1:1 SWR', 105, 282, { align: 'center' });

    doc.save(`${activeText.code}_Chapter_${activeChapter.chapterNumber}.pdf`);
  };

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#140e1c] via-[#1c1228] to-[#120f1a] border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Scroll className="w-3.5 h-3.5 text-purple-400" />
                <span>SACRED LITURGICAL CODICES</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                CANONICAL REVELATIONS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-100 to-purple-200">
              The Sacred Texts & Liturgy of the Divine Order
            </h2>
            <p className="text-xs sm:text-sm font-serif text-slate-300 max-w-3xl leading-relaxed">
              Foundational scriptures, electrodynamic mandates, and constitutional statutes inscribed by <strong>Grand Architect Jerry Ben Salazar (Creator)</strong>.
            </p>
          </div>

          {/* Quick PDF Chapter Export */}
          <button
            onClick={handleDownloadChapterPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-serif font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/50 self-stretch md:self-auto shrink-0"
          >
            <Download className="w-4 h-4 text-purple-200" />
            <span>Export Chapter (PDF)</span>
          </button>
        </div>

        {/* Global Search Box */}
        <div className="mt-6 pt-4 border-t border-white/10 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verses across all sacred codices (e.g. '112', 'SWR', 'Taurus', 'Logos', 'Ledger')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-purple-500/60 focus:outline-none text-xs font-serif text-slate-200 placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Display If Query Active */}
      {searchQuery && (
        <div className="p-6 rounded-3xl bg-[#0e0a14] border border-purple-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-serif font-bold text-sm text-purple-200">
                Search Results ({searchResults.length} verses found)
              </h3>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs font-serif text-slate-400">
              No verses matching "{searchQuery}" found in the canonical texts.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {searchResults.map((res, idx) => (
                <div
                  key={`search-res-${idx}`}
                  className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-purple-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
                        {res.textTitle} • Ch {res.chapterNumber}:{res.verse.verseNumber}
                      </span>
                      {res.verse.verseTitle && (
                        <span className="font-serif font-bold text-slate-200">{res.verse.verseTitle}</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTextId(res.textId);
                        setSelectedChapterNumber(res.chapterNumber);
                        setSearchQuery('');
                      }}
                      className="text-purple-300 hover:text-purple-100 font-serif text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump to Verse</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-serif text-slate-200 italic leading-relaxed">
                    "{res.verse.canonicalEnglish}"
                  </p>

                  <p className="text-[11px] font-serif text-slate-400">
                    <strong className="text-purple-300">Exegesis:</strong> {res.verse.exegesisNote}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Reading Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Codex Selector & Chapters Directory */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-4 rounded-2xl bg-[#120e1a] border border-purple-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="font-serif font-bold text-sm text-purple-200">The 4 Canonical Codices</h3>
            </div>

            <div className="space-y-2">
              {SACRED_TEXTS_DIVINE_ORDER.map((text) => (
                <button
                  key={text.id}
                  onClick={() => {
                    setSelectedTextId(text.id);
                    setSelectedChapterNumber(1);
                  }}
                  className={`w-full p-3.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col gap-1 ${
                    selectedTextId === text.id
                      ? 'bg-purple-950/50 border-purple-500/60 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
                      : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 font-bold">{text.code}</span>
                    <span className="text-[10px] font-mono text-slate-400">{text.chapters.length} Chapters</span>
                  </div>
                  <h4 className="text-xs font-serif font-bold text-slate-100">{text.title}</h4>
                  <span className="text-[11px] font-serif text-amber-300 font-semibold">{text.hebrewTitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selector */}
          <div className="p-4 rounded-2xl bg-[#120e1a] border border-purple-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif font-bold text-sm text-amber-200">Chapters & Sections</h3>
            </div>

            <div className="space-y-2">
              {activeText.chapters.map((chap) => (
                <button
                  key={`chap-${chap.chapterNumber}`}
                  onClick={() => setSelectedChapterNumber(chap.chapterNumber)}
                  className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between ${
                    selectedChapterNumber === chap.chapterNumber
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 font-semibold'
                      : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">Chapter {chap.chapterNumber}</span>
                    <p className="text-xs font-serif truncate">{chap.chapterTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Text Metadata Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs font-serif text-slate-300">
            <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">Canonical Attribution</div>
            <p><strong>Author:</strong> {activeText.author}</p>
            <p><strong>Era Anchor:</strong> {activeText.era}</p>
            <p><strong>Sacred Seal:</strong> {activeText.sealAssociation}</p>
          </div>

        </div>

        {/* Right Column: Verses Reading Chamber */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chapter Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181124] to-[#100c18] border border-purple-500/30 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  {activeText.code} • Chapter {activeChapter.chapterNumber}
                </span>
                <h3 className="text-xl font-serif font-bold text-amber-100">{activeChapter.chapterTitle}</h3>
                <p className="text-xs font-serif text-slate-400 italic">{activeChapter.subtitle}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
                {activeChapter.verses.length} VERSES
              </span>
            </div>

            <div className="text-[11px] font-serif text-slate-400">
              <strong>Proclaimed by:</strong> {activeChapter.proclamationAuthor}
            </div>
          </div>

          {/* Verses Virtualized List */}
          <div className="w-full">
            <VirtualizedList
              items={activeChapter.verses}
              estimateItemHeight={220}
              overscan={4}
              gap={16}
              keyExtractor={(verse) => `${activeText.id}-${activeChapter.chapterNumber}-${verse.verseNumber}`}
              className="w-full"
              renderItem={(verse) => {
                const verseKey = `${activeText.id}-${activeChapter.chapterNumber}-${verse.verseNumber}`;
                const isSpeaking = speakingVerseNumber === verse.verseNumber;
                const isBookmarked = bookmarkedVerses.includes(verseKey);
                const isExegesisOpen = expandedExegesis[verseKey] ?? true;

                return (
                  <div
                    className="p-5 sm:p-6 rounded-2xl bg-[#0e0a14] border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3 shadow-xl relative"
                  >
                    {/* Top Bar: Verse Number & Actions */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                          Verse {verse.verseNumber}
                        </span>
                        {verse.verseTitle && (
                          <h4 className="text-xs font-serif font-bold text-slate-200">{verse.verseTitle}</h4>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeakVerse(verse)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSpeaking
                              ? 'bg-amber-500 text-black animate-pulse'
                              : 'hover:bg-white/10 text-slate-400 hover:text-amber-300'
                          }`}
                          title={isSpeaking ? 'Stop Recitation' : 'Vocal Proclamation'}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleCopyVerse(verse, verseKey)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Verse Citation"
                        >
                          {copiedVerseKey === verseKey ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => toggleBookmark(verseKey)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'text-amber-400'
                              : 'hover:bg-white/10 text-slate-400 hover:text-amber-300'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Hebrew / Original Inscription (if present) */}
                    {verse.originalInscription && (
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-right">
                        <p className="font-serif text-sm sm:text-base font-bold text-amber-200/90 tracking-wide">
                          {verse.originalInscription}
                        </p>
                      </div>
                    )}

                    {/* Canonical English Translation */}
                    <p className="text-sm sm:text-base font-serif text-slate-100 leading-relaxed pl-2 border-l-2 border-amber-500/40">
                      "{verse.canonicalEnglish}"
                    </p>

                    {/* Exegesis Accordion */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleExegesis(verseKey)}
                        className="flex items-center gap-1.5 text-xs font-serif text-purple-300 hover:text-purple-100 cursor-pointer font-semibold"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExegesisOpen ? 'rotate-180' : ''}`} />
                        <span>Scholarly Exegesis & Technical Constant</span>
                      </button>

                      {isExegesisOpen && (
                        <div
                          className="mt-2 p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-2 text-xs font-serif"
                        >
                          <p className="text-slate-300 leading-relaxed">
                            <strong className="text-purple-300">Commentary:</strong> {verse.exegesisNote}
                          </p>

                          {verse.gematriaOrConstant && (
                            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-amber-400">
                              <Scale className="w-3.5 h-3.5 text-amber-400" />
                              <span>{verse.gematriaOrConstant}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
