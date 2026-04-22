import type { PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`rounded-[1.75rem] border border-white/50 bg-white/75 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.08),0_8px_28px_-6px_rgba(37,99,235,0.12)] backdrop-blur-[2px] ${className}`.trim()}>
      {children}
    </section>
  );
}
