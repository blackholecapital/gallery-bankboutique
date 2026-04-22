import type { SelectHTMLAttributes } from 'react';

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2 ${className}`.trim()}
      {...props}
    />
  );
}
