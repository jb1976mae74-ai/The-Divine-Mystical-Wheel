import React, { useState } from 'react';
import { OracleSyncStatusBar, SyncState } from './OracleSyncStatusBar';

export function HeaderWrapper() {
  const [syncStatus, setSyncStatus] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(Date.now() - 120000);
  const [isOffline, setIsOffline] = useState(false);

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setLastSyncedAt(Date.now());
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 2000);
  };

  return (
    <div className="bg-[#0A0A0C] w-full sticky top-0 z-50">
      <OracleSyncStatusBar
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        isOffline={isOffline}
        onPressSync={handleManualSync}
      />
    </div>
  );
}
