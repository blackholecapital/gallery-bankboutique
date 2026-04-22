import { Outlet } from 'react-router-dom';
import { MobileShell } from '@/components/layout/MobileShell';
import { AppHeader } from '@/components/composites/AppHeader';

export function AppLayout() {
  return (
    <MobileShell header={<AppHeader />}>
      <Outlet />
    </MobileShell>
  );
}
