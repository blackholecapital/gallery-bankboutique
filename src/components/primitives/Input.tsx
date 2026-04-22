import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-mutedForeground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`.trim()}
      {...props}
    />
  );
}
