import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCw, Play, Pause, Compass, Flame, Droplets, Wind, Globe, Sun } from 'lucide-react';

interface FaceData {
  id: string;
  title: string;
  element: string;
  symbol: string;
  color: string;
  description: string;
  wisdom: string;
}

const faces: FaceData[] = [
  {
    id: 'front',
    title: 'Monas Hieroglyphica',
    element: 'Spirit & Sun',
    symbol: '🜔',
    color: 'from-amber-500/30 to-yellow-600/30 border-amber-400/60',
    description: 'The unity of sun, moon, and prime matter devised by John Dee.',
    wisdom: 'As above, so below; the celestial architecture is mirrored within the mortal soul.'
  },
  {
    id: 'back',
    title: 'Aqua / Dissolution',
    element: 'Water',
    symbol: '🜄',
    color: 'from-blue-600/30 to-cyan-700/30 border-blue-400/60',
    description: 'The universal solvent and alchemical baptism washing away base illusions.',
    wisdom: 'Through the waters of dissolution comes the rebirth of pure consciousness.'
  },
  {
    id: 'right',
    title: 'Caduceus of Mercury',
    element: 'Air & Vital Breath',
    symbol: '☤',
    color: 'from-sky-500/30 to-indigo-600/30 border-sky-400/60',
    description: 'The balanced serpentine currents ascending the central axis of illumination.',
    wisdom: 'Equilibrium of opposing forces opens the gateway between dimensions.'
  },
  {
    id: 'left',
    title: 'Pentagram of Earth',
    element: 'Earth & Matter',
    symbol: '⛤',
    color: 'from-emerald-600/30 to-green-800/30 border-emerald-400/60',
    description: 'The dominion of spirit over the four material elements of manifestation.',
    wisdom: 'Root your aspirations deep into the fertile matrix of physical reality.'
  },
  {
    id: 'top',
    title: 'Philosopher’s Stone',
    element: 'Quintessence',
    symbol: '🜚',
    color: 'from-purple-600/30 to-fuchsia-700/30 border-purple-400/60',
    description: 'The ultimate transmutation of leaden ignorance into auric perfection.',
    wisdom: 'True gold is not mined from the earth; it is forged within the crucible of the heart.'
  },
  {
    id: 'bottom',
    title: 'The Athanor',
    element: 'Fire & Crucible',
    symbol: '🜂',
    color: 'from-rose-600/30 to-orange-700/30 border-rose-400/60',
    description: 'The perpetual alchemical furnace maintaining steady, controlled heat.',
    wisdom: 'Patience and relentless inner focus sustain the flame of spiritual transformation.'
  }
];

export const SpinningCube3D: React.FC = () => {
  const [rotateX, setRotateX] = useState<number>(-20);
  const [rotateY, setRotateY] = useState<number>(-30);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [spinSpeed, setSpinSpeed] = useState<number>(0.5);
  const [activeFace, setActiveFace] = useState<FaceData>(faces[0]);
  const [isPerspective, setIsPerspective] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocity = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastTimeRef = useRef<number>(performance.now());
  const lastMoveTimeRef = useRef<number>(performance.now());

  const toggleProjection = () => setIsPerspective(!isPerspective);

  // Momentum and auto-spin animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const delta = Math.min(0.05, (currentTime - lastTimeRef.current) / 1000);
      lastTimeRef.current = currentTime;

      if (!isDragging.current) {
        if (Math.abs(velocity.current.vx) > 0.001 || Math.abs(velocity.current.vy) > 0.001) {
          // Apply momentum inertia (delta in seconds, vx in deg/ms)
          const timeMs = delta * 1000;
          setRotateY(prev => prev + velocity.current.vx * timeMs);
          setRotateX(prev => Math.max(-80, Math.min(80, prev - velocity.current.vy * timeMs)));
          // Decay velocity (friction)
          velocity.current.vx *= 0.95;
          velocity.current.vy *= 0.95;
        } else if (isAutoSpinning) {
          // Normal auto orbit
          setRotateY(prev => (prev + spinSpeed * delta * 30) % 360);
          setRotateX(prev => prev + Math.sin(currentTime / 2000) * 0.1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoSpinning, spinSpeed]);

  const handleStart = (clientX: number, clientY: number) => {
    isDragging.current = true;
    setIsAutoSpinning(false);
    lastPos.current = { x: clientX, y: clientY };
    velocity.current = { vx: 0, vy: 0 };
    lastMoveTimeRef.current = performance.now();
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const deltaTime = Math.max(16, now - lastMoveTimeRef.current);
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;

    // Velocity in degrees per millisecond
    velocity.current = { vx: (dx / deltaTime) * 0.5, vy: (dy / deltaTime) * 0.5 };
    
    lastPos.current = { x: clientX, y: clientY };
    lastMoveTimeRef.current = now;

    setRotateY(prev => prev + dx * 0.5);
    setRotateX(prev => Math.max(-80, Math.min(80, prev - dy * 0.5)));
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[600px] py-8 px-4 bg-gradient-to-b from-neutral-950 via-zinc-900 to-neutral-950 text-amber-100 rounded-2xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
      {/* Background ambient esoteric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Info */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sacred Geometry 3D Hyper-Cube</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200 tracking-wide">
          The Alchemical Cube of Mysteries
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-1 font-serif">
          Swipe or drag with momentum physics to spin space, click faces or inspect elemental seals.
        </p>
      </div>

      {/* 3D Scene Container */}
      <div 
        ref={containerRef}
        className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] flex items-center justify-center cursor-pointer select-none my-4 z-10 touch-none"
        style={{ perspective: isPerspective ? '1200px' : 'none' }}
        onClick={toggleProjection}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          if (e.touches.length === 1) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handleEnd}
      >
        <div 
          className="relative w-full h-full transform-style-3d transition-transform duration-75 ease-out"
          style={{
            transform: `translateZ(-140px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          }}
        >
          {/* FRONT FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[0]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[0].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(212,175,55,0.2)] transform translateZ-[150px] cursor-pointer hover:border-amber-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">{faces[0].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-amber-100">{faces[0].title}</h3>
            <span className="text-[10px] uppercase font-mono text-amber-300 tracking-wider mt-1">{faces[0].element}</span>
          </div>

          {/* BACK FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[1]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[1].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(59,130,246,0.2)] transform rotateY(180deg) translateZ-[150px] cursor-pointer hover:border-blue-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">{faces[1].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-blue-100">{faces[1].title}</h3>
            <span className="text-[10px] uppercase font-mono text-blue-300 tracking-wider mt-1">{faces[1].element}</span>
          </div>

          {/* RIGHT FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[2]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[2].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(14,165,233,0.2)] transform rotateY(90deg) translateZ-[150px] cursor-pointer hover:border-sky-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(14,165,233,0.6)]">{faces[2].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-sky-100">{faces[2].title}</h3>
            <span className="text-[10px] uppercase font-mono text-sky-300 tracking-wider mt-1">{faces[2].element}</span>
          </div>

          {/* LEFT FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[3]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[3].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(16,185,129,0.2)] transform -rotateY(90deg) translateZ-[150px] cursor-pointer hover:border-emerald-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">{faces[3].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-emerald-100">{faces[3].title}</h3>
            <span className="text-[10px] uppercase font-mono text-emerald-300 tracking-wider mt-1">{faces[3].element}</span>
          </div>

          {/* TOP FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[4]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[4].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(168,85,247,0.2)] transform rotateX(90deg) translateZ-[150px] cursor-pointer hover:border-purple-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">{faces[4].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-purple-100">{faces[4].title}</h3>
            <span className="text-[10px] uppercase font-mono text-purple-300 tracking-wider mt-1">{faces[4].element}</span>
          </div>

          {/* BOTTOM FACE */}
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveFace(faces[5]); }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${faces[5].color} backdrop-blur-md border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(244,63,94,0.2)] transform -rotateX(90deg) translateZ-[150px] cursor-pointer hover:border-rose-300 transition-colors`}
          >
            <span className="text-5xl mb-2 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]">{faces[5].symbol}</span>
            <h3 className="text-lg font-bold font-serif text-rose-100">{faces[5].title}</h3>
            <span className="text-[10px] uppercase font-mono text-rose-300 tracking-wider mt-1">{faces[5].element}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 my-4 z-10">
        <button
          onClick={() => setIsAutoSpinning(!isAutoSpinning)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
        >
          {isAutoSpinning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isAutoSpinning ? 'Halt Orbit' : 'Resume Orbit'}</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono">
          <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: `${Math.max(1, 4 - spinSpeed)}s` }} />
          <span className="text-neutral-400">Velocity:</span>
          <select
            value={spinSpeed}
            onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
            className="bg-transparent text-amber-200 font-bold focus:outline-none cursor-pointer"
          >
            <option value={0.2} className="bg-neutral-900">0.2x Calm</option>
            <option value={0.5} className="bg-neutral-900">0.5x Mystic</option>
            <option value={1.0} className="bg-neutral-900">1.0x Astral</option>
            <option value={2.0} className="bg-neutral-900">2.0x Vortex</option>
          </select>
        </div>

        <button
          onClick={() => { setRotateX(-20); setRotateY(-30); setIsAutoSpinning(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-500/40 text-neutral-300 text-xs font-mono transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Axis</span>
        </button>
        
        <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-400">
          Mode: <span className="text-amber-300 font-bold">{isPerspective ? 'Perspective' : 'Orthographic'}</span>
        </div>
      </div>

      {/* Active Face Wisdom Card */}
      <div className="w-full max-w-lg mt-4 p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 shadow-xl backdrop-blur-md z-10 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeFace.symbol}</span>
            <div>
              <h4 className="text-sm font-serif font-bold text-amber-200">{activeFace.title}</h4>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{activeFace.element}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Active Facet
          </span>
        </div>
        <p className="text-xs text-neutral-300 font-serif mb-2 leading-relaxed">
          {activeFace.description}
        </p>
        <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15 text-xs text-amber-100/90 italic font-serif">
          "{activeFace.wisdom}"
        </div>
      </div>
    </div>
  );
};
