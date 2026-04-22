import type { Profile } from "../../domain/types/profile";
import type { UserId } from "../../domain/types/user";

export interface ProfileRepository {
  getByUserId(userId: UserId): Promise<Profile | null>;
  save(profile: Profile): Promise<Profile>;
  list(): Promise<Profile[]>;
}
