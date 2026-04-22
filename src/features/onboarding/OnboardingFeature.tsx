import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { authGateway } from '@/app/providers/repositories';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Input } from '@/components/primitives/Input';
import { routePaths } from '@/routes/paths';

export function OnboardingFeature() {
  const { currentUser, setCurrentUser } = useAppStore();
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  if (!currentUser) return <EmptyState title="Sign in required" description="You need to sign in first." />;

  const handleComplete = async () => {
    if (!workspaceName.trim()) { setError('Please enter a workspace name.'); return; }
    setSaving(true);
    setError(null);
    try {
      const updatedUser = await authGateway.markOnboarded(currentUser.id);
      setCurrentUser(updatedUser);
      navigate(routePaths.browse);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to finish onboarding.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Set up your gallery workspace</h1>
        <p className="mt-1 text-sm text-mutedForeground">Prepare access to browse and expanded product card states.</p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleComplete(); }}>
          <div>
            <label htmlFor="workspaceName" className="mb-2 block text-xs font-semibold text-mutedForeground">Workspace name</label>
            <Input id="workspaceName" placeholder="Factory Gallery Workspace" onChange={(e) => setWorkspaceName(e.target.value)} value={workspaceName} />
          </div>

          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">{error}</div>}

          <Button className="w-full" disabled={isSaving} type="submit">
            {isSaving ? 'Saving...' : 'Complete onboarding'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
