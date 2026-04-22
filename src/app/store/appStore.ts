import type { User } from '@/domain/types/user';

export type AppStoreState = {
  currentUser: User | null;
  isHydratingSession: boolean;
  setCurrentUser: (user: User | null) => void;
  setHydratingSession: (isHydratingSession: boolean) => void;
};
