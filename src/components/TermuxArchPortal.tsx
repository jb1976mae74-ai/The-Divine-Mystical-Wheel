import React, { useState } from 'react';
import { Terminal, Cpu, Download, Copy, Check, ShieldCheck, FileCode, ArrowRight, Activity, Sparkles, RefreshCw } from 'lucide-react';

interface TermuxArchPortalProps {
  theme?: any;
}

export const TermuxArchPortal: React.FC<TermuxArchPortalProps> = ({ theme }) => {
  const [selectedArch, setSelectedArch] = useState<'armv7' | 'arm64-v8a' | 'i386' | 'x86_64'>('arm64-v8a');
  const [selectedDM, setSelectedDM] = useState<'curl' | 'wget' | 'aria2' | 'axel' | 'lftp'>('curl');
  const [copiedScript, setCopiedScript] = useState(false);
  const [installDir, setInstallDir] = useState('arch');

  const setupScriptSnippet = `#!/usr/bin/env bash
## TermuxArch v2.0.548 by SDRausty
## Automated Arch Linux PRoot QEMU installer for Termux
set -Eeuo pipefail
VERSIONID=2.0.548
echo "Initializing TermuxArch for architecture: ${selectedArch} using ${selectedDM}..."
# Configure download manager and bootstrap rootfs in ~/${installDir}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(setupScriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([setupScriptSnippet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setupTermuxArch';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              TermuxArch v2.0.548 by SDRausty
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Arch Linux PRoot QEMU Builder & Installer Portal
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Automated bootstrap engine for deploying Arch Linux inside Termux via PRoot and QEMU emulation. Fully optimized for ARM, i386, and x86_64 architectures.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Engine Version</div>
              <div className="text-lg font-bold text-cyan-300 font-mono">v2.0.548</div>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Configuration Options */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Target Architecture
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(['arm64-v8a', 'armv7', 'i386', 'x86_64'] as const).map((arch) => (
                <button
                  key={arch}
                  onClick={() => setSelectedArch(arch)}
                  className={`p-3 rounded-xl text-xs font-mono font-medium transition-all border cursor-pointer ${
                    selectedArch === arch
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  {arch}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              Download Manager
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {(['curl', 'wget', 'aria2', 'axel', 'lftp'] as const).map((dm) => (
                <button
                  key={dm}
                  onClick={() => setSelectedDM(dm)}
                  className={`p-2.5 rounded-xl text-xs font-mono font-medium transition-all border cursor-pointer ${
                    selectedDM === dm
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  {dm}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Install Directory
            </h2>
            <input
              type="text"
              value={installDir}
              onChange={(e) => setInstallDir(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-400"
              placeholder="arch"
            />
            <div className="text-[11px] text-slate-400 font-mono">
              Root path: ~/{installDir}
            </div>
          </div>
        </div>

        {/* Right: Script Viewer & Actions (2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-slate-100">setupTermuxArch Build Script Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
                </button>
                <button
                  onClick={handleDownloadScript}
                  className="p-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Script</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
              {setupScriptSnippet}
            </pre>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Quick Installation Command in Termux:
              </div>
              <code className="block p-2 rounded bg-slate-950 text-emerald-300 font-mono select-all">
                bash &lt;(curl -L https://raw.githubusercontent.com/TermuxArch/TermuxArch/master/setupTermuxArch) {selectedDM} install {installDir}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermuxArchPortal;
