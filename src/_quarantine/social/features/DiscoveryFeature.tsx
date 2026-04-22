import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { profileRepository } from '@/app/providers/repositories';
import { Spinner } from '@/components/primitives/Spinner';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { ProfileCard } from '@/components/composites/ProfileCard';
import { InteractionActions } from '@/features/interactions/InteractionActions';
import { toProfileCardView } from '@/entities/profile/profileView';
import { routePaths } from '@/routes/paths';
import type { Profile } from '@/domain/types/profile';

export function DiscoveryFeature() {
  const { currentUser } = useAppStore();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await profileRepository.list();
        if (isMounted) setProfiles(items);
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Could not load profiles.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => { isMounted = false; };
  }, []);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center px-4 pb-24 pt-12 text-center">
        <Card>
          <p className="text-xl font-semibold">Discover artists</p>
          <p className="mt-2 text-sm text-mutedForeground">Sign in to start connecting with artists.</p>
          <Button onClick={() => navigate(routePaths.login)} className="mt-5 w-full">Sign in</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;

  if (error) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Something went wrong</p>
          <p className="mt-1 text-sm text-mutedForeground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full">Retry</Button>
        </Card>
      </div>
    );
  }

  const candidates = profiles.filter((p) => p.userId !== currentUser.id).map(toProfileCardView);
  const featured = candidates[0];

  if (candidates.length === 0) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl text-primary">?</span>
          </div>
          <p className="mt-4 text-base font-semibold">No artists yet</p>
          <p className="mt-1 text-sm text-mutedForeground">You're the first one here. More artists will show up soon.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-24 pt-5">
      <div>
        <p className="text-xs font-semibold text-mutedForeground">Discover</p>
        <h1 className="mt-1 text-lg font-semibold">Recommended collaborators</h1>
      </div>

      {featured && (
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-0">
          {featured.coverImage && <img src={featured.coverImage} alt={`${featured.title} feature`} className="h-24 w-full object-cover" />}
          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Featured collaborator</p>
            <p className="mt-1 text-base font-semibold">{featured.title}</p>
            <p className="text-sm text-mutedForeground">{featured.role ?? 'Artist'}{featured.city ? ` · ${featured.city}` : ''}</p>
            <p className="mt-2 text-sm text-mutedForeground">{featured.subtitle}</p>
          </div>
        </Card>
      )}

      {candidates.map((c, index) => (
        <ProfileCard
          key={c.id}
          displayName={c.title}
          bio={c.subtitle}
          initials={c.title.slice(0, 2).toUpperCase()}
          role={c.role}
          city={c.city}
          tags={c.genreTags}
          lookingFor={c.lookingFor}
          avatar={c.avatar}
          coverImage={c.coverImage}
          prompts={c.prompts}
          highlightLabel={index < 3 ? (c.recentProject ? 'Recent project' : 'Available for') : undefined}
          highlightValue={index < 3 ? (c.recentProject ?? c.availableFor) : undefined}
          featuredLevel={index < 3 ? index as 0 | 1 | 2 : undefined}
          actions={<InteractionActions actorUserId={currentUser.id} targetUserId={c.userId} />}
        />
      ))}
    </div>
  );
}
