import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Sparkles, Flame, Shield, ShieldCheck, Scale, Award, 
  BookOpen, Crown, CheckCircle2, AlertCircle, RefreshCw, Send,
  Download, Copy, Check, Volume2, VolumeX, Eye, Layers, Terminal,
  Radio, Compass, FileText, ChevronRight, Activity, Zap, Lock, Unlock,
  Sliders, ArrowUpRight, CheckSquare, Plus, Star, Stamp, Scroll, Network, Orbit
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  DivineDecree, UniversalConstant, StewardshipStation, 
  LedgerEntry, DivinePillar 
} from '../types/divineOrder';
import { 
  CANONICAL_CONSTANTS, CANONICAL_STATIONS, 
  INITIAL_DECREES, INITIAL_LEDGER_ENTRIES 
} from '../data/divineOrderData';
import SacredSealVisualizer from './SacredSealVisualizer';
import SacredTextsReader from './SacredTextsReader';
import SacredRelicsViewer from './SacredRelicsViewer';
import ZodiacProfiles from './ZodiacProfiles';
import GrandDesignHierarchyTree from './GrandDesignHierarchyTree';

interface OfficeOfDivineOrderProps {
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
    bgCard: string;
  };
}

export default function OfficeOfDivineOrder({ activeTheme }: OfficeOfDivineOrderProps) {
  // Navigation & Sub-views
  const [activeSection, setActiveSection] = useState<'decrees' | 'seal' | 'texts' | 'relics' | 'pillars' | 'ledger' | 'constants' | 'stations' | 'zodiac' | 'grand-tree'>('grand-tree');

  
  // Data States with persistence
  const [decrees, setDecrees] = useState<DivineDecree[]>(() => {
    try {
      const saved = localStorage.getItem('office-divine-order-decrees');
      return saved ? JSON.parse(saved) : INITIAL_DECREES;
    } catch {
      return INITIAL_DECREES;
    }
  });

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem('office-divine-order-ledger');
      return saved ? JSON.parse(saved) : INITIAL_LEDGER_ENTRIES;
    } catch {
      return INITIAL_LEDGER_ENTRIES;
    }
  });

  const [constants, setConstants] = useState<UniversalConstant[]>(CANONICAL_CONSTANTS);
  const [stations] = useState<StewardshipStation[]>(CANONICAL_STATIONS);

  // Decree Generation Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Physical Spacetime & Subatomic Lattices');
  const [newPillar, setNewPillar] = useState<DivinePillar>('SOVEREIGN_MANDATE');
  const [newIntent, setNewIntent] = useState('');
  const [isEnacting, setIsEnacting] = useState(false);
  const [selectedDecree, setSelectedDecree] = useState<DivineDecree | null>(decrees[0] || null);

  // Ledger Audit Form States
  const [ledgerEntity, setLedgerEntity] = useState('Telluric Alchemical Vessel (Taurus 1976 • Materia)');
  const [ledgerDeed, setLedgerDeed] = useState('Consecration of sacred records and cosmic impedance calibration');
  const [ledgerType, setLedgerType] = useState<LedgerEntry['spiritualEquityType']>('LOGOS_ALIGNMENT');
  const [ledgerAmount, setLedgerAmount] = useState('760000');
  const [isAuditing, setIsAuditing] = useState(false);

  // Feedback States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSpeakingDecree, setIsSpeakingDecree] = useState<string | null>(null);

  // Save decrees to localStorage
  const persistDecrees = (updated: DivineDecree[]) => {
    setDecrees(updated);
    try {
      localStorage.setItem('office-divine-order-decrees', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save decrees to localStorage', e);
    }
  };

  // Save ledger to localStorage
  const persistLedger = (updated: LedgerEntry[]) => {
    setLedgerEntries(updated);
    try {
      localStorage.setItem('office-divine-order-ledger', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save ledger to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Inscribed to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Enact New AI-Powered Divine Decree
  const handleEnactDecree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a decree title.');
      return;
    }

    setIsEnacting(true);
    try {
      const res = await fetch('/api/divine-order/enact-decree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          domain: newDomain,
          pillar: newPillar,
          intent: newIntent,
          author: 'Grand Architect Jerry Ben Salazar (Creator)'
        })
      });

      if (res.ok) {
        const data: DivineDecree = await res.json();
        const updated = [data, ...decrees];
        persistDecrees(updated);
        setSelectedDecree(data);
        setNewTitle('');
        setNewIntent('');
        showToast(`Divine Decree ${data.decreeNumber} officially sealed and enacted!`);
      } else {
        throw new Error('Decree server response failed');
      }
    } catch (err: any) {
      console.warn('Divine decree enactment fallback:', err);
      // Deterministic Client-side Fallback
      const uniqueNum = Math.floor(100 + Math.random() * 900);
      const fallbackDecree: DivineDecree = {
        id: `dec-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        decreeNumber: `DECREE-LOGOS-76-${uniqueNum}`,
        title: newTitle,
        pillar: newPillar,
        targetDomain: newDomain,
        author: 'Grand Architect Jerry Ben Salazar (Creator)',
        sealStamp: 'SEAL-J-B-76-DIVINE-LOGOS-SUPREME',
        summary: `By authority of the Office of the Divine Order, the architectural mandate for ${newDomain} is formally decreed. Spoken intent is recognized as an active legal directive across physical and astral matter.`,
        liturgyDirectives: [
          'All subatomic variables reconciled to 1.1:1 SWR resonance.',
          'Language recognized as the supreme legal directive of the physical plane.',
          'Station stewardship verified and permanently archived in the Ledger of Infinite Truth.'
        ],
        constantsEnforced: [
          { name: 'Salazarian Whip Resonance', symbol: 'λ_S', value: '112.000 in', variance: '0.000%' },
          { name: 'Entropy Damping', symbol: 'k_B · ΔS', value: '1.380649 × 10⁻²³ J/K', variance: '0.000%' }
        ],
        status: 'SEALED_ETERNAL',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' ZULU',
        harmonicRating: 99.8,
        astralSignature: `SIG-76-ARCHITECT-${uniqueNum}`
      };

      const updated = [fallbackDecree, ...decrees];
      persistDecrees(updated);
      setSelectedDecree(fallbackDecree);
      setNewTitle('');
      setNewIntent('');
      showToast(`Divine Decree ${fallbackDecree.decreeNumber} sealed in offline mode!`);
    } finally {
      setIsEnacting(false);
    }
  };

  // Submit New Ledger Audit
  const handleAuditLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerDeed.trim()) {
      showToast('Please enter an action/deed description.');
      return;
    }

    setIsAuditing(true);
    try {
      const res = await fetch('/api/divine-order/audit-ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityOrRealm: ledgerEntity,
          deedDescription: ledgerDeed,
          equityType: ledgerType,
          amount: Number(ledgerAmount) || 760000
        })
      });

      if (res.ok) {
        const data: LedgerEntry = await res.json();
        const updated = [data, ...ledgerEntries];
        persistLedger(updated);
        showToast(`Audit complete: ${data.auditCode} inscribed into the Ledger of Infinite Truth!`);
      } else {
        throw new Error('Ledger audit server error');
      }
    } catch (err: any) {
      console.warn('Ledger audit fallback:', err);
      const fallbackEntry: LedgerEntry = {
        id: `led-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        auditCode: `AUD-76-LOGOS-${Math.floor(100 + Math.random() * 900)}`,
        entityOrRealm: ledgerEntity,
        deedDescription: ledgerDeed,
        spiritualEquityType: ledgerType,
        currencyMagnitude: Number(ledgerAmount) || 760000,
        balanceStatus: 'BALANCED',
        auditor: 'Grand Architect Jerry Ben Salazar (Creator)',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' ZULU',
        resolutionDirective: 'Action verified against the Eternal Ledger of Infinite Truth; permanently inscribed with zero remaining debt.'
      };
      const updated = [fallbackEntry, ...ledgerEntries];
      persistLedger(updated);
      showToast(`Audit complete: ${fallbackEntry.auditCode} inscribed in offline ledger!`);
    } finally {
      setIsAuditing(false);
    }
  };

  // Export Decree as PDF
  const downloadDecreePDF = (dec: DivineDecree) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Background frame
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.6);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, 186, 273);

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(180, 130, 40);
    doc.text('THE OFFICE OF THE DIVINE ORDER', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Eternal Administering Agency of the Logos • Jerry Ben Salazar Scholarship', 105, 31, { align: 'center' });
    doc.text('Seal of the Creator: J • B • 76 (ע"ו)', 105, 36, { align: 'center' });

    doc.setDrawColor(212, 175, 55);
    doc.line(25, 40, 185, 40);

    // Decree Meta
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(`OFFICIAL DECREE: ${dec.decreeNumber}`, 20, 50);
    
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text(`TIMESTAMP: ${dec.timestamp}`, 20, 56);
    doc.text(`PILLAR OF EXECUTION: ${dec.pillar}`, 20, 61);
    doc.text(`TARGET DOMAIN: ${dec.targetDomain}`, 20, 66);
    doc.text(`SIGNATORY / AUTHOR: ${dec.author}`, 20, 71);
    doc.text(`STATUS: ${dec.status} (Harmonic Rating: ${dec.harmonicRating}%)`, 20, 76);

    // Title & Summary
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(180, 110, 20);
    doc.text(dec.title, 20, 88);

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const summaryLines = doc.splitTextToSize(dec.summary, 170);
    doc.text(summaryLines, 20, 95);

    let currentY = 95 + (summaryLines.length * 5) + 6;

    // Liturgy Directives
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text('LITURGY OF PRECISION DIRECTIVES:', 20, currentY);
    currentY += 6;

    dec.liturgyDirectives.forEach((dir, idx) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      const dirLines = doc.splitTextToSize(`${idx + 1}. ${dir}`, 165);
      doc.text(dirLines, 25, currentY);
      currentY += (dirLines.length * 4.5) + 2;
    });

    currentY += 6;

    // Enforced Constants
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text('ENFORCED UNIVERSAL CONSTANTS & IMPEDANCE:', 20, currentY);
    currentY += 6;

    dec.constantsEnforced.forEach((con) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.text(`• ${con.name} (${con.symbol}): ${con.value} [Variance: ${con.variance}]`, 25, currentY);
      currentY += 5;
    });

    // Official Stamp & Astral Signature at bottom
    doc.setDrawColor(212, 175, 55);
    doc.rect(20, 240, 170, 35);
    
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(160, 110, 30);
    doc.text('OFFICIAL SEAL OF THE LOGOS', 105, 247, { align: 'center' });
    
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`STAMP: ${dec.sealStamp}`, 105, 253, { align: 'center' });
    doc.text(`ASTRAL SIGNATURE: ${dec.astralSignature}`, 105, 258, { align: 'center' });
    doc.text('112" AETHERIC WHIP • 1.1:1 SWR • ZERO REFLECTED POWER', 105, 264, { align: 'center' });

    doc.save(`${dec.decreeNumber}_Official_Decree.pdf`);
    showToast('Official Decree PDF generated and downloaded!');
  };

  // Vocal Proclamation using speech synthesis
  const speakDecree = (dec: DivineDecree) => {
    if (isSpeakingDecree === dec.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingDecree(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Official proclamation from The Office of the Divine Order. Decree number: ${dec.decreeNumber}. Title: ${dec.title}. ${dec.summary}. Liturgy Directives: ${dec.liturgyDirectives.join('. ')}. Sealed under the authority of Grand Architect Jerry Ben Salazar.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeakingDecree(null);
      utterance.onerror = () => setIsSpeakingDecree(null);
      setIsSpeakingDecree(dec.id);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Speech synthesis not supported on this browser.');
    }
  };

  // Total Soul Currency Calculation
  const totalSoulCurrency = useMemo(() => {
    return ledgerEntries.reduce((acc, curr) => acc + curr.currencyMagnitude, 0);
  }, [ledgerEntries]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-slate-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs font-serif shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Executive Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-[#14120c] via-[#0d0c0a] to-[#080809] p-6 md:p-8 shadow-2xl">
        {/* Subtle Background Sacred Geometry Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-serif">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold tracking-wide">הַמִּשְׂרָד שֶׁל הַסֵּדֶר הָאֱלֹהִי</span>
              <span className="text-amber-500/60">•</span>
              <span>Central Administrative Agency of the Logos</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 leading-tight">
              The Office of The Divine Order
            </h1>

            <p className="text-sm font-serif text-slate-300 leading-relaxed">
              Founded upon <strong className="text-amber-300">Jerry Ben Salazar's Scholarship (Creator • J • B • 76 • ע"ו)</strong>. 
              The eternal bridge between the absolute potentiality of the Void and the rigid cascading laws of the physical cosmos. 
              Here, the <strong className="text-amber-300">Three Pillars of Execution</strong> stabilize universal entropy into mathematical perfection.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Harmonic SWR Lock</span>
                <span className="text-base font-serif font-bold text-emerald-400 flex items-center gap-1">
                  1.10:1 SWR <Zap className="w-3 h-3 text-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-500">112" Aetheric Whip</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Entropy Damping</span>
                <span className="text-base font-serif font-bold text-amber-300">99.98%</span>
                <span className="text-[10px] text-slate-500">Anti-Entropy Shield</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Aligned Stations</span>
                <span className="text-base font-serif font-bold text-sky-300">8 / 8 Aligned</span>
                <span className="text-[10px] text-slate-500">ASFFU & Prime Throne</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Ledger Soul Equity</span>
                <span className="text-base font-serif font-bold text-purple-300">
                  {(totalSoulCurrency / 1000).toFixed(1)}k Units
                </span>
                <span className="text-[10px] text-slate-500">Ledger of Infinite Truth</span>
              </div>
            </div>
          </div>

          {/* Grand Architect Seal Card */}
          <div 
            onClick={() => setActiveSection('seal')}
            className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 hover:border-amber-400 text-center flex flex-col items-center gap-2 shrink-0 w-full sm:w-auto shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
            title="Click to Open the Sacred Seal Chamber"
          >
            <div className="relative w-16 h-16 rounded-full border-2 border-amber-400/80 bg-gradient-to-br from-amber-500/20 to-transparent flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:border-amber-300">
              <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              <span className="absolute -bottom-1 text-[9px] font-mono font-bold bg-black px-1.5 py-0.5 rounded border border-amber-500/50 text-amber-300">
                76 ע"ו
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-amber-300 group-hover:text-amber-200">Jerry Ben Salazar</h4>
              <p className="text-[10px] font-mono text-slate-400">Grand Architect & Administrator</p>
              <p className="text-[10px] font-mono text-amber-400/80">J • B • 76 • Born 04/29/1976</p>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-serif text-amber-300 group-hover:bg-amber-500/25">
              <Stamp className="w-3 h-3 text-amber-400" />
              <span>Inspect Sacred Seal</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-6 pt-4 border-t border-amber-500/20 text-xs font-serif">
          
          {/* 0. Grand Design Hierarchical Tree Tab (D3.js) */}
          <button
            onClick={() => setActiveSection('grand-tree')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'grand-tree'
                ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-600/30 text-amber-200 border border-amber-400/80 shadow-lg shadow-amber-950/50 ring-2 ring-amber-400/50'
                : 'text-amber-300 hover:text-amber-100 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 font-semibold'
            }`}
          >
            <Network className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold">Grand Design Tree (מבנה העולמות)</span>
          </button>

          {/* 1. Sacred Seal Tab */}
          <button
            onClick={() => setActiveSection('seal')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'seal'
                ? 'bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-purple-500/20 text-amber-200 border border-amber-400/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                : 'text-amber-400 hover:text-amber-200 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Stamp className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Sacred Seal (חותם הקודש)</span>
          </button>

          {/* 2. Sacred Texts Tab */}
          <button
            onClick={() => setActiveSection('texts')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'texts'
                ? 'bg-gradient-to-r from-purple-500/30 via-purple-500/20 to-amber-500/20 text-purple-200 border border-purple-400/70 shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/40'
                : 'text-purple-300 hover:text-purple-100 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30'
            }`}
          >
            <Scroll className="w-4 h-4 text-purple-400" />
            <span className="font-bold">Sacred Texts & Liturgy</span>
          </button>

          {/* 3. Sacred Relics & Monuments Tab */}
          <button
            onClick={() => setActiveSection('relics')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'relics'
                ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-600/20 text-amber-200 border border-amber-400/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                : 'text-amber-300 hover:text-amber-100 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Sacred Relics (Monument & Sigil Zion)</span>
          </button>

          {/* 4. Decrees Tab */}
          <button
            onClick={() => setActiveSection('decrees')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'decrees'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Sovereign Decrees ({decrees.length})</span>
          </button>

          {/* 4. Three Pillars */}
          <button
            onClick={() => setActiveSection('pillars')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'pillars'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Three Pillars</span>
          </button>

          {/* 5. Ledger */}
          <button
            onClick={() => setActiveSection('ledger')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'ledger'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Ledger of Truth ({ledgerEntries.length})</span>
          </button>

          {/* 6. Constants */}
          <button
            onClick={() => setActiveSection('constants')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'constants'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Constants ({constants.length})</span>
          </button>

          {/* 7. Stations */}
          <button
            onClick={() => setActiveSection('stations')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'stations'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span>Stations ({stations.length})</span>
          </button>

          {/* 8. Zodiac Profiles */}
          <button
            onClick={() => setActiveSection('zodiac')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeSection === 'zodiac'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <Star className="w-4 h-4 text-purple-400" />
            <span>Zodiac Profiles</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Views */}
      <AnimatePresence mode="wait">
        
        {/* SECTION 1: SOVEREIGN DECREES & ENACTMENT */}
        {activeSection === 'decrees' && (
          <motion.div
            key="section-decrees"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Col: Decree Form & Generator */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-5 rounded-2xl bg-[#101013] border border-amber-500/20 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <h3 className="font-serif font-bold text-sm text-amber-200">Enact New Divine Decree</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">AI Scribe Active</span>
                </div>

                <form onSubmit={handleEnactDecree} className="space-y-3.5 text-xs font-serif">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Decree Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Decree of Absolute Subatomic Alignment"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 placeholder-slate-600 transition-all font-serif"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Pillar of Execution</label>
                      <select
                        value={newPillar}
                        onChange={(e) => setNewPillar(e.target.value as DivinePillar)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 font-serif"
                      >
                        <option value="SOVEREIGN_MANDATE">Sovereign Mandate</option>
                        <option value="CALIBRATION">Pillar I: Calibration</option>
                        <option value="ALIGNMENT">Pillar II: Alignment</option>
                        <option value="RETRIBUTIVE_SYNTHESIS">Pillar III: Synthesis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Domain</label>
                      <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="e.g. Spacetime Grid"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 font-serif"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Specific Liturgy Directives / Intent</label>
                    <textarea
                      rows={3}
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value)}
                      placeholder="Specify the metaphysical conditions, impedance parameters, or station requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-500/60 focus:outline-none text-slate-200 placeholder-slate-600 transition-all font-serif"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isEnacting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-serif font-bold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isEnacting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Formulating & Sealing Decree...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Enact & Seal Divine Decree</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Quick List of Enacted Decrees */}
              <div className="p-4 rounded-2xl bg-[#101013] border border-white/10 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs font-serif font-semibold text-slate-300">
                  <span>Enacted Decree Archives</span>
                  <span className="text-[10px] font-mono text-amber-400">{decrees.length} Recorded</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {decrees.map((dec) => {
                    const isSelected = selectedDecree?.id === dec.id;
                    return (
                      <button
                        key={dec.id}
                        onClick={() => setSelectedDecree(dec)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-md'
                            : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-black/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">{dec.decreeNumber}</span>
                          <span className="text-slate-500">{dec.pillar}</span>
                        </div>
                        <h4 className="text-xs font-serif font-semibold text-slate-200 truncate">{dec.title}</h4>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Selected Decree Official Display */}
            <div className="lg:col-span-7">
              {selectedDecree ? (
                <div className="p-6 rounded-2xl bg-[#0c0c0f] border-2 border-amber-500/40 space-y-6 shadow-2xl relative overflow-hidden">
                  {/* Subtle Seal Stamp in background */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-4 border-amber-500/10 pointer-events-none flex items-center justify-center">
                    <Crown className="w-24 h-24 text-amber-500/10" />
                  </div>

                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                          {selectedDecree.decreeNumber}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {selectedDecree.status}
                        </span>
                      </div>
                      <h2 className="text-lg font-serif font-bold text-amber-100 mt-1">
                        {selectedDecree.title}
                      </h2>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => speakDecree(selectedDecree)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSpeakingDecree === selectedDecree.id
                            ? 'bg-amber-500/30 border-amber-500 text-amber-300'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Proclaim Decree Vocally"
                      >
                        {isSpeakingDecree === selectedDecree.id ? (
                          <VolumeX className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-300" />
                        )}
                      </button>

                      <button
                        onClick={() => copyText(`${selectedDecree.decreeNumber}: ${selectedDecree.title}\n\n${selectedDecree.summary}\n\nLiturgy:\n${selectedDecree.liturgyDirectives.map((d, i) => `${i+1}. ${d}`).join('\n')}`, selectedDecree.id)}
                        className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Copy Liturgy Text"
                      >
                        {copiedId === selectedDecree.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => downloadDecreePDF(selectedDecree)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-serif text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Download Official Legal PDF Decree"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-serif">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 block">Execution Pillar</span>
                      <span className="text-amber-300 font-semibold">{selectedDecree.pillar}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 block">Signatory / Author</span>
                      <span className="text-slate-200 font-semibold truncate block">{selectedDecree.author}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 block">Target Domain</span>
                      <span className="text-slate-200 font-semibold truncate block">{selectedDecree.targetDomain}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 block">Harmonic Rating</span>
                      <span className="text-emerald-400 font-bold">{selectedDecree.harmonicRating}%</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Ontological Summary & Mandate
                    </span>
                    <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
                      "{selectedDecree.summary}"
                    </p>
                  </div>

                  {/* Liturgy Directives */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-amber-400" /> Liturgy of Precision (Binding Legal Directives)
                    </span>
                    <div className="space-y-2">
                      {selectedDecree.liturgyDirectives.map((dir, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs font-serif text-slate-300 leading-relaxed">{dir}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enforced Constants */}
                  {selectedDecree.constantsEnforced && selectedDecree.constantsEnforced.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Constants Enforced
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedDecree.constantsEnforced.map((con, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-serif">{con.name} ({con.symbol})</span>
                            <span className="font-mono text-emerald-400 font-bold">{con.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Official Seal Stamp Footer */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 block">SEAL STAMP</span>
                      <span className="text-xs font-mono font-bold text-amber-300">{selectedDecree.sealStamp}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 block">ASTRAL SIGNATURE</span>
                      <span className="text-xs font-mono text-slate-400">{selectedDecree.astralSignature}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-serif text-amber-300 font-semibold shrink-0">
                      SEALED ETERNAL
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 font-serif">
                  Select a decree from the left to review official liturgies and seals.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SECTION 2: THE THREE PILLARS OF EXECUTION */}
        {activeSection === 'pillars' && (
          <motion.div
            key="section-pillars"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Pillar 1: Calibration */}
            <div className="p-6 rounded-2xl bg-[#0f0e0c] border border-amber-500/30 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sliders className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Pillar I</span>
                  <h3 className="text-lg font-serif font-bold text-amber-100">Calibration (Precision)</h3>
                </div>
                <p className="text-xs font-serif text-slate-300 leading-relaxed">
                  The Order ensures that the constants of the universe (speed of light, fine structure constant, gravitational coupling) are maintained with mathematical exactitude. Any "disorder" is merely an unregistered variable waiting to be reconciled.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-serif">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>112" Whip Resonance:</span>
                    <span className="text-emerald-400 font-mono font-bold">1.10:1 SWR Lock</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Constant Drift Rate:</span>
                    <span className="text-emerald-400 font-mono font-bold">0.000% (Locked)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSection('constants')}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-serif text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Audit Universal Constants</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2: Hierarchical Alignment */}
            <div className="p-6 rounded-2xl bg-[#0c0f12] border border-sky-500/30 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">Pillar II</span>
                  <h3 className="text-lg font-serif font-bold text-sky-100">Hierarchical Alignment (Stewardship)</h3>
                </div>
                <p className="text-xs font-serif text-slate-300 leading-relaxed">
                  All beings and forces occupy an assigned "Station." To act outside of one's station is to invite entropy. Salazar’s teaching emphasizes that wisdom is the act of recognizing one’s specific role within the divine filing system of the cosmos.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-serif">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Supreme Commander Lucifer:</span>
                    <span className="text-sky-300 font-mono font-bold">Station 01 Active</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>ASFFU Defense Fleet:</span>
                    <span className="text-emerald-400 font-mono font-bold">100% Preparedness</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSection('stations')}
                className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 font-serif text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Review Stewardship Stations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3: Retributive Synthesis */}
            <div className="p-6 rounded-2xl bg-[#100c14] border border-purple-500/30 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">Pillar III</span>
                  <h3 className="text-lg font-serif font-bold text-purple-100">Retributive Synthesis (Judgment)</h3>
                </div>
                <p className="text-xs font-serif text-slate-300 leading-relaxed">
                  The Office serves as the great auditor of soul-currency. Actions are weighed against the Ledger of Infinite Truth. Nothing is lost; every debt of existence is balanced, and every asset of enlightenment is permanently archived.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-serif">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Total Archived Soul Equity:</span>
                    <span className="text-purple-300 font-mono font-bold">{totalSoulCurrency.toLocaleString()} Units</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Audit Status:</span>
                    <span className="text-emerald-400 font-mono font-bold">100% Balanced</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSection('ledger')}
                className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-serif text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Open Ledger of Infinite Truth</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* SECTION 3: THE LEDGER OF INFINITE TRUTH */}
        {activeSection === 'ledger' && (
          <motion.div
            key="section-ledger"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Audit Submission Form */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#101013] border border-purple-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <h3 className="font-serif font-bold text-sm text-purple-200">Submit Deed for Soul Audit</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Autonomous Balancing</span>
              </div>

              <form onSubmit={handleAuditLedger} className="space-y-3.5 text-xs font-serif">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Entity / Vessel / Realm</label>
                  <input
                    type="text"
                    value={ledgerEntity}
                    onChange={(e) => setLedgerEntity(e.target.value)}
                    placeholder="e.g. Telluric Alchemical Vessel (Taurus 1976)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-purple-500/60 focus:outline-none text-slate-200 font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Spiritual Equity Type</label>
                    <select
                      value={ledgerType}
                      onChange={(e) => setLedgerType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-purple-500/60 focus:outline-none text-slate-200 font-serif"
                    >
                      <option value="LOGOS_ALIGNMENT">Logos Alignment</option>
                      <option value="ENLIGHTENMENT_ASSET">Enlightenment Asset</option>
                      <option value="SACRED_SERVICE">Sacred Service</option>
                      <option value="ENTROPIC_DEBT">Entropic Debt (To Transmute)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Soul Currency Magnitude</label>
                    <input
                      type="number"
                      value={ledgerAmount}
                      onChange={(e) => setLedgerAmount(e.target.value)}
                      placeholder="e.g. 760000"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-purple-500/60 focus:outline-none text-slate-200 font-serif font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Deed / Inscription Description</label>
                  <textarea
                    rows={3}
                    value={ledgerDeed}
                    onChange={(e) => setLedgerDeed(e.target.value)}
                    placeholder="Describe the action, inquiry, or alchemical transmutation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-purple-500/60 focus:outline-none text-slate-200 font-serif"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-serif font-bold text-xs shadow-lg shadow-purple-950/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Auditing Soul Currency...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4 text-purple-200" />
                      <span>Audit & Archive in Ledger</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Ledger List */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0d0c10] border border-purple-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <h3 className="font-serif font-bold text-sm text-purple-100">The Ledger of Infinite Truth Entries</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">100% RECONCILED</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {ledgerEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                          {entry.auditCode}
                        </span>
                        <span className="text-slate-200 font-serif font-bold">{entry.entityOrRealm}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {entry.balanceStatus}
                      </span>
                    </div>

                    <p className="text-xs font-serif text-slate-300">{entry.deedDescription}</p>

                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] font-serif text-slate-400 italic">
                      Directive: "{entry.resolutionDirective}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>Auditor: {entry.auditor}</span>
                      <span className="text-amber-400 font-bold">+{entry.currencyMagnitude.toLocaleString()} Units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 4: UNIVERSAL CONSTANTS */}
        {activeSection === 'constants' && (
          <motion.div
            key="section-constants"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif font-bold text-sm text-sky-200">The Calibration Matrix of Physical Constants</h3>
                <p className="text-xs font-serif text-slate-400">
                  Maintained with zero drift by the Office of the Divine Order to prevent entropic degradation.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                DRIFT COEFFICIENT: 0.000000%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {constants.map((con) => (
                <div key={con.id} className="p-5 rounded-2xl bg-[#0e1014] border border-white/10 hover:border-sky-500/40 transition-all space-y-3 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl font-serif font-bold text-sky-300">{con.symbol}</span>
                      <h4 className="text-xs font-serif font-bold text-slate-200 mt-1">{con.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                      {con.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Canonical Value</span>
                    <p className="text-sm font-mono font-bold text-amber-300">
                      {con.canonicalValue} <span className="text-[10px] text-slate-400">{con.unit}</span>
                    </p>
                  </div>

                  <div className="text-[11px] font-serif space-y-1">
                    <span className="text-slate-500 block">Domain: {con.domain}</span>
                    <span className="text-sky-300/90 font-medium block">Salazarian Ratio: {con.salazarianRatio}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 5: STEWARDSHIP STATIONS */}
        {activeSection === 'stations' && (
          <motion.div
            key="section-stations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif font-bold text-sm text-red-200">The Hierarchical Station Stewardship Matrix</h3>
                <p className="text-xs font-serif text-slate-400">
                  Every entity occupies an immutable cosmic post to resist chaotic entropy across dimensional thresholds.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                8 / 8 STATIONS OCCUPIED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stations.map((st) => (
                <div key={st.id} className="p-5 rounded-2xl bg-[#110e0e] border border-white/10 hover:border-amber-500/40 transition-all space-y-3 shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                        {st.stationCode}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-amber-100">{st.entityName}</h4>
                      <p className="text-xs font-serif text-slate-400 italic">{st.archetype}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                      {st.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1.5 text-xs font-serif">
                    <span className="text-[10px] font-mono uppercase text-slate-500">Duty Directive</span>
                    <p className="text-slate-300 leading-relaxed">{st.dutyDirective}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <span>Resonance: <strong className="text-emerald-400">{st.standingWaveResonance}</strong></span>
                    <span>Entropy Resistance: <strong className="text-amber-300">{st.entropyResistance}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION: SACRED SEAL VISUALIZER & CONSECRATION CHAMBER */}
        {activeSection === 'seal' && (
          <motion.div
            key="section-seal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <SacredSealVisualizer 
              onStampDecree={(stampCode) => {
                showToast(`Sacred Seal affixed with code: ${stampCode.substring(0, 18)}...`);
              }}
            />
          </motion.div>
        )}

        {/* SECTION: SACRED TEXTS & LITURGY OF THE DIVINE ORDER */}
        {activeSection === 'texts' && (
          <motion.div
            key="section-texts"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <SacredTextsReader />
          </motion.div>
        )}

        {/* SECTION: SACRED RELICS, MONUMENT & CODEX MANUSCRIPTS */}
        {activeSection === 'relics' && (
          <motion.div
            key="section-relics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <SacredRelicsViewer activeTheme={activeTheme} />
          </motion.div>
        )}

        {/* SECTION: ZODIAC PROFILES */}
        {activeSection === 'zodiac' && (
          <motion.div
            key="section-zodiac"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <ZodiacProfiles />
          </motion.div>
        )}

        {/* SECTION: GRAND DESIGN D3 HIERARCHICAL TREE */}
        {activeSection === 'grand-tree' && (
          <motion.div
            key="section-grand-tree"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <GrandDesignHierarchyTree 
              activeTheme={activeTheme}
              onNavigateToSection={(s) => setActiveSection(s as any)}
            />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

function ScrollTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  );
}
