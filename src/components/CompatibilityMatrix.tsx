import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Flame, Heart, Info, AlertTriangle, GraduationCap, Users, BookOpen, X, Crown } from 'lucide-react';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_METADATA: Record<string, { element: 'Ignis' | 'Materia' | 'Aer' | 'Aqua'; symbol: string; icon: string; abbreviation: string }> = {
  Aries: { element: 'Ignis', symbol: '♈', icon: '🔥', abbreviation: 'ARI' },
  Taurus: { element: 'Materia', symbol: '♉', icon: '🪨', abbreviation: 'TAU' },
  Gemini: { element: 'Aer', symbol: '♊', icon: '💨', abbreviation: 'GEM' },
  Cancer: { element: 'Aqua', symbol: '♋', icon: '💧', abbreviation: 'CAN' },
  Leo: { element: 'Ignis', symbol: '♌', icon: '🔥', abbreviation: 'LEO' },
  Virgo: { element: 'Materia', symbol: '♍', icon: '🪨', abbreviation: 'VIR' },
  Libra: { element: 'Aer', symbol: '♎', icon: '💨', abbreviation: 'LIB' },
  Scorpio: { element: 'Aqua', symbol: '♏', icon: '💧', abbreviation: 'SCO' },
  Sagittarius: { element: 'Ignis', symbol: '♐', icon: '🔥', abbreviation: 'SAG' },
  Capricorn: { element: 'Materia', symbol: '♑', icon: '🪨', abbreviation: 'CAP' },
  Aquarius: { element: 'Aer', symbol: '♒', icon: '💨', abbreviation: 'AQU' },
  Pisces: { element: 'Aqua', symbol: '♓', icon: '💧', abbreviation: 'PIS' }
};

const CELESTIAL_PROFILES: Record<string, {
  title: string;
  element: string;
  ruler: string;
  alchemicalProperty: string;
  symbol: string;
  description: string;
  myth: string;
  traits: string[];
}> = {
  Aries: {
    title: "The Primordial Flame / The Initiator of Dawn",
    element: "Ignis (Fire)",
    ruler: "Mars (Ares)",
    alchemicalProperty: "Calcination (Sacred Purification)",
    symbol: "♈",
    description: "Aries stands at the gateway of the celestial cycle, representing the cosmic spark of creation and the initial combustion of active consciousness. As the first breath of Ignis, it is driven by an unyielding impulse to manifest being out of non-being.",
    myth: "Associated with the legendary Chrysomallos, the winged golden ram whose fleece represents supreme spiritual realization and sovereign authority. It embodies the journey of the courageous solar hero who ventures into dark, uncharted wilderness to reclaim their true essence.",
    traits: ["Pioneering Drive", "Fierce Independence", "Sovereign Will", "Unfiltered Integrity"]
  },
  Taurus: {
    title: "The Sacred Vessel / The Bull of Heaven",
    element: "Materia (Earth)",
    ruler: "Venus (Aphrodite)",
    alchemicalProperty: "Coagulation (Solidification of Divine Essence)",
    symbol: "♉",
    description: "Taurus is the steady anchor of the physical plane, the sanctuary where fluid divine blueprints solidify into stable, tangible beauty. Embodying absolute density and patient preservation, it holds the frequency of deep, silent material gnosis.",
    myth: "Represented by the Bull of Heaven from Gilgamesh or Zeus's sacred white transformation. Taurus guards the threshold of the earthly temple, teaching that true wealth lies in sensory communion with nature's hidden codes and the patient cultivation of enduring, sacred foundations.",
    traits: ["Patient Endurance", "Aesthetic Resonance", "Terrestrial Gnosis", "Unyielding Sanctuary"]
  },
  Gemini: {
    title: "The Celestial Messenger / The Twin Pillars",
    element: "Aer (Air)",
    ruler: "Mercury (Hermes)",
    alchemicalProperty: "Sublimation (Dissolution of Solid into Vapor)",
    symbol: "♊",
    description: "Gemini represents the eternal dance of duality and the left/right pillars of the sacred gate. Operating as the wind of Aer, it bridges realms, carrying intelligence, language, and the sacred code of symbols between the divine and mortal planes.",
    myth: "Linked to Castor and Pollux, the divine twins of Leda who shared immortality to remain united. Gemini teaches that all polarities—spirit and matter, Jachin and Boaz, active light and passive void—are ultimately reflections of the same primordial unity.",
    traits: ["Intellectual Agility", "Dual Perception", "Hermetic Logic", "Linguistic Craftsmanship"]
  },
  Cancer: {
    title: "The Lunar Matrix / The Guardian of the Sacred Pool",
    element: "Aqua (Water)",
    ruler: "The Moon (Selene)",
    alchemicalProperty: "Dissolution (Return to Primordial Origin)",
    symbol: "♋",
    description: "Cancer occupies the deep, reflective waters of the human soul. It is the cosmic womb, the quiet container of memory, ancestry, and deep psychic sensitivity. It channels the shifting cycles of the Moon to nourish and protect the sparks of life.",
    myth: "Represented by Karkinos, the crab sent by Hera to stand fast against Herculean brute force. Cancer represents the tenacity of the heart, shielding the delicate, sacred interior beneath a solid external shell, and preserving the lineages of ancient spiritual memory.",
    traits: ["Intuitive Sanctuary", "Ancestral Memory", "Psychic Sensitivity", "Protective Devotion"]
  },
  Leo: {
    title: "The Sovereign Sun / The Golden Crown",
    element: "Ignis (Fire)",
    ruler: "The Sun (Helios)",
    alchemicalProperty: "Digestion (Solar Maturation)",
    symbol: "♌",
    description: "Leo represents the fully integrated, radiant ego that has recognized its divine solar lineage. It is the steady heat of Ignis, illuminating the world through creative expression, courage, and a deep-seated connection to the royal source of all light.",
    myth: "Connected to the invincible Nemean Lion whose pelt became Heracles' cloak of sovereign invulnerability. Leo is the solar sovereign within the self, teaching that the heart must become a shining altar of generosity, nobility, and warm, unshakeable courage.",
    traits: ["Solar Majesty", "Generous Spirit", "Creative Authority", "Noble Valor"]
  },
  Virgo: {
    title: "The Keeper of the Harvest / The Priestess of Gnosis",
    element: "Materia (Earth)",
    ruler: "Mercury (Hermes)",
    alchemicalProperty: "Distillation (Separation of Pure from Dregs)",
    symbol: "♍",
    description: "Virgo is the sacred alchemist who filters, refines, and distills complex experience into pure, actionable wisdom. Moving through the dense realm of Materia, it maintains a clean, pristine space for intellectual precision and divine service.",
    myth: "Associated with Astraea, the star-maiden of absolute justice and purity who was the last to ascend to the heavens at the close of the Golden Age. Virgo represents the diligent parsing of natural patterns, seeking the underlying mathematics of the cosmos in the smallest details.",
    traits: ["Analytical Precision", "Sacred Service", "Distilled Discernment", "Pragmatic Alchemy"]
  },
  Libra: {
    title: "The Cosmic Scale / The Architect of Equilibrium",
    element: "Aer (Air)",
    ruler: "Venus (Aphrodite)",
    alchemicalProperty: "Filtration (Balancing Active and Receptive Forces)",
    symbol: "♎",
    description: "Libra is the cosmic harmonizer, stationed at the equilibrium point of the equinox where light and dark hang in perfect symmetry. As the social breeze of Aer, it designs bridges, contracts, and aesthetic balances that restore unity.",
    myth: "Represented by the golden scales of balance held by Astraea, Libra represents the search for perfect alignment. It echoes the sacred middle ground (76) where the active force of J and the severity of B find their golden ratio in a beautiful, structured peace.",
    traits: ["Equilibrium of Mind", "Diplomatic Synthesis", "Aesthetic Symmetry", "Justice-Oriented Will"]
  },
  Scorpio: {
    title: "The Alchemical Eagle / The Phoenix of the Abyss",
    element: "Aqua (Water)",
    ruler: "Pluto (Hades) & Mars",
    alchemicalProperty: "Putrefaction (Transmutation through Decay)",
    symbol: "♏",
    description: "Scorpio governs the deepest, most mysterious currents of the emotional and spiritual waters. It is the catalyst of death and rebirth, holding the key to complete energetic transformation by braving the dark underworld.",
    myth: "Symbolized by the scorpion, the eagle, and the phoenix. From the creeping creature on the forest floor to the soaring bird of light, Scorpio illustrates the classic alchemical path: confronting personal shadows, burning away the dross, and rising as a winged spirit.",
    traits: ["Alchemical Depth", "Piercing Insight", "Magnetic Resilience", "Underworld Gnosis"]
  },
  Sagittarius: {
    title: "The Cosmic Archer / The Voyager of Truth",
    element: "Ignis (Fire)",
    ruler: "Jupiter (Zeus)",
    alchemicalProperty: "Incineration (Focusing the Astral Spark)",
    symbol: "♐",
    description: "Sagittarius is the fiery arrow of consciousness directed toward the absolute. Operating through the expansive fire of Ignis, it seeks to cross boundaries, expand horizons, and align local wisdom with universal celestial laws.",
    myth: "Represented by Chiron, the immortal centaur-healer and philosopher who tutored the greatest heroes of antiquity. Sagittarius teaches that the physical animal nature must be synthesized with the higher spiritual intellect to launch the arrow of truth.",
    traits: ["Philosophical Vision", "Expansive Wisdom", "Restless Quest", "Uncompromising Candor"]
  },
  Capricorn: {
    title: "The Sea-Goat / The Builder of Mountain Temples",
    element: "Materia (Earth)",
    ruler: "Saturn (Cronus)",
    alchemicalProperty: "Fermentation (Maturation through Time)",
    symbol: "♑",
    description: "Capricorn is the steady, disciplined climb up the mountain of spiritual or material achievement. Synthesizing the physical structure of Materia with the emotional depths of its aquatic tail, it constructs systems that stand the test of time.",
    myth: "Represented by Pricus, the immortal goat-fish who could manipulate time. Capricorn teaches the supreme value of patience, boundaries, and hard labor. It represents the master architect who carves sacred geometry into unyielding stone.",
    traits: ["Architectural Focus", "Saturnian Discipline", "Temporal Master", "Enduring Resilience"]
  },
  Aquarius: {
    title: "The Divine Water-Bearer / The Iconoclast of Gnosis",
    element: "Aer (Air)",
    ruler: "Uranus (Ouranos) & Saturn",
    alchemicalProperty: "Multiplication (Diffusion of Spiritual Vapor)",
    symbol: "♒",
    description: "Aquarius is the intellectual visionary who pours the refreshing waters of divine inspiration upon the dry plains of humanity. Using the sweeping currents of Aer, it dissolves rigid dogmas to establish collective liberation.",
    myth: "Connected to Ganymede, the celestial youth chosen to pour nectar for the Olympian gods. Aquarius represents the pouring out of cosmic wisdom, shattering outdated paradigms to align human society with the expansive light of the higher crown.",
    traits: ["Collective Visionary", "Paradigm Shatterer", "Humanitarian Gnosis", "Intellectual Sovereignty"]
  },
  Pisces: {
    title: "The Infinite Ocean / The Mystic of the Threshold",
    element: "Aqua (Water)",
    ruler: "Neptune (Poseidon) & Jupiter",
    alchemicalProperty: "Projection (Final Integration with the Whole)",
    symbol: "♓",
    description: "Pisces is the final terminal of the zodiac, representing the dissolution of all boundaries and the return of individual consciousness back into the great cosmic ocean. It is the ultimate domain of spiritual empathy and mystical surrender.",
    myth: "Represented by the two sacred fish tied together, swimming in opposite directions. Pisces straddles the physical and spiritual planes, showing that the ultimate realization is the collapse of separation, finding God in all forms.",
    traits: ["Mystical Unification", "Boundless Empathy", "Vivid Imagination", "Surrendered Gnosis"]
  }
};

interface CompatibilityResult {
  score: number;
  label: string;
  type: 'harmony' | 'tension' | 'neutral';
  description: string;
}

export interface StudyPartner {
  sign: string;
  score: number;
  element: 'Ignis' | 'Materia' | 'Aer' | 'Aqua';
  symbol: string;
  synergyType: string;
  description: string;
  focusArea: string;
}

export function getIdealStudyPartners(userSign: string): StudyPartner[] {
  if (!userSign) return [];
  const metaA = ZODIAC_METADATA[userSign];
  if (!metaA) return [];

  const partners: StudyPartner[] = [];
  
  for (const sign of ZODIAC_SIGNS) {
    if (sign === userSign) continue;
    
    const metaB = ZODIAC_METADATA[sign];
    const comp = getZodiacCompatibility(userSign, sign);
    
    // We want highly compatible signs (score >= 80)
    if (comp.score >= 80) {
      let focusArea = "";
      let synergyType = comp.label;
      
      if (metaA.element === metaB.element) {
        synergyType = `Same-Element ${metaA.element} Sync`;
        if (metaA.element === 'Ignis') {
          focusArea = "High-energy collaborative sprints. Excellent for tackling difficult equations or memorizing vast lists under pressure.";
        } else if (metaA.element === 'Materia') {
          focusArea = "Methodical library sessions. Unrivaled for organized documentation, indexing materials, and silent concentration.";
        } else if (metaA.element === 'Aer') {
          focusArea = "Intense intellectual debates, high-level brainstorming, and peer-review of theoretical or philosophical essays.";
        } else {
          focusArea = "Creative, deeply intuitive problem-solving and memory association through emotional metaphors and narrative writing.";
        }
      } else {
        synergyType = "Complementary Element Synthesis";
        if ((metaA.element === 'Ignis' && metaB.element === 'Aer') || (metaA.element === 'Aer' && metaB.element === 'Ignis')) {
          focusArea = "Aer fuels Ignis. The Fire sign brings infectious motivation and drive, while the Air sign provides logical maps and clarity.";
        } else {
          focusArea = "Aqua nourishes Materia. The Earth sign provides concrete outlines and strict timelines, while the Water sign adds intuitive research and lateral thinking.";
        }
      }

      partners.push({
        sign,
        score: comp.score,
        element: metaB.element,
        symbol: metaB.symbol,
        synergyType,
        description: comp.description,
        focusArea
      });
    }
  }

  // Sort by score descending
  return partners.sort((a, b) => b.score - a.score);
}

export function getZodiacCompatibility(signA: string, signB: string): CompatibilityResult {
  if (!signA || !signB) {
    return { score: 50, label: 'Balanced', type: 'neutral', description: '' };
  }
  
  const metaA = ZODIAC_METADATA[signA];
  const metaB = ZODIAC_METADATA[signB];
  
  if (!metaA || !metaB) {
    return { score: 50, label: 'Balanced', type: 'neutral', description: '' };
  }

  const elemA = metaA.element;
  const elemB = metaB.element;
  
  // Same sign
  if (signA === signB) {
    return {
      score: 85,
      label: "Reflective Symmetry",
      type: "harmony",
      description: `A double manifestation of ${signA}. This union forms a cosmic mirror of self, amplifying both your greatest virtues and your hidden shadows.`
    };
  }

  // Same element (Trine aspect)
  if (elemA === elemB) {
    return {
      score: 95,
      label: "Trine Harmony",
      type: "harmony",
      description: `The sacred trine of ${elemA} elements. Both of you share the same fundamental temperament, ensuring a natural, effortless flow of spiritual energies.`
    };
  }

  // Complementary elements (Fire & Air or Earth & Water)
  const isComplementary = 
    (elemA === 'Ignis' && elemB === 'Aer') || (elemA === 'Aer' && elemB === 'Ignis') ||
    (elemA === 'Materia' && elemB === 'Aqua') || (elemA === 'Aqua' && elemB === 'Materia');

  if (isComplementary) {
    return {
      score: 88,
      label: "Sextile Synthesis",
      type: "harmony",
      description: `Harmonious interplay between ${metaA.symbol} and ${metaB.symbol}. ${elemA === 'Ignis' || elemA === 'Aer' ? 'Air feeds Fire' : 'Water nourishes Earth'}, creating a highly creative and supportive alchemical loop.`
    };
  }

  // Check distances in the zodiac wheel
  const idxA = ZODIAC_SIGNS.indexOf(signA);
  const idxB = ZODIAC_SIGNS.indexOf(signB);
  const steps = Math.abs(idxA - idxB);
  
  // Opposite signs (6 steps apart)
  if (steps === 6) {
    return {
      score: 72,
      label: "Polar Opposition",
      type: "neutral",
      description: `A direct cosmic opposition. Facing each other across the wheel, this dynamic pairing sparks intense magnetic attraction combined with the challenge of finding equilibrium.`
    };
  }

  // Square aspect (3 or 9 steps apart)
  if (steps === 3 || steps === 9) {
    return {
      score: 32,
      label: "Square Friction",
      type: "tension",
      description: `A challenging square aspect. Both signs operate at cross-purposes, generating significant alchemical friction that requires maturity to reconcile.`
    };
  }

  // Fire and Water clash (Quenching)
  const isHighlyClashing =
    (elemA === 'Ignis' && elemB === 'Aqua') || (elemA === 'Aqua' && elemB === 'Ignis');
  
  if (isHighlyClashing) {
    return {
      score: 25,
      label: "Elemental Quenching",
      type: "tension",
      description: `Extreme element clash. The raging embers of Ignis meet the cooling tides of Aqua. Fire boiled by water, or water snuffed by fire—requires careful handling.`
    };
  }

  // Air and Earth clash (Scattering)
  const isAirEarthClash =
    (elemA === 'Aer' && elemB === 'Materia') || (elemA === 'Materia' && elemB === 'Aer');
  if (isAirEarthClash) {
    return {
      score: 40,
      label: "Scattering Currents",
      type: "tension",
      description: `Breezy mental Aer meets unyielding Materia. Earth restricts the freedom of flight, while Air threatens to disperse solid, practical structures.`
    };
  }

  // Quincunx (5 steps apart)
  if (steps === 5 || steps === 7) {
    return {
      score: 58,
      label: "Mystical Inconjunct",
      type: "neutral",
      description: `An enigmatic quincunx aspect. Your elemental paths do not easily cross, calling for profound adjustments and mutual learning to bridge the gap.`
    };
  }

  // Adjacent or default (Semi-sextile, etc.)
  return {
    score: 64,
    label: "Semi-Sextile Growth",
    type: "neutral",
    description: `A neutral, neighboring vibration. Though your styles are distinctly separate, this pairing fosters continuous growth as you integrate each other's virtues.`
  };
}

export function getElementalInfluenceExplanation(signA: string, signB: string, result: CompatibilityResult): {
  elemA: string;
  elemB: string;
  symbolA: string;
  symbolB: string;
  explanation: string;
} {
  const metaA = ZODIAC_METADATA[signA];
  const metaB = ZODIAC_METADATA[signB];
  
  if (!metaA || !metaB) {
    return { elemA: '', elemB: '', symbolA: '', symbolB: '', explanation: '' };
  }

  const elA = metaA.element;
  const elB = metaB.element;
  
  const elementNames: Record<string, string> = {
    Ignis: "Ignis (Fire)",
    Materia: "Materia (Earth)",
    Aer: "Aer (Air)",
    Aqua: "Aqua (Water)"
  };

  const nameA = elementNames[elA] || elA;
  const nameB = elementNames[elB] || elB;

  let explanation = "";

  if (signA === signB) {
    explanation = `${signA} is ruled by ${nameA}. When both seeker and partner share the exact same sign, the double presence of ${nameA} creates an intense celestial mirror. In Esoteric Astrology, this self-reflective loop compounds your shared element's qualities, magnifying both your spiritual virtues and hidden shadows to produce a high score of ${result.score}%.`;
  } else if (elA === elB) {
    explanation = `Both ${signA} (${nameA}) and ${signB} (${nameB}) share the same core element. In Hermetic Alchemy, this common elemental baseline generates a perfect Trine Harmony. Because your physical or spiritual energies vibrate on the same fundamental frequency, your compatibility score reaches a magnificent ${result.score}% with minimal friction.`;
  } else {
    // Complementary elements (Fire & Air or Earth & Water)
    const isComplementary = 
      (elA === 'Ignis' && elB === 'Aer') || (elA === 'Aer' && elB === 'Ignis') ||
      (elA === 'Materia' && elB === 'Aqua') || (elA === 'Aqua' && elB === 'Materia');

    if (isComplementary) {
      if (elA === 'Ignis' || elB === 'Ignis') {
        explanation = `${signA} representing ${nameA} and ${signB} representing ${nameB} share a highly complementary Sextile relationship. Under this dynamic, the intellectual winds of Air (Aer) fan the sacred embers of Fire (Ignis), creating a reciprocal and highly creative cycle that raises the compatibility score to a warm ${result.score}%.`;
      } else {
        explanation = `${signA} representing ${nameA} and ${signB} representing ${nameB} are in a highly supportive Sextile aspect. Here, the nourishing and intuitive depths of Water (Aqua) fertilize the structured, practical structures of Earth (Materia), creating an alchemical cycle that produces an excellent compatibility score of ${result.score}%.`;
      }
    } else {
      // Clashes
      const isHighlyClashing = (elA === 'Ignis' && elB === 'Aqua') || (elA === 'Aqua' && elB === 'Ignis');
      const isAirEarthClash = (elA === 'Aer' && elB === 'Materia') || (elA === 'Materia' && elB === 'Aer');

      if (isHighlyClashing) {
        explanation = `${signA} (${nameA}) and ${signB} (${nameB}) undergo Elemental Quenching. In the cosmic crucible, the boiling steam of Ignis clashes with the cooling depths of Aqua. Fire boiled by water, or water evaporated by fire, introduces extreme friction, dragging the compatibility score down to a challenging ${result.score}%.`;
      } else if (isAirEarthClash) {
        explanation = `${signA} (${nameA}) and ${signB} (${nameB}) undergo Scattering Currents. The soaring, intellectual currents of Aer clash with the solid, practical foundations of Materia. Earth threatens to ground the free spirit of Air, while Air scatters the stable plans of Earth, leading to an incompatible score of ${result.score}%.`;
      } else {
        // Other combinations (like Fire/Earth or Air/Water) or general distance checks
        const idxA = ZODIAC_SIGNS.indexOf(signA);
        const idxB = ZODIAC_SIGNS.indexOf(signB);
        const steps = Math.abs(idxA - idxB);

        if (steps === 6) {
          explanation = `${signA} (${nameA}) and ${signB} (${nameB}) lie in direct Polar Opposition across the zodiac wheel. This is an axis of magnetic attraction where opposite elements seek integration. Balancing ${nameA} and ${nameB} generates intense chemistry, resulting in a moderate score of ${result.score}%.`;
        } else if (steps === 3 || steps === 9) {
          explanation = `${signA} (${nameA}) and ${signB} (${nameB}) form a challenging Square aspect. Operating at cross-purposes, their distinct elements (${nameA} and ${nameB}) demand conscious compromise and inner work to align, explaining the frictional score of ${result.score}%.`;
        } else if (steps === 5 || steps === 7) {
          explanation = `${signA} (${nameA}) and ${signB} (${nameB}) are in a Mystical Inconjunct (Quincunx). Their elemental temperaments do not naturally understand one another, requiring deep adjustments and conscious learning to find a common language, reflected in the score of ${result.score}%.`;
        } else {
          explanation = `${signA} (${nameA}) and ${signB} (${nameB}) share a neighboring Semi-Sextile vibration. While your elemental approaches are distinct, this neighboring contact promotes mutual growth as you slowly integrate each other's elemental gifts, offering a score of ${result.score}%.`;
        }
      }
    }
  }

  return {
    elemA: nameA,
    elemB: nameB,
    symbolA: metaA.symbol,
    symbolB: metaB.symbol,
    explanation
  };
}

interface CompatibilityMatrixProps {
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
  selectedUserSign: string;
  selectedPartnerSign: string;
  onSelectUserSign: (sign: string) => void;
  onSelectPartnerSign: (sign: string) => void;
}

export default function CompatibilityMatrix({
  activeTheme,
  selectedUserSign,
  selectedPartnerSign,
  onSelectUserSign,
  onSelectPartnerSign
}: CompatibilityMatrixProps) {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    userSign: string;
    partnerSign: string;
    result: CompatibilityResult;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [activeProfileSign, setActiveProfileSign] = useState<string | null>(null);

  // Active or hovered details for the side-by-side comparative layout
  const displayDetails = useMemo(() => {
    if (hoveredCell) {
      return {
        userSign: hoveredCell.userSign,
        partnerSign: hoveredCell.partnerSign,
        result: hoveredCell.result,
        isHovered: true
      };
    }
    if (selectedUserSign && selectedPartnerSign) {
      return {
        userSign: selectedUserSign,
        partnerSign: selectedPartnerSign,
        result: getZodiacCompatibility(selectedUserSign, selectedPartnerSign),
        isHovered: false
      };
    }
    return null;
  }, [hoveredCell, selectedUserSign, selectedPartnerSign]);

  useEffect(() => {
    if (!d3Container.current) return;

    // Clear old elements
    d3.select(d3Container.current).selectAll("*").remove();

    // Dimensions
    const svgWidth = 500;
    const svgHeight = 500;
    const margin = { top: 60, right: 20, bottom: 20, left: 75 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select(d3Container.current)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Grid details
    const n = ZODIAC_SIGNS.length;
    const cellSize = width / n;

    // Scale color generator based on theme
    const getColor = (score: number) => {
      // score is between 0 and 100
      const normalized = score / 100;
      
      if (activeTheme.id === "ancient-gold") {
        // From dark gray-brown to warm bronze to bright gold
        const interpolator = d3.interpolateRgbBasis([
          "#0e0d0b", // lowest
          "#2e1f14", // low
          "#6e4c25", // mid
          "#AA6C39", // high
          "#D4AF37"  // perfect
        ]);
        return interpolator(normalized);
      } else if (activeTheme.id === "deep-void") {
        // From deep dark indigo to royal purple to glowing violet-pink
        const interpolator = d3.interpolateRgbBasis([
          "#080410", // lowest
          "#221035", // low
          "#4a148c", // mid
          "#7b1fa2", // high
          "#c084fc"  // perfect
        ]);
        return interpolator(normalized);
      } else {
        // Ethereal Silver: From slate blue to shining silver-white
        const interpolator = d3.interpolateRgbBasis([
          "#0b1015", // lowest
          "#1e293b", // low
          "#475569", // mid
          "#94a3b8", // high
          "#ffffff"  // perfect
        ]);
        return interpolator(normalized);
      }
    };

    // Grid data
    const data: Array<{
      userSign: string;
      partnerSign: string;
      userIndex: number;
      partnerIndex: number;
      result: CompatibilityResult;
    }> = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const uSign = ZODIAC_SIGNS[i];
        const pSign = ZODIAC_SIGNS[j];
        data.push({
          userSign: uSign,
          partnerSign: pSign,
          userIndex: i,
          partnerIndex: j,
          result: getZodiacCompatibility(uSign, pSign)
        });
      }
    }

    // Grid Cells
    const cells = svg.selectAll(".cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => d.partnerIndex * cellSize)
      .attr("y", d => d.userIndex * cellSize)
      .attr("width", cellSize - 1.5)
      .attr("height", cellSize - 1.5)
      .attr("rx", 3)
      .attr("ry", 3)
      .style("fill", d => getColor(d.result.score))
      .style("stroke", "rgba(255, 255, 255, 0.05)")
      .style("stroke-width", "1px")
      .style("cursor", "pointer")
      .style("transition", "fill 0.2s, stroke 0.2s");

    // Add interactivity to cells
    cells.on("mouseover", function(event, d) {
      d3.select(this)
        .style("stroke", "#ffffff")
        .style("stroke-width", "1.5px");
      
      setHoveredCell({
        userSign: d.userSign,
        partnerSign: d.partnerSign,
        result: d.result
      });
      setTooltipPos({
        x: event.clientX,
        y: event.clientY
      });
    })
    .on("mousemove", function(event, d) {
      setTooltipPos({
        x: event.clientX,
        y: event.clientY
      });
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .style("stroke", "rgba(255, 255, 255, 0.05)")
        .style("stroke-width", "1px");
      
      setHoveredCell(null);
      setTooltipPos(null);
    })
    .on("click", function(event, d) {
      // Set selections
      onSelectUserSign(d.userSign);
      onSelectPartnerSign(d.partnerSign);
      
      // Visual click feedback
      d3.select(this)
        .transition()
        .duration(100)
        .style("transform", "scale(0.95)")
        .transition()
        .duration(100)
        .style("transform", "scale(1)");
    });

    // Row Headers (Left Axis)
    const rowHeaders = svg.selectAll(".row-label")
      .data(ZODIAC_SIGNS)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(-10, ${(i + 0.5) * cellSize})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onSelectUserSign(d));

    rowHeaders.append("text")
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("fill", d => d === selectedUserSign ? activeTheme.textAccentHex : "#94a3b8")
      .style("font-size", "9.5px")
      .style("font-family", "system-ui, sans-serif")
      .style("font-weight", d => d === selectedUserSign ? "bold" : "normal")
      .text(d => {
        const meta = ZODIAC_METADATA[d];
        return `${meta.icon} ${meta.symbol} ${d}`;
      });

    // Column Headers (Top Axis)
    const colHeaders = svg.selectAll(".col-label")
      .data(ZODIAC_SIGNS)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${(i + 0.5) * cellSize}, -10)`)
      .style("cursor", "pointer")
      .on("click", (event, d) => onSelectPartnerSign(d));

    // Subtle Elemental Icon above the zodiac symbol
    colHeaders.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -11)
      .style("font-size", "9px")
      .text(d => ZODIAC_METADATA[d].icon);

    // Zodiac symbol text
    colHeaders.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 1)
      .attr("fill", d => d === selectedPartnerSign ? activeTheme.textAccentHex : "#94a3b8")
      .style("font-size", "9px")
      .style("font-family", "system-ui, sans-serif")
      .style("font-weight", d => d === selectedPartnerSign ? "bold" : "normal")
      .text(d => ZODIAC_METADATA[d].symbol);

    // Subtle guide text at the top
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -38)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .style("font-size", "10px")
      .style("font-family", "monospace")
      .style("letter-spacing", "0.05em")
      .text("PARTNER'S CELESTIAL SIGN ➔");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -62)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .style("font-size", "10px")
      .style("font-family", "monospace")
      .style("letter-spacing", "0.05em")
      .text("YOUR CELESTIAL SIGN ➔");

    // Add highlighted borders if both signs are selected
    if (selectedUserSign && selectedPartnerSign) {
      const userIndex = ZODIAC_SIGNS.indexOf(selectedUserSign);
      const partnerIndex = ZODIAC_SIGNS.indexOf(selectedPartnerSign);

      if (userIndex !== -1 && partnerIndex !== -1) {
        // Draw crosshair lines
        svg.append("line")
          .attr("x1", 0)
          .attr("y1", (userIndex + 0.5) * cellSize)
          .attr("x2", width)
          .attr("y2", (userIndex + 0.5) * cellSize)
          .attr("stroke", activeTheme.textAccentHex)
          .attr("stroke-width", "1px")
          .attr("stroke-dasharray", "3,3")
          .style("opacity", 0.45);

        svg.append("line")
          .attr("x1", (partnerIndex + 0.5) * cellSize)
          .attr("y1", 0)
          .attr("x2", (partnerIndex + 0.5) * cellSize)
          .attr("y2", height)
          .attr("stroke", activeTheme.textAccentHex)
          .attr("stroke-width", "1px")
          .attr("stroke-dasharray", "3,3")
          .style("opacity", 0.45);

        // Highlight intersection cell
        svg.append("rect")
          .attr("x", partnerIndex * cellSize)
          .attr("y", userIndex * cellSize)
          .attr("width", cellSize - 1.5)
          .attr("height", cellSize - 1.5)
          .attr("rx", 3)
          .attr("ry", 3)
          .style("fill", "none")
          .style("stroke", "#ffffff")
          .style("stroke-width", "2px")
          .style("filter", `drop-shadow(0px 0px 4px ${activeTheme.textAccentHex})`)
          .style("pointer-events", "none");
      }
    }

  }, [activeTheme, selectedUserSign, selectedPartnerSign, onSelectUserSign, onSelectPartnerSign]);

  const idealStudyPartners = useMemo(() => {
    return selectedUserSign ? getIdealStudyPartners(selectedUserSign) : [];
  }, [selectedUserSign]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
        {/* Heatmap Grid Stage */}
        <div className="flex-1 bg-black/35 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" /> Aetheric Heatmap Matrix
              </span>
              <span className="text-[10px] text-slate-500 font-serif">
                Click any cell to bridge your resonance
              </span>
            </div>
            
            <div className="w-full flex justify-center py-2">
              <svg ref={d3Container} className="max-w-[420px] sm:max-w-[460px] aspect-square" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-3 border-t border-white/5 text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: activeTheme.id === 'ancient-gold' ? '#0e0d0b' : activeTheme.id === 'deep-void' ? '#080410' : '#0b1015' }} /> Clashing (Friction)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: activeTheme.id === 'ancient-gold' ? '#6e4c25' : activeTheme.id === 'deep-void' ? '#4a148c' : '#475569' }} /> Neutral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: activeTheme.id === 'ancient-gold' ? '#D4AF37' : activeTheme.id === 'deep-void' ? '#c084fc' : '#ffffff' }} /> Supreme Harmony
            </span>
          </div>
        </div>

        {/* Dynamic Interaction Panel */}
        <div className="w-full xl:w-[260px] flex flex-col bg-[#141416]/50 rounded-xl border border-white/5 p-4 justify-between">
          <AnimatePresence mode="wait">
            {displayDetails ? (
              <motion.div
                key={`${displayDetails.userSign}-${displayDetails.partnerSign}-${displayDetails.isHovered}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {displayDetails.isHovered ? "🔮 Hover Resonance" : "🔒 Checked Connection"}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-base">
                      {ZODIAC_METADATA[displayDetails.userSign]?.symbol}
                    </div>
                    <span className="text-slate-400 text-xs font-serif">➔</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-base">
                      {ZODIAC_METADATA[displayDetails.partnerSign]?.symbol}
                    </div>
                    <div className="ml-2">
                      <h5 className="text-xs font-serif font-bold text-white leading-tight">
                        {displayDetails.userSign} & {displayDetails.partnerSign}
                      </h5>
                      <p className="text-[9px] font-mono text-slate-500">
                        {ZODIAC_METADATA[displayDetails.userSign]?.element} × {ZODIAC_METADATA[displayDetails.partnerSign]?.element}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compatibility Score Circle */}
                <div className="flex items-center gap-4 py-1">
                  <div className="relative flex items-center justify-center w-16 h-16">
                    {/* Background track */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-white/5 fill-none"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="fill-none transition-all duration-500"
                        stroke={
                          displayDetails.result.type === 'harmony' 
                            ? '#10b981' 
                            : displayDetails.result.type === 'tension' 
                            ? '#f43f5e' 
                            : '#eab308'
                        }
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - displayDetails.result.score / 100)}`}
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-base font-mono font-bold text-white">
                        {displayDetails.result.score}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      {displayDetails.result.type === 'harmony' ? (
                        <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      ) : displayDetails.result.type === 'tension' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      )}
                      <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        displayDetails.result.type === 'harmony' 
                          ? 'text-emerald-400' 
                          : displayDetails.result.type === 'tension' 
                          ? 'text-rose-400' 
                          : 'text-amber-500'
                      }`}>
                        {displayDetails.result.label}
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">
                      Aspect Angle: {
                        displayDetails.result.score >= 90 ? 'Trine Aspect (120°)' :
                        displayDetails.result.score >= 80 ? 'Sextile Aspect (60°)' :
                        displayDetails.result.score >= 70 ? 'Opposite Aspect (180°)' :
                        displayDetails.result.score >= 55 ? 'Inconjunct / Adjacent' :
                        'Square Aspect (90°)'
                      }
                    </p>
                  </div>
                </div>

                {/* Aspect Commentary */}
                <p className="text-[11px] font-serif text-slate-300 leading-relaxed italic p-2.5 rounded bg-white/[0.02] border border-white/5">
                  {displayDetails.result.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-8 text-center"
              >
                <Info className="w-7 h-7 text-slate-600 mb-2.5 animate-bounce-slow" />
                <h5 className="text-xs font-serif font-bold text-slate-400">Resonance Unconfigured</h5>
                <p className="text-[10px] text-slate-500 font-serif mt-1 max-w-[180px] leading-relaxed">
                  Hover or click cells to analyze specific celestial alignments and calculate direct compatibility ratios.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedUserSign && selectedPartnerSign && (
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Active Pair Connection:</span>
              <div className="flex items-center justify-between text-[11px] font-serif font-bold text-white mt-1">
                <span>{selectedUserSign} × {selectedPartnerSign}</span>
                <span className="text-slate-400 text-[10px] font-mono font-normal">Active Sync</span>
              </div>
            </div>
          )}

          {/* View Full Celestial Profile trigger */}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
            {selectedUserSign ? (
              <button
                onClick={() => setActiveProfileSign(selectedUserSign)}
                className={`w-full py-2 px-3 rounded-lg border text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTheme.id === 'deep-void'
                    ? 'bg-violet-950/20 border-violet-500/30 hover:border-violet-400 text-violet-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : activeTheme.id === 'ethereal-silver'
                    ? 'bg-slate-900/20 border-slate-500/30 hover:border-slate-400 text-slate-200 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)]'
                    : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400 text-amber-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                }`}
                title={`Open the archetypal profile for ${selectedUserSign}`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span>View Full Celestial Profile ({selectedUserSign})</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveProfileSign("Aries")}
                className="w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Browse archetypal celestial profiles of the zodiac"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Browse Celestial Profiles</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ideal Study Partners Card */}
      <div className="bg-black/35 rounded-xl border border-white/5 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-500" /> Ideal Study Partners
          </span>
          {selectedUserSign && (
            <span className="text-[10px] text-slate-500 font-mono">
              Calculated for {selectedUserSign}
            </span>
          )}
        </div>

        {selectedUserSign ? (
          idealStudyPartners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {idealStudyPartners.map((partner) => (
                <div 
                  key={partner.sign} 
                  className="bg-[#141416]/50 border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-white/10 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-sm">
                          {partner.symbol}
                        </div>
                        <div>
                          <h6 className="text-xs font-serif font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {partner.sign}
                          </h6>
                          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                            {partner.element} Element
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {partner.score}%
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-amber-500 mb-1.5">
                      {partner.synergyType}
                    </div>
                    
                    <p className="text-[10px] font-serif text-slate-400 leading-relaxed mb-2">
                      {partner.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/[0.03]">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                      Scholastic Focus Area:
                    </span>
                    <p className="text-[10px] font-serif text-slate-300 leading-relaxed italic mb-3">
                      "{partner.focusArea}"
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectPartnerSign(partner.sign)}
                        className="flex-1 py-1.5 rounded bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-[10px] font-mono text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        title={`Align ${partner.sign} as partner sign in matrix`}
                      >
                        <Users className="w-3 h-3" /> Align
                      </button>
                      <button
                        onClick={() => setActiveProfileSign(partner.sign)}
                        className="flex-1 py-1.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-[10px] font-mono text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        title={`View Celestial Profile of ${partner.sign}`}
                      >
                        <BookOpen className="w-3 h-3" /> Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 font-serif italic">
              No ideal study partners match with {selectedUserSign}'s cosmic vibration. Try another sign.
            </div>
          )
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 font-serif italic flex flex-col items-center justify-center gap-1">
            <Users className="w-6 h-6 text-slate-700 mb-1" />
            <span>Select your sign on the Heatmap or left-axis row headers to discover your ideal scholastic allies.</span>
          </div>
        )}
      </div>

      {/* Detailed Modal Overlay: Archetypal and Mythic Celestial Profile */}
      <AnimatePresence>
        {activeProfileSign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-default"
              onClick={() => setActiveProfileSign(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[85vh] overflow-hidden z-10"
            >
              {/* Star Background Graphic */}
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03] text-white">
                <Crown className="w-48 h-48 animate-pulse" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Celestial Profile Registry</span>
                </div>
                <button
                  onClick={() => setActiveProfileSign(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close registry"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Zodiac Selector Tabs */}
              <div className="flex overflow-x-auto py-3 px-4 gap-2 bg-black/20 border-b border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {ZODIAC_SIGNS.map((sign) => {
                  const isActive = activeProfileSign === sign;
                  const meta = ZODIAC_METADATA[sign];
                  return (
                    <button
                      key={sign}
                      onClick={() => setActiveProfileSign(sign)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${
                        isActive
                          ? activeTheme.id === 'deep-void'
                            ? 'bg-violet-950/40 border-violet-500 text-violet-200 font-bold shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                            : activeTheme.id === 'ethereal-silver'
                            ? 'bg-slate-800 border-slate-400 text-white font-bold'
                            : 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-sm">{meta.symbol}</span>
                      <span>{sign}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(() => {
                  const profile = CELESTIAL_PROFILES[activeProfileSign];
                  if (!profile) return null;
                  
                  return (
                    <div className="space-y-6">
                      {/* Sign Title Block */}
                      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/15 text-3xl">
                          {profile.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                              {activeProfileSign}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                              Zodiac Sign
                            </span>
                          </div>
                          <p className="text-xs font-mono text-slate-400 italic mt-0.5">
                            {profile.title}
                          </p>
                        </div>
                      </div>

                      {/* Triadic Pillars / Attributes Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Cosmic Element</span>
                          <span className={`text-xs font-serif font-bold mt-1.5 block ${
                            profile.element.startsWith('Ignis') ? 'text-red-400' :
                            profile.element.startsWith('Materia') ? 'text-amber-600' :
                            profile.element.startsWith('Aer') ? 'text-sky-300' : 'text-blue-400'
                          }`}>
                            {profile.element}
                          </span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Ruling Celestial Body</span>
                          <span className="text-xs font-serif font-bold text-slate-200 mt-1.5 block">
                            {profile.ruler}
                          </span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Alchemical Property</span>
                          <span className="text-xs font-serif font-bold text-amber-500 mt-1.5 block">
                            {profile.alchemicalProperty}
                          </span>
                        </div>
                      </div>

                      {/* Details Segment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Aetheric Manifestation */}
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500/70" />
                            <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">Aetheric Manifestation</h4>
                          </div>
                          <p className="text-xs font-serif text-slate-300 leading-relaxed italic">
                            "{profile.description}"
                          </p>
                        </div>

                        {/* Mythological & Occult Lore */}
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1">
                            <Crown className="w-3.5 h-3.5 text-amber-500/70" />
                            <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">Mythic & Occult Lore</h4>
                          </div>
                          <p className="text-xs font-serif text-slate-300 leading-relaxed">
                            {profile.myth}
                          </p>
                        </div>
                      </div>

                      {/* Celestial Signature Traits */}
                      <div className="pt-3 border-t border-white/5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2.5">
                          Celestial Signature Traits
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {profile.traits.map((trait) => (
                            <span 
                              key={trait} 
                              className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-mono text-slate-300 hover:border-amber-500/30 hover:text-amber-300 transition-colors"
                            >
                              ✦ {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end">
                <button
                  onClick={() => setActiveProfileSign(null)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    activeTheme.id === 'deep-void'
                      ? 'bg-violet-950/20 border-violet-500/30 hover:border-violet-400 text-violet-200'
                      : activeTheme.id === 'ethereal-silver'
                      ? 'bg-slate-900/20 border-slate-500/30 hover:border-slate-400 text-slate-200'
                      : 'bg-amber-950/25 border-amber-500/30 hover:border-amber-400 text-amber-200'
                  }`}
                >
                  Close Registry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tooltip displaying elemental influence */}
      {hoveredCell && tooltipPos && (() => {
        const influence = getElementalInfluenceExplanation(hoveredCell.userSign, hoveredCell.partnerSign, hoveredCell.result);
        const scoreColor = 
          hoveredCell.result.type === 'harmony' ? 'text-emerald-400' :
          hoveredCell.result.type === 'tension' ? 'text-rose-400' : 'text-slate-300';
          
        return (
          <div 
            style={{
              position: 'fixed',
              left: tooltipPos.x + 18,
              top: tooltipPos.y + 18,
              pointerEvents: 'none',
              zIndex: 9999
            }}
            className="backdrop-blur-md bg-zinc-950/95 border border-white/10 rounded-xl p-4 shadow-2xl text-xs max-w-sm flex flex-col gap-2.5 text-left transition-opacity duration-150"
          >
            {/* Header: signs with elements */}
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 font-serif font-bold text-white text-sm">
                <span>{influence.symbolA} {hoveredCell.userSign}</span>
                <span className="text-slate-500 font-sans text-xs">➔</span>
                <span>{influence.symbolB} {hoveredCell.partnerSign}</span>
              </div>
              <span className={`font-mono font-bold text-xs ${scoreColor}`}>
                {hoveredCell.result.score}%
              </span>
            </div>

            {/* Elements Interaction info */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500">
                Elemental Alignment
              </span>
              <div className="flex items-center gap-2 text-[11px] font-serif text-slate-300">
                <span>{influence.elemA}</span>
                <span className="text-slate-600 font-sans">×</span>
                <span>{influence.elemB}</span>
              </div>
            </div>

            {/* In-depth explanation of elemental influence */}
            <p className="text-[11px] leading-relaxed font-serif text-slate-400">
              {influence.explanation}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
