import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatTarget, ASFFUOperative } from '../types/military';
import { Crosshair, ShieldAlert, Radio, AlertTriangle, Zap, Volume2, Target, Eye, Navigation, Flame, MapPin, LocateFixed } from 'lucide-react';

interface MilitaryRadarGridProps {
  targets: ThreatTarget[];
  selectedTargetId: string | null;
  onSelectTarget: (target: ThreatTarget) => void;
  onQuickEngage: (target: ThreatTarget) => void;
  soundEnabled: boolean;
  activeOperatives: ASFFUOperative[];
  baseLocation?: {
    name: string;
    sector: string;
    lat: number;
    lng: number;
    altM: number;
    isLiveGps: boolean;
  };
  onCheckLocation?: () => void;
  onOpenLocationModal?: () => void;
}

export const MilitaryRadarGrid: React.FC<MilitaryRadarGridProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget,
  onQuickEngage,
  soundEnabled,
  activeOperatives,
  baseLocation = {
    name: 'Albuquerque Command Citadel',
    sector: 'Albuquerque, New Mexico, USA (Sector 505)',
    lat: 35.0844,
    lng: -106.6504,
    altM: 1619,
    isLiveGps: false
  },
  onCheckLocation,
  onOpenLocationModal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scanRangeKm, setScanRangeKm] = useState<number>(1000);
  const [radarMode, setRadarMode] = useState<'OMNI' | 'AERO' | 'THOUGHT' | 'ESSENCE'>('OMNI');
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const [isAlertBlinking, setIsAlertBlinking] = useState(false);

  // Animation frame loop for smooth 60fps radar sweep
  useEffect(() => {
    let animationFrameId: number;
    let currentAngle = 0;

    const render = () => {
      currentAngle = (currentAngle + 1.4) % 360;
      setSweepAngle(currentAngle);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const cx = width / 2;
          const cy = height / 2;
          const maxRadius = width / 2 - 20;

          // Clear
          ctx.clearRect(0, 0, width, height);

          // Dark tactical background radial gradient
          const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
          bgGrad.addColorStop(0, 'rgba(8, 18, 28, 0.95)');
          bgGrad.addColorStop(0.7, 'rgba(4, 10, 16, 0.98)');
          bgGrad.addColorStop(1, 'rgba(2, 5, 8, 1)');
          ctx.fillStyle = bgGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
          ctx.fill();

          // Concentric Range Rings
          const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
          rings.forEach((ratio, idx) => {
            const r = maxRadius * ratio;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = idx === 4 ? 'rgba(212, 175, 55, 0.4)' : 'rgba(6, 182, 212, 0.18)';
            ctx.lineWidth = idx === 4 ? 2 : 1;
            ctx.stroke();

            // Distance labels
            const ringKm = Math.round(scanRangeKm * ratio);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
            ctx.font = '9px monospace';
            ctx.fillText(`${ringKm} km`, cx + 6, cy - r + 11);
          });

          // Crosshairs & Radial Angles (every 30 deg)
          for (let deg = 0; deg < 360; deg += 30) {
            const rad = (deg * Math.PI) / 180;
            const x2 = cx + Math.cos(rad) * maxRadius;
            const y2 = cy + Math.sin(rad) * maxRadius;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = deg % 90 === 0 ? 'rgba(212, 175, 55, 0.25)' : 'rgba(6, 182, 212, 0.08)';
            ctx.lineWidth = deg % 90 === 0 ? 1.5 : 0.8;
            ctx.stroke();

            // Angle labels at edge
            if (deg % 45 === 0) {
              const lx = cx + Math.cos(rad) * (maxRadius + 10);
              const ly = cy + Math.sin(rad) * (maxRadius + 10);
              ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
              ctx.font = '10px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`${deg}°`, lx, ly);
            }
          }

          // Rotating Sweep Beam with Cone Gradient
          const sweepRad = (currentAngle * Math.PI) / 180;
          const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
          sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
          sweepGrad.addColorStop(1, 'rgba(212, 175, 55, 0.02)');

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, maxRadius, sweepRad - 0.45, sweepRad);
          ctx.closePath();
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
          ctx.fill();

          // Leading sweep line
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(sweepRad) * maxRadius, cy + Math.sin(sweepRad) * maxRadius);
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();

          // Center Citadel Base Beacon
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#D4AF37';
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanRangeKm]);

  // Flash alert when critical threat detected
  useEffect(() => {
    const hasCrit = targets.some(t => t.threatLevel === 'CRITICAL' || t.threatLevel === 'OMEGA');
    setIsAlertBlinking(hasCrit);
  }, [targets]);

  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  return (
    <div className="w-full bg-[#070c14]/90 border border-cyan-500/25 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col gap-5">
      {/* Tactical Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </div>
            {isAlertBlinking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-serif font-bold text-slate-100 tracking-wider flex items-center gap-2">
                KINGDOM SUPREME RADAR & SENSOR GRID
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                DEFCON 1 • LIVE
              </span>
            </div>
            <p className="text-xs text-cyan-300/70 font-mono flex items-center gap-2">
              <span>SCAN RADIUS: {scanRangeKm} KM</span>
              <span>•</span>
              <span>BEARING AZIMUTH: {Math.round(sweepAngle)}°</span>
              <span>•</span>
              <span>TRACKED ENTITIES: {targets.length}</span>
            </p>
          </div>
        </div>

        {/* Range Selector & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-black/50 border border-cyan-500/30 rounded-lg p-0.5 text-xs font-mono">
            {[250, 1000, 2500].map(r => (
              <button
                key={r}
                onClick={() => setScanRangeKm(r)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  scanRangeKm === r
                    ? 'bg-cyan-500/30 text-cyan-200 font-bold shadow'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {r === 250 ? 'Dome 250km' : r === 1000 ? 'Sector 1k km' : 'Global 2.5k km'}
              </button>
            ))}
          </div>

          <div className="flex bg-black/50 border border-amber-500/30 rounded-lg p-0.5 text-xs font-mono">
            {(['OMNI', 'THOUGHT', 'ESSENCE', 'AERO'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setRadarMode(mode)}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  radarMode === mode
                    ? 'bg-amber-500/30 text-amber-200 font-bold shadow'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Military Base Location & Geolocation HUD Strip */}
      <div className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-slate-200">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold tracking-wider">BASE OF OPERATIONS:</span>
              <span className="text-slate-100 font-semibold">{baseLocation.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                baseLocation.isLiveGps
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 flex items-center gap-1'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
              }`}>
                {baseLocation.isLiveGps && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
                {baseLocation.sector}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3 mt-0.5">
              <span>LAT: <strong className="text-cyan-300">{baseLocation.lat}° {baseLocation.lat >= 0 ? 'N' : 'S'}</strong></span>
              <span>LNG: <strong className="text-cyan-300">{baseLocation.lng}° {baseLocation.lng >= 0 ? 'E' : 'W'}</strong></span>
              <span>ELEV: <strong className="text-amber-300">{baseLocation.altM} M</strong></span>
              <span>GRID: <strong className="text-emerald-400">ACTIVE RADAR NEXUS</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCheckLocation && (
            <button
              onClick={onCheckLocation}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 flex items-center gap-1.5 transition-all text-xs font-mono font-semibold cursor-pointer shadow-sm"
              title="Anchor Supreme Base at your live device GPS location"
            >
              <LocateFixed className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>📍 Put Base at My Location</span>
            </button>
          )}

          {onOpenLocationModal && (
            <button
              onClick={onOpenLocationModal}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 flex items-center gap-1.5 transition-all text-xs font-mono cursor-pointer"
              title="Manually configure coordinates or select preset citadel"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit Coordinates</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Layout: Radar Canvas + Target Tracking HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Aspect: Interactive Canvas Radar Circle */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative select-none">
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            {/* Canvas Base Grid */}
            <canvas
              ref={canvasRef}
              width={460}
              height={460}
              className="w-full h-full rounded-full border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-black"
            />

            {/* Interactive Target Blips Overlaid on Canvas */}
            {targets.map((target, idx) => {
              // Convert polar (azimuth, distance) to Cartesian coordinates (percentage 0-100%)
              const angleRad = (target.azimuthDeg * Math.PI) / 180;
              const normalizedDist = Math.min(1, target.distanceKm / scanRangeKm);
              // Max radius from center is ~45%
              const xPercent = 50 + normalizedDist * 42 * Math.cos(angleRad);
              const yPercent = 50 + normalizedDist * 42 * Math.sin(angleRad);

              const isSelected = target.id === selectedTargetId;
              const isCrit = target.threatLevel === 'CRITICAL' || target.threatLevel === 'OMEGA';

              return (
                <div
                  key={`${target.id}-${idx}`}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute z-20 cursor-pointer group"
                  onClick={() => onSelectTarget(target)}
                >
                  {/* Blip Ping Ring */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isSelected
                        ? 'scale-125'
                        : 'hover:scale-110'
                    }`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                        isCrit ? 'bg-red-500' : target.threatLevel === 'HIGH' ? 'bg-orange-500' : 'bg-amber-400'
                      }`}
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-400 border-white shadow-[0_0_12px_#06b6d4]'
                          : isCrit
                          ? 'bg-red-600 border-red-300 shadow-[0_0_10px_#ef4444]'
                          : 'bg-amber-500 border-amber-200 shadow-[0_0_8px_#f59e0b]'
                      }`}
                    >
                      <Crosshair className="w-2.5 h-2.5 text-black" />
                    </div>
                  </div>

                  {/* Target Label Popup Tag */}
                  <div
                    className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md transition-opacity pointer-events-none ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 opacity-100 z-30 shadow-lg'
                        : 'bg-black/80 border-slate-700 text-slate-300 opacity-85 group-hover:opacity-100'
                    }`}
                  >
                    <span className="font-bold">{target.name.split(' ')[0]}</span>
                    <span className="text-slate-400 ml-1">({target.distanceKm}km)</span>
                  </div>
                </div>
              );
            })}

            {/* Cardinal Direction Compass Marks */}
            <span className="absolute top-2 text-[11px] font-mono font-bold text-amber-400">N (000°)</span>
            <span className="absolute right-2 text-[11px] font-mono font-bold text-amber-400">E (090°)</span>
            <span className="absolute bottom-2 text-[11px] font-mono font-bold text-amber-400">S (180°)</span>
            <span className="absolute left-2 text-[11px] font-mono font-bold text-amber-400">W (270°)</span>

            {/* Base Sanctum Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_15px_#D4AF37] border-2 border-white animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-amber-300 mt-1 whitespace-nowrap bg-black/70 px-1 rounded">
                KINGDOM CITADEL
              </span>
            </div>
          </div>
        </div>

        {/* Right Aspect: Target Telemetry & Action Staging Console */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {selectedTarget ? (
            <motion.div
              key={selectedTarget.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/60 border border-cyan-500/40 rounded-xl p-4 flex flex-col gap-3 shadow-inner"
            >
              {/* Target Identification Bar */}
              <div className="flex items-start justify-between border-b border-cyan-500/20 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono uppercase text-cyan-300 font-bold tracking-wider">
                      LOCKED TARGET TELEMETRY
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-100 mt-0.5">
                    {selectedTarget.name}
                  </h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    selectedTarget.threatLevel === 'CRITICAL'
                      ? 'bg-red-950/60 text-red-300 border-red-500 animate-pulse'
                      : selectedTarget.threatLevel === 'HIGH'
                      ? 'bg-orange-950/60 text-orange-300 border-orange-500'
                      : 'bg-amber-950/60 text-amber-300 border-amber-500'
                  }`}
                >
                  {selectedTarget.threatLevel}
                </span>
              </div>

              {/* Spatial Coordinates & Vectors */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] block">DISTANCE</span>
                  <span className="text-cyan-300 font-bold">{selectedTarget.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">AZIMUTH / BEARING</span>
                  <span className="text-cyan-300 font-bold">{selectedTarget.azimuthDeg}°</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ALTITUDE</span>
                  <span className="text-slate-300">{selectedTarget.altitudeM.toLocaleString()} m</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">VELOCITY</span>
                  <span className="text-slate-300">Mach {selectedTarget.velocityMach}</span>
                </div>
              </div>

              {/* 3-Fold Threat Intercept Scores */}
              <div className="space-y-2 text-xs font-mono">
                {/* Voice Malice */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Malice Voice / Chatter:</span>
                    <span className="text-amber-400 font-bold">{selectedTarget.voiceMaliceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${selectedTarget.voiceMaliceScore}%` }}
                    />
                  </div>
                  {selectedTarget.detectedChatter && (
                    <p className="text-[10px] text-amber-300/80 font-serif italic mt-1 bg-amber-950/20 p-1.5 rounded border border-amber-500/20">
                      "{selectedTarget.detectedChatter}"
                    </p>
                  )}
                </div>

                {/* Thought Malice */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Malice Thought Resonance:</span>
                    <span className="text-violet-400 font-bold">{selectedTarget.thoughtMaliceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-violet-500 h-full rounded-full"
                      style={{ width: `${selectedTarget.thoughtMaliceScore}%` }}
                    />
                  </div>
                  {selectedTarget.interceptedThought && (
                    <p className="text-[10px] text-violet-300/80 font-serif italic mt-1 bg-violet-950/20 p-1.5 rounded border border-violet-500/20">
                      Telepathic Intercept: "{selectedTarget.interceptedThought}"
                    </p>
                  )}
                </div>

                {/* Corrupt Essence */}
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Corrupt Essence Index:</span>
                    <span className="text-red-400 font-bold">{selectedTarget.corruptEssenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full"
                      style={{ width: `${selectedTarget.corruptEssenceScore}%` }}
                    />
                  </div>
                  {selectedTarget.essenceMarker && (
                    <p className="text-[10px] text-red-300/80 font-mono mt-1">
                      Spectrograph: {selectedTarget.essenceMarker}
                    </p>
                  )}
                </div>
              </div>

              {/* Rapid Action Buttons */}
              <div className="flex gap-2 mt-2 pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => onQuickEngage(selectedTarget)}
                  className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>AUTHORIZE TFDAS MUNITIONS</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 rounded-xl bg-black/40 border border-dashed border-cyan-500/30 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
              <Crosshair className="w-8 h-8 text-cyan-500/60 animate-spin" />
              <p className="text-xs font-mono text-cyan-300">NO TARGET CURRENTLY LOCKED</p>
              <p className="text-[11px] font-serif text-slate-500">
                Select any blip on the tactical radar sweep to inspect telemetry, chatter intercepts, and trigger defensive interdiction.
              </p>
            </div>
          )}

          {/* ASFFU Readiness Indicator Card */}
          <div className="p-3 bg-black/40 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-amber-300 font-bold">ASFFU SQUADRON MANIFEST READINESS:</span>
            </div>
            <span className="text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              0.001s (BLINK OF AN EYE)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryRadarGrid;
