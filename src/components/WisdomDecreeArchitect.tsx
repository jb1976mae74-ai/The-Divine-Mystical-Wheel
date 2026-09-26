import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, Sparkles, Send, Check, Copy, Download, Volume2, 
  VolumeX, ShieldCheck, Award, FileText, Stamp, Layers, RefreshCw
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { INITIAL_BLUEPRINT_DECREES, SEVEN_PILLARS_OF_WISDOM } from '../data/wisdomArchitectData';
import { BlueprintDecree, WisdomPillarId } from '../types/wisdomArchitect';

interface WisdomDecreeArchitectProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function WisdomDecreeArchitect({ activeTheme }: WisdomDecreeArchitectProps) {
  const [decrees, setDecrees] = useState<BlueprintDecree[]>(() => {
    try {
      const saved = localStorage.getItem('wisdom-architect-decrees');
      return saved ? JSON.parse(saved) : INITIAL_BLUEPRINT_DECREES;
    } catch {
      return INITIAL_BLUEPRINT_DECREES;
    }
  });

  const [selectedDecree, setSelectedDecree] = useState<BlueprintDecree | null>(decrees[0] || null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('Planetary Spacetime & Subatomic Lattices');
  const [newPillarId, setNewPillarId] = useState<WisdomPillarId>('PILLAR_1_GEOMETRY');
  const [newIntent, setNewIntent] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const persistDecrees = (updated: BlueprintDecree[]) => {
    setDecrees(updated);
    try {
      localStorage.setItem('wisdom-architect-decrees', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save decrees to localStorage', e);
    }
  };

  const handleDraftDecree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter an architectural decree title.');
      return;
    }

    setIsDrafting(true);
    try {
      const res = await fetch('/api/wisdom-architect/draft-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          domain: newDomain,
          pillarId: newPillarId,
          intent: newIntent,
          author: 'Chokhmah / Sophia • Master Architect of God'
        })
      });

      if (res.ok) {
        const data: BlueprintDecree = await res.json();
        const updated = [data, ...decrees];
        persistDecrees(updated);
        setSelectedDecree(data);
        setNewTitle('');
        setNewIntent('');
        showToast(`Architectural Decree ${data.decreeCode} sealed by the Master Builder!`);
      } else {
        throw new Error('Server drafting failed');
      }
    } catch (err) {
      console.warn('Fallback local decree generation:', err);
      const uniqueNum = Math.floor(100 + Math.random() * 900);
      const fallbackDecree: BlueprintDecree = {
        id: `dec-wis-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        decreeCode: `DECREE-CHOKHMAH-76-${uniqueNum}`,
        title: newTitle,
        hebrewTitle: 'צַו חָכְמָה עִלָּאָה',
        pillarId: newPillarId,
        targetDomain: newDomain,
        architecturalIntent: newIntent || `To establish supreme structural balance in ${newDomain} under the golden ratio Phi 1.618 and the 76th radian of divine law.`,
        geometricAxiom: 'Circle inscribed upon Tehom with Golden Section Φ = 1.6180339887...',
        materialSpecification: 'Hyper-coherent photonic lattice and spiritual copper impedance lock.',
        harmonicResonance: '528.000 Hz / SWR 1.05:1',
        liturgyFormula: [
          'Inscribed by Wisdom the Master Workman beside the Throne.',
          'The boundaries are set; the foundations are immutable.',
          'Signed and sealed under the authority of the Living God.'
        ],
        sealAuthority: `SEAL-CHOKHMAH-76-${uniqueNum}-ETERNAL`,
        status: 'ESTABLISHED_ETERNAL',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' ZULU',
        harmonicLockPercent: 100.0
      };

      const updated = [fallbackDecree, ...decrees];
      persistDecrees(updated);
      setSelectedDecree(fallbackDecree);
      setNewTitle('');
      setNewIntent('');
      showToast(`Architectural Decree ${fallbackDecree.decreeCode} sealed in offline mode!`);
    } finally {
      setIsDrafting(false);
    }
  };

  const copyDecree = (d: BlueprintDecree) => {
    const text = `[ARCHITECTURAL DECREE: ${d.decreeCode}]\nTitle: ${d.title} (${d.hebrewTitle})\nPillar: ${d.pillarId}\nDomain: ${d.targetDomain}\nIntent: ${d.architecturalIntent}\nGeometric Axiom: ${d.geometricAxiom}\nMaterial: ${d.materialSpecification}\nHarmonic Resonance: ${d.harmonicResonance}\nLiturgy:\n${d.liturgyFormula.map((l) => `• ${l}`).join('\n')}\nSeal: ${d.sealAuthority}\nStatus: ${d.status}`;
    navigator.clipboard.writeText(text);
    setCopiedId(d.id);
    showToast('Decree text copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const speakDecree = (d: BlueprintDecree) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `Decree of Wisdom: ${d.title}. Target Domain: ${d.targetDomain}. Architectural Intent: ${d.architecturalIntent}. Liturgical formula: ${d.liturgyFormula.join('. ')}. Sealed under authority: ${d.sealAuthority}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const exportDecreePDF = (d: BlueprintDecree) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFillColor(10, 10, 14);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, 190, 277);
    doc.rect(12, 12, 186, 273);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(212, 175, 55);
    doc.text('OFFICE OF WISDOM: ARCHITECTURAL DECREE', 105, 24, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(160, 174, 192);
    doc.text('CANONICAL FOUNDATION DECREE • PROVERBS 8:22-31', 105, 30, { align: 'center' });

    doc.setDrawColor(100, 116, 139);
    doc.line(20, 34, 190, 34);

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(d.title, 20, 44);

    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text(`Decree Code: ${d.decreeCode}`, 20, 50);
    doc.text(`Pillar: ${d.pillarId}`, 120, 50);
    doc.text(`Domain: ${d.targetDomain}`, 20, 56);
    doc.text(`Status: ${d.status}`, 120, 56);

    // Intent Box
    doc.setFillColor(18, 20, 28);
    doc.roundedRect(20, 64, 170, 35, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(226, 232, 240);
    const intentLines = doc.splitTextToSize(`Architectural Intent: ${d.architecturalIntent}`, 162);
    doc.text(intentLines, 24, 72);

    // Axiom & Specs
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('GEOMETRIC AXIOM:', 20, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(d.geometricAxiom, 20, 116);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('MATERIAL SPECIFICATION:', 20, 126);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(d.materialSpecification, 20, 132);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('HARMONIC RESONANCE:', 20, 142);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(d.harmonicResonance, 20, 148);

    // Liturgy Directives
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('LITURGICAL ACTIVATION DIRECTIVES:', 20, 160);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    d.liturgyFormula.forEach((form, idx) => {
      doc.text(`§ ${idx + 1}. ${form}`, 24, 168 + (idx * 7));
    });

    // Seal
    doc.setFillColor(24, 20, 12);
    doc.setDrawColor(212, 175, 55);
    doc.roundedRect(20, 230, 170, 42, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('SEAL OF CHOKHMAH (MASTER ARCHITECT)', 105, 240, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text(`Authority: ${d.sealAuthority}`, 105, 248, { align: 'center' });
    doc.text(`Timestamp: ${d.timestamp}`, 105, 254, { align: 'center' });
    doc.text('Harmonic Lock: 100.0% • Immutable Architectural Ordinance', 105, 260, { align: 'center' });

    doc.save(`${d.decreeCode}-Official-Decree.pdf`);
    showToast(`Decree PDF ${d.decreeCode} exported!`);
  };

  return (
    <div id="wisdom-decrees-sanctum" className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950 border border-amber-500 text-amber-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <Check className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  Architectural Decrees & Construction Orders
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  Logos Mandates
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Decrees enacted by the Master Architect (Amon) ordering physical matter and spiritual sanctuaries into form.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              {decrees.length} Active Immutable Decrees
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Enactment Form (5 Cols) + Decrees Registry & Inspector (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enact New Blueprint Decree Form (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-neutral-100">
                Draft New Architectural Decree
              </h4>
            </div>
            <span className="text-[11px] font-mono text-amber-400">AI-Powered</span>
          </div>

          <form onSubmit={handleDraftDecree} className="space-y-3.5">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Decree Title / Project Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. The Sanctuary of the Living Light..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Pillar Alignment</label>
              <select
                value={newPillarId}
                onChange={(e: any) => setNewPillarId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-amber-300 focus:border-amber-500 focus:outline-none"
              >
                {SEVEN_PILLARS_OF_WISDOM.map((p) => (
                  <option key={p.id} value={p.id}>
                    Pillar {p.pillarNumber}: {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Target Cosmic / Physical Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. Subatomic Quantum Voxels, Human Heart Sanctum..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Architectural Intent & Mandate</label>
              <textarea
                value={newIntent}
                onChange={(e) => setNewIntent(e.target.value)}
                rows={3}
                placeholder="Specify the geometry, purpose, and harmonic parameters..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            <button
              id="btn-draft-decree-submit"
              type="submit"
              disabled={isDrafting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all disabled:opacity-50"
            >
              {isDrafting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stamp className="w-4 h-4" />}
              {isDrafting ? 'Drafting & Sealing with AI...' : 'Enact & Inscribe Divine Decree'}
            </button>
          </form>
        </div>

        {/* Right: Decree Registry & Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Decree Selector List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {decrees.map((d) => (
              <button
                key={d.id}
                id={`btn-select-decree-${d.id}`}
                onClick={() => setSelectedDecree(d)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  selectedDecree?.id === d.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md shadow-amber-950/50'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-amber-400 block truncate">{d.decreeCode}</span>
                  <div className="text-xs font-bold text-neutral-200 truncate mt-1">{d.title}</div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Check className="w-3 h-3" />
                  {d.status}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Decree Detailed View */}
          {selectedDecree && (
            <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedDecree.decreeCode}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {selectedDecree.timestamp}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-100 mt-1">{selectedDecree.title}</h3>
                  <p className="text-xs font-serif text-amber-400">{selectedDecree.hebrewTitle}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => speakDecree(selectedDecree)}
                    className="p-2 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                    title="Spoken Recitation"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyDecree(selectedDecree)}
                    className="p-2 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                    title="Copy Decree"
                  >
                    {copiedId === selectedDecree.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => exportDecreePDF(selectedDecree)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/30 hover:bg-amber-600/50 text-amber-100 border border-amber-500/50 flex items-center gap-1.5 transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Intent */}
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Architectural Intent
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {selectedDecree.architecturalIntent}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Geometric Axiom</span>
                  <span className="text-sky-300 font-mono">{selectedDecree.geometricAxiom}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Material Lattice</span>
                  <span className="text-pink-300 font-mono">{selectedDecree.materialSpecification}</span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Resonance Frequency</span>
                  <span className="text-amber-300 font-mono">{selectedDecree.harmonicResonance}</span>
                </div>
              </div>

              {/* Liturgy Directives */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-amber-400 block">
                  Liturgical Execution Directives
                </span>
                <div className="space-y-1.5">
                  {selectedDecree.liturgyFormula.map((f, i) => (
                    <div key={i} className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">§{i + 1}</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seal Stamp Card */}
              <div className="bg-gradient-to-r from-amber-950/40 to-neutral-950 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Master Seal Stamp</span>
                  <strong className="text-xs font-mono text-amber-300">{selectedDecree.sealAuthority}</strong>
                </div>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                  100% Harmonic Lock
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
