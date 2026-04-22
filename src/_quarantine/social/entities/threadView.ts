import type { Thread } from '@/domain/types/thread';

export type ThreadListItemView = {
  id: string;
  lastMessagePreview: string;
  participantCount: number;
};

export function toThreadListItemView(thread: Thread): ThreadListItemView {
  return {
    id: thread.id,
    lastMessagePreview: thread.lastMessagePreview,
    participantCount: thread.participantIds.length
  };
}
