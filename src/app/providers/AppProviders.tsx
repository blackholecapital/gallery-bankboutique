import { useEffect } from 'react';
import { StoreProvider, useAppStore } from '@/app/providers/StoreProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { authGateway } from '@/app/providers/repositories';
import { ensureDemoData } from '@/lib/db/seedDemoData';
import { EstimateProvider } from '@/estimate-save-path/EstimateProvider';

function SessionHydrator() {
  const { setCurrentUser, setHydratingSession } = useAppStore();

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      try {
        await ensureDemoData();
        const user = await authGateway.getCurrentUser();
        if (isMounted) setCurrentUser(user);
      } finally {
        if (isMounted) setHydratingSession(false);
      }
    };

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [setCurrentUser, setHydratingSession]);

  return <AppRouter />;
}

export function AppProviders() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <EstimateProvider>
          <SessionHydrator />
        </EstimateProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
