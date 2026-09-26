import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { 
  Sparkles, Compass, MapPin, Clock, Calendar, HelpCircle, Info,
  Flame, Droplet, Wind, LandPlot, Circle, ArrowUpRight, Award, Bookmark,
  Heart, RefreshCw, Printer, Download, FileText, Image as ImageIcon, Check, Share2
} from 'lucide-react';
import SocialShareModal from './SocialShareModal';

// Historical and mystical locations presets
interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  tz: number;
  description: string;
}

const LOCATION_PRESETS: LocationPreset[] = [
  { name: "Babylon, Iraq", lat: 32.536, lng: 44.421, tz: 3, description: "The birthplace of astronomical zodiac mapping and Chaldean astrology." },
  { name: "Alexandria, Egypt", lat: 31.200, lng: 29.919, tz: 2, description: "Hellenistic seat of learning, where Hermeticism and astrology synthesized." },
  { name: "Athens, Greece", lat: 37.983, lng: 23.727, tz: 2, description: "Philosophic heart of Platonic cosmology and the classical spheres." },
  { name: "Rome, Italy", lat: 41.902, lng: 12.496, tz: 1, description: "Empire of augury, sundials, and Mithraic astronomical temples." },
  { name: "Stonehenge, UK", lat: 51.178, lng: -1.826, tz: 0, description: "Neo-lithic megalithic calendar marking solar and lunar alignments." },
  { name: "Giza, Egypt", lat: 29.979, lng: 31.134, tz: 2, description: "Pyramid complexes aligned precisely with Orion and polar stars." },
  { name: "Varanasi, India", lat: 25.317, lng: 83.006, tz: 5.5, description: "Sacred eternal city on the Ganges; seat of Vedic jyotish astrology." },
  { name: "Chichen Itza, Mexico", lat: 20.684, lng: -88.567, tz: -6, description: "Mayan pyramid observatory tracking the orbital cycles of Venus." },
  { name: "Kyoto, Japan", lat: 35.011, lng: 135.768, tz: 9, description: "Ancient imperial court capital of the Onmyodo cosmic diviners." },
  { name: "Mount Shasta, USA", lat: 41.409, lng: -122.193, tz: -8, description: "High-frequency telluric energy portal beneath the Cascades." },
  { name: "London, UK", lat: 51.507, lng: -0.127, tz: 0, description: "Greenwich meridian focal line dividing east and west hemisphere time." },
  { name: "New York, USA", lat: 40.712, lng: -74.006, tz: -5, description: "Major contemporary metropolitan meridian of stellar queries." }
];

interface Planet {
  name: string;
  symbol: string;
  color: string;
  glow: string;
  description: string;
  domain: string;
  calc: (d: number) => number;
}

// Deterministic planetary positions (simplified Keplerian orbits + perturbation approximations)
const PLANETS: Planet[] = [
  {
    name: "Sun",
    symbol: "☉",
    color: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    description: "Core ego, life force, conscious identity, and creative spark.",
    domain: "Self & Vitality",
    calc: (d: number) => {
      const g = 357.528 + 0.9856003 * d;
      const L = 280.460 + 0.9856474 * d;
      const lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Moon",
    symbol: "☽",
    color: "#E2E8F0",
    glow: "rgba(226, 232, 240, 0.4)",
    description: "Emotional subconscious, habits, memory, and the nurturing soul.",
    domain: "Subconscious & Instincts",
    calc: (d: number) => {
      const Lm = 218.316 + 13.176396 * d;
      const Mm = 134.963 + 13.064993 * d;
      const lambda = Lm + 6.289 * Math.sin(Mm * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Mercury",
    symbol: "☿",
    color: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.4)",
    description: "Mind, intellect, articulation, learning, and local transport.",
    domain: "Communication & Logic",
    calc: (d: number) => {
      // Mercury is bounded to within 28 degrees of the Sun
      const sunG = 357.528 + 0.9856003 * d;
      const sunL = 280.460 + 0.9856474 * d;
      const sunLambda = sunL + 1.915 * Math.sin(sunG * Math.PI / 180);
      
      const mercuryMean = 252.250 + 4.092334 * d;
      const offset = 24 * Math.sin(mercuryMean * Math.PI / 180);
      return (sunLambda + offset + 360) % 360;
    }
  },
  {
    name: "Venus",
    symbol: "♀",
    color: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
    description: "Affection, romance, aesthetics, luxury, values, and magnetism.",
    domain: "Art, Love & Attunement",
    calc: (d: number) => {
      // Venus is bounded to within 48 degrees of the Sun
      const sunG = 357.528 + 0.9856003 * d;
      const sunL = 280.460 + 0.9856474 * d;
      const sunLambda = sunL + 1.915 * Math.sin(sunG * Math.PI / 180);
      
      const venusMean = 181.979 + 1.602130 * d;
      const offset = 44 * Math.sin(venusMean * Math.PI / 180);
      return (sunLambda + offset + 360) % 360;
    }
  },
  {
    name: "Mars",
    symbol: "♂",
    color: "#EF4444",
    glow: "rgba(239, 68, 68, 0.4)",
    description: "Drive, physical energy, passion, courage, assertion, and primal force.",
    domain: "Willpower & Conflict",
    calc: (d: number) => {
      const L = 355.453 + 0.524020 * d;
      const M = 19.390 + 0.524033 * d;
      const lambda = L + 9.5 * Math.sin(M * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Jupiter",
    symbol: "♃",
    color: "#FBBF24",
    glow: "rgba(251, 191, 36, 0.4)",
    description: "Expansion, wisdom, philosophy, prosperity, ethics, and destiny.",
    domain: "Abundance & Growth",
    calc: (d: number) => {
      const L = 34.404 + 0.083085 * d;
      const M = 20.020 + 0.083091 * d;
      const lambda = L + 5.5 * Math.sin(M * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Saturn",
    symbol: "♄",
    color: "#6366F1",
    glow: "rgba(99, 102, 241, 0.4)",
    description: "Structure, discipline, time, patience, karmic boundaries, and mastery.",
    domain: "Discipline & Time",
    calc: (d: number) => {
      const L = 50.077 + 0.033459 * d;
      const M = 317.020 + 0.033444 * d;
      const lambda = L + 6.3 * Math.sin(M * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Uranus",
    symbol: "♅",
    color: "#22D3EE",
    glow: "rgba(34, 211, 238, 0.4)",
    description: "Revolution, sudden insights, liberation, technology, and eccentricity.",
    domain: "Awakening & Innovation",
    calc: (d: number) => {
      const L = 314.055 + 0.011733 * d;
      const lambda = L + 5.2 * Math.sin((142.23 + 0.0117 * d) * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Neptune",
    symbol: "♆",
    color: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.4)",
    description: "Dreams, spiritual portals, illusion, mysticism, art, and the formless void.",
    domain: "Intuition & Spirit",
    calc: (d: number) => {
      const L = 304.348 + 0.005981 * d;
      const lambda = L + 4.1 * Math.sin((256.22 + 0.0059 * d) * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Pluto",
    symbol: "♇",
    color: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    description: "Rebirth, dynamic power, shadows, intense purification, and systemic transformation.",
    domain: "Regeneration & Shadows",
    calc: (d: number) => {
      const L = 238.928 + 0.003965 * d;
      const lambda = L + 17.2 * Math.sin((14.88 + 0.0040 * d) * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Chiron",
    symbol: "⚷",
    color: "#14B8A6",
    glow: "rgba(20, 184, 166, 0.4)",
    description: "The wounded healer, bridging the physical and psychic spheres.",
    domain: "Vulnerabilities & Healing",
    calc: (d: number) => {
      const lambda = 200.5 + 0.0197 * d + 8.5 * Math.sin((80.5 + 0.0197 * d) * Math.PI / 180);
      return (lambda + 360) % 360;
    }
  },
  {
    name: "North Node",
    symbol: "☊",
    color: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.4)",
    description: "Destiny line, future growth vector, karmic integration, and evolutionary path.",
    domain: "Future Alignment",
    calc: (d: number) => {
      const lambda = 125.1228 - 0.0529536 * d;
      return (lambda + 360) % 360;
    }
  },
  {
    name: "Lilith",
    symbol: "⚸",
    color: "#9A3412",
    glow: "rgba(154, 52, 18, 0.4)",
    description: "The wild instincts, hidden primal shadow, liberation, and raw occult power.",
    domain: "Raw Instinct & Power",
    calc: (d: number) => {
      const lambda = 290.5 + 0.1114 * d;
      return (lambda + 360) % 360;
    }
  }
];

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", range: [0, 30], element: "Ignis", modality: "Cardinal", color: "#EF4444", desc: "Bold, passionate, and pioneering initiator." },
  { name: "Taurus", symbol: "♉", range: [30, 60], element: "Materia", modality: "Fixed", color: "#10B981", desc: "Grounded, sensory, loyal, and steady builder." },
  { name: "Gemini", symbol: "♊", range: [60, 90], element: "Aer", modality: "Mutable", color: "#06B6D4", desc: "Curious, agile, witty, and versatile thinker." },
  { name: "Cancer", symbol: "♋", range: [90, 120], element: "Aqua", modality: "Cardinal", color: "#3B82F6", desc: "Intuitive, nurturing, protective, and emotional." },
  { name: "Leo", symbol: "♌", range: [120, 150], element: "Ignis", modality: "Fixed", color: "#F59E0B", desc: "Radiant, noble, creative, and expressive leader." },
  { name: "Virgo", symbol: "♍", range: [150, 180], element: "Materia", modality: "Mutable", color: "#059669", desc: "Analytical, helpful, pure, and meticulously organized." },
  { name: "Libra", symbol: "♎", range: [180, 210], element: "Aer", modality: "Cardinal", color: "#22D3EE", desc: "Harmonious, diplomatic, artistic, and relationship-driven." },
  { name: "Scorpio", symbol: "♏", range: [210, 240], element: "Aqua", modality: "Fixed", color: "#6366F1", desc: "Intense, psychic, strategic, and transformative." },
  { name: "Sagittarius", symbol: "♐", range: [240, 270], element: "Ignis", modality: "Mutable", color: "#D97706", desc: "Philosophical, wild, truth-seeking, and optimistic voyager." },
  { name: "Capricorn", symbol: "♑", range: [270, 300], element: "Materia", modality: "Cardinal", color: "#4B5563", desc: "Ambitious, master of structures, patient, and self-disciplined." },
  { name: "Aquarius", symbol: "♒", range: [300, 330], element: "Aer", modality: "Fixed", color: "#8B5CF6", desc: "Visionary, humanitarian, rebellious, and community-centric." },
  { name: "Pisces", symbol: "♓", range: [330, 360], element: "Aqua", modality: "Mutable", color: "#6366F1", desc: "Dreamy, empathetic, artistic, and spiritually transcendent." }
];

const ELEMENT_STYLES: Record<string, { icon: any, color: string, badge: string }> = {
  "Ignis": { icon: Flame, color: "#EF4444", badge: "bg-red-500/15 border-red-500/20 text-red-400" },
  "Materia": { icon: LandPlot, color: "#10B981", badge: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" },
  "Aer": { icon: Wind, color: "#06B6D4", badge: "bg-cyan-500/15 border-cyan-500/20 text-cyan-400" },
  "Aqua": { icon: Droplet, color: "#3B82F6", badge: "bg-blue-500/15 border-blue-500/20 text-blue-400" }
};

interface Aspect {
  p1: string;
  p2: string;
  type: "Conjunction" | "Sextile" | "Square" | "Trine" | "Opposition";
  angle: number;
  orb: number;
  color: string;
  glow: string;
  meaning: string;
}

const getAspects = (placements: Record<string, number>): Aspect[] => {
  const keys = Object.keys(placements);
  const results: Aspect[] = [];
  
  const aspectDefs = [
    { name: "Conjunction", angle: 0, orb: 8, color: "#F59E0B", glow: "rgba(245, 158, 11, 0.45)", meaning: "Merges, intensifies, and fuses the two planetary forces." },
    { name: "Sextile", angle: 60, orb: 6, color: "#22D3EE", glow: "rgba(34, 211, 238, 0.45)", meaning: "Supportive flow, provides creative opportunities and mutual stimulation." },
    { name: "Square", angle: 90, orb: 8, color: "#EF4444", glow: "rgba(239, 68, 68, 0.45)", meaning: "Frictional, challenges and blocks that drive growth and breakthrough action." },
    { name: "Trine", angle: 120, orb: 8, color: "#3B82F6", glow: "rgba(59, 130, 246, 0.45)", meaning: "Supreme, effortless harmony, luck, and natural talents flowing together." },
    { name: "Opposition", angle: 180, orb: 8, color: "#A78BFA", glow: "rgba(167, 139, 250, 0.45)", meaning: "Dynamic tension, polarity, calling for integration and balanced perspective." }
  ] as const;

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = keys[i];
      const p2 = keys[j];
      const a1 = placements[p1];
      const a2 = placements[p2];
      
      let diff = Math.abs(a1 - a2);
      if (diff > 180) diff = 360 - diff;
      
      for (const def of aspectDefs) {
        const orbDist = Math.abs(diff - def.angle);
        if (orbDist <= def.orb) {
          results.push({
            p1,
            p2,
            type: def.name,
            angle: def.angle,
            orb: parseFloat(orbDist.toFixed(2)),
            color: def.color,
            glow: def.glow,
            meaning: def.meaning
          });
        }
      }
    }
  }
  return results;
};

interface AstrologicalChartsProps {
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
  };
  globalBirthDate: string;
  onBirthDateChange: (date: string) => void;
  userZodiacSign?: string;
  partnerZodiacSign?: string;
  onPartnerZodiacSignChange?: (sign: string) => void;
  school?: string;
  houseNotes?: Record<number, { note: string; category?: string; updatedAt?: string }>;
  onSelectHouseNote?: (houseNum: number) => void;
}

export default function AstrologicalCharts({ 
  activeTheme, 
  globalBirthDate, 
  onBirthDateChange,
  userZodiacSign = "",
  partnerZodiacSign = "",
  onPartnerZodiacSignChange,
  school = "Hermetic Alchemy",
  houseNotes,
  onSelectHouseNote
}: AstrologicalChartsProps) {
  // Input States with localStorage memory
  const [birthDate, setBirthDate] = useState(globalBirthDate || "1995-10-25");
  
  const [birthTime, setBirthTime] = useState(() => {
    return localStorage.getItem("oracle-seeker-birth-hour") || localStorage.getItem("oracle-birth-time") || "12:00";
  });

  const [seekerLocationName, setSeekerLocationName] = useState(() => {
    return localStorage.getItem("oracle-seeker-location-name") || "Alexandria, Egypt";
  });

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(() => {
    const saved = localStorage.getItem("oracle-seeker-preset-index");
    return saved !== null ? parseInt(saved) : 1; // Default to Alexandria
  });

  const [isCustomLoc, setIsCustomLoc] = useState(() => {
    return localStorage.getItem("oracle-seeker-is-custom") === "true";
  });

  const [customLat, setCustomLat] = useState(() => {
    return localStorage.getItem("oracle-seeker-custom-lat") || "31.200";
  });

  const [customLng, setCustomLng] = useState(() => {
    return localStorage.getItem("oracle-seeker-custom-lng") || "29.919";
  });

  const [customTz, setCustomTz] = useState(() => {
    return localStorage.getItem("oracle-seeker-custom-tz") || "2";
  });

  const [houseSystem, setHouseSystem] = useState<'Equal' | 'Whole'>('Equal');

  const handleTimeChange = (newTime: string) => {
    setBirthTime(newTime);
    localStorage.setItem("oracle-seeker-birth-hour", newTime);
    localStorage.setItem("oracle-birth-time", newTime);
  };

  const handleHourSelectChange = (hourStr: string) => {
    const minute = birthTime.includes(':') ? birthTime.split(':')[1] : '00';
    const formatted = `${hourStr.padStart(2, '0')}:${minute}`;
    handleTimeChange(formatted);
  };

  const handleLocationNameChange = (name: string) => {
    setSeekerLocationName(name);
    localStorage.setItem("oracle-seeker-location-name", name);
  };

  const handlePresetChange = (idxStr: string) => {
    if (idxStr === "custom") {
      setIsCustomLoc(true);
      localStorage.setItem("oracle-seeker-is-custom", "true");
    } else {
      const idx = parseInt(idxStr);
      setIsCustomLoc(false);
      setSelectedPresetIndex(idx);
      localStorage.setItem("oracle-seeker-is-custom", "false");
      localStorage.setItem("oracle-seeker-preset-index", String(idx));
      if (LOCATION_PRESETS[idx]) {
        setSeekerLocationName(LOCATION_PRESETS[idx].name);
        localStorage.setItem("oracle-seeker-location-name", LOCATION_PRESETS[idx].name);
      }
    }
  };

  const handleCustomLatChange = (val: string) => {
    setCustomLat(val);
    localStorage.setItem("oracle-seeker-custom-lat", val);
  };

  const handleCustomLngChange = (val: string) => {
    setCustomLng(val);
    localStorage.setItem("oracle-seeker-custom-lng", val);
  };

  const handleCustomTzChange = (val: string) => {
    setCustomTz(val);
    localStorage.setItem("oracle-seeker-custom-tz", val);
  };

  // Selected details for modal or panel
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<Aspect | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>("Sun");

  // Local states for the compatibility panel
  const [selectedSeeker, setSelectedSeeker] = useState(userZodiacSign || "Aries");
  const [selectedPartner, setSelectedPartner] = useState(partnerZodiacSign || "Libra");
  const [compatibilityResult, setCompatibilityResult] = useState<{ score: number; title: string; analysis: string } | null>(null);
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError] = useState<string | null>(null);

  // Synchronize when props change
  React.useEffect(() => {
    if (userZodiacSign) {
      setSelectedSeeker(userZodiacSign);
    }
  }, [userZodiacSign]);

  React.useEffect(() => {
    if (partnerZodiacSign) {
      setSelectedPartner(partnerZodiacSign);
    }
  }, [partnerZodiacSign]);

  const fetchCompatibility = async (seeker: string, partner: string) => {
    if (!seeker || !partner) {
      setCompError("Please specify both celestial signs.");
      return;
    }
    setCompLoading(true);
    setCompError(null);
    try {
      const response = await fetch("/api/zodiac-compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSign: seeker,
          partnerSign: partner,
          school: school
        })
      });
      if (!response.ok) {
        throw new Error(`Aetheric response status: ${response.status}`);
      }
      const data = await response.json();
      setCompatibilityResult(data);
    } catch (err: any) {
      console.warn(err);
      setCompError(err.message || "Failed to align celestial channels.");
    } finally {
      setCompLoading(false);
    }
  };

  // Auto-fetch when both are active
  React.useEffect(() => {
    if (userZodiacSign && partnerZodiacSign) {
      fetchCompatibility(userZodiacSign, partnerZodiacSign);
    }
  }, [userZodiacSign, partnerZodiacSign, school]);

  // Synchronize internal birthdate changes to global state
  const handleDateInput = (val: string) => {
    setBirthDate(val);
    onBirthDateChange(val);
  };

  // Coordinates resolution
  const activeLat = useMemo(() => isCustomLoc ? parseFloat(customLat) || 0 : LOCATION_PRESETS[selectedPresetIndex]?.lat || 0, [isCustomLoc, selectedPresetIndex, customLat]);
  const activeLng = useMemo(() => isCustomLoc ? parseFloat(customLng) || 0 : LOCATION_PRESETS[selectedPresetIndex]?.lng || 0, [isCustomLoc, selectedPresetIndex, customLng]);
  const activeTz = useMemo(() => isCustomLoc ? parseFloat(customTz) || 0 : LOCATION_PRESETS[selectedPresetIndex]?.tz || 0, [isCustomLoc, selectedPresetIndex, customTz]);
  const activeLocName = useMemo(() => {
    if (seekerLocationName.trim()) return seekerLocationName;
    return isCustomLoc ? "Custom Coordinate Alignment" : LOCATION_PRESETS[selectedPresetIndex]?.name || "Babylon";
  }, [seekerLocationName, isCustomLoc, selectedPresetIndex]);

  // Astronomical computations
  const celestialData = useMemo(() => {
    if (!birthDate) return null;
    
    // Days since J2000.0 (January 1.5, 2000)
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // Standard hour inside UTC
    const hourUTC = hour - activeTz;
    
    let Y = year;
    let M = month;
    if (M <= 2) {
      Y -= 1;
      M += 12;
    }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5 + (hourUTC + minute / 60) / 24;
    const d = jd - 2451545.0;

    // Calculate longitudes of planets
    const placements: Record<string, number> = {};
    PLANETS.forEach(p => {
      const val = p.calc(d);
      placements[p.name] = ((val % 360) + 360) % 360;
    });

    // Houses
    const epsilon = 23.4392911 * Math.PI / 180;
    let gmst = 6.697374558 + 0.06570982441908 * d + ((jd - 0.5) % 1) * 24;
    gmst = ((gmst % 24) + 24) % 24;
    
    let lst = gmst + activeLng / 15.0;
    lst = ((lst % 24) + 24) % 24;
    
    const ramc = lst * 15 * Math.PI / 180;
    const latRad = activeLat * Math.PI / 180;
    
    let mc = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(epsilon)) * 180 / Math.PI;
    mc = ((mc % 360) + 360) % 360;
    
    let asc = Math.atan2(
      Math.cos(ramc),
      -Math.sin(ramc) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon)
    ) * 180 / Math.PI;
    asc = ((asc % 360) + 360) % 360;

    // Ascendant Sign Range helper
    const getSignName = (longitude: number) => {
      const norm = ((longitude % 360) + 360) % 360;
      const idx = Math.floor(norm / 30) % 12;
      return ZODIAC_SIGNS[idx]?.name || "Unknown";
    };

    const houses: number[] = [];
    if (houseSystem === 'Equal') {
      for (let h = 0; h < 12; h++) {
        houses.push(((asc + h * 30) % 360 + 360) % 360);
      }
    } else {
      // Whole Sign Houses - starts at 0 degrees of the Ascendant's sign
      const ascSignIdx = Math.floor(asc / 30) % 12;
      const startDeg = ascSignIdx * 30;
      for (let h = 0; h < 12; h++) {
        houses.push(((startDeg + h * 30) % 360 + 360) % 360);
      }
    }

    const aspects = getAspects(placements);

    // Score Elements and Modalities based on placements
    const elementsScore = { Ignis: 0, Materia: 0, Aer: 0, Aqua: 0 };
    const modalitiesScore = { Cardinal: 0, Fixed: 0, Mutable: 0 };

    Object.entries(placements).forEach(([name, long]) => {
      const norm = ((long % 360) + 360) % 360;
      const signIdx = Math.floor(norm / 30) % 12;
      const s = ZODIAC_SIGNS[signIdx];
      if (!s) return;
      // Weights: Sun/Moon get 3 pts, Personal (Merc/Ven/Mars) get 2 pts, Jup/Sat get 1.5, Outer get 1 pt.
      let weight = 1;
      if (name === "Sun" || name === "Moon") weight = 3;
      else if (name === "Mercury" || name === "Venus" || name === "Mars") weight = 2;
      else if (name === "Jupiter" || name === "Saturn") weight = 1.5;

      elementsScore[s.element as keyof typeof elementsScore] += weight;
      modalitiesScore[s.modality as keyof typeof modalitiesScore] += weight;
    });

    return {
      jd: jd.toFixed(4),
      asc,
      mc,
      houses,
      placements,
      aspects,
      elementsScore,
      modalitiesScore,
      ascSign: getSignName(asc),
      mcSign: getSignName(mc)
    };
  }, [birthDate, birthTime, activeLat, activeLng, activeTz, houseSystem]);

  // Coordinates helper for drawing SVGs
  const getCoords = (long: number, radius: number) => {
    if (!celestialData) return { x: 0, y: 0 };
    const asc = celestialData.asc;
    // Standard rotation: ASC is always horizontal on the left (180 degrees)
    // Angles increase clockwise (SVG space: +y is down)
    const angleRad = (180 - (long - asc)) * Math.PI / 180;
    return {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad)
    };
  };

  // Nice formatter for degrees
  const formatZodiacDegrees = (long: number) => {
    const norm = ((long % 360) + 360) % 360;
    const signIdx = Math.floor(norm / 30) % 12;
    const sign = ZODIAC_SIGNS[signIdx] || ZODIAC_SIGNS[0];
    const remDeg = Math.floor(norm % 30);
    const remMin = Math.floor((norm % 1) * 60);
    return `${remDeg}° ${sign.symbol} ${sign.name} ${remMin.toString().padStart(2, '0')}'`;
  };

  // Determine active planet placement description
  const selectedPlanetInfo = useMemo(() => {
    if (!selectedPlanet || !celestialData) return null;
    const planetDef = PLANETS.find(p => p.name === selectedPlanet);
    if (!planetDef) return null;
    
    const long = celestialData.placements[selectedPlanet];
    const norm = ((long % 360) + 360) % 360;
    const signIdx = Math.floor(norm / 30) % 12;
    const sign = ZODIAC_SIGNS[signIdx] || ZODIAC_SIGNS[0];
    
    // Find house index
    let houseIndex = 11; // Default fallback
    for (let h = 0; h < 12; h++) {
      const currentCusp = celestialData.houses[h];
      const nextCusp = celestialData.houses[(h + 1) % 12];
      
      const checkAngle = (long - currentCusp + 360) % 360;
      const cuspWidth = (nextCusp - currentCusp + 360) % 360;
      
      if (checkAngle < cuspWidth) {
        houseIndex = h;
        break;
      }
    }

    const houseDescriptions = [
      "First House (Ascendant): The lens of identity, physical incarnation, appearance, and immediate outer projection.",
      "Second House: Material values, earned resources, financial foundations, and personal security boundaries.",
      "Third House: Mental connections, local transport, intellectual interactions, learning, and sibling bonds.",
      "Fourth House (Imum Coeli): Foundations, ancestral heritage, subconscious safety, home, and cellular memory.",
      "Fifth House: Self-expression, cosmic romance, art, children, speculation, and dynamic creative fires.",
      "Sixth House: Service, mental analysis, daily physical routines, work habits, bodily health, and purification.",
      "Seventh House (Descendant): Partnerships, mirror contracts, public relations, and legal agreements.",
      "Eighth House: Shared values, occult thresholds, deep sexuality, legacy assets, and death & rebirth portals.",
      "Ninth House: Philosophical expansions, global voyaging, divine laws, belief systems, and absolute wisdom.",
      "Tenth House (Midheaven): Career pinnacle, worldly status, systemic authority, structural destiny, and reputation.",
      "Eleventh House: Allied networks, humanitarian ideals, collective resonance, future hopes, and community circles.",
      "Twelfth House: Solitary integration, divine subconscious, ancestral karma, dream worlds, and cosmic synthesis."
    ];

    return {
      def: planetDef,
      degreeFormatted: formatZodiacDegrees(long),
      sign,
      houseNum: houseIndex + 1,
      houseDesc: houseDescriptions[houseIndex]
    };
  }, [selectedPlanet, celestialData]);

  // Determine dominant elements & modalities
  const scoresInterpretation = useMemo(() => {
    if (!celestialData) return null;
    const scores = celestialData.elementsScore;
    let maxElement = "Ignis";
    let maxVal = 0;
    Object.entries(scores).forEach(([el, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxElement = el;
      }
    });

    const modalities = celestialData.modalitiesScore;
    let maxMod = "Cardinal";
    let maxModVal = 0;
    Object.entries(modalities).forEach(([mod, val]) => {
      if (val > maxModVal) {
        maxModVal = val;
        maxMod = mod;
      }
    });

    const elDesc = {
      Ignis: "Fierce spiritual passion, swift leadership, inspirational fires, and intense volition.",
      Materia: "Substantial building capacity, physical endurance, tactile wisdom, and structural integrity.",
      Aer: "Highly dynamic intellectual networks, communicative ease, philosophical vision, and clear concepts.",
      Aqua: "Deep psychic receptivity, emotional healing, intuitive navigation, and fluid spiritual boundaries."
    };

    const modDesc = {
      Cardinal: "Swift initiator, starting cycles, stepping onto new pathways, and focusing cosmic will.",
      Fixed: "Sustaining, consolidating power, stabilizing existing networks, and absolute concentration.",
      Mutable: "Fluid, adapting resources, channeling diverse currents, and facilitating clean transitions."
    };

    return {
      element: maxElement,
      elText: elDesc[maxElement as keyof typeof elDesc],
      modality: maxMod,
      modText: modDesc[maxMod as keyof typeof modDesc]
    };
  }, [celestialData]);

  // Download, Print & Social Share Laboratory Handlers
  const [isExporting, setIsExporting] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const chartShareText = useMemo(() => {
    if (!celestialData) return "My Celestial Birth Chart Reading from the Celestial Oracle";
    const sunSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Sun"] % 360 + 360) % 360 / 30)]?.name || "";
    const moonSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Moon"] % 360 + 360) % 360 / 30)]?.name || "";
    return `Celestial Birth Chart Reading: Location: ${activeLocName} | Sun Sign: ${sunSign}, Moon Sign: ${moonSign}, Ascendant: ${celestialData.ascSign} (${formatZodiacDegrees(celestialData.asc)})`;
  }, [celestialData, activeLocName]);

  const triggerNotice = (msg: string) => {
    setDownloadNotice(msg);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById("celestial-birth-chart-svg");
    if (!svgEl) return;
    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);
      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Celestial_Birth_Chart_${birthDate}_${seekerLocationName.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerNotice("Downloaded Birth Chart SVG Vector");
    } catch (e) {
      console.warn("SVG Download error:", e);
    }
  };

  const handleDownloadPNG = () => {
    const svgEl = document.getElementById("celestial-birth-chart-svg");
    if (!svgEl) return;
    setIsExporting(true);
    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);
      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#0c0c0e";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = "#d4af37";
          ctx.font = "bold 28px serif";
          ctx.textAlign = "center";
          ctx.fillText("CELESTIAL BIRTH CHART LABORATORY", 600, 55);
          
          ctx.fillStyle = "#94a3b8";
          ctx.font = "16px monospace";
          ctx.fillText(`Seeker Location: ${activeLocName} | Date: ${birthDate} | Time: ${birthTime}`, 600, 85);

          ctx.drawImage(img, 100, 100, 1000, 1000);

          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `Celestial_Birth_Chart_${birthDate}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          triggerNotice("Downloaded Birth Chart PNG Image");
        }
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };
      img.onerror = () => {
        setIsExporting(false);
      };
      img.src = url;
    } catch (e) {
      console.warn("PNG Download error:", e);
      setIsExporting(false);
    }
  };

  const handleDownloadTextReport = () => {
    if (!celestialData) return;
    const sunSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Sun"] % 360 + 360) % 360 / 30)]?.name || "Unknown";
    const moonSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Moon"] % 360 + 360) % 360 / 30)]?.name || "Unknown";

    let report = `===========================================================\n`;
    report += `         CELESTIAL BIRTH CHART LABORATORY REPORT           \n`;
    report += `===========================================================\n\n`;
    report += `SEEKER PARAMETERS:\n`;
    report += `- Origin Location: ${activeLocName}\n`;
    report += `- Date of Incarnation: ${birthDate}\n`;
    report += `- Birth Hour & Time: ${birthTime}\n`;
    report += `- Coordinates: Lat ${activeLat.toFixed(2)}°, Lng ${activeLng.toFixed(2)}°, Timezone UTC+${activeTz}h\n`;
    report += `- House Alignment: ${houseSystem} House System\n\n`;

    report += `PRIMAL TRINITY:\n`;
    report += `- Sun Sign: ${sunSign} (Core vitality & active ego)\n`;
    report += `- Moon Sign: ${moonSign} (Inner feelings & subconscious mirror)\n`;
    report += `- Ascendant (ASC): ${celestialData.ascSign} (${formatZodiacDegrees(celestialData.asc)})\n`;
    report += `- Midheaven (MC): ${celestialData.mcSign} (${formatZodiacDegrees(celestialData.mc)})\n\n`;

    report += `ELEMENTAL & MODALITY WEIGHTINGS:\n`;
    Object.entries(celestialData.elementsScore).forEach(([el, score]) => {
      report += `- ${el}: ${score.toFixed(1)} pts\n`;
    });
    if (scoresInterpretation) {
      report += `Signature Archetype: ${scoresInterpretation.element} & ${scoresInterpretation.modality}\n`;
      report += `Analysis: ${scoresInterpretation.elText}\n\n`;
    }

    report += `PLANETARY PLACEMENTS LEDGER:\n`;
    PLANETS.forEach(p => {
      const long = celestialData.placements[p.name];
      if (long !== undefined) {
        report += `- ${p.name} (${p.symbol}): ${formatZodiacDegrees(long)}\n`;
      }
    });

    report += `\nACTIVE PLANETARY ASPECTS (${celestialData.aspects.length}):\n`;
    celestialData.aspects.forEach(a => {
      report += `- ${a.p1} ${a.type} ${a.p2} (Angle: ${a.angle}°, Orb: ${a.orb}°)\n  ${a.meaning}\n`;
    });

    if (compatibilityResult) {
      report += `\nZODIAC RELATIONSHIP RESONANCE:\n`;
      report += `- Pairing: ${selectedSeeker} x ${selectedPartner}\n`;
      report += `- Title: ${compatibilityResult.title} (Score: ${compatibilityResult.score}%)\n`;
      report += `- Insight: ${compatibilityResult.analysis}\n`;
    }

    report += `\n===========================================================\n`;
    report += `  Inscribed in the Aetheric Laboratory | ${new Date().toLocaleDateString()}\n`;
    report += `===========================================================\n`;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Celestial_Birth_Chart_Reading_${birthDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerNotice("Downloaded Text Reading Report");
  };

  const handleDownloadPDF = () => {
    if (!celestialData) return;
    try {
      const doc = new jsPDF();
      const sunSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Sun"] % 360 + 360) % 360 / 30)]?.name || "Unknown";
      const moonSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Moon"] % 360 + 360) % 360 / 30)]?.name || "Unknown";

      doc.setFillColor(15, 15, 20);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(212, 175, 55); // Gold
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CELESTIAL BIRTH CHART LABORATORY REPORT", 14, 20);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.5);
      doc.line(14, 23, 196, 23);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Seeker Origin: ${activeLocName}`, 14, 32);
      doc.text(`Date of Incarnation: ${birthDate} | Birth Time: ${birthTime}`, 14, 38);
      doc.text(`Coordinates: Lat ${activeLat.toFixed(2)}°, Lng ${activeLng.toFixed(2)}° | TZ: UTC+${activeTz}h | House: ${houseSystem}`, 14, 44);

      doc.setFillColor(30, 30, 40);
      doc.roundedRect(14, 50, 182, 35, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("PRIMAL TRINITY", 18, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(220, 220, 220);
      doc.text(`* Sun Sign: ${sunSign} (Vitality & Active Ego)`, 18, 66);
      doc.text(`* Moon Sign: ${moonSign} (Emotional Memory & Subconscious Mirror)`, 18, 72);
      doc.text(`* Ascendant (ASC): ${celestialData.ascSign} (${formatZodiacDegrees(celestialData.asc)})`, 18, 78);

      doc.setTextColor(212, 175, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PLANETARY PLACEMENTS LEDGER", 14, 95);

      let y = 103;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      PLANETS.forEach((p) => {
        const long = celestialData.placements[p.name];
        if (long !== undefined) {
          doc.setTextColor(230, 230, 230);
          doc.text(`${p.name} (${p.symbol})`, 18, y);
          doc.setTextColor(180, 180, 180);
          doc.text(formatZodiacDegrees(long), 80, y);
          y += 6;
        }
      });

      y += 4;
      doc.setTextColor(212, 175, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("ELEMENTAL BREAKDOWN", 14, y);
      y += 7;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      Object.entries(celestialData.elementsScore).forEach(([el, val]) => {
        doc.text(`${el}: ${val.toFixed(1)} pts`, 18, y);
        y += 5;
      });

      if (scoresInterpretation) {
        y += 2;
        doc.text(`Signature Archetype: ${scoresInterpretation.element} & ${scoresInterpretation.modality}`, 18, y);
        y += 6;
        const splitText = doc.splitTextToSize(`Analysis: ${scoresInterpretation.elText}`, 174);
        doc.text(splitText, 18, y);
        y += splitText.length * 5;
      }

      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Inscribed via Celestial Birth Chart Laboratory - ${new Date().toLocaleDateString()}`, 14, 285);

      doc.save(`Celestial_Birth_Chart_Reading_${birthDate}.pdf`);
      triggerNotice("Downloaded PDF Reading Report");
    } catch (err) {
      console.warn("jsPDF error, defaulting to text file:", err);
      handleDownloadTextReport();
    }
  };

  const handlePrint = () => {
    const svgEl = document.getElementById("celestial-birth-chart-svg");
    if (!celestialData) return;

    let svgString = "";
    if (svgEl) {
      const serializer = new XMLSerializer();
      svgString = serializer.serializeToString(svgEl);
      if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
    }

    const sunSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Sun"] % 360 + 360) % 360 / 30)]?.name || "Unknown";
    const moonSign = ZODIAC_SIGNS[Math.floor((celestialData.placements["Moon"] % 360 + 360) % 360 / 30)]?.name || "Unknown";

    triggerNotice("Opening Laboratory Printout Preview...");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Celestial Birth Chart Printout - ${birthDate}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              color: #111;
              background: #ffffff;
              margin: 25px;
              line-height: 1.5;
            }
            h1 {
              font-size: 22px;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-align: center;
              border-bottom: 2px solid #b89130;
              padding-bottom: 10px;
              margin-bottom: 8px;
              color: #2c1f11;
            }
            .subtitle {
              text-align: center;
              font-size: 11px;
              font-family: monospace;
              color: #555;
              margin-bottom: 25px;
            }
            .grid {
              display: flex;
              gap: 25px;
              margin-bottom: 25px;
              align-items: flex-start;
            }
            .chart-col {
              flex: 0 0 340px;
              text-align: center;
            }
            .chart-col svg {
              width: 330px;
              height: 330px;
              border: 1px solid #ccc;
              border-radius: 50%;
              background: #0f0f15;
            }
            .info-col {
              flex: 1;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              font-family: monospace;
              border-bottom: 1px solid #ddd;
              padding-bottom: 4px;
              margin-top: 15px;
              margin-bottom: 8px;
              color: #704c10;
            }
            .trinity-box {
              background: #fdfbf7;
              border: 1px solid #e8e2d5;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 15px;
            }
            .trinity-item {
              font-size: 12.5px;
              margin-bottom: 6px;
            }
            .ledger-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-top: 10px;
            }
            .ledger-table th, .ledger-table td {
              border: 1px solid #ddd;
              padding: 6px 10px;
              text-align: left;
            }
            .ledger-table th {
              background: #f4efdf;
              font-family: monospace;
            }
            @media print {
              body { margin: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>Celestial Birth Chart Laboratory Reading</h1>
          <div class="subtitle">
            Origin Location: <strong>${activeLocName}</strong> &bull; Date of Incarnation: <strong>${birthDate}</strong> &bull; Birth Hour: <strong>${birthTime}</strong><br/>
            Coordinates: Lat ${activeLat.toFixed(2)}°, Lng ${activeLng.toFixed(2)}° (UTC+${activeTz}h) &bull; House System: ${houseSystem}
          </div>

          <div class="grid">
            <div class="chart-col">
              <div class="section-title" style="margin-top:0">Ecliptic Birth Chart Wheel</div>
              ${svgString}
            </div>
            <div class="info-col">
              <div class="trinity-box">
                <div class="section-title" style="margin-top:0">The Primal Trinity</div>
                <div class="trinity-item"><strong>☉ Sun Sign:</strong> ${sunSign} (Core vitality & active ego)</div>
                <div class="trinity-item"><strong>☽ Moon Sign:</strong> ${moonSign} (Emotional memory & subconscious mirror)</div>
                <div class="trinity-item"><strong>⇾ Ascendant (ASC):</strong> ${celestialData.ascSign} (${formatZodiacDegrees(celestialData.asc)})</div>
                <div class="trinity-item"><strong>Midheaven (MC):</strong> ${celestialData.mcSign} (${formatZodiacDegrees(celestialData.mc)})</div>
              </div>

              <div class="section-title">Elemental Archetype</div>
              <div style="font-size: 11.5px; margin-bottom: 10px; line-height: 1.5;">
                <strong>Signature:</strong> ${scoresInterpretation?.element} & ${scoresInterpretation?.modality}<br/>
                ${scoresInterpretation?.elText}
              </div>
            </div>
          </div>

          <div class="section-title">Planetary Placements Ledger</div>
          <table class="ledger-table">
            <thead>
              <tr>
                <th>Planet</th>
                <th>Zodiac Position & Degree</th>
              </tr>
            </thead>
            <tbody>
              ${PLANETS.map(p => {
                const long = celestialData.placements[p.name];
                return long !== undefined ? `<tr><td><strong>${p.name} (${p.symbol})</strong></td><td>${formatZodiacDegrees(long)}</td></tr>` : '';
              }).join('')}
            </tbody>
          </table>

          <div class="section-title">Active Planetary Aspects</div>
          <div style="font-size: 11px; line-height: 1.6;">
            ${celestialData.aspects.slice(0, 10).map(a => `
              <div style="margin-bottom:4px;"><strong>${a.p1} ${a.type} ${a.p2}</strong> (Angle: ${a.angle}°, Orb: ${a.orb}°): ${a.meaning}</div>
            `).join('')}
          </div>

          ${compatibilityResult ? `
            <div class="section-title">Relationship Resonance (${selectedSeeker} x ${selectedPartner})</div>
            <div style="font-size: 11px; line-height: 1.5;">
              <strong>${compatibilityResult.title} (Aetheric Score: ${compatibilityResult.score}%)</strong><br/>
              ${compatibilityResult.analysis}
            </div>
          ` : ''}

          <div style="margin-top:35px; text-align:center; font-size:10px; font-family:monospace; color:#888;">
            Inscribed via Celestial Birth Chart Laboratory &bull; ${new Date().toLocaleDateString()}
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div id="astrological-lab" className="w-full flex flex-col gap-6 mt-8 relative">
      {/* Download / Export Notification Banner */}
      <AnimatePresence>
        {downloadNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-amber-500/90 text-black font-serif text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur border border-amber-300 flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{downloadNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Compass className={`w-5 h-5 ${activeTheme.textPrimary} animate-spin-slow`} />
            <h3 className={`text-xl font-serif font-bold ${activeTheme.textPrimary}`}>
              Celestial Birth Chart Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-serif leading-relaxed max-w-3xl">
            Plot your natal map across the local coordinate horizon. Using accurate orbital elements and a 3-dimensional ecliptic solver, trace the exact planetary nodes and astrological aspects that shape your cosmic blueprint.
          </p>
        </div>

        {/* Global Print, Download & Share Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-serif font-bold text-xs rounded-xl shadow-lg shadow-sky-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Share Birth Chart Reading on Social Media"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Share Reading</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Printout birth chart and full reading analysis"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Reading & Chart</span>
          </button>

          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
              title="Download Chart as scalable SVG vector"
            >
              <Download className="w-3 h-3 text-indigo-400" />
              <span>SVG Chart</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isExporting}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              title="Download Chart as PNG Image"
            >
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              <span>PNG Chart</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
              title="Download Reading as formatted PDF"
            >
              <FileText className="w-3 h-3 text-rose-400" />
              <span>PDF Report</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTextReport}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
              title="Download Reading as Text file"
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>TXT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control laboratory card & main visualization row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Setup Panel (Lg 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-black/40 border border-white/5 rounded-2xl p-5">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Astronomical Parameters
          </span>

          {/* Date & Time */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="natal-date-input" className="text-[11px] text-slate-400 font-serif flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" /> Date of Incarnation
              </label>
              <input
                type="date"
                id="natal-date-input"
                value={birthDate}
                onChange={(e) => handleDateInput(e.target.value)}
                className={`w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-serif dark:scheme-dark`}
              />
            </div>

            {/* Birth Hour & Time Section */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="natal-time-input" className="text-[11px] text-slate-400 font-serif flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Seeker's Birth Hour & Time
                </label>
                <span className="text-[9px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Hour Remembered
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={birthTime.split(':')[0] || "12"}
                    onChange={(e) => handleHourSelectChange(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-mono appearance-none"
                    title="Select birth hour"
                  >
                    {Array.from({ length: 24 }).map((_, h) => {
                      const hStr = h.toString().padStart(2, '0');
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const displayH = h % 12 === 0 ? 12 : h % 12;
                      return (
                        <option key={h} value={hStr} className="bg-[#141416] text-white">
                          Hour {hStr}:00 ({displayH} {ampm})
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-[10px]">
                    ▼
                  </div>
                </div>
                <input
                  type="time"
                  id="natal-time-input"
                  value={birthTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-mono"
                  title="Exact birth time (HH:MM)"
                />
              </div>
              <p className="text-[10px] font-mono text-amber-300/80 bg-black/30 p-1.5 rounded border border-white/5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Last Seeker Birth Hour Saved: <strong className="text-amber-200">{birthTime}</strong></span>
              </p>
            </div>
          </div>

          {/* Location selector (Where Seeker is From) */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-serif flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> Where You're From (Seeker Location)
                </span>
                <span className="text-[9px] font-mono text-slate-500">Origin City/Land</span>
              </label>
              <input
                type="text"
                value={seekerLocationName}
                onChange={(e) => handleLocationNameChange(e.target.value)}
                placeholder="Write in where you are from (e.g. Athens, Paris, Babylon...)"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-serif"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-[10px] text-slate-500 font-serif">
                Or choose an Astronomical Alignment Node:
              </label>
              <div className="relative">
                <select
                  value={isCustomLoc ? "custom" : selectedPresetIndex}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer font-serif appearance-none"
                >
                  {LOCATION_PRESETS.map((p, idx) => (
                    <option key={idx} value={idx} className="bg-[#141416] text-white">
                      {p.name}
                    </option>
                  ))}
                  <option value="custom" className="bg-[#141416] text-amber-300 font-bold">🗺️ Custom Telluric Coordinates ({seekerLocationName || 'Custom'})</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* If Preset Selected: Description */}
            {!isCustomLoc && LOCATION_PRESETS[selectedPresetIndex] && (
              <p className="text-[10px] text-slate-500 italic leading-snug font-serif mt-0.5">
                {LOCATION_PRESETS[selectedPresetIndex].description}
              </p>
            )}

            {/* Custom Coordinates Inputs */}
            {isCustomLoc && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-white/5 mt-1 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-mono">LATITUDE (-90 to 90)</span>
                    <input
                      type="text"
                      placeholder="31.20"
                      value={customLat}
                      onChange={(e) => handleCustomLatChange(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-mono">LONGITUDE (-180 to 180)</span>
                    <input
                      type="text"
                      placeholder="29.91"
                      value={customLng}
                      onChange={(e) => handleCustomLngChange(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-mono">UTC TIMEZONE OFFSET (Hours)</span>
                  <input
                    type="text"
                    placeholder="2"
                    value={customTz}
                    onChange={(e) => handleCustomTzChange(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-slate-300 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Coordinate Status Badges */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 text-[10px] font-mono text-slate-400 bg-black/20 p-2.5 rounded-lg border border-white/5 text-center">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500">LAT</span>
              <span className="text-white font-semibold">{activeLat >= 0 ? `${activeLat.toFixed(2)}°N` : `${Math.abs(activeLat).toFixed(2)}°S`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500">LNG</span>
              <span className="text-white font-semibold">{activeLng >= 0 ? `${activeLng.toFixed(2)}°E` : `${Math.abs(activeLng).toFixed(2)}°W`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500">TZ UTC</span>
              <span className="text-amber-400 font-semibold">{activeTz >= 0 ? `+${activeTz}` : activeTz}h</span>
            </div>
          </div>

          {/* House System selector */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[11px] text-slate-400 font-serif">Aetheric House Alignment System</span>
            <div className="flex rounded-lg bg-black/50 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setHouseSystem('Equal')}
                className={`flex-1 text-[10px] font-serif py-1 rounded transition-all ${houseSystem === 'Equal' ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Equal House
              </button>
              <button
                type="button"
                onClick={() => setHouseSystem('Whole')}
                className={`flex-1 text-[10px] font-serif py-1 rounded transition-all ${houseSystem === 'Whole' ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Whole Sign
              </button>
            </div>
            <p className="text-[9px] text-slate-500 leading-normal font-serif">
              {houseSystem === 'Equal' 
                ? "Equal system pins the 1st house cusp exactly to your Ascendant, drawing 30° wedges."
                : "Whole system pins the 1st house cusp to 0° of your Ascendant zodiac sign."}
            </p>
          </div>
        </div>

        {/* Middle Column: Graphical Natal Wheel & Details (Lg 8 columns) */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-6 bg-black/35 border border-white/5 rounded-2xl p-6 min-h-[480px]">
          
          {/* SVG Natal Wheel Display (D3 concept utilizing responsive SVG layout) */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
            
            {/* Chart Legend Overlay */}
            <div className="absolute top-0 left-0 text-[10px] font-mono text-slate-500 flex flex-col gap-1 pointer-events-none bg-black/30 p-2.5 rounded-lg border border-white/5">
              <span className="text-amber-400 font-bold flex items-center gap-1">ASC: {celestialData ? formatZodiacDegrees(celestialData.asc).substring(0, 16) : ""}</span>
              <span className="text-slate-300 flex items-center gap-1">MC: {celestialData ? formatZodiacDegrees(celestialData.mc).substring(0, 16) : ""}</span>
            </div>

            {/* Top Right Prominent Download Birth Chart Button */}
            <div className="absolute top-0 right-0 z-10 flex items-center gap-1">
              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-serif font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                title="Download Birth Chart Image (PNG)"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Download Birth Chart</span>
                <span className="sm:hidden">Download</span>
              </button>
            </div>

            {/* MAIN CHART SVG */}
            <div className="w-full max-w-[340px] aspect-square relative flex items-center justify-center">
              {celestialData ? (
                <svg
                  id="celestial-birth-chart-svg"
                  viewBox="-250 -250 500 500"
                  className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
                >
                  <defs>
                    {/* Alchemical glows and gradients */}
                    <radialGradient id="sigil-glow" cx="0%" cy="0%" r="100%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="aspect-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    
                    {/* Elements gradients */}
                    <linearGradient id="fire-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="earth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#064e3b" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="air-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#155e75" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0e7490" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>

                  {/* Central Glow Field */}
                  <circle cx="0" cy="0" r="100" fill="url(#aspect-glow)" />

                  {/* 1. ASPECT LINES (Drawn in center) */}
                  <g className="aspect-lines-group">
                    {celestialData.aspects.map((aspect, idx) => {
                      const p1Coords = getCoords(celestialData.placements[aspect.p1], 100);
                      const p2Coords = getCoords(celestialData.placements[aspect.p2], 100);
                      
                      const isHovered = hoveredAspect && hoveredAspect.p1 === aspect.p1 && hoveredAspect.p2 === aspect.p2;
                      const hasActivePlanetHover = hoveredPlanet && (hoveredPlanet === aspect.p1 || hoveredPlanet === aspect.p2);
                      const isProminent = isHovered || hasActivePlanetHover;

                      return (
                        <g key={`aspect-${aspect.p1}-${aspect.p2}-${idx}`}>
                          <line
                            x1={p1Coords.x}
                            y1={p1Coords.y}
                            x2={p2Coords.x}
                            y2={p2Coords.y}
                            stroke={aspect.color}
                            strokeWidth={isProminent ? 2.5 : 0.8}
                            strokeDasharray={aspect.type === "Conjunction" ? "none" : aspect.type === "Sextile" ? "3 3" : aspect.type === "Square" ? "5 2" : "none"}
                            opacity={hoveredPlanet || hoveredAspect ? (isProminent ? 0.95 : 0.08) : 0.4}
                            className="transition-all duration-300"
                            style={{ filter: isProminent ? `drop-shadow(0 0 4px ${aspect.color})` : 'none' }}
                          />
                          {/* Interactive touch targets over aspect lines */}
                          <line
                            x1={p1Coords.x}
                            y1={p1Coords.y}
                            x2={p2Coords.x}
                            y2={p2Coords.y}
                            stroke="transparent"
                            strokeWidth={8}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredAspect(aspect)}
                            onMouseLeave={() => setHoveredAspect(null)}
                          />
                        </g>
                      );
                    })}
                  </g>

                  {/* Concentric rings to structure the astrology sectors */}
                  <circle cx="0" cy="0" r="230" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="200" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
                  <circle cx="0" cy="0" r="170" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="100" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" />
                  
                  {/* Compass marks in the absolute center */}
                  <circle cx="0" cy="0" r="4" fill="#D4AF37" opacity="0.7" />
                  <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                  {/* 2. ZODIAC RING ARCHITECTURE */}
                  <g className="zodiac-segments-group">
                    {ZODIAC_SIGNS.map((sign, idx) => {
                      // Get SVG angles corresponding to sign range [start, end]
                      const asc = celestialData.asc;
                      const startAng = (180 - (sign.range[0] - asc)) * Math.PI / 180;
                      const endAng = (180 - (sign.range[1] - asc)) * Math.PI / 180;

                      // Midpoint for glyph placement
                      const midAng = (startAng + endAng) / 2;
                      const glyphRadius = 215;
                      const labelX = glyphRadius * Math.cos(midAng);
                      const labelY = glyphRadius * Math.sin(midAng);

                      // Path generation for arc segments
                      const rIn = 200;
                      const rOut = 230;
                      const x1_in = rIn * Math.cos(startAng);
                      const y1_in = rIn * Math.sin(startAng);
                      const x1_out = rOut * Math.cos(startAng);
                      const y1_out = rOut * Math.sin(startAng);
                      
                      const x2_in = rIn * Math.cos(endAng);
                      const y2_in = rIn * Math.sin(endAng);
                      const x2_out = rOut * Math.cos(endAng);
                      const y2_out = rOut * Math.sin(endAng);

                      // Select gradient based on element
                      const grad = sign.element === "Ignis" ? "url(#fire-grad)" 
                                 : sign.element === "Materia" ? "url(#earth-grad)"
                                 : sign.element === "Aer" ? "url(#air-grad)"
                                 : "url(#water-grad)";

                      return (
                        <g key={`zodiac-sign-${sign.name || idx}`}>
                          {/* Filled arc segment */}
                          <path
                            d={`M ${x1_in} ${y1_in} L ${x1_out} ${y1_out} A ${rOut} ${rOut} 0 0 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rIn} ${rIn} 0 0 0 ${x1_in} ${y1_in}`}
                            fill={grad}
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="0.8"
                          />
                          {/* Zodiac Glyph Character */}
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={sign.color}
                            fontSize="11"
                            fontWeight="bold"
                            className="select-none opacity-80"
                          >
                            {sign.symbol}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* 3. HOUSE LINES & LABELS (Drawn from center to outer ring) */}
                  <g className="houses-group">
                    {celestialData.houses.map((cusp, idx) => {
                      const houseNum = idx + 1;
                      const hasNote = Boolean(houseNotes?.[houseNum]);
                      const pCoordsInner = getCoords(cusp, 100);
                      const pCoordsOuter = getCoords(cusp, 200);

                      // Place house number label at midpoint angle of the house
                      const nextCusp = celestialData.houses[(idx + 1) % 12];
                      const midCusp = cusp + ((nextCusp - cusp + 360) % 360) / 2;
                      const labelCoords = getCoords(midCusp, 120);

                      return (
                        <g 
                          key={`house-cusp-${idx}`} 
                          className="cursor-pointer group/house"
                          onClick={() => onSelectHouseNote?.(houseNum)}
                        >
                          {/* Invisible expanded hit area for clicking */}
                          <circle
                            cx={labelCoords.x}
                            cy={labelCoords.y}
                            r={12}
                            fill="transparent"
                            className="hover:fill-amber-500/20 transition-colors"
                          >
                            <title>{`House ${houseNum} - Click to add or view personal note`}</title>
                          </circle>

                          {/* House divider line */}
                          <line
                            x1={pCoordsInner.x}
                            y1={pCoordsInner.y}
                            x2={pCoordsOuter.x}
                            y2={pCoordsOuter.y}
                            stroke={hasNote ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.12)"}
                            strokeWidth={idx === 0 || idx === 3 || idx === 6 || idx === 9 ? "1.5" : "0.5"}
                            strokeDasharray={idx === 0 || idx === 3 || idx === 6 || idx === 9 ? "none" : "2 2"}
                            className="transition-all group-hover/house:stroke-amber-400/60"
                          />

                          {/* Note Indicator Dot/Glow if annotated */}
                          {hasNote && (
                            <circle
                              cx={labelCoords.x}
                              cy={labelCoords.y - 7}
                              r={2}
                              fill="#F59E0B"
                              className="animate-pulse"
                            />
                          )}

                          {/* House Number Text */}
                          <text
                            x={labelCoords.x}
                            y={labelCoords.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={hasNote ? "#FCD34D" : "#94A3B8"}
                            fontWeight={hasNote ? "bold" : "normal"}
                            fontSize={hasNote ? "9" : "8"}
                            fontFamily="monospace"
                            className="select-none transition-colors group-hover/house:fill-amber-300"
                          >
                            {houseNum}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* ASCENDANT / DESCENDANT Horizontal Axis Lines (Highlighting) */}
                  <g className="axes-highlight">
                    {/* ASC (Left, 180 degrees) */}
                    <line x1="-100" y1="0" x2="-240" y2="0" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6" />
                    <polygon points="-240,0 -234,-4 -234,4" fill="#F59E0B" opacity="0.6" />
                    <text x="-190" y="-8" fill="#F59E0B" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="select-none opacity-80">ASC</text>

                    {/* DSC (Right, 0 degrees) */}
                    <line x1="100" y1="0" x2="200" y2="0" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    <text x="180" y="-8" fill="#6366F1" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="select-none opacity-80">DSC</text>

                    {/* MC (Vertical top) and IC (Vertical bottom) */}
                    {celestialData && (
                      <>
                        {/* MC line */}
                        <line
                          x1={getCoords(celestialData.mc, 100).x}
                          y1={getCoords(celestialData.mc, 100).y}
                          x2={getCoords(celestialData.mc, 200).x}
                          y2={getCoords(celestialData.mc, 200).y}
                          stroke="#E2E8F0"
                          strokeWidth="1.2"
                          opacity="0.5"
                        />
                        <text
                          x={getCoords(celestialData.mc, 185).x + 10}
                          y={getCoords(celestialData.mc, 185).y}
                          fill="#E2E8F0"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="select-none opacity-80"
                        >
                          MC
                        </text>
                      </>
                    )}
                  </g>

                  {/* 4. PLANET MARKERS (Rendered in concentric orbits depending on proximity to avoid overlaps) */}
                  <g className="planetary-markers">
                    {PLANETS.map((planet) => {
                      const long = celestialData.placements[planet.name];
                      
                      // Adaptive dispersion algorithm:
                      // If another planet shares an extremely close longitude, fluctuate the plotting radius slightly to avoid visual stack collisions
                      let radius = 150;
                      const closeColliders = Object.entries(celestialData.placements).filter(
                        ([name, otherLong]) => name !== planet.name && Math.abs((otherLong - long + 360) % 360) < 6
                      );
                      if (closeColliders.length > 0) {
                        // Alternate radius to break overlaps
                        const pIndex = PLANETS.findIndex(p => p.name === planet.name);
                        radius = pIndex % 2 === 0 ? 135 : 165;
                      }

                      const pt = getCoords(long, radius);
                      const isHovered = hoveredPlanet === planet.name;
                      const isSelected = selectedPlanet === planet.name;
                      const isProminent = isHovered || isSelected;

                      return (
                        <g
                          key={planet.name}
                          className="cursor-pointer group"
                          onClick={() => setSelectedPlanet(planet.name)}
                          onMouseEnter={() => setHoveredPlanet(planet.name)}
                          onMouseLeave={() => setHoveredPlanet(null)}
                        >
                          {/* Radial indicator tick */}
                          <line
                            x1={getCoords(long, 100).x}
                            y1={getCoords(long, 100).y}
                            x2={getCoords(long, 200).x}
                            y2={getCoords(long, 200).y}
                            stroke={planet.color}
                            strokeWidth="0.4"
                            opacity={isProminent ? 0.6 : 0.15}
                            className="transition-all"
                          />

                          {/* Hover outer glow pulse */}
                          {isProminent && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="15"
                              fill="none"
                              stroke={planet.color}
                              strokeWidth="1.5"
                              className="animate-ping"
                              style={{ opacity: 0.15 }}
                            />
                          )}

                          {/* Planet Solid Capsule */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="9"
                            fill="#141416"
                            stroke={isProminent ? planet.color : "rgba(255,255,255,0.2)"}
                            strokeWidth={isProminent ? 1.8 : 0.8}
                            style={{ filter: isProminent ? `drop-shadow(0 0 5px ${planet.color})` : 'none' }}
                            className="transition-all duration-300"
                          />

                          {/* Planet Glyph Symbol */}
                          <text
                            x={pt.x}
                            y={pt.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={planet.color}
                            fontSize="9"
                            fontWeight="bold"
                            className="select-none font-sans"
                          >
                            {planet.symbol}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              ) : (
                <div className="text-slate-500 text-xs italic font-serif">Generating map fields...</div>
              )}
            </div>

            {/* Quick Chart Action Bar & Helper Instructions */}
            <div className="flex flex-col items-center gap-2.5 mt-1">
              <span className="text-[10px] text-slate-500 font-serif text-center italic flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full border border-white/5 select-none pointer-events-none">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Click any planet symbol on the wheel to decrypt placement.
              </span>

              {/* Download and Print quick buttons for Chart Wheel */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  disabled={isExporting}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 rounded-lg border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Download Birth Chart PNG Image"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Download Chart (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold text-indigo-300 bg-indigo-950/30 hover:bg-indigo-900/50 rounded-lg border border-indigo-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  title="Download SVG vector file onto device"
                >
                  <ImageIcon className="w-3 h-3 text-indigo-400" />
                  <span>SVG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 rounded-lg border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  title="Download Reading as formatted PDF"
                >
                  <FileText className="w-3 h-3 text-rose-400" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-300 bg-slate-950/30 hover:bg-slate-900/50 rounded-lg border border-slate-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  title="Printout Chart & Full Reading"
                >
                  <Printer className="w-3 h-3 text-amber-400" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Active Planet Details Card (Lg 4 columns inside middle row) */}
          <div className="w-full md:w-[220px] shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-5 flex flex-col justify-between">
            
            {/* Aspect interpretation or selected planet detail view */}
            <AnimatePresence mode="wait">
              {hoveredAspect ? (
                <motion.div
                  key="aspect-hover-detail"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="flex flex-col gap-3 h-full justify-start text-left"
                >
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Active Aspect</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-serif font-bold text-white flex items-center gap-1">
                      {hoveredAspect.p1} {hoveredAspect.type === "Opposition" ? "☍" : hoveredAspect.type === "Trine" ? "△" : hoveredAspect.type === "Square" ? "□" : hoveredAspect.type === "Sextile" ? "✳" : "☌"} {hoveredAspect.p2}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      Exact Angle: <strong className="text-amber-500">{hoveredAspect.angle}°</strong> (Orb: {hoveredAspect.orb}°)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-serif text-slate-400 leading-snug">
                    <span className="font-bold text-white block mb-1">Celestial Influence:</span>
                    {hoveredAspect.meaning}
                  </div>
                </motion.div>
              ) : selectedPlanetInfo ? (
                <motion.div
                  key="planet-selected-detail"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="flex flex-col gap-3 text-left"
                >
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">
                    <Circle className="w-2.5 h-2.5" style={{ fill: selectedPlanetInfo.def.color, color: selectedPlanetInfo.def.color }} /> Stellar Node Placement
                  </span>
                  
                  <div className="flex flex-col">
                    <span className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                      <span className="text-lg" style={{ color: selectedPlanetInfo.def.color }}>{selectedPlanetInfo.def.symbol}</span>
                      {selectedPlanetInfo.def.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 leading-tight mt-1">
                      Zodiac: <strong style={{ color: selectedPlanetInfo.sign.color }}>{selectedPlanetInfo.degreeFormatted}</strong>
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[9px] font-mono text-slate-400 leading-tight">
                        Sphere: <strong className="text-slate-200">House {selectedPlanetInfo.houseNum}</strong>
                      </span>
                      {onSelectHouseNote && (
                        <button
                          type="button"
                          onClick={() => onSelectHouseNote(selectedPlanetInfo.houseNum)}
                          className="text-[9px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          {houseNotes?.[selectedPlanetInfo.houseNum] ? '📝 View House Note' : '➕ Add Note'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badges for modality and element */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${ELEMENT_STYLES[selectedPlanetInfo.sign.element]?.badge || 'bg-slate-800'}`}>
                      {selectedPlanetInfo.sign.element}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 border border-white/5 text-slate-300">
                      {selectedPlanetInfo.sign.modality}
                    </span>
                  </div>

                  <p className="text-[11px] font-serif text-slate-400 leading-relaxed italic border-l border-white/10 pl-2.5 my-1.5">
                    "{selectedPlanetInfo.def.description}"
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-serif text-slate-400 leading-tight flex flex-col gap-1.5">
                    <div>
                      <span className="font-bold text-white block mb-0.5">House Domain:</span>
                      {selectedPlanetInfo.houseDesc}
                    </div>
                    {onSelectHouseNote && (
                      <button
                        type="button"
                        onClick={() => onSelectHouseNote(selectedPlanetInfo.houseNum)}
                        className="self-start px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-serif transition-colors cursor-pointer flex items-center gap-1 mt-1"
                      >
                        <span>{houseNotes?.[selectedPlanetInfo.houseNum] ? '📝 Edit Personal House Inscription' : '✨ Inscribe Personal House Note'}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="text-slate-500 text-xs italic font-serif text-center py-10">
                  Select a stellar planet node to inspect.
                </div>
              )}
            </AnimatePresence>

            {/* Micro planet browser rail at bottom */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4 mt-4">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Planet Ledger</span>
              <div className="grid grid-cols-5 gap-1">
                {PLANETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedPlanet(p.name)}
                    className={`p-1.5 rounded border text-center transition-all cursor-pointer font-serif text-xs ${selectedPlanet === p.name ? 'border-amber-500/50 bg-amber-500/10 text-white' : 'border-white/5 bg-black/40 text-slate-500 hover:text-slate-300 hover:border-white/10'}`}
                    title={`${p.name} (${p.symbol})`}
                  >
                    {p.symbol}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Synthesis Reports row */}
      {celestialData && scoresInterpretation && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Big Three Placements Card */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2.5">
              <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> The Primal Trinity
            </span>
            <div className="flex flex-col gap-3">
              {/* Sun Sign */}
              <div className="flex items-start gap-3">
                <span className="text-xl text-[#F59E0B] font-serif bg-amber-950/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-amber-500/10">☉</span>
                <div className="flex flex-col">
                  <span className="text-xs font-serif text-slate-400 flex items-center gap-1">
                    Sun Sign
                  </span>
                  <span className="text-sm font-serif font-bold text-white leading-snug">
                    {ZODIAC_SIGNS[Math.floor((celestialData.placements["Sun"] % 360 + 360) % 360 / 30)]?.name || "Unknown"}
                  </span>
                  <p className="text-[10px] text-slate-500 font-serif leading-tight mt-0.5">
                    Your core vitality, active ego, conscious focus, and personal solar radiation.
                  </p>
                </div>
              </div>

              {/* Moon Sign */}
              <div className="flex items-start gap-3">
                <span className="text-xl text-[#E2E8F0] font-serif bg-slate-900/40 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-500/10">☽</span>
                <div className="flex flex-col">
                  <span className="text-xs font-serif text-slate-400 flex items-center gap-1">
                    Moon Sign
                  </span>
                  <span className="text-sm font-serif font-bold text-white leading-snug">
                    {ZODIAC_SIGNS[Math.floor((celestialData.placements["Moon"] % 360 + 360) % 360 / 30)]?.name || "Unknown"}
                  </span>
                  <p className="text-[10px] text-slate-500 font-serif leading-tight mt-0.5">
                    Your inner feelings, shadow habits, emotional memory, and lunar mirror.
                  </p>
                </div>
              </div>

              {/* Ascendant Sign */}
              <div className="flex items-start gap-3">
                <span className="text-xl text-amber-400 font-serif bg-amber-950/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-amber-500/10">⇾</span>
                <div className="flex flex-col">
                  <span className="text-xs font-serif text-slate-400 flex items-center gap-1">
                    Ascendant Sign (ASC)
                  </span>
                  <span className="text-sm font-serif font-bold text-white leading-snug animate-pulse">
                    {celestialData.ascSign}
                  </span>
                  <p className="text-[10px] text-slate-500 font-serif leading-tight mt-0.5">
                    The rising sign; your primary lens on reality, bodily energy, and outward mask.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Elemental Distribution and Weightings */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Domination of Elements
            </span>
            <div className="flex flex-col gap-2.5">
              {Object.entries(celestialData.elementsScore).map(([elName, score]) => {
                const maxScore = 20; // safe scale
                const pct = Math.min(100, Math.max(8, (score / maxScore) * 100));
                const style = ELEMENT_STYLES[elName];
                const ElIcon = style.icon;

                return (
                  <div key={elName} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-serif">
                      <span className="flex items-center gap-1 text-slate-300">
                        <ElIcon className="w-3.5 h-3.5" style={{ color: style.color }} /> {elName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{score.toFixed(1)} points</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}50` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dominant Element Narrative summary */}
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-[10px] font-serif leading-snug text-slate-400 mt-1">
              <span className="text-white font-bold block mb-0.5">Signature Archetype: {scoresInterpretation.element} & {scoresInterpretation.modality}</span>
              Your chart is structurally dominant in <strong className="text-white">{scoresInterpretation.element}</strong> energy, suggesting: {scoresInterpretation.elText}
            </div>
          </div>

          {/* Active Aspects Feed */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-white/5 pb-2.5">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Active Planetary Aspects ({celestialData.aspects.length})
            </span>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[190px] pr-1.5 custom-scrollbar">
              {celestialData.aspects.length > 0 ? (
                celestialData.aspects.slice(0, 10).map((aspect, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 transition-all hover:bg-black/40 hover:border-white/10"
                    onMouseEnter={() => setHoveredAspect(aspect)}
                    onMouseLeave={() => setHoveredAspect(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-white">
                        {aspect.p1}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                        style={{ backgroundColor: `${aspect.color}15`, color: aspect.color, border: `1px solid ${aspect.color}30` }}
                      >
                        {aspect.type}
                      </span>
                      <span className="text-xs font-serif font-bold text-white">
                        {aspect.p2}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">
                      Orb {aspect.orb}°
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 text-xs italic font-serif py-8 text-center">
                  No prominent planetary aspects within major orbital thresholds.
                </div>
              )}
            </div>
            
            <span className="text-[8px] text-slate-500 font-mono italic block text-right mt-auto">
              Showing top 10 calculated planetary geometric ratios.
            </span>
          </div>

        </div>

        {/* Zodiac Compatibility Insight Panel */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-5 text-left mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Heart className="w-4 h-4 animate-pulse" />
              </span>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-mono tracking-widest text-slate-400">Relationship Resonance</span>
                <h3 className="text-lg font-serif font-bold text-white">Zodiac Compatibility Insight</h3>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Mystery School: <span className="text-indigo-400 font-bold">{school}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Input Selectors */}
            <div className="md:col-span-5 flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Seeker's Zodiac Sign</span>
                  {userZodiacSign && (
                    <span className="text-[9px] text-indigo-400 italic font-serif">Calculated from Chart</span>
                  )}
                </label>
                <select
                  value={selectedSeeker}
                  onChange={(e) => setSelectedSeeker(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-serif"
                >
                  {ZODIAC_SIGNS.map((sign) => (
                    <option key={sign.name} value={sign.name} className="bg-zinc-900">
                      {sign.symbol} {sign.name} ({sign.element})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Partner's Zodiac Sign</span>
                  {partnerZodiacSign && (
                    <span className="text-[9px] text-indigo-400 italic font-serif">Aligned with Partner</span>
                  )}
                </label>
                <select
                  value={selectedPartner}
                  onChange={(e) => {
                    const newSign = e.target.value;
                    setSelectedPartner(newSign);
                    if (onPartnerZodiacSignChange) {
                      onPartnerZodiacSignChange(newSign);
                    }
                  }}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-serif"
                >
                  {ZODIAC_SIGNS.map((sign) => (
                    <option key={sign.name} value={sign.name} className="bg-zinc-900">
                      {sign.symbol} {sign.name} ({sign.element})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={compLoading}
                onClick={() => fetchCompatibility(selectedSeeker, selectedPartner)}
                className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10"
              >
                {compLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Harmonizing Frequencies...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Calculate Compatibility
                  </>
                )}
              </button>
            </div>

            {/* Right: Results Display */}
            <div className="md:col-span-7 flex flex-col justify-center min-h-[180px]">
              {compLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-slate-400 font-serif">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-white animate-pulse">Consulting the Alchemical Oracle</span>
                    <span className="text-[10px] font-mono text-slate-500">Aligning {selectedSeeker} with {selectedPartner} under {school}...</span>
                  </div>
                </div>
              ) : compError ? (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs text-center font-serif py-8">
                  {compError}
                </div>
              ) : compatibilityResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">Resonance Title</span>
                      <span className="text-sm font-serif font-bold text-white">{compatibilityResult.title}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Aetheric Score</span>
                      <span className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
                        {compatibilityResult.score}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-xs font-serif leading-relaxed text-slate-300">
                    {compatibilityResult.analysis}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/10 rounded-xl bg-black/10">
                  <Heart className="w-8 h-8 text-slate-600 mb-2 stroke-1" />
                  <span className="text-xs font-serif text-slate-400">Seeker & Partner Celestial Channels Idle</span>
                  <span className="text-[10px] font-mono text-slate-600 mt-1">Click the button above to begin alchemical harmonization</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Laboratory Export & Printout Footer Card */}
        <div className="bg-gradient-to-r from-amber-950/20 via-black/40 to-indigo-950/20 border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold">Inscribe & Preserve Cosmic Reading</span>
              <p className="text-xs font-serif text-slate-300 mt-0.5">
                Download your birth chart graphic (SVG/PNG) or print a full astronomical reading report for physical archival or viewing on any device.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-serif font-bold text-xs rounded-xl shadow-lg shadow-sky-500/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>Share Reading to Social</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-serif font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Printout Full Reading & Chart</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-2.5 bg-black/60 hover:bg-black/80 border border-white/10 text-slate-200 hover:text-white text-xs font-serif rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="px-3 py-2.5 bg-black/60 hover:bg-black/80 border border-white/10 text-slate-200 hover:text-white text-xs font-serif rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>SVG Vector</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isExporting}
              className="px-3 py-2.5 bg-black/60 hover:bg-black/80 border border-white/10 text-slate-200 hover:text-white text-xs font-serif rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>PNG Image</span>
            </button>
          </div>
        </div>
      </>
    )}

    {/* Social Share Modal */}
    <SocialShareModal
      isOpen={isShareModalOpen}
      onClose={() => setIsShareModalOpen(false)}
      title="Share Astrological Birth Chart"
      text={chartShareText}
      activeTheme={activeTheme}
    />
  </div>
);
}
