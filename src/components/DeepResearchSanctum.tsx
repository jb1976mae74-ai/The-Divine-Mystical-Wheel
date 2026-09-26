import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Search, Loader2, BookOpen, AlertCircle, CheckCircle2, Archive
} from 'lucide-react';
import TypewriterMarkdown from './TypewriterMarkdown';

interface DeepResearchSanctumProps {
  activeTheme: {
    textPrimary: string;
    textAccent: string;
    textAccentHex: string;
    borderAccent: string;
    borderAccentSemi: string;
    bgCard: string;
  };
}

export default function DeepResearchSanctum({ activeTheme }: DeepResearchSanctumProps) {
  const [query, setQuery] = useState('');
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [result, setResult] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load active session from local storage if any
  useEffect(() => {
    const savedId = localStorage.getItem('deep-research-interaction-id');
    const savedStatus = localStorage.getItem('deep-research-status') as any;
    if (savedId && savedStatus === 'running') {
      setInteractionId(savedId);
      setStatus('running');
      setElapsedTime(parseInt(localStorage.getItem('deep-research-time') || '0', 10));
    }
  }, []);

  // Timer while running
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1;
          localStorage.setItem('deep-research-time', next.toString());
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Polling loop
  useEffect(() => {
    if (status === 'running' && interactionId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/wisdom-architect/deep-research/status/${interactionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'completed') {
              setStatus('completed');
              setResult(data.result);
              localStorage.removeItem('deep-research-status');
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            } else if (data.status === 'failed' || data.status === 'cancelled') {
              setStatus('failed');
              setErrorMsg(`Research ${data.status}.`);
              localStorage.removeItem('deep-research-status');
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 10000); // Poll every 10 seconds
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [status, interactionId]);

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || status === 'running') return;

    setStatus('running');
    setResult('');
    setErrorMsg(null);
    setElapsedTime(0);

    try {
      const res = await fetch('/api/wisdom-architect/deep-research/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (res.ok) {
        const data = await res.json();
        setInteractionId(data.interactionId);
        localStorage.setItem('deep-research-interaction-id', data.interactionId);
        localStorage.setItem('deep-research-status', 'running');
        localStorage.setItem('deep-research-time', '0');
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to start research');
      }
    } catch (err: any) {
      setStatus('failed');
      setErrorMsg(err.message || 'An error occurred while dispatching the agent.');
      localStorage.removeItem('deep-research-status');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setQuery('');
    setResult('');
    setErrorMsg(null);
    setInteractionId(null);
    setElapsedTime(0);
    localStorage.removeItem('deep-research-interaction-id');
    localStorage.removeItem('deep-research-status');
    localStorage.removeItem('deep-research-time');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  Antigravity Deep Research Sanctum
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  Agent: antigravity-preview
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dispatch an autonomous agent into the esoteric archives to conduct deep, multi-step research on ancient texts, sacred geometry, and celestial physics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      {status === 'idle' && (
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleStartResearch} 
          className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl"
        >
          <label className="block text-sm font-bold text-amber-300 mb-2">Research Directive</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            placeholder="e.g. Conduct a comprehensive analysis of the mathematical relationship between the Great Pyramid of Giza, the Speed of Light, and the Hebrew gematria of Genesis 1:1."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none resize-none shadow-inner font-serif"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              Commence Deep Research
            </button>
          </div>
        </motion.form>
      )}

      {/* Running State */}
      {status === 'running' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/90 border border-purple-500/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin relative z-10" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-neutral-100">Agent Dispatched</h3>
            <p className="text-neutral-400 mt-2 max-w-lg mx-auto text-sm">
              The Antigravity research agent is currently scouring the archives, cross-referencing esoteric texts, performing multi-step reasoning, and compiling a comprehensive thesis.
            </p>
          </div>

          <div className="bg-neutral-950 px-6 py-3 rounded-xl border border-neutral-800 font-mono text-sm text-amber-400 flex items-center gap-3">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-pulse" /> Time Elapsed:</span>
            <span className="text-lg">{formatTime(elapsedTime)}</span>
          </div>
          
          <div className="text-xs text-neutral-500 italic max-w-md">
            This process may take several minutes depending on the complexity of the inquiry. You can safely navigate away; the agent will continue working in the background.
          </div>
        </motion.div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-neutral-100">Research Complete</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">Time to completion: {formatTime(elapsedTime)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition-colors flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              New Inquiry
            </button>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 prose prose-invert prose-amber max-w-none text-neutral-300 text-sm leading-relaxed">
            <TypewriterMarkdown content={result} />
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {status === 'failed' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center space-y-4"
        >
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div>
            <h3 className="text-lg font-bold text-red-300">Research Interrupted</h3>
            <p className="text-sm text-red-400/80 mt-1">{errorMsg}</p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 text-sm border border-red-500/40 transition-colors mt-2"
          >
            Reset and Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
