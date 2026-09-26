/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Globe, ExternalLink, Bookmark, Copy, Check, 
  Sparkles, Scroll, Layers, ShieldCheck, Database, FileText, Compass,
  BookMarked, Download, Share2, Filter, Star, Flame, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExtensiveLibraryPortalProps {
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
    bgCard: string;
  };
}

interface LibraryItem {
  id: string;
  title: string;
  originalTitle?: string;
  tradition: 'Abrahamic & Enochian' | 'Gnostic & Hermetic' | 'Mesopotamian & ANE' | 'Kabbalistic & Mystical' | 'Eastern & Classical';
  category: 'Canonical' | 'Apocryphal' | 'Gnostic' | 'Hermetic' | 'Mesopotamian' | 'Kabbalistic' | 'Philosophical';
  language: string;
  estimatedDate: string;
  provenance: string;
  externalAccessUrl: string;
  archiveProvider: string;
  summary: string;
  keyPassage: string;
  scholarlyAnalysis: string;
  tags: string[];
}

const EXTENSIVE_LIBRARY_DATABASE: LibraryItem[] = [
  {
    id: '1enoch-apocalypse-weeks',
    title: 'The Book of Enoch (1 Enoch)',
    originalTitle: 'ספר חנוך / 𐎭𐎃𐎜𐎐 (Ge’ez/Aramaic)',
    tradition: 'Abrahamic & Enochian',
    category: 'Apocryphal',
    language: 'Ge’ez, Aramaic fragments (Qumran)',
    estimatedDate: 'c. 300 BCE – 1st Century CE',
    provenance: 'Qumran Caves 4 & 7; Ethiopian Orthodox Tewahedo Canon',
    externalAccessUrl: 'https://archive.org/details/bookofenoch00elli',
    archiveProvider: 'Internet Archive & Leon Levy Dead Sea Scrolls Digital Library',
    summary: 'A foundational apocalyptic text detailing the descent of the Watchers (Grigori), cosmological journeys, astronomical treatises, parables of the Son of Man, and the ten-week historical prophecy.',
    keyPassage: '"Behold, he comes with ten thousands of His holy ones, to execute judgment upon all..." (1 Enoch 1:9)',
    scholarlyAnalysis: 'Crucial for understanding Second Temple angelology, eschatology, and the direct background of New Testament Christology and Judean apocalypticism.',
    tags: ['Prophetic', 'Gnostic', 'Eschatological', 'Angels', 'Apocalypse of Weeks']
  },
  {
    id: 'nag-hammadi-gospel-thomas',
    title: 'The Gospel of Thomas (Nag Hammadi Codex II)',
    originalTitle: 'Πεὐαγγέλιον κατὰ Θωμᾶν (Coptic)',
    tradition: 'Gnostic & Hermetic',
    category: 'Gnostic',
    language: 'Sahidic Coptic (from Greek originals)',
    estimatedDate: 'c. mid-1st to 2nd Century CE',
    provenance: 'Nag Hammadi Library, Egypt (Found 1945, Codex II)',
    externalAccessUrl: 'https://archive.org/details/TheNagHammadiLibraryInEnglish',
    archiveProvider: 'Claremont Coptic Encyclopedia & Internet Archive',
    summary: 'A collection of 114 secret sayings of Jesus recorded by Didymos Judas Thomas, emphasizing inner divine realization, light within the material world, and non-dual spiritual awakening.',
    keyPassage: '"The Kingdom is inside of you, and it is outside of you. When you come to know yourselves, then you will known..." (Saying 3)',
    scholarlyAnalysis: 'Provides primary insight into early Christian Gnosticism and independent sayings traditions running parallel to the canonical synoptic gospels.',
    tags: ['Gnostic', 'Mystical', 'Sayings', 'Inner Light']
  },
  {
    id: 'corpus-hermeticum',
    title: 'Corpus Hermeticum & The Emerald Tablet',
    originalTitle: 'Ἑρμου του Τρισμεγistου Λόγοι (Greek)',
    tradition: 'Gnostic & Hermetic',
    category: 'Hermetic',
    language: 'Greco-Egyptian / Greek & Latin',
    estimatedDate: 'c. 100 – 300 CE',
    provenance: 'Alexandria, Egypt; Renaissance preservation by Marsilio Ficino',
    externalAccessUrl: 'https://archive.org/details/hermeticism0000unse',
    archiveProvider: 'Hermetic Library & Internet Archive',
    summary: 'Dialogues between Hermes Trismegistus and spiritual seekers (such as Asclepius and Tat) exploring the nature of the divine, cosmic creation, the ascent of the soul, and alchemical correspondence.',
    keyPassage: '"That which is Below corresponds to that which is Above, and that which is Above corresponds to that which is Below, to accomplish the miracles of the One Thing." (Tabula Smaragdina)',
    scholarlyAnalysis: 'The foundational philosophical text of Western esotericism, alchemy, and early modern science, bridging Hellenistic philosophy and Egyptian wisdom.',
    tags: ['Hermetic', 'Alchemy', 'Cosmology', 'Initiatory']
  },
  {
    id: 'epic-gilgamesh',
    title: 'The Epic of Gilgamesh & Atrahasis',
    originalTitle: ' شِير غِيلگَمِش (Standard Babylonian Akkadian Cuneiform)',
    tradition: 'Mesopotamian & ANE',
    category: 'Mesopotamian',
    language: 'Akkadian Cuneiform on Clay Tablets',
    estimatedDate: 'c. 2100 – 1200 BCE',
    provenance: 'Library of Ashurbanipal (Nineveh) & Nippur',
    externalAccessUrl: 'https://archive.org/details/epicofgilgamesh0000geor',
    archiveProvider: 'British Library Cuneiform Online & ETCSL',
    summary: 'The epic poem of Uruk’s king Gilgamesh and his quest for immortality following the great deluge account narrated by Utnapishtim.',
    keyPassage: '"Life, which you look for, you will never find. For when the gods created man, they let death be his share, and life withheld in their own hands."',
    scholarlyAnalysis: 'The oldest surviving epic masterpiece of world literature, providing profound comparative mythic context for biblical creation, deluge, and wisdom literature.',
    tags: ['Mesopotamian', 'Deluge', 'Immortality', 'Ancient Near East']
  },
  {
    id: 'zohar-kabbalah',
    title: 'The Zohar (Book of Splendor)',
    originalTitle: 'ספר הזוהר (Aramaic / Hebrew)',
    tradition: 'Kabbalistic & Mystical',
    category: 'Kabbalistic',
    language: 'Medieval Judeo-Aramaic',
    estimatedDate: 'c. 13th Century (Attributed to 2nd Cent. Simeon bar Yochai)',
    provenance: 'Castile & Guadalajara, Spain (Moses de León)',
    externalAccessUrl: 'https://archive.org/details/TheZoharPritzkerEdition',
    archiveProvider: 'Sefaria Digital Library & Internet Archive',
    summary: 'The masterwork of Jewish mysticism and Kabbalah, offering mystical commentary on the Torah through the framework of the Sefirot, divine emanation, light, and the divine feminine (Shechinah).',
    keyPassage: '"In the beginning the King made engravings in the supernal purity... A spark of impenetrable darkness flashed within the concealed of the concealed..."',
    scholarlyAnalysis: 'Revolutionized Jewish esoteric thought and profoundly influenced Christian Kabbalah, Western occultism, and Hasidic philosophy.',
    tags: ['Kabbalah', 'Mystical', 'Sefirot', 'Light']
  },
  {
    id: 'tao-te-ching',
    title: 'Tao Te Ching (道德经)',
    originalTitle: '道德經 (Classical Chinese)',
    tradition: 'Eastern & Classical',
    category: 'Philosophical',
    language: 'Classical Chinese (Mawangdui & Guodian Bamboo Slips)',
    estimatedDate: 'c. 4th Century BCE (Laozi)',
    provenance: 'Warring States Period, China',
    externalAccessUrl: 'https://archive.org/details/taoteching00laoz_3',
    archiveProvider: 'Internet Archive & Chinese Text Project',
    summary: 'The foundational text of Taoism, outlining the nature of the Tao (The Way), effortless action (Wu Wei), balance of Yin and Yang, and harmony with the primordial universe.',
    keyPassage: '"The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name."',
    scholarlyAnalysis: 'A universal classic of mystical philosophy, exploring the paradoxes of existence, silent wisdom, and natural spontaneity.',
    tags: ['Taoism', 'Philosophical', 'Balance', 'Wu Wei']
  },
  {
    id: 'dead-sea-scrolls-community-rule',
    title: 'The Community Rule (1QS - Serekh Ha-Yaḥad)',
    originalTitle: 'סלר היחד (Hebrew Scroll)',
    tradition: 'Abrahamic & Enochian',
    category: 'Canonical',
    language: 'Hebrew (Qumran Cave 1)',
    estimatedDate: 'c. 100 – 75 BCE',
    provenance: 'Qumran Cave 1, Judean Desert',
    externalAccessUrl: 'https://www.deadseascrolls.org.il/',
    archiveProvider: 'Leon Levy Dead Sea Scrolls Digital Library & Israel Antiquities Authority',
    summary: 'The foundational charter and legal code of the Qumran sectarian community, outlining the Two Spirits (Light and Darkness), admission vows, purity laws, and eschatological expectation.',
    keyPassage: '"From the God of Knowledge comes all that is and shall be... He has created man to govern the world and has appointed for him two spirits in which to walk..."',
    scholarlyAnalysis: 'Provides unprecedented direct manuscript evidence of sectarian Judean piety immediately preceding the birth of rabbinic Judaism and Christianity.',
    tags: ['Dead Sea Scrolls', 'Sectarian', 'Two Spirits', 'Qumran']
  }
];

export default function ExtensiveLibraryPortal({ activeTheme }: ExtensiveLibraryPortalProps) {
  const [selectedTradition, setSelectedTradition] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(EXTENSIVE_LIBRARY_DATABASE[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'external-archives'>('catalog');

  const traditions = ['all', 'Abrahamic & Enochian', 'Gnostic & Hermetic', 'Mesopotamian & ANE', 'Kabbalistic & Mystical', 'Eastern & Classical'];
  const categories = ['all', 'Canonical', 'Apocryphal', 'Gnostic', 'Hermetic', 'Mesopotamian', 'Kabbalistic', 'Philosophical'];

  const filteredItems = useMemo(() => {
    return EXTENSIVE_LIBRARY_DATABASE.filter(item => {
      const matchTradition = selectedTradition === 'all' || item.tradition === selectedTradition;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.provenance.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTradition && matchCategory && matchQuery;
    });
  }, [selectedTradition, selectedCategory, searchQuery]);

  const handleCopyCitation = (item: LibraryItem) => {
    const citation = `"${item.title}" (${item.estimatedDate}). Provenance: ${item.provenance}. Archive: ${item.externalAccessUrl}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 md:p-6 text-slate-100">
      {/* Header Banner */}
      <div className={`p-8 rounded-3xl border border-violet-900/40 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/40 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/30 text-violet-300 text-xs font-mono mb-3 w-fit">
              <Scroll className="w-3.5 h-3.5 text-violet-400" />
              <span>Universal Scriptural & Esoteric Library Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 tracking-tight">
              The Great Library of Alexandria & Qumran
            </h1>
            <p className="text-sm font-serif text-slate-300 mt-2 max-w-2xl leading-relaxed">
              An extensive multi-corpus library containing foundational religious scriptures, apocryphal texts, Gnostic codices, Mesopotamian archives, and Kabbalistic treatises with direct external repository access.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('external-archives')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 transition-all ${
                activeTab === 'external-archives'
                  ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>External Archives</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-6">
          {/* Filters & Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search across titles, summaries, provenance, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>
            <div>
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500 transition-all"
              >
                <option value="all">All Traditions ({traditions.length - 1})</option>
                {traditions.filter(t => t !== 'all').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500 transition-all"
              >
                <option value="all">All Categories ({categories.length - 1})</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Catalog Grid & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-2">
              {filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 ${
                      isSelected
                        ? 'border-violet-500/80 bg-violet-950/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{item.estimatedDate}</span>
                    </div>
                    <h3 className="text-sm font-serif font-bold text-slate-100">{item.title}</h3>
                    <p className="text-xs font-serif text-slate-400 line-clamp-2">{item.summary}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-xs font-mono text-slate-500">
                  No literary records found matching your filters.
                </div>
              )}
            </div>

            {/* Detailed Inspector */}
            <div className="lg:col-span-7">
              {selectedItem ? (
                <div className="p-6 rounded-2xl border border-violet-900/40 bg-slate-950/90 shadow-2xl space-y-6 sticky top-6">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-300">
                          {selectedItem.tradition}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{selectedItem.language}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-100">{selectedItem.title}</h2>
                      {selectedItem.originalTitle && (
                        <p className="text-xs font-mono text-violet-400 mt-1">{selectedItem.originalTitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCitation(selectedItem)}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-all"
                        title="Copy Citation"
                      >
                        {copiedId === selectedItem.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={selectedItem.externalAccessUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-violet-500/40 bg-violet-950/40 text-violet-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
                        title="Open External Archive"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-serif text-slate-300 leading-relaxed">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
                      <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Provenance & Discovery</div>
                      <p className="text-slate-200">{selectedItem.provenance}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Overview & Significance</h4>
                      <p>{selectedItem.summary}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                      <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Key Passage / Excerpt</div>
                      <p className="italic text-amber-200">{selectedItem.keyPassage}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">Scholarly Analysis</h4>
                      <p>{selectedItem.scholarlyAnalysis}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>External Archive Host: <strong>{selectedItem.archiveProvider}</strong></span>
                      <a
                        href={selectedItem.externalAccessUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-400 hover:underline flex items-center gap-1"
                      >
                        Access Repository <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 text-slate-500 font-mono text-xs">
                  Select a literary record to inspect its contents and provenance.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* External Archives Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-300">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-amber-100">Internet Archive (Archive.org)</h3>
              <p className="text-xs font-serif text-slate-300">
                Universal digital library of historical religious texts, scanned manuscripts, early translations, and theological monographs.
              </p>
              <a
                href="https://archive.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 hover:underline pt-2"
              >
                Open Internet Archive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Scroll className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-amber-100">Leon Levy Dead Sea Scrolls Library</h3>
              <p className="text-xs font-serif text-slate-300">
                High-resolution multispectral imaging of biblical and sectarian scrolls maintained by the Israel Antiquities Authority.
              </p>
              <a
                href="https://www.deadseascrolls.org.il/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:underline pt-2"
              >
                Open Qumran Digital Library <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-amber-100">Sefaria Open Jewish Texts</h3>
              <p className="text-xs font-serif text-slate-300">
                Living library of Jewish texts and source sheets including Tanakh, Talmud, Midrash, Zohar, and Kabbalistic commentaries.
              </p>
              <a
                href="https://www.sefaria.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:underline pt-2"
              >
                Open Sefaria Library <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
