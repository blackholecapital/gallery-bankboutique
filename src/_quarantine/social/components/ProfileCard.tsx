type ProfileCardProps = {
  displayName: string;
  bio: string;
  initials: string;
  role?: string;
  city?: string;
  tags?: string[];
  lookingFor?: string;
  avatar?: string;
  coverImage?: string;
  prompts?: string[];
  highlightLabel?: string;
  highlightValue?: string;
  featuredLevel?: 0 | 1 | 2;
  actions: React.ReactNode;
};

const featuredCardClass: Record<number, string> = {
  0: 'border-primary/25 shadow-md',
  1: 'border-accent/30 shadow-md',
  2: 'border-border shadow-sm'
};

export function ProfileCard({
  displayName,
  bio,
  initials,
  role,
  city,
  tags,
  lookingFor,
  avatar,
  coverImage,
  prompts,
  highlightLabel,
  highlightValue,
  featuredLevel,
  actions
}: ProfileCardProps) {
  const featuredClass = featuredLevel === undefined ? 'border-border shadow-sm' : featuredCardClass[featuredLevel];

  return (
    <div className={`overflow-hidden rounded-xl bg-surface transition duration-200 hover:-translate-y-0.5 ${featuredClass}`}>
      {coverImage && <img src={coverImage} alt={`${displayName} cover`} className="h-28 w-full object-cover object-center" />}
      <div className="p-5">
        <div className="flex items-start gap-3">
          {avatar ? (
            <img src={avatar} alt={displayName} className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{initials}</div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-foreground">{displayName}</h2>
            <p className="text-sm text-mutedForeground">{role ?? 'Artist'}{city ? ` · ${city}` : ''}</p>
            {tags && tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-mutedForeground">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-mutedForeground">{bio}</p>
        {lookingFor && <p className="mt-2 text-xs font-medium text-foreground">Looking for: <span className="font-normal text-mutedForeground">{lookingFor}</span></p>}

        {highlightLabel && highlightValue && (
          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{highlightLabel}</p>
            <p className="mt-1 text-sm text-mutedForeground">{highlightValue}</p>
          </div>
        )}

        {prompts && prompts.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {prompts.slice(0, 2).map((prompt) => (
              <p key={prompt} className="text-xs text-mutedForeground">• {prompt}</p>
            ))}
          </div>
        )}

        <div className="mt-4">{actions}</div>
      </div>
    </div>
  );
}
