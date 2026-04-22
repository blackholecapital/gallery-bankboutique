import { Outlet } from 'react-router-dom';
import { MobileShell } from '@/components/layout/MobileShell';

export function AuthLayout() {
  return (
    <MobileShell hideNav>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-sm">
            AC
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">Artist Connect</p>
            <p className="text-xs text-mutedForeground">Discover and connect</p>
          </div>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </MobileShell>
  );
}
