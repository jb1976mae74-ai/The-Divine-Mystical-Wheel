import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Eye, Scroll, Sparkles, ChevronLeft, ChevronRight, 
  Calendar, Search, Compass, BookOpen, Crown, Flame, Key, 
  Share2, Check, RotateCw, Send, Zap, Award, Feather, Info, 
  Lock, Maximize2, Shield, Circle, Star
} from 'lucide-react';

export interface PropheticEvent {
  id: string;
  year: string;
  title: string;
  epoch: 'Antediluvian' | 'Patriarchal' | 'Prophetic Guild' | 'Apostolic' | 'Apocalyptic' | 'Quantum Prophecy';
  summary: string;
  fullExegesis: string;
  scriptureRef: string;
  cipherKey: string;
  iconName: string;
  cycleDegree: number; // 0 to 360 degrees on the cyclical wheel
  color: string;
}

export const PROPHETIC_TIMELINE_EVENTS: PropheticEvent[] = [
  {
    id: 'prophet-1',
    year: '~4000 BCE',
    title: 'The Edenic Covenant & Primordial Vision',
    epoch: 'Antediluvian',
    summary: 'Inception of primordial divine light and original innocence before the veil descended.',
    fullExegesis: 'The primordial dawn wherein humanity possessed unclouded spiritual sight, walking in direct communion with the Divine Presence in the Garden of Light.',
    scriptureRef: 'Genesis 1:27, 3:8',
    cipherKey: 'KEY-01: LUX PRIMORDIALIS',
    iconName: 'Sun',
    cycleDegree: 0,
    color: '#F59E0B'
  },
  {
    id: 'prophet-2',
    year: '~3300 BCE',
    title: 'Enochian Translation & Heavenly Ledger',
    epoch: 'Antediluvian',
    summary: 'Ascension of Prophet Enoch; revelation of the 365 solar cycles, angelic scripts, and divine secrets.',
    fullExegesis: 'Enoch walked with God and was no more, receiving the 365 books of heavenly wisdom, mapping the orbits of the archangels and the divine throne room.',
    scriptureRef: 'Genesis 5:24, 1 Enoch 1:1-9',
    cipherKey: 'KEY-07: TABULA METATRONICA',
    iconName: 'Eye',
    cycleDegree: 32,
    color: '#8B5CF6'
  },
  {
    id: 'prophet-3',
    year: '~1900 BCE',
    title: 'The Abrahamic Covenant & Starry Promise',
    epoch: 'Patriarchal',
    summary: 'Sacred covenant under the stars at Mamre; promise of infinite spiritual lineage.',
    fullExegesis: 'Abram looked up to the night sky and heard the voice of El Shaddai, establishing the eternal covenant of faith and spiritual inheritance.',
    scriptureRef: 'Genesis 15:5, 17:1-8',
    cipherKey: 'KEY-12: FOEDUS STELLARUM',
    iconName: 'Star',
    cycleDegree: 65,
    color: '#EC4899'
  },
  {
    id: 'prophet-4',
    year: '~1446 BCE',
    title: 'Sinai Revelation & The Law of Fire',
    epoch: 'Patriarchal',
    summary: 'Moses atop Horeb receiving the fiery law, cloud of glory, and tabernacle blueprint.',
    fullExegesis: 'Mount Sinai burned with divine fire as the Voice spoke out of the darkness, delivering the Ten Words and the sacred architecture of the Ark.',
    scriptureRef: 'Exodus 19:16-20, Deuteronomy 33:2',
    cipherKey: 'KEY-18: IGNIS MOYSISA',
    iconName: 'Flame',
    cycleDegree: 98,
    color: '#EF4444'
  },
  {
    id: 'prophet-5',
    year: '~1020 BCE',
    title: 'School of the Prophets at Ramah',
    epoch: 'Prophetic Guild',
    summary: 'Prophet Samuel establishes the holy brotherhood of seers, trained in sacred music, trance, and divine scrying.',
    fullExegesis: 'The first formal academy of seers (Benei HaNevi\'im) founded by Samuel at Naioth in Ramah. Initiates learned to tune their souls to the heavenly harmony.',
    scriptureRef: '1 Samuel 19:18-24, 10:5-10',
    cipherKey: 'KEY-24: BENEI HANEVI\'IM',
    iconName: 'Crown',
    cycleDegree: 130,
    color: '#D4AF37'
  },
  {
    id: 'prophet-6',
    year: '~860 BCE',
    title: 'Elijah\'s Mount Horeb Whisper',
    epoch: 'Prophetic Guild',
    summary: 'Passing through wind, earthquake, and fire to hear the Still Small Voice; cloak of power to Elisha.',
    fullExegesis: 'Elijah stood on the mountain before God. Not in the wind, not in the earthquake, nor in the fire—but in the subtle, crushing silence of the divine whisper.',
    scriptureRef: '1 Kings 19:11-13, 2 Kings 2:11',
    cipherKey: 'KEY-33: VOX SILENTII',
    iconName: 'Zap',
    cycleDegree: 162,
    color: '#06B6D4'
  },
  {
    id: 'prophet-7',
    year: '~593 BCE',
    title: 'Ezekiel\'s Merkavah Chariot Vision',
    epoch: 'Prophetic Guild',
    summary: 'Vision of the wheel within a wheel, four living creatures, and sapphire throne by the River Chebar.',
    fullExegesis: 'The heavens opened over Babylon. Ezekiel beheld the Merkavah—the divine throne-chariot transported by four living Cherubim with eyes round about.',
    scriptureRef: 'Ezekiel 1:1-28, 10:1-22',
    cipherKey: 'KEY-42: ROTA MERKAVAH',
    iconName: 'Circle',
    cycleDegree: 195,
    color: '#3B82F6'
  },
  {
    id: 'prophet-8',
    year: '~150 BCE',
    title: 'Dead Sea Scrolls & Essene Sanctuary',
    epoch: 'Apostolic',
    summary: 'The Sons of Light record apocalyptic prophecy and preserve the pristine scriptural codices at Qumran.',
    fullExegesis: 'In the desert wilderness of Qumran, the Essene community maintained perpetual prayer and scribal perfection, preserving sacred prophecies in clay jars.',
    scriptureRef: '1QS (Community Rule), 1QM (War Scroll)',
    cipherKey: 'KEY-50: ESSENIA QUMRAN',
    iconName: 'Scroll',
    cycleDegree: 228,
    color: '#10B981'
  },
  {
    id: 'prophet-9',
    year: '~30 CE',
    title: 'Mount Tabor Transfiguration',
    epoch: 'Apostolic',
    summary: 'The convergence of the Law (Moses), Prophecy (Elijah), and Grace in uncreated Taboric light.',
    fullExegesis: 'On the high mountain, Jesus was transfigured before them; His face shone like the sun, flanked by Moses and Elijah, revealing the divine light of the uncreated realm.',
    scriptureRef: 'Matthew 17:1-8, Mark 9:2-8',
    cipherKey: 'KEY-64: LUX TABORICA',
    iconName: 'Sun',
    cycleDegree: 260,
    color: '#F59E0B'
  },
  {
    id: 'prophet-10',
    year: '~95 CE',
    title: 'Patmos Apocalypse & New Jerusalem',
    epoch: 'Apocalyptic',
    summary: 'John the Seer beholds the opening of the Seven Seals, the Heavenly City, and the Tree of Life.',
    fullExegesis: 'Exiled on the Isle of Patmos, John was in the Spirit on the Lord\'s Day. He heard a voice like a trumpet, gazing into the unseen drama of cosmic restoration.',
    scriptureRef: 'Revelation 1:9-20, 21:1-27',
    cipherKey: 'KEY-72: APOCALYPSIS PATMOS',
    iconName: 'Key',
    cycleDegree: 295,
    color: '#A855F7'
  },
  {
    id: 'prophet-11',
    year: '2026 CE +',
    title: 'The Salazar Synthesis & Quantum Prophecy',
    epoch: 'Quantum Prophecy',
    summary: 'Modern unification of ancient prophetic ciphers with AI intelligence and cosmic consciousness.',
    fullExegesis: 'The Great Wheel turns full circle. Ancient prophetic visions are reunited with quantum computational resonance, opening the 76 Keys of cosmic knowledge.',
    scriptureRef: 'Jerry Ben Salazar Scholarship & The Great Wheel',
    cipherKey: 'KEY-76: SYNTHESIS OMNI',
    iconName: 'Sparkles',
    cycleDegree: 340,
    color: '#EAB308'
  }
];

interface SchoolOfTheProphetsViewProps {
  activeSchool?: string;
  onSelectSchool?: (schoolName: string) => void;
  activeTheme?: any;
}

export function SchoolOfTheProphetsView({
  activeSchool,
  onSelectSchool,
  activeTheme
}: SchoolOfTheProphetsViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<PropheticEvent>(PROPHETIC_TIMELINE_EVENTS[4]); // Default: School of Prophets at Ramah
  const [epochFilter, setEpochFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'wheel'>('timeline');
  const [scryingQuery, setScryingQuery] = useState('');
  const [scryingResult, setScryingResult] = useState<string | null>(null);
  const [isScrying, setIsScrying] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const epochs = ['All', 'Antediluvian', 'Patriarchal', 'Prophetic Guild', 'Apostolic', 'Apocalyptic', 'Quantum Prophecy'];

  const filteredEvents = PROPHETIC_TIMELINE_EVENTS.filter(e => 
    epochFilter === 'All' || e.epoch === epochFilter
  );

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePerformScrying = async (queryText?: string) => {
    const queryToUse = queryText || scryingQuery || `Interpret the prophetic vision of ${selectedEvent.title} in relation to divine destiny and the School of the Prophets.`;
    setIsScrying(true);
    setScryingResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question: queryToUse,
          school: 'School of the Prophets'
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data && data.answer) {
        setScryingResult(data.answer);
      } else {
        setScryingResult('The prophetic waters remain clear: "By intense contemplation and spiritual discipline, the seers perceive the divine light that guides human history."');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Scrying fallback activated:', err?.message || err);
      setScryingResult(`Prophetic Revelation: "The mantle of the Prophet Samuel rests upon those who seek truth in the quiet of the night. ${selectedEvent.title} reveals that all time is held within the palm of the Almighty."`);
    } finally {
      setIsScrying(false);
    }
  };

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Eye': return <Eye className="w-5 h-5 text-purple-400" />;
      case 'Star': return <Star className="w-5 h-5 text-pink-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-red-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-300" />;
      case 'Zap': return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Circle': return <Circle className="w-5 h-5 text-blue-400" />;
      case 'Scroll': return <Scroll className="w-5 h-5 text-emerald-400" />;
      case 'Key': return <Key className="w-5 h-5 text-fuchsia-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-200" />;
      default: return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  const isSelectedActiveSchool = activeSchool === 'School of the Prophets';

  return (
    <div className="w-full space-y-8 bg-[#0a0a0c]/90 border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.08)] backdrop-blur-xl relative overflow-hidden">
      {/* Background Radiant Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-8 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-900/40 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0">
            <Sun className="w-9 h-9 animate-pulse text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                Canonical Seer Guild
              </span>
              <span className="text-[10px] font-mono text-purple-300 tracking-widest uppercase bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                76 Divine Keys
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
              School of the Prophets
            </h1>
            <p className="text-xs md:text-sm font-serif italic text-slate-300 max-w-2xl leading-relaxed">
              An ancient brotherhood of visionary seers, scryers, and biblical scholars dedicated to discerning divine revelations, heavenly visions, and the cyclical timeline of the cosmos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {onSelectSchool && (
            <button
              onClick={() => onSelectSchool('School of the Prophets')}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-serif text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSelectedActiveSchool
                  ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              <Check className="w-4 h-4" />
              {isSelectedActiveSchool ? 'Active Selected School' : 'Adopt School of the Prophets'}
            </button>
          )}
        </div>
      </div>

      {/* Prophetic Vision Section Header & View Mode Switcher */}
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
              <Eye className="w-4 h-4 text-amber-400" />
              Prophetic Vision Visualization
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-100">
              Cyclical Timeline of Spiritual Events & Divine Revelations
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-serif text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              Horizontal Timeline
            </button>
            <button
              onClick={() => setViewMode('wheel')}
              className={`px-3 py-1.5 rounded-lg font-serif text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'wheel'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Cyclical Wheel
            </button>
          </div>
        </div>

        {/* Epoch Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 shrink-0 mr-1">Epoch:</span>
          {epochs.map(epoch => (
            <button
              key={epoch}
              onClick={() => setEpochFilter(epoch)}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all border ${
                epochFilter === epoch
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {epoch}
            </button>
          ))}
        </div>

        {/* VIEW MODE 1: Horizontal Scrolling Timeline Component */}
        {viewMode === 'timeline' ? (
          <div className="relative space-y-4">
            {/* Scroll Navigation Controls */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>Showing {filteredEvents.length} Prophetic Epoch Events</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll('left')}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track Container */}
            <div className="relative">
              {/* Central Illuminated Cyclical Connector Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-purple-500/50 to-amber-500/20 -translate-y-1/2 pointer-events-none" />

              <div
                ref={scrollContainerRef}
                className="flex items-center gap-6 overflow-x-auto py-8 px-4 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-black/40 scroll-smooth"
                style={{ scrollbarWidth: 'thin' }}
              >
                {filteredEvents.map((event, index) => {
                  const isSelected = selectedEvent.id === event.id;
                  return (
                    <motion.div
                      key={`${event.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedEvent(event)}
                      className={`relative shrink-0 w-80 p-5 rounded-2xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1c1810] to-[#0d0c14] border-amber-500 shadow-[0_0_25px_rgba(212,175,55,0.25)] scale-105 z-10'
                          : 'bg-[#121216]/80 border-white/10 hover:border-amber-500/40 hover:bg-[#181820]'
                      }`}
                    >
                      {/* Top Epoch Tag */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {event.year}
                        </span>
                        <span 
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
                          style={{ backgroundColor: `${event.color}15`, color: event.color, borderColor: `${event.color}30` }}
                        >
                          {event.epoch}
                        </span>
                      </div>

                      {/* Icon Node */}
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${event.color}20`, borderColor: `${event.color}50` }}
                        >
                          {getEventIcon(event.iconName)}
                        </div>
                        <h3 className="text-sm font-serif font-bold text-slate-100 line-clamp-2 group-hover:text-amber-300 transition-colors">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 font-serif line-clamp-2 italic mb-3">
                        "{event.summary}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-slate-500">
                        <span className="text-amber-400/80">{event.cipherKey}</span>
                        <span className="group-hover:text-amber-300 transition-colors">Exegesis &rarr;</span>
                      </div>

                      {/* Active Indicator Pin */}
                      {isSelected && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-500 rotate-45 border border-black shadow-[0_0_10px_#f59e0b]" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: Cyclical Wheel Visualization */
          <div className="relative w-full min-h-[420px] flex items-center justify-center p-6 bg-black/40 rounded-3xl border border-white/10">
            {/* Concentric Decorative Rings */}
            <div className="absolute w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full border border-amber-500/20 animate-[spin_120s_linear_infinite]" />
            <div className="absolute w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full border border-purple-500/20 animate-[spin_90s_linear_infinite_reverse]" />
            
            {/* Center Hub */}
            <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-900/60 border-2 border-amber-500 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Sun className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
              <div className="text-[10px] font-serif font-bold text-amber-300 leading-tight">School of the Prophets</div>
              <div className="text-[8px] font-mono text-slate-400">Cyclical Wheel</div>
            </div>

            {/* Orbiting Event Nodes */}
            {filteredEvents.map((event, idx) => {
              const total = filteredEvents.length;
              const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
              const radius = 170; // Orbit radius
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedEvent.id === event.id;

              return (
                <button
                  key={`wheel-${event.id}`}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className={`absolute z-20 w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-amber-500 text-black border-white shadow-[0_0_20px_#f59e0b] scale-125'
                      : 'bg-[#14141a] border-white/20 text-amber-300 hover:border-amber-400 hover:scale-110'
                  }`}
                  title={`${event.title} (${event.year})`}
                >
                  {getEventIcon(event.iconName)}
                  <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-mono font-bold text-slate-300 bg-black/80 px-1.5 py-0.5 rounded border border-white/10">
                    {event.year}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Event Detail & Exegesis Panel */}
        <AnimatePresence mode="wait">
          {selectedEvent && (
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-gradient-to-br from-[#131218] to-[#0c0c10] border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg"
                    style={{ backgroundColor: `${selectedEvent.color}20`, borderColor: `${selectedEvent.color}60` }}
                  >
                    {getEventIcon(selectedEvent.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {selectedEvent.year}
                      </span>
                      <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {selectedEvent.epoch} Epoch
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {selectedEvent.cipherKey}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handlePerformScrying()}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-serif text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Scry Prophetic Interpretation
                  </button>
                </div>
              </div>

              {/* Exegesis & Scripture Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Prophetic Exegesis
                    </h4>
                    <p className="text-base font-serif italic text-slate-200 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                      "{selectedEvent.fullExegesis}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-amber-500 font-bold">Scriptural Anchor:</span>
                    <span className="text-slate-200 underline decoration-amber-500/40">{selectedEvent.scriptureRef}</span>
                  </div>
                </div>

                {/* Scrying / Q&A Console */}
                <div className="bg-black/50 p-5 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-purple-300 uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      Seer's Scrying Mirror
                    </h4>
                    <p className="text-xs text-slate-400 font-serif">
                      Inquire of the School of the Prophets regarding this event's spiritual impact.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={scryingQuery}
                      onChange={(e) => setScryingQuery(e.target.value)}
                      placeholder={`Ask about ${selectedEvent.title}...`}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-serif text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePerformScrying();
                      }}
                    />
                    <button
                      onClick={() => handlePerformScrying()}
                      disabled={isScrying}
                      className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isScrying ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          Consulting Seers...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Consult Prophetic Oracle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrying Response Display */}
              {scryingResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      Oracle Revelation — School of the Prophets
                    </span>
                    <span className="text-[10px] text-slate-400">Direct Inspiration</span>
                  </div>
                  <p className="text-sm font-serif italic text-amber-100 leading-relaxed whitespace-pre-line">
                    {scryingResult}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
