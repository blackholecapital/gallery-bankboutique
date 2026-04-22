type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-[280px] flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-mutedForeground">{description}</p>
    </div>
  );
}
