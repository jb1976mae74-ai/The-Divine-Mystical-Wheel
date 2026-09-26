import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, Trash2, Copy, Sparkles, BookOpen, Clock, 
  Tag, Shield, Compass, Star, Flame, Droplet, Wind, LandPlot,
  MessageSquare, Edit3, Bookmark, CornerDownLeft
} from 'lucide-react';
import { 
  PLANETARY_HOUSES, 
  HousePersonalNote, 
  PlanetaryHouseDef 
} from '../data/planetaryHousesData';

interface HouseNotePopoverProps {
  isOpen: boolean;
  houseNum: number | null;
  onClose: () => void;
  savedNote?: HousePersonalNote;
  onSaveNote: (houseNum: number, noteText: string, category: HousePersonalNote['category']) => void;
  onDeleteNote: (houseNum: number) => void;
  planetsInHouse?: {
    name: string;
    symbol: string;
    color: string;
    degreeFormatted?: string;
  }[];
  activeTheme?: {
    textPrimary?: string;
    textAccent?: string;
    borderAccent?: string;
  };
}

const CATEGORIES: HousePersonalNote['category'][] = [
  'General',
  'Affirmation',
  'Transit Reflection',
  'Shadow Work',
  'Karmic Lesson',
  'Goal / Milestone'
];

const PROMPT_STARTERS: { label: string; text: string; icon: string }[] = [
  { label: 'Affirmation', text: '✨ In this sphere of life, I anchor divine peace, sovereignty, and abundance.', icon: '✨' },
  { label: 'Transit Insight', text: '🪐 Active celestial transit: Observing shifts in focus and energetic alignment.', icon: '🪐' },
  { label: 'Karmic Focus', text: '🔮 Karmic lesson: Integrating past patterns into empowered conscious action.', icon: '🔮' },
  { label: 'Personal Vow', text: '📜 Sovereign commitment: Dedicated to continuous spiritual refinement in this realm.', icon: '📜' }
];

export default function HouseNotePopover({
  isOpen,
  houseNum,
  onClose,
  savedNote,
  onSaveNote,
  onDeleteNote,
  planetsInHouse = [],
  activeTheme
}: HouseNotePopoverProps) {
  const [noteText, setNoteText] = useState('');
  const [category, setCategory] = useState<HousePersonalNote['category']>('General');
  const [isCopied, setIsCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync state when opened with a new houseNum or savedNote
  useEffect(() => {
    if (savedNote) {
      setNoteText(savedNote.note);
      setCategory(savedNote.category || 'General');
    } else {
      setNoteText('');
      setCategory('General');
    }
    setJustSaved(false);
  }, [houseNum, savedNote, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, noteText, category, houseNum]);

  if (!isOpen || houseNum === null) return null;

  const houseDef = PLANETARY_HOUSES.find(h => h.houseNum === houseNum) || PLANETARY_HOUSES[0];

  const handleSave = () => {
    if (!noteText.trim()) {
      if (savedNote) {
        onDeleteNote(houseNum);
      }
      onClose();
      return;
    }
    onSaveNote(houseNum, noteText.trim(), category);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    onDeleteNote(houseNum);
    setNoteText('');
    onClose();
  };

  const handleCopy = () => {
    if (!noteText) return;
    const exportString = `[HOUSE ${houseDef.roman} • ${houseDef.latinName.toUpperCase()} (${houseDef.englishTitle})]\nCategory: ${category}\nNote: ${noteText}\nUpdated: ${savedNote?.updatedAt ? new Date(savedNote.updatedAt).toLocaleString() : new Date().toLocaleString()}`;
    navigator.clipboard.writeText(exportString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getElementBadgeClass = (element: string) => {
    switch (element) {
      case 'Ignis': return 'bg-red-500/15 border-red-500/30 text-red-400';
      case 'Materia': return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'Aer': return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400';
      case 'Aqua': return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
      default: return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover / Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-[#0d0d11] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-950/60 via-[#181512] to-amber-950/60 border-b border-amber-500/25 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex flex-col items-center justify-center text-amber-300 shadow-inner">
              <span className="text-xs font-mono font-bold uppercase text-amber-400">House</span>
              <span className="text-base font-serif font-bold text-amber-200">{houseDef.roman}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{houseDef.latinName}</span>
                  <span className="text-xs text-amber-400/80 font-normal">({houseDef.englishTitle})</span>
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getElementBadgeClass(houseDef.element)}`}>
                  {houseDef.angleType} • {houseDef.element}
                </span>
              </div>
              <p className="text-xs font-serif text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Natural Sign: <strong className="text-slate-200">{houseDef.naturalSignSymbol} {houseDef.naturalSign}</strong></span>
                <span>•</span>
                <span>Ruler: <strong className="text-amber-300">{houseDef.naturalRulerSymbol} {houseDef.naturalRuler}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Popover (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left">
          {/* Quick Domain Keywords & Resident Planets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Domain & Keywords */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                Sphere Realms & Archetypes
              </span>
              <div className="flex flex-wrap gap-1">
                {houseDef.domainKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] font-serif bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Resident Planets in this House */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                Resident Natal Stellar Nodes
              </span>
              {planetsInHouse.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {planetsInHouse.map((p, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-serif px-2 py-0.5 rounded border border-white/10 bg-[#15151a] flex items-center gap-1"
                      style={{ color: p.color }}
                    >
                      <span className="font-bold">{p.symbol}</span>
                      <span className="text-slate-200">{p.name}</span>
                      {p.degreeFormatted && (
                        <span className="text-[9px] text-slate-400 font-mono">({p.degreeFormatted})</span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic font-serif">
                  No major celestial bodies seated directly on this cusp in current natal coordinates.
                </p>
              )}
            </div>
          </div>

          {/* Esoteric Meditation Prompt Accordion / Quote */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/20 via-black/40 to-amber-950/20 border border-amber-500/20">
            <p className="text-xs font-serif text-slate-300 italic leading-relaxed">
              "{houseDef.description}"
            </p>
            <p className="text-[11px] font-serif text-amber-300/90 mt-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Contemplation: {houseDef.meditationPrompt}</span>
            </p>
          </div>

          {/* Personal Note Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Personal House Inscription & Note</span>
              </label>

              {savedNote?.updatedAt && (
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Last modified: {new Date(savedNote.updatedAt).toLocaleDateString()} {new Date(savedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Note Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" /> Tag:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-serif transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-black/40 text-slate-400 hover:text-slate-200 border border-white/10 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Starters */}
            <div className="flex flex-wrap gap-1.5 items-center pt-1">
              <span className="text-[10px] font-mono text-slate-500">Quick Starters:</span>
              {PROMPT_STARTERS.map((ps, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNoteText(prev => prev ? `${prev}\n${ps.text}` : ps.text);
                  }}
                  className="text-[10px] font-serif px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-slate-300 transition-colors cursor-pointer"
                >
                  {ps.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={`Inscribe personal reflections, transit insights, affirmations, or karmic notes for House ${houseDef.roman} (${houseDef.latinName})...`}
                rows={4}
                maxLength={600}
                className="w-full bg-black/70 border border-amber-500/30 focus:border-amber-400 text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-serif rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-amber-400/50 resize-none transition-all leading-relaxed"
                autoFocus
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
                {noteText.length}/600 chars
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-black/60 border-t border-white/10 p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {savedNote && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/30 text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Delete this house note"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Note</span>
              </button>
            )}

            {noteText && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy note to clipboard"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 hidden md:inline">
              Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-300">Ctrl+Enter</kbd> to save
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 text-xs font-serif transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-1.5 rounded-lg text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                justSaved
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
