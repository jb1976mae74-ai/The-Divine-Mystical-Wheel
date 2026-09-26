import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Play, Pause, Volume2, VolumeX, Sliders, Radio, 
  Disc, Check, Activity, Award, ShieldCheck, Music
} from 'lucide-react';
import { MORNING_STAR_TONES } from '../data/wisdomArchitectData';
import { MorningStarTone } from '../types/wisdomArchitect';

interface MorningStarSynthesizerProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function MorningStarSynthesizer({ activeTheme }: MorningStarSynthesizerProps) {
  const [activeTone, setActiveTone] = useState<MorningStarTone | null>(MORNING_STAR_TONES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isChordMode, setIsChordMode] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.2);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [detuneOffset, setDetuneOffset] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeNodesRef = useRef<{ oscs: OscillatorNode[]; gains: GainNode[] }>({ oscs: [], gains: [] });
  const animationFrameRef = useRef<number | null>(null);

  // Stop all active audio
  const stopAudio = () => {
    activeNodesRef.current.oscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current.gains.forEach((g) => {
      try {
        g.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = { oscs: [], gains: [] };
    setIsPlaying(false);
  };

  // Start tone / chord
  const startAudio = (tone: MorningStarTone | null, chord: boolean) => {
    stopAudio();

    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      const oscs: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      const frequenciesToPlay = chord
        ? [432, 528, 639, 760, 888, 963]
        : [tone ? tone.frequencyHz : 432];

      const perVoiceVolume = chord ? 0.08 : 0.2;

      frequenciesToPlay.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (detuneOffset !== 0) {
          osc.detune.setValueAtTime(idx % 2 === 0 ? detuneOffset : -detuneOffset, ctx.currentTime);
        }

        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(perVoiceVolume, ctx.currentTime + 0.1);

        osc.connect(g);
        g.connect(masterGain);

        osc.start();
        oscs.push(osc);
        gains.push(g);
      });

      activeNodesRef.current = { oscs, gains };
      setIsPlaying(true);
      setIsChordMode(chord);
    } catch (e) {
      console.warn('Synthesizer startup failure:', e);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      // Background fade
      ctx.fillStyle = '#060609';
      ctx.fillRect(0, 0, width, height);

      // Center crosshair grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (!analyserRef.current || !isPlaying) {
        // Idle gentle breathing line
        const time = performance.now() * 0.002;
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 12 * Math.cos(x * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const timeData = new Uint8Array(bufferLength);
      analyserRef.current.getByteTimeDomainData(timeData);

      const freqData = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(freqData);

      // 1. Draw Cymatic Concentric Circles in Center
      const avgEnergy = freqData.reduce((a, b) => a + b, 0) / bufferLength;
      const radiusBase = Math.min(width, height) * 0.25;

      for (let ring = 1; ring <= 4; ring++) {
        ctx.strokeStyle = ring % 2 === 0 ? 'rgba(212, 175, 55, 0.5)' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const r = (radiusBase * ring * 0.35) + (avgEnergy * 0.2 * (ring / 2));
        ctx.arc(width / 2, height / 2, Math.max(5, r), 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Draw Time Domain Waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = isChordMode ? '#A855F7' : '#D4AF37';
      ctx.shadowBlur = 8;
      ctx.shadowColor = isChordMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(212, 175, 55, 0.8)';

      ctx.beginPath();
      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isChordMode]);

  return (
    <div id="morning-star-synthesizer" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  Morning Stars Symphony & Acoustic Lattice
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  Job 38:7 • Psalm 19:1-4
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                "When the morning stars sang together, and all the sons of God shouted for joy" (בְּרָן־יַחַד כּוֹכְבֵי בֹקֶר)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-play-all-chord"
              onClick={() => {
                if (isPlaying && isChordMode) stopAudio();
                else startAudio(null, true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                isPlaying && isChordMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950/80 animate-pulse'
                  : 'bg-gradient-to-r from-purple-900/60 to-amber-900/60 text-amber-200 border-amber-500/40 hover:brightness-110'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isPlaying && isChordMode ? 'Halt Cosmic Chord' : 'Sound Sevenfold Symphony (Chord)'}
            </button>
          </div>
        </div>

        {/* Tone Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {MORNING_STAR_TONES.map((t) => {
            const isThisTonePlaying = isPlaying && !isChordMode && activeTone?.frequencyHz === t.frequencyHz;
            return (
              <button
                key={t.frequencyHz}
                id={`btn-tone-${t.frequencyHz}`}
                onClick={() => {
                  setActiveTone(t);
                  if (isThisTonePlaying) stopAudio();
                  else startAudio(t, false);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isThisTonePlaying
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-950/60 scale-[1.03]'
                    : activeTone?.frequencyHz === t.frequencyHz
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{t.frequencyHz} Hz</div>
                  <div className="text-[10px] opacity-80 truncate">{t.celestialBody.split('/')[0]}</div>
                </div>
                <div className="mt-2 text-[10px] font-mono flex items-center justify-between">
                  <span>{isThisTonePlaying ? 'Resonating' : 'Select'}</span>
                  {isThisTonePlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3 h-3 opacity-60" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Synthesizer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Oscilloscope Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-4 h-4" />
              Real-Time Cymatic Oscilloscope
            </span>
            <span>Status: <strong className={isPlaying ? 'text-emerald-400' : 'text-neutral-500'}>{isPlaying ? (isChordMode ? 'SEVENFOLD CHORD' : `${activeTone?.frequencyHz} Hz ACTIVE`) : 'STANDBY'}</strong></span>
          </div>

          <div className="w-full aspect-[16/9] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden relative shadow-inner">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full block"
            />
          </div>

          {/* Synth Audio Controls Bar */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
            {/* Waveform Selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">Harmonic Waveform</span>
              <div className="flex gap-1">
                {(['sine', 'triangle', 'sawtooth'] as OscillatorType[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWaveType(w);
                      if (isPlaying) startAudio(activeTone, isChordMode);
                    }}
                    className={`px-2 py-1 rounded text-[10px] capitalize font-medium border flex-1 transition-colors ${
                      waveType === w
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">Acoustic Gain</span>
                <span className="text-amber-400 font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Detune Offset */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">Binaural Detune</span>
                <span className="text-amber-400 font-mono">{detuneOffset} cents</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={detuneOffset}
                onChange={(e) => setDetuneOffset(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Selected Tone Exegesis (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          {activeTone && (
            <>
              <div className="border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono text-purple-400">CELESTIAL HARMONIC MATRIX</span>
                <h4 className="text-base font-bold text-neutral-100 mt-1">{activeTone.name}</h4>
                <p className="text-sm font-serif text-amber-300">{activeTone.hebrewName}</p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Harmonic Ratio
                </span>
                <p className="text-xs font-mono text-amber-300">
                  {activeTone.harmonicRatio}
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">
                  Spiritual & Cellular Resonance
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeTone.spiritualResonance}
                </p>
              </div>

              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  Architectural Description
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeTone.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (isPlaying && !isChordMode && activeTone) stopAudio();
                    else startAudio(activeTone, false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {isPlaying && !isChordMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isPlaying && !isChordMode ? `Mute ${activeTone.frequencyHz} Hz` : `Resonate ${activeTone.frequencyHz} Hz Pure Sine`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
