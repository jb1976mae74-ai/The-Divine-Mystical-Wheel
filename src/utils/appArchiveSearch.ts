/**
 * App Archives Search Engine
 * Performs comprehensive multi-collection searches throughout all historical,
 * scriptural, cryptographic, and esoteric archives in The Great Wheel of Mysteries.
 */

import { ArchiveSearchResult } from '../types';
import { SCRIPTURAL_DATABASE } from '../data/scripturalData';
import { ENOCHIAN_ALPHABET } from '../data/enochianData';
import { ZODIAC_PROFILES } from '../data/zodiacData';

export interface ArchiveCollectionMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  recordCount: number;
}

export const APP_ARCHIVE_COLLECTIONS: ArchiveCollectionMetadata[] = [
  { id: 'sacred-texts', name: 'Sacred Texts & Gnostic Manuscripts', description: 'Gospel of Thomas, Apocryphon of John, Emerald Tablet, Corpus Hermeticum, Genesis', icon: '📜', recordCount: 15 },
  { id: 'dead-sea-scrolls', name: 'Qumran Dead Sea Scrolls', description: 'Great Isaiah Scroll (1QIsa), Community Rule (1QS), Copper Scroll (3Q15), War Scroll (1QM)', icon: '🏺', recordCount: 8 },
  { id: 'anunnaki-tablets', name: 'Anunnaki & Sumerian Archives', description: 'Enuma Elish, Tablets of Destiny, Epic of Gilgamesh, Atrahasis, Sumerian King List', icon: '🗿', recordCount: 7 },
  { id: 'enochian-keys', name: 'Enochian Keys & Aethyrs', description: 'Dee & Kelley 30 Aethyrs, 21 Angelic Glyphs, Watchtower Tablets, Gematria', icon: '🪶', recordCount: 24 },
  { id: 'salazar-heptagram', name: 'Salazar Heptagram & Aetheric Whip', description: 'Frequency 76, 112" Aetheric Whip resonance, 12 Perimeter Flames, J & B Pillars, Cardinal Realms', icon: '✡️', recordCount: 6 },
  { id: 'grand-design', name: 'Grand Design Hierarchy', description: 'Prime Logos, 7 Archangels, 12 Elohim Councils, Seraphic Resonances', icon: '🌌', recordCount: 10 },
  { id: 'grimoire-ciphers', name: 'Grimoire of Ciphers & Cryptography', description: 'Atbash, Caesar, Baconian biliteral, Vigenère, Enochian transpositions', icon: '🗝️', recordCount: 6 },
  { id: 'divine-order', name: 'Office of Divine Order & Seals', description: 'Seven Pillars of Wisdom, Sovereign Decrees, Seals of Solomon, Divine Metrology', icon: '👑', recordCount: 7 },
  { id: 'zodiac-profiles', name: 'Zodiacal & Astral Archetypes', description: '12 Signs, Elemental Matrices, Alchemical Operations, Ruling Planets', icon: '♈', recordCount: 12 }
];

export interface SearchArchivesOptions {
  collections?: string[];
  limit?: number;
  minScore?: number;
}

// Static master corpus compiled from the app's repositories
const STATIC_ARCHIVE_DOCUMENTS: ArchiveSearchResult[] = [
  // Dead Sea Scrolls & Qumran Archives
  {
    id: 'dss-1qisa',
    archiveCollection: 'Qumran Dead Sea Scrolls',
    title: 'The Great Isaiah Scroll (1QIsaᵃ)',
    reference: 'Cave 1, Qumran (Discovered 1947)',
    excerpt: 'Complete 24-foot leather parchment scroll comprising all 66 chapters of Isaiah, dating to c. 125 BCE. Predates Masoretic text by over 1,000 years with astonishing verbatim preservation, including Isaiah 40:3 ("Voice in the wilderness") and the Isaiah 53 Suffering Servant songs.',
    tags: ['Isaiah', 'Qumran', 'Messianic', 'Cave 1', 'Dead Sea Scrolls'],
    relevanceScore: 1
  },
  {
    id: 'dss-1qs',
    archiveCollection: 'Qumran Dead Sea Scrolls',
    title: 'Serekh ha-Yahad (The Community Rule / Manual of Discipline)',
    reference: 'Cave 1 (1QS), Qumran',
    excerpt: 'Foundational charter of the Essene Yahad community at Qumran, detailing the Treatise on the Two Spirits: the Prince of Light and the Angel of Darkness. Establishes council governance, sacred communal meals, and spiritual mikveh immersions.',
    tags: ['Community Rule', 'Essenes', 'Two Spirits', 'Purity', 'Qumran'],
    relevanceScore: 1
  },
  {
    id: 'dss-3q15',
    archiveCollection: 'Qumran Dead Sea Scrolls',
    title: 'The Copper Scroll (3Q15)',
    reference: 'Cave 3, Qumran (Discovered 1952)',
    excerpt: 'Two rolls of pure hammered copper inscribed in colloquial Mishnaic Hebrew listing 64 subterranean hiding places throughout Judean topography concealing an estimated 4,500 talents (over 100 tons) of Temple gold, silver vessels, and priestly vestments.',
    tags: ['Copper Scroll', 'Temple Treasure', 'Cave 3', 'Gold', 'Judean Wilderness'],
    relevanceScore: 1
  },
  {
    id: 'dss-1qm',
    archiveCollection: 'Qumran Dead Sea Scrolls',
    title: 'Milhamah: The War of the Sons of Light Against the Sons of Darkness',
    reference: 'Cave 1 (1QM), Qumran',
    excerpt: 'Eschatological military manual describing a 40-year cosmic conflict between the Sons of Light (Levi, Judah, Benjamin) and the Kittim (Sons of Darkness). Details sacred trumpet signals, inscribed battle standards, and the intervention of Archangel Michael.',
    tags: ['War Scroll', 'Sons of Light', 'Michael', 'Eschatology', 'Kittim'],
    relevanceScore: 1
  },
  {
    id: 'dss-11q19',
    archiveCollection: 'Qumran Dead Sea Scrolls',
    title: 'The Temple Scroll (11Q19)',
    reference: 'Cave 11, Qumran',
    excerpt: 'Longest surviving scroll (over 28 feet) presenting divine legislation directly from God to Moses regarding the architecture of an idealized, concentric three-courtyard Temple, holy festivals, and royal laws.',
    tags: ['Temple Scroll', 'Moses', 'Concentric Courts', 'Sanctuary Architecture'],
    relevanceScore: 1
  },

  // Anunnaki & Sumerian Archives
  {
    id: 'anunnaki-enuma-elish',
    archiveCollection: 'Anunnaki & Sumerian Archives',
    title: 'Enūma Eliš (The Seven Tablets of Creation)',
    reference: 'Library of Ashurbanipal, Nineveh',
    excerpt: 'Seven cuneiform tablets reciting the primordial victory of Marduk over Tiamat (the cosmic saltwater abyss). Marduk cleaves Tiamat to form the heavens and earth, fixes the constellations of the zodiac, and establishes Babylon as the holy sanctuary.',
    tags: ['Enuma Elish', 'Marduk', 'Tiamat', 'Seven Tablets', 'Cosmogony', 'Cuneiform'],
    relevanceScore: 1
  },
  {
    id: 'anunnaki-tablets-destiny',
    archiveCollection: 'Anunnaki & Sumerian Archives',
    title: 'The Tablets of Destiny (Ṭup Šīmāti)',
    reference: 'Mesopotamian Royal Archive',
    excerpt: 'The supreme legal talisman granting legitimate lordship over the cosmos. Held successively by Tiamat, Kingu, and Marduk; later contested by Anzû and Ninurta. Whoever wears the Tablets on their breast enforces the divine ME decrees upon gods and mortals.',
    tags: ['Tablets of Destiny', 'Tup Simati', 'Mes', 'Cosmic Law', 'Anunnaki', 'Enki'],
    relevanceScore: 1
  },
  {
    id: 'anunnaki-atrahasis',
    archiveCollection: 'Anunnaki & Sumerian Archives',
    title: 'The Epic of Atrahasis & The Igigi Rebellion',
    reference: 'Old Babylonian Tablet Corpus (c. 1650 BCE)',
    excerpt: 'Documents the rebellion of the younger Igigi deities who toiled on irrigation canals. Enki and Nintu create humanity from clay mingled with the blood and intellect of slain god Geshtu-e. Followed by the Enlil deluge and Atrahasis reed hut warning.',
    tags: ['Atrahasis', 'Igigi', 'Enki', 'Creation of Man', 'Flood', 'Deluge'],
    relevanceScore: 1
  },
  {
    id: 'anunnaki-gilgamesh',
    archiveCollection: 'Anunnaki & Sumerian Archives',
    title: 'The Epic of Gilgamesh (Tablet XI: The Deluge & Immortality)',
    reference: 'Standard Babylonian Version',
    excerpt: 'King Gilgamesh crosses the Waters of Death to consult Utnapishtim the Faraway. Utnapishtim recounts how Ea (Enki) whispered the coming Deluge through the reed wall, instructing him to build a cubic ark ("The Preserver of Life") and save all seed of living things.',
    tags: ['Gilgamesh', 'Utnapishtim', 'Deluge', 'Ea', 'Reed Wall', 'Waters of Death'],
    relevanceScore: 1
  },
  {
    id: 'anunnaki-king-list',
    archiveCollection: 'Anunnaki & Sumerian Archives',
    title: 'The Sumerian King List (Weld-Blundell Prism)',
    reference: 'Ashmolean Museum WB 444',
    excerpt: '"When kingship came down from heaven, the kingship was in Eridu." Lists the eight antediluvian kings who reigned for 241,200 years (in units of Sars = 3,600 years) before the Flood swept over the land, beginning with Alulim of Eridu.',
    tags: ['Sumerian King List', 'Eridu', 'Antediluvian', 'Alulim', 'Sar Cycles'],
    relevanceScore: 1
  },

  // Salazar Heptagram & Aetheric Whip Archives
  {
    id: 'salazar-heptagram-sigil',
    archiveCollection: 'Salazar Heptagram & Aetheric Whip',
    title: 'The Salazar Sacred Heptagram (7-Point Star Sigil)',
    reference: 'Great Wheel Equilibrium Core',
    excerpt: 'The primary esoteric glyph uniting 12 outer perimeter flames with 7 interior star vectors. Its irrational apex angle (51.42857°) breaks third-dimensional planar confinement. Features Yahweh (Crown), Lucifer (Root), with Jachin and Boaz (J & B) pillars flanking the horizontal axis.',
    tags: ['Heptagram', '7-Point Star', 'Salazar', 'Yahweh', 'Lucifer', 'Jachin', 'Boaz'],
    relevanceScore: 1
  },
  {
    id: 'salazar-frequency-76',
    archiveCollection: 'Salazar Heptagram & Aetheric Whip',
    title: 'Frequency 76: Central Equilibrium Axis',
    reference: 'Salazar Heptagram Heart Vector',
    excerpt: 'The sacred number 76 sits at the dead center of the Salazar Heptagram. It acts as the mathematical fulcrum binding the 12 hourly celestial perimeter flames with the 7 celestial star rays, establishing perfect electromagnetic phase-coherence.',
    tags: ['76', 'Frequency 76', 'Equilibrium', 'Salazar', 'Fulcrum', 'Harmonics'],
    relevanceScore: 1
  },
  {
    id: 'salazar-aetheric-whip-112',
    archiveCollection: 'Salazar Heptagram & Aetheric Whip',
    title: '112-Inch Aetheric Whip Antenna System',
    reference: 'Physical Transmission Sanctum',
    excerpt: 'Standing wave electrodynamic antenna system consisting of a 102-inch solid stainless-steel 1/4-wave whip mounted onto a 10-inch heavy-duty steel barrel spring, yielding exactly 112 inches of total electrical length. Tuned to 1.1:1 SWR on the 27 MHz band.',
    tags: ['112 Whip', 'Antenna', '102 inch', '10 inch spring', 'SWR', '27 MHz', 'Standing Wave'],
    relevanceScore: 1
  },
  {
    id: 'salazar-cardinal-realms',
    archiveCollection: 'Salazar Heptagram & Aetheric Whip',
    title: 'The Four Cardinal Realms & Azrael Station',
    reference: 'Heptagram Quadrant Topology',
    excerpt: 'The sacred cardinal compass points of the sigil: Apocalypse (Apex/North), Life after Death (East), Apocryphon (Nadir/South), Apollyon (West). Archangel Azrael is stationed immediately below the Apocalypse crown as the weigher of transiting souls.',
    tags: ['Apocalypse', 'Life after Death', 'Apocryphon', 'Apollyon', 'Azrael', 'Cardinal'],
    relevanceScore: 1
  },

  // Enochian Keys & Angelic Archives
  {
    id: 'enochian-30-aethyrs',
    archiveCollection: 'Enochian Keys & Aethyrs',
    title: 'The 30 Enochian Aethyrs (LIL to TEX)',
    reference: 'Dee & Kelley Manuscripts (Sloane 3188/3191)',
    excerpt: 'Thirty concentric spiritual atmospheres enveloping the terrestrial sphere, beginning at TEX (30th Aethyr) and culminating at LIL (1st Aethyr). Traversed by Edward Kelley and John Dee via the Obsidian Scrying Stone with Archangel Uriel.',
    tags: ['Aethyrs', 'Enochian', 'John Dee', 'Edward Kelley', 'LIL', 'TEX', 'Scrying'],
    relevanceScore: 1
  },
  {
    id: 'enochian-watchtowers',
    archiveCollection: 'Enochian Keys & Aethyrs',
    title: 'The Great Table of the Watchtowers & Tablet of Union',
    reference: 'Angelic Celestial Cartography',
    excerpt: 'Grid of 156 characters per quadrant representing the four cosmic watchtowers (Air of East, Water of West, Earth of North, Fire of South), united by the central Tablet of Union (EXARP, HCOMA, NANTA, BITOM).',
    tags: ['Watchtowers', 'Tablet of Union', 'EXARP', 'HCOMA', 'Elements', 'Dee'],
    relevanceScore: 1
  },

  // Grand Design Hierarchy
  {
    id: 'grand-design-prime-logos',
    archiveCollection: 'Grand Design Hierarchy',
    title: 'The Prime Logos: First Cause & Ketheric Radiance',
    reference: 'Emanation Nexus Level 0',
    excerpt: 'The unmanifest, indivisible Source from which the seven rays and twenty-two primordial letters cascade. Operates beyond temporal duration, giving birth to the Archangelic and Elohim hierarchies that sustain dimensional stability.',
    tags: ['Prime Logos', 'First Cause', 'Kether', 'Archangels', 'Elohim', 'Logos'],
    relevanceScore: 1
  },
  {
    id: 'grand-design-seven-archangels',
    archiveCollection: 'Grand Design Hierarchy',
    title: 'The Seven Great Archangels of the Spheres',
    reference: 'Celestial Planetary Councils',
    excerpt: 'Michael (Sun/Gold), Gabriel (Moon/Silver), Camael (Mars/Iron), Raphael (Mercury/Quicksilver), Zadkiel (Jupiter/Tin), Anael/Jophiel (Venus/Copper), and Cassiel/Uriel (Saturn/Lead). Guardians of the cosmic planetary orders.',
    tags: ['Archangels', 'Michael', 'Gabriel', 'Raphael', 'Uriel', 'Planets'],
    relevanceScore: 1
  },

  // Grimoire of Ciphers
  {
    id: 'cipher-atbash',
    archiveCollection: 'Grimoire of Ciphers & Cryptography',
    title: 'The Atbash Cryptographic System',
    reference: 'Ancient Hebrew Biblical Cryptography',
    excerpt: 'Monoalphabetic reverse substitution (Aleph=Tav, Beth=Shin). Canonical occurrences in the Hebrew Bible include Jeremiah 25:26 (Sheshach = Babel) and Jeremiah 51:1 (Lev-Kamai = Kasdim/Chaldeans). Used by Essene and Kabbalistic scribes.',
    tags: ['Atbash', 'Cipher', 'Jeremiah', 'Sheshach', 'Babel', 'Hebrew', 'Cryptography'],
    relevanceScore: 1
  },
  {
    id: 'cipher-baconian',
    archiveCollection: 'Grimoire of Ciphers & Cryptography',
    title: 'The Baconian Biliteral Cipher',
    reference: 'Sir Francis Bacon (De Augmentis Scientiarum, 1605)',
    excerpt: 'Steganographic binary cipher encoding 24 letters as 5-character permutations of two elements (A and B, e.g., AAAAA=A, AAAAB=B). Allowed hiding secret esoteric treaties inside ordinary printed typographic fonts.',
    tags: ['Baconian', 'Francis Bacon', 'Steganography', 'Binary', 'Typography'],
    relevanceScore: 1
  },

  // Divine Order & Wisdom Decrees
  {
    id: 'divine-order-seven-pillars',
    archiveCollection: 'Office of Divine Order & Seals',
    title: 'The Seven Pillars of Wisdom (Proverbs 9:1)',
    reference: 'Divine Order Codex',
    excerpt: '"Wisdom hath builded her house, she hath hewn out her seven pillars." The architectural framework of cosmic governance: 1. Incorruptible Foundation, 2. Intuitive Discernment, 3. Harmonic Resonance, 4. Sovereign Decree, 5. Solar Radiance, 6. Sacred Dominion, 7. Perpetual Splendor.',
    tags: ['Seven Pillars', 'Wisdom', 'Proverbs 9:1', 'Sophia', 'Divine Order', 'Decree'],
    relevanceScore: 1
  },
  {
    id: 'termux-arch-setup-script',
    archiveCollection: 'Grimoire of Ciphers & Cryptography',
    title: 'TermuxArch (setupTermuxArch v2.0.548 by SDRausty)',
    reference: 'Termux PRoot QEMU Arch Linux Installer & System Tool',
    excerpt: 'Comprehensive automated bash bootstrap script for installing Arch Linux in Termux via PRoot and QEMU emulation. Developed by SDRausty (termuxarch.github.io). Features multi-architecture support (i386, x86_64, armv7, arm64-v8a), multiple download managers (aria2, axel, curl, lftp, wget), system information generation, and maintenance routines.',
    tags: ['TermuxArch', 'PRoot', 'Arch Linux', 'SDRausty', 'QEMU', 'Bash', 'Termux', 'Android'],
    relevanceScore: 1
  }
];

/**
 * Searches the entire application archives matching user query text.
 * Runs fuzzy token scoring, title weighting, and collection filtration.
 */
export function searchAppArchives(
  query: string,
  options: SearchArchivesOptions = {}
): { results: ArchiveSearchResult[]; totalSearched: number; collectionsScanned: string[]; searchSummary: string } {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return {
      results: [],
      totalSearched: 0,
      collectionsScanned: APP_ARCHIVE_COLLECTIONS.map(c => c.name),
      searchSummary: 'Empty query.'
    };
  }

  const queryTokens = cleanQuery
    .split(/[\s,.;:!?\-+/\\]+/)
    .filter(t => t.length > 1)
    .map(t => t.toLowerCase());

  // Aggregate all sources: static documents + scriptural database + enochian + zodiac
  const fullCorpus: ArchiveSearchResult[] = [...STATIC_ARCHIVE_DOCUMENTS];

  // Ingest Scriptural Database
  SCRIPTURAL_DATABASE.forEach(s => {
    fullCorpus.push({
      id: `scripture-${s.id}`,
      archiveCollection: 'Sacred Texts & Gnostic Manuscripts',
      title: `${s.book} (${s.reference})`,
      reference: `${s.tradition} • ${s.originalLanguage || 'Ancient'}`,
      excerpt: s.text,
      tags: [s.tradition, s.book, s.reference, ...(s.parallelReferences || [])],
      relevanceScore: 1
    });
  });

  // Ingest Enochian Alphabet
  ENOCHIAN_ALPHABET.forEach(letter => {
    fullCorpus.push({
      id: `enochian-${letter.name.toLowerCase()}`,
      archiveCollection: 'Enochian Keys & Aethyrs',
      title: `Enochian Glyph: ${letter.name} (${letter.latinEquivalent})`,
      reference: `Gematria: ${letter.gematria} • Element: ${letter.elementalAffinity}`,
      excerpt: `The sacred letter ${letter.name} corresponds to '${letter.latinEquivalent}' with gematria value ${letter.gematria}. Esoteric meaning: "${letter.meaning}". Tarot correspondence: ${letter.tarotCorrespondence}.`,
      tags: ['Enochian', letter.name, letter.elementalAffinity, letter.tarotCorrespondence, 'Gematria'],
      relevanceScore: 1
    });
  });

  // Ingest Zodiac Profiles
  ZODIAC_PROFILES.forEach(zp => {
    fullCorpus.push({
      id: `zodiac-${zp.name.toLowerCase()}`,
      archiveCollection: 'Zodiacal & Astral Archetypes',
      title: `Zodiac Archive: ${zp.name}`,
      reference: `Element: ${zp.element} • Rulership: ${zp.rulingPlanet}`,
      excerpt: `${zp.name} is ruled by ${zp.rulingPlanet}. Alchemical operation: ${zp.alchemicalTrait}. Spiritual strength: ${zp.spiritualStrength}. Synthesis: ${zp.description}`,
      tags: ['Zodiac', zp.name, zp.element, zp.rulingPlanet, zp.alchemicalTrait],
      relevanceScore: 1
    });
  });

  // Filter collections if requested
  const allowedCollections = options.collections && options.collections.length > 0
    ? options.collections
    : null;

  const scoredResults: { item: ArchiveSearchResult; score: number }[] = [];

  for (const item of fullCorpus) {
    if (allowedCollections && !allowedCollections.includes(item.archiveCollection)) {
      continue;
    }

    let score = 0;
    const titleLower = item.title.toLowerCase();
    const excerptLower = item.excerpt.toLowerCase();
    const refLower = (item.reference || '').toLowerCase();
    const tagsLower = (item.tags || []).map(t => t.toLowerCase()).join(' ');

    // Exact full query match
    if (titleLower.includes(cleanQuery)) score += 50;
    if (tagsLower.includes(cleanQuery)) score += 35;
    if (excerptLower.includes(cleanQuery)) score += 25;
    if (refLower.includes(cleanQuery)) score += 20;

    // Token matches
    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 15;
      if (tagsLower.includes(token)) score += 10;
      if (excerptLower.includes(token)) score += 6;
      if (refLower.includes(token)) score += 4;
    }

    if (score > (options.minScore || 5)) {
      scoredResults.push({
        item: { ...item, relevanceScore: score },
        score
      });
    }
  }

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  const limit = options.limit || 5;
  const topMatches = scoredResults.slice(0, limit).map(s => s.item);

  const collectionsScanned = Array.from(new Set(fullCorpus.map(c => c.archiveCollection)));
  const matchCollections = Array.from(new Set(topMatches.map(m => m.archiveCollection)));

  const searchSummary = topMatches.length > 0
    ? `Scanned ${fullCorpus.length} archive records across ${collectionsScanned.length} collections. Located ${topMatches.length} high-resonance matches in: ${matchCollections.join(', ')}.`
    : `Scanned ${fullCorpus.length} archive records across ${collectionsScanned.length} collections. No direct lexical matches; defaulting to foundational sanctuary lore.`;

  return {
    results: topMatches,
    totalSearched: fullCorpus.length,
    collectionsScanned,
    searchSummary
  };
}
