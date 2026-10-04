import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Orbit, Calendar, Clock, MapPin, Sparkles, Sun, Moon, 
  Flame, Droplet, Wind, LandPlot, Shield, RefreshCw, Copy, Check, 
  Download, Layers, Star, Bookmark, Edit3, Trash2, FileText, ChevronRight,
  Plus, Tag, CheckCircle2, Share2
} from 'lucide-react';
import AstrologicalCharts from './AstrologicalCharts';
import { getZodiacMetadata, getZodiacSignFromDate } from './DailyAstroGuidance';
import { getMoonPhase } from '../utils/astrologyUtils';
import { 
  PLANETARY_HOUSES, 
  HousePersonalNote, 
  loadSavedHouseNotes, 
  saveHouseNotesToStorage,
  getHouseResidentPlanets,
  PlanetaryHouseDef
} from '../data/planetaryHousesData';
import HouseNotePopover from './HouseNotePopover';

interface NatalChartVisualizationProps {
  birthDate: string;
  onUpdateBirthDate: (dateStr: string) => void;
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
  };
  zodiacSign?: string;
  school?: string;
}

export default function NatalChartVisualization({
  birthDate,
  onUpdateBirthDate,
  activeTheme,
  zodiacSign: propZodiacSign,
  school = 'Hermetic Alchemy'
}: NatalChartVisualizationProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [houseFilter, setHouseFilter] = useState<'all' | 'annotated' | 'Angular' | 'Succedent' | 'Cadent'>('all');
  const [selectedHouseForPopover, setSelectedHouseForPopover] = useState<number | null>(null);
  
  // Persistent House Notes State
  const [houseNotes, setHouseNotes] = useState<Record<number, HousePersonalNote>>(() => {
    return loadSavedHouseNotes();
  });

  // Calculate resident planets per house based on birthDate
  const residentPlanetsByHouse = useMemo(() => {
    return getHouseResidentPlanets(birthDate || '1995-10-25');
  }, [birthDate]);

  // Derived zodiac sign and moon phase for saved birth date
  const effectiveZodiacSign = useMemo(() => {
    if (propZodiacSign) return propZodiacSign;
    if (birthDate) {
      return getZodiacSignFromDate(birthDate) || 'Scorpio';
    }
    return 'Scorpio';
  }, [propZodiacSign, birthDate]);

  const zodiacMeta = useMemo(() => getZodiacMetadata(effectiveZodiacSign), [effectiveZodiacSign]);
  const moonPhase = useMemo(() => birthDate ? getMoonPhase(birthDate) : null, [birthDate]);

  // Save note handler
  const handleSaveNote = (houseNum: number, noteText: string, category: HousePersonalNote['category']) => {
    const updated: Record<number, HousePersonalNote> = {
      ...houseNotes,
      [houseNum]: {
        houseNum,
        note: noteText,
        category,
        updatedAt: new Date().toISOString()
      }
    };
    setHouseNotes(updated);
    saveHouseNotesToStorage(updated);
  };

  // Delete note handler
  const handleDeleteNote = (houseNum: number) => {
    const updated = { ...houseNotes };
    delete updated[houseNum];
    setHouseNotes(updated);
    saveHouseNotesToStorage(updated);
  };

  // Clear all notes handler
  const handleClearAllNotes = () => {
    if (window.confirm("Are you sure you wish to clear all saved personal house inscriptions?")) {
      setHouseNotes({});
      saveHouseNotesToStorage({});
    }
  };

  // Export all notes to clipboard
  const handleExportAllNotes = () => {
    const entries = Object.values(houseNotes);
    if (entries.length === 0) {
      alert("No personal house inscriptions saved yet. Click on any planetary house to add a note!");
      return;
    }

    let report = `═══════════════════════════════════════════════════════════════\n`;
    report += `    THE GREAT WHEEL OF MYSTERIES — PLANETARY HOUSE GRIMOIRE    \n`;
    report += `═══════════════════════════════════════════════════════════════\n\n`;
    report += `Seeker Natal Incarnation Date: ${birthDate || 'Not Set'}\n`;
    report += `Primary Zodiac Polarity: ${effectiveZodiacSign} (${zodiacMeta.element})\n`;
    report += `Alchemical School: ${school}\n`;
    report += `Export Timestamp: ${new Date().toLocaleString()}\n\n`;
    report += `───────────────────────────────────────────────────────────────\n\n`;

    PLANETARY_HOUSES.forEach((h) => {
      const noteEntry = houseNotes[h.houseNum];
      if (noteEntry) {
        report += `[HOUSE ${h.roman} • ${h.latinName.toUpperCase()} (${h.englishTitle})]\n`;
        report += `Sphere Realm: ${h.subtitle} | Type: ${h.angleType} | Element: ${h.element}\n`;
        report += `Natural Sign: ${h.naturalSignSymbol} ${h.naturalSign} | Ruler: ${h.naturalRulerSymbol} ${h.naturalRuler}\n`;
        report += `Category: ${noteEntry.category}\n`;
        report += `Personal Inscription:\n"${noteEntry.note}"\n`;
        report += `Last Inscribed: ${new Date(noteEntry.updatedAt).toLocaleString()}\n\n`;
        report += `───────────────────────────────────────────────────────────────\n\n`;
      }
    });

    navigator.clipboard.writeText(report);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Filtered houses list
  const filteredHouses = useMemo(() => {
    return PLANETARY_HOUSES.filter((h) => {
      if (houseFilter === 'all') return true;
      if (houseFilter === 'annotated') return Boolean(houseNotes[h.houseNum]);
      return h.angleType === houseFilter;
    });
  }, [houseFilter, houseNotes]);

  const annotatedCount = Object.keys(houseNotes).length;

  const getElementBadge = (element: string) => {
    switch (element) {
      case 'Ignis': return { icon: Flame, badge: 'bg-red-500/15 border-red-500/30 text-red-400' };
      case 'Materia': return { icon: LandPlot, badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' };
      case 'Aer': return { icon: Wind, badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' };
      case 'Aqua': return { icon: Droplet, badge: 'bg-blue-500/15 border-blue-500/30 text-blue-400' };
      default: return { icon: Star, badge: 'bg-amber-500/15 border-amber-500/30 text-amber-400' };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden text-left"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Orbit className="w-32 h-32 text-amber-400" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 text-2xl font-serif shadow-inner">
              {zodiacMeta.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-slate-100 tracking-wide">
                  Comprehensive Celestial Natal Chart
                </h2>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Ephemeris Vector
                </span>
              </div>
              <p className="text-xs font-serif text-slate-400 mt-0.5">
                Calculated for Incarnation Date: <strong className="text-amber-300 font-sans">{birthDate || 'Not Set'}</strong> • {zodiacMeta.elementSymbol} {effectiveZodiacSign} Polarity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Saved Date:</span>
              <input
                type="date"
                value={birthDate || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onUpdateBirthDate(e.target.value);
                  }
                }}
                className="bg-black/80 border border-amber-500/40 text-amber-300 text-xs px-2 py-0.5 rounded font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick Natal Highlights Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Sun Sign */}
          <div className="p-3 rounded-xl bg-[#121215] border border-amber-500/20 flex items-center gap-3">
            <Sun className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Natal Sun Sign</div>
              <div className="text-xs font-serif font-bold text-slate-100">{effectiveZodiacSign} {zodiacMeta.symbol}</div>
            </div>
          </div>

          {/* Elemental Core */}
          <div className="p-3 rounded-xl bg-[#121215] border border-amber-500/20 flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Elemental Core</div>
              <div className="text-xs font-serif font-bold text-slate-100">{zodiacMeta.element} ({zodiacMeta.elementSymbol})</div>
            </div>
          </div>

          {/* Moon Phase */}
          <div className="p-3 rounded-xl bg-[#121215] border border-amber-500/20 flex items-center gap-3">
            <Moon className="w-5 h-5 text-sky-300 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Natal Lunar Phase</div>
              <div className="text-xs font-serif font-bold text-slate-100">{moonPhase ? `${moonPhase.emoji} ${moonPhase.name}` : 'Waxing Crescent'}</div>
            </div>
          </div>

          {/* Alchemical Focus */}
          <div className="p-3 rounded-xl bg-[#121215] border border-amber-500/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">School Alignment</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{school}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NEW FEATURE: 12 Planetary Houses Interactive Grimoire & Personal Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-left space-y-5"
      >
        {/* Section Header with Stats & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>The 12 Planetary Spheres & Personal Grimoire Notes</span>
              </h3>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{annotatedCount} / 12 Houses Inscribed</span>
              </span>
            </div>
            <p className="text-xs font-serif text-slate-400 mt-1">
              Click on any planetary house card or chart sector to open its popover, view archetypes, and inscribe persistent personal reflections.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {annotatedCount > 0 && (
              <button
                type="button"
                onClick={handleExportAllNotes}
                className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title="Copy all personal house notes to clipboard"
              >
                {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Grimoire Copied!' : 'Export All Notes'}</span>
              </button>
            )}

            {annotatedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAllNotes}
                className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Clear all saved house notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 w-fit flex-wrap">
          <button
            type="button"
            onClick={() => setHouseFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              houseFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Houses (12)
          </button>

          <button
            type="button"
            onClick={() => setHouseFilter('annotated')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
              houseFilter === 'annotated'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3 h-3 text-amber-400" />
            <span>Annotated ({annotatedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setHouseFilter('Angular')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              houseFilter === 'Angular'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Angular (I, IV, VII, X)
          </button>

          <button
            type="button"
            onClick={() => setHouseFilter('Succedent')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              houseFilter === 'Succedent'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Succedent (II, V, VIII, XI)
          </button>

          <button
            type="button"
            onClick={() => setHouseFilter('Cadent')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              houseFilter === 'Cadent'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadent (III, VI, IX, XII)
          </button>
        </div>

        {/* 12 Interactive House Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredHouses.map((h) => {
            const savedNote = houseNotes[h.houseNum];
            const hasNote = Boolean(savedNote);
            const residentPlanets = residentPlanetsByHouse[h.houseNum] || [];
            const elementInfo = getElementBadge(h.element);
            const ElementIcon = elementInfo.icon;

            return (
              <motion.div
                key={h.houseNum}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedHouseForPopover(h.houseNum)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                  hasNote
                    ? 'bg-gradient-to-b from-[#1c1810] via-[#141210] to-[#0e0d0f] border-amber-500/60 shadow-lg shadow-amber-950/30'
                    : 'bg-[#111115]/90 border-white/10 hover:border-amber-500/40 hover:bg-[#15151a]'
                }`}
              >
                {/* Subtle decorative glow */}
                {hasNote && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Bar: House Roman Numeral, Latin Title & Element */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-serif font-bold text-amber-300 text-xs shadow-inner">
                        {h.roman}
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                          {h.latinName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-serif block leading-tight">
                          {h.englishTitle}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 ${elementInfo.badge}`}>
                      <ElementIcon className="w-2.5 h-2.5" />
                      <span>{h.angleType}</span>
                    </span>
                  </div>

                  {/* Archetype & Ruler Info */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Ruler: <strong className="text-amber-300 font-serif">{h.naturalRulerSymbol} {h.naturalRuler}</strong></span>
                      <span>Sign: <strong className="text-slate-300 font-serif">{h.naturalSignSymbol} {h.naturalSign}</strong></span>
                    </div>

                    {/* Resident Planets Pills */}
                    {residentPlanets.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {residentPlanets.map((p, idx) => (
                          <span
                            key={`${p.name}-${h.houseNum}-${idx}`}
                            className="text-[9px] font-serif px-1.5 py-0.5 rounded bg-black/50 border border-white/10 flex items-center gap-1"
                            style={{ color: p.color }}
                            title={`${p.name} placed in House ${h.houseNum} (${p.degreeFormatted})`}
                          >
                            <span className="font-bold">{p.symbol}</span>
                            <span className="text-slate-200">{p.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personal Note Preview or Empty State Prompt */}
                  <div className="mt-3">
                    {hasNote ? (
                      <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-[11px] font-serif text-amber-200/90 leading-snug relative group/note">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-mono text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30 uppercase tracking-wider">
                            {savedNote.category}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(savedNote.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="line-clamp-2 italic text-slate-200">
                          "{savedNote.note}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-[10px] font-serif text-slate-500 group-hover:text-slate-300 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all">
                        <span className="flex items-center justify-center gap-1">
                          <Plus className="w-3 h-3 text-amber-400" />
                          <span>Click to inscribe personal note</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Hint */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-amber-300 transition-colors">
                  <span>{hasNote ? 'Edit Inscription' : 'Open Sphere Popover'}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Interactive Astrological Wheel & Ephemeris Engine */}
      <AstrologicalCharts
        activeTheme={activeTheme}
        globalBirthDate={birthDate}
        onBirthDateChange={onUpdateBirthDate}
        userZodiacSign={effectiveZodiacSign}
        school={school}
        houseNotes={houseNotes}
        onSelectHouseNote={(houseNum) => setSelectedHouseForPopover(houseNum)}
      />

      {/* House Note Popover / Modal Dialog */}
      <AnimatePresence>
        {selectedHouseForPopover !== null && (
          <HouseNotePopover
            isOpen={selectedHouseForPopover !== null}
            houseNum={selectedHouseForPopover}
            onClose={() => setSelectedHouseForPopover(null)}
            savedNote={selectedHouseForPopover ? houseNotes[selectedHouseForPopover] : undefined}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            planetsInHouse={selectedHouseForPopover ? residentPlanetsByHouse[selectedHouseForPopover] : []}
            activeTheme={activeTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
