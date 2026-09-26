import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Save, Trash2, Sparkles, Wand2, Shield, 
  Book, Scroll, PenTool, Hash, Palette, 
  Check, Info, ChevronRight, Share2, Globe, Lock,
  Pyramid, Eye, Flame, Waves, Wind, Mountain,
  Search, X, Sun, Moon, Star, Hexagon, Circle, Triangle,
  Crown, Compass, Feather, Key, RotateCw, RefreshCw, Gauge, Radio, Play
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { SchoolOfTheProphetsView } from './SchoolOfTheProphetsView';
import { AethericWhipSWRGauge } from './AethericWhipSWRGauge';

interface Tradition {
  id?: string;
  name: string;
  description: string;
  principles: string[];
  tags: string[];
  badge: {
    icon: string;
    primaryColor: string;
    secondaryColor: string;
    pattern: 'none' | 'circles' | 'grid' | 'rays';
  };
  createdAt: string;
  userId: string;
}

const BADGE_ICONS = [
  'Shield', 'Eye', 'Pyramid', 'Flame', 'Waves', 'Wind', 'Mountain', 'Book', 'Scroll', 'Sun', 'Moon', 'Star', 'Hexagon', 'Circle', 'Triangle', 'Crown', 'Compass', 'Feather', 'Key'
];

const COLORS = [
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Crimson', hex: '#991B1B' },
  { name: 'Indigo', hex: '#3730A3' },
  { name: 'Emerald', hex: '#065F46' },
  { name: 'Amber', hex: '#B45309' },
  { name: 'Violet', hex: '#5B21B6' },
  { name: 'Slate', hex: '#1E293B' },
  { name: 'Rose', hex: '#9F1239' },
];

export const CANONICAL_TRADITIONS: Tradition[] = [
  {
    id: 'canonical-school-of-prophets',
    name: 'School of the Prophets',
    description: 'An ancient brotherhood of visionary seers, scryers, and biblical scholars dedicated to discerning divine revelations, prophetic dreams, and the hidden timeline of the cosmos. Through intense spiritual discipline, hermeneutic exegesis, and heavenly vision, the School of the Prophets interprets signs across ages to illuminate divine destiny.',
    principles: [
      'Divine Resonance: Receiving direct revelatory inspiration through sacred communion and intense prayerful contemplation.',
      'Scriptural Hermeneutics: Unlocking multi-layered prophetic ciphers hidden within ancient covenants and holy codices.',
      'Chronos & Kairos Vision: Discerning the appointment of times, cosmic cycles, and divine epochal shifts.'
    ],
    tags: ['prophecy', 'revelation', 'seers', 'scripture', 'divine-vision', 'covenant', 'salazar'],
    badge: {
      icon: 'Sun',
      primaryColor: '#D4AF37',
      secondaryColor: '#5B21B6',
      pattern: 'rays'
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    userId: 'canonical'
  },
  {
    id: 'canonical-hermetic-alchemy',
    name: 'Hermetic Alchemy',
    description: 'The royal art of spiritual transmutation founded by Hermes Trismegistus. Transmuting dense spiritual lead into immortal light through the balance of macrocosm and microcosm.',
    principles: [
      'As Above, So Below: The microcosm reflects the infinite macrocosm.',
      'Transmutation of Mind: Converting lower passions into elevated spiritual clarity.',
      'The Magnum Opus: Unifying Sulphur, Salt, and Mercury into the Philosopher\'s Stone.'
    ],
    tags: ['alchemy', 'hermeticism', 'transmutation', 'magnum-opus'],
    badge: {
      icon: 'Flame',
      primaryColor: '#D4AF37',
      secondaryColor: '#1E293B',
      pattern: 'circles'
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    userId: 'canonical'
  },
  {
    id: 'canonical-metatronic-light',
    name: 'Metatronic School of Thought',
    description: 'Geometric metaphysics of the celestial Scribe Metatron. Mapping the sacred architecture of creation through Metatron\'s Cube and the divine ledger of souls.',
    principles: [
      'Sacred Geometry: The fundamental blueprint of atomic and spiritual existence.',
      'The Celestial Ledger: Inscribing individual destiny into cosmic memory.',
      'Chokmah Emanation: Wisdom radiating through the 72 divine names.'
    ],
    tags: ['metatron', 'sacred-geometry', 'archangel', 'light'],
    badge: {
      icon: 'Eye',
      primaryColor: '#3730A3',
      secondaryColor: '#B45309',
      pattern: 'grid'
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    userId: 'canonical'
  },
  {
    id: 'canonical-gnosticism',
    name: 'Gnosticism & Secret Gnosis',
    description: 'The path of direct intuitive knowledge (Gnosis) of the transcendent Monad, liberating the divine spark from lower material illusions.',
    principles: [
      'Direct Awakening: Divine truth discovered within through inner revelation.',
      'Transcendence of Archons: Rising above cosmic boundaries toward pure light.',
      'Sophia\'s Redemption: Restoring harmony to the spiritual Pleroma.'
    ],
    tags: ['gnosis', 'pleroma', 'sophia', 'divine-spark'],
    badge: {
      icon: 'Scroll',
      primaryColor: '#9F1239',
      secondaryColor: '#5B21B6',
      pattern: 'rays'
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    userId: 'canonical'
  }
];

interface SchoolOfThoughtPortalProps {
  activeTheme: any;
  activeSchool?: string;
  onSelectSchool?: (schoolName: string) => void;
}

export default function SchoolOfThoughtPortal({ activeTheme, activeSchool, onSelectSchool }: SchoolOfThoughtPortalProps) {
  const [portalTab, setPortalTab] = useState<'prophets' | 'all' | 'swr-gauge'>('all');
  const [showGaugeBanner, setShowGaugeBanner] = useState(true);
  const [userTraditions, setUserTraditions] = useState<Tradition[]>([]);
  const [activeTradition, setActiveTradition] = useState<Tradition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  
  // Form State
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [principles, setPrinciples] = useState<string[]>(['', '', '']);
  const [tags, setTags] = useState<string>('');
  const [badgeConfig, setBadgeConfig] = useState<Tradition['badge']>({
    icon: 'Sun',
    primaryColor: '#D4AF37',
    secondaryColor: '#5B21B6',
    pattern: 'rays'
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchTraditions();
    }
  }, [user]);

  const fetchTraditions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users', user.uid, 'traditions'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tradition[];
      setUserTraditions(fetched);
    } catch (error) {
      console.error('Error fetching traditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTraditions = useMemo(() => {
    const combined = [...userTraditions];
    // Add canonical traditions if not already present in userTraditions
    for (const c of CANONICAL_TRADITIONS) {
      if (!combined.some(t => t.name.toLowerCase() === c.name.toLowerCase())) {
        combined.push(c);
      }
    }
    return combined;
  }, [userTraditions]);

  const filteredAndSortedTraditions = useMemo(() => {
    let result = [...allTraditions];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/^#/, '');
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.principles.some(p => p.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [allTraditions, searchQuery, sortBy]);

  const handleGenerateDescription = async () => {
    if (!name || !concept) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/school-of-thought/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, concept })
      });
      const data = await response.json();
      if (data.description) setDescription(data.description);
      if (data.principles) setPrinciples(data.principles);
      if (data.tags) setTags(data.tags.join(', '));
      if (data.badge) setBadgeConfig(prev => ({ ...prev, ...data.badge }));
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTradition = async () => {
    if (!user || !name || !description) return;
    setLoading(true);
    try {
      const traditionData: Omit<Tradition, 'id'> = {
        name,
        description,
        principles: principles.filter(p => p.trim() !== ''),
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        badge: badgeConfig,
        createdAt: new Date().toISOString(),
        userId: user.uid
      };
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'traditions'), traditionData);
      setUserTraditions([{ id: docRef.id, ...traditionData }, ...userTraditions]);
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Error saving tradition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTradition = async (id: string) => {
    if (id.startsWith('canonical-')) {
      alert('Canonical traditions belong to the immutable Akashic Records and cannot be dissolved.');
      return;
    }
    if (!user || !window.confirm('Are you sure you want to dissolve this tradition?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'traditions', id));
      setUserTraditions(userTraditions.filter(t => t.id !== id));
      if (activeTradition?.id === id) setActiveTradition(null);
    } catch (error) {
      console.error('Error deleting tradition:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setConcept('');
    setDescription('');
    setPrinciples(['', '', '']);
    setTags('');
    setBadgeConfig({
      icon: 'Sun',
      primaryColor: '#D4AF37',
      secondaryColor: '#5B21B6',
      pattern: 'rays'
    });
  };

  const renderIcon = (iconName: string, className?: string) => {
    const icons: Record<string, any> = {
      Shield, Eye, Pyramid, Flame, Waves, Wind, Mountain, Book, Scroll, Sun, Moon, Star, Hexagon, Circle, Triangle, Crown, Compass, Feather, Key
    };
    const IconComponent = icons[iconName] || Shield;
    return <IconComponent className={className} />;
  };

  const Badge = ({ config, size = 'md' }: { config: Tradition['badge'], size?: 'sm' | 'md' | 'lg' }) => {
    const s = size === 'sm' ? 40 : size === 'md' ? 80 : 160;
    const stroke = size === 'sm' ? 1.5 : 2;
    
    return (
      <div 
        className="relative flex items-center justify-center rounded-full overflow-hidden border-2"
        style={{ 
          width: s, 
          height: s, 
          backgroundColor: config.secondaryColor,
          borderColor: config.primaryColor,
          boxShadow: `0 0 ${s/4}px ${config.primaryColor}40`
        }}
      >
        {/* Pattern Layer */}
        {config.pattern === 'circles' && (
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle, ${config.primaryColor} 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
        )}
        {config.pattern === 'grid' && (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${config.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${config.primaryColor} 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
        )}
        {config.pattern === 'rays' && (
          <div className="absolute inset-0 opacity-20" style={{ background: `conic-gradient(from 0deg, transparent, ${config.primaryColor}, transparent 30deg)`, backgroundSize: '100% 100%' }} />
        )}
        
        <div style={{ color: config.primaryColor }}>
          {renderIcon(config.icon, size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-10 h-10' : 'w-20 h-20')}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setPortalTab('prophets')}
            className={`px-5 py-2.5 rounded-xl font-serif text-xs md:text-sm transition-all flex items-center gap-2 ${
              portalTab === 'prophets'
                ? 'bg-gradient-to-r from-amber-500/30 to-purple-900/40 border border-amber-500/60 text-amber-300 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>School of the Prophets Portal</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Prophetic Vision
            </span>
          </button>

          <button
            onClick={() => setPortalTab('all')}
            className={`px-5 py-2.5 rounded-xl font-serif text-xs md:text-sm transition-all flex items-center gap-2 ${
              portalTab === 'all'
                ? 'bg-gradient-to-r from-amber-500/30 to-purple-900/40 border border-amber-500/60 text-amber-300 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pyramid className="w-4 h-4 text-amber-400" />
            <span>All Mystery Schools & Traditions</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
              {allTraditions.length} Traditions
            </span>
          </button>

          <button
            onClick={() => setPortalTab('swr-gauge')}
            className={`px-5 py-2.5 rounded-xl font-serif text-xs md:text-sm transition-all flex items-center gap-2 ${
              portalTab === 'swr-gauge'
                ? 'bg-gradient-to-r from-cyan-950/80 via-amber-950/60 to-purple-950/80 border border-cyan-400/60 text-cyan-200 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Aetheric Whip Calibration</span>
            <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              1.1:1 SWR
            </span>
          </button>
        </div>
      </div>

      {portalTab === 'swr-gauge' ? (
        <AethericWhipSWRGauge activeTheme={activeTheme} />
      ) : portalTab === 'prophets' ? (
        <SchoolOfTheProphetsView 
          activeSchool={activeSchool}
          onSelectSchool={onSelectSchool}
          activeTheme={activeTheme}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <Pyramid className="w-3.5 h-3.5" />
                <span>TRADITION FORGE & MYSTERY DIRECTORY</span>
              </div>
              <h1 className={`text-3xl md:text-4xl font-serif font-bold ${activeTheme.textPrimary} tracking-tight`}>
                The Tradition Forge
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Inscribe your proprietary esoteric wisdom into the digital aether. Create, document, and curate new traditions that bridge the gap between ancient principles and modern discovery.
              </p>
            </div>
            
            {!isCreating && (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-sm focus:border-amber-500/50 outline-none cursor-pointer appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Alphabetical</option>
                </select>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search traditions..."
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-amber-500/50 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-slate-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setPortalTab('swr-gauge');
                    setShowGaugeBanner(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-serif font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] cursor-pointer"
                  title="Open SWR Instrument & Begin 1.1:1 Auto-Calibration"
                >
                  <Play className="w-4 h-4 fill-current text-amber-200" />
                  <span>Begin Auto-Calibration</span>
                </button>

                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-serif font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <Plus className="w-5 h-5" />
                  Forge New Tradition
                </button>
              </div>
            )}
          </div>

          {/* Featured Aetheric Whip Calibration Gauge Banner */}
          {!isCreating && showGaugeBanner && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Aetheric Whip Impedance Instrument</span>
                </span>
                <button
                  onClick={() => setShowGaugeBanner(false)}
                  className="text-xs font-mono text-slate-500 hover:text-slate-300"
                >
                  Dismiss Panel
                </button>
              </div>
              <AethericWhipSWRGauge activeTheme={activeTheme} />
            </div>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left: Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#141416]/80 border border-white/10 p-6 rounded-2xl shadow-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">Tradition Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. The Order of the Iron Lily"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">Core Concept</label>
                    <input
                      type="text"
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="e.g. Binary Alchemy and Digital Souls"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">Associated Keyword Tags</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="e.g. alchemy, void, digital, light (comma separated)"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-500/50 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">Esoteric Description</label>
                    <button
                      onClick={handleGenerateDescription}
                      disabled={generating || !name || !concept}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
                      AI Scribe Assist
                    </button>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the historical origins, core philosophy, and mystical goals of your tradition..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-amber-500/50 outline-none transition-all font-serif italic text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono text-amber-400 uppercase tracking-wider">The Three Pillars (Principles)</label>
                  <div className="space-y-2">
                    {principles.map((p, i) => (
                      <div key={`forge-principle-${i}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-mono text-amber-400">
                          {i + 1}
                        </div>
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => {
                            const next = [...principles];
                            next[i] = e.target.value;
                            setPrinciples(next);
                          }}
                          placeholder={`Principle ${i + 1}`}
                          className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-500/50 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-serif hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTradition}
                  disabled={loading || !name || !description}
                  className="flex-[2] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Finalize Inscription
                </button>
              </div>
            </div>

            {/* Right: Badge Generator */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#141416]/80 border border-white/10 p-6 rounded-2xl shadow-2xl space-y-8 sticky top-24">
                <div className="text-center space-y-4">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">Tradition Badge Preview</div>
                  <div className="flex justify-center">
                    <Badge config={badgeConfig} size="lg" />
                  </div>
                  <div className="text-lg font-serif font-bold text-white">{name || 'Unnamed Tradition'}</div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Celestial Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_ICONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setBadgeConfig({ ...badgeConfig, icon })}
                          className={`p-2 rounded-lg border transition-all ${
                            badgeConfig.icon === icon 
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                              : 'bg-black/40 border-white/5 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {renderIcon(icon, 'w-4 h-4')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Primary Essence</label>
                      <div className="grid grid-cols-4 gap-2">
                        {COLORS.map(c => (
                          <button
                            key={c.name}
                            onClick={() => setBadgeConfig({ ...badgeConfig, primaryColor: c.hex })}
                            className={`w-full aspect-square rounded-full border-2 transition-all ${
                              badgeConfig.primaryColor === c.hex ? 'border-white scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Outer Void</label>
                      <div className="grid grid-cols-4 gap-2">
                        {COLORS.map(c => (
                          <button
                            key={c.name}
                            onClick={() => setBadgeConfig({ ...badgeConfig, secondaryColor: c.hex })}
                            className={`w-full aspect-square rounded-full border-2 transition-all ${
                              badgeConfig.secondaryColor === c.hex ? 'border-white scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Emanation Pattern</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['none', 'circles', 'grid', 'rays'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setBadgeConfig({ ...badgeConfig, pattern: p })}
                          className={`py-1.5 rounded-lg border text-[10px] font-mono transition-all capitalize ${
                            badgeConfig.pattern === p 
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                              : 'bg-black/40 border-white/5 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-amber-300/60 font-serif">Consulting the Akashic Records...</p>
              </div>
            ) : filteredAndSortedTraditions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Search className="w-12 h-12 text-amber-500/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-slate-300">No Traditions Found</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    {searchQuery 
                      ? `No traditions matching "${searchQuery}" in the Akashic records.`
                      : "The great wheel awaits your first inscription."
                    }
                  </p>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-8 py-3 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 font-serif transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTraditions.map((t, idx) => (
                  <motion.div
                    key={`${t.id}-${idx}`}
                    layoutId={t.id}
                    onClick={() => setActiveTradition(t)}
                    className="group bg-[#141416]/60 border border-white/10 p-6 rounded-2xl hover:border-amber-500/40 transition-all cursor-pointer space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-amber-500" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge config={t.badge} size="sm" />
                      <div>
                        <h3 className="font-serif font-bold text-white group-hover:text-amber-300 transition-colors">{t.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-3 font-serif italic leading-relaxed">
                      {t.description}
                    </p>
                    
                    {t.tags && t.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {t.tags.map((tag, idx) => (
                          <span 
                            key={`${t.id}-tag-${idx}`} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(tag);
                            }}
                            className="text-[9px] font-mono text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                          >
                            <Hash className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {t.principles.slice(0, 2).map((p, i) => (
                        <div key={`${t.id}-principle-${i}`} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-500">
                          {p}
                        </div>
                      ))}
                      {t.principles.length > 2 && (
                        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-500">
                          +{t.principles.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeTradition && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTradition(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0e0e10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setActiveTradition(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>

              {/* Sidebar */}
              <div className="w-full md:w-80 p-8 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center text-center space-y-6">
                <Badge config={activeTradition.badge} size="lg" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-white leading-tight">{activeTradition.name}</h2>
                  <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">Proprietary Tradition</div>
                </div>
                
                <div className="w-full pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Founded</span>
                    <span className="text-slate-300">{new Date(activeTradition.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Security</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTradition(activeTradition.id!)}
                  className="mt-auto flex items-center gap-2 text-red-400/60 hover:text-red-400 text-xs font-mono transition-all pt-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Dissolve Tradition
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[80vh]">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <Scroll className="w-4 h-4" />
                      Sacred Documentation
                    </h3>
                    <p className="text-base md:text-lg text-slate-200 font-serif italic leading-relaxed">
                      {activeTradition.description}
                    </p>
                    
                    {activeTradition.tags && activeTradition.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {activeTradition.tags.map((tag, idx) => (
                          <button 
                            key={`modal-tag-${idx}`} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(tag);
                              setActiveTradition(null);
                            }}
                            className="px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center gap-1.5 hover:bg-amber-500/10 transition-colors"
                          >
                            <Hash className="w-3 h-3 text-amber-500/50" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <Pyramid className="w-4 h-4" />
                      The Three Pillars
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {activeTradition.principles.map((p, i) => (
                        <div key={`modal-principle-${i}`} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-sm shrink-0 group-hover:scale-110 transition-transform">
                            {i + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-200 font-serif leading-relaxed">
                              {p}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-wrap items-center gap-4">
                    {onSelectSchool && (
                      <button 
                        onClick={() => {
                          onSelectSchool(activeTradition.name);
                          setActiveTradition(null);
                        }}
                        className={`flex-1 min-w-[200px] py-3 rounded-xl font-serif text-sm transition-all flex items-center justify-center gap-2 ${
                          activeSchool === activeTradition.name
                            ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold'
                            : 'bg-amber-500 text-black font-bold hover:bg-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {activeSchool === activeTradition.name ? 'Active Selected School' : 'Adopt as Active School'}
                      </button>
                    )}
                    <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-serif text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Broadcast to Aether
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
