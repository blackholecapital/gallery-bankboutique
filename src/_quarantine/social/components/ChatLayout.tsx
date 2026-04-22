import type { PropsWithChildren } from 'react';

type BubbleProps = {
  text: string;
  timestamp?: string;
  isOwn?: boolean;
};

export function ChatBubble({ text, timestamp, isOwn }: BubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl border px-3.5 py-2.5 text-sm ${
          isOwn
            ? 'rounded-br-md border-primary/30 bg-gradient-to-r from-primary to-accent text-white'
            : 'rounded-bl-md border-border bg-surface text-foreground shadow-sm'
        }`}
      >
        <p>{text}</p>
        {timestamp && <p className={`mt-1 text-[10px] ${isOwn ? 'text-white/70' : 'text-mutedForeground'}`}>{timestamp}</p>}
      </div>
    </div>
  );
}

export function ChatLayout({ children }: PropsWithChildren) {
  return <div className="flex h-full flex-col bg-muted">{children}</div>;
}

export function ChatMessages({ children }: PropsWithChildren) {
  return <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">{children}</div>;
}

export function ChatInputBar({ children }: PropsWithChildren) {
  return <div className="border-t border-border bg-surface p-3">{children}</div>;
}
