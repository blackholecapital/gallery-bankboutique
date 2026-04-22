import type { Profile } from '@/domain/types/profile';
import type { UserId } from '@/domain/types/user';

export type ProfileCardView = {
  id: string;
  userId: UserId;
  title: string;
  subtitle: string;
  role?: string;
  city?: string;
  genreTags?: string[];
  lookingFor?: string;
  avatar?: string;
  coverImage?: string;
  prompts?: string[];
  recentProject?: string;
  availableFor?: string;
};

export function toProfileCardView(profile: Profile): ProfileCardView {
  return {
    id: profile.id,
    userId: profile.userId,
    title: profile.displayName,
    subtitle: profile.bio || 'No bio yet.',
    role: profile.role,
    city: profile.city,
    genreTags: profile.genreTags,
    lookingFor: profile.lookingFor,
    avatar: profile.avatar,
    coverImage: profile.coverImage,
    prompts: profile.prompts,
    recentProject: profile.recentProject,
    availableFor: profile.availableFor
  };
}

export function selectProfileByUserId(profiles: Profile[], userId: UserId): Profile | null {
  return profiles.find((profile) => profile.userId === userId) ?? null;
}
