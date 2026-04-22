import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { User } from '@/domain/types/user';
import type { AppStoreState } from '@/app/store/appStore';

const StoreContext = createContext<AppStoreState | undefined>(undefined);

export function StoreProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHydratingSession, setHydratingSession] = useState(true);

  const value = useMemo(
    () => ({
      currentUser,
      isHydratingSession,
      setCurrentUser,
      setHydratingSession
    }),
    [currentUser, isHydratingSession]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used within StoreProvider');
  return context;
}
