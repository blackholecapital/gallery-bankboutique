import type { UserId } from "./user";

export type ThreadId = string;

export interface Thread {
  id: ThreadId;
  createdAt: string;
  updatedAt: string;
  participantIds: UserId[];
  lastMessagePreview: string;
}
