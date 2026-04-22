import type { Thread } from "../types/thread";
import {
  requireIsoDateTime,
  requireRecord,
  requireString,
  requireStringArray,
  throwIfIssues,
} from "../validators";

export const threadSchema = {
  parse(input: unknown): Thread {
    const record = requireRecord(input, "Thread");
    const issues: string[] = [];

    const entity: Thread = {
      id: requireString(record.id, "Thread.id", issues),
      createdAt: requireIsoDateTime(record.createdAt, "Thread.createdAt", issues),
      updatedAt: requireIsoDateTime(record.updatedAt, "Thread.updatedAt", issues),
      participantIds: requireStringArray(
        record.participantIds,
        "Thread.participantIds",
        issues,
      ),
      lastMessagePreview: requireString(
        record.lastMessagePreview,
        "Thread.lastMessagePreview",
        issues,
      ),
    };

    throwIfIssues(issues);
    return entity;
  },

  parseMany(input: unknown[]): Thread[] {
    return input.map((item) => this.parse(item));
  },
};
