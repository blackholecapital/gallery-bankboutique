import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { Spinner } from '@/components/primitives/Spinner';
import { routePaths } from '@/routes/paths';

export function HomePage() {
  const { currentUser, isHydratingSession } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHydratingSession && currentUser) {
      navigate(currentUser.isOnboarded ? routePaths.browse : routePaths.onboarding, { replace: true });
    }
  }, [currentUser, isHydratingSession, navigate]);

  if (isHydratingSession) return <div className="flex justify-center pt-20"><Spinner /></div>;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Factory Product Gallery</h1>
        <p className="mt-2 text-sm leading-relaxed text-foreground/50">Reusable gallery shell with browse and expanded profile product cards.</p>
        <button onClick={() => navigate(routePaths.login)} className="mt-6 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white">
          Get started
        </button>
      </div>
    </div>
  );
}
