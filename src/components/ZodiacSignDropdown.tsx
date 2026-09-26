import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Check, RotateCcw, Compass, Sparkles, Calendar, Info, Sliders, X } from 'lucide-react';
import { getZodiacMetadata } from './DailyAstroGuidance';
import { ZODIAC_PROFILES } from '../data/zodiacData';

export interface ZodiacSignDropdownProps {
  manualSign: string;
  autoSign: string;
  birthDate?: string;
  mode?: 'auto' | 'manual';
  onModeChange?: (mode: 'auto' | 'manual') => void;
  activeTheme: {
    id: string;
    textPrimary: string;
    borderAccent: string;
    borderAccentSemi?: string;
    textAccent?: string;
    textAccentHex?: string;
    bgCard?: string;
    [key: string]: any;
  };
  onSelectSign: (sign: string) => void;
  onClearOverride?: () => void;
}

export const ZODIAC_LIST = [
  { name: "Aries", symbol: "♈", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", symbol: "♉", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Apr 20 – May 20" },
  { name: "Gemini", symbol: "♊", element: "Aer (Air)", elementSymbol: "💨", dates: "May 21 – Jun 20" },
  { name: "Cancer", symbol: "♋", element: "Aqua (Water)", elementSymbol: "💧", dates: "Jun 21 – Jul 22" },
  { name: "Leo", symbol: "♌", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", symbol: "♍", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Aug 23 – Sep 22" },
  { name: "Libra", symbol: "♎", element: "Aer (Air)", elementSymbol: "💨", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", symbol: "♏", element: "Aqua (Water)", elementSymbol: "💧", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", symbol: "♐", element: "Ignis (Fire)", elementSymbol: "🔥", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn", symbol: "♑", element: "Materia (Earth)", elementSymbol: "🪨", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius", symbol: "♒", element: "Aer (Air)", elementSymbol: "💨", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", symbol: "♓", element: "Aqua (Water)", elementSymbol: "💧", dates: "Feb 19 – Mar 20" },
];

export default function ZodiacSignDropdown({
  manualSign,
  autoSign,
  birthDate,
  mode: controlledMode,
  onModeChange,
  activeTheme,
  onSelectSign,
  onClearOverride,
}: ZodiacSignDropdownProps) {
  // Mode state supporting both controlled and internal state
  const [internalMode, setInternalMode] = useState<'auto' | 'manual'>(() => {
    const saved = localStorage.getItem('oracle-zodiac-mode');
    if (saved === 'auto' || saved === 'manual') return saved;
    return manualSign ? 'manual' : 'auto';
  });

  const currentMode = controlledMode || internalMode;
  const isManualActive = currentMode === 'manual';

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHelperExpanded, setIsHelperExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Determine active effective sign based on mode
  const effectiveSign = isManualActive ? (manualSign || autoSign || "Aries") : (autoSign || "");
  const effectiveMeta = effectiveSign ? getZodiacMetadata(effectiveSign) : null;
  const autoMeta = autoSign ? getZodiacMetadata(autoSign) : null;

  // Retrieve rich zodiac profile traits
  const effectiveProfile = useMemo(() => {
    if (!effectiveSign) return null;
    return ZODIAC_PROFILES.find(p => p.name.toLowerCase() === effectiveSign.toLowerCase()) || null;
  }, [effectiveSign]);

  const autoProfile = useMemo(() => {
    if (!autoSign) return null;
    return ZODIAC_PROFILES.find(p => p.name.toLowerCase() === autoSign.toLowerCase()) || null;
  }, [autoSign]);

  // Sync mode changes
  const handleToggleMode = (newMode: 'auto' | 'manual') => {
    setInternalMode(newMode);
    localStorage.setItem('oracle-zodiac-mode', newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }

    if (newMode === 'manual') {
      // If switching to manual and no manual sign is set, pick autoSign or Aries and persist
      const targetSign = manualSign || autoSign || "Aries";
      onSelectSign(targetSign);
      localStorage.setItem('oracle-manual-zodiac-sign', targetSign);
      setIsHelperExpanded(true);
    } else {
      // Reverting to auto-calculate
      if (onClearOverride) {
        onClearOverride();
      }
    }
  };

  // Handle click outside to close dropdown and tooltip
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowTooltip(false);
      }
    }
    if (isOpen || showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showTooltip]);

  // Handle Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false);
        if (showTooltip) setShowTooltip(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showTooltip]);

  const handleSelect = (signName: string) => {
    onSelectSign(signName);
    localStorage.setItem('oracle-manual-zodiac-sign', signName);
    setIsOpen(false);
    setIsHelperExpanded(true);
  };

  return (
    <div id="zodiac-dropdown-container" ref={containerRef} className="flex flex-col gap-2 relative w-full mb-1">
      {/* Mode Toggle Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${activeTheme.textPrimary}`} />
          <span className="text-sm text-slate-300 font-serif">Zodiac Alignment Mode:</span>
        </div>

        {/* Toggle Bar: Auto-Calculate vs Manual Select */}
        <div 
          id="zodiac-mode-toggle"
          role="tablist"
          aria-label="Zodiac Alignment Calculation Mode"
          className="inline-flex items-center p-0.5 rounded-lg bg-black/60 border border-white/10 shadow-inner"
        >
          <button
            type="button"
            id="zodiac-mode-auto-btn"
            role="tab"
            aria-selected={!isManualActive}
            onClick={() => handleToggleMode('auto')}
            className={`px-2.5 py-1 rounded-md font-serif text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              !isManualActive
                ? activeTheme.id === 'deep-void'
                  ? 'bg-violet-950/80 text-violet-200 border border-violet-500/40 shadow-sm'
                  : activeTheme.id === 'ethereal-silver'
                  ? 'bg-slate-800 text-slate-100 border border-slate-500/40 shadow-sm'
                  : 'bg-amber-950/70 text-amber-200 border border-[#D4AF37]/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
            title="Auto-calculate zodiac sign based on your natal birth date"
          >
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Auto-Calculate</span>
            {autoSign && (
              <span className="text-[10px] opacity-75 font-mono">({autoSign})</span>
            )}
          </button>

          <button
            type="button"
            id="zodiac-mode-manual-btn"
            role="tab"
            aria-selected={isManualActive}
            onClick={() => handleToggleMode('manual')}
            className={`px-2.5 py-1 rounded-md font-serif text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isManualActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
            title="Manually select your zodiac sign, overriding the date-based calculation"
          >
            <Sliders className="w-3 h-3 shrink-0" />
            <span>Manual Select</span>
            {isManualActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Mode-Specific Presentation */}
      {isManualActive ? (
        /* MANUAL SELECT MODE: Active Dropdown Selector */
        <div className="relative w-full">
          <button
            type="button"
            id="zodiac-dropdown-trigger"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`w-full bg-black/60 border ${
              isOpen 
                ? activeTheme.id === 'deep-void' 
                  ? 'border-violet-400 ring-1 ring-violet-400/40' 
                  : activeTheme.id === 'ethereal-silver' 
                  ? 'border-slate-300 ring-1 ring-slate-300/40' 
                  : 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40'
                : 'border-amber-500/40 hover:border-amber-500/60'
            } rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-inner`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {effectiveSign && effectiveMeta ? (
                <>
                  <div 
                    id="zodiac-trigger-symbol-badge"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0 font-serif border bg-amber-500/20 border-amber-500/40 text-amber-300"
                  >
                    {effectiveMeta.symbol}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-medium text-amber-200 text-sm tracking-wide">
                        {effectiveSign}
                      </span>
                      <span className="text-[11px] text-amber-400/80 font-serif flex items-center gap-1">
                        <span>•</span>
                        <span>{effectiveMeta.element}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-serif truncate">
                      {effectiveMeta.dates} — {effectiveMeta.keyTrait}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-sm text-slate-300">
                      Select Zodiac Sign...
                    </span>
                    <span className="text-[10px] text-slate-500 font-serif">
                      Choose which sign to channel into your inquiry
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {/* Informational Tooltip Toggle Button */}
              {effectiveProfile && (
                <div className="relative">
                  <button
                    type="button"
                    id="zodiac-traits-info-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(prev => !prev);
                    }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title="View Zodiac Traits Tooltip"
                    aria-label="View Zodiac Traits Tooltip"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {/* Floating Tooltip */}
                  <AnimatePresence>
                    {showTooltip && effectiveProfile && effectiveMeta && (
                      <motion.div
                        id="zodiac-traits-floating-tooltip"
                        ref={tooltipRef}
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 bottom-full mb-2 z-50 w-72 sm:w-84 p-3 rounded-xl bg-[#0f0e18] border border-amber-500/40 shadow-2xl backdrop-blur-xl text-left pointer-events-auto"
                        style={{
                          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.15)'
                        }}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-serif font-bold">
                              {effectiveMeta.symbol}
                            </span>
                            <span className="font-serif font-semibold text-xs text-amber-200">
                              {effectiveSign} Traits
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({effectiveMeta.dates})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTooltip(false)}
                            className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <div 
                          id="zodiac-tooltip-scrollable-content"
                          className="max-h-36 overflow-y-auto pr-1 text-[11px] leading-relaxed text-slate-300 font-serif space-y-1.5"
                        >
                          <div className="text-amber-300 font-medium flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>Key Trait: <span className="text-slate-100 font-normal">{effectiveMeta.keyTrait}</span></span>
                          </div>
                          <p className="text-slate-300/95">
                            {effectiveProfile.description}
                          </p>
                          <div className="pt-1 text-[10px] text-slate-400 border-t border-white/5 font-mono flex flex-wrap gap-2">
                            <span>Ruler: <strong className="text-amber-300 font-normal">{effectiveProfile.rulingPlanet}</strong></span>
                            <span>•</span>
                            <span>Alchemical: <strong className="text-amber-300 font-normal">{effectiveProfile.alchemicalTrait}</strong></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <span 
                id="zodiac-override-badge"
                className="text-[10px] px-2 py-0.5 rounded font-serif text-amber-300 bg-amber-500/20 border border-amber-500/30 flex items-center gap-1"
                title="Manual override is active across all interpretations and metrics"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Override Active</span>
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
                  isOpen ? 'rotate-180 text-amber-400' : ''
                }`} 
              />
            </div>
          </button>

          {/* Custom Animated Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="zodiac-dropdown-menu"
                role="listbox"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0d0c14] border border-white/15 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-72 overflow-y-auto"
                style={{
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.08)'
                }}
              >
                {/* Section Header */}
                <div className="px-3 py-1.5 text-[10px] font-serif uppercase tracking-wider text-slate-400 bg-black/40 flex items-center justify-between border-b border-white/5">
                  <span>Choose Sign (Persists in LocalStorage)</span>
                  <button
                    type="button"
                    onClick={() => handleToggleMode('auto')}
                    className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-mono text-[9px] cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Revert to Auto</span>
                  </button>
                </div>

                {/* 12 Zodiac Options */}
                <div className="p-1.5 space-y-0.5">
                  {ZODIAC_LIST.map((item) => {
                    const isSelected = manualSign === item.name;
                    const isAutoCalculatedMatch = autoSign === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        id={`zodiac-option-${item.name.toLowerCase()}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/60 text-amber-100 border border-amber-500/50 shadow-sm'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className={`w-6 h-6 rounded flex items-center justify-center font-serif text-sm font-bold border shrink-0 ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-white/5 border-white/10 text-slate-300'
                            }`}
                          >
                            {item.symbol}
                          </span>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-serif font-medium text-slate-100">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-serif">
                                {item.dates}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-serif truncate">
                              {item.elementSymbol} {item.element}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isAutoCalculatedMatch && (
                            <span className="text-[9px] font-serif text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                              Natal match
                            </span>
                          )}
                          {isSelected && (
                            <Check className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Short, scrollable informational helper card describing the selected zodiac sign's key traits whenever a sign is manually selected */}
          {isManualActive && effectiveSign && effectiveMeta && effectiveProfile && (
            <motion.div
              id="zodiac-manual-traits-helper"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-1.5 rounded-lg bg-black/60 border border-amber-500/30 p-2.5 backdrop-blur-md shadow-md text-left"
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-serif font-bold shrink-0">
                    {effectiveMeta.symbol}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-serif font-semibold text-amber-200 truncate">
                      {effectiveSign} Astral Traits
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden xs:inline shrink-0">
                      ({effectiveMeta.dates})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-serif">
                    Ruler: <strong className="text-amber-300 font-normal">{effectiveProfile.rulingPlanet}</strong>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-serif hidden sm:inline">
                    {effectiveProfile.alchemicalTrait}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsHelperExpanded(!isHelperExpanded)}
                    className="text-slate-400 hover:text-amber-300 p-0.5 rounded transition-colors cursor-pointer"
                    title={isHelperExpanded ? "Minimize Traits" : "Expand Traits"}
                    aria-label="Toggle Traits Helper Visibility"
                  >
                    {isHelperExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isHelperExpanded && (
                <div
                  id="zodiac-traits-scrollable-content"
                  tabIndex={0}
                  role="region"
                  aria-label={`${effectiveSign} key traits and astral description`}
                  className="mt-2 max-h-24 sm:max-h-28 overflow-y-auto pr-1.5 text-[11px] leading-relaxed text-slate-300 font-serif space-y-1.5 selection:bg-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-500/30 rounded"
                >
                  <div className="flex items-start gap-1.5 text-amber-300 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span>Key Trait: <span className="text-amber-100 font-normal">{effectiveMeta.keyTrait}</span></span>
                  </div>

                  <p className="text-slate-300/95">
                    {effectiveProfile.description}
                  </p>

                  <div className="pt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 border-t border-white/5 font-mono">
                    <span>Element: <strong className="text-slate-200 font-normal">{effectiveMeta.element} {effectiveMeta.elementSymbol}</strong></span>
                    <span>•</span>
                    <span>Strength: <strong className="text-amber-300 font-normal">{effectiveProfile.spiritualStrength}</strong></span>
                    <span>•</span>
                    <span>Alchemical Operation: <strong className="text-amber-300 font-normal">{effectiveProfile.alchemicalTrait}</strong></span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        /* AUTO-CALCULATE MODE: Clean Display Card */
        <div 
          id="zodiac-auto-card"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 flex items-center justify-between shadow-inner"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {autoSign && autoMeta ? (
              <>
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0 font-serif border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                  {autoMeta.symbol}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-medium text-slate-200 text-sm tracking-wide">
                      {autoSign}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-serif bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Auto-Calculated
                    </span>
                    <span className="text-[11px] text-slate-400 font-serif hidden sm:inline">
                      • {autoMeta.element}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-serif truncate">
                    From natal date ({birthDate}) — {autoMeta.keyTrait}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xs text-slate-300">
                    Natal Birth Date Unset
                  </span>
                  <span className="text-[10px] text-slate-500 font-serif">
                    Set your birth date in the Astro-Guidance panel below, or switch to 'Manual Select'.
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {autoSign && autoProfile && autoMeta && (
              <div className="relative">
                <button
                  type="button"
                  id="zodiac-auto-traits-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(prev => !prev);
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  title="View Auto-Calculated Zodiac Traits"
                  aria-label="View Auto-Calculated Zodiac Traits"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      id="zodiac-auto-traits-tooltip"
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-full mb-2 z-50 w-72 sm:w-84 p-3 rounded-xl bg-[#0d1612] border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-left pointer-events-auto"
                      style={{
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(16, 185, 129, 0.15)'
                      }}
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-serif font-bold">
                            {autoMeta.symbol}
                          </span>
                          <span className="font-serif font-semibold text-xs text-emerald-200">
                            {autoSign} Natal Traits
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTooltip(false)}
                          className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="max-h-36 overflow-y-auto pr-1 text-[11px] leading-relaxed text-slate-300 font-serif space-y-1.5">
                        <div className="text-emerald-300 font-medium flex items-start gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Key Trait: <span className="text-slate-100 font-normal">{autoMeta.keyTrait}</span></span>
                        </div>
                        <p className="text-slate-300/95">
                          {autoProfile.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleToggleMode('manual')}
              className="text-[11px] font-serif px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
            >
              Override
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
