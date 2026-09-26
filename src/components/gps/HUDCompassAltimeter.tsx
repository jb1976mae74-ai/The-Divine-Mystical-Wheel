import React, { useState } from 'react';
import { GPSFixData, CoordinateConversions } from '../../types/gps';
import { convertCoordinates, bearingToCardinal } from '../../data/gpsPresets';
import { Compass, Gauge, Mountain, Copy, Check, Navigation, ArrowUpRight, Globe, Layers } from 'lucide-react';

interface HUDCompassAltimeterProps {
  currentFix: GPSFixData;
  activeTheme: any;
}

export default function HUDCompassAltimeter({ currentFix, activeTheme }: HUDCompassAltimeterProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const conversions = convertCoordinates(currentFix.latitude, currentFix.longitude);

  const heading = currentFix.heading !== null ? currentFix.heading : 45.0;
  const cardinal = bearingToCardinal(heading);

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Digital Compass & Heading Tape */}
      <div className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Magnetic / True Compass
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {heading.toFixed(1)}° {cardinal}
          </span>
        </div>

        {/* Compass Rosette Graphic */}
        <div className="flex items-center justify-center relative my-2">
          <div className="relative w-36 h-36 rounded-full border-2 border-white/10 bg-black/60 flex items-center justify-center shadow-inner">
            {/* Compass Outer Markings */}
            <div className="absolute top-1 text-[9px] font-mono font-bold text-red-400">N</div>
            <div className="absolute right-2 text-[9px] font-mono font-bold text-slate-400">E</div>
            <div className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-400">S</div>
            <div className="absolute left-2 text-[9px] font-mono font-bold text-slate-400">W</div>

            {/* Rotating Arrow */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${heading}deg)` }}
            >
              {/* North Needle */}
              <div className="absolute top-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[48px] border-b-red-500 shadow-md"></div>
              {/* South Needle */}
              <div className="absolute bottom-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[48px] border-t-slate-500"></div>
              {/* Center Pivot */}
              <div className="w-3 h-3 rounded-full bg-white border-2 border-black z-10 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Linear Ribbon Heading Tape */}
        <div className="w-full bg-black/80 border border-white/10 rounded-lg p-2 overflow-hidden text-center">
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>{(heading - 30 + 360) % 360}°</span>
            <span className="text-amber-300 font-bold">{heading.toFixed(0)}° {cardinal}</span>
            <span>{(heading + 30) % 360}°</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
              style={{ width: `${(heading / 360) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Speedometer & Velocity Vector */}
      <div className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Speedometer & Vector
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {currentFix.speedKmh.toFixed(1)} km/h
          </span>
        </div>

        {/* Speed Dial Multi-Readout */}
        <div className="flex flex-col items-center justify-center my-3 bg-black/60 p-4 rounded-xl border border-white/5">
          <div className="text-3xl font-mono font-extrabold text-white tracking-tight">
            {currentFix.speedKmh.toFixed(1)}
          </div>
          <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest mt-0.5">
            KILOMETERS / HOUR
          </span>

          <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-2 border-t border-white/5 text-center text-[10px] font-mono">
            <div className="p-1 bg-white/[0.02] rounded">
              <span className="text-slate-500 block text-[8px]">KNOTS</span>
              <span className="text-slate-200 font-bold">{currentFix.speedKnots.toFixed(1)} kn</span>
            </div>
            <div className="p-1 bg-white/[0.02] rounded">
              <span className="text-slate-500 block text-[8px]">MPH</span>
              <span className="text-slate-200 font-bold">{currentFix.speedMph.toFixed(1)} mph</span>
            </div>
            <div className="p-1 bg-white/[0.02] rounded">
              <span className="text-slate-500 block text-[8px]">MACH</span>
              <span className="text-slate-200 font-bold">{(currentFix.speedKmh / 1234.8).toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Acceleration & Inertial Guidance Status */}
        <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono flex items-center justify-between">
          <span className="text-slate-400">Inertial Dead-Reckoning:</span>
          <span className="text-emerald-400 font-bold">ACTIVE (0.02% Drift)</span>
        </div>
      </div>

      {/* 3. Altimeter & Elevation Matrix */}
      <div className="p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Altimeter & Geoid
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {currentFix.altitude.toFixed(0)} m MSL
          </span>
        </div>

        {/* Altitude Profile Card */}
        <div className="flex flex-col items-center justify-center my-3 bg-black/60 p-4 rounded-xl border border-white/5">
          <div className="text-3xl font-mono font-extrabold text-emerald-400 tracking-tight">
            {currentFix.altitude.toFixed(1)}
          </div>
          <span className="text-[10px] font-mono uppercase text-emerald-300 tracking-widest mt-0.5">
            METERS ABOVE SEA LEVEL (WGS84)
          </span>

          <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-2 border-t border-white/5 text-center text-[10px] font-mono">
            <div className="p-1 bg-white/[0.02] rounded">
              <span className="text-slate-500 block text-[8px]">FEET (ALT)</span>
              <span className="text-slate-200 font-bold">{(currentFix.altitude * 3.28084).toFixed(0)} ft</span>
            </div>
            <div className="p-1 bg-white/[0.02] rounded">
              <span className="text-slate-500 block text-[8px]">GEOID HEIGHT</span>
              <span className="text-slate-200 font-bold">{currentFix.geoidHeightMeters} m</span>
            </div>
          </div>
        </div>

        {/* Vertical Accuracy */}
        <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono flex items-center justify-between">
          <span className="text-slate-400">Vertical Dilution (VDOP):</span>
          <span className="text-cyan-400 font-bold">{currentFix.vdop} (±2.4m)</span>
        </div>
      </div>

      {/* 4. Full-Span Geodetic Coordinate Conversion Matrix */}
      <div className="md:col-span-3 p-4 bg-[#0a0a0d] border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Universal Geodetic & Celestial Coordinate Ledger
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            WGS84 Reference Ellipsoid / ITRF2020
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Decimal Degrees */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Decimal Degrees (DD)
              </span>
              <div className="text-xs font-mono text-white font-semibold">{conversions.dd.combined}</div>
            </div>
            <button
              onClick={() => handleCopy(conversions.dd.combined, 'DD')}
              className="mt-2 text-[9px] font-mono flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {copiedFormat === 'DD' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFormat === 'DD' ? 'Copied' : 'Copy DD'}</span>
            </button>
          </div>

          {/* Degrees Minutes Seconds */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Degrees Minutes Seconds (DMS)
              </span>
              <div className="text-xs font-mono text-white font-semibold truncate">{conversions.dms.combined}</div>
            </div>
            <button
              onClick={() => handleCopy(conversions.dms.combined, 'DMS')}
              className="mt-2 text-[9px] font-mono flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              {copiedFormat === 'DMS' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFormat === 'DMS' ? 'Copied' : 'Copy DMS'}</span>
            </button>
          </div>

          {/* MGRS / Military Grid */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                Military Grid (MGRS)
              </span>
              <div className="text-xs font-mono text-white font-semibold truncate">{conversions.mgrs}</div>
            </div>
            <button
              onClick={() => handleCopy(conversions.mgrs, 'MGRS')}
              className="mt-2 text-[9px] font-mono flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              {copiedFormat === 'MGRS' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFormat === 'MGRS' ? 'Copied' : 'Copy MGRS'}</span>
            </button>
          </div>

          {/* Celestial RA / Dec */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1">
                Celestial Zenith (RA/Dec)
              </span>
              <div className="text-xs font-mono text-white font-semibold">
                RA: {conversions.celestialRaDec.ra} | Dec: {conversions.celestialRaDec.dec}
              </div>
            </div>
            <button
              onClick={() => handleCopy(`RA: ${conversions.celestialRaDec.ra}, Dec: ${conversions.celestialRaDec.dec}`, 'RA/DEC')}
              className="mt-2 text-[9px] font-mono flex items-center gap-1 text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              {copiedFormat === 'RA/DEC' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFormat === 'RA/DEC' ? 'Copied' : 'Copy RA/Dec'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
