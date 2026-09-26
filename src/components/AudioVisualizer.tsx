/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { audioSystem } from '../utils/audioSystem';

interface AudioVisualizerProps {
  isSpeaking: boolean;
  soundEnabled: boolean;
  activeTheme: {
    id: string;
    textPrimary: string;
    textAccentHex: string;
    accentGlow: string;
  };
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  orbitRadius: number;
  angle: number;
  speed: number;
}

export default function AudioVisualizer({ isSpeaking, soundEnabled, activeTheme }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const frequencyArrayRef = useRef<Uint8Array>(new Uint8Array(256));

  // Determine colors based on active theme
  const getThemeColorPalette = () => {
    switch (activeTheme.id) {
      case 'deep-void':
        return {
          glow: 'rgba(192, 132, 252, 0.45)',
          core: '#c084fc',
          accent: '#818cf8',
          particleColors: ['#c084fc', '#e9d5ff', '#818cf8', '#a78bfa', '#6366f1']
        };
      case 'ethereal-silver':
        return {
          glow: 'rgba(203, 213, 225, 0.4)',
          core: '#cbd5e1',
          accent: '#38bdf8',
          particleColors: ['#cbd5e1', '#f1f5f9', '#38bdf8', '#7dd3fc', '#94a3b8']
        };
      case 'ancient-gold':
      default:
        return {
          glow: 'rgba(212, 175, 55, 0.45)',
          core: '#D4AF37',
          accent: '#f59e0b',
          particleColors: ['#D4AF37', '#FFECA1', '#f59e0b', '#fbbf24', '#d97706']
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define coordinates matching the 1000x1000 Heptagram SVG coordinate space
    const center = { x: 500, y: 500 };
    const starRadius = 250;
    const baseCircleRadius = 280;

    // Precalculate the 7 vertices of the heptagram
    const starVertices = Array.from({ length: 7 }, (_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
      return {
        x: center.x + starRadius * Math.cos(angle),
        y: center.y + starRadius * Math.sin(angle),
        angle
      };
    });

    // Handle audio system sync
    audioSystem.setMute(!soundEnabled);

    const dataArray = frequencyArrayRef.current;

    const render = () => {
      // Clear canvas with subtle trails
      ctx.clearRect(0, 0, 1000, 1000);

      // Fetch speech frequency inputs if active and allowed
      let averageFrequency = 0;
      let activePulse = 0;

      if (isSpeaking && soundEnabled) {
        audioSystem.getFrequencyData(dataArray);
        
        let sum = 0;
        let count = 0;
        // Only average the vocal-midband registers (bins ~15 to 110)
        for (let i = 15; i < 110; i++) {
          sum += dataArray[i];
          count++;
        }
        averageFrequency = sum / (count || 1);
        activePulse = audioSystem.getActiveWordBounce();
      } else {
        dataArray.fill(0);
      }

      const palette = getThemeColorPalette();

      // Ensure a beautiful standby baseline movement using trig breathing waveforms
      const timeMs = Date.now();
      const standbyAmplitude = 4;
      const standbySpeed = timeMs / 1800;
      const breathingScaler = 1.0 + 0.05 * Math.sin(timeMs / 1200);

      const dynamicScale = isSpeaking && soundEnabled ? 1.0 + (averageFrequency / 255) * 0.16 : breathingScaler;

      // ==========================================
      // 1. BACKING VOCAL CORE GLOW & PULSE
      // ==========================================
      const absoluteBoundScore = activePulse * 160 + (isSpeaking ? averageFrequency * 0.45 : Math.sin(timeMs / 400) * 4 + 4);
      if (absoluteBoundScore > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(center.x, center.y, 55 + absoluteBoundScore * 0.45, 0, Math.PI * 2);
        const coreGradient = ctx.createRadialGradient(
          center.x, center.y, 10,
          center.x, center.y, 56 + absoluteBoundScore * 0.5
        );
        coreGradient.addColorStop(0, `${palette.core}2b`);
        coreGradient.addColorStop(0.5, `${palette.accent}0f`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.fill();
        ctx.restore();
      }

      // ==========================================
      // 2. CONCENTRIC SACRED SINE RESONANCE WAVES
      // ==========================================
      const waveCount = isSpeaking && soundEnabled ? 3 : 2;
      for (let w = 0; w < waveCount; w++) {
        ctx.save();
        ctx.beginPath();

        const pointCount = 90;
        const radiusOffset = 45 * (w + 1);
        const waveRadius = baseCircleRadius * dynamicScale;

        for (let i = 0; i <= pointCount; i++) {
          const theta = (i * Math.PI * 2) / pointCount;
          
          // Map index to the FFT data
          const fftIndex = Math.min(255, Math.floor((i / pointCount) * 80) + 10);
          const rawBinVal = dataArray[fftIndex];
          
          let distortion = 0;
          if (isSpeaking && soundEnabled) {
            // Apply radial offset based on actual voice frequencies
            distortion = (rawBinVal / 255) * (42 + w * 12);
            // Mix slow rolling phase shift to keep the visualizer liquid
            distortion *= Math.sin(theta * (4 + w) + timeMs / 250);
          } else {
            // Standby beautiful breath ripples
            distortion = standbyAmplitude * Math.sin(theta * 6 + standbySpeed * 2 + w * Math.PI);
          }

          const currentR = waveRadius + distortion;
          const x = center.x + currentR * Math.cos(theta);
          const y = center.y + currentR * Math.sin(theta);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.strokeStyle = w === 0 ? palette.core : palette.accent;
        ctx.lineWidth = w === 0 ? 2 : 1.2;
        // Make active voice waves highly radiant, standby waves beautifully faint
        const alpha = isSpeaking && soundEnabled 
          ? Math.max(0.18, 0.65 - w * 0.18) 
          : 0.12 - w * 0.04;
        ctx.strokeStyle = `${w === 0 ? palette.core : palette.accent}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = isSpeaking ? 12 : 5;
        ctx.shadowColor = palette.glow;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 3. EMIT COGNITIVE SPARKLES (PARTICLES)
      // ==========================================
      const particleList = particlesRef.current;
      
      // Determine spawning triggers
      const spawnChance = isSpeaking ? Math.min(0.85, 0.2 + averageFrequency / 120) : 0.035;
      
      if (Math.random() < spawnChance) {
        // Decide spawn position: either Center (500,500) or one of the 7 Heptagram star vertices
        const spawnAtCenter = Math.random() < 0.35 && isSpeaking;
        
        let spawnX = center.x;
        let spawnY = center.y;
        let baseAngle = Math.random() * Math.PI * 2;
        
        if (!spawnAtCenter) {
          const vertex = starVertices[Math.floor(Math.random() * starVertices.length)];
          spawnX = vertex.x;
          spawnY = vertex.y;
          baseAngle = vertex.angle + (Math.random() * 0.5 - 0.25);
        }

        const particleVelocity = isSpeaking 
          ? 1.5 + (averageFrequency / 255) * 4.5 + Math.random() * 2 
          : 0.4 + Math.random() * 0.4;

        const maxLife = isSpeaking 
          ? 60 + Math.random() * 50 
          : 120 + Math.random() * 80;

        const randomColor = palette.particleColors[Math.floor(Math.random() * palette.particleColors.length)];

        const particle: SparkleParticle = {
          x: spawnX,
          y: spawnY,
          vx: Math.cos(baseAngle) * particleVelocity * (spawnAtCenter ? 1.0 : 0.5),
          vy: Math.sin(baseAngle) * particleVelocity * (spawnAtCenter ? 1.0 : 0.5),
          size: (isSpeaking ? 2.0 + Math.random() * 3.5 : 1.2 + Math.random() * 1.5) * (1 + activePulse * 2.5),
          alpha: 1.0,
          maxLife: maxLife,
          life: maxLife,
          color: randomColor,
          orbitRadius: Math.sqrt(Math.pow(spawnX - center.x, 2) + Math.pow(spawnY - center.y, 2)),
          angle: Math.atan2(spawnY - center.y, spawnX - center.x),
          speed: (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
        };

        particleList.push(particle);
      }

      // Render & Update particles
      for (let i = particleList.length - 1; i >= 0; i--) {
        const p = particleList[i];
        p.life--;

        if (p.life <= 0) {
          particleList.splice(i, 1);
          continue;
        }

        p.alpha = p.life / p.maxLife;

        if (isSpeaking) {
          // Vortex forces: gravitate particles towards orbits and rotate them
          p.angle += p.speed * (1.0 + averageFrequency / 120);
          p.orbitRadius += p.vx * 1.05 + Math.sin(timeMs / 300) * 0.4;
          
          // Gradually pull particles back into orbit bound
          const targetRad = baseCircleRadius * dynamicScale;
          p.orbitRadius += (targetRad - p.orbitRadius) * 0.012;

          p.x = center.x + p.orbitRadius * Math.cos(p.angle);
          p.y = center.y + p.orbitRadius * Math.sin(p.angle);
        } else {
          // Silent drift: floating slowly upwards
          p.x += p.vx;
          p.y += p.vy - 0.22; // subtle rising drift
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = isSpeaking ? p.size * 2 : 2;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, soundEnabled, activeTheme]);

  return (
    <canvas
      id="sacredAudioVisualizerCanvas"
      ref={canvasRef}
      width={1000}
      height={1000}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
