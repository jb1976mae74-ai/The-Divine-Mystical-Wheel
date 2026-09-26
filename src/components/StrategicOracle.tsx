import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OracleResponse {
  analysis: string;
  effectiveness: string;
  odds: number;
}

export function StrategicOracle() {
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<OracleResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response) return;
    const textToCopy = `🔮 Commander's Oracle Analysis 🔮\n\n${response.analysis}\n\nEffectiveness: ${response.effectiveness}\nOdds of Victory: ${response.odds}%`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch('/api/battle-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: situation.trim() })
      });
      
      if (!res.ok) {
        throw new Error('The oracle is currently unresponsive.');
      }
      
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-neutral-950 border border-amber-900/40 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-serif text-amber-500 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Commander's Oracle
        </h3>
      </div>
      
      <p className="text-sm text-neutral-400 font-serif italic mb-4">
        Describe your tactical situation and proposed battle plan. The Oracle shall evaluate its effectiveness and calculate your odds of victory.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g., The enemy holds the high ground at the river crossing. I plan to feign a retreat with my vanguard while my cavalry crosses downstream to flank their artillery..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-neutral-200 focus:outline-none focus:border-amber-500 transition-colors h-32 custom-scrollbar font-sans text-sm"
          required
        ></textarea>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !situation.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/50 rounded transition-colors font-mono uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Consulting..." : "Seek Guidance"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm font-mono">
          {error}
        </div>
      )}
      
      {response && !isLoading && (
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/60">
            <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Oracle's Analysis</h4>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-900/50 rounded transition-colors font-mono text-xs cursor-pointer"
              title="Copy Oracle revelation to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Answer"}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <p className="text-neutral-300 font-serif leading-relaxed text-sm">
                {response.analysis}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center">
                <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1">Effectiveness</h4>
                <span className="text-lg font-serif text-amber-500">{response.effectiveness}</span>
              </div>
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center relative overflow-hidden">
                <h4 className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1 relative z-10">Odds of Victory</h4>
                <span className="text-3xl font-serif text-white relative z-10">{response.odds}%</span>
                
                {/* Progress bar background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-amber-600/50 transition-all duration-1000 ease-out"
                  style={{ width: `${response.odds}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
