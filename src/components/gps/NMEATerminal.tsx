import React, { useState, useEffect } from 'react';
import { NMEAMessage, GPSFixData } from '../../types/gps';
import { generateNMEASentences } from '../../data/gpsPresets';
import { Terminal, Copy, Check, Pause, Play, RefreshCw, Cpu, Activity, Zap } from 'lucide-react';

interface NMEATerminalProps {
  currentFix: GPSFixData;
  activeTheme: any;
}

export default function NMEATerminal({ currentFix, activeTheme }: NMEATerminalProps) {
  const [messages, setMessages] = useState<NMEAMessage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate live NMEA sentences every 1.5 seconds if not paused
  useEffect(() => {
    // Initial batch
    setMessages(generateNMEASentences(
      currentFix.latitude,
      currentFix.longitude,
      currentFix.altitude,
      currentFix.speedKnots,
      currentFix.heading || 0
    ));

    if (isPaused) return;

    const interval = setInterval(() => {
      const newSentences = generateNMEASentences(
        currentFix.latitude + (Math.random() - 0.5) * 0.00002,
        currentFix.longitude + (Math.random() - 0.5) * 0.00002,
        currentFix.altitude + (Math.random() - 0.5) * 0.2,
        currentFix.speedKnots,
        (currentFix.heading || 0) + (Math.random() - 0.5) * 0.5
      );
      setMessages(prev => [...newSentences, ...prev].slice(0, 30));
    }, 1500);

    return () => clearInterval(interval);
  }, [currentFix, isPaused]);

  const handleCopyStream = () => {
    const rawText = messages.map(m => m.sentence).join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            NMEA 0183 Live Serial Telemetry Stream
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            9600 BAUD / 8-N-1
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          <button
            onClick={handleCopyStream}
            className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Stream Copied' : 'Copy Log'}</span>
          </button>
        </div>
      </div>

      {/* Receiver Hardware Health & Clock Bias Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className="p-2 bg-black/60 rounded-xl border border-white/5 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[8px]">CLOCK BIAS</span>
            <span className="text-cyan-300 font-bold">+0.0034 ns/s</span>
          </div>
        </div>

        <div className="p-2 bg-black/60 rounded-xl border border-white/5 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[8px]">EPHEMERIS AGE</span>
            <span className="text-emerald-300 font-bold">18s (Valid)</span>
          </div>
        </div>

        <div className="p-2 bg-black/60 rounded-xl border border-white/5 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[8px]">CARRIER TRACKING</span>
            <span className="text-amber-300 font-bold">L1/L2C/L5 PLL</span>
          </div>
        </div>

        <div className="p-2 bg-black/60 rounded-xl border border-white/5 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[8px]">REFRESH RATE</span>
            <span className="text-purple-300 font-bold">10 Hz High Rate</span>
          </div>
        </div>
      </div>

      {/* Stream Terminal Display */}
      <div className="bg-black/90 rounded-xl border border-white/10 p-3 font-mono text-[11px] max-h-60 overflow-y-auto space-y-1.5 shadow-inner">
        {messages.map((msg, idx) => (
          <div key={msg.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.03] p-1 rounded transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-[9px]">[{msg.timestamp}]</span>
              <span className={`font-bold ${
                msg.type === 'GGA' ? 'text-emerald-400' :
                msg.type === 'RMC' ? 'text-cyan-400' :
                msg.type === 'GSA' ? 'text-amber-400' : 'text-purple-400'
              }`}>
                {msg.sentence}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-serif italic truncate sm:max-w-xs">
              {msg.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
