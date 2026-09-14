'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { syncAllFromCloud, initRealtimeSubscription, pushLocalDataToCloud } from '@/lib/sync-engine';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SyncContextType {
  isConfigured: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncNow: () => Promise<void>;
  pushLocalNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType>({
  isConfigured: false,
  isSyncing: false,
  lastSyncedAt: null,
  syncNow: async () => {},
  pushLocalNow: async () => {},
});

export function useSync() {
  return useContext(SyncContext);
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const syncNow = async () => {
    if (!isSupabaseConfigured) return;
    setIsSyncing(true);
    try {
      await syncAllFromCloud();
      setLastSyncedAt(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const pushLocalNow = async () => {
    if (!isSupabaseConfigured) return;
    setIsSyncing(true);
    try {
      await pushLocalDataToCloud();
      setLastSyncedAt(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let unsubscribe = () => {};

    // 1. Sincronización inicial con la nube
    syncNow().then(() => {
      // 2. Conectar Realtime
      unsubscribe = initRealtimeSubscription();
    });

    // 3. Re-sincronizar si el usuario cambia de ventana o vuelve a la app (visibilidad)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncAllFromCloud().then(() => setLastSyncedAt(new Date()));
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SyncContext.Provider
      value={{
        isConfigured: isSupabaseConfigured,
        isSyncing,
        lastSyncedAt,
        syncNow,
        pushLocalNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}
