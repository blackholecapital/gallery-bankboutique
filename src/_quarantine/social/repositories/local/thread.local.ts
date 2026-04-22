import { threadSchema } from "../../domain/schemas/thread.schema";
import type { Thread } from "../../domain/types/thread";
import type { UserId } from "../../domain/types/user";
import { db } from "../../lib/db/client";
import type { ThreadRepository } from "../interfaces/ThreadRepository";

export class LocalThreadRepository implements ThreadRepository {
  async listByParticipant(userId: UserId): Promise<Thread[]> {
    const threads = await db.threads
      .filter((thread) => thread.participantIds.includes(userId))
      .toArray();

    return threadSchema.parseMany(threads);
  }

  async save(thread: Thread): Promise<Thread> {
    const entity = threadSchema.parse(thread);
    await db.threads.put(entity);
    return entity;
  }
}
