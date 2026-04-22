import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { authGateway } from '@/app/providers/repositories';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { Input } from '@/components/primitives/Input';
import { Spinner } from '@/components/primitives/Spinner';
import { routePaths } from '@/routes/paths';

export function AuthFeature() {
  const { currentUser, setCurrentUser, isHydratingSession } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('maya@artistconnect.demo');
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const user = await authGateway.signInWithEmail(email);
      setCurrentUser(user);
      navigate(user.isOnboarded ? routePaths.browse : routePaths.onboarding);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await authGateway.signOut();
    setCurrentUser(null);
  };

  if (isHydratingSession) {
    return <div className="flex justify-center pt-10"><Spinner /></div>;
  }

  if (currentUser) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {currentUser.email.slice(0, 1).toUpperCase()}
        </div>
        <p className="text-lg font-semibold">Welcome back</p>
        <p className="mt-1 text-sm text-mutedForeground">{currentUser.email}</p>
        <div className="mt-5 space-y-2.5">
          <Button
            className="w-full"
            onClick={() => navigate(currentUser.isOnboarded ? routePaths.browse : routePaths.onboarding)}
          >
            {currentUser.isOnboarded ? 'Go to discovery' : 'Continue onboarding'}
          </Button>
          <Button className="w-full" onClick={handleSignOut} variant="ghost">
            Sign out
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 text-center">
        <p className="text-xl font-semibold">Sign in</p>
        <p className="mt-1 text-sm text-mutedForeground">Continue with your email to get started.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleSignIn(); }}>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold text-mutedForeground">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <Button className="w-full" disabled={isSubmitting || !email.trim()} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">{error}</div>
      )}

      <p className="mt-5 text-center text-xs text-mutedForeground">
        Demo workspace data is preloaded for presentation
      </p>
    </Card>
  );
}
