import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/app/providers/StoreProvider';
import { profileRepository, threadRepository } from '@/app/providers/repositories';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { Input } from '@/components/primitives/Input';
import { Spinner } from '@/components/primitives/Spinner';
import { ChatBubble, ChatLayout, ChatMessages, ChatInputBar } from '@/components/composites/ChatLayout';
import { routePaths } from '@/routes/paths';
import type { Profile } from '@/domain/types/profile';
import type { Thread } from '@/domain/types/thread';

function formatThreadTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function InboxFeature() {
  const { currentUser } = useAppStore();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!currentUser) { setLoading(false); return; }
      setLoading(true); setError(null);
      try {
        const [items, allProfiles] = await Promise.all([
          threadRepository.listByParticipant(currentUser.id),
          profileRepository.list()
        ]);
        if (isMounted) {
          setThreads(items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
          setProfiles(allProfiles);
          if (!selectedThreadId && items[0]) setSelectedThreadId(items[0].id);
        }
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Could not load threads.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void load();
    return () => { isMounted = false; };
  }, [currentUser, selectedThreadId]);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  const threadViews = useMemo(() => {
    if (!currentUser) return [];
    return threads.map((thread, index) => {
      const partnerId = thread.participantIds.find((id) => id !== currentUser.id) ?? thread.participantIds[0];
      const partnerProfile = profiles.find((profile) => profile.userId === partnerId);
      return {
        ...thread,
        partnerName: partnerProfile?.displayName ?? 'Artist',
        partnerRole: partnerProfile?.role ?? 'Collaborator',
        partnerAvatar: partnerProfile?.avatar,
        timeLabel: formatThreadTime(thread.updatedAt),
        isUnread: index < 2
      };
    });
  }, [currentUser, profiles, threads]);

  const selectedThreadView = threadViews.find((thread) => thread.id === selectedThreadId) ?? null;

  const handleSendReply = async () => {
    if (!selectedThread || !replyText.trim()) return;
    const now = new Date().toISOString();
    const updated = { ...selectedThread, updatedAt: now, lastMessagePreview: replyText.trim() };
    try {
      await threadRepository.save(updated);
      setThreads((cur) => cur.map((t) => (t.id === updated.id ? updated : t)));
      setReplyText('');
      setStatus({ message: 'Sent!', kind: 'success' });
    } catch {
      setStatus({ message: 'Failed to send.', kind: 'error' });
    }
  };

  if (!currentUser) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Sign in to view inbox</p>
          <p className="mt-1 text-sm text-mutedForeground">Your conversations will appear here.</p>
          <Button onClick={() => navigate(routePaths.login)} className="mt-4 w-full">Sign in</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;

  if (error) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <p className="text-base font-semibold">Inbox unavailable</p>
          <p className="mt-1 text-sm text-mutedForeground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full">Retry</Button>
        </Card>
      </div>
    );
  }

  if (threadViews.length === 0) {
    return (
      <div className="px-4 pb-24 pt-8">
        <Card className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <p className="mt-3 text-base font-semibold">No conversations yet</p>
          <p className="mt-1 text-sm text-mutedForeground">Start a conversation from discover.</p>
          <Button onClick={() => navigate(routePaths.discovery)} className="mt-4 w-full">Discover artists</Button>
        </Card>
      </div>
    );
  }

  if (selectedThread && selectedThreadView) {
    return (
      <ChatLayout>
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
          <button
            onClick={() => { setSelectedThreadId(null); setStatus(null); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-mutedForeground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          {selectedThreadView.partnerAvatar ? (
            <img src={selectedThreadView.partnerAvatar} alt={selectedThreadView.partnerName} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {selectedThreadView.partnerName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{selectedThreadView.partnerName}</p>
            <p className="truncate text-xs text-mutedForeground">{selectedThreadView.partnerRole}</p>
          </div>
          <span className="text-[11px] font-medium text-mutedForeground">{selectedThreadView.timeLabel}</span>
        </div>

        <ChatMessages>
          <ChatBubble text={selectedThread.lastMessagePreview} timestamp={selectedThreadView.timeLabel} isOwn={false} />
          {status?.kind === 'success' && <ChatBubble text="Message sent" isOwn timestamp="Just now" />}
        </ChatMessages>

        <ChatInputBar>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void handleSendReply(); }}>
            <Input className="flex-1" onChange={(e) => setReplyText(e.target.value)} placeholder="Type a reply..." value={replyText} />
            <Button className="px-4" disabled={!replyText.trim()} type="submit">Send</Button>
          </form>
          {status?.kind === 'error' && <p className="mt-1 text-center text-xs text-red-600">{status.message}</p>}
        </ChatInputBar>
      </ChatLayout>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-24 pt-5">
      <div>
        <p className="text-xs font-semibold text-mutedForeground">Inbox</p>
        <h1 className="mt-1 text-lg font-semibold">Active collaborations</h1>
      </div>
      <Card className="divide-y divide-border p-0">
        {threadViews.map((item) => (
          <button
            key={item.id}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition duration-200 hover:bg-muted/80"
            onClick={() => { setSelectedThreadId(item.id); setStatus(null); }}
          >
            <div className="relative">
              {item.partnerAvatar ? (
                <img src={item.partnerAvatar} alt={item.partnerName} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {item.partnerName.slice(0, 2).toUpperCase()}
                </div>
              )}
              {item.isUnread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{item.partnerName}</p>
                <p className="text-[11px] text-mutedForeground">{item.timeLabel}</p>
              </div>
              <p className="truncate text-xs text-mutedForeground">{item.lastMessagePreview}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-mutedForeground"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </Card>
    </div>
  );
}
