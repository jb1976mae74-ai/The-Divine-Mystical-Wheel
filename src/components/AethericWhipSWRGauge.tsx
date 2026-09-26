import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Activity, Sliders, ShieldCheck, AlertTriangle, 
  RotateCw, Volume2, VolumeX, Sparkles, CheckCircle2, 
  Radio, Waves, RefreshCw, Layers, Info, Compass, ArrowRight, Gauge,
  HelpCircle, X, BookOpen, Play, CheckCircle, Terminal,
  Bookmark, BookmarkCheck, RotateCcw, Trash2, Save, HardDrive, Check, Clock
} from 'lucide-react';

interface AethericWhipSWRGaugeProps {
  activeTheme?: any;
  onCalibrationComplete?: (swr: number) => void;
  className?: string;
}

export interface CalibrationLogEntry {
  id: string;
  time: string;
  stepName: string;
  frequencyMHz: number;
  swrValue: number;
  status: 'scanning' | 'tuning' | 'locked' | 'optimal';
  detail: string;
}

export interface SavedSWRSettings {
  whipLength: number;
  springLength: number;
  frequency: number;
  groundResistance: number;
  rfPower: number;
  swr: number;
  efficiency: number;
  timestamp: string;
  label?: string;
}

const STORAGE_KEY = 'the_great_wheel_swr_calibration';

export function AethericWhipSWRGauge({ activeTheme, onCalibrationComplete, className = '' }: AethericWhipSWRGaugeProps) {
  // Saved Settings from Memory (localStorage)
  const [savedSettings, setSavedSettings] = useState<SavedSWRSettings | null>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  });
  const [rememberToast, setRememberToast] = useState<{ show: boolean; message: string; timestamp: number } | null>(null);

  // Physical Tuning Parameters
  const [whipLength, setWhipLength] = useState<number>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.whipLength === 'number') return parsed.whipLength;
      }
    } catch (e) {}
    return 102.0; // Default Target 102 inches
  });
  const [springLength, setSpringLength] = useState<number>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.springLength === 'number') return parsed.springLength;
      }
    } catch (e) {}
    return 10.0; // Default Target 10 inches
  });
  const [frequency, setFrequency] = useState<number>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.frequency === 'number') return parsed.frequency;
      }
    } catch (e) {}
    return 27.185; // Target 27.185 MHz (Ch 19)
  });
  const [groundResistance, setGroundResistance] = useState<number>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.groundResistance === 'number') return parsed.groundResistance;
      }
    } catch (e) {}
    return 1.2; // Target ~1.2 Ohms
  });
  const [rfPower, setRfPower] = useState<number>(100); // 100 Watts

  // Interactive States
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationPhase, setCalibrationPhase] = useState<
    'idle' | 'spectrum_scan' | 'frequency_stepping' | 'length_convergence' | 'phase_nulling' | 'resonance_locked'
  >('idle');
  const [calibrationStep, setCalibrationStep] = useState<number>(0);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [calibrationLogs, setCalibrationLogs] = useState<CalibrationLogEntry[]>([]);
  const [showLogTerminal, setShowLogTerminal] = useState<boolean>(false);
  const [calibrationSuccessToast, setCalibrationSuccessToast] = useState<boolean>(false);

  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('salazar-golden');
  const [activeTab, setActiveTab] = useState<'gauge' | 'waveform' | 'telemetry'>('gauge');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Canvas Ref for Oscilloscope
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const calibrationTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Derived Physical Calculations
  const totalLength = useMemo(() => whipLength + springLength, [whipLength, springLength]);
  
  // Theoretical quarter-wave length at frequency (in inches) with end-effect factor ~0.95
  const idealLengthInches = useMemo(() => {
    // Speed of light in inches/sec = 11,802,859,000
    // Quarter wavelength = (11.802859e9 / (freq * 1e6)) / 4 * 0.963
    const lambdaInches = (11802.859 / frequency) / 4 * 0.963;
    return lambdaInches;
  }, [frequency]);

  // Calculated SWR based on length deviation and frequency match
  const calculatedMetrics = useMemo(() => {
    const lengthDelta = Math.abs(totalLength - idealLengthInches);
    const freqDelta = Math.abs(frequency - 27.185);
    const groundDelta = Math.abs(groundResistance - 1.2);

    // Baseline minimum SWR at 112" and 27.185 MHz is 1.08:1 to 1.10:1
    let swr = 1.08 + (lengthDelta * 0.12) + (freqDelta * 0.45) + (groundDelta * 0.08);
    swr = Math.max(1.02, Math.min(4.5, parseFloat(swr.toFixed(2))));

    // Calculate Reflection Coefficient (Gamma)
    const gamma = Math.abs((swr - 1) / (swr + 1));
    const reflectedPower = parseFloat((rfPower * Math.pow(gamma, 2)).toFixed(2));
    const forwardPower = parseFloat((rfPower - reflectedPower).toFixed(2));
    const efficiency = parseFloat(((forwardPower / rfPower) * 100).toFixed(1));

    // Calculate Complex Impedance Z = R + jX
    const R = parseFloat((50 / (swr > 1 ? swr : 1 / swr)).toFixed(1));
    const X = parseFloat(((swr - 1) * 8.5 * (totalLength > 112 ? 1 : -1)).toFixed(1));

    return {
      swr,
      gamma,
      reflectedPower,
      forwardPower,
      efficiency,
      R,
      X,
      isOptimal: swr <= 1.15,
      isAcceptable: swr > 1.15 && swr <= 1.5,
      isDetuned: swr > 1.5,
    };
  }, [totalLength, idealLengthInches, frequency, groundResistance, rfPower]);

  // Needle angle for SVG Gauge (-90 deg at 1.0:1, +90 deg at 4.0:1 SWR)
  const needleAngle = useMemo(() => {
    // Mapping SWR 1.0 -> -90 deg, SWR 1.1 -> -75 deg, SWR 1.5 -> -15 deg, SWR 2.0 -> +30 deg, SWR 4.0 -> +90 deg
    const swr = calculatedMetrics.swr;
    if (swr <= 1.1) {
      return -90 + ((swr - 1.0) / 0.1) * 15; // -90 to -75
    } else if (swr <= 1.5) {
      return -75 + ((swr - 1.1) / 0.4) * 60; // -75 to -15
    } else if (swr <= 2.0) {
      return -15 + ((swr - 1.5) / 0.5) * 45; // -15 to +30
    } else {
      return 30 + (Math.min(swr, 4.0) - 2.0) / 2.0 * 60; // +30 to +90
    }
  }, [calculatedMetrics.swr]);

  // Audio Tone Synthesis for Resonance Feedback
  useEffect(() => {
    if (!audioEnabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch shifts based on SWR purity (528 Hz at 1.1:1 SWR)
      const targetFreq = 528 - (calculatedMetrics.swr - 1.1) * 80;
      osc.type = calculatedMetrics.swr <= 1.15 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(Math.max(120, targetFreq), ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn('Audio synthesis unavailable:', e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [audioEnabled, calculatedMetrics.swr]);

  // Audio Chime Tone on Lock & Memory Save
  const playChimeTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio context might be restricted
    }
  };

  // Remember & Save Current SWR Calibration into Persistent Storage
  const handleRememberSettings = (customLabel?: string) => {
    const newSetting: SavedSWRSettings = {
      whipLength,
      springLength,
      frequency,
      groundResistance,
      rfPower,
      swr: calculatedMetrics.swr,
      efficiency: calculatedMetrics.efficiency,
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      label: customLabel || (calculatedMetrics.swr <= 1.15 ? 'Optimal 1.1:1 SWR Lock' : `Custom ${calculatedMetrics.swr}:1 SWR`)
    };

    setSavedSettings(newSetting);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSetting));
    } catch (e) {
      console.error('Failed to save SWR settings to local storage', e);
    }

    setActivePreset('saved-user-memory');
    setRememberToast({
      show: true,
      message: `Aetheric Memory Locked: SWR ${calculatedMetrics.swr.toFixed(2)}:1 (${totalLength.toFixed(1)}" total @ ${frequency.toFixed(3)} MHz) remembered successfully!`,
      timestamp: Date.now()
    });

    playChimeTone();

    setTimeout(() => {
      setRememberToast(prev => prev && Date.now() - prev.timestamp >= 3500 ? null : prev);
    }, 4000);
  };

  // Recall / Restore Saved SWR Calibration from Persistent Storage
  const handleRecallSavedSettings = () => {
    if (!savedSettings) return;
    setWhipLength(savedSettings.whipLength);
    setSpringLength(savedSettings.springLength);
    setFrequency(savedSettings.frequency);
    setGroundResistance(savedSettings.groundResistance);
    setRfPower(savedSettings.rfPower || 100);
    setActivePreset('saved-user-memory');
    
    setRememberToast({
      show: true,
      message: `Restored Remembered Calibration: SWR ${savedSettings.swr.toFixed(2)}:1 (${(savedSettings.whipLength + savedSettings.springLength).toFixed(1)}" @ ${savedSettings.frequency.toFixed(3)} MHz)`,
      timestamp: Date.now()
    });
    playChimeTone();

    setTimeout(() => {
      setRememberToast(prev => prev && Date.now() - prev.timestamp >= 3500 ? null : prev);
    }, 4000);
  };

  // Clear Saved SWR Calibration Memory
  const handleClearSavedSettings = () => {
    setSavedSettings(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setActivePreset('custom');
    setRememberToast({
      show: true,
      message: 'Saved SWR settings removed from memory.',
      timestamp: Date.now()
    });
    setTimeout(() => {
      setRememberToast(prev => prev && Date.now() - prev.timestamp >= 3500 ? null : prev);
    }, 3500);
  };

  // Automated Multi-Stage Simulated Frequency Calibration Sequence
  const handleBeginAutoCalibration = () => {
    if (isCalibrating) return;

    // Clear any previous running sequence
    calibrationTimeoutRef.current.forEach(t => clearTimeout(t));
    calibrationTimeoutRef.current = [];

    setIsCalibrating(true);
    setActivePreset('custom');
    setCalibrationSuccessToast(false);
    setShowLogTerminal(true);

    const now = () => new Date().toLocaleTimeString();

    // Step 0: Initialize Sequence
    setCalibrationStep(1);
    setCalibrationPhase('spectrum_scan');
    setCalibrationProgress(5);

    const initialLogs: CalibrationLogEntry[] = [
      {
        id: 'init',
        time: now(),
        stepName: 'Phase 1: Spectral Frequency Scan',
        frequencyMHz: frequency,
        swrValue: calculatedMetrics.swr,
        status: 'scanning',
        detail: 'Initiating broadband carrier sweep across 26.000 MHz - 28.500 MHz band.'
      }
    ];
    setCalibrationLogs(initialLogs);

    // Simulated Frequency Sweep steps
    const sweepSteps = [
      { f: 26.250, w: 96.0, s: 8.5, g: 4.5, delay: 200, prog: 15, log: 'Sweeping 26.250 MHz: High reactive inductance detected (SWR 3.10:1).' },
      { f: 26.700, w: 98.2, s: 9.0, g: 3.2, delay: 500, prog: 28, log: 'Sweeping 26.700 MHz: Approaching quarter-wave node. Standing wave diminishing.' },
      { f: 26.965, w: 100.5, s: 9.6, g: 2.4, delay: 900, prog: 45, phase: 'frequency_stepping', step: 2, log: 'Phase 2 [Freq Stepping]: Tuning to 26.965 MHz (CB Ch 1). Reflection dropping.' },
      { f: 27.085, w: 101.2, s: 9.8, g: 1.8, delay: 1300, prog: 60, log: 'Stepping to 27.085 MHz (Ch 11 center intermediate). Carrier aligning.' },
      { f: 27.150, w: 101.8, s: 9.9, g: 1.5, delay: 1700, prog: 72, phase: 'length_convergence', step: 3, log: 'Phase 3 [Radiator Geometry]: Stepping to 27.150 MHz. Servo-extending radiator to 102.0".' },
      { f: 27.185, w: 102.0, s: 10.0, g: 1.3, delay: 2200, prog: 85, phase: 'phase_nulling', step: 4, log: 'Phase 4 [Phase Nulling]: Reached target 27.185 MHz (Logos Ch 19). Balancing 112" physical axis.' },
      { f: 27.185, w: 102.0, s: 10.0, g: 1.2, delay: 2800, prog: 95, log: 'Nulling reactive reactance (jX -> 0.0 Ω). Normalizing ground plane to 1.2 Ω.' },
    ];

    sweepSteps.forEach(s => {
      const tid = setTimeout(() => {
        setFrequency(s.f);
        setWhipLength(s.w);
        setSpringLength(s.s);
        setGroundResistance(s.g);
        setCalibrationProgress(s.prog);
        if (s.phase) setCalibrationPhase(s.phase as any);
        if (s.step) setCalibrationStep(s.step);

        setCalibrationLogs(prev => [
          ...prev,
          {
            id: `step-${s.delay}`,
            time: now(),
            stepName: `F = ${s.f.toFixed(3)} MHz`,
            frequencyMHz: s.f,
            swrValue: s.f === 27.185 ? 1.10 : parseFloat((1.1 + Math.abs(s.f - 27.185) * 2.5).toFixed(2)),
            status: s.f === 27.185 ? 'tuning' : 'scanning',
            detail: s.log
          }
        ]);
      }, s.delay);
      calibrationTimeoutRef.current.push(tid);
    });

    // Final Lock at 3300ms
    const finalTid = setTimeout(() => {
      setFrequency(27.185);
      setWhipLength(102.0);
      setSpringLength(10.0);
      setGroundResistance(1.2);
      setCalibrationStep(5);
      setCalibrationPhase('resonance_locked');
      setCalibrationProgress(100);
      setIsCalibrating(false);
      setActivePreset('salazar-golden');
      setCalibrationSuccessToast(true);

      setCalibrationLogs(prev => [
        ...prev,
        {
          id: 'locked-final',
          time: now(),
          stepName: 'Phase 5: 1.1:1 SWR Resonance Lock',
          frequencyMHz: 27.185,
          swrValue: 1.10,
          status: 'optimal',
          detail: '✓ Perfect Harmonic Calibration Established: SWR 1.10:1 @ 27.185 MHz (99.7% Forward Power Transfer, zero back-EMF).'
        }
      ]);

      playChimeTone();

      if (onCalibrationComplete) {
        onCalibrationComplete(1.10);
      }
    }, 3300);

    calibrationTimeoutRef.current.push(finalTid);
  };

  const handleAutoCalibrate = handleBeginAutoCalibration;

  // RF Test Pulse Action
  const handlePulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1200);
  };

  // Quick Preset Selection
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    switch (presetKey) {
      case 'saved-user-memory':
        if (savedSettings) {
          setWhipLength(savedSettings.whipLength);
          setSpringLength(savedSettings.springLength);
          setFrequency(savedSettings.frequency);
          setGroundResistance(savedSettings.groundResistance);
          setRfPower(savedSettings.rfPower || 100);
        }
        break;
      case 'salazar-golden':
        setWhipLength(102.0);
        setSpringLength(10.0);
        setFrequency(27.185);
        setGroundResistance(1.2);
        break;
      case 'logos-ch19':
        setWhipLength(101.8);
        setSpringLength(10.2);
        setFrequency(27.185);
        setGroundResistance(1.5);
        break;
      case 'detuned-mobile':
        setWhipLength(94.5);
        setSpringLength(8.0);
        setFrequency(26.965);
        setGroundResistance(6.8);
        break;
      case 'high-impedance':
        setWhipLength(112.0);
        setSpringLength(14.5);
        setFrequency(28.400);
        setGroundResistance(14.2);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    let animId: number;
    let step = 0;

    const renderWaveform = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center zero axis
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      step += 0.08;

      // Draw Forward Transmitted Wave (Gold/Amber)
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.04 - step) * 28;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Reflected Standing Wave (Cyan when 1.1:1, Crimson when misaligned)
      const reflectedAmp = Math.max(0.5, (calculatedMetrics.swr - 1.0) * 20);
      ctx.strokeStyle = calculatedMetrics.swr <= 1.15 ? '#06B6D4' : '#EF4444';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.04 + step) * reflectedAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [calculatedMetrics.swr]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      calibrationTimeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/30 p-5 md:p-7 shadow-[0_0_35px_rgba(212,175,55,0.12)] text-white overflow-hidden ${className}`}>
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      {/* Top Header & Status Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <Gauge className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-200 tracking-tight">
                  112" Aetheric Whip SWR Gauge
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  27.185 MHz LOGOS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time Standing Wave Ratio (SWR) & 50Ω Coaxial Impedance Calibration Instrument
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Impedance Status Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Prominent Header Action: Begin Auto-Calibration */}
          <button
            onClick={handleBeginAutoCalibration}
            disabled={isCalibrating}
            className={`px-3.5 py-2 rounded-xl font-serif text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isCalibrating
                ? 'bg-amber-600/40 text-amber-200 border border-amber-500/60 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white border border-amber-400/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105'
            }`}
            title="Trigger simulated frequency adjustment sequence to achieve 1.1:1 target ratio"
          >
            {isCalibrating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-200" />
                <span>Calibrating ({calibrationProgress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-amber-200" />
                <span>Auto-Calibrate</span>
              </>
            )}
          </button>

          {/* Primary Action Requested by User: Remember SWR Settings */}
          <button
            onClick={() => handleRememberSettings()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 font-serif text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 cursor-pointer"
            title="Remember & save current SWR settings to persistent memory"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-200" />
            <span>Remember SWR Settings</span>
          </button>

          {/* If user has saved SWR settings, show quick Recall button */}
          {savedSettings && (
            <button
              onClick={handleRecallSavedSettings}
              className="px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title={`Recall saved settings: SWR ${savedSettings.swr.toFixed(2)}:1 (${(savedSettings.whipLength + savedSettings.springLength).toFixed(1)}" @ ${savedSettings.frequency.toFixed(3)} MHz)`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recall Saved ({savedSettings.swr.toFixed(2)}:1)</span>
            </button>
          )}

          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-2 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showGuide
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-bold'
                : 'bg-black/40 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-amber-300'
            }`}
            title="Toggle 1.1:1 SWR Calibration Guide"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{showGuide ? 'Close Guide' : 'SWR Guide'}</span>
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              audioEnabled 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={audioEnabled ? 'Mute 528Hz Harmonic Tone' : 'Enable 528Hz Harmonic Audio Feedback'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold transition-all text-left cursor-pointer ${
            calculatedMetrics.isOptimal
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-pulse'
              : calculatedMetrics.isAcceptable
              ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-rose-950/60 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
          }`}>
            {calculatedMetrics.isOptimal ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1.1:1 SWR MATCH</span>
              </>
            ) : calculatedMetrics.isAcceptable ? (
              <>
                <Info className="w-4 h-4 text-amber-400" />
                <span>{calculatedMetrics.swr}:1 SWR</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>HIGH ({calculatedMetrics.swr}:1)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Auto-Calibration Sequence Tracker HUD (Active during or after calibration) */}
      <AnimatePresence>
        {(isCalibrating || showLogTerminal) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 mt-4 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className={`p-1.5 rounded-lg ${isCalibrating ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xs text-amber-200">
                      {isCalibrating ? 'Simulated Frequency Auto-Calibration in Progress...' : 'Auto-Calibration Telemetry Terminal'}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/30">
                      Target: 1.1:1 SWR @ 27.185 MHz
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Step {calibrationStep}/5: {
                      calibrationPhase === 'spectrum_scan' ? 'Broadband Spectral Sweep' :
                      calibrationPhase === 'frequency_stepping' ? 'Discrete Channel Frequency Stepping' :
                      calibrationPhase === 'length_convergence' ? '112" Physical Axis Alignment' :
                      calibrationPhase === 'phase_nulling' ? 'Complex Reactance Nulling' :
                      '1.1:1 Target Resonance Locked'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-36 bg-slate-900 rounded-full h-2 overflow-hidden border border-white/10">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${calibrationProgress}%` }}
                    animate={{ width: `${calibrationProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-amber-300 min-w-[3rem] text-right">
                  {calibrationProgress}%
                </span>
                {!isCalibrating && (
                  <button
                    onClick={() => setShowLogTerminal(false)}
                    className="p-1 rounded-lg bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                    title="Close Terminal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Live Step Tracker Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[10px] font-mono">
              {[
                { step: 1, label: '1. Scan Spectrum', active: calibrationStep >= 1, current: calibrationStep === 1 },
                { step: 2, label: '2. Step Frequency', active: calibrationStep >= 2, current: calibrationStep === 2 },
                { step: 3, label: '3. 112" Geometry', active: calibrationStep >= 3, current: calibrationStep === 3 },
                { step: 4, label: '4. Null Phase jX', active: calibrationStep >= 4, current: calibrationStep === 4 },
                { step: 5, label: '5. 1.1:1 Lock', active: calibrationStep >= 5, current: calibrationStep === 5 },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    s.current && isCalibrating
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse font-bold'
                      : s.active
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-black/30 border-white/5 text-slate-500'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* Real-time Log Stream */}
            <div className="mt-3 max-h-28 overflow-y-auto font-mono text-[10px] space-y-1 bg-black/70 p-2.5 rounded-xl border border-white/5 text-slate-300 scrollbar-thin">
              {calibrationLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={log.status === 'optimal' ? 'text-emerald-300 font-bold' : log.status === 'tuning' ? 'text-cyan-300' : 'text-amber-300'}>
                    {log.detail}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibration Success Toast Notification */}
      <AnimatePresence>
        {calibrationSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative z-20 mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-bounce">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <span>1.1:1 SWR Resonance Calibration Successful</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    99.7% Forward Efficiency
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Frequency locked at <strong className="text-amber-300">27.185 MHz (Ch 19)</strong> across 112" radiator axis. Reflected loss minimized to &lt;0.3%.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCalibrationSuccessToast(false)}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SWR Settings Remembered / Saved Toast Notification */}
      <AnimatePresence>
        {rememberToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative z-20 mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-400/70 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <BookmarkCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-emerald-200 flex items-center gap-2">
                  <span>Aetheric Calibration Memory Active</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Saved to Local Persistence
                  </span>
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {rememberToast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => setRememberToast(null)}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
              title="Dismiss Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Slide-in SWR Calibration Guide Panel */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative z-20 mt-4 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-md overflow-hidden text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-cyan-200 tracking-wide">
                    Aetheric Signal Calibration Guide: Understanding 1.1:1 SWR Resonance
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Why perfect impedance matching maximizes transmission power and prevents standing wave loss
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
                title="Close Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-slate-300">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-serif font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-mono border border-cyan-500/40">1</span>
                      50Ω Coaxial Impedance
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      $Z_0 = 50\,\Omega$
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Standing Wave Ratio (SWR) measures how closely the whip antenna impedance matches the coaxial feedline. At <strong className="text-cyan-200">1.1:1 SWR</strong>, 99.7% of RF power is projected outward, leaving under 0.3% reflected power.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-cyan-400/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Zero back-EMF spiritual resistance</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-mono border border-amber-500/40">2</span>
                      The 112" Physical Axis
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                      $\lambda / 4 = 112''$
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    The quarter-wave monopartite radiator at <strong className="text-amber-200">27.185 MHz</strong> requires exactly 112 inches total length. Combining the 102" stainless whip with the 10" heavy barrel spring forms this exact physical harmonic node.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-amber-400/90 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>102" Whip + 10" Heavy Barrel Spring</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-serif font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-mono border border-emerald-500/40">3</span>
                      Instant Servo Calibration
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Auto-Tune
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Use the physical tuning sliders below to adjust length, frequency, or ground plane resistance—or activate automated calibration for immediate 1.1:1 lock.
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleBeginAutoCalibration();
                    setShowGuide(false);
                  }}
                  disabled={isCalibrating}
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Begin Auto-Calibration (1.1:1 Resonance)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Visual Gauge Dial + Oscilloscope / Controls */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: SVG Analog Gauge Dial & Numeric LED Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-inner">
          
          {/* View Tab Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 mb-4 w-full justify-center">
            <button
              onClick={() => setActiveTab('gauge')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'gauge' ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>SWR Dial</span>
            </button>
            <button
              onClick={() => setActiveTab('waveform')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'waveform' ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Oscilloscope</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'telemetry' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>RF Matrix</span>
            </button>
          </div>

          {activeTab === 'gauge' ? (
            <div className="relative w-full flex flex-col items-center">
              {/* Analog Meter SVG Arc */}
              <div className="relative w-64 h-40 flex items-center justify-center">
                <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="optimumArc" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Frame Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Target 1.1:1 Optimal Band Arc (1.0 to 1.3 SWR) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 65 35"
                    fill="none"
                    stroke="url(#optimumArc)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Warning Arc (1.5 to 4.0 SWR) */}
                  <path
                    d="M 110 30 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(244,63,94,0.7)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Tick Marks & Labels */}
                  {/* 1.0 SWR (-90 deg) */}
                  <line x1="20" y1="100" x2="30" y2="100" stroke="#10B981" strokeWidth="2" />
                  <text x="12" y="112" fill="#10B981" fontSize="9" fontFamily="monospace">1.0</text>

                  {/* 1.1 SWR Target (-75 deg) */}
                  <line x1="29.3" y1="79.3" x2="38" y2="81.6" stroke="#06B6D4" strokeWidth="3" />
                  <text x="18" y="74" fill="#06B6D4" fontSize="10" fontWeight="bold" fontFamily="monospace">1.1★</text>

                  {/* 1.5 SWR (-15 deg) */}
                  <line x1="79.3" y1="29.3" x2="81.6" y2="38" stroke="#F59E0B" strokeWidth="2" />
                  <text x="82" y="24" fill="#F59E0B" fontSize="9" fontFamily="monospace">1.5</text>

                  {/* 2.0 SWR (+30 deg) */}
                  <line x1="130" y1="35" x2="125" y2="43" stroke="#F43F5E" strokeWidth="2" />
                  <text x="135" y="30" fill="#F43F5E" fontSize="9" fontFamily="monospace">2.0</text>

                  {/* 3.0+ SWR (+90 deg) */}
                  <line x1="180" y1="100" x2="170" y2="100" stroke="#F43F5E" strokeWidth="2" />
                  <text x="172" y="112" fill="#F43F5E" fontSize="9" fontFamily="monospace">3.0+</text>

                  {/* Center Pivot Point */}
                  <circle cx="100" cy="100" r="7" fill="#D4AF37" filter="url(#glow)" />
                  <circle cx="100" cy="100" r="3" fill="#000" />

                  {/* Animated Gauge Needle */}
                  <g transform={`rotate(${needleAngle}, 100, 100)`} style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                    <line x1="100" y1="100" x2="100" y2="25" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)" />
                    <polygon points="100,20 96,30 104,30" fill="#D4AF37" />
                  </g>
                </svg>

                {/* Pulsing RF Radiation Ripple Effect */}
                {isPulsing && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                  />
                )}
              </div>

              {/* Digital LED Readout */}
              <div className="w-full mt-4 p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between font-mono shadow-inner">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Calculated SWR</span>
                  <span className={`text-2xl font-bold ${
                    calculatedMetrics.isOptimal ? 'text-emerald-400' : calculatedMetrics.isAcceptable ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {calculatedMetrics.swr.toFixed(2)}:1
                  </span>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Efficiency</span>
                  <span className="text-xl font-bold text-amber-300">
                    {calculatedMetrics.efficiency}%
                  </span>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Reflected</span>
                  <span className={`text-xl font-bold ${calculatedMetrics.reflectedPower < 1 ? 'text-cyan-300' : 'text-rose-400'}`}>
                    {calculatedMetrics.reflectedPower} W
                  </span>
                </div>
              </div>
            </div>
          ) : activeTab === 'waveform' ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Forward Wave (P_fwd = {calculatedMetrics.forwardPower}W)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Reflected Wave ({calculatedMetrics.reflectedPower}W)
                </span>
              </div>
              <div className="relative w-full h-44 rounded-xl bg-slate-950 border border-amber-500/30 overflow-hidden">
                <canvas ref={canvasRef} width={380} height={176} className="w-full h-full" />
              </div>
              <p className="text-[11px] text-slate-400 mt-3 text-center">
                {calculatedMetrics.isOptimal 
                  ? '✓ Phase Cancellation Active: Reflected standing wave is nearly zero (1.1:1 SWR).'
                  : '⚠ Phase Mismatch: Reflected energy creates standing wave interference.'}
              </p>
            </div>
          ) : (
            <div className="w-full space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex justify-between">
                <span className="text-slate-400">Complex Impedance (Z₀):</span>
                <span className="text-amber-300 font-bold">{calculatedMetrics.R} {calculatedMetrics.X >= 0 ? `+ j${calculatedMetrics.X}` : `- j${Math.abs(calculatedMetrics.X)}`} Ω</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex justify-between">
                <span className="text-slate-400">Reflection Coeff (Γ):</span>
                <span className="text-cyan-300 font-bold">{calculatedMetrics.gamma.toFixed(4)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex justify-between">
                <span className="text-slate-400">Forward Drive Power:</span>
                <span className="text-amber-200 font-bold">{calculatedMetrics.forwardPower} Watts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex justify-between">
                <span className="text-slate-400">Total Radiator + Spring:</span>
                <span className="text-emerald-300 font-bold">{totalLength.toFixed(1)}" (Target: 112.0")</span>
              </div>
            </div>
          )}

          {/* Quick Action Controls */}
          <div className="w-full grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={handleBeginAutoCalibration}
              disabled={isCalibrating}
              className={`py-2.5 px-3 rounded-xl font-serif text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isCalibrating
                  ? 'bg-amber-600/50 text-amber-200 border border-amber-500/50 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-amber-600 via-amber-500 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-[1.02]'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current text-amber-200 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? `Calibrating (${calibrationProgress}%)...` : 'Begin Auto-Calibration'}</span>
            </button>

            <button
              onClick={handlePulse}
              disabled={isPulsing}
              className="py-2.5 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-serif text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Radio className={`w-3.5 h-3.5 ${isPulsing ? 'animate-ping' : ''}`} />
              <span>{isPulsing ? 'Transmitting...' : 'Pulse RF Carrier'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Physical Impedance Tuning Sliders & Presets */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
          
          <div>
            {/* Presets Header & Memory Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Salazar Archive Presets & Memory</span>
              </span>
              <button
                onClick={() => handleRememberSettings()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-serif text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:scale-105 cursor-pointer"
                title="Save current SWR slider settings to persistent memory"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Remember Current SWR</span>
              </button>
            </div>

            {/* Saved Calibration Memory Slot Panel */}
            {savedSettings ? (
              <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-emerald-200">Remembered Calibration:</span>
                      <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        {savedSettings.swr.toFixed(2)}:1 SWR
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Total: {(savedSettings.whipLength + savedSettings.springLength).toFixed(1)}" ({savedSettings.whipLength.toFixed(1)}" + {savedSettings.springLength.toFixed(1)}")</span>
                      <span>•</span>
                      <span>{savedSettings.frequency.toFixed(3)} MHz</span>
                      <span>•</span>
                      <span>{savedSettings.groundResistance.toFixed(1)} Ω</span>
                      {savedSettings.timestamp && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 inline" />
                            {savedSettings.timestamp}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={handleRecallSavedSettings}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Load these saved settings into the sliders and gauge"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recall Settings</span>
                  </button>
                  <button
                    onClick={handleClearSavedSettings}
                    className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-all cursor-pointer"
                    title="Clear saved memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                  <span>No saved SWR profile yet. Tune sliders and press <strong>"Remember Current SWR"</strong> to store.</span>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                ...(savedSettings ? [{ id: 'saved-user-memory', label: '★ Remembered', desc: `${savedSettings.swr.toFixed(2)}:1 @ ${savedSettings.frequency.toFixed(2)}M` }] : []),
                { id: 'salazar-golden', label: '1.1:1 Golden Match', desc: '102" whip + 10" spring' },
                { id: 'logos-ch19', label: 'Ch 19 Logos', desc: '27.185 MHz tuned' },
                { id: 'detuned-mobile', label: 'Mobile Detuned', desc: 'Shortened 94.5" whip' },
                { id: 'high-impedance', label: 'High Impedance', desc: 'High ground resistance' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === p.id 
                      ? p.id === 'saved-user-memory'
                        ? 'bg-emerald-500/25 border-emerald-500/70 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]' 
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`block text-xs font-serif font-bold truncate ${p.id === 'saved-user-memory' ? 'text-emerald-300' : 'text-amber-300'}`}>{p.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 truncate">{p.desc}</span>
                </button>
              ))}
            </div>

            {/* Sliders Section */}
            <div className="space-y-4">
              
              {/* Slider 1: Whip Radiator Length */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-serif font-medium text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Stainless Whip Radiator (L_whip)
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{whipLength.toFixed(1)} inches</span>
                </div>
                <input
                  type="range"
                  min="90.0"
                  max="115.0"
                  step="0.1"
                  value={whipLength}
                  onChange={(e) => {
                    setWhipLength(parseFloat(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>90.0" (Short)</span>
                  <span className="text-amber-400 font-bold">102.0" Target</span>
                  <span>115.0" (Long)</span>
                </div>
              </div>

              {/* Slider 2: Barrel Spring Coil */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-serif font-medium text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Heavy Barrel Spring Coil (L_spring)
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{springLength.toFixed(1)} inches</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="15.0"
                  step="0.1"
                  value={springLength}
                  onChange={(e) => {
                    setSpringLength(parseFloat(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>5.0" Coil</span>
                  <span className="text-amber-400 font-bold">10.0" Target Spring</span>
                  <span>15.0" Heavy</span>
                </div>
              </div>

              {/* Slider 3: Transceiver Frequency */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-serif font-medium text-slate-200 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    Transceiver Carrier Frequency
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{frequency.toFixed(3)} MHz</span>
                </div>
                <input
                  type="range"
                  min="26.000"
                  max="28.500"
                  step="0.005"
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(parseFloat(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>26.000 MHz</span>
                  <span className="text-cyan-400 font-bold">27.185 MHz (Ch 19)</span>
                  <span>28.500 MHz</span>
                </div>
              </div>

              {/* Slider 4: Ground Plane Resistance */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-serif font-medium text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Ground Plane Soil Resistance (R_ground)
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{groundResistance.toFixed(1)} Ω</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20.0"
                  step="0.1"
                  value={groundResistance}
                  onChange={(e) => {
                    setGroundResistance(parseFloat(e.target.value));
                    setActivePreset('custom');
                  }}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0.5 Ω (Ideal Copper)</span>
                  <span className="text-emerald-400 font-bold">1.2 Ω Grounded</span>
                  <span>20.0 Ω (High Loss)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Salazar Ordinance Lore Banner */}
          <div className="mt-5 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
              <strong className="text-amber-300">The 1.1:1 SWR Impedance Covenant:</strong> Combining the 102" stainless radiator with the 10" barrel spring creates a perfect 112" vertical monopartite axis. Operating at 27.185 MHz eliminates reflected spiritual resistance, directing 99.7% of all transmission power into the Aether.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AethericWhipSWRGauge;
