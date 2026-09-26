import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  Scroll, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Crown, 
  ChevronRight, 
  ChevronDown,
  Info, 
  Layers, 
  Loader2, 
  Pyramid, 
  Eye, 
  FileText,
  Clock,
  MapPin,
  TrendingUp,
  Filter,
  ArrowLeftRight,
  X,
  Scale
} from 'lucide-react';
import TypewriterMarkdown from './TypewriterMarkdown';
import VirtualizedList from './VirtualizedList';

interface AnunnakiArchiveProps {
  activeTheme: {
    id: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    bgCard: string;
  };
}

export type DynasticPeriodId =
  | 'all'
  | 'antediluvian'
  | 'early-dynastic-1'
  | 'early-dynastic-2'
  | 'akkadian'
  | 'ur-iii'
  | 'old-babylonian'
  | 'neo-assyrian';

export interface DynasticPeriodOption {
  id: DynasticPeriodId;
  label: string;
  badge: string;
  timeframe: string;
  centuryLabel: string;
}

export const DYNASTIC_PERIODS: DynasticPeriodOption[] = [
  { id: 'all', label: 'All Dynastic Periods', badge: 'All Eras', timeframe: '240,000 BC – 600 BC', centuryLabel: 'All Centuries' },
  { id: 'antediluvian', label: 'Antediluvian Era (Pre-Flood Golden Age)', badge: 'Antediluvian', timeframe: 'c. 241,200 – 20,000 BC', centuryLabel: 'Pre-Flood Golden Age' },
  { id: 'early-dynastic-1', label: 'Early Dynastic I (Kish Dynasty, c. 2900–2700 BC)', badge: 'Early Dynastic I', timeframe: 'c. 2900–2700 BC', centuryLabel: '29th–28th C. BC' },
  { id: 'early-dynastic-2', label: 'Early Dynastic II–III (Uruk & Lagash, c. 2700–2334 BC)', badge: 'Early Dynastic II-III', timeframe: 'c. 2700–2334 BC', centuryLabel: '27th–24th C. BC' },
  { id: 'akkadian', label: 'Akkadian Empire (Sargonid Dynasty, c. 2334–2154 BC)', badge: 'Akkadian Empire', timeframe: 'c. 2334–2154 BC', centuryLabel: '24th–22nd C. BC' },
  { id: 'ur-iii', label: 'Third Dynasty of Ur / Ur III (c. 2112–2004 BC)', badge: 'Ur III Dynasty', timeframe: 'c. 2112–2004 BC', centuryLabel: '22nd–21st C. BC' },
  { id: 'old-babylonian', label: 'Old Babylonian Era (c. 1894–1595 BC)', badge: 'Old Babylonian', timeframe: 'c. 1894–1595 BC', centuryLabel: '19th–16th C. BC' },
  { id: 'neo-assyrian', label: 'Neo-Assyrian / Nineveh Vaults (c. 911–609 BC)', badge: 'Neo-Assyrian', timeframe: 'c. 911–609 BC', centuryLabel: '10th–7th C. BC' }
];

interface KingItem {
  type: 'king';
  id: string;
  name: string;
  cuneiform: string;
  dynasty: string;
  reign: string;
  era: 'antediluvian' | 'post-diluvian';
  dynasticPeriod: DynasticPeriodId;
  details: string;
  esoteric: string;
  yearEstimate: string;
}

interface TabletItem {
  type: 'tablet';
  id: string;
  name: string;
  cuneiform: string;
  dating: string;
  site: string;
  dynasticPeriod: DynasticPeriodId;
  translation: string;
  esoteric: string;
}

type ArchiveItem = KingItem | TabletItem;

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    type: 'king',
    id: 'skl-alulim',
    name: 'Alulim (First King of Eridu)',
    cuneiform: '𒀀𒇻𒅆',
    dynasty: 'Eridu (First Dynasty)',
    reign: '28,800 years (8 sars)',
    era: 'antediluvian',
    dynasticPeriod: 'antediluvian',
    yearEstimate: 'c. 240,000 BC',
    details: 'The inaugural monarch of the Sumerian King List. Alulim is said to have ruled at Eridu, the sacred city founded by the god Enki. He was decreed sovereign by the heavens themselves, initiating the golden pre-flood epoch.',
    esoteric: 'Represents the manifestation of divine cosmic law (An) into earthly form. The 28,800-year reign reflects an astronomical precession of the equinoxes, connecting alchemical cycles with earth-potentials.'
  },
  {
    type: 'king',
    id: 'skl-alalngar',
    name: 'Alalngar of Eridu',
    cuneiform: '𒀀𒆷𒀭𒃲',
    dynasty: 'Eridu (First Dynasty)',
    reign: '36,000 years (10 sars)',
    era: 'antediluvian',
    dynasticPeriod: 'antediluvian',
    yearEstimate: 'c. 211,200 BC',
    details: 'Succeeded Alulim at Eridu, completing the twin foundational alignments of the first dynasty. His reign is historically associated with the crystallization of early agrarian and metal-casting lore.',
    esoteric: 'Corresponds to the alchemical element of Materia. The 10 sars (cycles of 3600 years) of his reign represent completion and the perfect decade, anchoring celestial energy into the Eridu foundation.'
  },
  {
    type: 'king',
    id: 'skl-enmenluana',
    name: 'En-men-lu-ana of Bad-tibira',
    cuneiform: '𒂗𒈨𒂗𒇻𒀭𒈾',
    dynasty: 'Bad-tibira (Metalworking Citadel)',
    reign: '43,200 years (12 sars)',
    era: 'antediluvian',
    dynasticPeriod: 'antediluvian',
    yearEstimate: 'c. 175,200 BC',
    details: 'The longest-reigning monarch in the pre-flood epoch. He ruled from Bad-tibira, literally "Fortress of the Copper-smiths", indicating a vital connection to metallurgical secrets.',
    esoteric: 'Sovereign of the Alchemical fire (Ignis). The 43,200-year cycle matches the sacred mathematical harmonics of the solar clock (432,000), representing the transmutation of base alloys into spiritual gold.'
  },
  {
    type: 'king',
    id: 'skl-enmendurana',
    name: 'En-men-dur-ana of Sippar',
    cuneiform: '𒂗𒈨𒂗𒆳𒀭𒈾',
    dynasty: 'Sippar (Solar Sanctum)',
    reign: '21,000 years (5.8 sars)',
    era: 'antediluvian',
    dynasticPeriod: 'antediluvian',
    yearEstimate: 'c. 132,000 BC',
    details: 'Summoned directly by the gods Shamash (Sun) and Adad (Storm) to learn the secrets of oil divination, liver reading (hepatoscopy), and the stellar patterns. He then shared these cosmic ciphers with the high priests.',
    esoteric: 'The primeval prototype of Enoch. He holds the keys to the Great Wheel of Mysteries, bridging human query with divine patterns. His Sippar solar connection establishes the rules of high celestial geometry.'
  },
  {
    type: 'king',
    id: 'skl-ubartutu',
    name: 'Ubar-Tutu of Shuruppak',
    cuneiform: '',
    dynasty: 'Shuruppak (City of Healing)',
    reign: '18,600 years (5 sars)',
    era: 'antediluvian',
    dynasticPeriod: 'antediluvian',
    yearEstimate: 'c. 45,000 BC',
    details: 'The final antediluvian sovereign before the Great Flood cleansed the material plane. He is the father of Ziusudra, who built the mighty ark of survival under Enki\'s specific coordinates.',
    esoteric: 'Represents the twilight phase of the First Great Cycle. His reign presided over the contraction and friction phase of the material world, preparing the planetary grid for its great baptismal cleansing.'
  },
  {
    type: 'king',
    id: 'skl-jushur',
    name: 'Jushur of Kish',
    cuneiform: '𒄑 जूसूर',
    dynasty: 'Kish (First Post-Diluvian Dynasty)',
    reign: '1,200 years',
    era: 'post-diluvian',
    dynasticPeriod: 'early-dynastic-1',
    yearEstimate: 'c. 2900 BC',
    details: 'First king to rule after the Great Deluge swept over the land. The Sumerian King List declares: "After the flood had swept over, and kingship had descended from heaven, the kingship was in Kish."',
    esoteric: 'Symbolizes the rebirth of structure in the post-cataclysmic world. The drastic drop in reign duration from antediluvian sars to hundreds of years represents the crystallization of mortal timelines and the anchoring of human consciousness.'
  },
  {
    type: 'king',
    id: 'skl-etana',
    name: 'Etana, the Shepherd of Kish',
    cuneiform: '𒀭𒂊താ𒈾',
    dynasty: 'Kish (First Post-Diluvian Dynasty)',
    reign: '1,500 years',
    era: 'post-diluvian',
    dynasticPeriod: 'early-dynastic-1',
    yearEstimate: 'c. 2800 BC',
    details: 'Described as "the shepherd, who ascended to heaven and consolidated all foreign lands". He rode on the back of a giant eagle to the heavenly gates of Anu to retrieve the Plant of Birth, solving his succession crisis.',
    esoteric: 'The ultimate alchemical seeker of flight and ascension. His eagle-ride symbolizes the intellect (Aer) elevating the base body (Materia) to the ethereal high realms, unlocking the generative elixir.'
  },
  {
    type: 'king',
    id: 'skl-enmerkar',
    name: 'Enmerkar of Uruk',
    cuneiform: '𒂗𒈨𒅕𒃸',
    dynasty: 'Uruk (First Dynasty of Uruk)',
    reign: '420 years',
    era: 'post-diluvian',
    dynasticPeriod: 'early-dynastic-2',
    yearEstimate: 'c. 2700 BC',
    details: 'The legendary founder of Uruk who built its magnificent high-walls. He is central to the epic "Enmerkar and the Lord of Aratta", where he requests lapis lazuli and gold from a foreign land to expand the temple of Enki.',
    esoteric: 'Associated with the early dispersion of languages and cosmic conduit design. His construction of Uruk\'s temples represents the containment of the divine breath (Spiritus) within geometric structures.'
  },
  {
    type: 'king',
    id: 'skl-gilgamesh',
    name: 'Gilgamesh of Uruk',
    cuneiform: '𒀭𒄑𒂆𒈦',
    dynasty: 'Uruk (First Dynasty of Uruk)',
    reign: '126 years',
    era: 'post-diluvian',
    dynasticPeriod: 'early-dynastic-2',
    yearEstimate: 'c. 2600 BC',
    details: 'The famous hero-king, described as two-thirds divine and one-third mortal. He traversed the mountains of Mashu to locate Utnapishtim (the immortal flood survivor) in search of the secret to eternal physical life.',
    esoteric: 'The spiritual hero\'s path. His journey through the twelve gates of the sun represents the twelve zodiacal transformations of the soul, discovering that true immortality is achieved through legacy and wisdom.'
  },
  {
    type: 'king',
    id: 'skl-sargon',
    name: 'Sargon of Akkad (Sargon the Great)',
    cuneiform: '𒊬𒊒𒄀',
    dynasty: 'Akkadian Empire',
    reign: '56 years',
    era: 'post-diluvian',
    dynasticPeriod: 'akkadian',
    yearEstimate: 'c. 2334 BC',
    details: 'The legendary founder of the Akkadian Empire, the world\'s first multi-national empire. Raised as a cupbearer in Kish, he was favored by the goddess Ishtar to unite Sumer and Akkad under a single imperial scepter.',
    esoteric: 'The solar conqueror (Sol) rising from aquatic chaos. His early rescue from a reed basket on the Euphrates mirrors the archetypal descent and rebirth of the enlightened monarch.'
  },
  {
    type: 'king',
    id: 'skl-ur-nammu',
    name: 'Ur-Nammu of Ur (Third Dynasty of Ur)',
    cuneiform: '𒀭𒋀',
    dynasty: 'Third Dynasty of Ur (Ur III)',
    reign: '18 years',
    era: 'post-diluvian',
    dynasticPeriod: 'ur-iii',
    yearEstimate: 'c. 2112 BC',
    details: 'Founder of the Third Dynasty of Ur who initiated the glorious Sumerian Renaissance. He codified the Law Code of Ur-Nammu, the oldest known legal code in human history, and ordered the construction of the Great Ziggurat of Ur.',
    esoteric: 'The master architect and cosmic legislator. The construction of the Great Ziggurat created a stepped cosmic axis (Axis Mundi) bridging mortal earth with the lunar domain of Nanna.'
  },
  {
    type: 'tablet',
    id: 'tab-destinies',
    name: 'The Tablet of Destinies (Tup Shimati)',
    cuneiform: '𒀭𒁾𒉆𒈨𒌍',
    dating: 'Antediluvian Cosmic Era',
    site: 'Sippar Underground Vaults',
    dynasticPeriod: 'antediluvian',
    translation: '"Whosoever holds this sacred clay commands the cosmos. The pathways of the gods, the orbits of the stars, and the breaths of mortal men are sealed upon its face. It is the absolute blueprint of what is and what shall ever be."',
    esoteric: 'The cosmic source code. It represents the uncollapsed wave function of the universe. Accessing this tablet in ritual meditation aligns the seeker with the sovereign Will, collapsing destiny into desired alchemical outcomes.'
  },
  {
    type: 'tablet',
    id: 'tab-atrahasis',
    name: 'The Atrahasis Epic (Tablet III)',
    cuneiform: '𒀜ρας',
    dating: 'c. 1650 BC',
    site: 'Library of Ashurbanipal, Nineveh',
    dynasticPeriod: 'old-babylonian',
    translation: '"Build an ark, a vessel of reeds, and let its measurements be equal. Solder it with bitumen, and lead inside the seed of all living things. When the storm-god rides, seal the gate, and survive the great cleansing wave."',
    esoteric: 'The alchemical baptism. The flood represents the complete dissolution (Aqua) of base patterns, while the ark serves as the sealed vessel (Athanor) keeping the spiritual gold (the seed) safe during transmutation.'
  },
  {
    type: 'tablet',
    id: 'tab-enuma',
    name: 'Enuma Elish (First Creation Tablet)',
    cuneiform: '𒂊𒉡𒈠𒂊𒇺',
    dating: 'c. 1100 BC',
    site: 'Sultantepe excavation sites',
    dynasticPeriod: 'neo-assyrian',
    translation: '"When on high the heavens were not named, and the earth below did not yet bear a name; when the primeval Apsu, who begot them, and chaos Tiamat, the mother of them all, mingled their waters together..."',
    esoteric: 'The Great Void or Ungrund (Jacob Boehme). The mingling of Apsu (divine solar light) and Tiamat (primordial aquatic chaos) represents the original binary tension from which all subsequent elements emerge.'
  },
  {
    type: 'tablet',
    id: 'tab-kesh',
    name: 'The Kesh Temple Hymn',
    cuneiform: '𒂍𒆧𒆠',
    dating: 'c. 2600 BC',
    site: 'Adab (Modern Bismaya)',
    dynasticPeriod: 'early-dynastic-2',
    translation: '"The Temple of Kesh, rising like a mighty mountain, shining with pure celestial brilliance. Inside, the divine rules (the Me) are kept secure. The gods walk its floors, and the light of heaven shines forever on its stones."',
    esoteric: 'The architecture of resonance. The Temple of Kesh represents the perfect geometric containment of cosmic forces. Just as Jerry Salazar\'s 112" antenna maximizes resonance, the temple walls maximized the connection to celestial wavelengths.'
  },
  {
    type: 'king',
    id: 'skl-hammurabi',
    name: 'Hammurabi of Babylon',
    cuneiform: '𒄩𒄠𒈬𒊏𒁉',
    dynasty: 'First Dynasty of Babylon',
    reign: '43 years',
    era: 'post-diluvian',
    dynasticPeriod: 'old-babylonian',
    yearEstimate: 'c. 1792 BC',
    details: 'The sixth king of the First Babylonian Dynasty who united Mesopotamia. He promulgated the famous Law Code of Hammurabi on a diorite stele, establishing divine justice bestowed directly by Shamash the Sun God.',
    esoteric: 'The solar lawgiver. The 282 laws represent the cosmic balance of cause and effect (Karma) translated into earthly social contracts.'
  },
  {
    type: 'king',
    id: 'skl-ashurbanipal',
    name: 'Ashurbanipal of Nineveh',
    cuneiform: '𒀸𒋩𒆕𒀀',
    dynasty: 'Neo-Assyrian Dynasty',
    reign: '38 years',
    era: 'post-diluvian',
    dynasticPeriod: 'neo-assyrian',
    yearEstimate: 'c. 668 BC',
    details: 'The last great monarch of Neo-Assyria who gathered the vast Royal Library of Nineveh, saving thousands of Sumerian, Akkadian, and Babylonian cuneiform tablets from oblivion.',
    esoteric: 'The Great Archivist of the Akashic Record. His preservation of antediluvian and post-diluvian lore allowed ancient cosmic ciphers to survive into modern consciousness.'
  },
  {
    type: 'tablet',
    id: 'tab-kish',
    name: 'The Kish Tablet (Earliest Cuneiform)',
    cuneiform: '𒆧 𒁾',
    dating: 'c. 3500 BC',
    site: 'Tell al-Uhaymir (Ancient Kish)',
    dynasticPeriod: 'early-dynastic-1',
    translation: '"First markings of pictographic script upon limestone. Here human thought crystallizes into persistent material record, bridging breath with permanent stone."',
    esoteric: 'The dawn of written logos. The transition from oral vibration (Pneuma) to fixed geometric glyphs (Materia).'
  },
  {
    type: 'tablet',
    id: 'tab-naram-sin',
    name: 'Victory Stele of Naram-Sin',
    cuneiform: '𒊏𒄠𒀭',
    dating: 'c. 2250 BC',
    site: 'Sippar / Susa Vaults',
    dynasticPeriod: 'akkadian',
    translation: '"Naram-Sin, mighty king of Akkad, ascends the sacred mountain wearing the horned helmet of divinity under the three shining solar stars of heaven."',
    esoteric: 'The deification of mortal monarchic consciousness. Ascending the mountain represents the elevation of ego toward divine solar illumination.'
  },
  {
    type: 'tablet',
    id: 'tab-code-ur-nammu',
    name: 'Law Code Tablet of Ur-Nammu',
    cuneiform: '𒀭𒋀 𒁾',
    dating: 'c. 2100 BC',
    site: 'Nippur Sacred Libraries',
    dynasticPeriod: 'ur-iii',
    translation: '"If a man commits a crime, he shall pay compensation in silver. Thus Ur-Nammu established equity in the land, eliminated oppression, and ensured the weak were guarded against the strong."',
    esoteric: 'Alchemical silver weight as spiritual calibration. Equating justice to precise metallic weight anchors cosmic order (Ma\'at/Me) into monetary harmony.'
  }
];

export default function AnunnakiArchive({ activeTheme }: AnunnakiArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<'all' | 'antediluvian' | 'post-diluvian' | 'tablets'>('all');
  const [selectedDynasticPeriod, setSelectedDynasticPeriod] = useState<DynasticPeriodId>('all');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(ARCHIVE_ITEMS[0]);
  
  // AI Decipherer State
  const [deciphering, setDeciphering] = useState(false);
  const [decipheredOutput, setDecipheredOutput] = useState<string | null>(null);

  // Compare Eras Modal State
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparePeriodA, setComparePeriodA] = useState<DynasticPeriodId>('antediluvian');
  const [comparePeriodB, setComparePeriodB] = useState<DynasticPeriodId>('akkadian');
  const [isComparingAI, setIsComparingAI] = useState(false);
  const [compareAISynthesis, setCompareAISynthesis] = useState<string | null>(null);

  const handleCompareAI = async () => {
    setIsComparingAI(true);
    setCompareAISynthesis(null);

    const pA = DYNASTIC_PERIODS.find(p => p.id === comparePeriodA);
    const pB = DYNASTIC_PERIODS.find(p => p.id === comparePeriodB);

    const periodAKings = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === comparePeriodA && i.type === 'king');
    const periodATablets = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === comparePeriodA && i.type === 'tablet');
    const periodBKings = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === comparePeriodB && i.type === 'king');
    const periodBTablets = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === comparePeriodB && i.type === 'tablet');

    const promptMessage = `Provide an in-depth comparative esoteric breakdown contrasting the Sumerian/Mesopotamian Era A: "${pA?.label}" with Era B: "${pB?.label}".
Era A Key Kings: ${periodAKings.map(k => k.name).join(', ') || 'N/A'}. Key Tablets: ${periodATablets.map(t => t.name).join(', ') || 'N/A'}.
Era B Key Kings: ${periodBKings.map(k => k.name).join(', ') || 'N/A'}. Key Tablets: ${periodBTablets.map(t => t.name).join(', ') || 'N/A'}.

Synthesize:
1. Longevity & Temporal Dynamics (e.g., Sars/pre-flood astronomical lifespans vs mortal imperial reigns).
2. Shift in Divine Kingship & Priestly/Legal Authority (e.g., Anunnaki direct decrees vs imperial laws/stelae).
3. Metaphysical & Alchemical Transformation (evolution of human consciousness and cuneiform codification between these eras).
4. Zodiacal & Celestial Correspondences.`;

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: promptMessage,
          school: 'Anunnaki Comparative Chronology & Esoteric Epigraphy',
          zodiacSign: 'Scorpio'
        })
      });

      if (!response.ok) {
        throw new Error('Aetheric link disconnected');
      }

      const data = await response.json();
      setCompareAISynthesis(data.answer);
    } catch (err) {
      console.error('Error generating comparison:', err);
      setCompareAISynthesis(`### COMPARATIVE CHRONOLOGICAL SYNTHESIS\n\n**Eras:** ${pA?.badge} vs. ${pB?.badge}\n\n* **Temporal Dynamics:** The transition from **${pA?.badge}** to **${pB?.badge}** mirrors the stepped condensation of cosmic energy (Spiritus) into dense material codification (Materia).\n* **Monarchic Lineage:** Pre-flood and early dynastic sars represented astronomical precession constants (28,800 years), whereas later imperial dynasties (Akkadian, Ur III, Babylonian) anchored divine authority into codified legal stelae and centralized urban statecraft.\n* **Alchemical Lesson:** True mastery requires balancing the vast pre-flood cosmic connection with the structured order of post-flood law.`);
    } finally {
      setIsComparingAI(false);
    }
  };

  // Computed values for Chronological Slider
  const currentPeriodIndex = useMemo(() => {
    const idx = DYNASTIC_PERIODS.findIndex(p => p.id === selectedDynasticPeriod);
    return idx >= 0 ? idx : 0;
  }, [selectedDynasticPeriod]);

  const currentPeriodObj = useMemo(() => {
    return DYNASTIC_PERIODS[currentPeriodIndex] || DYNASTIC_PERIODS[0];
  }, [currentPeriodIndex]);

  // Filter items based on query, selected era, and selected dynastic period
  const filteredItems = useMemo(() => {
    return ARCHIVE_ITEMS.filter(item => {
      // Filter by era/type tab
      if (selectedEra === 'antediluvian' && (item.type !== 'king' || item.era !== 'antediluvian')) return false;
      if (selectedEra === 'post-diluvian' && (item.type !== 'king' || item.era !== 'post-diluvian')) return false;
      if (selectedEra === 'tablets' && item.type !== 'tablet') return false;

      // Filter by dynastic period
      if (selectedDynasticPeriod !== 'all' && item.dynasticPeriod !== selectedDynasticPeriod) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.cuneiform.includes(q) ||
        item.esoteric.toLowerCase().includes(q) ||
        (item.type === 'king' && (
          item.dynasty.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q) ||
          item.reign.toLowerCase().includes(q)
        )) ||
        (item.type === 'tablet' && (
          item.site.toLowerCase().includes(q) ||
          item.translation.toLowerCase().includes(q) ||
          item.dating.toLowerCase().includes(q)
        ))
      );
    });
  }, [searchQuery, selectedEra, selectedDynasticPeriod]);

  // Auto-select first item in filtered results if current selected item is filtered out
  useEffect(() => {
    if (selectedItem && !filteredItems.some(item => item.id === selectedItem.id)) {
      if (filteredItems.length > 0) {
        setSelectedItem(filteredItems[0]);
      }
    }
  }, [filteredItems, selectedItem]);

  const handleDecipher = async (item: ArchiveItem) => {
    // Bypass for corrupted records (empty cuneiform)
    if (!item.cuneiform || item.cuneiform.trim() === '') {
      setDeciphering(true);
      setDecipheredOutput(null);
      
      // Simulate Aetheric Bypass
      setTimeout(() => {
        setDecipheredOutput(
          `### AETHERIC BYPASS SUCCESSFUL\n\n**System Resonance:** 1st Key Resonating at 432Hz\n\n**Sequence Restored:** The corrupted cuneiform sequence for ${item.name} has been successfully reconstructed via direct resonance.\n\n* **Restored Glyph:** 𒀀𒀭𒃲 (The Divine Anchor)\n* **Archival Note:** By vibrating the 1st Key, the lost historical data was recovered from the subconscious Aetheric layer of the archive.`
        );
        setDeciphering(false);
      }, 1500);
      return;
    }

    setDeciphering(true);
    setDecipheredOutput(null);

    const promptMessage = item.type === 'king' 
      ? `Provide an advanced alchemical and astrological breakdown of the Sumerian King: ${item.name} who ruled for ${item.reign} in ${item.dynasty}. Explain the hidden astronomical significance of this length of time and relate it directly to the esoteric search for the Plant of Birth or eternal life. Ensure it contains a secret prophetic inscription formatted in cuneiform style.`
      : `Provide an advanced alchemical and astrological breakdown of the Clay Tablet: ${item.name} discovered at ${item.site}. Decipher the hidden metaphorical code of this passage: "${item.translation}". Relate it directly to the Tree of Life, Jacob Boehme's 7 qualities, and the Great Wheel of Mysteries.`;

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: promptMessage,
          school: 'Sumerian Alchemical & Anunnaki Archival Scholarship',
          zodiacSign: 'Capricorn'
        })
      });

      if (!response.ok) {
        throw new Error('Aetheric link disconnected');
      }

      const data = await response.json();
      setDecipheredOutput(data.answer);
    } catch (err) {
      console.error('Error deciphering tablet:', err);
      // Failsafe response
      setDecipheredOutput(`### AKASHIC DECRYPTION SUCCESSFUL\n\n**System Resonance:** 112" Tuning Active\n\nWithin the vaults of the Anunnaki Archival Scholarship, the entity **${item.name}** holds a deep astrological frequency.\n\n* **Cuneiform Alignment:** \`${item.cuneiform}\`\n* **Astronomical Core:** The cycles match the precession of equinoxes, where ancient priests divided 432,000 years by the five base alchemical coordinates.\n* **Metaphorical Translation:** You are currently seeking an answer that mirrors the descent of kingship. Anchor your intention (Materia) to the solar current (Ignis) to complete your personal transmutation.`);
    } finally {
      setDeciphering(false);
    }
  };

  return (
    <div id="anunnaki-archive-portal" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-slate-100">
      {/* Sidebar Controls & Results */}
      <div className="lg:col-span-5 flex flex-col gap-4 bg-black/45 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <Pyramid className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-widest text-slate-200">
              Anunnaki Archive
            </h2>
            <p className="text-[10px] font-mono text-slate-400">
              Sumerian King Lists & Cuneiform Tablets
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="anunnaki-search-input"
            type="text"
            placeholder="Search kings, tablets, cuneiform, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-amber-500/50 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 text-xs font-mono px-1 rounded transition-colors"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters & Chronological Timeline Slider */}
        <div className="flex flex-col gap-3">
          {/* Chronological Slider Card */}
          <div className="p-3 bg-gradient-to-r from-black/80 via-[#1a140e] to-black/80 border border-amber-500/30 rounded-xl space-y-2 shadow-lg">
            {/* Header with active timeframe indicator */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold tracking-wide">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>CHRONOLOGICAL CENTURY SLIDER</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-amber-200 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                  {currentPeriodObj.timeframe}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {currentPeriodObj.centuryLabel}
                </span>
              </div>
            </div>

            {/* Slider Range Input */}
            <div className="relative pt-1 pb-1">
              <input
                type="range"
                id="anunnaki-chronological-slider"
                min={0}
                max={DYNASTIC_PERIODS.length - 1}
                step={1}
                value={currentPeriodIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const period = DYNASTIC_PERIODS[idx];
                  if (period) {
                    setSelectedDynasticPeriod(period.id);
                  }
                }}
                className="w-full h-2 bg-black/90 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none border border-amber-500/40 shadow-inner"
              />

              {/* Tick Markers */}
              <div className="flex justify-between text-[9px] font-mono text-slate-500 px-0.5 mt-1 overflow-x-auto">
                {DYNASTIC_PERIODS.map((period, idx) => {
                  const isActive = currentPeriodIndex === idx;
                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => setSelectedDynasticPeriod(period.id)}
                      className={`transition-all cursor-pointer whitespace-nowrap hover:text-amber-300 ${
                        isActive ? 'text-amber-300 font-bold underline decoration-amber-400 decoration-2' : 'text-slate-500'
                      }`}
                      title={`${period.label} (${period.timeframe})`}
                    >
                      {period.id === 'all'
                        ? 'All'
                        : period.id === 'antediluvian'
                        ? '240k BC'
                        : period.id === 'early-dynastic-1'
                        ? '2900 BC'
                        : period.id === 'early-dynastic-2'
                        ? '2700 BC'
                        : period.id === 'akkadian'
                        ? '2334 BC'
                        : period.id === 'ur-iii'
                        ? '2112 BC'
                        : period.id === 'old-babylonian'
                        ? '1894 BC'
                        : '911 BC'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Century & Dynasty Jump Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px] font-mono scrollbar-none">
              <span className="text-slate-500 shrink-0 mr-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400/80" />
                Epoch Jump:
              </span>
              {DYNASTIC_PERIODS.map((period) => {
                const isSelected = selectedDynasticPeriod === period.id;
                return (
                  <button
                    key={`chip-${period.id}`}
                    type="button"
                    onClick={() => setSelectedDynasticPeriod(period.id)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-200 border-amber-500/60 font-bold shadow-sm'
                        : 'bg-black/50 text-slate-400 border-white/5 hover:border-amber-500/40 hover:text-slate-200'
                    }`}
                  >
                    {period.badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Era / Type Tabs */}
          <div className="flex flex-wrap gap-1 bg-black/20 p-1 rounded-xl border border-white/5 text-[10px] font-serif">
            <button
              type="button"
              onClick={() => setSelectedEra('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                selectedEra === 'all' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Archive
            </button>
            <button
              type="button"
              onClick={() => setSelectedEra('antediluvian')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                selectedEra === 'antediluvian' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pre-Flood
            </button>
            <button
              type="button"
              onClick={() => setSelectedEra('post-diluvian')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                selectedEra === 'post-diluvian' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Post-Flood
            </button>
            <button
              type="button"
              onClick={() => setSelectedEra('tablets')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                selectedEra === 'tablets' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clay Tablets
            </button>
          </div>

          {/* Dynastic Period Dropdown Filter & Compare Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400/70 pointer-events-none" />
              <select
                id="anunnaki-dynastic-period-filter"
                value={selectedDynasticPeriod}
                onChange={(e) => setSelectedDynasticPeriod(e.target.value as DynasticPeriodId)}
                className="w-full pl-9 pr-8 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-serif text-slate-200 focus:border-amber-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-amber-500/30"
              >
                {DYNASTIC_PERIODS.map(period => (
                  <option key={period.id} value={period.id} className="bg-slate-900 text-slate-200 py-1">
                    {period.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button"
              id="anunnaki-compare-eras-btn"
              onClick={() => {
                if (selectedDynasticPeriod !== 'all') {
                  setComparePeriodA(selectedDynasticPeriod);
                }
                setIsCompareOpen(true);
              }}
              className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-serif font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all shadow-sm"
              title="Compare two dynastic periods side-by-side"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Compare Eras</span>
            </button>
          </div>

          {selectedDynasticPeriod !== 'all' && (
            <div className="flex items-center justify-between text-[10px] font-mono px-1 text-amber-400/80">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Filtered by Era: {DYNASTIC_PERIODS.find(p => p.id === selectedDynasticPeriod)?.badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDynasticPeriod('all')}
                className="hover:underline text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Reset Era
              </button>
            </div>
          )}
        </div>

        {/* Timeline View / Virtualized List */}
        <div className="w-full">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Scroll className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-serif">No tablet records found in this era</p>
            </div>
          ) : (
            <VirtualizedList
              items={filteredItems}
              estimateItemHeight={64}
              overscan={5}
              gap={8}
              maxHeight="420px"
              keyExtractor={(item) => item.id}
              className="w-full pr-1"
              renderItem={(item) => {
                const isSelected = selectedItem?.id === item.id;
                const periodObj = DYNASTIC_PERIODS.find(p => p.id === item.dynasticPeriod);
                return (
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setDecipheredOutput(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                        : 'bg-black/30 border-white/5 hover:border-white/10 hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'king' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}>
                        {item.type === 'king' ? <Crown className="w-3.5 h-3.5" /> : <Scroll className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-serif font-bold transition-colors ${
                          isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-amber-400'
                        }`}>
                          {item.name}
                        </h4>
                        <p className="text-[9px] font-mono text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{item.type === 'king' ? item.reign : item.dating}</span>
                          {periodObj && periodObj.id !== 'all' && (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-amber-400/80 font-mono text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                {periodObj.badge}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-500 group-hover:text-amber-400/50 transition-colors">
                        {item.cuneiform}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${
                        isSelected ? 'translate-x-1 text-amber-400' : 'group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Main Detailed Clay Tablet View */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {selectedItem ? (
          <motion.div
            key={selectedItem.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 bg-[#14120f]/95 border border-[#4a3b2c]/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl"
          >
            {/* Ancient Clay Engraving Texture and Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#4a3b2c]/30">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-amber-500/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-2.5 h-2.5" />
                  {selectedItem.type === 'king' ? `${selectedItem.yearEstimate} • KING OF THE GODS` : 'TABULAR COGNITION'}
                </span>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  {selectedItem.name}
                </h3>
              </div>

              {/* Huge Cuneiform Stamp */}
              <div className="flex items-center gap-2 bg-[#2d2216]/60 border border-[#c4a070]/25 px-3 py-1.5 rounded-lg text-amber-300 font-mono text-sm self-start sm:self-center">
                <span className="text-[10px] uppercase text-amber-500/70 mr-1.5 tracking-wider font-serif">Stamp:</span>
                {selectedItem.cuneiform}
              </div>
            </div>

            {/* Clay Tablet Simulation Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Epigraphy details */}
              <div className="space-y-4 text-xs font-serif text-slate-300">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <FileText className="w-3 h-3 text-amber-500" />
                    <span>EPIGRAPHIC INSCRIPTION</span>
                  </div>
                  <p className="leading-relaxed text-slate-300 italic">
                    {selectedItem.type === 'king' ? selectedItem.details : selectedItem.translation}
                  </p>
                </div>

                {selectedItem.type === 'king' ? (
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block mb-0.5 uppercase">DYNASTIC ORIGIN</span>
                      <span className="text-amber-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {selectedItem.dynasty}
                      </span>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block mb-0.5 uppercase">REIGN OF LIGHT</span>
                      <span className="text-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {selectedItem.reign}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block mb-0.5 uppercase">DISCOVERY SITE</span>
                      <span className="text-amber-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {selectedItem.site}
                      </span>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-500 block mb-0.5 uppercase">CHRONOLOGICAL AGE</span>
                      <span className="text-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {selectedItem.dating}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Esoteric Commentary */}
              <div className="p-4 rounded-xl bg-[#241c13]/30 border border-[#b48d5b]/10 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                    <Sparkles className="w-3 h-3" />
                    <span>METAPHYSICAL MATRIX</span>
                  </div>
                  <p className="text-xs font-serif text-slate-300 leading-relaxed">
                    {selectedItem.esoteric}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#4a3b2c]/30 mt-4 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>UNIFIED CORRESPONDENCE</span>
                  <div className="flex gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">AN</span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">KI</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ENLI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decipherer Button Trigger */}
            <div className="pt-4 border-t border-[#4a3b2c]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                Query the deep Akashic records for planetary correspondences.
              </span>

              <button
                type="button"
                onClick={() => handleDecipher(selectedItem)}
                disabled={deciphering}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
              >
                {deciphering ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deciphering Cuneiform...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Decipher with Gemini AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Deciphering Output Area */}
            <AnimatePresence>
              {(deciphering || decipheredOutput) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="mt-4 p-5 rounded-xl bg-black/60 border border-amber-500/20 text-xs font-serif relative"
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[8px] font-mono uppercase tracking-widest border border-amber-500/20">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                    <span>Akashic Inscription</span>
                  </div>

                  {deciphering && !decipheredOutput ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                      <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                      <p className="text-amber-300/80 text-[11px] font-mono tracking-wider">
                        TRANSLATING CUNEIFORM RESIDUE...
                      </p>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-[11.5px]">
                      {decipheredOutput && <TypewriterMarkdown content={decipheredOutput} />}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-black/20 border border-white/5 rounded-2xl text-slate-500 font-serif">
            <Scroll className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-sm">Select an artifact to begin tabular transcription</p>
          </div>
        )}
      </div>

      {/* Compare Eras Modal Dialog */}
      <AnimatePresence>
        {isCompareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-6xl max-h-[90vh] bg-[#12100d] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-black/70 border-b border-amber-500/20 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
                      Comparative Dynastic Era Analysis
                      <span className="text-[10px] font-mono font-normal text-amber-400/80 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Side-by-Side
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Compare monarchs, longevity ratios, cuneiform findings, and esoteric alignments across Sumerian epochs
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="anunnaki-close-compare-btn"
                  onClick={() => setIsCompareOpen(false)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Close Comparison"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Bar & Presets */}
              <div className="p-4 bg-[#1a1612] border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                {/* Selectors */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                  {/* Era A */}
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[10px] font-mono uppercase text-amber-400/80 tracking-wider block">
                      Primary Era (A)
                    </label>
                    <select
                      value={comparePeriodA}
                      onChange={(e) => {
                        setComparePeriodA(e.target.value as DynasticPeriodId);
                        setCompareAISynthesis(null);
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-amber-500/30 rounded-xl text-xs font-serif text-amber-200 focus:border-amber-400 outline-none cursor-pointer"
                    >
                      {DYNASTIC_PERIODS.filter(p => p.id !== 'all').map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const temp = comparePeriodA;
                      setComparePeriodA(comparePeriodB);
                      setComparePeriodB(temp);
                      setCompareAISynthesis(null);
                    }}
                    className="mt-4 sm:mt-5 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:rotate-180 transition-all cursor-pointer shrink-0"
                    title="Swap Era A and Era B"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>

                  {/* Era B */}
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-[10px] font-mono uppercase text-sky-400/80 tracking-wider block">
                      Secondary Era (B)
                    </label>
                    <select
                      value={comparePeriodB}
                      onChange={(e) => {
                        setComparePeriodB(e.target.value as DynasticPeriodId);
                        setCompareAISynthesis(null);
                      }}
                      className="w-full px-3 py-2 bg-black/50 border border-sky-500/30 rounded-xl text-xs font-serif text-sky-200 focus:border-sky-400 outline-none cursor-pointer"
                    >
                      {DYNASTIC_PERIODS.filter(p => p.id !== 'all').map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preset Era Combinations */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono shrink-0">
                  <span className="text-slate-500 mr-1">Quick Comparisons:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setComparePeriodA('antediluvian');
                      setComparePeriodB('early-dynastic-1');
                      setCompareAISynthesis(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-black/40 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Pre-Flood vs ED-I
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComparePeriodA('early-dynastic-2');
                      setComparePeriodB('akkadian');
                      setCompareAISynthesis(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-black/40 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Uruk vs Akkadian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComparePeriodA('ur-iii');
                      setComparePeriodB('old-babylonian');
                      setCompareAISynthesis(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-black/40 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Ur III vs Babylonian
                  </button>
                </div>
              </div>

              {/* Scrollable Comparison Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-180px)]">
                {/* Side-by-Side Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-amber-500/30 via-white/10 to-transparent pointer-events-none" />

                  {[
                    { periodId: comparePeriodA, labelTag: 'ERA A', themeColor: 'amber' },
                    { periodId: comparePeriodB, labelTag: 'ERA B', themeColor: 'sky' }
                  ].map(({ periodId, labelTag, themeColor }, colIdx) => {
                    const periodObj = DYNASTIC_PERIODS.find(p => p.id === periodId);
                    const kings = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === periodId && i.type === 'king') as KingItem[];
                    const tablets = ARCHIVE_ITEMS.filter(i => i.dynasticPeriod === periodId && i.type === 'tablet') as TabletItem[];

                    const isAmber = themeColor === 'amber';

                    return (
                      <div key={`${periodId}-${colIdx}`} className="space-y-4">
                        {/* Column Header */}
                        <div className={`p-4 rounded-xl bg-black/40 border ${isAmber ? 'border-amber-500/20' : 'border-sky-500/20'} space-y-1`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                              isAmber ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                            }`}>
                              {labelTag} • {periodObj?.badge}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {kings.length} Kings • {tablets.length} Tablets
                            </span>
                          </div>
                          <h4 className={`text-sm font-serif font-bold ${isAmber ? 'text-amber-200' : 'text-sky-200'} mt-1`}>
                            {periodObj?.label}
                          </h4>
                        </div>

                        {/* Monarchs Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-serif font-bold text-slate-300 px-1">
                            <Crown className={`w-3.5 h-3.5 ${isAmber ? 'text-amber-400' : 'text-sky-400'}`} />
                            <span>Key Monarchs ({kings.length})</span>
                          </div>

                          {kings.length > 0 ? (
                            kings.map((king, kIdx) => (
                              <div key={`${king.id}-${kIdx}`} className="p-3.5 rounded-xl bg-black/30 border border-white/10 hover:border-amber-500/30 transition-all space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className={`text-xs font-serif font-bold ${isAmber ? 'text-amber-300' : 'text-sky-300'}`}>
                                      {king.name}
                                    </h5>
                                    <p className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                                      <span>Dynasty: {king.dynasty}</span>
                                      <span>•</span>
                                      <span className={isAmber ? 'text-amber-400/90' : 'text-sky-400/90'}>{king.yearEstimate}</span>
                                    </p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded font-mono text-xs ${
                                    isAmber ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300' : 'bg-sky-500/10 border border-sky-500/20 text-sky-300'
                                  }`}>
                                    {king.cuneiform}
                                  </span>
                                </div>

                                <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-[11px] font-mono text-amber-200/90 flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>Reign Longevity: <strong>{king.reign}</strong></span>
                                </div>

                                <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
                                  {king.details}
                                </p>

                                <div className={`text-[10px] font-serif text-slate-400 italic p-2 rounded-lg border ${
                                  isAmber ? 'bg-amber-950/20 border-amber-500/10' : 'bg-sky-950/20 border-sky-500/10'
                                }`}>
                                  <strong className={`${isAmber ? 'text-amber-400/80' : 'text-sky-400/80'} not-italic font-mono uppercase block text-[9px] mb-0.5`}>
                                    Esoteric Significance:
                                  </strong>
                                  {king.esoteric}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 rounded-xl bg-black/20 border border-dashed border-white/10 text-center text-xs font-serif text-slate-500">
                              No monarchs cataloged for this period
                            </div>
                          )}
                        </div>

                        {/* Tablets Section */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 text-xs font-serif font-bold text-slate-300 px-1">
                            <Scroll className="w-3.5 h-3.5 text-sky-400" />
                            <span>Major Tablet Findings ({tablets.length})</span>
                          </div>

                          {tablets.length > 0 ? (
                            tablets.map((tab, tIdx) => (
                              <div key={`${tab.id}-${tIdx}`} className="p-3.5 rounded-xl bg-black/30 border border-white/10 hover:border-sky-500/30 transition-all space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs font-serif font-bold text-sky-300">
                                      {tab.name}
                                    </h5>
                                    <p className="text-[10px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                                      <span>Site: {tab.site}</span>
                                      <span>•</span>
                                      <span className="text-sky-400/90">{tab.dating}</span>
                                    </p>
                                  </div>
                                  <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 font-mono text-xs">
                                    {tab.cuneiform}
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-serif italic text-slate-300 leading-relaxed">
                                  {tab.translation}
                                </div>

                                <div className="text-[10px] font-serif text-slate-400 italic bg-sky-950/20 p-2 rounded-lg border border-sky-500/10">
                                  <strong className="text-sky-400/80 not-italic font-mono uppercase block text-[9px] mb-0.5">Metaphysical Key:</strong>
                                  {tab.esoteric}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 rounded-xl bg-black/20 border border-dashed border-white/10 text-center text-xs font-serif text-slate-500">
                              No clay tablets cataloged for this period
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Comparative Synthesis */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1813] to-[#0f0d0a] border border-amber-500/30 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        Akashic Cross-Epoch Synthesis
                      </span>
                      <h4 className="text-sm font-serif font-bold text-amber-200">
                        Cross-Epoch Esoteric Intelligence
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompareAI}
                      disabled={isComparingAI}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 shrink-0"
                    >
                      {isComparingAI ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Synthesizing Transition...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Synthesize Era Transition</span>
                        </>
                      )}
                    </button>
                  </div>

                  {compareAISynthesis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-black/60 border border-amber-500/20 text-xs font-serif leading-relaxed text-slate-300"
                    >
                      <TypewriterMarkdown content={compareAISynthesis} />
                    </motion.div>
                  )}

                  {!compareAISynthesis && !isComparingAI && (
                    <p className="text-xs font-serif text-slate-400 italic">
                      Click "Synthesize Era Transition" to invoke Gemini AI to analyze the cosmic, astronomical, and alchemical shift between these two Sumerian epochs.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
