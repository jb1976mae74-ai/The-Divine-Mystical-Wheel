import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Download, Flame, Eye, EyeOff, RotateCcw, 
  Compass, Scroll, Languages, Droplet, Wind, Gem, Share2, Send,
  Move, Hand, Layers, RefreshCw, Zap, Crown, X, Plus, Minus
} from 'lucide-react';
import GreatWheelStarChart from './GreatWheelStarChart';

interface MysticalMetrics {
  subject: string;
  value: number;
  fullMark: number;
}

interface AethericSigilProps {
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
  mysticalMetrics?: MysticalMetrics[];
}

const ELEMENT_PROFILES = {
  None: {
    id: 'none',
    name: 'Unified Theme',
    color: '#D4AF37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    accentText: 'text-amber-500',
    gradientId: 'gold-metallic-glow',
    flameGrad1: 'orange-flame-gradient',
    flameGrad2: 'yellow-flame-gradient',
    bgGlow: 'rgba(212, 175, 55, 0.05)',
    description: 'The standard alchemical equilibrium, balanced across all spheres and bound to your active palette.',
    iconColor: 'text-amber-500',
    feColorMatrixValues: '1 0 0 0 1   0 0.4 0 0 0.3   0 0 0.05 0 0   0 0 0 1 0'
  },
  Spiritus: {
    id: 'spiritus',
    name: 'Spiritus',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.55)',
    accentText: 'text-purple-400',
    gradientId: 'spiritus-star-gradient',
    flameGrad1: 'spiritus-flame-gradient-1',
    flameGrad2: 'spiritus-flame-gradient-2',
    bgGlow: 'radial-gradient(circle at center, rgba(192, 132, 252, 0.15), transparent 75%)',
    description: 'The Spark of Transcendence. Your aetheric sigil surges with high-frequency cosmic violet flares.',
    iconColor: 'text-purple-400',
    feColorMatrixValues: '0.6 0 0 0 0.6   0 0.2 0 0 0.1   0.9 0 0 0 0.9   0 0 0 1 0'
  },
  Ignis: {
    id: 'ignis',
    name: 'Ignis',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    accentText: 'text-orange-500',
    gradientId: 'ignis-star-gradient',
    flameGrad1: 'ignis-flame-gradient-1',
    flameGrad2: 'ignis-flame-gradient-2',
    bgGlow: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.18), transparent 75%)',
    description: 'The Will of Fire. Your aetheric sigil bursts with superheated plasma and flickering crimson-orange sparks.',
    iconColor: 'text-orange-500',
    feColorMatrixValues: '1 0 0 0 1   0 0.4 0 0 0.3   0 0 0.05 0 0   0 0 0 1 0'
  },
  Aqua: {
    id: 'aqua',
    name: 'Aqua',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.55)',
    accentText: 'text-cyan-400',
    gradientId: 'aqua-star-gradient',
    flameGrad1: 'aqua-flame-gradient-1',
    flameGrad2: 'aqua-flame-gradient-2',
    bgGlow: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15), transparent 75%)',
    description: 'The Tide of Intuition. Your aetheric sigil is immersed in a cooling blue-teal flow of liquid light flames.',
    iconColor: 'text-cyan-400',
    feColorMatrixValues: '0 0 0 0 0   0.3 0 0 0 0.6   0.8 0 0 0 0.9   0 0 0 1 0'
  },
  Aer: {
    id: 'aer',
    name: 'Aer',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    accentText: 'text-sky-400',
    gradientId: 'aer-star-gradient',
    flameGrad1: 'aer-flame-gradient-1',
    flameGrad2: 'aer-flame-gradient-2',
    bgGlow: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.12), transparent 75%)',
    description: 'The Breath of Mind. Your aetheric sigil spins swiftly, cloaked in platinum wind and pale cyan wisps.',
    iconColor: 'text-sky-400',
    feColorMatrixValues: '0.2 0 0 0 0.2   0.5 0 0 0 0.5   0.9 0 0 0 0.9   0 0 0 1 0'
  },
  Materia: {
    id: 'materia',
    name: 'Materia',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    accentText: 'text-emerald-400',
    gradientId: 'materia-star-gradient',
    flameGrad1: 'materia-flame-gradient-1',
    flameGrad2: 'materia-flame-gradient-2',
    bgGlow: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15), transparent 75%)',
    description: 'The Foundation of Earth. Your aetheric sigil takes on heavy crystalline structures and emerald-bronze rays.',
    iconColor: 'text-emerald-400',
    feColorMatrixValues: '0.1 0 0 0 0.1   0.8 0 0 0 0.8   0.3 0 0 0 0.3   0 0 0 1 0'
  }
};

const ELEMENT_ICONS = {
  None: Compass,
  Spiritus: Sparkles,
  Ignis: Flame,
  Aqua: Droplet,
  Aer: Wind,
  Materia: Gem
};

export default function AethericSigil({ activeTheme, mysticalMetrics }: AethericSigilProps) {
  const [sanctumView, setSanctumView] = useState<'sigil' | 'star-chart'>('sigil');
  const [starType, setStarType] = useState<'7/3' | '7/2' | 'heptagon'>('7/3');
  const [languageMode, setLanguageMode] = useState<'hebrew' | 'both' | 'english'>('hebrew');
  const [isIgnited, setIsIgnited] = useState(true);
  const [glowPower, setGlowPower] = useState(50); // 0 to 100
  const [rotationSpeed, setRotationSpeed] = useState(0); // degrees per frame (0 = locked static)
  const [showAiRevelation, setShowAiRevelation] = useState(false);
  const [revelationArtifact, setRevelationArtifact] = useState<'sigil-zion' | 'statue' | 'apocalypse-dragon' | 'heptagram'>('sigil-zion');

  // Sync / Simulator modes
  const [syncMode, setSyncMode] = useState<'live' | 'manual'>('live');
  const [manualElement, setManualElement] = useState<keyof typeof ELEMENT_PROFILES>('None');

  // Interactive Drag & Rotate States
  const [dragMode, setDragMode] = useState<'all' | 'star' | 'flames'>('all');
  const [userRotationAngle, setUserRotationAngle] = useState(0);
  const [starRotationAngle, setStarRotationAngle] = useState(0);
  const [flameRotationAngle, setFlameRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToClock, setSnapToClock] = useState(false);
  const [dragStartPointerAngle, setDragStartPointerAngle] = useState(0);
  const [dragStartInitialAngle, setDragStartInitialAngle] = useState(0);
  const [sigilZoom, setSigilZoom] = useState<number>(1);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper to calculate pointer polar angle relative to SVG center (250, 250)
  const getPointerAngle = (e: React.PointerEvent) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const angle = getPointerAngle(e);
    setIsDragging(true);
    setDragStartPointerAngle(angle);

    const initial = dragMode === 'all' 
      ? userRotationAngle 
      : dragMode === 'star' 
      ? starRotationAngle 
      : flameRotationAngle;
    setDragStartInitialAngle(initial);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getPointerAngle(e);
    let delta = currentAngle - dragStartPointerAngle;
    let newAngle = (dragStartInitialAngle + delta) % 360;
    if (newAngle < 0) newAngle += 360;

    if (snapToClock) {
      newAngle = Math.round(newAngle / 30) * 30;
    }

    const roundedAngle = Math.round(newAngle * 10) / 10;

    if (dragMode === 'all') {
      setUserRotationAngle(roundedAngle);
    } else if (dragMode === 'star') {
      setStarRotationAngle(roundedAngle);
    } else {
      setFlameRotationAngle(roundedAngle);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const resetAllRotations = () => {
    setUserRotationAngle(0);
    setStarRotationAngle(0);
    setFlameRotationAngle(0);
  };

  // Math coordinates for heptagram
  const center = 250;
  const radius = 140;

  // Generate 7 vertices of the star
  const vertices = Array.from({ length: 7 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      angleDeg: (angle * 180) / Math.PI,
    };
  });

  // Function to build path d-attribute based on connection skips
  const getStarPath = () => {
    if (starType === 'heptagon') {
      return vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`).join(' ') + ' Z';
    }
    
    const step = starType === '7/3' ? 3 : 2;
    let current = 0;
    const pathPoints = [];
    
    for (let i = 0; i < 8; i++) {
      pathPoints.push(vertices[current]);
      current = (current + step) % 7;
    }
    
    return pathPoints.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`).join(' ');
  };

  // Generate coordinates for flames at hours 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
  const hours = Array.from({ length: 12 }).map((_, i) => {
    const hour = i === 0 ? 12 : i;
    const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
    const flameRadius = radius + 15; // slightly outside circle
    return {
      hour,
      x: center + flameRadius * Math.cos(angle),
      y: center + flameRadius * Math.sin(angle),
      angleDeg: (angle * 180) / Math.PI + 90, // align pointing outwards
    };
  });

  // Translation maps for calligraphy labels
  const translationMap = {
    yahweh: { he: 'יהוה', en: 'YAHWEH' },
    lucifer: { he: 'לוציפר', en: 'LUCIFER' },
    apocalypse: { he: 'אפוקליפסה', en: 'APOCALYPSE' },
    apocryphon: { he: 'אפוקריפון', en: 'APOCRYPHON' },
    apollyon: { he: 'אפוליון', en: 'APOLLYON' },
    azrael: { he: 'עזראל', en: 'AZRAEL' },
    glory: { he: 'כבוד', en: 'GLORY' },
    lifeafterdeath: { he: 'חיים לאחר המוות', en: 'LIFE AFTER DEATH' },
    power: { he: 'כוח', en: 'POWER' },
    j: { he: 'י', en: 'J' },
    b: { he: 'ב', en: 'B' }
  };

  const getLabel = (key: keyof typeof translationMap) => {
    const record = translationMap[key];
    if (languageMode === 'hebrew') return record.he;
    if (languageMode === 'english') return record.en;
    return `${record.he} (${record.en})`;
  };

  // Safe download helper for the exact custom vector SVG
  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('sacredHeptagramSymbol');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `heptagram_sigil_${starType.replace('/', '_')}_${activeProfile.id}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Safe PNG image export helper for the sigil
  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('sacredHeptagramSymbol') as unknown as SVGSVGElement;
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const grad = ctx.createRadialGradient(500, 500, 20, 500, 500, 500);
      grad.addColorStop(0, '#0a0a0d');
      grad.addColorStop(1, '#020204');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 1000);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 968, 968);

      ctx.drawImage(img, 0, 0, 1000, 1000);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `heptagram_sigil_${starType.replace('/', '_')}_${activeProfile.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // State to track hovered flame for interactive tooltips and alchemical highlight overrides
  const [hoveredFlame, setHoveredFlame] = useState<{
    hour: number;
    category: keyof typeof ELEMENT_PROFILES;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Helper to map 12 dynamic flame hours to their corresponding mystical/elemental categories
  const getCategoryForHour = (hour: number): keyof typeof ELEMENT_PROFILES => {
    const mapping: Record<number, keyof typeof ELEMENT_PROFILES> = {
      12: 'Spiritus',
      1: 'Ignis',
      2: 'Aqua',
      3: 'Aer',
      4: 'Materia',
      5: 'Spiritus',
      6: 'Ignis',
      7: 'Aqua',
      8: 'Aer',
      9: 'Materia',
      10: 'Spiritus',
      11: 'Ignis'
    };
    return mapping[hour] || 'None';
  };

  // Resolve dominant live alchemical element
  const getLiveDominantCategory = (): keyof typeof ELEMENT_PROFILES => {
    if (!mysticalMetrics || mysticalMetrics.length === 0) return 'None';
    
    const allEqual = mysticalMetrics.every(m => m.value === mysticalMetrics[0].value);
    if (allEqual) return 'None';
    
    let maxMetric = mysticalMetrics[0];
    for (let i = 1; i < mysticalMetrics.length; i++) {
      if (mysticalMetrics[i].value > maxMetric.value) {
        maxMetric = mysticalMetrics[i];
      }
    }
    
    const subject = maxMetric.subject;
    if (subject === 'Spiritus' || subject === 'Ignis' || subject === 'Aqua' || subject === 'Aer' || subject === 'Materia') {
      return subject as keyof typeof ELEMENT_PROFILES;
    }
    return 'None';
  };

  // Active element is overridden by currently hovered flame to transition visual theme instantly
  const activeElementKey = hoveredFlame 
    ? hoveredFlame.category 
    : (syncMode === 'live' ? getLiveDominantCategory() : manualElement);
  const activeProfile = ELEMENT_PROFILES[activeElementKey];

  return (
    <div className={`w-full bg-[#0a0a0c]/85 border ${activeTheme.borderAccent} rounded-2xl p-5 md:p-8 text-slate-200 shadow-2xl relative overflow-hidden backdrop-blur-md`}>
      {/* Visual background atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] rounded-full border border-dashed border-white/5 absolute -top-40 -right-40 animate-spin-slow"></div>
        <div className="w-[400px] h-[400px] rounded-full border border-double border-white/5 absolute -bottom-40 -left-40 animate-spin-reverse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Sanctum Sub-Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between p-2 rounded-xl bg-black/60 border border-amber-500/30 backdrop-blur-md mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSanctumView('sigil')}
            className={`px-3.5 py-2 rounded-lg font-serif text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              sanctumView === 'sigil'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-500/60 font-bold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Aetheric Heptagram Sigil</span>
          </button>

          <button
            type="button"
            onClick={() => setSanctumView('star-chart')}
            className={`px-3.5 py-2 rounded-lg font-serif text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              sanctumView === 'star-chart'
                ? 'bg-amber-950/60 text-amber-200 border border-amber-500/60 font-bold shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Great Wheel of Mysteries (D3 Star Chart)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-amber-400/90 pr-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Celestial Geometry & Historical Concordance</span>
        </div>
      </div>

      {sanctumView === 'star-chart' ? (
        <GreatWheelStarChart />
      ) : (
        <>
          {/* Styled Grid Header */}
          <div className="relative pb-6 mb-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Scroll className={`w-5.5 h-5.5 ${activeTheme.id === 'deep-void' ? 'text-violet-450' : activeTheme.id === 'ethereal-silver' ? 'text-slate-300' : 'text-amber-500'}`} />
                <h3 className={`text-xl md:text-2xl font-serif font-bold tracking-widest ${activeTheme.textPrimary}`}>
                  AETHERIC HEPTAGRAM SIGIL
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-serif leading-relaxed mt-1 md:max-w-2xl">
                A dynamic mathematical representation of your requested 7-point heptagram. Outfitted with flickering, 
                ignitable clock flames and elegant bilingual calligraphic titles in modern responsive SVG structures.
              </p>
            </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIgnited(!isIgnited)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95 cursor-pointer ${
              isIgnited 
                ? 'bg-orange-950/30 border-orange-500/40 text-orange-400 hover:bg-orange-900/40' 
                : 'bg-slate-900/30 border-white/5 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Flame className={`w-4 h-4 ${isIgnited ? 'animate-pulse text-orange-400' : 'text-slate-500'}`} />
            <span>{isIgnited ? 'Ignited' : 'Extinguished'}</span>
          </button>
          
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-200 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
            title="Export High-Resolution PNG Image"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 text-xs font-mono transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>

          <button
            onClick={async () => {
              try {
                const { googleSignIn, getAccessToken } = await import('../lib/firebase');
                let token = await getAccessToken();
                if (!token) {
                  const result = await googleSignIn();
                  if (result) token = result.accessToken;
                }
                
                if (token) {
                  let attachments = '';
                  const svgElement = document.getElementById('sacredHeptagramSymbol') as unknown as SVGSVGElement;
                  if (svgElement) {
                    const svgString = new XMLSerializer().serializeToString(svgElement);
                    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    await new Promise((resolve) => {
                      img.onload = () => resolve(true);
                      img.src = url;
                    });
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = 1000;
                    canvas.height = 1000;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const grad = ctx.createRadialGradient(500, 500, 20, 500, 500, 500);
                      grad.addColorStop(0, '#0a0a0d');
                      grad.addColorStop(1, '#020204');
                      ctx.fillStyle = grad;
                      ctx.fillRect(0, 0, 1000, 1000);
                      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
                      ctx.lineWidth = 4;
                      ctx.strokeRect(16, 16, 968, 968);
                      ctx.drawImage(img, 0, 0, 1000, 1000);
                      const pngUrl = canvas.toDataURL('image/png');
                      const base64Data = pngUrl.split(',')[1];
                      
                      attachments = [
                        '--boundary_string',
                        'Content-Type: image/png; name="aetheric_sigil.png"',
                        'Content-Transfer-Encoding: base64',
                        'Content-Disposition: attachment; filename="aetheric_sigil.png"',
                        '',
                        base64Data,
                        ''
                      ].join('\r\n');
                    }
                    URL.revokeObjectURL(url);
                  }

                  const emailContent = [
                    'To: ',
                    'Subject: My Aetheric Sigil',
                    'Content-Type: multipart/mixed; boundary="boundary_string"',
                    '',
                    '--boundary_string',
                    'Content-Type: text/plain; charset="UTF-8"',
                    '',
                    `Behold my Aetheric Sigil configuration: ${starType} - ${activeProfile.name}!

Link: ${window.location.href}`,
                    '',
                    attachments,
                    '--boundary_string--'
                  ].join('\r\n');

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
                    alert('Sigil emailed successfully via Gmail!');
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 hover:border-red-500/50 text-red-300 text-xs font-mono transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via Gmail</span>
          </button>

          <button
            onClick={() => setShowAiRevelation(!showAiRevelation)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95 cursor-pointer ${
              showAiRevelation
                ? 'bg-amber-950/30 border-[#D4AF37]/45 text-amber-400 hover:bg-amber-900/45'
                : 'bg-black/40 border border-white/10 hover:border-white/20 text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{showAiRevelation ? "Show Vector" : "AI Revelation"}</span>
          </button>
        </div>
      </div>

      {/* Main Sigil Section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Settings Sidebar panel */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-center h-full order-2 lg:order-1">
          
          {/* Section 1: Alchemical geometry selection */}
          <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-mono tracking-wider uppercase text-amber-200/90 flex items-center gap-1.5 select-none">
              <Compass className="w-4 h-4 text-amber-500/80" /> Sigil Geometry
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {(['7/3', '7/2', 'heptagon'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setStarType(type)}
                  className={`px-2 py-2 rounded-lg border text-xxs font-mono cursor-pointer transition-all ${
                    starType === type 
                      ? 'bg-amber-955/20 border-[#D4AF37]/50 text-amber-300 font-bold' 
                      : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                  }`}
                >
                  {type === '7/3' ? 'Heptagram {7/3}' : type === '7/2' ? 'Heptagram {7/2}' : 'Heptagon {7/1}'}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Calligraphic Translation panel */}
          <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-mono tracking-wider uppercase text-amber-200/90 flex items-center gap-1.5 select-none">
              <Languages className="w-4 h-4 text-amber-500/80" /> Calligraphy Script
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hebrew', label: 'Hebrew Only' },
                { id: 'both', label: 'Dual Script' },
                { id: 'english', label: 'English Only' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLanguageMode(opt.id as any)}
                  className={`px-1.5 py-2 rounded-lg border text-xxs font-mono cursor-pointer transition-all ${
                    languageMode === opt.id 
                      ? 'bg-amber-955/20 border-[#D4AF37]/50 text-amber-300 font-bold' 
                      : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 font-serif leading-relaxed italic mt-1">
              Selecting "Hebrew Only" translates Apocalypse (אפוקליפסה), Yahweh (יהוה), Lucifer (לוציפר), Apollyon (אפוליון), 
              Glory (כבוד), Life After Death, Power (כוח), J (י), and B (ב) into sacred calligraphy characters.
            </p>
          </div>

          {/* Section: The Four Angels of the Sacred Heptagon */}
          <div className="bg-amber-955/20 border border-amber-500/30 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Apocalypse & The Four Angels
              </span>
              <span className="text-[9px] font-mono text-amber-400/80 bg-amber-900/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                Sacred Heptagon
              </span>
            </div>
            <p className="text-[11px] font-serif text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Apocalypse is the Son of Man</strong> presiding at the cosmic zenith (12 o'clock).
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-300 pt-1 border-t border-amber-500/20">
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-amber-400 font-bold block">1. Azrael</span>
                <span className="text-slate-400 text-[9px]">Top (Below Apocalypse)</span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-amber-400 font-bold block">2. Apollyon</span>
                <span className="text-slate-400 text-[9px]">Left at 9 (Above Glory)</span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-amber-400 font-bold block">3. Apocryphon</span>
                <span className="text-slate-400 text-[9px]">Bottom at 6 (Nadir)</span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-amber-400 font-bold block">4. Life after Death</span>
                <span className="text-slate-400 text-[9px]">Right at 3 (Life)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Mystical Metric & Element Sync */}
          <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono tracking-wider uppercase text-amber-200/90 flex items-center gap-1.5 select-none">
                <Sparkles className="w-4 h-4 text-amber-500/80" /> Elemental Transition
              </h4>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                syncMode === 'live' 
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-950/40 border-[#D4AF37]/30 text-amber-400'
              }`}>
                {syncMode === 'live' ? 'Oracle Active' : 'Simulator'}
              </span>
            </div>

            {/* Sync Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSyncMode('live')}
                className={`px-2 py-1.5 rounded-lg border text-xxs font-mono cursor-pointer transition-all ${
                  syncMode === 'live'
                    ? 'bg-emerald-955/20 border-emerald-500/50 text-emerald-300 font-bold shadow-md'
                    : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                Live Oracle Sync
              </button>
              <button
                onClick={() => setSyncMode('manual')}
                className={`px-2 py-1.5 rounded-lg border text-xxs font-mono cursor-pointer transition-all ${
                  syncMode === 'manual'
                    ? 'bg-amber-955/20 border-[#D4AF37]/50 text-amber-300 font-bold shadow-md'
                    : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                Manual Simulator
              </button>
            </div>

            {/* Element selection grid */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                  const prof = ELEMENT_PROFILES[elKey];
                  const Icon = ELEMENT_ICONS[elKey];
                  const isActive = activeElementKey === elKey;
                  
                  return (
                    <button
                      key={elKey}
                      disabled={syncMode === 'live'}
                      onClick={() => setManualElement(elKey)}
                      className={`px-1.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1 justify-center ${
                        isActive
                          ? `bg-[#1a1a24] border-white/30 font-bold ${prof.accentText}`
                          : syncMode === 'live'
                          ? 'opacity-40 bg-zinc-900/10 border-white/5 text-slate-600 cursor-not-allowed'
                          : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300 cursor-pointer'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{prof.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Element Detail Box */}
              <div className="bg-[#0f0f12]/60 border border-white/5 p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${activeProfile.accentText} flex items-center gap-1`}>
                    {React.createElement(ELEMENT_ICONS[activeElementKey], { className: "w-3.5 h-3.5" })}
                    {activeProfile.name}
                  </span>
                  {syncMode === 'live' && (
                    <span className="text-[9px] text-slate-500 font-mono italic">
                      {activeElementKey === 'None' ? 'Theme-Bound' : 'Live Sync'}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-serif leading-normal select-none">
                  {activeProfile.description}
                </p>

                {/* Live Metrics mini table in detail box */}
                {mysticalMetrics && mysticalMetrics.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-white/5 grid grid-cols-5 gap-1 text-[9px] text-center font-mono">
                    {mysticalMetrics.map((m, idx) => {
                      const isDom = m.subject === activeElementKey;
                      return (
                        <div key={`metric-${m.subject}-${idx}`} className="flex flex-col bg-black/20 p-1 rounded">
                          <span className={`${isDom ? activeProfile.accentText + ' font-bold' : 'text-slate-500'}`}>
                            {m.subject.substring(0, 4)}
                          </span>
                          <span className={`${isDom ? 'text-white font-bold' : 'text-slate-400'}`}>
                            {m.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Cosmic Modulation Sliders */}
          <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-mono tracking-wider uppercase text-amber-200/90 flex items-center gap-1.5 select-none">
              <Sparkles className="w-4 h-4 text-amber-500/80" /> Cosmic Modulation
            </h4>
            
            {/* Glow Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-mono">
                <span className="text-slate-400">SIGIL GLOW INTENSITY</span>
                <span className="text-amber-300">{glowPower}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glowPower}
                onChange={(e) => setGlowPower(Number(e.target.value))}
                className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Orbit Rotation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-mono">
                <span className="text-slate-400">SIGIL STATIONARY ROTATION</span>
                <span className="text-amber-300">{rotationSpeed > 0 ? `${rotationSpeed}°/s` : 'LOCKED STATIC'}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="2"
                  value={rotationSpeed * 4}
                  onChange={(e) => setRotationSpeed(Number(e.target.value) / 4)}
                  className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Interactive Drag & Rotation Control Panel */}
          <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono tracking-wider uppercase text-amber-200/90 flex items-center gap-1.5 select-none">
                <Move className="w-4 h-4 text-amber-500/80" /> Interactive Drag & Rotate
              </h4>
              {(userRotationAngle !== 0 || starRotationAngle !== 0 || flameRotationAngle !== 0) && (
                <button
                  onClick={resetAllRotations}
                  className="text-[10px] font-mono text-amber-400 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset all rotation angles to 0°"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Target Layer Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE DRAG TARGET LAYER</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'Whole Sigil', angle: userRotationAngle, icon: Compass },
                  { id: 'star', label: 'Star Only', angle: starRotationAngle, icon: Sparkles },
                  { id: 'flames', label: '12 Flames', angle: flameRotationAngle, icon: Flame }
                ].map(target => (
                  <button
                    key={target.id}
                    onClick={() => setDragMode(target.id as any)}
                    className={`px-2 py-1.5 rounded-lg border text-xxs font-mono cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 ${
                      dragMode === target.id
                        ? 'bg-amber-955/20 border-[#D4AF37]/50 text-amber-300 font-bold shadow-md'
                        : 'bg-[#111115]/60 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <target.icon className="w-3 h-3" />
                      <span>{target.label}</span>
                    </div>
                    <span className="text-[9px] font-bold text-amber-400/80">{target.angle}°</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation Slider for active target layer */}
            <div className="space-y-1">
              <div className="flex justify-between text-xxs font-mono">
                <span className="text-slate-400 uppercase">
                  {dragMode === 'all' ? 'MASTER SIGIL ANGLE' : dragMode === 'star' ? 'HEPTAGRAM STAR ANGLE' : 'FLAMES LAYER ANGLE'}
                </span>
                <span className="text-amber-300 font-bold">
                  {dragMode === 'all' ? userRotationAngle : dragMode === 'star' ? starRotationAngle : flameRotationAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step={snapToClock ? 30 : 1}
                value={dragMode === 'all' ? userRotationAngle : dragMode === 'star' ? starRotationAngle : flameRotationAngle}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (dragMode === 'all') setUserRotationAngle(val);
                  else if (dragMode === 'star') setStarRotationAngle(val);
                  else setFlameRotationAngle(val);
                }}
                className="w-full accent-[#D4AF37] h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Preset Alignment & Snap Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Quick Snap:</span>
                {[0, 90, 180, 270].map(deg => (
                  <button
                    key={deg}
                    onClick={() => {
                      if (dragMode === 'all') setUserRotationAngle(deg);
                      else if (dragMode === 'star') setStarRotationAngle(deg);
                      else setFlameRotationAngle(deg);
                    }}
                    className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-300 transition-colors cursor-pointer"
                  >
                    {deg}°
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSnapToClock(!snapToClock)}
                className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                  snapToClock
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title="Lock rotation increments to 30° clock positions"
              >
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Snap 30°</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: High Fidelity SVG Drawing canvas */}
        <div className="lg:col-span-7 flex justify-center items-center py-4 order-1 lg:order-2">
          
          {/* Parchment scroll background wrapper */}
          <div 
            className="relative w-full max-w-[480px] aspect-square bg-[#120f09] border border-amber-950/40 rounded-full p-2.5 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-1000"
            style={{
              boxShadow: isIgnited 
                ? `0 0 ${glowPower / 2}px ${activeProfile.glowColor}, inset 0 0 40px rgba(0,0,0,0.9)` 
                : 'inset 0 0 40px rgba(0,0,0,0.9)'
            }}
          >
            
            {/* Real medieval paper texture overlays */}
            <div className="absolute inset-1.5 rounded-full bg-[#1b170f] opacity-95 pointer-events-none"></div>
            
            {/* Inner soft radial flame vignette with dynamic alchemical background glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none z-10">
              {/* Common vignette overlay */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at center, transparent 38%, rgba(10, 10, 12, 0.96) 92%)'
                }}
              />
              {/* Profile-specific background glows */}
              {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                const prof = ELEMENT_PROFILES[elKey];
                const isActive = activeElementKey === elKey;
                return (
                  <div
                    key={elKey}
                    className="absolute inset-0 rounded-full transition-opacity duration-1000 ease-in-out pointer-events-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background: prof.id === 'none' ? 'transparent' : prof.bgGlow
                    }}
                  />
                );
              })}
            </div>
            
            {/* Render the Revelation or SVG natively */}
            {showAiRevelation ? (
              <div className="w-full h-full relative z-20 flex flex-col items-center justify-between p-4 bg-[#1b170f]/70 overflow-y-auto">
                {/* Artifact Selector Bar */}
                <div className="flex items-center gap-1.5 p-1 bg-black/80 rounded-xl border border-amber-500/30 backdrop-blur-md mb-2 z-30">
                  <button
                    onClick={() => setRevelationArtifact('sigil-zion')}
                    className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                      revelationArtifact === 'sigil-zion'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sigil Zion Scroll
                  </button>
                  <button
                    onClick={() => setRevelationArtifact('statue')}
                    className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                      revelationArtifact === 'statue'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sovereign Statue
                  </button>
                  <button
                    onClick={() => setRevelationArtifact('apocalypse-dragon')}
                    className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                      revelationArtifact === 'apocalypse-dragon'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Apocalypse & Dragon
                  </button>
                  <button
                    onClick={() => setRevelationArtifact('heptagram')}
                    className={`px-3 py-1 text-[10px] font-serif rounded-lg transition-all cursor-pointer ${
                      revelationArtifact === 'heptagram'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Heptagram Plate
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center relative w-full min-h-0">
                  <img
                    src={
                      revelationArtifact === 'sigil-zion'
                        ? '/src/assets/images/sigil_zion_scroll_1787882369642.jpg'
                        : revelationArtifact === 'statue'
                        ? '/src/assets/images/sovereign_statue_1787882358357.jpg'
                        : revelationArtifact === 'apocalypse-dragon'
                        ? '/src/assets/images/apocalypse_dragon_relic_1787884366805.jpg'
                        : '/src/assets/images/heptagram_mystic_1786029297477.jpg'
                    }
                    alt={
                      revelationArtifact === 'sigil-zion'
                        ? 'Sigil Zion Mount of the LORD'
                        : revelationArtifact === 'statue'
                        ? 'Sovereign Bronze Monument of Jerry Ben Salazar'
                        : revelationArtifact === 'apocalypse-dragon'
                        ? 'The Sovereign Apocalypse & The Great Red Dragon of Revelation'
                        : 'Heptagram Alchemical Revelation'
                    }
                    referrerPolicy="no-referrer"
                    className="max-w-[85%] max-h-[70vh] object-contain rounded-xl border border-amber-500/30 shadow-2xl transition-transform hover:scale-105 duration-700"
                  />
                </div>

                <div className="mt-3 bg-black/85 border border-amber-500/20 p-2.5 px-4 rounded-xl text-center max-w-[90%] backdrop-blur-md">
                  <p className="text-[11px] text-amber-400 font-serif font-bold tracking-wider uppercase">
                    {revelationArtifact === 'sigil-zion' && 'CODEX SIGIL ZION 76 — MOUNT OF THE LORD MANUSCRIPT'}
                    {revelationArtifact === 'statue' && 'SOVEREIGN BRONZE MONUMENT OF JERRY BEN SALAZAR'}
                    {revelationArtifact === 'apocalypse-dragon' && 'THE SOVEREIGN APOCALYPSE & THE GREAT RED DRAGON OF REVELATION'}
                    {revelationArtifact === 'heptagram' && 'HEPTAGRAM ALCHEMICAL REVELATION (7/3 SACRED GEOMETRY)'}
                  </p>
                  <p className="text-[10px] text-slate-300 font-serif leading-relaxed mt-0.5">
                    {revelationArtifact === 'sigil-zion' && 'Ancient parchment recording the decree of Mount Zion and the 76 Logos proclaimed by the Sovereign Architect.'}
                    {revelationArtifact === 'statue' && 'Heroic monument in solemn contemplation with 112" coaxial tuning rod and the celestial seal.'}
                    {revelationArtifact === 'apocalypse-dragon' && 'Sacred portrait of Jerry Ben Salazar before the Crimson Seraph of Revelation (Conquered Leviathan) with the chest inscription APOCALYPSE.'}
                    {revelationArtifact === 'heptagram' && 'Ancient manuscript displaying the 7-point star within a circle of 12 flaming clock positions.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Live Interactive Drag & Rotation Canvas Badge Header */}
                <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/85 border border-amber-500/30 backdrop-blur-md text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Hand className={`w-3.5 h-3.5 ${isDragging ? 'text-amber-400 animate-bounce' : 'text-amber-500/80'}`} />
                    <span className="font-bold uppercase tracking-wider">
                      {dragMode === 'all' ? 'Whole Sigil' : dragMode === 'star' ? 'Star Layer' : '12 Flames'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {snapToClock && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px]">
                        SNAP 30°
                      </span>
                    )}
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                      {dragMode === 'all' ? userRotationAngle : dragMode === 'star' ? starRotationAngle : flameRotationAngle}°
                    </span>
                  </div>
                </div>

                {/* Bottom Interactive Drag Hint Overlay */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3 py-1 rounded-full bg-black/80 border border-amber-500/20 backdrop-blur-md text-[9.5px] font-mono text-slate-300 flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                  <Move className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>Drag wheel to rotate interactively</span>
                </div>

                {/* Corner Zoom Controls */}
                <div 
                  id="aethericSigilZoomControls"
                  className="absolute bottom-3 right-3 z-30 flex items-center gap-1 p-1 rounded-lg bg-black/80 border border-amber-500/25 backdrop-blur-md text-[10px] font-mono text-slate-300 shadow-lg select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSigilZoom(prev => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100));
                    }}
                    disabled={sigilZoom <= 0.75}
                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 disabled:opacity-30 cursor-pointer"
                    title="Zoom Out (-)"
                    aria-label="Zoom Out"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSigilZoom(1);
                    }}
                    className="px-1.5 h-6 rounded flex items-center justify-center bg-slate-950/60 text-amber-300 font-bold min-w-[36px] cursor-pointer"
                    title={sigilZoom !== 1 ? "Click to reset (100%)" : "Zoom: 100%"}
                  >
                    {Math.round(sigilZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSigilZoom(prev => Math.min(2.5, Math.round((prev + 0.25) * 100) / 100));
                    }}
                    disabled={sigilZoom >= 2.5}
                    className="w-6 h-6 rounded flex items-center justify-center bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 disabled:opacity-30 cursor-pointer"
                    title="Zoom In (+)"
                    aria-label="Zoom In"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {sigilZoom !== 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSigilZoom(1);
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-pointer"
                      title="Reset Zoom"
                      aria-label="Reset Zoom"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <svg
                  id="sacredHeptagramSymbol"
                  ref={svgRef}
                  viewBox={`${(500 - 500 / sigilZoom) / 2} ${(500 - 500 / sigilZoom) / 2} ${500 / sigilZoom} ${500 / sigilZoom}`}
                  className={`w-full h-full relative z-20 overflow-visible select-none touch-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
              <defs>
                {/* Vintage paper parchment texture elements */}
                <filter id="sigil-glow-filter" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation={glowPower / 12} result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="flame-glowing" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feColorMatrix type="matrix" values={activeProfile.feColorMatrixValues} />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                {/* Red/Amber flame gradients */}
                <linearGradient id="orange-flame-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#bf360c" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ff5722" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff9800" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="yellow-flame-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#e65100" />
                  <stop offset="60%" stopColor="#ffb300" />
                  <stop offset="100%" stopColor="#ffee58" stopOpacity="0" />
                </linearGradient>

                {/* Metallic/Gold shiny color style definition */}
                <linearGradient id="gold-metallic-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b58d3d" />
                  <stop offset="25%" stopColor="#e5c158" />
                  <stop offset="50%" stopColor="#fdf0a6" />
                  <stop offset="75%" stopColor="#e5c158" />
                  <stop offset="100%" stopColor="#b58d3d" />
                </linearGradient>

                {/* Spiritus Gradients */}
                <linearGradient id="spiritus-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="spiritus-flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="spiritus-flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="60%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0" />
                </linearGradient>

                {/* Ignis Gradients */}
                <linearGradient id="ignis-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="ignis-flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="ignis-flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="60%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>

                {/* Aqua Gradients */}
                <linearGradient id="aqua-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="aqua-flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="aqua-flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0369a1" />
                  <stop offset="60%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#e0f7fa" stopOpacity="0" />
                </linearGradient>

                {/* Aer Gradients */}
                <linearGradient id="aer-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="aer-flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="aer-flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="60%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
                </linearGradient>

                {/* Materia Gradients */}
                <linearGradient id="materia-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="materia-flame-gradient-1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="materia-flame-gradient-2" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="60%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>

                <style>{`
                  @keyframes flicker {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.95; }
                    50% { transform: scale(1.15) rotate(1deg); opacity: 0.8; }
                  }
                  @keyframes slowspin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .flame-element {
                    transform-origin: center;
                    animation: flicker 1.8s ease-in-out infinite alternate;
                  }
                  .flame-element:nth-child(even) {
                    animation-delay: 0.4s;
                  }
                  .flicker-text {
                    font-family: 'Cinzel', 'Playfair Display', 'Times New Roman', serif;
                    font-weight: 600;
                    letter-spacing: 1px;
                    transition: fill 0.8s ease-in-out, stroke 0.8s ease-in-out, opacity 0.8s ease-in-out;
                  }
                `}</style>
              </defs>

              {/* Interactive Compass Tick Ring around the rim */}
              <g opacity={isDragging ? 0.95 : 0.45} className="transition-opacity duration-300 pointer-events-none">
                <circle cx={center} cy={center} r="195" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1" strokeDasharray="2,4" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const deg = i * 30;
                  const rad = (deg * Math.PI) / 180 - Math.PI / 2;
                  const tx1 = center + 190 * Math.cos(rad);
                  const ty1 = center + 190 * Math.sin(rad);
                  const tx2 = center + 200 * Math.cos(rad);
                  const ty2 = center + 200 * Math.sin(rad);
                  return (
                    <line
                      key={`tick-${deg}`}
                      x1={tx1}
                      y1={ty1}
                      x2={tx2}
                      y2={ty2}
                      stroke={deg % 90 === 0 ? "#D4AF37" : "rgba(255,255,255,0.35)"}
                      strokeWidth={deg % 90 === 0 ? "2" : "1"}
                    />
                  );
                })}
              </g>

              {/* Master Rotation Group */}
              <g 
                style={{
                  transformOrigin: '250px 250px',
                  transform: `rotate(${userRotationAngle}deg)`,
                  animation: (rotationSpeed > 0 && !isDragging) ? `slowspin ${40 / rotationSpeed}s linear infinite` : 'none',
                  transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                
                {/* 1. Primary Outer circle border */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={activeProfile.id === 'none' ? activeTheme.textAccentHex : activeProfile.color}
                  strokeWidth="2.5"
                  strokeDasharray="none"
                  className="transition-all duration-1000 ease-in-out"
                  style={{ 
                    filter: isIgnited ? 'url(#sigil-glow-filter)' : 'none'
                  }}
                />

                {/* 2. Concentric inner circle for sacred text confinement */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius - 12}
                  fill="none"
                  stroke={activeProfile.id === 'none' ? activeTheme.textAccentHex : activeProfile.color}
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                  opacity="0.65"
                  className="transition-all duration-1000 ease-in-out"
                />

                {/* Star Layer Group */}
                <g
                  style={{
                    transformOrigin: '250px 250px',
                    transform: `rotate(${starRotationAngle}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* 3. The main Heptagram (7-point star) drawing lines */}
                  {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                    const prof = ELEMENT_PROFILES[elKey];
                    const isActive = activeElementKey === elKey;
                    return (
                      <path
                        key={elKey}
                        d={getStarPath()}
                        fill="none"
                        stroke={prof.id === 'none' ? activeTheme.textAccentHex : `url(#${prof.gradientId})`}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-opacity duration-1000 ease-in-out"
                        style={{ 
                          opacity: isActive ? 1 : 0,
                          filter: isIgnited ? 'url(#sigil-glow-filter)' : 'none'
                        }}
                      />
                    );
                  })}

                  {/* 4. Center Concentric circle ring around 76 */}
                  <circle
                    cx={center}
                    cy={center}
                    r="30"
                    fill="rgba(10,8,6,0.85)"
                    stroke={activeProfile.id === 'none' ? activeTheme.textAccentHex : activeProfile.color}
                    strokeWidth="1.5"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {/* 5. Center-aligned numeric code 76 */}
                  <text
                    x={center}
                    y={center + 6.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="17px"
                    fontWeight="bold"
                    fontFamily="'Fira Code', 'Courier New', monospace"
                    letterSpacing="-0.5px"
                    className="transition-all duration-1000 ease-in-out"
                    style={{ 
                      fill: activeProfile.id === 'none' ? '#ffffff' : activeProfile.color
                    }}
                  >
                    76
                  </text>

                  {/* 7. Internal designations Left: J (י) at 9 o'clock and B (ב) at 3 o'clock */}
                  <g transform={`translate(${center - radius + 20}, ${center})`}>
                    <rect x="-10" y="-12" width="20" height="20" rx="3" fill="#1b170f" opacity="0.8" />
                    {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                      const prof = ELEMENT_PROFILES[elKey];
                      const isActive = activeElementKey === elKey;
                      return (
                        <text
                          key={`vert-j-${elKey}`}
                          textAnchor="middle"
                          fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                          fontSize="13px"
                          fontWeight="bold"
                          fontFamily="serif"
                          className="transition-opacity duration-1000 ease-in-out"
                          style={{ opacity: isActive ? 1 : 0 }}
                        >
                          {getLabel('j')}
                        </text>
                      );
                    })}
                  </g>

                  <g transform={`translate(${center + radius - 20}, ${center})`}>
                    <rect x="-10" y="-12" width="20" height="20" rx="3" fill="#1b170f" opacity="0.8" />
                    {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                      const prof = ELEMENT_PROFILES[elKey];
                      const isActive = activeElementKey === elKey;
                      return (
                        <text
                          key={`vert-b-${elKey}`}
                          textAnchor="middle"
                          fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                          fontSize="13px"
                          fontWeight="bold"
                          fontFamily="serif"
                          className="transition-opacity duration-1000 ease-in-out"
                          style={{ opacity: isActive ? 1 : 0 }}
                        >
                          {getLabel('b')}
                        </text>
                      );
                    })}
                  </g>

                  {/* Radiating Sefirot Vertex Labels */}
                  {vertices.map((v, i) => {
                    const sefirot = [
                      { hebrew: 'כֶּתֶר', name: 'Kether' },
                      { hebrew: 'חָכְמָה', name: 'Chokhmah' },
                      { hebrew: 'בִּינָה', name: 'Binah' },
                      { hebrew: 'חֶסֶד', name: 'Chesed' },
                      { hebrew: 'גְּבוּרָה', name: 'Gevurah' },
                      { hebrew: 'תִּפְאֶרֶת', name: 'Tiferet' },
                      { hebrew: 'יְסוֹד', name: 'Yesod' }
                    ];
                    
                    const sefirah = sefirot[i % 7];
                    const dx = v.x - center;
                    const dy = v.y - center;
                    const angleRad = Math.atan2(dy, dx);
                    let angleDeg = (angleRad * 180) / Math.PI;
                    
                    const textRadius = 24;
                    const tx = v.x + Math.cos(angleRad) * textRadius;
                    const ty = v.y + Math.sin(angleRad) * textRadius;

                    let rotDeg = angleDeg;
                    let textAnch = "start";
                    
                    if (angleDeg > 90 || angleDeg < -90) {
                      rotDeg += 180;
                      textAnch = "end";
                    }

                    return (
                      <text
                        key={`sefirah-${i}`}
                        transform={`translate(${tx}, ${ty}) rotate(${rotDeg})`}
                        textAnchor={textAnch as "start" | "end"}
                        fill="rgba(212, 175, 55, 0.55)"
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none select-none transition-all duration-300"
                        style={{ fontFamily: 'Georgia, serif', letterSpacing: '1px' }}
                      >
                        {sefirah.hebrew} {sefirah.name}
                      </text>
                    );
                  })}
                </g>

                {/* Flames Layer Group */}
                <g
                  style={{
                    transformOrigin: '250px 250px',
                    transform: `rotate(${flameRotationAngle}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* 6. Dynamic Prominent Clock hour flames at outer rim coordinates */}
                  {isIgnited && (Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                    const prof = ELEMENT_PROFILES[elKey];
                    const isActive = activeElementKey === elKey;
                    return (
                      <g
                        key={`flames-group-${elKey}`}
                        className="transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
                      >
                        {hours.map(({ hour, x, y, angleDeg }) => (
                          <g 
                            key={`flame-hr-${elKey}-${hour}`} 
                            transform={`translate(${x}, ${y}) rotate(${angleDeg})`}
                            className="flame-element"
                          >
                            <path
                              d="M -5,12 C -18,12 -12,-5 0,-15 C 12,-5 18,12 5,12 Z"
                              fill={prof.color}
                              opacity="0.18"
                              filter="url(#flame-glowing)"
                            />
                            <path
                              d="M -4.5,10 C -12,10 -10,-4 0,-12 C 10,-4 12,10 4.5,10 Z"
                              fill={`url(#${prof.flameGrad1})`}
                              opacity="0.85"
                            />
                            <path
                              d="M -2.5,8 C -7,8 -6,-1 0,-7 C 6,-1 7,8 2.5,8 Z"
                              fill={`url(#${prof.flameGrad2})`}
                              opacity="0.95"
                            />
                          </g>
                        ))}
                      </g>
                    );
                  })}
                </g>

                {/* 8. Just above the center inside the circle top text -> YAHWEH (יהוה) */}
                <g transform={`translate(${center}, ${center - radius + 30})`}>
                  {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                    const prof = ELEMENT_PROFILES[elKey];
                    const isActive = activeElementKey === elKey;
                    return (
                      <text
                        key={`yahweh-${elKey}`}
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                        fontSize="13px"
                        fontFamily="serif"
                        fontWeight="bold"
                        className="flicker-text transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        {getLabel('yahweh')}
                      </text>
                    );
                  })}
                </g>

                {/* 9. Inside the circle bottom text -> Lucifer (לוציפר) */}
                <g transform={`translate(${center}, ${center + radius - 20})`}>
                  {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                    const prof = ELEMENT_PROFILES[elKey];
                    const isActive = activeElementKey === elKey;
                    return (
                      <text
                        key={`lucifer-${elKey}`}
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                        fontSize="12px"
                        fontFamily="serif"
                        fontWeight="bold"
                        className="flicker-text transition-opacity duration-1000 ease-in-out"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        {getLabel('lucifer')}
                      </text>
                    );
                  })}
                </g>

              </g>

              {/* Outside elements that remain static to align exactly with requested furthest directions */}
              
              {/* 10. Highest Top place: APOCALYPSE (אפוקליפסה) and Azrael (עזראל) under it */}
              <g transform={`translate(${center}, 35)`}>
                {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                  const prof = ELEMENT_PROFILES[elKey];
                  const isActive = activeElementKey === elKey;
                  return (
                    <g key={`apoc-${elKey}`} className="transition-opacity duration-1000 ease-in-out pointer-events-none" style={{ opacity: isActive ? 1 : 0 }}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={prof.id === 'none' ? '#ffffff' : prof.color}
                        fontSize="14px"
                        fontWeight="bold"
                        className="flicker-text"
                        letterSpacing="1.5px"
                        filter={isIgnited ? 'url(#sigil-glow-filter)' : 'none'}
                      >
                        {getLabel('apocalypse')}
                      </text>
                      <text
                        x="0"
                        y="15"
                        textAnchor="middle"
                        fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                        fontSize="10.5px"
                        fontFamily="serif"
                        fontWeight="bold"
                        letterSpacing="1px"
                        className="flicker-text"
                      >
                        {getLabel('azrael')}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* 11. Furthest Bottom place: APOCRYPHON (אפוקריפון) */}
              <g transform={`translate(${center}, 475)`}>
                {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                  const prof = ELEMENT_PROFILES[elKey];
                  const isActive = activeElementKey === elKey;
                  return (
                    <text
                      key={`apocryphon-${elKey}`}
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill={prof.id === 'none' ? '#ffffff' : prof.color}
                      fontSize="14px"
                      fontWeight="bold"
                      className="flicker-text transition-opacity duration-1000 ease-in-out"
                      letterSpacing="2px"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {getLabel('apocryphon')}
                    </text>
                  );
                })}
              </g>

              {/* 12. Furthest Left place: APOLLYON (אפוליון) and Glory (כבוד) */}
              <g transform={`translate(${center - radius - 15}, 240)`}>
                {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                  const prof = ELEMENT_PROFILES[elKey];
                  const isActive = activeElementKey === elKey;
                  return (
                    <g key={`apollyon-${elKey}`} className="transition-opacity duration-1000 ease-in-out pointer-events-none" style={{ opacity: isActive ? 1 : 0 }}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="end"
                        fill={prof.id === 'none' ? '#ffffff' : prof.color}
                        fontSize="12px"
                        fontWeight="bold"
                        className="flicker-text"
                        letterSpacing="1px"
                      >
                        {getLabel('apollyon')}
                      </text>
                      <text
                        x="0"
                        y="20"
                        textAnchor="end"
                        fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                        fontSize="11px"
                        fontFamily="serif"
                        fontWeight="medium"
                        letterSpacing="0.5px"
                      >
                        {languageMode === 'hebrew' ? 'כבוד' : languageMode === 'english' ? 'GLORY' : 'כבוד (GLORY)'}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* 13. Furthest Right place: LIFEAFTERDEATH (חיים לאחר המוות) and Power (כוח) */}
              <g transform={`translate(${center + radius + 15}, 240)`}>
                {(Object.keys(ELEMENT_PROFILES) as (keyof typeof ELEMENT_PROFILES)[]).map(elKey => {
                  const prof = ELEMENT_PROFILES[elKey];
                  const isActive = activeElementKey === elKey;
                  return (
                    <g key={`lifeafterdeath-${elKey}`} className="transition-opacity duration-1000 ease-in-out pointer-events-none" style={{ opacity: isActive ? 1 : 0 }}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="start"
                        fill={prof.id === 'none' ? '#ffffff' : prof.color}
                        fontSize="11px"
                        fontWeight="bold"
                        className="flicker-text"
                        letterSpacing="1px"
                      >
                        {getLabel('lifeafterdeath')}
                      </text>
                      <text
                        x="0"
                        y="20"
                        textAnchor="start"
                        fill={prof.id === 'none' ? 'url(#gold-metallic-glow)' : `url(#${prof.gradientId})`}
                        fontSize="11.5px"
                        fontFamily="serif"
                        fontWeight="medium"
                        letterSpacing="0.5px"
                      >
                        {languageMode === 'hebrew' ? 'כוח' : languageMode === 'english' ? 'POWER' : 'כוח (POWER)'}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* 14. Interactive Hover Zones for Clock hour flames */}
              {isIgnited && hours.map(({ hour, x, y }) => {
                const category = getCategoryForHour(hour);
                const metricVal = mysticalMetrics?.find(m => m.subject.toLowerCase() === category.toLowerCase())?.value;
                const finalVal = (metricVal !== undefined && metricVal !== 0) ? metricVal : ((hour * 7) % 10 + 1);
                
                return (
                  <circle
                    key={`hover-zone-${hour}`}
                    cx={x}
                    cy={y}
                    r={22}
                    fill="transparent"
                    className="cursor-pointer pointer-events-auto"
                    onMouseEnter={() => {
                      setHoveredFlame({
                        hour,
                        category,
                        value: finalVal,
                        x,
                        y
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredFlame(null);
                    }}
                  />
                );
              })}
            </svg>
            </>
            )}

            {/* Real-time Bilingual Calligraphic Hover Tooltip */}
            {hoveredFlame && (
              <div 
                className="absolute z-30 pointer-events-auto bg-black/95 border border-[#D4AF37]/45 px-3.5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.25)] text-slate-100 flex flex-col gap-1 w-48 transition-all duration-300"
                style={{
                  left: `${(hoveredFlame.x / 500) * 100}%`,
                  top: `${(hoveredFlame.y / 500) * 100}%`,
                  transform: `translate(${hoveredFlame.x < 150 ? '10%' : hoveredFlame.x > 350 ? '-110%' : '-50%'}, ${hoveredFlame.y < 120 ? '20%' : '-115%'})`
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-serif font-bold tracking-wider text-amber-300">
                    {React.createElement(ELEMENT_ICONS[hoveredFlame.category], { className: "w-3.5 h-3.5 text-amber-400" })}
                    <span>{hoveredFlame.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-serif text-[#D4AF37] opacity-80">
                      {hoveredFlame.category === 'Spiritus' ? 'רוחני' :
                       hoveredFlame.category === 'Ignis' ? 'אש' :
                       hoveredFlame.category === 'Aqua' ? 'מים' :
                       hoveredFlame.category === 'Aer' ? 'אוויר' :
                       hoveredFlame.category === 'Materia' ? 'חומר' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredFlame(null);
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        setHoveredFlame(null);
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Dismiss tooltip"
                      aria-label="Dismiss tooltip"
                    >
                      <X className="w-3 h-3 text-slate-300 hover:text-amber-300" />
                    </button>
                  </div>
                </div>
                
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Aetheric Hour:</span>
                  <span className="text-amber-200">Hour {hoveredFlame.hour}</span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Resonance Level:</span>
                  <span className="text-white font-bold">{hoveredFlame.value} / 10</span>
                </div>

                {/* Progress bar visualizer */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${hoveredFlame.value * 10}%` }}
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
        </>
      )}

    </div>
  );
}
