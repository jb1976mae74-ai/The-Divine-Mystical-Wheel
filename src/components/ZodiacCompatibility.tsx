import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import * as d3 from 'd3';
import { 
  Compass, Flame, Sparkles, Award, RotateCw, Heart, 
  HelpCircle, Info, Star, ShieldAlert, BookOpen, AlertCircle
} from 'lucide-react';
import ZodiacCompatibilityEngine from './ZodiacCompatibilityEngine';

interface ActiveTheme {
  id: string;
  name: string;
  bgPage: string;
  bgCard: string;
  textPrimary: string;
  textAccent: string;
  textAccentHex: string;
  accentGradient: string;
  borderAccent: string;
  borderAccentSemi: string;
  accentGlow: string;
}

interface ZodiacCompatibilityProps {
  activeTheme: ActiveTheme;
}

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  description: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars', description: 'The cosmic spark of initiation, initiating cycles of raw force and spiritual courage.' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus', description: 'The stabilizing fertile soil, cultivating material substance and sensory alignment.' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury', description: 'The dual channels of intellectual currents, bridging separate ideas and mental sparks.' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon', description: 'The protective womb of reflective waters, nurturing emotional seeds and intuitive depth.' },
  { id: 'leo', name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun', description: 'The radiant fire of solar expression, crystallizing sovereign identity and noble warmth.' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury', description: 'The meticulous refinement of earthly structures, purifying intent through sacred service.' },
  { id: 'libra', name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus', description: 'The harmonized equilibrium of airy relationships, weighing destiny on the scales.' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', ruler: 'Pluto & Mars', description: 'The abyssal depths of alchemical water, transmuting desire into mystical sovereignty.' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', description: 'The expansive arrow of spiritual fire, seeking infinite truth and celestial philosophy.' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', description: 'The structured pinnacle of physical mastery, climbing temporal limits with deep patience.' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', ruler: 'Uranus & Saturn', description: 'The collective network of humanitarian currents, dispensing revolutionary wisdom.' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', ruler: 'Neptune & Jupiter', description: 'The boundless ocean of mystical dissolution, returning all fragments to the divine source.' }
];

interface EsotericTerminal {
  id: string;
  name: string;
  title: string;
  scrollContent: string;
  alignment: string;
}

const ESOTERIC_TERMINALS: EsotericTerminal[] = [
  {
    id: 'yahweh',
    name: 'Yahweh',
    title: 'The Divine Crown (The Tetragrammaton)',
    scrollContent: 'The supreme unmanifested source of eternal will and celestial order. It marks the highest coordinate of the heptagram, where the cosmic seed descends into manifestation. In our alignment matrix, it represents the absolute, infinite potential of spirit.',
    alignment: 'Very Top Axis, balancing the physical with the infinite.'
  },
  {
    id: 'lucifer',
    name: 'Lucifer',
    title: 'The Light-Bringer (The Sub-Meridian Spark)',
    scrollContent: 'The force of illumination, descent, and conscious awareness within the dense physical sandbox. Rather than a force of malevolence, it acts as the alchemical driver of individual realization, pushing humanity to seek the hidden spark of gnosis.',
    alignment: 'Sub-Meridian Axis, representing physical grounding and deep focus.'
  },
  {
    id: 'j',
    name: 'J (Jachin)',
    title: 'The Solar Pillar of Force',
    scrollContent: 'The right-hand pillar of the Temple, symbolizing active male force, dynamic projection, white solar energy, and spiritual mercy. It represents the active broadcast wavelength of our spiritual queries.',
    alignment: 'Left Horizon of the Star.'
  },
  {
    id: 'b',
    name: 'B (Boaz)',
    title: 'The Lunar Pillar of Form',
    scrollContent: 'The left-hand pillar of the Temple, representing receptive female form, containment, severe contemplation, and deep lunar wisdom. It provides the dark reflective crucible in which elements are purified.',
    alignment: 'Right Horizon of the Star.'
  },
  {
    id: '76',
    name: '76',
    title: 'The Atomic Resonance Core',
    scrollContent: 'The holy number anchoring the center of our heptagram. It acts as the dimensional gateway, coordinating the 12 cosmic flames with the seven internal rays. It represents perfect equilibrium where the transceiver tunes to a 1.1:1 SWR.',
    alignment: 'The Absolute Center of the Seven-Point Star.'
  },
  {
    id: 'apocalypse',
    name: 'Apocalypse (Son of Man)',
    title: 'The Great Unveiling & Son of Man',
    scrollContent: 'Apocalypse is the Son of Man—the moment of ultimate clarity and celestial revelation where all illusions of the material prison (Kenoma) are torn away. Residing at the supreme zenith above the circle, it presides over the Four Angels of the Sacred Heptagon: Apocryphon, Life after Death, Azrael, and Apollyon.',
    alignment: 'Apex of the Cosmic Grid (Zenith).'
  },
  {
    id: 'life_after_death',
    name: 'Life after Death (Life)',
    title: 'Angel of the Sacred Heptagon (Eternal Rebirth)',
    scrollContent: 'One of the Four Angels of the Sacred Heptagon, Life after Death (Life) represents the ascension of the inner spark beyond physical limits, transiting back to the eternal Pleroma. Positioned at 3 o\'clock opposite Apollyon.',
    alignment: 'Eastern Celestial Horizon (3 o\'clock Far Right).'
  },
  {
    id: 'apocryphon',
    name: 'Apocryphon',
    title: 'Angel of the Sacred Heptagon (Hidden Gnosis)',
    scrollContent: 'One of the Four Angels of the Sacred Heptagon, Apocryphon anchors the base at 6 o\'clock nadir opposite Apocalypse. It guards the unwritten, sacred gnosis and primordial mysteries of the cosmos.',
    alignment: 'Nadir of the Grid (6 o\'clock Far Bottom).'
  },
  {
    id: 'apollyon',
    name: 'Apollyon',
    title: 'Angel of the Sacred Heptagon (Purifying Dissolution)',
    scrollContent: 'One of the Four Angels of the Sacred Heptagon, positioned at 9 o\'clock on the left above Glory. Apollyon represents alchemical dissolution (Solve)—clearing illusion and calcining egoic attachments so divine Glory may shine.',
    alignment: 'Western Celestial Horizon (9 o\'clock Far Left, above Glory).'
  },
  {
    id: 'azrael',
    name: 'Azrael',
    title: 'Angel of the Sacred Heptagon (Divine Transition)',
    scrollContent: 'One of the Four Angels of the Sacred Heptagon, positioned directly under Apocalypse (Son of Man) at the top of the sacred star. Azrael is the archangelic psychopomp guiding consciousness across thresholds into illumination.',
    alignment: 'Sub-Zenith Axis (Immediately beneath Apocalypse).'
  }
];

export default function ZodiacCompatibility({ activeTheme }: ZodiacCompatibilityProps) {
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    rotateX.set(mouseX / width - 0.5);
    rotateY.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };
  const [activeSubTab, setActiveSubTab] = useState<'engine' | 'wheel' | 'heptagram'>('engine');
  
  // Wheel State
  const [selectedSignA, setSelectedSignA] = useState<ZodiacSign>(ZODIAC_SIGNS[0]);
  const [selectedSignB, setSelectedSignB] = useState<ZodiacSign>(ZODIAC_SIGNS[4]); // Leo defaults as B
  const [hoveredSign, setHoveredSign] = useState<ZodiacSign | null>(null);

  // Heptagram State
  const [selectedTerminal, setSelectedTerminal] = useState<EsotericTerminal>(ESOTERIC_TERMINALS[4]); // 76 center default

  const d3WheelRef = useRef<SVGSVGElement | null>(null);

  // Compatibility Computation
  const compatibilityResult = useMemo(() => {
    const indexA = ZODIAC_SIGNS.findIndex(s => s.id === selectedSignA.id);
    const indexB = ZODIAC_SIGNS.findIndex(s => s.id === selectedSignB.id);
    const diff = Math.abs(indexA - indexB);
    
    let score = 50;
    let aspect = 'Inconjunct';
    let aspectSymbol = '⚺';
    let aspectColor = 'text-slate-400';
    let aspectDescription = '';

    if (diff === 0) {
      score = 85;
      aspect = 'Conjunction (0°)';
      aspectSymbol = '☌';
      aspectColor = 'text-emerald-400';
      aspectDescription = 'A mirroring of identical energy. High intensity, where both forces merge into a single active crucible of expression.';
    } else if (diff === 1 || diff === 11) {
      score = 55;
      aspect = 'Semi-Sextile (30°)';
      aspectSymbol = '⚺';
      aspectColor = 'text-slate-400';
      aspectDescription = 'Adjacent elements of differing polarities. Demands active integration and mutual learning, blending different temporal speeds.';
    } else if (diff === 2 || diff === 10) {
      score = 88;
      aspect = 'Sextile (60°)';
      aspectSymbol = '⚹';
      aspectColor = 'text-sky-400';
      aspectDescription = 'Compatible polarities (Fire & Air, or Earth & Water). Highly creative alignment, facilitating smooth, supportive dialogue between elements.';
    } else if (diff === 3 || diff === 9) {
      score = 45;
      aspect = 'Square (90°)';
      aspectSymbol = '□';
      aspectColor = 'text-red-400';
      aspectDescription = 'Dynamic friction and structural tension. Forces rapid refinement and breakthroughs. The conflict fuels spiritual development.';
    } else if (diff === 4 || diff === 8) {
      score = 98;
      aspect = 'Trine (120°)';
      aspectSymbol = '△';
      aspectColor = 'text-amber-400';
      aspectDescription = 'Perfect elemental harmony. Effortless energy flow. The signs share the exact same raw alchemical element, validating each other.';
    } else if (diff === 5 || diff === 7) {
      score = 60;
      aspect = 'Quincunx (150°)';
      aspectSymbol = '⚼';
      aspectColor = 'text-violet-400';
      aspectDescription = 'Karmic adjustment and mystery. Forces adjustments of perspective. Highly spiritual, prompting the retrieval of lost aspects of consciousness.';
    } else if (diff === 6) {
      score = 78;
      aspect = 'Opposition (180°)';
      aspectSymbol = '☍';
      aspectColor = 'text-indigo-400';
      aspectDescription = 'Magnetic polar opposites. Representing the dual pillars (Jachin and Boaz). Extreme attraction and mirroring, requiring integration of the opposite self.';
    }

    // Elemental synthesis
    let elementPairing = `${selectedSignA.element} + ${selectedSignB.element}`;
    let alchemicalSynthesis = '';

    const sortedElements = [selectedSignA.element, selectedSignB.element].sort().join(' + ');

    if (sortedElements === 'Fire + Fire') {
      alchemicalSynthesis = 'A highly volatile double-combustion. Boundless passion, drive, and spiritual light, but requires structured containment to prevent burning the crucible.';
    } else if (sortedElements === 'Air + Fire') {
      alchemicalSynthesis = 'The Combustion of Vision. Air feeds and expands the fire, generating bright intellectual breakthroughs, visionary philosophies, and rapid progress.';
    } else if (sortedElements === 'Earth + Fire') {
      alchemicalSynthesis = 'The Controlled Furnace. Earth provides containment, structure, and physical endurance, allowing Fire\'s creative energy to manifest as permanent gold.';
    } else if (sortedElements === 'Fire + Water') {
      alchemicalSynthesis = 'Steam and Rapid Sublimation. Fire boils water; water extinguishes fire. A volatile, highly magical pairing of absolute emotion with pure willpower.';
    } else if (sortedElements === 'Earth + Earth') {
      alchemicalSynthesis = 'Crystallized Mastery. Exceptional structural integrity and absolute physical manifestation. However, can easily become rigid if not periodically watered.';
    } else if (sortedElements === 'Air + Earth') {
      alchemicalSynthesis = 'The Pragmatic Blueprint. Air conceives the mathematical blueprints and designs; Earth builds the physical foundation and structures.';
    } else if (sortedElements === 'Earth + Water') {
      alchemicalSynthesis = 'The Fertile Seedbed. Water softens and nourishes Earth, while Earth structures and direct Water. A naturally generative, rich, and balancing matrix.';
    } else if (sortedElements === 'Air + Air') {
      alchemicalSynthesis = 'The Whispering Currents. Unbounded mental alignment, high telepathic resonance, and collective ideation. However, easily floats away from physical boundaries.';
    } else if (sortedElements === 'Air + Water') {
      alchemicalSynthesis = 'Mystical Vapor and Mind-Soul integration. Air seeks rational formulas; Water seeks deep feeling. Demands balancing logic with intuitive gnosis.';
    } else if (sortedElements === 'Water + Water') {
      alchemicalSynthesis = 'The Abyssal Conjunction. Pure intuitive synchronization and limitless empathy. Boundaries dissolve completely, leading to a single, deep ocean of shared soul.';
    }

    return {
      score,
      aspect,
      aspectSymbol,
      aspectColor,
      aspectDescription,
      elementPairing,
      alchemicalSynthesis
    };
  }, [selectedSignA, selectedSignB]);

  // Render D3 Zodiac Wheel
  useEffect(() => {
    if (!d3WheelRef.current || activeSubTab !== 'wheel') return;

    const svg = d3.select(d3WheelRef.current);
    svg.selectAll('*').remove();

    const width = 340;
    const height = 340;
    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = 145;
    const innerRadius = 115;

    const g = svg.append('g');

    // Gradient definition for glowing aspects
    const defs = svg.append('defs');
    const aspectGlow = defs.append('filter')
      .attr('id', 'zodiac-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    
    aspectGlow.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    
    aspectGlow.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'blur');
    aspectGlow.select('feMerge')
      .append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Draw background concentric circles
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', outerRadius)
      .attr('fill', 'rgba(10, 11, 14, 0.65)')
      .attr('stroke', 'rgba(255, 255, 255, 0.05)')
      .attr('stroke-width', 1);

    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', innerRadius)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.03)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Angle scales (12 signs, 30° each)
    const angleScale = d3.scaleLinear()
      .domain([0, 12])
      .range([0, 2 * Math.PI]);

    // Draw Aspect Line between Selected Sign A and Sign B
    const indexA = ZODIAC_SIGNS.findIndex(s => s.id === selectedSignA.id);
    const indexB = ZODIAC_SIGNS.findIndex(s => s.id === selectedSignB.id);

    const angleA = angleScale(indexA) - Math.PI / 2;
    const angleB = angleScale(indexB) - Math.PI / 2;

    const xA = cx + innerRadius * Math.cos(angleA);
    const yA = cy + innerRadius * Math.sin(angleA);
    const xB = cx + innerRadius * Math.cos(angleB);
    const yB = cy + innerRadius * Math.sin(angleB);

    // Glowing line
    const colorHex = compatibilityResult.score >= 80 
      ? activeTheme.textAccentHex 
      : compatibilityResult.score >= 60 
      ? '#38bdf8' 
      : '#f87171';

    g.append('line')
      .attr('x1', xA)
      .attr('y1', yA)
      .attr('x2', xB)
      .attr('y2', yB)
      .attr('stroke', colorHex)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', compatibilityResult.score < 60 ? '4,4' : 'none')
      .attr('filter', 'url(#zodiac-glow)')
      .attr('opacity', 0.85);

    // Draw lines from center to all nodes for grid structure
    ZODIAC_SIGNS.forEach((sign, idx) => {
      const angle = angleScale(idx) - Math.PI / 2;
      const x1 = cx + (innerRadius - 20) * Math.cos(angle);
      const y1 = cy + (innerRadius - 20) * Math.sin(angle);
      const x2 = cx + innerRadius * Math.cos(angle);
      const y2 = cy + innerRadius * Math.sin(angle);

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'rgba(255, 255, 255, 0.08)')
        .attr('stroke-width', 1);
    });

    // Draw the Zodiac signs around the circle
    ZODIAC_SIGNS.forEach((sign, idx) => {
      const angle = angleScale(idx) - Math.PI / 2;
      const radiusText = outerRadius - 15;
      const xText = cx + radiusText * Math.cos(angle);
      const yText = cy + radiusText * Math.sin(angle);

      const isA = sign.id === selectedSignA.id;
      const isB = sign.id === selectedSignB.id;
      const isHovered = hoveredSign?.id === sign.id;

      // Outer Ring Segment Background
      const arc = d3.arc()
        .innerRadius(innerRadius + 5)
        .outerRadius(outerRadius - 5)
        .startAngle(angleScale(idx) - Math.PI / 12)
        .endAngle(angleScale(idx) + Math.PI / 12);

      g.append('path')
        .attr('d', arc as any)
        .attr('transform', `translate(${cx}, ${cy})`)
        .attr('fill', isA 
          ? `${activeTheme.textAccentHex}25` 
          : isB 
          ? `${activeTheme.textAccentHex}15` 
          : 'rgba(255, 255, 255, 0.02)'
        )
        .attr('stroke', isA || isB 
          ? activeTheme.textAccentHex 
          : 'rgba(255, 255, 255, 0.08)'
        )
        .attr('stroke-width', isA || isB ? 1.5 : 0.5)
        .attr('class', 'cursor-pointer transition-all duration-300')
        .on('click', (event) => {
          event.preventDefault();
          if (event.shiftKey || isA) {
            setSelectedSignB(sign);
          } else {
            setSelectedSignA(sign);
          }
        })
        .on('mouseenter', () => {
          setHoveredSign(sign);
        })
        .on('mouseleave', () => {
          setHoveredSign(null);
        });

      // Sign Symbol
      g.append('text')
        .attr('x', xText)
        .attr('y', yText + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', isA || isB ? '16px' : '12px')
        .attr('fill', isA 
          ? '#fff' 
          : isB 
          ? activeTheme.textAccentHex 
          : 'rgba(255, 255, 255, 0.65)'
        )
        .attr('class', 'cursor-pointer font-sans select-none pointer-events-none transition-all duration-200')
        .text(sign.symbol);

      // Sign Initials label on the extreme outer edge
      const rLabel = outerRadius + 18;
      const xLabel = cx + rLabel * Math.cos(angle);
      const yLabel = cy + rLabel * Math.sin(angle);

      g.append('text')
        .attr('x', xLabel)
        .attr('y', yLabel + 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('fill', isA 
          ? activeTheme.textAccentHex 
          : isB 
          ? '#94a3b8' 
          : 'rgba(255,255,255,0.2)'
        )
        .text(sign.name.substring(0, 3).toUpperCase());
    });

    // Center Core Decoration
    const core = g.append('g')
      .attr('class', 'cursor-pointer')
      .on('click', () => {
        // Swap signs
        const tmp = selectedSignA;
        setSelectedSignA(selectedSignB);
        setSelectedSignB(tmp);
      });

    core.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 28)
      .attr('fill', '#0c0d10')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 1);

    core.append('text')
      .attr('x', cx)
      .attr('y', cy + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', activeTheme.textAccentHex)
      .attr('font-family', 'serif')
      .attr('class', 'select-none')
      .text('SWAP');

  }, [activeSubTab, selectedSignA, selectedSignB, activeTheme, compatibilityResult, hoveredSign]);

  // Calculations & Positions for Heptagram
  const heptagramCoords = useMemo(() => {
    const cx = 170;
    const cy = 170;
    const rStar = 92;
    const rFlames = 132;

    // 7 points of the star
    const starPoints = Array.from({ length: 7 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
      return {
        x: cx + rStar * Math.cos(angle),
        y: cy + rStar * Math.sin(angle),
        index: i
      };
    });

    // Star path connecting: 0 -> 3 -> 6 -> 2 -> 5 -> 1 -> 4 -> 0
    const sequence = [0, 3, 6, 2, 5, 1, 4];
    const pathData = sequence.map(idx => {
      const pt = starPoints[idx];
      return `${pt.x},${pt.y}`;
    }).join(' L ');

    const fullPath = `M ${pathData} Z`;

    // 12 flames circles surrounding the clock
    const flameNodes = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
      return {
        x: cx + rFlames * Math.cos(angle),
        y: cy + rFlames * Math.sin(angle),
        label: i === 0 ? '12' : String(i)
      };
    });

    return { cx, cy, starPoints, fullPath, flameNodes };
  }, []);

  return (
    <div id="zodiac-compatibility-root" className={`p-5 md:p-6 rounded-2xl border ${activeTheme.borderAccent} bg-[#0c0d10]/95 backdrop-blur-md relative overflow-hidden`}>
      {/* Decorative starry background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/4 w-0.5 h-0.5 bg-slate-300 rounded-full"></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-10 w-0.5 h-0.5 bg-violet-400 rounded-full"></div>
      </div>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 mb-5 gap-4 relative z-10">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Compass className={`w-5 h-5 ${activeTheme.textPrimary} animate-spin-slow`} />
            Zodiac Compatibility & Mystical Alignments
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Evaluate the harmonic aspects of solar alignments, or unlock the esoterical terminals of identity.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 border border-white/5 rounded-xl">
          <button
            onClick={() => setActiveSubTab('engine')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'engine'
                ? `bg-amber-500/20 border-amber-500/30 text-amber-300 font-semibold border`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Energetic Engine
          </button>
          <button
            onClick={() => setActiveSubTab('wheel')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'wheel'
                ? `bg-emerald-950/40 border-emerald-500/20 text-emerald-400 font-semibold border`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ☸️ Sun Sign Alignment Wheel
          </button>
          <button
            onClick={() => setActiveSubTab('heptagram')}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'heptagram'
                ? `bg-amber-950/30 border-amber-500/20 text-amber-500 font-semibold border`
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⭐ Heptagram Seal of Identity
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'engine' ? (
          <motion.div
            key="zodiac-engine-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10"
          >
            <ZodiacCompatibilityEngine
              userSign={selectedSignA.name}
              partnerSign={selectedSignB.name}
              onUserSignChange={(name) => {
                const found = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === name.toLowerCase());
                if (found) setSelectedSignA(found);
              }}
              onPartnerSignChange={(name) => {
                const found = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === name.toLowerCase());
                if (found) setSelectedSignB(found);
              }}
              activeTheme={activeTheme}
            />
          </motion.div>
        ) : activeSubTab === 'wheel' ? (
          <motion.div
            key="zodiac-wheel-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10"
          >
            {/* Left side: Interactive Wheel rendered via D3 */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/35 border border-white/5 p-4 rounded-xl shadow-inner min-h-[360px]">
              <div className="relative">
                <svg
                  ref={d3WheelRef}
                  width="340"
                  height="340"
                  className="mx-auto"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2 text-center">
                Click a sign to set <span className="text-slate-300 font-semibold">Sign A</span>. Hold <span className="text-slate-300 font-semibold">Shift + Click</span> to set <span className="text-slate-300 font-semibold">Sign B</span>.
              </p>
            </div>

            {/* Right side: Detailed Compatibility Cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* Quick Select Panel */}
              <div className="grid grid-cols-2 gap-3">
                {/* Sign A Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Solar Anchor A</label>
                  <select
                    value={selectedSignA.id}
                    onChange={(e) => setSelectedSignA(ZODIAC_SIGNS.find(s => s.id === e.target.value) || ZODIAC_SIGNS[0])}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {ZODIAC_SIGNS.map(s => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">{s.symbol} {s.name} ({s.element})</option>
                    ))}
                  </select>
                </div>

                {/* Sign B Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Solar Anchor B</label>
                  <select
                    value={selectedSignB.id}
                    onChange={(e) => setSelectedSignB(ZODIAC_SIGNS.find(s => s.id === e.target.value) || ZODIAC_SIGNS[0])}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {ZODIAC_SIGNS.map(s => (
                      <option key={s.id} value={s.id} className="bg-neutral-900">{s.symbol} {s.name} ({s.element})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Central Compatibility Banner */}
              <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-r from-black/50 to-neutral-900/60 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-serif font-bold ${compatibilityResult.aspectColor} flex items-center gap-1`}>
                      <span className="text-base">{compatibilityResult.aspectSymbol}</span>
                      {compatibilityResult.aspect}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif text-slate-300">
                    {selectedSignA.name} and {selectedSignB.name} Compatibility
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                    {compatibilityResult.aspectDescription}
                  </p>
                </div>

                {/* Circular Gauge */}
                <div className="relative w-18 h-18 shrink-0 flex items-center justify-center rounded-full bg-neutral-950 border border-white/5">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke={compatibilityResult.score >= 80 ? activeTheme.textAccentHex : compatibilityResult.score >= 60 ? '#38bdf8' : '#f87171'}
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={`${2 * Math.PI * 30 * (1 - compatibilityResult.score / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-mono font-bold text-white">{compatibilityResult.score}%</span>
                    <span className="text-[8px] text-slate-400 font-serif uppercase">Harmonic</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Alchemical Pairing Analysis */}
              <div className="p-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  <span className="text-xs font-serif font-bold text-[#D4AF37] tracking-wider uppercase">
                    Alchemical Elemental Conjunction: {compatibilityResult.elementPairing}
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed italic font-serif">
                  "{compatibilityResult.alchemicalSynthesis}"
                </p>
              </div>

              {/* Sign Cards Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                {/* Sign A Card */}
                <div className="p-3 rounded-lg border border-white/5 bg-black/20 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-slate-300 text-sm">{selectedSignA.symbol} {selectedSignA.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                      {selectedSignA.element}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Modality: {selectedSignA.modality} | Ruler: {selectedSignA.ruler}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {selectedSignA.description}
                  </p>
                </div>

                {/* Sign B Card */}
                <div className="p-3 rounded-lg border border-white/5 bg-black/20 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-slate-300 text-sm">{selectedSignB.symbol} {selectedSignB.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/30">
                      {selectedSignB.element}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Modality: {selectedSignB.modality} | Ruler: {selectedSignB.ruler}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                    {selectedSignB.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="heptagram-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10"
          >
            {/* Left side: Esoteric Heptagram rendered via live SVG */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-black/40 border border-white/5 p-4 rounded-xl shadow-inner min-h-[380px]">
              <motion.div 
                className="relative w-[340px] h-[340px]"
                style={{ perspective: 1000, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <svg width="340" height="340" className="mx-auto select-none overflow-visible">
                  <defs>
                    <filter id="hept-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer circle enclosing the star */}
                  <circle
                    cx={heptagramCoords.cx}
                    cy={heptagramCoords.cy}
                    r="105"
                    fill="none"
                    stroke="rgba(212, 175, 55, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />

                  {/* Even larger clock outer boundary */}
                  <circle
                    cx={heptagramCoords.cx}
                    cy={heptagramCoords.cy}
                    r="132"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth="1"
                  />

                  {/* Prominent flames at 12 nodes (represented by glowing flame indicators) */}
                  {heptagramCoords.flameNodes.map((flame, idx) => {
                    const isHovered = false; // can expand
                    return (
                      <g key={`flame-${idx}`}>
                        <circle
                          cx={flame.x}
                          cy={flame.y}
                          r="6"
                          className="fill-amber-500/20 stroke-amber-500/40 hover:fill-amber-500 hover:stroke-white transition-all cursor-pointer"
                          strokeWidth="1"
                        />
                        <text
                          x={flame.x}
                          y={flame.y + 3}
                          textAnchor="middle"
                          fill="rgba(255, 255, 255, 0.35)"
                          fontSize="8px"
                          fontFamily="monospace"
                          pointerEvents="none"
                        >
                          {flame.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw Seven-Point Star Path */}
                  <path
                    d={heptagramCoords.fullPath}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    filter="url(#hept-glow)"
                    opacity="0.85"
                  />

                  {/* Star vertex circles connecting labels */}
                  {heptagramCoords.starPoints.map((pt, idx) => {
                    return (
                      <circle
                        key={`vertex-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        fill="#fff"
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Central Emblem: The Number 76 */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === '76')!)}
                  >
                    <circle
                      cx={heptagramCoords.cx}
                      cy={heptagramCoords.cy}
                      r="22"
                      fill="#0c0d10"
                      stroke={selectedTerminal?.id === '76' ? '#D4AF37' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={selectedTerminal?.id === '76' ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={heptagramCoords.cx}
                      cy={heptagramCoords.cy}
                      r="18"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      className="group-hover:rotate-45 transition-transform duration-1000"
                    />
                    <text
                      x={heptagramCoords.cx}
                      y={heptagramCoords.cy + 5}
                      textAnchor="middle"
                      fill="#D4AF37"
                      fontSize="14px"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      76
                    </text>
                  </g>

                  {/* Text labels embedded around the seal */}
                  {/* YAHWEH on top */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx}
                    y={heptagramCoords.cy - 110}
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'yahweh' ? '#fff' : 'rgba(255,255,255,0.65)'}
                    fontSize="11px"
                    fontFamily="serif"
                    fontWeight="bold"
                    letterSpacing="1px"
                    className="cursor-pointer hover:fill-white hover:underline transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'yahweh')!)}
                  >
                    YAHWEH
                  </motion.text>

                  {/* LUCIFER at bottom */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx}
                    y={heptagramCoords.cy + 115}
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'lucifer' ? '#fff' : 'rgba(255,255,255,0.65)'}
                    fontSize="11px"
                    fontFamily="serif"
                    fontWeight="bold"
                    letterSpacing="1px"
                    className="cursor-pointer hover:fill-white hover:underline transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'lucifer')!)}
                  >
                    LUCIFER
                  </motion.text>

                  {/* J on left */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx - 75}
                    y={heptagramCoords.cy + 5}
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'j' ? '#fff' : 'rgba(255,255,255,0.65)'}
                    fontSize="15px"
                    fontFamily="serif"
                    fontWeight="bold"
                    className="cursor-pointer hover:fill-white hover:underline transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'j')!)}
                  >
                    J
                  </motion.text>

                  {/* B on right */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx + 75}
                    y={heptagramCoords.cy + 5}
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'b' ? '#fff' : 'rgba(255,255,255,0.65)'}
                    fontSize="15px"
                    fontFamily="serif"
                    fontWeight="bold"
                    className="cursor-pointer hover:fill-white hover:underline transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'b')!)}
                  >
                    B
                  </motion.text>

                  {/* APOCALYPSE very top */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx}
                    y="16"
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'apocalypse' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
                    fontSize="9px"
                    fontFamily="monospace"
                    letterSpacing="2px"
                    className="cursor-pointer hover:fill-amber-400 transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'apocalypse')!)}
                  >
                    ★ APOCALYPSE ★
                  </motion.text>

                  {/* LIFE AFTER DEATH very right */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x="320"
                    y={heptagramCoords.cy}
                    textAnchor="end"
                    fill={selectedTerminal?.id === 'life_after_death' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
                    fontSize="8px"
                    fontFamily="monospace"
                    letterSpacing="1px"
                    className="cursor-pointer hover:fill-amber-400 transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'life_after_death')!)}
                  >
                    LIFE AFTER DEATH ➔
                  </motion.text>

                  {/* APOCRYPHON bottom */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx}
                    y="332"
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'apocryphon' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
                    fontSize="9px"
                    fontFamily="monospace"
                    letterSpacing="2px"
                    className="cursor-pointer hover:fill-amber-400 transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'apocryphon')!)}
                  >
                    ★ APOCRYPHON ★
                  </motion.text>

                  {/* APOLLYON very left */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x="20"
                    y={heptagramCoords.cy}
                    textAnchor="start"
                    fill={selectedTerminal?.id === 'apollyon' ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
                    fontSize="8px"
                    fontFamily="monospace"
                    letterSpacing="1px"
                    className="cursor-pointer hover:fill-amber-400 transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'apollyon')!)}
                  >
                    🠔 APOLLYON
                  </motion.text>

                  {/* AZRAEL under Apocalypse */}
                  <motion.text whileHover={{ scale: 1.3 }} style={{ originX: "50%", originY: "50%" }}
                    x={heptagramCoords.cx}
                    y="32"
                    textAnchor="middle"
                    fill={selectedTerminal?.id === 'azrael' ? '#fff' : 'rgba(255,255,255,0.45)'}
                    fontSize="9px"
                    fontFamily="serif"
                    fontStyle="italic"
                    className="cursor-pointer hover:fill-slate-200 transition"
                    onClick={() => setSelectedTerminal(ESOTERIC_TERMINALS.find(t => t.id === 'azrael')!)}
                  >
                    Azrael
                  </motion.text>
                </svg>
              </motion.div>
              <p className="text-[10px] text-slate-500 font-mono mt-1 text-center">
                Click any word, label, or the central "76" emblem to decant its secret gnostic testament.
              </p>
            </div>

            {/* Right side: Decanted Revelation Scrolls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5 rounded-2xl relative min-h-[280px] flex flex-col justify-between">
                {/* Ancient ribbon corner */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="absolute transform rotate-45 bg-[#D4AF37]/20 text-center text-[8px] font-mono font-bold text-[#D4AF37] py-1 right-[-40px] top-[15px] w-[120px]">
                    SECRET CODES
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/20" />
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                      Decanted Revelation Scroll
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-slate-100 border-b border-white/5 pb-2">
                    {selectedTerminal.title}
                  </h3>

                  <p className="text-sm text-slate-300 font-serif leading-relaxed italic pr-4 whitespace-pre-line">
                    "{selectedTerminal.scrollContent}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Alignment Coordinate: <strong className="text-amber-500">{selectedTerminal.alignment}</strong></span>
                  <span className="text-[8px] px-2 py-0.5 rounded bg-black/40 border border-white/5 uppercase">
                    Salazar Academic Code
                  </span>
                </div>
              </div>

              {/* Informational advice */}
              <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex gap-3 text-xs text-slate-400 leading-relaxed">
                <Info className="w-5 h-5 text-amber-500/80 shrink-0 mt-0.5" />
                <div>
                  <span className="font-serif font-bold text-slate-300 block mb-0.5">Understanding the Star of Identity</span>
                  The heptagram is the key of the alchemist, mapping the seven planetary spirits onto the twelve houses of the celestial clock. When attuned correctly to the atomic frequency 76, it provides absolute coherence for aetheric queries.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
