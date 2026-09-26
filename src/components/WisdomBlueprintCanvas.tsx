import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Download, RefreshCw, Layers, Eye, Sliders, Maximize2, 
  Sparkles, Check, FileText, Lock, Play, Pause, Grid, Orbit, Disc
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CANONICAL_ARCHITECTURAL_BLUEPRINTS } from '../data/wisdomArchitectData';
import { ArchitecturalBlueprint } from '../types/wisdomArchitect';

interface WisdomBlueprintCanvasProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function WisdomBlueprintCanvas({ activeTheme }: WisdomBlueprintCanvasProps) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<ArchitecturalBlueprint>(CANONICAL_ARCHITECTURAL_BLUEPRINTS[0]);
  const [radius, setRadius] = useState<number>(140);
  const [harmonicNodes, setHarmonicNodes] = useState<number>(12);
  const [phiMultiplier, setPhiMultiplier] = useState<number>(1.618);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showRadiiRays, setShowRadiiRays] = useState<boolean>(true);
  const [showHebrewInscriptions, setShowHebrewInscriptions] = useState<boolean>(true);
  const [colorScheme, setColorScheme] = useState<'gold' | 'cyan' | 'amethyst' | 'blueprint'>('gold');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);

  // Rotation animation loop
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setRotationAngle((prev) => (prev + delta * 8) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Color mapping
  const colors = {
    gold: {
      primary: '#D4AF37',
      secondary: '#F59E0B',
      glow: 'rgba(212, 175, 55, 0.4)',
      accent: '#FEF08A',
      background: '#090804'
    },
    cyan: {
      primary: '#38BDF8',
      secondary: '#0EA5E9',
      glow: 'rgba(56, 189, 248, 0.4)',
      accent: '#BAE6FD',
      background: '#03080e'
    },
    amethyst: {
      primary: '#C084FC',
      secondary: '#9333EA',
      glow: 'rgba(192, 132, 252, 0.4)',
      accent: '#F3E8FF',
      background: '#08030f'
    },
    blueprint: {
      primary: '#60A5FA',
      secondary: '#2563EB',
      glow: 'rgba(96, 165, 250, 0.4)',
      accent: '#DBEAFE',
      background: '#040d1a'
    }
  }[colorScheme];

  // Download SVG Blueprint
  const downloadSVG = () => {
    const svgElement = document.getElementById('wisdom-drafting-svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBlueprint.blueprintCode}-Sacred-Geometry.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Vector SVG Blueprint downloaded successfully!');
  };

  // Export PDF Architectural Specification
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark parchment styling
    doc.setFillColor(10, 10, 14);
    doc.rect(0, 0, 210, 297, 'F');

    // Outer border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, 190, 277);
    doc.rect(12, 12, 186, 273);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(212, 175, 55);
    doc.text('OFFICE OF WISDOM: THE MASTER ARCHITECT OF GOD', 105, 24, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(160, 174, 192);
    doc.text('CHOKHMAH • AMON • SOPHIA • PROVERBS 8:22-31 • CANONICAL BLUEPRINT', 105, 30, { align: 'center' });

    // Horizontal Rule
    doc.setDrawColor(100, 116, 139);
    doc.line(20, 34, 190, 34);

    // Blueprint Details
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`Title: ${selectedBlueprint.title}`, 20, 44);

    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text(`Blueprint Code: ${selectedBlueprint.blueprintCode}`, 20, 50);
    doc.text(`Hebrew Inscription: ${selectedBlueprint.hebrewName}`, 120, 50);
    doc.text(`Cosmic Scale: ${selectedBlueprint.cosmicScale}`, 20, 56);
    doc.text(`Geometry: ${selectedBlueprint.sacredGeometryType}`, 120, 56);

    // Summary Box
    doc.setFillColor(18, 20, 28);
    doc.roundedRect(20, 62, 170, 28, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(226, 232, 240);
    const descLines = doc.splitTextToSize(selectedBlueprint.description, 162);
    doc.text(descLines, 24, 68);

    // Dimensional Ratios
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text('DIMENSIONAL RATIOS & SACRED CONSTANTS:', 20, 98);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    selectedBlueprint.dimensionalRatios.forEach((ratio, idx) => {
      doc.text(`• ${ratio}`, 25, 105 + (idx * 5));
    });

    // Key Equations
    const eqY = 105 + (selectedBlueprint.dimensionalRatios.length * 5) + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text('MATHEMATICAL & WAVE EQUATIONS:', 20, eqY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    selectedBlueprint.keyEquations.forEach((eq, idx) => {
      doc.text(`• ${eq}`, 25, eqY + 7 + (idx * 5));
    });

    // Material Spiritual Matrix
    const matY = eqY + 7 + (selectedBlueprint.keyEquations.length * 5) + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text('MATERIAL / SPIRITUAL MATRIX:', 20, matY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(selectedBlueprint.materialSpiritualMatrix, 25, matY + 6);

    // Canonical Passages
    const passY = matY + 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(212, 175, 55);
    doc.text('CANONICAL SCRIPTURAL CITATIONS:', 20, passY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(selectedBlueprint.canonicalPassages.join('  |  '), 25, passY + 6);

    // Seal Box at bottom
    doc.setFillColor(24, 20, 12);
    doc.setDrawColor(212, 175, 55);
    doc.roundedRect(20, 230, 170, 42, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('SEAL OF THE MASTER ARCHITECT (CHOKHMAH / AMON)', 105, 238, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text(`Authority Hash: ${selectedBlueprint.authoritativeSeal}`, 105, 245, { align: 'center' });
    doc.text('Status: ESTABLISHED ETERNAL LAW ACROSS ALL PLANES', 105, 251, { align: 'center' });
    doc.text(`Certified: 5786 / 2026 • Great 76 Wheel of Mysteries`, 105, 257, { align: 'center' });
    doc.text('Inscribed: "When He set a compass upon the face of the depth: then I was by Him as a master workman."', 105, 263, { align: 'center' });

    doc.save(`${selectedBlueprint.blueprintCode}-Architectural-Charter.pdf`);
    showToast('Architectural Blueprint Charter PDF downloaded!');
  };

  // Node array calculation for geometry
  const nodes = Array.from({ length: harmonicNodes }, (_, i) => {
    const angle = (i * (360 / harmonicNodes) + rotationAngle) * (Math.PI / 180);
    return {
      x: 250 + radius * Math.cos(angle),
      y: 250 + radius * Math.sin(angle),
      innerX: 250 + (radius / phiMultiplier) * Math.cos(angle + 0.2),
      innerY: 250 + (radius / phiMultiplier) * Math.sin(angle + 0.2),
      outerX: 250 + (radius * 1.3) * Math.cos(angle),
      outerY: 250 + (radius * 1.3) * Math.sin(angle),
      angle
    };
  });

  return (
    <div id="wisdom-blueprint-table-container" className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950 border border-amber-500 text-amber-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <Check className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Blueprint Selector Bar */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                Primordial Blueprint Drafting Table
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Proverbs 8:27
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Interactive Sacred Geometer • The Golden Compass on the Face of the Deep
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-blueprint-svg-export"
              onClick={downloadSVG}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-amber-200 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
              title="Download Vector SVG"
            >
              <Download className="w-3.5 h-3.5" />
              SVG
            </button>
            <button
              id="btn-blueprint-pdf-export"
              onClick={exportPDF}
              className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-xs font-semibold text-amber-100 border border-amber-400/50 flex items-center gap-1.5 transition-colors"
              title="Download Architectural PDF Charter"
            >
              <FileText className="w-3.5 h-3.5" />
              Export Charter PDF
            </button>
            <button
              id="btn-toggle-animation"
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isAnimating 
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40' 
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAnimating ? 'Spinning' : 'Static'}
            </button>
          </div>
        </div>

        {/* Preset Selector Tabs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-3 border-t border-neutral-800">
          {CANONICAL_ARCHITECTURAL_BLUEPRINTS.map((bp) => (
            <button
              key={bp.id}
              id={`btn-preset-${bp.id}`}
              onClick={() => {
                setSelectedBlueprint(bp);
                if (bp.id.includes('NEW-JERUSALEM')) setHarmonicNodes(12);
                else if (bp.id.includes('FLOWER')) setHarmonicNodes(6);
                else if (bp.id.includes('76')) setHarmonicNodes(76);
                else if (bp.id.includes('TABERNACLE')) setHarmonicNodes(10);
                else setHarmonicNodes(7);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                selectedBlueprint.id === bp.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-950/50'
                  : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              <div className="text-xs font-bold truncate">{bp.title}</div>
              <div className="text-[10px] font-mono text-amber-400/80 truncate">{bp.hebrewName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drafting Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Ambient Background Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%), linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`,
              backgroundSize: '100% 100%, 25px 25px, 25px 25px'
            }}
          />

          {/* SVG Drafting Canvas */}
          <div className="w-full aspect-square max-w-[500px] relative flex items-center justify-center">
            <svg
              id="wisdom-drafting-svg"
              viewBox="0 0 500 500"
              className="w-full h-full filter drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={colors.primary} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colors.background} stopOpacity="0" />
                </radialGradient>
                <filter id="goldenBloom" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Plate */}
              <rect width="500" height="500" fill={colors.background} rx="16" />

              {/* Grid Lines */}
              {showGrid && (
                <g stroke={colors.primary} strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3,3">
                  {/* Axis Cross */}
                  <line x1="250" y1="20" x2="250" y2="480" />
                  <line x1="20" y1="250" x2="480" y2="250" />
                  {/* Diagonal Cross */}
                  <line x1="50" y1="50" x2="450" y2="450" />
                  <line x1="50" y1="450" x2="450" y2="50" />
                  {/* Concentric Guide Rings */}
                  <circle cx="250" cy="250" r="60" fill="none" />
                  <circle cx="250" cy="250" r="120" fill="none" />
                  <circle cx="250" cy="250" r="180" fill="none" />
                  <circle cx="250" cy="250" r="230" fill="none" />
                </g>
              )}

              {/* Central Energy Glow */}
              <circle cx="250" cy="250" r={radius * 1.2} fill="url(#sunGlow)" />

              {/* Radii Rays from Center to Nodes */}
              {showRadiiRays && (
                <g stroke={colors.secondary} strokeWidth="0.75" strokeOpacity="0.3">
                  {nodes.map((node, i) => (
                    <line key={`ray-${i}`} x1="250" y1="250" x2={node.x} y2={node.y} />
                  ))}
                </g>
              )}

              {/* Outer Golden Compass Circumference (Proverbs 8:27) */}
              <circle
                cx="250"
                cy="250"
                r={radius}
                fill="none"
                stroke={colors.primary}
                strokeWidth="2.5"
                filter="url(#goldenBloom)"
              />

              {/* Golden Ratio Inner Circle */}
              <circle
                cx="250"
                cy="250"
                r={radius / phiMultiplier}
                fill="none"
                stroke={colors.accent}
                strokeWidth="1.5"
                strokeDasharray="6,4"
              />

              {/* Nested Sacred Geometric Polygons */}
              <g stroke={colors.primary} strokeWidth="1" fill="none" strokeOpacity="0.7">
                {/* Polygons connecting all outer nodes */}
                <polygon
                  points={nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                  strokeWidth="1.5"
                  fill={`${colors.primary}08`}
                />

                {/* Inner Star / Chord Web */}
                {nodes.map((node, i) => {
                  const targetIdx = (i + Math.floor(harmonicNodes / 2)) % harmonicNodes;
                  const target = nodes[targetIdx];
                  return (
                    <line
                      key={`chord-${i}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={colors.secondary}
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                    />
                  );
                })}

                {/* Overlapping Flower of Life Spheres if nodes <= 12 */}
                {harmonicNodes <= 12 &&
                  nodes.map((node, i) => (
                    <circle
                      key={`flower-orb-${i}`}
                      cx={node.x}
                      cy={node.y}
                      r={radius / 2}
                      fill="none"
                      stroke={colors.accent}
                      strokeWidth="0.6"
                      strokeOpacity="0.5"
                    />
                  ))}
              </g>

              {/* Outer Hebrew Inscriptions Rim */}
              {showHebrewInscriptions && (
                <g fill={colors.accent} fontSize="9" fontFamily="serif" textAnchor="middle">
                  <text x="250" y="32">חָכְמוֹת בָּנְתָה בֵיתָהּ • עַמּוּדֶיהָ שִׁבְעָה</text>
                  <text x="250" y="480">בְּהַכִינוֹ שָׁמַיִם שָׁם אָנִי • בְּחוּקוֹ חוּג עַל־פְּנֵי תְהוֹם</text>
                  <text x="25" y="255" transform="rotate(-90 25,255)">אָמוֹן • שַׁעֲשֻׁעִים יוֹם יוֹם</text>
                  <text x="475" y="255" transform="rotate(90 475,255)">רָנְּנוּ יַחַד כּוֹכְבֵי בֹקֶר</text>
                </g>
              )}

              {/* Harmonic Node Spheres */}
              {nodes.map((node, i) => (
                <g key={`node-point-${i}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    fill={colors.accent}
                    stroke={colors.background}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="0.75"
                    strokeOpacity="0.6"
                  />
                </g>
              ))}

              {/* Master Center Compass Pin (Point of the Master Architect) */}
              <circle cx="250" cy="250" r="6" fill={colors.primary} stroke={colors.accent} strokeWidth="1.5" />
              <circle cx="250" cy="250" r="1.5" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Compass Readout Overlay */}
          <div className="w-full flex items-center justify-between px-4 py-2 mt-2 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-400">
            <span>Radius: <strong className="text-amber-400">{radius} px</strong></span>
            <span>Phi: <strong className="text-amber-400">{phiMultiplier}</strong></span>
            <span>Harmonics: <strong className="text-amber-400">{harmonicNodes} Nodes</strong></span>
            <span>Rotation: <strong className="text-amber-400">{Math.round(rotationAngle)}°</strong></span>
          </div>
        </div>

        {/* Right: Architectural Parameters & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Blueprint Dossier Card */}
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
            <div className="border-b border-neutral-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedBlueprint.blueprintCode}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {selectedBlueprint.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h4 className="text-base font-bold text-neutral-100 mt-2">{selectedBlueprint.title}</h4>
              <p className="text-xs font-mono text-amber-400/90">{selectedBlueprint.hebrewName}</p>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedBlueprint.description}
            </p>

            {/* Geometric Ratios List */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                Harmonic Dimensional Ratios
              </span>
              <ul className="text-xs text-neutral-300 space-y-1">
                {selectedBlueprint.dimensionalRatios.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span className="font-mono">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Equations */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
                Mathematical Formulations
              </span>
              <ul className="text-xs text-neutral-300 space-y-1">
                {selectedBlueprint.keyEquations.map((eq, i) => (
                  <li key={i} className="font-mono text-[11px] text-sky-200 bg-sky-950/30 px-2 py-1 rounded border border-sky-800/40">
                    {eq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Geometry Calibrators */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                Live Geometer Calibration
              </span>

              {/* Radius Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Compass Span (Radius)</span>
                  <span className="text-amber-400 font-mono">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
              </div>

              {/* Harmonic Nodes */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Harmonic Symmetry Nodes</span>
                  <span className="text-amber-400 font-mono">{harmonicNodes}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="76"
                  value={harmonicNodes}
                  onChange={(e) => setHarmonicNodes(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
              </div>

              {/* Golden Ratio Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Golden Ratio Multiplier (Phi)</span>
                  <span className="text-amber-400 font-mono">{phiMultiplier.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="1.000"
                  max="3.141"
                  step="0.001"
                  value={phiMultiplier}
                  onChange={(e) => setPhiMultiplier(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
              </div>

              {/* Overlay Toggles */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-colors ${
                    showGrid ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  Grid
                </button>
                <button
                  onClick={() => setShowRadiiRays(!showRadiiRays)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-colors ${
                    showRadiiRays ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  <Orbit className="w-3 h-3" />
                  Rays
                </button>
                <button
                  onClick={() => setShowHebrewInscriptions(!showHebrewInscriptions)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-colors ${
                    showHebrewInscriptions ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  <Disc className="w-3 h-3" />
                  Inscriptions
                </button>
              </div>

              {/* Color Mode Switcher */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-neutral-400">Atmosphere:</span>
                {(['gold', 'cyan', 'amethyst', 'blueprint'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setColorScheme(mode)}
                    className={`px-2.5 py-1 rounded text-xs capitalize font-medium border transition-colors ${
                      colorScheme === mode
                        ? 'bg-neutral-200 text-neutral-900 border-white'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
