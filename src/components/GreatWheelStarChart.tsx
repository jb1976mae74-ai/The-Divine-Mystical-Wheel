import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Sparkles, Calendar, BookOpen, Search, Filter, 
  RotateCw, Play, Pause, Info, Layers, Eye, Shield, Award, X,
  Share2, Download, Copy, Check, ExternalLink, Image as ImageIcon, Send, RefreshCw
} from 'lucide-react';

export interface ZodiacSign {
  id: string;
  name: string;
  glyph: string;
  hebrew: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  color: string;
  startDeg: number;
  endDeg: number;
  constellationStars: { name: string; mag: number; deg: number; r: number }[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    glyph: '♈',
    hebrew: 'טָלֶה',
    element: 'Fire',
    color: '#ef4444',
    startDeg: 0,
    endDeg: 30,
    constellationStars: [
      { name: 'Hamal', mag: 2.0, deg: 7, r: 160 },
      { name: 'Sheratan', mag: 2.6, deg: 14, r: 175 },
      { name: 'Mesarthim', mag: 3.8, deg: 22, r: 168 }
    ]
  },
  {
    id: 'taurus',
    name: 'Taurus',
    glyph: '♉',
    hebrew: 'שׁוֹר',
    element: 'Earth',
    color: '#10b981',
    startDeg: 30,
    endDeg: 60,
    constellationStars: [
      { name: 'Aldebaran', mag: 0.85, deg: 39, r: 165 },
      { name: 'Elnath', mag: 1.6, deg: 52, r: 180 },
      { name: 'Alcyone (Pleiades)', mag: 2.8, deg: 45, r: 155 }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    glyph: '♊',
    hebrew: 'תְּאוֹמִים',
    element: 'Air',
    color: '#38bdf8',
    startDeg: 60,
    endDeg: 90,
    constellationStars: [
      { name: 'Castor', mag: 1.58, deg: 70, r: 175 },
      { name: 'Pollux', mag: 1.14, deg: 78, r: 162 },
      { name: 'Alhena', mag: 1.9, deg: 85, r: 150 }
    ]
  },
  {
    id: 'cancer',
    name: 'Cancer',
    glyph: '♋',
    hebrew: 'סַרְטָן',
    element: 'Water',
    color: '#06b6d4',
    startDeg: 90,
    endDeg: 120,
    constellationStars: [
      { name: 'Acubens', mag: 4.2, deg: 98, r: 160 },
      { name: 'Tarf', mag: 3.5, deg: 108, r: 170 },
      { name: 'Asellus Borealis', mag: 4.6, deg: 114, r: 155 }
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    glyph: '♌',
    hebrew: 'אַרְיֵה',
    element: 'Fire',
    color: '#f59e0b',
    startDeg: 120,
    endDeg: 150,
    constellationStars: [
      { name: 'Regulus', mag: 1.35, deg: 129, r: 165 },
      { name: 'Denebola', mag: 2.1, deg: 144, r: 178 },
      { name: 'Algieba', mag: 2.0, deg: 135, r: 152 }
    ]
  },
  {
    id: 'virgo',
    name: 'Virgo',
    glyph: '♍',
    hebrew: 'בְּתוּלָה',
    element: 'Earth',
    color: '#34d399',
    startDeg: 150,
    endDeg: 180,
    constellationStars: [
      { name: 'Spica', mag: 0.98, deg: 163, r: 170 },
      { name: 'Vindemiatrix', mag: 2.8, deg: 158, r: 150 },
      { name: 'Porrima', mag: 2.7, deg: 172, r: 162 }
    ]
  },
  {
    id: 'libra',
    name: 'Libra',
    glyph: '♎',
    hebrew: 'מֹאזְנַיִם',
    element: 'Air',
    color: '#60a5fa',
    startDeg: 180,
    endDeg: 210,
    constellationStars: [
      { name: 'Zubeneschamali', mag: 2.6, deg: 192, r: 172 },
      { name: 'Zubenelgenubi', mag: 2.7, deg: 185, r: 160 },
      { name: 'Brachium', mag: 3.2, deg: 202, r: 150 }
    ]
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    glyph: '♏',
    hebrew: 'עַקְרָב',
    element: 'Water',
    color: '#a855f7',
    startDeg: 210,
    endDeg: 240,
    constellationStars: [
      { name: 'Antares', mag: 1.06, deg: 220, r: 165 },
      { name: 'Shaula', mag: 1.6, deg: 235, r: 178 },
      { name: 'Sargas', mag: 1.8, deg: 228, r: 152 }
    ]
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    glyph: '♐',
    hebrew: 'קַשָּׁת',
    element: 'Fire',
    color: '#fb923c',
    startDeg: 240,
    endDeg: 270,
    constellationStars: [
      { name: 'Kaus Australis', mag: 1.8, deg: 250, r: 168 },
      { name: 'Nunki', mag: 2.0, deg: 262, r: 175 },
      { name: 'Ascella', mag: 2.6, deg: 255, r: 155 }
    ]
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    glyph: '♑',
    hebrew: 'גְּדִי',
    element: 'Earth',
    color: '#059669',
    startDeg: 270,
    endDeg: 300,
    constellationStars: [
      { name: 'Deneb Algedi', mag: 2.8, deg: 288, r: 172 },
      { name: 'Dabih', mag: 3.0, deg: 278, r: 160 },
      { name: 'Algedi', mag: 3.5, deg: 295, r: 150 }
    ]
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    glyph: '♒',
    hebrew: 'דְּלִי',
    element: 'Air',
    color: '#38bdf8',
    startDeg: 300,
    endDeg: 330,
    constellationStars: [
      { name: 'Sadalsuud', mag: 2.9, deg: 312, r: 168 },
      { name: 'Sadalmelik', mag: 2.95, deg: 305, r: 158 },
      { name: 'Skat', mag: 3.2, deg: 322, r: 176 }
    ]
  },
  {
    id: 'pisces',
    name: 'Pisces',
    glyph: '♓',
    hebrew: 'דָּגִים',
    element: 'Water',
    color: '#6366f1',
    startDeg: 330,
    endDeg: 360,
    constellationStars: [
      { name: 'Alrescha', mag: 3.8, deg: 342, r: 165 },
      { name: 'Fum alsamakah', mag: 4.5, deg: 352, r: 175 },
      { name: 'Linteum', mag: 4.2, deg: 335, r: 152 }
    ]
  }
];

export interface CelestialBody {
  id: string;
  name: string;
  glyph: string;
  deg: number;
  sign: string;
  speed: string;
  significance: string;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  hebrewTitle?: string;
  epoch: 'Ancient' | 'Classical' | 'Medieval' | 'Renaissance' | 'Modern';
  zodiacSign: string;
  deg: number;
  summary: string;
  astrologicalContext: string;
  scripturalReference?: string;
  gematriaNote?: string;
  connectedStars: string[];
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'solomonic_temple',
    year: -957,
    yearLabel: '957 BCE',
    title: 'Dedication of Solomonic Temple',
    hebrewTitle: 'חֲנֻכַּת בֵּית הַמִּקְדָּשׁ',
    epoch: 'Ancient',
    zodiacSign: 'Leo',
    deg: 135,
    summary: 'King Solomon dedicates the First Temple in Jerusalem. The Shekinah divine cloud fills the Holy of Holies during autumn feast alignments.',
    astrologicalContext: 'Aligned with Regulus (the Royal Star of Leo), symbolizing sovereign divine authority and solar stability anchoring mortal worship.',
    scripturalReference: '1 Kings 8:10-11 — "The cloud filled the house of YHWH, so that priests could not stand to minister..."',
    gematriaNote: 'Gematria of Mikdash (מִקְדָּשׁ) = 444, reflecting sacred geometry dimensions.',
    connectedStars: ['Regulus', 'Algieba']
  },
  {
    id: 'edict_cyrus',
    year: -538,
    yearLabel: '538 BCE',
    title: 'Edict of Cyrus & Return from Babylon',
    hebrewTitle: 'כֹּרֶשׁ וְשִׁיבַת צִיּוֹן',
    epoch: 'Ancient',
    zodiacSign: 'Sagittarius',
    deg: 250,
    summary: 'Cyrus the Great issues the royal decree permitting exiled Israelites to return to Zion and rebuild YHWH\'s sanctuary.',
    astrologicalContext: 'Sagittarius Jupiter trigon alignment, marking expansive liberation, philosophical return, and royal covenant restoration.',
    scripturalReference: 'Ezra 1:1-3 — "YHWH stirred up the spirit of Cyrus king of Persia..."',
    gematriaNote: 'Cyrus (כּוֹרֶשׁ) = 526, aligning with prophetic jubilee intervals.',
    connectedStars: ['Kaus Australis', 'Nunki']
  },
  {
    id: 'septuagint_alexandria',
    year: -285,
    yearLabel: '285 BCE',
    title: 'Septuagint Concordance in Alexandria',
    hebrewTitle: 'תרגום השבעים',
    epoch: 'Classical',
    zodiacSign: 'Gemini',
    deg: 75,
    summary: 'Seventy-two scholars translate the Hebrew Torah into Koine Greek in Ptolemaic Alexandria, bridging Semitic and Hellenistic worlds.',
    astrologicalContext: 'Castor and Pollux dual alignment in Gemini, representing the twin poles of Hebrew scriptural wisdom and Greek philosophical language.',
    scripturalReference: 'Letter of Aristeas & Philo Vita Mosis II — Harmonious divine inspiration across translation chambers.',
    gematriaNote: '72 Scholars (ע"ב) corresponds to the 72-letter Divine Name Shem HaMephorash.',
    connectedStars: ['Castor', 'Pollux']
  },
  {
    id: 'edict_milan',
    year: 313,
    yearLabel: '313 CE',
    title: 'Edict of Milan & Freedom of Faith',
    hebrewTitle: 'צו מילאנו',
    epoch: 'Classical',
    zodiacSign: 'Pisces',
    deg: 340,
    summary: 'Emperors Constantine and Licinius declare religious tolerance across the Roman Empire, ending centuries of catacomb persecution.',
    astrologicalContext: 'Dawn of the Piscean Age (Ichthys symbol), with Jupiter and Saturn forming a protective water sign trine over imperial decree.',
    scripturalReference: 'Lactantius De Mortibus Persecutorum XLVIII — Granting unrestricted freedom to worship.',
    gematriaNote: 'Chi-Rho (ΧΡ) monogram alignment with celestial cross axes.',
    connectedStars: ['Alrescha', 'Fum alsamakah']
  },
  {
    id: 'council_nicaea',
    year: 325,
    yearLabel: '325 CE',
    title: 'First Council of Nicaea & Canon',
    hebrewTitle: 'וועידת ניקאה',
    epoch: 'Classical',
    zodiacSign: 'Cancer',
    deg: 105,
    summary: 'Ecumenical bishops assemble under Constantine to codify the Nicene Creed, fix Easter calendar rules, and unify canonical scripture.',
    astrologicalContext: 'Summer Solstice Sun in Cancer, marking the apex of light and institutional fortification of theological doctrine.',
    scripturalReference: 'Eusebius Vita Constantini III — Defining the eternal substance (Homoousios) of divine light.',
    gematriaNote: '318 Bishops present = Gematria of Eliezer (אֱלִיעֶזֶר), Abraham\'s trained house steward.',
    connectedStars: ['Acubens', 'Asellus Borealis']
  },
  {
    id: 'florentine_hermetica',
    year: 1453,
    yearLabel: '1453 CE',
    title: 'Byzantine Exodus & Hermetic Revival',
    hebrewTitle: 'תחיית ההרמטיקה בפרנצה',
    epoch: 'Renaissance',
    zodiacSign: 'Scorpio',
    deg: 215,
    summary: 'Following the fall of Constantinople, Greek manuscripts flood Florence. Cosimo de\' Medici orders Marsilio Ficino to translate the Corpus Hermeticum.',
    astrologicalContext: 'Scorpio occultation with Antares (the Scorpion Heart), representing deep unearthing of hidden esoteric mysteries and rebirth of ancient gnosis.',
    scripturalReference: 'Pimander & Asclepius codices — "As above, so below; as within, so without."',
    gematriaNote: 'Hermes Trismegistus (Three-Times-Great) matches 3x radial star wheel geometry.',
    connectedStars: ['Antares', 'Shaula']
  },
  {
    id: 'gutenberg_bible',
    year: 1455,
    yearLabel: '1455 CE',
    title: 'Gutenberg Bible Printed at Mainz',
    hebrewTitle: 'הדפסת תנ"ך גוטנברג',
    epoch: 'Renaissance',
    zodiacSign: 'Aquarius',
    deg: 315,
    summary: 'Johannes Gutenberg completes the 42-line Latin Vulgate Bible, launching the moveable-type printing revolution across Western civilization.',
    astrologicalContext: 'Aquarian Water-Bearer archetype: pouring the sacred stream of scriptural text freely unto all mankind.',
    scripturalReference: 'Isaiah 11:9 — "For the earth shall be full of the knowledge of YHWH as the waters cover the sea."',
    gematriaNote: '42 lines per column corresponds to the 42-Letter Divine Name in Kabbalistic tradition.',
    connectedStars: ['Sadalsuud', 'Sadalmelik']
  },
  {
    id: 'kjv_commission',
    year: 1604,
    yearLabel: '1604 CE',
    title: 'King James Bible Commission',
    hebrewTitle: 'תרגום המלך ג\'יימס',
    epoch: 'Renaissance',
    zodiacSign: 'Sagittarius',
    deg: 260,
    summary: 'King James I convenes the Hampton Court Conference, appointing 47 master scholars to craft the definitive English translation of Holy Scripture.',
    astrologicalContext: 'Great Fiery Conjunction in Sagittarius, inspiring epic poetic grandeur and majestic linguistic resonance.',
    scripturalReference: '1604 Royal Warrant — "One uniform translation, compact and true to original Hebrew and Greek texts."',
    gematriaNote: '47 translators organized in 6 companies, mirroring the 6 wings of Seraphim.',
    connectedStars: ['Kaus Australis', 'Ascella']
  },
  {
    id: 'nag_hammadi',
    year: 1945,
    yearLabel: '1945 CE',
    title: 'Nag Hammadi Gnostic Codices Unburied',
    hebrewTitle: 'גילוי ספרי נג חמאדי',
    epoch: 'Modern',
    zodiacSign: 'Capricorn',
    deg: 285,
    summary: 'Egyptian farmers unearth 13 leather-bound papyrus codices buried in a sealed jar near Jabal al-Tarif, revealing lost Gnostic Gospels.',
    astrologicalContext: 'Capricorn Saturnian earth vaulting: subterranean preservation breaking open to reveal forgotten early spiritual treatises.',
    scripturalReference: 'Gospel of Thomas 108 — "He who drinks from my mouth will become like me, and I shall become he..."',
    gematriaNote: '13 Codices = Gematria of Echad (אֶחָד - Unity) and Ahavah (אַהֲבָה - Love).',
    connectedStars: ['Deneb Algedi', 'Dabih']
  },
  {
    id: 'dead_sea_scrolls',
    year: 1947,
    yearLabel: '1947 CE',
    title: 'Discovery of Dead Sea Scrolls at Qumran',
    hebrewTitle: 'גילוי מגילות ים המלח',
    epoch: 'Modern',
    zodiacSign: 'Scorpio',
    deg: 225,
    summary: 'Bedouin shepherds discover 11 caves overlooking the Dead Sea containing thousands of ancient Hebrew biblical and sectarian scrolls.',
    astrologicalContext: 'Scorpio-Aquarius planetary axis, unveiling the subterranean Essene library preserved for two millennia in desert clay jars.',
    scripturalReference: 'The War Scroll (1QM) & Community Rule — "Children of Light versus Children of Darkness."',
    gematriaNote: 'Qumran Cave 4 contained over 15,000 fragments from 200 biblical manuscripts.',
    connectedStars: ['Antares', 'Sargas']
  },
  {
    id: 'sinaiticus_discovery',
    year: 1859,
    yearLabel: '1859 CE',
    title: 'Codex Sinaiticus Unveiling at Mt. Sinai',
    hebrewTitle: 'גילוי קודקס סינאיטיקוס',
    epoch: 'Modern',
    zodiacSign: 'Virgo',
    deg: 165,
    summary: 'Constantin von Tischendorf recovers the 4th-century Codex Sinaiticus at Saint Catherine\'s Monastery, the oldest complete New Testament in Greek.',
    astrologicalContext: 'Virgo analytical precision: textual criticism restoring original scriptural readings under the star Spica.',
    scripturalReference: '4th-Century Codex including Shepherd of Hermas & Epistle of Barnabas.',
    gematriaNote: '346 vellum leaves preserved through desert dryness.',
    connectedStars: ['Spica', 'Porrima']
  },
  {
    id: 'aetheric_salazar_age',
    year: 2026,
    yearLabel: '2026 CE',
    title: 'Great Wheel Conjunction & Salazar Synthesis',
    hebrewTitle: 'עידן האתר ומחקר סלזאר',
    epoch: 'Modern',
    zodiacSign: 'Aquarius',
    deg: 305,
    summary: 'Modern digital hermeneutics and AI studio scholarship synthesize ancient scriptural, apocryphal, and astrological wisdom into an interactive living matrix.',
    astrologicalContext: 'Aquarian Age Planetary Conjunction: digital light networks unifying sacred history with real-time celestial tracking.',
    scripturalReference: 'Apocryphon & Salazar Archives — "Unveiling what was concealed, bringing light to hidden spheres."',
    gematriaNote: '76 Central Nucleus = Synthesis of 7 Planetary Spheres and 6 Spatial Vectors.',
    connectedStars: ['Sadalsuud', 'Sadalmelik']
  }
];

export default function GreatWheelStarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter & Control states
  const [selectedEpoch, setSelectedEpoch] = useState<string>('All');
  const [selectedElement, setSelectedElement] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(HISTORICAL_EVENTS[0]);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  
  // Display Toggles
  const [showAspectLines, setShowAspectLines] = useState<boolean>(true);
  const [showCurrentSky, setShowCurrentSky] = useState<boolean>(true);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // Share & Image Export States
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Convert current D3 SVG star chart configuration into high-resolution PNG image
  const generateStarChartImage = async (width = 1200, height = 1200): Promise<string> => {
    if (!svgRef.current) throw new Error("SVG reference missing");

    const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', `${width}`);
    clonedSvg.setAttribute('height', `${height}`);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clonedSvg);

    if (!svgString.includes('xmlns=')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          return reject("Canvas 2D context failed");
        }

        // Draw radial cosmic background
        const grad = ctx.createRadialGradient(width/2, height/2, 40, width/2, height/2, width/2);
        grad.addColorStop(0, '#0c0a14');
        grad.addColorStop(0.65, '#07060b');
        grad.addColorStop(1, '#020204');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw decorative gold frame border
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, width - 32, height - 32);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(24, 24, width - 48, height - 48);

        // Draw rendered SVG image
        ctx.drawImage(img, 0, 0, width, height);

        // Top Banner Title
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('GREAT WHEEL OF MYSTERIES • CELESTIAL STAR CHART', width / 2, 48);

        // Bottom Banner Metadata
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px monospace';
        const angleText = `Sky Rotation: ${Math.round(wheelRotation)}°`;
        const eventText = selectedEvent ? `Focus: ${selectedEvent.title} (${selectedEvent.yearLabel})` : 'Full Orbit View';
        ctx.fillText(`${angleText}  |  ${eventText}`, width / 2, height - 32);

        const pngData = canvas.toDataURL('image/png');
        URL.revokeObjectURL(blobUrl);
        resolve(pngData);
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(blobUrl);
        reject(e);
      };

      img.src = blobUrl;
    });
  };

  const handleOpenShareModal = async () => {
    setIsShareModalOpen(true);
    setIsGeneratingImage(true);
    try {
      const pngData = await generateStarChartImage();
      setGeneratedImageData(pngData);
    } catch (err) {
      console.error("Failed to render star chart image:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download high-res PNG
  const handleDownloadPNG = () => {
    if (!generatedImageData) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = generatedImageData;
    downloadLink.download = `great_wheel_star_chart_${Math.round(wheelRotation)}deg.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Download vector SVG
  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `great_wheel_star_chart_${Math.round(wheelRotation)}deg.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // Copy PNG image to clipboard
  const handleCopyImage = async () => {
    if (!generatedImageData) return;
    try {
      const response = await fetch(generatedImageData);
      const blob = await response.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      }
    } catch (err) {
      console.warn("Clipboard copy image failed, fallback to downloading", err);
      handleDownloadPNG();
    }
  };

  // Copy share URL
  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Live astrological sky position calculator based on current date
  const currentSkyBodies = useMemo<CelestialBody[]>(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Approximate celestial longitudes for display
    const sunDeg = (280 + (dayOfYear / 365.25) * 360) % 360;
    const moonDeg = (sunDeg + (now.getDate() * 13.2)) % 360;
    const mercuryDeg = (sunDeg + 18) % 360;
    const venusDeg = (sunDeg + 42) % 360;
    const marsDeg = (120 + (dayOfYear * 0.5)) % 360;
    const jupiterDeg = (60 + (dayOfYear * 0.08)) % 360;
    const saturnDeg = (335 + (dayOfYear * 0.03)) % 360;

    const getSignName = (deg: number) => {
      const sign = ZODIAC_SIGNS.find(s => deg >= s.startDeg && deg < s.endDeg);
      return sign ? sign.name : 'Aries';
    };

    return [
      { id: 'sun', name: 'Sun', glyph: '☉', deg: sunDeg, sign: getSignName(sunDeg), speed: '1°/day', significance: 'Vital essence, solar illumination, divine presence' },
      { id: 'moon', name: 'Moon', glyph: '☽', deg: moonDeg, sign: getSignName(moonDeg), speed: '13.2°/day', significance: 'Subconscious tide, memory, soul reflection' },
      { id: 'mercury', name: 'Mercury', glyph: '☿', deg: mercuryDeg, sign: getSignName(mercuryDeg), speed: '1.2°/day', significance: 'Sacred language, scribal wisdom, Hermes psychopomp' },
      { id: 'venus', name: 'Venus', glyph: '♀', deg: venusDeg, sign: getSignName(venusDeg), speed: '1.1°/day', significance: 'Harmonic beauty, spiritual grace, divine love' },
      { id: 'mars', name: 'Mars', glyph: '♂', deg: marsDeg, sign: getSignName(marsDeg), speed: '0.5°/day', significance: 'Militant will, spiritual warfare, fiery drive' },
      { id: 'jupiter', name: 'Jupiter', glyph: '♃', deg: jupiterDeg, sign: getSignName(jupiterDeg), speed: '0.08°/day', significance: 'Royal expansion, sacerdotal blessing, providence' },
      { id: 'saturn', name: 'Saturn', glyph: '♄', deg: saturnDeg, sign: getSignName(saturnDeg), speed: '0.03°/day', significance: 'Archon of time, ancient vaults, solemn boundary' }
    ];
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return HISTORICAL_EVENTS.filter(ev => {
      const matchesEpoch = selectedEpoch === 'All' || ev.epoch === selectedEpoch;
      const sign = ZODIAC_SIGNS.find(s => s.name === ev.zodiacSign);
      const matchesElement = selectedElement === 'All' || (sign && sign.element === selectedElement);
      const matchesSearch = searchQuery === '' || 
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.yearLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.hebrewTitle && ev.hebrewTitle.includes(searchQuery));
      
      return matchesEpoch && matchesElement && matchesSearch;
    });
  }, [selectedEpoch, selectedElement, searchQuery]);

  // Handle Rotation timer
  useEffect(() => {
    let interval: any = null;
    if (isRotating) {
      interval = setInterval(() => {
        setWheelRotation(prev => (prev + 0.25) % 360);
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRotating]);

  // Main D3 Rendering Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(width, 700);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 25;

    // Radius rings definition
    const outerWheelR = maxRadius;
    const zodiacRingR = maxRadius - 45;
    const constellationR = maxRadius - 90;
    const currentSkyR = maxRadius - 135;
    const eventsR = maxRadius - 180;
    const innerCoreR = maxRadius - 225;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Filter Defs (Glows, Gradients)
    const defs = svg.append('defs');

    // Radial Background Glow
    const bgGlow = defs.append('radialGradient')
      .attr('id', 'wheelBgGlow')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    bgGlow.append('stop').attr('offset', '0%').attr('stop-color', '#1e1b4b').attr('stop-opacity', '0.6');
    bgGlow.append('stop').attr('offset', '60%').attr('stop-color', '#0f172a').attr('stop-opacity', '0.4');
    bgGlow.append('stop').attr('offset', '100%').attr('stop-color', '#020617').attr('stop-opacity', '0.9');

    // Gold Glow Filter
    const glowFilter = defs.append('filter')
      .attr('id', 'goldGlowFilter')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main Group centered
    const gMain = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Background Canvas Circle
    gMain.append('circle')
      .attr('r', maxRadius)
      .attr('fill', 'url(#wheelBgGlow)')
      .attr('stroke', 'rgba(212, 175, 55, 0.25)')
      .attr('stroke-width', 1.5);

    // Rotatable Wheel Group
    const gRotatable = gMain.append('g')
      .attr('id', 'rotatableStarWheel')
      .attr('transform', `rotate(${wheelRotation})`);

    // Outer Degree Ticks (360 degrees)
    for (let d = 0; d < 360; d += 5) {
      const angleRad = (d - 90) * (Math.PI / 180);
      const isMajor = d % 30 === 0;
      const r1 = outerWheelR;
      const r2 = outerWheelR - (isMajor ? 12 : 6);

      gRotatable.append('line')
        .attr('x1', r1 * Math.cos(angleRad))
        .attr('y1', r1 * Math.sin(angleRad))
        .attr('x2', r2 * Math.cos(angleRad))
        .attr('y2', r2 * Math.sin(angleRad))
        .attr('stroke', isMajor ? '#d4af37' : '#475569')
        .attr('stroke-width', isMajor ? 1.5 : 0.75)
        .attr('opacity', isMajor ? 0.8 : 0.4);
    }

    // 12 Zodiac Sectors & Arc Dividers
    ZODIAC_SIGNS.forEach((sign) => {
      const startRad = (sign.startDeg - 90) * (Math.PI / 180);
      const endRad = (sign.endDeg - 90) * (Math.PI / 180);
      const midRad = (sign.startDeg + 15 - 90) * (Math.PI / 180);

      // Radial sector line
      gRotatable.append('line')
        .attr('x1', innerCoreR * Math.cos(startRad))
        .attr('y1', innerCoreR * Math.sin(startRad))
        .attr('x2', outerWheelR * Math.cos(startRad))
        .attr('y2', outerWheelR * Math.sin(startRad))
        .attr('stroke', 'rgba(212, 175, 55, 0.2)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');

      // Zodiac Glyph & Text Sector Arc
      const arc = d3.arc()
        .innerRadius(zodiacRingR)
        .outerRadius(outerWheelR)
        .startAngle(startRad + Math.PI / 2)
        .endAngle(endRad + Math.PI / 2);

      const isSelectedSign = selectedSign?.id === sign.id;

      const sectorPath = gRotatable.append('path')
        .attr('d', arc as any)
        .attr('fill', sign.color)
        .attr('fill-opacity', isSelectedSign ? 0.25 : 0.08)
        .attr('stroke', sign.color)
        .attr('stroke-opacity', isSelectedSign ? 0.8 : 0.2)
        .attr('stroke-width', isSelectedSign ? 2 : 1)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedSign(sign);
        });

      // Zodiac Glyph Icon
      const glyphR = (outerWheelR + zodiacRingR) / 2;
      const glyphX = glyphR * Math.cos(midRad);
      const glyphY = glyphR * Math.sin(midRad);

      gRotatable.append('text')
        .attr('x', glyphX)
        .attr('y', glyphY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', sign.color)
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .style('cursor', 'pointer')
        .text(sign.glyph)
        .on('click', () => setSelectedSign(sign));

      // Hebrew & Latin Name Labels
      const labelR = zodiacRingR - 16;
      const labelX = labelR * Math.cos(midRad);
      const labelY = labelR * Math.sin(midRad);

      gRotatable.append('text')
        .attr('x', labelX)
        .attr('y', labelY - 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f1f5f9')
        .attr('font-size', '10px')
        .attr('font-family', 'Georgia, serif')
        .attr('font-weight', '600')
        .text(sign.name);

      gRotatable.append('text')
        .attr('x', labelX)
        .attr('y', labelY + 7)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '9px')
        .attr('font-family', 'Georgia, serif')
        .text(sign.hebrew);

      // Constellation Stars
      if (showConstellations) {
        sign.constellationStars.forEach((star, idx) => {
          const starRad = (star.deg - 90) * (Math.PI / 180);
          const starX = star.r * Math.cos(starRad);
          const starY = star.r * Math.sin(starRad);

          // Star Dot
          gRotatable.append('circle')
            .attr('cx', starX)
            .attr('cy', starY)
            .attr('r', Math.max(2, 4.5 - star.mag * 0.6))
            .attr('fill', '#fff')
            .attr('stroke', sign.color)
            .attr('stroke-width', 1)
            .attr('filter', 'url(#goldGlowFilter)');

          // Connect star lines within sign
          if (idx > 0) {
            const prevStar = sign.constellationStars[idx - 1];
            const prevRad = (prevStar.deg - 90) * (Math.PI / 180);
            const prevX = prevStar.r * Math.cos(prevRad);
            const prevY = prevStar.r * Math.sin(prevRad);

            gRotatable.append('line')
              .attr('x1', prevX).attr('y1', prevY)
              .attr('x2', starX).attr('y2', starY)
              .attr('stroke', sign.color)
              .attr('stroke-width', 0.8)
              .attr('stroke-opacity', 0.4)
              .attr('stroke-dasharray', '2,2');
          }
        });
      }
    });

    // Current Sky Ring
    gRotatable.append('circle')
      .attr('r', currentSkyR)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(148, 163, 184, 0.25)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    if (showCurrentSky) {
      currentSkyBodies.forEach((body) => {
        const bodyRad = (body.deg - 90) * (Math.PI / 180);
        const bx = currentSkyR * Math.cos(bodyRad);
        const by = currentSkyR * Math.sin(bodyRad);

        const gBody = gRotatable.append('g')
          .attr('transform', `translate(${bx}, ${by})`)
          .style('cursor', 'pointer');

        gBody.append('circle')
          .attr('r', 11)
          .attr('fill', '#020617')
          .attr('stroke', '#fbbf24')
          .attr('stroke-width', 1.5);

        gBody.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#fbbf24')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(body.glyph);
      });
    }

    // Historical Events Orbit Ring
    gRotatable.append('circle')
      .attr('r', eventsR)
      .attr('fill', 'none')
      .attr('stroke', '#d4af37')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.5);

    // Aspect / Connection Lines between Selected Event and Sky / Stars
    if (showAspectLines && selectedEvent) {
      const evRad = (selectedEvent.deg - 90) * (Math.PI / 180);
      const evX = eventsR * Math.cos(evRad);
      const evY = eventsR * Math.sin(evRad);

      // Connect to Zodiac Sector Center
      const sign = ZODIAC_SIGNS.find(s => s.name === selectedEvent.zodiacSign);
      if (sign) {
        const signRad = (sign.startDeg + 15 - 90) * (Math.PI / 180);
        const signX = zodiacRingR * Math.cos(signRad);
        const signY = zodiacRingR * Math.sin(signRad);

        gRotatable.append('path')
          .attr('d', `M ${evX} ${evY} Q 0 0 ${signX} ${signY}`)
          .attr('fill', 'none')
          .attr('stroke', '#fbbf24')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.75)
          .attr('filter', 'url(#goldGlowFilter)');

        // Connect to Constellation Stars
        sign.constellationStars.forEach(star => {
          const sRad = (star.deg - 90) * (Math.PI / 180);
          const sx = star.r * Math.cos(sRad);
          const sy = star.r * Math.sin(sRad);

          gRotatable.append('line')
            .attr('x1', evX).attr('y1', evY)
            .attr('x2', sx).attr('y2', sy)
            .attr('stroke', sign.color)
            .attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', 0.8);
        });
      }
    }

    // Render Event Nodes
    filteredEvents.forEach((ev) => {
      const evRad = (ev.deg - 90) * (Math.PI / 180);
      const ex = eventsR * Math.cos(evRad);
      const ey = eventsR * Math.sin(evRad);

      const isSelected = selectedEvent?.id === ev.id;

      const gEv = gRotatable.append('g')
        .attr('transform', `translate(${ex}, ${ey})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedEvent(ev);
        });

      // Node Halo / Pulsing Ring if Selected
      if (isSelected) {
        gEv.append('circle')
          .attr('r', 16)
          .attr('fill', 'none')
          .attr('stroke', '#fbbf24')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '2,2')
          .attr('filter', 'url(#goldGlowFilter)');
      }

      // Outer Circle
      gEv.append('circle')
        .attr('r', isSelected ? 10 : 7)
        .attr('fill', isSelected ? '#fbbf24' : '#0f172a')
        .attr('stroke', isSelected ? '#fff' : '#d4af37')
        .attr('stroke-width', isSelected ? 2 : 1.5);

      // Inner Symbol Dot
      gEv.append('circle')
        .attr('r', isSelected ? 4 : 2.5)
        .attr('fill', isSelected ? '#020617' : '#d4af37');

      // Date Label Badge
      const textX = (eventsR + 22) * Math.cos(evRad) - ex;
      const textY = (eventsR + 22) * Math.sin(evRad) - ey;

      gEv.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', isSelected ? '#fef08a' : '#cbd5e1')
        .attr('font-size', isSelected ? '10px' : '8px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .text(ev.yearLabel);
    });

    // Central Core Nucleus (The Great Wheel Center - 76 Gematria)
    const gCore = gMain.append('g')
      .style('cursor', 'pointer')
      .on('click', () => {
        setSelectedSign(null);
      });

    gCore.append('circle')
      .attr('r', innerCoreR)
      .attr('fill', '#08080a')
      .attr('stroke', '#d4af37')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#goldGlowFilter)');

    gCore.append('circle')
      .attr('r', innerCoreR - 8)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(212, 175, 55, 0.4)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    gCore.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -6)
      .attr('fill', '#ffe89c')
      .attr('font-size', '20px')
      .attr('font-family', 'Georgia, serif')
      .attr('font-weight', 'bold')
      .text('76');

    gCore.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 14)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'Georgia, serif')
      .text('ע"ו • NUCLEUS');

  }, [
    filteredEvents, 
    selectedEvent, 
    selectedSign, 
    showAspectLines, 
    showCurrentSky, 
    showConstellations, 
    wheelRotation,
    currentSkyBodies
  ]);

  return (
    <div className="w-full bg-[#0a0a0d]/90 border border-amber-500/30 rounded-2xl p-5 md:p-6 text-slate-200 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 mb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
            <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-200 tracking-wider">
              THE GREAT WHEEL OF MYSTERIES
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-1">
            Interactive D3 celestial star chart connecting historical scriptural events to zodiacal longitudes and real-time planetary positions.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isRotating 
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' 
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-amber-500/40'
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isRotating ? 'Pause Orbit' : 'Auto-Orbit'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAspectLines(!showAspectLines)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              showAspectLines 
                ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300' 
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aspect Vectors</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCurrentSky(!showCurrentSky)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              showCurrentSky 
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' 
                : 'bg-black/40 border-white/10 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Sky</span>
          </button>

          <button
            type="button"
            onClick={() => setWheelRotation(0)}
            className="p-2 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Wheel Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenShareModal}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/60 hover:bg-amber-500/30 text-amber-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            title="Export and Share Star Chart Image"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Image</span>
          </button>
        </div>
      </div>

      {/* Control Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 p-3 bg-black/50 border border-white/5 rounded-xl">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, scriptures, years..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Epoch Filter */}
        <div className="md:col-span-5 flex items-center gap-1 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mr-1">Epoch:</span>
          {['All', 'Ancient', 'Classical', 'Renaissance', 'Modern'].map((ep) => (
            <button
              key={ep}
              type="button"
              onClick={() => setSelectedEpoch(ep)}
              className={`px-2.5 py-1 rounded text-xxs font-mono transition-all shrink-0 cursor-pointer ${
                selectedEpoch === ep 
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold' 
                  : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ep}
            </button>
          ))}
        </div>

        {/* Element Filter */}
        <div className="md:col-span-3 flex items-center gap-1 overflow-x-auto justify-end">
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mr-1">Element:</span>
          {['All', 'Fire', 'Earth', 'Air', 'Water'].map((el) => (
            <button
              key={el}
              type="button"
              onClick={() => setSelectedElement(el)}
              className={`px-2 py-1 rounded text-xxs font-mono transition-all shrink-0 cursor-pointer ${
                selectedElement === el 
                  ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 font-bold' 
                  : 'bg-neutral-900 border border-neutral-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {el}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wheel Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Interactive D3 Star Chart Wheel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[480px]">
          <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
            <svg ref={svgRef} className="w-full max-w-[560px] h-auto drop-shadow-2xl" />
          </div>

          {/* Interactive Wheel Manual Angle Slider */}
          <div className="w-full max-w-md mt-4 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-amber-400 shrink-0">Rotate Sky ({Math.round(wheelRotation)}°)</span>
            <input
              type="range"
              min="0"
              max="360"
              value={wheelRotation}
              onChange={(e) => setWheelRotation(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1 bg-neutral-800 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Historical Event & Celestial Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Event Details Card */}
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-black/60 border border-amber-500/40 rounded-xl p-5 space-y-3 shadow-2xl relative"
              >
                {/* Event Badge & Header */}
                <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-bold">
                        {selectedEvent.yearLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                        {selectedEvent.epoch} Epoch
                      </span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-amber-100 mt-1.5 leading-snug">
                      {selectedEvent.title}
                    </h4>
                    {selectedEvent.hebrewTitle && (
                      <div className="text-xs font-serif text-slate-400 mt-0.5">
                        {selectedEvent.hebrewTitle}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {selectedEvent.zodiacSign}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {selectedEvent.deg}° Longitude
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="text-xs font-serif leading-relaxed text-slate-300">
                  <p className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    {selectedEvent.summary}
                  </p>
                </div>

                {/* Astrological Alignment Context */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Celestial Alignment
                  </span>
                  <p className="text-xs font-serif text-slate-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                    {selectedEvent.astrologicalContext}
                  </p>
                </div>

                {/* Scriptural Citation */}
                {selectedEvent.scripturalReference && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" /> Sacred Reference
                    </span>
                    <p className="text-xs font-serif italic text-indigo-200 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/20">
                      "{selectedEvent.scripturalReference}"
                    </p>
                  </div>
                )}

                {/* Gematria / Star Connections */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                  <span className="text-amber-300/80">
                    {selectedEvent.gematriaNote}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>Stars: {selectedEvent.connectedStars.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-black/40 border border-white/10 rounded-xl p-8 text-center text-slate-400 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-amber-500/50 animate-pulse" />
                <p className="text-xs font-serif">Click any event node on the star wheel to inspect its celestial alignments.</p>
              </div>
            )}
          </AnimatePresence>

          {/* Quick List of All Filtered Events */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-2 max-h-[220px] overflow-y-auto">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Historical Milestones ({filteredEvents.length})</span>
              <span>Select to Focus</span>
            </div>

            <div className="space-y-1">
              {filteredEvents.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-semibold' 
                        : 'bg-neutral-950/60 border border-white/5 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-amber-400 shrink-0 font-bold">{ev.yearLabel}</span>
                      <span className="truncate">{ev.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{ev.zodiacSign}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Share & Image Export Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl bg-[#0d0d12] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-200 relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-amber-500/20 bg-amber-950/30">
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-serif font-bold text-amber-200 tracking-wide">
                    SHARE STAR CHART CONFIGURATION
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Generated Image Preview Container */}
                <div className="bg-black/80 border border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[320px]">
                  {isGeneratingImage ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-amber-300 font-serif text-sm">
                      <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
                      <span>Rendering High-Resolution Celestial Image...</span>
                    </div>
                  ) : generatedImageData ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        src={generatedImageData}
                        alt="Great Wheel Star Chart Configuration"
                        className="max-h-[360px] w-auto object-contain rounded-lg border border-amber-500/30 shadow-2xl"
                      />
                      <span className="text-[11px] font-mono text-slate-400 mt-2">
                        High-Resolution Render (1200x1200px PNG) • Rotation Angle: {Math.round(wheelRotation)}°
                      </span>
                    </div>
                  ) : (
                    <div className="text-rose-400 text-xs font-mono">Image generation failed. Try exporting raw SVG.</div>
                  )}
                </div>

                {/* Primary Export Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    disabled={!generatedImageData}
                    className="px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/60 hover:bg-amber-500/30 text-amber-200 font-serif text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSVG}
                    className="px-4 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/50 hover:bg-indigo-900/50 text-indigo-200 font-serif text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>Download Vector SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyImage}
                    disabled={!generatedImageData}
                    className="px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-200 font-serif text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                    <span>{copiedImage ? 'Image Copied!' : 'Copy Image to Clipboard'}</span>
                  </button>
                </div>

                {/* Direct Link Share Bar */}
                <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Shareable Sanctum Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={typeof window !== 'undefined' ? window.location.href : ''}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={handleCopyShareUrl}
                      className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-200 font-serif text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all cursor-pointer shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Social Share Buttons Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Broadcast Star Chart to Social Networks
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `🔮 Celestial Star Chart Configuration (${Math.round(wheelRotation)}°): ${selectedEvent ? selectedEvent.title : 'Great Wheel of Mysteries'}`;
                        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/40 text-xs font-serif text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Post on X</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔮 Great Wheel Celestial Star Chart (${Math.round(wheelRotation)}°)\n${window.location.href}`)}`, '_blank');
                      }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/40 text-xs font-serif text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`🔮 Great Wheel Star Chart Configuration (${Math.round(wheelRotation)}°)`)}`, '_blank');
                      }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 text-xs font-serif text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Telegram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/40 text-xs font-serif text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Facebook</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const { googleSignIn, getAccessToken } = await import('../lib/firebase');
                          let token = await getAccessToken();
                          if (!token) {
                            const result = await googleSignIn();
                            if (result) token = result.accessToken;
                          }
                          
                          if (token) {
                            // Convert image data to base64 attachment string if it exists
                            let attachments = '';
                            if (generatedImageData) {
                               const base64Data = generatedImageData.split(',')[1];
                               attachments = [
                                 '--boundary_string',
                                 'Content-Type: image/png; name="star_chart.png"',
                                 'Content-Transfer-Encoding: base64',
                                 'Content-Disposition: attachment; filename="star_chart.png"',
                                 '',
                                 base64Data,
                                 ''
                               ].join('\r\n');
                            }

                            const emailContent = [
                              'To: ',
                              'Subject: My Celestial Star Chart',
                              'Content-Type: multipart/mixed; boundary="boundary_string"',
                              '',
                              '--boundary_string',
                              'Content-Type: text/plain; charset="UTF-8"',
                              '',
                              `Check out my Great Wheel Celestial Star Chart configuration (${Math.round(wheelRotation)}°)!

Link: ${window.location.href}`,
                              '',
                              attachments,
                              '--boundary_string--'
                            ].join('\r\n');

                            // Base64url encode the message
                            const encodedMessage = btoa(emailContent)
                              .replace(/\+/g, '-')
                              .replace(/\//g, '_')
                              .replace(/=+$/, '');

                            const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ raw: encodedMessage })
                            });

                            if (response.ok) {
                              alert('Star Chart emailed successfully via Gmail!');
                            } else {
                              const errorData = await response.json();
                              console.error('Gmail API Error:', errorData);
                              alert('Failed to send email. See console for details.');
                            }
                          }
                        } catch (err) {
                          console.error('Failed to send via Gmail:', err);
                          alert('Authentication or sending failed.');
                        }
                      }}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/40 text-xs font-serif text-slate-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-red-400" />
                      <span>Send via Gmail</span>
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
