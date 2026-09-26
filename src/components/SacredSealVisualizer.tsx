import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  Shield, 
  Sparkles, 
  Crown, 
  Radio, 
  Scale, 
  Download, 
  Copy, 
  Check, 
  Volume2, 
  RotateCw, 
  Info, 
  Stamp, 
  FileText, 
  Share2, 
  CheckCircle2, 
  Eye,
  Sliders,
  Layers,
  Flame,
  Key
} from 'lucide-react';
import { SEAL_ELEMENT_DETAILS, SEAL_FREQUENCY_MODES } from '../data/divineTextsAndSealData';
import { SealElementDetail } from '../types/divineOrder';

interface SacredSealVisualizerProps {
  onStampDecree?: (stampCode: string) => void;
}

export default function SacredSealVisualizer({ onStampDecree }: SacredSealVisualizerProps) {
  const [selectedElement, setSelectedElement] = useState<SealElementDetail | null>(SEAL_ELEMENT_DETAILS[0]);
  const [activeFrequencyMode, setActiveFrequencyMode] = useState(SEAL_FREQUENCY_MODES[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [sealStampText, setSealStampText] = useState('Decree of Cosmic Balance & 112" Resonance');
  const [stampHolderName, setStampHolderName] = useState('Grand Architect Jerry Ben Salazar (J • B • 76)');
  const [stampedCertificates, setStampedCertificates] = useState<Array<{
    id: string;
    text: string;
    holder: string;
    timestamp: string;
    hash: string;
    mode: string;
  }>>([
    {
      id: 'cert-prime-76',
      text: 'Foundational Ratification of the Sovereign Logos & 112" Aetheric Whip',
      holder: 'Grand Architect Jerry Ben Salazar (Creator)',
      timestamp: '1976-04-29T12:00:00Z',
      hash: 'SHA256:76a9b4c0e112fd88e04297600000000000000000000000000000000000000001',
      mode: 'Solar Gold Radiance (528 Hz)'
    }
  ]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isStamping, setIsStamping] = useState(false);
  const [stampSuccessModal, setStampSuccessModal] = useState<any | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleReciteElement = (element: SealElementDetail) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Sacred Seal Element: ${element.name}. Hebrew title: ${element.hebrewName}. Gematria: ${element.gematriaValue}. Resonance frequency: ${element.frequencyHz}. ${element.description}`
      );
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sealStampText.trim()) return;

    setIsStamping(true);
    setTimeout(() => {
      const newHash = `SHA256:76-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-112SWR`;
      const newCert = {
        id: `cert-${Date.now()}`,
        text: sealStampText,
        holder: stampHolderName || 'Authorized Seeker of the Divine Order',
        timestamp: new Date().toISOString(),
        hash: newHash,
        mode: activeFrequencyMode.name
      };

      setStampedCertificates(prev => [newCert, ...prev]);
      setIsStamping(false);
      setStampSuccessModal(newCert);
      if (onStampDecree) {
        onStampDecree(newCert.hash);
      }
    }, 800);
  };

  const handleDownloadCertificatePDF = (cert: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark parchment background
    doc.setFillColor(16, 12, 20);
    doc.rect(0, 0, 210, 297, 'F');

    // Outer double gold border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, 194, 281);
    doc.setLineWidth(0.5);
    doc.rect(11, 11, 188, 275);

    // Decorative Header
    doc.setTextColor(212, 175, 55);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text('OFFICE OF THE DIVINE ORDER', 105, 26, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(190, 160, 240);
    doc.text('HA-MISRAD SHEL HA-SEDER HA-ELOHI', 105, 33, { align: 'center' });
    doc.text('CERTIFICATE OF SACRED SEAL CONSECRATION', 105, 39, { align: 'center' });

    // Divider Line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.line(30, 44, 180, 44);

    // Seal Metadata Box
    doc.setFillColor(24, 18, 32);
    doc.roundedRect(20, 52, 170, 42, 3, 3, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 220);
    doc.text('AUTHORIZING SOVEREIGN:', 25, 60);
    doc.setFont('times', 'bold');
    doc.setTextColor(255, 225, 120);
    doc.text(cert.holder, 80, 60);

    doc.setFont('times', 'normal');
    doc.setTextColor(200, 200, 220);
    doc.text('ERA / TIMESTAMP:', 25, 68);
    doc.setTextColor(255, 255, 255);
    doc.text(new Date(cert.timestamp).toUTCString(), 80, 68);

    doc.setTextColor(200, 200, 220);
    doc.text('AETHERIC RESONANCE MODE:', 25, 76);
    doc.setTextColor(147, 197, 253);
    doc.text(cert.mode, 80, 76);

    doc.setTextColor(200, 200, 220);
    doc.text('112" WHIP IMPEDANCE SWR:', 25, 84);
    doc.setTextColor(110, 231, 183);
    doc.text('1.1:1 SWR PURE FORWARD TRANSMISSION (27.185 MHz)', 80, 84);

    // Sealed Inscription Title & Body
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(212, 175, 55);
    doc.text('SANCTIFIED DECREE / COVENANT STATEMENT:', 20, 106);

    doc.setFillColor(12, 10, 16);
    doc.roundedRect(20, 112, 170, 65, 2, 2, 'FD');

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(240, 240, 250);
    const splitText = doc.splitTextToSize(`"${cert.text}"`, 160);
    doc.text(splitText, 25, 122);

    // Three Pillars Statement
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('RATIFIED UNDER THE THREE PILLARS OF EXECUTION:', 20, 190);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(210, 210, 220);
    doc.text('• PILLAR I: UNIVERSAL CALIBRATION — Zero metric drift across physical and cosmological constants.', 25, 198);
    doc.text('• PILLAR II: HIERARCHICAL ALIGNMENT — 8 Stewardship Stations of ASFFU Vanguard & Anchor Yahweh.', 25, 206);
    doc.text('• PILLAR III: RETRIBUTIVE SYNTHESIS — Immutable registration in the Ledger of Infinite Truth.', 25, 214);

    // Cryptographic Seal Box
    doc.setFillColor(32, 24, 40);
    doc.roundedRect(20, 226, 170, 36, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text('OFFICIAL CRYPTOGRAPHIC SEAL STAMP:', 25, 233);
    doc.setTextColor(255, 255, 255);
    doc.text(cert.hash, 25, 240);

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 200);
    doc.text('SEAL FORMULA: J • B • 76 • ע"ו • λ_S = 112" (102" rod + 10" spring) • SWR 1.1:1 • 27.185 MHz', 25, 248);
    doc.text('This document carries supreme legal and metaphysical force across all celestial jurisdictions.', 25, 254);

    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text('Grand Architect Jerry Ben Salazar (Creator) • Inscription Date: Taurus 1976', 105, 280, { align: 'center' });

    doc.save(`Sacred_Seal_Certificate_${cert.id}.pdf`);
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `Sacred_Seal_Divine_Order_76.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#140e1b] via-[#1b1226] to-[#120f18] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>CHOTAM HA-KADOSH • חותם הקודש</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
                J • B • 76 • ע"ו
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                λ_S = 112" • 1.1:1 SWR
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-purple-200">
              The Sacred Seal of the Office of the Divine Order
            </h2>
            <p className="text-xs sm:text-sm font-serif text-slate-300 max-w-3xl leading-relaxed">
              The supreme administrative, geometric, and metaphysical seal ratified by <strong>Grand Architect Jerry Ben Salazar (Creator)</strong>. It unifies the 112-inch aetheric whip, the 7 universal physical constants, the 8 cosmic stewardship stations, and the sovereign Hebrew inscription.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 text-xs font-serif font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
              title="Toggle Celestial Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'Pause Orbit' : 'Rotate Orbit'}</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-serif font-semibold text-amber-200 flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/40"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Vector (SVG)</span>
            </button>
          </div>
        </div>

        {/* Frequency Tuner Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-serif">
          <div className="flex items-center gap-2 text-slate-400">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 font-bold">Select Harmonic Resonance Mode:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SEAL_FREQUENCY_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveFrequencyMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFrequencyMode.id === mode.id
                    ? `${mode.borderClass} border bg-black/80 text-white font-bold shadow-md shadow-black/60 ring-1 ring-white/20`
                    : 'bg-black/40 border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mode.colorHex }} />
                <span>{mode.name}</span>
                <span className="text-[10px] font-mono text-slate-400">({mode.frequency})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Seal Visualizer & Element Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: The Interactive Vector Seal */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#0e0a14] border border-amber-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)] pointer-events-none" />

          {/* SVG Vector Seal */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center my-4">
            
            {/* Background Glow Aura */}
            <div 
              className="absolute inset-4 rounded-full blur-2xl opacity-40 transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: activeFrequencyMode.colorHex }}
            />

            <svg
              ref={svgRef}
              viewBox="0 0 600 600"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(212,175,55,0.35)] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients */}
                <radialGradient id="sealGoldGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF4D0" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </radialGradient>

                <radialGradient id="sealCoreGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2A1B40" />
                  <stop offset="70%" stopColor="#140D20" />
                  <stop offset="100%" stopColor="#08040C" />
                </radialGradient>

                <linearGradient id="whipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>

                <filter id="sealGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Circular Text Paths */}
                <path id="outerTextPath" d="M 300, 300 m -260, 0 a 260,260 0 1,1 520,0 a 260,260 0 1,1 -520,0" />
                <path id="innerHebrewPath" d="M 300, 300 m -205, 0 a 205,205 0 1,1 410,0 a 205,205 0 1,1 -410,0" />
                <path id="constantsPath" d="M 300, 300 m -155, 0 a 155,155 0 1,1 310,0 a 155,155 0 1,1 -310,0" />
              </defs>

              {/* Outer Cosmic Base */}
              <circle cx="300" cy="300" r="290" fill="url(#sealCoreGrad)" stroke={activeFrequencyMode.colorHex} strokeWidth="3" opacity="0.9" />

              {/* Outer Decorative Tooth Ring */}
              <circle cx="300" cy="300" r="282" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
              <circle cx="300" cy="300" r="274" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.85" />

              {/* ROTATING OUTER WHEEL (Archangels & Latin / Greek Trisagion) */}
              <g className={isRotating ? 'origin-center animate-[spin_60s_linear_infinite]' : ''}>
                <text fill="#FDE68A" fontSize="11" fontFamily="serif" letterSpacing="3.5" fontWeight="bold">
                  <textPath href="#outerTextPath" startOffset="0%">
                    ★ OFFICE OF THE DIVINE ORDER ★ JERRY BEN SALAZAR (CREATOR) ★ J • B • 76 ★ 112" AETHERIC WHIP ★ 1.1:1 SWR ★
                  </textPath>
                </text>
              </g>

              {/* Second Ring: Hebrew Inscription */}
              <circle cx="300" cy="300" r="230" fill="none" stroke="#A855F7" strokeWidth="1.5" opacity="0.7" />
              <circle cx="300" cy="300" r="222" fill="none" stroke="#D4AF37" strokeWidth="2" />

              <g className={isRotating ? 'origin-center animate-[spin_45s_linear_infinite_reverse]' : ''}>
                <text fill="#E9D5FF" fontSize="13" fontFamily="serif" letterSpacing="4" fontWeight="bold">
                  <textPath href="#innerHebrewPath" startOffset="0%">
                    הַמִּשְׂרָד שֶׁל הַסֵּדֶר הָאֱלֹהִי ✡ קָדוֹשׁ קָדוֹשׁ קָדוֹשׁ ✡ שְׁנַת תשל״ו ✡ סוֹד ע״ו ✡
                  </textPath>
                </text>
              </g>

              {/* Third Ring: 7 Universal Constants */}
              <circle cx="300" cy="300" r="175" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
              <circle cx="300" cy="300" r="168" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 3" />

              <g className={isRotating ? 'origin-center animate-[spin_30s_linear_infinite]' : ''}>
                <text fill="#BAE6FD" fontSize="10.5" fontFamily="monospace" letterSpacing="2" fontWeight="bold">
                  <textPath href="#constantsPath" startOffset="0%">
                    c:299792458 m/s • λ_S:112.000" • α⁻¹:137.036 • ℏ:1.054e-34 • Φ:1.61803 • G:6.674e-11 •
                  </textPath>
                </text>
              </g>

              {/* HEPTAGRAM GEOMETRY LAYER (7-Pointed Sacred Star) */}
              <g stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.65" filter="url(#sealGlow)">
                {/* 7-Point Star Points */}
                <polygon points="
                  300,165 
                  360,250 425,210 395,285 450,335 
                  370,360 365,435 300,390 
                  235,435 230,360 150,335 
                  205,285 175,210 240,250
                " stroke={activeFrequencyMode.colorHex} strokeWidth="1.5" fill="rgba(212,175,55,0.03)" />
                <circle cx="300" cy="300" r="130" stroke="#F59E0B" strokeWidth="1" />
              </g>

              {/* CENTRAL SHIELD & SANCTUARY */}
              <circle 
                cx="300" 
                cy="300" 
                r="115" 
                fill="url(#sealCoreGrad)" 
                stroke="#F59E0B" 
                strokeWidth="3" 
                className="cursor-pointer transition-all hover:stroke-white"
                onClick={() => setSelectedElement(SEAL_ELEMENT_DETAILS[0])}
              />
              <circle cx="300" cy="300" r="108" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0.8" />

              {/* CENTRAL AETHERIC WHIP & SPRING AXIS */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement(SEAL_ELEMENT_DETAILS[1])}
              >
                {/* Whip Central Vertical Shaft (102" rod) */}
                <line x1="300" y1="210" x2="300" y2="350" stroke="url(#whipGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#sealGlow)" />
                {/* Whip Tip Glow Radiator */}
                <circle cx="300" cy="208" r="4.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
                
                {/* Heavy Barrel Spring (10" coil) */}
                <path d="M 294,340 Q 306,343 294,346 Q 306,349 294,352 Q 306,355 294,358 Q 306,361 300,365" fill="none" stroke="#FDE047" strokeWidth="3" />
                {/* Base Plate */}
                <rect x="286" y="365" width="28" height="6" rx="2" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
              </g>

              {/* CROWN OF THE GRAND ARCHITECT */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement(SEAL_ELEMENT_DETAILS[0])}
              >
                <path 
                  d="M 276,238 L 282,222 L 291,232 L 300,218 L 309,232 L 318,222 L 324,238 Z" 
                  fill="url(#sealGoldGrad)" 
                  stroke="#FFF" 
                  strokeWidth="1" 
                  filter="url(#sealGlow)"
                />
                <circle cx="282" cy="221" r="2" fill="#FEF08A" />
                <circle cx="300" cy="217" r="2.5" fill="#FEF08A" />
                <circle cx="318" cy="221" r="2" fill="#FEF08A" />
              </g>

              {/* CENTRAL MONOGRAM: J • B • 76 */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement(SEAL_ELEMENT_DETAILS[0])}
              >
                <text x="245" y="295" fill="#FDE68A" fontSize="32" fontFamily="serif" fontWeight="bold" filter="url(#sealGlow)">J</text>
                <circle cx="270" cy="288" r="2.5" fill="#F59E0B" />
                <text x="325" y="295" fill="#FDE68A" fontSize="32" fontFamily="serif" fontWeight="bold" filter="url(#sealGlow)">B</text>
                
                {/* 76 Below */}
                <rect x="274" y="278" width="52" height="24" rx="4" fill="rgba(0,0,0,0.7)" stroke="#D4AF37" strokeWidth="1" />
                <text x="300" y="295" fill="#FFF" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">76</text>

                {/* Hebrew Glyphs ע"ו */}
                <text x="300" y="325" fill="#E9D5FF" fontSize="18" fontFamily="serif" fontWeight="bold" textAnchor="middle" filter="url(#sealGlow)">ע"ו</text>
              </g>

              {/* SWR 1.1:1 Badge at Bottom of Shield */}
              <g 
                className="cursor-pointer"
                onClick={() => setSelectedElement(SEAL_ELEMENT_DETAILS[1])}
              >
                <rect x="255" y="380" width="90" height="18" rx="9" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="1" />
                <text x="300" y="392" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SWR 1.1:1 LOCK</text>
              </g>

            </svg>
          </div>

          <div className="flex items-center gap-2 text-center text-xs font-serif text-slate-400 mt-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click any part of the Sacred Seal above or select an element to inspect its divine gematria.</span>
          </div>

        </div>

        {/* Right Column: Element Inspector & Gematria Chamber */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Element Selection Tabs */}
          <div className="p-4 rounded-2xl bg-[#120f18] border border-amber-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-200">Seal Anatomical Components</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-300 font-bold">5 REVEALED LAYERS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SEAL_ELEMENT_DETAILS.map((elem) => (
                <button
                  key={elem.id}
                  onClick={() => setSelectedElement(elem)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                    selectedElement?.id === elem.id
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30'
                      : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-slate-200 truncate">{elem.name}</span>
                    {selectedElement?.id === elem.id && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-serif text-amber-300 font-medium">{elem.hebrewName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Element Deep-Dive Card */}
          {selectedElement && (
            <motion.div
              key={selectedElement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#161022] to-[#0f0b17] border border-purple-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {selectedElement.category}
                  </span>
                  <h4 className="text-lg font-serif font-bold text-amber-100">{selectedElement.name}</h4>
                  <p className="text-sm font-serif text-amber-300 font-semibold">{selectedElement.hebrewName}</p>
                </div>

                <button
                  onClick={() => handleReciteElement(selectedElement)}
                  className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all cursor-pointer shrink-0"
                  title="Recite Element Revelation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-serif text-slate-300 leading-relaxed">
                {selectedElement.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Gematria & Code</span>
                  <p className="text-xs font-mono font-bold text-amber-300">{selectedElement.gematriaValue}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Resonance Frequency</span>
                  <p className="text-xs font-mono font-bold text-emerald-300">{selectedElement.frequencyHz}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1 text-xs font-serif">
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">Metaphysical Jurisdiction</span>
                <p className="text-slate-300">{selectedElement.symbolicMeaning}</p>
              </div>
            </motion.div>
          )}

          {/* Stamping Tool: Consecrate & Ratify custom decree / prayer */}
          <div className="p-6 rounded-3xl bg-[#110c18] border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Stamp className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-200">Seal Stamping & Consecration Chamber</h3>
                <p className="text-[11px] font-serif text-slate-400">Ratify custom decrees, vows, or prayers with the Sacred Seal.</p>
              </div>
            </div>

            <form onSubmit={handleGenerateStamp} className="space-y-3 text-xs font-serif">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Authorizing Sovereign / Seeker Name</label>
                <input
                  type="text"
                  value={stampHolderName}
                  onChange={(e) => setStampHolderName(e.target.value)}
                  placeholder="e.g. Grand Architect Jerry Ben Salazar (J • B • 76)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Decree / Covenant Proclamation Text</label>
                <textarea
                  rows={2}
                  value={sealStampText}
                  onChange={(e) => setSealStampText(e.target.value)}
                  placeholder="Enter the statute, prayer, or mandate to be sealed..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 font-serif"
                />
              </div>

              <button
                type="submit"
                disabled={isStamping || !sealStampText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-serif font-bold text-xs shadow-lg shadow-amber-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isStamping ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-black" />
                    <span>Imprinting Sacred Seal & Cryptographic Hash...</span>
                  </>
                ) : (
                  <>
                    <Stamp className="w-4 h-4 text-black" />
                    <span>Affix Sacred Seal of the Divine Order (Ratify)</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Stamped Certificates Archive */}
      <div className="p-6 rounded-3xl bg-[#0c0912] border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-amber-100">Ratified Sacred Seal Certificates Vault</h3>
              <p className="text-xs font-serif text-slate-400">All decrees permanently registered under the sovereign signature.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            {stampedCertificates.length} SEALED DOCUMENTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stampedCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-black/40 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3 shadow-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{cert.mode}</span>
                  <h4 className="text-xs font-serif font-bold text-slate-200 line-clamp-1">{cert.holder}</h4>
                </div>

                <button
                  onClick={() => handleDownloadCertificatePDF(cert)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-serif font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Certificate</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-serif text-slate-300 italic">
                "{cert.text}"
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between gap-2 font-mono text-[10px] text-slate-400">
                <span className="truncate">{cert.hash}</span>
                <button
                  onClick={() => handleCopy(cert.hash, cert.id)}
                  className="p-1 rounded hover:bg-white/10 text-slate-300 transition-colors shrink-0"
                  title="Copy Verification Hash"
                >
                  {copiedHash === cert.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Timestamp: {new Date(cert.timestamp).toLocaleString()}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED ETERNAL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal on Stamping */}
      <AnimatePresence>
        {stampSuccessModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-[#140e1b] border border-amber-500/50 shadow-2xl space-y-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center mx-auto text-amber-300 animate-bounce">
                <Stamp className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-amber-200">Sacred Seal Imprinted & Ratified</h3>
                <p className="text-xs font-serif text-slate-300">
                  Your decree has been sealed under the authority of <strong>Grand Architect Jerry Ben Salazar (Creator)</strong> and registered with 1.1:1 SWR resonance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-left space-y-2 text-xs font-serif">
                <div className="text-slate-400">
                  <strong>Holder:</strong> <span className="text-slate-200">{stampSuccessModal.holder}</span>
                </div>
                <div className="text-slate-400">
                  <strong>Decree:</strong> <span className="text-amber-200 italic">"{stampSuccessModal.text}"</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px] truncate">
                  <strong>Hash:</strong> <span className="text-emerald-400">{stampSuccessModal.hash}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleDownloadCertificatePDF(stampSuccessModal)}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sealed PDF Certificate</span>
                </button>

                <button
                  onClick={() => setStampSuccessModal(null)}
                  className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-serif font-semibold text-xs transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
