import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Sparkles, BookOpen, Scroll, ShieldCheck, Award, 
  Check, Copy, RotateCcw, FileText, ChevronRight, Info, Scale,
  Layers, Compass, Flame, Heart, HeartHandshake, CheckCircle2
} from 'lucide-react';

interface MelchizedekScholarshipProps {
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

interface PrimarySource {
  id: string;
  title: string;
  origin: string;
  era: string;
  hebrewOrGreek: string;
  translatedText: string;
  keyVerse: string;
  analysis: string;
  significance: string;
  keywords: string[];
}

const PRIMARY_SOURCES: PrimarySource[] = [
  {
    id: '11q13',
    title: '11Q13 (11QMelchizedek - Qumran Scroll)',
    origin: 'Dead Sea Scrolls (Cave 11, Qumran)',
    era: 'c. 100 BCE - 50 CE',
    hebrewOrGreek: 'אלהים יתייצב בעדת אל בקרב אלהים ישפוט... ומלכי צדק ישיב להמה את דרורם... וקרא להמה דרור לשלחם ולכפר על עונותיהם',
    translatedText: 'Elohim stands in the assembly of God; in the midst of gods He executes judgment... and Melchizedek shall release them from their debts, proclaiming liberty to the captives and atoning for their sins during the tenth Jubilee...',
    keyVerse: '11Q13 Column 2, Lines 9–11',
    analysis: 'In 11Q13, Melchizedek is portrayed as a heavenly, divine figure ("Elohim") who presides over cosmic judgment, defeats the dark army of Belial, and executes the divine Jubilee remission of spiritual debts and sins.',
    significance: 'Bridges Jewish apocalyptic eschatology with high messianic Christology, establishing Melchizedek as the celestial High Priest and Divine Deliverer.',
    keywords: ['11Q13', 'Tenth Jubilee', 'Elohim', 'Remission of Debt', 'Heavenly High Priest']
  },
  {
    id: 'genesis-14',
    title: 'Genesis 14:18–20 (The Encounter at Salem)',
    origin: 'Hebrew Torah (Genesis)',
    era: 'c. 1500–1000 BCE (Ancient Hebrew Tradition)',
    hebrewOrGreek: 'וּמַלְכִּי־צֶדֶק מֶלֶךְ שָׁלֵם הוֹצִיא לֶחֶם וָיָיִן וְהוּא כֹהֵן לְאֵל עֶלְיוֹן',
    translatedText: 'Then Melchizedek king of Salem brought out bread and wine. He was priest of God Most High (El Elyon). And he blessed Abram... and Abram gave him a tenth of everything.',
    keyVerse: 'Genesis 14:18–20',
    analysis: 'Melchizedek appears as King of Salem (Peace/Jerusalem) and Priest of El Elyon (God Most High). He offers bread and wine—a sacred sacramental act—and receives Abram\'s tithe, proving his higher priesthood.',
    significance: 'Establishes the primordial priesthood of El Elyon prior to Mount Sinai and the Levitical order.',
    keywords: ['Genesis 14', 'El Elyon', 'King of Salem', 'Bread and Wine', 'Abram Tithe']
  },
  {
    id: 'psalm-110',
    title: 'Psalm 110:4 (The Royal Divine Oath)',
    origin: 'Hebrew Tanakh (Tehillim / Psalms)',
    era: 'c. 1000 BCE (Davidic Psalms)',
    hebrewOrGreek: 'נִשְׁבַּע יְהוָה וְלֹא יִנָּחֵם אַתָּה־כֹהֵן לְעוֹלָם עַל־דִּבְרָתִי מַלְכִּי־צֶדֶק',
    translatedText: 'The LORD has sworn and will not change his mind: "You are a priest forever, in the order of Melchizedek."',
    keyVerse: 'Psalm 110:4',
    analysis: 'An irrevocable divine oath ("Nishba YHWH") uniting royal Davidic kingship with the eternal priesthood of Melchizedek.',
    significance: 'Serves as the foundation for New Testament Messianic priesthood arguments in Hebrews.',
    keywords: ['Psalm 110', 'Priest Forever', 'Divine Oath', 'Order of Melchizedek']
  },
  {
    id: 'hebrews-7',
    title: 'Hebrews 7:1–3 (Apator, Ametor, Agenealogetos)',
    origin: 'New Testament Epistle to the Hebrews',
    era: 'c. 64–68 CE',
    hebrewOrGreek: 'ἀπάτωρ, ἀμήτωρ, ἀγενεαλόγητος, μήτε ἀρχὴν ἡμερῶν μήτε ζωῆς τέλος ἔχων...',
    translatedText: 'Without father or mother, without genealogy, without beginning of days or end of life, resembling the Son of God, he remains a priest forever.',
    keyVerse: 'Hebrews 7:3',
    analysis: 'Detailed theological exposition of Melchizedek\'s name ("King of Righteousness") and title ("King of Peace"). His unrecorded lineage symbolizes an uncreated, eternal, indestructible priesthood.',
    significance: 'Proves the Melchizedekian priesthood is superior to the Aaronic priesthood because Levi tithed to Melchizedek while still in Abraham\'s loins.',
    keywords: ['Hebrews 7', 'Apator', 'Ametor', 'King of Righteousness', 'King of Peace']
  },
  {
    id: '2-enoch',
    title: '2 Enoch 71–72 (The Miraculous Birth & Elevation to Eden)',
    origin: 'Slavonic Enoch & Jewish Pseudepigrapha',
    era: 'c. 1st Century CE',
    hebrewOrGreek: 'И родися отголе отрокъ, седя на одре, и бе имая знамение священства...',
    translatedText: 'And the child Melchizedek came forth with the badge of priesthood on his chest... Archangel Michael took him and placed him in Paradise in Eden to preserve the primordial priesthood through Noah\'s Deluge.',
    keyVerse: '2 Enoch 71:28–29',
    analysis: 'Describes Melchizedek born to Sofonim (wife of Nir, Noah\'s brother) with the divine seal of priesthood. He is spirited away by Archangel Michael to Eden so that the holy priesthood remains untouched by the Flood.',
    significance: 'Preserves the esoteric tradition of an unblemished cosmic line of priesthood pre-dating all earthly temples.',
    keywords: ['2 Enoch', 'Archangel Michael', 'Eden', 'Priestly Seal', 'Deluge']
  }
];

export default function MelchizedekScholarship({ activeTheme }: MelchizedekScholarshipProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('11q13');
  const [activeTab, setActiveTab] = useState<'sources' | 'comparison' | 'jubilee' | 'application'>('sources');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Jubilee Calculator State
  const [jubileeCycle, setJubileeCycle] = useState<number>(10);
  const [spiritualDebtUnit, setSpiritualDebtUnit] = useState<number>(77);
  const [seekerIntent, setSeekerIntent] = useState<string>('Seeking freedom from karmic burdens & consecration to the Order of Melchizedek');

  // Application / Oath state
  const [scholarName, setScholarName] = useState<string>('Seeker of Salem');
  const [scholarEmail, setScholarEmail] = useState<string>('');
  const [vowAccepted, setVowAccepted] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const currentSource = useMemo(() => {
    return PRIMARY_SOURCES.find(s => s.id === selectedSourceId) || PRIMARY_SOURCES[0];
  }, [selectedSourceId]);

  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) return PRIMARY_SOURCES;
    const q = searchQuery.toLowerCase();
    return PRIMARY_SOURCES.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.translatedText.toLowerCase().includes(q) || 
      s.analysis.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCopyQuote = () => {
    const textToCopy = `"Elohim stands in the assembly of God; in the midst of gods He executes judgment... and Melchizedek shall release them from their debts, proclaiming liberty to the captives and atoning for their sins during the tenth Jubilee" — 11Q13 (11QMelchizedek Dead Sea Scroll)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const calculateRemission = useMemo(() => {
    const totalJubileeYears = jubileeCycle * 49;
    const debtRemitted = Math.min(100, (spiritualDebtUnit * (jubileeCycle / 10)) * 1.25);
    const freedomIndex = debtRemitted > 85 ? 'Total Absolute Remission (Eis To Panteles)' : 'Progressive Purification';
    return {
      totalJubileeYears,
      debtRemittedPercentage: Math.round(debtRemitted),
      freedomIndex
    };
  }, [jubileeCycle, spiritualDebtUnit]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>ORDER OF EL ELYON • HIGH PRIESTHOOD SCHOLARSHIP</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-200 tracking-wide flex items-center gap-3">
              Melchizedekian Priesthood Scholarship
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              Critical academic & esoteric portal investigating <span className="text-amber-300 font-semibold font-serif">Melchizedek (Malki-Tzedek)</span>: King of Salem, Heavenly Redeemer of 11Q13, Priest of God Most High, and High Priest of the Tenth Jubilee.
            </p>
          </div>

          <button
            onClick={handleCopyQuote}
            type="button"
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-amber-500/10"
          >
            {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedQuote ? 'Quote Copied!' : 'Copy 11Q13 Primary Citation'}</span>
          </button>
        </div>

        {/* Featured Key Quotation Box */}
        <div className="mt-6 p-4 rounded-xl bg-black/60 border border-amber-500/30 text-xs md:text-sm text-amber-100/90 font-serif leading-relaxed italic relative">
          <div className="absolute left-3 top-2 text-2xl text-amber-500/30 font-serif">“</div>
          <p className="pl-5 pr-2 pt-1 font-mono text-amber-200/90 text-xs leading-relaxed">
            "Elohim stands in the assembly of God; in the midst of gods He executes judgment... and Melchizedek shall release them from their debts, proclaiming liberty to the captives and atoning for their sins during the tenth Jubilee"
          </p>
          <div className="text-right text-[11px] font-mono text-amber-400/80 mt-2 not-italic">
            — 11Q13 (11QMelchizedek Fragment, Qumran Cave 11 • c. 100 BCE)
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-500/20 pb-2">
        <button
          onClick={() => setActiveTab('sources')}
          type="button"
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sources'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Primary Textual Sources</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          type="button"
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'comparison'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Melchizedekian vs Levitical Order</span>
        </button>

        <button
          onClick={() => setActiveTab('jubilee')}
          type="button"
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'jubilee'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>10th Jubilee Debt Release Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('application')}
          type="button"
          className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'application'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Order Consecration Application</span>
        </button>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Source Selection */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-3">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Textual Manuscripts
              </div>
              <input
                type="text"
                placeholder="Search manuscripts, terms, languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-500/50"
              />

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    type="button"
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer space-y-1 ${
                      selectedSourceId === source.id
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-100 shadow-md'
                        : 'bg-black/30 border-white/5 text-slate-300 hover:border-amber-500/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold font-serif">
                      <span className="text-amber-200">{source.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{source.era}</span>
                    </div>
                    <div className="text-[11px] font-sans text-slate-400 line-clamp-1">
                      {source.origin}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Manuscript Detail */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-amber-200">
                    {currentSource.title}
                  </h2>
                  <div className="text-xs font-mono text-amber-400/80 mt-0.5">
                    {currentSource.origin} • {currentSource.era}
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 self-start sm:self-auto">
                  {currentSource.keyVerse}
                </div>
              </div>

              {/* Original Language Quote */}
              <div className="p-4 rounded-lg bg-black/60 border border-amber-500/20 text-center space-y-2">
                <div className="text-xs font-mono text-slate-400">Original Text / Transliteration</div>
                <div className="text-base font-serif text-amber-300 leading-relaxed font-bold tracking-wide dir-rtl">
                  {currentSource.hebrewOrGreek}
                </div>
              </div>

              {/* Translation */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  English Translation
                </div>
                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs md:text-sm font-serif text-amber-100 leading-relaxed italic">
                  "{currentSource.translatedText}"
                </div>
              </div>

              {/* Critical Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Theological Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSource.analysis}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Canonical & Esoteric Significance</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSource.significance}
                  </p>
                </div>
              </div>

              {/* Keywords */}
              <div className="pt-2 flex flex-wrap gap-2">
                {currentSource.keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-amber-200/80">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-amber-200">
              Structural Comparison: Melchizedekian vs. Levitical (Aaronic) Order
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              As articulated in the Dead Sea Scrolls (11Q13) and Epistle to the Hebrews (Hebrews 7), the Melchizedekian priesthood is primordial, royal, and uncreated, superseding the temporary bloodline priesthood of Levi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-amber-500/30 bg-amber-500/10 text-amber-200 font-serif">
                  <th className="p-3">Attribute</th>
                  <th className="p-3 text-amber-300">Melchizedekian Priesthood (Order of Melchizedek)</th>
                  <th className="p-3 text-slate-400">Levitical / Aaronic Priesthood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-sans text-slate-300">
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-amber-200/90">Lineage & Genealogy</td>
                  <td className="p-3 text-emerald-300">Uncreated; "Apator, Ametor, Agenealogetos" (Without father, mother, or genealogy).</td>
                  <td className="p-3">Strict hereditary bloodline derived from Levi & Aaron.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-amber-200/90">Duration & Nature</td>
                  <td className="p-3 text-emerald-300">Eternal ("Priest Forever"); possesses the power of an indestructible life.</td>
                  <td className="p-3">Temporary; interrupted continuously by physical mortality and death.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-amber-200/90">Sacramental Offering</td>
                  <td className="p-3 text-emerald-300">Bread & Wine (Salem Sacramental Feast) & Cosmic Jubilee Debt Remission.</td>
                  <td className="p-3">Animal sacrifices (bulls and goats) requiring repeated blood cleansing.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-amber-200/90">Dual Crown / Authority</td>
                  <td className="p-3 text-emerald-300">Combined King ("Basileus") and High Priest ("Hiereus") of El Elyon.</td>
                  <td className="p-3">Strictly restricted to priesthood; forbidden from holding royal kingship.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-amber-200/90">Qumran 11Q13 Role</td>
                  <td className="p-3 text-emerald-300">Celestial Redeemer ("Elohim") who defeats Belial & executes the 10th Jubilee.</td>
                  <td className="p-3">Earthly Temple ministers bound to earthly tabernacle rituals.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jubilee Debt Release Engine Tab */}
      {activeTab === 'jubilee' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>10th Jubilee Remission Calculator</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                11Q13 specifies that during the Tenth Jubilee, Melchizedek proclaims total liberty to captives and atones for spiritual debts. Adjust cycles to calculate spiritual debt release.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>Jubilee Cycles (1 Jubilee = 49 Years)</span>
                  <span>{jubileeCycle} Cycles ({jubileeCycle * 49} Yrs)</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={jubileeCycle} 
                  onChange={(e) => setJubileeCycle(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>Initial Spiritual Debt Burden Index</span>
                  <span>{spiritualDebtUnit} / 100</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={spiritualDebtUnit} 
                  onChange={(e) => setSpiritualDebtUnit(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300">Personal Intention / Consecration</label>
                <textarea
                  rows={3}
                  value={seekerIntent}
                  onChange={(e) => setSeekerIntent(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-black/60 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Eschatological Jubilee Calculation Output
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 text-center space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">Total Years Accumulated</div>
                  <div className="text-2xl font-serif font-bold text-amber-300">{calculateRemission.totalJubileeYears} Years</div>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 text-center space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">Spiritual Debt Remitted</div>
                  <div className="text-2xl font-serif font-bold text-emerald-400">{calculateRemission.debtRemittedPercentage}% Cleared</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-mono text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>State of Spiritual Freedom</span>
                </div>
                <p className="text-sm font-serif text-emerald-200">
                  {calculateRemission.freedomIndex}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Melchizedek shall release them from their debts, proclaiming liberty to the captives and atoning for their sins..." Under the 10th Jubilee, your debt is remitted by decree of El Elyon.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 font-mono italic">
              * Note: In 11Q13 theology, spiritual debt remission is not achieved through monetary animal sacrifice, but through divine celestial decree and the eternal high priesthood of Melchizedek.
            </div>
          </div>
        </div>
      )}

      {/* Application / Consecration Tab */}
      {activeTab === 'application' && (
        <div className="p-6 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Consecration to the Order of Melchizedek Scholarship</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Formally apply for the Melchizedekian Priesthood Scholarship to register your commitment to righteousness (Tzedek), peace (Shalem), and the preservation of sacred scripture.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-serif font-bold text-emerald-200">Scholarship Consecration Accepted</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                Welcome, Scholar <span className="text-emerald-300 font-mono font-semibold">{scholarName}</span>. Your pledge to study the Order of Melchizedek, 11Q13, and the eternal priesthood of El Elyon has been registered.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                type="button"
                className="mt-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-mono cursor-pointer transition-all"
              >
                Submit Additional Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300">Scholar Full Name / Title</label>
                <input
                  type="text"
                  required
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300">Contact Email (Optional)</label>
                <input
                  type="email"
                  placeholder="seeker@salem-sanctum.org"
                  value={scholarEmail}
                  onChange={(e) => setScholarEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vow"
                  checked={vowAccepted}
                  onChange={(e) => setVowAccepted(e.target.checked)}
                  className="mt-0.5 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="vow" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  I solemnize my commitment to walk in Righteousness (<span className="text-amber-300 font-serif">Tzedek</span>) and Peace (<span className="text-amber-300 font-serif">Shalem</span>), upholding the eternal priesthood of El Elyon.
                </label>
              </div>

              <button
                type="submit"
                disabled={!vowAccepted}
                className="px-6 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-40 border border-amber-500/40 text-amber-200 font-serif font-bold text-xs cursor-pointer transition-all shadow-lg hover:shadow-amber-500/10"
              >
                Consecrate Scholarship Application
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
