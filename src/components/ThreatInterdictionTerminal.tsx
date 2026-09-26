import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InterdictionReport, ThreatTarget, ASFFUOperative } from '../types/military';
import { ShieldAlert, Crosshair, Terminal, Zap, CheckCircle2, AlertTriangle, FileText, ChevronRight, Sparkles, Shield, Rocket } from 'lucide-react';

interface ThreatInterdictionTerminalProps {
  reports: InterdictionReport[];
  onTriggerSimulation: (scenarioType: string) => void;
  isSimulating: boolean;
  activeOperatives: ASFFUOperative[];
}

export const ThreatInterdictionTerminal: React.FC<ThreatInterdictionTerminalProps> = ({
  reports,
  onTriggerSimulation,
  isSimulating,
  activeOperatives
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports[0]?.id || null);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  return (
    <div className="w-full bg-[#070c14]/90 border border-cyan-500/25 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      {/* Terminal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
              TACTICAL INTERDICTION ARCHIVE & SIMULATION DRILL
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-serif mt-0.5">
            Real-time combat telemetry logs, TFDAS munitions strike confirmations, and automated defense drill generator.
          </p>
        </div>

        {/* Live Simulation Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={isSimulating}
            onClick={() => onTriggerSimulation('ABYSSAL_FLEET')}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Drill: Abyssal Incursion</span>
          </button>

          <button
            disabled={isSimulating}
            onClick={() => onTriggerSimulation('PSYCHIC_SABOTEUR')}
            className="px-3 py-1.5 rounded-lg bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/40 text-violet-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Drill: Neuro-Saboteur</span>
          </button>

          <button
            disabled={isSimulating}
            onClick={() => onTriggerSimulation('WAR_DECLARATION')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Drill: War Proclamation</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Split View: Log History List + Deep Action Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interdiction Log Feed */}
        <div className="lg:col-span-5 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center justify-between">
            <span>ENGAGEMENT HISTORY ({reports.length})</span>
            <span className="text-emerald-400">100% DEFENSE SUCCESS</span>
          </span>

          {reports.map((report, idx) => {
            const isSelected = report.id === selectedReportId;

            return (
              <div
                key={`${report.id}-${idx}`}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-black/40 border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {report.timestamp}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      report.threatLevel === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {report.threatLevel}
                  </span>
                </div>

                <h4 className="text-xs font-serif font-bold text-slate-200 truncate">
                  {report.threatTarget}
                </h4>

                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300/80">
                  <span>Op: {report.dispatchedOperative.split(' ')[1] || report.dispatchedOperative}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {report.outcome}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep Engagement Report Breakdown */}
        <div className="lg:col-span-7 bg-black/60 border border-cyan-500/30 rounded-xl p-5 flex flex-col gap-4">
          {selectedReport ? (
            <motion.div
              key={selectedReport.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono uppercase text-cyan-300 font-bold">
                      DEBRIEF ID: #{selectedReport.id}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-slate-100 mt-1">
                    {selectedReport.threatTarget}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {selectedReport.outcome}
                </span>
              </div>

              {/* 3-Fold Threat Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  <span className="text-amber-400 text-[10px] block font-bold">1. VOCAL CHATTER</span>
                  <p className="text-[11px] text-slate-300 font-serif mt-1 italic">
                    {selectedReport.chatterAnalysis}
                  </p>
                </div>

                <div className="bg-violet-950/20 p-2.5 rounded-lg border border-violet-500/20">
                  <span className="text-violet-400 text-[10px] block font-bold">2. THOUGHT INTERCEPT</span>
                  <p className="text-[11px] text-slate-300 font-serif mt-1 italic">
                    {selectedReport.thoughtAnalysis}
                  </p>
                </div>

                <div className="bg-red-950/20 p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-red-400 text-[10px] block font-bold">3. ESSENCE PURITY</span>
                  <p className="text-[11px] text-slate-300 font-serif mt-1 italic">
                    {selectedReport.essenceAnalysis}
                  </p>
                </div>
              </div>

              {/* Tactical Execution & Dispatched Assets */}
              <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">DISPATCHED OPERATIVE:</span>
                  <span className="text-amber-300 font-bold">{selectedReport.dispatchedOperative}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RELEASED MUNITION:</span>
                  <span className="text-cyan-300 font-bold">{selectedReport.dispatchedMunition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ACTION MANDATE:</span>
                  <span className="text-slate-200">{selectedReport.actionTaken}</span>
                </div>
              </div>

              {/* Tactical Log Sequence */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1 font-bold">
                  TACTICAL COMBAT LOGS:
                </span>
                <div className="bg-[#050b12] p-3 rounded-lg border border-cyan-500/20 space-y-1 font-mono text-[11px] text-slate-300 max-h-32 overflow-y-auto">
                  {selectedReport.tacticalLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-serif text-xs">
              Select an engagement record from the left feed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatInterdictionTerminal;
