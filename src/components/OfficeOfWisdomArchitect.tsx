import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Compass, Scale, Music, Scroll, MessageSquareQuote, 
  Sparkles, Download, FileText, ShieldCheck, Award, Layers, Crown, Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import WisdomBlueprintCanvas from './WisdomBlueprintCanvas';
import SevenPillarsSanctum from './SevenPillarsSanctum';
import DivineMetrologyWorkbench from './DivineMetrologyWorkbench';
import MorningStarSynthesizer from './MorningStarSynthesizer';
import WisdomDecreeArchitect from './WisdomDecreeArchitect';
import SophiaOracleSanctum from './SophiaOracleSanctum';
import DeepResearchSanctum from './DeepResearchSanctum';
import { SEVEN_PILLARS_OF_WISDOM, CANONICAL_ARCHITECTURAL_BLUEPRINTS } from '../data/wisdomArchitectData';

interface OfficeOfWisdomArchitectProps {
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

export default function OfficeOfWisdomArchitect({ activeTheme }: OfficeOfWisdomArchitectProps) {
  const [activeTab, setActiveTab] = useState<'pillars' | 'blueprint' | 'metrology' | 'symphony' | 'decrees' | 'oracle' | 'deep-research'>('pillars');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Export Complete Master Charter of Wisdom (PDF)
  const exportMasterCharterPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page 1: Cover & Master Foundations
    doc.setFillColor(10, 10, 14);
    doc.rect(0, 0, 210, 297, 'F');

    // Golden Borders
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.0);
    doc.rect(10, 10, 190, 277);
    doc.rect(12, 12, 186, 273);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text('THE OFFICE OF WISDOM', 105, 30, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('THE MASTER ARCHITECT OF GOD (CHOKHMAH / AMON / SOPHIA)', 105, 38, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(160, 174, 192);
    doc.text('PROVERBS 8:22-31 • PROVERBS 9:1 • JOB 38:4-7 • ISAIAH 40:12 • WISDOM 7:22-30', 105, 45, { align: 'center' });

    doc.setDrawColor(100, 116, 139);
    doc.line(20, 50, 190, 50);

    // Opening Liturgical Exegesis Box
    doc.setFillColor(20, 18, 12);
    doc.setDrawColor(212, 175, 55);
    doc.roundedRect(20, 56, 170, 36, 3, 3, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(245, 230, 180);
    doc.setFont('times', 'italic');
    const introQuote = [
      '"The LORD possessed me in the beginning of his way, before his works of old.',
      'When he prepared the heavens, I was there: when he set a compass upon the face of the depth:',
      'When he established the clouds above: when he strengthened the fountains of the deep:',
      'Then I was by him, as one brought up with him (Amon / Master Architect):',
      'and I was daily his delight, rejoicing always before him." — Proverbs 8:22, 27, 30'
    ];
    doc.text(introQuote, 25, 63);

    // Section 1: The Seven Hewn Pillars
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55);
    doc.text('THE SEVEN HEWN PILLARS OF CREATION (PROVERBS 9:1)', 20, 102);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);

    SEVEN_PILLARS_OF_WISDOM.forEach((p, idx) => {
      const y = 110 + (idx * 21);
      doc.setFillColor(18, 20, 28);
      doc.roundedRect(20, y - 4, 170, 18, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.text(`Pillar ${p.pillarNumber}: ${p.title} (${p.hebrewName})`, 24, y + 1);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`Function: ${p.architecturalFunction}`, 24, y + 6);
      doc.text(`Proof: ${p.geometricProof}  |  Acoustic Resonator: ${p.frequencyHz} Hz  |  Integrity: 100%`, 24, y + 11);
    });

    // Master Seal Box at Bottom of Page 1
    doc.setFillColor(24, 20, 12);
    doc.setDrawColor(212, 175, 55);
    doc.roundedRect(20, 260, 170, 22, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 55);
    doc.text('SUPREME SEAL OF THE MASTER WORKMAN (AMON)', 105, 267, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text('SEAL-CHOKHMAH-76-DIVINE-LOGOS-FOUNDATION • CERTIFIED IMMUTABLE', 105, 274, { align: 'center' });

    doc.save('Office-of-Wisdom-Master-Architect-Charter.pdf');
    showToast('Master Architectural Charter PDF downloaded!');
  };

  return (
    <div id="office-of-wisdom-master-sanctum" className="w-full space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950 border border-amber-500 text-amber-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <Check className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Flagship Office Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Background Subtle Geometer Motif */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full text-amber-400 fill-current animate-spin" style={{ animationDuration: '120s' }}>
            <polygon points="100,10 120,70 185,70 135,110 155,170 100,130 45,170 65,110 15,70 80,70" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold border border-amber-500/40 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                OFFICE OF DIVINE WISDOM (CHOKHMAH)
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30">
                Amon • Master Architect of God
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                Proverbs 8:22-31 • Proverbs 9:1
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              The Office of Wisdom: The Master Architect of God
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
              "The Lord possessed me in the beginning of His way... When He set a compass upon the face of the depth, then I was by Him as a master workman." Inscribe the blueprints of creation, calibrate the Seven Pillars of Wisdom, inspect cosmic scales, and consult the primordial architect.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-export-master-charter"
              onClick={exportMasterCharterPDF}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/60 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Master Charter (PDF)
            </button>
          </div>
        </div>

        {/* Sanctum Sub-Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mt-8 pt-6 border-t border-neutral-800">
          <button
            id="tab-wisdom-pillars"
            onClick={() => setActiveTab('pillars')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'pillars'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'pillars' ? 'text-black' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs">The Seven Pillars</div>
              <div className={`text-[10px] ${activeTab === 'pillars' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                Proverbs 9:1
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-blueprint"
            onClick={() => setActiveTab('blueprint')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'blueprint'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeTab === 'blueprint' ? 'text-black' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs">Blueprint Geometer</div>
              <div className={`text-[10px] ${activeTab === 'blueprint' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                Proverbs 8:27
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-metrology"
            onClick={() => setActiveTab('metrology')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'metrology'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Scale className={`w-4 h-4 ${activeTab === 'metrology' ? 'text-black' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs">Cosmic Scales</div>
              <div className={`text-[10px] ${activeTab === 'metrology' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                Isaiah 40:12
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-symphony"
            onClick={() => setActiveTab('symphony')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'symphony'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Music className={`w-4 h-4 ${activeTab === 'symphony' ? 'text-black' : 'text-purple-400'}`} />
            <div>
              <div className="text-xs">Morning Stars</div>
              <div className={`text-[10px] ${activeTab === 'symphony' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                Job 38:7
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-decrees"
            onClick={() => setActiveTab('decrees')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'decrees'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Scroll className={`w-4 h-4 ${activeTab === 'decrees' ? 'text-black' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs">Decrees & Orders</div>
              <div className={`text-[10px] ${activeTab === 'decrees' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                Logos Mandates
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-oracle"
            onClick={() => setActiveTab('oracle')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'oracle'
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg shadow-amber-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <MessageSquareQuote className={`w-4 h-4 ${activeTab === 'oracle' ? 'text-black' : 'text-amber-400'}`} />
            <div>
              <div className="text-xs">Sophia Oracle</div>
              <div className={`text-[10px] ${activeTab === 'oracle' ? 'text-neutral-900' : 'text-neutral-400'}`}>
                AI Architect
              </div>
            </div>
          </button>

          <button
            id="tab-wisdom-deep-research"
            onClick={() => setActiveTab('deep-research')}
            className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
              activeTab === 'deep-research'
                ? 'bg-purple-500 text-black font-bold border-purple-400 shadow-lg shadow-purple-950/60'
                : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'deep-research' ? 'text-black' : 'text-purple-400'}`} />
            <div>
              <div className="text-xs">Deep Research</div>
              <div className={`text-[10px] ${activeTab === 'deep-research' ? 'text-neutral-900' : 'text-purple-400'}`}>
                Antigravity Agent
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'pillars' && (
          <motion.div
            key="panel-pillars"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <SevenPillarsSanctum activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'blueprint' && (
          <motion.div
            key="panel-blueprint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <WisdomBlueprintCanvas activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'metrology' && (
          <motion.div
            key="panel-metrology"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <DivineMetrologyWorkbench activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'symphony' && (
          <motion.div
            key="panel-symphony"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <MorningStarSynthesizer activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'decrees' && (
          <motion.div
            key="panel-decrees"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <WisdomDecreeArchitect activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'oracle' && (
          <motion.div
            key="panel-oracle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <SophiaOracleSanctum activeTheme={activeTheme} />
          </motion.div>
        )}

        {activeTab === 'deep-research' && (
          <motion.div
            key="panel-deep-research"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <DeepResearchSanctum activeTheme={activeTheme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
