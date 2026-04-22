import type { TextareaHTMLAttributes } from 'react';

export function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-mutedForeground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`.trim()}
      {...props}
    />
  );
}
