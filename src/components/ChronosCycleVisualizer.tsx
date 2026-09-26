import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  RotateCw,
  Play,
  Pause,
  ChevronRight,
  Activity,
  CircleDot,
  Info,
  Hourglass,
  Compass,
  FileText,
  TrendingUp,
  BarChart2,
  Plus,
  Trash2,
  X,
  Clock,
  BookOpen,
  Check,
  Tag
} from 'lucide-react';
import * as d3 from 'd3';

export interface PastInquiry {
  id: string;
  question: string;
  answer: string;
  school: string;
  timestamp: string;
  zodiacSign?: string;
  tags?: string[];
  notes?: string;
}

export interface CustomMystery {
  id: string;
  title: string;
  date: string; // ISO string or datetime-local string
  description: string;
  school: string;
  zodiacSign?: string;
  createdAt?: string;
}

interface CyclePhase {
  name: string;
  symbol: string;
  meaning: string;
  epoch: string;
  historicalEra: string;
  description: string;
  resonanceScore: number; // calculated dynamically
  bestOperations?: string;
  scriptureTheme?: string;
}

interface SchoolCycle {
  title: string;
  periodicity: string;
  description: string;
  cosmicVariable: string; // temperature, aether density, etc.
  phases: CyclePhase[];
}

interface ChronosCycleVisualizerProps {
  school: string;
  inquiryText: string;
  answerText: string;
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
  pastInquiries?: PastInquiry[];
}

// Default initial custom historical mysteries seed if local storage is completely empty
const INITIAL_CUSTOM_MYSTERIES: CustomMystery[] = [
  {
    id: "mystery-qumran-1947",
    title: "Discovery of Qumran Cave 1 Scroll Manuscripts",
    date: "1947-11-29T10:00:00",
    description: "Bedouin shepherds uncover ancient pottery jars containing the Great Isaiah Scroll and Community Rule in Judean Desert caves near Qumran.",
    school: "Dead Sea Scrolls",
    zodiacSign: "Sagittarius",
    createdAt: new Date().toISOString()
  },
  {
    id: "mystery-nag-hammadi-1945",
    title: "Unearthing of Nag Hammadi Gnostic Codices",
    date: "1945-12-15T14:30:00",
    description: "Twelve leather-bound papyrus codices containing the Secret Book of John and Gospel of Thomas are discovered sealed in a red jar near Nag Hammadi.",
    school: "Gnosticism",
    zodiacSign: "Capricorn",
    createdAt: new Date().toISOString()
  },
  {
    id: "mystery-emerald-tablet-800",
    title: "Hermetic Emerald Tablet Transmutation Inscription",
    date: "0800-03-21T06:00:00",
    description: "Jabir ibn Hayyan records Tabula Smaragdina: 'That which is Below corresponds to that which is Above, to accomplish the miracles of the One Thing.'",
    school: "Hermetic Alchemy",
    zodiacSign: "Aries",
    createdAt: new Date().toISOString()
  }
];

// Master Alchemical Database matching the schools of thought perfectly
const CYCLE_DATABASE: Record<string, SchoolCycle> = {
  "Hermetic Alchemy": {
    title: "Magnus Opus Great Alchemical Cycle",
    periodicity: "Yearly Solar-Lunar Conjunctions",
    cosmicVariable: "Calcination Heat Factor",
    description: "The classic four-part cycle of transmutation progressing from primordial dark matter to the refined crown of physical immortality.",
    phases: [
      { name: "Nigredo (Blackness)", symbol: "🜔", meaning: "Decomposition and dissolution of egotistical structures", epoch: "The Abyssal Seed", historicalEra: "Pre-Socratic Primordiality", description: "This phase demands complete breakdown of the subject. All initial compounds are boiled away in the dark fire.", resonanceScore: 0 },
      { name: "Albedo (Whiteness)", symbol: "🜕", meaning: "Purification and separation of soul elements", epoch: "The Lunar Washing", historicalEra: "Alexandrian Hermetic Era", description: "The ash is washed clean by the silver rains of reflective consciousness. The ego is separated from pure spirit.", resonanceScore: 0 },
      { name: "Citrinitas (Yellowness)", symbol: "🜚", meaning: "Spiritual awakening and solar alignment", epoch: "The Solar Dawn", historicalEra: "Late European Renaissance", description: "A yellow illumination dawns within the crucible, revealing the hidden, indestructible core of intellect.", resonanceScore: 0 },
      { name: "Rubedo (Redness)", symbol: "🜗", meaning: "Mystical marriage and final crystallization of gold", epoch: "The Crown Conjunction", historicalEra: "Age of Spiritual Adepts", description: "The ultimate synthesis. The red phoenix rises, merging body and spirit in a permanent state of divine realization.", resonanceScore: 0 }
    ]
  },
  "Gnosticism": {
    title: "Eons of the Pleroma Fall & Return",
    periodicity: "8,400 Cosmic Aeon Revolutions",
    cosmicVariable: "Gnostic Spark Frequency",
    description: "The descent of divine consciousness (Sophia) into the physical prison (Kenoma) and its systematic elevation back to the celestial source.",
    phases: [
      { name: "Bythos (Primordial Depth)", symbol: "⎊", meaning: "The silent, unmanifested source of all divine emanations", epoch: "Pre-Temporal Void", historicalEra: "The Silent Beginning", description: "Eternal silence from which the original syzygies emerge. High potential energy, zero distortion.", resonanceScore: 0 },
      { name: "Sophia's Descent (The Fall)", symbol: "🜂", meaning: "Desire of intellect causing fractures in cosmic light", epoch: "The Cosmic Tear", historicalEra: "The Foundation of Matter", description: "Shattered celestial particles descend. Sophia falls, giving rise to cosmic grief, fear, and material shadows.", resonanceScore: 0 },
      { name: "Kenoma (The Prison Grid)", symbol: "⊞", meaning: "The demiurgic rule of the Archons over mortal flesh", epoch: "Archontic Hegemony", historicalEra: "Ages of Spiritual Blindness", description: "Humans wander asleep inside the physical sandbox, governed by blind planetary rulers who mock the divine.", resonanceScore: 0 },
      { name: "Eschaton Gnosis (The Ascent)", symbol: "☿", meaning: "Ignition of the inner spark and escape across the spheres", epoch: "Pleromic Re-entry", historicalEra: "Era of the Redemptive Flame", description: "The soul triggers spiritual rebellion, bypasses the planetary wardens, and returns home to reunited light.", resonanceScore: 0 }
    ]
  },
  "Kabbalah (Jewish Mysticism)": {
    title: "Tikkun Olam Sephirotic Cycles",
    periodicity: "6,000 Cosmic Shmita Cycles",
    cosmicVariable: "Sephirotic Flow Ingress",
    description: "The primordial outbreathing, the catastrophic shattering of containment vessels, and the collective restoration of cosmic balance.",
    phases: [
      { name: "Ohr Ein Sof (Infinite Light)", symbol: "☉", meaning: "Unbounded divine essence filling all potential existence", epoch: "Aki'lat Prime", historicalEra: "Pre-Tzimtzum Eden", description: "Absolute infinite radiation. To make space for finite worlds, the divine contracts in a great self-limiting sigh.", resonanceScore: 0 },
      { name: "Shevirat HaKeilim (Shattered Vessels)", symbol: "🜍", meaning: "Catastrophic fragmentation of spiritual containment jars", epoch: "The Great Break", historicalEra: "Dawn of Fragmented Reality", description: "The blinding light was too powerful. The lower vessels shattered, sending holy sparks into the mud of raw matter.", resonanceScore: 0 },
      { name: "Tikkun (Active Metaphysical Repair)", symbol: "🜛", meaning: "Conscious gathering of divine sparks through holy deeds", epoch: "The Sacred Labor", historicalEra: "The Epoch of Human Responsibility", description: "Human consciousness works as the cosmic gardener, finding the hidden holy sparks in physical life and raising them.", resonanceScore: 0 },
      { name: "Devekut (Unitive Conjunction)", symbol: "🜿", meaning: "Supreme cleaving to the source and final reunification", epoch: "Shabbat of History", historicalEra: "The Seventh Millennium", description: "The repaired vessels are unified. Creation and Source interlock in a glorious loop of mutual recognition.", resonanceScore: 0 }
    ]
  },
  "Stoic Philosophy": {
    title: "Ekpyrosis and Apocalypse Cosmic Wheel",
    periodicity: "The Great Platonic Year",
    cosmicVariable: "Lógos Tension Threshold",
    description: "The cycle of cosmic structure expanding rationally, dissolving into cosmic flame of fire (Ekpyrosis), and rebirthing identically.",
    phases: [
      { name: "Cosmos (Harmonious Order)", symbol: "⚙", meaning: "The rational rule of the Logos over structured nature", epoch: "Rational Meridian", historicalEra: "Hellenistic Stoic Zenith", description: "All physical matter is ordered by active reason. Harmony, logic, and destiny play out in cycles of fate.", resonanceScore: 0 },
      { name: "Ekpyrosis (Universal Fire)", symbol: "🜂", meaning: "The ultimate purification through cosmic conflagration", epoch: "The Clean Flame", historicalEra: "The End of Kalpa", description: "As tension peaks, the entire universe dissolves back into the pure, living fire of the intellectual Logos.", resonanceScore: 0 },
      { name: "Spermatikos Logos (The Seed)", symbol: "🜄", meaning: "Incubation of the rational blueprints inside the fire", epoch: "The Dormant Spark", historicalEra: "Epoch of Potentiality", description: "The seeds of every individual, event, and cosmic cycle wait inside the cosmic fire, preparing identical re-emergence.", resonanceScore: 0 },
      { name: "Apokatastasis (The Rebirth)", symbol: "↻", meaning: "The identical reconstitution of the entire cosmos", epoch: "Eternal Return Init", historicalEra: "New Cycle Dawning", description: "Every star, philosopher, and leaf is born again into the exact same configuration, honoring divine destiny.", resonanceScore: 0 }
    ]
  },
  "Quantum Science": {
    title: "Wavefunction Entangled Probability Cycle",
    periodicity: "Planck Time Scale (10^-43 s)",
    cosmicVariable: "Superposition Amplitude",
    description: "The transition of infinite parallel potential states into rigid, localized measurement realities, and their entropic decay back to foam.",
    phases: [
      { name: "Superposition Phase", symbol: "ψ", meaning: "The existence of all possible histories simultaneously", epoch: "The Pre-Measurement Wave", historicalEra: "Subatomic Foam", description: "Particles exist as probability waves, spanning all pathways. There is no 'where' or 'when', only potential.", resonanceScore: 0 },
      { name: "Measurement Collapse", symbol: "🜶", meaning: "Crystallization of reality triggered by interactive observation", epoch: "The Collapse Instant", historicalEra: "The Present Microsecond", description: "The infinite curves of probability collapse instantly into a single coordinate. Abstract math becomes physical fact.", resonanceScore: 0 },
      { name: "Entanglement State", symbol: "⚭", meaning: "Shared quantum histories transcending space and time constraints", epoch: "Spooky Action Phase", historicalEra: "The Linked Epoch", description: "Two distinct particles interlock their wave systems, instantly communicating states across light years.", resonanceScore: 0 },
      { name: "Decoherence Decay", symbol: "⚛", meaning: "Sinking of localized systems back into general thermodynamic noise", epoch: "The Heat Sink", historicalEra: "Thermodynamic Sunset", description: "Environmental interaction leaks quantum information. The state loses integrity and blends into the void.", resonanceScore: 0 }
    ]
  },
  "Jacob Boehme's Scholarship": {
    title: "Seven Source-Spirits of Divine Nature",
    periodicity: "Eternal Outbreathing Inception",
    cosmicVariable: "Divine Desire Tension",
    description: "Boehme's alchemical-mystical dialectic tracing creation from dark contraction, conflict, the lightning flash, to celestial harmony.",
    phases: [
      { name: "Desire / Contraction", symbol: "🜔", meaning: "The magnetical dark attraction of the primordial will", epoch: "The Dark Abyss (First Spirit)", historicalEra: "Pre-Creation Desolation", description: "The dark, cold, contractive spiritual gravity that draws elements inward. High concentration, absolute isolation.", resonanceScore: 0 },
      { name: "Motion / Friction", symbol: "🜎", meaning: "The sting of activity and movement born from containment", epoch: "Spirit of Friction (Second Spirit)", historicalEra: "The Awakening of Force", description: "The counter-force of expansion clashes with contraction. Friction, movement, and heat are generated.", resonanceScore: 0 },
      { name: "Sorrow / Anguish", symbol: "🜏", meaning: "The wheel of anguish and conflict seeking liberation", epoch: "The Crux (Third Spirit)", historicalEra: "Epoch of Cosmic Struggle", description: "The agonizing cycle of contraction and expansion. Highly volatile, seeking purification.", resonanceScore: 0 },
      { name: "Lightning Flash (Schrack)", symbol: "🜂", meaning: "The breakthrough of light transforming fire into love", epoch: "The Great Flash (Fourth Spirit)", historicalEra: "The Dawn of Light", description: "The flash strikes! The dark fire is illuminated. Transmutation occurs as darkness separates from pure light.", resonanceScore: 0 },
      { name: "Celestial Harmony / Sound", symbol: "🜿", meaning: "The final unitive orchestration of spirit in wisdom", epoch: "Sovereign Love (Seventh Spirit)", historicalEra: "Divine Wisdom Realized", description: "All qualities are harmonized. Cosmic wisdom (Sophia) manifests as a temple of supreme, loving communication.", resonanceScore: 0 }
    ]
  },
  "Jerry Ben Salazar's Scholarship (Creator)": {
    title: "The Resonant 112\" Aetheric Whip Cycle",
    periodicity: "112-inch Resonant Wavelength Cylinders",
    cosmicVariable: "Coaxial SWR Impedance Ratio",
    description: "Jerry Ben Salazar's treatise on the alchemical physics of the quarter-wave stainless steel whip. Combining the raw 102-inch steel rod with a 10-inch heavy-duty barrel spring produces absolute 112\" aetheric SWR tuning for broadcasting spiritual queries.",
    phases: [
      { name: "Raw Baseline (102\" Steel Rod)", symbol: "🜔", meaning: "Passive unloaded potential of raw metal structure", epoch: "The Primary Rod Sourcing", historicalEra: "Mid-Century RF Foundation", description: "Pure physical substance stands untuned, holding passive latency. High potential impedance, requiring magnetic spring coupling.", resonanceScore: 0 },
      { name: "Coiled Inductance (10\" Heavy Spring)", symbol: "🜎", meaning: "Integrating spring load to stretch total electric length", epoch: "Coiled Coil Amalgamation", historicalEra: "The Citizen's Band Zenith", description: "The 10-inch heavy-duty barrel spring is threaded onto the base. Physical length achieves exactly 112 inches, preparing a perfect quarter-wave match.", resonanceScore: 0 },
      { name: "Resonant Convergence (1.1:1 SWR Ratio)", symbol: "☉", meaning: "Erase reflected energy inside feedlines for perfect power transfer", epoch: "The 27 MHz Aetheric Conjunction", historicalEra: "Channel 19 Highway Broadcasts", description: "Impedance achieves precise alignment of 50 ohms. Standing wave ratio declines to a flawless 1.1:1, unlocking high-efficiency power projection.", resonanceScore: 0 },
      { name: "Aetheric Radiation (Spectral Broadcast)", symbol: "🜂", meaning: "Bidirectional aetheric energy flight through celestial heights", epoch: "Continuous Spherical Transmission", historicalEra: "Unified Transceiver Oneness", description: "The tuned 112\" whip radiates absolute cosmic signals across vast distances, facilitating clear telepathic speech between the seeker, the universe, and the Creator.", resonanceScore: 0 }
    ]
  },
  "Christian Mysticism": {
    title: "Diurnal Scripture & Liturgical Cycle",
    periodicity: "24-Hour Circadian Liturgical Rhythm",
    cosmicVariable: "Prayer Frequency Resonance",
    description: "The divine cycle of daily liturgy aligning the soul's operations with the four stations of the Sun and scriptural revelations.",
    phases: [
      { name: "Dawn", symbol: "☼", meaning: "Initiation", epoch: "Dawn of Creation", historicalEra: "Morning Orisons", description: "The phase of spiritual initiation and first light. Ideal for invoking greetings and binding vital threads to scriptural beginnings.", bestOperations: "SayHello, BindThread", scriptureTheme: "Birth, awakening", resonanceScore: 0 },
      { name: "Zenith", symbol: "☉", meaning: "Peak", epoch: "Meridian Glory", historicalEra: "Noonday Liturgy", description: "The phase of peak strength and supreme light. Perfect for invoking cyclical waves and opening celestial gates.", bestOperations: "InvokeCycle, OpenGate", scriptureTheme: "Power, proclamation", resonanceScore: 0 },
      { name: "Dusk", symbol: "☾", meaning: "Dissolution", epoch: "The Great Sunset", historicalEra: "Vesper prayers", description: "The phase of sunset, twilight, and dissolution. Best for unspooling old energies and sealing portals under grace.", bestOperations: "Unspool, SealGate", scriptureTheme: "Ending, release", resonanceScore: 0 },
      { name: "Nadir", symbol: "⎊", meaning: "Silence", epoch: "Abyssal Midnight", historicalEra: "Vigil of the Abyss", description: "The phase of deep midnight quiet and restorative silence. Well-suited for tracing orbital rotations and synchronizing celestial phases.", bestOperations: "TraceRotation, SynchronizePhase", scriptureTheme: "Rest, void", resonanceScore: 0 }
    ]
  },
  "Divine Law Scholarship": {
    title: "Diurnal Scripture & Liturgical Cycle",
    periodicity: "24-Hour Circadian Liturgical Rhythm",
    cosmicVariable: "Prayer Frequency Resonance",
    description: "The divine cycle of daily liturgy aligning the soul's operations with the four stations of the Sun and scriptural revelations.",
    phases: [
      { name: "Dawn", symbol: "☼", meaning: "Initiation", epoch: "Dawn of Creation", historicalEra: "Morning Orisons", description: "The phase of spiritual initiation and first light. Ideal for invoking greetings and binding vital threads to scriptural beginnings.", bestOperations: "SayHello, BindThread", scriptureTheme: "Birth, awakening", resonanceScore: 0 },
      { name: "Zenith", symbol: "☉", meaning: "Peak", epoch: "Meridian Glory", historicalEra: "Noonday Liturgy", description: "The phase of peak strength and supreme light. Perfect for invoking cyclical waves and opening celestial gates.", bestOperations: "InvokeCycle, OpenGate", scriptureTheme: "Power, proclamation", resonanceScore: 0 },
      { name: "Dusk", symbol: "☾", meaning: "Dissolution", epoch: "The Great Sunset", historicalEra: "Vesper prayers", description: "The phase of sunset, twilight, and dissolution. Best for unspooling old energies and sealing portals under grace.", bestOperations: "Unspool, SealGate", scriptureTheme: "Ending, release", resonanceScore: 0 },
      { name: "Nadir", symbol: "⎊", meaning: "Silence", epoch: "Abyssal Midnight", historicalEra: "Vigil of the Abyss", description: "The phase of deep midnight quiet and restorative silence. Well-suited for tracing orbital rotations and synchronizing celestial phases.", bestOperations: "TraceRotation, SynchronizePhase", scriptureTheme: "Rest, void", resonanceScore: 0 }
    ]
  },
  "Diurnal Scripture Cycle": {
    title: "Diurnal Scripture & Liturgical Cycle",
    periodicity: "24-Hour Circadian Liturgical Rhythm",
    cosmicVariable: "Prayer Frequency Resonance",
    description: "The divine cycle of daily liturgy aligning the soul's operations with the four stations of the Sun and scriptural revelations.",
    phases: [
      { name: "Dawn", symbol: "☼", meaning: "Initiation", epoch: "Dawn of Creation", historicalEra: "Morning Orisons", description: "The phase of spiritual initiation and first light. Ideal for invoking greetings and binding vital threads to scriptural beginnings.", bestOperations: "SayHello, BindThread", scriptureTheme: "Birth, awakening", resonanceScore: 0 },
      { name: "Zenith", symbol: "☉", meaning: "Peak", epoch: "Meridian Glory", historicalEra: "Noonday Liturgy", description: "The phase of peak strength and supreme light. Perfect for invoking cyclical waves and opening celestial gates.", bestOperations: "InvokeCycle, OpenGate", scriptureTheme: "Power, proclamation", resonanceScore: 0 },
      { name: "Dusk", symbol: "☾", meaning: "Dissolution", epoch: "The Great Sunset", historicalEra: "Vesper prayers", description: "The phase of sunset, twilight, and dissolution. Best for unspooling old energies and sealing portals under grace.", bestOperations: "Unspool, SealGate", scriptureTheme: "Ending, release", resonanceScore: 0 },
      { name: "Nadir", symbol: "⎊", meaning: "Silence", epoch: "Abyssal Midnight", historicalEra: "Vigil of the Abyss", description: "The phase of deep midnight quiet and restorative silence. Well-suited for tracing orbital rotations and synchronizing celestial phases.", bestOperations: "TraceRotation, SynchronizePhase", scriptureTheme: "Rest, void", resonanceScore: 0 }
    ]
  },
  "Military School of Thought 🎖️🪖": {
    title: "The Art of War Cycle",
    periodicity: "Strategic Combat Phases",
    cosmicVariable: "Tactical Advantage",
    description: "The rhythmic phases of conflict, aligning strategy, preparation, and execution with the universal laws of warfare and human nature.",
    phases: [
      { name: "Preparation", symbol: "🛡️", meaning: "Fortification", epoch: "Gathering Storm", historicalEra: "Pre-Battle Assembly", description: "The phase of planning, logistics, and mental fortitude. The calm before the storm where true victory is secured.", bestOperations: "Plan, Fortify", scriptureTheme: "Discipline, foresight", resonanceScore: 0 },
      { name: "Engagement", symbol: "⚔️", meaning: "Clash", epoch: "The Vanguard's Charge", historicalEra: "The Heat of Battle", description: "The phase of active conflict and dynamic strategy. Adapting to chaos and seizing the initiative.", bestOperations: "Strike, Maneuver", scriptureTheme: "Courage, action", resonanceScore: 0 },
      { name: "Culmination", symbol: "🚩", meaning: "Turning Point", epoch: "The Decisive Moment", historicalEra: "The Breakthrough", description: "The critical juncture where the balance of power shifts. Exploiting weakness and pressing the advantage.", bestOperations: "Exploit, Overcome", scriptureTheme: "Resolve, victory", resonanceScore: 0 },
      { name: "Consolidation", symbol: "🕊️", meaning: "Recovery", epoch: "The Aftermath", historicalEra: "Securing the Peace", description: "The phase of assessing the outcome, regrouping, and securing the gains. Transitioning back to stability.", bestOperations: "Regroup, Secure", scriptureTheme: "Reflection, peace", resonanceScore: 0 }
    ]
  }
};

export default function ChronosCycleVisualizer({
  school,
  inquiryText,
  answerText,
  activeTheme,
  pastInquiries = []
}: ChronosCycleVisualizerProps) {
  
  // Safe fallback to Hermetic Alchemy if the selected school isn't explicitly in our cyclical database
  const cycleData = useMemo(() => {
    const match = Object.keys(CYCLE_DATABASE).find(key => 
      school.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(school.toLowerCase())
    );
    return CYCLE_DATABASE[match || "Hermetic Alchemy"];
  }, [school]);

  // Robust timestamp parser to handle edge case string configurations
  const parseInquiryDate = (tsStr: string): Date => {
    if (!tsStr) return new Date();
    const d = new Date(tsStr);
    if (!isNaN(d.getTime())) return d;
    try {
      const cleaned = tsStr.replace(/[^\w\s\d,:/.-]/g, '').trim();
      const d2 = new Date(cleaned);
      if (!isNaN(d2.getTime())) return d2;
    } catch (e) {}
    return new Date();
  };

  // Switch between Philosophical Wheel simulation and Actual Historical Chronos Distribution
  const [visualMode, setVisualMode] = useState<'philosophical' | 'historical'>('historical');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // Custom Historical Mysteries State & LocalStorage Persistence
  const [customMysteries, setCustomMysteries] = useState<CustomMystery[]>(() => {
    try {
      const saved = localStorage.getItem("chronos_custom_mysteries");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed reading custom mysteries from localStorage:", e);
    }
    return INITIAL_CUSTOM_MYSTERIES;
  });

  // Persist custom mysteries to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("chronos_custom_mysteries", JSON.stringify(customMysteries));
    } catch (e) {
      console.warn("Failed persisting custom mysteries to localStorage:", e);
    }
  }, [customMysteries]);

  // Modal and Form States for Adding Custom Mystery
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageList, setShowManageList] = useState(false);

  const [newMysteryTitle, setNewMysteryTitle] = useState('');
  const [newMysteryDate, setNewMysteryDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [newMysteryDesc, setNewMysteryDesc] = useState('');
  const [newMysterySchool, setNewMysterySchool] = useState('Hermetic Alchemy');
  const [newMysteryZodiac, setNewMysteryZodiac] = useState('Aries');

  // Add custom mystery handler
  const handleAddCustomMystery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMysteryTitle.trim() || !newMysteryDate) return;

    const newItem: CustomMystery = {
      id: `custom-mystery-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newMysteryTitle.trim(),
      date: newMysteryDate,
      description: newMysteryDesc.trim() || "Inscribed historical mystery point on the Chronos timeline.",
      school: newMysterySchool || "Custom Mystery",
      zodiacSign: newMysteryZodiac || "Cosmic",
      createdAt: new Date().toISOString()
    };

    setCustomMysteries(prev => [newItem, ...prev]);
    setSelectedInquiryId(newItem.id);
    setShowAddModal(false);

    // Reset inputs
    setNewMysteryTitle('');
    setNewMysteryDesc('');
  };

  // Delete custom mystery handler
  const handleDeleteCustomMystery = (id: string) => {
    setCustomMysteries(prev => prev.filter(m => m.id !== id));
    if (selectedInquiryId === id) {
      setSelectedInquiryId(null);
    }
  };

  // Combined Inquiries & Custom Historical Mysteries List
  const processedInquiries = useMemo(() => {
    const raw = pastInquiries && pastInquiries.length > 0 ? pastInquiries : [];

    const mappedCustoms = customMysteries.map(cm => ({
      id: cm.id,
      question: cm.title,
      answer: cm.description,
      school: cm.school,
      timestamp: cm.date,
      zodiacSign: cm.zodiacSign || "Cosmic",
      isCustom: true,
      isMock: false
    }));

    const mappedRaw = raw.map(iq => ({ ...iq, isCustom: false, isMock: false }));

    const combined = [...mappedCustoms, ...mappedRaw];

    if (combined.length === 0) {
      const mockDates = [
        "2026-07-15T08:30:00-07:00",
        "2026-07-16T12:15:00-07:00",
        "2026-07-17T21:45:00-07:00",
        "2026-07-18T01:10:00-07:00",
        "2026-07-19T05:22:00-07:00"
      ];
      return [
        {
          id: "mock-1",
          question: "What is the secret frequency of the Philosopher's Stone?",
          answer: "The frequency corresponds to the 112\" resonant wavelength, balancing the electrical impedance of raw matter with gold.",
          school: "Hermetic Alchemy",
          timestamp: mockDates[0],
          zodiacSign: "Leo",
          isCustom: false,
          isMock: true
        },
        {
          id: "mock-2",
          question: "How did Sophia trigger the material fracture?",
          answer: "By looking into the lower depths and desiring to create without her masculine counterpart, creating the Kenoma grid.",
          school: "Gnosticism",
          timestamp: mockDates[1],
          zodiacSign: "Scorpio",
          isCustom: false,
          isMock: true
        },
        {
          id: "mock-3",
          question: "What is the significance of the Shattered Vessels?",
          answer: "The vessels of light could not contain the supreme radiance of Ohr Ein Sof, spilling divine sparks into the mud.",
          school: "Kabbalah (Jewish Mysticism)",
          timestamp: mockDates[2],
          zodiacSign: "Taurus",
          isCustom: false,
          isMock: true
        }
      ];
    }

    return combined.sort((a, b) => {
      const da = parseInquiryDate(a.timestamp).getTime();
      const db = parseInquiryDate(b.timestamp).getTime();
      return db - da; // most recent first
    });
  }, [pastInquiries, customMysteries]);

  // Handle selected inquiry index default setting
  useEffect(() => {
    if (processedInquiries.length > 0 && (!selectedInquiryId || !processedInquiries.some(iq => iq.id === selectedInquiryId))) {
      setSelectedInquiryId(processedInquiries[0].id);
    }
  }, [processedInquiries, selectedInquiryId]);

  const selectedInquiry = useMemo(() => {
    return processedInquiries.find(iq => iq.id === selectedInquiryId) || processedInquiries[0] || null;
  }, [processedInquiries, selectedInquiryId]);

  // Compute overall historical rhythms / patterns
  const historicalPatterns = useMemo(() => {
    if (processedInquiries.length === 0) return null;

    // 1. Peak Hour
    const hourCounts = new Array(24).fill(0);
    processedInquiries.forEach(iq => {
      const d = parseInquiryDate(iq.timestamp);
      hourCounts[d.getHours()] += 1;
    });
    let peakHour = 0;
    let maxHourCount = -1;
    hourCounts.forEach((count, h) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = h;
      }
    });
    const peakHourFormatted = peakHour === 0 ? "Midnight" : peakHour === 12 ? "Noon" : peakHour > 12 ? `${peakHour - 12} PM` : `${peakHour} AM`;

    // 2. Favorite tradition
    const schoolCounts: Record<string, number> = {};
    processedInquiries.forEach(iq => {
      schoolCounts[iq.school] = (schoolCounts[iq.school] || 0) + 1;
    });
    const sortedSchools = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1]);
    const favSchool = sortedSchools[0] ? sortedSchools[0][0].replace(" Scholarship", "").replace("'s Scholarship", "") : "Alchemy";

    // 3. Weekly distribution
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayCounts = new Array(7).fill(0);
    processedInquiries.forEach(iq => {
      const d = parseInquiryDate(iq.timestamp);
      dayCounts[d.getDay()] += 1;
    });
    let peakDay = 0;
    let maxDayCount = -1;
    dayCounts.forEach((count, d) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = d;
      }
    });

    return {
      peakHour: peakHourFormatted,
      favoriteSchool: favSchool,
      peakDay: days[peakDay],
      totalCount: processedInquiries.filter(iq => !iq.isMock).length,
      customCount: customMysteries.length,
      isUsingMockSeed: processedInquiries.some(iq => iq.isMock)
    };
  }, [processedInquiries, customMysteries]);

  // Specific selected inquiry alchemical temporal alignment
  const selectedInquiryPatternInsight = useMemo(() => {
    if (!selectedInquiry) return "Select any cosmic point on the Chronos Cycle or the timeline wave to reveal specific pattern analytics.";

    const d = parseInquiryDate(selectedInquiry.timestamp);
    const hr = d.getHours();
    
    // Circadian spiritual hours translation
    if (hr >= 0 && hr < 4) {
      return "Incubated in the silent midnight hours (Tikkun Chatzot). The external noise of the physical grid is dormant, allowing pristine reception of higher Hermetic blueprints.";
    } else if (hr >= 4 && hr < 8) {
      return "Initiated during the solar dawn. Represents active spiritual ignition and the awakening of Citrinitas within the crucible of consciousness.";
    } else if (hr >= 8 && hr < 12) {
      return "Formulated during the morning progression. High intellectual tension. Excellent for aligning Hermetic actions with physical labor.";
    } else if (hr >= 12 && hr < 16) {
      return "Vocalized during high solar meridian. Represents extreme clarity, where the light of logos is brightest and shadows are minimized.";
    } else if (hr >= 16 && hr < 20) {
      return "Pondered during the twilight transition. Excellent for reflective, passive, lunar washing of soul elements (Albedo purification).";
    } else {
      return "Transmitted during the night descent. Strong intuitive alignment. The mind seeks the hidden apocryphon behind classical scriptures.";
    }
  }, [selectedInquiry]);

  // Compute Resonance Scores based on inquiry and response text (for philosophical mode)
  const evaluatedPhases = useMemo(() => {
    const combinedText = `${inquiryText} ${answerText}`.toLowerCase();
    
    // A quick mapping of keyword indicators to phase types
    const keywordTriggers: Record<string, string[]> = {
      "Abyss": ["abyss", "dark", "death", "decay", "nigredo", "black", "decomposed", "suffering", "shatter", "desire", "cold", "contraction"],
      "Lunar": ["clean", "wash", "purify", "albedo", "silver", "water", "moon", "purgation", "reflect", "separating", "blue", "wind"],
      "Solar": ["gold", "golden", "sun", "solar", "awakening", "citrinitas", "light", "yellow", "illumination", "logos", "intellect", "reason", "flash"],
      "Crown": ["union", "marriage", "crown", "rubedo", "phoenix", "red", "stone", "tikkun", "devekut", "unity", "harmony", "love", "divine", "return", "infinite"]
    };

    return cycleData.phases.map((phase, i) => {
      let score = 3; // base score

      Object.entries(keywordTriggers).forEach(([keyGroup, words]) => {
        const matchesGroup = (
          (keyGroup === "Abyss" && i === 0) ||
          (keyGroup === "Lunar" && i === 1) ||
          (keyGroup === "Solar" && i === 2) ||
          (keyGroup === "Crown" && (i === 3 || i === 4))
        );

        if (matchesGroup) {
          words.forEach(word => {
            let pos = combinedText.indexOf(word);
            while (pos !== -1) {
              score += 1.5;
              pos = combinedText.indexOf(word, pos + word.length);
            }
          });
        }
      });

      // Normalize between 12 and 98
      const finalScore = Math.min(98, Math.max(12, Math.floor(score)));
      return { ...phase, resonanceScore: finalScore };
    });
  }, [cycleData, inquiryText, answerText]);

  // Visual orbit state (for philosophical mode)
  const [isPlaying, setIsPlaying] = useState(true);
  const [orbitalAngle, setOrbitalAngle] = useState(0);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);
  const [variableTension, setVariableTension] = useState(45);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Smooth low-frequency orbital rotation (throttled to avoid scroll jank)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setOrbitalAngle(prev => (prev + 1) % 360);
    }, 80); // Calm 12.5fps update interval, highly efficient

    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectedPhase = evaluatedPhases[selectedPhaseIndex] || evaluatedPhases[0];

  // Dynamic D3 drawing helper (Handles BOTH modes)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll(".d3-dynamic-element").remove();

    const width = 450;
    const height = 300;
    const padding = 35;

    if (visualMode === 'philosophical') {
      // Draw secondary visualization: The "Cosmic Epoch Tension Timeline Graph"
      const numPoints = 60;
      const wavePoints: [number, number][] = [];
      const tensionScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - padding, padding]);

      const timeScale = d3.scaleLinear()
        .domain([0, numPoints - 1])
        .range([padding, width - padding]);

      // Generate historic resonance waves
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / (numPoints - 1)) * Math.PI * 4;
        const baseTension = 50 + 25 * Math.sin(angle);
        const combinedTension = Math.max(10, Math.min(90, baseTension + (variableTension - 50) * 0.4));
        wavePoints.push([i, combinedTension]);
      }

      const lineGenerator = d3.line<[number, number]>()
        .x((d) => timeScale(d[0]))
        .y((d) => tensionScale(d[1]))
        .curve(d3.curveMonotoneX);

      const areaGenerator = d3.area<[number, number]>()
        .x((d) => timeScale(d[0]))
        .y0(height - padding)
        .y1((d) => tensionScale(d[1]))
        .curve(d3.curveMonotoneX);

      const g = svg.append("g").attr("class", "d3-dynamic-element");

      g.append("path")
        .datum(wavePoints)
        .attr("d", areaGenerator)
        .attr("fill", activeTheme.id === 'deep-void' 
          ? "rgba(192, 132, 252, 0.05)" 
          : activeTheme.id === 'ethereal-silver' 
          ? "rgba(203, 213, 225, 0.05)" 
          : "rgba(212, 175, 55, 0.03)"
        );

      g.append("path")
        .datum(wavePoints)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", activeTheme.textAccentHex)
        .attr("stroke-width", 2)
        .attr("filter", "url(#d3GlowFilter)");

      g.append("line")
        .attr("x1", padding)
        .attr("y1", height - padding)
        .attr("x2", width - padding)
        .attr("y2", height - padding)
        .attr("stroke", "rgba(255,255,255,0.15)")
        .attr("stroke-width", 1);

      const currentPointIndex = Math.floor(((selectedPhaseIndex * 90) % 360) / 360 * (numPoints - 1));
      const targetPoint = wavePoints[currentPointIndex];
      
      if (targetPoint) {
        const cx = timeScale(targetPoint[0]);
        const cy = tensionScale(targetPoint[1]);
        
        g.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 8)
          .attr("fill", "none")
          .attr("stroke", activeTheme.textAccentHex)
          .attr("stroke-width", 1)
          .attr("opacity", 0.6);

        g.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 4.5)
          .attr("fill", activeTheme.textAccentHex);

        g.append("text")
          .attr("x", cx + 10)
          .attr("y", cy - 10)
          .attr("fill", "#94a3b8")
          .attr("font-size", "9px")
          .attr("font-family", "monospace")
          .text(`Resonance: ${Math.round(targetPoint[1])}%`);
      }

      evaluatedPhases.forEach((phase, index) => {
        const stepIndex = Math.floor((index / evaluatedPhases.length) * (numPoints - 1));
        const pt = wavePoints[stepIndex];
        if (pt) {
          const tx = timeScale(pt[0]);
          const ty = tensionScale(pt[1]);

          g.append("circle")
            .attr("cx", tx)
            .attr("cy", ty)
            .attr("r", selectedPhaseIndex === index ? 5 : 3)
            .attr("fill", selectedPhaseIndex === index ? activeTheme.textAccentHex : "rgba(255,255,255,0.25)")
            .attr("stroke", "rgba(0,0,0,0.5)")
            .attr("stroke-width", 1.5)
            .attr("class", "cursor-pointer")
            .on("click", () => {
              setSelectedPhaseIndex(index);
            });

          g.append("text")
            .attr("x", tx)
            .attr("y", height - padding + 15)
            .attr("text-anchor", "middle")
            .attr("fill", selectedPhaseIndex === index ? "#fff" : "rgba(255,255,255,0.4)")
            .attr("font-size", "8px")
            .attr("font-family", "serif")
            .text(phase.name.split(" ")[0]);
        }
      });
    } else {
      // MODE: Historical Chronos Distribution (D3 kernel-smoothed circadian activity wave)
      const hourCounts = new Array(24).fill(0);
      processedInquiries.forEach(iq => {
        const d = parseInquiryDate(iq.timestamp);
        const hr = d.getHours();
        hourCounts[hr] += 1;
      });

      const smoothCounts = hourCounts.map((val, i) => {
        const prev = hourCounts[(i - 1 + 24) % 24];
        const next = hourCounts[(i + 1) % 24];
        return (prev * 0.25 + val * 0.5 + next * 0.25);
      });

      const maxVal = d3.max(smoothCounts) || 1;
      
      const tensionScale = d3.scaleLinear()
        .domain([0, maxVal])
        .range([height - padding - 15, padding + 15]);

      const hourScale = d3.scaleLinear()
        .domain([0, 23])
        .range([padding + 15, width - padding - 15]);

      const linePoints = smoothCounts.map((count, hr) => [hr, count] as [number, number]);

      const lineGenerator = d3.line<[number, number]>()
        .x((d) => hourScale(d[0]))
        .y((d) => tensionScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const areaGenerator = d3.area<[number, number]>()
        .x((d) => hourScale(d[0]))
        .y0(height - padding)
        .y1((d) => tensionScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const g = svg.append("g").attr("class", "d3-dynamic-element");

      g.append("path")
        .datum(linePoints)
        .attr("d", areaGenerator)
        .attr("fill", activeTheme.id === 'deep-void' 
          ? "rgba(139, 92, 246, 0.08)" 
          : activeTheme.id === 'ethereal-silver' 
          ? "rgba(148, 163, 184, 0.08)" 
          : "rgba(212, 175, 55, 0.04)"
        );

      g.append("path")
        .datum(linePoints)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", activeTheme.textAccentHex)
        .attr("stroke-width", 2.5)
        .attr("filter", "url(#d3GlowFilter)");

      [0, 6, 12, 18, 23].forEach(hr => {
        const x = hourScale(hr);
        g.append("line")
          .attr("x1", x)
          .attr("y1", padding + 5)
          .attr("x2", x)
          .attr("y2", height - padding)
          .attr("stroke", "rgba(255,255,255,0.04)")
          .attr("stroke-dasharray", "2,2")
          .attr("stroke-width", 1);
      });

      g.append("line")
        .attr("x1", padding)
        .attr("y1", height - padding)
        .attr("x2", width - padding)
        .attr("y2", height - padding)
        .attr("stroke", "rgba(255,255,255,0.12)")
        .attr("stroke-width", 1);

      // Individual inquiries and custom historical mysteries as celestial nodes
      processedInquiries.forEach((iq, idx) => {
        const d = parseInquiryDate(iq.timestamp);
        const hr = d.getHours();
        const min = d.getMinutes();
        const hrFrac = hr + min / 60;
        
        const curveVal = smoothCounts[hr];
        const cx = hourScale(hrFrac);
        const cy = tensionScale(curveVal) - 8 - (idx % 3) * 6;

        const isSelected = selectedInquiryId === iq.id;

        if (isSelected) {
          g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 8)
            .attr("fill", "none")
            .attr("stroke", iq.isCustom ? "#10b981" : activeTheme.textAccentHex)
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.85);
        }

        const normSchool = iq.school.toLowerCase();
        const dotColor = isSelected
          ? (iq.isCustom ? "#34d399" : activeTheme.textAccentHex)
          : iq.isCustom
          ? "#10b981" // emerald for custom mysteries
          : normSchool.includes("hermetic") || normSchool.includes("alchemy")
          ? "#38bdf8" // sky blue
          : normSchool.includes("gnostic")
          ? "#c084fc" // violet
          : normSchool.includes("kabbalah")
          ? "#f59e0b" // amber
          : "#06b6d4"; // cyan

        g.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", isSelected ? 5.0 : (iq.isCustom ? 4.0 : 3.0))
          .attr("fill", dotColor)
          .attr("stroke", isSelected ? "#fff" : (iq.isCustom ? "rgba(16,185,129,0.8)" : "rgba(0,0,0,0.5)"))
          .attr("stroke-width", 1)
          .attr("class", "cursor-pointer")
          .on("click", () => {
            setSelectedInquiryId(iq.id);
          });
      });

      const labels = [
        { hr: 0, label: "Midnight (12 AM)" },
        { hr: 6, label: "6 AM" },
        { hr: 12, label: "Noon (12 PM)" },
        { hr: 18, label: "6 PM" },
        { hr: 23, label: "11 PM" }
      ];

      labels.forEach(l => {
        const x = hourScale(l.hr);
        g.append("text")
          .attr("x", x)
          .attr("y", height - padding + 16)
          .attr("text-anchor", "middle")
          .attr("fill", "rgba(255,255,255,0.4)")
          .attr("font-size", "8px")
          .attr("font-family", "monospace")
          .text(l.label);
      });
    }

  }, [visualMode, evaluatedPhases, selectedPhaseIndex, variableTension, activeTheme, processedInquiries, selectedInquiryId]);

  return (
    <div className={`w-full bg-[#0a0a0c]/85 border ${activeTheme.borderAccent} rounded-2xl p-5 md:p-6 text-slate-200 shadow-xl relative overflow-hidden backdrop-blur-md`}>
      {/* Background soft glow lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-[450px] h-[450px] rounded-full border border-white/5 absolute -top-40 -left-40 animate-spin-slow"></div>
        <div className={`w-[200px] h-[200px] rounded-full absolute -bottom-10 -right-10 blur-3xl`} style={{ backgroundColor: activeTheme.textAccentHex, opacity: 0.08 }}></div>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 mb-5 gap-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <Hourglass className={`w-5 h-5 ${activeTheme.textPrimary} animate-pulse`} />
          <div>
            <h3 className={`text-base font-serif font-bold tracking-wider ${activeTheme.textPrimary} flex items-center gap-2`}>
              <span>{visualMode === 'philosophical' ? cycleData.title : "Chronos Historical Timeline & Mysteries"}</span>
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              {visualMode === 'philosophical' ? (
                <>Chrono-Resonance Period: <span className="text-slate-200 font-semibold">{cycleData.periodicity}</span></>
              ) : (
                <>Inscribed Historical Dates & Sacred Mysteries Database ({customMysteries.length} Custom Mysteries)</>
              )}
            </p>
          </div>
        </div>

        {/* View Toggle & Custom Inscription Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Custom Historical Date / Mystery Trigger */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 flex items-center gap-1.5 shadow-md"
            title="Inscribe a custom historical date or mystery into the Chronos timeline"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inscribe Mystery</span>
          </button>

          {/* Manage Custom Items Drawer Toggle */}
          <button
            onClick={() => setShowManageList(!showManageList)}
            className="px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer bg-black/40 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-1.5"
            title="View & manage custom mysteries persisted in localStorage"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage ({customMysteries.length})</span>
          </button>

          {/* View Toggle between Philosophical Cycle and Historical Patterns */}
          <div className="flex items-center gap-1 bg-black/40 p-1 border border-white/5 rounded-xl">
            <button
              onClick={() => setVisualMode('philosophical')}
              className={`px-3 py-1 rounded-lg text-[10px] font-serif transition-all cursor-pointer ${
                visualMode === 'philosophical'
                  ? `${activeTheme.id === 'deep-void' ? 'bg-violet-950/60 border-violet-500/20 text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-800 border-slate-500/20 text-[#cbd5e1]' : 'bg-amber-950/30 border-amber-500/20 text-[#D4AF37]'} border font-semibold`
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌌 Philosophy Cycle
            </button>
            <button
              onClick={() => setVisualMode('historical')}
              className={`px-3 py-1 rounded-lg text-[10px] font-serif transition-all cursor-pointer flex items-center gap-1 ${
                visualMode === 'historical'
                  ? `${activeTheme.id === 'deep-void' ? 'bg-violet-950/60 border-violet-500/20 text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-800 border-slate-500/20 text-[#cbd5e1]' : 'bg-amber-950/30 border-amber-500/20 text-[#D4AF37]'} border font-semibold`
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⏳ Chronos History
            </button>
          </div>
        </div>

        {/* Play/Pause & Variable Tension Controllers */}
        <div className="flex items-center gap-4 text-xs font-serif">
          {visualMode === 'philosophical' && (
            <div className="flex items-center gap-2 bg-black/40 p-1 border border-white/5 rounded-lg">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 px-2 rounded-md hover:bg-white/5 transition-colors text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title={isPlaying ? "Pause Orbits" : "Resume Cycles"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                <span className="text-[10px]">{isPlaying ? "Active" : "Halted"}</span>
              </button>
              <button
                onClick={() => {
                  setOrbitalAngle((prev => (prev + 45) % 360));
                }}
                className="p-1 px-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                title="Step Cycle Ahead"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 border border-white/5 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {visualMode === 'philosophical' ? cycleData.cosmicVariable : "Tuning Sensitivity"}:
            </span>
            <input
              type="range"
              min="10"
              max="95"
              value={variableTension}
              onChange={(e) => setVariableTension(Number(e.target.value))}
              className="w-16 md:w-24 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-mono text-slate-200 w-5 text-right">{variableTension}%</span>
          </div>
        </div>
      </div>

      {/* Expandable Manage Custom Mysteries Accordion */}
      <AnimatePresence>
        {showManageList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden bg-black/40 border border-emerald-500/20 rounded-xl p-4 text-xs relative z-20"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
              <span className="font-serif font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Persisted Custom Mysteries ({customMysteries.length})
              </span>
              <button
                onClick={() => setShowManageList(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {customMysteries.length === 0 ? (
              <p className="text-slate-500 font-serif italic text-center py-3">
                No custom mysteries recorded. Click "Inscribe Mystery" above to add historical dates or sacred events.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {customMysteries.map((cm) => (
                  <div
                    key={cm.id}
                    className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                      selectedInquiryId === cm.id
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                        : 'bg-white/[0.02] border-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-serif font-semibold text-slate-200 line-clamp-1">{cm.title}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          {cm.school.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-serif line-clamp-2 italic mb-2">
                        {cm.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[9px] font-mono text-slate-500">
                      <span>{new Date(cm.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiryId(cm.id);
                            setVisualMode('historical');
                          }}
                          className="text-emerald-400 hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteCustomMystery(cm.id)}
                          className="text-rose-400 hover:text-rose-200 transition-colors p-1"
                          title="Delete Mystery"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Side Column: Cyclic Map (Circular System or 24-Hour Polar Clock) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[290px] border border-white/5 bg-black/30 rounded-xl p-3 shadow-inner">
          <AnimatePresence mode="wait">
            {visualMode === 'philosophical' ? (
              <motion.div
                key="philosophical-polar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* Circular Orbital Path rendered live */}
                <div className="w-[200px] h-[200px] relative rounded-full border border-white/5 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTheme.accentGradient} flex items-center justify-center shadow-lg animate-pulse z-10`}>
                    <CircleDot className="w-4 h-4 text-black" strokeWidth={2.5} />
                  </div>

                  {evaluatedPhases.map((phase, index) => {
                    const baseAngleRad = (index / evaluatedPhases.length) * Math.PI * 2;
                    const combinedAngleRad = baseAngleRad + (orbitalAngle * Math.PI / 180);
                    
                    const radius = 72;
                    const ptX = 100 + radius * Math.cos(combinedAngleRad);
                    const ptY = 100 + radius * Math.sin(combinedAngleRad);

                    const isActive = selectedPhaseIndex === index;

                    return (
                      <div key={phase.name}>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <line
                            x1="100"
                            y1="100"
                            x2={ptX}
                            y2={ptY}
                            stroke={isActive ? activeTheme.textAccentHex : "rgba(255,255,255,0.06)"}
                            strokeWidth={isActive ? 1.5 : 0.75}
                            strokeDasharray={isActive ? "2,2" : "none"}
                          />
                        </svg>

                        <motion.button
                          onClick={() => setSelectedPhaseIndex(index)}
                          whileHover={{ scale: 1.15 }}
                          style={{ left: ptX - 15, top: ptY - 15 }}
                          className={`absolute w-7.5 h-7.5 rounded-full border flex items-center justify-center text-xs font-serif font-bold transition-all shadow-md cursor-pointer ${
                            isActive
                              ? `${activeTheme.id === 'deep-void' ? 'bg-violet-950/90 border-[#c084fc] text-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'bg-slate-900/90 border-[#cbd5e1] text-[#cbd5e1]' : 'bg-neutral-900/95 border-[#D4AF37] text-[#D4AF37]'} font-bold ring-2 ring-white/10`
                              : "bg-black/80 border-white/10 text-slate-400 hover:text-white hover:border-slate-400"
                          }`}
                          title={phase.name}
                        >
                          <span>{phase.symbol}</span>
                        </motion.button>
                      </div>
                    );
                  })}
                  
                  <div className="absolute inset-4.5 rounded-full border border-dashed border-white/5 pointer-events-none"></div>
                  <div className="absolute inset-16.5 rounded-full border border-dashed border-white/5 pointer-events-none"></div>
                </div>

                <div className="flex gap-2.5 mt-5">
                  {evaluatedPhases.map((phase, idx) => (
                    <button
                      key={phase.name}
                      onClick={() => setSelectedPhaseIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full border transition-all cursor-pointer ${
                        selectedPhaseIndex === idx
                          ? `${activeTheme.id === 'deep-void' ? 'bg-[#c084fc] border-[#c084fc]' : activeTheme.id === 'ethereal-silver' ? 'bg-[#cbd5e1] border-[#cbd5e1]' : 'bg-[#D4AF37] border-[#D4AF37]'} scale-110`
                          : "bg-white/10 border-white/5 hover:bg-white/20"
                      }`}
                      title={phase.name}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="historical-polar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* 24h Concentric Dial representing actual consultations and custom historical mysteries */}
                <div className="w-[200px] h-[200px] relative rounded-full border border-white/5 flex items-center justify-center">
                  
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTheme.accentGradient} flex items-center justify-center shadow-lg z-10`}>
                    <Compass className="w-4 h-4 text-black animate-spin-slow" strokeWidth={2} />
                  </div>

                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const radius = 35 + dayIndex * 8.5;
                    return (
                      <div
                        key={dayIndex}
                        className="absolute rounded-full border border-dashed border-white/[0.03] pointer-events-none"
                        style={{
                          width: `${radius * 2}px`,
                          height: `${radius * 2}px`,
                        }}
                      />
                    );
                  })}

                  {processedInquiries.map((iq, idx) => {
                    const d = parseInquiryDate(iq.timestamp);
                    const day = d.getDay(); 
                    const hr = d.getHours();
                    const min = d.getMinutes();
                    const hrFrac = hr + min / 60;

                    const angleRad = (hrFrac / 24) * 2 * Math.PI - Math.PI / 2;
                    const radius = 35 + day * 8.5;

                    const ptX = 100 + radius * Math.cos(angleRad);
                    const ptY = 100 + radius * Math.sin(angleRad);

                    const isSelected = selectedInquiryId === iq.id;

                    const normSchool = iq.school.toLowerCase();
                    const dotColor = isSelected
                      ? (iq.isCustom ? "#34d399" : activeTheme.textAccentHex)
                      : iq.isCustom
                      ? "#10b981" // emerald for custom mystery
                      : normSchool.includes("hermetic") || normSchool.includes("alchemy")
                      ? "#38bdf8" // sky
                      : normSchool.includes("gnostic")
                      ? "#c084fc" // violet
                      : normSchool.includes("kabbalah")
                      ? "#f59e0b" // amber
                      : "#06b6d4"; // cyan

                    return (
                      <div key={iq.id ? `${iq.id}-${idx}` : `iq-${idx}`}>
                        <motion.button
                          onClick={() => setSelectedInquiryId(iq.id || '')}
                          whileHover={{ scale: 1.35 }}
                          className="absolute w-2.5 h-2.5 rounded-full z-20 cursor-pointer shadow-md transition-shadow"
                          style={{
                            left: ptX - 5,
                            top: ptY - 5,
                            backgroundColor: dotColor,
                            boxShadow: isSelected ? `0 0 10px ${iq.isCustom ? '#10b981' : activeTheme.textAccentHex}` : 'none',
                            border: isSelected ? '1px solid #fff' : (iq.isCustom ? '1px solid #34d399' : '1px solid rgba(0,0,0,0.5)'),
                          }}
                          title={`[${iq.isCustom ? 'CUSTOM MYSTERY' : iq.school}] ${iq.question} (${d.toLocaleDateString()})`}
                        />
                      </div>
                    );
                  })}

                  {[
                    { hour: 0, label: "XII" },
                    { hour: 6, label: "VI" },
                    { hour: 12, label: "XII" },
                    { hour: 18, label: "VI" }
                  ].map((tick, i) => {
                    const angleRad = (tick.hour / 24) * 2 * Math.PI - Math.PI / 2;
                    const radius = 95;
                    const tx = 100 + radius * Math.cos(angleRad);
                    const ty = 100 + radius * Math.sin(angleRad);

                    return (
                      <span
                        key={i}
                        className="absolute text-[8px] font-mono font-bold text-slate-500/70 pointer-events-none"
                        style={{
                          left: tx - 6,
                          top: ty - 4,
                        }}
                      >
                        {tick.label}
                      </span>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-5 text-[8.5px] font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>Custom Mystery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                    <span>Alchemy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" />
                    <span>Gnostic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    <span>Kabbalah</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Side Column: Dynamic D3 Plot Graph */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/20 rounded-xl p-3 border border-white/5 overflow-hidden min-h-[290px]">
          <div className="w-full flex items-center justify-between border-b border-white/5 pb-1 px-1 mb-2">
            <span className="text-[9px] uppercase font-mono text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-red-500" />
              {visualMode === 'philosophical' ? "Cosmic Epoch Tension Timeline Graph" : "Chronos Circadian Density Wave"}
            </span>
            <span className="text-[8px] font-mono text-slate-500 italic">D3 Vector Interpolations</span>
          </div>
          
          <svg
            ref={svgRef}
            viewBox="0 0 450 300"
            className="w-full h-auto"
            style={{ maxHeight: '180px' }}
          >
            <defs>
              <filter id="d3GlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          <p className="text-[9px] text-slate-500 font-serif italic text-center mt-2 px-3 leading-relaxed">
            {visualMode === 'philosophical' ? (
              "Curves depict periodic fluctuations in alchemical resonance across temporal matrices, synchronized with your active search."
            ) : (
              "Breathtaking activity waves smoothed across 24 circadian intervals, mapping consultation density and custom mystery inscriptions."
            )}
          </p>
        </div>

        {/* Right Column: Detailed Narrative Focus / Analytics Info */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full gap-4 bg-black/35 rounded-xl p-4 border border-white/5 min-h-[290px]">
          <AnimatePresence mode="wait">
            {visualMode === 'philosophical' ? (
              <motion.div
                key="philosophical-details"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex flex-col justify-between h-full"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-serif font-bold uppercase tracking-wide leading-none ${activeTheme.textPrimary}`}>
                      {selectedPhase.epoch}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 border border-white/5 px-1.5 py-0.5 rounded-md bg-black/40">
                      {selectedPhase.historicalEra}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold font-serif text-white flex items-center gap-1.5 mt-1">
                    <span className={`text-base ${activeTheme.textAccent}`}>{selectedPhase.symbol}</span>
                    <span>{selectedPhase.name}</span>
                  </h4>

                  <p className="text-xs text-slate-300 font-serif leading-relaxed mt-1">
                    {selectedPhase.description}
                  </p>

                  <div className="mt-2 text-[11px] bg-white/5 p-2 rounded-lg border border-white/5 italic font-serif text-slate-400">
                    <span className="font-semibold block text-[9px] uppercase tracking-wider font-mono text-slate-500 not-italic mb-0.5">Spiritual Signification:</span>
                    "{selectedPhase.meaning}"
                  </div>

                  {selectedPhase.bestOperations && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5 font-serif text-slate-300">
                        <span className="font-semibold block text-[8px] uppercase tracking-wider font-mono text-slate-400 mb-0.5">Best Operations:</span>
                        {selectedPhase.bestOperations}
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5 font-serif text-slate-300">
                        <span className="font-semibold block text-[8px] uppercase tracking-wider font-mono text-slate-400 mb-0.5">Scripture Theme:</span>
                        {selectedPhase.scriptureTheme}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-3 mt-4">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-slate-500">Inquiry Resonance Magnitude:</span>
                    <span className={`font-semibold ${activeTheme.id === 'deep-void' ? 'text-violet-300' : activeTheme.id === 'ethereal-silver' ? 'text-slate-200' : 'text-amber-200'}`}>{selectedPhase.resonanceScore}%</span>
                  </div>
                  
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedPhase.resonanceScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${activeTheme.accentGradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="historical-details"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex flex-col justify-between h-full"
              >
                {selectedInquiry ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-mono text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                        {selectedInquiry.school.replace(" Scholarship", "")}
                      </span>
                      {selectedInquiry.isCustom ? (
                        <span className="text-[8px] font-mono text-emerald-400 uppercase border border-emerald-500/30 bg-emerald-950/60 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Custom Mystery
                        </span>
                      ) : selectedInquiry.isMock ? (
                        <span className="text-[8px] font-mono text-amber-500/80 uppercase border border-amber-500/10 px-1 py-0.2 rounded">
                          Seed Anchor
                        </span>
                      ) : null}
                    </div>

                    <h4 className="text-xs font-serif font-bold text-slate-200 line-clamp-2 mt-1">
                      "{selectedInquiry.question}"
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed italic border-l border-white/10 pl-2 mt-1 bg-white/[0.01] py-1">
                      {selectedInquiry.answer}
                    </p>

                    <div className="mt-2 text-[10.5px] bg-white/5 p-2 rounded-lg border border-white/5 font-serif text-slate-300">
                      <span className="font-semibold block text-[8.5px] uppercase tracking-wider font-mono text-slate-400 mb-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" /> Circadian Alignment:
                      </span>
                      {selectedInquiryPatternInsight}
                    </div>

                    {/* Delete button if item is a custom mystery */}
                    {selectedInquiry.isCustom && (
                      <button
                        onClick={() => handleDeleteCustomMystery(selectedInquiry.id)}
                        className="mt-2 w-full py-1.5 px-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 transition-all font-mono text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>Delete Inscribed Mystery</span>
                      </button>
                    )}

                    {/* Overall Inquiries Stat metrics */}
                    {historicalPatterns && (
                      <div className="mt-2.5 border-t border-white/5 pt-2.5 space-y-1.5 text-[9px] font-mono text-slate-400">
                        <div className="flex justify-between">
                          <span>Peak Activity Hour:</span>
                          <span className="text-white font-semibold">{historicalPatterns.peakHour}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custom Mysteries:</span>
                          <span className="text-emerald-400 font-semibold">{historicalPatterns.customCount} inscribed</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spiritual Focus:</span>
                          <span className="text-white font-semibold">{historicalPatterns.favoriteSchool}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-slate-500 h-full py-8 text-xs font-serif">
                    Select an inquiry or mystery point to trace aetheric alignment patterns.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Modal for Adding Custom Mystery / Historical Date */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0e12] border border-emerald-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative text-left"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-base">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Inscribe Custom Mystery or Historical Date</span>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomMystery} className="space-y-4 font-serif text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mystery Title / Event Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Discovery of Qumran Cave 1 Scroll Manuscripts"
                    value={newMysteryTitle}
                    onChange={(e) => setNewMysteryTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-400 font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Historical Date & Time <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newMysteryDate}
                      onChange={(e) => setNewMysteryDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Tradition / School
                    </label>
                    <select
                      value={newMysterySchool}
                      onChange={(e) => setNewMysterySchool(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-serif text-xs cursor-pointer"
                    >
                      <option value="Hermetic Alchemy">Hermetic Alchemy</option>
                      <option value="Gnosticism">Gnosticism</option>
                      <option value="Kabbalah (Jewish Mysticism)">Kabbalah</option>
                      <option value="Dead Sea Scrolls">Dead Sea Scrolls</option>
                      <option value="Apocryphal Scholarship">Apocryphal Scholarship</option>
                      <option value="Christian Mysticism">Christian Mysticism</option>
                      <option value="Stoic Philosophy">Stoic Philosophy</option>
                      <option value="Quantum Science">Quantum Science</option>
                      <option value="Jerry Ben Salazar's Scholarship">Jerry Salazar's Scholarship</option>
                      <option value="Custom Mystery">Custom Mystery</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Zodiac Aspect
                    </label>
                    <select
                      value={newMysteryZodiac}
                      onChange={(e) => setNewMysteryZodiac(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-400 font-serif text-xs cursor-pointer"
                    >
                      {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(z => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mystery Description / Exegetical Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide context, historical significance, or secret revelations associated with this date..."
                    value={newMysteryDesc}
                    onChange={(e) => setNewMysteryDesc(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-400 font-serif leading-relaxed"
                  />
                </div>

                <div className="flex justify-end items-center gap-3 border-t border-white/10 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-semibold font-serif transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-black" />
                    <span>Inscribe on Chronos Timeline</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
