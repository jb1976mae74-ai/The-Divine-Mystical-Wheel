import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, Brain, Flame, ShieldAlert, Radio, AlertTriangle, Sparkles, Activity, Eye, Zap, Crosshair } from 'lucide-react';

interface DetectionSensorSuiteProps {
  onAnalyzeInput: (type: 'voice' | 'thought' | 'essence' | 'noise', content: string) => void;
  isAnalyzing: boolean;
  soundEnabled: boolean;
}

export const DetectionSensorSuite: React.FC<DetectionSensorSuiteProps> = ({
  onAnalyzeInput,
  isAnalyzing,
  soundEnabled
}) => {
  const [activeSensor, setActiveSensor] = useState<'RADAR' | 'NOISE' | 'VOICE' | 'THOUGHT' | 'ESSENCE'>('VOICE');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [liveDecibels, setLiveDecibels] = useState<number>(32);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([15, 25, 45, 20, 60, 35, 80, 50, 30, 20, 40, 70, 55, 30, 15]);
  
  // Custom test inputs
  const [voiceTestInput, setVoiceTestInput] = useState<string>("We declare total destruction upon the Kingdom borders! Prepare for complete obliteration!");
  const [thoughtTestInput, setThoughtTestInput] = useState<string>("Infiltrate the northern gate during the guard change; poison the aetheric well and slaughter the inner sanctuary.");
  const [essenceTestInput, setEssenceTestInput] = useState<string>("Sulfuric Abyssal Shadow-Lord Entity (Vibration: 14.8 Hz, Corruption: 94%, Tainted Bloodline)");
  const [noiseTestInput, setNoiseTestInput] = useState<string>("High-energy subsonic seismic surge detected at 7.2 Hz, indicative of heavy subterranean siege burrower.");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Live microphone capture for Noise & Voice detection
  const startLiveMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMicData = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          const waveform: number[] = [];
          for (let i = 0; i < 16; i++) {
            const val = dataArray[i] || 0;
            sum += val;
            waveform.push(Math.max(8, Math.round((val / 255) * 100)));
          }
          const average = sum / 16;
          const db = Math.round(30 + (average / 255) * 80);
          setLiveDecibels(db);
          setAudioWaveform(waveform);
        }
        animationFrameRef.current = requestAnimationFrame(updateMicData);
      };

      updateMicData();
    } catch (err) {
      console.warn("Microphone access declined or unavailable for Noise Sensor:", err);
      setIsMicActive(false);
    }
  };

  const stopLiveMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsMicActive(false);
  };

  useEffect(() => {
    return () => {
      stopLiveMic();
    };
  }, []);

  return (
    <div className="w-full bg-[#070c14]/90 border border-amber-500/25 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      {/* Sensor Suite Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
            FIVE-FOLD SENSOR DETECTION SUITE
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Omni-spectrum real-time surveillance: Radar • Noise • Malice Voice • Malice Thought • Corrupt Essence
          </p>
        </div>

        {/* 5 Sensor Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveSensor('VOICE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSensor === 'VOICE'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold shadow'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Malice Voice / Chatter</span>
          </button>

          <button
            onClick={() => setActiveSensor('THOUGHT')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSensor === 'THOUGHT'
                ? 'bg-violet-500/30 text-violet-200 border border-violet-500/50 font-bold shadow'
                : 'text-slate-400 hover:text-violet-300'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-violet-400" />
            <span>Malice Thought</span>
          </button>

          <button
            onClick={() => setActiveSensor('ESSENCE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSensor === 'ESSENCE'
                ? 'bg-red-500/30 text-red-200 border border-red-500/50 font-bold shadow'
                : 'text-slate-400 hover:text-red-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Corrupt Essence</span>
          </button>

          <button
            onClick={() => setActiveSensor('NOISE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSensor === 'NOISE'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 font-bold shadow'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Noise & Acoustic</span>
          </button>

          <button
            onClick={() => setActiveSensor('RADAR')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSensor === 'RADAR'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 font-bold shadow'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kinetic Radar</span>
          </button>
        </div>
      </div>

      {/* Sensor Detail Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Sensor Active Visualization & Gauges */}
        <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col gap-4">
          {activeSensor === 'VOICE' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-amber-300 uppercase tracking-wider">
                    MALICE VOICE & CHATTER FREQUENCY INTERCEPTOR
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SCANNING ALL FREQUENCIES
                </span>
              </div>

              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Listens for hostile vocal patterns, aggressive declarations of war, violent threats, clandestine code words, and elevated vocal stress levels indicating planned military aggression against the Kingdom.
              </p>

              {/* Real-Time Waveform Display */}
              <div className="bg-[#0b1320] border border-amber-500/30 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>VOCAL STRESS HARMONICS</span>
                  <span className="text-amber-400 font-bold">SAMPLE RATE: 48 kHz</span>
                </div>
                <div className="h-16 flex items-end justify-between gap-1 px-2 pt-2">
                  {audioWaveform.map((val, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${val}%` }}
                      className="flex-1 bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 rounded-t transition-all duration-75"
                    />
                  ))}
                </div>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">WAR DECLARATION PROBABILITY</span>
                  <span className="text-amber-400 font-bold">96.4% CRITICAL</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">HOSTILITY INDEX</span>
                  <span className="text-red-400 font-bold">92 / 100</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">TFDAS LINKED MUNITION</span>
                  <span className="text-cyan-300 font-bold">Clarion Infrasonic</span>
                </div>
              </div>
            </div>
          )}

          {activeSensor === 'THOUGHT' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-violet-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-400 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-violet-300 uppercase tracking-wider">
                    TELEPATHIC MALICE THOUGHT SCANNER
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  ASTRAL SYNAPSE GRID
                </span>
              </div>

              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Extracts cognitive betrayal wavelengths, intentional subconscious hostility, and premeditated invasion plotting directly from minds approaching the Kingdom perimeter before any physical order is spoken.
              </p>

              {/* Brainwave Synapse Resonance Grid */}
              <div className="bg-[#120c1f] border border-violet-500/30 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>THOUGHT INTENT SPECTROGRAPH</span>
                  <span className="text-violet-400 font-bold">GAMMA BAND (40-100 Hz)</span>
                </div>
                <div className="h-16 flex items-center justify-around gap-2 px-2">
                  {[85, 94, 60, 98, 72, 88, 91, 65].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-slate-800 rounded-full h-12 flex items-end">
                        <div
                          style={{ height: `${val}%` }}
                          className="w-full bg-gradient-to-t from-violet-700 to-fuchsia-400 rounded-full"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">PREMEDITATED MALICE</span>
                  <span className="text-violet-400 font-bold">98.2% SPIKE</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">CONSPIRACY COHERENCE</span>
                  <span className="text-fuchsia-400 font-bold">HIGH (Tactical Ambush)</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">TFDAS LINKED MUNITION</span>
                  <span className="text-violet-300 font-bold">Neural Nullification EMP</span>
                </div>
              </div>
            </div>
          )}

          {activeSensor === 'ESSENCE' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-red-300 uppercase tracking-wider">
                    CORRUPT ESSENCE & ASTRAL PURITY SPECTROMETER
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">
                  SPIRITUAL SPECTROGRAPH
                </span>
              </div>

              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Analyzes the metaphysical essence of all beings within 2,500 km. Measures soul purity, demonic corruption markers, fallen angelic signatures, dark miasmas, and sulfuric contamination.
              </p>

              {/* Essence Purity Bar */}
              <div className="bg-[#1f0b0e] border border-red-500/30 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">PURE CELESTIAL LIGHT (6%)</span>
                  <span className="text-red-400 font-bold">CORRUPT DEMONIC TAINT (94%)</span>
                </div>
                <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex border border-red-500/40">
                  <div className="bg-emerald-400 h-full" style={{ width: '6%' }} />
                  <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-900 h-full animate-pulse" style={{ width: '94%' }} />
                </div>
                <div className="text-[10px] font-mono text-red-300 flex items-center justify-between">
                  <span>Miasma Density: 840 ppm (Sulfuric Nether)</span>
                  <span>Spiritual Frequency: 14.8 Hz (Abyssal Inversion)</span>
                </div>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">CORRUPTION CLASSIFICATION</span>
                  <span className="text-red-400 font-bold">Abyssal High Demon</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">AURA TAINT LEVEL</span>
                  <span className="text-orange-400 font-bold">98 / 100</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">TFDAS LINKED MUNITION</span>
                  <span className="text-amber-300 font-bold">Seraphic White Plasma</span>
                </div>
              </div>
            </div>
          )}

          {activeSensor === 'NOISE' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    ACOUSTIC, SEISMIC & INFRASOUND HYDROPHONE
                  </h4>
                </div>
                <button
                  onClick={isMicActive ? stopLiveMic : startLiveMic}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicActive
                      ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-950/50'
                      : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isMicActive ? 'Mute Live Mic' : 'Engage Live Mic'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Captures ambient decibel levels, underground burrower vibrations, acoustic signatures of missile silos, and subsonic charging sequences of enemy heavy beam weapons.
              </p>

              {/* Decibel Meter & Live Mic Readout */}
              <div className="bg-[#05131a] border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">LIVE DECIBEL LEVEL:</span>
                  <span className={`text-lg font-bold ${liveDecibels > 85 ? 'text-red-400' : 'text-cyan-300'}`}>
                    {liveDecibels} dB
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-cyan-500/30">
                  <div
                    style={{ width: `${Math.min(100, (liveDecibels / 140) * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-100 ${
                      liveDecibels > 90 ? 'bg-red-500' : liveDecibels > 65 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 flex justify-between">
                  <span>0 dB (Silence)</span>
                  <span>60 dB (Normal)</span>
                  <span>140 dB (Siege Ordnance)</span>
                </div>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">INFRASOUND COHERENCE</span>
                  <span className="text-cyan-300 font-bold">7.2 Hz (Subterranean)</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">ACOUSTIC WEAPON CHARGE</span>
                  <span className="text-amber-400 font-bold">DETECTED (Bunker Breaker)</span>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-500 text-[10px] block">SEISMIC ANOMALY</span>
                  <span className="text-emerald-400 font-bold">TRIANGULATED</span>
                </div>
              </div>
            </div>
          )}

          {activeSensor === 'RADAR' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    AERO-DIMENSIONAL KINETIC RADAR
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  MACH 0-25 DOMAIN
                </span>
              </div>

              <p className="text-xs text-slate-300 font-serif leading-relaxed">
                Tracks physical flight trajectories, hyperspace jumps, orbital drop pods, stealth dampeners, and dimensional rift openings with microsecond coordinate resolution.
              </p>

              {/* Tactical Radar Specs */}
              <div className="bg-[#081a10] border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-mono text-emerald-300">
                  <span>DIMENSIONAL RIFT APERTURE</span>
                  <span className="font-bold">COORDINATES: 44.8°N / 112.5°E</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-1">
                  <div className="bg-black/40 p-2 rounded border border-emerald-500/20">
                    <span className="text-slate-500 text-[10px] block">INCURSION VELOCITY</span>
                    <span className="text-emerald-300 font-bold">Mach 8.4 (Hypersonic)</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded border border-emerald-500/20">
                    <span className="text-slate-500 text-[10px] block">STEALTH DAMPENING</span>
                    <span className="text-amber-400 font-bold">Overridden by Aetheric Scan</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Threat Analysis & Custom Intercept Tester */}
        <div className="lg:col-span-6 bg-black/60 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                LIVE SENSOR TEST & AI INTERDICTION SIMULATOR
              </span>
              <span className="text-[10px] font-mono text-slate-400">GEMINI 3.7 FLASH INTEGRATED</span>
            </div>

            <p className="text-xs text-slate-300 font-serif">
              Input custom intercepted audio transcripts, thought patterns, essence readings, or acoustic telemetry to test real-time threat classification and defense response:
            </p>

            {/* Input field based on active sensor */}
            {activeSensor === 'VOICE' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                  Intercepted Voice / Chatter Text:
                </label>
                <textarea
                  value={voiceTestInput}
                  onChange={(e) => setVoiceTestInput(e.target.value)}
                  rows={3}
                  placeholder="Enter spoken threat, war declaration, or clandestine radio chatter..."
                  className="w-full bg-[#070c14] border border-amber-500/30 rounded-lg p-3 text-xs font-serif text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {activeSensor === 'THOUGHT' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-violet-300">
                  Intercepted Telepathic Thought Pattern:
                </label>
                <textarea
                  value={thoughtTestInput}
                  onChange={(e) => setThoughtTestInput(e.target.value)}
                  rows={3}
                  placeholder="Enter psychic betrayal scheme, covert assassination thoughts, or hostile intent..."
                  className="w-full bg-[#070c14] border border-violet-500/30 rounded-lg p-3 text-xs font-serif text-slate-200 focus:outline-none focus:border-violet-400"
                />
              </div>
            )}

            {activeSensor === 'ESSENCE' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-red-300">
                  Essence Spectrograph Marker / Soul Vibration:
                </label>
                <textarea
                  value={essenceTestInput}
                  onChange={(e) => setEssenceTestInput(e.target.value)}
                  rows={3}
                  placeholder="Enter entity description, aura frequency, demonic signature, or corruption index..."
                  className="w-full bg-[#070c14] border border-red-500/30 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-400"
                />
              </div>
            )}

            {(activeSensor === 'NOISE' || activeSensor === 'RADAR') && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                  Acoustic / Seismic Telemetry Signal:
                </label>
                <textarea
                  value={noiseTestInput}
                  onChange={(e) => setNoiseTestInput(e.target.value)}
                  rows={3}
                  placeholder="Enter acoustic or radar observation telemetry..."
                  className="w-full bg-[#070c14] border border-cyan-500/30 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            disabled={isAnalyzing}
            onClick={() => {
              if (activeSensor === 'VOICE') onAnalyzeInput('voice', voiceTestInput);
              else if (activeSensor === 'THOUGHT') onAnalyzeInput('thought', thoughtTestInput);
              else if (activeSensor === 'ESSENCE') onAnalyzeInput('essence', essenceTestInput);
              else onAnalyzeInput('noise', noiseTestInput);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-black" />
                <span>PROCESSING HIGH-INTEL DEFENSE CALCULATION...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                <span>TRIGGER SENSOR ANALYSIS & DEPLOY TFDAS / ASFFU</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionSensorSuite;
