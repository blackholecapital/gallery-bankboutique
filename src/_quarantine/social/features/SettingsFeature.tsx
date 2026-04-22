import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featureFlags } from '@/domain/featureFlags';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAppStore } from '@/app/providers/StoreProvider';
import { Badge } from '@/components/primitives/Badge';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { userInitials } from '@/entities/user/userView';
import { authGateway } from '@/app/providers/repositories';
import { routePaths } from '@/routes/paths';

export function SettingsFeature() {
  const { currentUser, setCurrentUser } = useAppStore();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [themeMsg, setThemeMsg] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Sign in required</p>
          <p className="mt-1 text-sm text-mutedForeground">Sign in to manage settings.</p>
          <Button onClick={() => navigate(routePaths.login)} className="mt-4 w-full">Sign in</Button>
        </Card>
      </div>
    );
  }

  const handleToggle = () => {
    toggleTheme();
    setThemeMsg(`Switched to ${mode === 'light' ? 'dark' : 'light'} mode`);
    setTimeout(() => setThemeMsg(null), 2000);
  };

  const handleSignOut = async () => {
    await authGateway.signOut();
    setCurrentUser(null);
    navigate(routePaths.login);
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-5">
      <p className="text-xs font-semibold text-mutedForeground">Settings</p>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {userInitials(currentUser)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{currentUser.email}</p>
            <p className="text-xs text-mutedForeground">{currentUser.isOnboarded ? 'Active account' : 'Onboarding'}</p>
          </div>
          <Badge>{currentUser.isOnboarded ? 'Active' : 'Setup'}</Badge>
        </div>
      </Card>

      <Card>
        <button onClick={handleToggle} className="flex w-full items-center justify-between text-left">
          <div>
            <p className="text-sm font-semibold">Appearance</p>
            <p className="text-xs text-mutedForeground">Tap to switch between light and dark mode.</p>
          </div>
          <Badge>{mode}</Badge>
        </button>
        {themeMsg && <p className="mt-2 text-xs font-medium text-emerald-600">{themeMsg}</p>}
      </Card>

      <Card>
        <p className="mb-3 text-xs font-semibold text-mutedForeground">Features</p>
        <div className="space-y-2.5">
          {[
            { name: 'Discovery', on: featureFlags.discoveryEnabled },
            { name: 'Inbox', on: featureFlags.inboxEnabled },
            { name: 'Settings', on: featureFlags.settingsEnabled }
          ].map((f) => (
            <div key={f.name} className="flex items-center justify-between">
              <p className="text-sm">{f.name}</p>
              <Badge>{f.on ? 'On' : 'Off'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleSignOut}
        className="w-full border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50"
        variant="ghost"
      >
        Sign out
      </Button>
    </div>
  );
}
