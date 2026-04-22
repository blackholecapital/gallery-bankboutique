import { Outlet } from 'react-router-dom';
import { MobileShell } from '@/components/layout/MobileShell';

export function OnboardingLayout() {
  return (
    <MobileShell hideNav>
      <div className="px-5 py-6">
        <Outlet />
      </div>
    </MobileShell>
  );
}
