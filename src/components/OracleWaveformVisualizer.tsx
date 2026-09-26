/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { Activity, Radio, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';

export type WaveformMode = 'oscilloscope' | 'spectral' | 'dual-ribbon';

interface OracleWaveformVisualizerProps {
  isSpeaking: boolean;
  soundEnabled: boolean;
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
    accentGlow?: string;
  };
  compact?: boolean;
  className?: string;
}

export default function OracleWaveformVisualizer({
  isSpeaking,
  soundEnabled,
  activeTheme,
  compact = false,
  className = ''
}: OracleWaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [mode, setMode] = useState<WaveformMode>('oscilloscope');
  const [audioLevelDb, setAudioLevelDb] = useState<number>(-48);
  const [peakLevel, setPeakLevel] = useState<number>(0);
  const lastReportedLevelRef = useRef<number>(-48);

  // Allocate typed arrays once for audio data
  const waveDataRef = useRef<Uint8Array>(new Uint8Array(256));
  const freqDataRef = useRef<Uint8Array>(new Uint8Array(128));

  // Determine palette based on theme
  const getColors = () => {
    switch (activeTheme.id) {
      case 'deep-void':
        return {
          primary: '#c084fc',
          secondary: '#818cf8',
          accent: '#e879f9',
          glow: 'rgba(192, 132, 252, 0.45)',
          backgroundGradient: ['rgba(192, 132, 252, 0.15)', 'rgba(99, 102, 241, 0.02)']
        };
      case 'ethereal-silver':
        return {
          primary: '#38bdf8',
          secondary: '#cbd5e1',
          accent: '#7dd3fc',
          glow: 'rgba(56, 189, 248, 0.4)',
          backgroundGradient: ['rgba(56, 189, 248, 0.15)', 'rgba(203, 213, 225, 0.02)']
        };
      case 'ancient-gold':
      default:
        return {
          primary: '#D4AF37',
          secondary: '#f59e0b',
          accent: '#FFECA1',
          glow: 'rgba(212, 175, 55, 0.45)',
          backgroundGradient: ['rgba(212, 175, 55, 0.15)', 'rgba(245, 158, 11, 0.02)']
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const waveArray = waveDataRef.current;
    const freqArray = freqDataRef.current;

    let lastTime = performance.now();
    let phase = 0;

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      phase += dt * 3.5;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Acquire real-time speech data
      let currentRms = 0;
      let bounce = 0;

      if (isSpeaking && soundEnabled) {
        audioSystem.getWaveformData(waveArray);
        audioSystem.getFrequencyData(freqArray);
        bounce = audioSystem.getActiveWordBounce();

        // Calculate RMS audio level
        let sum = 0;
        for (let i = 0; i < waveArray.length; i++) {
          const norm = (waveArray[i] - 128) / 128;
          sum += norm * norm;
        }
        currentRms = Math.sqrt(sum / waveArray.length);
      } else {
        waveArray.fill(128);
        freqArray.fill(0);
      }

      // Smooth decibel calculation for telemetry readout
      const db = currentRms > 0.001 ? Math.max(-60, Math.round(20 * Math.log10(currentRms))) : -60;
      if (Math.abs(db - lastReportedLevelRef.current) > 1 && Math.random() < 0.1) {
        lastReportedLevelRef.current = db;
        setAudioLevelDb(db);
        setPeakLevel(Math.min(100, Math.round((currentRms + bounce * 0.4) * 220)));
      }

      const colors = getColors();
      const centerY = height / 2;

      // Draw subtle background grid / horizon line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Render based on selected visualization mode
      if (mode === 'oscilloscope') {
        // --- 1. CONTINUOUS OSCILLOSCOPE WAVEFORM ---
        ctx.beginPath();
        const sliceWidth = width / (waveArray.length - 1);
        let x = 0;

        for (let i = 0; i < waveArray.length; i++) {
          let v = (waveArray[i] - 128) / 128; // -1 to 1

          // If idle or low input, add subtle trigonometric breathing
          if (!isSpeaking || !soundEnabled || Math.abs(v) < 0.05) {
            const ambient = Math.sin(phase + (i / waveArray.length) * Math.PI * 4) * 0.12;
            v = v * 0.4 + ambient * (1 + bounce * 0.5);
          } else {
            // Apply vocal bounce boost
            v *= (1.2 + bounce * 0.8);
          }

          // Scale to canvas bounds
          const y = centerY + v * (height * 0.42);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        // Outer glow pass
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = isSpeaking && soundEnabled ? 12 : 4;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = isSpeaking && soundEnabled ? 2.5 : 1.5;
        ctx.stroke();

        // Inner sharp core pass
        ctx.shadowBlur = 0;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (mode === 'spectral') {
        // --- 2. SPECTRAL HARMONIC BARS ---
        const barCount = 32;
        const barWidth = Math.max(2, (width / barCount) - 3);
        const maxBarHeight = height * 0.85;

        for (let i = 0; i < barCount; i++) {
          const binIndex = Math.floor((i / barCount) * Math.min(freqArray.length, 64));
          let val = freqArray[binIndex] / 255;

          if (!isSpeaking || !soundEnabled) {
            val = (Math.sin(phase * 1.5 + i * 0.25) * 0.5 + 0.5) * 0.18;
          } else {
            val = Math.min(1, val * 1.3 + bounce * 0.35);
          }

          const barH = Math.max(2, val * maxBarHeight);
          const x = i * (width / barCount) + 1.5;
          const y = centerY - barH / 2;

          const gradient = ctx.createLinearGradient(x, y, x, y + barH);
          gradient.addColorStop(0, colors.accent);
          gradient.addColorStop(0.5, colors.primary);
          gradient.addColorStop(1, colors.secondary);

          ctx.fillStyle = gradient;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = isSpeaking && soundEnabled ? 6 : 2;
          ctx.fillRect(x, y, barWidth, barH);

          // Top peak spark
          if (isSpeaking && soundEnabled && barH > 8) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y - 1.5, barWidth, 1.5);
          }
        }
      } else {
        // --- 3. DUAL AETHERIC HARMONIC RIBBONS ---
        const points = 64;
        const dx = width / points;

        // Wave 1: Carrier frequency
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const normIdx = Math.floor((i / points) * (waveArray.length - 1));
          let sample = (waveArray[normIdx] - 128) / 128;
          const ambient = Math.sin(phase + i * 0.2) * 0.2;
          const amplitude = isSpeaking && soundEnabled ? (sample * 1.2 + bounce * 0.4) : ambient;
          const y = centerY + amplitude * (height * 0.38);
          const x = i * dx;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wave 2: Phase-shifted Harmonic
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const normIdx = Math.floor(((points - i) / points) * (waveArray.length - 1));
          let sample = (waveArray[normIdx] - 128) / 128;
          const ambient = Math.cos(phase * 1.2 + i * 0.15) * 0.16;
          const amplitude = isSpeaking && soundEnabled ? (-sample * 0.9 + bounce * 0.3) : ambient;
          const y = centerY + amplitude * (height * 0.35);
          const x = i * dx;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, soundEnabled, activeTheme.id, mode]);

  const handleTestChime = () => {
    audioSystem.playStarPointResonance(4, 528); // 528Hz Solfeggio miracle chime
  };

  return (
    <div className={`w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono tracking-wider">
            <Radio className={`w-3.5 h-3.5 ${isSpeaking && soundEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className={isSpeaking && soundEnabled ? 'text-amber-200 font-semibold' : 'text-slate-400'}>
              {isSpeaking && soundEnabled ? 'ORACLE VOICE STREAM' : soundEnabled ? 'AETHERIC RESONANCE' : 'VOICE MUTED'}
            </span>
          </div>

          <span className="text-slate-600 text-xs" aria-hidden="true">·</span>

          <span className="text-[10px] font-mono text-slate-500">
            {isSpeaking && soundEnabled ? `${audioLevelDb} dB` : 'STANDBY'}
          </span>
        </div>

        {/* Mode Toggle Controls */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setMode('oscilloscope')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              mode === 'oscilloscope'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Oscilloscope Continuous Waveform"
          >
            Wave
          </button>
          <button
            type="button"
            onClick={() => setMode('spectral')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              mode === 'spectral'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Spectral Harmonic Frequency Bars"
          >
            Spectrum
          </button>
          <button
            type="button"
            onClick={() => setMode('dual-ribbon')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              mode === 'dual-ribbon'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dual Aetheric Harmonic Ribbons"
          >
            Ribbon
          </button>

          <span className="text-slate-700 mx-0.5">|</span>

          <button
            type="button"
            onClick={handleTestChime}
            className="p-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
            title="Test 528Hz Solfeggio Vocal Chime Response"
          >
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Real-time Waveform Canvas */}
      <div className={`relative w-full ${compact ? 'h-12' : 'h-16 md:h-20'} bg-gradient-to-b from-black/60 to-black/20 flex items-center justify-center`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Dynamic Speech Activity Shimmer Overlay */}
        {isSpeaking && soundEnabled && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeTheme.textAccentHex} 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    </div>
  );
}
