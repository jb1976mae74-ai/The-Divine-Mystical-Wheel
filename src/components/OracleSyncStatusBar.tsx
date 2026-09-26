import React from 'react';
import { RefreshCw, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

export type SyncState = 'idle' | 'syncing' | 'success' | 'error';

interface OracleSyncStatusBarProps {
  syncStatus: SyncState;
  lastSyncedAt: number | null;
  isOffline: boolean;
  onPressSync: () => void;
}

export function OracleSyncStatusBar({ syncStatus, lastSyncedAt, isOffline, onPressSync }: OracleSyncStatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-white/10 text-[10px] text-slate-400 font-mono">
      <div className="flex items-center gap-2">
        {isOffline ? <WifiOff className="w-3 h-3 text-rose-500" /> : <Wifi className="w-3 h-3 text-emerald-500" />}
        <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString() : 'Never'}</span>
        <button 
          onClick={onPressSync} 
          disabled={syncStatus === 'syncing'}
          className="flex items-center gap-1 hover:text-amber-500 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}
        </button>
      </div>
    </div>
  );
}
