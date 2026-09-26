import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  BookOpen, Sparkles, X, Compass, Shield, Info, Flame, ChevronLeft, ChevronRight, 
  ScrollText, Crosshair, Volume2, Radio, Zap, Music, Activity, MousePointerClick,
  ToggleLeft, ToggleRight, Download, Plus, Minus, RotateCcw, ZoomIn, ZoomOut
} from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

export interface StarPointNode {
  index: number;
  id: string;
  title: string;
  hebrew: string;
  hebrewName: string;
  hebrewMeaning: string;
  transliteration: string;
  frequency: string;
  freqHz: number;
  aspect: string;
  celestialGate: string;
  element: string;
  solfeggioSignificance: string;
  esotericMeaning: string;
  planetaryCorrespondence: string;
}

export const STAR_POINT_NODES: StarPointNode[] = [
  {
    index: 0,
    id: 'star-0',
    title: 'CROWN OF SUPREME ZENITH',
    hebrew: 'כֶּתֶר',
    hebrewName: 'Kether',
    hebrewMeaning: 'Crown / Supreme Will',
    transliteration: 'Kether (Crown)',
    frequency: '963 Hz',
    freqHz: 963,
    aspect: 'Zenith Apex (12 o\'clock Axis)',
    celestialGate: 'Gate of Pure Awakening',
    element: 'Primordial Light / Unmanifest Spirit',
    solfeggioSignificance: 'Frequency of Divine Illumination, Crown attunement, and transcendent cosmic consciousness.',
    esotericMeaning: 'Anchors the top apex of the 7-pointed star. It represents the highest spiritual realm where divine illumination descends into sacred geometry.',
    planetaryCorrespondence: 'Primum Mobile / The Ineffable Crown'
  },
  {
    index: 1,
    id: 'star-1',
    title: 'GATE OF CELESTIAL WISDOM',
    hebrew: 'חָכְמָה',
    hebrewName: 'Chokhmah',
    hebrewMeaning: 'Wisdom / Sophia',
    transliteration: 'Chokhmah (Wisdom)',
    frequency: '852 Hz',
    freqHz: 852,
    aspect: 'Celestial Northeast (1:45 Axis)',
    celestialGate: 'Portal of Spiritual Intuition',
    element: 'Solar Gold / Intuitive Radiance',
    solfeggioSignificance: 'Awakening intuitive vision, clearing cognitive illusions, and elevating consciousness.',
    esotericMeaning: 'The primordial flash of inspiration, Sophia\'s divine gnosis, and the active creative wisdom that guides esoteric contemplation.',
    planetaryCorrespondence: 'Zodiacal Sphere / Fixed Stars'
  },
  {
    index: 2,
    id: 'star-2',
    title: 'PORTAL OF SACRED UNDERSTANDING',
    hebrew: 'בִּינָה',
    hebrewName: 'Binah',
    hebrewMeaning: 'Understanding / Sanctuary',
    transliteration: 'Binah (Understanding)',
    frequency: '741 Hz',
    freqHz: 741,
    aspect: 'Eastern Threshold (3:30 Axis)',
    celestialGate: 'Chamber of Intuitive Expression',
    element: 'Sacred Water / Deep Receptivity',
    solfeggioSignificance: 'Solving problems, spiritual purification, mental clarity, and articulate esoteric expression.',
    esotericMeaning: 'The cosmic womb and sanctuary of sacred form. Translates infinite wisdom into structured matrices and understandable principles.',
    planetaryCorrespondence: 'Saturn / Contemplative Sphere'
  },
  {
    index: 3,
    id: 'star-3',
    title: 'CHAMBER OF DIVINE MERCY',
    hebrew: 'חֶסֶד',
    hebrewName: 'Chesed',
    hebrewMeaning: 'Mercy / Loving-Kindness',
    transliteration: 'Chesed (Mercy)',
    frequency: '639 Hz',
    freqHz: 639,
    aspect: 'Nether Southeast (5:15 Axis)',
    celestialGate: 'Sanctuary of Harmonic Grace',
    element: 'Benefic Fire / Radiant Grace',
    solfeggioSignificance: 'Harmonious relationship attunement, compassionate connection, and heart-centered resonance.',
    esotericMeaning: 'The boundless overflow of divine benevolence, protection, and unconditional grace sustaining the initiate during deep inquiry.',
    planetaryCorrespondence: 'Jupiter / Sphere of Benevolence'
  },
  {
    index: 4,
    id: 'star-4',
    title: 'FORTRESS OF SEVERITY & POWER',
    hebrew: 'גְּבוּרָה',
    hebrewName: 'Gevurah',
    hebrewMeaning: 'Severity / Might & Judgment',
    transliteration: 'Gevurah (Severity)',
    frequency: '528 Hz',
    freqHz: 528,
    aspect: 'Nether Southwest (6:45 Axis)',
    celestialGate: 'Fortress of Transformation',
    element: 'Volcanic Earth / Iron Will',
    solfeggioSignificance: 'The Solfeggio Miracle Tone, structural transformation, alchemical fortitude, and DNA harmonic repair.',
    esotericMeaning: 'Divine judgment, alchemical discipline, and the burning fire that severs impurities and protects the sanctity of the mystery.',
    planetaryCorrespondence: 'Mars / Sphere of Strength'
  },
  {
    index: 5,
    id: 'star-5',
    title: 'SANCTUARY OF HARMONY & BEAUTY',
    hebrew: 'תִּפְאֶרֶת',
    hebrewName: 'Tiferet',
    hebrewMeaning: 'Beauty / Balance & Harmony',
    transliteration: 'Tiferet (Beauty)',
    frequency: '417 Hz',
    freqHz: 417,
    aspect: 'Western Threshold (8:30 Axis)',
    celestialGate: 'Threshold of Transmutation',
    element: 'Solar Heart / Golden Center',
    solfeggioSignificance: 'Undoing negative energetic knots, facilitating transmutation, and restoring harmonic balance.',
    esotericMeaning: 'The radiant heart of the celestial tree, mediating between severity and mercy to produce the supreme equilibrium of beauty.',
    planetaryCorrespondence: 'Sol / Central Sun'
  },
  {
    index: 6,
    id: 'star-6',
    title: 'FOUNDATION OF SACRED VISION',
    hebrew: 'יְסוֹד',
    hebrewName: 'Yesod',
    hebrewMeaning: 'Foundation / Astral Matrix',
    transliteration: 'Yesod (Foundation)',
    frequency: '396 Hz',
    freqHz: 396,
    aspect: 'Celestial Northwest (10:15 Axis)',
    celestialGate: 'Foundation of Liberation',
    element: 'Astral Aether / Silver Mirror',
    solfeggioSignificance: 'Liberating fear and doubt, grounding sacred intentions, and anchoring spiritual matrices into reality.',
    esotericMeaning: 'The receptacle of celestial energies and the etheric conduit through which divine wisdom crystallizes into visible manifestation.',
    planetaryCorrespondence: 'Luna / Sphere of Reflection'
  }
];

export interface ScholarlyNode {
  id: string;
  hebrew: string;
  transliteration: string;
  english: string;
  position: string;
  definition: string;
  context: string;
}

export interface FlameNode {
  index: number;
  roman: string;
  id: string;
  title: string;
  hebrew: string;
  transliteration: string;
  hour: string;
  element: string;
  historicalMeaning: string;
  symbolicMeaning: string;
}

export const SCHOLARLY_NODES: Record<string, ScholarlyNode> = {
  apocalypse: {
    id: 'apocalypse',
    hebrew: 'אֲפוֹקָלִיפְסָה',
    transliteration: 'Apokalipsa',
    english: 'APOCALYPSE (SON OF MAN)',
    position: 'Zenith Axis (12 o\'clock)',
    definition: 'Derived from the Ancient Greek ἀποκάλυψις (unveiling, revelation). Within the sacred heptagram mystery, Apocalypse is identified with the Son of Man, the supreme cosmic unveiling of divine humanity and celestial truth.',
    context: 'The Apocalypse occupies the supreme zenith above the circle, embodying the Son of Man presiding over the Four Angels of the Sacred Heptagram: Apocryphon, Life after Death (Life), Azrael, and Apollyon.'
  },
  apocryphon: {
    id: 'apocryphon',
    hebrew: 'אֲפוֹקְרִיפוֹן',
    transliteration: 'Apokryphon',
    english: 'APOCRYPHON',
    position: 'Nadir Axis (6 o\'clock)',
    definition: 'From the Greek ἀπόκρυφος (hidden, secret writing). One of the Four Angels of the Sacred Heptagram, guarding the primordial mysteries and hidden wisdom.',
    context: 'Anchoring the bottom nadir of the Sacred Heptagram at 6 o\'clock opposite Apocalypse, Apocryphon is the Angel of Hidden Gnosis and Esoteric Truth.'
  },
  apollyon: {
    id: 'apollyon',
    hebrew: 'אֲבַדּוֹן',
    transliteration: 'Abaddon / Apollyon',
    english: 'APOLLYON',
    position: 'Western Gate (9 o\'clock)',
    definition: 'Hebrew "Abaddon" / Greek "Apollyon" (The Destroyer). One of the Four Angels of the Sacred Heptagram, positioned at 9 o\'clock above Glory.',
    context: 'At the 9 o\'clock western gate above Glory, Apollyon represents holy alchemical dissolution (Solve)—the essential clearing of darkness and corruption so divine Glory may manifest.'
  },
  lifeAfterDeath: {
    id: 'lifeAfterDeath',
    hebrew: 'חַיִּים לְאַחַר הַמָּוֶת',
    transliteration: 'Chaim L\'Achar HaMavet',
    english: 'LIFE AFTER DEATH (LIFE)',
    position: 'Eastern Gate (3 o\'clock)',
    definition: 'Hebrew for "Life After Death" (Life). One of the Four Angels of the Sacred Heptagram, positioned at 3 o\'clock opposite Apollyon.',
    context: 'Occupying the Eastern dawn threshold at 3 o\'clock, Life after Death is the Angel of Eternal Rebirth, resurrection, and the triumph of the undying soul.'
  },
  yahweh: {
    id: 'yahweh',
    hebrew: 'יהוה',
    transliteration: 'Y-H-W-H (Tetragrammaton)',
    english: 'YAHWEH',
    position: 'Upper Celestial Hemisphere (Apex Zenith)',
    definition: 'The Sacred Tetragrammaton, representing the unutterable Divine Being (Hayah-Hoveh-Yihyeh: Was, Is, Will Be) with Gematria 26 (10+5+6+5).',
    context: 'In Salazar Hermetic Kabbalah, the Tetragrammaton stands at the supreme apex crown of cosmic order, embodying unmanifest Ain Soph Aur, divine mercy, and supreme spiritual covenant law above all manifest spheres.'
  },
  lucifer: {
    id: 'lucifer',
    hebrew: 'לוּצִיפֶר',
    transliteration: 'Heylel ben Shahar / Lucifer',
    english: 'LUCIFER (LIGHT-BRINGER)',
    position: 'Lower Terrestrial Hemisphere (Nadir Base)',
    definition: 'Latin for "Light-Bringer" (Lux-Ferre), translating Hebrew "Heylel ben Shahar" (Shining One, Son of the Morning, Isaiah 14:12).',
    context: 'In Salazar esoteric analysis, Lucifer represents the Promethean flame of awakened intellect, active cosmic illumination descending into material darkness to ignite consciousness, conscious discernment, and spiritual transmutation.'
  },
  j: {
    id: 'j',
    hebrew: 'י',
    transliteration: 'Yod / Jachin',
    english: 'JACHIN (J)',
    position: 'Left Pillar Threshold',
    definition: 'Hebrew letter Yod (Value 10). Represents "Jachin" ("He will establish")—the right-hand pillar of Solomon\'s Temple.',
    context: 'In the Salazar Heptagram archetype, Jachin embodies active masculine force, solar potency, and the unyielding pillar of divine establishment.'
  },
  b: {
    id: 'b',
    hebrew: 'ב',
    transliteration: 'Bet / Boaz',
    english: 'BOAZ (B)',
    position: 'Right Pillar Threshold',
    definition: 'Hebrew letter Bet (Value 2). Represents "Boaz" ("In Strength")—the left-hand pillar of Solomon\'s Temple.',
    context: 'In the Salazar Heptagram archetype, Boaz signifies passive feminine mystery, lunar sanctuary, and the reflective strength of inner wisdom.'
  },
  '76': {
    id: '76',
    hebrew: 'ע"ו',
    transliteration: 'Ayin-Vav (Gematria 76)',
    english: 'SACRED NUMERICAL CENTER (76 LOGOS)',
    position: 'Central Heptagram Nucleus (Axis Mundi)',
    definition: 'Gematria total 76 (Ayin = 70 + Vav = 6). Represents the harmonic synthesis of 7 celestial planetary rays and 6 spatial axes of cosmic manifestation.',
    context: 'The focal equilibrium axis of the Salazar Heptagram. 76 binds the 12 perimeter flames with the 7 star vectors, marking the central nexus of esoteric power, divine decree enforcement, and geometric harmony.'
  }
};

export const FLAME_NODES: FlameNode[] = [
  {
    index: 0,
    roman: 'I',
    id: 'flame-0',
    title: 'IGNIS PRIMA',
    hebrew: 'אֵשׁ קַדְמוֹנִית',
    transliteration: 'Esh Kadmonit',
    hour: "Flame I • Zenith Apex (12 o'clock)",
    element: 'Aether / Primordial Spark',
    historicalMeaning: "Documented in Sefer Yetzirah and Qumran Scroll 4Q246 as the 'Uncreated Flame'. Lit upon the High Priest's Ephod during ancient Yom Kippur rites in Solomon's Temple.",
    symbolicMeaning: 'The awakening of pure unmanifest consciousness, divine initiation, and the absolute crown spark triggering the 12-fold cosmic wheel.'
  },
  {
    index: 1,
    roman: 'II',
    id: 'flame-1',
    title: 'IGNIS LOGOS',
    hebrew: 'אֵשׁ הַדִּבּוּר',
    transliteration: 'Esh HaDibbur',
    hour: "Flame II • Celestial Northeast (1 o'clock)",
    element: 'Air / Prophetic Word',
    historicalMeaning: "Inscribed in 2nd-century Gnostic Nag Hammadi codices (NHC II,2). Associated with the 'Living Word' illuminating early Alexandrian mystics during scriptural decipherment.",
    symbolicMeaning: 'The crystallization of silent divine thought into sacred vibration, articulate logos, and the transmission of esoteric revelation.'
  },
  {
    index: 2,
    roman: 'III',
    id: 'flame-2',
    title: 'IGNIS FOEDERIS',
    hebrew: 'אֵשׁ הַבְּרִית',
    transliteration: 'Esh HaBrit',
    hour: "Flame III • Upper East (2 o'clock)",
    element: 'Fire / Covenant Gold',
    historicalMeaning: "Chronicles Solomon's temple consecration (2 Chronicles 7:1) when heavenly fire consumed the sacrifice without human ignition, sealing the eternal covenant.",
    symbolicMeaning: 'Unshakable spiritual alignment, the binding oath of mystery schools, and the eternal covenant between human intent and divine law.'
  },
  {
    index: 3,
    roman: 'IV',
    id: 'flame-3',
    title: 'IGNIS SANCTUARII',
    hebrew: 'אֵשׁ הַמִּזְבֵּחַ',
    transliteration: 'Esh HaMizbeach',
    hour: "Flame IV • Eastern Gate (3 o'clock)",
    element: 'Dawn / Solar Rebirth',
    historicalMeaning: 'Derived from Essene morning benedictions in 1QH (Hodayot). Represented the daily rebirth of the soul with the dawn sun over the Dead Sea cliffs.',
    symbolicMeaning: 'Metempsychosis, spiritual renewal, and the threshold of enlightenment where dark night yields to perpetual morning.'
  },
  {
    index: 4,
    roman: 'V',
    id: 'flame-4',
    title: 'IGNIS SUBSTANTIÆ',
    hebrew: 'אֵשׁ הַחֹמֶר',
    transliteration: 'Esh HaChomer',
    hour: "Flame V • Lower East (4 o'clock)",
    element: 'Earth / Alchemical Salt',
    historicalMeaning: "Recorded in Sefer HaBahir (§44) as the 'Fire that Burns within Matter', purifying physical elements until their underlying spiritual lattice shines through.",
    symbolicMeaning: 'Alchemical calcination (Calcination)—the purifying heat that strips away illusion, revealing the imperishable vessel within.'
  },
  {
    index: 5,
    roman: 'VI',
    id: 'flame-5',
    title: 'IGNIS PURIFICATIONIS',
    hebrew: 'אֵשׁ הַטַּהֲרָה',
    transliteration: 'Esh HaTaharah',
    hour: "Flame VI • Nether East (5 o'clock)",
    element: 'Water-Fire / Steam of Initiation',
    historicalMeaning: 'Described in 1 Enoch 14:12 as rivers of living flame surrounding the Throne of Glory, burning away mortal dross before the inner sanctum.',
    symbolicMeaning: 'Spiritual baptism, emotional transmutation, and the burning away of temporal ego prior to deep subterranean descent.'
  },
  {
    index: 6,
    roman: 'VII',
    id: 'flame-6',
    title: 'IGNIS ABYSSI',
    hebrew: 'אֵשׁ מַעֲמַקִּים',
    transliteration: "Esh Ma'amakim",
    hour: "Flame VII • Nadir Axis (6 o'clock)",
    element: 'Chthonic Earth / Nether Flame',
    historicalMeaning: "Preserved in Salazar Hermetic notebooks under the 'Apocryphon Archive'. Marks the midnight sun venerated by Hermetic initiates in underground crypts.",
    symbolicMeaning: 'Lumen in Chaos—the secret light shining in absolute darkness, the womb of hidden knowledge, and the lowest anchor of the cosmic axis.'
  },
  {
    index: 7,
    roman: 'VIII',
    id: 'flame-7',
    title: 'IGNIS TRANSMUTATIONIS',
    hebrew: 'אֵשׁ הַתְּמוּרָה',
    transliteration: 'Esh HaTemurah',
    hour: "Flame VIII • Nether West (7 o'clock)",
    element: 'Alchemical Mercury',
    historicalMeaning: "Referenced in 16th-century Paracelsian manuscripts as 'Salamandra'—the heat that dissolves rigid metallic matrices into fluid potential.",
    symbolicMeaning: 'Solve et Coagula—the breakdown of rigid mental models and egoic structures required for profound psychological transmutation.'
  },
  {
    index: 8,
    roman: 'IX',
    id: 'flame-8',
    title: 'IGNIS LIBRÆ',
    hebrew: 'אֵשׁ הַמֹּאזְנַיִם',
    transliteration: 'Esh HaMoznayim',
    hour: "Flame IX • Lower West (8 o'clock)",
    element: 'Air / Scale of Balance',
    historicalMeaning: 'Engraved on ancient Babylonian Kudurru stones as the flame of Shamash, measuring the karmic equilibrium of empires and seekers alike.',
    symbolicMeaning: 'Karmic equilibrium, perfect balance between severity and mercy, and the stabilization of opposing spiritual currents.'
  },
  {
    index: 9,
    roman: 'X',
    id: 'flame-9',
    title: 'IGNIS OCCASUS',
    hebrew: 'אֵשׁ הַמַּעֲרָב',
    transliteration: "Esh HaMa'arav",
    hour: "Flame X • Western Gate (9 o'clock)",
    element: 'Water / Twilight Sunset',
    historicalMeaning: "Linked in Alexandrian Hermetic papyri to Amenti—the setting sun where the soul undergoes the Weighing of the Heart against Ma'at's feather.",
    symbolicMeaning: 'Surrender of mortal pretense, passage across the abyss, and the fortitude to face shadow self in search of divine truth.'
  },
  {
    index: 10,
    roman: 'XI',
    id: 'flame-10',
    title: 'IGNIS PROPHETIAE',
    hebrew: 'אֵשׁ הַחָזוֹן',
    transliteration: 'Esh HaChazon',
    hour: "Flame XI • Upper West (10 o'clock)",
    element: 'Astral Light / Silver Veil',
    historicalMeaning: "Inscribed in Ezekiel 1:4 as 'a whirlwind and a fire unfolding itself', surrounding the divine Merkabah chariot during visionary ecstasy.",
    symbolicMeaning: 'Clairvoyance, third-eye activation, and non-linear vision beholding past, present, and future as one simultaneous tapestry.'
  },
  {
    index: 11,
    roman: 'XII',
    id: 'flame-11',
    title: 'IGNIS CÆLESTIS',
    hebrew: 'אֵשׁ הַשָּׂרִים',
    transliteration: 'Esh HaSarim',
    hour: "Flame XII • Celestial Northwest (11 o'clock)",
    element: 'Archangelic Platinum / Fire Guard',
    historicalMeaning: "Found in Qumran War Scroll (1QM) as the holy flame assigned to Archangel Michael's celestial legion protecting the sanctuary.",
    symbolicMeaning: 'Divine protection, spiritual discernment, and the final fortress of light shielding the initiate prior to return to Zenith.'
  }
];

interface InteractiveHeptagramProps {
  activeTheme: any;
  circleRadius: number;
  starPoints: string;
  flamePositions: any[];
  isSpeaking?: boolean;
  soundEnabled?: boolean;
  interactable?: boolean;
  onInteractableChange?: (interactable: boolean) => void;
}

const InteractiveHeptagramBase: React.FC<InteractiveHeptagramProps> = ({
  activeTheme,
  circleRadius,
  starPoints,
  flamePositions,
  isSpeaking = false,
  soundEnabled = true,
  interactable = true,
  onInteractableChange
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredNode(null);
    setHoveredFlameIndex(null);
  };

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pinnedNode, setPinnedNode] = useState<string | null>(null);
  const [dismissedTooltipKey, setDismissedTooltipKey] = useState<string | null>(null);

  const [selectedFlameIndex, setSelectedFlameIndex] = useState<number | null>(null);
  const [hoveredFlameIndex, setHoveredFlameIndex] = useState<number | null>(null);
  const [customStarColor, setCustomStarColor] = useState<'theme' | 'gold' | 'purple' | 'silver'>('theme');
  const [hoveredStarPointIndex, setHoveredStarPointIndex] = useState<number | null>(null);
  
  // Zoom & Pan state for #sacredHeptagramSymbol inspection
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingPanRef = useRef(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const hasPannedRef = useRef(false);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(3.0, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => {
      const next = Math.max(0.75, Math.round((prev - 0.25) * 100) / 100);
      if (next <= 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (zoomLevel <= 1) return;
    isDraggingPanRef.current = true;
    hasPannedRef.current = false;
    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingPanRef.current || !panStartRef.current || zoomLevel <= 1) return;
    const dx = e.clientX - panStartRef.current.clientX;
    const dy = e.clientY - panStartRef.current.clientY;

    if (Math.hypot(dx, dy) > 5) {
      hasPannedRef.current = true;
    }

    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const scale = rect.width > 0 ? (1000 / zoomLevel) / rect.width : 1;

    const newPanX = panStartRef.current.panX - dx * scale;
    const newPanY = panStartRef.current.panY - dy * scale;

    const vbWidth = 1000 / zoomLevel;
    const vbHeight = 1000 / zoomLevel;
    const maxPanX = Math.max(0, (1000 - vbWidth) / 2 + 75);
    const maxPanY = Math.max(0, (1000 - vbHeight) / 2 + 75);

    setPanOffset({
      x: Math.max(-maxPanX, Math.min(maxPanX, newPanX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newPanY)),
    });
  };

  const handleSvgPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDraggingPanRef.current) {
      isDraggingPanRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      setTimeout(() => {
        hasPannedRef.current = false;
      }, 50);
    }
  };

  // Zoom & Pan computation for #sacredHeptagramSymbol
  const vbWidth = 1000 / zoomLevel;
  const vbHeight = 1000 / zoomLevel;
  const maxPanX = Math.max(0, (1000 - vbWidth) / 2 + 75);
  const maxPanY = Math.max(0, (1000 - vbHeight) / 2 + 75);
  const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, panOffset.x));
  const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, panOffset.y));
  const vbX = (1000 - vbWidth) / 2 + clampedPanX;
  const vbY = (1000 - vbHeight) / 2 + clampedPanY;
  const computedViewBox = `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;

  // Star Point Resonance, Interaction Toggle & State
  const [isInteractable, setIsInteractable] = useState<boolean>(interactable);
  const [selectedStarPointIndex, setSelectedStarPointIndex] = useState<number | null>(null);
  const [recentChimeTime, setRecentChimeTime] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Sync internal interactable state with prop if controlled
  useEffect(() => {
    if (interactable !== undefined) {
      setIsInteractable(interactable);
    }
  }, [interactable]);

  const toggleInteractable = () => {
    const nextVal = !isInteractable;
    setIsInteractable(nextVal);
    onInteractableChange?.(nextVal);
    if (nextVal) {
      audioSystem.playTone(528, 'sine', 0.15);
    } else {
      audioSystem.playTone(396, 'sine', 0.1);
      setSelectedStarPointIndex(null);
    }
  };

  // Audio level animation loop to sync real-time speech / oracle sound with breathing glow
  useEffect(() => {
    let animFrame: number;
    let lastSampleTime = 0;

    const sampleAudio = (time: number) => {
      // Throttle sampling to ~30fps for smooth visual glow without overwhelming main thread
      if (time - lastSampleTime >= 33) {
        lastSampleTime = time;
        const freqData = audioSystem.getAnalyserByteFrequencyData();
        let targetLevel = 0;

        if (freqData && freqData.length > 0) {
          let sum = 0;
          const count = Math.min(freqData.length, 32);
          for (let i = 0; i < count; i++) {
            sum += freqData[i];
          }
          const avg = sum / (count * 255);
          const bounce = audioSystem.getActiveWordBounce();
          targetLevel = (avg < 0.02 && bounce < 0.02) ? 0 : Math.min(1, avg * 1.5 + bounce * 0.8);
        } else {
          const bounce = audioSystem.getActiveWordBounce();
          targetLevel = bounce < 0.02 ? 0 : bounce;
        }

        setAudioLevel(prev => {
          if (prev === 0 && targetLevel === 0) return 0;
          if (Math.abs(prev - targetLevel) < 0.03 && targetLevel === 0) return 0;
          if (Math.abs(prev - targetLevel) < 0.02) return prev;
          return Number(targetLevel.toFixed(2));
        });
      }
      animFrame = requestAnimationFrame(sampleAudio);
    };

    animFrame = requestAnimationFrame(sampleAudio);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const parsedStarPoints = useMemo(() => {
    if (!starPoints) return [];
    const pointsStr = starPoints.trim().split(' ');
    return pointsStr.map(pt => {
      const [px, py] = pt.split(',');
      return { x: parseFloat(px), y: parseFloat(py) };
    });
  }, [starPoints]);

  const handleFlameClick = (index: number) => {
    if (hasPannedRef.current) return;
    setPinnedNode(null);
    setHoveredNode(null);
    setSelectedStarPointIndex(null);
    if (selectedFlameIndex === index) {
      setSelectedFlameIndex(null);
    } else {
      setSelectedFlameIndex(index);
    }
  };

  const handleDismissTooltip = (nodeId: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDismissedTooltipKey(nodeId);
    setHoveredNode(null);
    setPinnedNode(null);
  };

  const handleNodeClick = (nodeId: string) => {
    if (hasPannedRef.current) return;
    setSelectedFlameIndex(null);
    setHoveredFlameIndex(null);
    setSelectedStarPointIndex(null);
    setDismissedTooltipKey(null);
    if (pinnedNode === nodeId) {
      setPinnedNode(null);
    } else {
      setPinnedNode(nodeId);
      requestAnimationFrame(() => checkTooltipOverflow(nodeId));
    }
  };

  const handleStarPointClick = (index: number) => {
    if (hasPannedRef.current) return;
    if (!isInteractable) {
      // If clicked while disabled, trigger subtle feedback
      audioSystem.playTone(330, 'triangle', 0.08);
      return;
    }

    setSelectedFlameIndex(null);
    setHoveredFlameIndex(null);
    setPinnedNode(null);
    setHoveredNode(null);

    const node = STAR_POINT_NODES[index];
    if (selectedStarPointIndex === index) {
      // Re-trigger chime even if already selected
      audioSystem.playStarPointResonance(index, node?.freqHz);
      setRecentChimeTime(Date.now());
    } else {
      setSelectedStarPointIndex(index);
      audioSystem.playStarPointResonance(index, node?.freqHz);
      setRecentChimeTime(Date.now());
    }
  };

  const activeFlameIndex = selectedFlameIndex !== null ? selectedFlameIndex : hoveredFlameIndex;
  const activeFlameData = activeFlameIndex !== null ? FLAME_NODES[activeFlameIndex] : null;

  const activeStarPointData = (isInteractable && selectedStarPointIndex !== null) ? STAR_POINT_NODES[selectedStarPointIndex] : null;

  const activeNodeKey = hoveredNode || pinnedNode;
  const activeNodeData = (!activeFlameData && !activeStarPointData && activeNodeKey) ? SCHOLARLY_NODES[activeNodeKey] : null;

  // Tooltip dynamic screen boundary overflow placement state
  interface TooltipPlacement {
    isRepositioned: boolean; // true = automatically repositioned to the opposite side of the symbol
    shiftX: number;          // horizontal adjustment (in SVG units) to prevent viewport clipping
  }

  const [tooltipPlacements, setTooltipPlacements] = useState<Record<string, TooltipPlacement>>({
    yahweh: { isRepositioned: false, shiftX: 0 },
    lucifer: { isRepositioned: false, shiftX: 0 },
    '76': { isRepositioned: false, shiftX: 0 },
  });

  // Dynamically detects if an active tooltip in #sacredHeptagramSymbol is overflowing the screen boundary
  // and automatically repositions it to the opposite side of the symbol.
  const checkTooltipOverflow = useCallback((nodeKey?: string | null) => {
    const targetKey = nodeKey || (hoveredNode || pinnedNode);
    if (!targetKey || (targetKey !== 'yahweh' && targetKey !== 'lucifer' && targetKey !== '76')) return;

    const tooltipEl = document.getElementById(`heptagram-tooltip-bubble-${targetKey}`);
    const svgEl = document.getElementById('sacredHeptagramSymbol');
    if (!tooltipEl || !svgEl) return;

    const rect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const screenPadding = 16;

    // Detect boundary overflow against screen edges
    const overflowsTop = rect.top < screenPadding;
    const overflowsBottom = rect.bottom > viewportHeight - screenPadding;
    const overflowsLeft = rect.left < screenPadding;
    const overflowsRight = rect.right > viewportWidth - screenPadding;

    setTooltipPlacements((prev) => {
      const current = prev[targetKey] || { isRepositioned: false, shiftX: 0 };
      let newRepositioned = current.isRepositioned;

      // Vertical flip to the opposite side of the symbol:
      if (targetKey === 'yahweh') {
        // Default position is BELOW the node. If it overflows the bottom of the screen, reposition to opposite side (ABOVE).
        if (!current.isRepositioned && overflowsBottom) {
          newRepositioned = true;
        } else if (current.isRepositioned && overflowsTop) {
          newRepositioned = false;
        }
      } else if (targetKey === 'lucifer') {
        // Default position is ABOVE the node. If it overflows the top of the screen, reposition to opposite side (BELOW).
        if (!current.isRepositioned && overflowsTop) {
          newRepositioned = true;
        } else if (current.isRepositioned && overflowsBottom) {
          newRepositioned = false;
        }
      } else if (targetKey === '76') {
        // Default position is ABOVE the center node. If it overflows the top of the screen, reposition to opposite side (BELOW).
        if (!current.isRepositioned && overflowsTop) {
          newRepositioned = true;
        } else if (current.isRepositioned && overflowsBottom) {
          newRepositioned = false;
        }
      }

      // Horizontal boundary adjustment to prevent screen edge clipping on narrow viewports
      const svgRect = svgEl.getBoundingClientRect();
      const svgScaleX = svgRect.width > 0 ? 1000 / svgRect.width : 1;
      let newShiftX = current.shiftX;

      if (overflowsLeft) {
        const deficit = screenPadding - rect.left;
        newShiftX = Math.min(180, (current.shiftX || 0) + deficit * svgScaleX);
      } else if (overflowsRight) {
        const surplus = rect.right - (viewportWidth - screenPadding);
        newShiftX = Math.max(-180, (current.shiftX || 0) - surplus * svgScaleX);
      } else if (!overflowsLeft && !overflowsRight && current.shiftX !== 0) {
        newShiftX = 0;
      }

      if (newRepositioned !== current.isRepositioned || Math.abs(newShiftX - current.shiftX) > 1) {
        return {
          ...prev,
          [targetKey]: { isRepositioned: newRepositioned, shiftX: Math.round(newShiftX) }
        };
      }
      return prev;
    });
  }, [hoveredNode, pinnedNode]);

  // Real-time boundary listener for active tooltips in #sacredHeptagramSymbol
  useEffect(() => {
    const key = hoveredNode || pinnedNode;
    if (!key || (key !== 'yahweh' && key !== 'lucifer' && key !== '76')) return;

    // Immediately schedule boundary overflow check
    const rafId = requestAnimationFrame(() => {
      checkTooltipOverflow(key);
    });
    // Secondary check after layout / CSS scale transition stabilizes
    const timer = setTimeout(() => {
      checkTooltipOverflow(key);
    }, 120);

    const handleResizeOrScroll = () => {
      checkTooltipOverflow(key);
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [hoveredNode, pinnedNode, checkTooltipOverflow]);

  // Derived placement parameters for each symbol tooltip
  const yahwehPlacement = tooltipPlacements.yahweh || { isRepositioned: false, shiftX: 0 };
  const yahwehTranslateY = yahwehPlacement.isRepositioned ? -170 : 48;

  const luciferPlacement = tooltipPlacements.lucifer || { isRepositioned: false, shiftX: 0 };
  const luciferTranslateY = luciferPlacement.isRepositioned ? 48 : -170;

  const centerPlacement = tooltipPlacements['76'] || { isRepositioned: false, shiftX: 0 };
  const centerTranslateY = centerPlacement.isRepositioned ? 60 : -215;

  const getNodeStyle = (nodeId: string) => {
    const isHovered = activeNodeKey === nodeId;
    return {
      scale: isHovered ? 1.25 : 1,
      opacity: (activeNodeKey && !isHovered) || activeFlameData || activeStarPointData ? 0.35 : 1,
      transition: { duration: 0.3 }
    };
  };

  const getCircleStroke = () => {
    if (customStarColor === 'gold') return 'rgba(212, 175, 55, 0.4)';
    if (customStarColor === 'purple') return 'rgba(192, 132, 252, 0.4)';
    if (customStarColor === 'silver') return 'rgba(203, 213, 225, 0.4)';
    return activeTheme.id === 'deep-void' ? 'rgba(192, 132, 252, 0.4)' : activeTheme.id === 'ethereal-silver' ? 'rgba(203, 213, 225, 0.4)' : '#525252';
  };

  const getPolygonStroke = () => {
    if (customStarColor === 'gold') return '#D4AF37';
    if (customStarColor === 'purple') return '#c084fc';
    if (customStarColor === 'silver') return '#cbd5e1';
    return activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#cbd5e1' : '#D4AF37';
  };

  // Connected points to highlighted active or hovered star point
  const highlightedPointIdx = (isInteractable && selectedStarPointIndex !== null) ? selectedStarPointIndex : (isInteractable ? hoveredStarPointIndex : null);
  const connectedVectors = useMemo(() => {
    if (highlightedPointIdx === null || parsedStarPoints.length < 7) return null;
    const len = parsedStarPoints.length;
    const curr = parsedStarPoints[highlightedPointIdx];
    const prev = parsedStarPoints[(highlightedPointIdx + len - 1) % len];
    const next = parsedStarPoints[(highlightedPointIdx + 1) % len];
    return { curr, prev, next, index: highlightedPointIdx };
  }, [highlightedPointIdx, parsedStarPoints]);

  const handleExportPNG = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const svgElement = document.getElementById("sacredHeptagramSymbol");
    if (!svgElement) return;

    try {
      const canvas = await html2canvas(svgElement, {
        backgroundColor: null,
        scale: 4, // High resolution
        logging: false,
      });
      
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = activeTheme.id === 'ethereal-silver' ? '#0f172a' : '#0c0c0e';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ctx.drawImage(canvas, 0, 0);
        
        const url = exportCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "sacred_heptagram_seal.png";
        link.href = url;
        link.click();
      }
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="InteractiveHeptagram relative w-full h-full flex flex-col items-center justify-between p-1">
      {/* Top Left: Interactable Toggle Switch */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-40 flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
        <button
          type="button"
          id="heptagramInteractableToggle"
          onClick={toggleInteractable}
          className={`flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all cursor-pointer select-none ${
            isInteractable
              ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              : "bg-slate-900/60 text-slate-400 border border-white/10 hover:text-slate-200"
          }`}
          title={isInteractable ? "Interactable Mode Active: Click star points to sound resonant Solfeggio tones" : "Interactable Mode Paused: Click to enable point resonance"}
        >
          {isInteractable ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <MousePointerClick className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactable: <strong className="text-amber-200">ON</strong></span>
            </>
          ) : (
            <>
              <span className="inline-flex rounded-full h-2 w-2 bg-slate-600"></span>
              <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Interactable: <span className="text-slate-400">OFF</span></span>
            </>
          )}
        </button>
      </div>

      {/* Top Right: Color Customization & Star Point Audio Indicator */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-40 flex flex-col items-end gap-1.5 p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
        <div className="flex items-center justify-between w-full gap-2 px-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Star Theme</span>
          {audioLevel > 0.05 && (
            <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 font-bold animate-pulse">
              <Activity className="w-2.5 h-2.5 text-amber-400" /> Live
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setCustomStarColor('theme')}
            className={`w-4 h-4 rounded-full border border-white/20 transition-all ${customStarColor === 'theme' ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'} bg-gradient-to-br from-slate-600 to-slate-900`}
            title="Theme Default"
          />
          <button 
            type="button"
            onClick={() => setCustomStarColor('gold')}
            className={`w-4 h-4 rounded-full border border-white/20 transition-all ${customStarColor === 'gold' ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'} bg-[#D4AF37]`}
            title="Gold (Sacred Solar)"
          />
          <button 
            type="button"
            onClick={() => setCustomStarColor('purple')}
            className={`w-4 h-4 rounded-full border border-white/20 transition-all ${customStarColor === 'purple' ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'} bg-[#c084fc]`}
            title="Deep Purple (Astral Gnosis)"
          />
          <button 
            type="button"
            onClick={() => setCustomStarColor('silver')}
            className={`w-4 h-4 rounded-full border border-white/20 transition-all ${customStarColor === 'silver' ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'} bg-[#cbd5e1]`}
            title="Silver (Lunar Reflection)"
          />
        </div>
      </div>

      <motion.div
        id="sacredHeptagramContainer"
        style={{
          width: '100%',
          height: '100%',
          perspective: 1000,
          rotateX: zoomLevel > 1 ? 0 : rotateX,
          rotateY: zoomLevel > 1 ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer origin-center relative flex-1 select-none overflow-hidden"
      >
        <svg 
          id="sacredHeptagramSymbol" 
          viewBox={computedViewBox} 
          className={`w-full h-full max-h-[620px] select-none transition-all duration-150 ${
            zoomLevel > 1 ? (isDraggingPanRef.current ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'
          }`}
          onPointerDown={handleSvgPointerDown}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handleSvgPointerUp}
          onPointerCancel={handleSvgPointerUp}
          style={{ 
            fontFamily: '"Times New Roman", serif', 
            letterSpacing: '2px',
            touchAction: zoomLevel > 1 ? 'none' : 'auto'
          }}
        >
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeTheme.id === 'deep-void' ? '#581c87' : activeTheme.id === 'ethereal-silver' ? '#334155' : '#334155'} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#141416" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="goldRadialTop" cx="500" cy="70" r="250" fx="500" fy="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={activeTheme.id === 'deep-void' ? '#f5f3ff' : activeTheme.id === 'ethereal-silver' ? '#f8fafc' : '#FFECA1'} />
              <stop offset="30%" stopColor={activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#cbd5e1' : '#D4AF37'} />
              <stop offset="70%" stopColor={activeTheme.id === 'deep-void' ? '#6366f1' : activeTheme.id === 'ethereal-silver' ? '#64748b' : '#AA6C39'} />
              <stop offset="100%" stopColor={activeTheme.id === 'deep-void' ? '#1e1b4b' : activeTheme.id === 'ethereal-silver' ? '#0f172a' : '#4A2511'} />
            </radialGradient>
            
            <radialGradient id="goldRadialBottom" cx="500" cy="930" r="250" fx="500" fy="920" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={activeTheme.id === 'deep-void' ? '#f5f3ff' : activeTheme.id === 'ethereal-silver' ? '#f8fafc' : '#FFECA1'} />
              <stop offset="30%" stopColor={activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#cbd5e1' : '#D4AF37'} />
              <stop offset="70%" stopColor={activeTheme.id === 'deep-void' ? '#6366f1' : activeTheme.id === 'ethereal-silver' ? '#64748b' : '#AA6C39'} />
              <stop offset="100%" stopColor={activeTheme.id === 'deep-void' ? '#1e1b4b' : activeTheme.id === 'ethereal-silver' ? '#0f172a' : '#4A2511'} />
            </radialGradient>

            {/* Glowing filter for breathing audio-reactive lines */}
            <filter id="starBreathingGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={4 + audioLevel * 8} result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation={10 + audioLevel * 14} result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* High-intensity Solfeggio beacon filter */}
            <filter id="beaconHaloGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Sacred Tooltip Styling Gradients and Shadows */}
            <linearGradient id="esotericGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFECA1" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#AA6C39" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="esotericAmberBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>

            <filter id="esotericTooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.95" />
            </filter>
          </defs>

          <rect width="1000" height="1000" fill="url(#bgGlow)" />

          {/* Outer Circle Boundary */}
          <circle 
            cx="500" 
            cy="500" 
            r={circleRadius} 
            fill="none" 
            stroke={getCircleStroke()} 
            strokeWidth="3" 
            opacity={0.65 + audioLevel * 0.35}
          />

          {/* Ambient Breathing Underglow for Heptagram Star */}
          <motion.polygon 
            points={starPoints} 
            fill="none" 
            stroke={getPolygonStroke()} 
            strokeWidth={3 + audioLevel * 5}
            strokeOpacity={0.25 + audioLevel * 0.6}
            filter="url(#starBreathingGlow)"
            strokeLinejoin="miter"
            animate={{
              strokeOpacity: [0.35, 0.75 + audioLevel * 0.25, 0.35],
              strokeWidth: [2.5, 4 + audioLevel * 3, 2.5]
            }}
            transition={{
              duration: Math.max(1.2, 3 - audioLevel * 1.8),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Core crisp polygon lines */}
          <polygon 
            points={starPoints} 
            fill="none" 
            stroke={getPolygonStroke()} 
            strokeWidth="2.2" 
            strokeLinejoin="miter" 
            opacity={0.85}
          />

          {/* Dedicated Highlight for Active Connected Star Vectors */}
          {connectedVectors && (
            <g className="pointer-events-none">
              {/* Previous to current vertex vector */}
              <motion.line
                x1={connectedVectors.prev.x}
                y1={connectedVectors.prev.y}
                x2={connectedVectors.curr.x}
                y2={connectedVectors.curr.y}
                stroke={getPolygonStroke()}
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#beaconHaloGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Current to next vertex vector */}
              <motion.line
                x1={connectedVectors.curr.x}
                y1={connectedVectors.curr.y}
                x2={connectedVectors.next.x}
                y2={connectedVectors.next.y}
                stroke={getPolygonStroke()}
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#beaconHaloGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          )}

          {/* Render 7 Star Points Interactive Areas */}
          {parsedStarPoints.map((pos, index) => {
            const starNode = STAR_POINT_NODES[index];
            const isSelected = selectedStarPointIndex === index;
            const isHovered = hoveredStarPointIndex === index;
            const isActive = isSelected || isHovered;

            // Math for outward radiating label (transformations)
            const dx = pos.x - 500;
            const dy = pos.y - 500;
            const angleRad = Math.atan2(dy, dx);
            let angleDeg = (angleRad * 180) / Math.PI;
            
            const textRadius = 40;
            const tx = pos.x + Math.cos(angleRad) * textRadius;
            const ty = pos.y + Math.sin(angleRad) * textRadius;

            let rotDeg = angleDeg;
            let textAnch = "start";
            // Flip text if it's on the left half to keep it readable (not upside down)
            if (angleDeg > 90 || angleDeg < -90) {
              rotDeg += 180;
              textAnch = "end";
            }

            // Compute tailored label geometry for all 7 vertices around the heptagram
            let labelConfig = {
              x: pos.x + 24,
              y: pos.y + 4,
              anchor: "start" as "start" | "middle" | "end",
              rectX: pos.x + 16,
              rectY: pos.y - 12,
              activeRectX: pos.x + 16,
              activeRectY: pos.y - 24,
              rectW: 160,
              activeRectW: 216,
              rectH: 26,
              activeRectH: 48,
            };

            if (index === 0) {
              // 0: Apex Top (Kether)
              labelConfig = {
                x: pos.x,
                y: pos.y - 32,
                anchor: "middle",
                rectX: pos.x - 80,
                rectY: pos.y - 45,
                activeRectX: pos.x - 110,
                activeRectY: pos.y - 68,
                rectW: 160,
                activeRectW: 220,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 1) {
              // 1: Northeast (Chokhmah)
              labelConfig = {
                x: pos.x + 24,
                y: pos.y - 10,
                anchor: "start",
                rectX: pos.x + 16,
                rectY: pos.y - 23,
                activeRectX: pos.x + 16,
                activeRectY: pos.y - 34,
                rectW: 168,
                activeRectW: 220,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 2) {
              // 2: East / Lower East (Binah)
              labelConfig = {
                x: pos.x + 24,
                y: pos.y + 4,
                anchor: "start",
                rectX: pos.x + 16,
                rectY: pos.y - 9,
                activeRectX: pos.x + 16,
                activeRectY: pos.y - 20,
                rectW: 172,
                activeRectW: 224,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 3) {
              // 3: Southeast (Chesed)
              labelConfig = {
                x: pos.x + 22,
                y: pos.y + 26,
                anchor: "start",
                rectX: pos.x + 14,
                rectY: pos.y + 13,
                activeRectX: pos.x + 14,
                activeRectY: pos.y + 2,
                rectW: 164,
                activeRectW: 218,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 4) {
              // 4: Southwest (Gevurah)
              labelConfig = {
                x: pos.x - 22,
                y: pos.y + 26,
                anchor: "end",
                rectX: pos.x - 178,
                rectY: pos.y + 13,
                activeRectX: pos.x - 232,
                activeRectY: pos.y + 2,
                rectW: 164,
                activeRectW: 218,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 5) {
              // 5: West / Lower West (Tiferet)
              labelConfig = {
                x: pos.x - 24,
                y: pos.y + 4,
                anchor: "end",
                rectX: pos.x - 188,
                rectY: pos.y - 9,
                activeRectX: pos.x - 240,
                activeRectY: pos.y - 20,
                rectW: 166,
                activeRectW: 220,
                rectH: 26,
                activeRectH: 48,
              };
            } else if (index === 6) {
              // 6: Northwest (Yesod)
              labelConfig = {
                x: pos.x - 24,
                y: pos.y - 10,
                anchor: "end",
                rectX: pos.x - 184,
                rectY: pos.y - 23,
                activeRectX: pos.x - 236,
                activeRectY: pos.y - 34,
                rectW: 162,
                activeRectW: 216,
                rectH: 26,
                activeRectH: 48,
              };
            }

            return (
              <g 
                key={`star-point-${index}`}
                onMouseEnter={() => setHoveredStarPointIndex(index)}
                onMouseLeave={() => setHoveredStarPointIndex(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarPointClick(index);
                }}
                className="cursor-pointer group"
                id={`starPointNode-${index}`}
              >
                {/* Outward Radiating Hebrew & Transliteration Vertex Label */}
                <text
                  transform={`translate(${tx}, ${ty}) rotate(${rotDeg})`}
                  textAnchor={textAnch as "start" | "end"}
                  fill="rgba(212, 175, 55, 0.45)"
                  fontSize="16"
                  fontWeight="bold"
                  className="pointer-events-none select-none transition-all duration-300 group-hover:fill-[rgba(212,175,55,0.9)]"
                  style={{ fontFamily: 'Georgia, serif', letterSpacing: '3px' }}
                >
                  {starNode?.hebrew} {starNode?.hebrewName}
                </text>

                {/* Generous Hitbox Target */}
                <circle cx={pos.x} cy={pos.y} r={46} fill="transparent" />

                {/* Shockwave ripple when clicked / sounded */}
                {isSelected && (
                  <motion.circle
                    key={`shockwave-${index}-${recentChimeTime}`}
                    cx={pos.x}
                    cy={pos.y}
                    initial={{ r: 8, opacity: 0.9, strokeWidth: 4 }}
                    animate={{ r: 60, opacity: 0, strokeWidth: 0.8 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    fill="none"
                    stroke={getPolygonStroke()}
                  />
                )}

                {/* Rotating Dashed Solfeggio Aura Ring */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 24 : 14}
                  fill={isActive ? (activeTheme.id === 'deep-void' ? 'rgba(192,132,252,0.22)' : 'rgba(212,175,55,0.22)') : 'transparent'}
                  stroke={isActive ? getPolygonStroke() : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? "4,4" : "2,4"}
                  animate={{
                    rotate: isActive ? 360 : 0,
                    scale: isActive ? [1, 1.15, 1] : 1
                  }}
                  transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />

                {/* Outer pulsing glow beacon */}
                {isActive && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={32}
                    fill="none"
                    stroke={getPolygonStroke()}
                    strokeWidth="1.5"
                    strokeOpacity={0.6}
                    animate={{
                      scale: [0.9, 1.3, 0.9],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Central Point Vertex Bead */}
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r={isActive ? 7 : 4.5} 
                  fill={isActive ? '#FFECA1' : getPolygonStroke()} 
                  filter={isActive ? "url(#beaconHaloGlow)" : undefined}
                  className="transition-all duration-300"
                />

                {/* Interactive Hebrew Meanings Text Label (Visible by default, expands on Hover/Click) */}
                <g 
                  className="transition-all duration-300"
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Backdrop Pill */}
                  <rect
                    x={isActive ? labelConfig.activeRectX : labelConfig.rectX}
                    y={isActive ? labelConfig.activeRectY : labelConfig.rectY}
                    width={isActive ? labelConfig.activeRectW : labelConfig.rectW}
                    height={isActive ? labelConfig.activeRectH : labelConfig.rectH}
                    rx={isActive ? 8 : 6}
                    fill={isActive ? "rgba(6, 8, 14, 0.96)" : "rgba(8, 10, 16, 0.82)"}
                    stroke={isActive ? getPolygonStroke() : "rgba(212, 175, 55, 0.35)"}
                    strokeWidth={isActive ? 1.8 : 1}
                    filter={isActive ? "drop-shadow(0 4px 16px rgba(0,0,0,0.95))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.8))"}
                    className="transition-all duration-300"
                  />

                  {!isActive ? (
                    /* Default View: Hebrew glyph + Sefirotic Name & English Meaning */
                    <text
                      x={labelConfig.x}
                      y={labelConfig.y}
                      textAnchor={labelConfig.anchor}
                      className="select-none transition-all duration-300"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <tspan fill="#FFECA1" fontSize="13" fontWeight="bold">
                        {starNode?.hebrew}
                      </tspan>
                      <tspan fill="rgba(255,255,255,0.4)" fontSize="10"> • </tspan>
                      <tspan fill="#f1f5f9" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                        {starNode?.hebrewName}
                      </tspan>
                      <tspan fill="#cbd5e1" fontSize="10.5" fontFamily="sans-serif">
                        {' '}({starNode?.hebrewMeaning.split('/')[0].trim()})
                      </tspan>
                    </text>
                  ) : (
                    /* Expanded Interactive State: Full Hebrew meaning, Transliteration, Solfeggio & Aspect */
                    <g className="select-none transition-all duration-300">
                      {/* Top Header: Hebrew script + Transliteration + Primary Hebrew Meaning */}
                      <text
                        x={labelConfig.x}
                        y={index === 0 ? labelConfig.y - 18 : labelConfig.y - 6}
                        textAnchor={labelConfig.anchor}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        <tspan fill="#FFECA1" fontSize="14" fontWeight="bold">
                          {starNode?.hebrew}
                        </tspan>
                        <tspan fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                          {' '}{starNode?.hebrewName.toUpperCase()}
                        </tspan>
                        <tspan fill={getPolygonStroke()} fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
                          {' '}— {starNode?.hebrewMeaning.split('/')[0].trim()}
                        </tspan>
                      </text>

                      {/* Subtitle: Frequency + Aspect / Sefirotic Correspondence */}
                      <text
                        x={labelConfig.x}
                        y={index === 0 ? labelConfig.y + 1 : labelConfig.y + 13}
                        textAnchor={labelConfig.anchor}
                        fontFamily="sans-serif"
                      >
                        <tspan fill="#fde68a" fontSize="10" fontWeight="bold" fontFamily="monospace">
                          🎵 {starNode?.frequency}
                        </tspan>
                        <tspan fill="rgba(255,255,255,0.4)" fontSize="9"> • </tspan>
                        <tspan fill="#cbd5e1" fontSize="9.5">
                          {starNode?.celestialGate.replace('Gate of ', '').replace('Portal of ', '').replace('Chamber of ', '')}
                        </tspan>
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* Render 12 Interactive Flame Positions */}
          {flamePositions.map((pos, index) => {
            const isSelected = selectedFlameIndex === index;
            const isHovered = hoveredFlameIndex === index;
            const isFlameActive = isSelected || isHovered;
            const flameNode = FLAME_NODES[index];
            const staggerDelay = (index * 0.25) % 3;

            return (
              <motion.g 
                key={`flame-${index}`} 
                transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.angle})`}
                initial={{ scale: 0.85, opacity: 0.7 }}
                animate={{ 
                  scale: isFlameActive ? 1.35 : [0.88, 1.12, 0.94, 1.15, 0.88],
                  opacity: isFlameActive ? 1 : [0.7, 1, 0.8, 0.95, 0.7]
                }}
                transition={{
                  duration: isFlameActive ? 0.25 : 3.6,
                  repeat: isFlameActive ? 0 : Infinity,
                  ease: "easeInOut",
                  delay: isFlameActive ? 0 : staggerDelay
                }}
                onMouseEnter={() => setHoveredFlameIndex(index)}
                onMouseLeave={() => setHoveredFlameIndex(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlameClick(index);
                }}
                className="cursor-pointer group"
              >
                {/* Click target hitbox */}
                <circle r="40" fill="transparent" />

                {/* Continuous pulsing aura ring */}
                <motion.circle
                  r="28"
                  fill={isFlameActive ? "rgba(245, 158, 11, 0.28)" : "rgba(251, 191, 36, 0.08)"}
                  stroke={isFlameActive ? "#f59e0b" : "rgba(245, 158, 11, 0.35)"}
                  strokeWidth={isFlameActive ? "2.5" : "1"}
                  strokeDasharray={isFlameActive ? "none" : "3,3"}
                  animate={{
                    scale: isFlameActive ? [1, 1.3, 1] : [0.85, 1.25, 0.85],
                    opacity: isFlameActive ? [0.6, 1, 0.6] : [0.15, 0.55, 0.15]
                  }}
                  transition={{
                    duration: isFlameActive ? 1.4 : 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: isFlameActive ? 0 : staggerDelay
                  }}
                />

                {/* Flame Graphic */}
                <g transform="translate(-24, -48) scale(1.5)">
                   <path
                      d="M16 0C16 0 8 10.667 8 18.667C8 23.085 11.582 26.667 16 26.667C20.418 26.667 24 23.085 24 18.667C24 10.667 16 0 16 0ZM16 24C13.054 24 10.667 21.613 10.667 18.667C10.667 13.918 16 6.386 16 6.386C16 6.386 21.333 13.918 21.333 18.667C21.333 21.613 18.946 24 16 24Z"
                      fill={isFlameActive ? "#FF3B00" : "#FF6321"}
                    />
                   <motion.path
                      d="M16 10.667C16 10.667 12 16 12 20C12 22.209 13.791 24 16 24C18.209 24 20 22.209 20 20C20 16 16 10.667 16 10.667Z"
                      fill={isFlameActive ? "#FFFFFF" : "#fcd34d"}
                      animate={{
                        opacity: isFlameActive ? [0.9, 1, 0.9] : [0.75, 1, 0.75],
                        scale: isFlameActive ? [1, 1.1, 1] : [0.95, 1.05, 0.95]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: staggerDelay
                      }}
                    />
                </g>

                {/* Roman Numeral Badge on Flame */}
                <text
                  y="20"
                  textAnchor="middle"
                  fill={isFlameActive ? "#fef08a" : "#cbd5e1"}
                  className="text-[11px] font-mono font-extrabold tracking-tight"
                  transform={`rotate(${-pos.angle})`}
                  style={{ textShadow: isFlameActive ? "0 0 8px #f59e0b" : "none" }}
                >
                  {flameNode?.roman}
                </text>
              </motion.g>
            );
          })}

          {/* Scholarly Node Labels */}
          {/* Apocalypse very top */}
          <motion.g 
            transform="translate(500, 80)" 
            onMouseEnter={() => setHoveredNode('apocalypse')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('apocalypse')}
            animate={getNodeStyle('apocalypse')}
            className="cursor-pointer"
          >
            <rect x="-180" y="-40" width="360" height="80" fill="transparent" />
            <text x="0" y="0" textAnchor="middle" fill="#f8fafc" className="text-3xl font-bold uppercase tracking-widest font-serif" style={{ fill: "url(#goldRadialTop)" }}>
              אֲפוֹקָלִיפְסָה
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-semibold">
              APOCALYPSE
            </text>
          </motion.g>

          {/* Apocryphon bottom */}
          <motion.g 
            transform="translate(500, 920)" 
            onMouseEnter={() => setHoveredNode('apocryphon')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('apocryphon')}
            animate={getNodeStyle('apocryphon')}
            className="cursor-pointer"
          >
            <rect x="-180" y="-40" width="360" height="80" fill="transparent" />
            <text x="0" y="0" textAnchor="middle" fill="#f8fafc" className="text-3xl font-bold uppercase tracking-widest font-serif" style={{ fill: "url(#goldRadialBottom)" }}>
              אֲפוֹקְרִיפוֹן
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-semibold">
              APOCRYPHON
            </text>
          </motion.g>

          {/* Apollyon very left */}
          <motion.g 
            transform="translate(60, 500)" 
            onMouseEnter={() => setHoveredNode('apollyon')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('apollyon')}
            animate={getNodeStyle('apollyon')}
            className="cursor-pointer"
          >
            <rect x="-180" y="-50" width="200" height="100" fill="transparent" />
            <text x="0" y="-10" textAnchor="end" fill="#f8fafc" className="text-2xl font-bold uppercase tracking-wider font-serif">
              אֲבַדּוֹן
            </text>
            <text x="0" y="14" textAnchor="end" fill="#64748b" className="text-[10px] font-mono uppercase tracking-widest font-semibold">
              APOLLYON
            </text>
            <text x="0" y="32" textAnchor="end" fill="#f8fafc" className="text-xl font-bold uppercase tracking-wider font-serif">
              כָּבוֹד
            </text>
            <text x="0" y="50" textAnchor="end" fill="#64748b" className="text-[10px] font-mono uppercase tracking-widest font-semibold">
              GLORY
            </text>
          </motion.g>

          {/* Life after Death very right */}
          <motion.g 
            transform="translate(940, 500)" 
            onMouseEnter={() => setHoveredNode('lifeAfterDeath')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('lifeAfterDeath')}
            animate={getNodeStyle('lifeAfterDeath')}
            className="cursor-pointer"
          >
            <rect x="-20" y="-50" width="230" height="100" fill="transparent" />
            <text x="0" y="-10" textAnchor="start" fill="#f8fafc" className="text-2xl font-bold uppercase tracking-wider font-serif">
              חַיִּים לְאַחַר הַמָּוֶת
            </text>
            <text x="0" y="14" textAnchor="start" fill="#64748b" className="text-[10px] font-mono uppercase tracking-widest font-semibold">
              LIFE AFTER DEATH
            </text>
            <text x="0" y="32" textAnchor="start" fill="#f8fafc" className="text-xl font-bold uppercase tracking-wider font-serif">
              כֹּחַ
            </text>
            <text x="0" y="50" textAnchor="start" fill="#64748b" className="text-[10px] font-mono uppercase tracking-widest font-semibold">
              POWER
            </text>
          </motion.g>

          {/* YAHWEH on top */}
          <motion.g 
            id="heptagram-node-yahweh"
            transform="translate(500, 260)" 
            onMouseEnter={() => {
              setDismissedTooltipKey(null);
              setHoveredNode('yahweh');
              requestAnimationFrame(() => checkTooltipOverflow('yahweh'));
            }} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('yahweh')}
            animate={getNodeStyle('yahweh')}
            className={`cursor-pointer esoteric-hover-group ${activeNodeKey === 'yahweh' && dismissedTooltipKey !== 'yahweh' ? 'is-active' : ''} ${dismissedTooltipKey === 'yahweh' ? 'is-dismissed' : ''}`}
          >
            <rect x="-130" y="-35" width="260" height="70" fill="transparent" />
            <g className="esoteric-hover-target">
              <text x="0" y="0" textAnchor="middle" fill="#f1f5f9" className="text-4xl font-bold uppercase tracking-widest font-serif">
                יהוה
              </text>
              <text x="0" y="24" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-semibold">
                YAHWEH
              </text>
            </g>

            {/* Interactive Smooth CSS-Animated Hover Tooltip with Dynamic Screen Boundary Repositioning */}
            <g 
              transform={`translate(${yahwehPlacement.shiftX}, ${yahwehTranslateY})`}
              style={{ transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <g 
                id="heptagram-tooltip-bubble-yahweh" 
                className="esoteric-tooltip-bubble" 
                filter="url(#esotericTooltipShadow)"
                data-repositioned={yahwehPlacement.isRepositioned}
              >
                {/* Dynamic Tooltip Beak: points DOWN to Yahweh if repositioned above; points UP if in default position below */}
                {yahwehPlacement.isRepositioned ? (
                  <polygon
                    points={`${-yahwehPlacement.shiftX - 10},154 ${-yahwehPlacement.shiftX + 10},154 ${-yahwehPlacement.shiftX},162`}
                    fill="#08090e"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                ) : (
                  <polygon
                    points={`${-yahwehPlacement.shiftX - 10},8 ${-yahwehPlacement.shiftX + 10},8 ${-yahwehPlacement.shiftX},0`}
                    fill="#08090e"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                )}
                {/* Card Container */}
                <rect x="-230" y="8" width="460" height="146" rx="10" ry="10" fill="#08090e" stroke="url(#esotericGoldBorder)" strokeWidth="1.6" className="esoteric-tooltip-border-pulse" />
                {/* Decorative Corner Accents */}
                <circle cx="-218" cy="20" r="2.5" fill="#FFECA1" opacity="0.85" />
                <circle cx="-218" cy="142" r="2.5" fill="#FFECA1" opacity="0.85" />
                <circle cx="218" cy="142" r="2.5" fill="#FFECA1" opacity="0.85" />
                {/* Dismiss 'X' Button for Touch & Manual Close */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label="Dismiss YAHWEH tooltip"
                  className="heptagram-tooltip-dismiss-btn"
                  cursor="pointer"
                  onClick={(e) => handleDismissTooltip('yahweh', e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => handleDismissTooltip('yahweh', e)}
                  transform="translate(210, 24)"
                >
                  <rect x="-15" y="-13" width="30" height="26" fill="transparent" />
                  <circle
                    cx="0"
                    cy="0"
                    r="9.5"
                    fill="rgba(15, 23, 42, 0.94)"
                    stroke="rgba(212, 175, 55, 0.65)"
                    strokeWidth="1.2"
                  />
                  <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                </g>
                {/* Header */}
                <text x="-212" y="32" fill="#FFECA1" fontSize="13" fontWeight="bold" fontFamily="serif" letterSpacing="1px">
                  יהוה • YAHWEH (TETRAGRAMMATON)
                </text>
                <text x="192" y="32" textAnchor="end" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {yahwehPlacement.isRepositioned ? "APEX • OPPOSITE SIDE (ABOVE)" : "APEX ZENITH • GEMATRIA 26"}
                </text>
                <line x1="-214" y1="42" x2="214" y2="42" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1" />
                {/* Subtitle */}
                <text x="-212" y="58" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Supreme Sovereign Anchor & Divine Uncreated Will
                </text>
                {/* Esoteric Descriptions */}
                <text x="-212" y="76" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Embodying the unutterable eternal principle (Hayah-Hoveh-Yihyeh: Was, Is, Will Be).
                </text>
                <text x="-212" y="93" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Anchors the supreme celestial zenith of the Sacred Heptagram, channeling unmanifest
                </text>
                <text x="-212" y="110" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Ain Soph Aur to govern divine mercy, cosmic equilibrium, and universal covenant law.
                </text>
                {/* Footer correspondence pill */}
                <rect x="-212" y="122" width="424" height="20" rx="4" fill="rgba(212, 175, 55, 0.12)" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="0.8" />
                <text x="0" y="136" textAnchor="middle" fill="#fde68a" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1px">
                  CORRESPONDENCE: KETHER ELYON • SEVEN CREATIVE DAYS • AIN SOPH AUR
                </text>
              </g>
            </g>
          </motion.g>

          {/* Lucifer at the bottom */}
          <motion.g 
            id="heptagram-node-lucifer"
            transform="translate(500, 750)" 
            onMouseEnter={() => {
              setDismissedTooltipKey(null);
              setHoveredNode('lucifer');
              requestAnimationFrame(() => checkTooltipOverflow('lucifer'));
            }} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('lucifer')}
            animate={getNodeStyle('lucifer')}
            className={`cursor-pointer esoteric-hover-group ${activeNodeKey === 'lucifer' && dismissedTooltipKey !== 'lucifer' ? 'is-active' : ''} ${dismissedTooltipKey === 'lucifer' ? 'is-dismissed' : ''}`}
          >
            <rect x="-130" y="-35" width="260" height="70" fill="transparent" />
            <g className="esoteric-hover-target">
              <text x="0" y="0" textAnchor="middle" fill="#f1f5f9" className="text-4xl font-bold uppercase tracking-widest font-serif">
                לוּצִיפֶר
              </text>
              <text x="0" y="24" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-semibold">
                LUCIFER
              </text>
            </g>

            {/* Interactive Smooth CSS-Animated Hover Tooltip with Dynamic Screen Boundary Repositioning */}
            <g 
              transform={`translate(${luciferPlacement.shiftX}, ${luciferTranslateY})`}
              style={{ transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <g 
                id="heptagram-tooltip-bubble-lucifer" 
                className="esoteric-tooltip-bubble" 
                filter="url(#esotericTooltipShadow)"
                data-repositioned={luciferPlacement.isRepositioned}
              >
                {/* Dynamic Tooltip Beak: points UP to Lucifer if repositioned below; points DOWN if in default position above */}
                {luciferPlacement.isRepositioned ? (
                  <polygon
                    points={`${-luciferPlacement.shiftX - 10},8 ${-luciferPlacement.shiftX + 10},8 ${-luciferPlacement.shiftX},0`}
                    fill="#08090e"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                ) : (
                  <polygon
                    points={`${-luciferPlacement.shiftX - 10},154 ${-luciferPlacement.shiftX + 10},154 ${-luciferPlacement.shiftX},162`}
                    fill="#08090e"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                )}
                {/* Card Container */}
                <rect x="-230" y="8" width="460" height="146" rx="10" ry="10" fill="#08090e" stroke="url(#esotericAmberBorder)" strokeWidth="1.6" className="esoteric-tooltip-border-pulse" />
                {/* Decorative Corner Accents */}
                <circle cx="-218" cy="20" r="2.5" fill="#fed7aa" opacity="0.85" />
                <circle cx="-218" cy="142" r="2.5" fill="#fed7aa" opacity="0.85" />
                <circle cx="218" cy="142" r="2.5" fill="#fed7aa" opacity="0.85" />
                {/* Dismiss 'X' Button for Touch & Manual Close */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label="Dismiss LUCIFER tooltip"
                  className="heptagram-tooltip-dismiss-btn"
                  cursor="pointer"
                  onClick={(e) => handleDismissTooltip('lucifer', e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => handleDismissTooltip('lucifer', e)}
                  transform="translate(210, 24)"
                >
                  <rect x="-15" y="-13" width="30" height="26" fill="transparent" />
                  <circle
                    cx="0"
                    cy="0"
                    r="9.5"
                    fill="rgba(15, 23, 42, 0.94)"
                    stroke="rgba(245, 158, 11, 0.65)"
                    strokeWidth="1.2"
                  />
                  <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                </g>
                {/* Header */}
                <text x="-212" y="32" fill="#fed7aa" fontSize="13" fontWeight="bold" fontFamily="serif" letterSpacing="1px">
                  לוּצִיפֶר • LUCIFER (HEYLEL BEN SHAHAR)
                </text>
                <text x="192" y="32" textAnchor="end" fill="#f97316" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {luciferPlacement.isRepositioned ? "NADIR • OPPOSITE SIDE (BELOW)" : "NADIR BASE • LUX-FERRE"}
                </text>
                <line x1="-214" y1="42" x2="214" y2="42" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1" />
                {/* Subtitle */}
                <text x="-212" y="58" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  The Morning Star — Promethean Intellect & Awakened Will
                </text>
                {/* Esoteric Descriptions */}
                <text x="-212" y="76" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Positioned at the terrestrial nadir threshold (Isaiah 14:12, "Son of the Morning").
                </text>
                <text x="-212" y="93" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Embodies the descending lightning spark of conscious illumination penetrating dense matter
                </text>
                <text x="-212" y="110" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  to ignite individual discernment, wisdom through ordeal, and alchemical resurrection.
                </text>
                {/* Footer correspondence pill */}
                <rect x="-212" y="122" width="424" height="20" rx="4" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.8" />
                <text x="0" y="136" textAnchor="middle" fill="#fdba74" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1px">
                  CORRESPONDENCE: MORNING STAR • APOCRYPHON NADIR • SOLVE ET COAGULA
                </text>
              </g>
            </g>
          </motion.g>

          {/* J on the left */}
          <motion.g 
            transform="translate(230, 500)" 
            onMouseEnter={() => setHoveredNode('j')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('j')}
            animate={getNodeStyle('j')}
            className="cursor-pointer"
          >
            <rect x="-60" y="-50" width="120" height="100" fill="transparent" />
            <text x="0" y="0" textAnchor="middle" fill={activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#cbd5e1' : '#FFECA1'} className="text-5xl font-bold">
              י
            </text>
            <text x="0" y="26" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-bold">
              J
            </text>
          </motion.g>

          {/* B on its right */}
          <motion.g 
            transform="translate(770, 500)" 
            onMouseEnter={() => setHoveredNode('b')} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('b')}
            animate={getNodeStyle('b')}
            className="cursor-pointer"
          >
            <rect x="-60" y="-50" width="120" height="100" fill="transparent" />
            <text x="0" y="0" textAnchor="middle" fill={activeTheme.id === 'deep-void' ? '#c084fc' : activeTheme.id === 'ethereal-silver' ? '#cbd5e1' : '#FFECA1'} className="text-5xl font-bold">
              ב
            </text>
            <text x="0" y="26" textAnchor="middle" fill="#64748b" className="text-xs font-mono tracking-widest font-bold">
              B
            </text>
          </motion.g>

          {/* Center 76 */}
          <motion.g 
            id="heptagram-node-76"
            transform="translate(500, 500)" 
            onMouseEnter={() => {
              setDismissedTooltipKey(null);
              setHoveredNode('76');
              requestAnimationFrame(() => checkTooltipOverflow('76'));
            }} 
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick('76')}
            animate={{
              ...getNodeStyle('76'),
              boxShadow: activeNodeKey === '76' ? ["0 0 20px #fbbf24", "0 0 40px #fbbf24", "0 0 20px #fbbf24"] : ["0 0 10px rgba(0,0,0,0)", "0 0 10px rgba(0,0,0,0)"]
            }}
            className={`cursor-pointer esoteric-hover-group ${activeNodeKey === '76' && dismissedTooltipKey !== '76' ? 'is-active' : ''} ${dismissedTooltipKey === '76' ? 'is-dismissed' : ''}`}
          >
            <g className="esoteric-hover-target">
              <motion.circle 
                r="55" 
                fill="rgba(8, 8, 10, 0.85)" 
                stroke={activeTheme.id === 'deep-void' ? 'rgba(192, 132, 252, 0.35)' : activeTheme.id === 'ethereal-silver' ? 'rgba(203, 213, 225, 0.35)' : 'rgba(212, 175, 55, 0.35)'} 
                strokeWidth="1.5"
                animate={{
                  strokeOpacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <text x="0" y="-3" textAnchor="middle" fill={activeTheme.id === 'deep-void' ? '#f5f3ff' : activeTheme.id === 'ethereal-silver' ? '#fff' : '#FFECA1'} className="text-4xl font-extrabold font-serif tracking-tight">
                76
              </text>
              <text x="0" y="25" textAnchor="middle" fill="#8892b0" className="text-lg font-bold font-serif tracking-wide">
                ע"ו
              </text>
            </g>

            {/* Interactive Smooth CSS-Animated Hover Tooltip with Dynamic Screen Boundary Repositioning */}
            <g 
              transform={`translate(${centerPlacement.shiftX}, ${centerTranslateY})`}
              style={{ transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <g 
                id="heptagram-tooltip-bubble-76" 
                className="esoteric-tooltip-bubble" 
                filter="url(#esotericTooltipShadow)"
                data-repositioned={centerPlacement.isRepositioned}
              >
                {/* Dynamic Tooltip Beak: points UP to 76 circle if repositioned below; points DOWN if in default position above */}
                {centerPlacement.isRepositioned ? (
                  <polygon
                    points={`${-centerPlacement.shiftX - 10},8 ${-centerPlacement.shiftX + 10},8 ${-centerPlacement.shiftX},0`}
                    fill="#08090e"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                ) : (
                  <polygon
                    points={`${-centerPlacement.shiftX - 10},154 ${-centerPlacement.shiftX + 10},154 ${-centerPlacement.shiftX},162`}
                    fill="#08090e"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                )}
                {/* Card Container */}
                <rect x="-230" y="8" width="460" height="146" rx="10" ry="10" fill="#08090e" stroke="url(#esotericGoldBorder)" strokeWidth="1.6" className="esoteric-tooltip-border-pulse" />
                {/* Decorative Corner Accents */}
                <circle cx="-218" cy="20" r="2.5" fill="#FFECA1" opacity="0.85" />
                <circle cx="-218" cy="142" r="2.5" fill="#FFECA1" opacity="0.85" />
                <circle cx="218" cy="142" r="2.5" fill="#FFECA1" opacity="0.85" />
                {/* Dismiss 'X' Button for Touch & Manual Close */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label="Dismiss 76 Center tooltip"
                  className="heptagram-tooltip-dismiss-btn"
                  cursor="pointer"
                  onClick={(e) => handleDismissTooltip('76', e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => handleDismissTooltip('76', e)}
                  transform="translate(210, 24)"
                >
                  <rect x="-15" y="-13" width="30" height="26" fill="transparent" />
                  <circle
                    cx="0"
                    cy="0"
                    r="9.5"
                    fill="rgba(15, 23, 42, 0.94)"
                    stroke="rgba(212, 175, 55, 0.65)"
                    strokeWidth="1.2"
                  />
                  <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#f1f5f9" strokeWidth="1.6" strokeLinecap="round" />
                </g>
                {/* Header */}
                <text x="-212" y="32" fill="#FFECA1" fontSize="13" fontWeight="bold" fontFamily="serif" letterSpacing="1px">
                  ע"ו • SACRED NUMERICAL CENTER (76)
                </text>
                <text x="192" y="32" textAnchor="end" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {centerPlacement.isRepositioned ? "AXIS • OPPOSITE SIDE (BELOW)" : "AXIS MUNDI • GEMATRIA 76"}
                </text>
                <line x1="-214" y1="42" x2="214" y2="42" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1" />
                {/* Subtitle */}
                <text x="-212" y="58" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Harmonic Axis Mundi — Geometric & Metaphysical Fulcrum
                </text>
                {/* Esoteric Descriptions */}
                <text x="-212" y="76" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Composed of Ayin (70) and Vav (6), symbolizing 7 planetary rays × 6 spatial dimensions.
                </text>
                <text x="-212" y="93" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  Operates as the central gravitational nexus linking the 12 outer sacred perimeter flames
                </text>
                <text x="-212" y="110" fill="#cbd5e1" fontSize="9.5" fontFamily="serif">
                  with the inner heptagram matrix, harmonizing supreme divine decree into manifest reality.
                </text>
                {/* Footer correspondence pill */}
                <rect x="-212" y="122" width="424" height="20" rx="4" fill="rgba(212, 175, 55, 0.12)" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="0.8" />
                <text x="0" y="136" textAnchor="middle" fill="#fde68a" fontSize="8.5" fontFamily="monospace" fontWeight="bold" letterSpacing="1px">
                  CORRESPONDENCE: SALAZAR 76 LOGOS • COSMIC EQUILIBRIUM • SEED OF CREATION
                </text>
              </g>
            </g>
          </motion.g>
        </svg>

        {/* Sacred Heptagram Symbol Zoom & Detailed Inspection Controls */}
        <div 
          id="sacredHeptagramZoomControls"
          className="absolute bottom-2 left-2 z-50 flex items-center gap-1 p-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] select-none text-xs"
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            id="sacredHeptagramZoomOutBtn"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.75}
            className="w-7 h-7 rounded flex items-center justify-center bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Level Readout / Click to Reset */}
          <button
            type="button"
            id="sacredHeptagramZoomIndicator"
            onClick={handleResetZoom}
            className="px-2 h-7 rounded flex items-center justify-center bg-slate-950/70 hover:bg-amber-500/10 text-amber-300 font-mono text-[11px] font-bold border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer min-w-[42px]"
            title={zoomLevel !== 1 ? "Click to reset to 100%" : "Zoom Level: 100%"}
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            id="sacredHeptagramZoomInBtn"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3.0}
            className="w-7 h-7 rounded flex items-center justify-center bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom & Center Button (Only shown when zoomed) */}
          {zoomLevel !== 1 && (
            <button
              type="button"
              id="sacredHeptagramZoomResetBtn"
              onClick={handleResetZoom}
              className="w-7 h-7 rounded flex items-center justify-center bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer ml-0.5"
              title="Reset Zoom & Center (100%)"
              aria-label="Reset Zoom and Center"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {/* Pan hint when zoomed in */}
          {zoomLevel > 1 && (
            <span className="hidden sm:inline-flex text-[9px] font-mono text-slate-400 pl-1 pr-1 border-l border-white/10 whitespace-nowrap">
              Drag to pan
            </span>
          )}
        </div>

        {/* Share Seal Button */}
        <button
          onClick={handleExportPNG}
          className="absolute bottom-2 right-2 z-50 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300/80 hover:text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-md flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          title="Export Seal as PNG"
        >
          <Download className="w-3.5 h-3.5" />
          Share Seal
        </button>
      </motion.div>

      {/* 7 Sacred Star Points & 12 Flames Unified Navigation Bars */}
      <div className="w-full max-w-xl mx-auto my-1.5 flex flex-col gap-1.5 px-2">
        {/* 7 Star Points Quick-Resonance Bar */}
        <div className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-[#090b10]/90 border border-amber-500/30 text-xs font-mono shadow-md backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-amber-300 shrink-0">
            <button
              type="button"
              onClick={toggleInteractable}
              className={`p-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                isInteractable 
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40" 
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
              title={isInteractable ? "Interactable Mode Active (Click to pause)" : "Interactable Mode Paused (Click to activate)"}
            >
              {isInteractable ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            <span className="font-bold text-[10px] uppercase tracking-wider hidden sm:inline">
              7 Star Chimes {isInteractable ? '(Active)' : '(Muted)'}:
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {STAR_POINT_NODES.map((pt, idx) => {
              const isSelected = isInteractable && selectedStarPointIndex === idx;
              return (
                <button
                  key={`star-quick-bar-${pt.id}`}
                  type="button"
                  onClick={() => {
                    if (!isInteractable) {
                      setIsInteractable(true);
                      onInteractableChange?.(true);
                    }
                    handleStarPointClick(idx);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold shadow-lg border border-amber-200 scale-105"
                      : isInteractable 
                        ? "bg-amber-950/25 hover:bg-amber-500/20 text-slate-300 border border-amber-500/20"
                        : "bg-slate-900/40 text-slate-500 border border-white/5 hover:text-slate-300"
                  }`}
                  title={`Star Point ${idx + 1}: ${pt.title} (${pt.frequency})`}
                >
                  <span>{pt.hebrew}</span>
                  <span className="opacity-80 text-[9px]">({pt.freqHz}Hz)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12 Sacred Flames Quick-Jump Bar */}
        <div className="w-full flex items-center justify-between gap-1.5 px-3 py-1 rounded-xl bg-[#0d0e12]/80 border border-amber-500/20 text-xs font-mono shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-amber-300 shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[10px] uppercase tracking-wider hidden sm:inline">12 Flames:</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {FLAME_NODES.map((f, idx) => {
              const isSelected = selectedFlameIndex === idx;
              return (
                <button
                  key={`quick-bar-${f.id}`}
                  type="button"
                  onClick={() => handleFlameClick(idx)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md border border-amber-300 scale-105"
                      : "bg-amber-950/20 hover:bg-amber-500/15 text-slate-400 border border-amber-500/15"
                  }`}
                  title={`Flame ${f.roman}: ${f.title}`}
                >
                  {f.roman}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Star Point Resonance Card Modal / Tooltip */}
      <AnimatePresence>
        {activeStarPointData && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-12 left-2 right-2 z-30 p-4 sm:p-5 rounded-2xl bg-[#090b10]/98 backdrop-blur-2xl border border-amber-400/60 shadow-[0_10px_45px_rgba(0,0,0,0.9)] text-slate-100 pointer-events-auto max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/30 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-600/30 border border-amber-400/60 text-amber-300 shrink-0 shadow-inner">
                  <Volume2 className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      STAR POINT {activeStarPointData.index + 1} OF VII • {activeStarPointData.frequency}
                    </span>
                    <span className="text-lg font-serif font-bold text-amber-200 tracking-wide">
                      {activeStarPointData.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs font-serif text-slate-300 flex-wrap">
                    <span className="font-bold text-amber-300 text-sm">{activeStarPointData.hebrew}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-semibold text-amber-100 font-sans">{activeStarPointData.hebrewName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="italic text-slate-300 font-sans">Meaning: <strong className="text-amber-200 not-italic">{activeStarPointData.hebrewMeaning}</strong></span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300/90 font-mono text-[11px]">{activeStarPointData.aspect}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls & Navigation */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Re-sound tone button */}
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playStarPointResonance(activeStarPointData.index, activeStarPointData.freqHz);
                    setRecentChimeTime(Date.now());
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Play Localized Resonant Tone"
                >
                  <Music className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  <span className="hidden sm:inline">Re-Sound</span>
                </button>

                <div className="flex items-center bg-black/60 rounded-lg border border-amber-500/30 p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const prev = (activeStarPointData.index + 6) % 7;
                      handleStarPointClick(prev);
                    }}
                    className="p-1 rounded hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer"
                    title="Previous Star Point"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 text-amber-400 font-bold">
                    {activeStarPointData.index + 1}/7
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (activeStarPointData.index + 1) % 7;
                      handleStarPointClick(next);
                    }}
                    className="p-1 rounded hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer"
                    title="Next Star Point"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStarPointIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Resonance Card"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              {/* Solfeggio & Harmonic Significance */}
              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] uppercase tracking-wider mb-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span>Solfeggio Frequency Resonance</span>
                  </div>
                  <p className="text-slate-300 font-serif italic">
                    "{activeStarPointData.solfeggioSignificance}"
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Celestial Sphere:</span>
                  <span className="text-amber-300 font-semibold">{activeStarPointData.planetaryCorrespondence}</span>
                </div>
              </div>

              {/* Esoteric Meaning */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[10px] uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
                    <span>Heptagram Vector Significance</span>
                  </div>
                  <p className="text-slate-200 font-serif">
                    {activeStarPointData.esotericMeaning}
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400/90 flex items-center justify-between">
                  <span>Elemental Attunement:</span>
                  <span className="text-amber-200 font-semibold">{activeStarPointData.element}</span>
                </div>
              </div>
            </div>

            {/* Quick Star Point Jump Tabs */}
            <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                <Crosshair className="w-3 h-3 text-amber-400" /> Click to resound any star vertex:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                {STAR_POINT_NODES.map((pt, idx) => (
                  <button
                    key={`point-btn-${pt.id}`}
                    type="button"
                    onClick={() => handleStarPointClick(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      activeStarPointData.index === idx
                        ? "bg-amber-400 text-black font-extrabold shadow-md scale-105"
                        : "bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10"
                    }`}
                    title={`${pt.title} (${pt.frequency})`}
                  >
                    {pt.hebrew}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Sacred Flame Click-to-Expand Tooltip Overlay Card */}
      <AnimatePresence>
        {activeFlameData && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-12 left-2 right-2 z-30 p-4 sm:p-5 rounded-2xl bg-[#090a0e]/95 backdrop-blur-2xl border border-amber-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.85)] text-slate-100 pointer-events-auto max-w-2xl mx-auto"
          >
            {/* Flame Header */}
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/30 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/50 text-amber-400 shrink-0 shadow-inner">
                  <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                      FLAME {activeFlameData.roman} OF XII
                    </span>
                    <span className="text-lg font-serif font-bold text-amber-200 tracking-wide">
                      {activeFlameData.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs font-serif text-slate-300 flex-wrap">
                    <span className="font-bold text-amber-400">{activeFlameData.hebrew}</span>
                    <span className="text-slate-500">•</span>
                    <span className="italic text-slate-400">({activeFlameData.transliteration})</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300/90 font-mono text-[11px]">{activeFlameData.hour}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls & Navigation */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center bg-black/60 rounded-lg border border-amber-500/30 p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const prev = (activeFlameData.index + 11) % 12;
                      setSelectedFlameIndex(prev);
                    }}
                    className="p-1 rounded hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer"
                    title="Previous Flame"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 text-amber-400/90 font-bold">
                    {activeFlameData.index + 1}/12
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (activeFlameData.index + 1) % 12;
                      setSelectedFlameIndex(next);
                    }}
                    className="p-1 rounded hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer"
                    title="Next Flame"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFlameIndex(null);
                    setHoveredFlameIndex(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Flame Tooltip"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Flame Content Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              {/* Historical Meaning */}
              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] uppercase tracking-wider mb-1.5">
                    <ScrollText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Historical & Textual Origin</span>
                  </div>
                  <p className="text-slate-300 font-serif italic">
                    "{activeFlameData.historicalMeaning}"
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Resonance:</span>
                  <span className="text-amber-300 font-semibold">{activeFlameData.element}</span>
                </div>
              </div>

              {/* Symbolic Meaning */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[10px] uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
                    <span>Symbolic & Esoteric Mystery</span>
                  </div>
                  <p className="text-slate-200 font-serif">
                    {activeFlameData.symbolicMeaning}
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400/90 flex items-center justify-between">
                  <span>Salazar Arcana:</span>
                  <span className="text-amber-200 font-semibold">12-Fold Sacred Flame Matrix</span>
                </div>
              </div>
            </div>

            {/* Quick-Jump Selector in Tooltip */}
            <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                <Crosshair className="w-3 h-3 text-amber-400" /> Click any flame position:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                {FLAME_NODES.map((f, idx) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFlameIndex(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      activeFlameData.index === idx
                        ? "bg-amber-500 text-black font-extrabold shadow-md scale-105"
                        : "bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10"
                    }`}
                    title={`${f.title} (${f.hour})`}
                  >
                    {f.roman}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scholarly Node Tooltip Overlay Card (when no flame tooltip and no star point tooltip is active) */}
      <AnimatePresence>
        {!activeFlameData && !activeStarPointData && activeNodeData && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 z-30 p-4 sm:p-5 rounded-xl bg-[#09090d]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-slate-200 pointer-events-auto max-w-xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-2.5 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl font-serif font-bold text-amber-200 tracking-wide">
                      {activeNodeData.hebrew}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      ({activeNodeData.transliteration})
                    </span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-amber-400/90 tracking-wider uppercase mt-0.5 flex items-center gap-2">
                    <span>{activeNodeData.english}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-normal">{activeNodeData.position}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {pinnedNode === activeNodeKey && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    Pinned
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setHoveredNode(null);
                    setPinnedNode(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Tooltip"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-2 text-xs font-serif leading-relaxed text-slate-300">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-0.5">
                  Scholarly Definition
                </span>
                <p className="italic bg-black/40 p-2 rounded-lg border border-white/5">
                  "{activeNodeData.definition}"
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-300 font-bold block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Salazar Scholarship Context
                </span>
                <p className="text-slate-300 bg-indigo-950/20 p-2 rounded-lg border border-indigo-500/20">
                  {activeNodeData.context}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" /> Click label to pin/unpin definition
              </span>
              <span className="text-amber-500/80">Salazar Grimoire Archive</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function areInteractiveHeptagramPropsEqual(
  prevProps: InteractiveHeptagramProps,
  nextProps: InteractiveHeptagramProps
): boolean {
  if (prevProps.isSpeaking !== nextProps.isSpeaking) return false;
  if (prevProps.soundEnabled !== nextProps.soundEnabled) return false;
  if (prevProps.interactable !== nextProps.interactable) return false;
  if (prevProps.circleRadius !== nextProps.circleRadius) return false;
  if (prevProps.starPoints !== nextProps.starPoints) return false;
  if (prevProps.onInteractableChange !== nextProps.onInteractableChange) return false;

  const prevThemeId = prevProps.activeTheme?.id || prevProps.activeTheme;
  const nextThemeId = nextProps.activeTheme?.id || nextProps.activeTheme;
  if (prevThemeId !== nextThemeId) return false;

  if (prevProps.flamePositions !== nextProps.flamePositions) {
    if (!prevProps.flamePositions || !nextProps.flamePositions) return false;
    if (prevProps.flamePositions.length !== nextProps.flamePositions.length) return false;
  }

  return true;
}

export const InteractiveHeptagram = React.memo(
  InteractiveHeptagramBase,
  areInteractiveHeptagramPropsEqual
);
