import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
}>;

export function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/30 bg-white/40 p-4 shadow-md">
        <h2 className="mb-3 text-lg font-semibold">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
