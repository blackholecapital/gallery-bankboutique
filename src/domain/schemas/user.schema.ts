import type { User } from "../types/user";
import {
  requireBoolean,
  requireIsoDateTime,
  requireRecord,
  requireString,
  throwIfIssues,
} from "../validators";

export const userSchema = {
  parse(input: unknown): User {
    const record = requireRecord(input, "User");
    const issues: string[] = [];

    const entity: User = {
      id: requireString(record.id, "User.id", issues),
      createdAt: requireIsoDateTime(record.createdAt, "User.createdAt", issues),
      updatedAt: requireIsoDateTime(record.updatedAt, "User.updatedAt", issues),
      email: requireString(record.email, "User.email", issues),
      isOnboarded: requireBoolean(record.isOnboarded, "User.isOnboarded", issues),
    };

    throwIfIssues(issues);
    return entity;
  },

  parseMany(input: unknown[]): User[] {
    return input.map((item) => this.parse(item));
  },
};
