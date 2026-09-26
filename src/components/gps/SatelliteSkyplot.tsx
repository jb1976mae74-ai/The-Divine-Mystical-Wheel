import React, { useState, useEffect } from 'react';
import { SatelliteInfo, GPSFixData, SatelliteConstellation } from '../../types/gps';
import { Radio, Wifi, Shield, Sparkles, Orbit, CheckCircle2, AlertCircle } from 'lucide-react';

interface SatelliteSkyplotProps {
  satellites: SatelliteInfo[];
  currentFix: GPSFixData;
  activeTheme: any;
}

export default function SatelliteSkyplot({ satellites, currentFix, activeTheme }: SatelliteSkyplotProps) {
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteInfo | null>(satellites[0] || null);
  const [filterConstellation, setFilterConstellation] = useState<string>('ALL');

  const filteredSatellites = satellites.filter(sat => {
    if (filterConstellation === 'ALL') return true;
    return sat.constellation === filterConstellation;
  });

  const lockedCount = satellites.filter(s => s.locked).length;
  const avgSnr = (satellites.reduce((acc, s) => acc + s.snr, 0) / (satellites.length || 1)).toFixed(1);

  // Constellation Colors
  const constellationColors: Record<SatelliteConstellation, { border: string; bg: string; text: string }> = {
    GPS: { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.25)', text: '#38bdf8' },
    Galileo: { border: '#34d399', bg: 'rgba(52, 211, 153, 0.25)', text: '#34d399' },
    GLONASS: { border: '#f87171', bg: 'rgba(248, 113, 113, 0.25)', text: '#f87171' },
    BeiDou: { border: '#fbbf24', bg: 'rgba(251, 191, 36, 0.25)', text: '#fbbf24' },
    Celestial: { border: '#e879f9', bg: 'rgba(232, 121, 249, 0.35)', text: '#e879f9' }
  };

  // Convert Elevation (0-90) and Azimuth (0-360) to 2D Skyplot coordinates (center = zenith 90 deg)
  const calculatePolarPosition = (elevation: number, azimuth: number, radiusPx = 130) => {
    const r = ((90 - elevation) / 90) * radiusPx;
    const rad = ((azimuth - 90) * Math.PI) / 180;
    const x = 160 + r * Math.cos(rad);
    const y = 160 + r * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-2xl">
      {/* Polar Skyplot Radar Canvas */}
      <div className="flex flex-col items-center justify-center relative p-3 bg-black/60 border border-white/5 rounded-xl">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Satellite Skyplot (Orbital Radar)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {lockedCount}/{satellites.length} Locked (3D Fix)
          </span>
        </div>

        {/* SVG Skyplot Graphic */}
        <div className="relative w-[320px] h-[320px]">
          <svg viewBox="0 0 320 320" className="w-full h-full">
            {/* Background Rings */}
            <circle cx="160" cy="160" r="130" fill="#050811" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="86.6" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="160" cy="160" r="43.3" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="160" cy="160" r="4" fill="#38bdf8" />

            {/* Azimuth Crosshairs */}
            <line x1="160" y1="30" x2="160" y2="290" stroke="#1e293b" strokeWidth="1" />
            <line x1="30" y1="160" x2="290" y2="160" stroke="#1e293b" strokeWidth="1" />
            <line x1="68" y1="68" x2="252" y2="252" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="68" y1="252" x2="252" y2="68" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 4" />

            {/* Cardinal Labels */}
            <text x="160" y="22" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">N (000°)</text>
            <text x="300" y="163" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="start">E (090°)</text>
            <text x="160" y="306" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">S (180°)</text>
            <text x="20" y="163" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">W (270°)</text>

            {/* Elevation Angle Indicators */}
            <text x="165" y="120" fill="#475569" fontSize="8" fontFamily="monospace">60°</text>
            <text x="165" y="77" fill="#475569" fontSize="8" fontFamily="monospace">30°</text>
            <text x="165" y="38" fill="#475569" fontSize="8" fontFamily="monospace">0°</text>

            {/* Orbiting Satellites */}
            {filteredSatellites.map(sat => {
              const pos = calculatePolarPosition(sat.elevation, sat.azimuth, 130);
              const colorInfo = constellationColors[sat.constellation] || constellationColors.GPS;
              const isSelected = selectedSatellite?.prn === sat.prn;

              return (
                <g
                  key={sat.prn}
                  onClick={() => setSelectedSatellite(sat)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#fbbf24" strokeWidth="2" className="animate-pulse" />
                  )}

                  {/* Satellite marker circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={sat.locked ? "7" : "5"}
                    fill={colorInfo.bg}
                    stroke={colorInfo.border}
                    strokeWidth={sat.locked ? "2" : "1"}
                  />

                  {/* PRN Text */}
                  <text
                    x={pos.x}
                    y={pos.y + 3}
                    fill="#ffffff"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {sat.prn > 99 ? sat.prn % 100 : sat.prn}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Constellation Filter Bar */}
        <div className="flex items-center gap-1 mt-2 text-[9px] font-mono">
          {['ALL', 'GPS', 'Galileo', 'GLONASS', 'BeiDou', 'Celestial'].map(c => (
            <button
              key={c}
              onClick={() => setFilterConstellation(c)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                filterConstellation === c
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Satellite Signal-to-Noise Ratio (SNR) Chart & Detailed Telemetry */}
      <div className="flex-1 flex flex-col justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Signal Strength & Frequency Matrix
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="text-slate-400">Avg SNR: <strong className="text-emerald-400">{avgSnr} dBHz</strong></span>
              <span className="text-slate-400">HDOP: <strong className="text-cyan-400">{currentFix.hdop}</strong></span>
              <span className="text-slate-400">PDOP: <strong className="text-amber-400">{currentFix.pdop}</strong></span>
            </div>
          </div>

          {/* SNR Vertical Bar Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 h-28 items-end mb-4 bg-black/60 p-2 rounded-lg border border-white/5">
            {filteredSatellites.map(sat => {
              const isSelected = selectedSatellite?.prn === sat.prn;
              const heightPercent = Math.min(100, (sat.snr / 55) * 100);
              const colorInfo = constellationColors[sat.constellation];

              return (
                <div
                  key={sat.prn}
                  onClick={() => setSelectedSatellite(sat)}
                  className="flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[8px] font-mono text-slate-400 group-hover:text-amber-300">{sat.snr}</span>
                  <div className="w-full bg-slate-800/60 rounded-t h-full flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t transition-all ${
                        sat.locked
                          ? isSelected
                            ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                            : 'bg-gradient-to-t from-emerald-600 to-cyan-400'
                          : 'bg-slate-600 opacity-50'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={`text-[8px] font-mono font-bold mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    {sat.prn > 99 ? sat.prn % 100 : sat.prn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Satellite Telemetry Inspector */}
        {selectedSatellite && (
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Orbit className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">
                  {selectedSatellite.constellation} PRN #{selectedSatellite.prn}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/10 text-slate-300 rounded">
                  {selectedSatellite.frequencyBand}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${selectedSatellite.locked ? 'text-emerald-400' : 'text-slate-500'}`}>
                {selectedSatellite.locked ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {selectedSatellite.locked ? 'CARRIER LOCK' : 'ACQUIRING'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="p-1 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[8px]">ELEVATION</span>
                <span className="text-white font-bold">{selectedSatellite.elevation}°</span>
              </div>
              <div className="p-1 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[8px]">AZIMUTH</span>
                <span className="text-white font-bold">{selectedSatellite.azimuth}°</span>
              </div>
              <div className="p-1 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[8px]">SNR (C/N0)</span>
                <span className="text-emerald-400 font-bold">{selectedSatellite.snr} dBHz</span>
              </div>
              <div className="p-1 bg-black/40 rounded border border-white/5">
                <span className="text-slate-500 block text-[8px]">DOPPLER</span>
                <span className="text-cyan-400 font-bold">+1.42 kHz</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
