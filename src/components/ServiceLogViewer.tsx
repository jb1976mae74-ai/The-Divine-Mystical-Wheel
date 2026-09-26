import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { GripVertical, Brain, X, RotateCcw } from 'lucide-react';

interface ServiceLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'adjustment';
  message: string;
  source: string;
}

export default function ServiceLogViewer() {
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [engineStatus, setEngineStatus] = useState('Online');
  const [dragResetKey, setDragResetKey] = useState(0);
  const panelDragControls = useDragControls();
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/service-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (err) {
      // Silently fail during dev server restarts or network disconnects
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  // Set up global error listener for autonomous learning
  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      setEngineStatus('Learning & Adjusting...');
      try {
        await fetch('/api/service-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level: 'error',
            message: `Client Error: ${event.message}`,
            source: 'Frontend'
          })
        });
        setTimeout(() => {
          setEngineStatus('Online');
          fetchLogs();
        }, 2000);
      } catch (e) {
        // fail silently
      }
    };

    // window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-cyan-400';
      case 'warn': return 'text-amber-400';
      case 'error': return 'text-red-500';
      case 'adjustment': return 'text-emerald-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <>
      {/* Floating Draggable High Thinking Engine Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key={`high-thinking-btn-${dragResetKey}`}
            drag
            dragMomentum={false}
            dragElastic={0.08}
            whileDrag={{ scale: 1.08, cursor: "grabbing", boxShadow: "0 25px 35px rgba(0,0,0,0.9)" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed bottom-4 left-4 sm:left-6 z-50 flex items-center p-1 rounded-full bg-neutral-950/95 border border-emerald-500/50 text-emerald-400 shadow-2xl shadow-black/90 backdrop-blur-md cursor-grab active:cursor-grabbing touch-none select-none group"
          >
            <div
              className="pl-2 pr-0.5 text-emerald-400/80 group-hover:text-emerald-200 transition-colors flex items-center shrink-0 cursor-grab active:cursor-grabbing"
              title="Gently press & swipe to move High Thinking Engine anywhere"
            >
              <GripVertical className="w-4 h-4 text-emerald-400" />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-emerald-500/10 transition-all cursor-pointer text-xs font-mono font-semibold"
              title="Open High Thinking Engine Observer (Press & swipe to move)"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Brain className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>High Thinking Engine</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Draggable Panel Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`high-thinking-panel-${dragResetKey}`}
            drag
            dragControls={panelDragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.01, cursor: "grabbing" }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-4 left-4 sm:left-6 z-50 bg-neutral-950/95 border border-emerald-900/60 w-[calc(100vw-2rem)] max-w-lg rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col h-[520px] max-h-[85vh] backdrop-blur-md"
          >
            {/* Header / Drag Handle */}
            <div
              onPointerDown={(e) => panelDragControls.start(e)}
              className="bg-neutral-900/90 border-b border-emerald-900/60 p-3 flex justify-between items-center select-none cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="p-1 rounded text-emerald-400/80 hover:text-emerald-200 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing flex items-center shrink-0"
                  title="Gently press & swipe header to move High Thinking Engine anywhere"
                >
                  <GripVertical className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <Brain className="w-4.5 h-4.5 text-emerald-400 animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-mono text-xs text-emerald-400 font-bold tracking-wider truncate flex items-center gap-1.5">
                      <span>High Thinking Engine</span>
                      <span className="text-[9px] font-normal text-emerald-500/80 hidden sm:inline">• Press & swipe to move</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${engineStatus === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                      <span className="uppercase text-emerald-300/90">{engineStatus}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-500">{logs.length} Telemetry Logs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setDragResetKey(prev => prev + 1)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Reset High Thinking Engine window position"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Close Observer Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Log Viewer */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-950/50 custom-scrollbar font-mono text-xs"
            >
              {logs.map((log) => (
                <div key={log.id} className="border-l-2 border-neutral-800 pl-3 py-1 hover:bg-neutral-900/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-1 opacity-70">
                    <span className="text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-neutral-400 bg-neutral-900 px-1.5 rounded text-[9px] uppercase border border-neutral-800">{log.source}</span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${getLevelColor(log.level)}`}>[{log.level}]</span>
                  </div>
                  <p className={`text-neutral-300 leading-relaxed ${log.level === 'adjustment' ? 'italic' : ''}`}>
                    {log.level === 'adjustment' && <span className="inline-block mr-2">⚡</span>}
                    {log.message}
                  </p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-neutral-600 italic text-center mt-10">Waiting for telemetry...</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
