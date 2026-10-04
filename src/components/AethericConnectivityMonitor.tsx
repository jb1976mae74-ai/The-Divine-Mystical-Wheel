import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export const AethericConnectivityMonitor: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'degraded' | 'offline'>('connected');
  const [latency, setLatency] = useState<number>(24);

  useEffect(() => {
    // Simulate fluctuating network conditions
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) setStatus('offline');
      else if (rand > 0.8) setStatus('degraded');
      else setStatus('connected');
      
      setLatency(20 + Math.floor(Math.random() * 50));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-200">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif font-bold tracking-wider uppercase text-xs">Aetheric Link Monitor</h3>
        </div>
        {status === 'connected' ? <Wifi className="w-5 h-5 text-emerald-500" /> : <WifiOff className="w-5 h-5 text-rose-500" />}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-black/40 border border-neutral-700">
          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Status</span>
          <span className={`text-xs font-bold ${status === 'connected' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-black/40 border border-neutral-700">
          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Latency</span>
          <div className="flex items-center gap-1 text-amber-100">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-bold">{latency}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
