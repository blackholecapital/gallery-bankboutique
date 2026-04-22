import { profileSchema } from "../../domain/schemas/profile.schema";
import type { Profile } from "../../domain/types/profile";
import type { UserId } from "../../domain/types/user";
import { db } from "../../lib/db/client";
import type { ProfileRepository } from "../interfaces/ProfileRepository";

export class LocalProfileRepository implements ProfileRepository {
  async getByUserId(userId: UserId): Promise<Profile | null> {
    const profile = await db.profiles.where("userId").equals(userId).first();
    return profile ? profileSchema.parse(profile) : null;
  }

  async save(profile: Profile): Promise<Profile> {
    const entity = profileSchema.parse(profile);
    await db.profiles.put(entity);
    return entity;
  }

  async list(): Promise<Profile[]> {
    const profiles = await db.profiles.toArray();
    return profileSchema.parseMany(profiles);
  }
}
