import type { UserId } from './user';

export type ProfileId = string;

export interface Profile {
  id: ProfileId;
  userId: UserId;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  bio: string;
  role?: string;
  genreTags?: string[];
  city?: string;
  lookingFor?: string;
  avatar?: string;
  coverImage?: string;
  prompts?: string[];
  recentProject?: string;
  availableFor?: string;
}
