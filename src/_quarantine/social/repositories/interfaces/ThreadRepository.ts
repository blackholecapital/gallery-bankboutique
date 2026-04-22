import type { Thread } from "../../domain/types/thread";
import type { UserId } from "../../domain/types/user";

export interface ThreadRepository {
  listByParticipant(userId: UserId): Promise<Thread[]>;
  save(thread: Thread): Promise<Thread>;
}
