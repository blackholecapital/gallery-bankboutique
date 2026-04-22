import { useState } from 'react';
import { interactionRepository, threadRepository } from '@/app/providers/repositories';
import { interactionKindLabel } from '@/entities/interaction/interactionView';
import type { InteractionKind } from '@/domain/types/interaction';
import type { UserId } from '@/domain/types/user';

type InteractionActionsProps = {
  actorUserId: UserId;
  targetUserId: UserId;
};

export function InteractionActions({ actorUserId, targetUserId }: InteractionActionsProps) {
  const [status, setStatus] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const [isSaving, setSaving] = useState(false);

  const saveInteraction = async (kind: InteractionKind) => {
    setSaving(true);
    setStatus(null);
    const now = new Date().toISOString();

    try {
      await interactionRepository.save({
        id: crypto.randomUUID(),
        actorUserId,
        targetUserId,
        kind,
        createdAt: now,
        updatedAt: now
      });

      if (kind === 'match') {
        const actorThreads = await threadRepository.listByParticipant(actorUserId);
        const existingThread = actorThreads.find((thread) =>
          thread.participantIds.includes(targetUserId)
        );

        await threadRepository.save(
          existingThread
            ? { ...existingThread, updatedAt: now, lastMessagePreview: 'Conversation reopened.' }
            : {
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
                participantIds: [actorUserId, targetUserId],
                lastMessagePreview: 'New conversation started.'
              }
        );
      }

      setStatus({ message: `${interactionKindLabel(kind)} sent!`, kind: 'success' });
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Unable to save interaction.',
        kind: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          disabled={isSaving}
          onClick={() => saveInteraction('pass')}
          className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold text-mutedForeground transition hover:bg-muted disabled:opacity-50"
        >
          Skip
        </button>
        <button
          disabled={isSaving}
          onClick={() => saveInteraction('like')}
          className="flex-1 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
        >
          Connect
        </button>
        <button
          disabled={isSaving}
          onClick={() => saveInteraction('match')}
          className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
        >
          Message
        </button>
      </div>
      {status && (
        <p className={`mt-2 text-center text-xs font-medium ${
          status.kind === 'success' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
