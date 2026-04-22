import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { profileRepository } from '@/app/providers/repositories';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { Input } from '@/components/primitives/Input';
import { Spinner } from '@/components/primitives/Spinner';
import { TextArea } from '@/components/primitives/TextArea';
import { userInitials } from '@/entities/user/userView';
import { routePaths } from '@/routes/paths';
import type { Profile } from '@/domain/types/profile';

type SaveStatus = { message: string; kind: 'success' | 'error' } | null;

export function ProfileFeature() {
  const { currentUser } = useAppStore();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!currentUser) return;
      setLoading(true); setError(null);
      try {
        const profile = await profileRepository.getByUserId(currentUser.id);
        if (isMounted && profile) {
          setProfileData(profile);
          setDisplayName(profile.displayName);
          setBio(profile.bio);
        }
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Could not load profile.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => { isMounted = false; };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Sign in required</p>
          <p className="mt-1 text-sm text-mutedForeground">Sign in to view your profile.</p>
          <Button onClick={() => navigate(routePaths.login)} className="mt-4 w-full">Sign in</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;

  if (error) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Profile unavailable</p>
          <p className="mt-1 text-sm text-mutedForeground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full">Retry</Button>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true); setSaveStatus(null);
    try {
      const now = new Date().toISOString();
      const existing = await profileRepository.getByUserId(currentUser.id);
      const updated = {
        id: existing?.id ?? crypto.randomUUID(),
        userId: currentUser.id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        displayName: displayName.trim() || 'Unnamed Artist',
        bio: bio.trim(),
        role: existing?.role,
        city: existing?.city,
        genreTags: existing?.genreTags,
        lookingFor: existing?.lookingFor,
        avatar: existing?.avatar,
        coverImage: existing?.coverImage,
        prompts: existing?.prompts,
        recentProject: existing?.recentProject,
        availableFor: existing?.availableFor
      } satisfies Profile;
      await profileRepository.save(updated);
      setProfileData(updated);
      setSaveStatus({ message: 'Profile saved!', kind: 'success' });
    } catch (e) {
      setSaveStatus({ message: e instanceof Error ? e.message : 'Could not save.', kind: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-5">
      <p className="text-xs font-semibold text-mutedForeground">Profile</p>

      <Card className="overflow-hidden p-0">
        {profileData?.coverImage && <img src={profileData.coverImage} alt="Profile cover" className="h-32 w-full object-cover" />}
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-3">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-primary/10 text-xl font-bold text-primary shadow-sm">
              {profileData?.avatar ? <img src={profileData.avatar} alt={profileData.displayName} className="h-full w-full object-cover" /> : userInitials(currentUser)}
            </div>
            <div className="pb-2">
              <p className="text-lg font-semibold">{displayName || 'Unnamed Artist'}</p>
              <p className="text-xs text-mutedForeground">{profileData?.role ?? 'Artist'}{profileData?.city ? ` · ${profileData.city}` : ''}</p>
            </div>
          </div>
          {profileData?.genreTags && profileData.genreTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profileData.genreTags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-mutedForeground">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {(profileData?.recentProject || profileData?.availableFor || profileData?.lookingFor) && (
        <Card className="space-y-2.5">
          {profileData.recentProject && <p className="text-sm"><span className="font-semibold">Recent project:</span> <span className="text-mutedForeground">{profileData.recentProject}</span></p>}
          {profileData.availableFor && <p className="text-sm"><span className="font-semibold">Available for:</span> <span className="text-mutedForeground">{profileData.availableFor}</span></p>}
          {profileData.lookingFor && <p className="text-sm"><span className="font-semibold">Looking for:</span> <span className="text-mutedForeground">{profileData.lookingFor}</span></p>}
          {profileData.prompts && profileData.prompts.length > 0 && (
            <div className="pt-1">
              {profileData.prompts.slice(0, 2).map((prompt) => (
                <p key={prompt} className="text-xs text-mutedForeground">• {prompt}</p>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleSave(); }}>
          <div>
            <label htmlFor="pName" className="mb-2 block text-xs font-semibold text-mutedForeground">Display name</label>
            <Input id="pName" placeholder="Your display name" onChange={(e) => setDisplayName(e.target.value)} value={displayName} />
          </div>
          <div>
            <label htmlFor="pBio" className="mb-2 block text-xs font-semibold text-mutedForeground">Bio</label>
            <TextArea id="pBio" placeholder="Share something about your work." rows={3} onChange={(e) => setBio(e.target.value)} value={bio} />
          </div>

          {saveStatus && (
            <div className={`rounded-lg px-3 py-2 text-center text-sm font-medium ${
              saveStatus.kind === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {saveStatus.message}
            </div>
          )}

          <Button className="w-full" disabled={isSaving} type="submit">
            {isSaving ? 'Saving...' : 'Save profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
