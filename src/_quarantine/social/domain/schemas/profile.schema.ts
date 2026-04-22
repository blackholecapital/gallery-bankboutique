import type { Profile } from '../types/profile';
import {
  requireIsoDateTime,
  requireRecord,
  requireString,
  requireStringArray,
  throwIfIssues
} from '../validators';

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) return undefined;
  return value.length > 0 ? value : undefined;
}

export const profileSchema = {
  parse(input: unknown): Profile {
    const record = requireRecord(input, 'Profile');
    const issues: string[] = [];

    const entity: Profile = {
      id: requireString(record.id, 'Profile.id', issues),
      userId: requireString(record.userId, 'Profile.userId', issues),
      createdAt: requireIsoDateTime(record.createdAt, 'Profile.createdAt', issues),
      updatedAt: requireIsoDateTime(record.updatedAt, 'Profile.updatedAt', issues),
      displayName: requireString(record.displayName, 'Profile.displayName', issues),
      bio: requireString(record.bio, 'Profile.bio', issues),
      role: optionalString(record.role),
      genreTags: optionalStringArray(record.genreTags),
      city: optionalString(record.city),
      lookingFor: optionalString(record.lookingFor),
      avatar: optionalString(record.avatar),
      coverImage: optionalString(record.coverImage),
      prompts: optionalStringArray(record.prompts),
      recentProject: optionalString(record.recentProject),
      availableFor: optionalString(record.availableFor)
    };

    if (record.genreTags !== undefined && entity.genreTags === undefined) {
      requireStringArray(record.genreTags, 'Profile.genreTags', issues);
    }

    if (record.prompts !== undefined && entity.prompts === undefined) {
      requireStringArray(record.prompts, 'Profile.prompts', issues);
    }

    throwIfIssues(issues);
    return entity;
  },

  parseMany(input: unknown[]): Profile[] {
    return input.map((item) => this.parse(item));
  }
};
